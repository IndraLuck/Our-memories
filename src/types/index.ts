export type MemoryType = 'photo' | 'journal' | 'core' | 'music' | 'milestone';

export type MoodType = 'romantic' | 'magical' | 'cozy' | 'adventurous' | 'silly' | 'bittersweet' | 'grateful';

export type SyncState = 'synced' | 'syncing' | 'offline' | 'error' | 'local_only';

export interface Memory {
  id: string;
  notebookId?: string;
  createdBy?: string;
  type: MemoryType;
  title: string;
  date: string; // YYYY-MM-DD
  description: string;
  images: string[];
  mood: MoodType;
  tags: string[];
  category: string;
  collectionId?: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  isFavorite: boolean;
  isCore: boolean;
  songArtist?: string;
  songTitle?: string;
  songUrl?: string;
  spotifyUri?: string;
  deletedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  version?: number;
}

export interface Collection {
  id: string;
  notebookId?: string;
  name: string;
  description?: string;
  coverImage?: string;
  createdAt: string;
  isFavorite?: boolean;
}

export interface SpecialDate {
  id: string;
  notebookId?: string;
  title: string;
  date: string; // YYYY-MM-DD
  category: 'anniversary' | 'birthday' | 'trip' | 'milestone' | 'custom';
  emoji: string;
  isRecurring: boolean;
  note?: string;
}

export interface Milestone {
  id: string;
  notebookId?: string;
  title: string;
  date: string;
  emoji: string;
  description: string;
  category: string;
}

export interface AppreciationNote {
  id: string;
  notebookId?: string;
  createdBy?: string;
  text: string;
  author: string;
  date: string;
  isFavorite?: boolean;
}

export type ThemeName = 'blush' | 'lavender' | 'linen' | 'velvet';

export interface NotebookSettings {
  person1: string;
  person2: string;
  title: string;
  subtitle: string;
  startDate: string; // YYYY-MM-DD
  theme: ThemeName;
  enableAnimations: boolean;
  supabaseUrl?: string;
  supabaseAnonKey?: string;
  syncEnabled?: boolean;
}

export interface NotebookUser {
  id: string;
  email: string;
  displayName?: string;
  role?: 'owner' | 'partner' | 'member';
}

export interface NotebookInfo {
  id: string;
  name: string;
  created_by: string;
  members: NotebookUser[];
  inviteCode?: string;
}

export interface DaysTogetherInfo {
  days: number;
  weeks: number;
  months: number;
  years: number;
  hours: number;
  nextAnniversaryDays: number;
  nextAnniversaryYear: number;
  formattedDate: string;
}

export interface MemoryStats {
  totalMemories: number;
  totalPhotos: number;
  totalJournalEntries: number;
  totalSongs: number;
  totalCoreMemories: number;
  favoriteCount: number;
  totalJournalWords: number;
  topMood: string;
  moodCounts: Record<MoodType, number>;
  yearsCovered: number;
  uniqueLocationsCount: number;
}

export interface BackupPayload {
  version: string;
  exportedAt: string;
  settings: NotebookSettings;
  memories: Memory[];
  collections?: Collection[];
  specialDates?: SpecialDate[];
  appreciationNotes: AppreciationNote[];
}
