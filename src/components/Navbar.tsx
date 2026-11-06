import React, { useState } from 'react';
import {
  BookHeart,
  Plus,
  Settings,
  Sparkles,
  Moon,
  Sun,
  Menu,
  X,
  Search,
  User,
  Cloud,
  FolderHeart,
  Compass,
  BarChart3,
  Calendar,
  ChevronDown,
  BookOpen,
  Star,
} from 'lucide-react';
import { NotebookSettings, SyncState } from '../types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  settings: NotebookSettings;
  syncState: SyncState;
  userEmail?: string | null;
  onOpenAddModal: () => void;
  onOpenSettingsModal: () => void;
  onOpenSearchModal: () => void;
  onOpenAuthModal: () => void;
  onToggleTheme: () => void;
  recentlyDeletedCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  settings,
  syncState,
  userEmail,
  onOpenAddModal,
  onOpenSettingsModal,
  onOpenSearchModal,
  onOpenAuthModal,
  onToggleTheme,
  recentlyDeletedCount,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);

  const primaryNavItems = [
    { id: 'home', label: 'Home' },
    { id: 'photos', label: 'Photos' },
    { id: 'journal', label: 'Journal' },
    { id: 'core', label: 'Core Moments' },
    { id: 'timeline', label: 'Timeline' },
  ];

  const secondaryNavItems = [
    { id: 'book', label: '3D Memory Book', icon: BookOpen },
    { id: 'constellation', label: 'Constellation', icon: Star },
    { id: 'collections', label: 'Collections', icon: FolderHeart },
    { id: 'map', label: 'Memory Map', icon: Compass },
    { id: 'dates', label: 'Special Dates', icon: Calendar },
    { id: 'stats', label: 'Statistics', icon: BarChart3 },
    { id: 'music', label: 'Soundtrack', icon: Sparkles },
    { id: 'appreciation', label: 'Love Notes', icon: BookHeart },
  ];

  const allNavItems = [...primaryNavItems, ...secondaryNavItems];

  const isMoreActive = secondaryNavItems.some((item) => item.id === activeTab);

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border-b border-stone-200 dark:border-stone-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
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
          {primaryNavItems.map((item) => {
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

          {/* More Dropdown */}
          <div className="relative">
            <button
              onClick={() => setMoreMenuOpen(!moreMenuOpen)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap shrink-0 transition-colors flex items-center gap-1 ${
                isMoreActive
                  ? 'text-rose-900 dark:text-rose-200 bg-rose-50 dark:bg-rose-950/40 font-semibold'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800/50'
              }`}
            >
              <span>More</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>

            {moreMenuOpen && (
              <div
                className="absolute right-0 mt-2 w-48 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-1"
                onMouseLeave={() => setMoreMenuOpen(false)}
              >
                {secondaryNavItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        setMoreMenuOpen(false);
                      }}
                      className={`w-full px-4 py-2 text-left text-xs font-semibold flex items-center gap-2.5 transition-colors ${
                        isActive
                          ? 'text-rose-600 dark:text-rose-400 bg-rose-50/70 dark:bg-rose-950/40'
                          : 'text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800'
                      }`}
                    >
                      <Icon className="w-4 h-4 text-stone-400" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </nav>

        {/* Zone 3: Actions & Controls */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Universal Search Trigger */}
          <button
            onClick={onOpenSearchModal}
            aria-label="Search all memories"
            className="w-9 h-9 rounded-xl flex items-center justify-center text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors focus:outline-none"
            title="Search memories (Ctrl+K)"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Sync & Auth Status Pill */}
          <button
            onClick={onOpenAuthModal}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors"
            title={userEmail ? `Signed in as ${userEmail}` : 'Offline / Local Mode. Click to sign in'}
          >
            {userEmail ? (
              <>
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-[11px] text-stone-700 dark:text-stone-300 font-medium truncate max-w-[100px]">
                  {userEmail.split('@')[0]}
                </span>
              </>
            ) : (
              <>
                <Cloud className="w-3.5 h-3.5 text-stone-400" />
                <span className="text-[11px] text-stone-500 dark:text-stone-400">Offline</span>
              </>
            )}
          </button>

          {/* Theme Quick Toggle */}
          <button
            onClick={onToggleTheme}
            aria-label="Toggle visual theme"
            className="w-9 h-9 rounded-xl flex items-center justify-center text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            title="Toggle theme"
          >
            {settings.theme === 'velvet' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Settings Trigger */}
          <button
            onClick={onOpenSettingsModal}
            aria-label="Open Notebook Settings"
            className="relative w-9 h-9 rounded-xl flex items-center justify-center text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            title="Settings, Backups, Cloud Sync"
          >
            <Settings className="w-4 h-4" />
            {recentlyDeletedCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500" />
            )}
          </button>

          {/* Primary CTA: Add Memory (Desktop) */}
          <button
            onClick={onOpenAddModal}
            className="hidden sm:flex h-9 px-3.5 rounded-xl bg-stone-900 dark:bg-rose-600 text-white font-medium text-xs sm:text-sm items-center gap-1.5 shadow-sm hover:bg-stone-800 dark:hover:bg-rose-500 transition-all active:scale-[0.98] whitespace-nowrap shrink-0"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add Memory</span>
          </button>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="lg:hidden w-9 h-9 rounded-xl flex items-center justify-center text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top-2 duration-150">
          <div className="grid grid-cols-2 gap-2 pb-3 border-b border-stone-100 dark:border-stone-800">
            {allNavItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`px-3 py-2 rounded-xl text-left text-xs sm:text-sm font-medium transition-colors ${
                  activeTab === item.id
                    ? 'bg-rose-50 dark:bg-rose-950/50 text-rose-900 dark:text-rose-200 font-semibold'
                    : 'text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between pt-1">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAuthModal();
              }}
              className="text-xs text-rose-600 dark:text-rose-400 font-semibold flex items-center gap-1"
            >
              <User className="w-3.5 h-3.5" />
              <span>{userEmail ? 'Account: ' + userEmail.split('@')[0] : 'Sign In to Sync'}</span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenSettingsModal();
              }}
              className="text-xs text-stone-500 underline underline-offset-2"
            >
              Settings & Backups
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
