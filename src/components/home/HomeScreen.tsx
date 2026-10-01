import React, { useMemo } from 'react';
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
import { Avatar } from '../common/Avatar';

export const HomeScreen: React.FC = () => {
  const {
    members,
    events,
    activities,
    setActiveTab,
    setIsAddMemberOpen,
    setIsPhotosGalleryOpen,
    setIsEventsOpen,
    setIsQuickActionsOpen,
    setIsFamilyDetailsOpen,
    setEditingMember,
    openMemberProfile,
    isAdmin,
    setIsLoginModalOpen,
    language,
    t,
  } = useFamily();

  const generationsCount = new Set(members.map((m) => m.generation || 1)).size || 1;
  const nextEvent = useMemo(() => {
    if (events.length === 0) return null;
    const today = new Date().toISOString().slice(0, 10);
    const upcoming = events
      .filter((e) => e.date >= today)
      .sort((a, b) => a.date.localeCompare(b.date));
    if (upcoming.length > 0) return upcoming[0];
    return [...events].sort((a, b) => b.date.localeCompare(a.date))[0] || null;
  }, [events]);

  const todayStr = useMemo(() => {
    try {
      return new Date().toLocaleDateString(language === 'en' ? 'en-GB' : language === 'ru' ? 'ru-RU' : 'uz-UZ', {
        day: 'numeric',
        month: 'long',
        weekday: 'long',
      });
    } catch {
      return '';
    }
  }, [language]);

  return (
    <div className="min-h-full pb-24 text-neutral-900 dark:text-neutral-100 transition-colors">
      {/* Top Header */}
      <Header />

      <main className="px-5 space-y-6 pt-2">
        {/* Family Overview — archival editorial card, not AI hero */}
        <section className="relative overflow-hidden rounded-2xl paper-surface dark:bg-[#211b14] border border-[#e7ddc8] dark:border-[#3a3128] p-5 shadow-sm transition-colors">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1.5 z-10 min-w-0">
              <span className="font-mono2 text-[10px] uppercase tracking-[0.18em] text-[#9a3412] dark:text-[#e8b26a] block">
                {todayStr} · Qizilkarvon
              </span>
              <h3 className="font-display text-[26px] leading-tight ink-heading">{t.ourFamilyTree}</h3>
              <p className="font-mono2 text-[11px] text-neutral-600 dark:text-neutral-400">
                {members.length} {t.members} <span aria-hidden="true">·</span> {generationsCount} {t.generations}
              </p>
              <p className="font-display italic text-[13px] text-neutral-600 dark:text-neutral-300 leading-relaxed">
                “{t.tagline}”
              </p>

              <div className="pt-2 flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('tree')}
                  className="inline-flex min-h-[44px] items-center gap-2 px-4 py-2.5 bg-[#1c1917] hover:bg-[#9a3412] dark:bg-[#faf6ee] dark:hover:bg-[#e8b26a] dark:text-[#1c1917] active:scale-95 text-[#faf6ee] text-xs font-bold rounded-xl shadow-sm transition-all group"
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
                    className="inline-flex min-h-[44px] items-center gap-1.5 px-3 py-2.5 bg-transparent border border-[#d6c9ab] dark:border-[#57534e] hover:border-[#9a3412] text-neutral-900 dark:text-white text-xs font-semibold rounded-xl active:scale-95 transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{t.addMember}</span>
                  </button>
                )}
              </div>
            </div>

            {/* Hand-set family monogram — warm, not AI tree icon */}
            <div className="w-[72px] h-[88px] rounded-xl bg-[#1c1917] dark:bg-[#faf6ee] flex flex-col items-center justify-center shadow-sm flex-shrink-0">
              <span className="font-display text-3xl text-[#faf6ee] dark:text-[#1c1917] leading-none">S</span>
              <span className="font-mono2 text-[9px] text-[#e8b26a] dark:text-[#9a3412] mt-1 tracking-widest">1910</span>
            </div>
          </div>

          {/* Member avatars ribbon */}
          <div className="mt-4 pt-3 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between gap-2">
            <div className="flex -space-x-2 overflow-hidden">
              {members.length > 0 ? (
                members.slice(0, 5).map((m) => (
                  <span key={m.id} className="inline-block rounded-full ring-2 ring-neutral-100 dark:ring-neutral-900">
                    <Avatar src={m.avatarUrl} name={m.fullName} size="xs" />
                  </span>
                ))
              ) : (
                <span className="text-xs text-neutral-500 italic">{t.noMembersYet}</span>
              )}
              {members.length > 5 && (
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-neutral-200 dark:bg-neutral-800 ring-2 ring-neutral-100 dark:ring-neutral-900 text-[10px] font-bold text-neutral-700 dark:text-neutral-300">
                  +{members.length - 5}
                </div>
              )}
            </div>
            <button
              onClick={() => setIsFamilyDetailsOpen(true)}
              className="text-xs text-neutral-500 dark:text-neutral-400 font-medium underline underline-offset-2 min-h-[44px]"
            >
              {t.appName} · {members.length} {t.members}
            </button>
          </div>
        </section>

        {/* 4 Tactile Monochrome Quick Action Buttons */}
        <section>
          <div className="grid grid-cols-4 gap-3">
            {/* Add Member */}
            <div className="flex flex-col items-center gap-1.5 text-center">
              <button
                onClick={() => {
                  if (!isAdmin) {
                    setIsLoginModalOpen(true);
                  } else {
                    setEditingMember(null);
                    setIsAddMemberOpen(true);
                  }
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
        {nextEvent ? (
          <section className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex items-center gap-3.5 shadow-sm transition-colors">
            <div className="w-11 h-11 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 flex items-center justify-center flex-shrink-0 text-neutral-900 dark:text-white">
              <Clock className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
                <span className="font-semibold text-neutral-900 dark:text-white uppercase tracking-wider text-[10px]">
                  {t.upcomingEvent} · {nextEvent.type}
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
              className="min-w-[44px] min-h-[44px] p-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 active:scale-95 transition-all flex items-center justify-center"
              aria-label={t.viewProfile}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </section>
        ) : (
          <section className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-dashed border-neutral-300 dark:border-neutral-700 flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center flex-shrink-0">
              <Calendar className="w-5 h-5 text-neutral-400" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-bold">{t.upcomingEvent}</h4>
              <p className="text-xs text-neutral-500">{t.noUpcomingEvents}</p>
            </div>
            <button
              onClick={() => {
                if (!isAdmin) setIsLoginModalOpen(true);
                else setIsEventsOpen(true);
              }}
              className="min-h-[44px] px-3 rounded-xl bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 text-xs font-bold"
            >
              {t.createEvent}
            </button>
          </section>
        )}

        {/* Recent Activity Section */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-neutral-900 dark:text-white tracking-tight">{t.recentActivity}</h3>
            <button
              onClick={() => setIsFamilyDetailsOpen(true)}
              className="min-h-[44px] px-2 text-xs font-semibold text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors"
            >
              {t.seeAll}
            </button>
          </div>

          <div className="space-y-2">
            {activities.length > 0 ? (
              activities.slice(0, 4).map((activity) => (
                <button
                  key={activity.id}
                  onClick={() => {
                    if (activity.targetMemberId) {
                      openMemberProfile(activity.targetMemberId);
                    } else if (activity.type === 'photo_added') {
                      setIsPhotosGalleryOpen(true);
                    } else if (activity.type === 'event_created') {
                      setIsEventsOpen(true);
                    } else {
                      setIsFamilyDetailsOpen(true);
                    }
                  }}
                  className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-950 dark:hover:border-neutral-700 transition-all cursor-pointer group active:scale-[0.99] shadow-sm text-left"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {activity.avatarUrl ? (
                      <Avatar src={activity.avatarUrl} name={activity.title} size="md" />
                    ) : (
                      <div className="w-11 h-11 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-600 dark:text-neutral-300 flex-shrink-0">
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
                </button>
              ))
            ) : (
              <div className="text-center py-6 text-xs text-neutral-500">
                {t.noUpcomingEvents}
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
            {t.appName} Family Heritage
          </span>
        </section>
      </main>
    </div>
  );
};
