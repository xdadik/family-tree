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
} from '../types/family';

export const ADMIN_USER: CurrentUser = {
  id: 'u_admin',
  username: 'admin',
  name: 'Zafarovich (Admin)',
  email: 'zafarov1ich@family.uz',
  avatarUrl: '',
  role: 'admin',
};

export const VIEWER_USER: CurrentUser = {
  id: 'u_guest',
  username: 'guest',
  name: 'Mehmon',
  email: 'mehmon@family.uz',
  avatarUrl: '',
  role: 'viewer',
};

// Clean starting state for Sirojov family: no fake names or placeholder people
export const INITIAL_MEMBERS: FamilyMember[] = [];

export const INITIAL_ALBUMS: FamilyAlbum[] = [];

export const INITIAL_PHOTOS: FamilyPhoto[] = [];

export const INITIAL_EVENTS: FamilyEvent[] = [];

export const INITIAL_TIMELINE: TimelineEntry[] = [];

export const INITIAL_NOTES: FamilyNote[] = [];

export const INITIAL_ACTIVITIES: FamilyActivity[] = [];

export const INITIAL_NOTIFICATIONS: FamilyNotification[] = [];
