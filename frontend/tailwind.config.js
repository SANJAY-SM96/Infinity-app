export default {
  darkMode: 'class', // Enable class-based dark mode
  content: [
    './index.html',
    './src-legacy/**/*.{js,jsx,ts,tsx}',
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        // Modern Color Palette - 2025 Premium Theme
        primary: {
          DEFAULT: '#4F46E5',      // Indigo-600 - Main primary
          light: '#6366F1',         // Indigo-500 - Lighter variant
          dark: '#4338CA',           // Indigo-700 - Darker variant
          50: '#EEF2FF',
          100: '#E0E7FF',
          200: '#C7D2FE',
          300: '#A5B4FC',
          400: '#818CF8',
          500: '#6366F1',
          600: '#4F46E5',
          700: '#4338CA',
          800: '#3730A3',
          900: '#312E81',
        },
        accent: {
          DEFAULT: '#EC4899',        // Pink-500 - Main accent
          light: '#F472B6',          // Pink-400 - Lighter variant
          dark: '#DB2777',           // Pink-600 - Darker variant
          50: '#FDF2F8',
          100: '#FCE7F3',
          200: '#FBCFE8',
          300: '#F9A8D4',
          400: '#F472B6',
          500: '#EC4899',
          600: '#DB2777',
          700: '#BE185D',
          800: '#9F1239',
          900: '#831843',
        },
        secondary: {
          DEFAULT: '#64748B',        // Slate-500 - Secondary
          light: '#94A3B8',          // Slate-400
          dark: '#475569',           // Slate-600
        },
        background: {
          light: '#F8FAFC',          // Slate-50
          dark: '#0F172A',           // Slate-900
        },
        card: {
          light: '#FFFFFF',          // White
          dark: '#1E293B',           // Slate-800
        },
        foreground: {
          light: '#1E293B',          // Slate-800 - Text on light
          dark: '#F1F5F9',           // Slate-100 - Text on dark
        },
        border: {
          light: '#E2E8F0',          // Slate-200
          dark: '#334155',           // Slate-700
        },
        success: {
          DEFAULT: '#22C55E',        // Green-500
          light: '#4ADE80',           // Green-400
          dark: '#16A34A',            // Green-600
        },
        warning: {
          DEFAULT: '#F59E0B',         // Amber-500
          light: '#FBBF24',           // Amber-400
          dark: '#D97706',            // Amber-600
        },
        error: {
          DEFAULT: '#EF4444',         // Red-500
          light: '#F87171',            // Red-400
          dark: '#DC2626',             // Red-600
        },
        // Legacy aliases for backward compatibility
        'primary-dark': '#4338CA',
        'primary-light': '#6366F1',
        dark: '#0F172A',
        'dark-lighter': '#1E293B',
        'dark-light': '#334155',
        'light-bg': '#F8FAFC',
        'light-card': '#FFFFFF',
        'dark-bg': '#0F172A',
        'dark-card': '#1E293B',
      },
      fontFamily: {
        sans: ['Inter', 'Poppins', 'system-ui', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif']
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'float-reverse': 'floatReverse 6s ease-in-out infinite',
        'gradient': 'gradient 15s ease infinite',
        'rotate-text': 'rotateText 8s ease-in-out infinite',
        'float-3d': 'float3d 6s ease-in-out infinite'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(37, 99, 235, 0.7)' },
          '50%': { boxShadow: '0 0 0 10px rgba(37, 99, 235, 0)' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' }
        },
        floatReverse: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(20px)' }
        },
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' }
        }
      }
    }
  },
  plugins: []
};
