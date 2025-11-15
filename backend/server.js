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
const { errorHandler } = require('./src/middleware/errorHandler');
const connectDB = require('./src/config/db');

const app = express();

// Connect to MongoDB
connectDB();

// Passport middleware
require('./src/config/googleStrategy')(passport);
app.use(passport.initialize());

// Security Middleware
app.use(helmet());
app.use(compression());
app.use(cookieParser());

// Body Parser Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// CORS Configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // In development, allow any localhost origin
    if (process.env.NODE_ENV === 'development') {
      if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
        return callback(null, true);
      }
    }
    
    // In production, use CLIENT_URL from environment
    let allowedOrigins = process.env.CLIENT_URL 
      ? process.env.CLIENT_URL.split(',').map(url => url.trim())
      : [
          'https://infinity-app-rn91.onrender.com',
          'https://infinity-apps.onrender.com', 
          'http://localhost:3000',
          'http://localhost:5173'
        ];
    
    // Always include the known frontend URLs even if CLIENT_URL is set
    const knownFrontendUrls = [
      'https://infinity-app-rn91.onrender.com',
      'https://infinity-apps.onrender.com'
    ];
    knownFrontendUrls.forEach(url => {
      if (allowedOrigins.indexOf(url) === -1) {
        allowedOrigins.push(url);
      }
    });
    
    // Log for debugging
    console.log(`CORS check - Origin: ${origin}, Allowed: ${allowedOrigins.join(', ')}`);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.warn(`CORS blocked origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  preflightContinue: false,
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Rate Limiting - Disabled in development, enabled in production
// Check NODE_ENV (defaults to 'development' if not set)
const nodeEnv = process.env.NODE_ENV || 'development';

if (nodeEnv === 'production') {
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => {
      // Skip rate limiting for health checks
      return req.path === '/health';
    }
  });
  app.use('/api/', limiter);
  console.log('✅ Rate limiting enabled (production mode)');
} else {
  console.log('⚠️  Rate limiting DISABLED (development mode)');
  console.log(`   NODE_ENV: ${nodeEnv}`);
  console.log('   All API requests are allowed without rate limiting');
}

// Health Check
app.get('/health', (req, res) => {
  res.json({ status: 'Server is running', timestamp: new Date() });
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
      projectRequests: '/api/project-requests'
    }
  });
});

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

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error Handler (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT} in ${nodeEnv} mode`);
  console.log(`📊 Rate limiting: ${nodeEnv === 'production' ? 'ENABLED' : 'DISABLED'}`);
});
