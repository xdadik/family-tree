import React, { useEffect, useState } from 'react';
import { LockKeyhole, LogIn, ShieldCheck, UserRound, Globe, X, KeyRound } from 'lucide-react';
import { useFamily } from '../../context/FamilyContext';
import { api, apiConfigured } from '../../utils/api';

export const LoginModal: React.FC = () => {
  const {
    login,
    t,
    currentUser,
    isLoginModalOpen,
    setIsLoginModalOpen,
    setIsLanguageModalOpen,
    language,
    logout,
    serverOnline,
    members,
    openMemberProfile,
  } = useFamily();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  // First-run owner setup (server has zero accounts)
  const [needsSetup, setNeedsSetup] = useState(false);
  const [setupKey, setSetupKey] = useState('');
  const [setupName, setSetupName] = useState('');
  const [setupLogin, setSetupLogin] = useState('');
  const [setupPassword, setSetupPassword] = useState('');

  useEffect(() => {
    if (currentUser || !apiConfigured()) return;
    api
      .health()
      .then((h) => {
        if (h.users === 0) setNeedsSetup(true);
      })
      .catch(() => {
        // offline — login form stays, will fail gracefully
      });
  }, [currentUser]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError('');
    if (!apiConfigured()) {
      setError(t.connectionError);
      setBusy(false);
      return;
    }
    // Phones love adding trailing spaces / capitals — strip them, passwords never start/end with spaces here
    const success = await login(username.trim(), password.trim());
    setBusy(false);
    if (!success) {
      // Distinguish wrong credentials from unreachable server
      try {
        await api.health();
        setError(t.incorrectPassword);
      } catch {
        setError(t.connectionError);
      }
      setPassword('');
    } else {
      setUsername('');
      setPassword('');
    }
  };

  const handleSetup = async (event: React.FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      await api.setup({
        key: setupKey.trim(),
        login: setupLogin.trim().toLowerCase(),
        password: setupPassword.trim(),
        name: setupName.trim(),
      });
      const success = await login(setupLogin.trim().toLowerCase(), setupPassword.trim());
      if (success) {
        setNeedsSetup(false);
        setSetupKey('');
        setSetupPassword('');
      } else {
        setError(t.incorrectPassword);
      }
    } catch {
      setError(t.importFailed);
    } finally {
      setBusy(false);
    }
  };

  // When logged in and modal opened manually (account card), show account with close.
  if (currentUser && isLoginModalOpen) {
    const initial = (currentUser.name || currentUser.username || '?').charAt(0).toUpperCase();
    const myProfile = currentUser.familyMemberId
      ? members.find((m) => m.id === currentUser.familyMemberId)
      : undefined;
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-5 py-8 backdrop-blur-sm animate-fade-in" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
        <div className="w-full max-w-sm rounded-[2rem] border border-neutral-200 bg-white p-6 shadow-2xl dark:border-neutral-800 dark:bg-neutral-900">
          <div className="flex items-center justify-between mb-4">
            <span className="font-mono2 text-[11px] uppercase tracking-[0.2em] text-[#9a3412] dark:text-[#e8b26a]">{t.appName}</span>
            <button
              onClick={() => setIsLoginModalOpen(false)}
              className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full text-neutral-400 hover:text-black dark:hover:text-white"
              aria-label={t.close}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-[#1c1917] dark:bg-[#faf6ee] text-[#faf6ee] dark:text-[#1c1917] font-bold flex items-center justify-center">
              {initial}
            </div>
            <div className="min-w-0">
              <h2 className="text-base font-bold truncate">{currentUser.name}</h2>
              <p className="text-xs text-neutral-500 truncate">@{currentUser.username} · {currentUser.role}</p>
              {!serverOnline && (
                <p className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold">offline</p>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setIsLoginModalOpen(false)}
              className="flex-1 h-12 rounded-xl bg-neutral-100 dark:bg-neutral-800 font-bold text-sm"
            >
              {t.close}
            </button>
            {myProfile ? (
              <button
                onClick={() => {
                  setIsLoginModalOpen(false);
                  openMemberProfile(myProfile.id);
                }}
                className="flex-1 h-12 rounded-xl bg-[#1c1917] dark:bg-[#faf6ee] text-[#faf6ee] dark:text-[#1c1917] font-bold text-sm"
              >
                {t.viewProfile}
              </button>
            ) : (
              <button
                onClick={() => {
                  logout();
                  setUsername('');
                  setPassword('');
                }}
                className="flex-1 h-12 rounded-xl bg-[#1c1917] dark:bg-[#faf6ee] text-[#faf6ee] dark:text-[#1c1917] font-bold text-sm"
              >
                {t.logout}
              </button>
            )}
          </div>
          <button
            onClick={() => {
              logout();
              setUsername('');
              setPassword('');
            }}
            className="mt-2 w-full min-h-[40px] rounded-xl text-xs font-semibold text-neutral-400 hover:text-rose-600"
          >
            {t.logout}
          </button>
        </div>
      </div>
    );
  }

  if (currentUser && !isLoginModalOpen) return null;

  const langCode = language === 'uz-latn' ? 'UZ' : language === 'uz-cyrl' ? 'ЎЗ' : language === 'en' ? 'EN' : 'RU';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-neutral-100 px-5 py-8 dark:bg-neutral-950 overflow-y-auto" style={{ paddingTop: 'env(safe-area-inset-top)', paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <div className="w-full max-w-sm rounded-[2rem] border border-neutral-200 bg-white p-6 shadow-2xl dark:border-neutral-800 dark:bg-neutral-900 my-auto">
        <div className="flex items-center justify-end mb-2">
          <button
            onClick={() => setIsLanguageModalOpen(true)}
            className="min-h-[44px] px-3 rounded-xl border border-neutral-300 dark:border-neutral-700 text-xs font-bold flex items-center gap-1"
            aria-label={t.language}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{langCode}</span>
          </button>
        </div>
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#1c1917] text-[#faf6ee] dark:bg-[#faf6ee] dark:text-[#1c1917]">
            <ShieldCheck className="h-7 w-7" />
          </div>
          <p className="font-mono2 mb-2 text-[11px] uppercase tracking-[0.24em] text-[#9a3412] dark:text-[#e8b26a]">{t.appName} · Qizilkarvon</p>
          <h1 className="font-display text-[26px] tracking-tight text-neutral-950 dark:text-white">
            {needsSetup ? t.getStarted : t.login}
          </h1>
          <p className="mt-2 text-sm text-neutral-500">{t.enterCredentials}</p>
          {!serverOnline && apiConfigured() && (
            <p className="mt-1 text-[11px] font-semibold text-amber-600 dark:text-amber-400">offline — cached data</p>
          )}
        </div>

        {error && (
          <div role="alert" className="mb-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm font-medium text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300">
            {error}
          </div>
        )}

        {needsSetup ? (
          <form onSubmit={handleSetup} className="space-y-4">
            <label className="block space-y-1.5">
              <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">Setup key</span>
              <span className="relative block">
                <KeyRound className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                <input
                  value={setupKey}
                  onChange={(event) => setSetupKey(event.target.value)}
                  className="h-12 w-full rounded-xl border border-neutral-300 bg-neutral-50 pl-10 pr-3 font-mono2 text-sm outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                  placeholder="bootstrap key"
                  required
                />
              </span>
            </label>
            <label className="block space-y-1.5">
              <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">{t.fullName}</span>
              <input
                value={setupName}
                onChange={(event) => setSetupName(event.target.value)}
                className="h-12 w-full rounded-xl border border-neutral-300 bg-neutral-50 px-3 text-base outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                placeholder="Dadajon X"
                required
              />
            </label>
            <label className="block space-y-1.5">
              <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">{t.username}</span>
              <input
                value={setupLogin}
                onChange={(event) => setSetupLogin(event.target.value.toLowerCase().replace(/\s+/g, ''))}
                className="h-12 w-full rounded-xl border border-neutral-300 bg-neutral-50 px-3 text-base outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                placeholder="admin"
                required
              />
            </label>
            <label className="block space-y-1.5">
              <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">{t.password}</span>
              <input
                type="password"
                value={setupPassword}
                onChange={(event) => setSetupPassword(event.target.value)}
                className="h-12 w-full rounded-xl border border-neutral-300 bg-neutral-50 px-3 text-base outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                placeholder="••••••••"
                minLength={4}
                required
              />
            </label>
            <button
              type="submit"
              disabled={busy}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#1c1917] px-4 text-sm font-bold text-[#faf6ee] shadow-lg transition hover:bg-[#9a3412] active:scale-[0.98] dark:bg-[#faf6ee] dark:text-[#1c1917] dark:hover:bg-[#e8b26a] disabled:opacity-60"
            >
              {t.getStarted}
            </button>
          </form>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block space-y-1.5">
              <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">{t.username}</span>
              <span className="relative block">
                <UserRound className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                <input
                  autoComplete="username"
                  autoCapitalize="off"
                  autoCorrect="off"
                  spellCheck={false}
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  className="h-12 w-full rounded-xl border border-neutral-300 bg-neutral-50 pl-10 pr-3 text-base text-neutral-950 outline-none transition focus:border-neutral-950 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                  placeholder="login"
                  required
                />
              </span>
            </label>

            <label className="block space-y-1.5">
              <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">{t.password}</span>
              <span className="relative block">
                <LockKeyhole className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                <input
                  autoComplete="current-password"
                  autoCapitalize="off"
                  autoCorrect="off"
                  spellCheck={false}
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="h-12 w-full rounded-xl border border-neutral-300 bg-neutral-50 pl-10 pr-3 text-base text-neutral-950 outline-none transition focus:border-neutral-950 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                  placeholder="••••••••"
                  required
                />
              </span>
            </label>

            <button
              type="submit"
              disabled={busy}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#1c1917] px-4 text-sm font-bold text-[#faf6ee] shadow-lg transition hover:bg-[#9a3412] active:scale-[0.98] dark:bg-[#faf6ee] dark:text-[#1c1917] dark:hover:bg-[#e8b26a] disabled:opacity-60"
            >
              <LogIn className="h-4 w-4" />
              {t.signIn}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
