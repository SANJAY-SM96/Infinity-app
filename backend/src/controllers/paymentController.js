const Stripe = require('stripe');
const Razorpay = require('razorpay');
const Order = require('../models/Order');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Initialize Razorpay only if keys are available
let razorpay = null;
if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
  });
}

// Stripe Payment Methods
exports.createPaymentIntent = async (req, res, next) => {
  try {
    const { total, orderId } = req.body;

    if (!total || total <= 0) {
      return res.status(400).json({ message: 'Invalid amount' });
    }

    // Only INR currency supported
    const paymentCurrency = 'inr';
    
    // Convert to smallest currency unit (paise for INR)
    const amount = Math.round(total * 100); // INR uses paise (100 paise = 1 rupee)

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: paymentCurrency,
      metadata: {
        userId: req.user._id.toString(),
        orderId: orderId || ''
      },
      automatic_payment_methods: {
        enabled: true
      }
    });

    res.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      currency: paymentCurrency.toUpperCase()
    });
  } catch (error) {
    next(error);
  }
};

exports.confirmPayment = async (req, res, next) => {
  try {
    const { orderId, paymentIntentId, provider } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (provider === 'stripe') {
      // Verify payment with Stripe
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

      if (paymentIntent.status === 'succeeded') {
        order.paymentInfo.provider = 'stripe';
        order.paymentInfo.transactionId = paymentIntentId;
        order.paymentInfo.paymentStatus = 'completed';
        order.paymentInfo.currency = 'INR';
        order.orderStatus = 'Confirmed';
        await order.save();

        res.json({
          success: true,
          message: 'Payment successful',
          order
        });
      } else {
        res.status(400).json({
          success: false,
          message: 'Payment not completed'
        });
      }
    } else if (provider === 'razorpay') {
      // Razorpay payment verification will be handled via webhook
      res.json({
        success: true,
        message: 'Payment verification pending'
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Invalid payment provider'
      });
    }
  } catch (error) {
    next(error);
  }
};

exports.handleStripeWebhook = async (req, res, next) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  try {
    const event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);

    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        const { userId, orderId } = paymentIntent.metadata;

        if (orderId) {
          const order = await Order.findById(orderId);
          if (order) {
            order.paymentInfo.transactionId = paymentIntent.id;
            order.paymentInfo.paymentStatus = 'completed';
            order.orderStatus = 'Confirmed';
            await order.save();
          }
        }
        break;

      case 'payment_intent.payment_failed':
        const failedPI = event.data.object;
        const { orderId: failedOrderId } = failedPI.metadata;

        if (failedOrderId) {
          const order = await Order.findById(failedOrderId);
          if (order) {
            order.paymentInfo.paymentStatus = 'failed';
            await order.save();
          }
        }
        break;
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(400).send(`Webhook Error: ${error.message}`);
  }
};

// Razorpay Payment Methods
exports.getRazorpayKey = async (req, res, next) => {
  try {
    if (!process.env.RAZORPAY_KEY_ID) {
      return res.status(500).json({
        success: false,
        message: 'Razorpay is not configured.'
      });
    }
    
    res.json({
      success: true,
      key: process.env.RAZORPAY_KEY_ID
    });
  } catch (error) {
    next(error);
  }
};

exports.createRazorpayOrder = async (req, res, next) => {
  try {
    // Check if Razorpay is configured
    if (!razorpay) {
      return res.status(500).json({
        success: false,
        message: 'Razorpay is not configured. Please contact support.'
      });
    }

    const { total, orderId, currency = 'INR' } = req.body;

    // Debug logging (remove in production)
    console.log('Razorpay order creation request:', { 
      total, 
      orderId, 
      currency,
      orderIdType: typeof orderId,
      totalType: typeof total
    });

    // Validate required fields
    if (total === undefined || total === null || total <= 0 || isNaN(total)) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid amount. Amount must be a positive number.',
        received: { total, type: typeof total }
      });
    }

    if (!orderId) {
      return res.status(400).json({ 
        success: false,
        message: 'Order ID is required.',
        received: { orderId, type: typeof orderId }
      });
    }

    // Razorpay primarily supports INR
    if (currency !== 'INR') {
      return res.status(400).json({ 
        success: false,
        message: 'Razorpay only supports INR currency' 
      });
    }

    // Convert to paise (smallest unit for INR)
    const amount = Math.round(total * 100);

    // Validate minimum amount (Razorpay requires minimum 1 INR = 100 paise)
    if (amount < 100) {
      return res.status(400).json({ 
        success: false,
        message: 'Minimum order amount is ₹1.00' 
      });
    }

    // Create a receipt ID that's max 40 characters (Razorpay requirement)
    // Format: ord_<truncated_orderId>_<timestamp_last6digits>
    const orderIdStr = orderId.toString();
    const timestamp = Date.now().toString().slice(-6); // Last 6 digits of timestamp
    const truncatedOrderId = orderIdStr.length > 20 ? orderIdStr.slice(-20) : orderIdStr;
    const receipt = `ord_${truncatedOrderId}_${timestamp}`.slice(0, 40); // Ensure max 40 chars

    const options = {
      amount: amount, // Amount in paise
      currency: 'INR',
      receipt: receipt,
      notes: {
        orderId: orderId.toString(),
        userId: req.user._id.toString()
      }
    };

    const razorpayOrder = await razorpay.orders.create(options);

    res.json({
      success: true,
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      key: process.env.RAZORPAY_KEY_ID
    });
  } catch (error) {
    console.error('Razorpay order creation error:', error);
    
    // Handle Razorpay API errors
    if (error.statusCode) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.error?.description || error.message || 'Failed to create Razorpay order',
        error: error.error
      });
    }
    
    // Handle other errors
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create payment order. Please try again.'
    });
  }
};

exports.verifyRazorpayPayment = async (req, res, next) => {
  try {
    if (!razorpay || !process.env.RAZORPAY_KEY_SECRET) {
      return res.status(500).json({
        success: false,
        message: 'Razorpay is not configured. Please contact support.'
      });
    }

    // Support both camelCase and snake_case field names
    const razorpay_order_id = req.body.razorpay_order_id || req.body.razorpayOrderId;
    const razorpay_payment_id = req.body.razorpay_payment_id || req.body.razorpayPaymentId;
    const razorpay_signature = req.body.razorpay_signature || req.body.razorpaySignature;
    const orderId = req.body.orderId;

    // Debug logging
    console.log('Razorpay verification request:', {
      hasOrderId: !!orderId,
      hasRazorpayOrderId: !!razorpay_order_id,
      hasRazorpayPaymentId: !!razorpay_payment_id,
      hasRazorpaySignature: !!razorpay_signature,
      bodyKeys: Object.keys(req.body)
    });

    // Validate required fields
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: 'Missing required payment verification fields',
        received: {
          razorpay_order_id: !!razorpay_order_id,
          razorpay_payment_id: !!razorpay_payment_id,
          razorpay_signature: !!razorpay_signature,
          orderId: !!orderId
        },
        body: req.body
      });
    }

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: 'Order ID is required',
        received: req.body
      });
    }

    const crypto = require('crypto');
    
    // Ensure we have the secret key
    if (!process.env.RAZORPAY_KEY_SECRET) {
      return res.status(500).json({
        success: false,
        message: 'Razorpay secret key is not configured'
      });
    }

    // Generate signature: HMAC SHA256 of order_id|payment_id
    // Trim secret key to remove any whitespace
    const secretKey = (process.env.RAZORPAY_KEY_SECRET || '').trim();
    
    // Ensure order_id and payment_id are strings and trimmed
    const orderIdStr = String(razorpay_order_id || '').trim();
    const paymentIdStr = String(razorpay_payment_id || '').trim();
    const signatureStr = String(razorpay_signature || '').trim();
    
    if (!orderIdStr || !paymentIdStr || !signatureStr) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment data: order_id, payment_id, and signature are required',
        received: {
          orderId: !!orderIdStr,
          paymentId: !!paymentIdStr,
          signature: !!signatureStr
        }
      });
    }

    // Create message for signature: order_id|payment_id
    const message = `${orderIdStr}|${paymentIdStr}`;
    const hmac = crypto.createHmac('sha256', secretKey);
    hmac.update(message);
    const generated_signature = hmac.digest('hex');

    // Debug signature comparison
    console.log('Signature verification details:', {
      message: message,
      orderId: orderIdStr,
      paymentId: paymentIdStr,
      receivedSignature: signatureStr.substring(0, 30) + '...',
      generatedSignature: generated_signature.substring(0, 30) + '...',
      exactMatch: generated_signature === signatureStr,
      receivedLength: signatureStr.length,
      generatedLength: generated_signature.length,
      secretKeyConfigured: !!secretKey,
      secretKeyLength: secretKey.length
    });

    // Compare signatures (case-sensitive as per Razorpay docs)
    // Also try to verify with Razorpay API as additional validation
    let signatureValid = false;
    
    // Primary verification: Compare generated signature with received signature
    if (generated_signature === signatureStr) {
      signatureValid = true;
    } else {
      // If exact match fails, try verifying with Razorpay API
      try {
        const payment = await razorpay.payments.fetch(paymentIdStr);
        if (payment && (payment.status === 'authorized' || payment.status === 'captured')) {
          // Payment exists and is valid, but signature doesn't match
          // This could be a secret key mismatch
          if (process.env.NODE_ENV === 'development') {
            console.warn('Payment exists in Razorpay but signature mismatch. Check secret key.');
            console.warn('Payment status:', payment.status, 'Payment ID:', payment.id);
          }
        }
      } catch (apiError) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Error verifying payment with Razorpay API:', apiError.message);
        }
      }
    }

    if (signatureValid) {
      const order = await Order.findById(orderId);
      if (order) {
        order.paymentInfo.provider = 'razorpay';
        order.paymentInfo.transactionId = razorpay_payment_id;
        order.paymentInfo.paymentStatus = 'completed';
        order.paymentInfo.currency = 'INR';
        order.orderStatus = 'Confirmed';
        await order.save();

        res.json({
          success: true,
          message: 'Payment verified and completed',
          order
        });
      } else {
        res.status(404).json({ 
          success: false,
          message: 'Order not found' 
        });
      }
    } else {
      // Signature mismatch - provide helpful error message
      console.error('Signature mismatch:', {
        received: signatureStr.substring(0, 30),
        generated: generated_signature.substring(0, 30),
        orderId: orderIdStr,
        paymentId: paymentIdStr,
        message: message
      });
      
      res.status(400).json({
        success: false,
        message: 'Payment verification failed: Invalid signature. Please ensure you are using the correct Razorpay secret key.',
        debug: process.env.NODE_ENV === 'development' ? {
          receivedSignatureLength: signatureStr.length,
          generatedSignatureLength: generated_signature.length,
          orderId: orderIdStr,
          paymentId: paymentIdStr,
          message: message,
          hint: 'Verify that RAZORPAY_KEY_SECRET in .env matches your Razorpay dashboard secret key'
        } : undefined
      });
    }
  } catch (error) {
    console.error('Razorpay payment verification error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Payment verification failed. Please try again.'
    });
  }
};

exports.handleRazorpayWebhook = async (req, res, next) => {
  try {
    if (!razorpay || !process.env.RAZORPAY_WEBHOOK_SECRET) {
      return res.status(500).json({
        success: false,
        message: 'Razorpay webhook is not configured.'
      });
    }

    const crypto = require('crypto');
    const signature = req.headers['x-razorpay-signature'];
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(JSON.stringify(req.body));
    const generated_signature = hmac.digest('hex');

    if (generated_signature === signature) {
      const event = req.body.event;
      const payment = req.body.payload.payment.entity;

      if (event === 'payment.captured' || event === 'payment.authorized') {
        const orderId = payment.notes?.orderId;
        if (orderId) {
          const order = await Order.findById(orderId);
          if (order) {
            order.paymentInfo.provider = 'razorpay';
            order.paymentInfo.transactionId = payment.id;
            order.paymentInfo.paymentStatus = 'completed';
            order.paymentInfo.currency = payment.currency.toUpperCase();
            order.orderStatus = 'Confirmed';
            await order.save();
          }
        }
      }

      res.json({ received: true });
    } else {
      res.status(400).json({ message: 'Invalid signature' });
    }
  } catch (error) {
    console.error('Razorpay webhook error:', error);
    next(error);
  }
};
