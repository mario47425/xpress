import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppBar } from '../../layouts/AppBar';
import { Card } from '../../components/primitives/Card';
import { Button } from '../../components/primitives/Button';
import { Pill } from '../../components/primitives/Pill';
import { TickProgress } from '../../components/signature/TickProgress';
import { PersonCard } from '../../components/signature/PersonCard';
import { useAppStore } from '../../store/useAppStore';
import { MapPin, Share2, Radio, Bus, AlertCircle } from 'lucide-react';

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
    <div className="flex-1 flex flex-col font-mono">
      <AppBar
        title={`Waiting at ${hotspot.name.split(' ')[0]}`}
        pill={<Pill variant="waiting" label="WAITING" />}
      />

      <div className="p-5 space-y-5 pb-8 flex-1 flex flex-col justify-between">
        <div className="space-y-4">
          {/* SafeTrail Active Tracking Status Banner */}
          <div className="flex items-center justify-between p-2.5 rounded-inner bg-success/15 border border-success/30 text-success text-xs">
            <div className="flex items-center gap-2">
              <Radio size={16} className="animate-pulse" />
              <span className="font-label text-success">SAFETRAIL TRACKING ON</span>
            </div>
            <span className="text-[10px] text-text-2">5s GPS Feed Active</span>
          </div>

          {/* 100m Geofence Gate */}
          {distanceToHotspot > 100 && (
            <div className="p-3 bg-warn/15 border border-warn/30 rounded-inner text-xs text-warn flex items-center gap-2">
              <AlertCircle size={16} className="shrink-0" />
              <span>You are {distanceToHotspot}m from the hotspot. Move within 100m to activate pickup broadcast.</span>
            </div>
          )}

          {/* Main Waiting Card (UI Spec §8.4) */}
          <Card variant="glow" className="space-y-4">
            <div className="space-y-1">
              <span className="font-label text-primary-soft uppercase">
                Estimated Wait
              </span>
              <div className="font-display-xl text-white text-5xl font-bold">
                {Math.ceil(countdownSeconds / 60)} min
              </div>
            </div>

            {/* 10-Minute Fallback Tick Progress Timer */}
            <div className="space-y-1.5">
              <TickProgress
                value={(600 - countdownSeconds) / 600}
                totalTicks={30}
                color="warn"
                leftLabel="WAIT QUEUE"
                rightLabel="10 MIN TIMEOUT"
              />
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-border/50 text-xs">
              <span className="text-text-3 font-label">CONFIDENCE</span>
              <span className="text-success font-semibold">
                HIGH · {hotspot.historicalConfidence}% verified pickups
              </span>
            </div>
          </Card>

          {/* Matched Approaching Rider Preview (UI Spec §8.4) */}
          <div className="space-y-2">
            <span className="font-label text-text-2">MATCHED APPROACHING RIDER</span>
            <PersonCard
              name={matchedRider.name}
              avatarUrl={matchedRider.avatar}
              tier={matchedRider.tier}
              trustScore={matchedRider.trustScore}
              subtitle="Honda City · TN 09 AB 4821"
              meta="ETA 2 mins"
              showContactActions={true}
            />
          </div>

          {/* Fallback Option Prompt (PRD §3.5 E6) */}
          {showFallback && (
            <div className="p-4 bg-surface rounded-card border border-primary-soft/50 space-y-3 animate-in fade-in duration-300">
              <div className="flex items-center gap-2 text-primary-soft">
                <Bus size={18} />
                <span className="font-label text-primary-soft">FALLBACK BUS SUGGESTION</span>
              </div>
              <p className="text-xs text-text-2">
                No carpool arrived within 10 minutes. MTC Route 570 arrives at Guindy Metro in 3 minutes.
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

          {/* Secondary Actions: Share Live Link & Cancel */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleShareLink}
              className="flex-1 py-3 px-4 rounded-btn bg-surface hover:bg-surface-2 border border-border text-xs text-white flex items-center justify-center gap-2"
            >
              <Share2 size={16} className="text-primary-soft" />
              <span>Share Live Link</span>
            </button>
            <button
              onClick={() => navigate('/app')}
              className="py-3 px-5 rounded-btn bg-surface hover:bg-surface-2 border border-border text-xs text-text-3 hover:text-white"
            >
              Cancel
            </button>
          </div>
        </div>

        {/* Primary Action Button: "I'm Waiting" or "Show Pickup Code" */}
        <div className="pt-4">
          {!isWaitingConfirmed ? (
            <Button
              variant="primary"
              onClick={handleImWaiting}
              disabled={distanceToHotspot > 100}
              className="w-full"
            >
              {distanceToHotspot > 100
                ? `Move closer · ${distanceToHotspot}m`
                : "I'm Waiting at Hotspot"}
            </Button>
          ) : (
            <Button
              variant="primary"
              onClick={() => navigate('/app/pickup-qr')}
              className="w-full"
            >
              Show Pickup QR Code
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
