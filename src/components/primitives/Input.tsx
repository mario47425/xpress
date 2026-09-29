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
    <div className="flex flex-col gap-1.5 w-full font-sans">
      {label && (
        <label className="text-[11px] font-semibold text-primary uppercase tracking-wider">
          {label}
        </label>
      )}
      <input
        disabled={disabled}
        className={`h-12 px-4 bg-surface-2 text-text placeholder-text-3 font-sans text-sm rounded-input border transition-all duration-150 outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary disabled:opacity-40 ${
          error ? 'border-danger focus:ring-danger/40' : 'border-border'
        } ${className}`}
        {...props}
      />
      {error ? (
        <span className="text-xs text-danger font-medium">{error}</span>
      ) : helperText ? (
        <span className="text-xs text-text-3">{helperText}</span>
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
    <div className="flex items-center justify-center gap-2 sm:gap-3 font-sans">
      {[0, 1, 2, 3, 4, 5].map((idx) => (
        <input
          key={idx}
          ref={(el) => (inputsRef.current[idx] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[idx] || ''}
          onChange={(e) => handleChange(idx, e)}
          onKeyDown={(e) => handleKeyDown(idx, e)}
          className={`w-11 sm:w-12 h-14 text-center text-xl font-bold bg-surface-2 text-text rounded-input border transition-all duration-150 outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary ${
            error ? 'border-danger text-danger' : 'border-border'
          }`}
        />
      ))}
    </div>
  );
};
