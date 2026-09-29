import React, { useState, useEffect } from 'react';
import { DesktopNavBar } from './DesktopNavBar';
import { Monitor, Smartphone, Info } from 'lucide-react';

interface PhoneFrameProps {
  children: React.ReactNode;
}

export const PhoneFrame: React.FC<PhoneFrameProps> = ({ children }) => {
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>(() => {
    const saved = localStorage.getItem('cc_view_mode');
    return saved === 'mobile' ? 'mobile' : 'desktop';
  });

  const handleToggleViewMode = (mode: 'desktop' | 'mobile') => {
    setViewMode(mode);
    localStorage.setItem('cc_view_mode', mode);
  };

  // If in desktop mode, render full-width responsive web application layout
  if (viewMode === 'desktop') {
    return (
      <div className="min-h-screen bg-bg text-text font-mono flex flex-col w-full selection:bg-primary selection:text-white">
        {/* Desktop Web App Sticky Top Navigation */}
        <DesktopNavBar viewMode={viewMode} onToggleViewMode={handleToggleViewMode} />

        {/* Full-width Responsive Main Web App Canvas */}
        <main className="flex-1 w-full flex flex-col relative">
          {children}
        </main>

        {/* Desktop Web App Footer */}
        <footer className="border-t border-border/50 py-4 px-6 text-xs text-text-3 font-mono bg-surface/40 mt-auto">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
              <span className="text-text-2">
                CommuteCircle Chennai · Live Peer Corridor Transit Network
              </span>
            </div>
            <div className="text-[11px] text-text-3 flex items-center gap-4">
              <span>Velachery ⇄ IIT Madras ⇄ OMR</span>
              <span className="text-border">|</span>
              <button
                onClick={() => handleToggleViewMode('mobile')}
                className="hover:text-primary-soft flex items-center gap-1 transition-colors"
              >
                <Smartphone size={12} />
                <span>Simulate 390px Mobile</span>
              </button>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  // Mobile Mode: 390px Centred Device Simulator Frame
  return (
    <div className="min-h-screen bg-bg-alt flex flex-col font-mono selection:bg-primary-soft selection:text-bg">
      {/* Top Bar with Mode Switcher */}
      <DesktopNavBar viewMode={viewMode} onToggleViewMode={handleToggleViewMode} />

      {/* Simulator Notice Header */}
      <div className="bg-primary/10 border-b border-primary/20 py-2 px-4 text-center text-xs text-primary-soft flex items-center justify-center gap-2">
        <Info size={14} />
        <span>
          Viewing in <strong>Mobile Simulator Mode (390px)</strong> · Responsive mobile touch layout
        </span>
        <button
          onClick={() => handleToggleViewMode('desktop')}
          className="ml-2 px-2.5 py-0.5 bg-primary text-white rounded-pill text-[10px] font-bold hover:bg-primary/90 flex items-center gap-1"
        >
          <Monitor size={11} /> Switch to Desktop Web App
        </button>
      </div>

      {/* Centred Device Bezel Container */}
      <div className="flex-1 flex items-center justify-center p-0 md:p-6">
        <main className="w-full sm:w-[390px] h-screen sm:h-[844px] bg-bg sm:rounded-phone-frame sm:border-[8px] sm:border-[#0C0D14] sm:shadow-2xl overflow-hidden relative flex flex-col">
          {children}
        </main>
      </div>
    </div>
  );
};
