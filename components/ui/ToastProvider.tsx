'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, Sparkles, X, ShieldCheck } from 'lucide-react';

export type ToastType = 'success' | 'info' | 'warning' | 'error' | 'ai' | 'grant';

export interface ToastItem {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
  duration?: number;
}

interface ToastContextType {
  toasts: ToastItem[];
  showToast: (toast: Omit<ToastItem, 'id'>) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(({ type, title, description, duration = 4000 }: Omit<ToastItem, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const newToast: ToastItem = { id, type, title, description, duration };

    setToasts((prev) => [newToast, ...prev.slice(0, 4)]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ toasts, showToast, removeToast }}>
      {children}
      {/* Toast Notification Container */}
      <div
        aria-live="assertive"
        className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0"
      >
        {toasts.map((t) => {
          let borderStyle = 'border-emerald-500/40 bg-slate-900/95 text-emerald-300';
          let icon = <CheckCircle2 size={18} className="text-emerald-400 shrink-0 mt-0.5" />;

          if (t.type === 'ai') {
            borderStyle = 'border-teal-500/50 bg-slate-900/95 text-teal-300';
            icon = <Sparkles size={18} className="text-teal-400 shrink-0 mt-0.5 animate-spin-slow" />;
          } else if (t.type === 'grant') {
            borderStyle = 'border-amber-500/50 bg-slate-900/95 text-amber-300';
            icon = <ShieldCheck size={18} className="text-amber-400 shrink-0 mt-0.5" />;
          } else if (t.type === 'warning' || t.type === 'error') {
            borderStyle = 'border-rose-500/40 bg-slate-900/95 text-rose-300';
            icon = <AlertCircle size={18} className="text-rose-400 shrink-0 mt-0.5" />;
          } else if (t.type === 'info') {
            borderStyle = 'border-blue-500/40 bg-slate-900/95 text-blue-300';
            icon = <Info size={18} className="text-blue-400 shrink-0 mt-0.5" />;
          }

          return (
            <div
              key={t.id}
              role="alert"
              className={`pointer-events-auto rounded-2xl border ${borderStyle} p-4 shadow-2xl backdrop-blur-xl flex items-start justify-between gap-3 transition-all duration-300 transform translate-y-0 opacity-100 animate-in slide-in-from-bottom-3 fade-in`}
            >
              <div className="flex items-start gap-3">
                {icon}
                <div>
                  <h4 className="text-xs font-bold text-slate-100">{t.title}</h4>
                  {t.description && (
                    <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">{t.description}</p>
                  )}
                </div>
              </div>

              <button
                onClick={() => removeToast(t.id)}
                className="text-slate-400 hover:text-slate-200 transition-colors p-1"
                aria-label="Close notification"
              >
                <X size={14} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    return {
      showToast: () => {},
      removeToast: () => {},
      toasts: []
    };
  }
  return context;
}
