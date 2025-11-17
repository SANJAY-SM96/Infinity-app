const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  },
  title: String,
  price: Number,
  quantity: Number,
  image: String
});

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    items: [orderItemSchema],
    shippingInfo: {
      fullName: String,
      phone: String,
      line1: String,
      line2: String,
      city: String,
      state: String,
      postalCode: String,
      country: String
    },
    paymentInfo: {
      provider: {
        type: String,
        enum: ['stripe', 'razorpay', 'cod'],
        default: 'stripe'
      },
      transactionId: String,
      paymentStatus: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending'
      },
      currency: {
        type: String,
        enum: ['INR'],
        default: 'INR'
      }
    },
    subtotal: Number,
    tax: {
      type: Number,
      default: 0
    },
    shippingCost: {
      type: Number,
      default: 0
    },
    total: Number,
    orderStatus: {
      type: String,
      enum: ['Processing', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'],
      default: 'Processing'
    },
    trackingNumber: String,
    notes: String
  },
  { timestamps: true }
);

// Index for faster queries
orderSchema.index({ user: 1 });
orderSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Order', orderSchema);
