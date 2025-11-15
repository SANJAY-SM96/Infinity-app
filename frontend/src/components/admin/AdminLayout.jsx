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
    <div className={`min-h-screen ${bgClass} flex relative transition-colors duration-300 w-full overflow-x-hidden`}>
      {/* Animated background gradient */}
      <div className={`fixed inset-0 bg-gradient-to-br ${isDark ? 'from-cyan-500/5 via-transparent to-pink-500/5' : 'from-blue-500/10 via-transparent to-indigo-500/10'} pointer-events-none`} />
      <div className={`fixed top-0 right-0 w-96 h-96 bg-gradient-to-br ${isDark ? 'from-cyan-500/10' : 'from-blue-500/20'} to-transparent rounded-full blur-3xl pointer-events-none`} />
      <div className={`fixed bottom-0 left-0 w-96 h-96 bg-gradient-to-tr ${isDark ? 'from-pink-500/10' : 'from-indigo-500/20'} to-transparent rounded-full blur-3xl pointer-events-none`} />
      
      {/* Sidebar */}
      <AdminSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Main Content - Clean Flex Structure */}
      <div className="flex-1 flex flex-col relative z-10 min-w-0 w-full">
        {/* Navbar */}
        <AdminNavbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

        {/* Page Content - Properly Centered Container */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden min-w-0 w-full">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 lg:py-6 xl:py-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              {children}
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}

