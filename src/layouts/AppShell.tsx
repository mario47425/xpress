import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { BottomNav } from './BottomNav';
import { useAppStore } from '../store/useAppStore';
import { WifiOff, ShieldAlert, AlertTriangle } from 'lucide-react';

interface AppShellProps {
  children: React.ReactNode;
  hideNav?: boolean;
}

export const AppShell: React.FC<AppShellProps> = ({ children, hideNav = false }) => {
  const {
    isOffline,
    activeSOS,
    checkInActive,
    checkInReason,
    checkInCountdown,
    respondCheckIn,
  } = useAppStore();

  const location = useLocation();
  const navigate = useNavigate();

  // Determine if on top-level tab for mobile bottom nav
  const topLevelRoutes = [
    '/app',
    '/app/map',
    '/app/pods',
    '/app/profile',
    '/rider',
    '/rider/route',
    '/rider/requests',
    '/rider/profile',
  ];
  const isTopLevel = topLevelRoutes.includes(location.pathname);
  const showBottomNav = !hideNav && isTopLevel;

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-bg text-text relative font-mono">
      {/* Offline Status Persistent Banner (UI Spec §6.14) */}
      {isOffline && (
        <div className="w-full bg-warn/15 border-b border-warn/30 h-10 px-4 flex items-center justify-center gap-2 text-warn text-xs z-50 shrink-0">
          <WifiOff size={14} />
          <span className="font-label text-warn">OFFLINE MODE · LAST PASS KEPT VALID</span>
        </div>
      )}

      {/* Active SOS Persistent Banner */}
      {activeSOS && (
        <div
          onClick={() => navigate('/sos/active')}
          className="w-full bg-danger/20 border-b border-danger/40 h-10 px-4 sm:px-6 flex items-center justify-between text-danger text-xs z-50 shrink-0 cursor-pointer animate-pulse"
        >
          <div className="flex items-center gap-2 max-w-7xl mx-auto w-full justify-between">
            <div className="flex items-center gap-2">
              <ShieldAlert size={16} />
              <span className="font-pill text-danger">SOS ACTIVE · LIVE COMMUNITY EMERGENCY</span>
            </div>
            <span className="text-[11px] font-bold underline">OPEN EMERGENCY MONITOR ➔</span>
          </div>
        </div>
      )}

      {/* Main Scrollable View Area: Contained max-w-7xl on desktop */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden relative flex flex-col no-scrollbar">
        <div className="w-full max-w-7xl mx-auto flex-1 flex flex-col">
          {children}
        </div>
      </div>

      {/* Deviation "Are You Okay?" Soft Check-In Modal / Sheet (UI Spec §10.2 & PRD §3.7) */}
      {checkInActive && (
        <div className="fixed inset-0 bg-bg/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-surface max-w-lg w-full rounded-card border border-warn/40 p-6 space-y-5 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-inner bg-warn/20 border border-warn/40 flex items-center justify-center text-warn shrink-0">
                <AlertTriangle size={26} />
              </div>
              <div>
                <span className="font-label text-warn text-[10px]">ROUTE DEVIATION DETECTED</span>
                <h3 className="font-title-m text-white text-lg">Are you okay?</h3>
              </div>
            </div>

            <p className="text-xs text-text-2 leading-relaxed">
              {checkInReason}. Please check in within <span className="text-white font-bold">{checkInCountdown}s</span>. If unanswered, your emergency contacts and community responders will be alerted automatically.
            </p>

            {/* Countdown Tick Progress */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[10px] text-text-3 font-mono">
                <span>COMMUNITY ESCALATION IN</span>
                <span className="text-warn font-bold">{checkInCountdown} SECONDS</span>
              </div>
              <div className="w-full h-2 bg-surface-2 rounded-full overflow-hidden flex">
                <div
                  className="bg-warn h-full transition-all duration-1000"
                  style={{ width: `${(checkInCountdown / 60) * 100}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => respondCheckIn(true)}
                className="h-12 bg-success hover:bg-success/90 text-white font-semibold rounded-btn text-sm flex items-center justify-center transition-transform active:scale-98 shadow-md"
              >
                I'm Okay
              </button>
              <button
                onClick={() => respondCheckIn(false)}
                className="h-12 bg-danger/20 hover:bg-danger/30 border border-danger/40 text-danger font-semibold rounded-btn text-sm flex items-center justify-center transition-all"
              >
                Need Help · Trigger SOS
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation: Shown ONLY on mobile viewports (< lg), hidden on desktop where DesktopNavBar operates */}
      {showBottomNav && (
        <div className="lg:hidden shrink-0 z-30">
          <BottomNav />
        </div>
      )}
    </div>
  );
};
