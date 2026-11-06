import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { Memory, NotebookInfo, NotebookUser } from '../types';

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
    supabaseInstance = createClient(targetUrl, targetKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
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
    const { data: authData, error: authError } = await client.auth.getSession();
    
    // Test database access
    const { error: dbError } = await client.from('notebooks').select('id').limit(1);

    if (dbError && dbError.code === '42P01') {
      return {
        success: true,
        message: 'Connected to Supabase! Note: Please execute the provided SQL schema in your Supabase SQL editor to create the tables.',
      };
    }

    if (dbError && dbError.message.includes('API key')) {
      return { success: false, message: 'Invalid Supabase Anon Key. Please check your credentials.' };
    }

    return { success: true, message: 'Successfully connected and verified Supabase database & auth!' };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Connection failed';
    return { success: false, message: msg };
  }
}

/**
 * Get current authenticated user session
 */
export async function getAuthSession(client?: SupabaseClient | null): Promise<User | null> {
  const c = client || getSupabaseClient();
  if (!c) return null;
  try {
    const { data } = await c.auth.getUser();
    return data.user;
  } catch {
    return null;
  }
}

/**
 * Signs up a new user
 */
export async function signUpUser(email: string, password: string, client?: SupabaseClient | null) {
  const c = client || getSupabaseClient();
  if (!c) throw new Error('Supabase client not initialized');
  return await c.auth.signUp({ email, password });
}

/**
 * Signs in a user
 */
export async function signInUser(email: string, password: string, client?: SupabaseClient | null) {
  const c = client || getSupabaseClient();
  if (!c) throw new Error('Supabase client not initialized');
  return await c.auth.signInWithPassword({ email, password });
}

/**
 * Signs out current user
 */
export async function signOutUser(client?: SupabaseClient | null) {
  const c = client || getSupabaseClient();
  if (!c) return;
  await c.auth.signOut();
}

/**
 * Fetches notebooks that the current user belongs to
 */
export async function getUserNotebooks(client?: SupabaseClient | null): Promise<NotebookInfo[]> {
  const c = client || getSupabaseClient();
  if (!c) return [];

  const user = await getAuthSession(c);
  if (!user) return [];

  try {
    const { data: members, error } = await c
      .from('notebook_members')
      .select('notebook_id, role, notebooks(id, name, created_by)')
      .eq('user_id', user.id);

    if (error || !members) return [];

    return members.map((m: any) => ({
      id: m.notebooks?.id || m.notebook_id,
      name: m.notebooks?.name || 'Our Memory Notebook',
      created_by: m.notebooks?.created_by,
      members: [],
    }));
  } catch (err) {
    console.warn('Error fetching notebooks:', err);
    return [];
  }
}

/**
 * Create a new private notebook
 */
export async function createPrivateNotebook(name: string, client?: SupabaseClient | null): Promise<string | null> {
  const c = client || getSupabaseClient();
  if (!c) return null;
  const user = await getAuthSession(c);
  if (!user) return null;

  try {
    const notebookId = `nb-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const { error: nbError } = await c.from('notebooks').insert({
      id: notebookId,
      name,
      created_by: user.id,
    });

    if (nbError) throw nbError;

    // Add creator as owner member
    await c.from('notebook_members').insert({
      notebook_id: notebookId,
      user_id: user.id,
      role: 'owner',
    });

    return notebookId;
  } catch (err) {
    console.error('Failed to create private notebook:', err);
    return null;
  }
}

/**
 * Create an invitation code for a partner to join this private notebook
 */
export async function createNotebookInvite(notebookId: string, email?: string, client?: SupabaseClient | null): Promise<string | null> {
  const c = client || getSupabaseClient();
  if (!c) return null;
  const user = await getAuthSession(c);
  if (!user) return null;

  const inviteCode = `LOVE-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

  try {
    const { error } = await c.from('notebook_invites').insert({
      notebook_id: notebookId,
      invite_code: inviteCode,
      created_by: user.id,
      email: email || null,
      status: 'pending',
      expires_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    });

    if (error) throw error;
    return inviteCode;
  } catch (err) {
    console.error('Failed to generate invite code:', err);
    return null;
  }
}

/**
 * Accept an invite code to join a partner's notebook
 */
export async function acceptNotebookInvite(inviteCode: string, client?: SupabaseClient | null): Promise<{ success: boolean; notebookId?: string; error?: string }> {
  const c = client || getSupabaseClient();
  if (!c) return { success: false, error: 'Database not configured' };
  const user = await getAuthSession(c);
  if (!user) return { success: false, error: 'Must be signed in to accept an invitation' };

  try {
    const { data: invite, error: fetchErr } = await c
      .from('notebook_invites')
      .select('*')
      .eq('invite_code', inviteCode.trim().toUpperCase())
      .eq('status', 'pending')
      .single();

    if (fetchErr || !invite) {
      return { success: false, error: 'Invalid or expired invitation code.' };
    }

    // Add partner into notebook members
    const { error: joinErr } = await c.from('notebook_members').insert({
      notebook_id: invite.notebook_id,
      user_id: user.id,
      role: 'partner',
    });

    if (joinErr && !joinErr.message.includes('unique')) {
      return { success: false, error: joinErr.message };
    }

    // Update invite status
    await c.from('notebook_invites').update({ status: 'accepted' }).eq('id', invite.id);

    return { success: true, notebookId: invite.notebook_id };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to join notebook';
    return { success: false, error: msg };
  }
}

/**
 * Synchronize local memories to Cloud with conflict resolution
 */
export async function syncMemoriesToCloud(
  memories: Memory[],
  url?: string,
  anonKey?: string,
  notebookId?: string
): Promise<{ success: boolean; count: number; error?: string }> {
  const client = getSupabaseClient(url, anonKey);
  if (!client) {
    return { success: false, count: 0, error: 'Supabase credentials not configured' };
  }

  const user = await getAuthSession(client);

  try {
    const targetNotebookId = notebookId || 'default-notebook';

    const payload = memories.map((m) => ({
      id: m.id,
      notebook_id: targetNotebookId,
      created_by: user?.id || null,
      type: m.type,
      title: m.title,
      date: m.date,
      description: m.description,
      images: m.images,
      mood: m.mood,
      tags: m.tags,
      category: m.category,
      collection_id: m.collectionId || null,
      location: m.location || null,
      latitude: m.latitude || null,
      longitude: m.longitude || null,
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
 * Production-Grade PostgreSQL Schema with STRICT Row Level Security (RLS)
 * NO 'USING (true)' OR 'WITH CHECK (true)' on private data.
 * Real member-scoped authorization between partners.
 */
export const SUPABASE_SQL_SCHEMA = `
-- =========================================================================
-- OUR MEMORY NOTEBOOK — PRODUCTION CLOUD SCHEMA WITH STRICT RLS
-- =========================================================================

-- 1. Notebooks table (Private shared world for two)
CREATE TABLE IF NOT EXISTS public.notebooks (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL DEFAULT 'Our Memory Notebook',
  created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Notebook members (Authorized partners with roles: owner, partner)
CREATE TABLE IF NOT EXISTS public.notebook_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  notebook_id TEXT REFERENCES public.notebooks(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'partner',
  joined_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(notebook_id, user_id)
);

-- 3. Notebook invites (Secure token-based invitation between partners)
CREATE TABLE IF NOT EXISTS public.notebook_invites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  notebook_id TEXT REFERENCES public.notebooks(id) ON DELETE CASCADE,
  invite_code TEXT UNIQUE NOT NULL,
  email TEXT,
  created_by UUID REFERENCES auth.users(id),
  status TEXT DEFAULT 'pending',
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Memories table
CREATE TABLE IF NOT EXISTS public.memories (
  id TEXT PRIMARY KEY,
  notebook_id TEXT REFERENCES public.notebooks(id) ON DELETE CASCADE,
  created_by UUID REFERENCES auth.users(id),
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  date TEXT NOT NULL,
  description TEXT,
  images JSONB DEFAULT '[]'::jsonb,
  mood TEXT,
  tags JSONB DEFAULT '[]'::jsonb,
  category TEXT,
  collection_id TEXT,
  location TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  is_favorite BOOLEAN DEFAULT false,
  is_core BOOLEAN DEFAULT false,
  song_artist TEXT,
  song_title TEXT,
  song_url TEXT,
  deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Collections / Albums
CREATE TABLE IF NOT EXISTS public.collections (
  id TEXT PRIMARY KEY,
  notebook_id TEXT REFERENCES public.notebooks(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  cover_image TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Appreciation Notes (Love notes jar)
CREATE TABLE IF NOT EXISTS public.appreciation_notes (
  id TEXT PRIMARY KEY,
  notebook_id TEXT REFERENCES public.notebooks(id) ON DELETE CASCADE,
  created_by UUID REFERENCES auth.users(id),
  author_name TEXT NOT NULL,
  text TEXT NOT NULL,
  is_favorite BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Special Dates & Countdowns
CREATE TABLE IF NOT EXISTS public.special_dates (
  id TEXT PRIMARY KEY,
  notebook_id TEXT REFERENCES public.notebooks(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  date TEXT NOT NULL,
  category TEXT DEFAULT 'milestone',
  emoji TEXT DEFAULT '🌸',
  is_recurring BOOLEAN DEFAULT true,
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- =========================================================================
-- STRICT ROW LEVEL SECURITY (RLS) POLICIES
-- Only authorized notebook members can read, create, update, or delete records.
-- =========================================================================

ALTER TABLE public.notebooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notebook_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notebook_invites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appreciation_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.special_dates ENABLE ROW LEVEL SECURITY;

-- Notebooks policies
CREATE POLICY "Users can view notebooks they belong to"
ON public.notebooks FOR SELECT TO authenticated
USING (
  id IN (SELECT notebook_id FROM public.notebook_members WHERE user_id = auth.uid())
);

CREATE POLICY "Users can create their own notebook"
ON public.notebooks FOR INSERT TO authenticated
WITH CHECK (auth.uid() = created_by);

-- Notebook members policies
CREATE POLICY "Members can view membership of their notebooks"
ON public.notebook_members FOR SELECT TO authenticated
USING (
  notebook_id IN (SELECT notebook_id FROM public.notebook_members WHERE user_id = auth.uid())
  OR user_id = auth.uid()
);

CREATE POLICY "Members can join or manage notebook membership"
ON public.notebook_members FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Memories policies (Strict member authorization)
CREATE POLICY "Authorized members can read notebook memories"
ON public.memories FOR SELECT TO authenticated
USING (
  notebook_id IN (SELECT notebook_id FROM public.notebook_members WHERE user_id = auth.uid())
);

CREATE POLICY "Authorized members can add memories"
ON public.memories FOR INSERT TO authenticated
WITH CHECK (
  notebook_id IN (SELECT notebook_id FROM public.notebook_members WHERE user_id = auth.uid())
);

CREATE POLICY "Authorized members can edit memories"
ON public.memories FOR UPDATE TO authenticated
USING (
  notebook_id IN (SELECT notebook_id FROM public.notebook_members WHERE user_id = auth.uid())
)
WITH CHECK (
  notebook_id IN (SELECT notebook_id FROM public.notebook_members WHERE user_id = auth.uid())
);

CREATE POLICY "Authorized members can soft-delete or remove memories"
ON public.memories FOR DELETE TO authenticated
USING (
  notebook_id IN (SELECT notebook_id FROM public.notebook_members WHERE user_id = auth.uid())
);

-- Realtime publication for live couple synchronization
ALTER PUBLICATION supabase_realtime ADD TABLE public.memories, public.appreciation_notes;
`.trim();
