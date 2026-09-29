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
      className={`flex items-center p-1 bg-surface-2 rounded-btn border border-border font-mono text-xs ${className}`}
    >
      {options.map((opt) => {
        const isActive = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-inner font-medium transition-all duration-150 outline-none ${
              isActive
                ? 'bg-primary text-white shadow-md'
                : 'text-text-3 hover:text-white hover:bg-surface/50'
            }`}
          >
            {opt.icon && <span>{opt.icon}</span>}
            <span>{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}

// Filter Chip (height 36, pill, off = surface, on = primary)
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
      className={`h-9 px-3.5 rounded-pill font-mono text-xs font-medium flex items-center gap-1.5 transition-all outline-none border ${
        active
          ? 'bg-primary text-white border-primary shadow-sm'
          : 'bg-surface text-text-2 border-border hover:bg-surface-2'
      }`}
    >
      {icon && <span>{icon}</span>}
      <span>{label}</span>
    </button>
  );
};
