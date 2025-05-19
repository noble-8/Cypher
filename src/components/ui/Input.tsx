import React, { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input: React.FC<InputProps> = ({
  className = '',
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={props.id}
          className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
        >
          {label}
        </label>
      )}
      
      <div className="relative rounded-md shadow-sm">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500 dark:text-slate-400">
            {leftIcon}
          </div>
        )}
        
        <input
          className={`
            block w-full rounded-md 
            ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-slate-300 dark:border-slate-600 focus:border-primary-500 focus:ring-primary-500'}
            ${leftIcon ? 'pl-10' : 'pl-4'}
            ${rightIcon ? 'pr-10' : 'pr-4'}
            py-2 text-slate-900 dark:text-white
            bg-white dark:bg-slate-800
            focus:outline-none focus:ring-2 focus:ring-opacity-50
            disabled:bg-slate-100 dark:disabled:bg-slate-700 disabled:opacity-70
            ${className}
          `}
          {...props}
        />
        
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 dark:text-slate-400">
            {rightIcon}
          </div>
        )}
      </div>
      
      {(error || helperText) && (
        <p className={`mt-1 text-sm ${error ? 'text-red-500' : 'text-slate-500 dark:text-slate-400'}`}>
          {error || helperText}
        </p>
      )}
    </div>
  );
};

export default Input;