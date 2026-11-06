import React from 'react';
import { Music, Play, ExternalLink, Heart, Plus, Disc, Sparkles } from 'lucide-react';
import { Memory } from '../types';
import { formatFriendlyDate } from '../utils/date';

interface MusicViewProps {
  memories: Memory[];
  onSelectMemory: (memory: Memory) => void;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onOpenAddModal: () => void;
}

export const MusicView: React.FC<MusicViewProps> = ({
  memories,
  onSelectMemory,
  onToggleFavorite,
  onOpenAddModal,
}) => {
  const musicMemories = memories.filter(
    (m) => !m.deletedAt && (m.type === 'music' || m.songTitle || m.songArtist)
  );

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200/80 dark:border-stone-800 pb-6">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-stone-900 dark:text-stone-50">
            Soundtrack of Us
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1">
            The melodies, albums, and anthems tied to our favorite chapters ({musicMemories.length} songs)
          </p>
        </div>

        <button
          onClick={onOpenAddModal}
          className="h-10 px-4 rounded-xl bg-stone-900 dark:bg-rose-600 text-white font-medium text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-sm hover:bg-stone-800 dark:hover:bg-rose-500 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Add Song</span>
        </button>
      </div>

      {/* Playlist Grid */}
      {musicMemories.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {musicMemories.map((song) => (
            <div
              key={song.id}
              onClick={() => onSelectMemory(song)}
              className="cursor-pointer group relative bg-white dark:bg-stone-900 rounded-3xl p-6 border border-stone-200/80 dark:border-stone-800 shadow-sm hover:shadow-md hover:border-amber-300 dark:hover:border-amber-800 transition-all flex flex-col justify-between"
            >
              <div className="flex items-start gap-4">
                {/* Vinyl Record Icon Cover */}
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-stone-900 via-stone-800 to-stone-700 flex items-center justify-center text-amber-300 shadow-md shrink-0 group-hover:rotate-12 transition-transform duration-300">
                  <Disc className="w-8 h-8 animate-[spin_10s_linear_infinite]" />
                </div>

                <div className="space-y-1 flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-rose-600 dark:text-rose-400">
                      {formatFriendlyDate(song.date)}
                    </span>
                    <button
                      onClick={(e) => onToggleFavorite(song.id, e)}
                      aria-label="Toggle favorite"
                      className="w-7 h-7 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 flex items-center justify-center"
                    >
                      <Heart
                        className={`w-4 h-4 ${song.isFavorite ? 'fill-rose-500 text-rose-500' : 'text-stone-400'}`}
                      />
                    </button>
                  </div>

                  <h3 className="font-serif text-lg font-bold text-stone-900 dark:text-stone-100 truncate group-hover:text-rose-600 transition-colors">
                    {song.songTitle || song.title}
                  </h3>

                  <p className="text-xs font-medium text-stone-500 dark:text-stone-400 truncate">
                    {song.songArtist || 'Unknown Artist'}
                  </p>
                </div>
              </div>

              {/* Personal Story Note */}
              <div className="mt-4 pt-4 border-t border-stone-100 dark:border-stone-800">
                <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 line-clamp-3 leading-relaxed italic font-serif">
                  "{song.description}"
                </p>
              </div>

              {/* Song URL / Link */}
              {song.songUrl && (
                <div className="mt-4 pt-2 flex items-center justify-between">
                  <a
                    href={song.songUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline"
                  >
                    <span>Listen on Spotify / Web</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 px-4 rounded-3xl bg-stone-50/50 dark:bg-stone-900/40 border border-dashed border-stone-200 dark:border-stone-800 space-y-3">
          <Music className="w-10 h-10 text-rose-400 mx-auto" />
          <h3 className="font-serif text-lg font-bold text-stone-900 dark:text-stone-100">
            No soundtrack added yet
          </h3>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 max-w-sm mx-auto">
            Add a song that was playing on your first road trip, kitchen dance, or unforgettable night.
          </p>
          <button
            onClick={onOpenAddModal}
            className="px-4 py-2 rounded-xl bg-stone-900 dark:bg-rose-600 text-white text-xs font-semibold"
          >
            Add Our First Song
          </button>
        </div>
      )}
    </div>
  );
};
