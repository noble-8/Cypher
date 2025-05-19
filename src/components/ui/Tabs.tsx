import React, { useState } from 'react';

interface TabItem {
  id: string;
  label: string;
}

interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (tabId: string) => void;
  className?: string;
  variant?: 'default' | 'pills';
}

const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onChange,
  className = '',
  variant = 'default',
}) => {
  const getTabClasses = (isActive: boolean) => {
    if (variant === 'pills') {
      return isActive 
        ? 'bg-primary-500 text-white rounded-full' 
        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full';
    }
    
    return isActive 
      ? 'border-b-2 border-primary-500 text-primary-600 dark:text-primary-400' 
      : 'text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-slate-100 hover:border-b-2 hover:border-slate-300 dark:hover:border-slate-600';
  };
  
  return (
    <div className={`${className}`}>
      <div className={`flex space-x-2 ${variant === 'default' ? 'border-b border-slate-200 dark:border-slate-700' : ''}`}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`
              px-4 py-2 font-medium text-sm
              transition-colors duration-200
              ${getTabClasses(activeTab === tab.id)}
              focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Tabs;