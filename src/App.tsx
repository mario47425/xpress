import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { PhoneFrame } from './layouts/PhoneFrame';
import { AppShell } from './layouts/AppShell';
import { useAppStore } from './store/useAppStore';

// Peer Booking Portal Screens
import { PeerHome } from './portals/peer/Home';
import { PeerMapPage } from './portals/peer/MapPage';
import { HotspotWaiting } from './portals/peer/HotspotWaiting';
import { PickupQR } from './portals/peer/PickupQR';
import { LiveRide } from './portals/peer/LiveRide';

// Rider Portal Screens
import { RiderHome } from './portals/rider/Home';
import { RiderRoutePage } from './portals/rider/RoutePage';
import { RiderScanner } from './portals/rider/Scanner';
import { ActiveDrive } from './portals/rider/ActiveDrive';

export default function App() {
  const { init, activeRole } = useAppStore();

  useEffect(() => {
    init();
  }, [init]);

  return (
    <PhoneFrame>
      <AppShell>
        <Routes>
          <Route path="/" element={<Navigate to="/app" replace />} />

          {/* Peer Booking Portal (/app) */}
          <Route path="/app" element={<PeerHome />} />
          <Route path="/app/map" element={<PeerMapPage />} />
          <Route path="/app/waiting/:hotspotId" element={<HotspotWaiting />} />
          <Route path="/app/pickup-qr" element={<PickupQR />} />
          <Route path="/app/live-ride/:rideId" element={<LiveRide />} />
          <Route path="/app/live-ride" element={<LiveRide />} />

          {/* Rider Portal (/rider) */}
          <Route path="/rider" element={<RiderHome />} />
          <Route path="/rider/route" element={<RiderRoutePage />} />
          <Route path="/rider/scanner" element={<RiderScanner />} />
          <Route path="/rider/active-drive/:rideId" element={<ActiveDrive />} />
          <Route path="/rider/active-drive" element={<ActiveDrive />} />

          {/* Notifications Utility Screen */}
          <Route
            path="/notifications"
            element={
              <div className="flex-1 p-5 space-y-4 font-mono">
                <h2 className="font-title-m text-white text-base">In-App SMS & Alerts Log</h2>
                <div className="space-y-2">
                  <div className="p-3 bg-surface rounded-inner border border-border text-xs space-y-1">
                    <div className="flex justify-between text-text-3">
                      <span>SMS GATEWAY (SANDBOX)</span>
                      <span>123456</span>
                    </div>
                    <p className="text-white font-medium">OTP: 123456 is your verification code for CommuteCircle.</p>
                  </div>
                  <div className="p-3 bg-surface rounded-inner border border-border text-xs space-y-1">
                    <div className="flex justify-between text-text-3">
                      <span>SYSTEM</span>
                      <span>Now</span>
                    </div>
                    <p className="text-white font-medium">Ghost Commute match found for tomorrow 08:10 Velachery corridor.</p>
                  </div>
                </div>
              </div>
            }
          />

          {/* Fallback */}
          <Route
            path="*"
            element={<Navigate to={activeRole === 'passenger' ? '/app' : '/rider'} replace />}
          />
        </Routes>
      </AppShell>
    </PhoneFrame>
  );
}
