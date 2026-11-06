# Our Memory Notebook 📖✨
### A Private Digital Sanctuary for Two

A beautifully crafted, romantic, and modern digital memory book designed for couples to preserve their milestones, photos, personal diaries, love notes, and soundtracks across time.

---

## 🌟 Key Features

1. **Homepage & Milestone Counter**
   - Live Days-Together counter calculating total days, weeks, and hours.
   - Milestone tracker and anniversary countdown.
   - Interactive celebratory confetti button.
   - **On This Day**: Highlights memories that happened on today's date in past years.
   - **Take Me Back**: Shuffle button revealing a random chapter from your story.
   - Horizontal **Photo Dump** carousel.

2. **Photos Album**
   - Polaroid and editorial card presentation with washi-tape accents.
   - Fullscreen Lightbox viewer with captions, dates, locations, and moods.
   - Automatic client-side image compression: smartphone photos (5–20MB) are smoothly compressed to optimized WebP/JPEG (<250KB) before saving to IndexedDB so storage never overflows.
   - Filter by Favorites and custom collections (Dates, Trips, Milestones, Little Things).

3. **Personal Journal & Diaries**
   - Intimate diary entries with expand/collapse reading mode.
   - Filter by mood: 🥰 Romantic, ✨ Magical, ☕ Cozy, 🌴 Adventurous, 😂 Silly, 💖 Grateful.
   - Paper-inspired typography and handwritten accents.

4. **Core Memories**
   - Golden badges for defining milestones.
   - Spotlight feature with shuffle.

5. **Soundtrack of Us**
   - Songs tied to specific moments (first road trip, kitchen dances) with notes and Spotify links.

6. **Relationship Timeline**
   - Interactive vertical timeline showing every memory and milestone chronologically.
   - Filter by year.

7. **Love Notes Jar ("Reasons I Appreciate You")**
   - Tender appreciation notes jar where both partners can leave and read love notes.

8. **Settings, Themes, & Safety**
   - 4 hand-crafted visual palettes:
     - **Romantic Blush**: Soft rose, blush pink & warm cream.
     - **Lavender Mist**: Lilac, gentle purple & periwinkle.
     - **Vintage Linen**: Antique paper, sepia & amber.
     - **Midnight Velvet**: Deep romantic slate & warm gold.
   - **Recently Deleted (Trash)**: Soft-deletion safeguard with instant restoration or permanent deletion.
   - **Full JSON Backup & Restore**: Download all memories, photos, and settings into one JSON file to transfer between devices.
   - **Optional Supabase Cloud Sync**: Connect your free Supabase database with one click for real-time synchronization between Android and Windows.

---

## 🚀 How to Run Locally

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🌐 Publishing to GitHub Pages (Static Hosting)

This project has been preconfigured with `base: './'` in `vite.config.ts`, making it 100% compatible with GitHub Pages subfolder URLs.

### Step-by-Step GitHub Pages Deployment:

1. **Create a GitHub Repository**:
   - Go to [github.com/new](https://github.com/new).
   - Name it `our-memory-notebook` and click **Create repository**.

2. **Push your code**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit of Our Memory Notebook"
   git branch -M main
   git remote add origin https://github.com/<your-username>/our-memory-notebook.git
   git push -u origin main
   ```

3. **Build the production static files**:
   ```bash
   npm run build
   ```
   This generates the static website inside the `dist/` folder.

4. **Enable GitHub Pages**:
   - Go to your repository **Settings** > **Pages**.
   - Under **Build and deployment** > **Source**, choose **GitHub Actions** or deploy from the `dist` branch.
   - Alternatively, install `gh-pages`:
     ```bash
     npm install -D gh-pages
     npx gh-pages -d dist
     ```
   - Your site will be live at `https://<your-username>.github.io/our-memory-notebook/`!

---

## ☁️ Optional: Multi-Device Cloud Sync via Supabase

By default, all data is safely stored offline on your device in IndexedDB & LocalStorage.
To automatically sync between your Android phone and Windows computer:

1. Create a free project at [supabase.com](https://supabase.com).
2. Go to the **SQL Editor** in your Supabase dashboard and run this migration:

```sql
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
```

3. In the app, open **Settings** ⚙️ > **Cloud Sync** tab.
4. Paste your **Supabase Project URL** and **Anon Public Key**.
5. Click **Test Connection** and **Sync to Cloud Now**. Both devices will now share the same memories!

---

## 🔒 Privacy & Offline Storage Note

- Memories and photos are stored privately inside your browser's local IndexedDB and are never sent to external servers unless you explicitly configure Supabase.
- Always use the **Download Memory Backup** button in Settings periodically to create an offline backup file (`.json`).
