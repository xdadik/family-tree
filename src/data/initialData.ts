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

/**
 * Local-only owner credential for the first run.
 * Change it after entering the app by adding delegated admins in Settings.
 */
export const ADMIN_USER: CurrentUser = {
  id: 'u_owner',
  username: 'admin',
  name: 'Big Admin',
  email: 'admin@family.local',
  avatarUrl: '',
  role: 'owner',
};

export const INITIAL_MEMBERS: FamilyMember[] = [];
export const INITIAL_ALBUMS: FamilyAlbum[] = [];
export const INITIAL_PHOTOS: FamilyPhoto[] = [];
export const INITIAL_EVENTS: FamilyEvent[] = [];
export const INITIAL_TIMELINE: TimelineEntry[] = [];
export const INITIAL_NOTES: FamilyNote[] = [];
export const INITIAL_ACTIVITIES: FamilyActivity[] = [];
export const INITIAL_NOTIFICATIONS: FamilyNotification[] = [];
