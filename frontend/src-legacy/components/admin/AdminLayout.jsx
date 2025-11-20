import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AdminSidebar from './AdminSidebar';
import { useTheme } from '../../context/ThemeContext';

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isDark } = useTheme();

  // Close sidebar on mobile when clicking outside
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const bgClass = isDark 
    ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
    : 'bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/30';

  return (
    <div className={`min-h-screen ${bgClass} flex relative transition-colors duration-300 w-full overflow-x-hidden`}>
      {/* Animated background gradient - Mobile optimized */}
      <div className={`fixed inset-0 bg-gradient-to-br ${isDark ? 'from-cyan-500/5 via-transparent to-pink-500/5' : 'from-blue-500/5 via-transparent to-indigo-500/5'} pointer-events-none`} />
      <div className={`fixed top-0 right-0 w-64 h-64 sm:w-96 sm:h-96 bg-gradient-to-br ${isDark ? 'from-cyan-500/10' : 'from-blue-500/10'} to-transparent rounded-full blur-3xl pointer-events-none`} />
      <div className={`fixed bottom-0 left-0 w-64 h-64 sm:w-96 sm:h-96 bg-gradient-to-tr ${isDark ? 'from-pink-500/10' : 'from-indigo-500/10'} to-transparent rounded-full blur-3xl pointer-events-none`} />
      
      {/* Static Sidebar - Always visible on desktop */}
      <AdminSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Main Content - Adjusted for static sidebar */}
      <div className="flex-1 flex flex-col relative z-10 min-w-0 w-full lg:ml-64">
        {/* Page Content - Consistent spacing rhythm (4/6/8/12/16/24) */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden min-w-0 w-full">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="w-full"
            >
              {children}
            </motion.div>
          </div>
        </main>
      </div>

      {/* Mobile overlay for sidebar */}
      {sidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
        />
      )}
    </div>
  );
}
