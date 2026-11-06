import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Heart, Plus, Sparkles, Send, Quote } from 'lucide-react';
import { AppreciationNote, NotebookSettings } from '../types';

interface AppreciationViewProps {
  appreciations: AppreciationNote[];
  settings: NotebookSettings;
  onAddAppreciation: (note: { text: string; author: string }) => void;
  onToggleFavorite: (id: string) => void;
}

export const AppreciationView: React.FC<AppreciationViewProps> = ({
  appreciations,
  settings,
  onAddAppreciation,
  onToggleFavorite,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newText, setNewText] = useState('');
  const [newAuthor, setNewAuthor] = useState(settings.person1);
  const [revealedIds, setRevealedIds] = useState<Record<string, boolean>>({});

  const toggleReveal = (id: string) => {
    setRevealedIds((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      if (next[id]) {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.7 },
          colors: ['#fda4af', '#f43f5e', '#fed7aa'],
        });
      }
      return next;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newText.trim()) return;
    onAddAppreciation({ text: newText.trim(), author: newAuthor });
    setNewText('');
    setShowAddForm(false);
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  return (
    <div className="space-y-10 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200/80 dark:border-stone-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 mb-1">
            <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
            <span>Gratitude & Love Jar</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-stone-900 dark:text-stone-50">
            Reasons I Appreciate You
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1">
            Little reminders of the everyday magic and tenderness between us ({appreciations.length} notes)
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="h-10 px-4 rounded-xl bg-stone-900 dark:bg-rose-600 text-white font-medium text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-sm hover:bg-stone-800 dark:hover:bg-rose-500 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Leave a Note</span>
        </button>
      </div>

      {/* Add New Note Collapsible Form */}
      {showAddForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200/80 dark:border-rose-900/40 rounded-3xl p-6 sm:p-8 space-y-4 max-w-2xl mx-auto animate-in fade-in duration-200"
        >
          <h3 className="font-serif text-lg font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-rose-500" />
            <span>Write a Love & Appreciation Note</span>
          </h3>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">
              Who is writing this note?
            </label>
            <div className="flex gap-3">
              {[settings.person1, settings.person2].map((person) => (
                <button
                  type="button"
                  key={person}
                  onClick={() => setNewAuthor(person)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                    newAuthor === person
                      ? 'bg-stone-900 dark:bg-rose-600 text-white shadow-sm'
                      : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700'
                  }`}
                >
                  {person}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">
              What do you appreciate about them today?
            </label>
            <textarea
              required
              rows={3}
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              placeholder="e.g. How you always hold my hand when we cross the street..."
              className="w-full p-3 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 text-sm focus:ring-2 focus:ring-rose-400 focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-stone-900 dark:bg-rose-600 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm active:scale-95"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Drop Note into Jar</span>
            </button>
          </div>
        </form>
      )}

      {/* Gratitude Notes Masonry Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {appreciations.map((note) => {
          const isRevealed = !!revealedIds[note.id];

          return (
            <div
              key={note.id}
              className="relative bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-7 border border-stone-200/80 dark:border-stone-800 shadow-sm flex flex-col justify-between hover:shadow-md transition-all group"
            >
              <Quote className="w-8 h-8 text-rose-200 dark:text-rose-900/40 mb-3" />

              <div className="space-y-3">
                <p className="font-handwriting text-2xl text-stone-800 dark:text-stone-200 leading-snug">
                  "{note.text}"
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1 text-stone-500 dark:text-stone-400">
                  <span>With love from</span>
                  <span className="font-bold text-stone-900 dark:text-stone-100">
                    {note.author}
                  </span>
                </div>

                <button
                  onClick={() => onToggleFavorite(note.id)}
                  aria-label="Favorite note"
                  className="w-7 h-7 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 flex items-center justify-center transition-colors"
                >
                  <Heart
                    className={`w-4 h-4 ${note.isFavorite ? 'fill-rose-500 text-rose-500' : 'text-stone-400'}`}
                  />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
