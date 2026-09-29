import React, { useState } from 'react';
import {
  ArrowLeft,
  Plus,
  Calendar,
  Clock,
  MapPin,
  Users,
  CheckCircle,
  X,
  Sparkles,
} from 'lucide-react';
import { useFamily } from '../../context/FamilyContext';
import { FamilyEvent } from '../../types/family';

export const EventsModal: React.FC = () => {
  const { isEventsOpen, setIsEventsOpen, events, members, addEvent, openMemberProfile } =
    useFamily();

  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [eventTitle, setEventTitle] = useState('');
  const [eventType, setEventType] = useState<FamilyEvent['type']>('reunion');
  const [eventDate, setEventDate] = useState('2026-10-25');
  const [eventTime, setEventTime] = useState('14:00');
  const [eventLocation, setEventLocation] = useState('Tashkent Garden Chalet');
  const [eventDesc, setEventDesc] = useState('');
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>(['m1', 'm2', 'm3', 'm4', 'm6']);

  if (!isEventsOpen) return null;

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventTitle.trim()) return;

    addEvent({
      title: eventTitle.trim(),
      type: eventType,
      date: eventDate,
      time: eventTime,
      location: eventLocation.trim(),
      description: eventDesc.trim(),
      participantIds: selectedParticipants,
      coverUrl:
        eventType === 'birthday'
          ? 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=800&q=80'
          : 'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=800&q=80',
    });

    setEventTitle('');
    setEventDesc('');
    setIsAddEventOpen(false);
  };

  const toggleParticipant = (id: string) => {
    setSelectedParticipants((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md overflow-hidden animate-fade-in">
      <div className="relative w-full max-w-md h-full bg-slate-950 flex flex-col overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 z-20 flex items-center justify-between px-5 py-3.5 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsEventsOpen(false)}
              className="p-1.5 -ml-1 text-slate-400 hover:text-white rounded-full bg-slate-900 border border-slate-800 active:scale-95"
              aria-label="Back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">Family Events & Dates</h2>
              <p className="text-[11px] text-slate-400 font-medium">Reunions, birthdays & traditions</p>
            </div>
          </div>

          <button
            onClick={() => setIsAddEventOpen(true)}
            className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white active:scale-95 shadow-md shadow-emerald-600/30"
            aria-label="Create event"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Events List */}
        <main className="p-5 flex-1 space-y-4">
          {events.map((event) => (
            <div
              key={event.id}
              className="rounded-3xl bg-slate-900 border border-slate-800/80 overflow-hidden shadow-xl"
            >
              {event.coverUrl && (
                <div className="relative h-32 w-full overflow-hidden">
                  <img src={event.coverUrl} alt="" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-black/60 backdrop-blur-md text-emerald-400 border border-emerald-500/30">
                    {event.type}
                  </span>
                </div>
              )}

              <div className="p-4 space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-base font-bold text-white leading-tight">{event.title}</h3>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">{event.description}</p>

                <div className="grid grid-cols-2 gap-2 pt-1 text-xs text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                    <span>{event.date}</span>
                  </div>
                  {event.time && (
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                      <span>{event.time}</span>
                    </div>
                  )}
                  <div className="col-span-2 flex items-center gap-1.5 truncate">
                    <MapPin className="w-3.5 h-3.5 text-teal-400 flex-shrink-0" />
                    <span className="truncate">{event.location}</span>
                  </div>
                </div>

                {/* Participants */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <div className="flex -space-x-2">
                    {event.participantIds.slice(0, 5).map((pid) => {
                      const m = members.find((x) => x.id === pid);
                      if (!m) return null;
                      return (
                        <img
                          key={m.id}
                          src={m.avatarUrl}
                          alt={m.fullName}
                          title={m.fullName}
                          className="w-7 h-7 rounded-full object-cover ring-2 ring-slate-900"
                        />
                      );
                    })}
                  </div>
                  <span className="text-[11px] font-semibold text-emerald-400">
                    {event.participantIds.length} relatives attending
                  </span>
                </div>
              </div>
            </div>
          ))}
        </main>

        {/* Add Event Modal */}
        {isAddEventOpen && (
          <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/85 p-4 animate-fade-in">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 max-w-sm w-full space-y-4 shadow-2xl">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white">Create Family Event</h3>
                <button
                  onClick={() => setIsAddEventOpen(false)}
                  className="p-1 rounded-full text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateEvent} className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Event Title *</label>
                  <input
                    type="text"
                    value={eventTitle}
                    onChange={(e) => setEventTitle(e.target.value)}
                    placeholder="e.g. Grand Autumn Plov Gathering"
                    required
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300">Type</label>
                    <select
                      value={eventType}
                      onChange={(e) => setEventType(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white outline-none capitalize"
                    >
                      <option value="reunion">Reunion</option>
                      <option value="birthday">Birthday</option>
                      <option value="anniversary">Anniversary</option>
                      <option value="wedding">Wedding</option>
                      <option value="gathering">Gathering</option>
                      <option value="memorial">Memorial</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300">Date</label>
                    <input
                      type="date"
                      value={eventDate}
                      onChange={(e) => setEventDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Location</label>
                  <input
                    type="text"
                    value={eventLocation}
                    onChange={(e) => setEventLocation(e.target.value)}
                    placeholder="e.g. Chimgan Resort or Family Home"
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Description</label>
                  <textarea
                    rows={2}
                    value={eventDesc}
                    onChange={(e) => setEventDesc(e.target.value)}
                    placeholder="Event details, schedule or food plan..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 outline-none resize-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Invite Relatives</label>
                  <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                    {members.map((m) => {
                      const isInvited = selectedParticipants.includes(m.id);
                      return (
                        <button
                          type="button"
                          key={m.id}
                          onClick={() => toggleParticipant(m.id)}
                          className={`px-2.5 py-1 rounded-full text-xs transition-all ${
                            isInvited
                              ? 'bg-emerald-500 text-slate-950 font-bold'
                              : 'bg-slate-800 text-slate-400 hover:text-white'
                          }`}
                        >
                          {m.fullName.split(' ')[0]}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/30"
                >
                  Save & Announce Event
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
