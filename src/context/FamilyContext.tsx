import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
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
} from '../data/initialData';
import { Language, Translations, TRANSLATIONS } from '../utils/translations';
import { api, getToken, setToken, apiConfigured, ApiUser, SyncChange } from '../utils/api';

export interface ToastItem {
  id: string;
  message: string;
  kind: 'success' | 'error' | 'info';
}

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
  isOwner: boolean;
  accounts: ApiUser[];
  booting: boolean;
  serverOnline: boolean;
  toasts: ToastItem[];
  pushToast: (message: string, kind?: ToastItem['kind']) => void;
  dismissToast: (id: string) => void;
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
  
  // Auth (Cloudflare): everybody signs in, nobody browses anonymously
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  refreshAccounts: () => Promise<void>;
  createAccount: (input: { name: string; username: string; password: string; role: 'viewer' | 'admin' }) => Promise<boolean>;
  removeAccount: (id: string) => Promise<boolean>;

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
  openMemberProfile: (id: string) => void;
}

const FamilyContext = createContext<FamilyContextType | undefined>(undefined);

const STORAGE_KEY = 'sirojovs_family_tree_v4';
const CLEAN_STATE_KEY = `${STORAGE_KEY}_clean_v6`;

// v4 adds Dadajon X (Shaxnozaning o‘g‘li, Big Admin) + links owner account to his profile.
// Clear legacy local state once so the new dataset loads correctly.
if (typeof window !== 'undefined' && !localStorage.getItem(CLEAN_STATE_KEY)) {
  [
    'members', 'albums', 'photos', 'events', 'timeline', 'notes',
    'activities', 'notifications', 'user', 'admins',
  ].forEach((key) => {
    localStorage.removeItem(`${STORAGE_KEY}_${key}`);
    localStorage.removeItem(`sirojovs_family_tree_v3_${key}`);
    localStorage.removeItem(`sirojovs_family_tree_v2_${key}`);
  });
  localStorage.setItem(CLEAN_STATE_KEY, '1');
}

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

  // User & Auth (server sessions; localStorage is only an offline cache)
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [accounts, setAccounts] = useState<ApiUser[]>([]);
  const [booting, setBooting] = useState(true);
  const [serverOnline, setServerOnline] = useState(apiConfigured());

  const OUTBOX_KEY = `${STORAGE_KEY}_outbox`;
  const pendingRef = useRef<SyncChange[]>([]);
  const pushTimer = useRef<number | undefined>(undefined);

  const isAdmin = currentUser?.role === 'owner' || currentUser?.role === 'admin';
  const isOwner = currentUser?.role === 'owner';
  const [isSupportOpen, setIsSupportOpen] = useState(false);

  // Toasts (replaces window.alert on mobile)
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };
  const pushToast = (message: string, kind: ToastItem['kind'] = 'info') => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    setToasts((prev) => [...prev.slice(-2), { id, message, kind }]);
    window.setTimeout(() => dismissToast(id), 3200);
  };

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
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(() => currentUser === null);
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(() => {
    try {
      return !localStorage.getItem(`${STORAGE_KEY}_onboarded`);
    } catch {
      return false;
    }
  });
  const closeOnboarding = () => {
    setIsOnboardingOpen(false);
    try {
      localStorage.setItem(`${STORAGE_KEY}_onboarded`, '1');
    } catch {}
  };
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

  // Persist state updates to localStorage (offline cache; server is the source of truth)
  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_members`, JSON.stringify(members));
      localStorage.setItem(`${STORAGE_KEY}_albums`, JSON.stringify(albums));
      localStorage.setItem(`${STORAGE_KEY}_photos`, JSON.stringify(photos));
      localStorage.setItem(`${STORAGE_KEY}_events`, JSON.stringify(events));
      localStorage.setItem(`${STORAGE_KEY}_timeline`, JSON.stringify(timeline));
      localStorage.setItem(`${STORAGE_KEY}_notes`, JSON.stringify(notes));
      localStorage.setItem(`${STORAGE_KEY}_activities`, JSON.stringify(activities.slice(0, 100)));
      localStorage.setItem(`${STORAGE_KEY}_notifications`, JSON.stringify(notifications));
      localStorage.setItem(`${STORAGE_KEY}_user`, JSON.stringify(currentUser));
      localStorage.setItem(`${STORAGE_KEY}_theme`, theme);
      localStorage.setItem(`${STORAGE_KEY}_canvasBg`, canvasBg);
    } catch (e) {
      console.warn('Storage quota or error', e);
    }
  }, [members, albums, photos, events, timeline, notes, activities, notifications, currentUser, theme, canvasBg]);

  // Synchronize document theme class and body background (preserve existing classes)
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
      root.style.colorScheme = 'dark';
      document.body.classList.add('dark', 'antialiased');
      document.body.classList.remove('light');
      document.body.style.backgroundColor = canvasBg === 'slate' ? '#0f172a' : '#09090b';
      document.body.style.color = '#ffffff';
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
      root.style.colorScheme = 'light';
      document.body.classList.remove('dark');
      document.body.classList.add('light', 'antialiased');
      document.body.style.backgroundColor = canvasBg === 'cream' ? '#fbf8f3' : '#f4f4f5';
      document.body.style.color = '#09090b';
    }
  }, [theme, canvasBg]);

  // Lock body scroll when any full-screen modal is open (mobile UX)
  const anyModalOpen =
    isAddMemberOpen ||
    isFamilyDetailsOpen ||
    isPhotosGalleryOpen ||
    isEventsOpen ||
    isNotificationsOpen ||
    isQuickActionsOpen ||
    isLanguageModalOpen ||
    isSupportOpen ||
    isOnboardingOpen ||
    selectedMemberId !== null;
  useEffect(() => {
    document.body.style.overflow = anyModalOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [anyModalOpen]);

  // ---------- Cloudflare sync engine ----------

  const toCurrentUser = (u: ApiUser): CurrentUser => ({
    id: u.id,
    username: u.login,
    name: u.name,
    email: `${u.login}@sirojovlar.app`,
    avatarUrl: '',
    role: (u.role === 'owner' || u.role === 'admin' ? u.role : 'viewer') as CurrentUser['role'],
    familyMemberId: u.role === 'owner' ? 'dadajon' : undefined,
  });

  const applyServerData = (data: Record<string, Record<string, unknown>>) => {
    const pick = <T,>(kind: string): T[] => {
      const bucket = data[kind];
      if (!bucket) return [];
      return Object.values(bucket) as T[];
    };
    const serverMembers = pick<FamilyMember>('member');
    if (serverMembers.length > 0 || data.member) setMembers(serverMembers);
    if (data.album) setAlbums(pick<FamilyAlbum>('album'));
    if (data.photo) setPhotos(pick<FamilyPhoto>('photo'));
    if (data.event) setEvents(pick<FamilyEvent>('event'));
    if (data.timeline) setTimeline(pick<TimelineEntry>('timeline'));
    if (data.note) setNotes(pick<FamilyNote>('note'));
    if (data.activity) setActivities(pick<FamilyActivity>('activity'));
  };

  const flushChanges = async () => {
    pushTimer.current = undefined;
    const batch = pendingRef.current.splice(0, pendingRef.current.length);
    if (batch.length === 0) return;
    const merged = new Map<string, SyncChange>();
    batch.forEach((c) => merged.set(`${c.kind}:${c.id}`, c));
    try {
      await api.syncPush([...merged.values()]);
      setServerOnline(true);
    } catch {
      try {
        const prev = JSON.parse(localStorage.getItem(OUTBOX_KEY) || '[]') as SyncChange[];
        const all = new Map<string, SyncChange>();
        [...prev, ...merged.values()].forEach((c) => all.set(`${c.kind}:${c.id}`, c));
        localStorage.setItem(OUTBOX_KEY, JSON.stringify([...all.values()].slice(-2000)));
      } catch {
        // ignore
      }
      setServerOnline(false);
    }
  };

  const queueChanges = (changes: SyncChange[]) => {
    if (changes.length === 0) return;
    pendingRef.current.push(...changes);
    if (pushTimer.current !== undefined) return;
    pushTimer.current = window.setTimeout(() => {
      void flushChanges();
    }, 1200);
  };

  const flushOutbox = async () => {
    try {
      const saved = JSON.parse(localStorage.getItem(OUTBOX_KEY) || '[]') as SyncChange[];
      if (saved.length === 0) return;
      await api.syncPush(saved);
      localStorage.removeItem(OUTBOX_KEY);
    } catch {
      // stay offline, retry later
    }
  };

  const seedIfEmpty = async () => {
    try {
      const { data } = await api.syncGet();
      const existing = data.member ? Object.keys(data.member).length : 0;
      if (existing > 0) return;
      const changes: SyncChange[] = [
        ...INITIAL_MEMBERS.map((m) => ({ kind: 'member', id: m.id, json: m as unknown })),
        ...INITIAL_TIMELINE.map((entry) => ({ kind: 'timeline', id: entry.id, json: entry as unknown })),
        ...INITIAL_NOTES.map((n) => ({ kind: 'note', id: n.id, json: n as unknown })),
      ];
      await api.syncPush(changes);
      applyServerData({
        member: Object.fromEntries(INITIAL_MEMBERS.map((m) => [m.id, m])),
        timeline: Object.fromEntries(INITIAL_TIMELINE.map((entry) => [entry.id, entry])),
        note: Object.fromEntries(INITIAL_NOTES.map((n) => [n.id, n])),
      });
      pushToast(t.dataImported, 'success');
    } catch {
      // offline — local INITIAL data already shown
    }
  };

  // Boot: session → server data; offline → local cache
  useEffect(() => {
    (async () => {
      if (!apiConfigured()) {
        setServerOnline(false);
        setBooting(false);
        return;
      }
      const token = getToken();
      if (!token) {
        setBooting(false);
        return;
      }
      try {
        const { user } = await api.me();
        setCurrentUser(toCurrentUser(user));
        setIsLoginModalOpen(false);
        await flushOutbox();
        const { data } = await api.syncGet();
        applyServerData(data);
        setServerOnline(true);
        if (user.role === 'owner') void refreshAccounts();
      } catch (e) {
        const status = (e as { status?: number }).status;
        if (status === 401) {
          setToken(null);
          setCurrentUser(null);
        } else {
          setServerOnline(false);
          try {
            const cached = localStorage.getItem(`${STORAGE_KEY}_user`);
            if (cached && cached !== 'null') setCurrentUser(JSON.parse(cached) as CurrentUser);
          } catch {
            // ignore
          }
        }
      } finally {
        setBooting(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auth: everybody signs in — no anonymous browsing (family privacy)
  const login = async (username: string, password: string): Promise<boolean> => {
    const normalizedUsername = username.trim().toLowerCase();
    if (!normalizedUsername || !password) return false;
    try {
      const { token, user } = await api.login(normalizedUsername, password);
      setToken(token);
      setCurrentUser(toCurrentUser(user));
      setIsLoginModalOpen(false);
      setServerOnline(true);
      await flushOutbox();
      const { data } = await api.syncGet();
      applyServerData(data);
      if (user.role === 'owner') {
        await seedIfEmpty();
        await refreshAccounts();
      }
      pushToast(`${user.name} — ${t.adminBadge}`, 'success');
      return true;
    } catch {
      return false;
    }
  };

  const logout = () => {
    if (pushTimer.current !== undefined) {
      window.clearTimeout(pushTimer.current);
      pushTimer.current = undefined;
      void flushChanges();
    }
    setToken(null);
    void api.logout();
    setCurrentUser(null);
    setAccounts([]);
    setIsLoginModalOpen(true);
    setActiveTab('home');
    pushToast(t.loggedOutNotice, 'info');
  };

  const refreshAccounts = async () => {
    try {
      const { users } = await api.listUsers();
      setAccounts(users);
    } catch {
      // offline or not owner — keep current list
    }
  };

  const createAccount = async (input: {
    name: string;
    username: string;
    password: string;
    role: 'viewer' | 'admin';
  }): Promise<boolean> => {
    if (!isOwner) {
      pushToast(t.readOnlyNotice, 'error');
      return false;
    }
    const username = input.username.trim().toLowerCase().replace(/\s+/g, '');
    if (!username || username.length < 3 || !input.name.trim() || input.password.length < 4) {
      pushToast(t.adminAddFailed, 'error');
      return false;
    }
    try {
      await api.createUser({ login: username, password: input.password, name: input.name.trim(), role: input.role });
      await refreshAccounts();
      pushToast(t.adminAdded, 'success');
      return true;
    } catch (e) {
      pushToast((e as Error).message === 'login-taken' ? t.adminAddFailed : t.adminAddFailed, 'error');
      return false;
    }
  };

  const removeAccount = async (id: string): Promise<boolean> => {
    if (!isOwner) {
      pushToast(t.readOnlyNotice, 'error');
      return false;
    }
    try {
      await api.deleteUser(id);
      await refreshAccounts();
      pushToast(t.adminRemoved, 'success');
      return true;
    } catch {
      pushToast(t.importFailed, 'error');
      return false;
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
      pushToast(t.readOnlyNotice, 'error');
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
      pushToast(t.readOnlyNotice, 'error');
      setIsLoginModalOpen(true);
      return;
    }
    setMembers([]);
    setTimeline([]);
    setSelectedMemberId(null);
    setPhotos((prev) => prev.map((p) => ({ ...p, taggedMemberIds: [] })));
    setEvents((prev) => prev.map((e) => ({ ...e, participantIds: [] })));
    pushToast(t.memberDeleted, 'success');
    try {
      localStorage.removeItem(`${STORAGE_KEY}_members`);
      localStorage.removeItem(`${STORAGE_KEY}_timeline`);
    } catch {}
  };

  // Actions with Admin permission check (local first, cloud sync queued)
  const diffMembers = (before: FamilyMember[], after: FamilyMember[]): SyncChange[] =>
    after
      .filter((m) => !before.includes(m))
      .map((m) => ({ kind: 'member', id: m.id, json: m as unknown }));

  const addMember = (memberData: Omit<FamilyMember, 'id'>): FamilyMember | null => {
    if (!isAdmin) {
      pushToast(t.readOnlyNotice, 'error');
      setIsLoginModalOpen(true);
      return null;
    }
    if (!memberData.fullName.trim()) {
      pushToast(t.nameRequired, 'error');
      return null;
    }

    const newId = `m_${Date.now()}`;
    const cleanParents = (memberData.parentIds || []).filter((pid) => pid && pid !== newId);
    const cleanChildren = (memberData.childrenIds || []).filter((cid) => cid && cid !== newId);
    const cleanSpouse = memberData.spouseId === newId ? undefined : memberData.spouseId;

    const newMember: FamilyMember = {
      ...memberData,
      id: newId,
      fullName: memberData.fullName.trim(),
      parentIds: cleanParents,
      childrenIds: cleanChildren,
      spouseId: cleanSpouse,
    };

    // If spouse target already married to someone else, unlink old spouse first.
    let base = members;
    if (cleanSpouse) {
      const spouseTarget = members.find((m) => m.id === cleanSpouse);
      if (spouseTarget?.spouseId && spouseTarget.spouseId !== newId) {
        base = base.map((m) => (m.id === spouseTarget.spouseId ? { ...m, spouseId: undefined } : m));
      }
    }
    const updated = base.map((m) => {
      let copy = m;
      if (cleanParents.includes(m.id) && !copy.childrenIds.includes(newId)) {
        copy = { ...copy, childrenIds: [...copy.childrenIds, newId] };
      }
      if (cleanSpouse === m.id && copy.spouseId !== newId) {
        copy = { ...copy, spouseId: newId };
      }
      if (cleanChildren.includes(m.id) && !copy.parentIds.includes(newId)) {
        copy = { ...copy, parentIds: [...copy.parentIds, newId] };
      }
      return copy;
    });
    const next = [...updated, newMember];
    const changes = [...diffMembers(members, next), { kind: 'member', id: newId, json: newMember as unknown }];
    setMembers(next);
    queueChanges(changes);

    // Add activity
    const newActivity: FamilyActivity = {
      id: `act_${Date.now()}`,
      title: t.memberAdded,
      description: `${newMember.fullName} (${newMember.relationLabel})`,
      timestamp: 'Hozirgina',
      avatarUrl: newMember.avatarUrl,
      type: 'member_added',
      targetMemberId: newId,
    };
    const nextActivities = [newActivity, ...activities].slice(0, 100);
    setActivities(nextActivities);
    queueChanges([{ kind: 'activity', id: newActivity.id, json: newActivity as unknown }]);

    // Add timeline milestone
    if (newMember.birthYear && newMember.birthYear > 0) {
      const newTimeline: TimelineEntry = {
        id: `tl_${Date.now()}`,
        year: newMember.birthYear,
        dateStr: newMember.birthDate || `${newMember.birthYear}`,
        title: `${newMember.fullName} tavalludi`,
        description: `${newMember.birthPlace || 'O‘zbekiston'}da tavallud topgan`,
        memberId: newId,
        category: 'birth',
      };
      setTimeline([...timeline, newTimeline].sort((a, b) => a.year - b.year));
      queueChanges([{ kind: 'timeline', id: newTimeline.id, json: newTimeline as unknown }]);
    }

    pushToast(`${t.memberAdded}: ${newMember.fullName}`, 'success');
    return newMember;
  };

  const updateMember = (id: string, updates: Partial<FamilyMember>): boolean => {
    if (!isAdmin) {
      pushToast(t.readOnlyNotice, 'error');
      setIsLoginModalOpen(true);
      return false;
    }
    if (updates.fullName !== undefined && !updates.fullName.trim()) {
      pushToast(t.nameRequired, 'error');
      return false;
    }
    // Forbid self-links
    if (updates.parentIds?.includes(id) || updates.childrenIds?.includes(id) || updates.spouseId === id) {
      pushToast(t.importFailed, 'error');
      return false;
    }

    const prev = members.find((m) => m.id === id);
    if (!prev) return false;
    const next = members.map((m) => (m.id === id ? { ...m, ...updates } : m));
    // Sync reverse links for parents/children/spouse
    const final = next.map((m) => {
      if (m.id === id) return m;
      let copy = m;
      if (updates.parentIds !== undefined) {
        const shouldBeChild = updates.parentIds.includes(m.id);
        if (shouldBeChild && !copy.childrenIds.includes(id)) copy = { ...copy, childrenIds: [...copy.childrenIds, id] };
        if (!shouldBeChild && prev.parentIds.includes(m.id)) {
          copy = { ...copy, childrenIds: copy.childrenIds.filter((c) => c !== id) };
        }
      }
      if (updates.childrenIds !== undefined) {
        const shouldBeParent = updates.childrenIds.includes(m.id);
        if (shouldBeParent && !copy.parentIds.includes(id)) copy = { ...copy, parentIds: [...copy.parentIds, id] };
        if (!shouldBeParent && prev.childrenIds.includes(m.id)) {
          copy = { ...copy, parentIds: copy.parentIds.filter((p) => p !== id) };
        }
      }
      if (updates.spouseId !== undefined) {
        if (updates.spouseId === m.id && copy.spouseId !== id) copy = { ...copy, spouseId: id };
        if (copy.spouseId === id && updates.spouseId !== m.id) copy = { ...copy, spouseId: undefined };
      }
      return copy;
    });

    setMembers(final);
    queueChanges(diffMembers(members, final));

    const newAct: FamilyActivity = {
      id: `act_${Date.now()}`,
      title: t.memberUpdated,
      description: `${updates.fullName || prev.fullName}`,
      timestamp: 'Hozirgina',
      avatarUrl: updates.avatarUrl || prev.avatarUrl,
      type: 'profile_updated',
      targetMemberId: id,
    };
    setActivities([newAct, ...activities].slice(0, 100));
    queueChanges([{ kind: 'activity', id: newAct.id, json: newAct as unknown }]);
    pushToast(t.memberUpdated, 'success');
    return true;
  };

  const deleteMember = (id: string): boolean => {
    if (!isAdmin) {
      pushToast(t.readOnlyNotice, 'error');
      setIsLoginModalOpen(true);
      return false;
    }

    const target = members.find((m) => m.id === id);
    const nextMembers = members
      .filter((m) => m.id !== id)
      .map((m) => ({
        ...m,
        parentIds: m.parentIds.filter((p) => p !== id),
        childrenIds: m.childrenIds.filter((c) => c !== id),
        spouseId: m.spouseId === id ? undefined : m.spouseId,
      }));
    setMembers(nextMembers);
    const changes: SyncChange[] = [
      { kind: 'member', id, json: null },
      ...diffMembers(members, nextMembers),
    ];

    // Cascade clean orphans
    const nextPhotos = photos.map((p) => ({ ...p, taggedMemberIds: p.taggedMemberIds.filter((mid) => mid !== id) }));
    setPhotos(nextPhotos);
    nextPhotos.forEach((p) => {
      const before = photos.find((x) => x.id === p.id);
      if (before && before.taggedMemberIds.length !== p.taggedMemberIds.length) {
        changes.push({ kind: 'photo', id: p.id, json: p as unknown });
      }
    });
    const nextEvents = events.map((e) => ({ ...e, participantIds: e.participantIds.filter((pid) => pid !== id) }));
    setEvents(nextEvents);
    nextEvents.forEach((e) => {
      const before = events.find((x) => x.id === e.id);
      if (before && before.participantIds.length !== e.participantIds.length) {
        changes.push({ kind: 'event', id: e.id, json: e as unknown });
      }
    });
    const removedTimeline = timeline.filter((entry) => entry.memberId === id);
    setTimeline(timeline.filter((entry) => entry.memberId !== id));
    removedTimeline.forEach((entry) => changes.push({ kind: 'timeline', id: entry.id, json: null }));
    setActivities(activities.filter((a) => a.targetMemberId !== id));
    setNotifications(notifications.filter((n) => n.targetId !== id));
    queueChanges(changes);
    if (selectedMemberId === id) {
      setSelectedMemberId(null);
    }
    pushToast(`${t.memberDeleted}${target ? `: ${target.fullName}` : ''}`, 'success');
    return true;
  };

  const addPhoto = (photoData: Omit<FamilyPhoto, 'id'>): boolean => {
    if (!isAdmin) {
      pushToast(t.readOnlyNotice, 'error');
      setIsLoginModalOpen(true);
      return false;
    }
    if (!photoData.title.trim() || !photoData.url.trim()) {
      pushToast(t.nameRequired, 'error');
      return false;
    }

    const newId = `p_${Date.now()}`;
    const newPhoto: FamilyPhoto = { ...photoData, id: newId };
    setPhotos([newPhoto, ...photos]);
    queueChanges([{ kind: 'photo', id: newId, json: newPhoto as unknown }]);

    if (photoData.albumId) {
      const nextAlbums = albums.map((a) =>
        a.id === photoData.albumId ? { ...a, photoCount: a.photoCount + 1 } : a,
      );
      const changedAlbum = nextAlbums.find(
        (a, i) => a !== albums[i] && a.id === photoData.albumId,
      );
      setAlbums(nextAlbums);
      if (changedAlbum) {
        queueChanges([{ kind: 'album', id: changedAlbum.id, json: changedAlbum as unknown }]);
      }
    }

    const photoAct: FamilyActivity = {
      id: `act_${Date.now()}`,
      title: t.photoAdded,
      description: `"${photoData.title}"`,
      timestamp: 'Hozirgina',
      avatarUrl: photoData.url,
      type: 'photo_added',
      targetMemberId: undefined,
    };
    setActivities([photoAct, ...activities].slice(0, 100));
    queueChanges([{ kind: 'activity', id: photoAct.id, json: photoAct as unknown }]);
    pushToast(t.photoAdded, 'success');
    return true;
  };

  const addAlbum = (albumData: Omit<FamilyAlbum, 'id' | 'photoCount'>): boolean => {
    if (!isAdmin) {
      pushToast(t.readOnlyNotice, 'error');
      return false;
    }
    if (!albumData.title.trim()) {
      pushToast(t.nameRequired, 'error');
      return false;
    }
    const newAlbum: FamilyAlbum = {
      ...albumData,
      id: `alb_${Date.now()}`,
      photoCount: 0,
    };
    setAlbums([...albums, newAlbum]);
    queueChanges([{ kind: 'album', id: newAlbum.id, json: newAlbum as unknown }]);
    return true;
  };

  const addEvent = (eventData: Omit<FamilyEvent, 'id'>): boolean => {
    if (!isAdmin) {
      pushToast(t.readOnlyNotice, 'error');
      setIsLoginModalOpen(true);
      return false;
    }
    if (!eventData.title.trim() || !eventData.date) {
      pushToast(t.nameRequired, 'error');
      return false;
    }

    const newEvent: FamilyEvent = {
      ...eventData,
      id: `ev_${Date.now()}`,
    };
    setEvents([...events, newEvent].sort((a, b) => a.date.localeCompare(b.date)));
    queueChanges([{ kind: 'event', id: newEvent.id, json: newEvent as unknown }]);

    const eventAct: FamilyActivity = {
      id: `act_${Date.now()}`,
      title: t.eventCreated,
      description: `${eventData.title} (${eventData.date})`,
      timestamp: 'Hozirgina',
      type: 'event_created',
    };
    setActivities([eventAct, ...activities].slice(0, 100));
    queueChanges([{ kind: 'activity', id: eventAct.id, json: eventAct as unknown }]);
    pushToast(t.eventCreated, 'success');
    return true;
  };

  const addNote = (noteData: Omit<FamilyNote, 'id' | 'date'>): boolean => {
    if (!isAdmin) {
      pushToast(t.readOnlyNotice, 'error');
      return false;
    }
    if (!noteData.title.trim() || !noteData.content.trim()) {
      pushToast(t.nameRequired, 'error');
      return false;
    }
    const newNote: FamilyNote = {
      ...noteData,
      id: `fn_${Date.now()}`,
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
    };
    setNotes([newNote, ...notes]);
    queueChanges([{ kind: 'note', id: newNote.id, json: newNote as unknown }]);
    pushToast(t.memoryAdded, 'success');
    return true;
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
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
        isOwner,
        accounts,
        booting,
        serverOnline,
        toasts,
        pushToast,
        dismissToast,
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
        setIsOnboardingOpen: (open: boolean) => {
          if (!open) closeOnboarding();
          else setIsOnboardingOpen(true);
        },
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
        refreshAccounts,
        createAccount,
        removeAccount,
        addMember,
        updateMember,
        deleteMember,
        addPhoto,
        addAlbum,
        addEvent,
        addNote,
        markNotificationRead,
        markAllNotificationsRead,
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
