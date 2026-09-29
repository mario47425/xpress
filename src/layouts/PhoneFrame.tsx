import React from 'react';
import { DesktopNavBar } from './DesktopNavBar';

interface PhoneFrameProps {
  children: React.ReactNode;
}

export const PhoneFrame: React.FC<PhoneFrameProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-bg text-text font-sans flex flex-col w-full selection:bg-primary-soft selection:text-white">
      {/* Sticky Compact Header (56px mobile, 64px desktop) */}
      <DesktopNavBar />

      {/* Main Full-Width Responsive Canvas */}
      <main className="flex-1 w-full flex flex-col">
        {children}
      </main>

      {/* Modern Clean Footer */}
      <footer className="border-t border-border py-4 px-4 sm:px-6 text-xs text-text-muted font-sans bg-surface mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5">
          <div className="flex items-center gap-2.5">
            <img src="/logo.png" alt="CommuteCircle" className="w-5 h-5 object-contain" />
            <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span className="text-text font-medium">
              CommuteCircle Chennai · Verified Peer Transit Network
            </span>
          </div>
          <div className="text-[11px] text-text-muted font-medium">
            Velachery ⇄ IIT Madras ⇄ OMR · Statutory Cost-Sharing
          </div>
        </div>
      </footer>
    </div>
  );
};
