import React from 'react';
import { BarChart3, Heart, Calendar, Image as ImageIcon, BookOpen, Music, MapPin, Sparkles } from 'lucide-react';
import { Memory, DaysTogetherInfo } from '../types';
import { calculateMemoryStats } from '../utils/stats';

interface StatsViewProps {
  memories: Memory[];
  daysInfo: DaysTogetherInfo;
  person1: string;
  person2: string;
}

export const StatsView: React.FC<StatsViewProps> = ({
  memories,
  daysInfo,
  person1,
  person2,
}) => {
  const stats = calculateMemoryStats(memories);

  const moodEmojis: Record<string, string> = {
    romantic: '🥰',
    magical: '✨',
    cozy: '☕',
    adventurous: '🌴',
    silly: '😂',
    bittersweet: '🌧️',
    grateful: '💖',
  };

  const totalMoodSum = Object.values(stats.moodCounts).reduce((a, b) => a + b, 0) || 1;

  return (
    <div className="space-y-10 pb-16">
      {/* Header */}
      <div className="border-b border-stone-200/80 dark:border-stone-800 pb-6">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 mb-1">
          <BarChart3 className="w-3.5 h-3.5" />
          <span>Our Journey In Numbers</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-stone-900 dark:text-stone-50">
          Memory Statistics
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1">
          Every snapshot, story, and milestone across {daysInfo.days.toLocaleString()} days together
        </p>
      </div>

      {/* Primary KPI Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-rose-500">
            <span className="text-xs font-semibold uppercase text-stone-500 dark:text-stone-400">Total Memories</span>
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="font-mono text-3xl sm:text-4xl font-extrabold text-stone-900 dark:text-stone-100 tabular-nums">
            {stats.totalMemories}
          </div>
          <p className="text-[11px] text-stone-500">Across {stats.yearsCovered} years of our story</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-amber-500">
            <span className="text-xs font-semibold uppercase text-stone-500 dark:text-stone-400">Photos Saved</span>
            <ImageIcon className="w-4 h-4" />
          </div>
          <div className="font-mono text-3xl sm:text-4xl font-extrabold text-stone-900 dark:text-stone-100 tabular-nums">
            {stats.totalPhotos}
          </div>
          <p className="text-[11px] text-stone-500">High-resolution memories</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-purple-500">
            <span className="text-xs font-semibold uppercase text-stone-500 dark:text-stone-400">Journal Words</span>
            <BookOpen className="w-4 h-4" />
          </div>
          <div className="font-mono text-3xl sm:text-4xl font-extrabold text-stone-900 dark:text-stone-100 tabular-nums">
            {stats.totalJournalWords.toLocaleString()}
          </div>
          <p className="text-[11px] text-stone-500">Written from the heart</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-emerald-500">
            <span className="text-xs font-semibold uppercase text-stone-500 dark:text-stone-400">Places Visited</span>
            <MapPin className="w-4 h-4" />
          </div>
          <div className="font-mono text-3xl sm:text-4xl font-extrabold text-stone-900 dark:text-stone-100 tabular-nums">
            {stats.uniqueLocationsCount}
          </div>
          <p className="text-[11px] text-stone-500">Geographic destinations</p>
        </div>
      </div>

      {/* Mood Distribution */}
      <section className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 border border-stone-200/80 dark:border-stone-800 shadow-sm space-y-6">
        <div>
          <h3 className="font-serif text-xl font-bold text-stone-900 dark:text-stone-100">
            Emotional Palette of Our Story
          </h3>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            Most frequent feeling: <strong className="capitalize text-rose-600 dark:text-rose-400">{stats.topMood}</strong>
          </p>
        </div>

        <div className="space-y-3">
          {Object.entries(stats.moodCounts).map(([mood, count]) => {
            const percentage = Math.round((count / totalMoodSum) * 100);
            return (
              <div key={mood} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="capitalize font-medium text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
                    <span>{moodEmojis[mood] || '✨'}</span>
                    <span>{mood}</span>
                  </span>
                  <span className="font-mono text-stone-500">{count} moments ({percentage}%)</span>
                </div>
                <div className="w-full h-2 rounded-full bg-stone-100 dark:bg-stone-800 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-rose-400 to-amber-300 transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
