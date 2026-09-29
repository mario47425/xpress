import React, { useState } from 'react';
import { ChevronDown, ChevronUp, CornerUpLeft, CornerUpRight, Navigation } from 'lucide-react';
import { TickProgress } from './TickProgress';

export interface LiveNavCardProps {
  instruction?: string;
  distance?: string;
  direction?: 'left' | 'right' | 'straight';
  totalKm?: string;
  etaMins?: string;
  arrivalTime?: string;
  progress?: number; // 0 to 1
  className?: string;
}

export const LiveNavCard: React.FC<LiveNavCardProps> = ({
  instruction = 'Turn left onto 100ft Road',
  distance = '0.4 km',
  direction = 'left',
  totalKm = '2.8 KM',
  etaMins = '17 MIN',
  arrivalTime = '11:06 AM',
  progress = 0.65,
  className = '',
}) => {
  const [collapsed, setCollapsed] = useState(false);

  const DirectionIcon =
    direction === 'left' ? CornerUpLeft : direction === 'right' ? CornerUpRight : Navigation;

  return (
    <div
      className={`bg-surface rounded-card border border-border p-4 sm:p-5 shadow-colored transition-all duration-200 ${
        collapsed ? 'h-24' : 'h-auto'
      } ${className}`}
    >
      {/* Top Header: Instruction + Collapse Chevron */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-text-muted text-xs sm:text-sm font-semibold truncate">{instruction}</span>
        <button
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? 'Expand live navigation' : 'Collapse live navigation'}
          className="min-w-[44px] min-h-[44px] rounded-button bg-surface-2 flex items-center justify-center text-text-muted hover:text-text transition-colors"
        >
          {collapsed ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
        </button>
      </div>

      {/* Main Metric: Direction Icon + Distance */}
      <div className="flex items-center gap-3.5 my-2">
        <div className="w-12 h-12 rounded-button bg-primary-gradient flex items-center justify-center text-white shrink-0 shadow-colored">
          <DirectionIcon size={24} />
        </div>
        <div className="text-3xl sm:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-primary-gradient">
          {distance}
        </div>
      </div>

      {/* Expanded View: Metrics Row & Tick Progress */}
      {!collapsed && (
        <div className="space-y-3 mt-3 pt-3 border-t border-border">
          <div className="flex items-center justify-between text-xs font-semibold text-text-muted">
            <span>{totalKm}</span>
            <span>{etaMins}</span>
            <span className="text-text font-bold">{arrivalTime}</span>
          </div>

          <TickProgress
            value={progress}
            totalTicks={28}
            color="primary"
          />
        </div>
      )}
    </div>
  );
};
