import React from 'react';
import { Headphones, X, Phone, Send } from 'lucide-react';
import { useFamily } from '../../context/FamilyContext';

const SUPPORT_PHONE_DISPLAY = '+998 94 840 31 06';
const SUPPORT_PHONE_LINK = 'tel:+998948403106';
const SUPPORT_TELEGRAM_DISPLAY = '@zafarov1ich';
const SUPPORT_TELEGRAM_LINK = 'https://t.me/zafarov1ich';

export const SupportModal: React.FC = () => {
  const { isSupportOpen, setIsSupportOpen, t } = useFamily();
  if (!isSupportOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
      <div className="w-full max-w-sm space-y-4 rounded-3xl border border-neutral-200 bg-white p-6 shadow-2xl dark:border-neutral-800 dark:bg-neutral-900">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#1c1917] text-[#faf6ee] dark:bg-[#faf6ee] dark:text-[#1c1917]">
              <Headphones className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-neutral-900 dark:text-white">{t.supportTitle}</h3>
              <p className="text-[11px] font-medium text-neutral-500">{t.supportSubtitle}</p>
            </div>
          </div>
          <button
            onClick={() => setIsSupportOpen(false)}
            className="min-w-[44px] min-h-[44px] rounded-full p-1.5 text-neutral-400 hover:text-black dark:hover:text-white flex items-center justify-center"
            aria-label={t.close}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="space-y-2">
          <a
            href={SUPPORT_PHONE_LINK}
            className="w-full min-h-[52px] flex items-center gap-3 rounded-2xl bg-[#1c1917] dark:bg-[#faf6ee] text-[#faf6ee] dark:text-[#1c1917] px-4 active:scale-[0.99] transition-all"
          >
            <Phone className="h-4 w-4 shrink-0" />
            <span className="text-left">
              <span className="block text-[10px] font-medium opacity-70">{t.callPhone}</span>
              <span className="block text-sm font-bold font-mono2">{SUPPORT_PHONE_DISPLAY}</span>
            </span>
          </a>
          <a
            href={SUPPORT_TELEGRAM_LINK}
            target="_blank"
            rel="noreferrer"
            className="w-full min-h-[52px] flex items-center gap-3 rounded-2xl border border-neutral-300 dark:border-neutral-700 px-4 active:scale-[0.99] transition-all"
          >
            <Send className="h-4 w-4 shrink-0" />
            <span className="text-left">
              <span className="block text-[10px] font-medium text-neutral-500">{t.openTelegram}</span>
              <span className="block text-sm font-bold">{SUPPORT_TELEGRAM_DISPLAY}</span>
            </span>
          </a>
        </div>
        <button
          onClick={() => setIsSupportOpen(false)}
          className="min-h-[44px] w-full rounded-xl bg-neutral-100 text-xs font-semibold text-neutral-700 transition hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
        >
          {t.close}
        </button>
      </div>
    </div>
  );
};
