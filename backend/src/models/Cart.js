const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  title: String,
  price: Number,
  image: String,
  quantity: {
    type: Number,
    default: 1,
    min: 1
  }
});

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },
    items: [cartItemSchema],
    total: {
      type: Number,
      default: 0
    },
    itemCount: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

// Calculate total before saving
cartSchema.pre('save', function(next) {
  this.total = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  this.itemCount = this.items.reduce((count, item) => count + item.quantity, 0);
  next();
});

module.exports = mongoose.model('Cart', cartSchema);
