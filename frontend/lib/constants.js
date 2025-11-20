// Constants for the application

// Categories are backend-only metadata, not displayed in frontend
// Frontend uses filter buttons instead: Web-Based Projects, Trending Now, Top-Selling, New Uploads
export const PRODUCT_FILTERS = [
  { id: 'web-based', label: 'Web-Based Projects' },
  { id: 'trending', label: 'Trending Now' },
  { id: 'top-selling', label: 'Top-Selling' },
  { id: 'new-uploads', label: 'New Uploads' }
];

export const ORDER_STATUSES = [
  'Processing',
  'Confirmed',
  'Shipped',
  'Delivered',
  'Cancelled'
];

export const PAYMENT_PROVIDERS = [
  { id: 'stripe', name: 'Credit/Debit Card (Stripe)' },
  { id: 'razorpay', name: 'Razorpay' },
  { id: 'cod', name: 'Cash on Delivery' }
];

export const SHIPPING_COST = 100;
export const FREE_SHIPPING_THRESHOLD = 1000;
export const TAX_RATE = 0.05; // 5%

export const SORT_OPTIONS = [
  { value: '-createdAt', label: 'Newest' },
  { value: 'price', label: 'Price: Low to High' },
  { value: '-price', label: 'Price: High to Low' },
  { value: '-rating', label: 'Rating: High to Low' },
  { value: 'title', label: 'Name: A to Z' }
];

export const ITEMS_PER_PAGE = 12;
export const ITEMS_PER_PAGE_OPTIONS = [12, 24, 48];

export const API_TIMEOUT = 30000; // 30 seconds

// Get API base URL (without /api suffix) - useful for OAuth redirects
export const getApiBaseUrl = () => {
  // In development mode, always use localhost
  if (import.meta.env.DEV) {
    return 'http://localhost:5000';
  }
  
  // In production, use VITE_API_URL if set, otherwise use default production URL
  if (import.meta.env.PROD) {
    const envUrl = import.meta.env.VITE_API_URL;
    if (envUrl) {
      // Remove /api suffix if present
      return envUrl.replace(/\/api\/?$/, '');
    }
    return 'https://www.api.infinitywebtechnology.com';
  }
  
  // Fallback: use local backend
  return 'http://localhost:5000';
};

export const COLORS = {
  // Modern Premium Color Palette
  primary: '#4F46E5',           // Indigo-600
  primaryLight: '#6366F1',      // Indigo-500
  primaryDark: '#4338CA',       // Indigo-700
  accent: '#EC4899',            // Pink-500
  accentLight: '#F472B6',       // Pink-400
  accentDark: '#DB2777',        // Pink-600
  secondary: '#64748B',          // Slate-500
  background: {
    light: '#F8FAFC',           // Slate-50
    dark: '#0F172A',            // Slate-900
  },
  card: {
    light: '#FFFFFF',           // White
    dark: '#1E293B',            // Slate-800
  },
  foreground: {
    light: '#1E293B',           // Slate-800
    dark: '#F1F5F9',            // Slate-100
  },
  border: {
    light: '#E2E8F0',           // Slate-200
    dark: '#334155',            // Slate-700
  },
  success: '#22C55E',           // Green-500
  warning: '#F59E0B',           // Amber-500
  error: '#EF4444',             // Red-500
  info: '#3B82F6',              // Blue-500
  // Legacy aliases for backward compatibility
  dark: '#0F172A',
  darkLighter: '#1E293B',
  darkLight: '#334155',
};

export const TRANSITION_DURATION = {
  short: 150,
  medium: 300,
  long: 500
};

export const REGEX = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/,
  postalCode: /^[A-Z0-9]{3,10}$/i,
  strongPassword: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
};

export const ERROR_MESSAGES = {
  REQUIRED_FIELD: 'This field is required',
  INVALID_EMAIL: 'Please enter a valid email address',
  PASSWORD_MIN_LENGTH: 'Password must be at least 6 characters',
  PASSWORD_MISMATCH: 'Passwords do not match',
  INVALID_PHONE: 'Please enter a valid phone number',
  NETWORK_ERROR: 'Network error. Please check your connection',
  SERVER_ERROR: 'Server error. Please try again later',
  NOT_FOUND: 'Resource not found',
  UNAUTHORIZED: 'Please login to continue',
  FORBIDDEN: 'You do not have permission to access this',
  DUPLICATE: 'This item already exists'
};

export const SUCCESS_MESSAGES = {
  LOGIN: 'Login successful!',
  REGISTER: 'Account created successfully!',
  LOGOUT: 'Logged out successfully',
  ADD_TO_CART: 'Added to cart!',
  UPDATE_CART: 'Cart updated',
  REMOVE_FROM_CART: 'Item removed from cart',
  ORDER_PLACED: 'Order placed successfully!',
  PROFILE_UPDATED: 'Profile updated successfully',
  PASSWORD_CHANGED: 'Password changed successfully',
  PRODUCT_CREATED: 'Product created successfully',
  PRODUCT_UPDATED: 'Product updated successfully',
  PRODUCT_DELETED: 'Product deleted successfully'
};
