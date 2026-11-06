import React from 'react';
import { X, Heart, Sparkles, MapPin, Calendar, Tag, Trash2, ExternalLink, Music } from 'lucide-react';
import { Memory } from '../types';
import { formatFriendlyDate } from '../utils/date';

interface MemoryModalProps {
  memory: Memory | null;
  onClose: () => void;
  onToggleFavorite: (id: string) => void;
  onToggleCore: (id: string) => void;
  onDeleteMemory: (id: string) => void;
}

export const MemoryModal: React.FC<MemoryModalProps> = ({
  memory,
  onClose,
  onToggleFavorite,
  onToggleCore,
  onDeleteMemory,
}) => {
  if (!memory) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-memory-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-2xl p-6 sm:p-8 space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Control Bar */}
        <div className="flex items-center justify-between gap-4 border-b border-stone-100 dark:border-stone-800 pb-4">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 text-xs font-semibold uppercase tracking-wider capitalize">
              {memory.category} · {memory.type}
            </span>

            {memory.isCore && (
              <span className="px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 text-xs font-semibold flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-500" />
                <span>Core</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Toggle Core */}
            <button
              onClick={() => onToggleCore(memory.id)}
              aria-label={memory.isCore ? 'Remove from core memories' : 'Mark as core memory'}
              className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                memory.isCore
                  ? 'bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400'
                  : 'text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
              }`}
              title="Toggle Core Memory"
            >
              <Sparkles className="w-4 h-4" />
            </button>

            {/* Toggle Favorite */}
            <button
              onClick={() => onToggleFavorite(memory.id)}
              aria-label={memory.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            >
              <Heart
                className={`w-5 h-5 ${memory.isFavorite ? 'fill-rose-500 text-rose-500' : 'text-stone-400'}`}
              />
            </button>

            {/* Soft Delete */}
            <button
              onClick={() => {
                if (window.confirm('Move this memory to Recently Deleted? You can restore it anytime in Settings.')) {
                  onDeleteMemory(memory.id);
                  onClose();
                }
              }}
              aria-label="Move memory to recently deleted"
              className="w-9 h-9 rounded-xl flex items-center justify-center text-stone-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
              title="Delete Memory"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              aria-label="Close dialog"
              className="w-9 h-9 rounded-xl flex items-center justify-center text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Image Viewer (if any) */}
        {memory.images && memory.images.length > 0 && (
          <div className="space-y-4">
            <div className="w-full max-h-[55vh] rounded-2xl overflow-hidden bg-stone-900 flex items-center justify-center">
              <img
                src={memory.images[0]}
                alt={memory.title}
                referrerPolicy="no-referrer"
                className="w-full h-full max-h-[55vh] object-contain"
              />
            </div>
            {memory.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
                {memory.images.map((imgUrl, i) => (
                  <div key={i} className="w-20 h-20 rounded-xl overflow-hidden shrink-0 border border-stone-200">
                    <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Content Body */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3 text-xs text-stone-500 dark:text-stone-400">
            <span className="flex items-center gap-1 font-semibold text-rose-600 dark:text-rose-400">
              <Calendar className="w-3.5 h-3.5" />
              {formatFriendlyDate(memory.date)}
            </span>
            {memory.location && (
              <>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-rose-400" />
                  {memory.location}
                </span>
              </>
            )}
            <span>·</span>
            <span className="capitalize">Mood: {memory.mood}</span>
          </div>

          <h2
            id="modal-memory-title"
            className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 dark:text-stone-50"
          >
            {memory.title}
          </h2>

          <div className="text-stone-700 dark:text-stone-300 text-sm sm:text-base leading-relaxed font-serif whitespace-pre-wrap">
            {memory.description}
          </div>

          {/* Song Info (if music memory) */}
          {(memory.songTitle || memory.songArtist) && (
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/70 dark:border-amber-900/40 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Music className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                <div>
                  <h4 className="font-bold text-sm text-stone-900 dark:text-stone-100">
                    {memory.songTitle}
                  </h4>
                  <p className="text-xs text-stone-500 dark:text-stone-400">{memory.songArtist}</p>
                </div>
              </div>
              {memory.songUrl && (
                <a
                  href={memory.songUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-white dark:bg-stone-800 text-xs font-semibold text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-700 flex items-center gap-1 hover:bg-amber-100"
                >
                  <span>Listen</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          )}

          {/* Tags */}
          {memory.tags && memory.tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 pt-2 text-xs text-stone-500 dark:text-stone-400">
              <Tag className="w-3.5 h-3.5" />
              {memory.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
