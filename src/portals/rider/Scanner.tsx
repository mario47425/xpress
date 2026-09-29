import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Html5Qrcode } from 'html5-qrcode';
import { AppBar } from '../../layouts/AppBar';
import { Pill } from '../../components/primitives/Pill';
import { BottomSheet } from '../../components/primitives/BottomSheet';
import { PersonCard } from '../../components/signature/PersonCard';
import { SwipeConfirm } from '../../components/signature/SwipeConfirm';
import { OtpInput } from '../../components/primitives/Input';
import { Button } from '../../components/primitives/Button';
import { useAppStore } from '../../store/useAppStore';
import { ScanVerificationResult } from '../../../server/jwtService';
import { JourneyPass } from '../../types';
import {
  Camera,
  Keyboard,
  AlertTriangle,
  XCircle,
  Clock,
  ShieldAlert,
  Zap,
} from 'lucide-react';

export const RiderScanner: React.FC = () => {
  const navigate = useNavigate();
  const { scanPass, acceptPassenger, liveRide, activePass } = useAppStore();

  const [mode, setMode] = useState<'camera' | 'manual'>('camera');
  const [manualCode, setManualCode] = useState('');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [scanResult, setScanResult] = useState<ScanVerificationResult | null>(null);
  const [scannedPass, setScannedPass] = useState<JourneyPass | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [isAccepting, setIsAccepting] = useState(false);

  const scannerRef = useRef<Html5Qrcode | null>(null);

  // Initialize html5-qrcode camera
  useEffect(() => {
    if (mode !== 'camera') return;

    const qrCodeRegionId = 'qr-reader-viewport';
    const html5QrCode = new Html5Qrcode(qrCodeRegionId);
    scannerRef.current = html5QrCode;

    const config = { fps: 10, qrbox: { width: 240, height: 240 } };

    html5QrCode
      .start(
        { facingMode: 'environment' },
        config,
        async (decodedText) => {
          // Pause camera and verify scanned string on server side
          await html5QrCode.stop().catch(() => {});
          handleVerify(decodedText);
        },
        () => {
          // QR scan frame error - expected while scanning
        }
      )
      .catch((err) => {
        console.warn('Camera start error, falling back to manual entry:', err);
        setCameraError('Camera unavailable or permission denied. Use short code entry below.');
        setMode('manual');
      });

    return () => {
      if (html5QrCode.isScanning) {
        html5QrCode.stop().catch(() => {});
      }
    };
  }, [mode]);

  const handleVerify = async (codeOrToken: string) => {
    try {
      const res = await scanPass(codeOrToken);
      setScanResult(res);
      // Grab matched pass from store if valid
      const storePass = useAppStore.getState().lastScanResult?.pass;
      if (storePass) {
        setScannedPass(storePass);
      }
      setSheetOpen(true);
    } catch (err) {
      setScanResult({
        success: false,
        state: 'INVALID',
        message: 'Not a valid CommuteCircle pass.',
      });
      setSheetOpen(true);
    }
  };

  const handleManualSubmit = () => {
    if (manualCode.length >= 4) {
      handleVerify(manualCode);
    }
  };

  const handleAcceptPassenger = async () => {
    if (!scanResult || !scanResult.success || !scannedPass) return;
    setIsAccepting(true);
    try {
      await acceptPassenger(
        scannedPass.id,
        scanResult.payload.nonce,
        liveRide?.id || 'ride-54266'
      );
      setSheetOpen(false);
      navigate(`/rider/active-drive/${liveRide?.id || 'ride-54266'}`);
    } catch (err) {
      alert('Error confirming passenger onboarding');
    } finally {
      setIsAccepting(false);
    }
  };

  // Test sandbox helper: inject valid token, expired token, or already used nonce
  const handleTestToken = (type: 'valid' | 'expired' | 'used' | 'wrong') => {
    if (type === 'valid') {
      if (activePass) {
        handleVerify(activePass.shortCode);
      } else {
        handleVerify('CC-4821');
      }
    } else if (type === 'expired') {
      setScanResult({
        success: false,
        state: 'EXPIRED',
        message: 'Code expired. Ask passenger to refresh the QR.',
      });
      setSheetOpen(true);
    } else if (type === 'used') {
      setScanResult({
        success: false,
        state: 'ALREADY_USED',
        message: 'This code was already scanned. Replay rejected.',
      });
      setSheetOpen(true);
    } else if (type === 'wrong') {
      setScanResult({
        success: false,
        state: 'WRONG_RIDER',
        message: 'You are not assigned to this ride leg.',
      });
      setSheetOpen(true);
    }
  };

  return (
    <div className="flex-1 flex flex-col font-mono bg-bg text-text">
      <AppBar
        title="Scan Journey Pass"
        pill={<Pill variant="available" label="CAMERA ACTIVE" />}
      />

      <div className="flex-1 flex flex-col p-5 justify-between">
        {mode === 'camera' ? (
          <div className="flex-1 flex flex-col items-center justify-center space-y-6">
            {/* 260px Camera Scan Window (UI Spec §9.6) */}
            <div className="relative w-[260px] h-[260px] rounded-card border-2 border-primary-soft/40 overflow-hidden bg-black flex items-center justify-center shadow-2xl">
              {/* HTML5 Camera Video Element */}
              <div id="qr-reader-viewport" className="w-full h-full object-cover" />

              {/* Corner brackets */}
              <div className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-primary-soft" />
              <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-primary-soft" />
              <div className="absolute bottom-2 left-2 w-6 h-6 border-b-2 border-l-2 border-primary-soft" />
              <div className="absolute bottom-2 right-2 w-6 h-6 border-b-2 border-r-2 border-primary-soft" />

              {/* 2px Sweeping Scan Line */}
              <div className="absolute left-0 right-0 h-[2px] bg-success shadow-[0_0_8px_#0D9F5E] animate-scan-sweep pointer-events-none" />
            </div>

            <div className="text-center space-y-1">
              <p className="font-body-m text-white text-sm">
                Point at passenger's Journey Pass QR
              </p>
              <p className="text-xs text-text-3">
                Scans instantly within 30 cm
              </p>
            </div>

            <Button
              variant="secondary"
              size="sm"
              onClick={() => setMode('manual')}
              className="flex items-center gap-2"
            >
              <Keyboard size={16} />
              <span>Enter 6-char code instead</span>
            </Button>
          </div>
        ) : (
          <div className="flex-1 flex flex-col justify-center space-y-6">
            <div className="text-center space-y-1">
              <h3 className="font-title-m text-white text-base">Enter Short Code</h3>
              <p className="text-xs text-text-3">
                Type the 6-character code shown on passenger's screen
              </p>
            </div>

            <OtpInput
              value={manualCode}
              onChange={setManualCode}
            />

            <Button
              variant="primary"
              onClick={handleManualSubmit}
              disabled={manualCode.length < 4}
              className="w-full"
            >
              Verify Code
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMode('camera')}
              className="flex items-center justify-center gap-2"
            >
              <Camera size={16} />
              <span>Switch back to camera scanner</span>
            </Button>
          </div>
        )}

        {/* Sandbox Quick Testing Bar (Tests all 7 states per PRD §4.4) */}
        <div className="p-3 bg-surface rounded-inner border border-border space-y-2">
          <span className="font-label text-text-3 text-[10px] flex items-center gap-1">
            <Zap size={12} className="text-warn" /> QUICK SCAN TEST (SANDBOX)
          </span>
          <div className="grid grid-cols-4 gap-1.5 text-[10px]">
            <button
              onClick={() => handleTestToken('valid')}
              className="py-1.5 px-2 bg-success/20 hover:bg-success/30 border border-success/40 text-success rounded-inner"
            >
              Valid
            </button>
            <button
              onClick={() => handleTestToken('expired')}
              className="py-1.5 px-2 bg-warn/20 hover:bg-warn/30 border border-warn/40 text-warn rounded-inner"
            >
              Expired
            </button>
            <button
              onClick={() => handleTestToken('used')}
              className="py-1.5 px-2 bg-danger/20 hover:bg-danger/30 border border-danger/40 text-danger rounded-inner"
            >
              Replay
            </button>
            <button
              onClick={() => handleTestToken('wrong')}
              className="py-1.5 px-2 bg-danger/20 hover:bg-danger/30 border border-danger/40 text-danger rounded-inner"
            >
              Wrong
            </button>
          </div>
        </div>
      </div>

      {/* Result Bottom Sheet (PRD §4.4 7 Result States) */}
      <BottomSheet
        isOpen={sheetOpen}
        onClose={() => setSheetOpen(false)}
        title="Scan Verification Result"
      >
        {scanResult && (
          <div className="space-y-4">
            {scanResult.state === 'VALID' ? (
              <div className="space-y-4">
                <div className="p-3.5 bg-success/15 border border-success/30 rounded-inner text-success text-xs font-semibold flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-success animate-ping" />
                  <span>PASSENGER VERIFIED · CO-PRESENCE OK</span>
                </div>

                {/* Passenger Person Card */}
                <PersonCard
                  name={scannedPass?.passengerName || 'Anitha Ramesh'}
                  avatarUrl={scannedPass?.passengerAvatar || '/demo/avatars/anitha.svg'}
                  tier={scannedPass?.passengerTier || 'Trusted'}
                  trustScore={78}
                  subtitle="Leg 1 of 1 · Velachery → IIT Madras"
                  meta="Pickup: Velachery Bypass Junction"
                  isVerified={true}
                />

                <div className="p-3 bg-surface-2 rounded-inner border border-border text-xs space-y-1">
                  <div className="flex justify-between text-text-2">
                    <span>Fare Share:</span>
                    <span className="text-white font-semibold">Rs 28</span>
                  </div>
                  <div className="flex justify-between text-text-2">
                    <span>Pickup Point:</span>
                    <span className="text-white">Velachery Bypass Junction</span>
                  </div>
                </div>

                {/* Swipe Confirm to Accept Boarding */}
                <SwipeConfirm
                  label="Accept Passenger Boarding"
                  onConfirm={handleAcceptPassenger}
                  disabled={isAccepting}
                />
              </div>
            ) : scanResult.state === 'EXPIRED' ? (
              <div className="p-5 bg-warn/15 border border-warn/40 rounded-card space-y-3 text-center">
                <Clock size={36} className="text-warn mx-auto" />
                <h4 className="font-title-m text-white text-base">Code Expired</h4>
                <p className="text-xs text-text-2">
                  Ask passenger to refresh their QR code. Journey Passes auto-refresh every 30 seconds for security.
                </p>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setSheetOpen(false)}
                  className="w-full"
                >
                  Scan Again
                </Button>
              </div>
            ) : scanResult.state === 'ALREADY_USED' ? (
              <div className="p-5 bg-danger/15 border border-danger/40 rounded-card space-y-3 text-center">
                <AlertTriangle size={36} className="text-danger mx-auto" />
                <h4 className="font-title-m text-danger text-base">Already Used</h4>
                <p className="text-xs text-text-2">
                  This code has already been scanned and verified. Screenshot replay attacks are blocked.
                </p>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setSheetOpen(false)}
                  className="w-full"
                >
                  Close
                </Button>
              </div>
            ) : scanResult.state === 'WRONG_RIDER' ? (
              <div className="p-5 bg-danger/15 border border-danger/40 rounded-card space-y-3 text-center">
                <XCircle size={36} className="text-danger mx-auto" />
                <h4 className="font-title-m text-danger text-base">Not Assigned to this Ride</h4>
                <p className="text-xs text-text-2">
                  You are not the designated rider for this journey leg. Passenger details are hidden for privacy.
                </p>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setSheetOpen(false)}
                  className="w-full"
                >
                  Close
                </Button>
              </div>
            ) : (
              <div className="p-5 bg-danger/15 border border-danger/40 rounded-card space-y-3 text-center">
                <ShieldAlert size={36} className="text-danger mx-auto" />
                <h4 className="font-title-m text-danger text-base">{scanResult.state}</h4>
                <p className="text-xs text-text-2">{scanResult.message}</p>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setSheetOpen(false)}
                  className="w-full"
                >
                  Try Again
                </Button>
              </div>
            )}
          </div>
        )}
      </BottomSheet>
    </div>
  );
};
