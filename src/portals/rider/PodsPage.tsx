import React, { useState } from 'react';
import { AppBar } from '../../layouts/AppBar';
import { Card } from '../../components/primitives/Card';
import { Button } from '../../components/primitives/Button';
import { Pill } from '../../components/primitives/Pill';
import { useAppStore } from '../../store/useAppStore';
import { Car, Users, CheckCircle, ArrowRightLeft, ShieldCheck, Calendar, ArrowRight } from 'lucide-react';

export const RiderPodsPage: React.FC = () => {
  const { pods } = useAppStore();
  const pod = pods[0];

  const [standbyAccepted, setStandbyAccepted] = useState(false);

  return (
    <div className="flex-1 flex flex-col font-mono bg-bg text-text">
      <AppBar
        title="Pod Driving Schedule"
        showBack={false}
        pill={<Pill variant="progress" label="POD FOUNDER" />}
      />

      <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 no-scrollbar">
        {/* Desktop 12-Column Responsive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column (7 cols): Driving Schedule & Passenger Manifest */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-6">
            {/* Driving Assignment Hero Card (UI Spec §9.9) */}
            <Card variant="glow" className="space-y-5 p-5 sm:p-6">
              <div className="flex items-center justify-between border-b border-border/50 pb-3">
                <span className="font-label text-success flex items-center gap-1.5 text-xs">
                  <Car size={16} /> YOUR DESIGNATED DRIVING DAYS
                </span>
                <Pill variant="progress" label="ACTIVE ROTATION" />
              </div>

              <div className="space-y-1">
                <h3 className="font-title-m text-white text-xl sm:text-2xl font-bold">
                  YOU DRIVE: Monday & Wednesday
                </h3>
                <p className="text-xs text-text-2">
                  Pod: <span className="text-white font-semibold">{pod?.name}</span> (Velachery → Guindy → IIT Corridor)
                </p>
                <div className="text-[11px] text-text-3">
                  Priya drives Tuesday/Thursday. Friday is designated flexible carpool day.
                </div>
              </div>

              {/* Members in your carpool */}
              <div className="pt-3 border-t border-border/50 space-y-2">
                <span className="font-label text-text-3 text-[10px] uppercase">
                  ASSIGNED PASSENGER OCCUPANTS (2 OF 3 SEATS FILLED)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                  {pod?.members.filter((m) => m.role === 'passenger').map((p) => (
                    <div
                      key={p.userId}
                      className="p-3 rounded-inner bg-surface-2 border border-border text-xs text-white flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-success" />
                        <span className="font-semibold">{p.name}</span>
                      </div>
                      <span className="text-[10px] text-text-3">Velachery Bypass</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* Pod Weekly Balance Ledger (PRD §3.4 D5 & UI Spec §9.9) */}
            <Card variant="flat" className="space-y-4 p-5">
              <div className="flex items-center justify-between">
                <span className="font-label text-text-2 text-xs">POD ROTATION BALANCE LEDGER</span>
                <span className="text-[10px] text-text-3 font-mono">AUTOMATIC WEEKLY NETTING</span>
              </div>
              <p className="text-xs text-text-2 leading-relaxed">
                Driving rotation fuel differences are automatically settled weekly to preserve strict cost-recovery parity:
              </p>

              <div className="space-y-2">
                <div className="p-3 bg-surface-2 rounded-inner border border-border flex items-center justify-between text-xs">
                  <div>
                    <span className="text-white font-medium">Karthik S. (Drives Mon/Wed)</span>
                    <span className="text-[10px] text-text-3 block">Carried 2 passengers 4 legs</span>
                  </div>
                  <span className="text-success font-bold text-sm">+Rs 142 (Credit)</span>
                </div>
                <div className="p-3 bg-surface-2 rounded-inner border border-border flex items-center justify-between text-xs">
                  <div>
                    <span className="text-white font-medium">Priya D. (Drives Tue/Thu)</span>
                    <span className="text-[10px] text-text-3 block">Carried 2 passengers 4 legs</span>
                  </div>
                  <span className="text-text-2 font-semibold">Balanced (0)</span>
                </div>
                <div className="p-3 bg-surface-2 rounded-inner border border-border flex items-center justify-between text-xs">
                  <div>
                    <span className="text-white font-medium">Anitha R. (Passenger only)</span>
                    <span className="text-[10px] text-text-3 block">Commuted 4 legs</span>
                  </div>
                  <span className="text-warn font-bold">-Rs 71 (Due to pool)</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column (5 cols): Standby Requests & Pod Controls */}
          <div className="lg:col-span-5 xl:col-span-4 space-y-6">
            {/* Incoming Standby Request Inbox (PRD §3.4 D3) */}
            <Card variant="flat" className="space-y-3.5 p-5 border-warn/40">
              <div className="flex items-center justify-between">
                <span className="font-label text-warn text-xs">STANDBY SUBSTITUTE INBOX</span>
                <Pill variant="waiting" label={standbyAccepted ? 'ACCEPTED' : 'PENDING'} />
              </div>

              {!standbyAccepted ? (
                <>
                  <div className="space-y-1">
                    <h4 className="font-title-m text-white text-sm font-semibold">
                      Harish K. requested substitute
                    </h4>
                    <p className="text-xs text-text-2 leading-relaxed">
                      College exam shift conflict today. Vignesh Rajan (Trusted Commuter · Score 82) is waiting along the corridor to take the seat.
                    </p>
                  </div>
                  <Button
                    variant="success"
                    size="default"
                    onClick={() => setStandbyAccepted(true)}
                    className="w-full text-xs font-semibold shadow-md mt-2"
                  >
                    Accept Vignesh Rajan as Substitute
                  </Button>
                </>
              ) : (
                <div className="p-4 bg-success/15 border border-success/30 rounded-inner text-xs text-success font-semibold text-center flex flex-col items-center gap-1.5">
                  <CheckCircle size={20} />
                  <span>Substitute accepted!</span>
                  <span className="text-[11px] text-text-2">
                    Vignesh Rajan added to your manifest for today.
                  </span>
                </div>
              )}
            </Card>

            {/* Quick Pod Settings */}
            <div className="p-5 bg-surface rounded-card border border-border space-y-3 text-xs text-text-3">
              <div className="flex items-center gap-2 text-white font-semibold">
                <ShieldCheck size={16} className="text-success" />
                <span>Pod Driving Standards</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                As a Pod Founder and Guardian driver, keep emergency contacts synced and confirm every boarding with the QR scanner.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
