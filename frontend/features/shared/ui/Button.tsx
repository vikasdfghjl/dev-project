import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'muted';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const ButtonComponent: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-primary hover:bg-primary-dark text-primary-foreground dark:bg-accent dark:hover:bg-primary-dark focus:ring-primary dark:focus:ring-offset-slate-800 shadow-sm',
    secondary: 'bg-muted hover:bg-muted/80 dark:bg-slate-700 dark:hover:bg-slate-600 text-foreground dark:text-slate-200 focus:ring-primary dark:focus:ring-offset-slate-800',
    ghost: 'hover:bg-muted dark:hover:bg-slate-800 text-foreground dark:text-slate-200 focus:ring-primary dark:focus:ring-offset-slate-800',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500 shadow-sm',
    muted: 'bg-muted hover:bg-muted/80 dark:bg-slate-700/50 dark:hover:bg-slate-600/50 text-muted-foreground dark:text-slate-400 focus:ring-primary dark:focus:ring-offset-slate-800'
  };
  
  const sizes = {
    sm: 'text-sm px-3 py-1.5',
    md: 'text-sm px-4 py-2',
    lg: 'text-base px-6 py-3'
  };
  
  const spinnerSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4', 
    lg: 'h-5 w-5'
  };

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <svg className={`animate-spin -ml-1 mr-2 ${spinnerSizes[size]}`} fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
          </svg>
          Loading...
        </>
      ) : (
        <>
          {leftIcon && <span className="mr-2">{leftIcon}</span>}
          {children}
          {rightIcon && <span className="ml-2">{rightIcon}</span>}
        </>
      )}
    </button>
  );
};

export const Button = React.memo(ButtonComponent);
