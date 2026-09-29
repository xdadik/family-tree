import React, { useState } from 'react';
import {
  Users,
  Bell,
  Lock,
  Moon,
  Sun,
  Cloud,
  HelpCircle,
  Info,
  LogOut,
  ChevronRight,
  Share2,
  QrCode,
  Download,
  Upload,
  Check,
  Shield,
  Copy,
  X,
} from 'lucide-react';
import { useFamily } from '../../context/FamilyContext';

export const SettingsScreen: React.FC = () => {
  const {
    currentUser,
    theme,
    setTheme,
    resetToDefaults,
    exportDataJson,
    importDataJson,
    setIsOnboardingOpen,
  } = useFamily();

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isPermissionsModalOpen, setIsPermissionsModalOpen] = useState(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const [copiedInvite, setCopiedInvite] = useState(false);
  const [showLogOutConfirm, setShowLogOutConfirm] = useState(false);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const handleExport = () => {
    const jsonStr = exportDataJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `karimov_family_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const content = event.target?.result as string;
          if (content) {
            const ok = importDataJson(content);
            if (ok) alert('Backup restored successfully!');
            else alert('Failed to parse family backup.');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const copyInviteLink = () => {
    navigator.clipboard?.writeText(
      'https://familytree.app/invite/karimov-family-2026?token=fam_88f9a2c'
    );
    setCopiedInvite(true);
    setTimeout(() => setCopiedInvite(false), 2000);
  };

  return (
    <div className="min-h-full pb-24 text-slate-100 animate-fade-in">
      {/* Top Header */}
      <div className="sticky top-0 z-20 px-5 pt-4 pb-3 bg-slate-950/90 backdrop-blur-xl border-b border-slate-800">
        <h2 className="text-xl font-bold text-white tracking-tight">Settings</h2>
      </div>

      <main className="px-5 pt-4 space-y-5">
        {/* User Profile Card matching mockup */}
        <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl flex items-center gap-3.5">
          <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-emerald-500/60 shadow-md flex-shrink-0">
            <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <h3 className="text-base font-bold text-white truncate">{currentUser.name}</h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 uppercase tracking-wider">
                {currentUser.role}
              </span>
            </div>
            <p className="text-xs text-slate-400 truncate mt-0.5">{currentUser.email}</p>
          </div>
        </div>

        {/* Setting Groups matching mockup */}
        <div className="space-y-1.5">
          {/* Family Management */}
          <div
            onClick={() => setIsInviteModalOpen(true)}
            className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-900/80 hover:bg-slate-850 border border-slate-800/80 cursor-pointer active:scale-[0.99] transition-all group"
          >
            <div className="flex items-center gap-3.5">
              <div className="p-2 rounded-xl bg-slate-800 text-slate-300 group-hover:text-emerald-400 transition-colors">
                <Users className="w-5 h-5 text-emerald-400" />
              </div>
              <span className="text-sm font-semibold text-slate-100">Family Management</span>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-slate-300" />
          </div>

          {/* Notifications Toggle */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800/80">
            <div className="flex items-center gap-3.5">
              <div className="p-2 rounded-xl bg-slate-800 text-slate-300">
                <Bell className="w-5 h-5 text-amber-400" />
              </div>
              <span className="text-sm font-semibold text-slate-100">Notifications</span>
            </div>
            <button
              onClick={() => setNotificationsEnabled(!notificationsEnabled)}
              className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                notificationsEnabled ? 'bg-emerald-500' : 'bg-slate-700'
              }`}
              aria-label="Toggle notifications"
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  notificationsEnabled ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Privacy & Security */}
          <div
            onClick={() => setIsPermissionsModalOpen(true)}
            className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-900/80 hover:bg-slate-850 border border-slate-800/80 cursor-pointer active:scale-[0.99] transition-all group"
          >
            <div className="flex items-center gap-3.5">
              <div className="p-2 rounded-xl bg-slate-800 text-slate-300 group-hover:text-emerald-400 transition-colors">
                <Lock className="w-5 h-5 text-teal-400" />
              </div>
              <span className="text-sm font-semibold text-slate-100">Privacy & Security</span>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-slate-300" />
          </div>

          {/* Appearance Toggle */}
          <div
            onClick={toggleTheme}
            className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-900/80 hover:bg-slate-850 border border-slate-800/80 cursor-pointer active:scale-[0.99] transition-all group"
          >
            <div className="flex items-center gap-3.5">
              <div className="p-2 rounded-xl bg-slate-800 text-slate-300 group-hover:text-emerald-400 transition-colors">
                {theme === 'dark' ? (
                  <Moon className="w-5 h-5 text-indigo-400" />
                ) : (
                  <Sun className="w-5 h-5 text-amber-400" />
                )}
              </div>
              <span className="text-sm font-semibold text-slate-100">Appearance</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <span className="capitalize">{theme === 'dark' ? 'Dark' : 'Light'}</span>
              <ChevronRight className="w-4 h-4 text-slate-500" />
            </div>
          </div>

          {/* Backup & Sync */}
          <div
            onClick={handleExport}
            className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-900/80 hover:bg-slate-850 border border-slate-800/80 cursor-pointer active:scale-[0.99] transition-all group"
          >
            <div className="flex items-center gap-3.5">
              <div className="p-2 rounded-xl bg-slate-800 text-slate-300 group-hover:text-emerald-400 transition-colors">
                <Cloud className="w-5 h-5 text-cyan-400" />
              </div>
              <span className="text-sm font-semibold text-slate-100">Backup & Sync</span>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-slate-300" />
          </div>

          {/* Help & Support */}
          <div
            onClick={() => setIsAboutModalOpen(true)}
            className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-900/80 hover:bg-slate-850 border border-slate-800/80 cursor-pointer active:scale-[0.99] transition-all group"
          >
            <div className="flex items-center gap-3.5">
              <div className="p-2 rounded-xl bg-slate-800 text-slate-300 group-hover:text-emerald-400 transition-colors">
                <HelpCircle className="w-5 h-5 text-purple-400" />
              </div>
              <span className="text-sm font-semibold text-slate-100">Help & Support</span>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-slate-300" />
          </div>

          {/* About App */}
          <div
            onClick={() => setIsAboutModalOpen(true)}
            className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-900/80 hover:bg-slate-850 border border-slate-800/80 cursor-pointer active:scale-[0.99] transition-all group"
          >
            <div className="flex items-center gap-3.5">
              <div className="p-2 rounded-xl bg-slate-800 text-slate-300 group-hover:text-emerald-400 transition-colors">
                <Info className="w-5 h-5 text-blue-400" />
              </div>
              <span className="text-sm font-semibold text-slate-100">About App</span>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-slate-300" />
          </div>
        </div>

        {/* Log Out Button matching mockup */}
        <div className="pt-3">
          <button
            onClick={() => setShowLogOutConfirm(true)}
            className="w-full py-3.5 px-4 rounded-2xl bg-rose-600/90 hover:bg-rose-500 text-white font-bold text-sm shadow-xl shadow-rose-600/20 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            <span>Log Out</span>
          </button>
        </div>

        {/* Brand Tagline */}
        <div className="text-center pt-2 space-y-1">
          <p className="text-xs font-semibold text-emerald-400 tracking-wide">
            FamilyTree • Our Family. Our Story.
          </p>
          <p className="text-[11px] text-slate-500">Version 2.4.0 (2026 Mobile Build)</p>
        </div>
      </main>

      {/* Invite Family Modal */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Share2 className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white">Invite Family Members</h3>
              </div>
              <button
                onClick={() => setIsInviteModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Share this invite link with relatives to give them access to the Karimov Family Tree.
            </p>

            {/* QR Code visual preview */}
            <div className="p-4 rounded-2xl bg-white flex flex-col items-center justify-center space-y-2">
              <QrCode className="w-32 h-32 text-slate-900" />
              <span className="text-[10px] font-bold text-slate-600">Scan to join Karimov Family</span>
            </div>

            <div className="space-y-2">
              <button
                onClick={copyInviteLink}
                className="w-full py-2.5 px-3 rounded-xl bg-emerald-600 text-white font-semibold text-xs flex items-center justify-center gap-2 active:scale-95 transition-transform"
              >
                {copiedInvite ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copiedInvite ? 'Copied Link!' : 'Copy Invitation Link'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Permissions Modal */}
      {isPermissionsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-teal-400" />
                <h3 className="text-base font-bold text-white">Family Permissions</h3>
              </div>
              <button
                onClick={() => setIsPermissionsModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/80">
                <div className="flex justify-between font-bold text-emerald-400">
                  <span>Owner (You)</span>
                  <span>Full Access</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">Manage tree, invite members, edit privacy & export data</p>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50">
                <div className="flex justify-between font-bold text-slate-200">
                  <span>Admin (Parents)</span>
                  <span>Edit Access</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">Can add relatives, albums, photos and events</p>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-800/30 border border-slate-700/40">
                <div className="flex justify-between font-bold text-slate-300">
                  <span>Member (Relatives)</span>
                  <span>Contribute</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">Can upload photos, comments and personal notes</p>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-800/20 border border-slate-700/30">
                <div className="flex justify-between font-bold text-slate-400">
                  <span>Viewer</span>
                  <span>Read Only</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">Can view family tree and photo albums</p>
              </div>
            </div>

            <button
              onClick={() => setIsPermissionsModalOpen(false)}
              className="w-full py-2.5 rounded-xl bg-slate-800 text-slate-300 font-semibold text-xs hover:bg-slate-700"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* About App Modal */}
      {isAboutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl text-center">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 p-0.5 mx-auto">
              <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-8 h-8 text-emerald-400 fill-current">
                  <path d="M12 2C7.58 2 4 5.58 4 10c0 3.19 1.88 5.95 4.6 7.24L8 22h8l-.6-4.76C18.12 15.95 20 13.19 20 10c0-4.42-3.58-8-8-8zm0 2c3.31 0 6 2.69 6 6 0 2.22-1.21 4.15-3 5.19V11h-2v3.19c-.31.06-.65.09-1 .09s-.69-.03-1-.09V11h-2v4.19c-1.79-1.04-3-2.97-3-5.19 0-3.31 2.69-6 6-6zm-1 12h2v4h-2v-4z" />
                </svg>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold text-white">FamilyTree</h3>
              <p className="text-xs text-emerald-400 font-semibold mt-0.5">“Our Family. Our Story.”</p>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Designed to keep your family connected across generations. Store precious memories, explore ancestry lines, and preserve life lore forever.
            </p>

            <button
              onClick={() => setIsAboutModalOpen(false)}
              className="w-full py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-md shadow-emerald-600/30"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Logout Confirmation */}
      {showLogOutConfirm && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/80 p-4 animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/15 text-rose-400 flex items-center justify-center mx-auto">
              <LogOut className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-white">Log Out?</h3>
              <p className="text-xs text-slate-400">
                You can return anytime or view the onboarding introduction again.
              </p>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShowLogOutConfirm(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-semibold text-xs hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowLogOutConfirm(false);
                  setIsOnboardingOpen(true);
                }}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 text-white font-semibold text-xs hover:bg-rose-500 shadow-md shadow-rose-600/30"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
