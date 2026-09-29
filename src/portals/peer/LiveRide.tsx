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
import { MessageSquare, Phone, Headphones, Star, CheckCircle } from 'lucide-react';

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
    <div className="flex-1 flex flex-col font-mono relative bg-bg text-text">
      <AppBar
        title={`Ride #${ride.id.replace('ride-', '')}`}
        pill={<Pill variant="progress" label={ride.status === 'IN_TRANSIT' ? 'IN PROGRESS' : ride.status} />}
      />

      <div className="flex-1 overflow-y-auto p-5 space-y-4 pb-24 no-scrollbar">
        {/* Live Nav Card (UI Spec §8.5 & Reference Image 1) */}
        <LiveNavCard
          instruction={`Approaching ${ride.destName}`}
          distance="0.4 km"
          etaMins="6 MIN"
          arrivalTime="08:26 AM"
          progress={0.72}
        />

        {/* Embedded Dark Leaflet Map with Live Vehicle Marker (UI Spec §7) */}
        <div className="w-full h-48 rounded-card overflow-hidden border border-border relative shadow-lg">
          <CommuteMap
            center={[12.9815, 80.2245]}
            zoom={14}
            routeCoordinates={ride.routePolyline}
            vehiclePosition={ride.currentRiderPosition}
            passengerPosition={{ lat: 12.9774, lng: 80.2212 }}
          />
        </div>

        {/* Person Card for Rider */}
        <div className="space-y-1">
          <span className="font-label text-text-3 text-[10px]">ASSIGNED RIDER</span>
          <PersonCard
            name={ride.riderName}
            avatarUrl={ride.riderAvatar}
            tier={ride.riderTier}
            trustScore={88}
            subtitle={`${ride.vehicle.makeModel} · ${ride.vehicle.plate}`}
            meta={`Ride PIN ${ride.rideCode}`}
            showContactActions={true}
          />
        </div>

        {/* Revealed Pickup Point & Fare Share Field Blocks (UI Spec §8.5) */}
        <FieldGrid columns={2} className="bg-surface p-4 rounded-card border border-border">
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

        {/* Contact Support Row (UI Spec §6.1 & Reference Pattern: Primary flex-1 + icon + icon) */}
        <div className="flex items-center gap-2.5 pt-1">
          <button
            onClick={() => alert('CommuteCircle Support Ops opened')}
            className="flex-1 h-12 bg-surface hover:bg-surface-2 border border-border rounded-btn text-xs font-semibold text-white flex items-center justify-center gap-2"
          >
            <Headphones size={16} className="text-primary-soft" />
            <span>Contact Support</span>
          </button>
          <button
            onClick={() => alert('Chat with Rider opened')}
            aria-label="Chat with rider"
            className="w-12 h-12 bg-surface hover:bg-surface-2 border border-border rounded-btn flex items-center justify-center text-primary-soft"
          >
            <MessageSquare size={18} />
          </button>
          <button
            onClick={() => alert('Calling Rider...')}
            aria-label="Call rider"
            className="w-12 h-12 bg-surface hover:bg-surface-2 border border-border rounded-btn flex items-center justify-center text-success"
          >
            <Phone size={18} />
          </button>
        </div>

        {/* Swipe to Complete Ride (UI Spec §6.9) */}
        <div className="pt-2">
          <SwipeConfirm
            label="Swipe to Complete Ride"
            onConfirm={handleCompleteRide}
          />
        </div>
      </div>

      {/* Floating Thumb-Reachable SOS Shield above bottom area */}
      <div className="absolute bottom-6 right-6 z-40">
        <SOSShield size="normal" />
      </div>

      {/* Post-Ride Structured Feedback Bottom Sheet (PRD §3.7 G9) */}
      <BottomSheet
        isOpen={feedbackOpen}
        onClose={() => setFeedbackOpen(false)}
        title="Ride Complete · Structured Review"
      >
        {!feedbackSubmitted ? (
          <div className="space-y-4">
            <p className="text-xs text-text-2">
              CommuteCircle peer ratings update trust scores and clean-ride streaks:
            </p>

            <div className="space-y-2.5">
              {[
                { key: 'onTime', label: 'Rider arrived on time' },
                { key: 'smoothDriving', label: 'Comfortable, smooth driving' },
                { key: 'safeRoute', label: 'Followed agreed corridor' },
                { key: 'feltSafe', label: 'Felt safe and respected' },
              ].map((item) => (
                <label
                  key={item.key}
                  className="flex items-center justify-between p-3 rounded-inner bg-surface-2 border border-border text-xs text-white cursor-pointer"
                >
                  <span>{item.label}</span>
                  <input
                    type="checkbox"
                    checked={(ratings as any)[item.key]}
                    onChange={(e) =>
                      setRatings((prev) => ({ ...prev, [item.key]: e.target.checked }))
                    }
                    className="w-4 h-4 accent-primary"
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
            <h4 className="font-title-m text-white text-base">Feedback Recorded</h4>
            <p className="text-xs text-text-2">
              Fare settled: Rs 28 deducted from wallet. Trust streaks updated.
            </p>
          </div>
        )}
      </BottomSheet>
    </div>
  );
};
