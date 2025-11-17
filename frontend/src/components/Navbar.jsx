import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ 
          y: isVisible ? 0 : -100,
          opacity: isVisible ? 1 : 0
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${isHomePage ? 'bg-transparent' : (isDark ? 'bg-gray-900' : 'bg-white')}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-3.5">
          <motion.div
            className={`relative flex items-center justify-between rounded-xl border px-4 sm:px-5 md:px-6 py-2.5 sm:py-3 transition-all duration-300 ${
              isHomePage 
                ? (scrolled 
                    ? (isDark ? 'bg-gray-800/95 backdrop-blur-lg border-gray-700 shadow-xl' : 'bg-white/95 backdrop-blur-lg border-gray-200 shadow-xl')
                    : (isDark ? 'bg-gray-800/80 backdrop-blur-md border-gray-700/50' : 'bg-white/80 backdrop-blur-md border-gray-100/50'))
                : (isDark ? 'bg-gray-800/95 backdrop-blur-lg border-gray-700 shadow-lg' : 'bg-white/95 backdrop-blur-lg border-gray-200 shadow-lg')
            }`}
          >
            {/* Logo */}
            <Link 
              to={getHomePath()} 
              className={`relative z-10 flex items-center gap-2 ${textColor} min-w-0 flex-shrink-0`}
            >
              <img 
                src="/player.svg" 
                alt="Infinity Logo - IT Project Marketplace" 
                className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 flex-shrink-0"
                width="40"
                height="40"
                loading="eager"
                decoding="async"
                fetchpriority="high"
              />
              <span className={`text-xl sm:text-2xl md:text-2xl font-extrabold tracking-tight text-transparent bg-clip-text ${logoGradient} truncate`}>
                INFINITY
              </span>
            </Link>

            {/* Desktop Menu */}
            <div className="relative z-10 hidden md:flex items-center gap-2">
              {[
                { to: '/products', label: 'Shop' },
                { to: '/blog', label: 'Blog' },
                { to: '/about', label: 'About' },
                { to: '/contact', label: 'Contact' }
              ].map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors duration-200 ${
                    isDark 
                      ? 'text-white/80 hover:text-white hover:bg-white/10' 
                      : 'text-gray-700 hover:text-primary hover:bg-primary/10'
                  }`}
                  aria-label={`Navigate to ${item.label} page`}
                >
                  {item.label}
                </Link>
              ))}
              {isAuthenticated && user?.role === 'admin' && (
                <Link 
                  to="/admin" 
                  className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors duration-200 ${
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
            <div className="relative z-10 flex items-center gap-2">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-lg transition-all duration-200 flex-shrink-0 ${
                  isDark 
                    ? 'text-white/80 hover:text-white hover:bg-white/10' 
                    : 'text-gray-700 hover:text-primary hover:bg-primary/10'
                }`}
                aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
                aria-pressed={isDark}
                type="button"
              >
                {isDark ? <FiSun className="w-5 h-5" aria-hidden="true" /> : <FiMoon className="w-5 h-5" aria-hidden="true" />}
              </button>
              
              {/* Cart */}
              <Link 
                to="/cart" 
                className={`group relative p-2 rounded-lg transition-all duration-200 flex-shrink-0 ${
                  isDark ? 'text-white/80 hover:text-white hover:bg-white/10' : 'text-gray-700 hover:text-primary hover:bg-primary/10'
                }`}
                aria-label={`Shopping cart${cartCount > 0 ? ` with ${cartCount} item${cartCount > 1 ? 's' : ''}` : ''}`}
              >
                <FiShoppingCart className="w-5 h-5" aria-hidden="true" />
                {cartCount > 0 && (
                  <span 
                    className="absolute -top-1 -right-1 text-[10px] font-extrabold rounded-full w-5 h-5 flex items-center justify-center bg-gradient-to-r from-primary via-blue-600 to-indigo-600 text-white shadow-lg"
                    aria-label={`${cartCount} item${cartCount > 1 ? 's' : ''} in cart`}
                  >
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
              </Link>

              {/* Auth - Hidden on mobile, shown in mobile menu */}
              {isAuthenticated ? (
                <div className="hidden md:flex items-center gap-2">
                  <button 
                    onClick={() => {
                      // Navigate to role-specific dashboard
                      if (user?.role === 'admin') {
                        navigate('/admin');
                      } else if (user?.userType === 'student') {
                        navigate('/dashboard/student');
                      } else if (user?.userType === 'customer') {
                        navigate('/dashboard/customer');
                      } else {
                        navigate('/dashboard');
                      }
                    }} 
                    className={`p-2 rounded-lg transition-all duration-200 ${
                      isDark 
                        ? 'text-white/80 hover:text-white hover:bg-white/10' 
                        : 'text-gray-700 hover:text-primary hover:bg-primary/10'
                    }`}
                    aria-label="Dashboard"
                  >
                    <FiUser className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={handleLogout} 
                    className={`p-2 rounded-lg transition-all duration-200 ${
                      isDark 
                        ? 'text-white/80 hover:text-red-400 hover:bg-red-500/10' 
                        : 'text-gray-700 hover:text-red-600 hover:bg-red-50'
                    }`}
                    aria-label="Logout"
                  >
                    <FiLogOut className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <div className="hidden md:flex gap-2">
                  <button
                    onClick={() => navigate('/login')}
                    className={`px-4 py-2 rounded-lg border font-semibold text-sm transition-all duration-200 ${
                      isDark
                        ? 'border-gray-600 text-white/90 hover:bg-gray-700/50 hover:border-gray-500'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'
                    }`}
                  >
                    Login
                  </button>
                  <button
                    onClick={() => navigate('/register')}
                    className="px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200 bg-gradient-to-r from-primary via-blue-600 to-indigo-600 text-white hover:shadow-lg hover:scale-105"
                  >
                    Sign Up
                  </button>
                </div>
              )}

              {/* Mobile Menu Toggle */}
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)} 
                className={`md:hidden p-2 rounded-lg transition-all duration-200 flex-shrink-0 ${
                  isDark 
                    ? 'text-white/80 hover:text-white hover:bg-white/10' 
                    : 'text-gray-700 hover:text-primary hover:bg-primary/10'
                }`}
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
              </button>
            </div>
          </motion.div>
        </div>
      </motion.nav>
      
      {/* Spacer to prevent content overlap - Only show on non-home pages */}
      {!isHomePage && <div className="h-16 sm:h-20" />}

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMenuOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[90] md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ x: '-100%', opacity: 0 }} 
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '-100%', opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className={`fixed top-0 left-0 h-full w-80 max-w-[85vw] z-[100] border-r backdrop-blur-2xl shadow-2xl md:hidden ${
              isDark 
                ? 'bg-gray-900/98 border-gray-700' 
                : 'bg-white/98 border-gray-200'
            }`}
          >
            <div className="flex flex-col h-full">
              {/* Mobile Menu Header */}
              <div className={`flex items-center justify-between p-4 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                <Link 
                  to={getHomePath()} 
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-2"
                >
                  <img 
                    src="/player.svg" 
                    alt="Infinity Logo" 
                    className="w-9 h-9"
                  />
                  <span className={`text-xl font-extrabold tracking-tight text-transparent bg-clip-text ${logoGradient}`}>
                    INFINITY
                  </span>
                </Link>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    isDark 
                      ? 'text-white/80 hover:text-white hover:bg-white/10' 
                      : 'text-gray-700 hover:text-primary hover:bg-primary/10'
                  }`}
                  aria-label="Close menu"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Menu Links */}
              <div className={`flex-1 overflow-y-auto px-4 py-4 space-y-1 ${isDark ? 'scrollbar-thin scrollbar-thumb-gray-700' : 'scrollbar-thin scrollbar-thumb-gray-300'}`}>
                {[
                  { to: '/products', label: 'Shop' },
                  { to: '/about', label: 'About' },
                  { to: '/contact', label: 'Contact' }
                ].map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setIsMenuOpen(false)}
                    className={`block py-3 px-4 rounded-lg font-semibold text-sm transition-all duration-200 ${
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
                    onClick={() => setIsMenuOpen(false)}
                    className={`block py-3 px-4 rounded-lg font-semibold text-sm transition-all duration-200 ${
                      isDark
                        ? 'text-white/80 hover:text-white hover:bg-white/10'
                        : 'text-gray-700 hover:text-primary hover:bg-primary/10'
                    }`}
                  >
                    Admin Dashboard
                  </Link>
                )}
              </div>

              {/* Mobile Menu Footer */}
              <div className={`p-4 border-t space-y-2 ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                {isAuthenticated ? (
                  <>
                    <button 
                      onClick={() => {
                        setIsMenuOpen(false);
                        // Navigate to role-specific dashboard
                        if (user?.role === 'admin') {
                          navigate('/admin');
                        } else if (user?.userType === 'student') {
                          navigate('/dashboard/student');
                        } else if (user?.userType === 'customer') {
                          navigate('/dashboard/customer');
                        } else {
                          navigate('/dashboard');
                        }
                      }}
                      className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-semibold text-sm transition-all duration-200 ${
                        isDark 
                          ? 'text-white/80 hover:text-white hover:bg-white/10' 
                          : 'text-gray-700 hover:text-primary hover:bg-primary/10'
                      }`}
                    >
                      <FiUser className="w-5 h-5" />
                      <span>Dashboard</span>
                    </button>
                    <button 
                      onClick={() => {
                        setIsMenuOpen(false);
                        handleLogout();
                      }}
                      className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-semibold text-sm transition-all duration-200 ${
                        isDark 
                          ? 'text-white/80 hover:text-red-400 hover:bg-red-500/10' 
                          : 'text-gray-700 hover:text-red-600 hover:bg-red-50'
                      }`}
                    >
                      <FiLogOut className="w-5 h-5" />
                      <span>Logout</span>
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        navigate('/login');
                      }}
                      className={`w-full py-3 px-4 rounded-lg border font-semibold text-sm transition-all duration-200 ${
                        isDark
                          ? 'border-gray-600 text-white/90 hover:bg-gray-700/50 hover:border-gray-500'
                          : 'border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'
                      }`}
                    >
                      Login
                    </button>
                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        navigate('/register');
                      }}
                      className="w-full py-3 px-4 rounded-lg font-semibold text-sm transition-all duration-200 bg-gradient-to-r from-primary via-blue-600 to-indigo-600 text-white hover:shadow-lg hover:scale-105"
                    >
                      Sign Up
                    </button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
