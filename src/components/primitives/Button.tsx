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
    'relative inline-flex items-center justify-center font-mono font-medium rounded-btn transition-all duration-120 outline-none select-none active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-primary-soft focus-visible:ring-offset-2 focus-visible:ring-offset-bg disabled:opacity-40 disabled:pointer-events-none disabled:active:scale-100';

  const sizeClasses = {
    sm: 'h-10 px-4 text-xs',
    default: 'h-14 px-6 text-base', // 56px height per spec
    lg: 'h-16 px-8 text-lg',
  };

  const variantClasses = {
    primary: 'bg-primary hover:bg-primary-hover text-white shadow-[0_8px_24px_rgba(40,58,175,0.35)]',
    secondary: 'bg-surface hover:bg-surface-2 text-white border border-border',
    success: 'bg-success hover:bg-success/90 text-white shadow-[0_8px_20px_rgba(13,159,94,0.3)]',
    danger: 'bg-danger hover:bg-danger/90 text-white shadow-[0_8px_20px_rgba(229,72,77,0.3)]',
    ghost: 'bg-transparent hover:bg-surface-2 text-text-2 hover:text-white',
  };

  return (
    <button
      disabled={disabled || loading}
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {loading ? (
        <span className="flex items-center gap-1 font-mono text-xl tracking-widest animate-pulse">
          ···
        </span>
      ) : (
        children
      )}
    </button>
  );
};
