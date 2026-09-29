import React from 'react';

export interface FieldBlockProps {
  label: string;
  value: React.ReactNode;
  caption?: string;
  className?: string;
}

export const FieldBlock: React.FC<FieldBlockProps> = ({
  label,
  value,
  caption,
  className = '',
}) => {
  return (
    <div className={`flex flex-col gap-1 font-mono ${className}`}>
      <span className="font-label text-primary-soft text-[11px] tracking-wider uppercase">
        {label}
      </span>
      <div className="font-body-l text-white text-sm sm:text-base font-medium truncate">
        {value}
      </div>
      {caption && <span className="font-caption text-text-3 text-xs">{caption}</span>}
    </div>
  );
};

export const FieldGrid: React.FC<{ children: React.ReactNode; columns?: 2 | 3; className?: string }> = ({
  children,
  columns = 2,
  className = '',
}) => {
  return (
    <div className={`grid ${columns === 2 ? 'grid-cols-2' : 'grid-cols-3'} gap-4 ${className}`}>
      {children}
    </div>
  );
};
