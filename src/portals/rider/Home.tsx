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
    <div className="flex-1 flex flex-col text-text">
      {/* Mobile-only AppBar */}
      <AppBar showBack={false} />

      <div className="p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Welcome Banner & Vehicle Owner Overview */}
        <div className="bg-surface rounded-card border border-border p-5 lg:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-colored">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-text-muted text-xs font-semibold uppercase tracking-wider">
                CHENNAI VEHICLE OWNER · VELACHERY CORRIDOR
              </span>
              <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
            </div>
            <h2 className="text-text text-xl sm:text-2xl font-extrabold tracking-tight">
              Good morning, {currentUser?.name.split(' ')[0] || 'Karthik'}
            </h2>
            <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-text-muted">
              <span className="text-text font-bold">Honda City · White · TN 09 AB 4821</span>
              <span>•</span>
              <span>Daily Corridor: Velachery ⇄ IIT Madras Gate</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => navigate('/rider/scanner')}
              className="min-h-[44px] px-4 py-2.5 rounded-button bg-primary-gradient text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-colored hover:opacity-95 transition-all active:scale-95"
            >
              <QrCode size={16} />
              <span>Launch QR Scanner</span>
            </button>
            <button
              onClick={() => navigate('/rider/route')}
              className="min-h-[44px] px-4 py-2.5 rounded-button bg-surface hover:bg-surface-2 border border-border text-xs sm:text-sm text-text font-bold flex items-center gap-2 shadow-sm transition-all active:scale-95"
            >
              <Navigation size={16} className="text-primary" />
              <span>Active Route</span>
            </button>
            <div className="min-h-[44px] flex items-center gap-1.5 px-3.5 py-2 rounded-button bg-success/10 border border-success/30 text-success text-xs sm:text-sm font-bold">
              <ShieldCheck size={16} />
              <span>{currentUser?.tier.toUpperCase() || 'GUARDIAN'} (88)</span>
            </div>
          </div>
        </div>

        {/* Responsive 12-Column Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Column (8 cols on xl, 7 cols on lg) */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-6">
            {/* 1. Demand Nudge Banner */}
            {!extraSeatAdded ? (
              <div className="bg-accent/10 border border-accent/30 rounded-card p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-colored">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-button bg-accent/20 text-accent flex items-center justify-center shrink-0">
                    <Zap size={20} />
                  </div>
                  <div>
                    <span className="text-accent font-bold text-xs uppercase tracking-wider block">PEAK CORRIDOR DEMAND</span>
                    <p className="text-text text-xs sm:text-sm font-bold">
                      4 verified commuters waiting along your Velachery corridor
                    </p>
                    <span className="text-xs text-text-muted">
                      Opening +1 seat recovers additional Rs 28 fuel cost share.
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setExtraSeatAdded(true)}
                  className="min-h-[44px] px-4 py-2 bg-accent hover:opacity-95 text-white text-xs font-bold rounded-button self-start sm:self-center transition-all shadow-sm active:scale-95"
                >
                  +1 Seat Available
                </button>
              </div>
            ) : (
              <div className="bg-success/10 border border-success/30 rounded-card p-4 text-center text-xs sm:text-sm text-success font-bold flex items-center justify-center gap-2">
                <CheckCircle size={18} />
                <span>Capacity updated: 4 passenger seats opened for tomorrow's commute!</span>
              </div>
            )}

            {/* 2. Ghost Trip Proposal Card */}
            {riderPred && riderPred.status !== 'skipped' ? (
              <Card variant="default" className="space-y-4 p-5 sm:p-6 shadow-colored">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <span className="text-primary font-bold flex items-center gap-1.5 text-xs sm:text-sm tracking-wide">
                    <Car size={16} className="text-primary" />
                    TOMORROW'S COMMUTE ROUTE · OPEN SEATS
                  </span>
                  <Pill
                    variant={riderPred.confidence >= 80 ? 'progress' : 'waiting'}
                    label={`CORRIDOR CONFIDENCE: ${riderPred.confidence}%`}
                  />
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-text text-base sm:text-lg font-bold">
                      <span>{riderPred.time}</span>
                      <span className="text-primary font-bold">·</span>
                      <span>{riderPred.origin}</span>
                      <ArrowRight size={16} className="text-text-muted inline" />
                      <span>{riderPred.destination}</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-text-muted">
                      <span className="flex items-center gap-1">
                        <Clock size={14} className="text-primary" /> Departure 08:15 AM
                      </span>
                      <span>•</span>
                      <span>Capacity: {extraSeatAdded ? 4 : (riderPred.seatsOffered || 3)} seats</span>
                      <span>•</span>
                      <span className="text-text font-bold">
                        Cost share: Rs {riderPred.estimatedCostShare} / Rs 96 fuel
                      </span>
                    </div>
                  </div>

                  <div className="text-left sm:text-right shrink-0">
                    <span className="text-text-muted text-[10px] font-bold uppercase block">MAX DETOUR CAP</span>
                    <span className="text-text font-extrabold text-sm sm:text-base">Max 0.8 km total</span>
                  </div>
                </div>

                {riderPred.status === 'confirmed' ? (
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-card bg-success/10 border border-success/30 text-success text-xs sm:text-sm font-bold">
                    <div className="flex items-center gap-2">
                      <CheckCircle size={18} />
                      <span>SEATS CONFIRMED & PUBLISHED TO CORRIDOR PEERS</span>
                    </div>
                    <button
                      onClick={() => navigate('/rider/route')}
                      className="min-h-[44px] px-4 py-2 bg-success text-white rounded-button text-xs font-bold hover:bg-success/90 flex items-center justify-center gap-1 shadow-sm active:scale-95 transition-all"
                    >
                      <span>View Route Map</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                    <Button
                      variant="secondary"
                      size="default"
                      onClick={() => handleSkip(riderPred.id)}
                      className="w-full sm:flex-1"
                    >
                      Skip Tomorrow
                    </Button>
                    <Button
                      variant="primary"
                      size="default"
                      loading={openingSeats}
                      onClick={() => handleOpenSeats(riderPred.id)}
                      className="w-full sm:flex-1"
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
                  <span className="text-xs font-bold text-text-muted uppercase tracking-wider">HOTSPOTS ALONG YOUR ROUTE</span>
                  <p className="text-xs text-text-muted">Safe designated points with waiting commuters</p>
                </div>
                <button
                  onClick={() => navigate('/rider/route')}
                  className="min-h-[44px] text-primary text-xs sm:text-sm font-bold flex items-center gap-1 hover:underline"
                >
                  View route <ArrowRight size={14} />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {hotspots.map((hs) => (
                  <div
                    key={hs.id}
                    onClick={() => navigate('/rider/scanner')}
                    className="p-4 bg-surface hover:bg-surface-2 border border-border hover:border-primary/40 rounded-card transition-all cursor-pointer space-y-2 group shadow-colored"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-button bg-primary/10 text-primary flex items-center justify-center shrink-0">
                          <MapPin size={18} />
                        </div>
                        <div>
                          <h4 className="text-text text-sm font-bold group-hover:text-primary transition-colors">
                            {hs.name}
                          </h4>
                          <span className="text-[10px] font-semibold text-text-muted">
                            {hs.category.toUpperCase().replace('_', ' ')} · {hs.lit ? 'Lit & Safe' : 'Designated Stop'}
                          </span>
                        </div>
                      </div>
                      <Pill
                        variant={hs.waitingCount > 0 ? 'waiting' : 'neutral'}
                        label={`${hs.waitingCount} WAITING`}
                      />
                    </div>

                    <div className="flex items-center justify-between text-xs text-text-muted pt-2 border-t border-border">
                      <span className="font-medium">Detour: +0.4 km (+1 min)</span>
                      <span className="text-text font-bold">+Rs 28 share</span>
                      <span className="text-primary text-[11px] font-bold group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                        <QrCode size={12} /> Scan Pass ➔
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. Cost Recovery Hero Summary */}
            <Card variant="flat" className="p-5 sm:p-6 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-text-muted font-bold text-xs uppercase tracking-wider">COST RECOVERY (THIS MONTH)</span>
                  <span className="text-[10px] text-text-muted block">Statutory Non-Commercial Cap</span>
                </div>
                <div className="px-3 py-1 bg-surface-2 border border-border rounded-full text-xs text-success font-bold">
                  CAP: Rs 720
                </div>
              </div>

              <div className="flex items-baseline gap-3">
                <span className="text-text text-3xl sm:text-4xl font-extrabold">
                  Rs 640
                </span>
                <span className="text-xs sm:text-sm text-text-muted font-medium">
                  of actual fuel expenditure (Rs 720) recovered
                </span>
              </div>

              <div className="w-full h-2.5 bg-surface-2 rounded-full overflow-hidden flex">
                <div className="bg-primary-gradient h-full rounded-full" style={{ width: '88%' }} />
              </div>

              <p className="text-xs text-text-muted italic leading-relaxed pt-1">
                You share the fuel and toll costs of journeys you were already making. CommuteCircle strictly adheres to statutory cost-recovery principles without commercial earnings.
              </p>
            </Card>
          </div>

          {/* Right Sidebar Column (4 cols on xl, 5 cols on lg) */}
          <div className="lg:col-span-5 xl:col-span-4 space-y-6">
            {/* Quick QR Scanner Action Card */}
            <div
              onClick={() => navigate('/rider/scanner')}
              className="bg-primary-gradient rounded-card p-5 cursor-pointer transition-all shadow-colored group space-y-3 text-white active:scale-98"
            >
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-button bg-white/20 backdrop-blur-sm text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                  <QrCode size={24} />
                </div>
                <span className="px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-sm text-[10px] text-white font-bold uppercase tracking-wider">
                  PASSENGER BOARDING
                </span>
              </div>
              <div>
                <h3 className="text-white text-base sm:text-lg font-extrabold">
                  Open QR Boarding Scanner
                </h3>
                <p className="text-xs text-white/90 mt-1 leading-relaxed">
                  Scan passenger Journey Pass at designated hotspot. Unlocks exact drop-off point and confirms ride.
                </p>
              </div>
              <div className="pt-2 border-t border-white/20 flex items-center justify-between text-xs font-bold text-white">
                <span>Supports Camera & Manual Code</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Live Driver Corridor Map Preview */}
            <div className="bg-surface rounded-card border border-border overflow-hidden shadow-colored space-y-0">
              <div className="p-3.5 border-b border-border flex items-center justify-between bg-surface-2/60">
                <div className="flex items-center gap-2">
                  <Navigation size={16} className="text-primary" />
                  <span className="text-text font-bold text-xs sm:text-sm">ACTIVE COMMUTE CORRIDOR</span>
                </div>
                <button
                  onClick={() => navigate('/rider/route')}
                  className="min-h-[44px] text-xs font-bold text-primary hover:underline flex items-center gap-1"
                >
                  <span>Full Route Nav</span>
                  <ArrowRight size={14} />
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

              <div className="p-3.5 bg-surface text-xs text-text-muted flex items-center justify-between border-t border-border">
                <span className="font-medium">Speed: 34 km/h · On Corridor</span>
                <span className="text-success font-bold">SafeTrail Monitored</span>
              </div>
            </div>

            {/* Active Drive shortcut if in transit */}
            {liveRide && (liveRide.status === 'IN_TRANSIT' || liveRide.status === 'VERIFIED') && (
              <div
                onClick={() => navigate(`/rider/active-drive/${liveRide.id}`)}
                className="p-4 bg-surface hover:bg-surface-2 rounded-card border border-primary/40 space-y-2 cursor-pointer shadow-colored transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="text-success font-bold text-xs sm:text-sm flex items-center gap-1.5">
                    <Navigation size={14} className="animate-spin" /> ACTIVE DRIVE IN PROGRESS
                  </span>
                  <Pill variant="progress" label="DRIVING" />
                </div>
                <div className="text-text text-sm font-bold truncate">
                  {liveRide.originName} → {liveRide.destName}
                </div>
                <p className="text-xs text-text-muted">
                  1 passenger onboard · Tap to view turn nav and SafeTrail
                </p>
              </div>
            )}

            {/* Fair-Fare Statutory Guidelines */}
            <div className="p-4 bg-surface rounded-card border border-border space-y-2 text-xs text-text-muted">
              <div className="flex items-center gap-1.5 text-text font-bold">
                <Info size={16} className="text-primary" />
                <span>Statutory Compliance</span>
              </div>
              <p className="leading-relaxed text-xs">
                Under Tamil Nadu Motor Vehicles Guidelines, private car pooling is permitted strictly for sharing vehicle operating expenses (fuel & tolls) without commercial profit.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
