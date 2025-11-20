import axios from 'axios';

// Determine API URL based on environment
const getApiUrl = () => {
  // Check if we're running on localhost (development)
  const isLocalhost = window.location.hostname === 'localhost' || 
                      window.location.hostname === '127.0.0.1' ||
                      window.location.hostname === '';
  
  // In development mode, use Vite proxy (relative URL)
  // This avoids CORS issues and SSL/protocol problems
  if (import.meta.env.DEV && isLocalhost) {
    // Use relative URL to leverage Vite proxy configured in vite.config.js
    // The proxy forwards /api/* to http://localhost:5000/api/*
    const apiUrl = '/api';
    if (import.meta.env.DEV) {
      console.log('[API Client] Using Vite proxy for API (relative URL):', apiUrl);
      console.log('[API Client] Requests will be proxied to http://localhost:5000/api');
    }
    return apiUrl;
  }
  
  // If in dev mode but not localhost (e.g., network access), use full URL
  if (import.meta.env.DEV && !isLocalhost) {
    const apiUrl = 'http://localhost:5000/api';
    if (import.meta.env.DEV) {
      console.log('[API Client] Using development API URL (non-localhost):', apiUrl);
    }
    return apiUrl;
  }
  
  // In production, use VITE_API_URL if set, otherwise use default production URL
  if (import.meta.env.PROD) {
    const envUrl = import.meta.env.VITE_API_URL;
    if (envUrl) {
      // Ensure the URL is complete and ends with /api
      let url = envUrl.trim();
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        // If no protocol, default to https
        url = `https://${url}`;
      }
      if (!url.endsWith('/api')) {
        url = url.endsWith('/') ? `${url}api` : `${url}/api`;
      }
      // Only log in development
      if (import.meta.env.DEV) {
        console.log('[API Client] Using production API URL from env:', url);
      }
      return url;
    }
    const prodUrl = 'https://www.api.infinitywebtechnology.com/api';
    // Only log in development
    if (import.meta.env.DEV) {
      console.log('[API Client] Using default production API URL:', prodUrl);
    }
    return prodUrl;
  }
  
  // Fallback: use local backend
  const fallbackUrl = 'http://localhost:5000/api';
  if (import.meta.env.DEV) {
    console.warn('[API Client] Using fallback API URL:', fallbackUrl);
  }
  return fallbackUrl;
};

// Get and validate the API URL
const apiBaseURL = getApiUrl();

// Validate that we have a proper URL
// Allow relative URLs (for Vite proxy) or absolute URLs
if (!apiBaseURL || 
    (!apiBaseURL.startsWith('http') && !apiBaseURL.startsWith('/'))) {
  if (import.meta.env.DEV) {
    console.error('[API Client] Invalid API URL:', apiBaseURL);
  }
  throw new Error(`Invalid API base URL: ${apiBaseURL}. Please check your environment configuration.`);
}

// Development mode check: Warn if accessing page via HTTPS when using Vite proxy
if (import.meta.env.DEV && apiBaseURL.startsWith('/')) {
  const isLocalhost = window.location.hostname === 'localhost' || 
                      window.location.hostname === '127.0.0.1';
  
  if (isLocalhost && window.location.protocol === 'https:') {
    console.warn('[API Client] ⚠️ WARNING: Page accessed via HTTPS on localhost');
    console.warn('[API Client] This can cause SSL errors when making API requests.');
    console.warn('[API Client] 💡 Solution: Access the app via http://localhost:3000 (not https://)');
    console.warn('[API Client] If your browser forces HTTPS, clear HSTS settings for localhost');
  }
  
  // Check if we're accessing via Vite dev server (port 3000 or 5173)
  const vitePorts = ['3000', '5173'];
  const currentPort = window.location.port;
  if (isLocalhost && currentPort && !vitePorts.includes(currentPort)) {
    console.warn('[API Client] ⚠️ WARNING: Not accessing via Vite dev server');
    console.warn('[API Client] Current port:', currentPort);
    console.warn('[API Client] Expected ports:', vitePorts.join(' or '));
    console.warn('[API Client] 💡 Solution: Make sure Vite dev server is running and access via http://localhost:3000');
  }
}

const api = axios.create({
  baseURL: apiBaseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  // Prevent axios from automatically resolving URLs incorrectly
  validateStatus: function (status) {
    return status >= 200 && status < 300; // default
  },
  // Ensure JSON data is properly serialized
  // Axios should handle this automatically, but we ensure it works correctly
  transformRequest: [(data, headers) => {
    // For JSON requests, ensure objects are stringified
    if (data && typeof data === 'object' && !(data instanceof FormData) && !(data instanceof URLSearchParams)) {
      // Check if Content-Type is or will be application/json
      const contentType = headers['Content-Type'] || headers['content-type'];
      if (!contentType || contentType.includes('application/json')) {
        return JSON.stringify(data);
      }
    }
    return data;
  }],
});

// Request interceptor to add JWT token and log requests in development
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Ensure Content-Type is set for POST/PUT/PATCH requests with data
    if ((config.method === 'post' || config.method === 'put' || config.method === 'patch') && config.data) {
      // Only set Content-Type if not already set or if it's not multipart/form-data
      if (!config.headers['Content-Type'] || config.headers['Content-Type'] === 'application/json') {
        config.headers['Content-Type'] = 'application/json';
      }
    }
    
    // CRITICAL FIX: Ensure relative URLs stay relative
    // If baseURL is relative (/api) and we're in dev mode on localhost,
    // force it to stay relative even if page is accessed via HTTPS
    if (import.meta.env.DEV && apiBaseURL.startsWith('/')) {
      const isLocalhost = window.location.hostname === 'localhost' || 
                          window.location.hostname === '127.0.0.1';
      
      if (isLocalhost) {
        // Ensure baseURL stays relative - don't let axios resolve it
        // If config.baseURL was somehow changed to absolute, reset it
        if (config.baseURL && !config.baseURL.startsWith('/') && config.baseURL.includes('localhost')) {
          console.warn('[API Client] ⚠️ Detected absolute localhost URL, forcing relative URL for Vite proxy');
          config.baseURL = apiBaseURL; // Reset to relative
        }
        
        // If the page is accessed via HTTPS but we need to use Vite proxy,
        // ensure the URL stays relative so Vite can proxy it to HTTP backend
        if (window.location.protocol === 'https:' && config.baseURL.startsWith('/')) {
          // This is correct - relative URL will be resolved relative to current origin
          // Vite proxy will intercept it before it reaches the network
          // No action needed, but log for debugging
          if (import.meta.env.DEV) {
            console.log('[API Client] Page accessed via HTTPS, using relative URL for Vite proxy:', config.baseURL + config.url);
          }
        }
      }
    }
    
    // Note: We now use Vite proxy (relative URLs) in development for better CORS handling
    // The interceptor below handles logging and header management
    
    // Log request details in development
    if (import.meta.env.DEV) {
      // Calculate what the final URL will be
      // After our interceptor, baseURL might be empty and url contains the full relative path
      let fullUrl;
      if (config.baseURL && config.baseURL.startsWith('http')) {
        // Absolute URL
        fullUrl = config.baseURL.endsWith('/') 
          ? `${config.baseURL}${config.url.replace(/^\//, '')}`
          : `${config.baseURL}${config.url}`;
      } else if (config.baseURL && config.baseURL.startsWith('/')) {
        // Relative URL - will be resolved by browser relative to current origin
        // Vite proxy should intercept this before it reaches the network
        fullUrl = config.baseURL.endsWith('/')
          ? `${config.baseURL}${config.url.replace(/^\//, '')}`
          : `${config.baseURL}${config.url}`;
      } else {
        // baseURL is empty (we combined it with url), so url is the full path
        fullUrl = config.url;
      }
      
      // Warn if we detect HTTPS being used for localhost (this shouldn't happen with proxy)
      if (fullUrl.includes('https://localhost') || fullUrl.includes('https://127.0.0.1')) {
        console.error('[API Client] ⚠️ ERROR: Request is using HTTPS for localhost!');
        console.error('[API Client] This means the Vite proxy is NOT working correctly.');
        console.error('[API Client] Full URL:', fullUrl);
        console.error('[API Client] Base URL:', config.baseURL);
        console.error('[API Client] Request URL:', config.url);
        console.error('[API Client] Current page protocol:', window.location.protocol);
        console.error('[API Client] Current page URL:', window.location.href);
        console.error('[API Client]');
        console.error('[API Client] 🔧 Solutions:');
        console.error('[API Client] 1. Make sure Vite dev server is running on port 3000');
        console.error('[API Client] 2. Access the app via http://localhost:3000 (not https://)');
        console.error('[API Client] 3. Clear browser cache and HSTS settings');
        console.error('[API Client] 4. Restart the Vite dev server');
        console.error('[API Client] 5. Check browser extensions that might force HTTPS');
        
        // Force relative URL as last resort
        if (config.baseURL && config.baseURL.startsWith('http')) {
          console.warn('[API Client] Attempting to fix by forcing relative URL');
          config.baseURL = '/api';
        }
      }
      
      console.log('[API Client] Request:', {
        method: config.method?.toUpperCase(),
        url: fullUrl,
        baseURL: config.baseURL,
        path: config.url,
        isRelative: fullUrl.startsWith('/'),
        currentPage: window.location.href,
        currentProtocol: window.location.protocol,
        headers: {
          'Content-Type': config.headers['Content-Type'],
          'Accept': config.headers['Accept'],
          'Authorization': config.headers['Authorization'] ? 'Bearer ***' : 'none'
        },
        data: config.data ? (typeof config.data === 'object' ? JSON.stringify(config.data) : config.data) : 'none'
      });
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Retry configuration for rate-limited requests
const MAX_RETRIES = 3;
const RETRY_DELAY_BASE = 1000; // 1 second base delay

// Helper function to calculate exponential backoff delay
const getRetryDelay = (attempt) => {
  return RETRY_DELAY_BASE * Math.pow(2, attempt);
};

// Helper function to sleep
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle SSL/protocol errors
    if (error.code === 'ERR_SSL_PROTOCOL_ERROR' || 
        error.message?.includes('ERR_SSL_PROTOCOL_ERROR') ||
        error.message?.includes('SSL') ||
        (error.code === 'ERR_BAD_REQUEST' && error.message?.includes('SSL'))) {
      const isLocalhost = window.location.hostname === 'localhost' || 
                          window.location.hostname === '127.0.0.1';
      
      if (isLocalhost && apiBaseURL.includes('https://')) {
        console.error('[API Client] SSL error detected. The backend is configured for HTTPS but should use HTTP for localhost.');
        console.error('[API Client] Current API URL:', apiBaseURL);
        console.error('[API Client] Please ensure the backend is running on http://localhost:5000');
      } else if (!isLocalhost && apiBaseURL.includes('http://')) {
        console.error('[API Client] Mixed content error: HTTPS page trying to access HTTP API.');
        console.error('[API Client] Current API URL:', apiBaseURL);
        console.error('[API Client] Please use HTTPS for the API URL in production.');
      } else if (apiBaseURL.startsWith('/') && isLocalhost) {
        console.error('[API Client] SSL error with Vite proxy. This usually means:');
        console.error('[API Client] 1. The Vite dev server proxy is not working correctly');
        console.error('[API Client] 2. The request is being intercepted (browser extension/service worker)');
        console.error('[API Client] 3. Try restarting the Vite dev server');
        console.error('[API Client]');
        console.error('[API Client] Troubleshooting steps:');
        console.error('[API Client] - Make sure Vite dev server is running on port 3000');
        console.error('[API Client] - Make sure backend is running on http://localhost:5000');
        console.error('[API Client] - Check browser console for proxy errors');
        console.error('[API Client] - Try disabling browser extensions');
        console.error('[API Client] - Clear browser cache and hard refresh (Ctrl+Shift+R)');
      }
      
      if (import.meta.env.DEV) {
        console.error('[API Client] SSL Protocol Error Details:', {
          code: error.code,
          message: error.message,
          apiUrl: apiBaseURL,
          currentHost: window.location.hostname,
          currentProtocol: window.location.protocol,
          isLocalhost: isLocalhost,
          requestUrl: error.config?.url,
          requestBaseURL: error.config?.baseURL
        });
      }
      return Promise.reject(error);
    }

    // Handle network errors (backend not running)
    if (error.code === 'ERR_NETWORK' || 
        error.message?.includes('ERR_CONNECTION_REFUSED') ||
        error.code === 'ECONNREFUSED' ||
        error.message?.includes('Failed to fetch') ||
        error.message?.includes('NetworkError')) {
      // Only log in development
      if (import.meta.env.DEV) {
      console.error('═══════════════════════════════════════════════════════════');
      console.error('❌ BACKEND SERVER NOT RUNNING');
      console.error('═══════════════════════════════════════════════════════════');
      console.error('');
      console.error('The backend server is not running or not accessible.');
      console.error('');
      console.error('📍 To fix this, start the backend server:');
      console.error('');
      console.error('   Option 1: Use the startup script');
      console.error('   → Run: .\\start-backend.ps1');
      console.error('');
      console.error('   Option 2: Manual start');
      console.error('   → cd backend');
      console.error('   → npm run dev');
      console.error('');
      console.error('   Option 3: Start both servers');
      console.error('   → Run: .\\start-dev.ps1');
      console.error('');
      console.error('🔍 Debug Info:');
      console.error('   API URL:', apiBaseURL);
      console.error('   Request:', originalRequest?.method?.toUpperCase() || 'UNKNOWN', originalRequest?.url || error.config?.url);
      console.error('   Error:', error.code || 'Network Error');
      console.error('');
      console.error('💡 Once the backend is running, refresh this page and try again.');
      console.error('═══════════════════════════════════════════════════════════');
      }
      // Don't redirect on network errors, let components handle it
      return Promise.reject(error);
    }
    
    // Handle 429 (Too Many Requests) with retry logic
    if (error.response?.status === 429) {
      const retryCount = originalRequest._retryCount || 0;
      
      // Check if we should retry
      if (retryCount < MAX_RETRIES && !originalRequest._retrying) {
        originalRequest._retryCount = retryCount + 1;
        originalRequest._retrying = true;
        
        // Get retry-after from response header, body, or calculate delay
        let retryAfter = getRetryDelay(retryCount);
        
        // Check Retry-After header (standard HTTP header)
        if (error.response?.headers?.['retry-after']) {
          retryAfter = parseInt(error.response.headers['retry-after']) * 1000;
        }
        // Check RateLimit-Reset header (from express-rate-limit)
        else if (error.response?.headers?.['ratelimit-reset']) {
          const resetTime = parseInt(error.response.headers['ratelimit-reset']) * 1000;
          const now = Date.now();
          retryAfter = Math.max(1000, resetTime - now);
        }
        // Check retryAfter in response body (custom backend response)
        else if (error.response?.data?.retryAfter) {
          retryAfter = parseInt(error.response.data.retryAfter) * 1000;
        }
        
        // Ensure minimum delay of 1 second
        retryAfter = Math.max(1000, retryAfter);
        
        // Only log in development
        if (import.meta.env.DEV) {
          console.warn(`Rate limit exceeded. Retrying in ${Math.ceil(retryAfter / 1000)}s (attempt ${retryCount + 1}/${MAX_RETRIES})...`);
        }
        
        // Wait before retrying
        await sleep(retryAfter);
        
        // Remove retrying flag and retry the request
        delete originalRequest._retrying;
        return api(originalRequest);
      } else {
        // Max retries exceeded - only log in development
        if (import.meta.env.DEV) {
          console.error('Rate limit exceeded. Maximum retries reached.');
        }
        return Promise.reject(error);
      }
    }
    
    if (error.response?.status === 401) {
      // Token expired or invalid - only redirect if not already on login page
      const currentPath = window.location.pathname;
      if (!currentPath.includes('/login') && !currentPath.includes('/register')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // Use replace to avoid adding to history
        window.location.replace('/login');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
