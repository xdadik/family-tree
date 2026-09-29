import React, { useState } from 'react';
import {
  User,
  Lock,
  LogOut,
  Moon,
  Sun,
  Users,
  Bell,
  Share2,
  ChevronRight,
  QrCode,
  Check,
  Shield,
  Copy,
  X,
  Globe,
  Trash2,
  Headphones,
  Palette,
} from 'lucide-react';
import { useFamily } from '../../context/FamilyContext';

export const SettingsScreen: React.FC = () => {
  const {
    currentUser,
    isAdmin,
    theme,
    setTheme,
    canvasBg,
    setCanvasBg,
    language,
    setIsLanguageModalOpen,
    setIsLoginModalOpen,
    setIsSupportOpen,
    logout,
    clearAllMembers,
    t,
  } = useFamily();

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [copiedInvite, setCopiedInvite] = useState(false);
  const [showLogOutConfirm, setShowLogOutConfirm] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const copyInviteLink = () => {
    navigator.clipboard?.writeText('https://familytree.app/invite/sirojovs-family');
    setCopiedInvite(true);
    setTimeout(() => setCopiedInvite(false), 2000);
  };

  const getLanguageLabel = (l: string) => {
    switch (l) {
      case 'uz-latn':
        return 'O\'zbekcha (Lotin)';
      case 'uz-cyrl':
        return 'Ўзбекча (Кирилл)';
      case 'en':
        return 'English';
      case 'ru':
        return 'Русский';
      default:
        return 'O\'zbekcha';
    }
  };

  return (
    <div className="min-h-full pb-24 text-neutral-900 dark:text-neutral-100 transition-colors">
      {/* Top Header */}
      <div className="sticky top-0 z-20 px-5 pt-4 pb-3 bg-white/95 dark:bg-neutral-950/95 backdrop-blur-xl border-b border-neutral-200 dark:border-neutral-800 transition-colors">
        <h2 className="text-lg font-bold text-neutral-900 dark:text-white tracking-tight">{t.settings}</h2>
      </div>

      <main className="px-5 pt-4 space-y-4">
        {/* User Profile Card with Role Switcher trigger */}
        <div
          onClick={() => {
            if (!currentUser || !isAdmin) {
              setIsLoginModalOpen(true);
            } else {
              setShowLogOutConfirm(true);
            }
          }}
          className="p-4 rounded-3xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm flex items-center justify-between cursor-pointer hover:border-black dark:hover:border-white transition-all"
        >
          <div className="flex items-center gap-3.5">
            {/* Clean Monogram Avatar Badge (No broken/ugly profile photo!) */}
            <div className="w-12 h-12 rounded-2xl bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 font-bold text-base flex items-center justify-center shadow-sm flex-shrink-0">
              {currentUser ? currentUser.name.charAt(0).toUpperCase() : 'M'}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-bold text-neutral-900 dark:text-white truncate">
                  {currentUser ? currentUser.name : 'Mehmon (Kuzatuvchi)'}
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 uppercase tracking-wider">
                  {isAdmin ? t.adminBadge : t.viewerBadge}
                </span>
              </div>
              <p className="text-xs text-neutral-500 truncate mt-0.5">
                {currentUser?.email || 'Tizimga kirish uchun bosing'}
              </p>
            </div>
          </div>

          <div className="text-right flex-shrink-0">
            <span className="text-[11px] font-bold text-neutral-900 dark:text-white underline">
              {isAdmin ? t.logout : t.login}
            </span>
          </div>
        </div>

        {/* Setting Groups */}
        <div className="space-y-2">
          {/* Language Selector */}
          <div
            onClick={() => setIsLanguageModalOpen(true)}
            className="flex items-center justify-between p-3.5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-950 dark:hover:border-neutral-600 cursor-pointer active:scale-[0.99] transition-all group shadow-sm"
          >
            <div className="flex items-center gap-3.5">
              <div className="p-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                <Globe className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-neutral-900 dark:text-white">{t.language}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-neutral-500 font-medium">
              <span>{getLanguageLabel(language)}</span>
              <ChevronRight className="w-4 h-4 text-neutral-400" />
            </div>
          </div>

          {/* PALETTES & COLOUR MANAGEMENT (White to Black and Canvas Backgrounds) */}
          <div className="p-3.5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-3 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3.5">
                <div className="p-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                  <Palette className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-neutral-900 dark:text-white block">
                    Ranglar palitrasi va Fon
                  </span>
                  <span className="text-[10px] text-neutral-500">
                    Shajara va ilova ko&apos;rinishini tanlang
                  </span>
                </div>
              </div>

              {/* Light / Dark Mode Toggle */}
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-neutral-300 dark:border-neutral-700 text-xs font-bold text-neutral-800 dark:text-neutral-200 active:scale-95 transition-all"
              >
                {theme === 'dark' ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
                <span className="capitalize">{theme === 'dark' ? t.dark : t.light}</span>
              </button>
            </div>

            {/* Quick 4 Palette Choices with Live Click */}
            <div className="grid grid-cols-4 gap-2 pt-1">
              {[
                { id: 'white', label: 'Toza Oq', bg: '#ffffff', border: '#e4e4e7', text: '#09090b' },
                { id: 'black', label: 'Chuqur Qora', bg: '#09090b', border: '#27272a', text: '#ffffff' },
                { id: 'cream', label: 'Qog\'oz', bg: '#fbf8f3', border: '#e7e2d9', text: '#1c1917' },
                { id: 'slate', label: 'Tungi', bg: '#0f172a', border: '#1e293b', text: '#f8fafc' },
              ].map((p) => {
                const isActive = canvasBg === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => setCanvasBg(p.id as any)}
                    style={{ backgroundColor: p.bg, borderColor: p.border }}
                    className={`py-2 px-1 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all active:scale-95 shadow-sm ${
                      isActive ? 'ring-2 ring-neutral-950 dark:ring-white scale-[1.02]' : 'opacity-85'
                    }`}
                  >
                    <span style={{ color: p.text }} className="text-[10px] font-bold">
                      {p.label}
                    </span>
                    {isActive && (
                      <Check style={{ color: p.text }} className="w-3 h-3 stroke-[3]" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* SUPPORT BUTTON (Replaces long text button as requested) */}
          <div
            onClick={() => setIsSupportOpen(true)}
            className="flex items-center justify-between p-3.5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-950 dark:hover:border-neutral-600 cursor-pointer active:scale-[0.99] transition-all group shadow-sm"
          >
            <div className="flex items-center gap-3.5">
              <div className="p-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                <Headphones className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-semibold text-neutral-900 dark:text-white block">
                  Support
                </span>
                <span className="text-[10px] text-neutral-500">
                  Zafarovich · Telegram &amp; Telefon
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-white" />
          </div>

          {/* Family Invite */}
          <div
            onClick={() => setIsInviteModalOpen(true)}
            className="flex items-center justify-between p-3.5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-950 dark:hover:border-neutral-600 cursor-pointer active:scale-[0.99] transition-all group shadow-sm"
          >
            <div className="flex items-center gap-3.5">
              <div className="p-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                <Users className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-neutral-900 dark:text-white">{t.familyManagement}</span>
            </div>
            <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-white" />
          </div>

          {/* Notifications Toggle */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm transition-colors">
            <div className="flex items-center gap-3.5">
              <div className="p-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                <Bell className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-neutral-900 dark:text-white">{t.notifications}</span>
            </div>
            <button
              onClick={() => setNotificationsEnabled(!notificationsEnabled)}
              className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                notificationsEnabled ? 'bg-neutral-950 dark:bg-white' : 'bg-neutral-300 dark:bg-neutral-700'
              }`}
              aria-label="Toggle notifications"
            >
              <div
                className={`w-5 h-5 rounded-full transition-transform ${
                  notificationsEnabled
                    ? 'translate-x-5 bg-white dark:bg-neutral-950'
                    : 'translate-x-0 bg-white dark:bg-neutral-300'
                }`}
              />
            </button>
          </div>

          {/* Clear All Members (Zero Members - start totally clean) */}
          {isAdmin && (
            <div
              onClick={() => setShowClearConfirm(true)}
              className="flex items-center justify-between p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-rose-500 cursor-pointer active:scale-[0.99] transition-all group shadow-sm"
            >
              <div className="flex items-center gap-3.5">
                <div className="p-2 rounded-xl bg-neutral-200 dark:bg-neutral-800 text-rose-600 dark:text-rose-400">
                  <Trash2 className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-rose-600 dark:text-rose-400 block">
                    Shajarani butunlay tozalash (0 a&apos;zo)
                  </span>
                  <span className="text-[10px] text-neutral-500">
                    Barcha sinov ma&apos;lumotlarini o&apos;chirib, noldan boshlash
                  </span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-neutral-400" />
            </div>
          )}
        </div>

        {/* LOG IN / LOG OUT BUTTON */}
        <div className="pt-2">
          {isAdmin ? (
            <button
              onClick={() => setShowLogOutConfirm(true)}
              className="w-full py-3.5 px-4 rounded-2xl bg-neutral-100 dark:bg-neutral-900 hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-900 dark:text-white border border-neutral-200 dark:border-neutral-800 font-bold text-xs shadow-sm active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span>{t.logout} (Admin hisobidan chiqish)</span>
            </button>
          ) : (
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="w-full py-3.5 px-4 rounded-2xl bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 font-bold text-xs shadow-sm active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" />
              <span>{t.login} (Login va parol bilan kirish)</span>
            </button>
          )}
        </div>

        {/* Footer Brand */}
        <div className="text-center pt-2 space-y-0.5">
          <p className="text-xs font-semibold text-neutral-500 tracking-wide">
            {t.appName} · {t.tagline}
          </p>
          <p className="text-[10px] text-neutral-400">Admin: @zafarov1ich · +998 94 840 31 06</p>
        </div>
      </main>

      {/* Invite Family Modal */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Share2 className="w-4 h-4 text-neutral-900 dark:text-white" />
                <h3 className="text-sm font-bold text-neutral-900 dark:text-white">Sirojovlar Taklifnomasi</h3>
              </div>
              <button
                onClick={() => setIsInviteModalOpen(false)}
                className="p-1 rounded-full text-neutral-400 hover:text-black dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-neutral-600 dark:text-neutral-400">
              Qarindoshlarga ushbu havolani yuboring. Ular shajarani ko&apos;rishlari mumkin bo&apos;ladi.
            </p>

            <div className="p-4 rounded-2xl bg-white border border-neutral-200 flex flex-col items-center justify-center space-y-2">
              <QrCode className="w-32 h-32 text-neutral-900" />
              <span className="text-[10px] font-bold text-neutral-600">Sirojovlar Oila Shajarasi</span>
            </div>

            <button
              onClick={copyInviteLink}
              className="w-full py-2.5 px-3 rounded-xl bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 font-semibold text-xs flex items-center justify-center gap-2 active:scale-95 transition-all shadow-sm"
            >
              {copiedInvite ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copiedInvite ? 'Nusxalandi!' : 'Havolani nusxalash'}
            </button>
          </div>
        </div>
      )}

      {/* Logout Confirmation */}
      {showLogOutConfirm && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/75 p-4 animate-fade-in">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white flex items-center justify-center mx-auto">
              <LogOut className="w-5 h-5" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-neutral-900 dark:text-white">Admin tizimidan chiqish?</h3>
              <p className="text-xs text-neutral-500">
                Chiqganingizdan so&apos;ng faqat ko&apos;rish (Viewer) rejimida qolasiz.
              </p>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShowLogOutConfirm(false)}
                className="flex-1 py-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-semibold text-xs hover:bg-neutral-200 dark:hover:bg-neutral-700"
              >
                {t.cancel}
              </button>
              <button
                onClick={() => {
                  setShowLogOutConfirm(false);
                  logout();
                }}
                className="flex-1 py-2.5 rounded-xl bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 font-semibold text-xs shadow-sm"
              >
                {t.logout}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Clear Confirmation */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/75 p-4 animate-fade-in">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto">
              <Trash2 className="w-5 h-5" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-neutral-900 dark:text-white">Shajarani tozalash</h3>
              <p className="text-xs text-neutral-500">
                Barcha a&apos;zolarni tozalab, o&apos;zingiz noldan yangi a&apos;zolarni kiritishingiz mumkin.
              </p>
            </div>
            <div className="space-y-2 pt-2">
              <button
                onClick={() => {
                  setShowClearConfirm(false);
                  clearAllMembers();
                }}
                className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-sm transition-colors"
              >
                Butunlay tozalash (0 a&apos;zo qoldirish)
              </button>
              <button
                onClick={() => setShowClearConfirm(false)}
                className="w-full py-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-semibold text-xs"
              >
                {t.cancel}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
