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
        dark: '#1F1B3A',
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
    <div className={`bg-surface rounded-card border border-border p-6 flex flex-col items-center gap-5 shadow-colored ${className}`}>
      {/* QR Code Container */}
      <div className="bg-white p-4 rounded-card border border-border shadow-md flex items-center justify-center">
        {qrDataUrl ? (
          <img
            src={qrDataUrl}
            alt="Journey Pass QR Code"
            className="w-48 sm:w-52 h-48 sm:h-52 object-contain"
          />
        ) : (
          <div className="w-48 sm:w-52 h-48 sm:h-52 flex items-center justify-center text-text-muted text-xs">
            Generating Pass...
          </div>
        )}
      </div>

      {/* Short Code Fallback */}
      <div className="flex flex-col items-center gap-1">
        <span className="text-text-muted text-[11px] font-semibold tracking-wider uppercase">
          Short Code Fallback
        </span>
        <div className="text-text text-2xl sm:text-3xl font-extrabold tracking-[0.2em] pl-[0.2em]">
          {shortCode || 'CC-4821'}
        </div>
      </div>

      {/* 30-Second Refresh Tick Progress Bar */}
      <div className="w-full space-y-1.5 pt-1">
        <div className="flex items-center justify-between text-[11px] font-medium text-text-muted">
          <span className="flex items-center gap-1.5 text-primary font-semibold">
            <RefreshCw size={12} className="animate-spin" />
            <span>AUTO-REFRESH</span>
          </span>
          <span className="text-text font-bold">{secondsLeft}s</span>
        </div>
        <TickProgress
          value={secondsLeft / 30}
          totalTicks={30}
          color="primary"
        />
      </div>
    </div>
  );
};
