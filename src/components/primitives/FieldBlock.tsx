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
    <div className={`flex flex-col gap-1 ${className}`}>
      <span className="text-text-muted text-[11px] font-semibold tracking-wider uppercase">
        {label}
      </span>
      <div className="text-text text-sm sm:text-base font-semibold truncate">
        {value}
      </div>
      {caption && <span className="text-text-muted text-xs">{caption}</span>}
    </div>
  );
};

export const FieldGrid: React.FC<{ children: React.ReactNode; columns?: 2 | 3; className?: string }> = ({
  children,
  columns = 2,
  className = '',
}) => {
  return (
    <div className={`grid ${columns === 2 ? 'grid-cols-2' : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3'} gap-4 ${className}`}>
      {children}
    </div>
  );
};
