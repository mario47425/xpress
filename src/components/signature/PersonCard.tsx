import React from 'react';
import { BadgeCheck, MessageCircle, Phone } from 'lucide-react';
import { TrustTier } from '../../types';

export interface PersonCardProps {
  name: string;
  avatarUrl: string;
  tier: TrustTier;
  trustScore: number;
  subtitle?: string;
  meta?: string;
  isVerified?: boolean;
  showContactActions?: boolean;
  onChat?: () => void;
  onCall?: () => void;
  className?: string;
}

export const PersonCard: React.FC<PersonCardProps> = ({
  name,
  avatarUrl,
  tier,
  trustScore,
  subtitle,
  meta,
  isVerified = true,
  showContactActions = false,
  onChat,
  onCall,
  className = '',
}) => {
  const tierDotColors: Record<TrustTier, string> = {
    Newcomer: 'bg-[#6B6890]',
    Trusted: 'bg-[#7C3AED]',
    'Verified Guardian': 'bg-[#10B981]',
    'Community Anchor': 'bg-[#F59E0B]',
  };

  return (
    <div
      className={`bg-surface rounded-card border border-border p-4 flex items-center justify-between gap-3 shadow-colored ${className}`}
    >
      <div className="flex items-center gap-3 min-w-0">
        {/* Avatar 48px */}
        <div className="w-12 h-12 rounded-full overflow-hidden border border-border bg-surface-2 shrink-0">
          <img
            src={avatarUrl}
            alt={name}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/demo/avatars/anitha.svg';
            }}
          />
        </div>

        {/* Name, Verified Badge & Trust Chip */}
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-text text-sm sm:text-base font-bold truncate">{name}</span>
            {isVerified && <BadgeCheck size={16} className="text-success shrink-0" />}
          </div>

          {/* Trust Chip */}
          <div className="inline-flex items-center gap-1.5 mt-0.5 px-2 py-0.5 rounded-full bg-surface-2 border border-border self-start">
            <span className={`w-2 h-2 rounded-full ${tierDotColors[tier] || 'bg-primary'}`} />
            <span className="text-[10px] font-bold text-text-muted tracking-wider">
              {tier.toUpperCase()} · {trustScore}
            </span>
          </div>

          {(subtitle || meta) && (
            <div className="text-xs text-text-muted truncate mt-1">
              {subtitle} {meta ? `· ${meta}` : ''}
            </div>
          )}
        </div>
      </div>

      {/* Right Slot: Chat & Phone Actions (44px min touch targets) */}
      {showContactActions && (
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onChat}
            aria-label={`Chat with ${name}`}
            className="min-w-[44px] min-h-[44px] rounded-button bg-surface-2 hover:bg-surface-3 border border-border flex items-center justify-center text-primary transition-all active:scale-95"
          >
            <MessageCircle size={18} />
          </button>
          <button
            onClick={onCall}
            aria-label={`Call ${name}`}
            className="min-w-[44px] min-h-[44px] rounded-button bg-surface-2 hover:bg-surface-3 border border-border flex items-center justify-center text-success transition-all active:scale-95"
          >
            <Phone size={18} />
          </button>
        </div>
      )}
    </div>
  );
};
