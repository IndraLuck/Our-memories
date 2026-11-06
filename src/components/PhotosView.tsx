import React, { useState } from 'react';
import {
  Heart,
  Search,
  MapPin,
  Calendar,
  Plus,
  Sparkles,
  Tag,
  Grid,
  Layers,
  Film,
  FolderHeart,
  SlidersHorizontal,
} from 'lucide-react';
import { Memory } from '../types';
import { formatFriendlyDate } from '../utils/date';

interface PhotosViewProps {
  memories: Memory[];
  onSelectMemory: (memory: Memory) => void;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onOpenAddModal: () => void;
}

export type PhotoDisplayMode = 'editorial' | 'polaroid' | 'film' | 'albums';

export const PhotosView: React.FC<PhotosViewProps> = ({
  memories,
  onSelectMemory,
  onToggleFavorite,
  onOpenAddModal,
}) => {
  const [displayMode, setDisplayMode] = useState<PhotoDisplayMode>('editorial');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedMood, setSelectedMood] = useState<string>('all');
  const [favoritesOnly, setFavoritesOnly] = useState(false);

  // Filter memories with images that are not soft-deleted
  const photoMemories = memories.filter((m) => !m.deletedAt && m.images && m.images.length > 0);

  const categories = ['all', ...Array.from(new Set(photoMemories.map((m) => m.category || 'General')))];
  const moods = ['all', ...Array.from(new Set(photoMemories.map((m) => m.mood).filter(Boolean)))];

  const filtered = photoMemories.filter((m) => {
    if (favoritesOnly && !m.isFavorite) return false;
    if (selectedCategory !== 'all' && m.category !== selectedCategory) return false;
    if (selectedMood !== 'all' && m.mood !== selectedMood) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = m.title.toLowerCase().includes(q);
      const matchDesc = m.description.toLowerCase().includes(q);
      const matchLoc = m.location?.toLowerCase().includes(q);
      const matchTags = m.tags?.some((t) => t.toLowerCase().includes(q));
      if (!matchTitle && !matchDesc && !matchLoc && !matchTags) return false;
    }
    return true;
  });

  // For Album Mode: group filtered memories by category
  const groupedByCategory = categories
    .filter((c) => c !== 'all')
    .map((cat) => ({
      name: cat,
      items: filtered.filter((m) => m.category === cat),
    }))
    .filter((group) => group.items.length > 0);

  // Static angle array for realistic polaroid scrapbook rotations
  const rotations = ['-rotate-1.5', 'rotate-1', '-rotate-1', 'rotate-2', '-rotate-2', 'rotate-0.5'];

  return (
    <div className="space-y-8 pb-16">
      {/* Editorial Header & Mode Switcher */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-stone-200/80 dark:border-stone-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-rose-600 dark:text-rose-400 uppercase tracking-wider">
            <span>Visual Story Archive</span>
            <span className="text-stone-300 dark:text-stone-700">·</span>
            <span>{photoMemories.length} Photographs</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-stone-900 dark:text-stone-50 mt-1">
            Our Photography Studio
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400">
            Switch between modern editorial spreads, scrapbook polaroid walls, and nostalgic 35mm film strips
          </p>
        </div>

        {/* View Mode Segmented Switcher & Primary Upload CTA */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center p-1 rounded-xl bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
            <button
              onClick={() => setDisplayMode('editorial')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                displayMode === 'editorial'
                  ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-sm'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
              }`}
              title="Modern Editorial Magazine Spread"
            >
              <Grid className="w-3.5 h-3.5" />
              <span>Editorial</span>
            </button>

            <button
              onClick={() => setDisplayMode('polaroid')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                displayMode === 'polaroid'
                  ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-sm'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
              }`}
              title="Romantic Polaroid Scrapbook Wall"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Polaroid Wall</span>
            </button>

            <button
              onClick={() => setDisplayMode('film')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                displayMode === 'film'
                  ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-sm'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
              }`}
              title="Nostalgic 35mm Film Negatives"
            >
              <Film className="w-3.5 h-3.5" />
              <span>35mm Film</span>
            </button>

            <button
              onClick={() => setDisplayMode('albums')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                displayMode === 'albums'
                  ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-sm'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
              }`}
              title="Grouped Themed Albums"
            >
              <FolderHeart className="w-3.5 h-3.5" />
              <span>Albums</span>
            </button>
          </div>

          <button
            onClick={onOpenAddModal}
            className="h-9 px-3.5 rounded-xl bg-stone-900 dark:bg-rose-600 text-white font-medium text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-sm hover:bg-stone-800 dark:hover:bg-rose-500 transition-all shrink-0"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Upload Photo</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search photos by title, place, tag..."
            className="w-full h-10 pl-10 pr-4 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-900 dark:text-stone-100 text-xs sm:text-sm placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-rose-400 shadow-sm"
          />
        </div>

        {/* Category & Mood Filter Controls */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          <button
            onClick={() => setFavoritesOnly(!favoritesOnly)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 ${
              favoritesOnly
                ? 'bg-rose-500 text-white shadow-sm'
                : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${favoritesOnly ? 'fill-white' : ''}`} />
            <span>Favorites</span>
          </button>

          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 capitalize ${
                selectedCategory === cat && !favoritesOnly
                  ? 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 font-semibold shadow-sm'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-700'
              }`}
            >
              {cat === 'all' ? 'All Themes' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* ==========================================================
          01. EDITORIAL MAGAZINE SPREAD MODE
          ========================================================== */}
      {displayMode === 'editorial' && (
        <>
          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filtered.map((mem, idx) => (
                <div
                  key={mem.id}
                  onClick={() => onSelectMemory(mem)}
                  className={`cursor-pointer group flex flex-col justify-between rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 p-4 transition-all duration-300 hover:shadow-xl ${
                    idx === 0 ? 'sm:col-span-2 lg:col-span-2' : ''
                  }`}
                >
                  <div
                    className={`relative w-full rounded-xl overflow-hidden bg-stone-100 dark:bg-stone-800 ${
                      idx === 0 ? 'aspect-[16/9]' : 'aspect-[4/3]'
                    }`}
                  >
                    <img
                      src={mem.images[0]}
                      alt={mem.title}
                      referrerPolicy="no-referrer"
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Favorite Button */}
                    <button
                      onClick={(e) => onToggleFavorite(mem.id, e)}
                      aria-label="Toggle Favorite"
                      className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/85 dark:bg-stone-900/85 backdrop-blur-sm flex items-center justify-center text-stone-700 dark:text-stone-200 hover:scale-110 active:scale-95 transition-all shadow-sm"
                    >
                      <Heart
                        className={`w-4 h-4 ${mem.isFavorite ? 'fill-rose-500 text-rose-500' : 'text-stone-600 dark:text-stone-300'}`}
                      />
                    </button>

                    {mem.isCore && (
                      <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-lg bg-stone-900/85 backdrop-blur-sm text-[11px] font-semibold text-amber-300 flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                        <span>Core Memory</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 px-1 space-y-2">
                    <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-rose-600 dark:text-rose-400 uppercase tracking-wider text-[11px]">
                          {mem.category || 'Snapshot'}
                        </span>
                        <span>·</span>
                        <span>{formatFriendlyDate(mem.date)}</span>
                      </div>
                      {mem.location && (
                        <span className="flex items-center gap-1 text-[11px] truncate max-w-[140px]">
                          <MapPin className="w-3 h-3 text-rose-400" />
                          {mem.location}
                        </span>
                      )}
                    </div>

                    <h3 className="font-serif font-bold text-xl text-stone-900 dark:text-stone-100 group-hover:text-rose-600 transition-colors">
                      {mem.title}
                    </h3>

                    {mem.description && (
                      <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 line-clamp-2 leading-relaxed">
                        {mem.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </>
      )}

      {/* ==========================================================
          02. POLAROID SCRAPBOOK MEMORY WALL
          ========================================================== */}
      {displayMode === 'polaroid' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 pt-4">
          {filtered.map((mem, idx) => {
            const rot = rotations[idx % rotations.length];
            return (
              <div
                key={mem.id}
                onClick={() => onSelectMemory(mem)}
                className={`cursor-pointer group relative bg-white dark:bg-stone-900 p-4 pb-6 rounded-sm polaroid-shadow polaroid-lift border border-stone-200/90 dark:border-stone-800 ${rot} transition-all duration-300`}
              >
                {/* Washi tape on top edge */}
                <div
                  className={`absolute -top-3 left-1/2 -translate-x-1/2 washi-tape ${
                    idx % 2 === 0 ? 'washi-tape-blush' : 'washi-tape-gold'
                  }`}
                />

                <div className="aspect-square rounded-sm overflow-hidden bg-stone-100 dark:bg-stone-800 shadow-inner">
                  <img
                    src={mem.images[0]}
                    alt={mem.title}
                    referrerPolicy="no-referrer"
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Handwritten Polaroid Caption */}
                <div className="mt-4 px-1 text-center space-y-1">
                  <h4 className="font-handwriting text-2xl text-stone-800 dark:text-stone-100 group-hover:text-rose-600 transition-colors leading-tight truncate">
                    "{mem.title}"
                  </h4>
                  <div className="text-[11px] font-mono text-stone-400 dark:text-stone-500">
                    {formatFriendlyDate(mem.date)} {mem.location ? `· ${mem.location}` : ''}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ==========================================================
          03. NOSTALGIC 35MM FILM ARCHIVE MODE
          ========================================================== */}
      {displayMode === 'film' && (
        <div className="space-y-8">
          <div className="p-4 sm:p-6 rounded-3xl film-strip film-sprockets space-y-6 overflow-hidden">
            <div className="flex items-center justify-between text-xs text-stone-400 font-mono tracking-widest px-2">
              <span>SAFETY FILM 400 · KODAK COLOR ARCHIVE</span>
              <span>EXPOSURES: {filtered.length}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((mem, idx) => (
                <div
                  key={mem.id}
                  onClick={() => onSelectMemory(mem)}
                  className="cursor-pointer group relative bg-black p-2 border-2 border-stone-800 rounded-lg hover:border-amber-500/80 transition-all shadow-xl"
                >
                  <div className="relative aspect-[3/2] overflow-hidden bg-stone-900 rounded-sm">
                    <img
                      src={mem.images[0]}
                      alt={mem.title}
                      referrerPolicy="no-referrer"
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 filter contrast-105"
                    />

                    {/* Analog Amber Date Stamp on Bottom Right */}
                    <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-[1px] film-date-stamp text-[10px] font-bold">
                      '{new Date(mem.date).getFullYear().toString().slice(-2)}{' '}
                      {String(new Date(mem.date).getMonth() + 1).padStart(2, '0')}{' '}
                      {String(new Date(mem.date).getDate()).padStart(2, '0')}
                    </div>
                  </div>

                  <div className="mt-2.5 px-1 flex items-center justify-between text-stone-300 text-xs">
                    <span className="font-mono text-[10px] text-stone-500">
                      FRAME #{String(idx + 1).padStart(2, '0')}A
                    </span>
                    <span className="font-serif font-semibold truncate max-w-[180px] group-hover:text-amber-400 transition-colors">
                      {mem.title}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ==========================================================
          04. ALBUMS / GROUPED COLLECTIONS MODE
          ========================================================== */}
      {displayMode === 'albums' && (
        <div className="space-y-10">
          {groupedByCategory.map((group) => (
            <div key={group.name} className="space-y-4">
              <div className="flex items-center justify-between border-b border-stone-200/80 dark:border-stone-800 pb-2">
                <div className="flex items-center gap-2">
                  <h3 className="font-serif text-xl font-bold text-stone-900 dark:text-stone-100 capitalize">
                    {group.name}
                  </h3>
                  <span className="text-xs text-stone-400">({group.items.length} photos)</span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {group.items.map((mem) => (
                  <div
                    key={mem.id}
                    onClick={() => onSelectMemory(mem)}
                    className="cursor-pointer group relative aspect-[4/3] rounded-xl overflow-hidden bg-stone-100 dark:bg-stone-800 border border-stone-200/80 dark:border-stone-800 shadow-sm hover:shadow-md transition-all"
                  >
                    <img
                      src={mem.images[0]}
                      alt={mem.title}
                      referrerPolicy="no-referrer"
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent flex flex-col justify-end p-2.5 text-white">
                      <span className="text-[10px] text-stone-300">{formatFriendlyDate(mem.date)}</span>
                      <h4 className="font-serif font-bold text-xs truncate leading-tight">{mem.title}</h4>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {filtered.length === 0 && (
        <div className="text-center py-16 px-4 rounded-3xl bg-stone-50/50 dark:bg-stone-900/40 border border-dashed border-stone-200 dark:border-stone-800 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-500 flex items-center justify-center mx-auto">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-lg font-bold text-stone-900 dark:text-stone-100">
            No matching photos found
          </h3>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 max-w-sm mx-auto">
            Try adjusting your search query or theme filter, or upload a new photo to your album.
          </p>
          <button
            onClick={onOpenAddModal}
            className="px-4 py-2 rounded-xl bg-stone-900 dark:bg-rose-600 text-white text-xs font-semibold"
          >
            Upload Photo Memory
          </button>
        </div>
      )}
    </div>
  );
};
