import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';

interface ToastItem {
  id: number;
  message: string;
  tone: 'success' | 'info';
}

interface ToastContextValue {
  notify: (message: string, tone?: ToastItem['tone']) => void;
}

const ToastContext = createContext<ToastContextValue>({ notify: () => {} });

/** Access `notify()` from anywhere inside the portal */
export const useToast = () => useContext(ToastContext);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const counter = useRef(1);

  const notify = useCallback((message: string, tone: ToastItem['tone'] = 'success') => {
    const id = counter.current++;
    setToasts((prev) => [...prev, { id, message, tone }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 3600);
  }, []);

  const value = useMemo(() => ({ notify }), [notify]);

  return (
    <ToastContext.Provider value={value}>
      {children}

      <div
        className="pointer-events-none fixed bottom-5 left-1/2 z-[70] flex w-[min(24rem,92vw)] -translate-x-1/2 flex-col gap-2"
        role="status"
        aria-live="polite"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="glass-panel pointer-events-auto flex items-start gap-2.5 rounded-2xl px-4 py-3 text-left animate-in fade-in slide-in-from-bottom-2"
          >
            <span
              className={`material-icons mt-0.5 text-[18px] leading-none ${
                toast.tone === 'success' ? 'text-emerald-600' : 'text-[#1a73e8]'
              }`}
            >
              {toast.tone === 'success' ? 'check_circle' : 'info'}
            </span>
            <p className="text-[12.5px] font-medium leading-snug text-[#1f1f1f]">{toast.message}</p>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
