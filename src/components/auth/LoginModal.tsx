import React, { useState } from 'react';
import { X, Shield, Eye, Lock, User, Check, Send, Phone } from 'lucide-react';
import { useFamily } from '../../context/FamilyContext';

export const LoginModal: React.FC = () => {
  const { isLoginModalOpen, setIsLoginModalOpen, login, currentUser, t } = useFamily();

  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin');
  const [selectedRole, setSelectedRole] = useState<'admin' | 'viewer'>('admin');
  const [error, setError] = useState('');

  if (!isLoginModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setError('Iltimos, loginni kiriting');
      return;
    }
    const success = login(username, password, selectedRole);
    if (!success) {
      setError('Login yoki parol noto\'g\'ri');
    }
  };

  const handleQuickAdmin = () => {
    login('admin', 'admin', 'admin');
  };

  const handleQuickViewer = () => {
    login('guest', 'guest', 'viewer');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in">
      <div className="w-full max-w-sm bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 shadow-2xl space-y-4 transition-colors">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 flex items-center justify-center font-bold">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-neutral-900 dark:text-white leading-tight">{t.login}</h3>
              <p className="text-[11px] text-neutral-500">Sirojovlar Shajarasi</p>
            </div>
          </div>
          <button
            onClick={() => setIsLoginModalOpen(false)}
            className="p-1.5 rounded-full text-neutral-400 hover:text-black dark:hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {error && (
          <div className="p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-xs font-semibold text-neutral-900 dark:text-white border border-neutral-300 dark:border-neutral-700">
            {error}
          </div>
        )}

        {/* Role Selector Tabs */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-neutral-100 dark:bg-neutral-800/80 rounded-2xl">
          <button
            type="button"
            onClick={() => {
              setSelectedRole('admin');
              setUsername('admin');
              setPassword('admin');
            }}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              selectedRole === 'admin'
                ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 shadow-sm'
                : 'text-neutral-500 hover:text-black dark:hover:text-white'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Admin</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setSelectedRole('viewer');
              setUsername('guest');
              setPassword('guest');
            }}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              selectedRole === 'viewer'
                ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 shadow-sm'
                : 'text-neutral-500 hover:text-black dark:hover:text-white'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Kuzatuvchi</span>
          </button>
        </div>

        <p className="text-[11px] text-neutral-500 leading-relaxed">
          {selectedRole === 'admin' ? t.adminNotice : t.readOnlyNotice}
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">{t.username}</label>
            <div className="relative flex items-center">
              <User className="absolute left-3 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin yoki username"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-xs text-neutral-900 dark:text-white outline-none focus:border-black dark:focus:border-white transition-colors"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">{t.password}</label>
            <div className="relative flex items-center">
              <Lock className="absolute left-3 w-4 h-4 text-neutral-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-xs text-neutral-900 dark:text-white outline-none focus:border-black dark:focus:border-white transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 rounded-xl bg-neutral-950 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-200 text-white dark:text-neutral-950 font-bold text-xs shadow-sm active:scale-95 transition-all"
          >
            {t.signIn} ({selectedRole === 'admin' ? t.admin : t.viewer})
          </button>
        </form>

        {/* Quick 1-click test buttons */}
        <div className="pt-2 border-t border-neutral-200 dark:border-neutral-800 space-y-1.5 text-center">
          <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">Tezkor kirish tugmalari</span>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleQuickAdmin}
              className="py-2 px-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 text-[11px] font-bold text-neutral-900 dark:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 active:scale-95 transition-all"
            >
              Admin sifatida kirish
            </button>
            <button
              onClick={handleQuickViewer}
              className="py-2 px-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 text-[11px] font-medium text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 active:scale-95 transition-all"
            >
              Kuzatuvchi sifatida kirish
            </button>
          </div>
        </div>

        {/* Contact info for Admin Zafarovich */}
        <div className="pt-2 text-center text-xs text-neutral-500 space-y-1">
          <p className="font-semibold text-neutral-700 dark:text-neutral-300">Yordam va Administrator bilan bog&apos;lanish:</p>
          <div className="flex items-center justify-center gap-3 text-[11px]">
            <a
              href="https://t.me/zafarov1ich"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 font-semibold text-neutral-900 dark:text-white hover:underline"
            >
              <Send className="w-3 h-3" />
              @zafarov1ich
            </a>
            <span aria-hidden="true">·</span>
            <a
              href="tel:+998948403106"
              className="flex items-center gap-1 font-semibold text-neutral-900 dark:text-white hover:underline"
            >
              <Phone className="w-3 h-3" />
              +998 94 840 31 06
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
