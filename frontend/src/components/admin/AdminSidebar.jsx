import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
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
  FiFileText
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

const menuItems = [
  { path: '/admin', icon: FiLayout, label: 'Dashboard' },
  { path: '/admin/projects', icon: FiPackage, label: 'Projects' },
  { path: '/admin/project-requests', icon: FiFileText, label: 'Project Requests' },
  { path: '/admin/orders', icon: FiShoppingBag, label: 'Orders' },
  { path: '/admin/users', icon: FiUsers, label: 'Users' },
  { path: '/admin/analytics', icon: FiBarChart2, label: 'Analytics' },
  { path: '/admin/settings', icon: FiSettings, label: 'Settings' }
];

export default function AdminSidebar({ isOpen, setIsOpen }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        />
      )}

      {/* Mobile Sidebar - Fixed Position */}
      <motion.aside
        initial={false}
        animate={{
          x: isOpen ? 0 : -280,
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="lg:hidden fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-dark-lighter via-dark-light to-dark border-r border-primary/20 flex flex-col shadow-2xl backdrop-blur-xl relative overflow-hidden"
      >
        {/* Mobile Sidebar Content */}
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-700/50">
            <img 
              src="/player.svg" 
              alt="Infinity Logo" 
              className="w-10 h-10"
            />
            <div>
              <h2 className="text-xl font-extrabold bg-gradient-to-r from-primary via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                INFINITY
              </h2>
              <p className="text-xs text-gray-400">Admin Panel</p>
            </div>
          </div>
          <div className="relative z-10 px-6 py-3 border-b border-primary/10 bg-dark-lighter/50 backdrop-blur-sm">
            <button
              onClick={() => setIsOpen(false)}
              className="w-full flex justify-end p-2 rounded-lg hover:bg-dark-light text-white/60 hover:text-white transition border border-primary/20 hover:border-primary/40"
            >
              <FiX size={20} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="relative z-10 flex-1 p-4 space-y-2 overflow-y-auto">
            <div className="mb-4 px-2">
              <p className="text-xs text-white/30 font-semibold uppercase tracking-wider mb-3">Menu</p>
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
                    onClick={() => setIsOpen(false)}
                    className={`
                      flex items-center gap-3 px-4 py-3 rounded-xl
                      transition-all duration-300
                      group relative overflow-hidden
                      ${isActive
                        ? 'bg-gradient-to-r from-cyan-500/20 via-pink-500/20 to-purple-500/20 text-white border border-primary/40 shadow-lg shadow-cyan-500/20'
                        : 'text-white/60 hover:text-white hover:bg-dark-light/50 border border-transparent hover:border-primary/20'
                      }
                    `}
                  >
                    {/* Active indicator glow */}
                    {isActive && (
                      <motion.div
                        layoutId="activeTabMobile"
                        className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-pink-500/10 to-purple-500/10 rounded-xl"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                    
                    {/* Hover effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/5 to-pink-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
                    
                    <div className={`relative z-10 p-2 rounded-lg ${isActive ? 'bg-primary/20' : 'bg-dark/30 group-hover:bg-primary/10'} transition-colors duration-300`}>
                      <Icon
                        className={`
                          relative z-10
                          ${isActive ? 'text-cyan-400' : 'text-white/60 group-hover:text-cyan-400'}
                          transition-colors duration-300
                        `}
                        size={20}
                      />
                    </div>
                    <span className={`relative z-10 font-semibold ${isActive ? 'text-white' : 'text-white/70'}`}>
                      {item.label}
                    </span>
                    {isActive && (
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        className="absolute right-3 w-2 h-2 rounded-full bg-cyan-400 shadow-lg shadow-cyan-400/50"
                      />
                    )}
                  </Link>
                </motion.div>
              );
            })}
          </nav>

          {/* User Info & Logout */}
          <div className="relative z-10 p-4 border-t border-primary/10 space-y-3 bg-dark-lighter/50 backdrop-blur-sm">
            <div className="px-4 py-3 rounded-xl bg-gradient-to-r from-dark-light/50 to-dark-lighter/50 border border-primary/20">
              <p className="text-xs text-white/40 mb-2 uppercase tracking-wider font-semibold">Logged in as</p>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-400 to-pink-500 flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-xs">{user?.name?.charAt(0) || 'A'}</span>
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{user?.name || 'Admin'}</p>
                  <p className="text-xs text-white/50 truncate max-w-[140px]">{user?.email}</p>
                </div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white/60 hover:text-red-400 bg-dark-light/30 hover:bg-red-500/10 border border-primary/10 hover:border-red-500/30 transition-all duration-300 group font-semibold"
            >
              <div className="p-1.5 rounded-lg bg-red-500/10 group-hover:bg-red-500/20 transition-colors">
                <FiLogOut className="group-hover:rotate-12 transition-transform duration-300" size={18} />
              </div>
              <span>Logout</span>
            </button>
          </div>
        </div>
      </motion.aside>

      {/* Desktop Sidebar - Conditional Width (w-64 when open, w-0 when closed) */}
      {isOpen && (
        <motion.aside
          initial={false}
          animate={{
            width: 256,
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="hidden lg:flex inset-y-0 left-0 z-50 w-64 flex-shrink-0 bg-gradient-to-b from-dark-lighter via-dark-light to-dark border-r border-primary/20 flex-col shadow-2xl backdrop-blur-xl relative overflow-hidden"
        >
        {/* Decorative gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-pink-500/5 opacity-50" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-cyan-500/10 to-transparent rounded-full blur-3xl" />
        
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-700/50">
          <img 
            src="/player.svg" 
            alt="Infinity Logo" 
            className="w-10 h-10"
          />
          <div>
            <h2 className="text-xl font-extrabold bg-gradient-to-r from-primary via-blue-600 to-indigo-600 bg-clip-text text-transparent">
              INFINITY
            </h2>
            <p className="text-xs text-gray-400">Admin Panel</p>
          </div>
        </div>
        <div className="relative z-10 px-6 py-3 border-b border-primary/10 bg-dark-lighter/50 backdrop-blur-sm">
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden w-full flex justify-end p-2 rounded-lg hover:bg-dark-light text-white/60 hover:text-white transition border border-primary/20 hover:border-primary/40"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="relative z-10 flex-1 p-4 space-y-2 overflow-y-auto">
          <div className="mb-4 px-2">
            <p className="text-xs text-white/30 font-semibold uppercase tracking-wider mb-3">Menu</p>
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
                  onClick={() => setIsOpen(false)}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-xl
                    transition-all duration-300
                    group relative overflow-hidden
                    ${isActive
                      ? 'bg-gradient-to-r from-cyan-500/20 via-pink-500/20 to-purple-500/20 text-white border border-primary/40 shadow-lg shadow-cyan-500/20'
                      : 'text-white/60 hover:text-white hover:bg-dark-light/50 border border-transparent hover:border-primary/20'
                    }
                  `}
                >
                  {/* Active indicator glow */}
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-pink-500/10 to-purple-500/10 rounded-xl"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  
                  {/* Hover effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/5 to-pink-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
                  
                  <div className={`relative z-10 p-2 rounded-lg ${isActive ? 'bg-primary/20' : 'bg-dark/30 group-hover:bg-primary/10'} transition-colors duration-300`}>
                    <Icon
                      className={`
                        relative z-10
                        ${isActive ? 'text-cyan-400' : 'text-white/60 group-hover:text-cyan-400'}
                        transition-colors duration-300
                      `}
                      size={20}
                    />
                  </div>
                  <span className={`relative z-10 font-semibold ${isActive ? 'text-white' : 'text-white/70'}`}>
                    {item.label}
                  </span>
                  {isActive && (
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      className="absolute right-3 w-2 h-2 rounded-full bg-cyan-400 shadow-lg shadow-cyan-400/50"
                    />
                  )}
                </Link>
              </motion.div>
            );
          })}
        </nav>

        {/* User Info & Logout */}
        <div className="relative z-10 p-4 border-t border-primary/10 space-y-3 bg-dark-lighter/50 backdrop-blur-sm">
          <div className="px-4 py-3 rounded-xl bg-gradient-to-r from-dark-light/50 to-dark-lighter/50 border border-primary/20">
            <p className="text-xs text-white/40 mb-2 uppercase tracking-wider font-semibold">Logged in as</p>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-400 to-pink-500 flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xs">{user?.name?.charAt(0) || 'A'}</span>
              </div>
              <div>
                <p className="text-sm font-bold text-white">{user?.name || 'Admin'}</p>
                <p className="text-xs text-white/50 truncate max-w-[140px]">{user?.email}</p>
              </div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white/60 hover:text-red-400 bg-dark-light/30 hover:bg-red-500/10 border border-primary/10 hover:border-red-500/30 transition-all duration-300 group font-semibold"
          >
            <div className="p-1.5 rounded-lg bg-red-500/10 group-hover:bg-red-500/20 transition-colors">
              <FiLogOut className="group-hover:rotate-12 transition-transform duration-300" size={18} />
            </div>
            <span>Logout</span>
          </button>
        </div>
      </motion.aside>
      )}
    </>
  );
}

