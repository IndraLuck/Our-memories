import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, Heart, Calendar, Clock, MapPin, Shuffle, ChevronRight, Music, BookOpen, Image as ImageIcon, Flame } from 'lucide-react';
import { DaysTogetherInfo, Memory, NotebookSettings } from '../types';
import { formatFriendlyDate, getOnThisDayMemories } from '../utils/date';

interface HomeViewProps {
  settings: NotebookSettings;
  daysInfo: DaysTogetherInfo;
  memories: Memory[];
  onSelectMemory: (memory: Memory) => void;
  onNavigateTab: (tab: string) => void;
  onOpenAddModal: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  settings,
  daysInfo,
  memories,
  onSelectMemory,
  onNavigateTab,
  onOpenAddModal,
}) => {
  const activeMemories = memories.filter((m) => !m.deletedAt);
  const onThisDayMatches = getOnThisDayMemories(activeMemories);
  const [randomMemory, setRandomMemory] = useState<Memory | null>(() => {
    return activeMemories.length > 0 ? activeMemories[Math.floor(Math.random() * activeMemories.length)] : null;
  });
  const [isShuffling, setIsShuffling] = useState(false);

  const handleShuffle = () => {
    if (activeMemories.length === 0) return;
    setIsShuffling(true);
    setTimeout(() => {
      const remaining = activeMemories.filter((m) => m.id !== randomMemory?.id);
      const pool = remaining.length > 0 ? remaining : activeMemories;
      const next = pool[Math.floor(Math.random() * pool.length)];
      setRandomMemory(next);
      setIsShuffling(false);
    }, 220);
  };

  const handleCelebrationConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#fb7185', '#f43f5e', '#fda4af', '#fef08a', '#e0e7ff'],
    });
  };

  // Recent photos for the horizontal Photo Dump strip
  const photoMemories = activeMemories
    .filter((m) => m.images && m.images.length > 0)
    .slice(0, 8);

  return (
    <div className="space-y-10 pb-16">
      {/* Hero Welcome & Days Counter */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-stone-100/90 via-stone-50/70 to-white/90 dark:from-stone-900/90 dark:via-stone-900/60 dark:to-stone-950/90 border border-stone-200/80 dark:border-stone-800 p-6 sm:p-10 lg:p-12 shadow-sm">
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rose-50 dark:bg-rose-950/50 border border-rose-200/60 dark:border-rose-900/40 text-rose-800 dark:text-rose-300 text-xs font-medium tracking-wide">
            <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500 animate-pulse" />
            <span>Our Shared Journey</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-stone-900 dark:text-stone-50 text-balance">
            {settings.person1} & {settings.person2}
          </h1>

          <p className="font-handwriting text-xl sm:text-2xl text-stone-600 dark:text-stone-300 max-w-xl mx-auto leading-relaxed">
            "{settings.subtitle}"
          </p>

          {/* Days Together Counter Matrix */}
          <div className="pt-6 pb-2 washi-tape">
            <div className="inline-block p-6 sm:p-8 rounded-2xl bg-white/95 dark:bg-stone-800/90 border border-stone-200/70 dark:border-stone-700/60 shadow-md">
              <div className="flex flex-col items-center">
                <span className="font-mono text-4xl sm:text-6xl font-extrabold tracking-tight text-rose-600 dark:text-rose-400 tabular-nums">
                  {daysInfo.days.toLocaleString()}
                </span>
                <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400 mt-1">
                  Days Together and Counting
                </span>

                <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 mt-4 pt-4 border-t border-stone-100 dark:border-stone-700 text-xs sm:text-sm text-stone-600 dark:text-stone-300">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-rose-400" />
                    <span>{daysInfo.weeks.toLocaleString()} Weeks</span>
                  </div>
                  <span className="text-stone-300 dark:text-stone-600">·</span>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-amber-400" />
                    <span>{daysInfo.hours.toLocaleString()} Hours</span>
                  </div>
                  <span className="text-stone-300 dark:text-stone-600">·</span>
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                    <span>Since {daysInfo.formattedDate || 'the beginning'}</span>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
                  <button
                    onClick={handleCelebrationConfetti}
                    className="px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-950/60 text-rose-800 dark:text-rose-200 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-rose-200/50 dark:border-rose-800/50 active:scale-95"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-rose-500" />
                    <span>Celebrate Today</span>
                  </button>

                  <div className="px-3 py-1.5 rounded-xl bg-stone-50 dark:bg-stone-900 text-xs text-stone-600 dark:text-stone-400 font-medium border border-stone-200/50 dark:border-stone-800">
                    🥂 {daysInfo.nextAnniversaryDays} days to Year {daysInfo.nextAnniversaryYear} Anniversary
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* "On This Day" Highlight (if match exists) */}
      {onThisDayMatches.length > 0 && (
        <section className="rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/50 p-6 sm:p-8">
          <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span>On This Day In Our Story</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {onThisDayMatches.map(({ memory, yearsAgo }) => (
              <div
                key={memory.id}
                onClick={() => onSelectMemory(memory)}
                className="cursor-pointer group flex flex-col sm:flex-row gap-4 p-4 rounded-xl bg-white dark:bg-stone-900 border border-amber-100 dark:border-amber-900/30 shadow-sm hover:shadow-md transition-all"
              >
                {memory.images && memory.images[0] && (
                  <div className="w-full sm:w-32 h-32 rounded-lg overflow-hidden shrink-0 bg-stone-100">
                    <img
                      src={memory.images[0]}
                      alt={memory.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                )}
                <div className="space-y-1.5 flex-1 min-w-0">
                  <span className="text-xs font-semibold text-amber-700 dark:text-amber-400">
                    {yearsAgo === 1 ? '1 year ago today' : `${yearsAgo} years ago today`} · {formatFriendlyDate(memory.date)}
                  </span>
                  <h3 className="font-serif text-lg font-bold text-stone-900 dark:text-stone-100 group-hover:text-rose-600 transition-colors truncate">
                    {memory.title}
                  </h3>
                  <p className="text-xs text-stone-600 dark:text-stone-300 line-clamp-2 leading-relaxed">
                    {memory.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Photo Dump Horizontal Carousel */}
      {photoMemories.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif text-2xl font-bold text-stone-900 dark:text-stone-100">
                Recent Photo Dump
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Snapshots captured along our way
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('photos')}
              className="text-xs font-semibold text-rose-600 dark:text-rose-400 flex items-center gap-1 hover:underline underline-offset-4"
            >
              <span>View All ({activeMemories.filter((m) => m.images?.length > 0).length})</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-4 pt-2 no-scrollbar snap-x snap-mandatory">
            {photoMemories.map((mem) => (
              <div
                key={mem.id}
                onClick={() => onSelectMemory(mem)}
                className="cursor-pointer snap-start shrink-0 w-64 sm:w-72 bg-white dark:bg-stone-900 p-3 pb-4 rounded-2xl polaroid-shadow polaroid-lift border border-stone-200/80 dark:border-stone-800 group"
              >
                <div className="w-full aspect-[4/3] rounded-xl overflow-hidden bg-stone-100 dark:bg-stone-800">
                  <img
                    src={mem.images[0]}
                    alt={mem.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="mt-3 px-1 space-y-1">
                  <div className="flex items-center justify-between text-[11px] text-stone-500 dark:text-stone-400">
                    <span>{formatFriendlyDate(mem.date)}</span>
                    {mem.location && (
                      <span className="flex items-center gap-0.5 truncate max-w-[120px]">
                        <MapPin className="w-3 h-3 text-rose-400" />
                        {mem.location}
                      </span>
                    )}
                  </div>
                  <h4 className="font-serif font-bold text-sm text-stone-900 dark:text-stone-100 truncate group-hover:text-rose-600 transition-colors">
                    {mem.title}
                  </h4>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Two-Column Featured Spotlight & Quick Portals */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 spans): "Take Me Back" Random Memory Spotlight */}
        <div className="lg:col-span-2 rounded-3xl bg-stone-100/70 dark:bg-stone-900/80 border border-stone-200/80 dark:border-stone-800 p-6 sm:p-8 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950/60 flex items-center justify-center text-amber-600 dark:text-amber-400">
                <Shuffle className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-stone-900 dark:text-stone-100 leading-tight">
                  Take Me Back
                </h3>
                <span className="text-[11px] text-stone-500 dark:text-stone-400">
                  A random chapter from our notebook
                </span>
              </div>
            </div>

            <button
              onClick={handleShuffle}
              disabled={isShuffling}
              className="px-3 py-1.5 rounded-xl bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-200 text-xs font-semibold hover:bg-stone-50 dark:hover:bg-stone-700 border border-stone-200 dark:border-stone-700 shadow-sm flex items-center gap-1.5 transition-all active:scale-95"
            >
              <Shuffle className={`w-3.5 h-3.5 ${isShuffling ? 'animate-spin' : ''}`} />
              <span>Shuffle</span>
            </button>
          </div>

          {randomMemory ? (
            <div
              onClick={() => onSelectMemory(randomMemory)}
              className="cursor-pointer group bg-white dark:bg-stone-900 rounded-2xl p-4 sm:p-6 border border-stone-200/80 dark:border-stone-800 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row gap-5 items-center"
            >
              {randomMemory.images && randomMemory.images[0] ? (
                <div className="w-full sm:w-44 h-40 rounded-xl overflow-hidden shrink-0 bg-stone-100">
                  <img
                    src={randomMemory.images[0]}
                    alt={randomMemory.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
              ) : (
                <div className="w-full sm:w-44 h-40 rounded-xl bg-rose-50 dark:bg-rose-950/30 flex items-center justify-center text-rose-400 shrink-0 border border-dashed border-rose-200 dark:border-rose-900">
                  <BookOpen className="w-10 h-10" />
                </div>
              )}

              <div className="space-y-2 flex-1 min-w-0">
                <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400">
                  <span className="font-semibold text-rose-600 dark:text-rose-400 capitalize">{randomMemory.category}</span>
                  <span>·</span>
                  <span>{formatFriendlyDate(randomMemory.date)}</span>
                  {randomMemory.isCore && (
                    <>
                      <span>·</span>
                      <span className="text-amber-500 font-semibold flex items-center gap-0.5">
                        <Sparkles className="w-3 h-3" /> Core Memory
                      </span>
                    </>
                  )}
                </div>

                <h4 className="font-serif text-xl font-bold text-stone-900 dark:text-stone-100 group-hover:text-rose-600 transition-colors">
                  {randomMemory.title}
                </h4>

                <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 line-clamp-3 leading-relaxed">
                  {randomMemory.description}
                </p>

                <div className="pt-2 text-xs font-semibold text-rose-600 dark:text-rose-400 flex items-center gap-1">
                  <span>Read full story</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-stone-500">
              <p>No memories yet. Add your first memory above!</p>
            </div>
          )}
        </div>

        {/* Right Column (1 span): Quick Action Portals */}
        <div className="space-y-3 flex flex-col justify-between">
          <div
            onClick={() => onNavigateTab('journal')}
            className="cursor-pointer group p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 hover:border-rose-300 dark:hover:border-rose-800 shadow-sm transition-all"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/40 flex items-center justify-center text-rose-600 dark:text-rose-400">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-sm text-stone-900 dark:text-stone-100">
                    Journal & Diaries
                  </h4>
                  <span className="text-xs text-stone-500 dark:text-stone-400">
                    {activeMemories.filter((m) => m.type === 'journal').length} intimate stories
                  </span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-stone-400 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          <div
            onClick={() => onNavigateTab('music')}
            className="cursor-pointer group p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 hover:border-rose-300 dark:hover:border-rose-800 shadow-sm transition-all"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 flex items-center justify-center text-amber-600 dark:text-amber-400">
                  <Music className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-sm text-stone-900 dark:text-stone-100">
                    Soundtrack of Us
                  </h4>
                  <span className="text-xs text-stone-500 dark:text-stone-400">
                    Songs that define our moments
                  </span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-stone-400 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          <div
            onClick={() => onNavigateTab('appreciation')}
            className="cursor-pointer group p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 hover:border-rose-300 dark:hover:border-rose-800 shadow-sm transition-all"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/40 flex items-center justify-center text-purple-600 dark:text-purple-400">
                  <Heart className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-sm text-stone-900 dark:text-stone-100">
                    Love Notes Jar
                  </h4>
                  <span className="text-xs text-stone-500 dark:text-stone-400">
                    Little reasons I appreciate you
                  </span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-stone-400 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          <div
            onClick={() => onNavigateTab('timeline')}
            className="cursor-pointer group p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 hover:border-rose-300 dark:hover:border-rose-800 shadow-sm transition-all"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-sm text-stone-900 dark:text-stone-100">
                    Our Timeline
                  </h4>
                  <span className="text-xs text-stone-500 dark:text-stone-400">
                    Chronological milestone history
                  </span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-stone-400 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
