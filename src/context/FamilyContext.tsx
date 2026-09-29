import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  FamilyMember,
  FamilyAlbum,
  FamilyPhoto,
  FamilyEvent,
  TimelineEntry,
  FamilyNote,
  FamilyActivity,
  FamilyNotification,
  CurrentUser,
  ActiveTab,
  TreeViewMode,
} from '../types/family';
import {
  INITIAL_MEMBERS,
  INITIAL_ALBUMS,
  INITIAL_PHOTOS,
  INITIAL_EVENTS,
  INITIAL_TIMELINE,
  INITIAL_NOTES,
  INITIAL_ACTIVITIES,
  INITIAL_NOTIFICATIONS,
  CURRENT_USER_DEFAULT,
} from '../data/initialData';

interface FamilyContextType {
  members: FamilyMember[];
  albums: FamilyAlbum[];
  photos: FamilyPhoto[];
  events: FamilyEvent[];
  timeline: TimelineEntry[];
  notes: FamilyNote[];
  activities: FamilyActivity[];
  notifications: FamilyNotification[];
  currentUser: CurrentUser;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  selectedMemberId: string | null;
  setSelectedMemberId: (id: string | null) => void;
  isAddMemberOpen: boolean;
  setIsAddMemberOpen: (open: boolean) => void;
  editingMember: FamilyMember | null;
  setEditingMember: (member: FamilyMember | null) => void;
  isFamilyDetailsOpen: boolean;
  setIsFamilyDetailsOpen: (open: boolean) => void;
  isPhotosGalleryOpen: boolean;
  setIsPhotosGalleryOpen: (open: boolean) => void;
  isEventsOpen: boolean;
  setIsEventsOpen: (open: boolean) => void;
  isNotificationsOpen: boolean;
  setIsNotificationsOpen: (open: boolean) => void;
  isQuickActionsOpen: boolean;
  setIsQuickActionsOpen: (open: boolean) => void;
  isOnboardingOpen: boolean;
  setIsOnboardingOpen: (open: boolean) => void;
  treeViewMode: TreeViewMode;
  setTreeViewMode: (mode: TreeViewMode) => void;
  theme: 'dark' | 'light';
  setTheme: (theme: 'dark' | 'light') => void;
  searchFilterChip: string;
  setSearchFilterChip: (chip: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeProfileTab: 'overview' | 'details' | 'photos' | 'timeline';
  setActiveProfileTab: (tab: 'overview' | 'details' | 'photos' | 'timeline') => void;
  
  // Actions
  addMember: (member: Omit<FamilyMember, 'id'>) => FamilyMember;
  updateMember: (id: string, member: Partial<FamilyMember>) => void;
  deleteMember: (id: string) => void;
  addPhoto: (photo: Omit<FamilyPhoto, 'id'>) => void;
  addAlbum: (album: Omit<FamilyAlbum, 'id' | 'photoCount'>) => void;
  addEvent: (event: Omit<FamilyEvent, 'id'>) => void;
  addNote: (note: Omit<FamilyNote, 'id' | 'date'>) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  resetToDefaults: () => void;
  exportDataJson: () => string;
  importDataJson: (jsonString: string) => boolean;
  openMemberProfile: (id: string) => void;
}

const FamilyContext = createContext<FamilyContextType | undefined>(undefined);

const STORAGE_KEY = 'family_tree_state_v1';

export const FamilyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial from localStorage if present
  const [members, setMembers] = useState<FamilyMember[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_members`);
      return saved ? JSON.parse(saved) : INITIAL_MEMBERS;
    } catch {
      return INITIAL_MEMBERS;
    }
  });

  const [albums, setAlbums] = useState<FamilyAlbum[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_albums`);
      return saved ? JSON.parse(saved) : INITIAL_ALBUMS;
    } catch {
      return INITIAL_ALBUMS;
    }
  });

  const [photos, setPhotos] = useState<FamilyPhoto[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_photos`);
      return saved ? JSON.parse(saved) : INITIAL_PHOTOS;
    } catch {
      return INITIAL_PHOTOS;
    }
  });

  const [events, setEvents] = useState<FamilyEvent[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_events`);
      return saved ? JSON.parse(saved) : INITIAL_EVENTS;
    } catch {
      return INITIAL_EVENTS;
    }
  });

  const [timeline, setTimeline] = useState<TimelineEntry[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_timeline`);
      return saved ? JSON.parse(saved) : INITIAL_TIMELINE;
    } catch {
      return INITIAL_TIMELINE;
    }
  });

  const [notes, setNotes] = useState<FamilyNote[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_notes`);
      return saved ? JSON.parse(saved) : INITIAL_NOTES;
    } catch {
      return INITIAL_NOTES;
    }
  });

  const [activities, setActivities] = useState<FamilyActivity[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_activities`);
      return saved ? JSON.parse(saved) : INITIAL_ACTIVITIES;
    } catch {
      return INITIAL_ACTIVITIES;
    }
  });

  const [notifications, setNotifications] = useState<FamilyNotification[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_notifications`);
      return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  });

  const [currentUser] = useState<CurrentUser>(CURRENT_USER_DEFAULT);
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [activeProfileTab, setActiveProfileTab] = useState<'overview' | 'details' | 'photos' | 'timeline'>('overview');
  
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<FamilyMember | null>(null);
  const [isFamilyDetailsOpen, setIsFamilyDetailsOpen] = useState(false);
  const [isPhotosGalleryOpen, setIsPhotosGalleryOpen] = useState(false);
  const [isEventsOpen, setIsEventsOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isQuickActionsOpen, setIsQuickActionsOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [treeViewMode, setTreeViewMode] = useState<TreeViewMode>('tree');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [searchFilterChip, setSearchFilterChip] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Persist state updates to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_members`, JSON.stringify(members));
      localStorage.setItem(`${STORAGE_KEY}_albums`, JSON.stringify(albums));
      localStorage.setItem(`${STORAGE_KEY}_photos`, JSON.stringify(photos));
      localStorage.setItem(`${STORAGE_KEY}_events`, JSON.stringify(events));
      localStorage.setItem(`${STORAGE_KEY}_timeline`, JSON.stringify(timeline));
      localStorage.setItem(`${STORAGE_KEY}_notes`, JSON.stringify(notes));
      localStorage.setItem(`${STORAGE_KEY}_activities`, JSON.stringify(activities));
      localStorage.setItem(`${STORAGE_KEY}_notifications`, JSON.stringify(notifications));
    } catch (e) {
      console.warn('Storage quota or error', e);
    }
  }, [members, albums, photos, events, timeline, notes, activities, notifications]);

  // Synchronize document theme class
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const openMemberProfile = (id: string) => {
    setSelectedMemberId(id);
    setActiveProfileTab('overview');
  };

  const addMember = (memberData: Omit<FamilyMember, 'id'>): FamilyMember => {
    const newId = `m_${Date.now()}`;
    const newMember: FamilyMember = {
      ...memberData,
      id: newId,
    };

    setMembers((prev) => {
      // Also update reciprocal relationships:
      // 1. If new member has parents, add newMember.id to parent.childrenIds
      // 2. If new member has spouse, link spouse.spouseId
      // 3. If new member has children, add newMember.id to children.parentIds
      const updated = prev.map((m) => {
        let memberCopy = { ...m };
        if (newMember.parentIds.includes(m.id)) {
          if (!memberCopy.childrenIds.includes(newId)) {
            memberCopy.childrenIds = [...memberCopy.childrenIds, newId];
          }
        }
        if (newMember.spouseId === m.id) {
          memberCopy.spouseId = newId;
        }
        if (newMember.childrenIds.includes(m.id)) {
          if (!memberCopy.parentIds.includes(newId)) {
            memberCopy.parentIds = [...memberCopy.parentIds, newId];
          }
        }
        return memberCopy;
      });

      return [...updated, newMember];
    });

    // Add activity
    const newActivity: FamilyActivity = {
      id: `act_${Date.now()}`,
      title: 'New family member added',
      description: `${newMember.fullName} was added as ${newMember.relationLabel}`,
      timestamp: 'Just now',
      avatarUrl: newMember.avatarUrl,
      type: 'member_added',
      targetMemberId: newId,
    };
    setActivities((prev) => [newActivity, ...prev]);

    // Add timeline milestone
    if (newMember.birthYear) {
      const newTimeline: TimelineEntry = {
        id: `tl_${Date.now()}`,
        year: newMember.birthYear,
        dateStr: newMember.birthDate || `${newMember.birthYear}`,
        title: `${newMember.fullName} Born`,
        description: `Born in ${newMember.birthPlace || 'Uzbekistan'}`,
        memberId: newId,
        category: 'birth',
      };
      setTimeline((prev) => [...prev, newTimeline].sort((a, b) => a.year - b.year));
    }

    return newMember;
  };

  const updateMember = (id: string, updates: Partial<FamilyMember>) => {
    setMembers((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          return { ...m, ...updates };
        }
        return m;
      })
    );

    const target = members.find((m) => m.id === id);
    if (target) {
      const newAct: FamilyActivity = {
        id: `act_${Date.now()}`,
        title: 'Profile updated',
        description: `${updates.fullName || target.fullName} updated details`,
        timestamp: 'Just now',
        avatarUrl: updates.avatarUrl || target.avatarUrl,
        type: 'profile_updated',
        targetMemberId: id,
      };
      setActivities((prev) => [newAct, ...prev]);
    }
  };

  const deleteMember = (id: string) => {
    setMembers((prev) => {
      return prev
        .filter((m) => m.id !== id)
        .map((m) => ({
          ...m,
          parentIds: m.parentIds.filter((p) => p !== id),
          childrenIds: m.childrenIds.filter((c) => c !== id),
          spouseId: m.spouseId === id ? undefined : m.spouseId,
        }));
    });
    if (selectedMemberId === id) {
      setSelectedMemberId(null);
    }
  };

  const addPhoto = (photoData: Omit<FamilyPhoto, 'id'>) => {
    const newId = `p_${Date.now()}`;
    const newPhoto: FamilyPhoto = { ...photoData, id: newId };
    setPhotos((prev) => [newPhoto, ...prev]);

    // Update album count
    if (photoData.albumId) {
      setAlbums((prev) =>
        prev.map((a) => (a.id === photoData.albumId ? { ...a, photoCount: a.photoCount + 1 } : a))
      );
    }

    // Add activity
    setActivities((prev) => [
      {
        id: `act_${Date.now()}`,
        title: 'Photo added',
        description: `New photo "${photoData.title}" was added`,
        timestamp: 'Just now',
        avatarUrl: photoData.url,
        type: 'photo_added',
      },
      ...prev,
    ]);
  };

  const addAlbum = (albumData: Omit<FamilyAlbum, 'id' | 'photoCount'>) => {
    const newAlbum: FamilyAlbum = {
      ...albumData,
      id: `alb_${Date.now()}`,
      photoCount: 0,
    };
    setAlbums((prev) => [...prev, newAlbum]);
  };

  const addEvent = (eventData: Omit<FamilyEvent, 'id'>) => {
    const newEvent: FamilyEvent = {
      ...eventData,
      id: `ev_${Date.now()}`,
    };
    setEvents((prev) => [...prev, newEvent].sort((a, b) => a.date.localeCompare(b.date)));

    setActivities((prev) => [
      {
        id: `act_${Date.now()}`,
        title: 'Event scheduled',
        description: `${eventData.title} added for ${eventData.date}`,
        timestamp: 'Just now',
        type: 'event_created',
      },
      ...prev,
    ]);
  };

  const addNote = (noteData: Omit<FamilyNote, 'id' | 'date'>) => {
    const newNote: FamilyNote = {
      ...noteData,
      id: `fn_${Date.now()}`,
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
    };
    setNotes((prev) => [newNote, ...prev]);
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const resetToDefaults = () => {
    setMembers(INITIAL_MEMBERS);
    setAlbums(INITIAL_ALBUMS);
    setPhotos(INITIAL_PHOTOS);
    setEvents(INITIAL_EVENTS);
    setTimeline(INITIAL_TIMELINE);
    setNotes(INITIAL_NOTES);
    setActivities(INITIAL_ACTIVITIES);
    setNotifications(INITIAL_NOTIFICATIONS);
    try {
      localStorage.clear();
    } catch {}
  };

  const exportDataJson = (): string => {
    const payload = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      familyTree: {
        familyName: 'Karimov Family',
        members,
        albums,
        photos,
        events,
        timeline,
        notes,
      },
    };
    return JSON.stringify(payload, null, 2);
  };

  const importDataJson = (jsonString: string): boolean => {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.familyTree && Array.isArray(parsed.familyTree.members)) {
        setMembers(parsed.familyTree.members);
        if (parsed.familyTree.albums) setAlbums(parsed.familyTree.albums);
        if (parsed.familyTree.photos) setPhotos(parsed.familyTree.photos);
        if (parsed.familyTree.events) setEvents(parsed.familyTree.events);
        if (parsed.familyTree.timeline) setTimeline(parsed.familyTree.timeline);
        if (parsed.familyTree.notes) setNotes(parsed.familyTree.notes);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  return (
    <FamilyContext.Provider
      value={{
        members,
        albums,
        photos,
        events,
        timeline,
        notes,
        activities,
        notifications,
        currentUser,
        activeTab,
        setActiveTab,
        selectedMemberId,
        setSelectedMemberId,
        isAddMemberOpen,
        setIsAddMemberOpen,
        editingMember,
        setEditingMember,
        isFamilyDetailsOpen,
        setIsFamilyDetailsOpen,
        isPhotosGalleryOpen,
        setIsPhotosGalleryOpen,
        isEventsOpen,
        setIsEventsOpen,
        isNotificationsOpen,
        setIsNotificationsOpen,
        isQuickActionsOpen,
        setIsQuickActionsOpen,
        isOnboardingOpen,
        setIsOnboardingOpen,
        treeViewMode,
        setTreeViewMode,
        theme,
        setTheme,
        searchFilterChip,
        setSearchFilterChip,
        searchQuery,
        setSearchQuery,
        activeProfileTab,
        setActiveProfileTab,
        addMember,
        updateMember,
        deleteMember,
        addPhoto,
        addAlbum,
        addEvent,
        addNote,
        markNotificationRead,
        markAllNotificationsRead,
        resetToDefaults,
        exportDataJson,
        importDataJson,
        openMemberProfile,
      }}
    >
      {children}
    </FamilyContext.Provider>
  );
};

export const useFamily = () => {
  const context = useContext(FamilyContext);
  if (!context) {
    throw new Error('useFamily must be used within a FamilyProvider');
  }
  return context;
};
