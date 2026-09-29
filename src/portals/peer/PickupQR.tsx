import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppBar } from '../../layouts/AppBar';
import { Pill } from '../../components/primitives/Pill';
import { QRCard } from '../../components/signature/QRCard';
import { Card } from '../../components/primitives/Card';
import { useAppStore } from '../../store/useAppStore';
import { ShieldCheck, Car, CheckCircle2 } from 'lucide-react';

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

  // Screen Wake Lock API (PRD §9 & UI Spec §15)
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
    <div className="flex-1 flex flex-col font-mono">
      <AppBar
        title="Pickup Handshake"
        pill={<Pill variant="available" label="READY TO SCAN" />}
      />

      <div className="p-5 space-y-5 pb-8 flex-1 flex flex-col justify-between">
        <div className="space-y-4">
          <div className="text-center">
            <span className="font-label text-primary-soft text-xs uppercase">
              Show this to your rider
            </span>
            <h2 className="font-title-m text-white text-lg font-bold">
              Journey Pass Handshake
            </h2>
          </div>

          {/* QR Card with dedicated white scan tile and short code */}
          {activePass ? (
            <div className="relative">
              <QRCard
                jwtToken={activePass.jwtToken}
                shortCode={activePass.shortCode}
                onRefresh={refreshPass}
              />

              {/* Scanned Success Green Check Overlay */}
              {scannedCheckmark && (
                <div className="absolute inset-0 bg-success/90 backdrop-blur-sm rounded-card flex flex-col items-center justify-center text-white space-y-2 animate-in zoom-in-95 duration-200">
                  <CheckCircle2 size={56} className="animate-bounce" />
                  <span className="font-title-m font-bold text-lg">PASS SCANNED</span>
                  <span className="text-xs text-white/90 font-mono">Boarding verified by rider</span>
                </div>
              )}
            </div>
          ) : (
            <Card variant="flat" className="h-64 flex items-center justify-center text-xs text-text-3">
              Generating Signed Journey Pass...
            </Card>
          )}

          {/* Mutual Verification Vehicle Plate Card (PRD §3.7 G8) */}
          <div className="p-4 bg-surface rounded-card border border-primary-soft/40 space-y-2">
            <div className="flex items-center gap-2">
              <Car size={18} className="text-primary-soft" />
              <span className="font-label text-primary-soft">MUTUAL VEHICLE CHECK</span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-white text-base font-bold tracking-wider font-mono">
                  Match: {assignedPlate}
                </div>
                <div className="text-xs text-text-2">{assignedCar} (Sedan)</div>
              </div>
              <div className="text-right">
                <span className="font-label text-text-3 text-[10px]">RIDE CODE</span>
                <div className="text-white font-bold text-base font-mono">
                  {liveRide?.rideCode || '4821'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Wake Lock Status Indicator */}
        <div className="text-center text-[10px] text-text-3 font-mono">
          Screen wake lock: <span className={wakeLockActive ? 'text-success' : 'text-text-2'}>{wakeLockActive ? 'Active (Screen stays awake)' : 'Inactive'}</span>
        </div>
      </div>
    </div>
  );
};
