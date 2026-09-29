import React from 'react';
import { Car, Bus, Footprints, Train, Check } from 'lucide-react';
import { PassLeg } from '../../types';

export interface TimelineProps {
  legs: PassLeg[];
  currentLegIndex: number;
  className?: string;
  onBoardBusToggle?: (legIdx: number) => void;
}

export const Timeline: React.FC<TimelineProps> = ({
  legs,
  currentLegIndex,
  className = '',
  onBoardBusToggle,
}) => {
  const getModeIcon = (mode: string) => {
    switch (mode) {
      case 'bus':
        return <Bus size={18} />;
      case 'walk':
        return <Footprints size={18} />;
      case 'metro':
        return <Train size={18} />;
      default:
        return <Car size={18} />;
    }
  };

  return (
    <div className={`relative flex flex-col font-mono ${className}`}>
      {legs.map((leg, index) => {
        const isDone = index < currentLegIndex || leg.status === 'completed';
        const isCurrent = index === currentLegIndex && leg.status !== 'completed';
        const isUpcoming = index > currentLegIndex;

        return (
          <div key={index} className="relative flex items-start gap-4 pb-6 last:pb-0">
            {/* Connecting Vertical Line */}
            {index < legs.length - 1 && (
              <div
                className={`absolute left-[17px] top-8 bottom-0 w-[2px] transition-colors duration-420 ${
                  isDone ? 'bg-success' : 'bg-border'
                }`}
              />
            )}

            {/* Left Node Indicator */}
            <div className="relative z-10 flex items-center justify-center">
              <div
                className={`w-9 h-9 rounded-inner flex items-center justify-center transition-all ${
                  isDone
                    ? 'bg-success/20 border border-success text-success'
                    : isCurrent
                    ? 'bg-primary border border-primary-soft text-white shadow-lg'
                    : 'bg-surface-2 border border-border text-text-3'
                }`}
              >
                {isDone ? <Check size={18} /> : getModeIcon(leg.mode)}
              </div>

              {/* Pulsing ring for active current leg */}
              {isCurrent && (
                <div className="absolute inset-0 rounded-inner border border-primary-soft animate-ping opacity-60 pointer-events-none" />
              )}
            </div>

            {/* Leg Details Card */}
            <div
              className={`flex-1 p-3.5 rounded-inner border transition-all ${
                isCurrent
                  ? 'card-glow border-primary-soft/50 text-white'
                  : isDone
                  ? 'bg-surface border-border text-text-2'
                  : 'bg-surface/50 border-border/40 text-text-3'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-label text-[11px] text-primary-soft uppercase">
                  Leg {leg.legNumber} · {leg.mode.toUpperCase()}
                </span>
                <span className="text-xs font-semibold text-white">
                  Rs {leg.fare}
                </span>
              </div>

              <div className="mt-1 font-body-l text-sm font-medium text-white truncate">
                {leg.startPointName} → {leg.endPointName}
              </div>

              <div className="flex items-center justify-between mt-2 text-xs text-text-3">
                <span>{leg.plannedTime}</span>
                {leg.assignedRiderName && (
                  <span className="text-text-2">
                    Rider: {leg.assignedRiderName} ({leg.assignedVehiclePlate})
                  </span>
                )}
              </div>

              {/* Transit Bus Leg Geofence assist toggle */}
              {isCurrent && leg.mode === 'bus' && (
                <div className="mt-3 pt-2 border-t border-border flex items-center justify-between">
                  <span className="text-[11px] text-text-2">Bus Leg Check-in</span>
                  <button
                    onClick={() => onBoardBusToggle && onBoardBusToggle(index)}
                    className="px-3 py-1 bg-primary hover:bg-primary-hover text-white text-[11px] font-semibold rounded-pill"
                  >
                    I've Boarded Bus
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
