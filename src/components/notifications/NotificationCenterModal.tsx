import React from 'react';
import {
  ArrowLeft,
  CheckCheck,
  Bell,
  Cake,
  Image as ImageIcon,
  Calendar,
  Users,
  ChevronRight,
} from 'lucide-react';
import { useFamily } from '../../context/FamilyContext';

export const NotificationCenterModal: React.FC = () => {
  const {
    isNotificationsOpen,
    setIsNotificationsOpen,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    openMemberProfile,
    setIsEventsOpen,
    setIsPhotosGalleryOpen,
  } = useFamily();

  if (!isNotificationsOpen) return null;

  const handleNotificationClick = (n: any) => {
    markNotificationRead(n.id);
    setIsNotificationsOpen(false);
    if (n.type === 'birthday' && n.targetId) {
      openMemberProfile(n.targetId);
    } else if (n.type === 'photo') {
      setIsPhotosGalleryOpen(true);
    } else if (n.type === 'event') {
      setIsEventsOpen(true);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'birthday':
        return <Cake className="w-4 h-4 text-amber-400" />;
      case 'photo':
        return <ImageIcon className="w-4 h-4 text-blue-400" />;
      case 'event':
        return <Calendar className="w-4 h-4 text-emerald-400" />;
      default:
        return <Users className="w-4 h-4 text-teal-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md overflow-hidden animate-fade-in">
      <div className="relative w-full max-w-md h-full bg-slate-950 flex flex-col overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 z-20 flex items-center justify-between px-5 py-3.5 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsNotificationsOpen(false)}
              className="p-1.5 -ml-1 text-slate-400 hover:text-white rounded-full bg-slate-900 border border-slate-800 active:scale-95"
              aria-label="Back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h2 className="text-base font-bold text-white tracking-tight">Notifications</h2>
          </div>

          <button
            onClick={markAllNotificationsRead}
            className="flex items-center gap-1 text-xs font-semibold text-emerald-400 hover:text-emerald-300"
          >
            <CheckCheck className="w-4 h-4" />
            Mark all read
          </button>
        </div>

        {/* Notifications list */}
        <main className="p-4 flex-1 space-y-2.5">
          {notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => handleNotificationClick(n)}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer active:scale-[0.99] flex items-start gap-3.5 ${
                !n.read
                  ? 'bg-slate-900/90 border-emerald-500/40 shadow-sm'
                  : 'bg-slate-900/40 border-slate-800 text-slate-400'
              }`}
            >
              <div className="p-2.5 rounded-xl bg-slate-800 flex-shrink-0 mt-0.5">
                {getIcon(n.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <h4 className={`text-sm font-bold truncate ${!n.read ? 'text-white' : 'text-slate-300'}`}>
                    {n.title}
                  </h4>
                  <span className="text-[10px] text-slate-500 flex-shrink-0 font-medium">
                    {n.timestamp}
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">{n.message}</p>
              </div>
              {!n.read && (
                <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0 mt-2" />
              )}
            </div>
          ))}
        </main>
      </div>
    </div>
  );
};
