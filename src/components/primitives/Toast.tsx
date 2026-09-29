import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'warn' | 'error' | 'info';

export interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, type, message }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500); // 3.5s per spec
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const getIcon = (type: ToastType) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 size={18} className="text-success shrink-0" />;
      case 'warn':
      case 'error':
        return <AlertCircle size={18} className="text-danger shrink-0" />;
      default:
        return <Info size={18} className="text-primary-soft shrink-0" />;
    }
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Floating Toasts */}
      <div className="fixed top-16 sm:top-20 right-4 left-4 sm:left-auto sm:w-96 z-50 flex flex-col gap-2.5 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="pointer-events-auto bg-surface border border-border text-text text-xs sm:text-sm font-medium px-4 py-3 rounded-card shadow-colored flex items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2 duration-200"
          >
            <div className="flex items-center gap-2.5">
              {getIcon(toast.type)}
              <span className="font-semibold">{toast.message}</span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              aria-label="Dismiss notification"
              className="text-text-muted hover:text-text min-w-[36px] min-h-[36px] flex items-center justify-center rounded-button hover:bg-surface-2 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
};
