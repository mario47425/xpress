import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import {
  ShieldAlert,
  Users,
  Compass,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Smartphone,
  Monitor,
  ChevronDown,
  Navigation,
  ShieldCheck,
  Wallet,
  Gavel,
  Radio,
} from 'lucide-react';

interface DesktopNavBarProps {
  viewMode: 'desktop' | 'mobile';
  onToggleViewMode: (mode: 'desktop' | 'mobile') => void;
}

export const DesktopNavBar: React.FC<DesktopNavBarProps> = ({
  viewMode,
  onToggleViewMode,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    currentUser,
    users,
    activeRole,
    switchRole,
    switchUser,
    triggerSOS,
    activeSOS,
    wallet,
    resetData,
    simulateGpsStep,
  } = useAppStore();

  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [devMenuOpen, setDevMenuOpen] = useState(false);
  const [gpsStep, setGpsStep] = useState(0);

  const isPassenger = activeRole === 'passenger';

  const waypoints = [
    { lat: 12.9774, lng: 80.2212, label: 'Velachery Bypass (Start)' },
    { lat: 12.9805, lng: 80.2238, label: '100ft Road Midpoint' },
    { lat: 12.9840, lng: 80.2270, label: 'Approaching Guindy Ring' },
    { lat: 12.9875, lng: 80.2305, label: 'Gandhi Mandapam Rd' },
    { lat: 12.9915, lng: 80.2337, label: 'IIT Madras Gate (Arrived)' },
  ];

  const handleNextGps = () => {
    const nextIdx = (gpsStep + 1) % waypoints.length;
    setGpsStep(nextIdx);
    simulateGpsStep(waypoints[nextIdx].lat, waypoints[nextIdx].lng, false);
  };

  const navLinks = isPassenger
    ? [
        { label: 'Home', path: '/app' },
        { label: 'Corridor Map', path: '/app/map' },
        { label: 'Relay Planner', path: '/app/relay' },
        { label: 'Recurring Pods', path: '/app/pods' },
        { label: 'Trust & Streaks', path: '/app/profile' },
        { label: 'Wallet', path: '/app/wallet' },
        { label: 'Safety Centre', path: '/safety' },
      ]
    : [
        { label: 'Home', path: '/rider' },
        { label: 'Active Route', path: '/rider/route' },
        { label: 'QR Scanner', path: '/rider/scanner' },
        { label: 'Requests', path: '/rider/requests' },
        { label: 'Relay Handoff', path: '/rider/handoff' },
        { label: 'Driving Pods', path: '/rider/pods' },
        { label: 'Cost Recovery', path: '/rider/cost-recovery' },
        { label: 'Safety Centre', path: '/safety' },
      ];

  return (
    <header className="w-full bg-surface border-b border-border z-40 sticky top-0 font-mono shadow-xl select-none">
      {/* Top Banner Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Logo and Brand */}
        <div className="flex items-center gap-3">
          <div
            onClick={() => navigate(isPassenger ? '/app' : '/rider')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-inner bg-primary flex items-center justify-center text-white shadow-[0_0_16px_rgba(40,58,175,0.5)] group-hover:scale-105 transition-transform">
              <Radio size={20} className="animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-title-m text-white text-base font-bold tracking-tight">
                  CommuteCircle
                </span>
                <span className="px-1.5 py-0.5 rounded-pill bg-success/20 border border-success/40 text-[9px] font-pill text-success">
                  LIVE CHENNAI
                </span>
              </div>
              <span className="text-[10px] text-text-3 block -mt-0.5">
                Peer-to-Peer Transit Community
              </span>
            </div>
          </div>

          {/* Portal Switcher Segmented Control */}
          <div className="hidden md:flex items-center bg-surface-2 p-1 rounded-pill border border-border ml-3">
            <button
              onClick={() => {
                switchRole('passenger');
                navigate('/app');
              }}
              className={`px-3 py-1 rounded-pill text-xs font-semibold transition-all ${
                isPassenger
                  ? 'bg-primary text-white shadow-sm'
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
              className={`px-3 py-1 rounded-pill text-xs font-semibold transition-all ${
                !isPassenger
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-text-3 hover:text-white'
              }`}
            >
              Rider (/rider)
            </button>
          </div>
        </div>

        {/* Center: Desktop Navigation Links */}
        <nav className="hidden xl:flex items-center gap-1">
          {navLinks.slice(0, 6).map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <button
                key={link.path}
                onClick={() => navigate(link.path)}
                className={`px-3 py-1.5 rounded-inner text-xs font-medium transition-all ${
                  isActive
                    ? 'text-white bg-surface-2 border border-border font-semibold'
                    : 'text-text-3 hover:text-white hover:bg-surface-2/60'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Right Actions: Persona, Device View Toggle, Dev simulation & SOS */}
        <div className="flex items-center gap-2.5">
          {/* View Mode Toggle (Desktop Full Width vs Mobile 390px) */}
          <div className="hidden sm:flex items-center bg-surface-2 p-1 rounded-inner border border-border text-xs">
            <button
              onClick={() => onToggleViewMode('desktop')}
              className={`p-1.5 rounded-[10px] flex items-center gap-1 transition-all ${
                viewMode === 'desktop'
                  ? 'bg-primary text-white shadow-sm font-semibold'
                  : 'text-text-3 hover:text-white'
              }`}
              title="Full Width Responsive Desktop Web App"
            >
              <Monitor size={15} />
              <span className="text-[11px] hidden lg:inline">Web App</span>
            </button>
            <button
              onClick={() => onToggleViewMode('mobile')}
              className={`p-1.5 rounded-[10px] flex items-center gap-1 transition-all ${
                viewMode === 'mobile'
                  ? 'bg-primary text-white shadow-sm font-semibold'
                  : 'text-text-3 hover:text-white'
              }`}
              title="Mobile Phone 390px Simulator"
            >
              <Smartphone size={15} />
              <span className="text-[11px] hidden lg:inline">Mobile Frame</span>
            </button>
          </div>

          {/* Quick Wallet Chip */}
          <button
            onClick={() => navigate(isPassenger ? '/app/wallet' : '/rider/cost-recovery')}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-inner bg-surface-2 hover:bg-surface-2/80 border border-border text-xs text-white"
          >
            <Wallet size={14} className="text-primary-soft" />
            <span className="font-semibold">Rs {wallet?.balance ?? 412}</span>
          </button>

          {/* Persona Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-inner bg-surface-2 hover:bg-surface-2/80 border border-border text-xs text-white transition-all"
            >
              <div className="w-6 h-6 rounded-full overflow-hidden border border-border bg-surface shrink-0">
                <img
                  src={currentUser?.avatar || '/demo/avatars/anitha.svg'}
                  alt={currentUser?.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="font-semibold hidden sm:inline truncate max-w-[100px]">
                {currentUser?.name.split(' ')[0]}
              </span>
              <ChevronDown size={14} className="text-text-3" />
            </button>

            {userDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-surface rounded-card border border-border shadow-2xl p-2 z-50 space-y-1 animate-in fade-in zoom-in-95">
                <span className="font-label text-text-3 text-[10px] px-2 py-1 block">
                  SWITCH DEMO PERSONA
                </span>
                {[
                  { id: 'user-anitha', name: 'Anitha Ramesh', role: 'Passenger · Trusted (78)' },
                  { id: 'user-karthik', name: 'Karthik Subramanian', role: 'Rider · Guardian (88)' },
                  { id: 'user-meenakshi', name: 'Meenakshi Sundaram', role: 'Moderator · Anchor (94)' },
                ].map((u) => (
                  <button
                    key={u.id}
                    onClick={() => {
                      switchUser(u.id);
                      setUserDropdownOpen(false);
                      if (u.id === 'user-karthik') navigate('/rider');
                      else if (u.id === 'user-anitha') navigate('/app');
                      else navigate('/moderator');
                    }}
                    className={`w-full text-left px-2.5 py-2 rounded-inner text-xs flex flex-col transition-all ${
                      currentUser?.id === u.id
                        ? 'bg-primary/20 text-white font-semibold border border-primary/40'
                        : 'text-text-2 hover:bg-surface-2'
                    }`}
                  >
                    <span className="text-white font-medium">{u.name}</span>
                    <span className="text-[10px] text-text-3">{u.role}</span>
                  </button>
                ))}

                <div className="pt-2 border-t border-border mt-1">
                  <button
                    onClick={() => {
                      navigate('/moderator');
                      setUserDropdownOpen(false);
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded-inner text-xs text-warn hover:bg-warn/10 flex items-center gap-1.5"
                  >
                    <Gavel size={14} />
                    <span>Moderator Queue</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Dev Tools Drawer Toggle */}
          <div className="relative">
            <button
              onClick={() => setDevMenuOpen(!devMenuOpen)}
              className="p-2 rounded-inner bg-surface-2 hover:bg-surface-2/80 border border-border text-text-2 hover:text-white transition-all text-xs flex items-center gap-1"
              title="Dev Tools & GPS Simulator"
            >
              <Compass size={16} className="text-primary-soft" />
              <span className="hidden xl:inline text-[11px]">GPS Sim</span>
            </button>

            {devMenuOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-surface rounded-card border border-border shadow-2xl p-3.5 z-50 space-y-3 animate-in fade-in zoom-in-95">
                <div className="flex items-center justify-between border-b border-border pb-2">
                  <span className="font-label text-primary-soft text-[10px]">
                    GPS SIMULATOR & CONTROLS
                  </span>
                  <span className="text-[10px] text-text-3 font-mono">Step {gpsStep + 1}/5</span>
                </div>

                <div className="text-xs text-text-2">
                  Waypoint: <span className="text-white font-semibold">{waypoints[gpsStep].label}</span>
                </div>

                <button
                  onClick={handleNextGps}
                  className="w-full py-2 px-3 bg-surface-2 hover:bg-surface-2/80 border border-border rounded-btn text-xs text-white flex items-center justify-center gap-2"
                >
                  <Navigation size={14} className="text-primary-soft" />
                  <span>Advance 1 GPS Waypoint</span>
                </button>

                <button
                  onClick={() => simulateGpsStep(12.9720, 80.2150, true)}
                  className="w-full py-2 px-3 bg-warn/15 hover:bg-warn/25 border border-warn/40 rounded-btn text-xs text-warn flex items-center justify-center gap-2"
                >
                  <AlertTriangle size={14} />
                  <span>Trigger 400m Route Deviation</span>
                </button>

                <div className="pt-2 border-t border-border flex gap-2">
                  <button
                    onClick={async () => {
                      await fetch('/api/predictions/nightly-run', { method: 'POST' });
                      alert('Nightly predictions calculated');
                    }}
                    className="flex-1 py-1.5 bg-surface-2 text-text-2 rounded-inner text-[10px] flex items-center justify-center gap-1"
                  >
                    <Sparkles size={12} className="text-warn" />
                    <span>Run Nightly</span>
                  </button>
                  <button
                    onClick={resetData}
                    className="flex-1 py-1.5 bg-surface-2 text-text-2 rounded-inner text-[10px] flex items-center justify-center gap-1"
                  >
                    <RotateCcw size={12} />
                    <span>Reset Data</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Emergency SOS Button in Desktop Top Bar */}
          <button
            onClick={() => {
              if (activeSOS) navigate('/sos/active');
              else triggerSOS();
            }}
            className="h-9 px-3 rounded-inner bg-danger/20 hover:bg-danger/30 border border-danger/50 text-danger text-xs font-bold flex items-center gap-1.5 transition-all shadow-[0_0_12px_rgba(229,72,77,0.3)]"
          >
            <ShieldAlert size={16} className="animate-pulse" />
            <span className="hidden sm:inline">SOS</span>
          </button>
        </div>
      </div>

      {/* Sub-navigation bar for tablet/desktop */}
      <div className="border-t border-border/40 bg-surface/50 px-4 sm:px-6 py-1.5 flex xl:hidden items-center gap-2 overflow-x-auto no-scrollbar">
        {navLinks.map((link) => {
          const isActive = location.pathname === link.path;
          return (
            <button
              key={link.path}
              onClick={() => navigate(link.path)}
              className={`px-3 py-1 rounded-pill text-xs whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-primary text-white font-semibold'
                  : 'text-text-3 hover:text-white'
              }`}
            >
              {link.label}
            </button>
          );
        })}
      </div>
    </header>
  );
};
