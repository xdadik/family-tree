import React from 'react';
import { Bell, Sparkles } from 'lucide-react';
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
  const { currentUser, notifications, setIsNotificationsOpen, setActiveTab } = useFamily();
  const unreadCount = notifications.filter((n) => !n.read).length;

  if (title) {
    return (
      <header className="sticky top-0 z-30 flex items-center justify-between px-4 py-3.5 bg-slate-900/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          {showBack && (
            <button
              onClick={onBack}
              aria-label="Back"
              className="p-1.5 -ml-1 text-slate-300 hover:text-white rounded-full hover:bg-slate-800/60 active:scale-95 transition-all"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}
          <div>
            <h1 className="text-lg font-bold text-white tracking-tight">{title}</h1>
            {subtitle && <p className="text-xs text-slate-400 font-medium">{subtitle}</p>}
          </div>
        </div>
        {rightAction ? (
          <div>{rightAction}</div>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsNotificationsOpen(true)}
              className="relative p-2 text-slate-300 hover:text-white rounded-full hover:bg-slate-800/60 active:scale-95 transition-all"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-slate-900 animate-pulse" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className="w-8 h-8 rounded-full overflow-hidden border border-emerald-500/40 focus:ring-2 focus:ring-emerald-500/50"
              aria-label="Profile Settings"
            >
              <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-full h-full object-cover" />
            </button>
          </div>
        )}
      </header>
    );
  }

  // Home default greeting header matching mockup
  return (
    <header className="flex items-center justify-between px-5 pt-4 pb-2">
      <div className="flex items-center gap-3">
        {/* Family Tree App Logo */}
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 p-0.5 shadow-lg shadow-emerald-500/20 flex items-center justify-center">
          <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center">
            {/* Custom stylized emerald tree icon */}
            <svg viewBox="0 0 24 24" className="w-6 h-6 text-emerald-400 fill-current">
              <path d="M12 2C7.58 2 4 5.58 4 10c0 3.19 1.88 5.95 4.6 7.24L8 22h8l-.6-4.76C18.12 15.95 20 13.19 20 10c0-4.42-3.58-8-8-8zm0 2c3.31 0 6 2.69 6 6 0 2.22-1.21 4.15-3 5.19V11h-2v3.19c-.31.06-.65.09-1 .09s-.69-.03-1-.09V11h-2v4.19c-1.79-1.04-3-2.97-3-5.19 0-3.31 2.69-6 6-6zm-1 12h2v4h-2v-4z" />
            </svg>
          </div>
        </div>
        <div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 uppercase tracking-wider">
            <span>FamilyTree</span>
            <Sparkles className="w-3 h-3" />
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">Good morning, Family</h2>
        </div>
      </div>

      <div className="flex items-center gap-2.5">
        <button
          onClick={() => setIsNotificationsOpen(true)}
          className="relative p-2.5 text-slate-300 hover:text-white rounded-full bg-slate-800/60 border border-slate-700/60 active:scale-95 transition-all shadow-sm"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5 text-slate-200" />
          {unreadCount > 0 && (
            <span className="absolute 1.5 top-1.5 right-1.5 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-slate-900 animate-pulse" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className="w-10 h-10 rounded-full overflow-hidden border-2 border-emerald-500/50 shadow-md hover:scale-105 active:scale-95 transition-transform"
          aria-label="Settings"
        >
          <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-full h-full object-cover" />
        </button>
      </div>
    </header>
  );
};
