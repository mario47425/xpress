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
    progress: 'bg-emerald-50 text-emerald-700 border border-emerald-300 font-semibold',
    available: 'bg-violet-50 text-violet-700 border border-violet-200 font-semibold',
    waiting: 'bg-amber-50 text-amber-800 border border-amber-300 font-semibold',
    danger: 'bg-red-50 text-red-700 border border-red-300 font-semibold',
    neutral: 'bg-surface-2 text-text-2 border border-border font-medium',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 h-6 px-2.5 rounded-pill text-[11px] font-sans font-semibold tracking-wide select-none ${variantStyles[variant]} ${className}`}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span className="truncate">{label}</span>
    </span>
  );
};
