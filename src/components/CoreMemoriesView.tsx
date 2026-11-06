import React, { useState } from 'react';
import { Sparkles, Heart, Star, Calendar, MapPin, Shuffle, Plus } from 'lucide-react';
import { Memory } from '../types';
import { formatFriendlyDate } from '../utils/date';

interface CoreMemoriesViewProps {
  memories: Memory[];
  onSelectMemory: (memory: Memory) => void;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onOpenAddModal: () => void;
}

export const CoreMemoriesView: React.FC<CoreMemoriesViewProps> = ({
  memories,
  onSelectMemory,
  onToggleFavorite,
  onOpenAddModal,
}) => {
  const coreMemories = memories.filter((m) => !m.deletedAt && m.isCore);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [spotlightId, setSpotlightId] = useState<string | null>(() => {
    return coreMemories.length > 0 ? coreMemories[0].id : null;
  });

  const categories = ['all', ...Array.from(new Set(coreMemories.map((m) => m.category || 'Milestones')))];

  const filtered = coreMemories.filter((m) => {
    if (selectedCategory !== 'all' && m.category !== selectedCategory) return false;
    return true;
  });

  const spotlightMemory = coreMemories.find((m) => m.id === spotlightId) || coreMemories[0];

  const handleShuffleSpotlight = () => {
    if (coreMemories.length <= 1) return;
    const others = coreMemories.filter((m) => m.id !== spotlightId);
    const chosen = others[Math.floor(Math.random() * others.length)];
    setSpotlightId(chosen.id);
  };

  return (
    <div className="space-y-10 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200/80 dark:border-stone-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-1">
            <Sparkles className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span>Foundational Milestones</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-stone-900 dark:text-stone-50">
            Core Memories
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1">
            The defining, unforgettable chapters that made us who we are ({coreMemories.length} core moments)
          </p>
        </div>

        <button
          onClick={onOpenAddModal}
          className="h-10 px-4 rounded-xl bg-stone-900 dark:bg-rose-600 text-white font-medium text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-sm hover:bg-stone-800 dark:hover:bg-rose-500 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>New Core Memory</span>
        </button>
      </div>

      {/* Spotlight Feature Card */}
      {spotlightMemory && (
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-500/10 via-rose-500/5 to-purple-500/10 border border-amber-300/40 dark:border-amber-700/30 p-6 sm:p-10 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-300 flex items-center gap-1.5">
              <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
              <span>Spotlight Feature</span>
            </span>

            {coreMemories.length > 1 && (
              <button
                onClick={handleShuffleSpotlight}
                className="px-3 py-1.5 rounded-xl bg-white dark:bg-stone-800 text-xs font-semibold text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700 shadow-sm flex items-center gap-1.5 active:scale-95 transition-transform"
              >
                <Shuffle className="w-3.5 h-3.5" />
                <span>Next Spotlight</span>
              </button>
            )}
          </div>

          <div
            onClick={() => onSelectMemory(spotlightMemory)}
            className="cursor-pointer group grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-10 items-center"
          >
            {spotlightMemory.images && spotlightMemory.images[0] ? (
              <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden bg-stone-100 shadow-md">
                <img
                  src={spotlightMemory.images[0]}
                  alt={spotlightMemory.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            ) : (
              <div className="w-full aspect-[4/3] rounded-2xl bg-amber-100/60 dark:bg-amber-950/40 flex flex-col items-center justify-center text-amber-700 dark:text-amber-300 border border-dashed border-amber-300 dark:border-amber-700 p-6 text-center">
                <Sparkles className="w-12 h-12 mb-2 text-amber-500" />
                <span className="font-serif text-lg font-bold">Unforgettable Moment</span>
                <span className="text-xs text-stone-500 mt-1">{formatFriendlyDate(spotlightMemory.date)}</span>
              </div>
            )}

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400">
                <span className="font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wide">
                  {spotlightMemory.category}
                </span>
                <span>·</span>
                <span>{formatFriendlyDate(spotlightMemory.date)}</span>
                {spotlightMemory.location && (
                  <>
                    <span>·</span>
                    <span className="flex items-center gap-0.5">
                      <MapPin className="w-3.5 h-3.5 text-rose-400" />
                      {spotlightMemory.location}
                    </span>
                  </>
                )}
              </div>

              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 dark:text-stone-50 group-hover:text-rose-600 transition-colors">
                {spotlightMemory.title}
              </h2>

              <p className="text-stone-600 dark:text-stone-300 text-sm sm:text-base leading-relaxed line-clamp-4 font-serif">
                {spotlightMemory.description}
              </p>

              <div className="pt-2 flex items-center gap-3">
                <span className="text-xs font-semibold text-rose-600 dark:text-rose-400 underline underline-offset-4">
                  Open Memory Story
                </span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors whitespace-nowrap shrink-0 ${
              selectedCategory === cat
                ? 'bg-amber-500 text-white shadow-sm'
                : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-700'
            }`}
          >
            {cat === 'all' ? 'All Core Moments' : cat}
          </button>
        ))}
      </div>

      {/* Core Memories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((mem) => (
          <div
            key={mem.id}
            onClick={() => onSelectMemory(mem)}
            className="cursor-pointer group relative bg-white dark:bg-stone-900 rounded-3xl p-6 border border-stone-200/80 dark:border-stone-800 shadow-sm hover:shadow-md hover:border-amber-300 dark:hover:border-amber-700/50 transition-all flex flex-col justify-between"
          >
            <div className="space-y-4">
              {mem.images && mem.images[0] && (
                <div className="w-full aspect-[16/10] rounded-xl overflow-hidden bg-stone-100">
                  <img
                    src={mem.images[0]}
                    alt={mem.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
                  <span className="font-semibold text-amber-600 dark:text-amber-400 capitalize">
                    {mem.category}
                  </span>
                  <span>{formatFriendlyDate(mem.date)}</span>
                </div>

                <h3 className="font-serif text-xl font-bold text-stone-900 dark:text-stone-100 group-hover:text-rose-600 transition-colors">
                  {mem.title}
                </h3>

                <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 line-clamp-3 leading-relaxed">
                  {mem.description}
                </p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs">
              <span className="text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Golden Moment</span>
              </span>

              <button
                onClick={(e) => onToggleFavorite(mem.id, e)}
                aria-label="Toggle favorite"
                className="w-7 h-7 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 flex items-center justify-center transition-colors"
              >
                <Heart
                  className={`w-4 h-4 ${mem.isFavorite ? 'fill-rose-500 text-rose-500' : 'text-stone-400'}`}
                />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
