import React from 'react';
import { motion } from 'framer-motion';
import { FiShoppingBag, FiUpload } from 'react-icons/fi';

export default function RoleSelector({ selectedRole, onSelect, isDark }) {
  const roles = [
    {
      id: 'student',
      label: 'Student',
      description: 'Request projects',
      icon: FiUpload,
    },
    {
      id: 'customer',
      label: 'Customer',
      description: 'Buy projects',
      icon: FiShoppingBag,
    }
  ];

  return (
    <div className="w-full space-y-3">
      <label className="block text-sm font-semibold mb-3 text-gray-200">
        I am registering as
      </label>
      <div className="grid grid-cols-2 gap-3 w-full">
        {roles.map((role) => {
          const Icon = role.icon;
          const isSelected = selectedRole === role.id;
          
          return (
            <motion.button
              key={role.id}
              type="button"
              onClick={() => onSelect(role.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`relative w-full p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                isSelected
                  ? 'border-purple-500 bg-purple-500/20 shadow-lg shadow-purple-500/20'
                  : 'border-gray-700 bg-gray-800/50 hover:border-gray-600 hover:bg-gray-800/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
                  isSelected
                    ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/50'
                    : isDark 
                      ? 'bg-gray-700 text-gray-400' 
                      : 'bg-gray-700 text-gray-400'
                }`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className={`font-semibold text-sm mb-0.5 ${
                    isSelected 
                      ? 'text-white'
                      : 'text-gray-200'
                  }`}>
                    {role.label}
                  </div>
                  <div className="text-xs text-gray-400">
                    {role.description}
                  </div>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
