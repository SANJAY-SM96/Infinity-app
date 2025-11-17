const mongoose = require('mongoose');
const slugify = require('slugify');
const { generateTags, slugifyTag } = require('../utils/tagGenerator');

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
    tags: {
      type: [String],
      default: [],
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
      enum: ['INR'],
      default: 'INR'
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
    demoUrl: {
      type: String,
      default: null,
      trim: true
    },
    sourceCode: {
      type: String,
      required: [true, 'Source code is required (upload ZIP file or provide link)'],
      trim: true
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

// Generate tags before saving
productSchema.pre('save', async function(next) {
  // Generate tags if title, description, or techStack changed
  if (this.isModified('title') || this.isModified('description') || 
      this.isModified('techStack') || this.isModified('category') ||
      this.isModified('features') || !this.tags || this.tags.length === 0) {
    try {
      this.tags = generateTags({
        title: this.title,
        description: this.description,
        techStack: this.techStack || [],
        category: this.category || '',
        features: this.features || [],
        country: 'IN' // Default to India
      });
    } catch (error) {
      console.error('Error generating tags:', error);
      // Don't fail save if tag generation fails
    }
  }

  // Generate optimized slug if title changed
  if (this.isModified('title')) {
    // Use improved slugify that removes stop words
    const { slugify: improvedSlugify } = require('../utils/slugify');
    this.slug = improvedSlugify(this.title, { removeStopWords: true });
    
    // Ensure slug is not empty
    if (!this.slug && this.title) {
      // Fallback to standard slugify if improved version produces empty slug
      this.slug = slugify(this.title, { lower: true, strict: true });
    }
  }
  
  next();
});

// Text index for search (includes tags for better searchability)
productSchema.index({ title: 'text', description: 'text', brand: 'text', tags: 'text' });
productSchema.index({ category: 1 });
productSchema.index({ tags: 1 }); // Index tags for filtering
productSchema.index({ createdAt: -1 });
productSchema.index({ slug: 1 }); // Ensure slug is indexed for fast lookups

module.exports = mongoose.model('Product', productSchema);
