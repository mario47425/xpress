import React from 'react';

export interface SegmentOption<T extends string> {
  value: T;
  label: string;
  icon?: React.ReactNode;
}

export interface SegmentedProps<T extends string> {
  options: SegmentOption<T>[];
  value: T;
  onChange: (val: T) => void;
  className?: string;
}

export function Segmented<T extends string>({
  options,
  value,
  onChange,
  className = '',
}: SegmentedProps<T>) {
  return (
    <div
      className={`flex items-center p-1.5 bg-surface-2 rounded-card border border-border text-xs ${className}`}
    >
      {options.map((opt) => {
        const isActive = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`flex-1 min-h-[44px] flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-button font-medium transition-all duration-200 outline-none select-none ${
              isActive
                ? 'bg-primary-gradient text-white shadow-colored'
                : 'text-text-muted hover:text-text hover:bg-surface/60'
            }`}
          >
            {opt.icon && <span>{opt.icon}</span>}
            <span className="font-semibold">{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}

// Filter Chip (height min 44px touch target, pill, off = surface, on = primary gradient)
export interface FilterChipProps {
  label: string;
  active: boolean;
  onClick: () => void;
  icon?: React.ReactNode;
}

export const FilterChip: React.FC<FilterChipProps> = ({ label, active, onClick, icon }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`min-h-[44px] px-4 rounded-full text-xs font-semibold flex items-center gap-2 transition-all outline-none border active:scale-95 ${
        active
          ? 'bg-primary-gradient text-white border-transparent shadow-colored'
          : 'bg-surface text-text border-border hover:bg-surface-2 hover:border-primary/30 shadow-sm'
      }`}
    >
      {icon && <span>{icon}</span>}
      <span>{label}</span>
    </button>
  );
};
