export type Gender = 'male' | 'female' | 'other';

export type UserRole = 'admin' | 'viewer';

export interface FamilyMember {
  id: string;
  fullName: string;
  nickname?: string;
  gender: Gender;
  relationLabel: string; // e.g. "Father", "Daughter", "Grandmother"
  birthDate: string;
  birthYear: number;
  deathDate?: string;
  deathYear?: number;
  isLiving: boolean;
  birthPlace: string;
  currentResidence?: string;
  avatarUrl: string;
  coverUrl?: string;
  phone?: string;
  email?: string;
  bio?: string;
  notes?: string;
  profession?: string;
  generation: number;
  parentIds: string[];
  spouseId?: string;
  childrenIds: string[];
  siblingIds?: string[];
  verified?: boolean;
}

export interface FamilyAlbum {
  id: string;
  title: string;
  description: string;
  coverUrl: string;
  photoCount: number;
  year?: string;
}

export interface FamilyPhoto {
  id: string;
  albumId: string;
  url: string;
  title: string;
  description?: string;
  date: string;
  location?: string;
  taggedMemberIds: string[];
  commentsCount: number;
}

export interface FamilyEvent {
  id: string;
  title: string;
  type: 'birthday' | 'anniversary' | 'reunion' | 'wedding' | 'memorial' | 'gathering' | 'other';
  date: string;
  time?: string;
  location: string;
  description: string;
  participantIds: string[];
  coverUrl?: string;
}

export interface TimelineEntry {
  id: string;
  year: number;
  dateStr: string;
  title: string;
  description: string;
  memberId?: string;
  category: 'birth' | 'marriage' | 'reunion' | 'milestone' | 'historical';
  imageUrl?: string;
}

export interface FamilyNote {
  id: string;
  title: string;
  content: string;
  authorName: string;
  date: string;
  category: 'memory' | 'recipe' | 'tradition' | 'story';
}

export interface FamilyActivity {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  avatarUrl?: string;
  type: 'member_added' | 'profile_updated' | 'photo_added' | 'event_created';
  targetMemberId?: string;
}

export interface FamilyNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'birthday' | 'photo' | 'invitation' | 'event';
  targetId?: string;
}

export interface CurrentUser {
  id: string;
  username: string;
  name: string;
  email: string;
  avatarUrl: string;
  role: UserRole;
  familyMemberId?: string;
}

export type ActiveTab = 'home' | 'tree' | 'search' | 'settings';
export type TreeViewMode = 'tree' | 'list' | 'orbit3d';
