const Stripe = require('stripe');
const Razorpay = require('razorpay');
const Order = require('../models/Order');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Stripe Payment Methods
exports.createPaymentIntent = async (req, res, next) => {
  try {
    const { total, orderId, currency = 'usd' } = req.body;

    if (!total || total <= 0) {
      return res.status(400).json({ message: 'Invalid amount' });
    }

    // Stripe supports multiple currencies
    const supportedCurrencies = ['usd', 'eur', 'gbp', 'inr', 'aud', 'cad', 'jpy', 'sgd'];
    const paymentCurrency = currency.toLowerCase();
    
    if (!supportedCurrencies.includes(paymentCurrency)) {
      return res.status(400).json({ message: 'Unsupported currency for Stripe' });
    }

    // Convert to smallest currency unit (cents for USD, paise for INR, etc.)
    const amount = paymentCurrency === 'inr' 
      ? Math.round(total * 100) // INR is already in smallest unit (paise)
      : Math.round(total * 100); // USD and others use cents

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
      currency: paymentCurrency
    });
  } catch (error) {
    next(error);
  }
};

exports.confirmPayment = async (req, res, next) => {
  try {
    const { orderId, paymentIntentId, provider, currency } = req.body;

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
        order.paymentInfo.currency = paymentIntent.currency.toUpperCase();
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
    const { total, orderId, currency = 'INR' } = req.body;

    if (!total || total <= 0) {
      return res.status(400).json({ message: 'Invalid amount' });
    }

    // Razorpay primarily supports INR
    if (currency !== 'INR') {
      return res.status(400).json({ message: 'Razorpay only supports INR currency' });
    }

    // Convert to paise (smallest unit for INR)
    const amount = Math.round(total * 100);

    const options = {
      amount: amount, // Amount in paise
      currency: 'INR',
      receipt: `order_${orderId}_${Date.now()}`,
      notes: {
        orderId: orderId,
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
    next(error);
  }
};

exports.verifyRazorpayPayment = async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

    const crypto = require('crypto');
    const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
    hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const generated_signature = hmac.digest('hex');

    if (generated_signature === razorpay_signature) {
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
        res.status(404).json({ message: 'Order not found' });
      }
    } else {
      res.status(400).json({
        success: false,
        message: 'Payment verification failed'
      });
    }
  } catch (error) {
    next(error);
  }
};

exports.handleRazorpayWebhook = async (req, res, next) => {
  try {
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
