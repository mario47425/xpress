import React from 'react';
import { ArrowUpRight, MapPin } from 'lucide-react';

export interface MapJumpRowProps {
  onJump: () => void;
  label?: string;
  previewName?: string;
  className?: string;
}

export const MapJumpRow: React.FC<MapJumpRowProps> = ({
  onJump,
  label = 'View on map',
  previewName = 'Corridor Active View',
  className = '',
}) => {
  return (
    <div
      onClick={onJump}
      className={`w-full h-[120px] sm:h-[136px] flex items-stretch gap-3 cursor-pointer select-none group ${className}`}
    >
      {/* Left 2/3: Mini Map Crop Visual Tile */}
      <div className="flex-[2] bg-surface-2 rounded-card border border-border relative overflow-hidden flex flex-col justify-end p-3.5 shadow-sm">
        {/* Abstract subtle grid lines and pin */}
        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#7C3AED_1.5px,transparent_1.5px)] [background-size:14px_14px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center animate-ping" />
          <div className="absolute w-6 h-6 rounded-full bg-surface border border-primary/30 flex items-center justify-center shadow-md text-primary">
            <MapPin size={14} className="fill-primary" />
          </div>
        </div>

        <span className="relative z-10 text-[11px] font-bold text-text bg-surface/90 px-2.5 py-1 rounded-full border border-border backdrop-blur-sm self-start truncate shadow-sm">
          {previewName}
        </span>
      </div>

      {/* Right 1/3: Primary Gradient Jump Action Tile */}
      <div className="flex-1 bg-primary-gradient hover:opacity-95 rounded-card flex flex-col items-center justify-center p-3 text-white transition-all shadow-colored active:scale-95">
        <ArrowUpRight size={28} className="mb-1.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        <span className="text-xs font-bold text-center leading-tight">
          {label}
        </span>
      </div>
    </div>
  );
};
