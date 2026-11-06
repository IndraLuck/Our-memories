import React, { useState } from 'react';
import { Heart, Search, Filter, MapPin, Calendar, Plus, Sparkles, Tag, Eye } from 'lucide-react';
import { Memory } from '../types';
import { formatFriendlyDate } from '../utils/date';

interface PhotosViewProps {
  memories: Memory[];
  onSelectMemory: (memory: Memory) => void;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onOpenAddModal: () => void;
}

export const PhotosView: React.FC<PhotosViewProps> = ({
  memories,
  onSelectMemory,
  onToggleFavorite,
  onOpenAddModal,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [favoritesOnly, setFavoritesOnly] = useState(false);

  // Filter memories with images that are not soft-deleted
  const photoMemories = memories.filter((m) => !m.deletedAt && m.images && m.images.length > 0);

  const categories = ['all', ...Array.from(new Set(photoMemories.map((m) => m.category || 'General')))];

  const filtered = photoMemories.filter((m) => {
    if (favoritesOnly && !m.isFavorite) return false;
    if (selectedCategory !== 'all' && m.category !== selectedCategory) return false;
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

  return (
    <div className="space-y-8 pb-16">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200/80 dark:border-stone-800 pb-6">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-stone-900 dark:text-stone-50">
            Our Photo Album
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1">
            Visual chapters of laughter, travel, and quiet moments ({photoMemories.length} photos)
          </p>
        </div>

        <button
          onClick={onOpenAddModal}
          className="h-10 px-4 rounded-xl bg-stone-900 dark:bg-rose-600 text-white font-medium text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-sm hover:bg-stone-800 dark:hover:bg-rose-500 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Upload Photo</span>
        </button>
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
            className="w-full h-10 pl-10 pr-4 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-900 dark:text-stone-100 text-xs sm:text-sm placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-rose-400"
          />
        </div>

        {/* Category Pills & Favorite Filter */}
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
              {cat === 'all' ? 'All Collections' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Photo Grid (Polaroid / Editorial presentation) */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((mem) => (
            <div
              key={mem.id}
              onClick={() => onSelectMemory(mem)}
              className="cursor-pointer group bg-white dark:bg-stone-900 p-3 pb-4 rounded-2xl polaroid-shadow polaroid-lift border border-stone-200/80 dark:border-stone-800 flex flex-col justify-between"
            >
              <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-stone-100 dark:bg-stone-800">
                <img
                  src={mem.images[0]}
                  alt={mem.title}
                  referrerPolicy="no-referrer"
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* Favorite Heart Button */}
                <button
                  onClick={(e) => onToggleFavorite(mem.id, e)}
                  aria-label={mem.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                  className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/80 dark:bg-stone-900/80 backdrop-blur-sm flex items-center justify-center text-stone-700 dark:text-stone-200 hover:scale-110 active:scale-95 transition-all shadow-sm"
                >
                  <Heart
                    className={`w-4 h-4 ${mem.isFavorite ? 'fill-rose-500 text-rose-500' : 'text-stone-600 dark:text-stone-300'}`}
                  />
                </button>

                {/* Core Memory Badge */}
                {mem.isCore && (
                  <div className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded-md bg-stone-900/80 backdrop-blur-sm text-[10px] font-semibold text-amber-300 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    <span>Core</span>
                  </div>
                )}
              </div>

              {/* Polaroid Caption & Details */}
              <div className="mt-3 px-1 space-y-1.5">
                <div className="flex items-center justify-between text-[11px] text-stone-500 dark:text-stone-400">
                  <span>{formatFriendlyDate(mem.date)}</span>
                  {mem.location && (
                    <span className="flex items-center gap-0.5 truncate max-w-[130px]">
                      <MapPin className="w-3 h-3 text-rose-400" />
                      {mem.location}
                    </span>
                  )}
                </div>

                <h3 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100 truncate group-hover:text-rose-600 transition-colors">
                  {mem.title}
                </h3>

                {mem.description && (
                  <p className="text-xs text-stone-600 dark:text-stone-300 line-clamp-2 leading-relaxed">
                    {mem.description}
                  </p>
                )}

                {/* Tags */}
                {mem.tags && mem.tags.length > 0 && (
                  <div className="flex items-center gap-1.5 pt-1 text-[11px] text-stone-400">
                    <Tag className="w-3 h-3 text-stone-400" />
                    <span className="truncate">{mem.tags.map((t) => `#${t}`).join(' ')}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 px-4 rounded-3xl bg-stone-50/50 dark:bg-stone-900/40 border border-dashed border-stone-200 dark:border-stone-800 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-500 flex items-center justify-center mx-auto">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-lg font-bold text-stone-900 dark:text-stone-100">
            No matching photos found
          </h3>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 max-w-sm mx-auto">
            Try adjusting your search query or collection filter, or add a new photo to your album.
          </p>
          <button
            onClick={onOpenAddModal}
            className="px-4 py-2 rounded-xl bg-stone-900 dark:bg-rose-600 text-white text-xs font-semibold"
          >
            Add Photo Memory
          </button>
        </div>
      )}
    </div>
  );
};
