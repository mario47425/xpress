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
        title="Community SOS Alert"
        pill={<Pill variant="danger" label="EMERGENCY ALERT" />}
      />

      <div className="flex-1 overflow-y-auto p-5 space-y-5 pb-8 no-scrollbar">
        {/* Caption & Title */}
        <div className="text-center space-y-1">
          <span className="font-label text-danger uppercase tracking-wider text-xs">
            Nearby CommuteCircle Member Needs Help
          </span>
          <h2 className="font-title-m text-white text-lg font-bold">
            Emergency Dispatch Near Velachery
          </h2>
        </div>

        {/* Safety Warning Notice (PRD §3.9 I6: Call 112 first, do not confront anyone) */}
        <div className="p-4 bg-danger/15 border border-danger/40 rounded-card space-y-2">
          <div className="flex items-center gap-2 text-danger">
            <AlertTriangle size={18} className="shrink-0" />
            <span className="font-label text-danger font-bold">SAFETY DIRECTIVE</span>
          </div>
          <p className="text-xs text-white leading-relaxed font-semibold">
            Call 112 first. Do not confront anyone. Responding is strictly optional and should never endanger yourself.
          </p>
        </div>

        {/* Three Anonymous Field Blocks (UI Spec §10.4: DISTANCE, ETA, MESSAGE) */}
        <div className="p-4 bg-surface rounded-card border border-border space-y-4">
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

        {/* Acknowledged State: Live SOS Map & Directions */}
        {acknowledged ? (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div className="p-3 bg-success/15 border border-success/30 rounded-inner text-success text-xs font-semibold flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Check size={16} /> YOU ACKNOWLEDGED THIS ALERT
              </span>
              <span>+2 Trust Earned</span>
            </div>

            <div className="w-full h-52 rounded-card overflow-hidden border border-danger/40 relative shadow-xl">
              <CommuteMap
                center={[alertLat, alertLng]}
                zoom={15}
                sosAlertLocation={{ lat: alertLat, lng: alertLng, active: true }}
                responders={[{ lat: alertLat + 0.002, lng: alertLng + 0.002, name: 'You (Heading over)' }]}
              />
            </div>

            <button
              onClick={() => window.open('tel:112')}
              className="w-full py-3 bg-danger text-white rounded-btn text-xs font-semibold flex items-center justify-center gap-2 shadow-md"
            >
              <PhoneCall size={16} />
              <span>Call 112 with Incident Coordinates</span>
            </button>
          </div>
        ) : (
          <div className="space-y-3 pt-2">
            <Button
              variant="primary"
              onClick={handleAcknowledge}
              className="w-full h-14 bg-danger hover:bg-danger/90 text-white font-bold"
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
    </div>
  );
};
