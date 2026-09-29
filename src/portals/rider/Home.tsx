import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppBar } from '../../layouts/AppBar';
import { Card } from '../../components/primitives/Card';
import { Button } from '../../components/primitives/Button';
import { Pill } from '../../components/primitives/Pill';
import { CommuteMap } from '../../components/map/CommuteMap';
import { useAppStore } from '../../store/useAppStore';
import {
  Car,
  Zap,
  ArrowRight,
  ShieldCheck,
  QrCode,
  MapPin,
  Navigation,
  Fuel,
  Info,
  CheckCircle,
  Clock,
} from 'lucide-react';

export const RiderHome: React.FC = () => {
  const navigate = useNavigate();
  const {
    currentUser,
    predictions,
    liveRide,
    confirmPrediction,
    skipPrediction,
    hotspots,
  } = useAppStore();

  const [openingSeats, setOpeningSeats] = useState(false);
  const [extraSeatAdded, setExtraSeatAdded] = useState(false);

  // Rider's predicted trip for tomorrow
  const riderPred =
    predictions.find((p) => p.targetRole === 'rider' && p.status === 'proposed') ||
    predictions.find((p) => p.targetRole === 'rider') ||
    predictions[1] ||
    null;

  const handleOpenSeats = async (id: string) => {
    setOpeningSeats(true);
    await confirmPrediction(id);
    setOpeningSeats(false);
  };

  const handleSkip = async (id: string) => {
    await skipPrediction(id);
  };

  const corridorPolyline: [number, number][] = [
    [12.9774, 80.2212],
    [12.9805, 80.2238],
    [12.9840, 80.2270],
    [12.9875, 80.2305],
    [12.9915, 80.2337],
  ];

  return (
    <div className="flex-1 flex flex-col font-mono text-text">
      {/* Mobile-only AppBar */}
      <AppBar showBack={false} />

      <div className="p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Desktop Welcome Banner & Vehicle Owner Overview */}
        <div className="bg-surface rounded-card border border-border p-5 lg:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-caption text-text-3 text-xs uppercase tracking-wider">
                CHENNAI VEHICLE OWNER · VELACHERY CORRIDOR
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
            </div>
            <h2 className="font-title-m text-white text-xl sm:text-2xl font-bold">
              Good morning, {currentUser?.name.split(' ')[0] || 'Karthik'}
            </h2>
            <div className="flex flex-wrap items-center gap-3 text-xs text-text-2">
              <span className="text-white font-medium">Honda City · White · TN 09 AB 4821</span>
              <span>•</span>
              <span>Daily Corridor: Velachery ⇄ IIT Madras Gate</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => navigate('/rider/scanner')}
              className="px-4 py-2 rounded-inner bg-primary hover:bg-primary/90 text-white text-xs font-semibold flex items-center gap-2 shadow-md transition-all"
            >
              <QrCode size={15} />
              <span>Launch QR Scanner</span>
            </button>
            <button
              onClick={() => navigate('/rider/route')}
              className="px-3.5 py-2 rounded-inner bg-surface-2 hover:bg-surface-2/80 border border-border text-xs text-white flex items-center gap-2 transition-all"
            >
              <Navigation size={14} className="text-primary-soft" />
              <span>Active Route</span>
            </button>
            <div className="flex items-center gap-1.5 px-3 py-2 rounded-inner bg-success/15 border border-success/30 text-success text-xs font-semibold">
              <ShieldCheck size={14} />
              <span>{currentUser?.tier.toUpperCase() || 'GUARDIAN'} (88)</span>
            </div>
          </div>
        </div>

        {/* Responsive 12-Column Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Column (8 cols on xl, 7 cols on lg) */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-6">
            {/* 1. Demand Nudge Banner (UI Spec §9.2 & PRD §3.3 C4) */}
            {!extraSeatAdded ? (
              <div className="bg-warn/15 border border-warn/30 rounded-card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-inner bg-warn/20 text-warn flex items-center justify-center shrink-0">
                    <Zap size={18} />
                  </div>
                  <div>
                    <span className="font-label text-warn text-[10px] block">PEAK CORRIDOR DEMAND</span>
                    <p className="text-white text-xs font-semibold">
                      4 verified commuters waiting along your Velachery corridor
                    </p>
                    <span className="text-[11px] text-text-3">
                      Opening +1 seat recovers additional Rs 28 fuel cost share.
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setExtraSeatAdded(true)}
                  className="px-3.5 py-1.5 bg-warn hover:bg-warn/90 text-bg text-xs font-bold rounded-pill self-start sm:self-center transition-all shadow"
                >
                  +1 Seat Available
                </button>
              </div>
            ) : (
              <div className="bg-success/15 border border-success/30 rounded-card p-3.5 text-center text-xs text-success font-semibold flex items-center justify-center gap-2">
                <CheckCircle size={16} />
                <span>Capacity updated: 4 passenger seats opened for tomorrow's commute!</span>
              </div>
            )}

            {/* 2. Ghost Trip Proposal Card (UI Spec §9.2) */}
            {riderPred && riderPred.status !== 'skipped' ? (
              <Card variant="glow" className="space-y-4 p-5 sm:p-6">
                <div className="flex items-center justify-between border-b border-border/50 pb-3">
                  <span className="font-label text-success flex items-center gap-1.5 text-xs">
                    <Car size={15} className="text-success" />
                    TOMORROW'S COMMUTE ROUTE · OPEN SEATS
                  </span>
                  <Pill
                    variant={riderPred.confidence >= 80 ? 'progress' : 'waiting'}
                    label={`CORRIDOR CONFIDENCE: ${riderPred.confidence}%`}
                  />
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-white text-base sm:text-lg font-bold">
                      <span>{riderPred.time}</span>
                      <span className="text-success">·</span>
                      <span>{riderPred.origin}</span>
                      <ArrowRight size={16} className="text-text-3 inline" />
                      <span>{riderPred.destination}</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-text-2">
                      <span className="flex items-center gap-1">
                        <Clock size={13} className="text-primary-soft" /> Departure 08:15 AM
                      </span>
                      <span>•</span>
                      <span>Capacity: {extraSeatAdded ? 4 : (riderPred.seatsOffered || 3)} seats</span>
                      <span>•</span>
                      <span className="text-white font-semibold">
                        Cost share: Rs {riderPred.estimatedCostShare} / Rs 96 fuel
                      </span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="font-label text-text-3 text-[10px] block">MAX DETOUR CAP</span>
                    <span className="text-white font-bold text-sm">Max 0.8 km total</span>
                  </div>
                </div>

                {riderPred.status === 'confirmed' ? (
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-inner bg-success/15 border border-success/30 text-success text-xs font-semibold">
                    <div className="flex items-center gap-2">
                      <CheckCircle size={16} />
                      <span>SEATS CONFIRMED & PUBLISHED TO CORRIDOR PEERS</span>
                    </div>
                    <button
                      onClick={() => navigate('/rider/route')}
                      className="px-3 py-1.5 bg-success text-white rounded-pill text-xs font-bold hover:bg-success/90 flex items-center justify-center gap-1"
                    >
                      <span>View Route Map</span>
                      <ArrowRight size={13} />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 pt-2">
                    <Button
                      variant="secondary"
                      size="default"
                      onClick={() => handleSkip(riderPred.id)}
                      className="flex-1"
                    >
                      Skip Tomorrow
                    </Button>
                    <Button
                      variant="success"
                      size="default"
                      loading={openingSeats}
                      onClick={() => handleOpenSeats(riderPred.id)}
                      className="flex-1"
                    >
                      Open Seats to Peers
                    </Button>
                  </div>
                )}
              </Card>
            ) : null}

            {/* 3. Hotspots Along Route with Waiting Commuters */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-label text-text-2 text-xs">HOTSPOTS ALONG YOUR ROUTE</span>
                  <p className="text-[11px] text-text-3">Safe designated points with waiting commuters</p>
                </div>
                <button
                  onClick={() => navigate('/rider/route')}
                  className="font-caption text-primary-soft text-xs flex items-center gap-1 hover:underline"
                >
                  View route <ArrowRight size={13} />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {hotspots.map((hs) => (
                  <div
                    key={hs.id}
                    onClick={() => navigate('/rider/scanner')}
                    className="p-4 bg-surface hover:bg-surface-2 border border-border hover:border-success/60 rounded-card transition-all cursor-pointer space-y-2 group shadow-sm"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-inner bg-success/15 text-success flex items-center justify-center shrink-0">
                          <MapPin size={16} />
                        </div>
                        <div>
                          <h4 className="font-title-m text-white text-sm font-semibold group-hover:text-success transition-colors">
                            {hs.name}
                          </h4>
                          <span className="text-[10px] text-text-3">
                            {hs.category.toUpperCase().replace('_', ' ')} · {hs.lit ? 'Lit & Safe' : 'Designated Stop'}
                          </span>
                        </div>
                      </div>
                      <Pill
                        variant={hs.waitingCount > 0 ? 'waiting' : 'neutral'}
                        label={`${hs.waitingCount} WAITING`}
                      />
                    </div>

                    <div className="flex items-center justify-between text-xs text-text-2 pt-2 border-t border-border/40">
                      <span>Detour: +0.4 km (+1 min)</span>
                      <span className="text-white font-semibold">+Rs 28 share</span>
                      <span className="text-success text-[11px] font-bold group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                        <QrCode size={12} /> Scan Pass ➔
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. Cost Recovery Hero Summary (UI Spec §9.2 & §9.11) */}
            <Card variant="flat" className="p-5 sm:p-6 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-label text-text-2 text-xs">COST RECOVERY (THIS MONTH)</span>
                  <span className="text-[10px] text-text-3 block">Statutory Non-Commercial Cap</span>
                </div>
                <div className="px-2.5 py-1 bg-surface-2 border border-border rounded-pill text-[11px] text-success font-semibold">
                  CAP: Rs 720
                </div>
              </div>

              <div className="flex items-baseline gap-3">
                <span className="font-display-l text-white text-3xl sm:text-4xl font-bold">
                  Rs 640
                </span>
                <span className="text-xs text-text-3">
                  of actual fuel expenditure (Rs 720) recovered
                </span>
              </div>

              <div className="w-full h-2 bg-surface-2 rounded-full overflow-hidden flex">
                <div className="bg-success h-full" style={{ width: '88%' }} />
              </div>

              <p className="text-[11px] text-text-3 italic leading-relaxed pt-1">
                You share the fuel and toll costs of journeys you were already making. CommuteCircle strictly adheres to statutory cost-recovery principles without commercial earnings.
              </p>
            </Card>
          </div>

          {/* Right Sidebar Column (4 cols on xl, 5 cols on lg) */}
          <div className="lg:col-span-5 xl:col-span-4 space-y-6">
            {/* Quick QR Scanner Action Card */}
            <div
              onClick={() => navigate('/rider/scanner')}
              className="bg-primary/20 hover:bg-primary/30 border border-primary/50 rounded-card p-5 cursor-pointer transition-all shadow-xl group space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-inner bg-primary text-white flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                  <QrCode size={24} />
                </div>
                <span className="px-2 py-0.5 rounded-pill bg-primary/30 border border-primary/50 text-[10px] text-white font-bold">
                  PASSENGER BOARDING
                </span>
              </div>
              <div>
                <h3 className="font-title-m text-white text-base font-bold">
                  Open QR Boarding Scanner
                </h3>
                <p className="text-xs text-text-2 mt-0.5 leading-relaxed">
                  Scan passenger Journey Pass at designated hotspot. Unlocks exact drop-off point and confirms ride.
                </p>
              </div>
              <div className="pt-2 border-t border-primary/30 flex items-center justify-between text-xs text-primary-soft font-semibold">
                <span>Supports Camera & Manual Code</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Live Driver Corridor Map Preview */}
            <div className="bg-surface rounded-card border border-border overflow-hidden shadow-lg space-y-0">
              <div className="p-3.5 border-b border-border flex items-center justify-between bg-surface-2/40">
                <div className="flex items-center gap-2">
                  <Navigation size={14} className="text-success" />
                  <span className="font-label text-white text-xs">ACTIVE COMMUTE CORRIDOR</span>
                </div>
                <button
                  onClick={() => navigate('/rider/route')}
                  className="text-xs text-primary-soft hover:underline flex items-center gap-1"
                >
                  <span>Full Route Nav</span>
                  <ArrowRight size={12} />
                </button>
              </div>

              <div className="w-full h-64 relative">
                <CommuteMap
                  center={[12.9815, 80.2245]}
                  zoom={13}
                  routeCoordinates={corridorPolyline}
                  hotspots={hotspots}
                  vehiclePosition={liveRide?.currentRiderPosition || { lat: 12.9810, lng: 80.2245, heading: 45 }}
                />
              </div>

              <div className="p-3 bg-surface text-xs text-text-3 flex items-center justify-between">
                <span>Speed: 34 km/h · On Corridor</span>
                <span className="text-success font-semibold">SafeTrail Monitored</span>
              </div>
            </div>

            {/* Active Drive shortcut if in transit */}
            {liveRide && (liveRide.status === 'IN_TRANSIT' || liveRide.status === 'VERIFIED') && (
              <div
                onClick={() => navigate(`/rider/active-drive/${liveRide.id}`)}
                className="p-4 bg-surface hover:bg-surface-2 rounded-card border border-success/50 space-y-2 cursor-pointer shadow-lg transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="font-label text-success flex items-center gap-1.5">
                    <Navigation size={14} className="animate-spin" /> ACTIVE DRIVE IN PROGRESS
                  </span>
                  <Pill variant="progress" label="DRIVING" />
                </div>
                <div className="text-white text-sm font-semibold truncate">
                  {liveRide.originName} → {liveRide.destName}
                </div>
                <p className="text-xs text-text-2">
                  1 passenger onboard · Tap to view turn nav and SafeTrail
                </p>
              </div>
            )}

            {/* Fair-Fare Statutory Guidelines */}
            <div className="p-4 bg-surface rounded-card border border-border space-y-2 text-xs text-text-3">
              <div className="flex items-center gap-1.5 text-text-2 font-medium">
                <Info size={14} className="text-primary-soft" />
                <span>Statutory Compliance</span>
              </div>
              <p className="leading-relaxed text-[11px]">
                Under Tamil Nadu Motor Vehicles Guidelines, private car pooling is permitted strictly for sharing vehicle operating expenses (fuel & tolls) without commercial profit.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
