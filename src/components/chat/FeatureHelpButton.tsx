import React from 'react';
import { HelpCircle } from 'lucide-react';
import { useChatStore } from '../../store/useChatStore';
import { useAppStore } from '../../store/useAppStore';
import { useLocation } from 'react-router-dom';

interface FeatureHelpButtonProps {
  question: string;
  label?: string;
  className?: string;
}

export const FeatureHelpButton: React.FC<FeatureHelpButtonProps> = ({
  question,
  label = 'Need help?',
  className = '',
}) => {
  const { sendPrefilled } = useChatStore();
  const { activeRole, currentUser } = useAppStore();
  const location = useLocation();

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    sendPrefilled(question, {
      currentRoute: location.pathname,
      mode: activeRole === 'rider' ? 'drive' : 'ride',
      isLoggedIn: !!currentUser,
    });
  };

  return (
    <button
      onClick={handleClick}
      title={label}
      aria-label={`${label}: ${question}`}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full bg-primary/10 hover:bg-primary/20 text-primary border border-primary/25 transition-all active:scale-95 shrink-0 ${className}`}
      style={{ minHeight: 32 }}
    >
      <HelpCircle size={14} className="shrink-0" />
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
};
