import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppBar } from '../../layouts/AppBar';
import { Pill } from '../../components/primitives/Pill';
import { FieldBlock, FieldGrid } from '../../components/primitives/FieldBlock';
import { Button } from '../../components/primitives/Button';
import { CommuteMap } from '../../components/map/CommuteMap';
import { useAppStore } from '../../store/useAppStore';
import { ShieldAlert, AlertTriangle, PhoneCall, Check, Navigation } from 'lucide-react';

export const ResponderAlert: React.FC = () => {
  const navigate = useNavigate();
  const { activeSOS, acknowledgeSOS } = useAppStore();

  const [acknowledged, setAcknowledged] = useState(false);

  const alertId = activeSOS?.id || 'sos-demo-1';
  const alertLat = activeSOS?.lat || 12.9810;
  const alertLng = activeSOS?.lng || 80.2245;

  const handleAcknowledge = async () => {
    setAcknowledged(true);
    if (activeSOS) {
      await acknowledgeSOS(activeSOS.id);
    }
  };

  const handleCantHelp = () => {
    navigate(-1);
  };

  return (
    <div className="flex-1 flex flex-col font-mono relative bg-bg text-text card-sos-glow">
      <AppBar
        title="Community SOS Responder Alert"
        pill={<Pill variant="danger" label="EMERGENCY BROADCAST" />}
      />

      <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 no-scrollbar">
        {/* Responsive 12-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column (5 cols): Incident Brief, Directives, Actions */}
          <div className="lg:col-span-5 space-y-5">
            {/* Title Banner */}
            <div className="space-y-1">
              <span className="font-label text-danger uppercase tracking-wider text-xs">
                Nearby CommuteCircle Member Needs Help
              </span>
              <h2 className="font-title-m text-white text-xl font-bold">
                Emergency Dispatch Near Velachery Corridor
              </h2>
            </div>

            {/* Safety Warning Notice (PRD §3.9 I6: Call 112 first, do not confront anyone) */}
            <div className="p-4 bg-danger/15 border border-danger/40 rounded-card space-y-2">
              <div className="flex items-center gap-2 text-danger">
                <AlertTriangle size={18} className="shrink-0" />
                <span className="font-label text-danger font-bold text-xs">SAFETY DIRECTIVE</span>
              </div>
              <p className="text-xs text-white leading-relaxed font-semibold">
                Call 112 first. Do not confront anyone. Responding is strictly optional and should never endanger your personal safety.
              </p>
            </div>

            {/* Three Anonymous Field Blocks (UI Spec §10.4: DISTANCE, ETA, MESSAGE) */}
            <div className="p-5 bg-surface rounded-card border border-border space-y-4 shadow-sm">
              <FieldGrid columns={2}>
                <FieldBlock
                  label="DISTANCE"
                  value="850 m"
                  caption="Within 2 km zone"
                />
                <FieldBlock
                  label="ESTIMATED TIME"
                  value="3 min"
                  caption="Via 100ft Road"
                />
              </FieldGrid>

              <FieldBlock
                label="INCIDENT DISPATCH NOTE"
                value="Distress button triggered on corridor"
                caption="Personal identifiers redacted for privacy"
              />
            </div>

            {/* Action Buttons */}
            {acknowledged ? (
              <div className="space-y-3">
                <div className="p-3.5 bg-success/15 border border-success/30 rounded-inner text-success text-xs font-semibold flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Check size={16} /> YOU ACKNOWLEDGED THIS ALERT
                  </span>
                  <span>+2 Trust Earned</span>
                </div>

                <button
                  onClick={() => window.open('tel:112')}
                  className="w-full py-3.5 bg-danger text-white rounded-btn text-xs font-semibold flex items-center justify-center gap-2 shadow-md hover:bg-danger/90 transition-all"
                >
                  <PhoneCall size={16} />
                  <span>Call 112 with Incident Coordinates</span>
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <Button
                  variant="primary"
                  onClick={handleAcknowledge}
                  className="w-full h-14 bg-danger hover:bg-danger/90 text-white font-bold shadow-lg"
                >
                  Acknowledge & View Safe Directions
                </Button>

                <Button
                  variant="secondary"
                  onClick={handleCantHelp}
                  className="w-full text-text-3 hover:text-white"
                >
                  Can't Help Right Now
                </Button>
              </div>
            )}
          </div>

          {/* Right Column (7 cols): Real-Time Incident Map */}
          <div className="lg:col-span-7 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-label text-danger text-xs flex items-center gap-1.5">
                <Navigation size={14} className="animate-spin text-danger" /> INCIDENT LOCATION RADAR
              </span>
              <span className="text-[11px] text-text-3 font-mono">Anonymous Zone</span>
            </div>

            <div className="w-full h-[380px] lg:h-[520px] rounded-card overflow-hidden border border-danger/40 relative shadow-2xl">
              <CommuteMap
                center={[alertLat, alertLng]}
                zoom={15}
                sosAlertLocation={{ lat: alertLat, lng: alertLng, active: true }}
                responders={[{ lat: alertLat + 0.002, lng: alertLng + 0.002, name: 'You (Heading over)' }]}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
