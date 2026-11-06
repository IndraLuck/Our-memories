import React from 'react';
import { Home, Image, BookOpen, Plus, Heart, Sparkles } from 'lucide-react';

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
  return (
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
          onClick={() => setActiveTab('core')}
          aria-label="Core Moments"
          className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] transition-colors ${
            activeTab === 'core' ? 'text-rose-600 dark:text-rose-400 font-semibold' : 'text-stone-500 dark:text-stone-400'
          }`}
        >
          <Sparkles className="w-5 h-5" />
          <span className="text-[10px] tracking-tight mt-1">Core</span>
        </button>
      </div>
    </div>
  );
};
