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
    <div className="flex-1 flex flex-col font-mono text-text">
      {/* Mobile-only AppBar */}
      <AppBar showBack={false} />

      <div className="p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Desktop Welcome Banner & Quick Action Shortcuts */}
        <div className="bg-surface rounded-card border border-border p-5 lg:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-caption text-text-3 text-xs uppercase tracking-wider">
                CHENNAI COMMUTER · VELACHERY CORRIDOR
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
            </div>
            <h2 className="font-title-m text-white text-xl sm:text-2xl font-bold">
              Good morning, {currentUser?.name.split(' ')[0] || 'Anitha'}
            </h2>
            <p className="text-xs text-text-2">
              Corridor active: Velachery Bypass ⇄ IIT Madras. 4 riders currently moving.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => navigate('/app/pickup-qr')}
              className="px-3.5 py-2 rounded-inner bg-surface-2 hover:bg-surface-2/80 border border-border text-xs text-white flex items-center gap-2 transition-all"
            >
              <QrCode size={14} className="text-primary-soft" />
              <span>My Journey Pass</span>
            </button>
            <button
              onClick={() => navigate('/app/relay')}
              className="px-3.5 py-2 rounded-inner bg-surface-2 hover:bg-surface-2/80 border border-border text-xs text-white flex items-center gap-2 transition-all"
            >
              <Layers size={14} className="text-warn" />
              <span>Relay Planner</span>
            </button>
            <div className="flex items-center gap-1.5 px-3 py-2 rounded-inner bg-success/15 border border-success/30 text-success text-xs font-semibold">
              <ShieldCheck size={14} />
              <span>{currentUser?.tier.toUpperCase() || 'TRUSTED'} (78)</span>
            </div>
          </div>
        </div>

        {/* Responsive 12-Column Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Column (8 cols on xl, 7 cols on lg) */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-6">
            {/* 1. Ghost Commute Proposal Card (UI Spec §8.2 & PRD §3.3) */}
            {activePred && activePred.status !== 'skipped' ? (
              <Card variant="glow" className="space-y-4 p-5 sm:p-6">
                <div className="flex items-center justify-between border-b border-border/50 pb-3">
                  <span className="font-label text-primary-soft flex items-center gap-1.5 text-xs">
                    <Sparkles size={15} className="text-warn" />
                    PREDICTED GHOST COMMUTE · TOMORROW
                  </span>
                  <Pill
                    variant={activePred.confidence >= 80 ? 'progress' : 'waiting'}
                    label={`MATCH CONFIDENCE: ${activePred.confidence}%`}
                  />
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-white text-base sm:text-lg font-bold">
                      <span>{activePred.time}</span>
                      <span className="text-primary-soft">·</span>
                      <span>{activePred.origin}</span>
                      <ArrowRight size={16} className="text-text-3 inline" />
                      <span>{activePred.destination}</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-text-2">
                      <span className="flex items-center gap-1">
                        <Clock size={13} className="text-primary-soft" /> 18 min commute
                      </span>
                      <span>•</span>
                      <span>{activePred.ridersCount || 3} verified peers in corridor</span>
                      <span>•</span>
                      <span className="text-white font-semibold">Rs {activePred.estimatedCostShare} cost share</span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="font-label text-text-3 text-[10px] block">EST. DETOUR</span>
                    <span className="text-white font-bold text-sm">+0.4 km (1 min)</span>
                  </div>
                </div>

                {activePred.status === 'confirmed' ? (
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-inner bg-success/15 border border-success/30 text-success text-xs font-semibold">
                    <div className="flex items-center gap-2">
                      <CheckCircle size={16} />
                      <span>RIDE PROPOSAL CONFIRMED · VEHICLE RESERVED</span>
                    </div>
                    <button
                      onClick={() => navigate('/app/waiting/hs-3')}
                      className="px-3 py-1.5 bg-success text-white rounded-pill text-xs font-bold hover:bg-success/90 flex items-center justify-center gap-1"
                    >
                      <span>Go to Hotspot Room</span>
                      <ArrowRight size={13} />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 pt-2">
                    <Button
                      variant="secondary"
                      size="default"
                      onClick={() => handleSkip(activePred.id)}
                      className="flex-1"
                    >
                      Skip Proposal
                    </Button>
                    <Button
                      variant="primary"
                      size="default"
                      loading={confirmingId === activePred.id}
                      onClick={() => handleConfirm(activePred.id)}
                      className="flex-1"
                    >
                      Confirm Ride Match
                    </Button>
                  </div>
                )}
              </Card>
            ) : (
              <Card variant="flat" className="text-center py-8 space-y-3">
                <Route size={32} className="text-text-3 mx-auto" />
                <h4 className="font-title-m text-white text-base">No active proposals for tomorrow</h4>
                <p className="text-xs text-text-3 max-w-md mx-auto">
                  Your regular schedule creates automatic peer match proposals every night at 21:00.
                </p>
              </Card>
            )}

            {/* 2. Active Ride Mini Banner / Live Nav (UI Spec §8.2) */}
            {liveRide && (liveRide.status === 'IN_TRANSIT' || liveRide.status === 'VERIFIED') && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-label text-success flex items-center gap-1.5">
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

            {/* 3. Popular Safe Hotspots Grid (UI Spec §6.7 & §8.2) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-label text-text-2 text-xs">CHENNAI CORRIDOR SAFE HOTSPOTS</span>
                  <p className="text-[11px] text-text-3">High-visibility lit waiting zones with CCTV</p>
                </div>
                <button
                  onClick={() => navigate('/app/map')}
                  className="font-caption text-primary-soft text-xs flex items-center gap-1 hover:underline"
                >
                  View full map <ArrowRight size={13} />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {hotspots.slice(0, 4).map((hs) => (
                  <div
                    key={hs.id}
                    onClick={() => navigate(`/app/waiting/${hs.id}`)}
                    className="p-4 bg-surface hover:bg-surface-2 border border-border hover:border-primary-soft rounded-card transition-all cursor-pointer space-y-2 group shadow-sm"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-inner bg-primary/20 text-primary-soft flex items-center justify-center shrink-0">
                          <MapPin size={16} />
                        </div>
                        <div>
                          <h4 className="font-title-m text-white text-sm font-semibold group-hover:text-primary-soft transition-colors">
                            {hs.name}
                          </h4>
                          <span className="text-[10px] text-text-3">
                            {hs.category.toUpperCase().replace('_', ' ')} · {hs.lit ? 'Lit & CCTV' : 'Safe Point'}
                          </span>
                        </div>
                      </div>
                      <Pill
                        variant={hs.waitingCount > 0 ? 'waiting' : 'available'}
                        label={`${hs.waitingCount} WAITING`}
                      />
                    </div>

                    <div className="flex items-center justify-between text-xs text-text-2 pt-2 border-t border-border/40">
                      <span>Wait: ~{hs.avgWaitMins} min</span>
                      <span className="text-success text-[11px]">Lit & CCTV ✓</span>
                      <span className="text-primary-soft text-[11px] font-bold group-hover:translate-x-0.5 transition-transform">
                        Wait Here ➔
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. Eco & Commute Savings Summary (UI Spec §8.2) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card variant="flat" className="p-4 text-center space-y-1">
                <span className="font-label text-text-3 text-[10px]">MONTHLY SAVINGS</span>
                <div className="font-title-m text-white text-xl font-bold">Rs 412</div>
                <span className="text-[10px] text-text-3">vs commercial cabs</span>
              </Card>
              <Card variant="flat" className="p-4 text-center space-y-1">
                <span className="font-label text-text-3 text-[10px]">CO₂ AVOIDED</span>
                <div className="font-title-m text-success text-xl font-bold">6.2 kg</div>
                <span className="text-[10px] text-text-3">clean peer rides</span>
              </Card>
              <Card variant="flat" className="p-4 text-center space-y-1">
                <span className="font-label text-text-3 text-[10px]">CLEAN STREAK</span>
                <div className="font-title-m text-warn text-xl font-bold flex items-center justify-center gap-1">
                  <Flame size={18} className="text-warn fill-warn" />
                  <span>9 Days</span>
                </div>
                <span className="text-[10px] text-text-3">Trusted Guardian track</span>
              </Card>
            </div>
          </div>

          {/* Right Sidebar Column (4 cols on xl, 5 cols on lg) */}
          <div className="lg:col-span-5 xl:col-span-4 space-y-6">
            {/* Live Corridor Map Preview */}
            <div className="bg-surface rounded-card border border-border overflow-hidden shadow-lg space-y-0">
              <div className="p-3.5 border-b border-border flex items-center justify-between bg-surface-2/40">
                <div className="flex items-center gap-2">
                  <Navigation size={14} className="text-primary-soft" />
                  <span className="font-label text-white text-xs">LIVE CORRIDOR MAP</span>
                </div>
                <button
                  onClick={() => navigate('/app/map')}
                  className="text-xs text-primary-soft hover:underline flex items-center gap-1"
                >
                  <span>Interactive Map</span>
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
                  passengerPosition={{ lat: 12.9774, lng: 80.2212 }}
                />
              </div>

              <div className="p-3 bg-surface text-xs text-text-3 flex items-center justify-between">
                <span>Corridor: Velachery ⇄ IIT Madras</span>
                <span className="text-success font-semibold">SafeTrail Live</span>
              </div>
            </div>

            {/* Recurring Pods Card */}
            <Card variant="flat" className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-label text-text-2 text-xs">RECURRING COMMUTE POD</span>
                <span className="font-pill text-[10px] text-warn">3 SEATS TAKEN</span>
              </div>
              <div>
                <h4 className="font-title-m text-white text-sm font-semibold">
                  Velachery Tech Morning Pod
                </h4>
                <p className="text-xs text-text-3 mt-0.5">
                  Mon-Fri · 08:15 AM · Velachery → IIT Madras Gate
                </p>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-border/50 text-xs">
                <span className="text-text-2">Reputation: 98%</span>
                <button
                  onClick={() => navigate('/app/pods')}
                  className="text-primary-soft hover:underline font-semibold"
                >
                  Manage Pod ➔
                </button>
              </div>
            </Card>

            {/* Safety & SOS Quick Shield */}
            <div className="p-4 bg-danger/10 border border-danger/30 rounded-card space-y-2">
              <div className="flex items-center gap-2 text-danger">
                <Shield size={16} />
                <span className="font-label text-xs">24/7 COMMUTE SAFETY</span>
              </div>
              <p className="text-xs text-text-2 leading-relaxed">
                SafeTrail tracks your route telemetry with 2-tier community escalation.
              </p>
              <button
                onClick={() => navigate('/safety')}
                className="w-full py-2 bg-surface hover:bg-surface-2 border border-border text-xs text-white rounded-inner font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>Open Safety Centre</span>
                <ArrowRight size={13} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
