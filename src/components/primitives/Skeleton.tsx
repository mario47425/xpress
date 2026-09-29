import React from 'react';

export interface SkeletonProps {
  className?: string;
  variant?: 'rectangular' | 'circular' | 'card';
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  variant = 'rectangular',
}) => {
  const variantStyles = {
    rectangular: 'rounded-inner',
    circular: 'rounded-full',
    card: 'rounded-card p-4 space-y-3',
  };

  if (variant === 'card') {
    return (
      <div className={`bg-surface border border-border ${variantStyles.card} ${className}`}>
        <div className="w-1/3 h-4 bg-surface-2 rounded-inner animate-pulse" />
        <div className="w-2/3 h-6 bg-surface-2 rounded-inner animate-pulse" />
        <div className="w-full h-10 bg-surface-2 rounded-inner animate-pulse" />
      </div>
    );
  }

  return (
    <div
      className={`bg-surface-2 animate-pulse ${variantStyles[variant]} ${className}`}
    />
  );
};
