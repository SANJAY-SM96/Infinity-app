import React from 'react';
import { motion } from 'framer-motion';
import Card3D from './Card3D';
import { useTheme } from '../../context/ThemeContext';

/**
 * 3D Stats Card Component
 * Enhanced stats card with 3D effects and animations
 */
export default function StatsCard3D({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  trendValue,
  color = 'primary',
  delay = 0,
  onClick
}) {
  const { isDark } = useTheme();

  const colorClasses = {
    primary: {
      bg: isDark ? 'from-blue-500/20 to-blue-600/10' : 'from-blue-500/15 to-blue-600/8',
      border: 'border-blue-500/30',
      icon: 'text-blue-500',
      glow: 'shadow-blue-500/20',
    },
    success: {
      bg: isDark ? 'from-green-500/20 to-green-600/10' : 'from-green-500/15 to-green-600/8',
      border: 'border-green-500/30',
      icon: 'text-green-500',
      glow: 'shadow-green-500/20',
    },
    warning: {
      bg: isDark ? 'from-yellow-500/20 to-yellow-600/10' : 'from-yellow-500/15 to-yellow-600/8',
      border: 'border-yellow-500/30',
      icon: 'text-yellow-500',
      glow: 'shadow-yellow-500/20',
    },
    danger: {
      bg: isDark ? 'from-red-500/20 to-red-600/10' : 'from-red-500/15 to-red-600/8',
      border: 'border-red-500/30',
      icon: 'text-red-500',
      glow: 'shadow-red-500/20',
    },
    purple: {
      bg: isDark ? 'from-purple-500/20 to-purple-600/10' : 'from-purple-500/15 to-purple-600/8',
      border: 'border-purple-500/30',
      icon: 'text-purple-500',
      glow: 'shadow-purple-500/20',
    },
  };

  const colors = colorClasses[color] || colorClasses.primary;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
    >
      <Card3D
        intensity={10}
        onClick={onClick}
        className={`bg-gradient-to-br ${colors.bg} border-2 ${colors.border} ${colors.glow} shadow-2xl cursor-pointer h-full`}
      >
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <motion.div
              className={`p-3 rounded-xl bg-gradient-to-br ${colors.bg} border ${colors.border} ${colors.glow}`}
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: 'spring', stiffness: 400 }}
            >
              {Icon && <Icon className={`${colors.icon} w-6 h-6`} />}
            </motion.div>
            {trend && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: delay + 0.2, type: 'spring' }}
                className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${
                  trend === 'up'
                    ? 'bg-green-500/20 text-green-500 border border-green-500/30'
                    : 'bg-red-500/20 text-red-500 border border-red-500/30'
                }`}
              >
                <span>{trend === 'up' ? '↑' : '↓'}</span>
                <span>{trendValue}</span>
              </motion.div>
            )}
          </div>

          <div>
            <p className={`text-sm font-medium mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {title}
            </p>
            <motion.p
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: delay + 0.1, type: 'spring' }}
              className={`text-3xl font-extrabold ${isDark ? 'text-white' : 'text-gray-900'}`}
            >
              {value}
            </motion.p>
          </div>
        </div>
      </Card3D>
    </motion.div>
  );
}

