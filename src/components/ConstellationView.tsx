import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Star,
  MapPin,
  Calendar,
  Layers,
  ArrowLeft,
  Info,
} from 'lucide-react';
import { Memory, NotebookSettings, Collection } from '../types';
import { formatFriendlyDate } from '../utils/date';

interface ConstellationViewProps {
  settings: NotebookSettings;
  memories: Memory[];
  collections: Collection[];
  onSelectMemory: (memory: Memory) => void;
  onNavigateTab: (tab: string) => void;
  onOpenAddModal: () => void;
}

export const ConstellationView: React.FC<ConstellationViewProps> = ({
  settings,
  memories,
  collections,
  onSelectMemory,
  onNavigateTab,
  onOpenAddModal,
}) => {
  const [filterMode, setFilterMode] = useState<'all' | 'collection' | 'year' | 'core'>('all');
  const [selectedStar, setSelectedStar] = useState<Memory | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const activeMemories = useMemo(() => {
    return memories.filter((m) => !m.deletedAt);
  }, [memories]);

  // Position memories deterministically in a cosmic 2D plane
  const starNodes = useMemo(() => {
    const width = 1000;
    const height = 650;
    const centerX = width / 2;
    const centerY = height / 2;

    return activeMemories.map((mem, idx) => {
      // Golden ratio spiral + seeded hash for natural celestial clustering
      const angle = idx * 2.399963 + (mem.category?.length || 1);
      const radius = 90 + Math.sqrt(idx + 1) * 75;
      const x = Math.max(80, Math.min(width - 80, centerX + Math.cos(angle) * radius + ((idx * 17) % 40) - 20));
      const y = Math.max(60, Math.min(height - 60, centerY + Math.sin(angle) * (radius * 0.75) + ((idx * 23) % 40) - 20));

      const isCore = mem.isCore;
      const starSize = isCore ? 16 : 10;
      const year = new Date(mem.date).getFullYear() || 2024;

      return {
        memory: mem,
        x,
        y,
        isCore,
        starSize,
        year,
      };
    });
  }, [activeMemories]);

  // Generate constellation connection lines between related memories
  const constellationLines = useMemo(() => {
    const lines: Array<{ x1: number; y1: number; x2: number; y2: number; label: string; key: string }> = [];

    for (let i = 0; i < starNodes.length; i++) {
      for (let j = i + 1; j < starNodes.length; j++) {
        const a = starNodes[i];
        const b = starNodes[j];

        const matchCollection = a.memory.collectionId && a.memory.collectionId === b.memory.collectionId;
        const matchCategory = a.memory.category && a.memory.category === b.memory.category;
        const matchYear = a.year === b.year;

        let shouldConnect = false;
        let lineLabel = '';

        if (filterMode === 'collection' && (matchCollection || matchCategory)) {
          shouldConnect = true;
          lineLabel = a.memory.category || 'Album';
        } else if (filterMode === 'year' && matchYear) {
          shouldConnect = true;
          lineLabel = String(a.year);
        } else if (filterMode === 'core' && a.isCore && b.isCore) {
          shouldConnect = true;
          lineLabel = 'Core Link';
        } else if (filterMode === 'all') {
          // In 'all', connect nearby stars or same category with distance threshold
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist < 180 && (matchCategory || matchCollection || (a.isCore && b.isCore))) {
            shouldConnect = true;
            lineLabel = a.memory.category || '';
          }
        }

        if (shouldConnect) {
          lines.push({
            x1: a.x,
            y1: a.y,
            x2: b.x,
            y2: b.y,
            label: lineLabel,
            key: `line-${a.memory.id}-${b.memory.id}`,
          });
        }
      }
    }
    return lines;
  }, [starNodes, filterMode]);

  return (
    <div className="space-y-6">
      {/* Top Controls Header */}
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
            <span className="text-xs font-semibold uppercase tracking-wider text-rose-500 dark:text-rose-400">
              Celestial Memory Universe
            </span>
          </div>

          <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-stone-900 dark:text-stone-100 mt-1">
            Constellation of Us
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400">
            Every moment shines as a star. Explore connecting lines of our journeys and shared seasons.
          </p>
        </div>

        {/* Filter Segmented Controls */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
          <button
            onClick={() => setFilterMode('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              filterMode === 'all'
                ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-sm'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
            }`}
          >
            All Constellations
          </button>
          <button
            onClick={() => setFilterMode('collection')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              filterMode === 'collection'
                ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-sm'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
            }`}
          >
            By Collection
          </button>
          <button
            onClick={() => setFilterMode('year')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              filterMode === 'year'
                ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-sm'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
            }`}
          >
            By Year
          </button>
          <button
            onClick={() => setFilterMode('core')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 ${
              filterMode === 'core'
                ? 'bg-white dark:bg-stone-900 text-amber-600 dark:text-amber-400 shadow-sm'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
            }`}
          >
            <Sparkles className="w-3 h-3" />
            <span>Core Pulsars</span>
          </button>
        </div>
      </div>

      {/* Interactive Celestial Canvas Stage */}
      <div className="relative w-full rounded-3xl overflow-hidden shadow-2xl border border-stone-800 bg-stone-950 min-h-[580px] sm:min-h-[640px]">
        {/* Deep Universe Nebula Image Backdrop */}
        <div className="absolute inset-0 z-0 opacity-60 pointer-events-none">
          <img
            src="/src/assets/images/celestial_memory_nebula_1793956314452.jpg"
            alt="Cosmic Starfield"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Ambient Overlay Gradients */}
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-stone-950/40 to-stone-950/90 pointer-events-none z-0" />

        {/* Interactive SVG Starfield & Links */}
        <div
          className="relative z-10 w-full h-[600px] overflow-hidden cursor-crosshair"
          style={{
            transform: `scale(${zoomLevel}) translate(${panOffset.x}px, ${panOffset.y}px)`,
            transformOrigin: '50% 50%',
            transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          <svg className="w-full h-full min-w-[1000px] min-h-[650px]" viewBox="0 0 1000 650">
            {/* Draw Constellation Lines */}
            {constellationLines.map((line) => (
              <line
                key={line.key}
                x1={line.x1}
                y1={line.y1}
                x2={line.x2}
                y2={line.y2}
                stroke="rgba(244, 114, 182, 0.35)"
                strokeWidth="1.5"
                strokeDasharray="4 4"
                className="transition-all duration-500 hover:stroke-rose-400 hover:stroke-width-2"
              />
            ))}

            {/* Draw Memory Star Nodes */}
            {starNodes.map(({ memory, x, y, isCore, starSize }) => {
              const isHovered = selectedStar?.id === memory.id;

              return (
                <g
                  key={memory.id}
                  transform={`translate(${x}, ${y})`}
                  onClick={() => onSelectMemory(memory)}
                  onMouseEnter={() => setSelectedStar(memory)}
                  className="cursor-pointer group"
                >
                  {/* Outer Pulsing Corona for Core Memories */}
                  {isCore && (
                    <circle
                      r={starSize * 1.8}
                      fill="rgba(251, 191, 36, 0.18)"
                      className="animate-ping"
                      style={{ animationDuration: '3s' }}
                    />
                  )}

                  {/* Halo Glow */}
                  <circle
                    r={isHovered ? starSize * 2 : isCore ? starSize * 1.4 : starSize * 0.9}
                    fill={isCore ? 'rgba(251, 191, 36, 0.4)' : 'rgba(244, 63, 94, 0.35)'}
                    className="transition-all duration-300"
                  />

                  {/* Core Star Body */}
                  <circle
                    r={isHovered ? starSize : isCore ? starSize * 0.8 : starSize * 0.6}
                    fill={isCore ? '#FBBF24' : '#FFFFFF'}
                    className="celestial-star"
                  />

                  {/* Star Label Text */}
                  <text
                    y={starSize + 14}
                    textAnchor="middle"
                    className="fill-stone-200 text-[10px] font-sans font-medium tracking-wide drop-shadow pointer-events-none select-none"
                    opacity={isHovered || isCore ? 1 : 0.75}
                  >
                    {memory.title.length > 22 ? memory.title.slice(0, 20) + '…' : memory.title}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Floating Zoom & Reset HUD Controls */}
        <div className="absolute bottom-6 left-6 z-20 flex items-center gap-2 bg-stone-900/80 backdrop-blur-md border border-stone-800 p-1.5 rounded-2xl shadow-xl">
          <button
            onClick={() => setZoomLevel((z) => Math.min(1.6, z + 0.15))}
            className="p-2 rounded-xl text-stone-300 hover:text-white hover:bg-stone-800 transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoomLevel((z) => Math.max(0.7, z - 0.15))}
            className="p-2 rounded-xl text-stone-300 hover:text-white hover:bg-stone-800 transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setZoomLevel(1);
              setPanOffset({ x: 0, y: 0 });
            }}
            className="p-2 rounded-xl text-stone-300 hover:text-white hover:bg-stone-800 transition-colors"
            title="Reset Universe View"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Selected Star Inspection Card HUD */}
        {selectedStar && (
          <div className="absolute top-6 right-6 z-20 w-80 bg-stone-900/90 backdrop-blur-md border border-stone-700/80 rounded-2xl p-4 shadow-2xl text-stone-100 animate-in fade-in slide-in-from-right-2 duration-200">
            <div className="flex items-center justify-between text-xs text-rose-400 font-semibold mb-2">
              <span className="uppercase tracking-wider">{selectedStar.category || 'Memory'}</span>
              <span>{formatFriendlyDate(selectedStar.date)}</span>
            </div>

            {selectedStar.images && selectedStar.images[0] && (
              <div className="w-full h-32 rounded-xl overflow-hidden bg-stone-800 mb-3">
                <img
                  src={selectedStar.images[0]}
                  alt={selectedStar.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <h4 className="font-serif text-base font-bold text-white leading-tight mb-1">
              {selectedStar.title}
            </h4>

            {selectedStar.location && (
              <div className="flex items-center gap-1 text-[11px] text-stone-400 mb-2">
                <MapPin className="w-3 h-3 text-rose-400" />
                <span>{selectedStar.location}</span>
              </div>
            )}

            <p className="text-xs text-stone-300 line-clamp-2 leading-relaxed mb-3">
              {selectedStar.description}
            </p>

            <button
              onClick={() => onSelectMemory(selectedStar)}
              className="w-full py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold transition-colors shadow-sm"
            >
              Open Full Memory Card
            </button>
          </div>
        )}

        {/* Legend / Prompt Footer */}
        <div className="absolute bottom-6 right-6 z-20 hidden md:flex items-center gap-3 text-xs text-stone-400 bg-stone-900/80 backdrop-blur-md border border-stone-800 px-4 py-2 rounded-xl">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_8px_#FBBF24]" />
            <span>Core Milestone</span>
          </div>
          <span className="text-stone-600">·</span>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-white shadow-[0_0_6px_#ffffff]" />
            <span>Memory Star</span>
          </div>
          <span className="text-stone-600">·</span>
          <span>Click any star to open</span>
        </div>
      </div>
    </div>
  );
};
