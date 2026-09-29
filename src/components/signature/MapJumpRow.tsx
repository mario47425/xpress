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
      className={`w-full h-[136px] flex items-stretch gap-2.5 font-mono cursor-pointer select-none group ${className}`}
    >
      {/* Left 2/3: Mini Map Crop Visual Tile */}
      <div className="flex-[2] bg-[#0F1120] rounded-inner border border-border relative overflow-hidden flex flex-col justify-end p-3">
        {/* Abstract dark map grid lines and pin */}
        <div className="absolute inset-0 opacity-25 bg-[radial-gradient(#283AAF_1px,transparent_1px)] [background-size:12px_12px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center animate-ping" />
          <div className="absolute w-5 h-5 rounded-full bg-white flex items-center justify-center shadow-lg text-primary">
            <MapPin size={12} className="fill-primary" />
          </div>
        </div>

        <span className="relative z-10 font-caption text-[11px] text-text-2 bg-surface/80 px-2 py-0.5 rounded-pill backdrop-blur-sm self-start truncate">
          {previewName}
        </span>
      </div>

      {/* Right 1/3: Indigo Jump Action Tile */}
      <div className="flex-1 bg-primary group-hover:bg-primary-hover rounded-inner flex flex-col items-center justify-center p-3 text-white transition-all shadow-[0_4px_16px_rgba(40,58,175,0.3)] active:scale-98">
        <ArrowUpRight size={32} className="mb-2 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        <span className="font-label text-[11px] font-semibold text-center leading-tight">
          {label}
        </span>
      </div>
    </div>
  );
};
