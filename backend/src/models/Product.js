const mongoose = require('mongoose');
const slugify = require('slugify');

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a title'],
      unique: true,
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters']
    },
    slug: {
      type: String,
      unique: true,
      index: true
    },
    description: {
      type: String,
      required: [true, 'Please add a description']
    },
    price: {
      type: Number,
      required: [true, 'Please add a price'],
      min: [0, 'Price must be positive']
    },
    priceINR: {
      type: Number,
      min: [0, 'Price must be positive']
    },
    currency: {
      type: String,
      enum: ['USD', 'INR', 'BOTH'],
      default: 'USD'
    },
    originalPrice: Number,
    originalPriceINR: Number,
    images: {
      type: [String],
      required: [true, 'Please add at least one image']
    },
    demoVideo: {
      type: String,
      default: null
    },
    techStack: {
      type: [String],
      default: []
    },
    productType: {
      type: String,
      enum: ['digital', 'physical', 'both'],
      default: 'digital'
    },
    category: {
      type: String,
      required: [true, 'Please add a category'],
      enum: [
        'React Projects',
        'Python Projects',
        'AI/ML Projects',
        'Full-Stack Web Apps',
        'Mini Projects',
        'Final-Year Projects',
        'SaaS Tools',
        'Node.js Projects',
        'Vue.js Projects',
        'Angular Projects',
        'Django Projects',
        'Flask Projects',
        'MERN Stack',
        'MEAN Stack',
        'Mobile Apps',
        'Other'
      ]
    },
    brand: String,
    stock: {
      type: Number,
      default: 0,
      min: 0
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    reviews: [
      {
        user: mongoose.Schema.Types.ObjectId,
        name: String,
        rating: Number,
        comment: String,
        createdAt: { type: Date, default: Date.now }
      }
    ],
    specifications: {
      type: Map,
      of: String
    },
    features: {
      type: [String],
      default: []
    },
    deliveryType: {
      type: String,
      enum: ['instant', 'custom', 'both'],
      default: 'instant'
    },
    deliveryTime: {
      type: String,
      default: 'Instant Download'
    },
    warranty: String,
    returnsPolicy: String,
    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

// Create slug before saving
productSchema.pre('save', function(next) {
  if (!this.isModified('title')) return next();
  this.slug = slugify(this.title, { lower: true, strict: true });
  next();
});

// Text index for search
productSchema.index({ title: 'text', description: 'text', brand: 'text' });
productSchema.index({ category: 1 });
productSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Product', productSchema);
