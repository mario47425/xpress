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
    <div className="flex-1 flex flex-col text-text">
      <AppBar
        title="Pickup Handshake"
        pill={<Pill variant="available" label="READY TO SCAN" />}
      />

      <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 flex flex-col items-center justify-center no-scrollbar">
        <div className="w-full max-w-xl space-y-6">
          <div className="text-center space-y-1">
            <span className="text-primary font-bold text-xs uppercase tracking-wider">
              SHOW THIS TO YOUR RIDER AT HOTSPOT
            </span>
            <h2 className="text-text text-xl sm:text-2xl font-extrabold tracking-tight">
              Cryptographic Journey Pass
            </h2>
            <p className="text-xs sm:text-sm text-text-muted">
              Server-signed ES256 single-use token · Automatically locks upon scan
            </p>
          </div>

          {/* QR Card with dedicated white scan tile and short code */}
          {activePass ? (
            <div className="relative shadow-colored">
              <QRCard
                jwtToken={activePass.jwtToken}
                shortCode={activePass.shortCode}
                onRefresh={refreshPass}
              />

              {/* Scanned Verification Overlay Checkmark */}
              {scannedCheckmark && (
                <div className="absolute inset-0 bg-surface/95 backdrop-blur-md rounded-card flex flex-col items-center justify-center space-y-3 z-30 animate-in zoom-in-95 duration-200">
                  <div className="w-16 h-16 rounded-full bg-success/15 border-2 border-success flex items-center justify-center text-success">
                    <CheckCircle2 size={36} />
                  </div>
                  <div className="text-text text-lg sm:text-xl font-bold">
                    Pass Verified! Boarding Commenced
                  </div>
                  <p className="text-xs sm:text-sm text-text-muted">
                    Exact drop-off point unlocked · Starting live SafeTrail navigation...
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="p-8 bg-surface rounded-card border border-border text-center text-text-muted shadow-sm">
              Generating your cryptographic Journey Pass...
            </div>
          )}

          {/* Assigned Vehicle Identification Card */}
          <Card variant="flat" className="p-4 sm:p-5 flex items-center justify-between shadow-colored">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-button bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <Car size={22} />
              </div>
              <div>
                <span className="text-text-muted text-[10px] font-bold uppercase tracking-wider">
                  CONFIRM VEHICLE LICENSE PLATE
                </span>
                <div className="text-text text-base sm:text-lg font-extrabold">
                  {assignedPlate}
                </div>
                <span className="text-xs text-text-muted font-medium">{assignedCar} · White</span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-success font-bold text-xs">CORRIDOR PASS</span>
              <div className="text-xs text-text-muted mt-1 font-medium">Leg 1 of 1</div>
            </div>
          </Card>

          {/* Wake Lock & Safety Info Banner */}
          <div className="flex items-center justify-between text-xs text-text-muted px-1">
            <span className="flex items-center gap-1.5">
              <ShieldCheck size={16} className="text-success" />
              <span>Screen wake-lock held active</span>
            </span>
            <button
              onClick={() => navigate('/app')}
              className="min-h-[44px] text-primary hover:underline font-bold flex items-center"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
