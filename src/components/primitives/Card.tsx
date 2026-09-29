import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'flat' | 'glow' | 'inset' | 'sos';
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
    flat: 'bg-surface rounded-card border border-border p-4',
    glow: 'card-glow rounded-card border border-border p-4 shadow-xl',
    inset: 'bg-surface-2 rounded-inner border border-border/60 p-3.5',
    sos: 'card-sos-glow rounded-card border border-danger/40 p-4 shadow-xl',
  };

  return (
    <div className={`${variantStyles[variant]} ${className}`} {...props}>
      {children}
    </div>
  );
};
