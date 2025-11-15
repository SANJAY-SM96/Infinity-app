export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        primary: '#5C6AC4',
        'primary-dark': '#4C5AB4',
        'primary-light': '#7E8AFF',
        secondary: '#A17AFF',
        accent: '#A17AFF',
        dark: '#181A1F',
        'dark-lighter': '#242730',
        'dark-light': '#242730',
        // 2025 UI Theme Colors
        'light-bg': '#F9FAFB',
        'light-card': '#FFFFFF',
        'dark-bg': '#181A1F',
        'dark-card': '#242730',
        'accent-primary': '#5C6AC4',
        'accent-secondary': '#A17AFF',
        'accent-dark': '#7E8AFF'
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
