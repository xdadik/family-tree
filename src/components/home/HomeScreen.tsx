import React from 'react';
import {
  UserPlus,
  Image,
  Calendar,
  MoreHorizontal,
  ChevronRight,
  ArrowRight,
  MapPin,
  Clock,
  Heart,
  Plus,
} from 'lucide-react';
import { useFamily } from '../../context/FamilyContext';
import { Header } from '../common/Header';

export const HomeScreen: React.FC = () => {
  const {
    members,
    events,
    photos,
    activities,
    setActiveTab,
    setIsAddMemberOpen,
    setIsPhotosGalleryOpen,
    setIsEventsOpen,
    setIsQuickActionsOpen,
    setEditingMember,
    openMemberProfile,
    isAdmin,
    t,
  } = useFamily();

  const generationsCount = new Set(members.map((m) => m.generation || 1)).size || 1;
  const nextEvent = events.length > 0 ? events[0] : null;

  return (
    <div className="min-h-full pb-24 text-neutral-900 dark:text-neutral-100 transition-colors">
      {/* Top Header */}
      <Header />

      <main className="px-5 space-y-6 pt-2">
        {/* Family Overview Hero Card */}
        <section className="relative overflow-hidden rounded-3xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-5 shadow-sm transition-colors">
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-1.5 z-10">
              <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 block tracking-wide uppercase">
                {t.appName}
              </span>
              <h3 className="text-xl font-extrabold text-neutral-950 dark:text-white tracking-tight">{t.ourFamilyTree}</h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 font-medium">
                {members.length} {t.members} <span aria-hidden="true">·</span> {generationsCount} {t.generations}
              </p>

              <div className="pt-2 flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('tree')}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-neutral-950 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-200 active:scale-95 text-white dark:text-neutral-950 text-xs font-bold rounded-xl shadow-sm transition-all group"
                >
                  <span>{t.viewTree}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </button>

                {isAdmin && (
                  <button
                    onClick={() => {
                      setEditingMember(null);
                      setIsAddMemberOpen(true);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-2.5 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 hover:border-black dark:hover:border-white text-neutral-900 dark:text-white text-xs font-semibold rounded-xl shadow-sm active:scale-95 transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{t.addMember}</span>
                  </button>
                )}
              </div>
            </div>

            {/* Stylized Family Tree Mark */}
            <div className="w-20 h-20 rounded-2xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700/80 flex items-center justify-center p-3 shadow-sm flex-shrink-0">
              <svg viewBox="0 0 100 100" className="w-full h-full text-neutral-900 dark:text-white">
                <path
                  d="M50 88 V58 M50 58 C45 48 35 44 26 40 M50 58 C55 48 65 44 74 40 M50 48 V30 M42 38 C35 32 30 26 30 18 M58 38 C65 32 70 26 70 18 M50 30 C45 22 45 16 50 12"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinecap="round"
                  fill="none"
                />
                <circle cx="26" cy="38" r="6" className="fill-current opacity-80" />
                <circle cx="74" cy="38" r="6" className="fill-current opacity-80" />
                <circle cx="30" cy="18" r="5" className="fill-current opacity-60" />
                <circle cx="70" cy="18" r="5" className="fill-current opacity-60" />
                <circle cx="50" cy="12" r="7" className="fill-current" />
              </svg>
            </div>
          </div>

          {/* Member avatars ribbon */}
          <div className="mt-4 pt-3 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
            <div className="flex -space-x-2 overflow-hidden">
              {members.length > 0 ? (
                members.slice(0, 5).map((m) => (
                  <img
                    key={m.id}
                    src={m.avatarUrl}
                    alt={m.fullName}
                    className="inline-block h-7 w-7 rounded-full ring-2 ring-neutral-100 dark:ring-neutral-900 object-cover"
                  />
                ))
              ) : (
                <span className="text-xs text-neutral-500 italic">{t.noMembersYet}</span>
              )}
              {members.length > 5 && (
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-neutral-200 dark:bg-neutral-800 ring-2 ring-neutral-100 dark:ring-neutral-900 text-[10px] font-bold text-neutral-700 dark:text-neutral-300">
                  +{members.length - 5}
                </div>
              )}
            </div>
            <span className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">Sirojovs Ancestry</span>
          </div>
        </section>

        {/* 4 Tactile Monochrome Quick Action Buttons */}
        <section>
          <div className="grid grid-cols-4 gap-3">
            {/* Add Member */}
            <div className="flex flex-col items-center gap-1.5 text-center">
              <button
                onClick={() => {
                  setEditingMember(null);
                  setIsAddMemberOpen(true);
                }}
                className="w-14 h-14 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-950 dark:hover:border-neutral-500 text-neutral-900 dark:text-white flex items-center justify-center shadow-sm active:scale-95 transition-all group"
                aria-label={t.addMember}
              >
                <UserPlus className="w-5 h-5 group-hover:scale-105 transition-transform" />
              </button>
              <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 truncate max-w-full">
                {t.addMember}
              </span>
            </div>

            {/* Photos */}
            <div className="flex flex-col items-center gap-1.5 text-center">
              <button
                onClick={() => setIsPhotosGalleryOpen(true)}
                className="w-14 h-14 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-950 dark:hover:border-neutral-500 text-neutral-900 dark:text-white flex items-center justify-center shadow-sm active:scale-95 transition-all group"
                aria-label={t.photos}
              >
                <Image className="w-5 h-5 group-hover:scale-105 transition-transform" />
              </button>
              <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 truncate max-w-full">
                {t.photos}
              </span>
            </div>

            {/* Timeline */}
            <div className="flex flex-col items-center gap-1.5 text-center">
              <button
                onClick={() => setIsEventsOpen(true)}
                className="w-14 h-14 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-950 dark:hover:border-neutral-500 text-neutral-900 dark:text-white flex items-center justify-center shadow-sm active:scale-95 transition-all group"
                aria-label={t.events}
              >
                <Calendar className="w-5 h-5 group-hover:scale-105 transition-transform" />
              </button>
              <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 truncate max-w-full">
                {t.events}
              </span>
            </div>

            {/* More */}
            <div className="flex flex-col items-center gap-1.5 text-center">
              <button
                onClick={() => setIsQuickActionsOpen(true)}
                className="w-14 h-14 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-950 dark:hover:border-neutral-500 text-neutral-900 dark:text-white flex items-center justify-center shadow-sm active:scale-95 transition-all group"
                aria-label={t.more}
              >
                <MoreHorizontal className="w-5 h-5 group-hover:scale-105 transition-transform" />
              </button>
              <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 truncate max-w-full">
                {t.more}
              </span>
            </div>
          </div>
        </section>

        {/* Upcoming Family Event */}
        {nextEvent && (
          <section className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex items-center gap-3.5 shadow-sm transition-colors">
            <div className="w-11 h-11 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 flex items-center justify-center flex-shrink-0 text-neutral-900 dark:text-white">
              <Clock className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
                <span className="font-semibold text-neutral-900 dark:text-white uppercase tracking-wider text-[10px]">
                  {nextEvent.type}
                </span>
                <span aria-hidden="true">·</span>
                <span>{nextEvent.date}</span>
              </div>
              <h4 className="text-sm font-bold text-neutral-900 dark:text-white truncate mt-0.5">{nextEvent.title}</h4>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3 text-neutral-400" />
                {nextEvent.location}
              </p>
            </div>
            <button
              onClick={() => setIsEventsOpen(true)}
              className="p-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 active:scale-95 transition-all"
              aria-label="View Event Details"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </section>
        )}

        {/* Recent Activity Section */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-neutral-900 dark:text-white tracking-tight">{t.recentActivity}</h3>
            <button
              onClick={() => setIsEventsOpen(true)}
              className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors"
            >
              {t.seeAll}
            </button>
          </div>

          <div className="space-y-2">
            {activities.length > 0 ? (
              activities.slice(0, 4).map((activity) => (
                <div
                  key={activity.id}
                  onClick={() => {
                    if (activity.targetMemberId) {
                      openMemberProfile(activity.targetMemberId);
                    } else {
                      setIsPhotosGalleryOpen(true);
                    }
                  }}
                  className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-950 dark:hover:border-neutral-700 transition-all cursor-pointer group active:scale-[0.99] shadow-sm"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {activity.avatarUrl ? (
                      <img
                        src={activity.avatarUrl}
                        alt=""
                        className="w-10 h-10 rounded-full object-cover border border-neutral-200 dark:border-neutral-700 flex-shrink-0"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-600 dark:text-neutral-300 flex-shrink-0">
                        <Heart className="w-4 h-4" />
                      </div>
                    )}

                    <div className="min-w-0">
                      <h4 className="text-sm font-bold text-neutral-900 dark:text-white truncate">
                        {activity.title}
                      </h4>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">{activity.description}</p>
                      <span className="text-[11px] text-neutral-400 dark:text-neutral-500 font-medium">{activity.timestamp}</span>
                    </div>
                  </div>

                  <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-white group-hover:translate-x-0.5 transition-all flex-shrink-0 ml-2" />
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-xs text-neutral-500">
                {t.recentActivity} mavjud emas.
              </div>
            )}
          </div>
        </section>

        {/* Editorial Heritage Tagline */}
        <section className="p-4 rounded-2xl bg-neutral-100 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 text-center">
          <p className="text-xs italic text-neutral-700 dark:text-neutral-300 font-serif leading-relaxed">
            “{t.tagline}”
          </p>
          <span className="text-[10px] text-neutral-400 dark:text-neutral-500 uppercase tracking-widest block mt-1.5 font-sans">
            Sirojovs Family Heritage
          </span>
        </section>
      </main>
    </div>
  );
};
