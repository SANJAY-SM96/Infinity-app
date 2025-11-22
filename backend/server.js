require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const path = require('path');
const fs = require('fs');
const { errorHandler } = require('./src/middleware/errorHandler');
const connectDB = require('./src/config/db');

// OAuth Configuration Diagnostic
console.log('\n🔍 Google OAuth Configuration Check:');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID ? `✅ Set (${process.env.GOOGLE_CLIENT_ID.substring(0, 30)}...)` : '❌ MISSING');
console.log('GOOGLE_CLIENT_SECRET:', process.env.GOOGLE_CLIENT_SECRET ? `✅ Set (${process.env.GOOGLE_CLIENT_SECRET.substring(0, 10)}...)` : '❌ MISSING');
if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  console.log('⚠️  WARNING: Google OAuth will be disabled without these credentials!');
}
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

const app = express();

// Trust proxy configuration - SAFE settings to prevent IP spoofing
// Only trust local/private networks and known proxies (Cloudflare, Render, Railway, etc.)
// NEVER use 'trust proxy: true' in production as it allows IP spoofing

if (process.env.NODE_ENV === 'development') {
  // Local development: Disable trust proxy (direct connection, no proxy)
  app.set('trust proxy', 0);
  console.log('🔒 Trust proxy disabled (local development)');
  console.log('   ✅ Direct connection - no proxy needed');
} else if (process.env.TRUST_PROXY !== undefined) {
  // Production: Use environment variable if explicitly set
  const trustProxyValue = process.env.TRUST_PROXY;

  if (trustProxyValue === '0' || trustProxyValue === 'false') {
    app.set('trust proxy', false);
    console.log('🔒 Trust proxy disabled (explicitly set)');
  } else if (trustProxyValue === '1' || trustProxyValue === 'true') {
    // Only trust loopback, link-local, and unique-local addresses
    // This prevents IP spoofing while allowing legitimate proxy headers
    app.set('trust proxy', 'loopback, linklocal, uniquelocal');
    console.log('🔒 Trust proxy enabled (safe mode: loopback, linklocal, uniquelocal)');
    console.log('   ✅ Only trusts local/private networks - prevents IP spoofing');
  } else if (!isNaN(parseInt(trustProxyValue))) {
    // Numeric value: trust N hops (e.g., 1 for single proxy)
    app.set('trust proxy', parseInt(trustProxyValue));
    console.log(`🔒 Trust proxy set to ${parseInt(trustProxyValue)} hop(s)`);
  } else {
    // Custom trusted proxy list (comma-separated IPs/subnets)
    app.set('trust proxy', trustProxyValue);
    console.log(`🔒 Trust proxy set to custom: ${trustProxyValue}`);
  }
} else {
  // Production default: Trust only local/private networks (safe default)
  // This works with Cloudflare, Render, Railway, Nginx, Caddy, etc.
  app.set('trust proxy', 'loopback, linklocal, uniquelocal');
  console.log('🔒 Trust proxy enabled (production safe default)');
  console.log('   ✅ Only trusts local/private networks - prevents IP spoofing');
  console.log('   💡 Set TRUST_PROXY env var to customize (0, 1, or IP list)');
}

// Connect to MongoDB
connectDB();

// Passport middleware
require('./src/config/googleStrategy')(passport);
app.use(passport.initialize());

// CORS Configuration - MUST be before other middleware
const corsOptions = {
  origin: function (origin, callback) {
    // Define allowed origins
    const allowedOrigins = [
      'https://www.infinitywebtechnology.com',
      'https://infinitywebtechnology.com',
      'https://infinity-app-rn91.onrender.com',
      'https://infinity-apps.onrender.com',
      'http://localhost:3000',
      'http://localhost:5173'
    ];

    // Add CLIENT_URL from environment if provided
    if (process.env.CLIENT_URL) {
      const envOrigins = process.env.CLIENT_URL.split(',').map(url => url.trim());
      envOrigins.forEach(url => {
        if (allowedOrigins.indexOf(url) === -1) {
          allowedOrigins.push(url);
        }
      });
    }

    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) {
      return callback(null, true);
    }

    // In development, allow any localhost origin
    if (process.env.NODE_ENV === 'development') {
      if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
        return callback(null, true);
      }
    }

    // Check if origin is allowed (case-insensitive comparison)
    const originLower = origin.toLowerCase();
    const isAllowed = allowedOrigins.some(allowed => allowed.toLowerCase() === originLower);

    // Log for debugging (only in development)
    if (process.env.NODE_ENV === 'development') {
      console.log(`CORS check - Origin: ${origin}, Allowed: ${isAllowed}`);
    }

    if (isAllowed) {
      callback(null, true);
    } else {
      if (process.env.NODE_ENV === 'development') {
        console.warn(`CORS blocked origin: ${origin}. Allowed origins: ${allowedOrigins.join(', ')}`);
      }
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin', 'Access-Control-Request-Method', 'Access-Control-Request-Headers'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  preflightContinue: false,
  optionsSuccessStatus: 204,
  maxAge: 86400 // 24 hours - cache preflight requests
};

app.use(cors(corsOptions));

// Security Middleware - Configure helmet to work with CORS
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https:"],
      frameSrc: ["'self'", "https:"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  },
  frameguard: {
    action: 'deny'
  }
}));

// Additional Security Headers
app.use((req, res, next) => {
  // Force HTTPS redirect in production (but NOT for API routes or localhost)
  // API routes should return JSON, not redirects
  const host = req.header('host') || '';
  const isLocalhost = host.includes('localhost') || host.includes('127.0.0.1') || host.includes('::1');

  if (process.env.NODE_ENV === 'production' &&
    !req.path.startsWith('/api') &&
    !req.path.startsWith('/health') &&
    !isLocalhost &&
    req.header('x-forwarded-proto') !== 'https') {
    return res.redirect(`https://${host}${req.url}`);
  }

  // X-Frame-Options (already set by helmet, but explicit for clarity)
  res.setHeader('X-Frame-Options', 'DENY');

  // X-Content-Type-Options
  res.setHeader('X-Content-Type-Options', 'nosniff');

  // Referrer-Policy
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Permissions-Policy
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');

  next();
});
app.use(compression());
app.use(cookieParser());

// Body Parser Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Rate Limiting - Disabled in development, enabled in production
// Check NODE_ENV (defaults to 'development' if not set)
const nodeEnv = process.env.NODE_ENV || 'development';

if (nodeEnv === 'production') {
  // Safe IP extraction for rate limiting
  // req.ip is safe when trust proxy is configured correctly
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: {
      success: false,
      message: 'Too many requests from this IP, please try again later.'
    },
    standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
    legacyHeaders: false, // Disable `X-RateLimit-*` headers
    // Safe keyGenerator: Uses req.ip which is validated by trust proxy settings
    keyGenerator: (req) => {
      // req.ip is safe because we only trust specific proxies
      // Fallback to connection remoteAddress if ip is not available
      const clientIP = req.ip || req.connection?.remoteAddress || req.socket?.remoteAddress || 'unknown';

      // Sanitize IP address (remove port if present, handle IPv6)
      let sanitizedIP = clientIP;
      if (clientIP.includes(':')) {
        // IPv6 or IPv4 with port
        const parts = clientIP.split(':');
        if (parts.length === 2 && !clientIP.includes('::')) {
          // IPv4 with port (e.g., "127.0.0.1:12345")
          sanitizedIP = parts[0];
        } else {
          // IPv6 - use as is (express-rate-limit handles IPv6)
          sanitizedIP = clientIP.split('%')[0]; // Remove zone index if present
        }
      }

      // Log for debugging (only if explicitly enabled)
      if (process.env.LOG_RATE_LIMIT === 'true' && process.env.NODE_ENV === 'development') {
        console.log(`Rate limit key: ${sanitizedIP} (from ${req.ip || 'direct'})`);
      }

      return sanitizedIP;
    },
    skip: (req) => {
      // Skip rate limiting for health checks and localhost
      const clientIP = req.ip || req.connection?.remoteAddress || 'unknown';
      const isLocalhost = clientIP === '::1' || clientIP === '127.0.0.1' || clientIP.includes('127.0.0.1');
      return req.path === '/health' || req.path === '/api' || isLocalhost;
    },
    // Custom handler for rate limit exceeded
    handler: (req, res) => {
      res.status(429).json({
        success: false,
        message: 'Too many requests from this IP, please try again later.',
        retryAfter: Math.ceil(req.rateLimit.resetTime / 1000)
      });
    }
  });

  app.use('/api/', limiter);
  console.log('✅ Rate limiting enabled (production mode)');
  console.log('   🔒 Safe IP extraction configured');
  console.log('   📊 100 requests per 15 minutes per IP');
} else {
  console.log('⚠️  Rate limiting DISABLED (development mode)');
  console.log(`   NODE_ENV: ${nodeEnv}`);
  console.log('   All API requests are allowed without rate limiting');
}

// Health Check
app.get('/health', (req, res) => {
  res.json({ status: 'Server is running', timestamp: new Date() });
});

// Diagnostic endpoint to check frontend serving status
app.get('/api/diagnostics/frontend', (req, res) => {
  const frontendPath = process.env.FRONTEND_PATH || path.join(__dirname, '../frontend/dist');
  const resolvedFrontendPath = path.resolve(frontendPath);
  const indexPath = path.join(resolvedFrontendPath, 'index.html');

  const diagnostics = {
    nodeEnv: process.env.NODE_ENV || 'not set',
    serveFrontend: process.env.SERVE_FRONTEND || 'not set',
    frontendPath: frontendPath,
    resolvedFrontendPath: resolvedFrontendPath,
    frontendDirExists: fs.existsSync(resolvedFrontendPath),
    indexHtmlExists: fs.existsSync(indexPath),
    willServeFrontend: process.env.SERVE_FRONTEND !== 'false' && (process.env.NODE_ENV === 'production' || fs.existsSync(resolvedFrontendPath))
  };

  res.json(diagnostics);
});

// Root API endpoint
app.get('/api', (req, res) => {
  res.json({
    success: true,
    message: 'Infinity App API is running',
    version: '1.0.0',
    timestamp: new Date(),
    endpoints: {
      auth: '/api/auth',
      products: '/api/products',
      cart: '/api/cart',
      orders: '/api/orders',
      payments: '/api/payments',
      admin: '/api/admin',
      ai: '/api/ai',
      projectRequests: '/api/project-requests',
      blogs: '/api/blogs',
      seo: '/api/seo',
      seoContent: '/api/seo-content'
    }
  });
});

// Serve uploaded files
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', require('./src/routes/auth'));
app.use('/api/users', require('./src/routes/users'));
app.use('/api/products', require('./src/routes/products'));
app.use('/api/cart', require('./src/routes/cart'));
app.use('/api/orders', require('./src/routes/orders'));
app.use('/api/payments', require('./src/routes/payments'));
app.use('/api/admin', require('./src/routes/admin'));
app.use('/api/ai', require('./src/routes/ai'));
app.use('/api/project-requests', require('./src/routes/projectRequests'));
app.use('/api/blogs', require('./src/routes/blogs'));
app.use('/api/seo', require('./src/routes/seo'));
app.use('/api/seo-content', require('./src/routes/seoContent'));

// Serve frontend static files (only in production or if FRONTEND_PATH is set)
const frontendPath = process.env.FRONTEND_PATH || path.join(__dirname, '../frontend/dist');
const resolvedFrontendPath = path.resolve(frontendPath);
const isProduction = process.env.NODE_ENV === 'production';
const frontendExists = fs.existsSync(resolvedFrontendPath);
const indexPath = frontendExists ? path.join(resolvedFrontendPath, 'index.html') : null;
const indexHtmlExists = indexPath && fs.existsSync(indexPath);

// Determine if we should serve frontend
// Serve if: (production mode) OR (frontend exists) AND (not explicitly disabled)
const serveFrontend = process.env.SERVE_FRONTEND !== 'false' && (isProduction || frontendExists);

// Log status
console.log('\n📦 Frontend Serving Status:');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log(`NODE_ENV: ${process.env.NODE_ENV || 'not set'}`);
console.log(`SERVE_FRONTEND: ${process.env.SERVE_FRONTEND || 'not set (default: auto)'}`);
console.log(`Frontend Path: ${resolvedFrontendPath}`);
console.log(`Directory Exists: ${frontendExists ? '✅' : '❌'}`);
console.log(`index.html Exists: ${indexHtmlExists ? '✅' : '❌'}`);
console.log(`Will Serve Frontend: ${serveFrontend && indexHtmlExists ? '✅ YES' : '❌ NO'}`);

if (serveFrontend && indexHtmlExists) {
  console.log(`\n✅ Serving frontend from: ${resolvedFrontendPath}\n`);

  // Serve static files from frontend dist
  app.use(express.static(resolvedFrontendPath, {
    maxAge: '1y', // Cache static assets for 1 year
    etag: true,
    lastModified: true,
    index: false // Don't serve index.html for directory requests, we'll handle it explicitly
  }));

  // SPA fallback: serve index.html for all non-API routes
  // This must be after all API routes but before the 404 handler
  // Handle all HTTP methods to support client-side routing
  app.all('*', (req, res, next) => {
    // Skip API routes, uploads, health check, and diagnostics
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads') || req.path === '/health') {
      return next();
    }

    // For non-GET requests to non-API routes, return 404 (these should go to API)
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      return res.status(404).json({
        message: 'Route not found',
        hint: 'Non-GET requests should be sent to /api/* endpoints'
      });
    }

    // Serve index.html for all GET/HEAD requests (SPA routing)
    res.sendFile(path.resolve(indexPath));
  });
} else {
  if (!isProduction) {
    console.log('\n⚠️  Frontend serving disabled (development mode)');
    console.log('   Frontend should be served by Vite dev server on port 3000\n');
  } else if (!frontendExists) {
    console.log('\n❌ Frontend build directory not found!');
    console.log(`   Expected at: ${resolvedFrontendPath}`);
    console.log('   To fix: cd frontend && npm install && npm run build\n');
  } else if (!indexHtmlExists) {
    console.log('\n❌ Frontend index.html not found!');
    console.log(`   Expected at: ${indexPath}`);
    console.log('   To fix: cd frontend && npm install && npm run build\n');
  } else {
    console.log('\n⚠️  Frontend serving disabled (SERVE_FRONTEND=false)\n');
  }
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

// 404 Handler for API routes only (if frontend is not being served)
// Only add this handler if we're not serving the frontend
if (!serveFrontend || !indexHtmlExists) {
  app.use((req, res) => {
    // Only handle API routes with 404 JSON response
    if (req.path.startsWith('/api')) {
      res.status(404).json({ message: 'Route not found' });
    } else {
      // For non-API routes when frontend is not served, provide helpful message
      res.status(404).json({
        message: 'Route not found. Frontend is not being served from this server.',
        hint: 'If you want to serve the frontend, set SERVE_FRONTEND=true and build the frontend.'
      });
    }
  });
} else {
  // When serving frontend, only handle API 404s
  app.use((req, res, next) => {
    if (req.path.startsWith('/api')) {
      res.status(404).json({ message: 'API route not found' });
    } else {
      // Let the SPA handle other routes
      next();
    }
  });
}

// Error Handler (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT} in ${nodeEnv} mode`);
  console.log(`📊 Rate limiting: ${nodeEnv === 'production' ? 'ENABLED' : 'DISABLED'}`);
});
