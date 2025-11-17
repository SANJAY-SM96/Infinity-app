import React from 'react';
import { motion } from 'framer-motion';
import { FiCode, FiDownload, FiShield, FiTrendingUp } from 'react-icons/fi';

export default function SignUpBranding({ isDark }) {
  const features = [
    { icon: FiCode, text: '500+ Verified IT Projects' },
    { icon: FiDownload, text: 'Instant Download & Lifetime Support' },
    { icon: FiTrendingUp, text: 'Sell Your Projects & Earn Money' },
    { icon: FiShield, text: 'Secure & Easy-to-Use Platform' }
  ];

  return (
    <div className={`relative h-full w-full flex flex-col justify-center p-8 md:p-12 lg:p-16 xl:p-20 ${
      isDark 
        ? 'bg-gradient-to-br from-gray-900 via-indigo-950/50 to-gray-900' 
        : 'bg-gradient-to-br from-indigo-900 via-blue-900 to-purple-900'
    }`}>
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Soft Lighting Effects */}
        <div className={`absolute top-0 left-0 w-96 h-96 rounded-full blur-3xl opacity-20 ${
          isDark ? 'bg-blue-500' : 'bg-blue-400'
        }`} />
        <div className={`absolute bottom-0 right-0 w-96 h-96 rounded-full blur-3xl opacity-20 ${
          isDark ? 'bg-purple-500' : 'bg-purple-400'
        }`} />
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-3xl opacity-10 ${
          isDark ? 'bg-indigo-500' : 'bg-indigo-400'
        }`} />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-lg">
        {/* Logo/Brand */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary via-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-primary/50">
              <img 
                src="/player.svg" 
                alt="Infinity Logo" 
                className="w-8 h-8"
              />
            </div>
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-white via-blue-100 to-indigo-200 bg-clip-text text-transparent">
              INFINITY
            </h1>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
            IT Project Marketplace
          </h2>
        </motion.div>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-base md:text-lg text-gray-200 mb-10 leading-relaxed"
        >
          Infinity is the leading marketplace where students can sell their academic projects and customers can purchase high-quality IT projects including React, Python, AI/ML, full-stack, and final-year projects. We provide instant downloads, lifetime support, secure payments, and verified project quality.
        </motion.p>

        {/* Features List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-5"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                className="flex items-center gap-4 group"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center group-hover:bg-white/20 transition-all duration-300">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-base md:text-lg font-medium text-white">
                  {feature.text}
                </span>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}
