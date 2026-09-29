import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppBar } from '../../layouts/AppBar';
import { Card } from '../../components/primitives/Card';
import { Button } from '../../components/primitives/Button';
import { Pill } from '../../components/primitives/Pill';
import { Timeline } from '../../components/signature/Timeline';
import { useAppStore } from '../../store/useAppStore';
import { Route, ShieldCheck, Zap, DollarSign, Clock, ArrowRight } from 'lucide-react';
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
        title="Relay Planner"
        pill={<Pill variant="available" label="3 ROUTES FOUND" />}
      />

      <div className="flex-1 overflow-y-auto p-5 space-y-5 pb-8 no-scrollbar">
        {/* Origin & Destination Card */}
        <Card variant="flat" className="space-y-3">
          <div className="flex items-center gap-2">
            <Route size={16} className="text-primary-soft" />
            <span className="font-label text-primary-soft">CORRIDOR SELECTION</span>
          </div>
          <div className="space-y-2">
            <div className="p-2.5 bg-surface-2 rounded-inner border border-border text-xs">
              <span className="text-text-3 font-label text-[10px]">ORIGIN</span>
              <div className="text-white font-semibold">{origin}</div>
            </div>
            <div className="p-2.5 bg-surface-2 rounded-inner border border-border text-xs">
              <span className="text-text-3 font-label text-[10px]">DESTINATION</span>
              <div className="text-white font-semibold">{destination}</div>
            </div>
          </div>
        </Card>

        {/* Three Plan Options (UI Spec §8.7: Cheapest, Fastest, Safest) */}
        <div className="space-y-2.5">
          <span className="font-label text-text-2">CHOOSE COMMUTE STRATEGY</span>
          <div className="grid grid-cols-3 gap-2">
            {(['fastest', 'cheapest', 'safest'] as const).map((key) => {
              const p = plans[key];
              const isSel = selectedPlan === key;
              return (
                <button
                  key={key}
                  onClick={() => setSelectedPlan(key)}
                  className={`p-3 rounded-card border text-left flex flex-col justify-between transition-all ${
                    isSel
                      ? 'bg-primary/20 border-primary-soft text-white shadow-lg'
                      : 'bg-surface border-border text-text-2 hover:bg-surface-2'
                  }`}
                >
                  <span
                    className={`font-label text-[9px] font-bold ${
                      key === 'fastest'
                        ? 'text-primary-soft'
                        : key === 'cheapest'
                        ? 'text-success'
                        : 'text-warn'
                    }`}
                  >
                    {p.badge}
                  </span>
                  <div className="my-1.5 font-title-m text-white text-base font-bold">
                    {p.totalTime}
                  </div>
                  <div className="text-xs text-text-3">Rs {p.totalCost}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Plan Details & Relay Timeline (UI Spec §8.8) */}
        <Card variant="glow" className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-label text-primary-soft uppercase">
              {currentPlan.title}
            </span>
            <div className="flex items-center gap-1 text-success text-xs font-semibold">
              <ShieldCheck size={14} />
              <span>Safety {currentPlan.safetyScore}%</span>
            </div>
          </div>

          <Timeline legs={currentPlan.legs} currentLegIndex={0} />

          <div className="pt-2 border-t border-border/50 flex items-center justify-between text-xs font-mono">
            <span className="text-text-2">Total Combined Fare:</span>
            <span className="text-white font-bold text-base">Rs {currentPlan.totalCost}</span>
          </div>
        </Card>

        {/* Primary Action Button: Create Journey Pass */}
        <Button
          variant="primary"
          onClick={handleCreatePass}
          loading={isCreating}
          className="w-full text-base font-semibold flex items-center justify-center gap-2"
        >
          <span>Issue Signed Journey Pass</span>
          <ArrowRight size={18} />
        </Button>
      </div>
    </div>
  );
};
