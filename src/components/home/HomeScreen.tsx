import React from 'react';
import {
  UserPlus,
  Image,
  Calendar,
  MoreHorizontal,
  ChevronRight,
  ArrowRight,
  Sparkles,
  MapPin,
  Clock,
  Heart,
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
    openMemberProfile,
  } = useFamily();

  // Calculate stats
  const generationsCount = new Set(members.map((m) => m.generation)).size || 3;
  const nextEvent = events.length > 0 ? events[0] : null;

  return (
    <div className="min-h-full pb-24 text-slate-100 animate-fade-in">
      {/* Top Header */}
      <Header />

      <main className="px-5 space-y-6 pt-2">
        {/* Family Overview Hero Card matching mockup */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-800/90 via-slate-850 to-slate-900 border border-slate-700/60 p-5 shadow-xl">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-44 h-44 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex items-center justify-between gap-4">
            <div className="space-y-1.5 z-10">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wide bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                <Sparkles className="w-3 h-3" />
                Karimov Heritage
              </span>
              <h3 className="text-xl font-extrabold text-white tracking-tight">Our Family Tree</h3>
              <p className="text-sm text-slate-400 font-medium">
                {members.length} members • {generationsCount} generations
              </p>

              <div className="pt-2">
                <button
                  onClick={() => setActiveTab('tree')}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white text-sm font-semibold rounded-xl shadow-lg shadow-emerald-600/30 transition-all group"
                >
                  <span>View Tree</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>

            {/* Stylized Family Tree Graphic badge */}
            <div className="relative flex-shrink-0 w-24 h-24 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-center p-3 shadow-inner">
              <svg viewBox="0 0 100 100" className="w-full h-full text-emerald-400 drop-shadow">
                {/* Stylized trunk and branches */}
                <path
                  d="M50 88 V58 M50 58 C45 48 35 44 26 40 M50 58 C55 48 65 44 74 40 M50 48 V30 M42 38 C35 32 30 26 30 18 M58 38 C65 32 70 26 70 18 M50 30 C45 22 45 16 50 12"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinecap="round"
                  fill="none"
                />
                {/* Lush foliage nodes */}
                <circle cx="26" cy="38" r="7" className="fill-emerald-400/90" />
                <circle cx="74" cy="38" r="7" className="fill-emerald-400/90" />
                <circle cx="30" cy="18" r="6" className="fill-teal-300" />
                <circle cx="70" cy="18" r="6" className="fill-teal-300" />
                <circle cx="50" cy="12" r="8" className="fill-emerald-300" />
                <circle cx="50" cy="32" r="6" className="fill-emerald-500" />
              </svg>
            </div>
          </div>

          {/* Mini generation avatars ribbon */}
          <div className="mt-4 pt-3 border-t border-slate-700/50 flex items-center justify-between">
            <div className="flex -space-x-2 overflow-hidden">
              {members.slice(0, 5).map((m) => (
                <img
                  key={m.id}
                  src={m.avatarUrl}
                  alt={m.fullName}
                  className="inline-block h-7 w-7 rounded-full ring-2 ring-slate-800 object-cover"
                />
              ))}
              {members.length > 5 && (
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-700 ring-2 ring-slate-800 text-[10px] font-bold text-slate-200">
                  +{members.length - 5}
                </div>
              )}
            </div>
            <span className="text-xs text-slate-400 font-medium">Ancestry active</span>
          </div>
        </section>

        {/* 4 Circular Quick Action Buttons matching mockup */}
        <section>
          <div className="grid grid-cols-4 gap-3">
            {/* Add Member */}
            <div className="flex flex-col items-center gap-1.5 text-center">
              <button
                onClick={() => setIsAddMemberOpen(true)}
                className="w-14 h-14 rounded-2xl bg-slate-800/80 hover:bg-slate-750 border border-slate-700/70 hover:border-emerald-500/50 text-emerald-400 flex items-center justify-center shadow-md active:scale-95 transition-all group"
                aria-label="Add Member"
              >
                <UserPlus className="w-6 h-6 group-hover:scale-110 transition-transform text-emerald-400" />
              </button>
              <span className="text-xs font-semibold text-slate-200">Add Member</span>
            </div>

            {/* Photos */}
            <div className="flex flex-col items-center gap-1.5 text-center">
              <button
                onClick={() => setIsPhotosGalleryOpen(true)}
                className="w-14 h-14 rounded-2xl bg-slate-800/80 hover:bg-slate-750 border border-slate-700/70 hover:border-emerald-500/50 text-slate-200 flex items-center justify-center shadow-md active:scale-95 transition-all group"
                aria-label="Photos"
              >
                <Image className="w-6 h-6 group-hover:scale-110 transition-transform text-slate-200" />
              </button>
              <span className="text-xs font-semibold text-slate-200">Photos</span>
            </div>

            {/* Timeline / Events */}
            <div className="flex flex-col items-center gap-1.5 text-center">
              <button
                onClick={() => setIsEventsOpen(true)}
                className="w-14 h-14 rounded-2xl bg-slate-800/80 hover:bg-slate-750 border border-slate-700/70 hover:border-emerald-500/50 text-slate-200 flex items-center justify-center shadow-md active:scale-95 transition-all group"
                aria-label="Timeline Events"
              >
                <Calendar className="w-6 h-6 group-hover:scale-110 transition-transform text-slate-200" />
              </button>
              <span className="text-xs font-semibold text-slate-200">Timeline</span>
            </div>

            {/* More */}
            <div className="flex flex-col items-center gap-1.5 text-center">
              <button
                onClick={() => setIsQuickActionsOpen(true)}
                className="w-14 h-14 rounded-2xl bg-slate-800/80 hover:bg-slate-750 border border-slate-700/70 hover:border-emerald-500/50 text-slate-200 flex items-center justify-center shadow-md active:scale-95 transition-all group"
                aria-label="More actions"
              >
                <MoreHorizontal className="w-6 h-6 group-hover:scale-110 transition-transform text-slate-200" />
              </button>
              <span className="text-xs font-semibold text-slate-200">More</span>
            </div>
          </div>
        </section>

        {/* Upcoming Family Event highlight */}
        {nextEvent && (
          <section className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/50 flex items-center gap-3.5 hover:border-slate-600 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex flex-col items-center justify-center flex-shrink-0">
              <Clock className="w-5 h-5 text-amber-400" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300">
                  {nextEvent.type}
                </span>
                <span className="text-xs text-slate-400">{nextEvent.date}</span>
              </div>
              <h4 className="text-sm font-bold text-white truncate mt-0.5">{nextEvent.title}</h4>
              <p className="text-xs text-slate-400 truncate flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3 text-slate-500" />
                {nextEvent.location}
              </p>
            </div>
            <button
              onClick={() => setIsEventsOpen(true)}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white active:scale-95"
              aria-label="View Event Details"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </section>
        )}

        {/* Recent Activity Section matching mockup */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white tracking-tight">Recent Activity</h3>
            <button
              onClick={() => setIsEventsOpen(true)}
              className="text-xs font-semibold text-emerald-400 hover:text-emerald-300"
            >
              See all
            </button>
          </div>

          <div className="space-y-2">
            {activities.slice(0, 4).map((activity) => (
              <div
                key={activity.id}
                onClick={() => {
                  if (activity.targetMemberId) {
                    openMemberProfile(activity.targetMemberId);
                  } else {
                    setIsPhotosGalleryOpen(true);
                  }
                }}
                className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-slate-800/40 hover:bg-slate-800/80 border border-slate-700/40 transition-all cursor-pointer group active:scale-[0.99]"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {activity.avatarUrl ? (
                    <img
                      src={activity.avatarUrl}
                      alt=""
                      className="w-11 h-11 rounded-full object-cover border border-slate-600/60 flex-shrink-0"
                    />
                  ) : (
                    <div className="w-11 h-11 rounded-full bg-slate-700 flex items-center justify-center text-slate-300 flex-shrink-0">
                      <Heart className="w-5 h-5 text-emerald-400" />
                    </div>
                  )}

                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-slate-100 group-hover:text-emerald-400 transition-colors">
                      {activity.title}
                    </h4>
                    <p className="text-xs text-slate-400 truncate">{activity.description}</p>
                    <span className="text-[11px] text-slate-500 font-medium">{activity.timestamp}</span>
                  </div>
                </div>

                <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-slate-300 group-hover:translate-x-0.5 transition-all flex-shrink-0 ml-2" />
              </div>
            ))}
          </div>
        </section>

        {/* Family Quotes & Wisdom banner */}
        <section className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/30 to-slate-900 border border-emerald-900/40 text-center">
          <p className="text-xs italic text-emerald-300/90 font-serif">
            “A family is a haven in a heartless world. Our roots run deep and branch out with love.”
          </p>
          <span className="text-[10px] text-slate-400 uppercase tracking-widest block mt-1">
            — The Karimov Family Chronicle
          </span>
        </section>
      </main>
    </div>
  );
};
