import React, { useState, useMemo } from 'react';
import {
  Search,
  Mic,
  ChevronRight,
  X,
  User,
  Calendar,
  Image as ImageIcon,
  MapPin,
  BookOpen,
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
    t,
  } = useFamily();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeChip, setActiveChip] = useState<'All' | 'Members' | 'Places' | 'Events' | 'Photos' | 'Memories'>('All');
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = React.useRef<any>(null);

  const chips = ['All', 'Members', 'Places', 'Events', 'Photos', 'Memories'] as const;

  const speechSupported =
    typeof window !== 'undefined' &&
    ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);

  const toggleVoice = () => {
    if (!speechSupported) return;
    try {
      if (isListening) {
        recognitionRef.current?.stop?.();
        setIsListening(false);
        return;
      }
      const Rec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const rec = new Rec();
      recognitionRef.current = rec;
      rec.lang = 'uz-UZ';
      rec.interimResults = false;
      rec.onresult = (e: any) => {
        const text = e.results?.[0]?.[0]?.transcript;
        if (text) setSearchQuery(text);
        setIsListening(false);
      };
      rec.onerror = () => setIsListening(false);
      rec.onend = () => setIsListening(false);
      rec.start();
      setIsListening(true);
    } catch {
      setIsListening(false);
    }
  };

  const getChipLabel = (chip: typeof chips[number]) => {
    switch (chip) {
      case 'All':
        return t.all;
      case 'Members':
        return t.members;
      case 'Places':
        return t.places;
      case 'Events':
        return t.events;
      case 'Photos':
        return t.photos;
      case 'Memories':
        return t.memories;
      default:
        return chip;
    }
  };

  const typeLabel = (type: string) => {
    switch (type) {
      case 'member':
        return t.members;
      case 'event':
        return t.events;
      case 'photo':
        return t.photos;
      case 'place':
        return t.places;
      case 'memory':
        return t.memories;
      default:
        return type;
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
        subtitle: `${m.relationLabel} · ${m.birthYear}`,
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
        subtitle: `${t.events} · ${e.date}`,
        extra: e.location,
        avatarUrl: e.coverUrl || '',
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
        subtitle: `${t.photos} · ${p.date}`,
        extra: p.location || 'O\'zbekiston',
        avatarUrl: p.url,
        raw: p,
      }));

    // 4. Places
    const placesMap = new Map<string, typeof matchingMembers>();
    members.forEach((m) => {
      if (m.birthPlace) {
        if (!placesMap.has(m.birthPlace)) placesMap.set(m.birthPlace, []);
        placesMap.get(m.birthPlace)!.push({
          type: 'member',
          id: m.id,
          title: m.fullName,
          subtitle: m.relationLabel,
          extra: m.birthPlace,
          avatarUrl: m.avatarUrl,
          raw: m,
        });
      }
    });

    const matchingPlaces: {
      type: 'place';
      id: string;
      title: string;
      subtitle: string;
      extra: string;
      avatarUrl?: string;
    }[] = [];

    placesMap.forEach((mems, place) => {
      if (!q || place.toLowerCase().includes(q)) {
        matchingPlaces.push({
          type: 'place',
          id: `place_${place}`,
          title: place,
          subtitle: `${mems.length} ${t.members}`,
          extra: t.birthPlace,
          avatarUrl: mems[0]?.avatarUrl,
        });
      }
    });

    // 5. Memories
    const matchingMemories = notes
      .filter((n) => {
        if (!q) return true;
        return n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q);
      })
      .map((n) => ({
        type: 'memory' as const,
        id: n.id,
        title: n.title,
        subtitle: `${n.authorName} · ${n.date}`,
        extra: n.category,
        avatarUrl: '',
        raw: n,
      }));

    if (activeChip === 'Members') return matchingMembers;
    if (activeChip === 'Places') return matchingPlaces;
    if (activeChip === 'Events') return matchingEvents;
    if (activeChip === 'Photos') return matchingPhotos;
    if (activeChip === 'Memories') return matchingMemories;

    return [...matchingMembers, ...matchingEvents, ...matchingPhotos, ...matchingPlaces, ...matchingMemories];
  }, [members, events, photos, notes, searchQuery, activeChip, t]);

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
    <div className="min-h-full pb-24 text-neutral-900 dark:text-neutral-100 transition-colors">
      {/* Top Search Bar */}
      <div className="sticky top-0 z-20 px-5 pt-4 pb-3 bg-white/95 dark:bg-neutral-950/95 backdrop-blur-xl border-b border-neutral-200 dark:border-neutral-800 space-y-3 transition-colors">
        <h2 className="text-lg font-bold text-neutral-900 dark:text-white tracking-tight">{t.search}</h2>

        {/* Input Field */}
        <div className="relative flex items-center">
          <Search className="absolute left-3.5 w-4 h-4 text-neutral-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full pl-10 pr-20 py-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 focus:border-neutral-950 dark:focus:border-white text-xs text-neutral-900 dark:text-white placeholder-neutral-400 outline-none transition-all shadow-inner"
          />

          <div className="absolute right-2 flex items-center gap-1">
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="min-w-[40px] min-h-[40px] p-1 text-neutral-400 hover:text-black dark:hover:text-white rounded-full flex items-center justify-center"
                aria-label={t.clear}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
            {speechSupported && (
              <button
                onClick={toggleVoice}
                className={`min-w-[40px] min-h-[40px] p-1.5 rounded-lg transition-all flex items-center justify-center ${
                  isListening
                    ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 animate-pulse'
                    : 'text-neutral-400 hover:text-black dark:hover:text-white'
                }`}
                title={t.voiceListening}
                aria-label={t.voiceListening}
              >
                <Mic className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {isListening && (
          <div className="px-3 py-1.5 bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-xl text-xs text-neutral-800 dark:text-neutral-200 flex items-center gap-2 animate-pulse">
            <span className="w-2 h-2 rounded-full bg-neutral-900 dark:bg-white" />
            {t.voiceListening}
          </div>
        )}

        {/* Filter Segmented Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {chips.map((chip) => {
            const isSelected = activeChip === chip;
            return (
              <button
                key={chip}
                onClick={() => setActiveChip(chip)}
                className={`min-h-[40px] px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all active:scale-95 ${
                  isSelected
                    ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 shadow-sm'
                    : 'bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white border border-neutral-200 dark:border-neutral-800'
                }`}
              >
                {getChipLabel(chip)}
              </button>
            );
          })}
        </div>
      </div>

      {/* Search Results List */}
      <main className="p-5 space-y-2">
        <div className="flex items-center justify-between text-xs text-neutral-400 font-medium pb-1">
          <span>{results.length} {t.resultsFound}</span>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-neutral-900 dark:text-white font-semibold underline min-h-[44px] px-2"
            >
              {t.clear}
            </button>
          )}
        </div>

        {results.length > 0 ? (
          results.map((res: any) => (
            <button
              key={`${res.type}_${res.id}`}
              onClick={() => handleResultClick(res)}
              className="w-full flex items-center justify-between p-2.5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-black dark:hover:border-white transition-all cursor-pointer group active:scale-[0.99] shadow-sm text-left min-h-[56px]"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                {res.avatarUrl ? (
                  <img
                    src={res.avatarUrl}
                    alt=""
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                    className="w-11 h-11 rounded-2xl object-cover border border-neutral-200 dark:border-neutral-800 flex-shrink-0"
                  />
                ) : res.type === 'member' ? (
                  <div className="w-11 h-11 rounded-2xl bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 font-bold text-sm flex items-center justify-center flex-shrink-0 shadow-sm">
                    {res.title.charAt(0).toUpperCase()}
                  </div>
                ) : res.type === 'event' ? (
                  <div className="w-11 h-11 rounded-2xl bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 flex items-center justify-center flex-shrink-0 border border-neutral-200 dark:border-neutral-700">
                    <Calendar className="w-5 h-5" />
                  </div>
                ) : res.type === 'photo' ? (
                  <div className="w-11 h-11 rounded-2xl bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 flex items-center justify-center flex-shrink-0 border border-neutral-200 dark:border-neutral-700">
                    <ImageIcon className="w-5 h-5" />
                  </div>
                ) : res.type === 'place' ? (
                  <div className="w-11 h-11 rounded-2xl bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 flex items-center justify-center flex-shrink-0 border border-neutral-200 dark:border-neutral-700">
                    <MapPin className="w-5 h-5" />
                  </div>
                ) : (
                  <div className="w-11 h-11 rounded-2xl bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 flex items-center justify-center flex-shrink-0 border border-neutral-200 dark:border-neutral-700">
                    <BookOpen className="w-5 h-5" />
                  </div>
                )}
                <div className="min-w-0">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
                    {typeLabel(res.type)}
                  </span>
                  <h4 className="text-sm font-bold text-neutral-900 dark:text-white truncate">
                    {res.title}
                  </h4>
                  <p className="text-xs text-neutral-500 truncate">{res.subtitle}</p>
                </div>
              </div>

              <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-white transition-colors flex-shrink-0" />
            </button>
          ))
        ) : (
          <div className="text-center py-16 space-y-2 text-neutral-400">
            <Search className="w-8 h-8 mx-auto stroke-1" />
            <p className="text-sm font-semibold text-neutral-600 dark:text-neutral-400">
              {t.noResults}
            </p>
            <p className="text-xs text-neutral-400">
              {t.searchPlaceholder}
            </p>
          </div>
        )}
      </main>
    </div>
  );
};
