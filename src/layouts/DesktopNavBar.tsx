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
  ChevronDown,
  Navigation,
  ShieldCheck,
  Wallet,
  Gavel,
  Radio,
  Menu,
  X,
  Layers,
  MapPin,
} from 'lucide-react';

export const DesktopNavBar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    currentUser,
    activeRole,
    switchRole,
    switchUser,
    triggerSOS,
    activeSOS,
    wallet,
    resetData,
    simulateGpsStep,
  } = useAppStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
        { label: 'Safety', path: '/safety' },
      ]
    : [
        { label: 'Home', path: '/rider' },
        { label: 'Active Route', path: '/rider/route' },
        { label: 'QR Scanner', path: '/rider/scanner' },
        { label: 'Requests', path: '/rider/requests' },
        { label: 'Driving Pods', path: '/rider/pods' },
        { label: 'Cost Recovery', path: '/rider/cost-recovery' },
        { label: 'Safety', path: '/safety' },
      ];

  const handleNavClick = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  return (
    <header className="w-full bg-surface/95 backdrop-blur-md border-b border-border z-40 sticky top-0 font-sans shadow-sm select-none transition-colors">
      {/* Compact Main Header Bar: 56px mobile, 64px desktop */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-3">
        {/* Left: Brand Logo & Portal Switcher */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0 min-w-0">
          <div
            onClick={() => navigate(isPassenger ? '/app' : '/rider')}
            className="flex items-center gap-2.5 cursor-pointer group shrink-0"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-inner overflow-hidden bg-transparent border border-border/40 flex items-center justify-center group-hover:scale-105 transition-transform shrink-0 p-0.5">
              <img
                src="/logo.png"
                alt="CommuteCircle Logo"
                className="w-full h-full object-contain rounded-inner"
              />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 truncate">
                <span className="text-sm sm:text-base font-bold text-text tracking-tight truncate">
                  CommuteCircle
                </span>
                <span className="hidden sm:inline-block px-1.5 py-0.5 rounded-pill bg-success/15 text-success text-[10px] font-semibold border border-success/30">
                  LIVE
                </span>
              </div>
              <span className="text-[10px] text-text-muted block -mt-0.5 truncate hidden xs:block">
                Chennai Peer Corridors
              </span>
            </div>
          </div>

          {/* Role Switcher Pill - visible from tablet up */}
          <div className="hidden md:flex items-center bg-surface-2 p-1 rounded-pill border border-border ml-2">
            <button
              onClick={() => {
                switchRole('passenger');
                navigate('/app');
              }}
              className={`px-3 py-1 rounded-pill text-xs font-semibold transition-all ${
                isPassenger
                  ? 'bg-gradient-primary text-white shadow-sm'
                  : 'text-text-3 hover:text-text'
              }`}
            >
              Passenger
            </button>
            <button
              onClick={() => {
                switchRole('rider');
                navigate('/rider');
              }}
              className={`px-3 py-1 rounded-pill text-xs font-semibold transition-all ${
                !isPassenger
                  ? 'bg-gradient-primary text-white shadow-sm'
                  : 'text-text-3 hover:text-text'
              }`}
            >
              Rider
            </button>
          </div>
        </div>

        {/* Center: Desktop Navigation Links (visible on lg+) */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <button
                key={link.path}
                onClick={() => handleNavClick(link.path)}
                className={`px-3 py-1.5 rounded-btn text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-gradient-primary text-white font-semibold shadow-sm'
                    : 'text-text-2 hover:text-text hover:bg-surface-2'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Right Slot: Persona, Wallet, GPS, SOS & Mobile Hamburger */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Quick Wallet Chip */}
          <button
            onClick={() => navigate(isPassenger ? '/app/wallet' : '/rider/cost-recovery')}
            className="hidden sm:flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-btn bg-surface-2 hover:bg-surface-glow border border-border text-xs text-text font-medium transition-colors"
          >
            <Wallet size={14} className="text-primary" />
            <span className="font-semibold text-text">Rs {wallet?.balance ?? 412}</span>
          </button>

          {/* Persona Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="flex items-center gap-1.5 px-2 py-1.5 rounded-btn bg-surface-2 hover:bg-surface-glow border border-border text-xs text-text transition-all min-h-[44px]"
              aria-label="Switch User Persona"
            >
              <div className="w-7 h-7 rounded-full overflow-hidden border border-border bg-surface-2 shrink-0">
                <img
                  src={currentUser?.avatar || '/demo/avatars/anitha.svg'}
                  alt={currentUser?.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="font-medium hidden sm:inline truncate max-w-[80px]">
                {currentUser?.name.split(' ')[0]}
              </span>
              <ChevronDown size={14} className="text-text-3" />
            </button>

            {userDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-surface rounded-card border border-border shadow-xl p-2 z-50 space-y-1 animate-in fade-in zoom-in-95">
                <span className="text-[10px] font-semibold text-text-3 px-2 py-1 block uppercase tracking-wider">
                  Switch Demo Persona
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
                        ? 'bg-primary/10 text-primary font-semibold border border-primary/30'
                        : 'text-text-2 hover:bg-surface-2'
                    }`}
                  >
                    <span className="font-semibold">{u.name}</span>
                    <span className="text-[10px] text-text-3">{u.role}</span>
                  </button>
                ))}

                <div className="pt-2 border-t border-border mt-1">
                  <button
                    onClick={() => {
                      navigate('/moderator');
                      setUserDropdownOpen(false);
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded-inner text-xs text-accent hover:bg-accent/10 flex items-center gap-1.5 font-medium"
                  >
                    <Gavel size={14} />
                    <span>Moderator Queue</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Dev GPS Simulation Drawer */}
          <div className="relative">
            <button
              onClick={() => setDevMenuOpen(!devMenuOpen)}
              className="min-h-[44px] min-w-[44px] p-2 rounded-btn bg-surface-2 hover:bg-surface-glow border border-border text-text-2 hover:text-text transition-all text-xs flex items-center justify-center gap-1"
              title="GPS Simulator & Controls"
              aria-label="GPS Simulator"
            >
              <Compass size={17} className="text-primary" />
              <span className="hidden xl:inline text-[11px] font-medium">GPS</span>
            </button>

            {devMenuOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-surface rounded-card border border-border shadow-xl p-3.5 z-50 space-y-3 animate-in fade-in zoom-in-95">
                <div className="flex items-center justify-between border-b border-border pb-2">
                  <span className="text-[10px] font-bold text-primary uppercase tracking-wider">
                    GPS Simulator & Controls
                  </span>
                  <span className="text-[10px] text-text-3">Step {gpsStep + 1}/5</span>
                </div>

                <div className="text-xs text-text-2">
                  Waypoint: <span className="text-text font-semibold">{waypoints[gpsStep].label}</span>
                </div>

                <button
                  onClick={handleNextGps}
                  className="w-full py-2 px-3 bg-surface-2 hover:bg-surface-glow border border-border rounded-btn text-xs text-text flex items-center justify-center gap-2 font-medium"
                >
                  <Navigation size={14} className="text-primary" />
                  <span>Advance 1 GPS Waypoint</span>
                </button>

                <button
                  onClick={() => simulateGpsStep(12.9720, 80.2150, true)}
                  className="w-full py-2 px-3 bg-warn/10 hover:bg-warn/20 border border-warn/30 rounded-btn text-xs text-warn flex items-center justify-center gap-2 font-medium"
                >
                  <AlertTriangle size={14} />
                  <span>Trigger 400m Route Detour</span>
                </button>

                <div className="pt-2 border-t border-border flex gap-2">
                  <button
                    onClick={async () => {
                      await fetch('/api/predictions/nightly-run', { method: 'POST' });
                      alert('Nightly predictions calculated');
                    }}
                    className="flex-1 py-1.5 bg-surface-2 text-text-2 rounded-inner text-[10px] flex items-center justify-center gap-1 hover:text-text"
                  >
                    <Sparkles size={12} className="text-accent" />
                    <span>Run Nightly</span>
                  </button>
                  <button
                    onClick={resetData}
                    className="flex-1 py-1.5 bg-surface-2 text-text-2 rounded-inner text-[10px] flex items-center justify-center gap-1 hover:text-text"
                  >
                    <RotateCcw size={12} />
                    <span>Reset Data</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Emergency SOS Button */}
          <button
            onClick={() => {
              if (activeSOS) navigate('/sos/active');
              else triggerSOS();
            }}
            className="min-h-[44px] h-10 px-3 rounded-btn bg-danger/10 hover:bg-danger/20 border border-danger/40 text-danger text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm shrink-0"
            aria-label="Emergency SOS"
          >
            <ShieldAlert size={17} className="animate-pulse" />
            <span className="hidden sm:inline">SOS</span>
          </button>

          {/* Mobile Hamburger Toggle (visible on < lg) */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden min-h-[44px] min-w-[44px] p-2 rounded-btn bg-surface-2 hover:bg-surface-glow border border-border text-text flex items-center justify-center transition-colors"
            aria-label="Toggle Mobile Navigation Menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer / Collapsible Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-surface border-b border-border px-4 py-4 space-y-3 shadow-lg animate-in slide-in-from-top-2 duration-200">
          {/* Role switcher inside mobile menu */}
          <div className="flex items-center bg-surface-2 p-1 rounded-pill border border-border">
            <button
              onClick={() => {
                switchRole('passenger');
                navigate('/app');
                setMobileMenuOpen(false);
              }}
              className={`flex-1 py-2 rounded-pill text-xs font-semibold text-center transition-all ${
                isPassenger
                  ? 'bg-gradient-primary text-white shadow-sm'
                  : 'text-text-3'
              }`}
            >
              Passenger Mode (/app)
            </button>
            <button
              onClick={() => {
                switchRole('rider');
                navigate('/rider');
                setMobileMenuOpen(false);
              }}
              className={`flex-1 py-2 rounded-pill text-xs font-semibold text-center transition-all ${
                !isPassenger
                  ? 'bg-gradient-primary text-white shadow-sm'
                  : 'text-text-3'
              }`}
            >
              Rider Mode (/rider)
            </button>
          </div>

          {/* Navigation Links List */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <button
                  key={link.path}
                  onClick={() => handleNavClick(link.path)}
                  className={`px-3 py-2.5 rounded-btn text-xs font-medium text-left transition-all min-h-[44px] flex items-center ${
                    isActive
                      ? 'bg-gradient-primary text-white font-semibold shadow-sm'
                      : 'bg-surface-2 text-text-2 hover:text-text'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </div>

          {/* Quick Wallet Link */}
          <div className="pt-2 border-t border-border flex items-center justify-between">
            <button
              onClick={() => {
                navigate(isPassenger ? '/app/wallet' : '/rider/cost-recovery');
                setMobileMenuOpen(false);
              }}
              className="text-xs text-primary font-semibold flex items-center gap-1.5"
            >
              <Wallet size={15} />
              <span>Wallet: Rs {wallet?.balance ?? 412}</span>
            </button>
            <span className="text-[11px] text-text-3">Chennai Corridors</span>
          </div>
        </div>
      )}
    </header>
  );
};
