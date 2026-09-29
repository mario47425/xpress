import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppBar } from '../../layouts/AppBar';
import { Pill } from '../../components/primitives/Pill';
import { Button } from '../../components/primitives/Button';
import { TickProgress } from '../../components/signature/TickProgress';
import { CommuteMap } from '../../components/map/CommuteMap';
import { useAppStore } from '../../store/useAppStore';
import { ShieldAlert, PhoneCall, CheckCircle, Radio, Users, AlertTriangle } from 'lucide-react';

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
      <div className="flex-1 flex flex-col font-mono bg-bg text-text p-6 justify-between max-w-xl mx-auto w-full">
        <AppBar title="Corridor Ride" pill={<Pill variant="danger" label="DISCREET ACTIVE" />} />
        <div className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-4">
          <div className="w-4 h-4 rounded-full bg-danger animate-ping mx-auto" />
          <h3 className="font-title-m text-white text-base">Silent Emergency Beacon Active</h3>
          <p className="text-xs text-text-3 max-w-md">
            Silent emergency tracking running discreetly. Live telemetry is streaming to 112 and trusted contacts.
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
        title="Emergency SOS Console"
        showBack={false}
        pill={<Pill variant="danger" label="SOS ACTIVE" />}
      />

      <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 no-scrollbar">
        {/* Responsive 12-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column (5 cols): Distress Header, Checklist, Actions */}
          <div className="lg:col-span-5 space-y-5">
            {/* Distress Header */}
            <div className="p-5 bg-danger/10 border border-danger/40 rounded-card space-y-2 text-center">
              <div className="w-14 h-14 rounded-full bg-danger/20 border-2 border-danger flex items-center justify-center text-danger mx-auto animate-pulse">
                <ShieldAlert size={32} />
              </div>
              <h2 className="font-title-l text-white text-lg sm:text-xl font-bold">
                Live Location is Being Shared
              </h2>
              <p className="text-xs text-text-2">
                Emergency broadcast dispatched. 112 services, trusted contacts, and community responders alerted.
              </p>
            </div>

            {/* Dispatch Checklist (PRD §3.9) */}
            <div className="p-5 bg-surface/90 rounded-card border border-danger/30 space-y-3 shadow-lg">
              <span className="font-label text-text-2 text-xs">DISPATCH ESCALATION STATUS</span>
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
              <div className="pt-2 border-t border-border/50 space-y-1.5">
                <div className="flex justify-between text-[10px] text-text-3 font-mono">
                  <span>TIER 1 (MODS 2KM)</span>
                  <span className="text-danger font-bold">
                    {secondsToTier2 > 0 ? `WIDENING IN 00:${secondsToTier2.toString().padStart(2, '0')}` : 'TIER 2 WIDENED'}
                  </span>
                </div>
                <TickProgress
                  value={(60 - secondsToTier2) / 60}
                  totalTicks={30}
                  color="danger"
                />
              </div>
            </div>

            {/* Primary Actions */}
            <div className="space-y-3">
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

          {/* Right Column (7 cols): Full-Size Real-Time SOS Emergency Map */}
          <div className="lg:col-span-7 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-label text-danger text-xs flex items-center gap-1.5">
                <Radio size={14} className="animate-pulse" /> LIVE TELEMETRY & RESPONDER RADAR
              </span>
              <span className="text-[11px] text-text-3 font-mono">1 km Corridor Geofence</span>
            </div>

            <div className="w-full h-[380px] lg:h-[540px] rounded-card overflow-hidden border border-danger/50 relative shadow-2xl">
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
          </div>
        </div>
      </div>
    </div>
  );
};
