import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppBar } from '../../layouts/AppBar';
import { Pill } from '../../components/primitives/Pill';
import { Card } from '../../components/primitives/Card';
import { FieldBlock, FieldGrid } from '../../components/primitives/FieldBlock';
import { MapJumpRow } from '../../components/signature/MapJumpRow';
import { TaskCard, TaskCarousel } from '../../components/signature/TaskCard';
import { SwipeConfirm } from '../../components/signature/SwipeConfirm';
import { SOSShield } from '../../components/signature/SOSShield';
import { CommuteMap } from '../../components/map/CommuteMap';
import { useAppStore } from '../../store/useAppStore';
import { QrCode, Pause, Play, CheckCircle } from 'lucide-react';

export const ActiveDrive: React.FC = () => {
  const { rideId } = useParams();
  const navigate = useNavigate();
  const { liveRide, hotspots } = useAppStore();

  const [isPaused, setIsPaused] = useState(false);
  const [showFullMap, setShowFullMap] = useState(false);
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
        title="My Drive"
        pill={<Pill variant="progress" label={isPaused ? 'PAUSED' : 'IN PROGRESS'} />}
        rightAction={
          <button
            onClick={() => navigate('/rider/scanner')}
            aria-label="Open Scanner"
            className="w-11 h-11 rounded-inner bg-surface border border-border flex items-center justify-center text-primary-soft hover:bg-surface-2 transition-all"
          >
            <QrCode size={18} />
          </button>
        }
      />

      <div className="flex-1 overflow-y-auto p-5 space-y-4 pb-24 no-scrollbar">
        {/* Current Active Task Card (UI Spec §9.8 & Reference Image 2) */}
        <div className="space-y-1.5">
          <span className="font-label text-text-3 text-[11px] uppercase">
            Current Task
          </span>
          <Card variant="glow" className="space-y-3.5">
            <div className="flex items-center justify-between">
              <h3 className="font-title-m text-white text-base font-semibold">
                Drop off #{ride.id.replace('ride-', '')}
              </h3>
              <Pill variant="progress" label="IN PROGRESS" />
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

        {/* Map Jump Row (UI Spec §6.8) */}
        {!showFullMap ? (
          <MapJumpRow
            previewName="Velachery → IIT Madras Corridor"
            onJump={() => setShowFullMap(true)}
          />
        ) : (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-label text-primary-soft">CORRIDOR LIVE MAP</span>
              <button
                onClick={() => setShowFullMap(false)}
                className="font-caption text-xs text-text-3 underline"
              >
                Collapse
              </button>
            </div>
            <div className="w-full h-52 rounded-card overflow-hidden border border-border relative shadow-lg">
              <CommuteMap
                center={[12.9815, 80.2245]}
                zoom={14}
                routeCoordinates={ride.routePolyline}
                vehiclePosition={ride.currentRiderPosition}
                hotspots={hotspots}
              />
            </div>
          </div>
        )}

        {/* Secondary Action: Pause Trip Ghost Button (UI Spec §2 & §9.8) */}
        <button
          onClick={() => setIsPaused(!isPaused)}
          className="w-full py-3 px-4 rounded-btn bg-surface hover:bg-surface-2 border border-border text-xs text-text-2 hover:text-white flex items-center justify-center gap-2 transition-all"
        >
          {isPaused ? <Play size={16} className="text-success" /> : <Pause size={16} className="text-warn" />}
          <span>{isPaused ? 'Resume Shift / Trip' : 'Pause Trip'}</span>
        </button>

        {/* Next Tasks / Pickups Carousel (UI Spec §9.8) */}
        <div className="space-y-2 pt-1">
          <span className="font-label text-text-2 text-[11px] uppercase">
            Next Tasks Along Route
          </span>
          <TaskCarousel>
            <TaskCard
              title="Pickup · Guindy Metro Bay 2"
              pillVariant="waiting"
              pillLabel="2 WAITING"
              timeRange="08:35 – 08:45"
              subtitle="2 riders · +0.4 km detour"
              meta="Passenger: Harish K. · TRUSTED"
              onClick={() => navigate('/rider/scanner')}
            />
            <TaskCard
              title="Pickup · Madhya Kailash"
              pillVariant="available"
              pillLabel="1 SEAT"
              timeRange="08:50 – 09:00"
              subtitle="Campus loop · +1 min detour"
              meta="Passenger: Priya D. · TRUSTED"
              onClick={() => navigate('/rider/scanner')}
            />
          </TaskCarousel>
        </div>

        {/* Swipe to Complete Drive (UI Spec §6.9) */}
        <div className="pt-2">
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

      {/* Floating SOS Shield */}
      <div className="absolute bottom-6 right-6 z-40">
        <SOSShield size="normal" />
      </div>
    </div>
  );
};
