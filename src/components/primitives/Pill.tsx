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
    progress: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold',
    available: 'bg-primary/20 text-primary-soft border border-primary/40 font-bold',
    waiting: 'bg-amber-500/20 text-amber-400 border border-amber-500/40 font-bold',
    danger: 'bg-red-500/20 text-red-400 border border-red-500/40 font-bold',
    neutral: 'bg-surface-2 text-text-2 border border-border font-semibold',
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
