import React, { useState } from 'react';
import {
  Lock,
  LogOut,
  Users,
  Bell,
  Share2,
  ChevronRight,
  Check,
  X,
  Globe,
  Headphones,
} from 'lucide-react';
import { useFamily } from '../../context/FamilyContext';

export const SettingsScreen: React.FC = () => {
  const {
    currentUser,
    isAdmin,
    isOwner,
    accounts,
    createAccount,
    removeAccount,
    language,
    setIsLanguageModalOpen,
    setIsLoginModalOpen,
    setIsSupportOpen,
    logout,
    members,
    pushToast,
    t,
  } = useFamily();

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [copiedInvite, setCopiedInvite] = useState(false);
  const [showLogOutConfirm, setShowLogOutConfirm] = useState(false);
  const [accName, setAccName] = useState('');
  const [accLogin, setAccLogin] = useState('');
  const [accPassword, setAccPassword] = useState('');
  const [accRole, setAccRole] = useState<'viewer' | 'admin'>('viewer');
  const [accError, setAccError] = useState('');
  const [accBusy, setAccBusy] = useState(false);

  const handleCreateAccount = async (event: React.FormEvent) => {
    event.preventDefault();
    setAccError('');
    setAccBusy(true);
    const ok = await createAccount({ name: accName, username: accLogin, password: accPassword, role: accRole });
    setAccBusy(false);
    if (!ok) {
      setAccError(t.adminAddFailed);
      return;
    }
    setAccName('');
    setAccLogin('');
    setAccPassword('');
    setAccRole('viewer');
  };

  const shareInvite = async () => {
    const text = `${t.inviteTitle} — ${t.appName}`;
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: text, text: t.inviteDesc, url });
        return;
      }
      await navigator.clipboard?.writeText(url);
      pushToast(t.linkCopied, 'success');
    } catch {
      pushToast(t.copied, 'info');
    }
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
        <button
          type="button"
          onClick={() => {
            if (!currentUser || !isAdmin) {
              setIsLoginModalOpen(true);
            } else {
              setShowLogOutConfirm(true);
            }
          }}
          className="w-full p-4 text-left rounded-3xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm flex items-center justify-between cursor-pointer hover:border-black dark:hover:border-white transition-all"
          aria-label={isAdmin ? t.logout : t.login}
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
                  {currentUser?.role === 'owner' ? 'BIG ADMIN' : isAdmin ? t.adminBadge : t.viewerBadge}
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
        </button>

        {/* Setting Groups */}
        <div className="space-y-2">
          {isOwner && (
            <section className="rounded-2xl border border-[#e7ddc8] bg-[#fffdf7] p-4 shadow-sm dark:border-[#3a3128] dark:bg-[#211b14]">
              <div className="mb-3">
                <h3 className="font-display text-base ink-heading">{t.familyManagement}</h3>
                <p className="mt-1 font-mono2 text-[11px] text-neutral-500">{accounts.length} · {t.adminNotice}</p>
              </div>
              {accError && (
                <div role="alert" className="mb-2.5 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300">
                  {accError}
                </div>
              )}
              <form onSubmit={handleCreateAccount} className="space-y-2">
                <input
                  value={accName}
                  onChange={(e) => setAccName(e.target.value)}
                  placeholder={t.fullName}
                  required
                  autoComplete="off"
                  className="min-h-[44px] w-full rounded-xl border border-neutral-300 bg-white px-3 text-base outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    value={accLogin}
                    onChange={(e) => setAccLogin(e.target.value.toLowerCase().replace(/\s+/g, ''))}
                    placeholder={t.username}
                    required
                    autoComplete="off"
                    className="min-h-[44px] w-full rounded-xl border border-neutral-300 bg-white px-3 text-base outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                  />
                  <input
                    value={accPassword}
                    onChange={(e) => setAccPassword(e.target.value)}
                    placeholder={t.password}
                    type="password"
                    minLength={4}
                    required
                    autoComplete="new-password"
                    className="min-h-[44px] w-full rounded-xl border border-neutral-300 bg-white px-3 text-base outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={accRole}
                    onChange={(e) => setAccRole(e.target.value as 'viewer' | 'admin')}
                    className="min-h-[44px] w-full rounded-xl border border-neutral-300 bg-white px-3 text-sm outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                  >
                    <option value="viewer">{t.viewer}</option>
                    <option value="admin">{t.admin}</option>
                  </select>
                  <button
                    type="submit"
                    disabled={accBusy}
                    className="min-h-[44px] rounded-xl bg-[#1c1917] text-[#faf6ee] text-xs font-bold dark:bg-[#faf6ee] dark:text-[#1c1917] disabled:opacity-60"
                  >
                    {t.save}
                  </button>
                </div>
              </form>
              {accounts.length > 0 && (
                <div className="mt-3 space-y-1.5 border-t border-[#e7ddc8] pt-3 dark:border-[#3a3128]">
                  {accounts.map((a) => (
                    <div key={a.id} className="flex items-center justify-between gap-3 rounded-xl bg-white/60 px-3 py-2 dark:bg-neutral-800/60">
                      <div className="min-w-0">
                        <p className="truncate text-xs font-semibold">{a.name} <span className="font-mono2 text-[10px] text-neutral-400">{a.role}</span></p>
                        <p className="truncate font-mono2 text-[11px] text-neutral-500">@{a.login}</p>
                      </div>
                      {a.id !== currentUser?.id && (
                        <button
                          type="button"
                          onClick={() => void removeAccount(a.id)}
                          className="shrink-0 min-h-[36px] rounded-lg px-2.5 text-[11px] font-bold text-rose-600"
                          aria-label={t.deleteMember}
                        >
                          {t.deleteMember}
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}
          {/* Language Selector */}
          <button
            type="button"
            onClick={() => setIsLanguageModalOpen(true)}
            className="w-full flex items-center justify-between p-3.5 text-left rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-950 dark:hover:border-neutral-600 cursor-pointer active:scale-[0.99] transition-all group shadow-sm"
            aria-label={t.selectLanguage}
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
          </button>

          {/* SUPPORT BUTTON (Replaces long text button as requested) */}
          <button
            type="button"
            onClick={() => setIsSupportOpen(true)}
            className="w-full flex items-center justify-between p-3.5 text-left rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-950 dark:hover:border-neutral-600 cursor-pointer active:scale-[0.99] transition-all group shadow-sm"
            aria-label={t.supportTitle}
          >
            <div className="flex items-center gap-3.5">
              <div className="p-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                <Headphones className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-semibold text-neutral-900 dark:text-white block">
                  Support
                </span>
                <span className="text-[10px] text-neutral-500">Aloqa ma&apos;lumotlarini keyinroq kiriting</span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-white" />
          </button>

          {/* Family Invite */}
          <button
            type="button"
            onClick={() => setIsInviteModalOpen(true)}
            className="w-full flex items-center justify-between px-3 py-2 text-left rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-950 dark:hover:border-neutral-600 cursor-pointer active:scale-[0.99] transition-all group"
            aria-label={t.familyManagement}
          >
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                <Users className="w-3.5 h-3.5" />
              </div>
              <span className="text-[11px] font-semibold text-neutral-900 dark:text-white">{t.familyManagement}</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-white" />
          </button>

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

        </div>

        {/* LOG IN / LOG OUT BUTTON */}
        <div className="pt-2">
          {isAdmin ? (
            <button
              onClick={() => setShowLogOutConfirm(true)}
              className="w-full min-h-[44px] py-2.5 px-4 rounded-xl bg-neutral-100 dark:bg-neutral-900 hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-900 dark:text-white border border-neutral-200 dark:border-neutral-800 font-bold text-xs active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span>{t.logout}</span>
            </button>
          ) : (
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="w-full min-h-[44px] py-2.5 px-4 rounded-xl bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 font-bold text-xs active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" />
              <span>{t.login}</span>
            </button>
          )}
        </div>

        {/* Footer Brand */}
        <div className="text-center pt-2 space-y-0.5">
          <p className="text-xs font-semibold text-neutral-500 tracking-wide">
            {t.appName} · {t.tagline}
          </p>
          <p className="text-[10px] text-neutral-400">{t.members}: {members.length}</p>
        </div>
      </main>

      {/* Invite Family Modal */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Share2 className="w-4 h-4 text-neutral-900 dark:text-white" />
                <h3 className="text-sm font-bold text-neutral-900 dark:text-white">{t.inviteTitle}</h3>
              </div>
              <button
                onClick={() => setIsInviteModalOpen(false)}
                className="min-w-[44px] min-h-[44px] p-1 rounded-full text-neutral-400 hover:text-black dark:hover:text-white flex items-center justify-center"
                aria-label={t.close}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-neutral-600 dark:text-neutral-400">
              {t.inviteDesc}
            </p>

            <div className="p-5 rounded-2xl bg-[#faf6ee] border border-[#e7ddc8] flex flex-col items-center justify-center space-y-1.5">
              <span className="font-display text-4xl text-[#1c1917]">S</span>
              <span className="font-mono2 text-[10px] text-[#9a3412] tracking-widest">{t.appName} · 1910</span>
            </div>

            <button
              onClick={shareInvite}
              className="w-full min-h-[44px] py-2 px-3 rounded-xl bg-[#1c1917] dark:bg-[#faf6ee] text-[#faf6ee] dark:text-[#1c1917] font-semibold text-xs flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
              {copiedInvite ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
              {copiedInvite ? t.linkCopied : t.inviteTitle}
            </button>
          </div>
        </div>
      )}

      {/* Logout Confirmation */}
      {showLogOutConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/75 p-4 animate-fade-in">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white flex items-center justify-center mx-auto">
              <LogOut className="w-5 h-5" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-neutral-900 dark:text-white">{t.logout}?</h3>
              <p className="text-xs text-neutral-500">
                {t.loggedOutNotice}
              </p>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShowLogOutConfirm(false)}
                className="flex-1 min-h-[44px] py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-semibold text-xs hover:bg-neutral-200 dark:hover:bg-neutral-700"
              >
                {t.cancel}
              </button>
              <button
                onClick={() => {
                  setShowLogOutConfirm(false);
                  logout();
                }}
                className="flex-1 min-h-[44px] py-2 rounded-xl bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 font-semibold text-xs shadow-sm"
              >
                {t.logout}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
