import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppBar } from '../../layouts/AppBar';
import { Card } from '../../components/primitives/Card';
import { Button } from '../../components/primitives/Button';
import { Pill } from '../../components/primitives/Pill';
import { PersonCard } from '../../components/signature/PersonCard';
import { useAppStore } from '../../store/useAppStore';
import { Inbox, CheckCircle, X, ShieldCheck } from 'lucide-react';

export const RequestsInbox: React.FC = () => {
  const navigate = useNavigate();
  const { users } = useAppStore();

  const [requests, setRequests] = useState([
    {
      id: 'req-1',
      passenger: users.find((u) => u.id === 'user-anitha') || users[0],
      pickupPoint: 'Velachery Bypass Junction',
      dropPoint: 'IIT Madras Main Gate',
      fareShare: 28,
      detourKm: 0.4,
      status: 'pending',
    },
    {
      id: 'req-2',
      passenger: users.find((u) => u.id === 'user-harish') || users[3],
      pickupPoint: 'Guindy Metro Bay 2',
      dropPoint: 'Anna University Campus',
      fareShare: 24,
      detourKm: 0.2,
      status: 'pending',
    },
  ]);

  const handleAccept = (reqId: string) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === reqId ? { ...r, status: 'accepted' } : r))
    );
  };

  const handleDecline = (reqId: string) => {
    setRequests((prev) => prev.filter((r) => r.id !== reqId));
  };

  return (
    <div className="flex-1 flex flex-col font-mono bg-bg text-text">
      <AppBar
        title="Incoming Requests"
        showBack={false}
        pill={<Pill variant="waiting" label={`${requests.filter(r => r.status === 'pending').length} PENDING`} />}
      />

      <div className="flex-1 overflow-y-auto p-5 space-y-4 pb-8 no-scrollbar">
        {requests.length > 0 ? (
          requests.map((req) => (
            <Card key={req.id} variant="flat" className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-label text-primary-soft text-[10px]">
                  CORRIDOR MATCH (94% OVERLAP)
                </span>
                <span className="text-success text-xs font-bold font-mono">
                  +Rs {req.fareShare} Fuel Recovery
                </span>
              </div>

              <PersonCard
                name={req.passenger.name}
                avatarUrl={req.passenger.avatar}
                tier={req.passenger.tier}
                trustScore={req.passenger.trustScore}
                subtitle={`${req.pickupPoint} → ${req.dropPoint}`}
                meta={`+${req.detourKm} km detour`}
              />

              {req.status === 'accepted' ? (
                <div className="p-3 bg-success/15 border border-success/30 rounded-inner text-success text-xs font-semibold text-center flex items-center justify-center gap-2">
                  <CheckCircle size={16} />
                  <span>Request Accepted · Passenger added to trip manifest</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 pt-1">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleDecline(req.id)}
                    className="flex-1 text-xs"
                  >
                    Decline
                  </Button>
                  <Button
                    variant="success"
                    size="sm"
                    onClick={() => handleAccept(req.id)}
                    className="flex-1 text-xs"
                  >
                    Accept Match
                  </Button>
                </div>
              )}
            </Card>
          ))
        ) : (
          <div className="text-center py-12 space-y-2">
            <Inbox size={40} className="text-text-3 mx-auto" />
            <h4 className="font-title-m text-white text-base">No pending requests</h4>
            <p className="text-xs text-text-3 max-w-xs mx-auto">
              Your published trip is active and visible to verified commuters along your corridor.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
