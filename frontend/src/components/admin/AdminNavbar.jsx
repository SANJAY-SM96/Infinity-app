import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  FiSearch, FiBell, FiUser, FiMenu, 
  FiSettings, FiLogOut, FiX, FiSun, FiMoon,
  FiHome, FiGrid, FiTrendingUp, FiActivity,
  FiFilter, FiDownload, FiRefreshCw
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export default function AdminNavbar({ onMenuClick }) {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const notificationRef = useRef(null);
  const profileRef = useRef(null);
  
  // Quick navigation items
  const quickNavItems = [
    { path: '/admin', label: 'Dashboard', icon: FiGrid },
    { path: '/admin/projects', label: 'Projects', icon: FiGrid },
    { path: '/admin/orders', label: 'Orders', icon: FiActivity },
    { path: '/admin/analytics', label: 'Analytics', icon: FiTrendingUp },
  ];

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfile(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setShowProfile(false);
  };

  const notifications = [
    { id: 1, text: 'New order received', time: '5 min ago', type: 'order', unread: true },
    { id: 2, text: 'Low stock alert', time: '1 hour ago', type: 'alert', unread: true },
    { id: 3, text: 'New user registered', time: '2 hours ago', type: 'user', unread: false }
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  const textColor = isDark ? 'text-white' : 'text-gray-900';
  const textMuted = isDark ? 'text-gray-400' : 'text-gray-600';
  const logoGradient = 'bg-gradient-to-r from-primary via-blue-600 to-indigo-600';
  const navBg = isDark 
    ? 'bg-gray-800/95 backdrop-blur-xl border-gray-700/50 shadow-xl' 
    : 'bg-white/95 backdrop-blur-xl border-gray-200/50 shadow-lg';

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={`sticky top-0 z-50 transition-all duration-300 w-full ${isDark ? 'bg-gray-900/50' : 'bg-white/50'} backdrop-blur-md`}
      >
        <div className="w-full px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4">
          <motion.div
            className={`relative flex items-center justify-between gap-3 sm:gap-4 rounded-xl sm:rounded-2xl border px-3 sm:px-4 md:px-6 py-2.5 sm:py-3 transition-all duration-300 ${navBg} w-full`}
            animate={{
              boxShadow: isDark 
                ? '0 10px 40px rgba(0,0,0,0.3)' 
                : '0 10px 40px rgba(0,0,0,0.1)'
            }}
          >
            {/* Left Section - Logo & Menu */}
            <div className="relative z-10 flex items-center gap-2 sm:gap-3 md:gap-4 flex-1 min-w-0">
              {/* Mobile Menu Button */}
              <button
                onClick={onMenuClick}
                className={`lg:hidden p-2 rounded-lg sm:rounded-xl transition-all flex-shrink-0 ${
                  isDark 
                    ? 'text-white/80 hover:text-white hover:bg-white/10 active:scale-95' 
                    : 'text-gray-700 hover:text-primary hover:bg-primary/10 active:scale-95'
                }`}
                aria-label="Menu"
              >
                <FiMenu className="w-5 h-5 sm:w-5 sm:h-5" />
              </button>

              {/* Logo */}
              <Link 
                to="/admin" 
                className={`${textColor} text-lg sm:text-xl md:text-2xl font-extrabold tracking-tight flex-shrink-0 flex items-center gap-2 group min-w-0`}
              >
                <img 
                  src="/player.svg" 
                  alt="Infinity Logo" 
                  className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 group-hover:scale-110 transition-transform flex-shrink-0"
                />
                <div className="min-w-0 hidden sm:block">
                  <span className={`text-transparent bg-clip-text ${logoGradient} block truncate`}>INFINITY</span>
                  <span className="text-[10px] sm:text-xs font-normal opacity-70 hidden md:inline">Admin</span>
                </div>
              </Link>

              {/* Quick Navigation - Desktop */}
              <div className="hidden lg:flex items-center gap-1 ml-2 md:ml-4 lg:ml-6">
                {quickNavItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path || 
                    (item.path !== '/admin' && location.pathname.startsWith(item.path));
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                        isActive
                          ? isDark
                            ? 'bg-primary/20 text-primary border border-primary/30 shadow-lg shadow-primary/10'
                            : 'bg-primary/10 text-primary border border-primary/20 shadow-md'
                          : isDark
                          ? 'text-white/60 hover:text-white hover:bg-white/10 border border-transparent'
                          : 'text-gray-600 hover:text-primary hover:bg-primary/5 border border-transparent'
                      }`}
                    >
                      <Icon size={16} />
                      <span className="hidden xl:inline">{item.label}</span>
                    </Link>
                  );
                })}
              </div>

              {/* Search Bar - Desktop */}
              <div className="hidden md:flex items-center flex-1 max-w-xl min-w-0 ml-2 md:ml-4">
                <div className="relative w-full group">
                  <FiSearch 
                    className={`absolute left-3 md:left-4 top-1/2 -translate-y-1/2 ${isDark ? 'text-gray-400' : 'text-gray-500'} pointer-events-none z-10 transition-colors group-focus-within:text-primary`} 
                    size={18} 
                  />
                  <input
                    type="text"
                    placeholder="Search orders, users, products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`w-full pl-10 md:pl-12 pr-3 md:pr-4 py-2 md:py-2.5 rounded-lg md:rounded-xl border transition-all text-sm md:text-base ${
                      isDark
                        ? 'bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/50'
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-primary focus:ring-2 focus:ring-primary/50'
                    } focus:outline-none shadow-sm hover:shadow-md`}
                  />
                </div>
              </div>
            </div>

            {/* Right Section - Actions */}
            <div className="relative z-10 flex items-center gap-1 sm:gap-2 flex-shrink-0">
              {/* Home Link */}
              <Link
                to="/"
                className={`p-2 rounded-lg sm:rounded-xl transition-all flex-shrink-0 ${
                  isDark 
                    ? 'text-white/80 hover:text-white hover:bg-white/10 active:scale-95' 
                    : 'text-gray-700 hover:text-primary hover:bg-primary/10 active:scale-95'
                }`}
                title="Go to Home"
              >
                <FiHome className="w-4 h-4 sm:w-5 sm:h-5" />
              </Link>

              {/* Search Button - Mobile */}
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className={`md:hidden p-2 rounded-lg sm:rounded-xl transition-all flex-shrink-0 ${
                  isDark 
                    ? 'text-white/80 hover:text-white hover:bg-white/10 active:scale-95' 
                    : 'text-gray-700 hover:text-primary hover:bg-primary/10 active:scale-95'
                }`}
                aria-label="Search"
              >
                <FiSearch className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-lg sm:rounded-xl transition-all flex-shrink-0 ${
                  isDark 
                    ? 'text-white/80 hover:text-white hover:bg-white/10 active:scale-95' 
                    : 'text-gray-700 hover:text-primary hover:bg-primary/10 active:scale-95'
                }`}
                aria-label="Toggle theme"
              >
                {isDark ? <FiSun className="w-4 h-4 sm:w-5 sm:h-5" /> : <FiMoon className="w-4 h-4 sm:w-5 sm:h-5" />}
              </button>

              {/* Notifications Button */}
              <div className="relative" ref={notificationRef}>
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className={`relative p-2 rounded-lg sm:rounded-xl transition-all flex-shrink-0 ${
                    isDark 
                      ? 'text-white/80 hover:text-white hover:bg-white/10 active:scale-95' 
                      : 'text-gray-700 hover:text-primary hover:bg-primary/10 active:scale-95'
                  }`}
                  aria-label="Notifications"
                >
                  <FiBell className="w-4 h-4 sm:w-5 sm:h-5" />
                  {unreadCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-0.5 -right-0.5 text-[10px] font-extrabold rounded-full w-5 h-5 flex items-center justify-center bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg"
                    >
                      {unreadCount}
                    </motion.span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                <AnimatePresence>
                  {showNotifications && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className={`absolute top-full right-0 mt-2 w-[calc(100vw-2rem)] sm:w-80 md:w-96 max-w-[calc(100vw-2rem)] ${isDark ? 'bg-gray-800/98 border-gray-700' : 'bg-white/98 border-gray-200'} border rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden backdrop-blur-2xl z-50`}
                      style={{ maxHeight: 'calc(100vh - 100px)' }}
                    >
                      <div className={`relative p-4 sm:p-5 border-b ${isDark ? 'border-gray-700 bg-gray-800/50' : 'border-gray-200 bg-gray-50'}`}>
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className={`${textColor} font-bold text-lg mb-1`}>Notifications</h3>
                            <p className={textMuted}>
                              {unreadCount} new notification{unreadCount !== 1 ? 's' : ''}
                            </p>
                          </div>
                          <div className={`w-10 h-10 rounded-xl bg-gradient-to-r from-primary/30 to-blue-600/30 border ${isDark ? 'border-primary/40' : 'border-primary/20'} flex items-center justify-center`}>
                            <FiBell className="text-primary" size={20} />
                          </div>
                        </div>
                      </div>

                      <div className={`relative max-h-96 overflow-y-auto ${isDark ? 'bg-gray-800/30' : 'bg-gray-50/30'}`}>
                        {notifications.map((notif, index) => (
                          <motion.div
                            key={notif.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className={`p-4 border-b transition-all cursor-pointer group relative ${
                              isDark 
                                ? 'hover:bg-gray-700/50 border-gray-700' 
                                : 'hover:bg-gray-100 border-gray-200'
                            } ${notif.unread ? (isDark ? 'bg-primary/5' : 'bg-primary/5') : ''}`}
                          >
                            <div className="flex items-start gap-3">
                              <div className={`w-2.5 h-2.5 rounded-full mt-2 flex-shrink-0 ${
                                notif.type === 'order' ? 'bg-green-500' :
                                notif.type === 'alert' ? 'bg-red-500' :
                                'bg-blue-500'
                              }`} />
                              <div className="flex-1 min-w-0">
                                <p className={`${textColor} text-sm font-medium group-hover:text-primary transition-colors`}>
                                  {notif.text}
                                </p>
                                <p className={`${textMuted} text-xs mt-1.5`}>
                                  {notif.time}
                                </p>
                              </div>
                              {notif.unread && (
                                <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                              )}
                            </div>
                          </motion.div>
                        ))}
                      </div>

                      <div className={`relative p-3 border-t ${isDark ? 'border-gray-700 bg-gray-800/60' : 'border-gray-200 bg-gray-50/60'} text-center`}>
                        <button className="text-primary hover:text-blue-600 text-sm font-medium transition-colors hover:underline">
                          View all notifications
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Profile Button */}
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setShowProfile(!showProfile)}
                  className={`flex items-center gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg sm:rounded-xl transition-all flex-shrink-0 ${
                    isDark 
                      ? 'text-white/80 hover:text-white hover:bg-white/10 active:scale-95' 
                      : 'text-gray-700 hover:text-primary hover:bg-primary/10 active:scale-95'
                  }`}
                >
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-r from-primary via-blue-600 to-indigo-600 flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-[10px] sm:text-xs">
                      {user?.name?.charAt(0)?.toUpperCase() || 'A'}
                    </span>
                  </div>
                  <div className="hidden xl:block text-left min-w-0">
                    <p className={`text-xs sm:text-sm font-semibold ${textColor} truncate`}>
                      {user?.name || 'Admin User'}
                    </p>
                    <p className={`text-[10px] sm:text-xs ${textMuted}`}>
                      {user?.role || 'admin'}
                    </p>
                  </div>
                </button>

                {/* Profile Dropdown */}
                <AnimatePresence>
                  {showProfile && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className={`absolute top-full right-0 mt-2 w-[calc(100vw-2rem)] sm:w-64 md:w-72 max-w-[calc(100vw-2rem)] ${isDark ? 'bg-gray-800/98 border-gray-700' : 'bg-white/98 border-gray-200'} border rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden backdrop-blur-2xl z-50`}
                    >
                      <div className={`relative p-4 sm:p-5 border-b ${isDark ? 'border-gray-700 bg-gray-800/50' : 'border-gray-200 bg-gray-50'}`}>
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            <div className="w-14 h-14 rounded-full bg-gradient-to-r from-primary via-blue-600 to-indigo-600 flex items-center justify-center shadow-xl">
                              <span className="text-white font-bold text-lg">
                                {user?.name?.charAt(0)?.toUpperCase() || 'A'}
                              </span>
                            </div>
                            <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-green-500 rounded-full border-2 border-white shadow-lg" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`${textColor} font-bold text-base truncate`}>{user?.name || 'Admin User'}</p>
                            <p className={textMuted}>
                              {user?.email || 'admin@infinity.com'}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              <span className={`px-2.5 py-1 ${isDark ? 'bg-primary/20 text-primary' : 'bg-primary/10 text-primary'} text-[10px] font-bold rounded-full border ${isDark ? 'border-primary/40' : 'border-primary/20'} uppercase tracking-wider`}>
                                {user?.role || 'admin'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className={`relative p-2 ${isDark ? 'bg-gray-800/30' : 'bg-gray-50/30'}`}>
                        <button 
                          onClick={() => {
                            navigate('/admin/settings');
                            setShowProfile(false);
                          }}
                          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium group ${
                            isDark 
                              ? 'text-white/70 hover:text-white hover:bg-gray-700/50' 
                              : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                          }`}
                        >
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors border ${
                            isDark 
                              ? 'bg-gray-700/60 group-hover:bg-primary/25 border-gray-600 group-hover:border-primary/40' 
                              : 'bg-gray-100 group-hover:bg-primary/10 border-gray-300 group-hover:border-primary/20'
                          }`}>
                            <FiSettings className="text-primary" size={16} />
                          </div>
                          <span className="flex-1 text-left">Settings</span>
                          <span className={`${textMuted} group-hover:text-primary group-hover:translate-x-1 transition-all`}>→</span>
                        </button>

                        <button 
                          onClick={handleLogout}
                          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium group border-t mt-2 pt-3 ${
                            isDark 
                              ? 'text-white/70 hover:text-red-400 hover:bg-red-500/10 border-gray-700' 
                              : 'text-gray-700 hover:text-red-600 hover:bg-red-50 border-gray-200'
                          }`}
                        >
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors border ${
                            isDark 
                              ? 'bg-gray-700/60 group-hover:bg-red-500/25 border-gray-600 group-hover:border-red-500/40' 
                              : 'bg-gray-100 group-hover:bg-red-500/10 border-gray-300 group-hover:border-red-500/20'
                          }`}>
                            <FiLogOut className="text-red-500" size={16} />
                          </div>
                          <span className="flex-1 text-left">Logout</span>
                          <span className={`${textMuted} group-hover:text-red-500 group-hover:translate-x-1 transition-all`}>→</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Mobile Search Bar */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className={`md:hidden border-t backdrop-blur-2xl ${
                isDark 
                  ? 'bg-gray-800/95 border-gray-700' 
                  : 'bg-white/95 border-gray-200'
              }`}
            >
              <div className="max-w-7xl mx-auto px-4 py-4">
                <div className="relative">
                  <FiSearch className={`absolute left-4 top-1/2 -translate-y-1/2 ${isDark ? 'text-gray-400' : 'text-gray-500'} pointer-events-none z-10`} size={20} />
                  <input
                    type="text"
                    placeholder="Search orders, users, products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`w-full pl-12 pr-10 py-3 rounded-xl border transition-all ${
                      isDark
                        ? 'bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/50'
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-primary focus:ring-2 focus:ring-primary/50'
                    } focus:outline-none`}
                  />
                  <button
                    onClick={() => setIsSearchOpen(false)}
                    className={`absolute right-4 top-1/2 -translate-y-1/2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}
                  >
                    <FiX size={20} />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  );
}
