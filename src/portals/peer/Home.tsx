import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppBar } from '../../layouts/AppBar';
import { Card } from '../../components/primitives/Card';
import { Button } from '../../components/primitives/Button';
import { Pill } from '../../components/primitives/Pill';
import { LiveNavCard } from '../../components/signature/LiveNavCard';
import { CommuteMap } from '../../components/map/CommuteMap';
import { useAppStore } from '../../store/useAppStore';
import {
  Sparkles,
  MapPin,
  ShieldCheck,
  ArrowRight,
  Route,
  Navigation,
  QrCode,
  Shield,
  Layers,
  Clock,
  Flame,
  CheckCircle,
} from 'lucide-react';
import { FeatureHelpButton } from '../../components/chat/FeatureHelpButton';

export const PeerHome: React.FC = () => {
  const navigate = useNavigate();
  const {
    currentUser,
    predictions,
    liveRide,
    confirmPrediction,
    skipPrediction,
    hotspots,
  } = useAppStore();

  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  // Active prediction for tomorrow
  const activePred =
    predictions.find((p) => p.status === 'proposed') ||
    predictions[0] ||
    null;

  const handleConfirm = async (predId: string) => {
    setConfirmingId(predId);
    await confirmPrediction(predId);
    setConfirmingId(null);
  };

  const handleSkip = async (predId: string) => {
    await skipPrediction(predId);
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
        {/* Welcome Banner & Quick Action Shortcuts */}
        <div className="bg-surface rounded-card border border-border p-5 lg:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-colored">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-text-muted text-xs font-semibold uppercase tracking-wider">
                CHENNAI COMMUTER · VELACHERY CORRIDOR
              </span>
              <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
            </div>
            <h2 className="text-text text-xl sm:text-2xl font-extrabold tracking-tight">
              Good morning, {currentUser?.name.split(' ')[0] || 'Anitha'}
            </h2>
            <p className="text-xs sm:text-sm text-text-muted">
              Corridor active: Velachery Bypass ⇄ IIT Madras. 4 riders currently moving.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => navigate('/app/pickup-qr')}
              className="min-h-[44px] px-4 py-2.5 rounded-button bg-surface hover:bg-surface-2 border border-border text-xs sm:text-sm text-text font-bold flex items-center gap-2 shadow-sm transition-all active:scale-95"
            >
              <QrCode size={16} className="text-primary" />
              <span>My Journey Pass</span>
            </button>
            <button
              onClick={() => navigate('/app/relay')}
              className="min-h-[44px] px-4 py-2.5 rounded-button bg-surface hover:bg-surface-2 border border-border text-xs sm:text-sm text-text font-bold flex items-center gap-2 shadow-sm transition-all active:scale-95"
            >
              <Layers size={16} className="text-accent" />
              <span>Relay Planner</span>
            </button>
            <div className="min-h-[44px] flex items-center gap-1.5 px-3.5 py-2 rounded-button bg-success/10 border border-success/30 text-success text-xs sm:text-sm font-bold">
              <ShieldCheck size={16} />
              <span>{currentUser?.tier.toUpperCase() || 'TRUSTED'} (78)</span>
            </div>
          </div>
        </div>

        {/* Responsive 12-Column Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Column (8 cols on xl, 7 cols on lg) */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-6">
            {/* 1. Ghost Commute Proposal Card */}
            {activePred && activePred.status !== 'skipped' ? (
              <Card variant="default" className="space-y-4 p-5 sm:p-6 shadow-colored">
                <div className="flex items-center justify-between border-b border-border pb-3 gap-2 flex-wrap">
                  <span className="text-primary font-bold flex items-center gap-1.5 text-xs sm:text-sm tracking-wide">
                    <Sparkles size={16} className="text-accent" />
                    PREDICTED GHOST COMMUTE · TOMORROW
                  </span>
                  <div className="flex items-center gap-2">
                    <FeatureHelpButton question="How do Ghost Commutes work?" label="How it works" />
                    <Pill
                      variant={activePred.confidence >= 80 ? 'progress' : 'waiting'}
                      label={`MATCH CONFIDENCE: ${activePred.confidence}%`}
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-text text-base sm:text-lg font-bold">
                      <span>{activePred.time}</span>
                      <span className="text-primary font-bold">·</span>
                      <span>{activePred.origin}</span>
                      <ArrowRight size={16} className="text-text-muted inline" />
                      <span>{activePred.destination}</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-text-muted">
                      <span className="flex items-center gap-1">
                        <Clock size={14} className="text-primary" /> 18 min commute
                      </span>
                      <span>•</span>
                      <span>{activePred.ridersCount || 3} verified peers in corridor</span>
                      <span>•</span>
                      <span className="text-text font-bold">Rs {activePred.estimatedCostShare} cost share</span>
                    </div>
                  </div>

                  <div className="text-left sm:text-right shrink-0">
                    <span className="text-text-muted text-[10px] font-bold uppercase block">EST. DETOUR</span>
                    <span className="text-text font-extrabold text-sm sm:text-base">+0.4 km (1 min)</span>
                  </div>
                </div>

                {activePred.status === 'confirmed' ? (
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-card bg-success/10 border border-success/30 text-success text-xs sm:text-sm font-bold">
                    <div className="flex items-center gap-2">
                      <CheckCircle size={18} />
                      <span>RIDE PROPOSAL CONFIRMED · VEHICLE RESERVED</span>
                    </div>
                    <button
                      onClick={() => navigate('/app/waiting/hs-3')}
                      className="min-h-[44px] px-4 py-2 bg-success text-white rounded-button text-xs font-bold hover:bg-success/90 flex items-center justify-center gap-1 shadow-sm active:scale-95 transition-all"
                    >
                      <span>Go to Hotspot Room</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                    <Button
                      variant="secondary"
                      size="default"
                      onClick={() => handleSkip(activePred.id)}
                      className="w-full sm:flex-1"
                    >
                      Skip Proposal
                    </Button>
                    <Button
                      variant="primary"
                      size="default"
                      loading={confirmingId === activePred.id}
                      onClick={() => handleConfirm(activePred.id)}
                      className="w-full sm:flex-1"
                    >
                      Confirm Ride Match
                    </Button>
                  </div>
                )}
              </Card>
            ) : (
              <Card variant="flat" className="text-center py-8 space-y-3">
                <Route size={36} className="text-text-muted mx-auto" />
                <h4 className="text-text text-base sm:text-lg font-bold">No active proposals for tomorrow</h4>
                <p className="text-xs sm:text-sm text-text-muted max-w-md mx-auto">
                  Your regular schedule creates automatic peer match proposals every night at 21:00.
                </p>
              </Card>
            )}

            {/* 2. Active Ride Mini Banner / Live Nav */}
            {liveRide && (liveRide.status === 'IN_TRANSIT' || liveRide.status === 'VERIFIED') && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-success font-bold text-xs sm:text-sm flex items-center gap-1.5">
                    <Navigation size={14} className="animate-spin" /> LIVE COMMUTE IN PROGRESS
                  </span>
                  <Pill variant="progress" label={liveRide.status} />
                </div>
                <div onClick={() => navigate(`/app/live-ride/${liveRide.id}`)} className="cursor-pointer">
                  <LiveNavCard
                    instruction="Heading to IIT Madras Main Gate"
                    distance="0.4 km"
                    etaMins="6 MIN"
                    arrivalTime="08:26 AM"
                    progress={0.72}
                  />
                </div>
              </div>
            )}

            {/* 3. Popular Safe Hotspots Grid */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-text-muted uppercase tracking-wider">CHENNAI CORRIDOR SAFE HOTSPOTS</span>
                  <p className="text-xs text-text-muted">High-visibility lit waiting zones with CCTV</p>
                </div>
                <button
                  onClick={() => navigate('/app/map')}
                  className="min-h-[44px] text-primary text-xs sm:text-sm font-bold flex items-center gap-1 hover:underline"
                >
                  View full map <ArrowRight size={14} />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {hotspots.slice(0, 4).map((hs) => (
                  <div
                    key={hs.id}
                    onClick={() => navigate(`/app/waiting/${hs.id}`)}
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
                            {hs.category.toUpperCase().replace('_', ' ')} · {hs.lit ? 'Lit & CCTV' : 'Safe Point'}
                          </span>
                        </div>
                      </div>
                      <Pill
                        variant={hs.waitingCount > 0 ? 'waiting' : 'available'}
                        label={`${hs.waitingCount} WAITING`}
                      />
                    </div>

                    <div className="flex items-center justify-between text-xs text-text-muted pt-2 border-t border-border">
                      <span className="font-medium">Wait: ~{hs.avgWaitMins} min</span>
                      <span className="text-success font-semibold text-[11px]">Lit & CCTV ✓</span>
                      <span className="text-primary text-[11px] font-bold group-hover:translate-x-0.5 transition-transform">
                        Wait Here ➔
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. Eco & Commute Savings Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card variant="flat" className="p-4 text-center space-y-1">
                <span className="text-text-muted font-bold text-[10px] uppercase tracking-wider">MONTHLY SAVINGS</span>
                <div className="text-text text-xl font-extrabold">Rs 412</div>
                <span className="text-[10px] text-text-muted">vs commercial cabs</span>
              </Card>
              <Card variant="flat" className="p-4 text-center space-y-1">
                <span className="text-text-muted font-bold text-[10px] uppercase tracking-wider">CO₂ AVOIDED</span>
                <div className="text-success text-xl font-extrabold">6.2 kg</div>
                <span className="text-[10px] text-text-muted">clean peer rides</span>
              </Card>
              <Card variant="flat" className="p-4 text-center space-y-1">
                <span className="text-text-muted font-bold text-[10px] uppercase tracking-wider">CLEAN STREAK</span>
                <div className="text-accent text-xl font-extrabold flex items-center justify-center gap-1">
                  <Flame size={18} className="text-accent fill-accent" />
                  <span>9 Days</span>
                </div>
                <span className="text-[10px] text-text-muted">Trusted Guardian track</span>
              </Card>
            </div>
          </div>

          {/* Right Sidebar Column (4 cols on xl, 5 cols on lg) */}
          <div className="lg:col-span-5 xl:col-span-4 space-y-6">
            {/* Live Corridor Map Preview */}
            <div className="bg-surface rounded-card border border-border overflow-hidden shadow-colored space-y-0">
              <div className="p-3.5 border-b border-border flex items-center justify-between bg-surface-2/60">
                <div className="flex items-center gap-2">
                  <Navigation size={16} className="text-primary" />
                  <span className="text-text font-bold text-xs sm:text-sm">LIVE CORRIDOR MAP</span>
                </div>
                <button
                  onClick={() => navigate('/app/map')}
                  className="min-h-[44px] text-xs font-bold text-primary hover:underline flex items-center gap-1"
                >
                  <span>Interactive Map</span>
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
                  passengerPosition={{ lat: 12.9774, lng: 80.2212 }}
                />
              </div>

              <div className="p-3.5 bg-surface text-xs text-text-muted flex items-center justify-between border-t border-border">
                <span className="font-medium">Corridor: Velachery ⇄ IIT Madras</span>
                <span className="text-success font-bold">SafeTrail Live</span>
              </div>
            </div>

            {/* Recurring Pods Card */}
            <Card variant="flat" className="p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-text-muted font-bold text-xs uppercase tracking-wider">RECURRING COMMUTE POD</span>
                <span className="text-accent font-bold text-xs">3 SEATS TAKEN</span>
              </div>
              <div>
                <h4 className="text-text text-sm sm:text-base font-bold">
                  Velachery Tech Morning Pod
                </h4>
                <p className="text-xs text-text-muted mt-1">
                  Mon-Fri · 08:15 AM · Velachery → IIT Madras Gate
                </p>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-border text-xs">
                <span className="text-text-muted font-medium">Reputation: 98%</span>
                <button
                  onClick={() => navigate('/app/pods')}
                  className="min-h-[44px] text-primary hover:underline font-bold"
                >
                  Manage Pod ➔
                </button>
              </div>
            </Card>

            {/* Safety & SOS Quick Shield */}
            <div className="p-5 bg-danger/10 border border-danger/25 rounded-card space-y-3">
              <div className="flex items-center gap-2 text-danger">
                <Shield size={18} />
                <span className="font-bold text-xs sm:text-sm uppercase tracking-wider">24/7 COMMUTE SAFETY</span>
              </div>
              <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
                SafeTrail tracks your route telemetry with 2-tier community escalation.
              </p>
              <button
                onClick={() => navigate('/safety')}
                className="w-full min-h-[44px] py-2.5 bg-surface hover:bg-surface-2 border border-border text-xs sm:text-sm text-text rounded-button font-bold flex items-center justify-center gap-2 shadow-sm transition-colors active:scale-95"
              >
                <span>Open Safety Centre</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
