/**
 * Design System Utility
 * Provides consistent design tokens, styles, and reusable UI patterns
 */

// Design Tokens
export const designTokens = {
  spacing: {
    xs: '0.25rem',    // 4px
    sm: '0.5rem',     // 8px
    md: '1rem',       // 16px
    lg: '1.5rem',    // 24px
    xl: '2rem',      // 32px
    '2xl': '3rem',   // 48px
    '3xl': '4rem',   // 64px
  },
  
  borderRadius: {
    sm: '0.375rem',   // 6px
    md: '0.5rem',     // 8px
    lg: '0.75rem',    // 12px
    xl: '1rem',       // 16px
    '2xl': '1.5rem',  // 24px
    full: '9999px',
  },
  
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
  },
  
  transitions: {
    fast: '150ms',
    normal: '200ms',
    slow: '300ms',
    slower: '500ms',
  },
  
  zIndex: {
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modalBackdrop: 1040,
    modal: 1050,
    popover: 1060,
    tooltip: 1070,
  },
};

// Common Class Utilities
export const commonClasses = {
  // Container
  container: 'w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
  containerSmall: 'w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8',
  
  // Card
  card: (isDark) => `
    ${isDark ? 'bg-gray-800/95 border-gray-700' : 'bg-white border-gray-200'}
    rounded-2xl shadow-xl border p-6 sm:p-8
  `,
  
  cardHover: (isDark) => `
    ${commonClasses.card(isDark)}
    transition-all duration-300
    hover:shadow-2xl hover:-translate-y-1
  `,
  
  // Button Base
  buttonBase: `
    inline-flex items-center justify-center gap-2
    font-semibold rounded-xl
    transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none
  `,
  
  // Button Variants
  buttonPrimary: (isDark) => `
    ${commonClasses.buttonBase}
    ${isDark 
      ? 'bg-gradient-to-r from-primary via-blue-600 to-indigo-600 text-white hover:shadow-lg hover:shadow-primary/50' 
      : 'bg-gradient-to-r from-primary via-blue-600 to-indigo-600 text-white hover:shadow-lg hover:shadow-primary/50'
    }
    focus:ring-primary/50
  `,
  
  buttonSecondary: (isDark) => `
    ${commonClasses.buttonBase}
    ${isDark 
      ? 'bg-gray-700 text-white hover:bg-gray-600 border border-gray-600' 
      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
    }
    focus:ring-gray-500/50
  `,
  
  buttonOutline: (isDark) => `
    ${commonClasses.buttonBase}
    ${isDark 
      ? 'border-2 border-primary text-primary hover:bg-primary/10' 
      : 'border-2 border-primary text-primary hover:bg-primary/5'
    }
    focus:ring-primary/50
  `,
  
  buttonGhost: (isDark) => `
    ${commonClasses.buttonBase}
    ${isDark 
      ? 'text-gray-300 hover:bg-gray-700/50' 
      : 'text-gray-700 hover:bg-gray-100'
    }
  `,
  
  // Input
  input: (isDark, hasError = false) => `
    w-full px-4 py-3 rounded-xl border
    ${hasError
      ? isDark
        ? 'bg-red-900/20 border-red-500 text-white placeholder-red-300 focus:bg-red-900/30 focus:border-red-400'
        : 'bg-red-50 border-red-500 text-gray-900 placeholder-red-400 focus:bg-red-50 focus:border-red-400'
      : isDark
        ? 'bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:bg-gray-700 focus:border-primary'
        : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500 focus:bg-white focus:border-primary'
    }
    focus:outline-none focus:ring-2 focus:ring-primary/50
    transition-all duration-200
    text-sm sm:text-base
  `,
  
  // Section
  section: 'py-12 sm:py-16 lg:py-20',
  sectionSmall: 'py-8 sm:py-12',
  
  // Heading
  heading1: (isDark) => `
    text-3xl sm:text-4xl lg:text-5xl font-extrabold
    ${isDark ? 'text-white' : 'text-gray-900'}
    mb-4 sm:mb-6
  `,
  
  heading2: (isDark) => `
    text-2xl sm:text-3xl lg:text-4xl font-bold
    ${isDark ? 'text-white' : 'text-gray-900'}
    mb-3 sm:mb-4
  `,
  
  heading3: (isDark) => `
    text-xl sm:text-2xl font-semibold
    ${isDark ? 'text-gray-200' : 'text-gray-800'}
    mb-2 sm:mb-3
  `,
  
  // Text
  textBody: (isDark) => `
    ${isDark ? 'text-gray-300' : 'text-gray-700'}
    leading-relaxed
  `,
  
  textMuted: (isDark) => `
    ${isDark ? 'text-gray-400' : 'text-gray-600'}
    text-sm sm:text-base
  `,
  
  // Badge
  badge: (isDark, variant = 'default') => {
    const variants = {
      default: isDark 
        ? 'bg-gray-700 text-gray-200' 
        : 'bg-gray-100 text-gray-700',
      primary: 'bg-primary/10 text-primary',
      success: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      warning: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
      error: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
      info: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    };
    
    return `
      inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold
      ${variants[variant] || variants.default}
    `;
  },
  
  // Loading Spinner
  spinner: (size = 'md') => {
    const sizes = {
      sm: 'w-4 h-4',
      md: 'w-6 h-6',
      lg: 'w-8 h-8',
      xl: 'w-12 h-12',
    };
    
    return `
      ${sizes[size] || sizes.md}
      border-2 border-current border-t-transparent rounded-full animate-spin
    `;
  },
  
  // Gradient Text
  gradientText: 'bg-gradient-to-r from-primary via-blue-600 to-indigo-600 bg-clip-text text-transparent',
  
  // Glass Effect
  glass: (isDark) => `
    ${isDark ? 'bg-gray-800/80 backdrop-blur-xl' : 'bg-white/80 backdrop-blur-xl'}
    border ${isDark ? 'border-gray-700/50' : 'border-gray-200/50'}
  `,
};

// Animation Variants
export const animationVariants = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  
  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  },
  
  slideDown: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
  },
  
  slideLeft: {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  },
  
  slideRight: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
  },
  
  scale: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
  },
  
  staggerContainer: {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  },
  
  staggerItem: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
  },
};

// Page Layout Helper
export const getPageLayoutClasses = (isDark) => ({
  wrapper: `
    min-h-screen
    ${isDark 
      ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
      : 'bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/30'
    }
    transition-colors duration-300
  `,
  
  content: `
    ${commonClasses.container}
    py-8 sm:py-12 lg:py-16
  `,
});

// Helper function to combine classes
export const cn = (...classes) => {
  return classes.filter(Boolean).join(' ');
};

