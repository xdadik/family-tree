import React from 'react';
import { Headphones, X } from 'lucide-react';
import { useFamily } from '../../context/FamilyContext';

export const SupportModal: React.FC = () => {
  const { isSupportOpen, setIsSupportOpen, t } = useFamily();
  if (!isSupportOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
      <div className="w-full max-w-sm space-y-5 rounded-3xl border border-neutral-200 bg-white p-6 shadow-2xl dark:border-neutral-800 dark:bg-neutral-900">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-neutral-950 text-white dark:bg-white dark:text-neutral-950">
              <Headphones className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-neutral-900 dark:text-white">{t.supportTitle}</h3>
              <p className="text-[11px] font-medium text-neutral-500">{t.supportSubtitle}</p>
            </div>
          </div>
          <button onClick={() => setIsSupportOpen(false)} className="rounded-full p-1.5 text-neutral-400 hover:text-black dark:hover:text-white" aria-label="Close">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="rounded-2xl border border-dashed border-neutral-300 bg-neutral-50 p-4 text-center dark:border-neutral-700 dark:bg-neutral-800/60">
          <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-100">{t.supportTitle}</p>
          <p className="mt-1 text-xs leading-relaxed text-neutral-500">{t.supportSubtitle}</p>
        </div>
        <button onClick={() => setIsSupportOpen(false)} className="min-h-[44px] w-full rounded-xl bg-neutral-100 text-xs font-semibold text-neutral-700 transition hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700">
          {t.close}
        </button>
      </div>
    </div>
  );
};
