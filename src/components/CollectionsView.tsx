import React, { useState } from 'react';
import { FolderHeart, Plus, Sparkles, Image as ImageIcon, ChevronRight } from 'lucide-react';
import { Collection, Memory } from '../types';

interface CollectionsViewProps {
  collections: Collection[];
  memories: Memory[];
  onSelectMemory: (memory: Memory) => void;
  onAddCollection: (collection: Omit<Collection, 'id' | 'createdAt'>) => void;
}

export const CollectionsView: React.FC<CollectionsViewProps> = ({
  collections,
  memories,
  onSelectMemory,
  onAddCollection,
}) => {
  const [selectedCollectionId, setSelectedCollectionId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const activeMemories = memories.filter((m) => !m.deletedAt);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAddCollection({
      name: name.trim(),
      description: description.trim() || undefined,
    });
    setName('');
    setDescription('');
    setShowAddForm(false);
  };

  const selectedCollection = collections.find((c) => c.id === selectedCollectionId);
  const collectionMemories = selectedCollection
    ? activeMemories.filter((m) => m.category?.toLowerCase() === selectedCollection.name.toLowerCase() || m.collectionId === selectedCollection.id)
    : [];

  return (
    <div className="space-y-10 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200/80 dark:border-stone-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 mb-1">
            <FolderHeart className="w-3.5 h-3.5" />
            <span>Curated Albums</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-stone-900 dark:text-stone-50">
            Memory Collections
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1">
            Themed chapters and curated albums from our journey ({collections.length} albums)
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="h-10 px-4 rounded-xl bg-stone-900 dark:bg-rose-600 text-white font-medium text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-sm hover:bg-stone-800 dark:hover:bg-rose-500 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>New Collection</span>
        </button>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200/80 dark:border-rose-900/40 rounded-3xl p-6 sm:p-8 space-y-4 max-w-md mx-auto animate-in fade-in duration-200"
        >
          <h3 className="font-serif text-lg font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-rose-500" />
            <span>Create New Collection</span>
          </h3>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">Collection Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Road Trips & Getaways"
              className="w-full h-9 px-3 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-xs text-stone-900 dark:text-stone-100"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">Description</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Every highway, scenic overlook, and coastal turn"
              className="w-full h-9 px-3 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-xs text-stone-900 dark:text-stone-100"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-3.5 py-1.5 text-xs text-stone-600 hover:bg-stone-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-stone-900 dark:bg-rose-600 text-white text-xs font-semibold rounded-xl"
            >
              Create
            </button>
          </div>
        </form>
      )}

      {/* Selected Collection Memory View (if active) */}
      {selectedCollection && (
        <div className="p-6 rounded-3xl bg-stone-100/70 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-rose-600 dark:text-rose-400 uppercase">Viewing Album</span>
              <h2 className="font-serif text-2xl font-bold text-stone-900 dark:text-stone-100">{selectedCollection.name}</h2>
              {selectedCollection.description && (
                <p className="text-xs text-stone-500 mt-0.5">{selectedCollection.description}</p>
              )}
            </div>
            <button
              onClick={() => setSelectedCollectionId(null)}
              className="text-xs text-stone-500 hover:text-stone-900 underline"
            >
              Back to all albums
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
            {collectionMemories.map((m) => (
              <div
                key={m.id}
                onClick={() => onSelectMemory(m)}
                className="cursor-pointer p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm hover:shadow-md transition-all space-y-2"
              >
                {m.images && m.images[0] && (
                  <div className="w-full aspect-[4/3] rounded-xl overflow-hidden bg-stone-100">
                    <img src={m.images[0]} alt={m.title} className="w-full h-full object-cover" />
                  </div>
                )}
                <h4 className="font-serif font-bold text-sm text-stone-900 dark:text-stone-100 truncate">{m.title}</h4>
                <p className="text-xs text-stone-500 line-clamp-2">{m.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Collections Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {collections.map((col) => {
          const count = activeMemories.filter(
            (m) => m.category?.toLowerCase() === col.name.toLowerCase() || m.collectionId === col.id
          ).length;

          return (
            <div
              key={col.id}
              onClick={() => setSelectedCollectionId(col.id)}
              className="cursor-pointer group bg-white dark:bg-stone-900 rounded-3xl p-6 border border-stone-200/80 dark:border-stone-800 shadow-sm hover:shadow-md hover:border-rose-300 dark:hover:border-rose-800 transition-all flex flex-col justify-between"
            >
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-rose-50 dark:bg-rose-950/40 flex items-center justify-center text-rose-500 shrink-0 group-hover:scale-105 transition-transform">
                  <FolderHeart className="w-7 h-7" />
                </div>
                <div className="space-y-1 flex-1 min-w-0">
                  <span className="text-[11px] font-semibold text-rose-600 dark:text-rose-400">
                    {count} memories
                  </span>
                  <h3 className="font-serif font-bold text-lg text-stone-900 dark:text-stone-100 group-hover:text-rose-600 transition-colors truncate">
                    {col.name}
                  </h3>
                  {col.description && (
                    <p className="text-xs text-stone-500 dark:text-stone-400 line-clamp-2">
                      {col.description}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs font-semibold text-rose-600 dark:text-rose-400">
                <span>Explore Album</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
