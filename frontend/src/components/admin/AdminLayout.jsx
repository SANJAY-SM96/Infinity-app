import React, { useState } from 'react';
import { motion } from 'framer-motion';
import AdminSidebar from './AdminSidebar';
import AdminNavbar from './AdminNavbar';
import { useTheme } from '../../context/ThemeContext';

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isDark } = useTheme();

  const bgClass = isDark 
    ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
    : 'bg-gradient-to-br from-white via-blue-50 to-indigo-50';

  return (
    <div className={`min-h-screen ${bgClass} flex relative overflow-hidden transition-colors duration-300`}>
      {/* Animated background gradient */}
      <div className={`fixed inset-0 bg-gradient-to-br ${isDark ? 'from-cyan-500/5 via-transparent to-pink-500/5' : 'from-blue-500/10 via-transparent to-indigo-500/10'} pointer-events-none`} />
      <div className={`fixed top-0 right-0 w-96 h-96 bg-gradient-to-br ${isDark ? 'from-cyan-500/10' : 'from-blue-500/20'} to-transparent rounded-full blur-3xl pointer-events-none`} />
      <div className={`fixed bottom-0 left-0 w-96 h-96 bg-gradient-to-tr ${isDark ? 'from-pink-500/10' : 'from-indigo-500/20'} to-transparent rounded-full blur-3xl pointer-events-none`} />
      
      {/* Sidebar */}
      <AdminSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:ml-0 relative z-10 min-w-0">
        {/* Navbar */}
        <AdminNavbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

        {/* Page Content */}
        <main className="flex-1 p-3 sm:p-4 lg:p-6 xl:p-8 overflow-y-auto relative overflow-x-hidden min-w-0">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="max-w-7xl mx-auto w-full"
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}

