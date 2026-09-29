import React from 'react';
import { Pill, PillVariant } from '../primitives/Pill';

export interface TaskCardProps {
  title: string;
  pillVariant?: PillVariant;
  pillLabel?: string;
  timeRange: string;
  subtitle: string;
  meta: string;
  onClick?: () => void;
  className?: string;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  title,
  pillVariant = 'available',
  pillLabel = 'AVAILABLE',
  timeRange,
  subtitle,
  meta,
  onClick,
  className = '',
}) => {
  return (
    <div
      onClick={onClick}
      className={`w-[290px] sm:w-[320px] bg-surface rounded-card border border-border p-4.5 flex flex-col justify-between shrink-0 select-none snap-start hover:border-primary/40 hover:-translate-y-0.5 shadow-colored transition-all cursor-pointer ${className}`}
    >
      <div className="flex items-start justify-between gap-2">
        <h4 className="text-text text-sm sm:text-base font-bold truncate flex-1">{title}</h4>
        {pillLabel && <Pill variant={pillVariant} label={pillLabel} />}
      </div>

      <div className="my-2.5 space-y-1">
        <div className="text-text text-base sm:text-lg font-bold">{timeRange}</div>
        <div className="text-xs text-text-muted">{subtitle}</div>
      </div>

      <div className="pt-2.5 border-t border-border text-[11px] font-semibold text-primary truncate">
        {meta}
      </div>
    </div>
  );
};

// Horizontal Task Card Carousel
export const TaskCarousel: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => {
  return (
    <div
      className={`flex items-center gap-3.5 overflow-x-auto no-scrollbar snap-x snap-mandatory py-2 px-1 -mx-1 ${className}`}
    >
      {children}
    </div>
  );
};
