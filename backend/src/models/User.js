const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters']
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
      lowercase: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please add a valid email']
    },
    password: {
      type: String,
      required: function() {
        // Password is required only if user is not signing in with Google (no googleId)
        return !this.googleId;
      },
      minlength: 6,
      select: false // Don't return password by default
    },
    avatar: {
      type: String,
      default: null
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
    },
    userType: {
      type: String,
      enum: ['student', 'customer'],
      default: 'customer'
    },
    addresses: [
      {
        label: { type: String, default: 'Home' },
        fullName: String,
        phone: String,
        line1: String,
        line2: String,
        city: String,
        state: String,
        postalCode: String,
        country: String,
        isDefault: { type: Boolean, default: false }
      }
    ],
    phone: String,
    isActive: { type: Boolean, default: true },
    isBanned: { type: Boolean, default: false },
    banReason: String,
    bannedAt: Date,
    bannedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    subscription: {
      plan: {
        type: String,
        enum: ['free', 'basic', 'premium', 'enterprise'],
        default: 'free'
      },
      status: {
        type: String,
        enum: ['active', 'cancelled', 'expired', 'suspended'],
        default: 'active'
      },
      startDate: Date,
      endDate: Date,
      autoRenew: { type: Boolean, default: false }
    },
    lastLogin: Date,
    resetPasswordToken: String,
    resetPasswordExpire: Date
  },
  { timestamps: true }
);

// Hash password before saving (only if password is provided)
userSchema.pre('save', async function(next) {
  // Skip password hashing if password is not modified or if user is OAuth-only (no password)
  if (!this.isModified('password') || !this.password) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

const crypto = require('crypto');

// Match password method
userSchema.methods.matchPassword = async function(enteredPassword) {
  // If user doesn't have a password (OAuth-only user), they can't login with password
  if (!this.password) {
    return false;
  }
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate and hash password reset token
userSchema.methods.getResetPasswordToken = function() {
  // Generate token
  const resetToken = crypto.randomBytes(20).toString('hex');

  // Hash token and set to resetPasswordToken field
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Set expire
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

  return resetToken;
};

// Index for faster email queries
userSchema.index({ email: 1 });

module.exports = mongoose.model('User', userSchema);
