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
  UserCheck,
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
        title="Trust & Reputation Profile"
        showBack={false}
        pill={<Pill variant="available" label="SERVER VERIFIED" />}
      />

      <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 no-scrollbar">
        {/* Desktop 12-Column Responsive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column (6 cols): Trust Score Ring, Breakdown, Badges */}
          <div className="lg:col-span-6 space-y-6">
            {/* 1. Trust Score Ring & Breakdown */}
            <Card variant="glow" className="p-5 sm:p-6">
              <TrustRing
                score={user.trustScore}
                tier={user.tier}
                breakdown={user.trustBreakdown}
              />

              {/* Tier Progress: Clean rides to next tier */}
              <div className="mt-5 pt-4 border-t border-border/50 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-text-2 font-label">TIER PROGRESSION</span>
                  <span className="text-success font-semibold">12 clean rides to Guardian</span>
                </div>
                <TickProgress
                  value={user.cleanRides / 50}
                  totalTicks={28}
                  color="success"
                  leftLabel="LEVEL 2: TRUSTED"
                  rightLabel="LEVEL 3: GUARDIAN"
                />
              </div>
            </Card>

            {/* 2. Badges Grid */}
            <div className="space-y-3">
              <span className="font-label text-text-2 text-xs">EARNED BEHAVIOUR BADGES</span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {badges.map((b) => (
                  <div
                    key={b.title}
                    className={`p-3.5 rounded-card border flex flex-col items-center text-center justify-between transition-all ${
                      b.unlocked
                        ? 'bg-surface border-border text-white shadow-sm'
                        : 'bg-surface/30 border-border/40 text-text-3 opacity-40'
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                        b.unlocked
                          ? 'bg-primary/20 text-primary-soft border border-primary/30'
                          : 'bg-surface-2 text-text-3'
                      }`}
                    >
                      <Award size={20} />
                    </div>
                    <div className="font-title-m text-xs font-semibold leading-tight">
                      {b.title}
                    </div>
                    <span className="text-[10px] text-text-3 mt-1 leading-snug">
                      {b.desc}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column (6 cols): Leaderboard, Vouching, Privacy Ladder, Dispute */}
          <div className="lg:col-span-6 space-y-6">
            {/* 3. Community Leaderboards */}
            <div className="space-y-3">
              <span className="font-label text-text-2 text-xs">CHENNAI COMMUNITY LEADERBOARD</span>
              <Segmented
                options={[
                  { value: 'pod', label: 'Pods' },
                  { value: 'campus', label: 'Campus' },
                  { value: 'streak', label: 'Streaks' },
                ]}
                value={leaderboardTab}
                onChange={(val) => setLeaderboardTab(val as any)}
              />

              <div className="bg-surface rounded-card border border-border p-4 space-y-2.5 shadow-sm">
                {leaderboardTab === 'pod' ? (
                  <>
                    <div className="p-3 bg-surface-2 rounded-inner border border-border flex items-center justify-between text-xs">
                      <div>
                        <span className="text-white font-semibold block">1. OMR Women Commute Circle</span>
                        <span className="text-[10px] text-text-3">12 active peers</span>
                      </div>
                      <span className="text-success font-bold">98 Rep · 22d Streak</span>
                    </div>
                    <div className="p-3 bg-surface-2 rounded-inner border border-border flex items-center justify-between text-xs">
                      <div>
                        <span className="text-white font-semibold block">2. Velachery Tech Corridor Pod</span>
                        <span className="text-[10px] text-text-3">8 active peers</span>
                      </div>
                      <span className="text-success font-bold">94 Rep · 16d Streak</span>
                    </div>
                  </>
                ) : leaderboardTab === 'campus' ? (
                  <>
                    <div className="p-3 bg-surface-2 rounded-inner border border-border flex items-center justify-between text-xs">
                      <span className="text-white font-semibold">1. IIT Madras (Guindy Corridor)</span>
                      <span className="text-primary-soft font-bold">148 Shared Commutes</span>
                    </div>
                    <div className="p-3 bg-surface-2 rounded-inner border border-border flex items-center justify-between text-xs">
                      <span className="text-white font-semibold">2. Anna University (CEG Guindy)</span>
                      <span className="text-primary-soft font-bold">112 Shared Commutes</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="p-3 bg-surface-2 rounded-inner border border-border flex items-center justify-between text-xs">
                      <span className="text-white font-semibold">1. Meenakshi S. (Community Anchor)</span>
                      <span className="text-warn font-bold">25 Clean Streak</span>
                    </div>
                    <div className="p-3 bg-surface-2 rounded-inner border border-border flex items-center justify-between text-xs">
                      <span className="text-white font-semibold">2. Divya L. (Verified Guardian)</span>
                      <span className="text-warn font-bold">19 Clean Streak</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* 4. Peer Vouching System */}
            <Card variant="flat" className="space-y-3 p-5">
              <div className="flex items-center justify-between">
                <span className="font-label text-primary-soft text-xs">PEER VOUCHING SYSTEM</span>
                <span className="px-2 py-0.5 rounded-pill bg-primary/20 border border-primary/40 text-[10px] text-primary-soft font-semibold">
                  1 Vouch Available
                </span>
              </div>
              <p className="text-xs text-text-2 leading-relaxed">
                Trusted members can vouch for known colleagues or campus peers to fast-track their verification. Shared accountability applies.
              </p>
              <button
                onClick={() => alert('Vouch invite code CC-VOUCH-CHENNAI generated!')}
                className="w-full py-2.5 px-3 bg-surface-2 hover:bg-surface-2/80 border border-border text-xs text-white rounded-inner font-semibold transition-colors"
              >
                Generate Peer Vouch Invite Link
              </button>
            </Card>

            {/* Dispute an unfair rating */}
            <div className="text-center pt-2">
              <button
                onClick={() => setShowDisputeModal(true)}
                className="text-xs text-text-3 hover:text-white underline font-caption transition-colors"
              >
                Dispute an unfair rating or incident flag
              </button>
            </div>

            {showDisputeModal && (
              <div className="p-4 bg-surface rounded-card border border-border space-y-3 animate-in fade-in shadow-xl">
                <h4 className="font-title-m text-white text-sm">Submit Rating Dispute</h4>
                <p className="text-xs text-text-3">
                  Cases are reviewed by independent Community Anchor moderators with cryptographic proof logs.
                </p>
                <textarea
                  placeholder="Explain the circumstance..."
                  value={disputeReason}
                  onChange={(e) => setDisputeReason(e.target.value)}
                  className="w-full h-20 bg-surface-2 border border-border rounded-inner p-2.5 text-xs text-white placeholder-text-3 font-mono outline-none"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowDisputeModal(false)}
                    className="flex-1 py-2 bg-surface-2 text-text-3 rounded-inner text-xs"
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
      </div>
    </div>
  );
};
