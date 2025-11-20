/**
 * Reusable Page Layout Component
 * Provides consistent page structure with header, content, and animations
 */

import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { commonClasses, getPageLayoutClasses, animationVariants, cn } from '../utils/designSystem';
import { FiArrowLeft } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

export default function PageLayout({
  children,
  title,
  subtitle,
  showBackButton = false,
  backPath,
  headerActions,
  className = '',
  containerClassName = '',
  headerClassName = '',
}) {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const layoutClasses = getPageLayoutClasses(isDark);

  return (
    <main className={cn(layoutClasses.wrapper, 'pt-20 sm:pt-24 pb-8 sm:pb-12', className)}>
      <div className={cn(commonClasses.container, containerClassName)}>
        {/* Header Section */}
        {(title || showBackButton || headerActions) && (
          <motion.header
            className={cn('mb-8 sm:mb-12', headerClassName)}
            variants={animationVariants.fadeIn}
            initial="initial"
            animate="animate"
          >
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="flex-1 min-w-0">
                {showBackButton && (
                  <motion.button
                    onClick={() => backPath ? navigate(backPath) : navigate(-1)}
                    className={cn(
                      'flex items-center gap-2 mb-4',
                      commonClasses.buttonGhost(isDark),
                      'text-sm'
                    )}
                    whileHover={{ x: -4 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FiArrowLeft className="w-4 h-4" />
                    Back
                  </motion.button>
                )}
                {title && (
                  <motion.h1
                    className={cn(commonClasses.heading1(isDark))}
                    variants={animationVariants.slideUp}
                  >
                    {typeof title === 'string' ? (
                      <span className={commonClasses.gradientText}>{title}</span>
                    ) : (
                      title
                    )}
                  </motion.h1>
                )}
                {subtitle && (
                  <motion.p
                    className={cn(commonClasses.textMuted(isDark), 'max-w-3xl')}
                    variants={animationVariants.slideUp}
                    transition={{ delay: 0.1 }}
                  >
                    {subtitle}
                  </motion.p>
                )}
              </div>
              {headerActions && (
                <motion.div
                  className="flex items-center gap-2 flex-shrink-0"
                  variants={animationVariants.slideUp}
                  transition={{ delay: 0.2 }}
                >
                  {headerActions}
                </motion.div>
              )}
            </div>
          </motion.header>
        )}

        {/* Content Section */}
        <motion.div
          variants={animationVariants.staggerContainer}
          initial="initial"
          animate="animate"
          className="w-full"
        >
          {children}
        </motion.div>
      </div>
    </main>
  );
}

