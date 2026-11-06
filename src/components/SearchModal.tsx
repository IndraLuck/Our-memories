import React, { useState } from 'react';
import { Search, X, Calendar, MapPin, Tag, Sparkles, ChevronRight } from 'lucide-react';
import { Memory } from '../types';
import { formatFriendlyDate } from '../utils/date';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  memories: Memory[];
  onSelectMemory: (memory: Memory) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  memories,
  onSelectMemory,
}) => {
  if (!isOpen) return null;

  const [query, setQuery] = useState('');
  const activeMemories = memories.filter((m) => !m.deletedAt);

  const results = query.trim()
    ? activeMemories.filter((m) => {
        const q = query.toLowerCase();
        return (
          m.title.toLowerCase().includes(q) ||
          m.description.toLowerCase().includes(q) ||
          m.category?.toLowerCase().includes(q) ||
          m.location?.toLowerCase().includes(q) ||
          m.date?.includes(q) ||
          m.tags?.some((t) => t.toLowerCase().includes(q))
        );
      })
    : [];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-search-title"
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-stone-950/70 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-2xl p-6 space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-stone-100 dark:border-stone-800 pb-3">
          <Search className="w-5 h-5 text-stone-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search all memories by title, text, date, place, tag..."
            className="w-full bg-transparent text-sm sm:text-base text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none"
          />
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-96 overflow-y-auto no-scrollbar space-y-2">
          {query.trim() === '' ? (
            <div className="py-10 text-center text-xs text-stone-400 space-y-1">
              <Sparkles className="w-6 h-6 mx-auto text-amber-400 mb-2" />
              <p>Type to search across our entire notebook...</p>
              <p className="text-[11px] text-stone-400">Try searching "picnic", "Big Sur", or "2024"</p>
            </div>
          ) : results.length > 0 ? (
            results.map((m) => (
              <div
                key={m.id}
                onClick={() => {
                  onSelectMemory(m);
                  onClose();
                }}
                className="cursor-pointer p-3.5 rounded-2xl hover:bg-stone-50 dark:hover:bg-stone-800/60 transition-colors flex items-center justify-between gap-4 border border-transparent hover:border-stone-200 dark:hover:border-stone-700"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2 text-[11px] text-stone-500">
                    <span className="font-semibold text-rose-600 dark:text-rose-400 capitalize">{m.type}</span>
                    <span>·</span>
                    <span>{formatFriendlyDate(m.date)}</span>
                    {m.location && (
                      <>
                        <span>·</span>
                        <span className="flex items-center gap-0.5 truncate max-w-[150px]">
                          <MapPin className="w-3 h-3" />
                          {m.location}
                        </span>
                      </>
                    )}
                  </div>
                  <h4 className="font-serif font-bold text-sm text-stone-900 dark:text-stone-100 truncate">
                    {m.title}
                  </h4>
                  <p className="text-xs text-stone-500 line-clamp-1">{m.description}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-stone-400 shrink-0" />
              </div>
            ))
          ) : (
            <div className="py-10 text-center text-xs text-stone-500">
              No memories found matching "{query}"
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
