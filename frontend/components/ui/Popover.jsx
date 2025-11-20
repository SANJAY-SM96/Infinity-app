import React, { Fragment } from 'react';
import { Popover as HeadlessPopover, Transition } from '@headlessui/react';
import { useTheme } from '../../context/ThemeContext';
import { cn } from '../../utils/designSystem';

export default function Popover({
  trigger,
  children,
  position = 'bottom',
  className = '',
}) {
  const { isDark } = useTheme();

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  return (
    <HeadlessPopover className={cn('relative', className)}>
      <HeadlessPopover.Button as={Fragment}>{trigger}</HeadlessPopover.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-200"
        enterFrom="opacity-0 translate-y-1"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in duration-150"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 translate-y-1"
      >
        <HeadlessPopover.Panel
          className={cn(
            'absolute z-50 rounded-xl shadow-lg ring-1 ring-black/5 focus:outline-none',
            positionClasses[position],
            isDark
              ? 'bg-slate-800 border border-slate-700'
              : 'bg-white border border-slate-200',
            'p-4'
          )}
        >
          {children}
        </HeadlessPopover.Panel>
      </Transition>
    </HeadlessPopover>
  );
}

