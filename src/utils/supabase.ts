import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Memory } from '../types';

let supabaseInstance: SupabaseClient | null = null;
let cachedConfig = { url: '', key: '' };

/**
 * Get or create Supabase client instance
 */
export function getSupabaseClient(url?: string, anonKey?: string): SupabaseClient | null {
  const targetUrl = url || import.meta.env.VITE_SUPABASE_URL;
  const targetKey = anonKey || import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!targetUrl || !targetKey) {
    return null;
  }

  if (supabaseInstance && cachedConfig.url === targetUrl && cachedConfig.key === targetKey) {
    return supabaseInstance;
  }

  try {
    supabaseInstance = createClient(targetUrl, targetKey);
    cachedConfig = { url: targetUrl, key: targetKey };
    return supabaseInstance;
  } catch (err) {
    console.warn('Failed to initialize Supabase client:', err);
    return null;
  }
}

/**
 * Tests connection to user-provided Supabase project
 */
export async function testSupabaseConnection(url: string, anonKey: string): Promise<{ success: boolean; message: string }> {
  try {
    const client = createClient(url, anonKey);
    const { error } = await client.from('memories').select('id').limit(1);

    if (error && error.code !== 'PGRST116') {
      // If table doesn't exist yet, we still know the credentials authenticated if it's table-missing vs 401 unauthorized
      if (error.message.includes('relation "memories" does not exist') || error.code === '42P01') {
        return {
          success: true,
          message: 'Connected to Supabase! Note: Please run the SQL migration schema in your Supabase SQL Editor.',
        };
      }
      return { success: false, message: error.message };
    }

    return { success: true, message: 'Successfully connected and verified Supabase database!' };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Connection failed';
    return { success: false, message: msg };
  }
}

/**
 * Sync local memories to Supabase
 */
export async function syncMemoriesToCloud(
  memories: Memory[],
  url?: string,
  anonKey?: string
): Promise<{ success: boolean; count: number; error?: string }> {
  const client = getSupabaseClient(url, anonKey);
  if (!client) {
    return { success: false, count: 0, error: 'Supabase credentials not configured' };
  }

  try {
    const payload = memories.map((m) => ({
      id: m.id,
      type: m.type,
      title: m.title,
      date: m.date,
      description: m.description,
      images: m.images,
      mood: m.mood,
      tags: m.tags,
      category: m.category,
      location: m.location || null,
      is_favorite: m.isFavorite,
      is_core: m.isCore,
      song_artist: m.songArtist || null,
      song_title: m.songTitle || null,
      song_url: m.songUrl || null,
      deleted_at: m.deletedAt || null,
      updated_at: new Date().toISOString(),
    }));

    const { error } = await client.from('memories').upsert(payload, { onConflict: 'id' });

    if (error) {
      return { success: false, count: 0, error: error.message };
    }

    return { success: true, count: memories.length };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Sync failed';
    return { success: false, count: 0, error: msg };
  }
}

/**
 * Full copy-paste SQL Schema for Supabase with RLS
 */
export const SUPABASE_SQL_SCHEMA = `
-- 1. Create memories table
CREATE TABLE IF NOT EXISTS public.memories (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  date TEXT NOT NULL,
  description TEXT,
  images JSONB DEFAULT '[]'::jsonb,
  mood TEXT,
  tags JSONB DEFAULT '[]'::jsonb,
  category TEXT,
  location TEXT,
  is_favorite BOOLEAN DEFAULT false,
  is_core BOOLEAN DEFAULT false,
  song_artist TEXT,
  song_title TEXT,
  song_url TEXT,
  deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.memories ENABLE ROW LEVEL SECURITY;

-- 3. Policy: Allow anon key access for private shared couple notebook
CREATE POLICY "Allow anon read/write for couple notebook"
ON public.memories
FOR ALL
TO anon, authenticated
USING (true)
WITH CHECK (true);
`.trim();
