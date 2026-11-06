/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState, useMemo } from 'react';
import {
  Memory,
  NotebookSettings,
  AppreciationNote,
  Collection,
  SpecialDate,
  ThemeName,
  SyncState,
} from './types';
import {
  loadMemories,
  saveMemories,
  loadSettings,
  saveSettings,
  loadAppreciations,
  saveAppreciations,
  loadCollections,
  saveCollections,
  loadSpecialDates,
  saveSpecialDates,
} from './utils/storage';
import { calculateDaysTogether } from './utils/date';
import { getAuthSession, signOutUser, syncMemoriesToCloud, getSupabaseClient } from './utils/supabase';

import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { HomeView } from './components/HomeView';
import { PhotosView } from './components/PhotosView';
import { JournalView } from './components/JournalView';
import { CoreMemoriesView } from './components/CoreMemoriesView';
import { TimelineView } from './components/TimelineView';
import { MusicView } from './components/MusicView';
import { AppreciationView } from './components/AppreciationView';
import { CollectionsView } from './components/CollectionsView';
import { MapView } from './components/MapView';
import { SpecialDatesView } from './components/SpecialDatesView';
import { StatsView } from './components/StatsView';

import { MemoryModal } from './components/MemoryModal';
import { AddMemoryModal } from './components/AddMemoryModal';
import { SettingsModal } from './components/SettingsModal';
import { AuthModal } from './components/AuthModal';
import { SearchModal } from './components/SearchModal';

export default function App() {
  const [settings, setSettings] = useState<NotebookSettings>(loadSettings);
  const [memories, setMemories] = useState<Memory[]>(loadMemories);
  const [appreciations, setAppreciations] = useState<AppreciationNote[]>(loadAppreciations);
  const [collections, setCollections] = useState<Collection[]>(loadCollections);
  const [specialDates, setSpecialDates] = useState<SpecialDate[]>(loadSpecialDates);

  const [activeTab, setActiveTab] = useState('home');
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  // Authentication & Cloud Sync status
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [syncState, setSyncState] = useState<SyncState>('local_only');

  // Check initial authentication
  useEffect(() => {
    async function checkAuth() {
      const user = await getAuthSession();
      if (user?.email) {
        setUserEmail(user.email);
        setSyncState('synced');
      } else {
        setSyncState('local_only');
      }
    }
    checkAuth();
  }, [settings.supabaseUrl, settings.supabaseAnonKey]);

  // Live days-together calculation
  const daysInfo = useMemo(() => {
    return calculateDaysTogether(settings.startDate);
  }, [settings.startDate]);

  // Sync theme changes to <html> and <body>
  useEffect(() => {
    const root = document.documentElement;
    if (settings.theme === 'velvet') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [settings.theme]);

  // Global Keyboard shortcuts: ESC closes modals, Ctrl+K or Cmd+K opens Search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchModalOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        if (selectedMemory) setSelectedMemory(null);
        else if (isSearchModalOpen) setIsSearchModalOpen(false);
        else if (isAuthModalOpen) setIsAuthModalOpen(false);
        else if (isAddModalOpen) setIsAddModalOpen(false);
        else if (isSettingsModalOpen) setIsSettingsModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedMemory, isSearchModalOpen, isAuthModalOpen, isAddModalOpen, isSettingsModalOpen]);

  // Memory Handlers
  const handleSaveMemory = (newMemData: Omit<Memory, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newMemory: Memory = {
      ...newMemData,
      id: `mem-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setMemories((prev) => {
      const updated = [newMemory, ...prev];
      saveMemories(updated);
      return updated;
    });

    // Optional cloud sync in background if user is authenticated
    if (userEmail && settings.supabaseUrl && settings.supabaseAnonKey) {
      setSyncState('syncing');
      syncMemoriesToCloud([newMemory, ...memories], settings.supabaseUrl, settings.supabaseAnonKey)
        .then((res) => {
          if (res.success) setSyncState('synced');
          else setSyncState('error');
        })
        .catch(() => setSyncState('error'));
    }
  };

  const handleToggleFavorite = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setMemories((prev) => {
      const updated = prev.map((m) => (m.id === id ? { ...m, isFavorite: !m.isFavorite } : m));
      saveMemories(updated);
      return updated;
    });
    if (selectedMemory && selectedMemory.id === id) {
      setSelectedMemory((prev) => (prev ? { ...prev, isFavorite: !prev.isFavorite } : null));
    }
  };

  const handleToggleCore = (id: string) => {
    setMemories((prev) => {
      const updated = prev.map((m) => (m.id === id ? { ...m, isCore: !m.isCore } : m));
      saveMemories(updated);
      return updated;
    });
    if (selectedMemory && selectedMemory.id === id) {
      setSelectedMemory((prev) => (prev ? { ...prev, isCore: !prev.isCore } : null));
    }
  };

  const handleDeleteMemory = (id: string) => {
    setMemories((prev) => {
      const updated = prev.map((m) =>
        m.id === id ? { ...m, deletedAt: new Date().toISOString() } : m
      );
      saveMemories(updated);
      return updated;
    });
    if (selectedMemory && selectedMemory.id === id) {
      setSelectedMemory(null);
    }
  };

  const handleRestoreFromTrash = (id: string) => {
    setMemories((prev) => {
      const updated = prev.map((m) => (m.id === id ? { ...m, deletedAt: null } : m));
      saveMemories(updated);
      return updated;
    });
  };

  const handlePermanentlyDelete = (id: string) => {
    setMemories((prev) => {
      const updated = prev.filter((m) => m.id !== id);
      saveMemories(updated);
      return updated;
    });
  };

  const handleRestoreMemories = (imported: Memory[], mode: 'merge' | 'replace') => {
    setMemories((prev) => {
      let updated: Memory[];
      if (mode === 'replace') {
        updated = imported;
      } else {
        const existingIds = new Set(prev.map((m) => m.id));
        const newOnes = imported.filter((m) => !existingIds.has(m.id));
        updated = [...newOnes, ...prev];
      }
      saveMemories(updated);
      return updated;
    });
  };

  const handleClearAll = () => {
    setMemories([]);
    saveMemories([]);
  };

  const handleUpdateSettings = (newSettings: NotebookSettings) => {
    setSettings(newSettings);
    saveSettings(newSettings);
  };

  const handleToggleTheme = () => {
    const themeCycle: ThemeName[] = ['blush', 'lavender', 'linen', 'velvet'];
    const nextIdx = (themeCycle.indexOf(settings.theme) + 1) % themeCycle.length;
    const nextTheme = themeCycle[nextIdx];
    handleUpdateSettings({ ...settings, theme: nextTheme });
  };

  const handleAddAppreciation = (note: { text: string; author: string }) => {
    const newNote: AppreciationNote = {
      id: `appr-${Date.now()}`,
      text: note.text,
      author: note.author,
      date: new Date().toISOString().slice(0, 10),
      isFavorite: false,
    };
    setAppreciations((prev) => {
      const updated = [newNote, ...prev];
      saveAppreciations(updated);
      return updated;
    });
  };

  const handleToggleAppreciationFavorite = (id: string) => {
    setAppreciations((prev) => {
      const updated = prev.map((n) => (n.id === id ? { ...n, isFavorite: !n.isFavorite } : n));
      saveAppreciations(updated);
      return updated;
    });
  };

  const handleAddCollection = (newCol: Omit<Collection, 'id' | 'createdAt'>) => {
    const col: Collection = {
      ...newCol,
      id: `col-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setCollections((prev) => {
      const updated = [col, ...prev];
      saveCollections(updated);
      return updated;
    });
  };

  const handleAddSpecialDate = (newDate: Omit<SpecialDate, 'id'>) => {
    const sd: SpecialDate = {
      ...newDate,
      id: `sd-${Date.now()}`,
    };
    setSpecialDates((prev) => {
      const updated = [sd, ...prev];
      saveSpecialDates(updated);
      return updated;
    });
  };

  const handleDeleteSpecialDate = (id: string) => {
    setSpecialDates((prev) => {
      const updated = prev.filter((d) => d.id !== id);
      saveSpecialDates(updated);
      return updated;
    });
  };

  const handleAuthSuccess = (email: string) => {
    setUserEmail(email);
    setSyncState('synced');
  };

  const handleSignOut = async () => {
    await signOutUser();
    setUserEmail(null);
    setSyncState('local_only');
  };

  const recentlyDeletedCount = memories.filter((m) => !!m.deletedAt).length;

  const getThemeWrapperClass = () => {
    switch (settings.theme) {
      case 'lavender':
        return 'bg-purple-50/40 text-stone-800 dark:bg-stone-950 dark:text-stone-100';
      case 'linen':
        return 'bg-amber-50/30 text-stone-800 dark:bg-stone-950 dark:text-stone-100';
      case 'velvet':
        return 'bg-stone-950 text-stone-100 dark:bg-stone-950 dark:text-stone-100';
      case 'blush':
      default:
        return 'bg-[#FAF7F5] text-stone-800 dark:bg-stone-950 dark:text-stone-100';
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${getThemeWrapperClass()}`}>
      {/* 3-Zone Clean Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        settings={settings}
        syncState={syncState}
        userEmail={userEmail}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onOpenSettingsModal={() => setIsSettingsModalOpen(true)}
        onOpenSearchModal={() => setIsSearchModalOpen(true)}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onToggleTheme={handleToggleTheme}
        recentlyDeletedCount={recentlyDeletedCount}
      />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-24 lg:pb-16">
        {activeTab === 'home' && (
          <HomeView
            settings={settings}
            daysInfo={daysInfo}
            memories={memories}
            onSelectMemory={(m) => setSelectedMemory(m)}
            onNavigateTab={(tab) => setActiveTab(tab)}
            onOpenAddModal={() => setIsAddModalOpen(true)}
          />
        )}

        {activeTab === 'photos' && (
          <PhotosView
            memories={memories}
            onSelectMemory={(m) => setSelectedMemory(m)}
            onToggleFavorite={handleToggleFavorite}
            onOpenAddModal={() => setIsAddModalOpen(true)}
          />
        )}

        {activeTab === 'journal' && (
          <JournalView
            memories={memories}
            onSelectMemory={(m) => setSelectedMemory(m)}
            onToggleFavorite={handleToggleFavorite}
            onOpenAddModal={() => setIsAddModalOpen(true)}
          />
        )}

        {activeTab === 'core' && (
          <CoreMemoriesView
            memories={memories}
            onSelectMemory={(m) => setSelectedMemory(m)}
            onToggleFavorite={handleToggleFavorite}
            onOpenAddModal={() => setIsAddModalOpen(true)}
          />
        )}

        {activeTab === 'timeline' && (
          <TimelineView
            memories={memories}
            onSelectMemory={(m) => setSelectedMemory(m)}
            onOpenAddModal={() => setIsAddModalOpen(true)}
          />
        )}

        {activeTab === 'collections' && (
          <CollectionsView
            collections={collections}
            memories={memories}
            onSelectMemory={(m) => setSelectedMemory(m)}
            onAddCollection={handleAddCollection}
          />
        )}

        {activeTab === 'map' && (
          <MapView
            memories={memories}
            onSelectMemory={(m) => setSelectedMemory(m)}
          />
        )}

        {activeTab === 'dates' && (
          <SpecialDatesView
            specialDates={specialDates}
            onAddSpecialDate={handleAddSpecialDate}
            onDeleteSpecialDate={handleDeleteSpecialDate}
          />
        )}

        {activeTab === 'stats' && (
          <StatsView
            memories={memories}
            daysInfo={daysInfo}
            person1={settings.person1}
            person2={settings.person2}
          />
        )}

        {activeTab === 'music' && (
          <MusicView
            memories={memories}
            onSelectMemory={(m) => setSelectedMemory(m)}
            onToggleFavorite={handleToggleFavorite}
            onOpenAddModal={() => setIsAddModalOpen(true)}
          />
        )}

        {activeTab === 'appreciation' && (
          <AppreciationView
            appreciations={appreciations}
            settings={settings}
            onAddAppreciation={handleAddAppreciation}
            onToggleFavorite={handleToggleAppreciationFavorite}
          />
        )}
      </main>

      {/* Mobile Bottom Tab Navigation */}
      <BottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAddModal={() => setIsAddModalOpen(true)}
      />

      {/* Modals */}
      <MemoryModal
        memory={selectedMemory}
        onClose={() => setSelectedMemory(null)}
        onToggleFavorite={handleToggleFavorite}
        onToggleCore={handleToggleCore}
        onDeleteMemory={handleDeleteMemory}
      />

      <AddMemoryModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSaveMemory={handleSaveMemory}
      />

      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        memories={memories}
        onRestoreMemories={handleRestoreMemories}
        onRestoreFromTrash={handleRestoreFromTrash}
        onPermanentlyDelete={handlePermanentlyDelete}
        onClearAll={handleClearAll}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentUserEmail={userEmail}
        onAuthSuccess={handleAuthSuccess}
        onSignOut={handleSignOut}
      />

      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        memories={memories}
        onSelectMemory={(m) => setSelectedMemory(m)}
      />
    </div>
  );
}
