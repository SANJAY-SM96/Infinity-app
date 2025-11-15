import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiShoppingCart, FiUser, FiLogOut, FiMenu, FiX, FiSun, FiMoon } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';

export default function Navbar({ isHomePage = false }) {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const { cartCount } = useCart();
  const { theme, toggleTheme, isDark } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getHomePath = () => {
    if (!isAuthenticated || !user) {
      return '/';
    }
    
    // Admin users go to admin dashboard
    if (user.role === 'admin') {
      return '/admin';
    }
    
    // Students go to student home
    if (user.userType === 'student') {
      return '/home/student';
    }
    
    // Customers go to customer home
    if (user.userType === 'customer') {
      return '/home/customer';
    }
    
    // Default to main home
    return '/';
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrolled(currentScrollY > 20);
      
      // Hide navbar when scrolling down, show when scrolling up
      if (currentScrollY < 100) {
        // Always show at the top
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY) {
        // Scrolling down - hide
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY) {
        // Scrolling up - show
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Navbar styles based on page and theme
  const navBg = isHomePage 
    ? (scrolled 
        ? (isDark ? 'bg-gray-800/95 backdrop-blur-lg border-gray-700 shadow-lg' : 'bg-white/95 backdrop-blur-lg border-gray-200 shadow-lg')
        : (isDark ? 'bg-transparent border-transparent' : 'bg-transparent border-transparent'))
    : (isDark ? 'bg-gray-800/95 backdrop-blur-lg border-gray-700' : 'bg-white/95 backdrop-blur-lg border-gray-200');
  
  const textColor = isHomePage 
    ? (scrolled 
        ? (isDark ? 'text-white' : 'text-gray-900')
        : (isDark ? 'text-white' : 'text-gray-900'))
    : (isDark ? 'text-white' : 'text-gray-900');
  
  const logoGradient = 'bg-gradient-to-r from-primary via-blue-600 to-indigo-600';

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ 
        y: isVisible ? 0 : -100,
        opacity: isVisible ? 1 : 0
      }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${isHomePage ? 'bg-transparent' : (isDark ? 'bg-gray-900' : 'bg-white')}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-5">
        <motion.div
          className={`relative flex items-center justify-between rounded-2xl border px-5 sm:px-8 py-3.5 sm:py-4 transition-all duration-300 ${
            isHomePage 
              ? (scrolled 
                  ? (isDark ? 'bg-gray-800 border-gray-700 shadow-lg' : 'bg-white border-gray-200 shadow-lg')
                  : (isDark ? 'bg-gray-800/80 border-gray-700' : 'bg-white/80 border-gray-100'))
              : (isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200')
          }`}
          animate={{
            boxShadow: isHomePage && scrolled ? '0 10px 40px rgba(0,0,0,0.1)' : '0 10px 40px rgba(0,0,0,0.05)'
          }}
        >
          {/* Logo */}
          <Link to={getHomePath()} className={`relative z-10 flex items-center gap-3 ${textColor}`}>
            <img 
              src="/player.svg" 
              alt="Infinity Logo" 
              className="w-12 h-12 sm:w-14 sm:h-14"
            />
            <span className={`text-3xl sm:text-4xl font-extrabold tracking-tight text-transparent bg-clip-text ${logoGradient}`}>INFINITY</span>
          </Link>

          {/* Desktop Menu */}
          <div className="relative z-10 hidden md:flex items-center gap-2">
            {[
              { to: '/products', label: 'Shop' },
              { to: '/about', label: 'About' },
              { to: '/contact', label: 'Contact' }
            ].map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`px-5 py-2.5 rounded-xl font-semibold text-base transition-colors ${
                  isDark 
                    ? 'text-white/80 hover:text-white hover:bg-white/10' 
                    : 'text-gray-700 hover:text-primary hover:bg-primary/10'
                }`}
              >
                {item.label}
              </Link>
            ))}
            {isAuthenticated && user?.role === 'admin' && (
              <Link 
                to="/admin" 
                className={`px-5 py-2.5 rounded-xl font-semibold text-base transition-colors ${
                  isDark 
                    ? 'text-white/80 hover:text-white hover:bg-white/10' 
                    : 'text-gray-700 hover:text-primary hover:bg-primary/10'
                }`}
              >
                Admin
              </Link>
            )}
          </div>

          {/* Right Section */}
          <div className="relative z-10 flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`p-2.5 rounded-xl transition ${
                isDark 
                  ? 'text-white/80 hover:text-white hover:bg-white/10' 
                  : 'text-gray-700 hover:text-primary hover:bg-primary/10'
              }`}
              aria-label="Toggle theme"
            >
              {isDark ? <FiSun size={24} /> : <FiMoon size={24} />}
            </button>
            
            {/* Cart */}
            <Link 
              to="/cart" 
              className={`group relative p-2.5 transition ${
                isDark ? 'text-white/80 hover:text-white' : 'text-gray-700 hover:text-primary'
              }`}
            >
              <FiShoppingCart size={24} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 text-[10px] font-extrabold rounded-full w-5 h-5 flex items-center justify-center bg-gradient-to-r from-primary via-blue-600 to-indigo-600 text-white">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Auth */}
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => navigate('/dashboard')} 
                  className={`px-5 py-2.5 rounded-xl font-semibold transition ${
                    isDark 
                      ? 'text-white/80 hover:text-white hover:bg-white/10' 
                      : 'text-gray-700 hover:text-primary hover:bg-primary/10'
                  }`}
                >
                  <FiUser size={22} />
                </button>
                <button 
                  onClick={handleLogout} 
                  className={`px-5 py-2.5 rounded-xl font-semibold transition ${
                    isDark 
                      ? 'text-white/80 hover:text-red-400 hover:bg-red-500/10' 
                      : 'text-gray-700 hover:text-red-600 hover:bg-red-50'
                  }`}
                >
                  <FiLogOut size={22} />
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={() => navigate('/login')}
                  className={`px-6 py-3 rounded-xl border font-bold text-base transition ${
                    isDark
                      ? 'border-gray-600 text-white/90 hover:bg-gray-700/50'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Login
                </button>
                <button
                  onClick={() => navigate('/register')}
                  className="px-6 py-3 rounded-xl font-extrabold text-base transition bg-gradient-to-r from-primary via-blue-600 to-indigo-600 text-white hover:shadow-lg hover:shadow-xl"
                >
                  Sign Up
                </button>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)} 
              className={`md:hidden p-2 transition ${
                isDark ? 'text-white/80 hover:text-white' : 'text-gray-700 hover:text-primary'
              }`}
            >
              {isMenuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
            </button>
          </div>
        </motion.div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }} 
          animate={{ opacity: 1, height: 'auto' }} 
          className={`md:hidden border-t backdrop-blur-2xl ${
            isDark 
              ? 'bg-gray-800/95 border-gray-700' 
              : 'bg-white/95 border-gray-200'
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 py-4 space-y-2">
            <Link 
              to="/products" 
              className={`block py-2 px-3 rounded-xl transition ${
                isDark
                  ? 'text-white/80 hover:text-white hover:bg-white/10'
                  : 'text-gray-700 hover:text-primary hover:bg-primary/10'
              }`}
            >
              Shop
            </Link>
            <Link 
              to="/about" 
              className={`block py-2 px-3 rounded-xl transition ${
                isDark
                  ? 'text-white/80 hover:text-white hover:bg-white/10'
                  : 'text-gray-700 hover:text-primary hover:bg-primary/10'
              }`}
            >
              About
            </Link>
            <Link 
              to="/contact" 
              className={`block py-2 px-3 rounded-xl transition ${
                isDark
                  ? 'text-white/80 hover:text-white hover:bg-white/10'
                  : 'text-gray-700 hover:text-primary hover:bg-primary/10'
              }`}
            >
              Contact
            </Link>
            {isAuthenticated && user?.role === 'admin' && (
              <Link 
                to="/admin" 
                className={`block py-2 px-3 rounded-xl transition ${
                  isHomePage
                    ? 'text-gray-700 hover:text-primary hover:bg-primary/10'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                Admin Dashboard
              </Link>
            )}
          </div>
        </motion.div>
      )}

      </motion.nav>
  );
}
