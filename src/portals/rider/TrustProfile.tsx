import React from 'react';
import { AppBar } from '../../layouts/AppBar';
import { Card } from '../../components/primitives/Card';
import { Pill } from '../../components/primitives/Pill';
import { TrustRing } from '../../components/signature/TrustRing';
import { TickProgress } from '../../components/signature/TickProgress';
import { useAppStore } from '../../store/useAppStore';
import { Activity, ShieldCheck, Gauge, CheckCircle, Car, Award } from 'lucide-react';

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
    <div className="flex-1 flex flex-col bg-bg text-text">
      <AppBar
        title="Rider Trust & Driving Safety"
        showBack={false}
        pill={<Pill variant="progress" label="GUARDIAN TIER" />}
      />

      <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 no-scrollbar">
        {/* Desktop 12-Column Responsive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column (6 cols): Trust Score Ring & Breakdown */}
          <div className="lg:col-span-6 space-y-6">
            <Card variant="glow" className="p-5 sm:p-6">
              <TrustRing
                score={user.trustScore}
                tier={user.tier}
                breakdown={user.trustBreakdown}
              />

              <div className="mt-5 pt-4 border-t border-border/60 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-text-muted font-label font-bold">GUARDIAN STANDING</span>
                  <span className="text-success font-semibold">62 Clean Rides Recorded</span>
                </div>
                <TickProgress
                  value={1}
                  totalTicks={28}
                  color="success"
                  leftLabel="TRUSTED"
                  rightLabel="GUARDIAN (ACHIEVED)"
                />
              </div>
            </Card>

            {/* Vehicle & Driving Credentials Card */}
            <Card variant="flat" className="p-5 sm:p-6 space-y-3.5">
              <span className="font-label text-text font-bold text-xs">VERIFIED VEHICLE CREDENTIALS</span>
              <div className="p-3.5 bg-surface-2 rounded-inner border border-border text-xs space-y-2.5">
                <div className="flex justify-between text-text-muted">
                  <span>Vehicle:</span>
                  <span className="text-text font-semibold">Honda City 1.5 i-VTEC (White)</span>
                </div>
                <div className="flex justify-between text-text-muted">
                  <span>License Plate:</span>
                  <span className="text-text font-semibold">TN 09 AB 4821</span>
                </div>
                <div className="flex justify-between text-text-muted">
                  <span>RC Verification:</span>
                  <span className="text-success font-semibold">Vaahan DB Verified ✓</span>
                </div>
                <div className="flex justify-between text-text-muted">
                  <span>Comprehensive Insurance:</span>
                  <span className="text-success font-semibold">Valid until Oct 2027 ✓</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column (6 cols): Driving Smoothness & Safety Audit Log */}
          <div className="lg:col-span-6 space-y-6">
            {/* Driving Smoothness Component (UI Spec §9.10 & PRD §3.7 G10) */}
            <div className="space-y-3">
              <span className="font-label text-success text-xs font-bold flex items-center gap-1.5">
                <Activity size={16} /> MOTION SENSOR DRIVING SMOOTHNESS
              </span>
              <Card variant="flat" className="p-5 sm:p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-text text-2xl sm:text-3xl font-bold">96 / 100 Smoothness</div>
                    <div className="text-xs text-text-muted mt-1 font-medium">
                      Zero hard braking, rapid acceleration, or sharp cornering
                    </div>
                  </div>
                  <Gauge size={40} className="text-success" />
                </div>

                <TickProgress
                  value={0.96}
                  totalTicks={28}
                  color="success"
                  leftLabel="SMOOTH"
                  rightLabel="EXCELLENT (96)"
                />

                <div className="p-3.5 bg-surface-2 rounded-inner border border-border text-xs text-text-muted leading-relaxed">
                  Mobile accelerometer telematics automatically calculate smoothness during active drives, preserving Guardian tier status and passenger confidence.
                </div>
              </Card>
            </div>

            {/* Safety Events Log (PRD §3.7 G10) */}
            <div className="space-y-3">
              <span className="font-label text-text-muted text-xs font-bold tracking-wider">RECENT SAFETRAIL AUDIT LOG</span>
              <div className="space-y-2.5">
                <div className="p-4 bg-surface rounded-card border border-border flex items-center justify-between text-xs shadow-card">
                  <div className="flex items-center gap-3">
                    <CheckCircle size={18} className="text-success shrink-0" />
                    <div>
                      <span className="text-text font-bold block text-sm">Velachery Bypass ➔ Guindy Ride</span>
                      <span className="text-[11px] text-text-muted font-medium">Yesterday 08:35</span>
                    </div>
                  </div>
                  <span className="text-success font-semibold">100% Corridor Adherence</span>
                </div>
                <div className="p-4 bg-surface rounded-card border border-border flex items-center justify-between text-xs shadow-card">
                  <div className="flex items-center gap-3">
                    <CheckCircle size={18} className="text-success shrink-0" />
                    <div>
                      <span className="text-text font-bold block text-sm">Campus Night Return</span>
                      <span className="text-[11px] text-text-muted font-medium">27 Sep 18:20</span>
                    </div>
                  </div>
                  <span className="text-success font-semibold">Well-Lit Safe Corridors Kept</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
