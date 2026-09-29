import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
  loading?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'default',
  loading = false,
  disabled = false,
  className = '',
  children,
  ...props
}) => {
  const baseClasses =
    'relative inline-flex items-center justify-center font-sans font-semibold rounded-btn transition-all duration-200 outline-none select-none active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-40 disabled:pointer-events-none disabled:active:scale-100';

  const sizeClasses = {
    sm: 'min-h-[44px] h-11 px-4 text-xs',
    default: 'min-h-[48px] h-12 px-5 text-sm',
    lg: 'min-h-[56px] h-14 px-7 text-base',
  };

  const variantClasses = {
    primary:
      'bg-gradient-primary text-white shadow-md hover:shadow-gradient hover:brightness-105 active:brightness-95',
    secondary:
      'bg-surface hover:bg-surface-2 text-text border border-border hover:border-primary/40 shadow-xs',
    success:
      'bg-success hover:bg-success/90 text-white shadow-md active:brightness-95',
    danger:
      'bg-danger hover:bg-danger/90 text-white shadow-md active:brightness-95',
    ghost:
      'bg-transparent hover:bg-surface-2 text-text-2 hover:text-text',
  };

  return (
    <button
      disabled={disabled || loading}
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {loading ? (
        <span className="flex items-center gap-1.5 font-bold tracking-widest animate-pulse">
          <span className="w-1.5 h-1.5 rounded-full bg-current" />
          <span className="w-1.5 h-1.5 rounded-full bg-current" />
          <span className="w-1.5 h-1.5 rounded-full bg-current" />
        </span>
      ) : (
        children
      )}
    </button>
  );
};
