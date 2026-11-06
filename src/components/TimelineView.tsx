import React, { useState } from 'react';
import { Calendar, Heart, MapPin, Plus, Sparkles, Clock, ChevronRight } from 'lucide-react';
import { Memory, Milestone } from '../types';
import { INITIAL_MILESTONES } from '../utils/defaultData';
import { formatFriendlyDate } from '../utils/date';

interface TimelineViewProps {
  memories: Memory[];
  onSelectMemory: (memory: Memory) => void;
  onOpenAddModal: () => void;
}

export const TimelineView: React.FC<TimelineViewProps> = ({
  memories,
  onSelectMemory,
  onOpenAddModal,
}) => {
  const [milestones] = useState<Milestone[]>(INITIAL_MILESTONES);
  const [selectedYear, setSelectedYear] = useState<string>('all');

  // Combine milestones and all active memories into one chronological timeline
  const activeMemories = memories.filter((m) => !m.deletedAt);

  // Extract all years
  const allYears = Array.from(
    new Set([
      ...activeMemories.map((m) => m.date.slice(0, 4)),
      ...milestones.map((m) => m.date.slice(0, 4)),
    ])
  ).sort().reverse();

  // Sort memories chronologically (newest first or oldest first; default newest first with filter)
  const sortedItems = [...activeMemories]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .filter((m) => {
      if (selectedYear !== 'all' && m.date.slice(0, 4) !== selectedYear) return false;
      return true;
    });

  return (
    <div className="space-y-10 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200/80 dark:border-stone-800 pb-6">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-stone-900 dark:text-stone-50">
            Our Relationship Timeline
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1">
            Every step, trip, and milestone marked on our journey together
          </p>
        </div>

        <button
          onClick={onOpenAddModal}
          className="h-10 px-4 rounded-xl bg-stone-900 dark:bg-rose-600 text-white font-medium text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-sm hover:bg-stone-800 dark:hover:bg-rose-500 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Add Moment</span>
        </button>
      </div>

      {/* Milestones Ribbon */}
      <div className="bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200/60 dark:border-rose-900/40 rounded-3xl p-6 sm:p-8">
        <div className="flex items-center gap-2 text-rose-800 dark:text-rose-300 text-xs font-bold uppercase tracking-wider mb-4">
          <Sparkles className="w-4 h-4 text-rose-500" />
          <span>Major Milestones</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {milestones.map((milestone) => (
            <div
              key={milestone.id}
              className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-rose-100 dark:border-rose-900/30 shadow-sm flex items-start gap-3"
            >
              <span className="text-2xl p-2 rounded-xl bg-stone-100 dark:bg-stone-800 shrink-0">
                {milestone.emoji}
              </span>
              <div className="space-y-1">
                <span className="text-[11px] font-semibold text-rose-600 dark:text-rose-400">
                  {formatFriendlyDate(milestone.date)}
                </span>
                <h4 className="font-serif font-bold text-sm text-stone-900 dark:text-stone-100">
                  {milestone.title}
                </h4>
                <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                  {milestone.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Year Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        <button
          onClick={() => setSelectedYear('all')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
            selectedYear === 'all'
              ? 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 shadow-sm'
              : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-700'
          }`}
        >
          All Years
        </button>
        {allYears.map((yr) => (
          <button
            key={yr}
            onClick={() => setSelectedYear(yr)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
              selectedYear === yr
                ? 'bg-rose-500 text-white font-semibold shadow-sm'
                : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-700'
            }`}
          >
            {yr}
          </button>
        ))}
      </div>

      {/* Vertical Interactive Timeline */}
      <div className="relative border-l-2 border-stone-200 dark:border-stone-800 ml-4 sm:ml-8 pl-6 sm:pl-10 space-y-10">
        {sortedItems.map((item) => (
          <div
            key={item.id}
            onClick={() => onSelectMemory(item)}
            className="cursor-pointer group relative"
          >
            {/* Timeline Dot Node */}
            <div className="absolute -left-[31px] sm:-left-[47px] top-1.5 w-4 h-4 rounded-full bg-white dark:bg-stone-900 border-2 border-rose-500 group-hover:scale-125 group-hover:bg-rose-500 transition-all shadow-sm" />

            <div className="bg-white dark:bg-stone-900 rounded-2xl p-5 sm:p-6 border border-stone-200/80 dark:border-stone-800 shadow-sm hover:shadow-md hover:border-rose-300 dark:hover:border-rose-800 transition-all">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                <span className="text-xs font-semibold text-rose-600 dark:text-rose-400">
                  {formatFriendlyDate(item.date)}
                </span>
                <span className="text-[11px] text-stone-500 dark:text-stone-400 capitalize">
                  {item.category} · {item.type}
                </span>
              </div>

              <h3 className="font-serif text-lg sm:text-xl font-bold text-stone-900 dark:text-stone-100 group-hover:text-rose-600 transition-colors">
                {item.title}
              </h3>

              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 line-clamp-3 mt-1.5 leading-relaxed">
                {item.description}
              </p>

              {item.images && item.images[0] && (
                <div className="mt-4 w-full sm:w-64 h-36 rounded-xl overflow-hidden bg-stone-100">
                  <img
                    src={item.images[0]}
                    alt={item.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
