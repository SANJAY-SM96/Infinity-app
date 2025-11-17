const mongoose = require('mongoose');

const projectRequestSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false // Allow anonymous requests
    },
    name: {
      type: String,
      required: [true, 'Please provide your name'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Please provide your email'],
      lowercase: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please add a valid email']
    },
    phone: {
      type: String,
      trim: true
    },
    projectTitle: {
      type: String,
      required: [true, 'Please provide a project title'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Please describe your project requirements'],
      trim: true
    },
    domain: {
      type: String,
      required: [true, 'Please specify the domain'],
      trim: true
    },
    budget: {
      type: Number,
      required: [true, 'Please specify your budget'],
      min: [0, 'Budget must be positive']
    },
    currency: {
      type: String,
      enum: ['INR'],
      default: 'INR'
    },
    techStack: {
      type: [String],
      default: []
    },
    features: {
      type: [String],
      default: []
    },
    timeline: {
      type: String,
      trim: true
    },
    status: {
      type: String,
      enum: ['pending', 'reviewed', 'quoted', 'accepted', 'rejected', 'completed'],
      default: 'pending'
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium'
    },
    adminNotes: {
      type: String,
      trim: true
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    aiAnalysis: {
      type: mongoose.Schema.Types.Mixed,
      default: null
    }
  },
  { timestamps: true }
);

// Index for faster queries
projectRequestSchema.index({ status: 1 });
projectRequestSchema.index({ createdAt: -1 });
projectRequestSchema.index({ user: 1 });

module.exports = mongoose.model('ProjectRequest', projectRequestSchema);

