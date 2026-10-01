import React from 'react';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { useFamily } from '../../context/FamilyContext';

export const ToastStack: React.FC = () => {
  const { toasts, dismissToast } = useFamily();

  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      className="fixed top-3 left-1/2 -translate-x-1/2 z-[120] w-full max-w-md px-4 space-y-2 pointer-events-none"
      style={{ paddingTop: 'env(safe-area-inset-top)' }}
    >
      {toasts.map((toast) => (
        <button
          key={toast.id}
          onClick={() => dismissToast(toast.id)}
          className={`pointer-events-auto w-full flex items-start gap-2.5 p-3 rounded-2xl border shadow-xl backdrop-blur-xl text-left animate-slide-down active:scale-[0.99] transition-all ${
            toast.kind === 'error'
              ? 'bg-red-50/95 dark:bg-red-950/90 border-red-200 dark:border-red-900 text-red-800 dark:text-red-200'
              : toast.kind === 'success'
              ? 'bg-white/95 dark:bg-neutral-900/95 border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white'
              : 'bg-neutral-950/95 dark:bg-white/95 border-neutral-800 dark:border-neutral-200 text-white dark:text-neutral-950'
          }`}
        >
          <span className="mt-0.5 flex-shrink-0">
            {toast.kind === 'error' ? (
              <AlertCircle className="w-4 h-4" />
            ) : toast.kind === 'success' ? (
              <CheckCircle2 className="w-4 h-4" />
            ) : (
              <Info className="w-4 h-4" />
            )}
          </span>
          <span className="text-xs font-semibold leading-relaxed flex-1">{toast.message}</span>
        </button>
      ))}
    </div>
  );
};
