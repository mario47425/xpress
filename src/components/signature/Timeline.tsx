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
    <div className={`relative flex flex-col ${className}`}>
      {legs.map((leg, index) => {
        const isDone = index < currentLegIndex || leg.status === 'completed';
        const isCurrent = index === currentLegIndex && leg.status !== 'completed';

        return (
          <div key={index} className="relative flex items-start gap-4 pb-6 last:pb-0">
            {/* Connecting Vertical Line */}
            {index < legs.length - 1 && (
              <div
                className={`absolute left-[17px] top-8 bottom-0 w-[2px] transition-colors duration-300 ${
                  isDone ? 'bg-success' : 'bg-border'
                }`}
              />
            )}

            {/* Left Node Indicator */}
            <div className="relative z-10 flex items-center justify-center">
              <div
                className={`w-9 h-9 rounded-button flex items-center justify-center transition-all ${
                  isDone
                    ? 'bg-success/15 border border-success text-success'
                    : isCurrent
                    ? 'bg-primary-gradient text-white shadow-colored'
                    : 'bg-surface-2 border border-border text-text-muted'
                }`}
              >
                {isDone ? <Check size={18} /> : getModeIcon(leg.mode)}
              </div>

              {/* Pulsing ring for active current leg */}
              {isCurrent && (
                <div className="absolute inset-0 rounded-button border border-primary animate-ping opacity-50 pointer-events-none" />
              )}
            </div>

            {/* Leg Details Card */}
            <div
              className={`flex-1 p-4 rounded-card border transition-all ${
                isCurrent
                  ? 'bg-surface border-primary/50 shadow-colored'
                  : isDone
                  ? 'bg-surface border-border'
                  : 'bg-surface/60 border-border'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-primary uppercase">
                  Leg {leg.legNumber} · {leg.mode.toUpperCase()}
                </span>
                <span className="text-xs font-bold text-text">
                  Rs {leg.fare}
                </span>
              </div>

              <div className="mt-1 text-sm font-bold text-text truncate">
                {leg.startPointName} → {leg.endPointName}
              </div>

              <div className="flex items-center justify-between mt-2 text-xs text-text-muted">
                <span>{leg.plannedTime}</span>
                {leg.assignedRiderName && (
                  <span className="text-text font-medium">
                    Rider: {leg.assignedRiderName} ({leg.assignedVehiclePlate})
                  </span>
                )}
              </div>

              {/* Transit Bus Leg Geofence assist toggle */}
              {isCurrent && leg.mode === 'bus' && (
                <div className="mt-3 pt-2.5 border-t border-border flex items-center justify-between">
                  <span className="text-xs font-medium text-text-muted">Bus Leg Check-in</span>
                  <button
                    onClick={() => onBoardBusToggle && onBoardBusToggle(index)}
                    className="min-h-[44px] px-4 py-2 bg-primary-gradient text-white text-xs font-bold rounded-button shadow-colored hover:opacity-95 transition-all"
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
