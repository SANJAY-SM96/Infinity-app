const express = require('express');
const { register, loginUser, getProfile, updateProfile, changePassword, forgotPassword, resetPassword, googleAuth, googleAuthCallback, getGoogleOAuthConfig } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { registerValidation, loginValidation, validateRequest } = require('../middleware/validateRequest');

const router = express.Router();

// Logging middleware for debugging
const logRequest = (req, res, next) => {
  if (process.env.NODE_ENV === 'development') {
    console.log('\n[Auth Route] Incoming Request:');
    console.log('  Method:', req.method);
    console.log('  Path:', req.path);
    console.log('  Original URL:', req.originalUrl);
    console.log('  Body:', JSON.stringify(req.body, null, 2));
    console.log('  Headers:', {
      'content-type': req.headers['content-type'],
      'authorization': req.headers['authorization'] ? 'Bearer ***' : 'none'
    });
  }
  next();
};

router.post('/register', logRequest, registerValidation, validateRequest, register);
router.post('/login', logRequest, loginValidation, validateRequest, loginUser);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.post('/change-password', protect, changePassword);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:resettoken', resetPassword);

// Google OAuth routes
router.get('/google', googleAuth);
router.get('/google/callback', googleAuthCallback);
router.get('/google/config', getGoogleOAuthConfig); // Debug endpoint

module.exports = router;
