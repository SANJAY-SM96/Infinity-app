import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function FloatingInput({
  label,
  type = 'text',
  name,
  value,
  onChange,
  onBlur,
  placeholder,
  icon: Icon,
  error,
  helperText,
  showPasswordToggle = false,
  isDark,
  required = false,
}) {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const inputRef = useRef(null);
  const hasValue = value && value.length > 0;
  const isActive = isFocused || hasValue;

  return (
    <div className="relative w-full space-y-1">
      <div className="relative w-full">
        {/* Icon */}
        {Icon && (
          <div
            className={`absolute left-4 top-1/2 z-10 flex items-center justify-center pointer-events-none ${
              error 
                ? 'text-red-500' 
                : isActive 
                  ? 'text-purple-500' 
                  : 'text-gray-400'
            }`}
            style={{ transform: 'translateY(-50%)' }}
          >
            <Icon className="w-5 h-5" />
          </div>
        )}

        {/* Input */}
        <input
          ref={inputRef}
          type={showPasswordToggle && type === 'password' ? (showPassword ? 'text' : 'password') : type}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={(e) => {
            setIsFocused(false);
            if (onBlur) onBlur(e);
          }}
          onFocus={() => setIsFocused(true)}
          required={required}
          placeholder={hasValue ? (placeholder || '') : `${label}${required ? ' *' : ''}`}
          className={`w-full ${
            error
              ? isDark
                ? 'bg-red-900/20 border-red-500 text-gray-200 placeholder-red-300 focus:bg-red-900/30 focus:border-red-400 focus:ring-0'
                : 'bg-red-50 border-red-500 text-gray-900 placeholder-red-400 focus:bg-red-50 focus:border-red-400 focus:ring-0'
              : isDark
                ? 'bg-[#111827] border-gray-700 text-gray-200 placeholder-gray-400 hover:border-gray-600 focus:bg-[#111827] focus:border-purple-500 focus:ring-0'
                : 'bg-[#111827] border-gray-700 text-gray-200 placeholder-gray-400 hover:border-gray-600 focus:bg-[#111827] focus:border-purple-500 focus:ring-0'
          } ${Icon ? 'pl-12' : 'pl-4'} ${
            showPasswordToggle ? 'pr-12' : 'pr-4'
          } py-4 rounded-xl border-2 focus:outline-none transition-all duration-200 text-sm sm:text-base shadow-sm hover:shadow-md`}
        />

        {/* Password Toggle */}
        {showPasswordToggle && type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className={`absolute right-4 top-1/2 p-1 rounded transition-colors flex items-center justify-center z-10 ${
              isDark 
                ? 'text-gray-400 hover:text-gray-300' 
                : 'text-gray-400 hover:text-gray-600'
            }`}
            style={{ transform: 'translateY(-50%)' }}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            <motion.div
              animate={{ rotate: showPassword ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {showPassword ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.29 3.29m0 0L6.878 6.878M3 3l18 18" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </motion.div>
          </button>
        )}
      </div>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-xs text-red-500 flex items-center gap-1.5 mt-1 ml-1"
          >
            <svg className="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span>{error}</span>
          </motion.p>
        )}
      </AnimatePresence>

      {/* Helper Text */}
      {helperText && !error && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xs text-gray-400 mt-1 ml-1"
        >
          {helperText}
        </motion.p>
      )}
    </div>
  );
}

