import React, { useEffect, useState } from 'react';
import { LockKeyhole, LogIn, ShieldCheck, UserRound } from 'lucide-react';
import { useFamily } from '../../context/FamilyContext';

export const LoginModal: React.FC = () => {
  const { login, t, currentUser, isLoginModalOpen } = useFamily();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    setError('');
  }, []);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const success = login(username, password);
    if (!success) {
      setError(t.incorrectPassword);
      setPassword('');
    }
  };

  if (currentUser && !isLoginModalOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-neutral-100 px-5 py-8 dark:bg-neutral-950">
      <div className="w-full max-w-sm rounded-[2rem] border border-neutral-200 bg-white p-6 shadow-2xl dark:border-neutral-800 dark:bg-neutral-900">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-neutral-950 text-white dark:bg-white dark:text-neutral-950">
            <ShieldCheck className="h-7 w-7" />
          </div>
          <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.24em] text-neutral-400">Sirojovlar</p>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-950 dark:text-white">{t.login}</h1>
          <p className="mt-2 text-sm text-neutral-500">{t.enterCredentials}</p>
        </div>

        {error && (
          <div role="alert" className="mb-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm font-medium text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block space-y-1.5">
            <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">{t.username}</span>
            <span className="relative block">
              <UserRound className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
              <input
                autoFocus
                autoComplete="username"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                className="h-12 w-full rounded-xl border border-neutral-300 bg-neutral-50 pl-10 pr-3 text-sm text-neutral-950 outline-none transition focus:border-neutral-950 focus:ring-2 focus:ring-neutral-950/10 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:focus:border-white"
                placeholder="admin"
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
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="h-12 w-full rounded-xl border border-neutral-300 bg-neutral-50 pl-10 pr-3 text-sm text-neutral-950 outline-none transition focus:border-neutral-950 focus:ring-2 focus:ring-neutral-950/10 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:focus:border-white"
                placeholder="••••••••"
                required
              />
            </span>
          </label>

          <button
            type="submit"
            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-neutral-950 px-4 text-sm font-bold text-white shadow-lg transition hover:bg-neutral-800 active:scale-[0.98] dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200"
          >
            <LogIn className="h-4 w-4" />
            {t.signIn}
          </button>
        </form>

        <p className="mt-6 text-center text-[11px] leading-relaxed text-neutral-400">
          Kirgandan keyin sizning rolingiz ilova ichida ko&apos;rsatiladi.
        </p>
      </div>
    </div>
  );
};
