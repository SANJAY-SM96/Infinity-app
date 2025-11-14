// Helper functions

export const formatPrice = (price) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(price);
};

export const formatDate = (date) => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(new Date(date));
};

export const formatDateTime = (date) => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(date));
};

export const truncateText = (text, length = 100) => {
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
};

export const calculateDiscount = (originalPrice, salePrice) => {
  if (!originalPrice || originalPrice <= salePrice) return 0;
  return Math.round(((originalPrice - salePrice) / originalPrice) * 100);
};

export const isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const isStrongPassword = (password) => {
  return password.length >= 6;
};

export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export const throttle = (func, limit) => {
  let inThrottle;
  return function (...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

export const getInitials = (name) => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();
};

export const generateRandomId = () => {
  return Math.random().toString(36).substr(2, 9);
};

export const getErrorMessage = (error) => {
  if (typeof error === 'string') return error;
  if (error?.response?.data?.message) return error.response.data.message;
  if (error?.message) return error.message;
  return 'An error occurred. Please try again.';
};

export const updateQueryParams = (searchParams, setSearchParams, updates) => {
  const newParams = new URLSearchParams(searchParams);
  Object.entries(updates).forEach(([key, value]) => {
    if (value === null || value === undefined || value === '') {
      newParams.delete(key);
    } else {
      newParams.set(key, value);
    }
  });
  setSearchParams(newParams);
};

export const parseQueryParams = (searchParams) => {
  const params = {};
  searchParams.forEach((value, key) => {
    params[key] = value;
  });
  return params;
};

export const cn = (...classes) => {
  return classes.filter(Boolean).join(' ');
};

export const calculateCartTotal = (items) => {
  return items.reduce((total, item) => total + item.price * item.quantity, 0);
};

export const calculateTax = (amount, taxRate = 0.05) => {
  return Math.round(amount * taxRate * 100) / 100;
};

export const calculateFinalPrice = (subtotal, taxRate = 0.05, shippingCost = 100, freeShippingThreshold = 1000) => {
  const tax = Math.round(subtotal * taxRate * 100) / 100;
  const shipping = subtotal > freeShippingThreshold ? 0 : shippingCost;
  return {
    subtotal,
    tax,
    shipping,
    total: subtotal + tax + shipping
  };
};

export const getStatusColor = (status) => {
  const colors = {
    Processing: 'bg-yellow-400/20 text-yellow-400',
    Confirmed: 'bg-blue-400/20 text-blue-400',
    Shipped: 'bg-purple-400/20 text-purple-400',
    Delivered: 'bg-green-400/20 text-green-400',
    Cancelled: 'bg-red-400/20 text-red-400',
    completed: 'bg-green-400/20 text-green-400',
    pending: 'bg-yellow-400/20 text-yellow-400',
    failed: 'bg-red-400/20 text-red-400'
  };
  return colors[status] || 'bg-gray-400/20 text-gray-400';
};

export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const validateForm = (formData, requiredFields) => {
  const errors = {};
  requiredFields.forEach((field) => {
    if (!formData[field] || formData[field].trim() === '') {
      errors[field] = 'This field is required';
    }
  });
  return errors;
};

export const sanitizeHtml = (text) => {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
};
