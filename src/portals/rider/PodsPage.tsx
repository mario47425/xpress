import React, { useState } from 'react';
import { AppBar } from '../../layouts/AppBar';
import { Card } from '../../components/primitives/Card';
import { Button } from '../../components/primitives/Button';
import { Pill } from '../../components/primitives/Pill';
import { useAppStore } from '../../store/useAppStore';
import { Car, Users, CheckCircle, ArrowRightLeft, ShieldCheck } from 'lucide-react';

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

      <div className="flex-1 overflow-y-auto p-5 space-y-5 pb-8 no-scrollbar">
        {/* Driving Assignment Hero Card (UI Spec §9.9) */}
        <Card variant="glow" className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-label text-success flex items-center gap-1.5">
              <Car size={16} /> YOUR DRIVING DAYS
            </span>
            <Pill variant="progress" label="ACTIVE ROTATION" />
          </div>

          <div className="space-y-1">
            <h3 className="font-title-m text-white text-lg font-bold">
              YOU DRIVE: Mon · Wed
            </h3>
            <p className="text-xs text-text-2">
              Pod: {pod?.name} (Velachery → Guindy → IIT Corridor)
            </p>
          </div>

          {/* Members in your carpool */}
          <div className="pt-2 border-t border-border/50">
            <span className="font-label text-text-3 text-[10px] uppercase">
              Assigned Passenger Occupants
            </span>
            <div className="flex items-center gap-2 mt-2">
              {pod?.members.filter((m) => m.role === 'passenger').map((p) => (
                <div
                  key={p.userId}
                  className="px-3 py-1.5 rounded-inner bg-surface-2 border border-border text-xs text-white flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-success" />
                  <span>{p.name}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Incoming Standby Request Inbox (PRD §3.4 D3) */}
        <div className="space-y-2">
          <span className="font-label text-warn">STANDBY SUBSTITUTE INBOX</span>
          <Card variant="flat" className="space-y-3 border-warn/30">
            {!standbyAccepted ? (
              <>
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-title-m text-white text-sm">
                      Harish K. requested substitute
                    </h4>
                    <p className="text-xs text-text-2 mt-0.5">
                      Exam shift conflict today · Vignesh Rajan (Trusted) available to take seat
                    </p>
                  </div>
                  <Pill variant="waiting" label="PENDING" />
                </div>
                <Button
                  variant="success"
                  size="sm"
                  onClick={() => setStandbyAccepted(true)}
                  className="w-full text-xs font-semibold"
                >
                  Accept Vignesh Rajan as Substitute
                </Button>
              </>
            ) : (
              <div className="p-3 bg-success/15 border border-success/30 rounded-inner text-xs text-success font-semibold text-center flex items-center justify-center gap-2">
                <CheckCircle size={16} />
                <span>Substitute accepted! Seat manifest updated for your drive.</span>
              </div>
            )}
          </Card>
        </div>

        {/* Pod Weekly Balance Ledger (PRD §3.4 D5 & UI Spec §9.9) */}
        <div className="space-y-2">
          <span className="font-label text-text-2">POD ROTATION BALANCE LEDGER</span>
          <Card variant="flat" className="space-y-3">
            <p className="text-xs text-text-2">
              Driving rotation differences are automatically netted weekly to ensure cost-recovery parity:
            </p>

            <div className="space-y-2">
              <div className="p-2.5 bg-surface-2 rounded-inner border border-border flex items-center justify-between text-xs">
                <span className="text-white">Karthik S. (Drives Mon/Wed)</span>
                <span className="text-success font-semibold">+Rs 142 (Credit)</span>
              </div>
              <div className="p-2.5 bg-surface-2 rounded-inner border border-border flex items-center justify-between text-xs">
                <span className="text-white">Priya D. (Drives Tue/Thu)</span>
                <span className="text-text-2 font-semibold">Balanced (0)</span>
              </div>
              <div className="p-2.5 bg-surface-2 rounded-inner border border-border flex items-center justify-between text-xs">
                <span className="text-white">Anitha R. (Passenger only)</span>
                <span className="text-warn font-semibold">-Rs 71 (Due to pool)</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
