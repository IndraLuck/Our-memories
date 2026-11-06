import React, { useState } from 'react';
import { MapPin, Navigation, Compass, Sparkles, ChevronRight } from 'lucide-react';
import { Memory } from '../types';
import { formatFriendlyDate } from '../utils/date';

interface MapViewProps {
  memories: Memory[];
  onSelectMemory: (memory: Memory) => void;
}

export const MapView: React.FC<MapViewProps> = ({ memories, onSelectMemory }) => {
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);

  const activeMemories = memories.filter((m) => !m.deletedAt && m.location);

  // Group memories by location name
  const locationsMap = new Map<string, Memory[]>();
  for (const m of activeMemories) {
    if (!m.location) continue;
    const loc = m.location.trim();
    const existing = locationsMap.get(loc) || [];
    existing.push(m);
    locationsMap.set(loc, existing);
  }

  const locationsList = Array.from(locationsMap.entries()).map(([loc, mems]) => ({
    name: loc,
    count: mems.length,
    memories: mems,
    coverImage: mems.find((m) => m.images && m.images.length > 0)?.images[0],
  }));

  const activeGroup = selectedLocation ? locationsMap.get(selectedLocation) || [] : activeMemories;

  return (
    <div className="space-y-10 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200/80 dark:border-stone-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 mb-1">
            <Compass className="w-3.5 h-3.5" />
            <span>Places & Destinations</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-stone-900 dark:text-stone-50">
            Memory Map
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1">
            Geographic chapters of our wanderlust, travels, and cozy hideaways ({locationsList.length} places)
          </p>
        </div>
      </div>

      {/* Stylized Visual Geography Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-tr from-stone-900 via-stone-800 to-rose-950 p-6 sm:p-10 text-white shadow-lg">
        <div className="relative z-10 max-w-xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-rose-200">
            <Navigation className="w-3.5 h-3.5" />
            <span>Private Shared Coordinates</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold">
            From Pacific coastlines to little corner bakeries.
          </h2>
          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
            Every pin marks a place where we laughed, dreamed, and made memories together. Click any destination below to explore its chapters.
          </p>
        </div>

        {/* Decorative Compass Icon */}
        <div className="absolute right-6 -bottom-6 opacity-10 pointer-events-none">
          <Compass className="w-72 h-72 text-white" />
        </div>
      </div>

      {/* Locations Horizontal Strip / Selector */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        <button
          onClick={() => setSelectedLocation(null)}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
            selectedLocation === null
              ? 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 shadow-sm'
              : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200'
          }`}
        >
          All Locations ({activeMemories.length})
        </button>

        {locationsList.map((loc) => (
          <button
            key={loc.name}
            onClick={() => setSelectedLocation(loc.name)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 ${
              selectedLocation === loc.name
                ? 'bg-rose-500 text-white font-semibold shadow-sm'
                : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>{loc.name} ({loc.count})</span>
          </button>
        ))}
      </div>

      {/* Memories at Location Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {activeGroup.map((mem) => (
          <div
            key={mem.id}
            onClick={() => onSelectMemory(mem)}
            className="cursor-pointer group bg-white dark:bg-stone-900 rounded-3xl p-5 border border-stone-200/80 dark:border-stone-800 shadow-sm hover:shadow-md hover:border-rose-300 dark:hover:border-rose-800 transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              {mem.images && mem.images[0] ? (
                <div className="w-full aspect-[16/10] rounded-2xl overflow-hidden bg-stone-100">
                  <img
                    src={mem.images[0]}
                    alt={mem.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ) : (
                <div className="w-full aspect-[16/10] rounded-2xl bg-rose-50 dark:bg-rose-950/30 flex items-center justify-center text-rose-400 border border-dashed border-rose-200 dark:border-rose-900">
                  <MapPin className="w-8 h-8" />
                </div>
              )}

              <div className="space-y-1">
                <div className="flex items-center gap-1 text-[11px] font-semibold text-rose-600 dark:text-rose-400">
                  <MapPin className="w-3 h-3" />
                  <span>{mem.location}</span>
                  <span>·</span>
                  <span>{formatFriendlyDate(mem.date)}</span>
                </div>

                <h3 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100 group-hover:text-rose-600 transition-colors truncate">
                  {mem.title}
                </h3>

                <p className="text-xs text-stone-600 dark:text-stone-300 line-clamp-2 leading-relaxed">
                  {mem.description}
                </p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs text-rose-600 font-semibold">
              <span>View Memory</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
