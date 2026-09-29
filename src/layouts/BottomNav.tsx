import React, { useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Map, Users, User, ShieldAlert, Navigation, Inbox } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

export const BottomNav: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { activeRole, triggerSOS } = useAppStore();

  const isPassenger = activeRole === 'passenger';

  // Press & hold 3s on SOS shield (UI Spec §6.17 & §5.3)
  const [sosHoldProgress, setSosHoldProgress] = useState(0);
  const holdTimerRef = useRef<any>(null);
  const startTimeRef = useRef<number>(0);

  const startSosHold = () => {
    startTimeRef.current = Date.now();
    holdTimerRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const progress = Math.min(100, (elapsed / 3000) * 100);
      setSosHoldProgress(progress);

      if (progress >= 100) {
        clearInterval(holdTimerRef.current);
        setSosHoldProgress(0);
        triggerSOS();
      }
    }, 50);
  };

  const cancelSosHold = () => {
    if (holdTimerRef.current) clearInterval(holdTimerRef.current);
    setSosHoldProgress(0);
  };

  const navItems = isPassenger
    ? [
        { label: 'Home', path: '/app', icon: Home },
        { label: 'Map', path: '/app/map', icon: Map },
        { label: 'SOS', isSos: true },
        { label: 'Pods', path: '/app/pods', icon: Users },
        { label: 'Profile', path: '/app/profile', icon: User },
      ]
    : [
        { label: 'Home', path: '/rider', icon: Home },
        { label: 'Route', path: '/rider/route', icon: Navigation },
        { label: 'SOS', isSos: true },
        { label: 'Requests', path: '/rider/requests', icon: Inbox },
        { label: 'Profile', path: '/rider/profile', icon: User },
      ];

  return (
    <nav className="relative h-[72px] bg-surface border-t border-border flex items-center justify-around px-2 z-40 shrink-0">
      {navItems.map((item, idx) => {
        if (item.isSos) {
          return (
            <div key="sos-shield-container" className="relative flex flex-col items-center">
              <button
                onMouseDown={startSosHold}
                onMouseUp={cancelSosHold}
                onMouseLeave={cancelSosHold}
                onTouchStart={startSosHold}
                onTouchEnd={cancelSosHold}
                onClick={() => {
                  // Direct tap can also navigate to safety center or initiate
                  navigate('/safety');
                }}
                aria-label="Emergency SOS Shield. Hold 3 seconds to trigger."
                className="relative -top-4 w-14 h-14 rounded-full bg-danger/15 border-[1.5px] border-danger flex items-center justify-center text-danger shadow-lg active:scale-95 transition-transform"
              >
                {/* Hold circular progress overlay */}
                {sosHoldProgress > 0 && (
                  <svg className="absolute inset-0 w-full h-full -rotate-90">
                    <circle
                      cx="28"
                      cy="28"
                      r="25"
                      stroke="#E5484D"
                      strokeWidth="3"
                      fill="transparent"
                      strokeDasharray={157}
                      strokeDashoffset={157 - (157 * sosHoldProgress) / 100}
                      className="transition-all duration-75"
                    />
                  </svg>
                )}
                <ShieldAlert size={28} className="animate-pulse" />
              </button>
              <span className="font-label text-[9px] text-danger -mt-2">HOLD SOS</span>
            </div>
          );
        }

        const Icon = item.icon!;
        const isActive = location.pathname === item.path;

        return (
          <button
            key={item.label}
            onClick={() => navigate(item.path!)}
            className="flex flex-col items-center justify-center flex-1 h-full py-1 text-center group"
          >
            {/* 3px Active Indicator Dot */}
            <div
              className={`w-1 h-1 rounded-full mb-1 transition-all ${
                isActive ? 'bg-primary-soft opacity-100' : 'opacity-0'
              }`}
            />
            <Icon
              size={22}
              className={`transition-colors ${
                isActive ? 'text-primary-soft' : 'text-text-3 group-hover:text-text-2'
              }`}
            />
            <span
              className={`font-label text-[10px] mt-1 transition-colors ${
                isActive ? 'text-primary-soft' : 'text-text-3'
              }`}
            >
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
