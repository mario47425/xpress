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
    <div className="flex-1 flex flex-col font-mono text-text">
      <AppBar
        title={`Waiting at ${hotspot.name.split(' ')[0]}`}
        pill={<Pill variant="waiting" label="WAITING QUEUE" />}
      />

      <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 no-scrollbar">
        {/* Top Status Bar */}
        <div className="flex items-center justify-between p-3 rounded-inner bg-success/15 border border-success/30 text-success text-xs">
          <div className="flex items-center gap-2">
            <Radio size={16} className="animate-pulse" />
            <span className="font-label text-success">SAFETRAIL ACTIVE MONITORING</span>
          </div>
          <span className="text-[11px] text-text-2">GPS Telemetry Online (±4m)</span>
        </div>

        {/* 100m Geofence Gate */}
        {distanceToHotspot > 100 && (
          <div className="p-3 bg-warn/15 border border-warn/30 rounded-inner text-xs text-warn flex items-center gap-2">
            <AlertCircle size={16} className="shrink-0" />
            <span>You are {distanceToHotspot}m from the hotspot. Move within 100m to activate pickup broadcast.</span>
          </div>
        )}

        {/* Responsive 12-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column (6 cols): Waiting countdown & Hotspot info */}
          <div className="lg:col-span-6 space-y-5">
            <Card variant="glow" className="space-y-4 p-5 sm:p-6">
              <div className="space-y-1">
                <span className="font-label text-primary-soft uppercase text-xs">
                  ESTIMATED ARRIVAL WINDOW
                </span>
                <div className="font-display-xl text-white text-5xl sm:text-6xl font-bold">
                  {Math.ceil(countdownSeconds / 60)} min
                </div>
                <p className="text-xs text-text-2 mt-1">
                  Designated Spot: <span className="text-white font-semibold">{hotspot.name}</span>
                </p>
                <span className="text-[11px] text-text-3">
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

              <div className="flex items-center justify-between pt-3 border-t border-border/50 text-xs">
                <span className="text-text-3 font-label">CORRIDOR RELIABILITY</span>
                <span className="text-success font-semibold flex items-center gap-1">
                  <ShieldCheck size={14} />
                  <span>HIGH · {hotspot.historicalConfidence}% verified pickups</span>
                </span>
              </div>
            </Card>

            {/* Fallback Option Prompt */}
            {showFallback && (
              <div className="p-4 bg-surface rounded-card border border-primary-soft/50 space-y-3 animate-in fade-in duration-300">
                <div className="flex items-center gap-2 text-primary-soft">
                  <Bus size={18} />
                  <span className="font-label text-primary-soft text-xs">FALLBACK TRANSIT ALTERNATIVE</span>
                </div>
                <p className="text-xs text-text-2 leading-relaxed">
                  No peer vehicle passed within 10 minutes. MTC Route 570 arrives at Guindy Metro in 3 minutes.
                </p>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => navigate('/app/relay')}
                  className="w-full text-xs"
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
              <span className="font-label text-text-2 text-xs">MATCHED APPROACHING RIDER</span>
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
                className="flex-1 py-3 px-4 rounded-btn bg-surface hover:bg-surface-2 border border-border text-xs text-white flex items-center justify-center gap-2 transition-colors"
              >
                <Share2 size={16} className="text-primary-soft" />
                <span>Share Live Tracking Link</span>
              </button>
              <button
                onClick={() => navigate('/app')}
                className="py-3 px-5 rounded-btn bg-surface hover:bg-surface-2 border border-border text-xs text-text-3 hover:text-white transition-colors"
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
                  className="w-full text-sm font-semibold shadow-xl"
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
                  className="w-full text-sm font-semibold shadow-xl flex items-center justify-center gap-2"
                >
                  <span>Show Boarding QR Pass</span>
                  <ArrowRight size={16} />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
