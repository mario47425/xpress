import React from 'react';

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  'aria-label': string;
  variant?: 'surface' | 'primary' | 'danger' | 'ghost';
  size?: 'default' | 'sm';
  children: React.ReactNode;
}

export const IconButton: React.FC<IconButtonProps> = ({
  'aria-label': ariaLabel,
  variant = 'surface',
  size = 'default',
  disabled = false,
  className = '',
  children,
  ...props
}) => {
  const sizeClasses = size === 'sm' ? 'w-10 h-10' : 'w-12 h-12'; // 48x48 default touch target

  const variantClasses = {
    surface: 'bg-surface border border-border text-text hover:bg-surface-2',
    primary: 'bg-primary text-white hover:bg-primary-hover shadow-md',
    danger: 'bg-danger/20 border border-danger/40 text-danger hover:bg-danger/30',
    ghost: 'bg-transparent text-text-2 hover:bg-surface hover:text-white',
  };

  return (
    <button
      aria-label={ariaLabel}
      disabled={disabled}
      className={`rounded-inner flex items-center justify-center transition-all duration-120 active:scale-95 disabled:opacity-40 disabled:pointer-events-none focus-visible:ring-2 focus-visible:ring-primary-soft ${sizeClasses} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
