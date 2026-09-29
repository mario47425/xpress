import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppBar } from '../../layouts/AppBar';
import { Card } from '../../components/primitives/Card';
import { Button } from '../../components/primitives/Button';
import { Pill } from '../../components/primitives/Pill';
import { TaskCard, TaskCarousel } from '../../components/signature/TaskCard';
import { useAppStore } from '../../store/useAppStore';
import { Car, Zap, ArrowRight, ShieldCheck, QrCode } from 'lucide-react';

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

  return (
    <div className="flex-1 flex flex-col font-mono">
      <AppBar showBack={false} />

      <div className="p-5 space-y-5 pb-8">
        {/* Rider Greeting */}
        <div className="flex items-center justify-between">
          <div>
            <span className="font-caption text-text-3 text-xs">CHENNAI · VEHICLE OWNER</span>
            <h2 className="font-title-m text-white text-lg font-bold">
              Good morning, {currentUser?.name.split(' ')[0] || 'Karthik'}
            </h2>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-pill bg-surface-2 border border-border">
            <ShieldCheck size={14} className="text-success" />
            <span className="font-pill text-[10px] text-text-2">
              {currentUser?.tier.toUpperCase()}
            </span>
          </div>
        </div>

        {/* 1. Demand Nudge Banner (UI Spec §9.2 & PRD §3.3 C4) */}
        {!extraSeatAdded ? (
          <div className="bg-warn/15 border border-warn/30 rounded-inner p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap size={16} className="text-warn shrink-0" />
              <div className="text-xs">
                <span className="font-label text-warn">HIGH DEMAND</span>
                <p className="text-white text-[11px]">4 riders waiting on Velachery corridor</p>
              </div>
            </div>
            <button
              onClick={() => setExtraSeatAdded(true)}
              className="px-2.5 py-1 bg-warn hover:bg-warn/90 text-bg text-[10px] font-bold rounded-pill"
            >
              +1 Seat
            </button>
          </div>
        ) : (
          <div className="bg-success/15 border border-success/30 rounded-inner p-2.5 text-center text-xs text-success font-semibold">
            Extra seat opened! High demand corridor match increased.
          </div>
        )}

        {/* 2. Ghost Trip Proposal Card (UI Spec §9.2) */}
        {riderPred && riderPred.status !== 'skipped' ? (
          <Card variant="glow" className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-label text-success flex items-center gap-1.5">
                <Car size={14} className="text-success" />
                TOMORROW · OPEN SEATS
              </span>
              <Pill
                variant={riderPred.confidence >= 80 ? 'progress' : 'waiting'}
                label={`CONF ${riderPred.confidence}%`}
              />
            </div>

            <div className="space-y-1">
              <h3 className="font-title-m text-white text-base font-semibold">
                {riderPred.time} · {riderPred.origin} → {riderPred.destination}
              </h3>
              <p className="font-body-m text-xs text-text-2">
                You can carry {extraSeatAdded ? 4 : (riderPred.seatsOffered || 3)} · Cost share Rs {riderPred.estimatedCostShare} of Rs 96
              </p>
            </div>

            {riderPred.status === 'confirmed' ? (
              <div className="flex items-center justify-between p-3 rounded-inner bg-success/15 border border-success/30 text-success text-xs font-semibold">
                <span>SEATS PUBLISHED & CONFIRMED ✓</span>
                <button
                  onClick={() => navigate('/rider/route')}
                  className="underline text-white hover:text-success"
                >
                  View Route ➔
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3 pt-1">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleSkip(riderPred.id)}
                  className="flex-1"
                >
                  Skip
                </Button>
                <Button
                  variant="success"
                  size="sm"
                  loading={openingSeats}
                  onClick={() => handleOpenSeats(riderPred.id)}
                  className="flex-1"
                >
                  Open Seats
                </Button>
              </div>
            )}
          </Card>
        ) : null}

        {/* 3. Quick Scanner Access Tile */}
        <div
          onClick={() => navigate('/rider/scanner')}
          className="bg-primary/20 hover:bg-primary/30 border border-primary/40 rounded-card p-4 flex items-center justify-between cursor-pointer transition-all active:scale-[0.99]"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-inner bg-primary flex items-center justify-center text-white shadow-md">
              <QrCode size={24} />
            </div>
            <div>
              <span className="font-label text-primary-soft">PICKUP HANDSHAKE</span>
              <h4 className="font-title-m text-white text-sm">Open QR Scanner</h4>
              <p className="text-[11px] text-text-2">Scan passenger Journey Pass at hotspot</p>
            </div>
          </div>
          <ArrowRight size={20} className="text-primary-soft" />
        </div>

        {/* 4. Active Drive Shortcut if In Transit */}
        {liveRide && (liveRide.status === 'IN_TRANSIT' || liveRide.status === 'VERIFIED') && (
          <div
            onClick={() => navigate(`/rider/active-drive/${liveRide.id}`)}
            className="p-4 bg-surface rounded-card border border-success/40 space-y-2 cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <span className="font-label text-success">ACTIVE DRIVE IN PROGRESS</span>
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

        {/* 5. Next Pickups on Corridor (UI Spec §9.2) */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="font-label text-text-2">HOTSPOTS ALONG YOUR ROUTE</span>
            <button
              onClick={() => navigate('/rider/route')}
              className="font-caption text-primary-soft text-xs flex items-center gap-1 hover:underline"
            >
              Route map <ArrowRight size={12} />
            </button>
          </div>

          <TaskCarousel>
            {hotspots.map((hs) => (
              <TaskCard
                key={hs.id}
                title={`Hotspot: ${hs.name}`}
                pillVariant={hs.waitingCount > 0 ? 'waiting' : 'neutral'}
                pillLabel={`${hs.waitingCount} WAITING`}
                timeRange="Pickup window: +1 min"
                subtitle={`${hs.waitingCount} riders · +0.4 km detour`}
                meta="Tap to open scanner at point"
                onClick={() => navigate('/rider/scanner')}
              />
            ))}
          </TaskCarousel>
        </div>

        {/* 6. Cost Recovery Hero Summary (UI Spec §9.2 & §9.11) */}
        <Card variant="flat" className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-label text-text-2">COST RECOVERED (THIS MONTH)</span>
            <span className="font-label text-success">CAP: Rs 720</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-display-l text-white text-2xl font-bold">Rs 640</span>
            <span className="text-xs text-text-3">of actual fuel cost Rs 720</span>
          </div>
          <p className="text-[11px] text-text-3 italic">
            You share the fuel and toll cost of trips you were already making. You do not earn a fare.
          </p>
        </Card>
      </div>
    </div>
  );
};
