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
      className={`card-glow rounded-card border border-border p-4.5 font-mono shadow-xl transition-all duration-220 ${
        collapsed ? 'h-24' : 'h-auto'
      } ${className}`}
    >
      {/* Top Header: Instruction + Collapse Chevron */}
      <div className="flex items-center justify-between">
        <span className="font-caption text-text-2 text-xs truncate">{instruction}</span>
        <button
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? 'Expand live navigation' : 'Collapse live navigation'}
          className="w-7 h-7 rounded-inner bg-surface-2/60 flex items-center justify-center text-text-3 hover:text-white transition-colors"
        >
          {collapsed ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
        </button>
      </div>

      {/* Main Metric: Direction Icon + Giant Display-XL Distance */}
      <div className="flex items-center gap-3.5 my-2">
        <div className="w-10 h-10 rounded-inner bg-primary/20 border border-primary/30 flex items-center justify-center text-primary-soft shrink-0">
          <DirectionIcon size={24} />
        </div>
        <div className="font-display-xl text-white tracking-tight leading-none text-4xl sm:text-5xl font-semibold">
          {distance}
        </div>
      </div>

      {/* Expanded View: Metrics Row & Tick Progress */}
      {!collapsed && (
        <div className="space-y-3 mt-3 pt-2 border-t border-border/40">
          <div className="flex items-center justify-between text-xs font-label text-text-2">
            <span>{totalKm}</span>
            <span>{etaMins}</span>
            <span className="text-white font-medium">{arrivalTime}</span>
          </div>

          <TickProgress
            value={progress}
            totalTicks={28}
            color="white"
          />
        </div>
      )}
    </div>
  );
};
