import React from 'react';

export type PillVariant = 'progress' | 'available' | 'waiting' | 'danger' | 'neutral';

export interface PillProps {
  variant?: PillVariant;
  label: string;
  className?: string;
  icon?: React.ReactNode;
}

export const Pill: React.FC<PillProps> = ({
  variant = 'neutral',
  label,
  className = '',
  icon,
}) => {
  const variantStyles: Record<PillVariant, string> = {
    progress: 'bg-success text-white',
    available: 'bg-info/30 border border-info text-[#A9C4FF]',
    waiting: 'bg-warn/20 text-warn border border-warn/30',
    danger: 'bg-danger/20 text-[#FF9A9E] border border-danger/30',
    neutral: 'bg-surface-2 text-text-2 border border-border',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 h-6 px-2.5 rounded-pill font-pill text-[11px] select-none ${variantStyles[variant]} ${className}`}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span className="truncate">{label}</span>
    </span>
  );
};
