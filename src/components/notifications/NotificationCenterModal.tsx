import React from 'react';
import {
  ArrowLeft,
  CheckCheck,
  Bell,
  Cake,
  Image as ImageIcon,
  Calendar,
  Users,
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
    t,
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
        return <Cake className="w-4 h-4 text-neutral-800 dark:text-neutral-200" />;
      case 'photo':
        return <ImageIcon className="w-4 h-4 text-neutral-800 dark:text-neutral-200" />;
      case 'event':
        return <Calendar className="w-4 h-4 text-neutral-800 dark:text-neutral-200" />;
      default:
        return <Users className="w-4 h-4 text-neutral-800 dark:text-neutral-200" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm overflow-hidden animate-fade-in">
      <div className="relative w-full max-w-md h-full bg-white dark:bg-neutral-950 flex flex-col overflow-y-auto transition-colors">
        {/* Header */}
        <div className="sticky top-0 z-20 flex items-center justify-between px-5 py-3.5 bg-white/95 dark:bg-neutral-950/95 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800 transition-colors">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsNotificationsOpen(false)}
              className="min-w-[44px] min-h-[44px] p-2 -ml-1 text-neutral-500 hover:text-neutral-900 dark:hover:text-white rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 active:scale-95 flex items-center justify-center"
              aria-label={t.close}
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <h2 className="text-base font-bold text-neutral-900 dark:text-white tracking-tight">{t.notifications}</h2>
          </div>

          <button
            onClick={markAllNotificationsRead}
            className="min-h-[44px] flex items-center gap-1 px-2 text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white"
            aria-label={t.markAllRead}
          >
            <CheckCheck className="w-3.5 h-3.5" />
            <span>{t.markAllRead}</span>
          </button>
        </div>

        {/* Notifications list */}
        <main className="p-4 flex-1 space-y-2.5">
          {notifications.length === 0 ? (
            <div className="text-center py-16 space-y-2 text-neutral-400">
              <Bell className="w-8 h-8 mx-auto stroke-1" />
              <p className="text-sm font-semibold">{t.noNotifications}</p>
            </div>
          ) : (
          notifications.map((n) => (
            <button
              key={n.id}
              onClick={() => handleNotificationClick(n)}
              className={`w-full p-3.5 rounded-2xl border transition-all active:scale-[0.99] flex items-start gap-3.5 text-left min-h-[56px] ${
                !n.read
                  ? 'bg-neutral-50 dark:bg-neutral-900 border-neutral-300 dark:border-neutral-700 shadow-sm'
                  : 'bg-white dark:bg-neutral-950/60 border-neutral-200 dark:border-neutral-800 text-neutral-500'
              }`}
            >
              <div className="p-2 rounded-xl bg-neutral-200 dark:bg-neutral-800 flex-shrink-0 mt-0.5">
                {getIcon(n.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <h4 className={`text-xs font-bold truncate ${!n.read ? 'text-neutral-900 dark:text-white' : 'text-neutral-600 dark:text-neutral-400'}`}>
                    {n.title}
                  </h4>
                  <span className="text-[10px] text-neutral-400 flex-shrink-0 font-medium">
                    {n.timestamp}
                  </span>
                </div>
                <p className="text-xs text-neutral-600 dark:text-neutral-300 mt-0.5 leading-relaxed">{n.message}</p>
              </div>
              {!n.read && (
                <span className="w-2 h-2 rounded-full bg-neutral-950 dark:bg-white flex-shrink-0 mt-2" />
              )}
            </button>
          )))}
        </main>
      </div>
    </div>
  );
};
