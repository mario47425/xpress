import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { PhoneFrame } from './layouts/PhoneFrame';
import { AppShell } from './layouts/AppShell';
import { AppBar } from './layouts/AppBar';
import { useAppStore } from './store/useAppStore';

export default function App() {
  const { init, activeRole, currentUser } = useAppStore();

  useEffect(() => {
    init();
  }, [init]);

  return (
    <PhoneFrame>
      <AppShell>
        <Routes>
          <Route path="/" element={<Navigate to="/app" replace />} />
          <Route
            path="/app"
            element={
              <div className="flex-1 flex flex-col">
                <AppBar title="Peer Booking" showBack={false} />
                <div className="p-5 space-y-4">
                  <div className="card-glow p-4 rounded-card border border-border">
                    <span className="font-label text-primary-soft">GHOST COMMUTE · TOMORROW</span>
                    <h2 className="font-title-m text-white mt-1">Velachery → IIT Madras</h2>
                    <p className="text-xs text-text-2 mt-1">Tomorrow 08:10 · 3 riders · Rs 28</p>
                  </div>
                  <div className="p-4 bg-surface rounded-card border border-border">
                    <span className="font-label text-success">STATUS</span>
                    <p className="text-sm text-white mt-1">Phase 0 Initialized. Welcome, {currentUser?.name}.</p>
                  </div>
                </div>
              </div>
            }
          />
          <Route
            path="/rider"
            element={
              <div className="flex-1 flex flex-col">
                <AppBar title="Rider Portal" showBack={false} />
                <div className="p-5 space-y-4">
                  <div className="card-glow p-4 rounded-card border border-border">
                    <span className="font-label text-success">TOMORROW · OPEN SEATS</span>
                    <h2 className="font-title-m text-white mt-1">Velachery → Guindy</h2>
                    <p className="text-xs text-text-2 mt-1">08:10 · You can carry 3 · Cost share Rs 84</p>
                  </div>
                  <div className="p-4 bg-surface rounded-card border border-border">
                    <span className="font-label text-primary-soft">ACTIVE DRIVE</span>
                    <p className="text-sm text-white mt-1">Rider portal ready for Phase 1-3 components.</p>
                  </div>
                </div>
              </div>
            }
          />
          <Route path="*" element={<Navigate to={activeRole === 'passenger' ? '/app' : '/rider'} replace />} />
        </Routes>
      </AppShell>
    </PhoneFrame>
  );
}
