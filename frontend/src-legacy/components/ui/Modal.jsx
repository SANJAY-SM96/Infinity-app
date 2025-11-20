import React, { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { FiX } from 'react-icons/fi';
import { useTheme } from '../../context/ThemeContext';
import { cn } from '../../utils/designSystem';

export default function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = 'md',
  showCloseButton = true,
  className = '',
}) {
  const { isDark } = useTheme();

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    '2xl': 'max-w-6xl',
    full: 'max-w-full mx-4',
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel
                className={cn(
                  'w-full transform overflow-hidden rounded-2xl text-left align-middle shadow-xl transition-all',
                  sizeClasses[size],
                  isDark
                    ? 'bg-slate-800 border border-slate-700'
                    : 'bg-white border border-slate-200',
                  className
                )}
              >
                {(title || showCloseButton) && (
                  <div
                    className={cn(
                      'flex items-center justify-between px-6 py-4 border-b',
                      isDark ? 'border-slate-700' : 'border-slate-200'
                    )}
                  >
                    <div>
                      {title && (
                        <Dialog.Title
                          as="h3"
                          className={cn(
                            'text-lg font-semibold leading-6',
                            isDark ? 'text-slate-100' : 'text-slate-900'
                          )}
                        >
                          {title}
                        </Dialog.Title>
                      )}
                      {description && (
                        <p
                          className={cn(
                            'mt-1 text-sm',
                            isDark ? 'text-slate-400' : 'text-slate-500'
                          )}
                        >
                          {description}
                        </p>
                      )}
                    </div>
                    {showCloseButton && (
                      <button
                        type="button"
                        onClick={onClose}
                        className={cn(
                          'rounded-lg p-2 transition-colors',
                          isDark
                            ? 'text-slate-400 hover:bg-slate-700 hover:text-slate-100'
                            : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
                        )}
                      >
                        <FiX className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                )}

                <div className="px-6 py-4">{children}</div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

