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
          await html5QrCode.stop().catch(() => {});
          handleVerify(decodedText);
        },
        () => {}
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

  // Test sandbox helper
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
    <div className="flex-1 flex flex-col bg-bg text-text">
      <AppBar
        title="Scan Journey Pass"
        pill={<Pill variant="available" label="CAMERA ACTIVE" />}
      />

      <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 flex flex-col items-center justify-center no-scrollbar">
        <div className="w-full max-w-xl space-y-6">
          <div className="text-center space-y-1">
            <span className="text-primary font-bold text-xs uppercase tracking-wider">
              HOTSPOT HANDSHAKE VERIFICATION
            </span>
            <h2 className="text-text text-xl sm:text-2xl font-extrabold tracking-tight">
              Scan Passenger Pass
            </h2>
            <p className="text-xs sm:text-sm text-text-muted">
              Verifies co-presence and burns single-use cryptographic token
            </p>
          </div>

          {mode === 'camera' ? (
            <div className="flex flex-col items-center justify-center space-y-5 bg-surface p-6 rounded-card border border-border shadow-colored">
              {/* 260px Camera Scan Window */}
              <div className="relative w-[260px] h-[260px] rounded-card border-2 border-primary/40 overflow-hidden bg-black flex items-center justify-center shadow-lg">
                <div id="qr-reader-viewport" className="w-full h-full object-cover" />
                <div className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-primary" />
                <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-primary" />
                <div className="absolute bottom-2 left-2 w-6 h-6 border-b-2 border-l-2 border-primary" />
                <div className="absolute bottom-2 right-2 w-6 h-6 border-b-2 border-r-2 border-primary" />
                <div className="absolute left-0 right-0 h-[2px] bg-primary shadow-[0_0_8px_#7C3AED] animate-scan-sweep pointer-events-none" />
              </div>

              <div className="text-center space-y-1">
                <p className="text-text text-sm sm:text-base font-bold">
                  Point at passenger's Journey Pass QR
                </p>
                <p className="text-xs text-text-muted">
                  Scans instantly within 30 cm distance
                </p>
              </div>

              <Button
                variant="secondary"
                size="default"
                onClick={() => setMode('manual')}
                className="flex items-center gap-2"
              >
                <Keyboard size={16} />
                <span>Enter 6-char code instead</span>
              </Button>
            </div>
          ) : (
            <div className="flex flex-col justify-center space-y-5 bg-surface p-6 rounded-card border border-border shadow-colored">
              <div className="text-center space-y-1">
                <h3 className="text-text text-base sm:text-lg font-bold">Enter 6-Char Short Code</h3>
                <p className="text-xs text-text-muted">
                  Type the alphanumeric code shown under passenger's QR card
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
                className="w-full text-xs sm:text-sm font-bold min-h-[44px]"
              >
                Verify Code
              </Button>

              <Button
                variant="ghost"
                size="default"
                onClick={() => setMode('camera')}
                className="flex items-center justify-center gap-2 text-xs font-bold"
              >
                <Camera size={16} />
                <span>Switch back to camera scanner</span>
              </Button>
            </div>
          )}

          {/* Sandbox Quick Testing Bar */}
          <div className="p-4 bg-surface rounded-card border border-border space-y-2.5 shadow-sm">
            <span className="text-text-muted font-bold text-[10px] uppercase tracking-wider flex items-center gap-1">
              <Zap size={14} className="text-accent" /> QUICK SCAN TEST (SANDBOX 7-STATE VERIFIER)
            </span>
            <div className="grid grid-cols-4 gap-2 text-xs">
              <button
                onClick={() => handleTestToken('valid')}
                className="min-h-[44px] py-2 px-2 bg-success/15 hover:bg-success/25 border border-success/30 text-success rounded-button font-bold text-center transition-all active:scale-95"
              >
                Valid
              </button>
              <button
                onClick={() => handleTestToken('expired')}
                className="min-h-[44px] py-2 px-2 bg-accent/15 hover:bg-accent/25 border border-accent/30 text-accent rounded-button font-bold text-center transition-all active:scale-95"
              >
                Expired
              </button>
              <button
                onClick={() => handleTestToken('used')}
                className="min-h-[44px] py-2 px-2 bg-danger/15 hover:bg-danger/25 border border-danger/30 text-danger rounded-button font-bold text-center transition-all active:scale-95"
              >
                Replay
              </button>
              <button
                onClick={() => handleTestToken('wrong')}
                className="min-h-[44px] py-2 px-2 bg-danger/15 hover:bg-danger/25 border border-danger/30 text-danger rounded-button font-bold text-center transition-all active:scale-95"
              >
                Wrong
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Result Bottom Sheet */}
      <BottomSheet
        isOpen={sheetOpen}
        onClose={() => setSheetOpen(false)}
        title="Scan Verification Result"
      >
        {scanResult && (
          <div className="space-y-4">
            {scanResult.state === 'VALID' ? (
              <div className="space-y-4">
                <div className="p-3.5 bg-success/15 border border-success/30 rounded-card text-success text-xs sm:text-sm font-bold flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-success animate-ping" />
                  <span>PASSENGER VERIFIED · CO-PRESENCE OK</span>
                </div>

                <PersonCard
                  name={scannedPass?.passengerName || 'Anitha Ramesh'}
                  avatarUrl={scannedPass?.passengerAvatar || '/demo/avatars/anitha.svg'}
                  tier={scannedPass?.passengerTier || 'Trusted'}
                  trustScore={78}
                  subtitle="Leg 1 of 1 · Velachery → IIT Madras"
                  meta="Pickup: Velachery Bypass Junction"
                  isVerified={true}
                />

                <div className="p-3.5 bg-surface-2 rounded-card border border-border text-xs sm:text-sm space-y-1.5">
                  <div className="flex justify-between text-text-muted">
                    <span className="font-medium">Fare Share:</span>
                    <span className="text-text font-bold">Rs 28</span>
                  </div>
                  <div className="flex justify-between text-text-muted">
                    <span className="font-medium">Pickup Point:</span>
                    <span className="text-text font-bold">Velachery Bypass Junction</span>
                  </div>
                </div>

                <SwipeConfirm
                  label="Accept Passenger Boarding"
                  onConfirm={handleAcceptPassenger}
                  disabled={isAccepting}
                />
              </div>
            ) : scanResult.state === 'EXPIRED' ? (
              <div className="p-5 bg-accent/10 border border-accent/30 rounded-card space-y-3 text-center">
                <Clock size={36} className="text-accent mx-auto" />
                <h4 className="text-text text-base sm:text-lg font-bold">Code Expired</h4>
                <p className="text-xs sm:text-sm text-text-muted">
                  Ask passenger to refresh their QR code. Journey Passes auto-refresh every 30 seconds for security.
                </p>
                <Button
                  variant="secondary"
                  size="default"
                  onClick={() => setSheetOpen(false)}
                  className="w-full"
                >
                  Scan Again
                </Button>
              </div>
            ) : scanResult.state === 'ALREADY_USED' ? (
              <div className="p-5 bg-danger/10 border border-danger/30 rounded-card space-y-3 text-center">
                <AlertTriangle size={36} className="text-danger mx-auto" />
                <h4 className="text-danger text-base sm:text-lg font-bold">Already Used</h4>
                <p className="text-xs sm:text-sm text-text-muted">
                  This code has already been scanned and verified. Screenshot replay attacks are blocked.
                </p>
                <Button
                  variant="secondary"
                  size="default"
                  onClick={() => setSheetOpen(false)}
                  className="w-full"
                >
                  Close
                </Button>
              </div>
            ) : scanResult.state === 'WRONG_RIDER' ? (
              <div className="p-5 bg-danger/10 border border-danger/30 rounded-card space-y-3 text-center">
                <XCircle size={36} className="text-danger mx-auto" />
                <h4 className="text-danger text-base sm:text-lg font-bold">Not Assigned to this Ride</h4>
                <p className="text-xs sm:text-sm text-text-muted">
                  You are not the designated rider for this journey leg. Passenger details are hidden for privacy.
                </p>
                <Button
                  variant="secondary"
                  size="default"
                  onClick={() => setSheetOpen(false)}
                  className="w-full"
                >
                  Close
                </Button>
              </div>
            ) : (
              <div className="p-5 bg-danger/10 border border-danger/30 rounded-card space-y-3 text-center">
                <ShieldAlert size={36} className="text-danger mx-auto" />
                <h4 className="text-danger text-base sm:text-lg font-bold">{scanResult.state}</h4>
                <p className="text-xs sm:text-sm text-text-muted">{scanResult.message}</p>
                <Button
                  variant="secondary"
                  size="default"
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
