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
import { QrCode, Pause, Play, Users, MapPin, Navigation } from 'lucide-react';

export const RiderRoutePage: React.FC = () => {
  const navigate = useNavigate();
  const { hotspots, liveRide } = useAppStore();

  const [isPaused, setIsPaused] = useState(false);
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(hotspots[0]);
  const [sheetOpen, setSheetOpen] = useState(false);

  const corridorPolyline: [number, number][] = [
    [12.9774, 80.2212],
    [12.9805, 80.2238],
    [12.9840, 80.2270],
    [12.9875, 80.2305],
    [12.9915, 80.2337],
  ];

  const handleHotspotClick = (hs: Hotspot) => {
    setSelectedHotspot(hs);
    setSheetOpen(true);
  };

  const handleAcceptPickup = () => {
    setSheetOpen(false);
    navigate('/rider/scanner');
  };

  return (
    <div className="flex-1 flex flex-col font-mono relative bg-bg text-text">
      <AppBar
        title="Active Route Navigation"
        showBack={false}
        rightAction={
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="h-9 px-3 rounded-btn bg-surface/80 backdrop-blur-sm border border-border text-xs text-text-2 hover:text-white flex items-center gap-1.5 transition-colors"
          >
            {isPaused ? <Play size={14} className="text-success" /> : <Pause size={14} className="text-warn" />}
            <span>{isPaused ? 'Resume' : 'Pause'}</span>
          </button>
        }
      />

      {/* Responsive Grid Container */}
      <div className="flex-1 p-3 sm:p-5 lg:p-6 flex flex-col">
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch min-h-0">
          {/* Left Column (4 cols on lg/xl): Navigation Controls & Upcoming Stops */}
          <div className="order-2 lg:order-1 lg:col-span-4 flex flex-col space-y-4">
            {/* Live Nav Card */}
            <LiveNavCard
              instruction="Next pickup: Velachery Bypass Junction"
              distance="0.3 km"
              etaMins="2 MIN"
              arrivalTime="08:18 AM"
              progress={0.4}
            />

            {/* Selected Hotspot Pickup Card */}
            {selectedHotspot && (
              <div className="bg-surface rounded-card border border-border p-4 space-y-3 shadow-lg">
                <div className="flex items-center justify-between">
                  <span className="font-label text-primary-soft text-[10px] uppercase">
                    PICKUP OPPORTUNITY
                  </span>
                  <Pill variant="waiting" label={`${selectedHotspot.waitingCount} WAITING`} />
                </div>

                <div className="space-y-1">
                  <h3 className="font-title-m text-white text-base font-semibold">
                    {selectedHotspot.name}
                  </h3>
                  <p className="text-xs text-text-2 leading-relaxed">
                    Detour estimate: +1 min · Adds +0.4 km · Fuel recovery +Rs 28
                  </p>
                </div>

                <Button
                  variant="success"
                  onClick={handleAcceptPickup}
                  className="w-full text-xs font-semibold flex items-center justify-center gap-2"
                >
                  <QrCode size={15} />
                  <span>Accept & Open QR Scanner</span>
                </Button>
              </div>
            )}

            {/* Stops Along Route */}
            <div className="flex-1 flex flex-col space-y-2 min-h-0">
              <span className="font-label text-text-3 text-[10px] uppercase">
                STOPS ALONG VELACHERY CORRIDOR
              </span>
              <div className="flex-1 overflow-y-auto space-y-2 pr-1 max-h-[280px] lg:max-h-[calc(100vh-380px)] no-scrollbar">
                {hotspots.map((hs) => {
                  const isSelected = selectedHotspot?.id === hs.id;
                  return (
                    <div
                      key={hs.id}
                      onClick={() => setSelectedHotspot(hs)}
                      className={`p-3 rounded-inner border transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'bg-success/15 border-success text-white'
                          : 'bg-surface hover:bg-surface-2 border-border text-text-2'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <MapPin size={14} className={isSelected ? 'text-success' : 'text-text-3'} />
                        <div className="truncate">
                          <h4 className="text-xs font-medium text-white truncate">{hs.name}</h4>
                          <span className="text-[10px] text-text-3">Detour: +0.4 km</span>
                        </div>
                      </div>
                      <Pill
                        variant={hs.waitingCount > 0 ? 'waiting' : 'neutral'}
                        label={`${hs.waitingCount} waiting`}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column (8 cols on lg/xl): Full-Size Interactive Route Map */}
          <div className="order-1 lg:order-2 lg:col-span-8 h-[360px] sm:h-[420px] lg:h-[calc(100vh-140px)] rounded-card overflow-hidden border border-border shadow-2xl relative">
            <CommuteMap
              center={[12.9815, 80.2245]}
              zoom={14}
              routeCoordinates={corridorPolyline}
              vehiclePosition={liveRide?.currentRiderPosition || { lat: 12.9810, lng: 80.2245, heading: 45 }}
              hotspots={hotspots}
              onHotspotSelect={handleHotspotClick}
            />
          </div>
        </div>
      </div>

      {/* Mobile Hotspot Pickup Sheet */}
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
                label="Swipe to Accept Pickup"
                onConfirm={handleAcceptPickup}
              />
            </div>
          </div>
        )}
      </BottomSheet>
    </div>
  );
};
