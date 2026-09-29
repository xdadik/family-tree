import React, { useState } from 'react';
import {
  ArrowLeft,
  Plus,
  Calendar,
  Clock,
  MapPin,
  X,
  Lock,
} from 'lucide-react';
import { useFamily } from '../../context/FamilyContext';
import { FamilyEvent } from '../../types/family';

export const EventsModal: React.FC = () => {
  const {
    isEventsOpen,
    setIsEventsOpen,
    events,
    members,
    addEvent,
    openMemberProfile,
    isAdmin,
    setIsLoginModalOpen,
    t,
  } = useFamily();

  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [eventTitle, setEventTitle] = useState('');
  const [eventType, setEventType] = useState<FamilyEvent['type']>('reunion');
  const [eventDate, setEventDate] = useState('2026-10-25');
  const [eventTime, setEventTime] = useState('14:00');
  const [eventLocation, setEventLocation] = useState('Toshkent');
  const [eventDesc, setEventDesc] = useState('');
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>(
    members.map((m) => m.id)
  );

  if (!isEventsOpen) return null;

  const handleOpenAdd = () => {
    if (!isAdmin) {
      alert(t.readOnlyNotice);
      setIsLoginModalOpen(true);
      return;
    }
    setSelectedParticipants(members.map((m) => m.id));
    setIsAddEventOpen(true);
  };

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm overflow-hidden animate-fade-in">
      <div className="relative w-full max-w-md h-full bg-white dark:bg-neutral-950 flex flex-col overflow-y-auto transition-colors">
        {/* Header */}
        <div className="sticky top-0 z-20 flex items-center justify-between px-5 py-3.5 bg-white/95 dark:bg-neutral-950/95 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800 transition-colors">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsEventsOpen(false)}
              className="p-2 -ml-1 text-neutral-500 hover:text-neutral-900 dark:hover:text-white rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 active:scale-95"
              aria-label="Back"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <h2 className="text-base font-bold text-neutral-900 dark:text-white tracking-tight">
                {t.familyEvents}
              </h2>
              <p className="text-[11px] text-neutral-500 font-medium">
                {events.length} {t.events.toLowerCase()}
              </p>
            </div>
          </div>

          <button
            onClick={handleOpenAdd}
            className="p-2 rounded-xl bg-neutral-950 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-200 text-white dark:text-neutral-950 active:scale-95 shadow-sm flex items-center gap-1 text-xs font-bold"
            aria-label="Create event"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">{t.createEvent}</span>
          </button>
        </div>

        {/* Events List */}
        <main className="p-5 flex-1 space-y-4">
          {events.length === 0 ? (
            <div className="text-center py-12 space-y-2">
              <Calendar className="w-10 h-10 text-neutral-400 mx-auto" />
              <p className="text-xs text-neutral-500 font-medium">Hozircha rejalashtirilgan tadbirlar yo&apos;q</p>
            </div>
          ) : (
            events.map((event) => (
              <div
                key={event.id}
                className="rounded-3xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 overflow-hidden shadow-sm transition-colors"
              >
                {event.coverUrl && (
                  <div className="relative h-32 w-full overflow-hidden">
                    <img src={event.coverUrl} alt="" className="w-full h-full object-cover grayscale contrast-125" />
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-transparent" />
                    <span className="absolute top-3 left-3 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black/70 text-white backdrop-blur-sm">
                      {event.type}
                    </span>
                  </div>
                )}

                <div className="p-4 space-y-2">
                  <h3 className="text-sm font-bold text-neutral-900 dark:text-white leading-tight">{event.title}</h3>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">{event.description}</p>

                  <div className="grid grid-cols-2 gap-2 pt-1 text-xs text-neutral-500">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>{event.date}</span>
                    </div>
                    {event.time && (
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 flex-shrink-0" />
                        <span>{event.time}</span>
                      </div>
                    )}
                    <div className="col-span-2 flex items-center gap-1.5 truncate">
                      <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                      <span className="truncate">{event.location}</span>
                    </div>
                  </div>

                  {/* Participants Avatars */}
                  {event.participantIds && event.participantIds.length > 0 && (
                    <div className="pt-2 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
                      <div className="flex -space-x-1.5 overflow-hidden">
                        {event.participantIds.map((pid) => {
                          const m = members.find((mem) => mem.id === pid);
                          if (!m) return null;
                          return (
                            <img
                              key={m.id}
                              src={m.avatarUrl}
                              alt={m.fullName}
                              onClick={() => openMemberProfile(m.id)}
                              className="w-6 h-6 rounded-full ring-2 ring-white dark:ring-neutral-900 object-cover cursor-pointer hover:scale-110 transition-transform"
                              title={m.fullName}
                            />
                          );
                        })}
                      </div>
                      <span className="text-[11px] text-neutral-400 font-medium">
                        {event.participantIds.length} ishtirokchi
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </main>

        {/* Add Event Modal Drawer */}
        {isAddEventOpen && (
          <div className="fixed inset-0 z-60 flex items-end justify-center bg-black/80 backdrop-blur-sm animate-fade-in">
            <div className="bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800 rounded-t-3xl p-5 max-w-md w-full space-y-4 max-h-[85vh] overflow-y-auto animate-slide-up shadow-2xl transition-colors">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-neutral-900 dark:text-white">{t.createEvent}</h3>
                <button
                  onClick={() => setIsAddEventOpen(false)}
                  className="p-1 rounded-full text-neutral-400 hover:text-black dark:hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateEvent} className="space-y-3.5">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                    {t.eventTitle}
                  </label>
                  <input
                    type="text"
                    value={eventTitle}
                    onChange={(e) => setEventTitle(e.target.value)}
                    placeholder="Masalan: Sirojovlar Oila Yig'ilishi"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-xs text-neutral-900 dark:text-white outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">Turi</label>
                    <select
                      value={eventType}
                      onChange={(e) => setEventType(e.target.value as any)}
                      className="w-full px-3 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-xs text-neutral-900 dark:text-white outline-none"
                    >
                      <option value="reunion">Yig&apos;ilish / Reunion</option>
                      <option value="birthday">Tug&apos;ilgan kun / Birthday</option>
                      <option value="anniversary">Yillik sana / Anniversary</option>
                      <option value="wedding">To&apos;y / Wedding</option>
                      <option value="gathering">Marosim / Gathering</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                      {t.eventDate}
                    </label>
                    <input
                      type="date"
                      value={eventDate}
                      onChange={(e) => setEventDate(e.target.value)}
                      required
                      className="w-full px-3 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-xs text-neutral-900 dark:text-white outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                      {t.eventTime}
                    </label>
                    <input
                      type="time"
                      value={eventTime}
                      onChange={(e) => setEventTime(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-xs text-neutral-900 dark:text-white outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                      {t.eventLocation}
                    </label>
                    <input
                      type="text"
                      value={eventLocation}
                      onChange={(e) => setEventLocation(e.target.value)}
                      placeholder="Toshkent..."
                      required
                      className="w-full px-3 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-xs text-neutral-900 dark:text-white outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">Tafsilotlar</label>
                  <textarea
                    rows={2}
                    value={eventDesc}
                    onChange={(e) => setEventDesc(e.target.value)}
                    placeholder="Tadbir haqida eslatma va reja..."
                    className="w-full px-3 py-2 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-xs text-neutral-900 dark:text-white outline-none resize-none"
                  />
                </div>

                {members.length > 0 && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                      Ishtirokchilarni belgilash
                    </label>
                    <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto p-1 border border-neutral-200 dark:border-neutral-800 rounded-xl">
                      {members.map((m) => {
                        const isSelected = selectedParticipants.includes(m.id);
                        return (
                          <button
                            type="button"
                            key={m.id}
                            onClick={() => toggleParticipant(m.id)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                              isSelected
                                ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950'
                                : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
                            }`}
                          >
                            {m.fullName}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-xl bg-neutral-950 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-200 text-white dark:text-neutral-950 font-bold text-xs shadow-sm active:scale-95 transition-all"
                >
                  {t.save}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
