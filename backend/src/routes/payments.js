const express = require('express');
const {
  createPaymentIntent,
  confirmPayment,
  handleStripeWebhook,
  getRazorpayKey,
  createRazorpayOrder,
  verifyRazorpayPayment,
  handleRazorpayWebhook
} = require('../controllers/paymentController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Stripe routes
router.post('/stripe/create-payment-intent', protect, createPaymentIntent);
router.post('/stripe/confirm-payment', protect, confirmPayment);
router.post('/stripe/webhook', express.raw({ type: 'application/json' }), handleStripeWebhook);

// Razorpay routes
router.get('/razorpay/key', getRazorpayKey);
router.post('/razorpay/create-order', protect, createRazorpayOrder);
router.post('/razorpay/verify-payment', protect, verifyRazorpayPayment);
router.post('/razorpay/webhook', express.json(), handleRazorpayWebhook);

module.exports = router;
