import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppBar } from '../../layouts/AppBar';
import { Card } from '../../components/primitives/Card';
import { Pill } from '../../components/primitives/Pill';
import { TrustRing } from '../../components/signature/TrustRing';
import { TickProgress } from '../../components/signature/TickProgress';
import { Segmented } from '../../components/primitives/Segmented';
import { useAppStore } from '../../store/useAppStore';
import {
  Award,
  ShieldCheck,
  Flame,
  Users,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Building,
} from 'lucide-react';

export const PeerTrustProfile: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAppStore();

  const [leaderboardTab, setLeaderboardTab] = useState<'pod' | 'campus' | 'streak'>('pod');
  const [showDisputeModal, setShowDisputeModal] = useState(false);
  const [disputeReason, setDisputeReason] = useState('');

  const user = currentUser || {
    name: 'Anitha Ramesh',
    tier: 'Trusted' as const,
    trustScore: 78,
    trustBreakdown: {
      safety: 28,
      reliability: 21,
      peerFeedback: 12,
      verificationLevel: 8,
      consistency: 6,
      rideCount: 3,
      totalScore: 78,
    },
    cleanRides: 28,
    streak: 9,
    badges: ['Always On Time', 'Verified Peer', 'Pod Pioneer'],
  };

  const badges = [
    { title: 'Always On Time', desc: 'Zero tardiness over 25 rides', unlocked: true },
    { title: 'Verified Peer', desc: 'Govt & College ID approved', unlocked: true },
    { title: 'Pod Pioneer', desc: 'Founding member of Velachery Pod', unlocked: true },
    { title: 'Guardian Shield', desc: '50 clean rides required', unlocked: false },
    { title: 'Community Anchor', desc: 'Admin appointed moderator tier', unlocked: false },
    { title: 'Eco Champion', desc: 'Saved > 50 kg CO2 in carpools', unlocked: false },
  ];

  return (
    <div className="flex-1 flex flex-col font-mono bg-bg text-text">
      <AppBar
        title="Trust & Reputation"
        showBack={false}
        pill={<Pill variant="available" label="SERVER VERIFIED" />}
      />

      <div className="flex-1 overflow-y-auto p-5 space-y-5 pb-8 no-scrollbar">
        {/* 1. Trust Score Ring & Breakdown (UI Spec §8.10 & §6.11) */}
        <Card variant="glow" className="p-5">
          <TrustRing
            score={user.trustScore}
            tier={user.tier}
            breakdown={user.trustBreakdown}
          />

          {/* Tier Progress: Clean rides to next tier */}
          <div className="mt-5 pt-4 border-t border-border/50 space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-text-2 font-label">TIER PROGRESS</span>
              <span className="text-success font-semibold">12 clean rides to Guardian</span>
            </div>
            <TickProgress
              value={user.cleanRides / 50}
              totalTicks={25}
              color="success"
            />
          </div>
        </Card>

        {/* 2. Badges Grid (UI Spec §8.10 3-columns) */}
        <div className="space-y-2">
          <span className="font-label text-text-2">EARNED BEHAVIOUR BADGES</span>
          <div className="grid grid-cols-3 gap-2">
            {badges.map((b) => (
              <div
                key={b.title}
                className={`p-3 rounded-card border flex flex-col items-center text-center justify-between transition-all ${
                  b.unlocked
                    ? 'bg-surface border-border text-white'
                    : 'bg-surface/30 border-border/40 text-text-3 opacity-40'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center mb-1.5 ${
                    b.unlocked
                      ? 'bg-primary/20 text-primary-soft border border-primary/30'
                      : 'bg-surface-2 text-text-3'
                  }`}
                >
                  <Award size={18} />
                </div>
                <div className="font-title-m text-xs font-semibold leading-tight line-clamp-2">
                  {b.title}
                </div>
                <span className="text-[9px] text-text-3 mt-1 line-clamp-2 leading-none">
                  {b.desc}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Vouching System (PRD §3.8 H4) */}
        <Card variant="flat" className="space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="font-label text-primary-soft">PEER VOUCHING</span>
            <span className="text-xs text-text-3">1 Vouch Available</span>
          </div>
          <p className="text-xs text-text-2">
            Trusted members can vouch for newcomers to accelerate their pod eligibility. Both parties share a small penalty if community standards are breached.
          </p>
          <button
            onClick={() => alert('Vouch code CC-VOUCH-78 generated')}
            className="w-full py-2.5 px-3 bg-surface-2 hover:bg-surface-2/80 border border-border text-xs text-white rounded-inner font-semibold"
          >
            Generate Peer Vouch Invite
          </button>
        </Card>

        {/* 4. Community Leaderboards (UI Spec §8.10 Pod · Campus · Streak) */}
        <div className="space-y-2">
          <span className="font-label text-text-2">COMMUNITY LEADERBOARD</span>
          <Segmented
            options={[
              { value: 'pod', label: 'Pods' },
              { value: 'campus', label: 'Campus' },
              { value: 'streak', label: 'Streaks' },
            ]}
            value={leaderboardTab}
            onChange={(val) => setLeaderboardTab(val as any)}
          />

          <div className="bg-surface rounded-card border border-border p-3 space-y-2">
            {leaderboardTab === 'pod' ? (
              <>
                <div className="p-2.5 bg-surface-2 rounded-inner border border-border flex items-center justify-between text-xs">
                  <span className="text-white font-semibold">1. OMR Women Commute Circle</span>
                  <span className="text-success font-bold">98 Rep · 22d Streak</span>
                </div>
                <div className="p-2.5 bg-surface-2 rounded-inner border border-border flex items-center justify-between text-xs">
                  <span className="text-white font-semibold">2. Velachery Tech Corridor Pod</span>
                  <span className="text-success font-bold">94 Rep · 16d Streak</span>
                </div>
              </>
            ) : leaderboardTab === 'campus' ? (
              <>
                <div className="p-2.5 bg-surface-2 rounded-inner border border-border flex items-center justify-between text-xs">
                  <span className="text-white font-semibold">1. IIT Madras (Guindy Corridor)</span>
                  <span className="text-primary-soft font-bold">148 Shared Commutes</span>
                </div>
                <div className="p-2.5 bg-surface-2 rounded-inner border border-border flex items-center justify-between text-xs">
                  <span className="text-white font-semibold">2. Anna University (CEG Guindy)</span>
                  <span className="text-primary-soft font-bold">112 Shared Commutes</span>
                </div>
              </>
            ) : (
              <>
                <div className="p-2.5 bg-surface-2 rounded-inner border border-border flex items-center justify-between text-xs">
                  <span className="text-white font-semibold">1. Meenakshi S. (Anchor)</span>
                  <span className="text-warn font-bold">25 Clean Streak</span>
                </div>
                <div className="p-2.5 bg-surface-2 rounded-inner border border-border flex items-center justify-between text-xs">
                  <span className="text-white font-semibold">2. Divya L. (Anchor)</span>
                  <span className="text-warn font-bold">19 Clean Streak</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Dispute a Rating Link (PRD §3.8 H8) */}
        <div className="text-center pt-2">
          <button
            onClick={() => setShowDisputeModal(true)}
            className="text-xs text-text-3 hover:text-text-2 underline font-caption"
          >
            Dispute an unfair rating or flag
          </button>
        </div>

        {showDisputeModal && (
          <div className="p-4 bg-surface-2 rounded-card border border-border space-y-3 animate-in fade-in">
            <h4 className="font-title-m text-white text-sm">Submit Rating Dispute</h4>
            <p className="text-xs text-text-3">
              Cases are reviewed by independent Community Anchor moderators with anonymised data.
            </p>
            <textarea
              placeholder="Explain the circumstance..."
              value={disputeReason}
              onChange={(e) => setDisputeReason(e.target.value)}
              className="w-full h-20 bg-surface border border-border rounded-inner p-2.5 text-xs text-white placeholder-text-3 font-mono outline-none"
            />
            <div className="flex gap-2">
              <button
                onClick={() => setShowDisputeModal(false)}
                className="flex-1 py-2 bg-surface text-text-3 rounded-inner text-xs"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert('Dispute submitted to moderator queue');
                  setShowDisputeModal(false);
                }}
                className="flex-1 py-2 bg-primary text-white rounded-inner text-xs font-semibold"
              >
                Submit Dispute
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
