import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppBar } from '../../layouts/AppBar';
import { CommuteMap } from '../../components/map/CommuteMap';
import { LiveNavCard } from '../../components/signature/LiveNavCard';
import { BottomSheet } from '../../components/primitives/BottomSheet';
import { SwipeConfirm } from '../../components/signature/SwipeConfirm';
import { Button } from '../../components/primitives/Button';
import { Pill } from '../../components/primitives/Pill';
import { useAppStore } from '../../store/useAppStore';
import { Hotspot } from '../../types';
import { QrCode, Pause, Play, Users } from 'lucide-react';

export const RiderRoutePage: React.FC = () => {
  const navigate = useNavigate();
  const { hotspots, liveRide } = useAppStore();

  const [isPaused, setIsPaused] = useState(false);
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const handleHotspotClick = (hs: Hotspot) => {
    setSelectedHotspot(hs);
    setSheetOpen(true);
  };

  const handleAcceptPickup = () => {
    setSheetOpen(false);
    navigate('/rider/scanner');
  };

  return (
    <div className="flex-1 flex flex-col font-mono relative bg-bg">
      <AppBar
        title="Active Route"
        showBack={false}
        rightAction={
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="h-9 px-3 rounded-btn bg-surface/80 backdrop-blur-sm border border-border text-xs text-text-2 hover:text-white flex items-center gap-1.5"
          >
            {isPaused ? <Play size={14} className="text-success" /> : <Pause size={14} className="text-warn" />}
            <span>{isPaused ? 'Resume' : 'Pause'}</span>
          </button>
        }
      />

      {/* Full-Bleed Route Map (Reference Image 1 Centre Phone Layout) */}
      <div className="flex-1 relative">
        <CommuteMap
          center={[12.9815, 80.2245]}
          zoom={14}
          routeCoordinates={[
            [12.9774, 80.2212],
            [12.9805, 80.2238],
            [12.9840, 80.2270],
            [12.9875, 80.2305],
            [12.9915, 80.2337],
          ]}
          vehiclePosition={liveRide?.currentRiderPosition || { lat: 12.9810, lng: 80.2245, heading: 45 }}
          hotspots={hotspots}
          onHotspotSelect={handleHotspotClick}
        />
      </div>

      {/* Bottom Live Nav Card (UI Spec §9.5) */}
      <div className="p-4 bg-bg border-t border-border z-30">
        <LiveNavCard
          instruction="Next pickup: Velachery Bypass Junction"
          distance="0.3 km"
          etaMins="2 MIN"
          arrivalTime="08:18 AM"
          progress={0.4}
        />
      </div>

      {/* Hotspot Pickup Sheet (UI Spec §9.5: "2 riders waiting · +1 min detour") */}
      <BottomSheet
        isOpen={sheetOpen}
        onClose={() => setSheetOpen(false)}
        title={selectedHotspot?.name || 'Hotspot Pickup'}
      >
        {selectedHotspot && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-label text-primary-soft">PICKUP OPPORTUNITY</span>
              <Pill variant="waiting" label={`${selectedHotspot.waitingCount} WAITING`} />
            </div>

            <div className="p-4 bg-surface-2 rounded-card border border-border space-y-2">
              <div className="text-white text-base font-semibold">
                {selectedHotspot.waitingCount} verified commuters waiting
              </div>
              <p className="text-xs text-text-2">
                Detour estimate: +1 min · Adds +0.4 km · Fuel cost recovery +Rs 28
              </p>
            </div>

            <div className="space-y-2 pt-2">
              <SwipeConfirm
                label="Accept Pickup · Open Scanner"
                onConfirm={handleAcceptPickup}
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSheetOpen(false)}
                className="w-full text-xs text-text-3"
              >
                Skip Hotspot
              </Button>
            </div>
          </div>
        )}
      </BottomSheet>
    </div>
  );
};
