import React, { useState } from 'react';
import { AppBar } from '../../layouts/AppBar';
import { Card } from '../../components/primitives/Card';
import { Button } from '../../components/primitives/Button';
import { Pill } from '../../components/primitives/Pill';
import { useAppStore } from '../../store/useAppStore';
import {
  Users,
  Car,
  UserCheck,
  Flame,
  ShieldCheck,
  AlertCircle,
  Plus,
  Calendar,
  Clock,
  Sparkles,
  Info,
} from 'lucide-react';

export const PeerPodsPage: React.FC = () => {
  const { pods, currentUser } = useAppStore();

  const [activePodIdx, setActivePodIdx] = useState(0);
  const [standbyRequested, setStandbyRequested] = useState(false);

  const pod = pods[activePodIdx] || pods[0];

  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const today = 'Mon'; // Demo day

  const handleRequestSubstitute = () => {
    setStandbyRequested(true);
  };

  return (
    <div className="flex-1 flex flex-col font-mono bg-bg text-text">
      <AppBar
        title="Recurring Commute Pods"
        showBack={false}
        pill={<Pill variant="progress" label={`${pods.length} PODS ACTIVE`} />}
      />

      <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 no-scrollbar">
        {/* Pod Selector Tabs & Actions Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            {pods.map((p, idx) => (
              <button
                key={p.id}
                onClick={() => setActivePodIdx(idx)}
                className={`px-4 py-2.5 rounded-btn border text-xs font-semibold whitespace-nowrap transition-all ${
                  activePodIdx === idx
                    ? 'bg-primary text-white border-primary-soft shadow-md'
                    : 'bg-surface text-text-3 border-border hover:bg-surface-2'
                }`}
              >
                {p.name}
              </button>
            ))}
          </div>

          <button
            onClick={() => alert('New Pod creation wizard opened')}
            className="px-3.5 py-2 bg-surface hover:bg-surface-2 border border-border text-xs text-white rounded-inner flex items-center justify-center gap-1.5 self-start sm:self-auto transition-colors"
          >
            <Plus size={14} className="text-primary-soft" />
            <span>Create New Pod</span>
          </button>
        </div>

        {/* Responsive 12-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column (7 cols on lg/xl): Hero Pod Card, Rotation, Members */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-6">
            {/* 1. Pod Dashboard Hero Card */}
            {pod && (
              <Card variant="glow" className="space-y-5 p-5 sm:p-6">
                <div className="flex items-start justify-between border-b border-border/50 pb-4">
                  <div>
                    <span className="font-label text-primary-soft text-[10px] uppercase">
                      CORRIDOR POD · {pod.isWomenOnly ? 'WOMEN ONLY VERIFIED' : 'COMMUTER NETWORK'}
                    </span>
                    <h3 className="font-title-m text-white text-lg sm:text-xl font-bold mt-1">
                      {pod.name}
                    </h3>
                    <p className="text-xs text-text-3 mt-0.5">
                      Corridor: Velachery Bypass ⇄ Guindy Metro ⇄ IIT Madras Gate
                    </p>
                  </div>
                  <Pill variant="progress" label={`REPUTATION: ${pod.reputation}%`} />
                </div>

                {/* Member Avatars Row */}
                <div className="space-y-2">
                  <span className="font-label text-text-3 text-[10px] uppercase">
                    POD COMMUTE MEMBERS ({pod.members.length})
                  </span>
                  <div className="flex flex-wrap items-center gap-4">
                    {pod.members.map((m) => (
                      <div key={m.userId} className="flex items-center gap-2.5 p-2 bg-surface-2 rounded-inner border border-border">
                        <div className="w-10 h-10 rounded-full overflow-hidden border border-border bg-surface shrink-0">
                          <img src={m.avatar} alt={m.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <div className="text-xs text-white font-medium">{m.name}</div>
                          <span className="text-[10px] text-text-3 uppercase">
                            {m.role === 'driver' ? '🚗 Driver' : '🎒 Commuter'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Stats Metrics: Money Saved, CO2, Streak */}
                <div className="grid grid-cols-3 gap-3 pt-4 border-t border-border/50 text-center">
                  <div className="p-3 bg-surface-2 rounded-inner">
                    <span className="font-label text-text-3 text-[9px]">TOTAL SAVED</span>
                    <div className="font-title-m text-white text-base sm:text-lg font-bold mt-0.5">
                      Rs {pod.totalMoneySaved}
                    </div>
                  </div>
                  <div className="p-3 bg-surface-2 rounded-inner">
                    <span className="font-label text-text-3 text-[9px]">CO₂ AVOIDED</span>
                    <div className="font-title-m text-success text-base sm:text-lg font-bold mt-0.5">
                      {pod.totalCo2SavedKg} kg
                    </div>
                  </div>
                  <div className="p-3 bg-surface-2 rounded-inner">
                    <span className="font-label text-text-3 text-[9px]">POD CLEAN STREAK</span>
                    <div className="font-title-m text-warn text-base sm:text-lg font-bold flex items-center justify-center gap-1 mt-0.5">
                      <Flame size={15} className="text-warn fill-warn" />
                      <span>{pod.streakCount}d</span>
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {/* 2. Driver Rotation Schedule */}
            <div className="space-y-3">
              <span className="font-label text-text-2 text-xs">7-DAY ROTATION CALENDAR</span>
              <div className="grid grid-cols-7 gap-2 bg-surface p-3 sm:p-4 rounded-card border border-border">
                {daysOfWeek.map((day) => {
                  const isToday = day === today;
                  const isDriverDay = ['Mon', 'Wed'].includes(day);

                  return (
                    <div
                      key={day}
                      className={`flex flex-col items-center py-3 px-1 rounded-inner text-center font-mono ${
                        isToday ? 'bg-primary/20 border border-primary-soft shadow' : 'bg-surface-2'
                      }`}
                    >
                      <span className="text-[10px] font-label text-text-3">{day}</span>
                      {isDriverDay ? (
                        <Car size={18} className="text-success my-2" />
                      ) : (
                        <div className="w-2 h-2 rounded-full bg-text-3 my-3" />
                      )}
                      <span className="text-[10px] text-white font-medium truncate w-full px-1">
                        {isDriverDay ? 'Karthik' : 'Priya'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column (5 cols on lg, 4 cols on xl): Standby Substitutes & Pod Rules */}
          <div className="lg:col-span-5 xl:col-span-4 space-y-6">
            {/* 3. Standby Substitute Pool */}
            <Card variant="flat" className="space-y-3.5 p-5">
              <div className="flex items-center justify-between">
                <span className="font-label text-text-2 text-xs">AUTOMATIC STANDBY POOL</span>
                <Pill variant="available" label="CORRIDOR VERIFIED" />
              </div>
              <p className="text-xs text-text-2 leading-relaxed">
                If any commuter cancels on short notice, verified standby peers from the corridor pool are notified immediately:
              </p>

              <div className="space-y-2">
                {pod?.standbyCandidates.map((cand) => (
                  <div
                    key={cand.userId}
                    className="p-3 bg-surface-2 rounded-inner border border-border flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <UserCheck size={16} className="text-primary-soft" />
                      <span className="text-white font-semibold">{cand.name}</span>
                    </div>
                    <Pill variant="available" label={cand.tier.toUpperCase()} />
                  </div>
                ))}
              </div>

              {!standbyRequested ? (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleRequestSubstitute}
                  className="w-full text-xs text-text-2 hover:text-white mt-2"
                >
                  Can't Commute Today? Request Standby
                </Button>
              ) : (
                <div className="p-3 bg-success/15 border border-success/30 rounded-inner text-xs text-success font-semibold text-center mt-2">
                  Standby substitute request broadcasted to corridor pool!
                </div>
              )}
            </Card>

            {/* Pod Rules & Commitment */}
            <div className="p-5 bg-surface rounded-card border border-border space-y-3 text-xs text-text-2">
              <div className="flex items-center gap-2 text-white font-semibold">
                <ShieldCheck size={16} className="text-success" />
                <span>Pod Community Guidelines</span>
              </div>
              <ul className="space-y-2 text-[11px] text-text-3 list-disc pl-4 leading-relaxed">
                <li>Pickups happen strictly at designated hotspot zones.</li>
                <li>Maximum 5-minute departure grace window.</li>
                <li>Single-use QR Journey Pass required for each boarding.</li>
                <li>Expenses calculated by statutory fair-fare cost recovery.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
