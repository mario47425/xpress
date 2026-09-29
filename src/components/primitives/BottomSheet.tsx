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
  maxHeight = 'max-h-[85vh]',
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
        className="fixed inset-0 bg-[#1F1B3A]/40 backdrop-blur-sm transition-opacity duration-200"
      />

      {/* Sheet Content */}
      <div
        className={`relative w-full max-w-2xl mx-auto bg-surface rounded-t-[28px] border-t border-border shadow-colored-lg z-10 flex flex-col ${maxHeight} animate-in slide-in-from-bottom duration-200 overflow-hidden pb-[calc(1rem+env(safe-area-inset-bottom,0px))]`}
      >
        {/* Grab Handle */}
        <div className="w-full flex items-center justify-center pt-3 pb-2 cursor-grab">
          <div className="w-10 h-1.5 rounded-full bg-border" />
        </div>

        {/* Header if title exists */}
        {title && (
          <div className="flex items-center justify-between px-5 sm:px-6 pb-3 border-b border-border">
            <h3 className="text-text text-base sm:text-lg font-bold truncate pr-3">{title}</h3>
            <button
              onClick={onClose}
              aria-label="Close sheet"
              className="min-w-[44px] min-h-[44px] rounded-button bg-surface-2 flex items-center justify-center text-text-muted hover:text-text transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        )}

        {/* Scrollable Children */}
        <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-4 space-y-4 no-scrollbar">{children}</div>
      </div>
    </div>
  );
};
