import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Bookmark,
  Sparkles,
  Calendar,
  MapPin,
  Heart,
  Music,
  ArrowLeft,
  BookMarked,
} from 'lucide-react';
import { Memory, NotebookSettings } from '../types';
import { formatFriendlyDate } from '../utils/date';

interface MemoryBookViewProps {
  settings: NotebookSettings;
  memories: Memory[];
  onSelectMemory: (memory: Memory) => void;
  onNavigateTab: (tab: string) => void;
  onOpenAddModal: () => void;
}

export const MemoryBookView: React.FC<MemoryBookViewProps> = ({
  settings,
  memories,
  onSelectMemory,
  onNavigateTab,
  onOpenAddModal,
}) => {
  const activeMemories = memories
    .filter((m) => !m.deletedAt)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const [isOpen, setIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [isTurning, setIsTurning] = useState(false);
  const [turnDirection, setTurnDirection] = useState<'next' | 'prev'>('next');
  const [isFullscreen, setIsFullscreen] = useState(false);

  const totalPages = Math.max(1, activeMemories.length);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'ArrowRight' && currentPage < totalPages - 1) {
        handleTurnPage('next');
      } else if (e.key === 'ArrowLeft' && currentPage > 0) {
        handleTurnPage('prev');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentPage, totalPages]);

  const handleTurnPage = (direction: 'next' | 'prev') => {
    if (isTurning) return;
    setTurnDirection(direction);
    setIsTurning(true);

    setTimeout(() => {
      if (direction === 'next' && currentPage < totalPages - 1) {
        setCurrentPage((prev) => prev + 1);
      } else if (direction === 'prev' && currentPage > 0) {
        setCurrentPage((prev) => prev - 1);
      }
      setIsTurning(false);
    }, 280);
  };

  const currentMemory: Memory | undefined = activeMemories[currentPage];

  // Helper for chapter groupings
  const chapters = Array.from(new Set(activeMemories.map((m) => m.category || 'General')));

  return (
    <div className={`space-y-6 ${isFullscreen ? 'fixed inset-0 z-50 bg-stone-950/95 p-4 sm:p-8 overflow-y-auto' : ''}`}>
      {/* Editorial Header & Mode Switch */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-stone-200/80 dark:border-stone-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigateTab('home')}
              className="text-xs font-medium text-stone-500 hover:text-stone-900 dark:hover:text-stone-200 flex items-center gap-1 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Overview</span>
            </button>
            <span className="text-stone-300 dark:text-stone-700">·</span>
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400">
              Interactive 3D Experience
            </span>
          </div>

          <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-stone-900 dark:text-stone-100 mt-1">
            Our Bound Memory Book
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400">
            A tangible, turnable journal of our chapters, handwritten notes, and photographs
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 rounded-xl border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            title={isFullscreen ? 'Exit Fullscreen' : 'Immersive Reading Mode'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          <button
            onClick={onOpenAddModal}
            className="px-3.5 py-2 rounded-xl bg-stone-900 dark:bg-rose-600 text-white text-xs font-semibold hover:bg-stone-800 dark:hover:bg-rose-500 transition-colors"
          >
            Add Story
          </button>
        </div>
      </div>

      {/* Main 3D Book Stage */}
      <div className="book-perspective min-h-[580px] sm:min-h-[640px] flex items-center justify-center py-4">
        {!isOpen ? (
          /* ================= CLOSED BOOK COVER ================= */
          <div
            onClick={() => setIsOpen(true)}
            className="cursor-pointer group relative w-72 sm:w-80 md:w-96 aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl transition-all duration-500 hover:scale-[1.02] hover:-rotate-1"
          >
            <img
              src="/src/assets/images/notebook_leather_cover_1793956314854.jpg"
              alt="Our Memory Notebook Leather Cover"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />

            {/* Embossed Gold Title Foil Overlay */}
            <div className="absolute inset-0 bg-stone-950/20 backdrop-blur-[0.5px] p-6 sm:p-8 flex flex-col justify-between text-center border-4 border-amber-300/30 rounded-2xl m-2">
              <div className="pt-8">
                <span className="text-[11px] tracking-[0.25em] uppercase text-amber-200/90 font-medium">
                  Volume I · Est. {settings.startDate ? new Date(settings.startDate).getFullYear() : '2023'}
                </span>
              </div>

              <div className="space-y-3">
                <div className="w-12 h-12 mx-auto rounded-full border border-amber-300/60 flex items-center justify-center text-amber-200">
                  <Heart className="w-6 h-6 fill-amber-300/40" />
                </div>
                <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-amber-100 tracking-tight drop-shadow-md">
                  {settings.title}
                </h2>
                <p className="font-handwriting text-xl sm:text-2xl text-amber-200/90 leading-tight">
                  {settings.person1} & {settings.person2}
                </p>
              </div>

              <div className="pb-4">
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-stone-900/80 text-amber-200 text-xs font-semibold border border-amber-300/40 group-hover:bg-amber-400 group-hover:text-stone-950 transition-all shadow-lg">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Click to Open Book ({activeMemories.length} Memories)</span>
                </span>
              </div>
            </div>

            {/* Ribbon Bookmark */}
            <div className="absolute -bottom-4 right-8 w-6 h-14 bg-rose-700 shadow-md transform rotate-2 pointer-events-none rounded-b" />
          </div>
        ) : (
          /* ================= OPEN DUAL-PAGE SPREAD ================= */
          <div className="w-full max-w-5xl bg-stone-900/10 dark:bg-black/40 p-2 sm:p-6 rounded-3xl backdrop-blur-sm border border-stone-200/60 dark:border-stone-800 shadow-2xl">
            {/* Top Book Controls */}
            <div className="flex items-center justify-between pb-4 text-xs text-stone-600 dark:text-stone-300 px-2">
              <button
                onClick={() => setIsOpen(false)}
                className="font-medium hover:text-stone-900 dark:hover:text-white flex items-center gap-1.5 transition-colors"
              >
                <Bookmark className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span>Close Book Cover</span>
              </button>

              <div className="flex items-center gap-2">
                <span className="hidden sm:inline text-stone-400">Jump to Chapter:</span>
                <select
                  value={currentMemory?.category || ''}
                  onChange={(e) => {
                    const targetIdx = activeMemories.findIndex((m) => m.category === e.target.value);
                    if (targetIdx !== -1) setCurrentPage(targetIdx);
                  }}
                  className="px-2.5 py-1 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 text-xs font-medium focus:outline-none"
                >
                  {chapters.map((chap) => (
                    <option key={chap} value={chap}>
                      {chap}
                    </option>
                  ))}
                </select>
              </div>

              <div className="font-mono text-xs tabular-nums text-stone-500">
                Entry {currentPage + 1} of {totalPages}
              </div>
            </div>

            {/* Book Body: 2-Page Layout with Central Spine */}
            <div
              className={`book-container grid grid-cols-1 md:grid-cols-2 rounded-2xl overflow-hidden shadow-2xl border border-stone-300/80 dark:border-stone-700 relative min-h-[500px] sm:min-h-[560px] transition-all duration-300 ${
                isTurning ? (turnDirection === 'next' ? 'scale-[0.99] -rotate-y-2' : 'scale-[0.99] rotate-y-2') : ''
              }`}
            >
              {/* Left Page: Large Media & Visual Scrapbook */}
              <div className="book-page-leaf p-6 sm:p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r border-stone-200 dark:border-stone-800 relative">
                {/* Washi tape accent on top corner */}
                <div className="absolute top-2 left-6 washi-tape washi-tape-blush" />

                {currentMemory?.images && currentMemory.images.length > 0 ? (
                  <div className="space-y-3 my-auto">
                    <div
                      onClick={() => onSelectMemory(currentMemory)}
                      className="cursor-pointer group relative bg-white dark:bg-stone-900 p-3 sm:p-4 rounded-xl polaroid-shadow border border-stone-200/80 dark:border-stone-800 transition-transform duration-300 hover:rotate-1"
                    >
                      <div className="aspect-[4/3] rounded-lg overflow-hidden bg-stone-100 dark:bg-stone-800">
                        <img
                          src={currentMemory.images[0]}
                          alt={currentMemory.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>

                      <div className="mt-3 flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
                        <span className="font-handwriting text-lg text-stone-700 dark:text-stone-300 truncate">
                          "{currentMemory.title}"
                        </span>
                        {currentMemory.location && (
                          <span className="flex items-center gap-1 text-[11px]">
                            <MapPin className="w-3 h-3 text-rose-500" />
                            {currentMemory.location}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="text-center">
                      <span className="text-[11px] text-stone-400 dark:text-stone-500">
                        (Click photograph to view full resolution lightbox)
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="my-auto text-center p-8 border-2 border-dashed border-stone-300 dark:border-stone-700 rounded-2xl">
                    <BookMarked className="w-12 h-12 text-stone-300 dark:text-stone-600 mx-auto mb-2" />
                    <p className="font-serif text-base text-stone-500">Intimate Written Journal Chapter</p>
                  </div>
                )}

                {/* Left Page Footer */}
                <div className="pt-4 flex items-center justify-between text-xs text-stone-400 dark:text-stone-500 border-t border-stone-200/60 dark:border-stone-800">
                  <span>{settings.title}</span>
                  <span className="font-mono tabular-nums">p. {currentPage * 2 + 1}</span>
                </div>
              </div>

              {/* Central Spine Shadow Effect */}
              <div className="hidden md:block absolute top-0 bottom-0 left-1/2 -ml-2.5 w-5 book-spine z-10 pointer-events-none" />

              {/* Right Page: Editorial Prose & Handwriting */}
              <div className="book-page-leaf p-6 sm:p-10 flex flex-col justify-between relative paper-grain">
                {/* Washi tape accent on right corner */}
                <div className="absolute top-2 right-6 washi-tape washi-tape-gold" />

                <div className="space-y-4">
                  {/* Metadata Row */}
                  <div className="flex flex-wrap items-center gap-2 text-xs text-stone-500 dark:text-stone-400">
                    <span className="font-semibold text-rose-600 dark:text-rose-400 uppercase tracking-wider">
                      {currentMemory?.category || 'Memory'}
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-amber-500" />
                      {currentMemory?.date ? formatFriendlyDate(currentMemory.date) : 'Undated'}
                    </span>
                    {currentMemory?.isCore && (
                      <>
                        <span>·</span>
                        <span className="text-amber-500 font-semibold flex items-center gap-1">
                          <Sparkles className="w-3 h-3" /> Core Milestone
                        </span>
                      </>
                    )}
                  </div>

                  {/* Headline Title */}
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 dark:text-stone-100 leading-tight">
                    {currentMemory?.title}
                  </h3>

                  {/* Body Text */}
                  <div className="prose prose-stone dark:prose-invert max-w-none text-xs sm:text-sm leading-relaxed text-stone-700 dark:text-stone-200 font-sans space-y-2 max-h-[220px] overflow-y-auto no-scrollbar">
                    <p>{currentMemory?.description}</p>
                  </div>

                  {/* Song Highlight if Present */}
                  {currentMemory?.songTitle && (
                    <div className="p-3 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/70 dark:border-amber-900/40 flex items-center gap-2 text-xs text-amber-800 dark:text-amber-300">
                      <Music className="w-4 h-4 text-amber-600 shrink-0" />
                      <span className="font-medium truncate">
                        Soundtrack: {currentMemory.songTitle} {currentMemory.songArtist && `— ${currentMemory.songArtist}`}
                      </span>
                    </div>
                  )}

                  {/* Handwritten Romantic Annotation */}
                  <div className="pt-2">
                    <div className="p-4 rounded-xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200/40 dark:border-rose-900/30">
                      <span className="text-[10px] uppercase tracking-wider text-rose-500 dark:text-rose-400 font-semibold block mb-0.5">
                        Notebook Annotation
                      </span>
                      <p className="font-handwriting text-xl text-stone-800 dark:text-stone-200 leading-snug">
                        "{currentMemory?.title ? `Remembering this day with you... always.` : 'One of our unforgettable chapters.'}"
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right Page Footer */}
                <div className="pt-4 flex items-center justify-between text-xs text-stone-400 dark:text-stone-500 border-t border-stone-200/60 dark:border-stone-800">
                  <span className="font-mono tabular-nums">p. {currentPage * 2 + 2}</span>
                  <button
                    onClick={() => currentMemory && onSelectMemory(currentMemory)}
                    className="text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline"
                  >
                    View Memory Card
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Book Page Flip Controls */}
            <div className="mt-6 flex items-center justify-between px-4">
              <button
                onClick={() => handleTurnPage('prev')}
                disabled={currentPage === 0 || isTurning}
                className={`px-4 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-xs font-semibold flex items-center gap-2 shadow-sm transition-all ${
                  currentPage === 0 ? 'opacity-40 cursor-not-allowed' : 'hover:bg-stone-50 dark:hover:bg-stone-700 active:scale-95'
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous Chapter</span>
              </button>

              <div className="text-center">
                <span className="text-xs text-stone-500 dark:text-stone-400">
                  Tip: Use <kbd className="px-1.5 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-[10px] font-mono">←</kbd> and <kbd className="px-1.5 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-[10px] font-mono">→</kbd> keys to flip pages
                </span>
              </div>

              <button
                onClick={() => handleTurnPage('next')}
                disabled={currentPage >= totalPages - 1 || isTurning}
                className={`px-4 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-xs font-semibold flex items-center gap-2 shadow-sm transition-all ${
                  currentPage >= totalPages - 1 ? 'opacity-40 cursor-not-allowed' : 'hover:bg-stone-50 dark:hover:bg-stone-700 active:scale-95'
                }`}
              >
                <span>Next Chapter</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
