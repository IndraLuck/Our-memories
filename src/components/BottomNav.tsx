import React, { useState } from 'react';
import { Home, Image, BookOpen, Plus, Sparkles, FolderHeart, Compass, BarChart3, Calendar, MoreHorizontal, X } from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenAddModal: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  setActiveTab,
  onOpenAddModal,
}) => {
  const [sheetOpen, setSheetOpen] = useState(false);

  const moreItems = [
    { id: 'core', label: 'Core Moments', icon: Sparkles },
    { id: 'timeline', label: 'Timeline', icon: Calendar },
    { id: 'collections', label: 'Collections', icon: FolderHeart },
    { id: 'map', label: 'Memory Map', icon: Compass },
    { id: 'dates', label: 'Special Dates', icon: Calendar },
    { id: 'stats', label: 'Statistics', icon: BarChart3 },
    { id: 'music', label: 'Soundtrack', icon: Sparkles },
    { id: 'appreciation', label: 'Love Notes', icon: Sparkles },
  ];

  return (
    <>
      {/* Mobile Drawer Sheet when "More" is tapped */}
      {sheetOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-sm flex flex-col justify-end"
          onClick={() => setSheetOpen(false)}
        >
          <div
            className="bg-white dark:bg-stone-900 rounded-t-3xl p-6 border-t border-stone-200 dark:border-stone-800 space-y-4 max-h-[70vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Sheet Handle */}
            <div className="w-10 h-1 bg-stone-300 dark:bg-stone-700 rounded-full mx-auto" />

            <div className="flex items-center justify-between">
              <h3 className="font-serif text-lg font-bold text-stone-900 dark:text-stone-100">
                All Sections
              </h3>
              <button
                onClick={() => setSheetOpen(false)}
                className="p-1 rounded-lg text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5 pt-1">
              {moreItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setSheetOpen(false);
                    }}
                    className={`p-3 rounded-2xl border text-left flex items-center gap-2.5 transition-colors ${
                      isActive
                        ? 'border-rose-400 bg-rose-50/60 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200 font-semibold'
                        : 'border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-800/50 text-stone-700 dark:text-stone-300'
                    }`}
                  >
                    <Icon className="w-4 h-4 text-rose-500" />
                    <span className="text-xs">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Fixed Ergonomic Bottom Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-stone-900/95 backdrop-blur-lg border-t border-stone-200/80 dark:border-stone-800 pb-[env(safe-area-inset-bottom,0px)]">
        <div className="grid grid-cols-5 items-center h-16 max-w-md mx-auto px-2">
          <button
            onClick={() => setActiveTab('home')}
            aria-label="Home"
            className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] transition-colors ${
              activeTab === 'home' ? 'text-rose-600 dark:text-rose-400 font-semibold' : 'text-stone-500 dark:text-stone-400'
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="text-[10px] tracking-tight mt-1">Home</span>
          </button>

          <button
            onClick={() => setActiveTab('photos')}
            aria-label="Photos"
            className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] transition-colors ${
              activeTab === 'photos' ? 'text-rose-600 dark:text-rose-400 font-semibold' : 'text-stone-500 dark:text-stone-400'
            }`}
          >
            <Image className="w-5 h-5" />
            <span className="text-[10px] tracking-tight mt-1">Photos</span>
          </button>

          {/* Center Prominent Add Button */}
          <div className="flex justify-center items-center">
            <button
              onClick={onOpenAddModal}
              aria-label="Add new memory"
              className="w-12 h-12 rounded-full bg-stone-900 dark:bg-rose-600 text-white flex items-center justify-center shadow-lg shadow-stone-900/20 active:scale-95 transition-transform"
            >
              <Plus className="w-6 h-6 stroke-[2.5]" />
            </button>
          </div>

          <button
            onClick={() => setActiveTab('journal')}
            aria-label="Journal"
            className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] transition-colors ${
              activeTab === 'journal' ? 'text-rose-600 dark:text-rose-400 font-semibold' : 'text-stone-500 dark:text-stone-400'
            }`}
          >
            <BookOpen className="w-5 h-5" />
            <span className="text-[10px] tracking-tight mt-1">Journal</span>
          </button>

          <button
            onClick={() => setSheetOpen(true)}
            aria-label="More sections"
            className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] transition-colors ${
              sheetOpen ? 'text-rose-600 dark:text-rose-400 font-semibold' : 'text-stone-500 dark:text-stone-400'
            }`}
          >
            <MoreHorizontal className="w-5 h-5" />
            <span className="text-[10px] tracking-tight mt-1">More</span>
          </button>
        </div>
      </div>
    </>
  );
};
