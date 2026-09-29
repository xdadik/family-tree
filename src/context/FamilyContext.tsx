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
  UserRole,
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
  ADMIN_USER,
  VIEWER_USER,
} from '../data/initialData';
import { Language, Translations, TRANSLATIONS } from '../utils/translations';

interface FamilyContextType {
  members: FamilyMember[];
  albums: FamilyAlbum[];
  photos: FamilyPhoto[];
  events: FamilyEvent[];
  timeline: TimelineEntry[];
  notes: FamilyNote[];
  activities: FamilyActivity[];
  notifications: FamilyNotification[];
  currentUser: CurrentUser | null;
  isAdmin: boolean;
  isSupportOpen: boolean;
  setIsSupportOpen: (open: boolean) => void;
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
  isLoginModalOpen: boolean;
  setIsLoginModalOpen: (open: boolean) => void;
  isLanguageModalOpen: boolean;
  setIsLanguageModalOpen: (open: boolean) => void;
  isOnboardingOpen: boolean;
  setIsOnboardingOpen: (open: boolean) => void;
  treeViewMode: TreeViewMode;
  setTreeViewMode: (mode: TreeViewMode) => void;
  theme: 'dark' | 'light';
  setTheme: (theme: 'dark' | 'light') => void;
  canvasBg: 'black' | 'white' | 'cream' | 'slate';
  setCanvasBg: (bg: 'black' | 'white' | 'cream' | 'slate') => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
  searchFilterChip: string;
  setSearchFilterChip: (chip: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeProfileTab: 'overview' | 'details' | 'photos' | 'timeline';
  setActiveProfileTab: (tab: 'overview' | 'details' | 'photos' | 'timeline') => void;
  addMemberPreset: { targetMemberId?: string; relationType?: 'parent' | 'spouse' | 'child' } | null;
  setAddMemberPreset: (preset: { targetMemberId?: string; relationType?: 'parent' | 'spouse' | 'child' } | null) => void;
  openAddMemberWithRelation: (targetMember: FamilyMember, relationType: 'parent' | 'spouse' | 'child') => void;
  clearAllMembers: () => void;
  
  // Auth & Roles
  login: (username: string, password: string, role?: UserRole) => boolean;
  logout: () => void;
  switchRole: (role: UserRole) => void;

  // Actions
  addMember: (member: Omit<FamilyMember, 'id'>) => FamilyMember | null;
  updateMember: (id: string, member: Partial<FamilyMember>) => boolean;
  deleteMember: (id: string) => boolean;
  addPhoto: (photo: Omit<FamilyPhoto, 'id'>) => boolean;
  addAlbum: (album: Omit<FamilyAlbum, 'id' | 'photoCount'>) => boolean;
  addEvent: (event: Omit<FamilyEvent, 'id'>) => boolean;
  addNote: (note: Omit<FamilyNote, 'id' | 'date'>) => boolean;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  resetToDefaults: () => void;
  exportDataJson: () => string;
  importDataJson: (jsonString: string) => boolean;
  openMemberProfile: (id: string) => void;
}

const FamilyContext = createContext<FamilyContextType | undefined>(undefined);

const STORAGE_KEY = 'sirojovs_family_tree_v2';

export const FamilyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Members
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

  // User & Auth
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_user`);
      if (saved === 'null') return null;
      return saved ? JSON.parse(saved) : ADMIN_USER;
    } catch {
      return ADMIN_USER;
    }
  });

  const isAdmin = currentUser?.role === 'admin';
  const [isSupportOpen, setIsSupportOpen] = useState(false);

  // Language
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_lang`);
      if (saved && (saved === 'uz-latn' || saved === 'uz-cyrl' || saved === 'en' || saved === 'ru')) {
        return saved as Language;
      }
      return 'uz-latn';
    } catch {
      return 'uz-latn';
    }
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem(`${STORAGE_KEY}_lang`, lang);
  };

  const t = TRANSLATIONS[language] || TRANSLATIONS['uz-latn'];

  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [activeProfileTab, setActiveProfileTab] = useState<'overview' | 'details' | 'photos' | 'timeline'>('overview');
  
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<FamilyMember | null>(null);
  const [addMemberPreset, setAddMemberPreset] = useState<{
    targetMemberId?: string;
    relationType?: 'parent' | 'spouse' | 'child';
  } | null>(null);
  const [isFamilyDetailsOpen, setIsFamilyDetailsOpen] = useState(false);
  const [isPhotosGalleryOpen, setIsPhotosGalleryOpen] = useState(false);
  const [isEventsOpen, setIsEventsOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isQuickActionsOpen, setIsQuickActionsOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [treeViewMode, setTreeViewMode] = useState<TreeViewMode>('tree');
  
  const [theme, setThemeState] = useState<'dark' | 'light'>(() => {
    try {
      const savedTheme = localStorage.getItem(`${STORAGE_KEY}_theme`);
      return (savedTheme === 'light' || savedTheme === 'dark') ? savedTheme : 'dark';
    } catch {
      return 'dark';
    }
  });

  const [canvasBg, setCanvasBgState] = useState<'black' | 'white' | 'cream' | 'slate'>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_canvasBg`);
      if (saved && (saved === 'black' || saved === 'white' || saved === 'cream' || saved === 'slate')) {
        return saved as 'black' | 'white' | 'cream' | 'slate';
      }
      return 'black';
    } catch {
      return 'black';
    }
  });

  const setTheme = (newTheme: 'dark' | 'light') => {
    setThemeState(newTheme);
    setCanvasBgState(newTheme === 'dark' ? 'black' : 'white');
    localStorage.setItem(`${STORAGE_KEY}_theme`, newTheme);
    localStorage.setItem(`${STORAGE_KEY}_canvasBg`, newTheme === 'dark' ? 'black' : 'white');
  };

  const setCanvasBg = (bg: 'black' | 'white' | 'cream' | 'slate') => {
    setCanvasBgState(bg);
    localStorage.setItem(`${STORAGE_KEY}_canvasBg`, bg);
    const newTheme = bg === 'white' || bg === 'cream' ? 'light' : 'dark';
    setThemeState(newTheme);
    localStorage.setItem(`${STORAGE_KEY}_theme`, newTheme);
  };

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
      localStorage.setItem(`${STORAGE_KEY}_user`, JSON.stringify(currentUser));
      localStorage.setItem(`${STORAGE_KEY}_theme`, theme);
      localStorage.setItem(`${STORAGE_KEY}_canvasBg`, canvasBg);
    } catch (e) {
      console.warn('Storage quota or error', e);
    }
  }, [members, albums, photos, events, timeline, notes, activities, notifications, currentUser, theme, canvasBg]);

  // Synchronize document theme class and body background
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
      document.documentElement.style.colorScheme = 'dark';
      document.body.className = 'dark antialiased';
      document.body.style.backgroundColor = canvasBg === 'slate' ? '#0f172a' : '#09090b';
      document.body.style.color = '#ffffff';
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
      document.documentElement.style.colorScheme = 'light';
      document.body.className = 'light antialiased';
      document.body.style.backgroundColor = canvasBg === 'cream' ? '#fbf8f3' : '#f4f4f5';
      document.body.style.color = '#09090b';
    }
  }, [theme, canvasBg]);

  // Auth functions
  const login = (username: string, password: string, role?: UserRole): boolean => {
    const trimmedUser = username.trim().toLowerCase();
    const trimmedPass = password.trim();

    if (!trimmedUser) return false;

    // Check credentials for Admin
    if (
      role === 'admin' ||
      trimmedUser === 'admin' ||
      trimmedUser === 'zafarov1ich' ||
      trimmedUser === 'zafarov'
    ) {
      if (
        trimmedPass === 'admin' ||
        trimmedPass === '123456' ||
        trimmedPass === 'zafarov' ||
        trimmedPass.length >= 4
      ) {
        setCurrentUser(ADMIN_USER);
        setIsLoginModalOpen(false);
        return true;
      }
      return false; // Incorrect password for admin!
    }

    // Viewer or guest login
    if (role === 'viewer' || trimmedUser === 'guest' || trimmedUser === 'mehmon') {
      setCurrentUser(VIEWER_USER);
      setIsLoginModalOpen(false);
      return true;
    }

    // Default viewer login
    const newUser: CurrentUser = {
      id: `u_${Date.now()}`,
      username: username.trim(),
      name: username.trim(),
      email: `${trimmedUser}@family.uz`,
      avatarUrl: '',
      role: 'viewer',
    };
    setCurrentUser(newUser);
    setIsLoginModalOpen(false);
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem(`${STORAGE_KEY}_user`);
    } catch {}
  };

  const switchRole = (newRole: UserRole) => {
    if (newRole === 'admin') {
      if (currentUser?.role === 'admin') return;
      setIsLoginModalOpen(true);
    } else {
      if (currentUser) {
        setCurrentUser({ ...currentUser, role: 'viewer' });
      } else {
        setCurrentUser(VIEWER_USER);
      }
    }
  };

  const openMemberProfile = (id: string) => {
    setSelectedMemberId(id);
    setActiveProfileTab('overview');
  };

  const openAddMemberWithRelation = (
    targetMember: FamilyMember,
    relationType: 'parent' | 'spouse' | 'child'
  ) => {
    if (!isAdmin) {
      alert(t.readOnlyNotice);
      setIsLoginModalOpen(true);
      return;
    }
    setEditingMember(null);
    setAddMemberPreset({
      targetMemberId: targetMember.id,
      relationType,
    });
    setIsAddMemberOpen(true);
  };

  const clearAllMembers = () => {
    if (!isAdmin) {
      alert(t.readOnlyNotice);
      setIsLoginModalOpen(true);
      return;
    }
    setMembers([]);
    setSelectedMemberId(null);
    try {
      localStorage.removeItem(`${STORAGE_KEY}_members`);
    } catch {}
  };

  // Actions with Admin permission check
  const addMember = (memberData: Omit<FamilyMember, 'id'>): FamilyMember | null => {
    if (!isAdmin) {
      alert(t.readOnlyNotice);
      setIsLoginModalOpen(true);
      return null;
    }

    const newId = `m_${Date.now()}`;
    const newMember: FamilyMember = {
      ...memberData,
      id: newId,
    };

    setMembers((prev) => {
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
      title: 'Yangi a\'zo qo\'shildi',
      description: `${newMember.fullName} (${newMember.relationLabel}) shajaraga kiritildi`,
      timestamp: 'Hozirgina',
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
        title: `${newMember.fullName} tavalludi`,
        description: `${newMember.birthPlace || 'O\'zbekiston'}da tavallud topgan`,
        memberId: newId,
        category: 'birth',
      };
      setTimeline((prev) => [...prev, newTimeline].sort((a, b) => a.year - b.year));
    }

    return newMember;
  };

  const updateMember = (id: string, updates: Partial<FamilyMember>): boolean => {
    if (!isAdmin) {
      alert(t.readOnlyNotice);
      setIsLoginModalOpen(true);
      return false;
    }

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
        title: 'Ma\'lumot yangilandi',
        description: `${updates.fullName || target.fullName} profili yangilandi`,
        timestamp: 'Hozirgina',
        avatarUrl: updates.avatarUrl || target.avatarUrl,
        type: 'profile_updated',
        targetMemberId: id,
      };
      setActivities((prev) => [newAct, ...prev]);
    }
    return true;
  };

  const deleteMember = (id: string): boolean => {
    if (!isAdmin) {
      alert(t.readOnlyNotice);
      setIsLoginModalOpen(true);
      return false;
    }

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
    return true;
  };

  const addPhoto = (photoData: Omit<FamilyPhoto, 'id'>): boolean => {
    if (!isAdmin) {
      alert(t.readOnlyNotice);
      setIsLoginModalOpen(true);
      return false;
    }

    const newId = `p_${Date.now()}`;
    const newPhoto: FamilyPhoto = { ...photoData, id: newId };
    setPhotos((prev) => [newPhoto, ...prev]);

    if (photoData.albumId) {
      setAlbums((prev) =>
        prev.map((a) => (a.id === photoData.albumId ? { ...a, photoCount: a.photoCount + 1 } : a))
      );
    }

    setActivities((prev) => [
      {
        id: `act_${Date.now()}`,
        title: 'Yangi rasm qo\'shildi',
        description: `"${photoData.title}" rasmi arxivga kiritildi`,
        timestamp: 'Hozirgina',
        avatarUrl: photoData.url,
        type: 'photo_added',
      },
      ...prev,
    ]);
    return true;
  };

  const addAlbum = (albumData: Omit<FamilyAlbum, 'id' | 'photoCount'>): boolean => {
    if (!isAdmin) {
      alert(t.readOnlyNotice);
      return false;
    }
    const newAlbum: FamilyAlbum = {
      ...albumData,
      id: `alb_${Date.now()}`,
      photoCount: 0,
    };
    setAlbums((prev) => [...prev, newAlbum]);
    return true;
  };

  const addEvent = (eventData: Omit<FamilyEvent, 'id'>): boolean => {
    if (!isAdmin) {
      alert(t.readOnlyNotice);
      setIsLoginModalOpen(true);
      return false;
    }

    const newEvent: FamilyEvent = {
      ...eventData,
      id: `ev_${Date.now()}`,
    };
    setEvents((prev) => [...prev, newEvent].sort((a, b) => a.date.localeCompare(b.date)));

    setActivities((prev) => [
      {
        id: `act_${Date.now()}`,
        title: 'Yangi tadbir belgilandi',
        description: `${eventData.title} (${eventData.date})`,
        timestamp: 'Hozirgina',
        type: 'event_created',
      },
      ...prev,
    ]);
    return true;
  };

  const addNote = (noteData: Omit<FamilyNote, 'id' | 'date'>): boolean => {
    if (!isAdmin) {
      alert(t.readOnlyNotice);
      return false;
    }
    const newNote: FamilyNote = {
      ...noteData,
      id: `fn_${Date.now()}`,
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
    };
    setNotes((prev) => [newNote, ...prev]);
    return true;
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
      localStorage.removeItem(`${STORAGE_KEY}_members`);
      localStorage.removeItem(`${STORAGE_KEY}_albums`);
      localStorage.removeItem(`${STORAGE_KEY}_photos`);
      localStorage.removeItem(`${STORAGE_KEY}_events`);
      localStorage.removeItem(`${STORAGE_KEY}_timeline`);
      localStorage.removeItem(`${STORAGE_KEY}_notes`);
    } catch {}
  };

  const exportDataJson = (): string => {
    const payload = {
      version: '2.0',
      family: 'Sirojovs',
      exportedAt: new Date().toISOString(),
      familyTree: {
        familyName: 'Sirojovs Family',
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
        isAdmin,
        isSupportOpen,
        setIsSupportOpen,
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
        isLoginModalOpen,
        setIsLoginModalOpen,
        isLanguageModalOpen,
        setIsLanguageModalOpen,
        isOnboardingOpen,
        setIsOnboardingOpen,
        treeViewMode,
        setTreeViewMode,
        theme,
        setTheme,
        canvasBg,
        setCanvasBg,
        language,
        setLanguage,
        t,
        searchFilterChip,
        setSearchFilterChip,
        searchQuery,
        setSearchQuery,
        activeProfileTab,
        setActiveProfileTab,
        addMemberPreset,
        setAddMemberPreset,
        openAddMemberWithRelation,
        clearAllMembers,
        login,
        logout,
        switchRole,
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
