import React, { useState } from 'react';
import { AppBar } from '../../layouts/AppBar';
import { Card } from '../../components/primitives/Card';
import { Button } from '../../components/primitives/Button';
import { Pill } from '../../components/primitives/Pill';
import { TickProgress } from '../../components/signature/TickProgress';
import { useAppStore } from '../../store/useAppStore';
import { Users, Car, UserCheck, Flame, ShieldCheck, AlertCircle } from 'lucide-react';

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
        title="Recurring Pods"
        showBack={false}
        pill={<Pill variant="progress" label={`${pods.length} PODS ACTIVE`} />}
      />

      <div className="flex-1 overflow-y-auto p-5 space-y-5 pb-8 no-scrollbar">
        {/* Pod Selector Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          {pods.map((p, idx) => (
            <button
              key={p.id}
              onClick={() => setActivePodIdx(idx)}
              className={`px-3.5 py-2 rounded-btn border text-xs font-semibold whitespace-nowrap transition-all ${
                activePodIdx === idx
                  ? 'bg-primary text-white border-primary-soft shadow-md'
                  : 'bg-surface text-text-3 border-border hover:bg-surface-2'
              }`}
            >
              {p.name}
            </button>
          ))}
        </div>

        {/* 1. Pod Dashboard Hero Card (UI Spec §8.9 & PRD §3.4) */}
        {pod && (
          <Card variant="glow" className="space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="font-label text-primary-soft text-[10px]">
                  CORRIDOR POD · {pod.isWomenOnly ? 'WOMEN ONLY' : 'COMMUTER'}
                </span>
                <h3 className="font-title-m text-white text-base font-bold mt-0.5">
                  {pod.name}
                </h3>
              </div>
              <Pill variant="progress" label={`REP ${pod.reputation}%`} />
            </div>

            {/* Member Avatars Row */}
            <div className="flex items-center gap-3">
              {pod.members.map((m) => (
                <div key={m.userId} className="flex flex-col items-center">
                  <div className="w-11 h-11 rounded-full overflow-hidden border border-border bg-surface-2">
                    <img src={m.avatar} alt={m.name} className="w-full h-full object-cover" />
                  </div>
                  <span className="text-[10px] text-white font-medium mt-1 truncate max-w-[56px]">
                    {m.name.split(' ')[0]}
                  </span>
                  <span className="text-[9px] text-text-3 uppercase">
                    {m.role === 'driver' ? 'Driver' : 'Rider'}
                  </span>
                </div>
              ))}
            </div>

            {/* Stats Metrics: Money Saved, CO2, Streak */}
            <div className="grid grid-cols-3 gap-2 pt-3 border-t border-border/50 text-center">
              <div>
                <span className="font-label text-text-3 text-[9px]">SAVED</span>
                <div className="font-title-m text-white text-sm font-bold">Rs {pod.totalMoneySaved}</div>
              </div>
              <div>
                <span className="font-label text-text-3 text-[9px]">CO₂ AVOIDED</span>
                <div className="font-title-m text-success text-sm font-bold">{pod.totalCo2SavedKg} kg</div>
              </div>
              <div>
                <span className="font-label text-text-3 text-[9px]">POD STREAK</span>
                <div className="font-title-m text-warn text-sm font-bold flex items-center justify-center gap-1">
                  <Flame size={14} className="text-warn fill-warn" />
                  <span>{pod.streakCount}d</span>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* 2. Driver Rotation Schedule (UI Spec §8.9 7-day strip) */}
        <div className="space-y-2">
          <span className="font-label text-text-2">DRIVER ROTATION SCHEDULE</span>
          <div className="grid grid-cols-7 gap-1.5 bg-surface p-2.5 rounded-card border border-border">
            {daysOfWeek.map((day) => {
              const isToday = day === today;
              const isDriverDay = ['Mon', 'Wed'].includes(day);

              return (
                <div
                  key={day}
                  className={`flex flex-col items-center py-2 px-1 rounded-inner text-center font-mono ${
                    isToday ? 'bg-primary/20 border border-primary-soft' : 'bg-surface-2'
                  }`}
                >
                  <span className="text-[10px] font-label text-text-3">{day}</span>
                  {isDriverDay ? (
                    <Car size={16} className="text-success my-1" />
                  ) : (
                    <div className="w-1.5 h-1.5 rounded-full bg-text-3 my-2" />
                  )}
                  <span className="text-[9px] text-white font-medium">
                    {isDriverDay ? 'Karthik' : 'Priya'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. Standby Substitute Pool (PRD §3.4 D3) */}
        <div className="space-y-2">
          <span className="font-label text-text-2">STANDBY POOL (AUTOMATIC SUBSTITUTE)</span>
          <Card variant="flat" className="space-y-3">
            <p className="text-xs text-text-2">
              If any member cancels a commute, verified standby substitutes from the corridor pool are notified immediately:
            </p>

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

            {!standbyRequested ? (
              <Button
                variant="secondary"
                size="sm"
                onClick={handleRequestSubstitute}
                className="w-full text-xs text-text-2 hover:text-white"
              >
                Can't Commute Today? Request Standby Substitute
              </Button>
            ) : (
              <div className="p-3 bg-success/15 border border-success/30 rounded-inner text-xs text-success font-semibold text-center">
                Standby substitute request broadcasted to corridor pool!
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};
