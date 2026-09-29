import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { TickProgress } from './TickProgress';
import { RefreshCw } from 'lucide-react';

export interface QRCardProps {
  jwtToken: string;
  shortCode: string;
  onRefresh?: () => void;
  className?: string;
}

export const QRCard: React.FC<QRCardProps> = ({
  jwtToken,
  shortCode,
  onRefresh,
  className = '',
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [secondsLeft, setSecondsLeft] = useState(30);

  // Generate QR code data URL
  useEffect(() => {
    if (!jwtToken) return;
    QRCode.toDataURL(jwtToken, {
      margin: 1,
      width: 240,
      color: {
        dark: '#0A0B1E',
        light: '#FFFFFF',
      },
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error('QR generation error', err));
  }, [jwtToken]);

  // 30-second countdown for QR refresh (UI Spec §6.15 & PRD §4.2)
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          if (onRefresh) onRefresh();
          return 30;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onRefresh]);

  return (
    <div className={`card-glow rounded-card border border-border p-6 flex flex-col items-center gap-5 font-mono shadow-2xl ${className}`}>
      {/* Dedicated White QR Surface Tile (The ONLY white surface in the app) */}
      <div className="bg-white p-4 rounded-[20px] shadow-lg flex items-center justify-center">
        {qrDataUrl ? (
          <img
            src={qrDataUrl}
            alt="Journey Pass QR Code"
            className="w-52 h-52 object-contain"
          />
        ) : (
          <div className="w-52 h-52 flex items-center justify-center text-bg text-xs">
            Generating Pass...
          </div>
        )}
      </div>

      {/* Short Code Fallback */}
      <div className="flex flex-col items-center gap-1">
        <span className="font-label text-text-3 text-[11px] tracking-wider uppercase">
          Short Code Fallback
        </span>
        <div className="font-display-l text-white text-3xl font-bold tracking-[0.25em] pl-[0.25em]">
          {shortCode || 'CC-4821'}
        </div>
      </div>

      {/* 30-Second Refresh Tick Progress Bar */}
      <div className="w-full space-y-1.5 pt-1">
        <div className="flex items-center justify-between text-[11px] font-mono text-text-2">
          <span className="flex items-center gap-1.5 text-primary-soft">
            <RefreshCw size={12} className="animate-spin" />
            <span>AUTO-REFRESH</span>
          </span>
          <span className="text-white">{secondsLeft}s</span>
        </div>
        <TickProgress
          value={secondsLeft / 30}
          totalTicks={30}
          color="white"
        />
      </div>
    </div>
  );
};
