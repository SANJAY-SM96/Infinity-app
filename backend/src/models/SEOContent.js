const mongoose = require('mongoose');

const seoContentSchema = new mongoose.Schema(
  {
    pageType: {
      type: String,
      enum: ['home', 'product', 'blog', 'category', 'about', 'contact', 'custom'],
      required: true
    },
    pagePath: {
      type: String,
      required: true,
      unique: true
    },
    pageTitle: {
      type: String,
      required: true
    },
    metaDescription: {
      type: String,
      required: true,
      maxlength: 160
    },
    metaKeywords: [String],
    h1: String,
    h2: [String],
    content: {
      type: String,
      required: true
    },
    structuredData: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    ogTags: {
      title: String,
      description: String,
      image: String,
      type: { type: String, default: 'website' }
    },
    twitterTags: {
      card: { type: String, default: 'summary_large_image' },
      title: String,
      description: String,
      image: String
    },
    canonicalUrl: String,
    robots: {
      type: String,
      default: 'index, follow'
    },
    sitemapPriority: {
      type: Number,
      default: 0.5,
      min: 0,
      max: 1
    },
    sitemapChangeFreq: {
      type: String,
      enum: ['always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never'],
      default: 'weekly'
    },
    isActive: {
      type: Boolean,
      default: true
    },
    lastUpdated: {
      type: Date,
      default: Date.now
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  { timestamps: true }
);

// Index for faster queries
seoContentSchema.index({ pagePath: 1 });
seoContentSchema.index({ pageType: 1 });
seoContentSchema.index({ isActive: 1 });

module.exports = mongoose.model('SEOContent', seoContentSchema);

