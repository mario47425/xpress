import React from 'react';
import { AppBar } from '../../layouts/AppBar';
import { Card } from '../../components/primitives/Card';
import { Pill } from '../../components/primitives/Pill';
import { TrustRing } from '../../components/signature/TrustRing';
import { TickProgress } from '../../components/signature/TickProgress';
import { useAppStore } from '../../store/useAppStore';
import { Activity, ShieldCheck, Gauge, CheckCircle } from 'lucide-react';

export const RiderTrustProfile: React.FC = () => {
  const { currentUser } = useAppStore();

  const user = currentUser || {
    name: 'Karthik Subramanian',
    tier: 'Verified Guardian' as const,
    trustScore: 88,
    trustBreakdown: {
      safety: 32,
      reliability: 23,
      peerFeedback: 14,
      verificationLevel: 10,
      consistency: 5,
      rideCount: 4,
      totalScore: 88,
    },
    cleanRides: 62,
    streak: 14,
  };

  return (
    <div className="flex-1 flex flex-col font-mono bg-bg text-text">
      <AppBar
        title="Rider Trust & Driving Safety"
        showBack={false}
        pill={<Pill variant="progress" label="GUARDIAN TIER" />}
      />

      <div className="flex-1 overflow-y-auto p-5 space-y-5 pb-8 no-scrollbar">
        {/* Trust Score Ring */}
        <Card variant="glow" className="p-5">
          <TrustRing
            score={user.trustScore}
            tier={user.tier}
            breakdown={user.trustBreakdown}
          />
        </Card>

        {/* Driving Smoothness Component (UI Spec §9.10 & PRD §3.7 G10) */}
        <div className="space-y-2">
          <span className="font-label text-success flex items-center gap-1.5">
            <Activity size={14} /> MOTION SENSOR DRIVING SMOOTHNESS
          </span>
          <Card variant="flat" className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-white text-base font-bold">96 / 100 Smoothness</div>
                <div className="text-xs text-text-2">Zero hard braking or aggressive acceleration</div>
              </div>
              <Gauge size={28} className="text-success" />
            </div>

            <TickProgress
              value={0.96}
              totalTicks={28}
              color="success"
              leftLabel="SMOOTH"
              rightLabel="EXCELLENT"
            />

            <div className="p-2.5 bg-surface-2 rounded-inner border border-border text-xs text-text-3 font-mono">
              Phone accelerometer captures jerk metrics during active trips, contributing to your Guardian Tier discounts.
            </div>
          </Card>
        </div>

        {/* Safety Events Log (PRD §3.7 G10) */}
        <div className="space-y-2">
          <span className="font-label text-text-2">RECENT SAFETY AUDIT LOG</span>
          <div className="space-y-2">
            <div className="p-3 bg-surface rounded-inner border border-border flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <CheckCircle size={16} className="text-success" />
                <span className="text-white">Velachery ➔ Guindy Ride</span>
              </div>
              <span className="text-success font-semibold">100% Smooth</span>
            </div>
            <div className="p-3 bg-surface rounded-inner border border-border flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <CheckCircle size={16} className="text-success" />
                <span className="text-white">Campus Night Return</span>
              </div>
              <span className="text-success font-semibold">Lit Corridor Kept</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
