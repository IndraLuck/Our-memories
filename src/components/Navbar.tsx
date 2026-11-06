import React from 'react';
import { BookHeart, Plus, Settings, Sparkles, Moon, Sun, Menu, X, Trash2 } from 'lucide-react';
import { NotebookSettings } from '../types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  settings: NotebookSettings;
  onOpenAddModal: () => void;
  onOpenSettingsModal: () => void;
  onToggleTheme: () => void;
  recentlyDeletedCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  settings,
  onOpenAddModal,
  onOpenSettingsModal,
  onToggleTheme,
  recentlyDeletedCount,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'photos', label: 'Photos' },
    { id: 'journal', label: 'Journal' },
    { id: 'core', label: 'Core Moments' },
    { id: 'timeline', label: 'Timeline' },
    { id: 'music', label: 'Soundtrack' },
    { id: 'appreciation', label: 'Love Notes' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-stone-900/90 backdrop-blur-md border-b border-stone-200 dark:border-stone-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4 md:gap-8">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setActiveTab('home')}
            className="group flex items-center gap-2.5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 rounded-lg p-1"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-400 to-amber-200 flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
              <BookHeart className="w-5 h-5 text-rose-950" />
            </div>
            <div>
              <span className="font-serif text-lg font-bold tracking-tight text-stone-900 dark:text-stone-100 whitespace-nowrap block leading-tight">
                {settings.title}
              </span>
              <span className="text-[11px] font-medium text-stone-500 dark:text-stone-400 font-handwriting text-sm block -mt-0.5">
                {settings.person1} & {settings.person2}
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: Navigation Links (Desktop) */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2 text-sm font-medium">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap shrink-0 transition-colors ${
                  isActive
                    ? 'text-rose-900 dark:text-rose-200 bg-rose-50 dark:bg-rose-950/40 font-semibold'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800/50'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Theme Quick Toggle */}
          <button
            onClick={onToggleTheme}
            aria-label="Toggle visual theme"
            className="w-10 h-10 rounded-xl flex items-center justify-center text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400"
            title="Toggle theme"
          >
            {settings.theme === 'velvet' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Settings Trigger */}
          <button
            onClick={onOpenSettingsModal}
            aria-label="Open Notebook Settings"
            className="relative w-10 h-10 rounded-xl flex items-center justify-center text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400"
            title="Notebook Settings & Backups"
          >
            <Settings className="w-4 h-4" />
            {recentlyDeletedCount > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-500" title={`${recentlyDeletedCount} items in trash`} />
            )}
          </button>

          {/* Primary CTA: Add Memory (Hidden on small mobile since BottomNav has prominent thumb button) */}
          <button
            onClick={onOpenAddModal}
            className="hidden sm:flex h-10 px-4 rounded-xl bg-stone-900 dark:bg-rose-600 text-white font-medium text-xs sm:text-sm items-center gap-1.5 shadow-sm hover:bg-stone-800 dark:hover:bg-rose-500 transition-all hover:shadow active:scale-[0.98] whitespace-nowrap shrink-0"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add Memory</span>
          </button>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="lg:hidden w-10 h-10 rounded-xl flex items-center justify-center text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 px-4 pt-3 pb-6 space-y-1 animate-in slide-in-from-top-2 duration-150">
          <div className="grid grid-cols-2 gap-2 pb-3 border-b border-stone-100 dark:border-stone-800 mb-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`px-3 py-2.5 rounded-xl text-left text-sm font-medium transition-colors ${
                  activeTab === item.id
                    ? 'bg-rose-50 dark:bg-rose-950/50 text-rose-900 dark:text-rose-200 font-semibold'
                    : 'text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-stone-500 dark:text-stone-400">
              Active Theme: <span className="capitalize font-semibold text-stone-800 dark:text-stone-200">{settings.theme}</span>
            </span>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenSettingsModal();
              }}
              className="text-xs text-rose-600 dark:text-rose-400 font-medium underline underline-offset-2"
            >
              Manage Backups & Sync
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
