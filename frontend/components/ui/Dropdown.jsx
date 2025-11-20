import React, { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { useTheme } from '../../context/ThemeContext';
import { cn } from '../../utils/designSystem';

export default function Dropdown({
  trigger,
  items,
  align = 'left',
  className = '',
}) {
  const { isDark } = useTheme();

  const alignClasses = {
    left: 'left-0',
    right: 'right-0',
  };

  return (
    <Menu as="div" className={cn('relative inline-block text-left', className)}>
      <Menu.Button as={Fragment}>{trigger}</Menu.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items
          className={cn(
            'absolute z-50 mt-2 w-56 origin-top rounded-xl shadow-lg ring-1 ring-black/5 focus:outline-none',
            alignClasses[align],
            isDark
              ? 'bg-slate-800 border border-slate-700'
              : 'bg-white border border-slate-200',
            'py-1'
          )}
        >
          {items.map((item, index) => (
            <Menu.Item key={index}>
              {({ active }) => (
                <button
                  type="button"
                  onClick={item.onClick}
                  disabled={item.disabled}
                  className={cn(
                    'w-full text-left px-4 py-2 text-sm transition-colors',
                    active
                      ? isDark
                        ? 'bg-slate-700 text-slate-100'
                        : 'bg-slate-100 text-slate-900'
                      : isDark
                      ? 'text-slate-300'
                      : 'text-slate-700',
                    item.disabled && 'opacity-50 cursor-not-allowed',
                    item.danger &&
                      (active
                        ? 'text-red-600'
                        : isDark
                        ? 'text-red-400'
                        : 'text-red-600')
                  )}
                >
                  <div className="flex items-center gap-3">
                    {item.icon && <span className="text-base">{item.icon}</span>}
                    <span>{item.label}</span>
                  </div>
                </button>
              )}
            </Menu.Item>
          ))}
        </Menu.Items>
      </Transition>
    </Menu>
  );
}

