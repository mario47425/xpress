import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppBar } from '../../layouts/AppBar';
import { Pill } from '../../components/primitives/Pill';
import { Button } from '../../components/primitives/Button';
import { TickProgress } from '../../components/signature/TickProgress';
import { CommuteMap } from '../../components/map/CommuteMap';
import { useAppStore } from '../../store/useAppStore';
import { ShieldAlert, PhoneCall, CheckCircle, Radio, Users } from 'lucide-react';

export const SOSActive: React.FC = () => {
  const navigate = useNavigate();
  const { activeSOS, endSOS, currentUser } = useAppStore();

  const [secondsToTier2, setSecondsToTier2] = useState(32);
  const [silentMode, setSilentMode] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsToTier2((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleEndSOS = async () => {
    if (activeSOS) {
      await endSOS(activeSOS.id);
    }
    navigate('/app');
  };

  const handleCall112 = () => {
    window.open('tel:112');
  };

  const alertLoc = activeSOS
    ? { lat: activeSOS.lat, lng: activeSOS.lng, active: true }
    : { lat: 12.9810, lng: 80.2245, active: true };

  const acknowledgedCount = activeSOS?.acknowledgedBy.length || 1;

  if (silentMode) {
    return (
      <div className="flex-1 flex flex-col font-mono bg-bg text-text p-5 justify-between">
        <AppBar title="Corridor Ride" pill={<Pill variant="danger" label="DISCREET ACTIVE" />} />
        <div className="flex-1 flex items-center justify-center text-center p-6 space-y-4">
          <div className="w-3 h-3 rounded-full bg-danger animate-ping mx-auto" />
          <p className="text-xs text-text-3">
            Silent emergency tracking running discreetly. Live location is streaming to 112 and trusted contacts.
          </p>
          <Button variant="secondary" size="sm" onClick={() => setSilentMode(false)}>
            Show Emergency Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col font-mono relative bg-bg text-text card-sos-glow">
      <AppBar
        title="Emergency SOS"
        showBack={false}
        pill={<Pill variant="danger" label="SOS ACTIVE" />}
      />

      <div className="flex-1 overflow-y-auto p-5 space-y-5 pb-8 no-scrollbar">
        {/* Minimal High-Contrast Distress Header (UI Spec §10.3 & PRD §3.9) */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-full bg-danger/25 border-2 border-danger flex items-center justify-center text-danger mx-auto animate-pulse">
            <ShieldAlert size={32} />
          </div>
          <h2 className="font-title-l text-white text-xl font-bold">
            Live Location is Being Shared
          </h2>
          <p className="text-xs text-text-2">
            Emergency broadcast dispatched. 112 services and responders alerted.
          </p>
        </div>

        {/* Dispatch Checklist (PRD §3.9) */}
        <div className="p-4 bg-surface/90 rounded-card border border-danger/40 space-y-2.5">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-text-2 flex items-center gap-2">
              <CheckCircle size={16} className="text-success" />
              Trusted Contacts (SMS Link)
            </span>
            <span className="text-success font-label">NOTIFIED ✓</span>
          </div>

          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-text-2 flex items-center gap-2">
              <CheckCircle size={16} className="text-success" />
              Platform Emergency Ops
            </span>
            <span className="text-success font-label">NOTIFIED ✓</span>
          </div>

          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-text-2 flex items-center gap-2">
              <Radio size={16} className="text-warn animate-pulse" />
              Nearby Community Anchors
            </span>
            <span className="text-warn font-label">
              3 ALERTED · {acknowledgedCount} ACK
            </span>
          </div>

          {/* Tier 2 Escalation Countdown */}
          <div className="pt-2 border-t border-border/50 space-y-1">
            <TickProgress
              value={(60 - secondsToTier2) / 60}
              totalTicks={30}
              color="danger"
              leftLabel="TIER 1 (MODS 2KM)"
              rightLabel={secondsToTier2 > 0 ? `WIDENING IN 00:${secondsToTier2.toString().padStart(2, '0')}` : 'TIER 2 WIDENED'}
            />
          </div>
        </div>

        {/* Live SOS Map: Pulsing Red Origin and Green Responders (UI Spec §7 & §10.3) */}
        <div className="w-full h-48 rounded-card overflow-hidden border border-danger/40 relative shadow-2xl">
          <CommuteMap
            center={[alertLoc.lat, alertLoc.lng]}
            zoom={15}
            sosAlertLocation={alertLoc}
            responders={[
              { lat: alertLoc.lat + 0.003, lng: alertLoc.lng + 0.002, name: 'Meenakshi (Mod)' },
              { lat: alertLoc.lat - 0.002, lng: alertLoc.lng - 0.003, name: 'Divya (Anchor)' },
            ]}
          />
        </div>

        {/* Primary Call 112 Action & End Alert (UI Spec §10.3) */}
        <div className="space-y-3 pt-2">
          <button
            onClick={handleCall112}
            className="w-full h-14 bg-danger hover:bg-danger/90 text-white font-bold rounded-btn text-base flex items-center justify-center gap-2 shadow-[0_8px_24px_rgba(229,72,77,0.4)] active:scale-98 transition-all"
          >
            <PhoneCall size={20} />
            <span>Call 112 Police Emergency</span>
          </button>

          <Button
            variant="secondary"
            onClick={handleEndSOS}
            className="w-full text-text-2 hover:text-white"
          >
            I'm Safe — End Emergency Alert
          </Button>

          <button
            onClick={() => setSilentMode(true)}
            className="w-full text-center text-xs text-text-3 hover:text-text-2 underline font-caption pt-1"
          >
            Switch to Silent Discreet Mode
          </button>
        </div>
      </div>
    </div>
  );
};
