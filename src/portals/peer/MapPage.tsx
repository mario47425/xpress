import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppBar } from '../../layouts/AppBar';
import { CommuteMap } from '../../components/map/CommuteMap';
import { FilterChip } from '../../components/primitives/Segmented';
import { Button } from '../../components/primitives/Button';
import { Pill } from '../../components/primitives/Pill';
import { useAppStore } from '../../store/useAppStore';
import { Hotspot } from '../../types';
import { Users, MapPin, ShieldCheck, ChevronRight } from 'lucide-react';

export const PeerMapPage: React.FC = () => {
  const navigate = useNavigate();
  const { hotspots, liveRide } = useAppStore();

  const [activeFilter, setActiveFilter] = useState<'all' | 'hotspots' | 'pods' | 'saferoute'>('all');
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot>(hotspots[0]);

  return (
    <div className="flex-1 flex flex-col font-mono relative bg-bg">
      <AppBar title="Corridor Map" showBack={false} />

      {/* Filter Chips Bar (UI Spec §8.3) */}
      <div className="absolute top-16 left-4 right-4 z-[400] flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        <FilterChip
          label="All Points"
          active={activeFilter === 'all'}
          onClick={() => setActiveFilter('all')}
        />
        <FilterChip
          label="Hotspots"
          active={activeFilter === 'hotspots'}
          onClick={() => setActiveFilter('hotspots')}
          icon={<MapPin size={12} />}
        />
        <FilterChip
          label="Pods"
          active={activeFilter === 'pods'}
          onClick={() => setActiveFilter('pods')}
          icon={<Users size={12} />}
        />
        <FilterChip
          label="Safe Route"
          active={activeFilter === 'saferoute'}
          onClick={() => setActiveFilter('saferoute')}
          icon={<ShieldCheck size={12} className="text-success" />}
        />
      </div>

      {/* Full-Bleed Map View */}
      <div className="flex-1 relative">
        <CommuteMap
          center={[selectedHotspot.lat, selectedHotspot.lng]}
          zoom={14}
          hotspots={hotspots}
          onHotspotSelect={(hs) => setSelectedHotspot(hs)}
          fuzzyCenter={[12.9815, 80.2180]}
          fuzzyZoneName="Velachery Commute Zone"
          routeCoordinates={
            activeFilter === 'saferoute' || activeFilter === 'all'
              ? [
                  [12.9774, 80.2212],
                  [12.9805, 80.2238],
                  [12.9840, 80.2270],
                  [12.9875, 80.2305],
                  [12.9915, 80.2337],
                ]
              : undefined
          }
          vehiclePosition={liveRide?.currentRiderPosition}
        />
      </div>

      {/* Bottom Peek Card (UI Spec §8.3 160px peek sheet) */}
      <div className="bg-surface border-t border-border p-4.5 space-y-3 z-30 shadow-2xl">
        <div className="flex items-center justify-between">
          <div>
            <span className="font-label text-primary-soft text-[10px] uppercase">
              SELECTED PICKUP HOTSPOT
            </span>
            <h3 className="font-title-m text-white text-base font-semibold truncate">
              {selectedHotspot.name}
            </h3>
          </div>
          <Pill
            variant={selectedHotspot.waitingCount > 0 ? 'waiting' : 'available'}
            label={`${selectedHotspot.waitingCount} WAITING`}
          />
        </div>

        <div className="flex items-center justify-between text-xs text-text-2 font-mono">
          <span>Est. Wait: {selectedHotspot.avgWaitMins} min</span>
          <span className="text-success">Confidence: {selectedHotspot.historicalConfidence}%</span>
        </div>

        <Button
          variant="primary"
          onClick={() => navigate(`/app/waiting/${selectedHotspot.id}`)}
          className="w-full text-sm font-semibold flex items-center justify-center gap-1.5"
        >
          <span>I'm Waiting at this Hotspot</span>
          <ChevronRight size={16} />
        </Button>
      </div>
    </div>
  );
};
