import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppBar } from '../../layouts/AppBar';
import { Pill } from '../../components/primitives/Pill';
import { QRCard } from '../../components/signature/QRCard';
import { Card } from '../../components/primitives/Card';
import { useAppStore } from '../../store/useAppStore';
import { ShieldCheck, Car, CheckCircle2, Navigation, AlertCircle } from 'lucide-react';

export const PickupQR: React.FC = () => {
  const navigate = useNavigate();
  const {
    activePass,
    refreshPass,
    liveRide,
    createPass,
  } = useAppStore();

  const [wakeLockActive, setWakeLockActive] = useState(false);
  const [scannedCheckmark, setScannedCheckmark] = useState(false);

  // Screen Wake Lock API
  useEffect(() => {
    let wakeLock: any = null;
    const requestWakeLock = async () => {
      try {
        if ('wakeLock' in navigator) {
          wakeLock = await (navigator as any).wakeLock.request('screen');
          setWakeLockActive(true);
        }
      } catch (err) {
        console.warn('Wake Lock request failed:', err);
      }
    };
    requestWakeLock();
    return () => {
      if (wakeLock) wakeLock.release();
    };
  }, []);

  // Initialize or ensure active pass exists
  useEffect(() => {
    if (!activePass) {
      createPass([
        {
          legNumber: 1,
          mode: 'pool',
          startPointName: 'Velachery Bypass Junction',
          startLat: 12.9774,
          startLng: 80.2212,
          endPointName: 'IIT Madras Main Gate',
          endLat: 12.9915,
          endLng: 80.2337,
          plannedTime: '08:15',
          assignedRideId: liveRide?.id || 'ride-54266',
          assignedRiderName: 'Karthik Subramanian',
          assignedVehiclePlate: 'TN 09 AB 4821',
          fare: 28,
          status: 'current',
        },
      ]);
    }
  }, [activePass, createPass, liveRide]);

  // Listen for ride transition to VERIFIED/IN_TRANSIT (indicating scan accepted)
  useEffect(() => {
    if (liveRide && (liveRide.status === 'VERIFIED' || liveRide.status === 'IN_TRANSIT')) {
      setScannedCheckmark(true);
      const timer = setTimeout(() => {
        navigate(`/app/live-ride/${liveRide.id}`);
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [liveRide?.status, navigate, liveRide?.id]);

  const assignedPlate = liveRide?.vehicle?.plate || 'TN 09 AB 4821';
  const assignedCar = liveRide?.vehicle?.makeModel || 'Honda City';

  return (
    <div className="flex-1 flex flex-col font-mono text-text">
      <AppBar
        title="Pickup Handshake"
        pill={<Pill variant="available" label="READY TO SCAN" />}
      />

      <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 flex flex-col items-center justify-center no-scrollbar">
        <div className="w-full max-w-xl space-y-6">
          <div className="text-center space-y-1">
            <span className="font-label text-primary-soft text-xs uppercase tracking-wider">
              SHOW THIS TO YOUR RIDER AT HOTSPOT
            </span>
            <h2 className="font-title-m text-white text-xl sm:text-2xl font-bold">
              Cryptographic Journey Pass
            </h2>
            <p className="text-xs text-text-3">
              Server-signed ES256 single-use token · Automatically locks upon scan
            </p>
          </div>

          {/* QR Card with dedicated white scan tile and short code */}
          {activePass ? (
            <div className="relative shadow-2xl">
              <QRCard
                jwtToken={activePass.jwtToken}
                shortCode={activePass.shortCode}
                onRefresh={refreshPass}
              />

              {/* Scanned Verification Overlay Checkmark */}
              {scannedCheckmark && (
                <div className="absolute inset-0 bg-bg/95 backdrop-blur-md rounded-card flex flex-col items-center justify-center space-y-3 z-30 animate-in zoom-in-95 duration-200">
                  <div className="w-16 h-16 rounded-full bg-success/20 border-2 border-success flex items-center justify-center text-success">
                    <CheckCircle2 size={36} />
                  </div>
                  <div className="font-title-m text-white text-lg font-bold">
                    Pass Verified! Boarding Commenced
                  </div>
                  <p className="text-xs text-text-2">
                    Exact drop-off point unlocked · Starting live SafeTrail navigation...
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="p-8 bg-surface rounded-card border border-border text-center text-text-3">
              Generating your cryptographic Journey Pass...
            </div>
          )}

          {/* Assigned Vehicle Identification Card */}
          <Card variant="flat" className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-inner bg-primary/20 text-primary-soft flex items-center justify-center shrink-0">
                <Car size={20} />
              </div>
              <div>
                <span className="font-label text-text-3 text-[10px] uppercase">
                  CONFIRM VEHICLE LICENSE PLATE
                </span>
                <div className="font-title-m text-white text-base font-bold">
                  {assignedPlate}
                </div>
                <span className="text-xs text-text-2">{assignedCar} · White</span>
              </div>
            </div>

            <div className="text-right">
              <span className="font-label text-success text-[10px]">CORRIDOR PASS</span>
              <div className="text-xs text-text-3 mt-1">Leg 1 of 1</div>
            </div>
          </Card>

          {/* Wake Lock & Safety Info Banner */}
          <div className="flex items-center justify-between text-xs text-text-3 px-1">
            <span className="flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-success" />
              <span>Screen wake-lock held active</span>
            </span>
            <button
              onClick={() => navigate('/app')}
              className="hover:text-white underline text-xs transition-colors"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
