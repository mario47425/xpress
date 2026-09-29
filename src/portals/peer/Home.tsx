import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppBar } from '../../layouts/AppBar';
import { Card } from '../../components/primitives/Card';
import { Button } from '../../components/primitives/Button';
import { Pill } from '../../components/primitives/Pill';
import { LiveNavCard } from '../../components/signature/LiveNavCard';
import { TaskCard, TaskCarousel } from '../../components/signature/TaskCard';
import { useAppStore } from '../../store/useAppStore';
import { Sparkles, MapPin, ShieldCheck, ArrowRight, Route } from 'lucide-react';

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

  return (
    <div className="flex-1 flex flex-col font-mono">
      <AppBar showBack={false} />

      <div className="p-5 space-y-5 pb-8">
        {/* User Greeting & Quick Stat */}
        <div className="flex items-center justify-between">
          <div>
            <span className="font-caption text-text-3 text-xs">CHENNAI · COMMUTER</span>
            <h2 className="font-title-m text-white text-lg font-bold">
              Good morning, {currentUser?.name.split(' ')[0] || 'Anitha'}
            </h2>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-pill bg-surface-2 border border-border">
            <ShieldCheck size={14} className="text-success" />
            <span className="font-pill text-[10px] text-text-2">
              {currentUser?.tier.toUpperCase()}
            </span>
          </div>
        </div>

        {/* 1. Ghost Commute Proposal Card (UI Spec §8.2 & PRD §3.3) */}
        {activePred && activePred.status !== 'skipped' ? (
          <Card variant="glow" className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-label text-primary-soft flex items-center gap-1.5">
                <Sparkles size={14} className="text-warn" />
                GHOST COMMUTE · TOMORROW
              </span>
              <Pill
                variant={activePred.confidence >= 80 ? 'progress' : 'waiting'}
                label={`CONF ${activePred.confidence}%`}
              />
            </div>

            <div className="space-y-1">
              <h3 className="font-title-m text-white text-base font-semibold">
                {activePred.time} · {activePred.origin} → {activePred.destination}
              </h3>
              <p className="font-body-m text-xs text-text-2">
                {activePred.ridersCount || 3} riders in corridor · Rs {activePred.estimatedCostShare}
              </p>
            </div>

            {activePred.status === 'confirmed' ? (
              <div className="flex items-center justify-between p-3 rounded-inner bg-success/15 border border-success/30 text-success text-xs font-semibold">
                <span>RIDE PROPOSAL CONFIRMED ✓</span>
                <button
                  onClick={() => navigate('/app/waiting/hs-3')}
                  className="underline text-white hover:text-success"
                >
                  Go to Hotspot ➔
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3 pt-1">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleSkip(activePred.id)}
                  className="flex-1"
                >
                  Skip
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  loading={confirmingId === activePred.id}
                  onClick={() => handleConfirm(activePred.id)}
                  className="flex-1"
                >
                  Confirm
                </Button>
              </div>
            )}
          </Card>
        ) : (
          <Card variant="flat" className="text-center py-6 space-y-2">
            <Route size={28} className="text-text-3 mx-auto" />
            <h4 className="font-title-m text-white text-sm">No proposals for tomorrow</h4>
            <p className="text-xs text-text-3">Update your weekly schedule to get predictive matches.</p>
          </Card>
        )}

        {/* 2. Active Ride Mini Banner / Live Nav (UI Spec §8.2) */}
        {liveRide && (liveRide.status === 'IN_TRANSIT' || liveRide.status === 'VERIFIED') && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-label text-success">ACTIVE RIDE IN PROGRESS</span>
              <Pill variant="progress" label={liveRide.status} />
            </div>
            <div onClick={() => navigate(`/app/live-ride/${liveRide.id}`)} className="cursor-pointer">
              <LiveNavCard
                instruction="Heading to IIT Madras Main Gate"
                distance="0.4 km"
                etaMins="6 MIN"
                arrivalTime="08:26 AM"
                progress={0.7}
              />
            </div>
          </div>
        )}

        {/* 3. Next Tasks & Hotspots Carousel (UI Spec §6.7 & §8.2) */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="font-label text-text-2">POPULAR PICKUP HOTSPOTS</span>
            <button
              onClick={() => navigate('/app/map')}
              className="font-caption text-primary-soft text-xs flex items-center gap-1 hover:underline"
            >
              View all <ArrowRight size={12} />
            </button>
          </div>

          <TaskCarousel>
            {hotspots.slice(0, 4).map((hs) => (
              <TaskCard
                key={hs.id}
                title={hs.name}
                pillVariant="waiting"
                pillLabel={`${hs.waitingCount} WAITING`}
                timeRange={`Avg Wait: ${hs.avgWaitMins} min`}
                subtitle={`Confidence: ${hs.historicalConfidence}% · Lit & Safe`}
                meta="Tap to join waiting queue"
                onClick={() => navigate(`/app/waiting/${hs.id}`)}
              />
            ))}
          </TaskCarousel>
        </div>

        {/* 4. Eco & Commute Savings Summary (UI Spec §8.2) */}
        <Card variant="flat" className="flex items-center justify-around py-4">
          <div className="text-center">
            <span className="font-label text-text-3 text-[10px]">SAVINGS</span>
            <div className="font-title-m text-white text-lg font-bold mt-0.5">Rs 412</div>
          </div>
          <div className="w-[1px] h-8 bg-border" />
          <div className="text-center">
            <span className="font-label text-text-3 text-[10px]">CO₂ AVOIDED</span>
            <div className="font-title-m text-success text-lg font-bold mt-0.5">6.2 kg</div>
          </div>
          <div className="w-[1px] h-8 bg-border" />
          <div className="text-center">
            <span className="font-label text-text-3 text-[10px]">CLEAN STREAK</span>
            <div className="font-title-m text-warn text-lg font-bold mt-0.5">9 Days</div>
          </div>
        </Card>
      </div>
    </div>
  );
};
