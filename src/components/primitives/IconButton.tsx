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
  // Mobile-first touch targets: minimum 44x44px
  const sizeClasses = size === 'sm' ? 'min-w-[44px] min-h-[44px] p-2.5' : 'min-w-[48px] min-h-[48px] p-3';

  const variantClasses = {
    surface: 'bg-surface border border-border text-text hover:bg-surface-2 hover:border-primary/30 shadow-sm',
    primary: 'bg-primary-gradient text-white hover:opacity-95 shadow-colored',
    danger: 'bg-danger/10 border border-danger/20 text-danger hover:bg-danger/20',
    ghost: 'bg-transparent text-text-muted hover:bg-surface-2 hover:text-text',
  };

  return (
    <button
      aria-label={ariaLabel}
      disabled={disabled}
      className={`rounded-button inline-flex items-center justify-center transition-all duration-200 active:scale-95 disabled:opacity-40 disabled:pointer-events-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none ${sizeClasses} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
