import React, { useState, useRef } from 'react';
import { ShieldAlert } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export interface SOSShieldProps {
  className?: string;
  size?: 'normal' | 'large';
}

export const SOSShield: React.FC<SOSShieldProps> = ({
  className = '',
  size = 'normal',
}) => {
  const { triggerSOS } = useAppStore();
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<any>(null);
  const startRef = useRef(0);
  const clickCountRef = useRef(0);
  const clickTimerRef = useRef<any>(null);

  const startHold = () => {
    startRef.current = Date.now();
    timerRef.current = setInterval(() => {
      const elapsed = Date.now() - startRef.current;
      const pct = Math.min(100, (elapsed / 3000) * 100);
      setProgress(pct);

      if (pct >= 100) {
        clearInterval(timerRef.current);
        setProgress(0);
        triggerSOS();
      }
    }, 50);
  };

  const cancelHold = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setProgress(0);
  };

  // PRD §3.7 G5: Triple-tap hidden trigger support
  const handleTripleTap = () => {
    clickCountRef.current += 1;
    if (clickTimerRef.current) clearTimeout(clickTimerRef.current);

    if (clickCountRef.current >= 3) {
      clickCountRef.current = 0;
      triggerSOS();
    } else {
      clickTimerRef.current = setTimeout(() => {
        clickCountRef.current = 0;
      }, 500);
    }
  };

  const dim = size === 'large' ? 'w-20 h-20' : 'w-14 h-14';

  return (
    <div className={`relative flex flex-col items-center ${className}`}>
      <button
        onMouseDown={startHold}
        onMouseUp={cancelHold}
        onMouseLeave={cancelHold}
        onTouchStart={startHold}
        onTouchEnd={cancelHold}
        onClick={handleTripleTap}
        aria-label="Hold for 3 seconds or triple tap to trigger Emergency SOS"
        className={`relative ${dim} rounded-full bg-danger/15 border-[1.5px] border-danger flex items-center justify-center text-danger shadow-xl active:scale-95 transition-all outline-none focus-visible:ring-2 focus-visible:ring-danger`}
      >
        {/* Hold progress ring */}
        {progress > 0 && (
          <svg className="absolute inset-0 w-full h-full -rotate-90">
            <circle
              cx="50%"
              cy="50%"
              r="45%"
              stroke="#E5484D"
              strokeWidth="4"
              fill="transparent"
              strokeDasharray={280}
              strokeDashoffset={280 - (280 * progress) / 100}
              className="transition-all duration-75"
            />
          </svg>
        )}
        <ShieldAlert size={size === 'large' ? 36 : 28} className="animate-pulse" />
      </button>
      <span className="font-label text-[9px] text-danger mt-1 tracking-wider">
        HOLD 3S SOS
      </span>
    </div>
  );
};
