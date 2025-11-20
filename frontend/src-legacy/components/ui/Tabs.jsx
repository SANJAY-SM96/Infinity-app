import React from 'react';
import { Tab } from '@headlessui/react';
import { useTheme } from '../../context/ThemeContext';
import { cn } from '../../utils/designSystem';

export default function Tabs({ tabs, defaultIndex = 0, className = '' }) {
  const { isDark } = useTheme();

  return (
    <Tab.Group defaultIndex={defaultIndex}>
      <Tab.List
        className={cn(
          'flex space-x-1 rounded-xl p-1',
          isDark ? 'bg-slate-800' : 'bg-slate-100',
          className
        )}
      >
        {tabs.map((tab, index) => (
          <Tab
            key={index}
            className={({ selected }) =>
              cn(
                'w-full rounded-lg py-2.5 text-sm font-medium leading-5 transition-all',
                'ring-white/60 ring-offset-2 ring-offset-primary focus:outline-none focus:ring-2',
                selected
                  ? isDark
                    ? 'bg-primary text-white shadow'
                    : 'bg-white text-primary shadow'
                  : isDark
                  ? 'text-slate-400 hover:bg-slate-700 hover:text-slate-100'
                  : 'text-slate-600 hover:bg-white/[0.12] hover:text-slate-900'
              )
            }
          >
            <div className="flex items-center justify-center gap-2">
              {tab.icon && <span>{tab.icon}</span>}
              <span>{tab.label}</span>
            </div>
          </Tab>
        ))}
      </Tab.List>
      <Tab.Panels className="mt-4">
        {tabs.map((tab, index) => (
          <Tab.Panel key={index}>{tab.content}</Tab.Panel>
        ))}
      </Tab.Panels>
    </Tab.Group>
  );
}

