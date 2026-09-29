import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Bell } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

interface AppBarProps {
  title?: string;
  pill?: React.ReactNode;
  showBack?: boolean;
  onBack?: () => void;
  rightAction?: React.ReactNode;
}

export const AppBar: React.FC<AppBarProps> = ({
  title,
  pill,
  showBack = true,
  onBack,
  rightAction,
}) => {
  const navigate = useNavigate();
  const { activeRole, switchRole } = useAppStore();

  const handleRoleToggle = () => {
    const nextRole = activeRole === 'passenger' ? 'rider' : 'passenger';
    switchRole(nextRole);
    navigate(nextRole === 'passenger' ? '/app' : '/rider');
  };

  // If this is a top-level home view without title and without back button, hide on desktop
  const isTopLevelHome = !showBack && !title;

  return (
    <header
      className={`w-full bg-surface/90 backdrop-blur-md border-b border-border px-3 sm:px-6 py-2.5 flex flex-col items-center justify-center shrink-0 z-20 font-sans shadow-xs ${
        isTopLevelHome ? 'lg:hidden' : ''
      }`}
    >
      <div className="w-full flex items-center justify-between gap-2">
        {/* Left Slot: Back or Role Switcher Chip (minimum 44x44px touch target) */}
        {showBack ? (
          <button
            onClick={onBack || (() => navigate(-1))}
            aria-label="Back"
            className="w-11 h-11 rounded-inner bg-surface-2 hover:bg-surface-glow border border-border flex items-center justify-center text-text transition-all active:scale-95 shrink-0"
          >
            <ArrowLeft size={19} />
          </button>
        ) : (
          <button
            onClick={handleRoleToggle}
            className="h-11 px-3.5 rounded-pill bg-surface-2 hover:bg-surface-glow border border-border flex items-center gap-1.5 text-xs font-semibold text-primary transition-all shrink-0"
          >
            <span>{activeRole === 'passenger' ? 'PASSENGER' : 'RIDER'}</span>
            <span className="text-[10px]">▾</span>
          </button>
        )}

        {/* Center Slot: Title (Truncated with ellipsis, never wraps) */}
        <div className="flex-1 text-center px-2 min-w-0">
          {title && (
            <h1 className="text-sm sm:text-base font-semibold text-text truncate">
              {title}
            </h1>
          )}
        </div>

        {/* Right Slot: Custom or Default Menu (minimum 44x44px touch target) */}
        <div className="w-11 h-11 flex items-center justify-end shrink-0">
          {rightAction ? (
            rightAction
          ) : (
            <button
              onClick={() => navigate('/notifications')}
              aria-label="Notifications"
              className="w-11 h-11 rounded-inner bg-surface-2 hover:bg-surface-glow border border-border flex items-center justify-center text-text-2 hover:text-text transition-all active:scale-95"
            >
              <Bell size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Centred Status Pill below title */}
      {pill && <div className="mt-1.5">{pill}</div>}
    </header>
  );
};
