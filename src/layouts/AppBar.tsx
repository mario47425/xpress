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
      className={`w-full bg-bg/90 backdrop-blur-md border-b border-border/50 px-4 sm:px-6 py-3 flex flex-col items-center justify-center shrink-0 z-20 ${
        isTopLevelHome ? 'lg:hidden' : ''
      }`}
    >
      <div className="w-full flex items-center justify-between">
        {/* Left Slot: Back or Role Switcher Chip */}
        {showBack ? (
          <button
            onClick={onBack || (() => navigate(-1))}
            aria-label="Back"
            className="w-10 h-10 rounded-inner bg-surface border border-border flex items-center justify-center text-text hover:bg-surface-2 transition-all active:scale-95"
          >
            <ArrowLeft size={18} />
          </button>
        ) : (
          <button
            onClick={handleRoleToggle}
            className="px-3 py-1.5 rounded-pill bg-surface border border-border flex items-center gap-1.5 font-label text-primary-soft hover:bg-surface-2 transition-all text-xs"
          >
            <span>{activeRole === 'passenger' ? 'PASSENGER' : 'RIDER'}</span>
            <span className="text-[9px]">▾</span>
          </button>
        )}

        {/* Center Slot: Title */}
        <div className="flex-1 text-center px-3">
          {title && (
            <h1 className="font-title-m text-white text-base sm:text-lg truncate font-semibold">
              {title}
            </h1>
          )}
        </div>

        {/* Right Slot: Custom or Default Menu */}
        <div className="w-10 h-10 flex items-center justify-end">
          {rightAction ? (
            rightAction
          ) : (
            <button
              onClick={() => navigate('/notifications')}
              aria-label="Notifications"
              className="w-10 h-10 rounded-inner bg-surface border border-border flex items-center justify-center text-text hover:bg-surface-2 transition-all active:scale-95"
            >
              <Bell size={16} className="text-text-2" />
            </button>
          )}
        </div>
      </div>

      {/* Centred Status Pill below title */}
      {pill && <div className="mt-2">{pill}</div>}
    </header>
  );
};
