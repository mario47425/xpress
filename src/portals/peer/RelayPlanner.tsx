import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppBar } from '../../layouts/AppBar';
import { Card } from '../../components/primitives/Card';
import { Button } from '../../components/primitives/Button';
import { Pill } from '../../components/primitives/Pill';
import { Timeline } from '../../components/signature/Timeline';
import { useAppStore } from '../../store/useAppStore';
import { Route, ShieldCheck, Zap, DollarSign, Clock, ArrowRight, Layers, Sparkles } from 'lucide-react';
import { PassLeg } from '../../types';

export const RelayPlanner: React.FC = () => {
  const navigate = useNavigate();
  const { createPass, liveRide } = useAppStore();

  const [origin, setOrigin] = useState('Tambaram Railway Station');
  const [destination, setDestination] = useState('Sholinganallur Signal');
  const [selectedPlan, setSelectedPlan] = useState<'cheapest' | 'fastest' | 'safest'>('fastest');
  const [isCreating, setIsCreating] = useState(false);

  // Relay Multi-modal plans for Tambaram -> Sholinganallur (PRD §3 Demo Data)
  const plans: Record<'cheapest' | 'fastest' | 'safest', {
    title: string;
    totalTime: string;
    totalCost: number;
    safetyScore: number;
    legs: PassLeg[];
    badge: string;
  }> = {
    fastest: {
      title: 'Fastest Multi-Leg Handoff',
      totalTime: '34 min',
      totalCost: 46,
      safetyScore: 92,
      badge: 'FASTEST',
      legs: [
        {
          legNumber: 1,
          mode: 'pool',
          startPointName: 'Tambaram Railway Station',
          startLat: 12.9279,
          startLng: 80.1136,
          endPointName: 'Guindy Metro Station',
          endLat: 13.0092,
          endLng: 80.2131,
          plannedTime: '08:15',
          assignedRideId: liveRide?.id || 'ride-54266',
          assignedRiderName: 'Karthik S.',
          assignedVehiclePlate: 'TN 09 AB 4821',
          fare: 28,
          status: 'upcoming',
        },
        {
          legNumber: 2,
          mode: 'metro',
          startPointName: 'Guindy Metro',
          startLat: 13.0092,
          startLng: 80.2131,
          endPointName: 'Tidel Park MRTS',
          endLat: 12.9893,
          endLng: 80.2483,
          plannedTime: '08:35',
          fare: 18,
          status: 'upcoming',
        },
        {
          legNumber: 3,
          mode: 'walk',
          startPointName: 'Tidel Park Gate',
          startLat: 12.9893,
          startLng: 80.2483,
          endPointName: 'Sholinganallur Office Hub',
          endLat: 12.9010,
          endLng: 80.2279,
          plannedTime: '08:45',
          fare: 0,
          status: 'upcoming',
        },
      ],
    },
    cheapest: {
      title: 'Cost-Optimised Transit Relay',
      totalTime: '52 min',
      totalCost: 23,
      safetyScore: 88,
      badge: 'CHEAPEST',
      legs: [
        {
          legNumber: 1,
          mode: 'bus',
          startPointName: 'Tambaram Bus Stop',
          startLat: 12.9279,
          startLng: 80.1136,
          endPointName: 'Guindy Metro Bay 2',
          endLat: 13.0092,
          endLng: 80.2131,
          plannedTime: '08:10',
          fare: 8,
          status: 'upcoming',
        },
        {
          legNumber: 2,
          mode: 'bus',
          startPointName: 'Guindy Metro (MTC 570)',
          startLat: 13.0092,
          startLng: 80.2131,
          endPointName: 'Sholinganallur Signal',
          endLat: 12.9010,
          endLng: 80.2279,
          plannedTime: '08:30',
          fare: 15,
          status: 'upcoming',
        },
      ],
    },
    safest: {
      title: 'Verified Guardian Safe Corridor',
      totalTime: '38 min',
      totalCost: 52,
      safetyScore: 98,
      badge: 'SAFEST',
      legs: [
        {
          legNumber: 1,
          mode: 'pool',
          startPointName: 'Tambaram Station (Lit Bay)',
          startLat: 12.9279,
          startLng: 80.1136,
          endPointName: 'Madhya Kailash Junction',
          endLat: 13.0083,
          endLng: 80.2442,
          plannedTime: '08:15',
          assignedRideId: 'ride-54201',
          assignedRiderName: 'Arjun V. (Guardian)',
          assignedVehiclePlate: 'TN 07 CD 2341',
          fare: 34,
          status: 'upcoming',
        },
        {
          legNumber: 2,
          mode: 'pool',
          startPointName: 'Madhya Kailash Handoff',
          startLat: 13.0083,
          startLng: 80.2442,
          endPointName: 'Sholinganallur Signal',
          endLat: 12.9010,
          endLng: 80.2279,
          plannedTime: '08:38',
          assignedRideId: 'ride-54202',
          assignedRiderName: 'Meenakshi S. (Anchor)',
          assignedVehiclePlate: 'TN 01 GH 6754',
          fare: 18,
          status: 'upcoming',
        },
      ],
    },
  };

  const currentPlan = plans[selectedPlan];

  const handleCreatePass = async () => {
    setIsCreating(true);
    try {
      await createPass(currentPlan.legs);
      navigate('/app/pickup-qr');
    } catch (err) {
      alert('Error creating Journey Pass');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col font-mono bg-bg text-text">
      <AppBar
        title="Multimodal Relay Planner"
        pill={<Pill variant="available" label="3 ROUTES DISCOVERED" />}
      />

      <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 no-scrollbar">
        {/* Desktop 12-Column Responsive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column (5 cols): Origin, Destination, Route Options */}
          <div className="lg:col-span-5 space-y-5">
            {/* Origin & Destination Card */}
            <Card variant="flat" className="space-y-3 p-5">
              <div className="flex items-center gap-2">
                <Route size={16} className="text-primary-soft" />
                <span className="font-label text-primary-soft text-xs">CHENNAI CORRIDOR SELECTION</span>
              </div>
              <div className="space-y-2">
                <div className="p-3 bg-surface-2 rounded-inner border border-border text-xs">
                  <span className="text-text-3 font-label text-[10px]">ORIGIN</span>
                  <div className="text-white font-semibold">{origin}</div>
                </div>
                <div className="p-3 bg-surface-2 rounded-inner border border-border text-xs">
                  <span className="text-text-3 font-label text-[10px]">DESTINATION</span>
                  <div className="text-white font-semibold">{destination}</div>
                </div>
              </div>
            </Card>

            {/* Three Plan Options */}
            <div className="space-y-3">
              <span className="font-label text-text-2 text-xs">SELECT ITINERARY PROFILE</span>
              <div className="space-y-2.5">
                {(['fastest', 'cheapest', 'safest'] as const).map((planKey) => {
                  const p = plans[planKey];
                  const isSelected = selectedPlan === planKey;
                  return (
                    <div
                      key={planKey}
                      onClick={() => setSelectedPlan(planKey)}
                      className={`p-4 rounded-card border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-primary/15 border-primary shadow-md'
                          : 'bg-surface hover:bg-surface-2 border-border'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-title-m text-white text-sm font-semibold">
                          {p.title}
                        </span>
                        <Pill
                          variant={isSelected ? 'progress' : 'neutral'}
                          label={p.badge}
                        />
                      </div>

                      <div className="flex items-center gap-4 text-xs text-text-2 mt-2 font-mono">
                        <span className="flex items-center gap-1 text-white">
                          <Clock size={13} className="text-primary-soft" />
                          <span>{p.totalTime}</span>
                        </span>
                        <span className="flex items-center gap-1 text-white">
                          <DollarSign size={13} className="text-success" />
                          <span>Rs {p.totalCost} total</span>
                        </span>
                        <span className="flex items-center gap-1 text-success">
                          <ShieldCheck size={13} />
                          <span>{p.safetyScore}% Safe</span>
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Create Pass Action Button */}
            <Button
              variant="primary"
              size="lg"
              loading={isCreating}
              onClick={handleCreatePass}
              className="w-full text-sm font-semibold flex items-center justify-center gap-2 shadow-xl"
            >
              <Sparkles size={16} />
              <span>Generate Single Unified QR Pass</span>
            </Button>
          </div>

          {/* Right Column (7 cols): Multimodal Leg-by-Leg Itinerary Timeline */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-label text-text-2 text-xs uppercase">
                MULTIMODAL LEG-BY-LEG ITINERARY ({currentPlan.legs.length} LEGS)
              </span>
              <span className="text-[11px] text-text-3 font-mono">
                Auto-Transitions upon Boarding
              </span>
            </div>

            <Card variant="flat" className="p-5 sm:p-6 space-y-4">
              <Timeline legs={currentPlan.legs} currentLegIndex={0} />

              <div className="p-3.5 bg-surface-2 rounded-inner border border-border/60 text-xs text-text-2 space-y-1">
                <span className="text-white font-semibold">Unified Single QR Pass:</span>
                <p className="text-[11px] text-text-3 leading-relaxed">
                  Your server-signed ES256 Journey Pass contains cryptographically sequenced sub-tokens for each leg. Scanning at Leg 1 automatically unlocks the Leg 2 transfer hub.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
