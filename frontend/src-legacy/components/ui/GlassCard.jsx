import React from 'react';
import { motion } from 'framer-motion';

export default function GlassCard({ children, className = '', isDark, ...props }) {
  return (
    <div className="relative group">
      {/* Gradient Border Container */}
      <div className={`absolute -inset-0.5 rounded-[2.6rem] opacity-75 blur-sm transition duration-1000 group-hover:duration-200 group-hover:opacity-100 ${isDark
        ? 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500'
        : 'bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400'
        }`} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`relative overflow-hidden rounded-[2.5rem] backdrop-blur-2xl shadow-2xl h-full ${isDark
          ? 'bg-slate-900/80 border-white/10 shadow-black/50'
          : 'bg-white/80 border-white/60 shadow-indigo-500/10'
          } ${className}`}
        {...props}
      >
        {/* Subtle Gradient Overlay */}
        <div className={`absolute inset-0 pointer-events-none opacity-50 ${isDark
          ? 'bg-gradient-to-b from-white/5 to-transparent'
          : 'bg-gradient-to-b from-white/40 to-transparent'
          }`} />

        {/* Content */}
        <div className="relative z-10">
          {children}
        </div>
      </motion.div>
    </div>
  );
}
