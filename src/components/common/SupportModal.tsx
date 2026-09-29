import React, { useState } from 'react';
import { X, Send, Phone, Copy, Check, Headphones, UserCheck, Shield } from 'lucide-react';
import { useFamily } from '../../context/FamilyContext';

export const SupportModal: React.FC = () => {
  const { isSupportOpen, setIsSupportOpen, t } = useFamily();
  const [copied, setCopied] = useState<string | null>(null);

  if (!isSupportOpen) return null;

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard?.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in">
      <div className="w-full max-w-sm bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 shadow-2xl space-y-5 transition-colors">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 flex items-center justify-center shadow-sm">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-neutral-900 dark:text-white leading-tight">
                {t.supportTitle}
              </h3>
              <p className="text-[11px] text-neutral-500 font-medium">
                {t.supportSubtitle}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsSupportOpen(false)}
            className="p-1.5 rounded-full text-neutral-400 hover:text-black dark:hover:text-white transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Administrator Badge */}
        <div className="p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-800 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center font-bold text-neutral-900 dark:text-white text-xs">
            Z
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <h4 className="text-xs font-bold text-neutral-900 dark:text-white">Zafarovich</h4>
              <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-neutral-950 text-white dark:bg-white dark:text-neutral-950">
                Admin
              </span>
            </div>
            <p className="text-[11px] text-neutral-500">Sirojovlar Oila Shajarasi</p>
          </div>
        </div>

        {/* Contact Methods */}
        <div className="space-y-2.5">
          {/* Telegram */}
          <div className="p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-800 flex items-center justify-between group">
            <div className="flex items-center gap-3 min-w-0">
              <div className="p-2 rounded-xl bg-neutral-200 dark:bg-neutral-700 text-neutral-900 dark:text-white">
                <Send className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider block">
                  Telegram
                </span>
                <span className="text-xs font-bold text-neutral-900 dark:text-white truncate block">
                  @zafarov1ich
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => handleCopy('@zafarov1ich', 'tg')}
                className="p-2 rounded-xl text-neutral-400 hover:text-black dark:hover:text-white transition-colors"
                title="Nusxalash"
              >
                {copied === 'tg' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
              <a
                href="https://t.me/zafarov1ich"
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-xl bg-neutral-950 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-200 text-white dark:text-neutral-950 text-[11px] font-bold active:scale-95 transition-all shadow-sm"
              >
                {t.openTelegram}
              </a>
            </div>
          </div>

          {/* Phone */}
          <div className="p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-800 flex items-center justify-between group">
            <div className="flex items-center gap-3 min-w-0">
              <div className="p-2 rounded-xl bg-neutral-200 dark:bg-neutral-700 text-neutral-900 dark:text-white">
                <Phone className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider block">
                  Telefon
                </span>
                <span className="text-xs font-bold text-neutral-900 dark:text-white truncate block font-mono">
                  +998 94 840 31 06
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => handleCopy('+998948403106', 'phone')}
                className="p-2 rounded-xl text-neutral-400 hover:text-black dark:hover:text-white transition-colors"
                title="Nusxalash"
              >
                {copied === 'phone' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
              <a
                href="tel:+998948403106"
                className="px-3 py-1.5 rounded-xl bg-neutral-950 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-200 text-white dark:text-neutral-950 text-[11px] font-bold active:scale-95 transition-all shadow-sm"
              >
                {t.callPhone}
              </a>
            </div>
          </div>
        </div>

        {/* Dismiss Button */}
        <button
          onClick={() => setIsSupportOpen(false)}
          className="w-full py-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-semibold text-xs hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
        >
          {t.cancel}
        </button>
      </div>
    </div>
  );
};
