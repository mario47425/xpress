import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'flat' | 'glow' | 'inset' | 'sos' | 'default';
  className?: string;
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  variant = 'flat',
  className = '',
  children,
  ...props
}) => {
  const variantStyles = {
    flat: 'bg-surface rounded-card border border-border p-4 sm:p-5 shadow-card hover:shadow-card-hover transition-all duration-200',
    default: 'bg-surface rounded-card border border-border p-4 sm:p-5 shadow-card hover:shadow-card-hover transition-all duration-200',
    glow: 'card-glow rounded-card border border-primary/25 p-4 sm:p-5 shadow-card hover:shadow-card-hover transition-all duration-200',
    inset: 'bg-surface-2 rounded-inner border border-border-subtle p-3.5 sm:p-4',
    sos: 'card-sos-glow rounded-card border border-danger/30 p-4 sm:p-5 shadow-card',
  };

  return (
    <div className={`${variantStyles[variant]} ${className}`} {...props}>
      {children}
    </div>
  );
};
