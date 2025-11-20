import React, { Fragment } from 'react';
import { Disclosure as HeadlessDisclosure } from '@headlessui/react';
import { FiChevronDown } from 'react-icons/fi';
import { useTheme } from '../../context/ThemeContext';
import { cn } from '../../utils/designSystem';

export default function Disclosure({
  items,
  defaultOpen = false,
  className = '',
}) {
  const { isDark } = useTheme();

  return (
    <div className={cn('space-y-2', className)}>
      {items.map((item, index) => (
        <HeadlessDisclosure
          key={index}
          defaultOpen={defaultOpen}
          as="div"
          className={cn(
            'rounded-xl border',
            isDark
              ? 'bg-slate-800 border-slate-700'
              : 'bg-white border-slate-200'
          )}
        >
          {({ open }) => (
            <>
              <HeadlessDisclosure.Button
                className={cn(
                  'flex w-full items-center justify-between px-4 py-3 text-left transition-colors',
                  isDark
                    ? 'hover:bg-slate-700'
                    : 'hover:bg-slate-50',
                  open &&
                    (isDark ? 'bg-slate-700' : 'bg-slate-50')
                )}
              >
                <span
                  className={cn(
                    'font-semibold',
                    isDark ? 'text-slate-100' : 'text-slate-900'
                  )}
                >
                  {item.title}
                </span>
                <FiChevronDown
                  className={cn(
                    'h-5 w-5 transition-transform',
                    open && 'transform rotate-180',
                    isDark ? 'text-slate-400' : 'text-slate-500'
                  )}
                />
              </HeadlessDisclosure.Button>
              <HeadlessDisclosure.Panel
                className={cn(
                  'px-4 pb-3 pt-2',
                  isDark ? 'text-slate-300' : 'text-slate-700'
                )}
              >
                {item.content}
              </HeadlessDisclosure.Panel>
            </>
          )}
        </HeadlessDisclosure>
      ))}
    </div>
  );
}

