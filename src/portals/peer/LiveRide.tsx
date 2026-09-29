import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppBar } from '../../layouts/AppBar';
import { Pill } from '../../components/primitives/Pill';
import { LiveNavCard } from '../../components/signature/LiveNavCard';
import { CommuteMap } from '../../components/map/CommuteMap';
import { PersonCard } from '../../components/signature/PersonCard';
import { FieldBlock, FieldGrid } from '../../components/primitives/FieldBlock';
import { SwipeConfirm } from '../../components/signature/SwipeConfirm';
import { SOSShield } from '../../components/signature/SOSShield';
import { BottomSheet } from '../../components/primitives/BottomSheet';
import { Button } from '../../components/primitives/Button';
import { useAppStore } from '../../store/useAppStore';
import { MessageSquare, Phone, Headphones, Star, CheckCircle, ShieldCheck, Navigation } from 'lucide-react';

export const LiveRide: React.FC = () => {
  const { rideId } = useParams();
  const navigate = useNavigate();
  const { liveRide, currentUser } = useAppStore();

  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [ratings, setRatings] = useState({
    onTime: true,
    smoothDriving: true,
    safeRoute: true,
    feltSafe: true,
  });

  const ride = liveRide || {
    id: rideId || 'ride-54266',
    riderName: 'Karthik Subramanian',
    riderAvatar: '/demo/avatars/karthik.svg',
    riderTier: 'Verified Guardian' as const,
    vehicle: { plate: 'TN 09 AB 4821', makeModel: 'Honda City' },
    status: 'IN_TRANSIT' as const,
    rideCode: '4821',
    costRecovered: 28,
    destName: 'IIT Madras Main Gate',
    currentRiderPosition: { lat: 12.9810, lng: 80.2245, heading: 45 },
    routePolyline: [
      [12.9774, 80.2212],
      [12.9805, 80.2238],
      [12.9840, 80.2270],
      [12.9875, 80.2305],
      [12.9915, 80.2337],
    ] as [number, number][],
  };

  const handleCompleteRide = () => {
    setFeedbackOpen(true);
  };

  const handleSubmitFeedback = () => {
    setFeedbackSubmitted(true);
    setTimeout(() => {
      setFeedbackOpen(false);
      navigate('/app');
    }, 1500);
  };

  return (
    <div className="flex-1 flex flex-col relative bg-bg text-text">
      <AppBar
        title={`Live Ride #${ride.id.replace('ride-', '')}`}
        pill={<Pill variant="progress" label={ride.status === 'IN_TRANSIT' ? 'IN PROGRESS' : ride.status} />}
      />

      <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 no-scrollbar">
        {/* Desktop Split View: 12-Column Responsive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column (5 cols on lg/xl): Trip Details, Assigned Driver, Actions */}
          <div className="lg:col-span-5 space-y-5">
            {/* Live Nav Card */}
            <LiveNavCard
              instruction={`Approaching ${ride.destName}`}
              distance="0.4 km"
              etaMins="6 MIN"
              arrivalTime="08:26 AM"
              progress={0.72}
            />

            {/* Person Card for Assigned Rider */}
            <div className="space-y-1.5">
              <span className="text-text-muted font-bold text-xs uppercase tracking-wider">
                ASSIGNED CORRIDOR RIDER
              </span>
              <PersonCard
                name={ride.riderName}
                avatarUrl={ride.riderAvatar}
                tier={ride.riderTier}
                trustScore={88}
                subtitle={`${ride.vehicle.makeModel} · ${ride.vehicle.plate}`}
                meta={`Boarding PIN ${ride.rideCode}`}
                showContactActions={true}
              />
            </div>

            {/* Revealed Pickup Point & Fare Share Field Blocks */}
            <FieldGrid columns={2} className="bg-surface p-4 sm:p-5 rounded-card border border-border shadow-colored">
              <FieldBlock
                label="PICKUP POINT (REVEALED)"
                value="Velachery Bypass"
                caption="Near Bus Shelter, 100ft Road"
              />
              <FieldBlock
                label="YOUR FARE SHARE"
                value="Rs 28"
                caption="Fuel split + 0.4 km detour"
              />
            </FieldGrid>

            {/* Contact Support & Communications Row */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => alert('CommuteCircle Support Ops opened')}
                className="flex-1 min-h-[48px] bg-surface hover:bg-surface-2 border border-border rounded-button text-xs sm:text-sm font-bold text-text flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95"
              >
                <Headphones size={18} className="text-primary" />
                <span>Contact Support</span>
              </button>
              <button
                onClick={() => alert('Chat with Rider opened')}
                aria-label="Chat with rider"
                className="min-w-[48px] min-h-[48px] bg-surface hover:bg-surface-2 border border-border rounded-button flex items-center justify-center text-primary shadow-sm transition-all active:scale-95"
              >
                <MessageSquare size={18} />
              </button>
              <button
                onClick={() => alert('Calling Rider...')}
                aria-label="Call rider"
                className="min-w-[48px] min-h-[48px] bg-surface hover:bg-surface-2 border border-border rounded-button flex items-center justify-center text-success shadow-sm transition-all active:scale-95"
              >
                <Phone size={18} />
              </button>
            </div>

            {/* Swipe to Complete Ride on Mobile / Desktop Button */}
            <div className="pt-2">
              <SwipeConfirm
                label="Swipe to Complete Ride"
                onConfirm={handleCompleteRide}
              />
            </div>

            {/* Emergency Info Box */}
            <div className="p-4 bg-surface rounded-card border border-border text-xs sm:text-sm text-text-muted flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-2">
                <ShieldCheck size={18} className="text-success" />
                <span className="font-medium">SafeTrail 15s heartbeats active</span>
              </div>
              <button
                onClick={() => navigate('/safety')}
                className="min-h-[44px] text-primary hover:underline font-bold"
              >
                Safety Options ➔
              </button>
            </div>
          </div>

          {/* Right Column (7 cols on lg/xl): Large Interactive Real-Time Map */}
          <div className="lg:col-span-7 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Navigation size={18} className="text-primary animate-pulse" />
                <span className="text-text font-bold text-xs sm:text-sm uppercase tracking-wider">
                  REAL-TIME SAFETRAIL TRACKING
                </span>
              </div>
              <span className="text-xs text-text-muted font-medium">
                GPS: 12.9810, 80.2245 (Accuracy ±3m)
              </span>
            </div>

            <div className="w-full h-[380px] lg:h-[560px] rounded-card overflow-hidden border border-border relative shadow-colored">
              <CommuteMap
                center={[12.9815, 80.2245]}
                zoom={14}
                routeCoordinates={ride.routePolyline}
                vehiclePosition={ride.currentRiderPosition}
                passengerPosition={{ lat: 12.9774, lng: 80.2212 }}
              />

              {/* Floating Emergency Shield inside map corner on desktop */}
              <div className="absolute bottom-4 right-4 z-[500]">
                <SOSShield size="normal" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Post-Ride Structured Feedback Bottom Sheet */}
      <BottomSheet
        isOpen={feedbackOpen}
        onClose={() => setFeedbackOpen(false)}
        title="Ride Complete · Structured Review"
      >
        {!feedbackSubmitted ? (
          <div className="space-y-4">
            <p className="text-xs sm:text-sm text-text-muted font-medium">
              CommuteCircle peer ratings update trust scores and clean-ride streaks:
            </p>

            <div className="space-y-3">
              {[
                { key: 'onTime', label: 'Rider arrived on time' },
                { key: 'smoothDriving', label: 'Comfortable, smooth driving' },
                { key: 'safeRoute', label: 'Followed agreed corridor' },
                { key: 'feltSafe', label: 'Felt safe and respected' },
              ].map((item) => (
                <label
                  key={item.key}
                  className="flex items-center justify-between p-3.5 rounded-card bg-surface-2 border border-border text-xs sm:text-sm text-text font-semibold cursor-pointer min-h-[48px]"
                >
                  <span>{item.label}</span>
                  <input
                    type="checkbox"
                    checked={(ratings as any)[item.key]}
                    onChange={(e) =>
                      setRatings((prev) => ({ ...prev, [item.key]: e.target.checked }))
                    }
                    className="w-5 h-5 accent-primary cursor-pointer"
                  />
                </label>
              ))}
            </div>

            <Button
              variant="primary"
              onClick={handleSubmitFeedback}
              className="w-full"
            >
              Submit Feedback & Update Trust (+2)
            </Button>
          </div>
        ) : (
          <div className="py-6 text-center space-y-3">
            <CheckCircle size={48} className="text-success mx-auto" />
            <h4 className="text-text text-base sm:text-lg font-bold">Feedback Recorded</h4>
            <p className="text-xs sm:text-sm text-text-muted">
              Fare settled: Rs 28 deducted from wallet. Trust streaks updated.
            </p>
          </div>
        )}
      </BottomSheet>
    </div>
  );
};
