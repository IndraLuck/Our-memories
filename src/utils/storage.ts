import { AppreciationNote, BackupPayload, Collection, Memory, NotebookSettings, SpecialDate } from '../types';
import {
  DEFAULT_SETTINGS,
  INITIAL_APPRECIATIONS,
  INITIAL_COLLECTIONS,
  INITIAL_MEMORIES,
  INITIAL_SPECIAL_DATES,
} from './defaultData';

const SETTINGS_KEY = 'omn_settings_v3';
const MEMORIES_KEY = 'omn_memories_v3';
const APPRECIATIONS_KEY = 'omn_appreciations_v3';
const COLLECTIONS_KEY = 'omn_collections_v3';
const SPECIAL_DATES_KEY = 'omn_special_dates_v3';

/**
 * Robust image compressor using an offscreen canvas.
 * Compresses raw high-res camera uploads (5MB - 20MB) down to optimized WebP/JPEG (~100KB - 250KB).
 */
export async function compressImageFile(file: File, maxWidth = 1280, quality = 0.82): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('Selected file is not an image.'));
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read image file.'));
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => reject(new Error('Failed to decode image data.'));
      img.onload = () => {
        let { width, height } = img;

        if (width > maxWidth || height > maxWidth) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxWidth) / height);
            height = maxWidth;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        let dataUrl = canvas.toDataURL('image/webp', quality);
        if (!dataUrl.startsWith('data:image/webp')) {
          dataUrl = canvas.toDataURL('image/jpeg', quality);
        }

        resolve(dataUrl);
      };
      img.src = e.target?.result as string;
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Settings storage
 */
export function loadSettings(): NotebookSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_SETTINGS, ...parsed };
  } catch (err) {
    console.warn('Failed to load settings, using defaults', err);
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: NotebookSettings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (err) {
    console.error('Failed to save settings to localStorage', err);
  }
}

/**
 * Memories storage
 */
export function loadMemories(): Memory[] {
  try {
    const raw = localStorage.getItem(MEMORIES_KEY);
    if (!raw) {
      saveMemories(INITIAL_MEMORIES);
      return INITIAL_MEMORIES;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return INITIAL_MEMORIES;
    }
    return parsed;
  } catch (err) {
    console.warn('Failed to load memories, using initial memories', err);
    return INITIAL_MEMORIES;
  }
}

export function saveMemories(memories: Memory[]): void {
  try {
    localStorage.setItem(MEMORIES_KEY, JSON.stringify(memories));
  } catch (err) {
    console.error('Failed to save memories to storage', err);
  }
}

/**
 * Collections storage
 */
export function loadCollections(): Collection[] {
  try {
    const raw = localStorage.getItem(COLLECTIONS_KEY);
    if (!raw) {
      saveCollections(INITIAL_COLLECTIONS);
      return INITIAL_COLLECTIONS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : INITIAL_COLLECTIONS;
  } catch {
    return INITIAL_COLLECTIONS;
  }
}

export function saveCollections(collections: Collection[]): void {
  try {
    localStorage.setItem(COLLECTIONS_KEY, JSON.stringify(collections));
  } catch (err) {
    console.error('Failed to save collections', err);
  }
}

/**
 * Special Dates storage
 */
export function loadSpecialDates(): SpecialDate[] {
  try {
    const raw = localStorage.getItem(SPECIAL_DATES_KEY);
    if (!raw) {
      saveSpecialDates(INITIAL_SPECIAL_DATES);
      return INITIAL_SPECIAL_DATES;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : INITIAL_SPECIAL_DATES;
  } catch {
    return INITIAL_SPECIAL_DATES;
  }
}

export function saveSpecialDates(dates: SpecialDate[]): void {
  try {
    localStorage.setItem(SPECIAL_DATES_KEY, JSON.stringify(dates));
  } catch (err) {
    console.error('Failed to save special dates', err);
  }
}

/**
 * Appreciation notes storage
 */
export function loadAppreciations(): AppreciationNote[] {
  try {
    const raw = localStorage.getItem(APPRECIATIONS_KEY);
    if (!raw) {
      saveAppreciations(INITIAL_APPRECIATIONS);
      return INITIAL_APPRECIATIONS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : INITIAL_APPRECIATIONS;
  } catch {
    return INITIAL_APPRECIATIONS;
  }
}

export function saveAppreciations(notes: AppreciationNote[]): void {
  try {
    localStorage.setItem(APPRECIATIONS_KEY, JSON.stringify(notes));
  } catch (err) {
    console.error('Failed to save appreciation notes', err);
  }
}

/**
 * Full JSON backup generation
 */
export function generateBackup(
  memories: Memory[],
  settings: NotebookSettings,
  appreciationNotes: AppreciationNote[],
  collections?: Collection[],
  specialDates?: SpecialDate[]
): BackupPayload {
  return {
    version: '3.0.0',
    exportedAt: new Date().toISOString(),
    settings,
    memories,
    collections: collections || loadCollections(),
    specialDates: specialDates || loadSpecialDates(),
    appreciationNotes,
  };
}

/**
 * Triggers browser download of backup file
 */
export function triggerBackupDownload(payload: BackupPayload): void {
  const jsonStr = JSON.stringify(payload, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  const dateStr = new Date().toISOString().slice(0, 10);
  anchor.href = url;
  anchor.download = `our-memory-notebook-backup-${dateStr}.json`;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

/**
 * Validate imported JSON backup string
 */
export function validateAndParseBackup(jsonString: string): {
  isValid: boolean;
  data?: BackupPayload;
  error?: string;
} {
  try {
    if (!jsonString || typeof jsonString !== 'string') {
      return { isValid: false, error: 'Empty or invalid file content.' };
    }

    const parsed = JSON.parse(jsonString);

    if (!parsed || typeof parsed !== 'object') {
      return { isValid: false, error: 'Invalid JSON format.' };
    }

    if (!Array.isArray(parsed.memories)) {
      return { isValid: false, error: 'Backup does not contain a valid memories list.' };
    }

    for (const mem of parsed.memories) {
      if (!mem.id || !mem.title || !mem.date) {
        return { isValid: false, error: 'One or more memories have missing required fields (id, title, date).' };
      }
    }

    const validPayload: BackupPayload = {
      version: parsed.version || '3.0.0',
      exportedAt: parsed.exportedAt || new Date().toISOString(),
      settings: parsed.settings && typeof parsed.settings === 'object' ? { ...DEFAULT_SETTINGS, ...parsed.settings } : DEFAULT_SETTINGS,
      memories: parsed.memories,
      collections: Array.isArray(parsed.collections) ? parsed.collections : INITIAL_COLLECTIONS,
      specialDates: Array.isArray(parsed.specialDates) ? parsed.specialDates : INITIAL_SPECIAL_DATES,
      appreciationNotes: Array.isArray(parsed.appreciationNotes) ? parsed.appreciationNotes : [],
    };

    return { isValid: true, data: validPayload };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown parsing error';
    return { isValid: false, error: `Invalid JSON syntax: ${errorMsg}` };
  }
}
