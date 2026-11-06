import React, { useState } from 'react';
import { Calendar, Plus, Sparkles, Clock, Heart, Trash2 } from 'lucide-react';
import { SpecialDate } from '../types';
import { formatFriendlyDate } from '../utils/date';

interface SpecialDatesViewProps {
  specialDates: SpecialDate[];
  onAddSpecialDate: (date: Omit<SpecialDate, 'id'>) => void;
  onDeleteSpecialDate: (id: string) => void;
}

export const SpecialDatesView: React.FC<SpecialDatesViewProps> = ({
  specialDates,
  onAddSpecialDate,
  onDeleteSpecialDate,
}) => {
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [category, setCategory] = useState<'anniversary' | 'birthday' | 'trip' | 'milestone' | 'custom'>('anniversary');
  const [emoji, setEmoji] = useState('🥂');
  const [note, setNote] = useState('');

  const calculateDaysRemaining = (targetDateStr: string, isRecurring = true) => {
    if (!targetDateStr) return 0;
    const [y, m, d] = targetDateStr.split('-').map(Number);
    const now = new Date();
    let target = new Date(y, m - 1, d, 0, 0, 0);

    if (isRecurring) {
      target = new Date(now.getFullYear(), m - 1, d, 0, 0, 0);
      if (target.getTime() < now.getTime()) {
        target = new Date(now.getFullYear() + 1, m - 1, d, 0, 0, 0);
      }
    }

    const diff = target.getTime() - now.getTime();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !date) return;
    onAddSpecialDate({
      title: title.trim(),
      date,
      category,
      emoji: emoji || '🌸',
      isRecurring: true,
      note: note.trim() || undefined,
    });
    setTitle('');
    setDate('');
    setNote('');
    setShowForm(false);
  };

  return (
    <div className="space-y-10 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200/80 dark:border-stone-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 mb-1">
            <Calendar className="w-3.5 h-3.5" />
            <span>Upcoming Celebrations</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-stone-900 dark:text-stone-50">
            Special Dates & Countdowns
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1">
            Anniversaries, birthdays, and upcoming adventures to look forward to
          </p>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="h-10 px-4 rounded-xl bg-stone-900 dark:bg-rose-600 text-white font-medium text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-sm hover:bg-stone-800 dark:hover:bg-rose-500 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Add Special Date</span>
        </button>
      </div>

      {/* Add Date Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200/80 dark:border-rose-900/40 rounded-3xl p-6 sm:p-8 space-y-4 max-w-xl mx-auto animate-in fade-in duration-200"
        >
          <h3 className="font-serif text-lg font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-rose-500" />
            <span>Add Meaningful Date</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Maya's Birthday"
                className="w-full h-9 px-3 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-xs text-stone-900 dark:text-stone-100"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">Date</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full h-9 px-3 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-xs text-stone-900 dark:text-stone-100"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">Emoji Icon</label>
              <input
                type="text"
                value={emoji}
                onChange={(e) => setEmoji(e.target.value)}
                placeholder="🎂, 🥂, ✈️, 💍"
                className="w-full h-9 px-3 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-xs text-stone-900 dark:text-stone-100"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">Category</label>
              <select
                value={category}
                onChange={(e: any) => setCategory(e.target.value)}
                className="w-full h-9 px-3 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-xs text-stone-900 dark:text-stone-100"
              >
                <option value="anniversary">Anniversary</option>
                <option value="birthday">Birthday</option>
                <option value="trip">Trip / Vacation</option>
                <option value="milestone">Milestone</option>
                <option value="custom">Custom</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">Personal Note (optional)</label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. Surprise dinner reservation"
              className="w-full h-9 px-3 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-xs text-stone-900 dark:text-stone-100"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-3.5 py-1.5 text-xs text-stone-600 hover:bg-stone-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-stone-900 dark:bg-rose-600 text-white text-xs font-semibold rounded-xl"
            >
              Save Date
            </button>
          </div>
        </form>
      )}

      {/* Dates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {specialDates.map((d) => {
          const daysLeft = calculateDaysRemaining(d.date, d.isRecurring);
          return (
            <div
              key={d.id}
              className="relative bg-white dark:bg-stone-900 rounded-3xl p-6 border border-stone-200/80 dark:border-stone-800 shadow-sm flex flex-col justify-between hover:shadow-md transition-all group"
            >
              <div className="flex items-start justify-between gap-3">
                <span className="text-3xl p-2.5 rounded-2xl bg-stone-100 dark:bg-stone-800 shrink-0">
                  {d.emoji}
                </span>

                <div className="text-right">
                  <div className="font-mono text-2xl font-extrabold text-rose-600 dark:text-rose-400 tabular-nums">
                    {daysLeft === 0 ? "Today! 🎉" : `${daysLeft} Days`}
                  </div>
                  <span className="text-[10px] text-stone-400 font-semibold uppercase">
                    Countdown
                  </span>
                </div>
              </div>

              <div className="mt-4 space-y-1">
                <span className="text-xs font-semibold text-stone-500 dark:text-stone-400">
                  {formatFriendlyDate(d.date)}
                </span>
                <h3 className="font-serif font-bold text-lg text-stone-900 dark:text-stone-100">
                  {d.title}
                </h3>
                {d.note && (
                  <p className="text-xs text-stone-600 dark:text-stone-300 italic pt-1">
                    "{d.note}"
                  </p>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs text-stone-400">
                <span className="capitalize">{d.category}</span>
                <button
                  onClick={() => onDeleteSpecialDate(d.id)}
                  aria-label="Delete special date"
                  className="p-1 rounded text-stone-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
