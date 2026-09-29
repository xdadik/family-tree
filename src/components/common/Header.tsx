import React from 'react';
import { Bell, Globe, User, Shield, Eye } from 'lucide-react';
import { useFamily } from '../../context/FamilyContext';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
  rightAction?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  showBack,
  onBack,
  rightAction,
}) => {
  const {
    currentUser,
    isAdmin,
    notifications,
    setIsNotificationsOpen,
    setIsLanguageModalOpen,
    setIsLoginModalOpen,
    language,
    t,
  } = useFamily();

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getLangCode = (l: string) => {
    switch (l) {
      case 'uz-latn':
        return 'UZ';
      case 'uz-cyrl':
        return 'ЎЗ';
      case 'en':
        return 'EN';
      case 'ru':
        return 'RU';
      default:
        return 'UZ';
    }
  };

  if (title) {
    return (
      <header className="sticky top-0 z-30 flex items-center justify-between px-4 py-3 bg-white/90 dark:bg-neutral-950/90 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800 transition-colors">
        <div className="flex items-center gap-3">
          {showBack && (
            <button
              onClick={onBack}
              aria-label="Back"
              className="p-2 -ml-1 text-neutral-600 dark:text-neutral-300 hover:text-black dark:hover:text-white rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-900 active:scale-95 transition-all"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}
          <div>
            <h1 className="text-base font-bold text-neutral-900 dark:text-white tracking-tight">{title}</h1>
            {subtitle && <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">{subtitle}</p>}
          </div>
        </div>
        {rightAction ? (
          <div>{rightAction}</div>
        ) : (
          <div className="flex items-center gap-1.5">
            {/* Language Switcher trigger */}
            <button
              onClick={() => setIsLanguageModalOpen(true)}
              className="px-2.5 py-1.5 rounded-xl border border-neutral-300 dark:border-neutral-700 text-xs font-bold text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 active:scale-95 transition-all flex items-center gap-1"
              aria-label="Change Language"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{getLangCode(language)}</span>
            </button>

            <button
              onClick={() => setIsNotificationsOpen(true)}
              className="relative p-2 text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-900 active:scale-95 transition-all"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-neutral-900 dark:bg-white rounded-full ring-2 ring-white dark:ring-neutral-950" />
              )}
            </button>

            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="p-1 rounded-xl border border-neutral-300 dark:border-neutral-700 active:scale-95 transition-all"
              title="Hisob / Login"
            >
              <div className="w-7 h-7 rounded-lg bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 font-bold text-[11px] flex items-center justify-center shadow-sm">
                {currentUser ? currentUser.name.charAt(0).toUpperCase() : <User className="w-3.5 h-3.5" />}
              </div>
            </button>
          </div>
        )}
      </header>
    );
  }

  // Home default greeting header
  return (
    <header className="flex items-center justify-between px-5 pt-4 pb-2 transition-colors">
      <div className="flex items-center gap-3">
        {/* Minimal Monochromatic Sirojovs Family Mark */}
        <div className="w-10 h-10 rounded-2xl bg-neutral-950 dark:bg-white flex items-center justify-center shadow-sm">
          <svg viewBox="0 0 24 24" className="w-5 h-5 text-white dark:text-neutral-950 fill-current">
            <path d="M12 2C7.58 2 4 5.58 4 10c0 3.19 1.88 5.95 4.6 7.24L8 22h8l-.6-4.76C18.12 15.95 20 13.19 20 10c0-4.42-3.58-8-8-8zm0 2c3.31 0 6 2.69 6 6 0 2.22-1.21 4.15-3 5.19V11h-2v3.19c-.31.06-.65.09-1 .09s-.69-.03-1-.09V11h-2v4.19c-1.79-1.04-3-2.97-3-5.19 0-3.31 2.69-6 6-6zm-1 12h2v4h-2v-4z" />
          </svg>
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-bold tracking-wider uppercase text-neutral-500 dark:text-neutral-400 block">
              {t.appName}
            </span>
            <span className="px-1.5 py-0.2 rounded text-[9px] font-extrabold bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200">
              {isAdmin ? t.adminBadge : t.viewerBadge}
            </span>
          </div>
          <h2 className="text-lg font-bold text-neutral-900 dark:text-white tracking-tight">{t.goodMorning}</h2>
        </div>
      </div>

      <div className="flex items-center gap-1.5">
        {/* Language selector button */}
        <button
          onClick={() => setIsLanguageModalOpen(true)}
          className="px-2.5 py-1.5 rounded-xl border border-neutral-300 dark:border-neutral-700 text-xs font-bold text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 active:scale-95 transition-all flex items-center gap-1"
          aria-label="Change Language"
        >
          <Globe className="w-3.5 h-3.5" />
          <span>{getLangCode(language)}</span>
        </button>

        <button
          onClick={() => setIsNotificationsOpen(true)}
          className="relative p-2.5 text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 active:scale-95 transition-all"
          aria-label="Notifications"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute top-2 right-2 w-2 h-2 bg-neutral-900 dark:bg-white rounded-full ring-2 ring-white dark:ring-neutral-950" />
          )}
        </button>

        {/* User login / switch account trigger */}
        <button
          onClick={() => setIsLoginModalOpen(true)}
          className="w-9 h-9 rounded-2xl bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 font-bold text-xs flex items-center justify-center border border-neutral-300 dark:border-neutral-700 shadow-sm active:scale-95 transition-all"
          aria-label="Login / Account"
          title="Login / Account"
        >
          {currentUser ? currentUser.name.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
        </button>
      </div>
    </header>
  );
};
