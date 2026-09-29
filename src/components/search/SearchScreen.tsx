import React, { useState, useMemo } from 'react';
import {
  Search,
  Mic,
  MicOff,
  User,
  MapPin,
  Calendar,
  Image,
  BookOpen,
  ChevronRight,
  X,
  Sparkles,
} from 'lucide-react';
import { useFamily } from '../../context/FamilyContext';

export const SearchScreen: React.FC = () => {
  const {
    members,
    events,
    photos,
    notes,
    openMemberProfile,
    setIsPhotosGalleryOpen,
    setIsEventsOpen,
    setIsFamilyDetailsOpen,
  } = useFamily();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeChip, setActiveChip] = useState<'All' | 'Members' | 'Places' | 'Events' | 'Photos' | 'Memories'>('All');
  const [isListening, setIsListening] = useState(false);

  const chips = ['All', 'Members', 'Places', 'Events', 'Photos', 'Memories'] as const;

  // Simulate voice speech input
  const toggleVoice = () => {
    if (!isListening) {
      setIsListening(true);
      // Simulate recognized speech after 1.5s
      setTimeout(() => {
        setSearchQuery('Aisha');
        setIsListening(false);
      }, 1500);
    } else {
      setIsListening(false);
    }
  };

  const results = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    // 1. Members
    const matchingMembers = members
      .filter((m) => {
        if (!q) return true;
        return (
          m.fullName.toLowerCase().includes(q) ||
          m.relationLabel.toLowerCase().includes(q) ||
          m.birthPlace.toLowerCase().includes(q) ||
          (m.profession && m.profession.toLowerCase().includes(q))
        );
      })
      .map((m) => ({
        type: 'member' as const,
        id: m.id,
        title: m.fullName,
        subtitle: `${m.relationLabel} • ${m.birthYear}`,
        extra: m.birthPlace,
        avatarUrl: m.avatarUrl,
        raw: m,
      }));

    // 2. Events
    const matchingEvents = events
      .filter((e) => {
        if (!q) return true;
        return (
          e.title.toLowerCase().includes(q) ||
          e.location.toLowerCase().includes(q) ||
          e.description.toLowerCase().includes(q)
        );
      })
      .map((e) => ({
        type: 'event' as const,
        id: e.id,
        title: e.title,
        subtitle: `Event • ${e.date}`,
        extra: e.location,
        avatarUrl: e.coverUrl || 'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=300&q=80',
        raw: e,
      }));

    // 3. Photos
    const matchingPhotos = photos
      .filter((p) => {
        if (!q) return true;
        return (
          p.title.toLowerCase().includes(q) ||
          (p.location && p.location.toLowerCase().includes(q)) ||
          (p.description && p.description.toLowerCase().includes(q))
        );
      })
      .map((p) => ({
        type: 'photo' as const,
        id: p.id,
        title: p.title,
        subtitle: `Photo • ${p.date}`,
        extra: p.location || 'Uzbekistan',
        avatarUrl: p.url,
        raw: p,
      }));

    // 4. Places
    const matchingPlaces = Array.from(new Set(members.map((m) => m.birthPlace)))
      .filter((place) => !q || place.toLowerCase().includes(q))
      .map((place, idx) => ({
        type: 'place' as const,
        id: `place_${idx}`,
        title: place,
        subtitle: 'Ancestral Homeland',
        extra: `${members.filter((m) => m.birthPlace === place).length} relatives born here`,
        avatarUrl: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=300&q=80',
      }));

    // 5. Memories
    const matchingMemories = notes
      .filter((n) => !q || n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q))
      .map((n) => ({
        type: 'memory' as const,
        id: n.id,
        title: n.title,
        subtitle: `Story by ${n.authorName}`,
        extra: n.date,
        avatarUrl: 'https://images.unsplash.com/photo-1485546246426-74dc88dec4d9?auto=format&fit=crop&w=300&q=80',
      }));

    if (activeChip === 'Members') return matchingMembers;
    if (activeChip === 'Places') return matchingPlaces;
    if (activeChip === 'Events') return matchingEvents;
    if (activeChip === 'Photos') return matchingPhotos;
    if (activeChip === 'Memories') return matchingMemories;

    return [...matchingMembers, ...matchingEvents, ...matchingPhotos, ...matchingPlaces, ...matchingMemories];
  }, [members, events, photos, notes, searchQuery, activeChip]);

  const handleResultClick = (item: any) => {
    if (item.type === 'member') {
      openMemberProfile(item.id);
    } else if (item.type === 'photo') {
      setIsPhotosGalleryOpen(true);
    } else if (item.type === 'event') {
      setIsEventsOpen(true);
    } else if (item.type === 'memory' || item.type === 'place') {
      setIsFamilyDetailsOpen(true);
    }
  };

  return (
    <div className="min-h-full pb-24 text-slate-100 animate-fade-in">
      {/* Top Search Bar matching mockup */}
      <div className="sticky top-0 z-20 px-5 pt-4 pb-3 bg-slate-950/90 backdrop-blur-xl border-b border-slate-800/80 space-y-3">
        <h2 className="text-xl font-bold text-white tracking-tight">Search</h2>

        {/* Input Field with voice icon */}
        <div className="relative flex items-center">
          <Search className="absolute left-3.5 w-5 h-5 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, relation, or place..."
            className="w-full pl-11 pr-20 py-3 rounded-2xl bg-slate-900 border border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm text-white placeholder-slate-400 outline-none transition-all shadow-inner"
          />

          <div className="absolute right-2 flex items-center gap-1">
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="p-1.5 text-slate-400 hover:text-white rounded-full"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={toggleVoice}
              className={`p-2 rounded-xl transition-all ${
                isListening
                  ? 'bg-rose-500 text-white animate-pulse'
                  : 'text-slate-400 hover:text-emerald-400'
              }`}
              title="Voice Search"
              aria-label="Voice search"
            >
              <Mic className="w-4 h-4" />
            </button>
          </div>
        </div>

        {isListening && (
          <div className="px-3 py-1.5 bg-rose-500/20 border border-rose-500/40 rounded-xl text-xs text-rose-300 flex items-center gap-2 animate-pulse">
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            Listening... Speak now (e.g. &quot;Aisha&quot; or &quot;Rashid&quot;)
          </div>
        )}

        {/* Filter Chips Bar matching mockup */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {chips.map((chip) => {
            const isActive = activeChip === chip;
            return (
              <button
                key={chip}
                onClick={() => setActiveChip(chip)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                    : 'bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {chip}
              </button>
            );
          })}
        </div>
      </div>

      {/* Results List matching mockup */}
      <main className="px-5 pt-3 space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-400 font-medium pb-1">
          <span>Results ({results.length})</span>
          {searchQuery && <span>Query: &quot;{searchQuery}&quot;</span>}
        </div>

        {results.length > 0 ? (
          results.map((item) => (
            <div
              key={`${item.type}_${item.id}`}
              onClick={() => handleResultClick(item)}
              className="w-full flex items-center justify-between p-3 rounded-2xl bg-slate-900/80 hover:bg-slate-850 border border-slate-800/80 hover:border-emerald-500/40 cursor-pointer active:scale-[0.99] transition-all group shadow-sm"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <img
                  src={item.avatarUrl}
                  alt=""
                  className="w-12 h-12 rounded-full object-cover border border-slate-700/80 flex-shrink-0 group-hover:border-emerald-500/50 transition-colors"
                />
                <div className="min-w-0">
                  <h4 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors truncate">
                    {item.title}
                  </h4>
                  <p className="text-xs text-emerald-400 font-medium truncate mt-0.5">
                    {item.subtitle}
                  </p>
                  {item.extra && (
                    <span className="text-[11px] text-slate-400 truncate block">
                      {item.extra}
                    </span>
                  )}
                </div>
              </div>

              <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-slate-300 group-hover:translate-x-0.5 transition-all flex-shrink-0 ml-2" />
            </div>
          ))
        ) : (
          <div className="text-center py-16 space-y-3">
            <div className="w-14 h-14 rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-slate-500">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">No results found</h3>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              We couldn&apos;t find any relatives, places or memories matching &quot;{searchQuery}&quot;. Try adjusting your search term.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};
