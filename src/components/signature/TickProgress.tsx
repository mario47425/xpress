import React from 'react';

export interface TickProgressProps {
  value: number; // 0 to 1
  totalTicks?: number;
  leftLabel?: string;
  midLabel?: string;
  rightLabel?: string;
  color?: 'white' | 'danger' | 'warn' | 'success';
  className?: string;
}

export const TickProgress: React.FC<TickProgressProps> = ({
  value,
  totalTicks = 32,
  leftLabel,
  midLabel,
  rightLabel,
  color = 'white',
  className = '',
}) => {
  const clamped = Math.max(0, Math.min(1, value));
  const activeCount = Math.round(clamped * totalTicks);

  const activeColorMap = {
    white: 'bg-white',
    danger: 'bg-danger',
    warn: 'bg-warn',
    success: 'bg-success',
  };

  return (
    <div className={`w-full flex flex-col gap-1.5 font-mono ${className}`}>
      {(leftLabel || midLabel || rightLabel) && (
        <div className="flex items-center justify-between text-[11px] font-label text-text-2 tracking-wider">
          <span>{leftLabel}</span>
          {midLabel && <span>{midLabel}</span>}
          <span>{rightLabel}</span>
        </div>
      )}

      {/* Barcode-style vertical ticks */}
      <div className="flex items-center justify-between gap-[3px] w-full h-4 overflow-hidden select-none">
        {Array.from({ length: totalTicks }).map((_, idx) => {
          const isActive = idx < activeCount;
          return (
            <div
              key={idx}
              className={`flex-1 h-full rounded-[1px] transition-colors duration-420 ${
                isActive ? activeColorMap[color] : 'bg-white/20'
              }`}
            />
          );
        })}
      </div>
    </div>
  );
};
