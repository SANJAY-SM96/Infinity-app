'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

/**
 * Dynamic Navigation Menu Component
 * Built with Headless UI patterns and Framer Motion for animations
 * 
 * @param {Array} items - Navigation items array
 * @param {string} variant - 'horizontal' | 'vertical' | 'mobile'
 * @param {boolean} showIcons - Whether to show icons
 * @param {function} onItemClick - Callback when item is clicked
 */
export default function NavigationMenu({
  items = [],
  variant = 'horizontal',
  showIcons = false,
  onItemClick = null,
  className = '',
  itemClassName = '',
}) {
  const pathname = usePathname();
  const { isDark } = useTheme();
  const [activeItem, setActiveItem] = useState(null);
  const menuRef = useRef(null);

  // Determine active item based on current route
  useEffect(() => {
    const currentItem = items.find((item) => {
      if (item.to === pathname) return true;
      if (item.to !== '/' && pathname?.startsWith(item.to)) return true;
      return false;
    });
    setActiveItem(currentItem?.id || null);
  }, [pathname, items]);

  const baseClasses = variant === 'horizontal'
    ? 'flex items-center gap-2'
    : variant === 'vertical'
      ? 'flex flex-col space-y-1'
      : 'flex flex-col space-y-1';

  const itemBaseClasses = variant === 'horizontal'
    ? 'px-4 py-2 rounded-lg font-semibold text-sm transition-colors duration-200 relative'
    : variant === 'mobile'
      ? 'block py-3 px-4 rounded-lg font-semibold text-sm transition-all duration-200'
      : 'block py-3 px-4 rounded-lg font-semibold text-sm transition-all duration-200';

  const activeItemClasses = isDark
    ? 'text-white bg-white/10'
    : 'text-primary bg-primary/10';

  const inactiveItemClasses = isDark
    ? 'text-white/80 hover:text-white hover:bg-white/10'
    : 'text-slate-700 hover:text-primary hover:bg-primary/10';

  const handleItemClick = (item, event) => {
    if (onItemClick) {
      onItemClick(item, event);
    }
  };

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <nav
      ref={menuRef}
      className={`${baseClasses} ${className}`}
      role="navigation"
      aria-label="Main navigation"
    >
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = activeItem === item.id ||
          pathname === item.to ||
          (item.to !== '/' && pathname?.startsWith(item.to));

        const itemClasses = `${itemBaseClasses} ${itemClassName} ${isActive ? activeItemClasses : inactiveItemClasses
          }`;

        // Safeguard against missing to
        if (!item.to) {
          if (process.env.NODE_ENV === 'development') {
            console.warn('NavigationMenu: Missing to for item', item);
          }
          return null;
        }

        return (
          <motion.div
            key={item.id}
            whileHover={{ scale: variant === 'horizontal' ? 1.05 : 1.02 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <Link
              href={item.to}
              onClick={(e) => {
                handleItemClick(item, e);
              }}
              className={`${itemClasses} flex items-center gap-2`}
              aria-label={`Navigate to ${item.label} page`}
              aria-current={isActive ? 'page' : undefined}
            >
              {showIcons && Icon && (
                <Icon className="w-4 h-4" aria-hidden="true" />
              )}
              <span>{item.label}</span>
              {item.badge && (
                <span className="ml-2 px-2 py-0.5 text-xs font-bold rounded-full bg-primary text-white">
                  {item.badge}
                </span>
              )}
              {isActive && variant === 'horizontal' && (
                <motion.div
                  layoutId="activeIndicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"
                  initial={false}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
            </Link>
          </motion.div>
        );
      })}
    </nav>
  );
}

/**
 * Navigation Menu with Dropdown Support
 * For nested navigation items
 */
export function NavigationMenuWithDropdown({
  items = [],
  className = '',
}) {
  const pathname = usePathname();
  const { isDark } = useTheme();
  const [openDropdown, setOpenDropdown] = useState(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (openDropdown && !event.target.closest('.nav-dropdown')) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openDropdown]);

  return (
    <nav className={`flex items-center gap-2 ${className}`}>
      {items.map((item) => {
        if (item.children && item.children.length > 0) {
          // Item with dropdown
          return (
            <div key={item.id} className="relative nav-dropdown">
              <button
                onClick={() => setOpenDropdown(openDropdown === item.id ? null : item.id)}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors duration-200 flex items-center gap-2 ${isDark
                  ? 'text-white/80 hover:text-white hover:bg-white/10'
                  : 'text-slate-700 hover:text-primary hover:bg-primary/10'
                  }`}
              >
                {item.icon && <item.icon className="w-4 h-4" />}
                <span>{item.label}</span>
              </button>

              <AnimatePresence>
                {openDropdown === item.id && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={`absolute top-full left-0 mt-2 min-w-[200px] rounded-lg shadow-lg border z-50 ${isDark
                      ? 'bg-slate-800 border-slate-700'
                      : 'bg-white border-slate-200'
                      }`}
                  >
                    {item.children.map((child) => {
                      if (!child.to) return null;
                      return (
                        <Link
                          key={child.id}
                          href={child.to}
                          onClick={() => setOpenDropdown(null)}
                          className={`block px-4 py-2 text-sm transition-colors ${isDark
                            ? 'text-white/80 hover:text-white hover:bg-white/10'
                            : 'text-slate-700 hover:text-primary hover:bg-primary/10'
                            }`}
                        >
                          {child.label}
                        </Link>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        } else {
          // Regular navigation item
          return (
            <NavigationMenu
              key={item.id}
              items={[item]}
              variant="horizontal"
              showIcons={!!item.icon}
            />
          );
        }
      })}
    </nav>
  );
}
