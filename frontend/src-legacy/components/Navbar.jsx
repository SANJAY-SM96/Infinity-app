import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiShoppingCart,
  FiUser,
  FiLogOut,
  FiMenu,
  FiX,
  FiSun,
  FiMoon,
  FiShoppingBag,
  FiFileText,
  FiInfo,
  FiMail,
  FiLayout
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { getNavigationItems, getMobileNavigationItems } from '../utils/navigation';
import DynamicNavigation from './ui/DynamicNavigation';
import { cn } from '../utils/helpers';

export default function Navbar({ isHomePage = false }) {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const { cartCount } = useCart();
  const { theme, toggleTheme, isDark } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Dynamic navigation items based on user authentication and role
  const baseNavItems = useMemo(() =>
    getNavigationItems(user, isAuthenticated),
    [user, isAuthenticated]
  );

  // Convert to DynamicNavigation format
  const navItems = useMemo(() =>
    baseNavItems.map(item => ({
      id: item.id,
      label: item.label,
      to: item.to,
      icon: item.icon ? React.createElement(item.icon, { size: 16 }) : undefined,
    })),
    [baseNavItems]
  );

  const mobileNavItems = useMemo(() =>
    getMobileNavigationItems(user, isAuthenticated).map(item => ({
      id: item.id,
      label: item.label,
      to: item.to,
      icon: item.icon ? React.createElement(item.icon, { size: 18 }) : undefined,
    })),
    [user, isAuthenticated]
  );

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

  const logoGradient = 'bg-gradient-to-r from-primary via-primary-light to-accent';

  // Navbar background colors based on scroll and theme
  const navBgColor = isHomePage
    ? (scrolled
      ? (isDark ? 'rgba(30, 41, 59, 0.95)' : 'rgba(255, 255, 255, 0.95)')
      : (isDark ? 'rgba(30, 41, 59, 0.8)' : 'rgba(255, 255, 255, 0.8)'))
    : (isDark ? 'rgba(30, 41, 59, 0.95)' : 'rgba(255, 255, 255, 0.95)');

  const navTextColor = isDark ? 'rgba(241, 245, 249, 0.9)' : 'rgba(30, 41, 59, 0.9)';
  const navHighlightColor = isDark ? 'rgba(148, 163, 184, 0.2)' : 'rgba(148, 163, 184, 0.1)';

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{
          y: isVisible ? 0 : -100,
          opacity: isVisible ? 1 : 0
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="fixed top-0 left-0 right-0 z-[100] transition-all duration-300"
      >
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-2.5 sm:py-3 lg:py-4 flex justify-center">
          <motion.div
            className={cn(
              'relative flex items-center justify-between rounded-xl sm:rounded-2xl border px-2 sm:px-4 lg:px-6 py-2 sm:py-2.5 lg:py-3 transition-all duration-300 min-h-[52px] sm:min-h-[56px] w-full lg:w-[95%]',
              isHomePage && !scrolled
                ? 'border-transparent shadow-none'
                : isHomePage && scrolled
                  ? isDark
                    ? 'border-slate-700/50 shadow-2xl'
                    : 'border-slate-200/50 shadow-2xl'
                  : isDark
                    ? 'border-slate-700/50 shadow-xl'
                    : 'border-slate-200/50 shadow-xl'
            )}
            style={{
              background: `
                linear-gradient(135deg,
                  rgba(255,255,255,0.45) 0%,
                  rgba(255,255,255,0.30) 25%,
                  rgba(255,255,255,0.20) 50%,
                  rgba(255,255,255,0.30) 75%,
                  rgba(255,255,255,0.45) 100%
                )
              `,
              backgroundColor: navBgColor,
              backdropFilter: 'blur(30px) saturate(200%) brightness(1.1)',
              WebkitBackdropFilter: 'blur(30px) saturate(200%) brightness(1.1)',
            }}
          >
            {/* Logo */}
            <Link
              to={getHomePath()}
              className="relative z-10 flex items-center gap-1.5 sm:gap-2 min-w-0 flex-shrink group max-w-[60%] sm:max-w-none"
            >
              <motion.img
                src="/player.svg"
                alt="Infinity Logo - IT Project Marketplace"
                className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 lg:w-11 lg:h-11 flex-shrink-0 transition-transform duration-300 group-hover:scale-110"
                width="44"
                height="44"
                loading="eager"
                decoding="async"
                fetchpriority="high"
                whileHover={{ rotate: 5 }}
                whileTap={{ scale: 0.95 }}
              />
              <span className={cn(
                'text-lg sm:text-xl md:text-2xl font-extrabold tracking-tight text-transparent bg-clip-text truncate block',
                logoGradient
              )}>
                INFINITY
              </span>
            </Link>

            {/* Desktop Menu - Dynamic Navigation */}
            <div className="relative z-10 hidden lg:flex items-center gap-4 flex-1 justify-center mx-8 h-full overflow-x-auto scrollbar-hide">
              {navItems.length > 0 && (
                <DynamicNavigation
                  links={navItems}
                  backgroundColor={navBgColor}
                  textColor={navTextColor}
                  highlightColor={navHighlightColor}
                  glowIntensity={isDark ? 8 : 5}
                  showLabelsOnMobile={false}
                  className="max-w-fit flex-shrink-0"
                  onLinkClick={(id) => {
                    setIsMenuOpen(false);
                  }}
                  enableRipple={true}
                />
              )}
            </div>

            {/* Right Section - Action Buttons */}
            <div className="relative z-10 flex items-center gap-1.5 sm:gap-2 md:gap-3 h-full flex-shrink-0">
              {/* Theme Toggle */}
              <motion.button
                onClick={toggleTheme}
                whileHover={{ scale: 1.1, rotate: 15 }}
                whileTap={{ scale: 0.9 }}
                className={cn(
                  'p-2 sm:p-2.5 rounded-lg sm:rounded-xl transition-all duration-200 flex-shrink-0 relative overflow-hidden flex items-center justify-center',
                  isDark
                    ? 'text-amber-400 hover:bg-amber-400/10 hover:text-amber-300'
                    : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                )}
                aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
                aria-pressed={isDark}
                type="button"
              >
                {isDark ? <FiSun className="w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true" /> : <FiMoon className="w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true" />}
              </motion.button>

              {/* Cart */}
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex items-center justify-center flex-shrink-0">
                <Link
                  to="/cart"
                  className={cn(
                    'group relative p-2 sm:p-2.5 rounded-lg sm:rounded-xl transition-all duration-200 flex-shrink-0 flex items-center justify-center',
                    isDark
                      ? 'text-slate-100/90 hover:text-slate-100 hover:bg-slate-100/10'
                      : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                  )}
                  aria-label={`Shopping cart${cartCount > 0 ? ` with ${cartCount} item${cartCount > 1 ? 's' : ''}` : ''}`}
                >
                  <FiShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true" />
                  {cartCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 text-[9px] sm:text-[10px] font-extrabold rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center bg-gradient-to-r from-primary via-primary-light to-accent text-white shadow-lg border-2 border-white dark:border-slate-900"
                      aria-label={`${cartCount} item${cartCount > 1 ? 's' : ''} in cart`}
                    >
                      {cartCount > 99 ? '99+' : cartCount}
                    </motion.span>
                  )}
                </Link>
              </motion.div>

              {/* Auth Buttons - Desktop */}
              {isAuthenticated ? (
                <div className="hidden lg:flex items-center gap-2 h-full">
                  <motion.button
                    onClick={() => {
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
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={cn(
                      'p-2.5 rounded-xl transition-all duration-200 flex items-center justify-center',
                      isDark
                        ? 'text-slate-100/90 hover:text-slate-100 hover:bg-slate-100/10'
                        : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                    )}
                    aria-label="Dashboard"
                  >
                    <FiUser className="w-5 h-5" />
                  </motion.button>
                  <motion.button
                    onClick={handleLogout}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={cn(
                      'p-2.5 rounded-xl transition-all duration-200 flex items-center justify-center',
                      isDark
                        ? 'text-red-400 hover:text-red-300 hover:bg-red-500/10'
                        : 'text-red-600 hover:text-red-700 hover:bg-red-50'
                    )}
                    aria-label="Logout"
                  >
                    <FiLogOut className="w-5 h-5" />
                  </motion.button>
                </div>
              ) : (
                <div className="hidden lg:flex items-center gap-2 h-full">
                  <motion.button
                    onClick={() => navigate('/login')}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={cn(
                      'px-4 py-2.5 rounded-xl border font-semibold text-sm transition-all duration-200 flex items-center justify-center',
                      isDark
                        ? 'border-slate-600 text-slate-100/90 hover:bg-slate-700/50 hover:border-slate-500'
                        : 'border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400'
                    )}
                  >
                    Login
                  </motion.button>
                  <motion.button
                    onClick={() => navigate('/register')}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 bg-gradient-to-r from-primary via-primary-light to-accent text-white hover:shadow-lg flex items-center justify-center"
                  >
                    Sign Up
                  </motion.button>
                </div>
              )}

              {/* Mobile Menu Toggle */}
              <motion.button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={cn(
                  'lg:hidden p-2 sm:p-2.5 rounded-lg sm:rounded-xl transition-all duration-200 flex-shrink-0 flex items-center justify-center',
                  isDark
                    ? 'text-slate-100/90 hover:text-slate-100 hover:bg-slate-100/10'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                )}
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <FiX className="w-5 h-5 sm:w-6 sm:h-6" /> : <FiMenu className="w-5 h-5 sm:w-6 sm:h-6" />}
              </motion.button>
            </div>
          </motion.div>
        </div>
      </motion.nav>

      {/* Spacer to prevent content overlap - Only show on non-home pages */}
      {!isHomePage && <div className="h-14 sm:h-16 md:h-20" />}

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[99] lg:hidden"
            />

            {/* Mobile Menu Panel */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className={cn(
                'fixed top-0 left-0 h-full w-72 sm:w-80 max-w-[90vw] sm:max-w-[85vw] z-[100] border-r backdrop-blur-2xl shadow-2xl lg:hidden overflow-hidden',
                isDark
                  ? 'bg-slate-900/98 border-slate-700'
                  : 'bg-white/98 border-slate-200'
              )}
            >
              <div className="flex flex-col h-full">
                {/* Mobile Menu Header */}
                <div className={cn(
                  'flex items-center justify-between p-4 sm:p-5 border-b flex-shrink-0',
                  isDark ? 'border-slate-700' : 'border-slate-200'
                )}>
                  <Link
                    to={getHomePath()}
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-2 sm:gap-3 group min-w-0 flex-1"
                  >
                    <motion.img
                      src="/player.svg"
                      alt="Infinity Logo"
                      className="w-9 h-9 sm:w-10 sm:h-10 flex-shrink-0 group-hover:scale-110 transition-transform"
                      whileHover={{ rotate: 5 }}
                    />
                    <span className={cn('text-lg sm:text-xl font-extrabold tracking-tight text-transparent bg-clip-text truncate', logoGradient)}>
                      INFINITY
                    </span>
                  </Link>
                  <motion.button
                    onClick={() => setIsMenuOpen(false)}
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    className={cn(
                      'p-2 sm:p-2.5 rounded-lg sm:rounded-xl transition-all duration-200 flex-shrink-0 ml-2',
                      isDark
                        ? 'text-slate-100/80 hover:text-slate-100 hover:bg-slate-100/10'
                        : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                    )}
                    aria-label="Close menu"
                  >
                    <FiX className="w-5 h-5 sm:w-6 sm:h-6" />
                  </motion.button>
                </div>

                {/* Mobile Menu Links - Dynamic Navigation */}
                <div className={cn(
                  'flex-1 overflow-y-auto px-3 sm:px-4 py-4 sm:py-6',
                  isDark ? 'scrollbar-thin scrollbar-thumb-slate-700' : 'scrollbar-thin scrollbar-thumb-slate-300'
                )}>
                  {mobileNavItems.length > 0 && (
                    <DynamicNavigation
                      links={mobileNavItems}
                      variant="mobile"
                      showLabelsOnMobile={true}
                      onLinkClick={() => setIsMenuOpen(false)}
                      className="w-full"
                      enableRipple={true}
                    />
                  )}
                </div>

                {/* Mobile Menu Footer */}
                <div className={cn(
                  'p-3 sm:p-4 border-t space-y-2 flex-shrink-0',
                  isDark ? 'border-slate-700' : 'border-slate-200'
                )}>
                  {isAuthenticated ? (
                    <>
                      <motion.button
                        onClick={() => {
                          setIsMenuOpen(false);
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
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={cn(
                          'w-full flex items-center justify-center gap-2 sm:gap-3 py-3 sm:py-3.5 px-3 sm:px-4 rounded-lg sm:rounded-xl font-semibold text-sm transition-all duration-200 min-h-[44px]',
                          isDark
                            ? 'text-slate-100/90 hover:text-slate-100 hover:bg-slate-100/10'
                            : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                        )}
                      >
                        <FiUser className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                        <span>Dashboard</span>
                      </motion.button>
                      <motion.button
                        onClick={() => {
                          setIsMenuOpen(false);
                          handleLogout();
                        }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={cn(
                          'w-full flex items-center justify-center gap-2 sm:gap-3 py-3 sm:py-3.5 px-3 sm:px-4 rounded-lg sm:rounded-xl font-semibold text-sm transition-all duration-200 min-h-[44px]',
                          isDark
                            ? 'text-red-400 hover:text-red-300 hover:bg-red-500/10'
                            : 'text-red-600 hover:text-red-700 hover:bg-red-50'
                        )}
                      >
                        <FiLogOut className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                        <span>Logout</span>
                      </motion.button>
                    </>
                  ) : (
                    <>
                      <motion.button
                        onClick={() => {
                          setIsMenuOpen(false);
                          navigate('/login');
                        }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={cn(
                          'w-full py-3 sm:py-3.5 px-3 sm:px-4 rounded-lg sm:rounded-xl border font-semibold text-sm transition-all duration-200 min-h-[44px]',
                          isDark
                            ? 'border-slate-600 text-slate-100/90 hover:bg-slate-700/50 hover:border-slate-500'
                            : 'border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400'
                        )}
                      >
                        Login
                      </motion.button>
                      <motion.button
                        onClick={() => {
                          setIsMenuOpen(false);
                          navigate('/register');
                        }}
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full py-3 sm:py-3.5 px-3 sm:px-4 rounded-lg sm:rounded-xl font-semibold text-sm transition-all duration-200 bg-gradient-to-r from-primary via-primary-light to-accent text-white hover:shadow-lg min-h-[44px]"
                      >
                        Sign Up
                      </motion.button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
