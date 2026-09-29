import React from 'react';

export interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  helper?: string;
  disabled?: boolean;
}

export const Toggle: React.FC<ToggleProps> = ({
  checked,
  onChange,
  label,
  helper,
  disabled = false,
}) => {
  return (
    <label className="flex items-center justify-between cursor-pointer group select-none gap-4 min-h-[44px] py-1">
      {(label || helper) && (
        <div className="flex flex-col">
          {label && <span className="text-text text-sm font-semibold">{label}</span>}
          {helper && <span className="text-text-muted text-xs">{helper}</span>}
        </div>
      )}
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={`w-[52px] h-[30px] rounded-full p-1 transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-primary shrink-0 ${
          checked ? 'bg-primary' : 'bg-surface-3 border border-border'
        } ${disabled ? 'opacity-40 pointer-events-none' : ''}`}
      >
        <div
          className={`w-[22px] h-[22px] rounded-full bg-white transition-transform duration-200 shadow-sm ${
            checked ? 'translate-x-[22px]' : 'translate-x-0'
          }`}
        />
      </button>
    </label>
  );
};
