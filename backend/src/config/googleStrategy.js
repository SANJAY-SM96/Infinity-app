const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

// Export callback URL for debugging
let exportedCallbackURL = null;
let exportedCallbackSource = null;

// Function to get callback URL (can be called externally)
function getCallbackURL() {
  return {
    callbackURL: exportedCallbackURL,
    source: exportedCallbackSource,
    isConfigured: !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET)
  };
}

module.exports = function(passport) {
  // Only initialize Google OAuth if credentials are provided
  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    // Determine callback URL based on environment
    // Google OAuth REQUIRES exact callback URL matching - must be explicit in production
    // Priority: BACKEND_URL env var (REQUIRED in production) > relative URL (dev only)
    let callbackURL = '/api/auth/google/callback';
    let callbackSource = 'relative (dev only)';
    
    // PRODUCTION: Must use explicit BACKEND_URL for Google OAuth to work
    if (process.env.NODE_ENV === 'production') {
      if (process.env.BACKEND_URL) {
        // Remove trailing slash if present
        const backendUrl = process.env.BACKEND_URL.replace(/\/$/, '');
        callbackURL = `${backendUrl}/api/auth/google/callback`;
        callbackSource = 'BACKEND_URL env var (production)';
        console.log(`🔗 Google OAuth Callback URL (${callbackSource}): ${callbackURL}`);
        console.log(`   ✅ Make sure this exact URL is registered in Google Cloud Console`);
      } else {
        // Production without BACKEND_URL - try to construct from common patterns
        // This is a fallback - BACKEND_URL should always be set in production
        const host = process.env.HOST || 'localhost';
        const protocol = process.env.PROTOCOL || 'https';
        const port = process.env.PORT || '5000';
        
        // Try to detect from environment or use default production URL
        if (host !== 'localhost' && !host.includes('localhost')) {
          callbackURL = `${protocol}://${host}/api/auth/google/callback`;
          callbackSource = 'auto-detected from HOST (production)';
        } else {
          // Last resort: construct from PORT and common patterns
          // This is not recommended - BACKEND_URL should always be set
          const port = process.env.PORT || '';
          const protocol = port === '443' || !port ? 'https' : 'http';
          callbackURL = `${protocol}://${host}${port && port !== '80' && port !== '443' ? `:${port}` : ''}/api/auth/google/callback`;
          callbackSource = 'constructed from HOST/PORT (fallback)';
          if (process.env.NODE_ENV === 'development') {
            console.log(`   ⚠️  WARNING: Using fallback URL construction - BACKEND_URL env var should be set!`);
          }
        }
        
        if (process.env.NODE_ENV === 'development') {
          console.log(`🔗 Google OAuth Callback URL (${callbackSource}): ${callbackURL}`);
          console.log(`   ⚠️  WARNING: BACKEND_URL env var not set! Using fallback: ${callbackURL}`);
          console.log(`   ⚠️  Set BACKEND_URL env var to your actual backend URL for reliability`);
        } else {
          console.log(`🔗 Google OAuth Callback URL: ${callbackURL}`);
          console.log(`   ⚠️  WARNING: BACKEND_URL env var not set in production!`);
        }
        console.log(`   ✅ Make sure this exact URL is registered in Google Cloud Console`);
      }
    } else {
      // DEVELOPMENT: Can use relative URL or explicit localhost
      if (process.env.BACKEND_URL) {
        const backendUrl = process.env.BACKEND_URL.replace(/\/$/, '');
        callbackURL = `${backendUrl}/api/auth/google/callback`;
        callbackSource = 'BACKEND_URL env var (dev)';
        console.log(`🔗 Google OAuth Callback URL (${callbackSource}): ${callbackURL}`);
      } else {
        // Development default: localhost
        const devPort = process.env.PORT || '5000';
        callbackURL = `http://localhost:${devPort}/api/auth/google/callback`;
        callbackSource = 'localhost (dev)';
        console.log(`🔗 Google OAuth Callback URL (${callbackSource}): ${callbackURL}`);
        console.log(`   ✅ Make sure this exact URL is registered in Google Cloud Console`);
      }
    }
    
    // Store callback URL for external access
    exportedCallbackURL = callbackURL;
    exportedCallbackSource = callbackSource;
    
    // Google OAuth REQUIRES exact callback URL matching
    // In production, we must use explicit absolute URL (no proxy resolution)
    // In development, we can use proxy:true for flexibility
    const useProxy = process.env.NODE_ENV !== 'production';
    
    passport.use(
      new GoogleStrategy(
        {
          clientID: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          callbackURL: callbackURL,
          proxy: useProxy, // Only use proxy in development
          // In production: use explicit BACKEND_URL (proxy:false)
          // In development: can use proxy:true for localhost flexibility
        },
        async (accessToken, refreshToken, profile, done) => {
          try {
            const email = profile.emails[0].value;
            
            // First, check if user exists with this googleId
            let user = await User.findOne({ googleId: profile.id });

            if (user) {
              // User already exists with this Google ID
              done(null, user);
            } else {
              // Check if user exists with this email (but different auth method)
              const existingUser = await User.findOne({ email: email.toLowerCase() });
              
              if (existingUser) {
                // User exists with this email - link the Google account
                existingUser.googleId = profile.id;
                if (profile.photos && profile.photos[0]) {
                  existingUser.avatar = profile.photos[0].value;
                }
                if (!existingUser.name && profile.displayName) {
                  existingUser.name = profile.displayName;
                }
                await existingUser.save();
                done(null, existingUser);
              } else {
                // New user - create account
                const newUser = {
                  googleId: profile.id,
                  name: profile.displayName,
                  email: email.toLowerCase(),
                  avatar: profile.photos && profile.photos[0] ? profile.photos[0].value : null,
                  userType: 'customer' // Default, will be updated in callback if registration
                };

                user = await User.create(newUser);
                done(null, user);
              }
            }
          } catch (err) {
            if (process.env.NODE_ENV === 'development') {
              console.error('Google OAuth error:', err);
            }
            // Handle duplicate email error more gracefully
            if (err.code === 11000) {
              // Duplicate key error - try to find existing user
              try {
                const email = profile.emails[0].value;
                const existingUser = await User.findOne({ email: email.toLowerCase() });
                if (existingUser) {
                  // Link Google account to existing user
                  existingUser.googleId = profile.id;
                  if (profile.photos && profile.photos[0]) {
                    existingUser.avatar = profile.photos[0].value;
                  }
                  await existingUser.save();
                  done(null, existingUser);
                } else {
                  done(err, null);
                }
              } catch (linkErr) {
                done(linkErr, null);
              }
            } else {
              done(err, null);
            }
          }
        }
      )
    );
    console.log('✅ Google OAuth strategy initialized');
  } else {
    if (process.env.NODE_ENV === 'development') {
      console.warn('⚠️  Google OAuth credentials not found. Google OAuth will be disabled.');
      console.warn('   Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to enable Google OAuth.');
    }
  }

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => done(err, user));
  });
};

// Export the getCallbackURL function
module.exports.getCallbackURL = getCallbackURL;