import React, { useState } from 'react';
import { BookOpen, Calendar, Heart, MapPin, Plus, Sparkles, Tag, ChevronDown, ChevronUp } from 'lucide-react';
import { Memory } from '../types';
import { formatFriendlyDate } from '../utils/date';

interface JournalViewProps {
  memories: Memory[];
  onSelectMemory: (memory: Memory) => void;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onOpenAddModal: () => void;
}

export const JournalView: React.FC<JournalViewProps> = ({
  memories,
  onSelectMemory,
  onToggleFavorite,
  onOpenAddModal,
}) => {
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({});
  const [selectedMood, setSelectedMood] = useState<string>('all');

  const journalEntries = memories
    .filter((m) => !m.deletedAt && (m.type === 'journal' || (!m.images?.length && m.description)))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const moods = [
    { id: 'all', label: 'All Moods', emoji: '✨' },
    { id: 'romantic', label: 'Romantic', emoji: '🥰' },
    { id: 'magical', label: 'Magical', emoji: '✨' },
    { id: 'cozy', label: 'Cozy', emoji: '☕' },
    { id: 'adventurous', label: 'Adventurous', emoji: '🌴' },
    { id: 'silly', label: 'Silly & Fun', emoji: '😂' },
    { id: 'grateful', label: 'Grateful', emoji: '💖' },
  ];

  const filtered = journalEntries.filter((m) => {
    if (selectedMood !== 'all' && m.mood !== selectedMood) return false;
    return true;
  });

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200/80 dark:border-stone-800 pb-6">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-stone-900 dark:text-stone-50">
            Our Journal & Diaries
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1">
            Unfiltered thoughts, late-night conversations, and handwritten memories ({journalEntries.length} entries)
          </p>
        </div>

        <button
          onClick={onOpenAddModal}
          className="h-10 px-4 rounded-xl bg-stone-900 dark:bg-rose-600 text-white font-medium text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-sm hover:bg-stone-800 dark:hover:bg-rose-500 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Write Entry</span>
        </button>
      </div>

      {/* Mood Filters */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        {moods.map((mood) => (
          <button
            key={mood.id}
            onClick={() => setSelectedMood(mood.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 ${
              selectedMood === mood.id
                ? 'bg-rose-500 text-white font-semibold shadow-sm'
                : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-700'
            }`}
          >
            <span>{mood.emoji}</span>
            <span>{mood.label}</span>
          </button>
        ))}
      </div>

      {/* Journal Entries List (Paper diary design) */}
      {filtered.length > 0 ? (
        <div className="space-y-6 max-w-4xl mx-auto">
          {filtered.map((entry) => {
            const isExpanded = !!expandedIds[entry.id];
            const isLong = entry.description.length > 280;

            return (
              <article
                key={entry.id}
                className="relative bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 border border-stone-200/80 dark:border-stone-800 shadow-sm transition-all hover:border-rose-200 dark:hover:border-rose-900/50"
              >
                {/* Washi tape on top edge */}
                <div className="washi-tape" />

                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-stone-100 dark:border-stone-800 pb-4 mb-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400 font-handwriting text-base">
                      <span>{formatFriendlyDate(entry.date)}</span>
                      {entry.location && (
                        <>
                          <span>·</span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-rose-400" />
                            {entry.location}
                          </span>
                        </>
                      )}
                    </div>
                    <h2
                      onClick={() => onSelectMemory(entry)}
                      className="cursor-pointer font-serif text-xl sm:text-2xl font-bold text-stone-900 dark:text-stone-100 hover:text-rose-600 transition-colors"
                    >
                      {entry.title}
                    </h2>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Mood indicator */}
                    <span className="px-2.5 py-1 rounded-md bg-stone-100 dark:bg-stone-800 text-xs text-stone-700 dark:text-stone-300 capitalize flex items-center gap-1">
                      {entry.mood}
                    </span>

                    {/* Favorite toggle */}
                    <button
                      onClick={(e) => onToggleFavorite(entry.id, e)}
                      aria-label="Toggle favorite"
                      className="w-8 h-8 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 flex items-center justify-center transition-colors"
                    >
                      <Heart
                        className={`w-4 h-4 ${entry.isFavorite ? 'fill-rose-500 text-rose-500' : 'text-stone-400'}`}
                      />
                    </button>
                  </div>
                </div>

                {/* Journal Entry Body */}
                <div className="text-stone-700 dark:text-stone-300 text-sm sm:text-base leading-relaxed space-y-3 font-serif">
                  <p className={!isExpanded && isLong ? 'line-clamp-4' : ''}>
                    {entry.description}
                  </p>
                </div>

                {/* Expand / Collapse toggle */}
                {isLong && (
                  <button
                    onClick={() => toggleExpand(entry.id)}
                    className="mt-3 text-xs font-semibold text-rose-600 dark:text-rose-400 flex items-center gap-1 hover:underline"
                  >
                    {isExpanded ? (
                      <>
                        <span>Show Less</span>
                        <ChevronUp className="w-3.5 h-3.5" />
                      </>
                    ) : (
                      <>
                        <span>Read Full Entry</span>
                        <ChevronDown className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                )}

                {/* Tags Footer */}
                {entry.tags && entry.tags.length > 0 && (
                  <div className="mt-5 pt-4 border-t border-stone-100 dark:border-stone-800/80 flex flex-wrap items-center gap-2 text-xs text-stone-400">
                    <Tag className="w-3 h-3 text-stone-400" />
                    {entry.tags.map((tag) => (
                      <span key={tag} className="hover:text-stone-600 dark:hover:text-stone-200">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </article>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 px-4 rounded-3xl bg-stone-50/50 dark:bg-stone-900/40 border border-dashed border-stone-200 dark:border-stone-800 space-y-3">
          <BookOpen className="w-10 h-10 text-rose-400 mx-auto" />
          <h3 className="font-serif text-lg font-bold text-stone-900 dark:text-stone-100">
            No journal entries matching this mood
          </h3>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 max-w-sm mx-auto">
            Pour your heart out by writing your first story together.
          </p>
          <button
            onClick={onOpenAddModal}
            className="px-4 py-2 rounded-xl bg-stone-900 dark:bg-rose-600 text-white text-xs font-semibold"
          >
            Write a Journal Entry
          </button>
        </div>
      )}
    </div>
  );
};
