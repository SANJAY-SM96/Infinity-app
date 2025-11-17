const crypto = require('crypto');
const passport = require('passport');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const sendEmail = require('../utils/sendEmail');

exports.register = async (req, res, next) => {
  try {
    const { name, email, password, userType } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already in use' });
    }

    // Create new user
    const user = await User.create({
      name,
      email,
      password,
      userType: userType || 'customer' // Default to customer if not specified
    });

    // Generate token
    const token = generateToken(user);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        userType: user.userType,
        avatar: user.avatar
      },
      token
    });
  } catch (error) {
    next(error);
  }
};


// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.loginUser = async (req, res, next) => {
  // Log request details for debugging
  if (process.env.NODE_ENV === 'development') {
    console.log('\n[Login Controller] Request received:');
    console.log('  Body:', JSON.stringify(req.body, null, 2));
    console.log('  Email:', req.body?.email || 'MISSING');
    console.log('  Password:', req.body?.password ? '***' : 'MISSING');
  }

  const { email, password } = req.body;

  // Validate that email and password are present
  if (!email || !password) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[Login Controller] Missing credentials:', { email: !!email, password: !!password });
    }
    return res.status(400).json({ 
      message: 'Email and password are required',
      received: {
        email: !!email,
        password: !!password
      }
    });
  }

  try {
    // Check for user
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = generateToken(user);

    res.json({
      success: true,
      message: 'Login successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        userType: user.userType,
        avatar: user.avatar
      },
      token
    });
  } catch (error) {
    next(error);
  }
};

exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({
      success: true,
      user
    });
  } catch (error) {
    next(error);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const { name, phone } = req.body;

    const updateData = {};
    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user
    });
  } catch (error) {
    next(error);
  }
};

exports.changePassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id).select('+password');

    const isPasswordMatch = await user.matchPassword(oldPassword);
    if (!isPasswordMatch) {
      return res.status(401).json({ message: 'Old password is incorrect' });
    }

    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Forgot password
// @route   POST /api/auth/forgotpassword
// @access  Public
exports.forgotPassword = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json({ message: 'There is no user with that email' });
    }

    // Get reset token
    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false });

    // Create reset URL
    const resetUrl = `${req.protocol}://${req.get(
      'host'
    )}/resetpassword/${resetToken}`;

    const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;

    try {
      await sendEmail({
        email: user.email,
        subject: 'Password reset token',
        message,
      });

      res.status(200).json({ success: true, data: 'Email sent' });
    } catch (err) {
      console.error(err);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;

      await user.save({ validateBeforeSave: false });

      return res.status(500).json({ message: 'Email could not be sent' });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Reset password
// @route   PUT /api/auth/resetpassword/:resettoken
// @access  Public
exports.resetPassword = async (req, res, next) => {
  try {
    // Get hashed token
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(req.params.resettoken)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid token' });
    }

    // Set new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    // Generate token
    const token = generateToken(user);

    res.json({
      success: true,
      message: 'Password reset successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar
      },
      token
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Google OAuth
// @route   GET /api/auth/google
// @access  Public
exports.googleAuth = (req, res, next) => {
  // Check if Google OAuth is configured
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    return res.status(503).json({
      success: false,
      message: 'Google OAuth is not configured. Please contact the administrator.'
    });
  }

  // Store userType and registration flag in state parameter
  const userType = req.query.userType || 'customer';
  const isRegistration = req.query.registration === 'true' || req.headers.referer?.includes('/register');
  const state = JSON.stringify({ userType, isRegistration });
  
  passport.authenticate('google', { 
    scope: ['profile', 'email'],
    state: Buffer.from(state).toString('base64') // Encode state as base64
  })(req, res, next);
};

// Helper function to get the frontend URL (handles comma-separated CLIENT_URL)
const getFrontendUrl = () => {
  if (process.env.CLIENT_URL) {
    // Handle comma-separated URLs - use the first one
    const urls = process.env.CLIENT_URL.split(',').map(url => url.trim());
    return urls[0]; // Use first URL as primary
  }
  // Default fallbacks based on environment
  if (process.env.NODE_ENV === 'production') {
    return 'https://www.infinitywebtechnology.com';
  }
  return 'http://localhost:5173'; // Default to Vite dev server
};

// @desc    Get Google OAuth configuration (debug endpoint)
// @route   GET /api/auth/google/config
// @access  Public
exports.getGoogleOAuthConfig = (req, res) => {
  const googleStrategy = require('../config/googleStrategy');
  const callbackInfo = googleStrategy.getCallbackURL ? googleStrategy.getCallbackURL() : null;
  
  if (!callbackInfo || !callbackInfo.isConfigured) {
    return res.status(503).json({
      success: false,
      message: 'Google OAuth is not configured',
      configured: false
    });
  }
  
  res.json({
    success: true,
    configured: true,
    callbackURL: callbackInfo.callbackURL,
    source: callbackInfo.source,
    instructions: [
      `1. Copy this exact callback URL: ${callbackInfo.callbackURL}`,
      '2. Go to Google Cloud Console: https://console.cloud.google.com/apis/credentials',
      '3. Find your OAuth 2.0 Client ID',
      '4. Click "Edit"',
      '5. Scroll to "Authorized redirect URIs"',
      `6. Add this URL: ${callbackInfo.callbackURL}`,
      '7. Click "SAVE"',
      '8. Wait 5-10 minutes for changes to propagate',
      '9. Try signing in again'
    ]
  });
};

// @desc    Google OAuth callback
// @route   GET /api/auth/google/callback
// @access  Public
exports.googleAuthCallback = (req, res, next) => {
  // Check if Google OAuth is configured
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    const frontendUrl = getFrontendUrl();
    return res.redirect(`${frontendUrl}/login?error=google_oauth_not_configured`);
  }

  let stateData = { userType: 'customer', isRegistration: false };
  
  // Decode state if provided
  if (req.query.state) {
    try {
      stateData = JSON.parse(Buffer.from(req.query.state, 'base64').toString());
    } catch (err) {
      console.error('Error decoding state:', err);
    }
  }
  
  const redirectPath = stateData.isRegistration ? '/register' : '/login';
  const frontendUrl = getFrontendUrl();
  
  // Get the configured callback URL for error messages
  const googleStrategy = require('../config/googleStrategy');
  const callbackInfo = googleStrategy.getCallbackURL ? googleStrategy.getCallbackURL() : null;
  const configuredCallbackURL = callbackInfo?.callbackURL || 'unknown';
  
  passport.authenticate('google', { failureRedirect: `${frontendUrl}${redirectPath}?error=google_auth_failed` }, async (err, user) => {
    if (err) {
      console.error('Google OAuth authentication error:', err);
      console.error(`Configured callback URL: ${configuredCallbackURL}`);
      
      // Handle specific OAuth errors
      let errorMessage = 'google_auth_failed';
      if (err.message?.includes('redirect_uri_mismatch')) {
        errorMessage = 'redirect_uri_mismatch';
        console.error(`❌ REDIRECT URI MISMATCH!`);
        console.error(`   Configured callback URL: ${configuredCallbackURL}`);
        console.error(`   This exact URL must be registered in Google Cloud Console`);
        console.error(`   Go to: https://console.cloud.google.com/apis/credentials`);
      } else if (err.message?.includes('deleted_client') || err.message?.includes('invalid_client')) {
        errorMessage = 'invalid_client';
      }
      
      // Include callback URL in error for debugging
      const errorParams = new URLSearchParams({
        error: errorMessage,
        callback_url: configuredCallbackURL
      });
      return res.redirect(`${frontendUrl}${redirectPath}?${errorParams.toString()}`);
    }
    if (!user) {
      return res.redirect(`${frontendUrl}${redirectPath}?error=google_auth_failed`);
    }

    // If this is a new user registration, update userType
    if (stateData.isRegistration && stateData.userType) {
      try {
        // Check if user was just created (no userType set or default customer)
        if (!user.userType || user.userType === 'customer') {
          user.userType = stateData.userType;
          await user.save();
        }
      } catch (err) {
        console.error('Error updating userType:', err);
      }
    }

    // Generate JWT token
    const token = generateToken(user);

    // Redirect to frontend with token
    res.redirect(`${frontendUrl}${redirectPath}?token=${token}`);
  })(req, res, next);
};

