import React, { useState, useRef } from 'react';
import { ChevronsRight } from 'lucide-react';

export interface SwipeConfirmProps {
  label: string;
  onConfirm: () => void;
  className?: string;
  disabled?: boolean;
}

export const SwipeConfirm: React.FC<SwipeConfirmProps> = ({
  label,
  onConfirm,
  className = '',
  disabled = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [completed, setCompleted] = useState(false);

  const startXRef = useRef(0);

  const handleStart = (clientX: number) => {
    if (disabled || completed) return;
    setIsDragging(true);
    startXRef.current = clientX;
  };

  const handleMove = (clientX: number) => {
    if (!isDragging || disabled || completed) return;
    const delta = clientX - startXRef.current;
    if (!containerRef.current) return;
    const maxDrag = containerRef.current.clientWidth - 56; // width minus handle width (48+8)
    const clamped = Math.max(0, Math.min(delta, maxDrag));
    setDragOffset(clamped);
  };

  const handleEnd = () => {
    if (!isDragging || disabled || completed) return;
    setIsDragging(false);
    if (!containerRef.current) return;
    const maxDrag = containerRef.current.clientWidth - 56;
    if (dragOffset >= maxDrag * 0.85) {
      // Trigger threshold passed!
      setCompleted(true);
      setDragOffset(maxDrag);
      // Haptic pulse if supported
      if (navigator.vibrate) navigator.vibrate(80);
      onConfirm();
    } else {
      // Spring back
      setDragOffset(0);
    }
  };

  return (
    <div className={`relative w-full h-14 font-mono select-none ${className}`}>
      {/* Visual Swipe Track */}
      <div
        ref={containerRef}
        className={`w-full h-full rounded-btn bg-primary overflow-hidden flex items-center justify-center shadow-[0_8px_24px_rgba(40,58,175,0.35)] relative ${
          disabled ? 'opacity-40 pointer-events-none' : ''
        }`}
        onMouseMove={(e) => handleMove(e.clientX)}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
        onTouchMove={(e) => handleMove(e.touches[0].clientX)}
        onTouchEnd={handleEnd}
      >
        {/* Centred Label */}
        <span className="font-body-l text-white font-medium text-sm sm:text-base pointer-events-none tracking-wide">
          {completed ? 'Confirmed ✓' : label}
        </span>

        {/* Drag Handle: 44x44 translucent white box with >>> chevrons */}
        <div
          onMouseDown={(e) => handleStart(e.clientX)}
          onTouchStart={(e) => handleStart(e.touches[0].clientX)}
          style={{ transform: `translateX(${dragOffset}px)` }}
          className={`absolute left-1.5 w-11 h-11 rounded-inner bg-white/25 backdrop-blur-md border border-white/40 flex items-center justify-center text-white cursor-grab active:cursor-grabbing transition-transform ${
            isDragging ? '' : 'transition-all duration-200'
          }`}
        >
          <ChevronsRight size={22} className="text-white" />
        </div>
      </div>

      {/* Accessible Screen-reader / Keyboard Alternative (UI Spec §6.9 & §12) */}
      <button
        type="button"
        onClick={() => {
          setCompleted(true);
          onConfirm();
        }}
        className="sr-only focus:not-sr-only focus:absolute focus:inset-0 focus:z-20 focus:bg-primary focus:text-white focus:rounded-btn focus:font-semibold"
      >
        {label} (Press Enter to Confirm)
      </button>
    </div>
  );
};
