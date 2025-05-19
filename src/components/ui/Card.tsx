import React, { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
}

const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  title, 
  subtitle 
}) => {
  return (
    <div className={`bg-white dark:bg-slate-800 rounded-xl shadow-md overflow-hidden ${className}`}>
      {(title || subtitle) && (
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
          {title && <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200">{title}</h2>}
          {subtitle && <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{subtitle}</p>}
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  );
};

export default Card;