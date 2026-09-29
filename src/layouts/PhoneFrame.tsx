import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { useNavigate } from 'react-router-dom';
import {
  RotateCcw,
  Navigation,
  AlertTriangle,
  ShieldAlert,
  Sparkles,
  Users,
  Compass,
} from 'lucide-react';

interface PhoneFrameProps {
  children: React.ReactNode;
}

export const PhoneFrame: React.FC<PhoneFrameProps> = ({ children }) => {
  const {
    currentUser,
    users,
    activeRole,
    switchUser,
    switchRole,
    resetData,
    simulateGpsStep,
    triggerSOS,
    liveRide,
  } = useAppStore();

  const navigate = useNavigate();
  const [gpsIndex, setGpsIndex] = useState(0);

  // Demo Waypoints along Chennai corridor (Velachery to IIT Madras)
  const waypoints = [
    { lat: 12.9774, lng: 80.2212, label: 'Velachery Bypass (Start)' },
    { lat: 12.9805, lng: 80.2238, label: '100ft Road Midpoint' },
    { lat: 12.9840, lng: 80.2270, label: 'Approaching Guindy Ring' },
    { lat: 12.9875, lng: 80.2305, label: 'Gandhi Mandapam Rd' },
    { lat: 12.9915, lng: 80.2337, label: 'IIT Madras Gate (Arrived)' },
  ];

  const handleNextGpsStep = () => {
    const nextIdx = (gpsIndex + 1) % waypoints.length;
    setGpsIndex(nextIdx);
    const pt = waypoints[nextIdx];
    simulateGpsStep(pt.lat, pt.lng, false);
  };

  const handleTriggerDeviation = () => {
    // 400m off route
    simulateGpsStep(12.9720, 80.2150, true);
  };

  const handleRunNightly = async () => {
    await fetch('/api/predictions/nightly-run', { method: 'POST' });
  };

  return (
    <div className="min-h-screen bg-bg-alt flex flex-col md:flex-row items-center justify-center p-0 md:p-6 gap-6 font-mono selection:bg-primary-soft selection:text-bg">
      {/* Dev Panel (Visible on Desktop next to phone frame) */}
      <aside className="hidden lg:flex flex-col w-80 bg-surface rounded-card border border-border p-5 space-y-5 text-text self-center max-h-[844px] overflow-y-auto no-scrollbar">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-success animate-pulse" />
            <h2 className="font-title-m text-white text-base">Demo Dev Panel</h2>
          </div>
          <span className="font-label text-text-3">Chennai</span>
        </div>

        {/* Demo Users Quick Switch */}
        <div className="space-y-2">
          <label className="font-label text-primary-soft flex items-center gap-1.5">
            <Users size={14} /> Active Persona
          </label>
          <div className="grid grid-cols-1 gap-1.5">
            <button
              onClick={() => {
                switchUser('user-anitha');
                navigate('/app');
              }}
              className={`text-left px-3 py-2 rounded-inner border text-xs flex items-center justify-between transition-all ${
                currentUser?.id === 'user-anitha'
                  ? 'border-primary-soft bg-primary/20 text-white font-semibold'
                  : 'border-border bg-surface-2 text-text-2 hover:bg-surface-2/80'
              }`}
            >
              <div>
                <div className="text-white font-medium">Anitha Ramesh</div>
                <div className="text-[10px] text-text-3">Passenger · Trusted (78)</div>
              </div>
              <span className="text-[10px] font-pill text-primary-soft">/app</span>
            </button>

            <button
              onClick={() => {
                switchUser('user-karthik');
                navigate('/rider');
              }}
              className={`text-left px-3 py-2 rounded-inner border text-xs flex items-center justify-between transition-all ${
                currentUser?.id === 'user-karthik'
                  ? 'border-success bg-success/20 text-white font-semibold'
                  : 'border-border bg-surface-2 text-text-2 hover:bg-surface-2/80'
              }`}
            >
              <div>
                <div className="text-white font-medium">Karthik Subramanian</div>
                <div className="text-[10px] text-text-3">Rider · Guardian (88) · Honda City</div>
              </div>
              <span className="text-[10px] font-pill text-success">/rider</span>
            </button>

            <button
              onClick={() => {
                switchUser('user-meenakshi');
                navigate(activeRole === 'rider' ? '/rider' : '/app');
              }}
              className={`text-left px-3 py-2 rounded-inner border text-xs flex items-center justify-between transition-all ${
                currentUser?.id === 'user-meenakshi'
                  ? 'border-warn bg-warn/20 text-white font-semibold'
                  : 'border-border bg-surface-2 text-text-2 hover:bg-surface-2/80'
              }`}
            >
              <div>
                <div className="text-white font-medium">Meenakshi Sundaram</div>
                <div className="text-[10px] text-text-3">Moderator · Anchor (94)</div>
              </div>
              <span className="text-[10px] font-pill text-warn">Mod</span>
            </button>
          </div>
        </div>

        {/* Portal Role Switcher */}
        <div className="space-y-2">
          <label className="font-label text-primary-soft">Portal Switcher</label>
          <div className="grid grid-cols-2 gap-2 bg-surface-2 p-1 rounded-btn">
            <button
              onClick={() => {
                switchRole('passenger');
                navigate('/app');
              }}
              className={`py-2 text-xs font-semibold rounded-inner transition-all ${
                activeRole === 'passenger'
                  ? 'bg-primary text-white shadow-md'
                  : 'text-text-3 hover:text-white'
              }`}
            >
              Passenger (/app)
            </button>
            <button
              onClick={() => {
                switchRole('rider');
                navigate('/rider');
              }}
              className={`py-2 text-xs font-semibold rounded-inner transition-all ${
                activeRole === 'rider'
                  ? 'bg-primary text-white shadow-md'
                  : 'text-text-3 hover:text-white'
              }`}
            >
              Rider (/rider)
            </button>
          </div>
        </div>

        {/* Real-time GPS Route Replay & Deviation Simulator */}
        <div className="space-y-2 border-t border-border pt-3">
          <label className="font-label text-primary-soft flex items-center gap-1.5">
            <Navigation size={14} /> GPS Route Simulator
          </label>
          <div className="text-[11px] text-text-3 mb-1">
            Current: <span className="text-white">{waypoints[gpsIndex].label}</span>
          </div>
          <button
            onClick={handleNextGpsStep}
            className="w-full py-2 px-3 bg-surface-2 hover:bg-surface-2/80 border border-border rounded-btn text-xs text-white flex items-center justify-center gap-2"
          >
            <Compass size={14} className="text-primary-soft" />
            Step Along Route ({gpsIndex + 1}/{waypoints.length})
          </button>

          <button
            onClick={handleTriggerDeviation}
            className="w-full py-2 px-3 bg-warn/15 hover:bg-warn/25 border border-warn/30 rounded-btn text-xs text-warn flex items-center justify-center gap-2"
          >
            <AlertTriangle size={14} />
            Trigger 400m Route Deviation
          </button>
        </div>

        {/* SOS Alert Trigger */}
        <div className="space-y-2 border-t border-border pt-3">
          <label className="font-label text-danger flex items-center gap-1.5">
            <ShieldAlert size={14} /> Emergency Sandbox
          </label>
          <button
            onClick={() => triggerSOS()}
            className="w-full py-2.5 px-3 bg-danger/20 hover:bg-danger/30 border border-danger/40 rounded-btn text-xs text-danger font-semibold flex items-center justify-center gap-2"
          >
            <ShieldAlert size={16} />
            Fire Emergency SOS Alert
          </button>
        </div>

        {/* Background Jobs & Reset */}
        <div className="space-y-2 border-t border-border pt-3">
          <label className="font-label text-primary-soft">Background Engine</label>
          <button
            onClick={handleRunNightly}
            className="w-full py-2 px-3 bg-surface-2 hover:bg-surface-2/80 border border-border rounded-btn text-xs text-white flex items-center justify-center gap-2"
          >
            <Sparkles size={14} className="text-warn" />
            Run Nightly Ghost Predictions
          </button>

          <button
            onClick={resetData}
            className="w-full py-2 px-3 bg-surface-2 hover:bg-surface-2/80 border border-border rounded-btn text-xs text-text-2 flex items-center justify-center gap-2"
          >
            <RotateCcw size={14} />
            Reset All Demo Data
          </button>
        </div>
      </aside>

      {/* Mobile-First 390x844 Centred Frame */}
      <main className="w-full sm:w-[390px] h-screen sm:h-[844px] bg-bg sm:rounded-phone-frame sm:border-[8px] sm:border-[#0C0D14] sm:shadow-2xl overflow-hidden relative flex flex-col">
        {children}
      </main>
    </div>
  );
};
