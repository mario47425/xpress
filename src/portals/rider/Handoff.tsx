import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AppBar } from '../../layouts/AppBar';
import { Card } from '../../components/primitives/Card';
import { Button } from '../../components/primitives/Button';
import { Pill } from '../../components/primitives/Pill';
import { PersonCard } from '../../components/signature/PersonCard';
import { useAppStore } from '../../store/useAppStore';
import { GitCommit, QrCode, ArrowRight, Clock, MapPin } from 'lucide-react';

export const RiderHandoff: React.FC = () => {
  const navigate = useNavigate();
  const { users } = useAppStore();

  const anitha = users.find((u) => u.id === 'user-anitha') || users[0];
  const nextRider = users.find((u) => u.id === 'user-arjun') || users[2];

  return (
    <div className="flex-1 flex flex-col font-mono bg-bg text-text">
      <AppBar
        title="Relay Handoffs"
        pill={<Pill variant="available" label="2 HANDOFFS" />}
      />

      <div className="flex-1 overflow-y-auto p-5 space-y-5 pb-8 no-scrollbar">
        {/* Intro Banner */}
        <div className="p-3 bg-surface rounded-card border border-border text-xs text-text-2 space-y-1">
          <span className="font-label text-primary-soft flex items-center gap-1.5">
            <GitCommit size={14} /> RELAY PROTOCOL ACTIVE
          </span>
          <p>
            You are carrying Leg 1 of a multi-segment journey. At the handoff junction, verify and hand off passengers cleanly.
          </p>
        </div>

        {/* 1. Receive Passenger Segment */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-label text-success flex items-center gap-1">
              <MapPin size={12} /> RECEIVE AT GUINDY METRO
            </span>
            <span className="font-caption text-text-3">08:15 AM</span>
          </div>

          <Card variant="flat" className="space-y-3">
            <PersonCard
              name={anitha.name}
              avatarUrl={anitha.avatar}
              tier={anitha.tier}
              trustScore={anitha.trustScore}
              subtitle="Leg 1 of 3 · Final: Sholinganallur"
              meta="Paid share: Rs 28"
            />
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate('/rider/scanner')}
              className="w-full flex items-center justify-center gap-2"
            >
              <QrCode size={16} />
              <span>Scan Passenger Pass at Pickup</span>
            </Button>
          </Card>
        </div>

        {/* 2. Hand Over to Next Rider Segment */}
        <div className="space-y-2 pt-2">
          <div className="flex items-center justify-between">
            <span className="font-label text-warn flex items-center gap-1">
              <MapPin size={12} /> HAND OVER AT TIDEL PARK GATE
            </span>
            <span className="font-caption text-text-3">08:45 AM</span>
          </div>

          <Card variant="flat" className="space-y-3 border-warn/30">
            <div className="text-xs text-text-2">
              Next Assigned Rider for Leg 2:
            </div>
            <PersonCard
              name={nextRider.name}
              avatarUrl={nextRider.avatar}
              tier={nextRider.tier}
              trustScore={nextRider.trustScore}
              subtitle="Tata Nexon EV · TN 07 CD 2341"
              meta="ETA at gate: 08:43 AM"
              showContactActions={true}
            />
            <div className="p-2.5 bg-surface-2 rounded-inner border border-border text-xs text-text-3 font-mono">
              Outgoing leg closes automatically upon next rider's QR scan. Fare settles instantly to your cost-recovery wallet.
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
