import React from 'react';
import { TrustTier, TrustBreakdown } from '../../types';

export interface TrustRingProps {
  score: number;
  tier: TrustTier;
  breakdown: TrustBreakdown;
  className?: string;
}

export const TrustRing: React.FC<TrustRingProps> = ({
  score,
  tier,
  breakdown,
  className = '',
}) => {
  const radius = 50;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;
  const progressOffset = circumference - (circumference * Math.min(100, score)) / 100;

  const tierColors: Record<TrustTier, string> = {
    Newcomer: '#7C8099',
    Trusted: '#788AFE',
    'Verified Guardian': '#0D9F5E',
    'Community Anchor': '#F5C542',
  };

  const currentColor = tierColors[tier] || '#788AFE';

  const componentMetrics = [
    { label: 'Safety Behaviour (35%)', value: breakdown.safety, max: 35 },
    { label: 'Reliability & Punctuality (25%)', value: breakdown.reliability, max: 25 },
    { label: 'Peer Feedback (15%)', value: breakdown.peerFeedback, max: 15 },
    { label: 'Verification Level (10%)', value: breakdown.verificationLevel, max: 10 },
    { label: 'Consistency & Active (10%)', value: breakdown.consistency, max: 10 },
    { label: 'Clean Ride Count (5%)', value: breakdown.rideCount, max: 5 },
  ];

  return (
    <div className={`flex flex-col items-center gap-6 font-mono ${className}`}>
      {/* 120px Circular Gauge */}
      <div className="relative w-[130px] h-[130px] flex items-center justify-center">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 130 130">
          {/* Background Track */}
          <circle
            cx="65"
            cy="65"
            r={radius}
            stroke="var(--cc-surface-2)"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Dynamic Arc */}
          <circle
            cx="65"
            cy="65"
            r={radius}
            stroke={currentColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={progressOffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-700 ease-out"
          />
        </svg>

        {/* Center Score & Tier */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="font-display-l text-white text-3xl font-bold leading-none">
            {score}
          </span>
          <span className="font-label text-[10px] text-text-2 tracking-wider mt-1">
            {tier.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Six Weighted Component Bars (PRD §6.3 & UI Spec §6.11) */}
      <div className="w-full space-y-2.5">
        {componentMetrics.map((item) => (
          <div key={item.label} className="space-y-1">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-text-2 text-[11px]">{item.label}</span>
              <span className="text-white font-medium text-[11px]">
                {item.value} / {item.max}
              </span>
            </div>
            <div className="w-full h-1.5 bg-surface-2 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${(item.value / item.max) * 100}%`,
                  backgroundColor: currentColor,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
