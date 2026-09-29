import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  maxHeight?: string;
}

export const BottomSheet: React.FC<BottomSheetProps> = ({
  isOpen,
  onClose,
  title,
  children,
  maxHeight = 'max-h-[85%]',
}) => {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-[#05060F]/60 backdrop-blur-sm transition-opacity duration-200"
      />

      {/* Sheet Content */}
      <div
        className={`relative w-full bg-surface rounded-t-[28px] border-t border-border shadow-[0_-12px_40px_rgba(0,0,0,0.45)] z-10 flex flex-col ${maxHeight} animate-in slide-in-from-bottom duration-220 overflow-hidden font-mono`}
      >
        {/* Grab Handle */}
        <div className="w-full flex items-center justify-center pt-3 pb-2 cursor-grab">
          <div className="w-9 h-1 rounded-full bg-border" />
        </div>

        {/* Header if title exists */}
        {title && (
          <div className="flex items-center justify-between px-6 pb-3 border-b border-border/50">
            <h3 className="font-title-m text-white text-base font-semibold">{title}</h3>
            <button
              onClick={onClose}
              aria-label="Close sheet"
              className="w-8 h-8 rounded-inner bg-surface-2 flex items-center justify-center text-text-3 hover:text-white transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* Scrollable Children */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar">{children}</div>
      </div>
    </div>
  );
};
