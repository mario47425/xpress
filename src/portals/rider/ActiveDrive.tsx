import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppBar } from '../../layouts/AppBar';
import { Pill } from '../../components/primitives/Pill';
import { Card } from '../../components/primitives/Card';
import { FieldBlock, FieldGrid } from '../../components/primitives/FieldBlock';
import { SwipeConfirm } from '../../components/signature/SwipeConfirm';
import { SOSShield } from '../../components/signature/SOSShield';
import { CommuteMap } from '../../components/map/CommuteMap';
import { useAppStore } from '../../store/useAppStore';
import { QrCode, Pause, Play, CheckCircle, Navigation, Users, MapPin } from 'lucide-react';

export const ActiveDrive: React.FC = () => {
  const { rideId } = useParams();
  const navigate = useNavigate();
  const { liveRide, hotspots } = useAppStore();

  const [isPaused, setIsPaused] = useState(false);
  const [driveCompleted, setDriveCompleted] = useState(false);

  const ride = liveRide || {
    id: rideId || 'ride-54266',
    status: 'IN_TRANSIT' as const,
    originName: 'Velachery Bypass Junction',
    destName: 'IIT Madras Main Gate',
    currentRiderPosition: { lat: 12.9810, lng: 80.2245, heading: 45 },
    routePolyline: [
      [12.9774, 80.2212],
      [12.9805, 80.2238],
      [12.9840, 80.2270],
      [12.9875, 80.2305],
      [12.9915, 80.2337],
    ] as [number, number][],
  };

  const handleCompleteDrive = () => {
    setDriveCompleted(true);
    setTimeout(() => {
      navigate('/rider');
    }, 1500);
  };

  return (
    <div className="flex-1 flex flex-col relative bg-bg text-text">
      <AppBar
        title="Active Drive Navigation"
        pill={<Pill variant="progress" label={isPaused ? 'PAUSED' : 'IN PROGRESS'} />}
        rightAction={
          <button
            onClick={() => navigate('/rider/scanner')}
            aria-label="Open Scanner"
            className="min-w-[44px] min-h-[44px] rounded-button bg-surface border border-border flex items-center justify-center text-primary hover:bg-surface-2 transition-all active:scale-95 shadow-sm"
          >
            <QrCode size={20} />
          </button>
        }
      />

      <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 no-scrollbar">
        {/* Responsive 12-Column Desktop Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column (5 cols on lg/xl): Tasks, Passengers, Route Instructions */}
          <div className="lg:col-span-5 space-y-5">
            {/* Current Active Task Card */}
            <div className="space-y-1.5">
              <span className="text-text-muted font-bold text-xs uppercase tracking-wider">
                CURRENT NAVIGATION TASK
              </span>
              <Card variant="default" className="space-y-4 p-5 sm:p-6 shadow-colored">
                <div className="flex items-center justify-between">
                  <h3 className="text-text text-base sm:text-lg font-extrabold">
                    Drop off #{ride.id.replace('ride-', '')}
                  </h3>
                  <Pill variant="progress" label={isPaused ? 'PAUSED' : 'IN PROGRESS'} />
                </div>

                <div className="text-xs sm:text-sm text-text-muted font-medium">
                  08:15 – 08:30 · Corridor: Velachery → Guindy → IIT Madras
                </div>

                <FieldGrid columns={2} className="pt-3 border-t border-border">
                  <FieldBlock
                    label="TIME TO DESTINATION"
                    value="11 min"
                    caption="ETA 08:26 AM"
                  />
                  <FieldBlock
                    label="DISTANCE LEFT"
                    value="2.6 km"
                    caption="Via 100ft Road"
                  />
                </FieldGrid>
              </Card>
            </div>

            {/* Quick Scanner Launch Button */}
            <button
              onClick={() => navigate('/rider/scanner')}
              className="w-full min-h-[48px] py-3.5 px-4 bg-primary-gradient hover:opacity-95 text-white rounded-button text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-colored transition-transform active:scale-98"
            >
              <QrCode size={18} />
              <span>Verify Passenger Boarding Pass</span>
            </button>

            {/* Next Pickups Along Route */}
            <div className="space-y-2">
              <span className="text-text-muted font-bold text-xs uppercase tracking-wider">
                UPCOMING CORRIDOR STOPS
              </span>
              <div className="space-y-2.5">
                <div className="p-3.5 bg-surface rounded-card border border-border flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-button bg-primary/10 text-primary flex items-center justify-center">
                      <MapPin size={18} />
                    </div>
                    <div>
                      <h4 className="text-text text-xs sm:text-sm font-bold">Guindy Metro Bay 2</h4>
                      <span className="text-xs text-text-muted">2 commuters · +0.4 km detour</span>
                    </div>
                  </div>
                  <Pill variant="waiting" label="2 WAITING" />
                </div>

                <div className="p-3.5 bg-surface rounded-card border border-border flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-button bg-success/15 text-success flex items-center justify-center">
                      <MapPin size={18} />
                    </div>
                    <div>
                      <h4 className="text-text text-xs sm:text-sm font-bold">IIT Madras Main Gate</h4>
                      <span className="text-xs text-text-muted">Final destination</span>
                    </div>
                  </div>
                  <Pill variant="available" label="DESTINATION" />
                </div>
              </div>
            </div>

            {/* Pause Shift / Resume Shift Button */}
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="w-full min-h-[44px] py-3 px-4 rounded-button bg-surface hover:bg-surface-2 border border-border text-xs sm:text-sm text-text font-bold flex items-center justify-center gap-2 transition-all active:scale-95 shadow-sm"
            >
              {isPaused ? <Play size={16} className="text-success" /> : <Pause size={16} className="text-accent" />}
              <span>{isPaused ? 'Resume Navigation Shift' : 'Pause Drive Shift'}</span>
            </button>

            {/* Swipe to Complete Drive */}
            <div className="pt-1">
              {!driveCompleted ? (
                <SwipeConfirm
                  label="Swipe to Complete Drive"
                  onConfirm={handleCompleteDrive}
                />
              ) : (
                <div className="p-4 bg-success/15 border border-success/30 text-success rounded-card flex items-center justify-center gap-2 font-bold text-sm shadow-sm">
                  <CheckCircle size={20} />
                  <span>Drive Completed · Fuel Cost Settled</span>
                </div>
              )}
            </div>
          </div>

          {/* Right Column (7 cols on lg/xl): Full-Size Interactive Corridor Map */}
          <div className="lg:col-span-7 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Navigation size={18} className="text-primary animate-pulse" />
                <span className="text-text font-bold text-xs sm:text-sm uppercase tracking-wider">
                  CORRIDOR NAVIGATION MAP
                </span>
              </div>
              <span className="text-xs text-text-muted font-medium">
                Vehicle: Honda City (White)
              </span>
            </div>

            <div className="w-full h-[380px] lg:h-[560px] rounded-card overflow-hidden border border-border relative shadow-colored">
              <CommuteMap
                center={[12.9815, 80.2245]}
                zoom={14}
                routeCoordinates={ride.routePolyline}
                vehiclePosition={ride.currentRiderPosition}
                hotspots={hotspots}
              />

              {/* Floating Emergency Shield inside map */}
              <div className="absolute bottom-4 right-4 z-[500]">
                <SOSShield size="normal" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
