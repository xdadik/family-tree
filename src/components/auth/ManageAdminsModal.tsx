import React, { useState } from 'react';
import { X, ShieldCheck, UserPlus, Trash2, Key, User, Check, AlertCircle } from 'lucide-react';
import { useFamily } from '../../context/FamilyContext';

export const ManageAdminsModal: React.FC = () => {
  const {
    isManageAdminsOpen,
    setIsManageAdminsOpen,
    adminAccounts,
    addAdminAccount,
    removeAdminAccount,
    isBigAdmin,
    t,
  } = useFamily();

  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isManageAdminsOpen) return null;

  const handleCreateAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !username.trim() || !password.trim()) {
      setErrorMsg('Barcha maydonlarni to\'ldiring');
      return;
    }

    if (username.trim().length < 3) {
      setErrorMsg('Login kamida 3 ta belgidan iborat bo\'lishi kerak');
      return;
    }

    const success = addAdminAccount(username.trim(), password.trim(), name.trim());
    if (success) {
      setName('');
      setUsername('');
      setPassword('');
      setErrorMsg('');
      setSuccessMsg('Yangi admin muvaffaqiyatli qo\'shildi!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } else {
      setErrorMsg('Bu logindagi admin allaqachon mavjud');
    }
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in">
      <div className="w-full max-w-md bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto transition-colors">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 flex items-center justify-center font-bold shadow-sm">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-neutral-900 dark:text-white leading-tight">
                Adminlarni boshqarish
              </h3>
              <p className="text-[11px] text-neutral-500 font-medium">
                Bosh Administrator (Big Admin) boshqaruv paneli
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsManageAdminsOpen(false)}
            className="p-1.5 rounded-full text-neutral-400 hover:text-black dark:hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Info Notice */}
        <div className="p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
          Siz tayinlagan adminlar o&apos;z login va paroli orqali kirib, shajaraga yangi a&apos;zolar, tadbirlar va rasmlar kiritish huquqiga ega bo&apos;ladilar.
        </div>

        {/* Existing Admins List */}
        <div className="space-y-2">
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
            Mavjud Administratorlar ({adminAccounts.length})
          </span>

          <div className="space-y-2">
            {adminAccounts.map((adm) => {
              const isSuper = adm.role === 'super_admin';
              return (
                <div
                  key={adm.id}
                  className="p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-800 flex items-center justify-between shadow-sm"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 font-bold text-xs flex items-center justify-center flex-shrink-0">
                      {adm.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-xs font-bold text-neutral-900 dark:text-white truncate">
                          {adm.name}
                        </h4>
                        <span
                          className={`px-1.5 py-0.2 rounded text-[9px] font-extrabold uppercase ${
                            isSuper
                              ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950'
                              : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200'
                          }`}
                        >
                          {isSuper ? 'Big Admin' : 'Admin'}
                        </span>
                      </div>
                      <p className="text-[11px] text-neutral-500 font-mono truncate">
                        Login: <span className="font-semibold text-neutral-700 dark:text-neutral-300">{adm.username}</span>
                        {!isSuper && ` · Parol: ${adm.password}`}
                      </p>
                    </div>
                  </div>

                  {!isSuper && (
                    <button
                      onClick={() => removeAdminAccount(adm.id)}
                      className="p-2 rounded-xl text-neutral-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                      title="Adminlikni bekor qilish"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Add New Admin Form */}
        <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200 dark:border-neutral-800 space-y-3">
          <div className="flex items-center gap-2">
            <UserPlus className="w-4 h-4 text-neutral-900 dark:text-white" />
            <h4 className="text-xs font-bold text-neutral-900 dark:text-white">
              Yangi Admin tayinlash
            </h4>
          </div>

          {errorMsg && (
            <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-900 text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleCreateAdmin} className="space-y-2.5">
            <div>
              <label className="text-[11px] font-semibold text-neutral-600 dark:text-neutral-400 block mb-1">
                Ism familiyasi (masalan: Sanjar Sirojov)
              </label>
              <div className="relative flex items-center">
                <User className="absolute left-3 w-3.5 h-3.5 text-neutral-400" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ism familiyasi"
                  className="w-full pl-8 pr-3 py-2 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-xs text-neutral-900 dark:text-white outline-none focus:border-black dark:focus:border-white transition-colors"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-neutral-600 dark:text-neutral-400 block mb-1">
                Yangi login (username)
              </label>
              <div className="relative flex items-center">
                <ShieldCheck className="absolute left-3 w-3.5 h-3.5 text-neutral-400" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s+/g, ''))}
                  placeholder="masalan: sanjar"
                  className="w-full pl-8 pr-3 py-2 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-xs text-neutral-900 dark:text-white outline-none focus:border-black dark:focus:border-white transition-colors font-mono"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-neutral-600 dark:text-neutral-400 block mb-1">
                Parol
              </label>
              <div className="relative flex items-center">
                <Key className="absolute left-3 w-3.5 h-3.5 text-neutral-400" />
                <input
                  type="text"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Parolni kiriting"
                  className="w-full pl-8 pr-3 py-2 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-xs text-neutral-900 dark:text-white outline-none focus:border-black dark:focus:border-white transition-colors font-mono"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 font-bold text-xs shadow-sm active:scale-95 transition-all flex items-center justify-center gap-1.5"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Admin qilib qo&apos;shish</span>
            </button>
          </form>
        </div>

        {/* Close Button */}
        <button
          onClick={() => setIsManageAdminsOpen(false)}
          className="w-full py-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-semibold text-xs hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
        >
          {t.cancel}
        </button>
      </div>
    </div>
  );
};
