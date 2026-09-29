import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppBar } from '../../layouts/AppBar';
import { Card } from '../../components/primitives/Card';
import { Button } from '../../components/primitives/Button';
import { Pill } from '../../components/primitives/Pill';
import { TickProgress } from '../../components/signature/TickProgress';
import { PersonCard } from '../../components/signature/PersonCard';
import { useAppStore } from '../../store/useAppStore';
import { MapPin, Share2, Radio, Bus, AlertCircle, Clock, ShieldCheck, ArrowRight } from 'lucide-react';

export const HotspotWaiting: React.FC = () => {
  const { hotspotId } = useParams();
  const navigate = useNavigate();
  const { hotspots, markHotspotWaiting, users } = useAppStore();

  const hotspot = hotspots.find((h) => h.id === hotspotId) || hotspots[0];
  const matchedRider = users.find((u) => u.id === 'user-karthik') || users[1];

  // Geofence check state (PRD §3.5 E3: enabled only within 100m)
  const [distanceToHotspot, setDistanceToHotspot] = useState(45); // 45m within range
  const [isWaitingConfirmed, setIsWaitingConfirmed] = useState(false);
  const [countdownSeconds, setCountdownSeconds] = useState(240); // 4 min
  const [showFallback, setShowFallback] = useState(false);

  useEffect(() => {
    if (isWaitingConfirmed && hotspot) {
      markHotspotWaiting(hotspot.id);
    }
  }, [isWaitingConfirmed, hotspot, markHotspotWaiting]);

  // Wait countdown
  useEffect(() => {
    if (!isWaitingConfirmed) return;
    const timer = setInterval(() => {
      setCountdownSeconds((prev) => {
        if (prev <= 1) {
          setShowFallback(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isWaitingConfirmed]);

  const handleImWaiting = () => {
    if (distanceToHotspot <= 100) {
      setIsWaitingConfirmed(true);
    }
  };

  const handleShareLink = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Track My CommuteCircle Ride',
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Live tracking link copied to clipboard!');
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-bg text-text">
      <AppBar
        title={`Waiting at ${hotspot.name.split(' ')[0]}`}
        pill={<Pill variant="waiting" label="WAITING QUEUE" />}
      />

      <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 no-scrollbar">
        {/* Top Status Bar */}
        <div className="flex items-center justify-between p-3.5 rounded-card bg-success/10 border border-success/30 text-success text-xs sm:text-sm font-semibold shadow-sm">
          <div className="flex items-center gap-2">
            <Radio size={16} className="animate-pulse" />
            <span className="font-bold tracking-wide">SAFETRAIL ACTIVE MONITORING</span>
          </div>
          <span className="text-xs text-text-muted font-medium">GPS Telemetry Online (±4m)</span>
        </div>

        {/* 100m Geofence Gate */}
        {distanceToHotspot > 100 && (
          <div className="p-3.5 bg-accent/10 border border-accent/30 rounded-card text-xs sm:text-sm text-accent font-semibold flex items-center gap-2 shadow-sm">
            <AlertCircle size={18} className="shrink-0" />
            <span>You are {distanceToHotspot}m from the hotspot. Move within 100m to activate pickup broadcast.</span>
          </div>
        )}

        {/* Responsive 12-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column (6 cols): Waiting countdown & Hotspot info */}
          <div className="lg:col-span-6 space-y-5">
            <Card variant="default" className="space-y-4 p-5 sm:p-6 shadow-colored">
              <div className="space-y-1">
                <span className="text-primary font-bold uppercase text-xs tracking-wider">
                  ESTIMATED ARRIVAL WINDOW
                </span>
                <div className="text-5xl sm:text-6xl font-extrabold tracking-tight text-transparent bg-clip-text bg-primary-gradient">
                  {Math.ceil(countdownSeconds / 60)} min
                </div>
                <p className="text-xs sm:text-sm text-text-muted mt-1 font-medium">
                  Designated Spot: <span className="text-text font-bold">{hotspot.name}</span>
                </p>
                <span className="text-xs text-text-muted font-semibold">
                  {hotspot.category.toUpperCase().replace('_', ' ')} · {hotspot.lit ? 'Well-Lit & Monitored' : 'Designated Hub'}
                </span>
              </div>

              {/* 10-Minute Fallback Tick Progress Timer */}
              <div className="space-y-1.5 pt-2">
                <TickProgress
                  value={(600 - countdownSeconds) / 600}
                  totalTicks={30}
                  color="warn"
                  leftLabel="WAIT QUEUE"
                  rightLabel="10 MIN TIMEOUT"
                />
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-border text-xs sm:text-sm">
                <span className="text-text-muted font-bold text-xs uppercase tracking-wider">CORRIDOR RELIABILITY</span>
                <span className="text-success font-bold flex items-center gap-1.5">
                  <ShieldCheck size={16} />
                  <span>HIGH · {hotspot.historicalConfidence}% verified pickups</span>
                </span>
              </div>
            </Card>

            {/* Fallback Option Prompt */}
            {showFallback && (
              <div className="p-4 sm:p-5 bg-surface rounded-card border border-primary/40 space-y-3 animate-in fade-in duration-300 shadow-colored">
                <div className="flex items-center gap-2 text-primary">
                  <Bus size={20} />
                  <span className="font-bold text-xs sm:text-sm tracking-wide">FALLBACK TRANSIT ALTERNATIVE</span>
                </div>
                <p className="text-xs sm:text-sm text-text-muted leading-relaxed font-medium">
                  No peer vehicle passed within 10 minutes. MTC Route 570 arrives at Guindy Metro in 3 minutes.
                </p>
                <Button
                  variant="secondary"
                  size="default"
                  onClick={() => navigate('/app/relay')}
                  className="w-full text-xs font-bold"
                >
                  Switch to Relay Multimodal Pass
                </Button>
              </div>
            )}
          </div>

          {/* Right Column (6 cols): Matched Rider & Action Controls */}
          <div className="lg:col-span-6 space-y-5">
            {/* Matched Approaching Rider Preview */}
            <div className="space-y-2">
              <span className="text-text-muted font-bold text-xs uppercase tracking-wider">MATCHED APPROACHING RIDER</span>
              <PersonCard
                name={matchedRider.name}
                avatarUrl={matchedRider.avatar}
                tier={matchedRider.tier}
                trustScore={matchedRider.trustScore}
                subtitle="Honda City · TN 09 AB 4821"
                meta="ETA 2 mins · En route on 100ft Rd"
                showContactActions={true}
              />
            </div>

            {/* Secondary Actions: Share Live Link & Cancel */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleShareLink}
                className="flex-1 min-h-[44px] py-3 px-4 rounded-button bg-surface hover:bg-surface-2 border border-border text-xs sm:text-sm font-bold text-text flex items-center justify-center gap-2 transition-all shadow-sm active:scale-95"
              >
                <Share2 size={16} className="text-primary" />
                <span>Share Live Tracking Link</span>
              </button>
              <button
                onClick={() => navigate('/app')}
                className="min-h-[44px] py-3 px-5 rounded-button bg-surface hover:bg-surface-2 border border-border text-xs sm:text-sm text-text font-bold transition-all shadow-sm active:scale-95"
              >
                Cancel
              </button>
            </div>

            {/* Primary Action Button */}
            <div className="pt-2">
              {!isWaitingConfirmed ? (
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleImWaiting}
                  disabled={distanceToHotspot > 100}
                  className="w-full text-sm font-bold shadow-colored min-h-[48px]"
                >
                  {distanceToHotspot > 100
                    ? `Move closer · ${distanceToHotspot}m from hotspot`
                    : "I'm Waiting at Hotspot (Broadcast Presence)"}
                </Button>
              ) : (
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => navigate('/app/pickup-qr')}
                  className="w-full text-sm font-bold shadow-colored flex items-center justify-center gap-2 min-h-[48px]"
                >
                  <span>Show Boarding QR Pass</span>
                  <ArrowRight size={18} />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
