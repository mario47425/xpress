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
import { RelayPlanner } from './portals/peer/RelayPlanner';
import { PeerPodsPage } from './portals/peer/PodsPage';
import { PeerTrustProfile } from './portals/peer/TrustProfile';
import { PeerWalletPage } from './portals/peer/WalletPage';

// Rider Portal Screens
import { RiderHome } from './portals/rider/Home';
import { RiderRoutePage } from './portals/rider/RoutePage';
import { RiderScanner } from './portals/rider/Scanner';
import { ActiveDrive } from './portals/rider/ActiveDrive';
import { RiderHandoff } from './portals/rider/Handoff';
import { RiderPodsPage } from './portals/rider/PodsPage';
import { RiderTrustProfile } from './portals/rider/TrustProfile';
import { RiderCostRecovery } from './portals/rider/CostRecovery';
import { RequestsInbox } from './portals/rider/RequestsInbox';

// Shared Safety, Verification & Moderator Screens
import { SOSActive } from './portals/shared/SOSActive';
import { ResponderAlert } from './portals/shared/ResponderAlert';
import { SafetyCentre } from './portals/shared/SafetyCentre';
import { ModeratorQueue } from './portals/shared/ModeratorQueue';
import { Onboarding } from './portals/shared/Onboarding';

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
          <Route path="/app/relay" element={<RelayPlanner />} />
          <Route path="/app/pods" element={<PeerPodsPage />} />
          <Route path="/app/profile" element={<PeerTrustProfile />} />
          <Route path="/app/wallet" element={<PeerWalletPage />} />

          {/* Rider Portal (/rider) */}
          <Route path="/rider" element={<RiderHome />} />
          <Route path="/rider/route" element={<RiderRoutePage />} />
          <Route path="/rider/scanner" element={<RiderScanner />} />
          <Route path="/rider/active-drive/:rideId" element={<ActiveDrive />} />
          <Route path="/rider/active-drive" element={<ActiveDrive />} />
          <Route path="/rider/handoff" element={<RiderHandoff />} />
          <Route path="/rider/pods" element={<RiderPodsPage />} />
          <Route path="/rider/profile" element={<RiderTrustProfile />} />
          <Route path="/rider/cost-recovery" element={<RiderCostRecovery />} />
          <Route path="/rider/requests" element={<RequestsInbox />} />

          {/* Shared Safety, Emergency SOS & Onboarding */}
          <Route path="/safety" element={<SafetyCentre />} />
          <Route path="/sos/active" element={<SOSActive />} />
          <Route path="/sos/responder" element={<ResponderAlert />} />
          <Route path="/moderator" element={<ModeratorQueue />} />
          <Route path="/onboarding" element={<Onboarding />} />

          {/* Notifications Utility Screen */}
          <Route
            path="/notifications"
            element={
              <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto w-full space-y-4">
                <h2 className="font-title-m text-text text-xl font-bold">In-App SMS & Alerts Log</h2>
                <div className="space-y-3">
                  <div className="p-4 bg-surface rounded-card border border-border text-xs space-y-1.5 shadow-card">
                    <div className="flex justify-between text-text-muted text-[11px] font-semibold">
                      <span className="text-primary font-bold">SMS GATEWAY (SANDBOX)</span>
                      <span>123456</span>
                    </div>
                    <p className="text-text font-medium text-sm">OTP: 123456 is your verification code for CommuteCircle.</p>
                  </div>
                  <div className="p-4 bg-surface rounded-card border border-border text-xs space-y-1.5 shadow-card">
                    <div className="flex justify-between text-text-muted text-[11px] font-semibold">
                      <span className="text-primary font-bold">SYSTEM</span>
                      <span>Now</span>
                    </div>
                    <p className="text-text font-medium text-sm">Ghost Commute match found for tomorrow 08:10 Velachery corridor.</p>
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
