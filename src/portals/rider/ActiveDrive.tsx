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
    <div className="flex-1 flex flex-col font-mono relative bg-bg text-text">
      <AppBar
        title="Active Drive Navigation"
        pill={<Pill variant="progress" label={isPaused ? 'PAUSED' : 'IN PROGRESS'} />}
        rightAction={
          <button
            onClick={() => navigate('/rider/scanner')}
            aria-label="Open Scanner"
            className="w-10 h-10 rounded-inner bg-surface border border-border flex items-center justify-center text-primary-soft hover:bg-surface-2 transition-all"
          >
            <QrCode size={18} />
          </button>
        }
      />

      <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 no-scrollbar">
        {/* Responsive 12-Column Desktop Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column (5 cols on lg/xl): Tasks, Passengers, Route Instructions */}
          <div className="lg:col-span-5 space-y-5">
            {/* Current Active Task Card (UI Spec §9.8) */}
            <div className="space-y-1.5">
              <span className="font-label text-text-3 text-[10px] uppercase">
                CURRENT NAVIGATION TASK
              </span>
              <Card variant="glow" className="space-y-3.5">
                <div className="flex items-center justify-between">
                  <h3 className="font-title-m text-white text-base font-semibold">
                    Drop off #{ride.id.replace('ride-', '')}
                  </h3>
                  <Pill variant="progress" label={isPaused ? 'PAUSED' : 'IN PROGRESS'} />
                </div>

                <div className="text-xs text-text-2">
                  08:15 – 08:30 · Corridor: Velachery → Guindy → IIT Madras
                </div>

                <FieldGrid columns={2} className="pt-2 border-t border-border/50">
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
              className="w-full py-3.5 px-4 bg-primary hover:bg-primary/90 text-white rounded-btn text-xs font-semibold flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-98"
            >
              <QrCode size={18} />
              <span>Verify Passenger Boarding Pass</span>
            </button>

            {/* Next Pickups Along Route */}
            <div className="space-y-2">
              <span className="font-label text-text-2 text-[10px] uppercase">
                UPCOMING CORRIDOR STOPS
              </span>
              <div className="space-y-2">
                <div className="p-3 bg-surface rounded-card border border-border flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-inner bg-primary/20 text-primary-soft flex items-center justify-center">
                      <MapPin size={16} />
                    </div>
                    <div>
                      <h4 className="text-white text-xs font-semibold">Guindy Metro Bay 2</h4>
                      <span className="text-[10px] text-text-3">2 commuters · +0.4 km detour</span>
                    </div>
                  </div>
                  <Pill variant="waiting" label="2 WAITING" />
                </div>

                <div className="p-3 bg-surface rounded-card border border-border flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-inner bg-success/20 text-success flex items-center justify-center">
                      <MapPin size={16} />
                    </div>
                    <div>
                      <h4 className="text-white text-xs font-semibold">IIT Madras Main Gate</h4>
                      <span className="text-[10px] text-text-3">Final destination</span>
                    </div>
                  </div>
                  <Pill variant="available" label="DESTINATION" />
                </div>
              </div>
            </div>

            {/* Pause Shift / Resume Shift Button */}
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="w-full py-3 px-4 rounded-btn bg-surface hover:bg-surface-2 border border-border text-xs text-text-2 hover:text-white flex items-center justify-center gap-2 transition-all"
            >
              {isPaused ? <Play size={16} className="text-success" /> : <Pause size={16} className="text-warn" />}
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
                <div className="p-4 bg-success/20 border border-success text-success rounded-btn flex items-center justify-center gap-2 font-bold text-sm">
                  <CheckCircle size={18} />
                  <span>Drive Completed · Fuel Cost Settled</span>
                </div>
              )}
            </div>
          </div>

          {/* Right Column (7 cols on lg/xl): Full-Size Interactive Corridor Map */}
          <div className="lg:col-span-7 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Navigation size={16} className="text-success animate-pulse" />
                <span className="font-label text-white text-xs">
                  CORRIDOR NAVIGATION MAP
                </span>
              </div>
              <span className="text-[11px] text-text-3 font-mono">
                Vehicle: Honda City (White)
              </span>
            </div>

            <div className="w-full h-[380px] lg:h-[560px] rounded-card overflow-hidden border border-border relative shadow-2xl">
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
