import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiLayout,
  FiPackage,
  FiShoppingBag,
  FiUsers,
  FiBarChart2,
  FiSettings,
  FiLogOut,
  FiMenu,
  FiX,
  FiFileText,
  FiHome,
  FiZap,
  FiLock,
  FiGlobe
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const menuItems = [
  { path: '/admin', icon: FiLayout, label: 'Dashboard' },
  { path: '/admin/projects', icon: FiPackage, label: 'Projects' },
  { path: '/admin/project-requests', icon: FiFileText, label: 'Project Requests' },
  { path: '/admin/blogs', icon: FiFileText, label: 'Blogs' },
  { path: '/admin/orders', icon: FiShoppingBag, label: 'Orders' },
  { path: '/admin/users', icon: FiUsers, label: 'Users' },
  { path: '/admin/analytics', icon: FiBarChart2, label: 'Analytics' },
  { path: '/admin/seo-tools', icon: FiZap, label: 'SEO Tools' },
  { path: '/admin/seo-content', icon: FiGlobe, label: 'SEO Content' },
  { path: '/admin/settings', icon: FiSettings, label: 'Settings' },
  { path: '/admin/oauth-config', icon: FiLock, label: 'OAuth Config' }
];

export default function AdminSidebar({ isOpen, setIsOpen }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const { isDark } = useTheme();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const sidebarBg = isDark 
    ? 'bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900' 
    : 'bg-gradient-to-b from-white via-gray-50 to-white';
  const borderColor = isDark ? 'border-gray-700/50' : 'border-gray-200/50';
  const textColor = isDark ? 'text-white' : 'text-gray-900';
  const textMuted = isDark ? 'text-gray-400' : 'text-gray-600';

  return (
    <>
      {/* Mobile Menu Button - Floating button for mobile */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`lg:hidden fixed top-4 left-4 z-50 p-3 rounded-xl shadow-2xl backdrop-blur-xl transition-all ${
          isDark 
            ? 'bg-gray-800/90 border-gray-700 text-white hover:bg-gray-700' 
            : 'bg-white/90 border-gray-200 text-gray-900 hover:bg-gray-50'
        } border`}
        aria-label="Menu"
      >
        <FiMenu size={24} />
      </button>

      {/* Mobile Sidebar - Slide in from left */}
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className={`lg:hidden fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] ${sidebarBg} border-r ${borderColor} flex flex-col shadow-2xl backdrop-blur-xl relative overflow-hidden`}
          >
            {/* Mobile Sidebar Content */}
            <div className="flex flex-col h-full">
              {/* Logo & Close Button */}
              <div className={`flex items-center justify-between gap-3 px-4 sm:px-6 py-4 border-b ${borderColor}`}>
                <div className="flex items-center gap-3">
                  <img 
                    src="/player.svg" 
                    alt="Infinity Logo" 
                    className="w-10 h-10"
                  />
                  <div>
                    <h2 className={`text-xl font-extrabold bg-gradient-to-r from-primary via-blue-600 to-indigo-600 bg-clip-text text-transparent`}>
                      INFINITY
                    </h2>
                    <p className={`text-xs ${textMuted}`}>Admin Panel</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    to="/"
                    onClick={() => setIsOpen(false)}
                    className={`p-2 rounded-lg ${isDark ? 'hover:bg-white/10 text-white/60 hover:text-white' : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'} transition`}
                    title="Go to Home"
                  >
                    <FiHome size={20} />
                  </Link>
                  <button
                    onClick={() => setIsOpen(false)}
                    className={`p-2 rounded-lg ${isDark ? 'hover:bg-white/10 text-white/60 hover:text-white' : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'} transition`}
                  >
                    <FiX size={20} />
                  </button>
                </div>
              </div>

              {/* Navigation */}
              <nav className="flex-1 p-3 sm:p-4 space-y-2 overflow-y-auto">
                <div className="mb-3 sm:mb-4 px-2">
                  <p className={`text-xs ${textMuted} font-semibold uppercase tracking-wider`}>Menu</p>
                </div>
                {menuItems.map((item, index) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path || 
                    (item.path !== '/admin' && location.pathname.startsWith(item.path));

                  return (
                    <motion.div
                      key={item.path}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Link
                        to={item.path}
                        onClick={() => setIsOpen(false)}
                        className={`
                          flex items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl
                          transition-all duration-300
                          group relative overflow-hidden
                          ${isActive
                            ? isDark
                              ? 'bg-gradient-to-r from-primary/20 via-blue-600/20 to-indigo-600/20 text-white border border-primary/40 shadow-lg'
                              : 'bg-gradient-to-r from-primary/10 via-blue-600/10 to-indigo-600/10 text-primary border border-primary/30 shadow-md'
                            : isDark
                            ? 'text-white/60 hover:text-white hover:bg-white/10 border border-transparent'
                            : 'text-gray-600 hover:text-primary hover:bg-primary/5 border border-transparent'
                          }
                        `}
                      >
                        {isActive && (
                          <motion.div
                            layoutId="activeTabMobile"
                            className={`absolute inset-0 ${isDark ? 'bg-primary/10' : 'bg-primary/5'} rounded-xl`}
                            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                          />
                        )}
                        
                        <div className={`relative z-10 p-2 rounded-lg ${isActive ? (isDark ? 'bg-primary/20' : 'bg-primary/10') : (isDark ? 'bg-white/5' : 'bg-gray-100')} transition-colors`}>
                          <Icon
                            className={`
                              relative z-10
                              ${isActive ? 'text-primary' : (isDark ? 'text-white/60 group-hover:text-primary' : 'text-gray-600 group-hover:text-primary')}
                              transition-colors
                            `}
                            size={18}
                          />
                        </div>
                        <span className={`relative z-10 font-semibold text-sm ${isActive ? textColor : textMuted}`}>
                          {item.label}
                        </span>
                        {isActive && (
                          <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            className={`absolute right-3 w-2 h-2 rounded-full ${isDark ? 'bg-primary' : 'bg-primary'} shadow-lg`}
                          />
                        )}
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>

              {/* User Info & Logout */}
              <div className={`p-3 sm:p-4 border-t ${borderColor} space-y-2 sm:space-y-3 ${isDark ? 'bg-gray-800/30' : 'bg-gray-50/50'} backdrop-blur-sm`}>
                <div className={`px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl ${isDark ? 'bg-gray-800/50' : 'bg-white'} border ${borderColor}`}>
                  <p className={`text-xs ${textMuted} mb-2 uppercase tracking-wider font-semibold`}>Logged in as</p>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary via-blue-600 to-indigo-600 flex items-center justify-center shadow-lg flex-shrink-0">
                      <span className="text-white font-bold text-xs">{user?.name?.charAt(0) || 'A'}</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className={`text-sm font-bold ${textColor} truncate`}>{user?.name || 'Admin'}</p>
                      <p className={`text-xs ${textMuted} truncate`}>{user?.email}</p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className={`w-full flex items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl ${isDark ? 'text-white/60 hover:text-red-400 hover:bg-red-500/10' : 'text-gray-700 hover:text-red-600 hover:bg-red-50'} border ${borderColor} transition-all duration-300 group font-semibold text-sm`}
                >
                  <div className={`p-1.5 rounded-lg ${isDark ? 'bg-red-500/10 group-hover:bg-red-500/20' : 'bg-red-50 group-hover:bg-red-100'} transition-colors`}>
                    <FiLogOut className="text-red-500 group-hover:rotate-12 transition-transform duration-300" size={16} />
                  </div>
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar - Always visible on large screens */}
      <aside className={`hidden lg:flex inset-y-0 left-0 z-40 w-64 flex-shrink-0 ${sidebarBg} border-r ${borderColor} flex-col shadow-xl backdrop-blur-xl relative overflow-hidden fixed h-screen`}>
        {/* Decorative gradient background */}
        <div className={`absolute inset-0 bg-gradient-to-br ${isDark ? 'from-cyan-500/5 via-transparent to-pink-500/5' : 'from-blue-500/5 via-transparent to-indigo-500/5'} opacity-50`} />
        <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br ${isDark ? 'from-cyan-500/10' : 'from-blue-500/10'} to-transparent rounded-full blur-3xl`} />
        
        {/* Logo */}
        <div className={`flex items-center justify-between gap-3 px-6 py-4 border-b ${borderColor} relative z-10`}>
          <div className="flex items-center gap-3">
            <img 
              src="/player.svg" 
              alt="Infinity Logo" 
              className="w-10 h-10"
            />
            <div>
              <h2 className={`text-xl font-extrabold bg-gradient-to-r from-primary via-blue-600 to-indigo-600 bg-clip-text text-transparent`}>
                INFINITY
              </h2>
              <p className={`text-xs ${textMuted}`}>Admin Panel</p>
            </div>
          </div>
          <Link
            to="/"
            className={`p-2 rounded-lg transition ${isDark ? 'hover:bg-white/10 text-white/60 hover:text-white' : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'}`}
            title="Go to Home"
          >
            <FiHome size={20} />
          </Link>
        </div>

        {/* Navigation */}
        <nav className="relative z-10 flex-1 p-4 space-y-2 overflow-y-auto">
          <div className="mb-4 px-2">
            <p className={`text-xs ${textMuted} font-semibold uppercase tracking-wider`}>Menu</p>
          </div>
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || 
              (item.path !== '/admin' && location.pathname.startsWith(item.path));

            return (
              <motion.div
                key={item.path}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ x: 4 }}
              >
                <Link
                  to={item.path}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-xl
                    transition-all duration-300
                    group relative overflow-hidden
                    ${isActive
                      ? isDark
                        ? 'bg-gradient-to-r from-primary/20 via-blue-600/20 to-indigo-600/20 text-white border border-primary/40 shadow-lg'
                        : 'bg-gradient-to-r from-primary/10 via-blue-600/10 to-indigo-600/10 text-primary border border-primary/30 shadow-md'
                      : isDark
                      ? 'text-white/60 hover:text-white hover:bg-white/10 border border-transparent'
                      : 'text-gray-600 hover:text-primary hover:bg-primary/5 border border-transparent'
                    }
                  `}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className={`absolute inset-0 ${isDark ? 'bg-primary/10' : 'bg-primary/5'} rounded-xl`}
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  
                  <div className={`relative z-10 p-2 rounded-lg ${isActive ? (isDark ? 'bg-primary/20' : 'bg-primary/10') : (isDark ? 'bg-white/5' : 'bg-gray-100')} transition-colors`}>
                    <Icon
                      className={`
                        relative z-10
                        ${isActive ? 'text-primary' : (isDark ? 'text-white/60 group-hover:text-primary' : 'text-gray-600 group-hover:text-primary')}
                        transition-colors
                      `}
                      size={20}
                    />
                  </div>
                  <span className={`relative z-10 font-semibold ${isActive ? textColor : textMuted}`}>
                    {item.label}
                  </span>
                  {isActive && (
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      className={`absolute right-3 w-2 h-2 rounded-full ${isDark ? 'bg-primary' : 'bg-primary'} shadow-lg`}
                    />
                  )}
                </Link>
              </motion.div>
            );
          })}
        </nav>

        {/* User Info & Logout */}
        <div className={`relative z-10 p-4 border-t ${borderColor} space-y-3 ${isDark ? 'bg-gray-800/30' : 'bg-gray-50/50'} backdrop-blur-sm`}>
          <div className={`px-4 py-3 rounded-xl ${isDark ? 'bg-gray-800/50' : 'bg-white'} border ${borderColor}`}>
            <p className={`text-xs ${textMuted} mb-2 uppercase tracking-wider font-semibold`}>Logged in as</p>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary via-blue-600 to-indigo-600 flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xs">{user?.name?.charAt(0) || 'A'}</span>
              </div>
              <div className="min-w-0 flex-1">
                <p className={`text-sm font-bold ${textColor} truncate`}>{user?.name || 'Admin'}</p>
                <p className={`text-xs ${textMuted} truncate max-w-[140px]`}>{user?.email}</p>
              </div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl ${isDark ? 'text-white/60 hover:text-red-400 hover:bg-red-500/10' : 'text-gray-700 hover:text-red-600 hover:bg-red-50'} border ${borderColor} transition-all duration-300 group font-semibold`}
          >
            <div className={`p-1.5 rounded-lg ${isDark ? 'bg-red-500/10 group-hover:bg-red-500/20' : 'bg-red-50 group-hover:bg-red-100'} transition-colors`}>
              <FiLogOut className="text-red-500 group-hover:rotate-12 transition-transform duration-300" size={18} />
            </div>
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
