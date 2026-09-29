import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppBar } from '../../layouts/AppBar';
import { CommuteMap } from '../../components/map/CommuteMap';
import { FilterChip } from '../../components/primitives/Segmented';
import { Button } from '../../components/primitives/Button';
import { Pill } from '../../components/primitives/Pill';
import { useAppStore } from '../../store/useAppStore';
import { Hotspot } from '../../types';
import { Users, MapPin, ShieldCheck, ChevronRight, Navigation, Clock } from 'lucide-react';
import { FeatureHelpButton } from '../../components/chat/FeatureHelpButton';

export const PeerMapPage: React.FC = () => {
  const navigate = useNavigate();
  const { hotspots, liveRide } = useAppStore();

  const [activeFilter, setActiveFilter] = useState<'all' | 'hotspots' | 'pods' | 'saferoute'>('all');
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot>(hotspots[0]);

  const corridorPolyline: [number, number][] = [
    [12.9774, 80.2212],
    [12.9805, 80.2238],
    [12.9840, 80.2270],
    [12.9875, 80.2305],
    [12.9915, 80.2337],
  ];

  return (
    <div className="flex-1 flex flex-col relative bg-bg text-text">
      <AppBar title="Corridor & Hotspot Map" showBack={false} />

      {/* Main Desktop / Mobile Responsive Container */}
      <div className="flex-1 p-3 sm:p-5 lg:p-6 flex flex-col">
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch min-h-0">
          {/* Left Column (4 cols on lg/xl): Filters & Hotspot List */}
          <div className="order-2 lg:order-1 lg:col-span-4 flex flex-col space-y-4">
            {/* Filter Chips Bar */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
              <FilterChip
                label="All Points"
                active={activeFilter === 'all'}
                onClick={() => setActiveFilter('all')}
              />
              <FilterChip
                label="Hotspots"
                active={activeFilter === 'hotspots'}
                onClick={() => setActiveFilter('hotspots')}
                icon={<MapPin size={14} />}
              />
              <FilterChip
                label="Pods"
                active={activeFilter === 'pods'}
                onClick={() => setActiveFilter('pods')}
                icon={<Users size={14} />}
              />
              <FilterChip
                label="Safe Route"
                active={activeFilter === 'saferoute'}
                onClick={() => setActiveFilter('saferoute')}
                icon={<ShieldCheck size={14} className="text-success" />}
              />
            </div>

            {/* Selected Hotspot Action Card */}
            <div className="bg-surface rounded-card border border-primary/30 p-4 sm:p-5 space-y-3.5 shadow-colored">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div>
                  <span className="text-primary font-bold text-[10px] uppercase tracking-wider">
                    SELECTED PICKUP POINT
                  </span>
                  <h3 className="text-text text-base sm:text-lg font-extrabold truncate">
                    {selectedHotspot.name}
                  </h3>
                  <span className="text-xs text-text-muted">
                    {selectedHotspot.category.toUpperCase().replace('_', ' ')} · {selectedHotspot.lit ? 'Lit & Safe' : 'Designated Stop'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <FeatureHelpButton question="How do Pickup Hotspots work?" label="Hotspot Guide" />
                  <Pill
                    variant={selectedHotspot.waitingCount > 0 ? 'waiting' : 'available'}
                    label={`${selectedHotspot.waitingCount} WAITING`}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs sm:text-sm text-text-muted py-2 border-y border-border">
                <span className="flex items-center gap-1 font-medium">
                  <Clock size={14} className="text-primary" />
                  <span>Avg Wait: {selectedHotspot.avgWaitMins} min</span>
                </span>
                <span className="text-success font-bold">
                  Confidence: {selectedHotspot.historicalConfidence}%
                </span>
              </div>

              <Button
                variant="primary"
                onClick={() => navigate(`/app/waiting/${selectedHotspot.id}`)}
                className="w-full text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 shadow-colored min-h-[44px]"
              >
                <span>I'm Waiting at this Hotspot</span>
                <ChevronRight size={16} />
              </Button>
            </div>

            {/* Hotspots Directory on Corridor */}
            <div className="flex-1 flex flex-col space-y-2 min-h-0">
              <span className="text-text-muted font-bold text-xs uppercase tracking-wider">
                ALL CHENNAI CORRIDOR HOTSPOTS ({hotspots.length})
              </span>
              <div className="flex-1 overflow-y-auto space-y-2 pr-1 max-h-[300px] lg:max-h-[calc(100vh-380px)] no-scrollbar">
                {hotspots.map((hs) => {
                  const isSelected = hs.id === selectedHotspot.id;
                  return (
                    <div
                      key={hs.id}
                      onClick={() => setSelectedHotspot(hs)}
                      className={`p-3.5 rounded-card border transition-all cursor-pointer flex items-center justify-between min-h-[48px] ${
                        isSelected
                          ? 'bg-primary/10 border-primary text-text shadow-sm'
                          : 'bg-surface hover:bg-surface-2 border-border text-text'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <MapPin size={16} className={isSelected ? 'text-primary' : 'text-text-muted'} />
                        <div className="truncate">
                          <h4 className="text-xs sm:text-sm font-bold text-text truncate">{hs.name}</h4>
                          <span className="text-[11px] text-text-muted">
                            {hs.category.toUpperCase().replace('_', ' ')} · {hs.lit ? 'Lit' : 'Safe'}
                          </span>
                        </div>
                      </div>
                      <Pill
                        variant={hs.waitingCount > 0 ? 'waiting' : 'neutral'}
                        label={`${hs.waitingCount}`}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column (8 cols on lg/xl): Full-Size Interactive Leaflet Map */}
          <div className="order-1 lg:order-2 lg:col-span-8 h-[360px] sm:h-[420px] lg:h-[calc(100vh-140px)] rounded-card overflow-hidden border border-border shadow-colored relative">
            <CommuteMap
              center={[selectedHotspot.lat, selectedHotspot.lng]}
              zoom={14}
              hotspots={hotspots}
              onHotspotSelect={(hs) => setSelectedHotspot(hs)}
              fuzzyCenter={[12.9815, 80.2180]}
              fuzzyZoneName="Velachery Commute Zone"
              routeCoordinates={
                activeFilter === 'saferoute' || activeFilter === 'all'
                  ? corridorPolyline
                  : undefined
              }
              vehiclePosition={liveRide?.currentRiderPosition}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
