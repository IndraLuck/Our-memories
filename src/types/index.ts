export type MemoryType = 'photo' | 'journal' | 'core' | 'music' | 'milestone';

export type MoodType = 'romantic' | 'magical' | 'cozy' | 'adventurous' | 'silly' | 'bittersweet' | 'grateful';

export interface Memory {
  id: string;
  type: MemoryType;
  title: string;
  date: string; // YYYY-MM-DD
  description: string;
  images: string[];
  mood: MoodType;
  tags: string[];
  category: string;
  location?: string;
  isFavorite: boolean;
  isCore: boolean;
  songArtist?: string;
  songTitle?: string;
  songUrl?: string;
  spotifyUri?: string;
  deletedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Milestone {
  id: string;
  title: string;
  date: string;
  emoji: string;
  description: string;
  category: string;
}

export interface AppreciationNote {
  id: string;
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

export interface BackupPayload {
  version: string;
  exportedAt: string;
  settings: NotebookSettings;
  memories: Memory[];
  appreciationNotes: AppreciationNote[];
}
