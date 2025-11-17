const mongoose = require('mongoose');
const { slugify } = require('../utils/slugify');

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    index: true
  },
  excerpt: {
    type: String,
    required: true,
    maxlength: 300
  },
  content: {
    type: String,
    required: true
  },
  featuredImage: {
    type: String,
    default: ''
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  authorName: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    index: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  metaTitle: {
    type: String,
    default: ''
  },
  metaDescription: {
    type: String,
    default: ''
  },
  keywords: [{
    type: String,
    trim: true
  }],
  seoScore: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  views: {
    type: Number,
    default: 0
  },
  readingTime: {
    type: Number,
    default: 0 // in minutes
  },
  isPublished: {
    type: Boolean,
    default: false,
    index: true
  },
  isFeatured: {
    type: Boolean,
    default: false,
    index: true
  },
  publishedAt: {
    type: Date
  },
  aiGenerated: {
    type: Boolean,
    default: false
  },
  aiPrompt: {
    type: String,
    default: ''
  },
  imagePrompt: {
    type: String,
    default: ''
  },
  imageSuggestions: [{
    type: String
  }],
  structuredData: {
    type: mongoose.Schema.Types.Mixed,
    default: null
  }
}, {
  timestamps: true
});

// Generate slug from title (backup - controller should always set it)
blogSchema.pre('save', function(next) {
  // Generate slug if it doesn't exist and title exists
  // This is a safety net - controller should always generate slug before saving
  if (this.title && !this.slug) {
    this.slug = slugify(this.title);
  }
  
  // Regenerate slug if title changed (but keep existing slug if title wasn't modified)
  if (this.isModified('title') && this.title) {
    this.slug = slugify(this.title);
  }
  
  // Calculate reading time (average 200 words per minute)
  if (this.content) {
    const wordCount = this.content.split(/\s+/).length;
    this.readingTime = Math.ceil(wordCount / 200);
  }
  
  next();
});

// Index for search
blogSchema.index({ title: 'text', content: 'text', excerpt: 'text', tags: 'text' });

module.exports = mongoose.model('Blog', blogSchema);

