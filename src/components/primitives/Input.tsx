import React, { useRef } from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  className = '',
  disabled = false,
  ...props
}) => {
  return (
    <div className="flex flex-col gap-1.5 w-full font-mono">
      {label && (
        <label className="font-label text-primary-soft text-[11px] tracking-wider uppercase">
          {label}
        </label>
      )}
      <input
        disabled={disabled}
        className={`h-[52px] px-4 bg-surface-2 text-white placeholder-text-3 font-mono text-sm rounded-input border transition-all duration-120 outline-none focus:ring-2 focus:ring-primary-soft focus:ring-offset-1 focus:ring-offset-bg disabled:opacity-40 ${
          error ? 'border-danger focus:ring-danger' : 'border-border focus:border-primary-soft'
        } ${className}`}
        {...props}
      />
      {error ? (
        <span className="text-xs text-danger font-caption">{error}</span>
      ) : helperText ? (
        <span className="text-xs text-text-3 font-caption">{helperText}</span>
      ) : null}
    </div>
  );
};

// Six-digit OTP input component (UI Spec §6.12)
export interface OtpInputProps {
  value: string;
  onChange: (val: string) => void;
  error?: boolean;
}

export const OtpInput: React.FC<OtpInputProps> = ({ value, onChange, error = false }) => {
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const digit = e.target.value.slice(-1);
    if (!/^\d*$/.test(digit)) return;

    const valArray = value.split('');
    valArray[index] = digit;
    const newVal = valArray.join('');
    onChange(newVal);

    if (digit && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !value[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  return (
    <div className="flex items-center justify-between gap-2 w-full">
      {Array.from({ length: 6 }).map((_, i) => (
        <input
          key={i}
          ref={(el) => (inputsRef.current[i] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[i] || ''}
          onChange={(e) => handleChange(i, e)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          className={`w-12 h-14 bg-surface-2 text-center text-white font-mono text-xl font-bold rounded-input border transition-all outline-none focus:ring-2 focus:ring-primary-soft ${
            error ? 'border-danger' : 'border-border focus:border-primary-soft'
          }`}
        />
      ))}
    </div>
  );
};
