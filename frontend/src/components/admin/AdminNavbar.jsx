import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  FiSearch, FiBell, FiUser, FiMenu, 
  FiSettings, FiLogOut, FiX, FiSun, FiMoon,
  FiHome, FiGrid, FiTrendingUp, FiActivity
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
  
  // Quick navigation items
  const quickNavItems = [
    { path: '/admin', label: 'Dashboard', icon: FiGrid },
    { path: '/admin/projects', label: 'Projects', icon: FiGrid },
    { path: '/admin/orders', label: 'Orders', icon: FiActivity },
    { path: '/admin/analytics', label: 'Analytics', icon: FiTrendingUp },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setShowProfile(false);
  };

  const notifications = [
    { id: 1, text: 'New order received', time: '5 min ago', type: 'order' },
    { id: 2, text: 'Low stock alert', time: '1 hour ago', type: 'alert' },
    { id: 3, text: 'New user registered', time: '2 hours ago', type: 'user' }
  ];

  const textColor = isDark ? 'text-white' : 'text-gray-900';
  const logoGradient = 'bg-gradient-to-r from-primary via-blue-600 to-indigo-600';
  const navBg = isDark 
    ? 'bg-gray-800/95 backdrop-blur-lg border-gray-700' 
    : 'bg-white/95 backdrop-blur-lg border-gray-200';

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={`sticky top-0 z-50 transition-all duration-300 w-full ${isDark ? 'bg-gray-900' : 'bg-white'}`}
      >
        <div className="w-full px-4 sm:px-6 py-4">
          <motion.div
            className={`relative flex items-center justify-between rounded-2xl border px-4 sm:px-6 py-3 transition-all duration-300 ${navBg} shadow-lg w-full`}
            animate={{
              boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
            }}
          >
            {/* Left Section - Logo & Menu */}
            <div className="relative z-10 flex items-center gap-4 flex-1 min-w-0">
              {/* Mobile Menu Button */}
              <button
                onClick={onMenuClick}
                className={`lg:hidden p-2 rounded-xl transition ${
                  isDark 
                    ? 'text-white/80 hover:text-white hover:bg-white/10' 
                    : 'text-gray-700 hover:text-primary hover:bg-primary/10'
                }`}
                aria-label="Menu"
              >
                <FiMenu size={22} />
              </button>

              {/* Logo */}
              <Link to="/admin" className={`${textColor} text-2xl font-extrabold tracking-tight flex-shrink-0 flex items-center gap-2 group`}>
                <img 
                  src="/player.svg" 
                  alt="Infinity Logo" 
                  className="w-10 h-10 group-hover:scale-110 transition-transform"
                />
                <div>
                  <span className={`text-transparent bg-clip-text ${logoGradient}`}>INFINITY</span>
                  <span className="ml-2 text-xs font-normal opacity-70">Admin</span>
                </div>
              </Link>

              {/* Quick Navigation - Desktop */}
              <div className="hidden lg:flex items-center gap-1 ml-6">
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
                            ? 'bg-primary/20 text-primary border border-primary/30'
                            : 'bg-primary/10 text-primary border border-primary/20'
                          : isDark
                          ? 'text-white/60 hover:text-white hover:bg-white/10'
                          : 'text-gray-600 hover:text-primary hover:bg-primary/5'
                      }`}
                    >
                      <Icon size={16} />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>

              {/* Search Bar - Desktop */}
              <div className="hidden md:flex items-center flex-1 max-w-xl min-w-0 ml-4">
                <div className="relative w-full group">
                  <FiSearch className={`absolute left-4 top-1/2 -translate-y-1/2 ${isDark ? 'text-gray-400' : 'text-gray-500'} pointer-events-none z-10`} size={20} />
                  <input
                    type="text"
                    placeholder="Search orders, users, products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`w-full pl-12 pr-4 py-2.5 rounded-xl border transition-all ${
                      isDark
                        ? 'bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/50'
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-primary focus:ring-2 focus:ring-primary/50'
                    } focus:outline-none shadow-sm`}
                  />
                </div>
              </div>
            </div>

            {/* Right Section */}
            <div className="relative z-10 flex items-center gap-2">
              {/* Home Link */}
              <Link
                to="/"
                className={`p-2 rounded-xl transition ${
                  isDark 
                    ? 'text-white/80 hover:text-white hover:bg-white/10' 
                    : 'text-gray-700 hover:text-primary hover:bg-primary/10'
                }`}
                title="Go to Home"
              >
                <FiHome size={20} />
              </Link>

              {/* Search Button - Mobile */}
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className={`md:hidden p-2 rounded-xl transition ${
                  isDark 
                    ? 'text-white/80 hover:text-white hover:bg-white/10' 
                    : 'text-gray-700 hover:text-primary hover:bg-primary/10'
                }`}
                aria-label="Search"
              >
                <FiSearch size={20} />
              </button>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-xl transition ${
                  isDark 
                    ? 'text-white/80 hover:text-white hover:bg-white/10' 
                    : 'text-gray-700 hover:text-primary hover:bg-primary/10'
                }`}
                aria-label="Toggle theme"
              >
                {isDark ? <FiSun size={20} /> : <FiMoon size={20} />}
              </button>

              {/* Notifications Button */}
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className={`relative p-2 rounded-xl transition ${
                  isDark 
                    ? 'text-white/80 hover:text-white hover:bg-white/10' 
                    : 'text-gray-700 hover:text-primary hover:bg-primary/10'
                }`}
                aria-label="Notifications"
              >
                <FiBell size={20} />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 text-[10px] font-extrabold rounded-full w-5 h-5 flex items-center justify-center bg-gradient-to-r from-red-500 to-pink-500 text-white">
                    {notifications.length}
                  </span>
                )}
              </button>

              {/* Profile Button */}
              <button
                onClick={() => setShowProfile(!showProfile)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl transition ${
                  isDark 
                    ? 'text-white/80 hover:text-white hover:bg-white/10' 
                    : 'text-gray-700 hover:text-primary hover:bg-primary/10'
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary via-blue-600 to-indigo-600 flex items-center justify-center">
                  <span className="text-white font-bold text-xs">
                    {user?.name?.charAt(0)?.toUpperCase() || 'A'}
                  </span>
                </div>
                <div className="hidden lg:block text-left">
                  <p className={`text-sm font-semibold ${textColor}`}>
                    {user?.name || 'Admin User'}
                  </p>
                  <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {user?.role || 'admin'}
                  </p>
                </div>
              </button>
            </div>
          </motion.div>
        </div>

        {/* Mobile Search Bar */}
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
      </motion.nav>

      {/* Notifications Dropdown */}
      <AnimatePresence>
        {showNotifications && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowNotifications(false)}
              className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className={`fixed top-20 right-4 lg:right-8 z-50 w-96 ${isDark ? 'bg-gray-800/98 border-gray-700' : 'bg-white/98 border-gray-200'} border rounded-2xl shadow-2xl overflow-hidden backdrop-blur-2xl`}
              style={{ maxHeight: 'calc(100vh - 100px)' }}
            >
              <div className={`relative p-5 border-b ${isDark ? 'border-gray-700 bg-gray-800/50' : 'border-gray-200 bg-gray-50'}`}>
                <div className="relative z-10 flex items-center justify-between">
                  <div>
                    <h3 className={`${textColor} font-bold text-xl mb-1`}>Notifications</h3>
                    <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                      {notifications.length} new notification{notifications.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-r from-primary/30 to-blue-600/30 border ${isDark ? 'border-primary/40' : 'border-primary/20'} flex items-center justify-center`}>
                    <FiBell className="text-primary" size={20} />
                  </div>
                </div>
              </div>

              <div className={`relative z-10 max-h-96 overflow-y-auto ${isDark ? 'bg-gray-800/30' : 'bg-gray-50/30'}`}>
                {notifications.map((notif, index) => (
                  <motion.div
                    key={notif.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`p-4 border-b transition-all ${
                      isDark 
                        ? 'hover:bg-gray-700/50 border-gray-700' 
                        : 'hover:bg-gray-100 border-gray-200'
                    } cursor-pointer group relative`}
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
                        <p className={isDark ? 'text-gray-400' : 'text-gray-600 text-xs mt-1.5'}>
                          {notif.time}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className={`relative z-10 p-3 border-t ${isDark ? 'border-gray-700 bg-gray-800/60' : 'border-gray-200 bg-gray-50/60'} text-center`}>
                <button className="text-primary hover:text-blue-600 text-xs font-medium transition-colors hover:underline">
                  View all notifications
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Profile Dropdown */}
      <AnimatePresence>
        {showProfile && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowProfile(false)}
              className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className={`fixed top-20 right-4 lg:right-8 z-50 w-72 ${isDark ? 'bg-gray-800/98 border-gray-700' : 'bg-white/98 border-gray-200'} border rounded-2xl shadow-2xl overflow-hidden backdrop-blur-2xl`}
            >
              <div className={`relative p-5 border-b ${isDark ? 'border-gray-700 bg-gray-800/50' : 'border-gray-200 bg-gray-50'}`}>
                <div className="relative z-10 flex items-center gap-4">
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
                    <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
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

              <div className={`relative z-10 p-2 ${isDark ? 'bg-gray-800/30' : 'bg-gray-50/30'}`}>
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
                  <span className={`${isDark ? 'text-white/30' : 'text-gray-400'} group-hover:text-primary group-hover:translate-x-1 transition-all`}>→</span>
                </button>

                <button 
                  onClick={handleLogout}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium group border-t ${
                    isDark 
                      ? 'text-white/70 hover:text-red-400 hover:bg-red-500/10 border-gray-700' 
                      : 'text-gray-700 hover:text-red-600 hover:bg-red-50 border-gray-200'
                  } mt-2 pt-3`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors border ${
                    isDark 
                      ? 'bg-gray-700/60 group-hover:bg-red-500/25 border-gray-600 group-hover:border-red-500/40' 
                      : 'bg-gray-100 group-hover:bg-red-500/10 border-gray-300 group-hover:border-red-500/20'
                  }`}>
                    <FiLogOut className="text-red-500" size={16} />
                  </div>
                  <span className="flex-1 text-left">Logout</span>
                  <span className={`${isDark ? 'text-white/30' : 'text-gray-400'} group-hover:text-red-500 group-hover:translate-x-1 transition-all`}>→</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
