import React, { useState } from 'react';
import { X, Upload, Sparkles, Heart, Image as ImageIcon, Music, BookOpen, Star, AlertCircle } from 'lucide-react';
import { Memory, MemoryType, MoodType } from '../types';
import { compressImageFile } from '../utils/storage';

interface AddMemoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveMemory: (memory: Omit<Memory, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

export const AddMemoryModal: React.FC<AddMemoryModalProps> = ({
  isOpen,
  onClose,
  onSaveMemory,
}) => {
  if (!isOpen) return null;

  const [type, setType] = useState<MemoryType>('photo');
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [mood, setMood] = useState<MoodType>('romantic');
  const [category, setCategory] = useState('Dates');
  const [location, setLocation] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [isCore, setIsCore] = useState(false);
  const [songTitle, setSongTitle] = useState('');
  const [songArtist, setSongArtist] = useState('');
  const [songUrl, setSongUrl] = useState('');
  const [isCompressing, setIsCompressing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setError(null);
    setIsCompressing(true);

    try {
      const compressedUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const compressed = await compressImageFile(file);
        compressedUrls.push(compressed);
      }
      setImages((prev) => [...prev, ...compressedUrls]);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to compress image';
      setError(msg);
    } finally {
      setIsCompressing(false);
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please provide a title for this memory.');
      return;
    }
    if (!date) {
      setError('Please select a date.');
      return;
    }

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim().replace(/^#/, ''))
      .filter(Boolean);

    onSaveMemory({
      type,
      title: title.trim(),
      date,
      description: description.trim(),
      images,
      mood,
      tags,
      category: category.trim() || 'General',
      location: location.trim() || undefined,
      isFavorite: false,
      isCore: isCore || type === 'core',
      songTitle: songTitle.trim() || undefined,
      songArtist: songArtist.trim() || undefined,
      songUrl: songUrl.trim() || undefined,
    });

    onClose();
  };

  const moods: { id: MoodType; label: string; emoji: string }[] = [
    { id: 'romantic', label: 'Romantic', emoji: '🥰' },
    { id: 'magical', label: 'Magical', emoji: '✨' },
    { id: 'cozy', label: 'Cozy', emoji: '☕' },
    { id: 'adventurous', label: 'Adventurous', emoji: '🌴' },
    { id: 'silly', label: 'Silly & Fun', emoji: '😂' },
    { id: 'grateful', label: 'Grateful', emoji: '💖' },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-add-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-2xl p-6 sm:p-8 space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-4">
          <div>
            <h2 id="modal-add-title" className="font-serif text-2xl font-bold text-stone-900 dark:text-stone-50">
              Add a New Memory
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Preserve this moment forever in your shared notebook
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="w-9 h-9 rounded-xl flex items-center justify-center text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Memory Type Tabs */}
          <div className="grid grid-cols-4 gap-2 p-1 bg-stone-100 dark:bg-stone-800 rounded-xl text-xs font-semibold">
            <button
              type="button"
              onClick={() => {
                setType('photo');
                setCategory('Dates');
              }}
              className={`py-2 rounded-lg flex items-center justify-center gap-1.5 transition-colors ${
                type === 'photo'
                  ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-sm'
                  : 'text-stone-600 dark:text-stone-400'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Photo</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setType('journal');
                setCategory('Journal');
              }}
              className={`py-2 rounded-lg flex items-center justify-center gap-1.5 transition-colors ${
                type === 'journal'
                  ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-sm'
                  : 'text-stone-600 dark:text-stone-400'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Journal</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setType('core');
                setIsCore(true);
                setCategory('Milestones');
              }}
              className={`py-2 rounded-lg flex items-center justify-center gap-1.5 transition-colors ${
                type === 'core'
                  ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-sm'
                  : 'text-stone-600 dark:text-stone-400'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Core</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setType('music');
                setCategory('Music');
              }}
              className={`py-2 rounded-lg flex items-center justify-center gap-1.5 transition-colors ${
                type === 'music'
                  ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-sm'
                  : 'text-stone-600 dark:text-stone-400'
              }`}
            >
              <Music className="w-3.5 h-3.5" />
              <span>Soundtrack</span>
            </button>
          </div>

          {/* Title & Date */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2 space-y-1">
              <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                Memory Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Midnight Walk on the Pier"
                className="w-full h-10 px-3 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 text-sm focus:ring-2 focus:ring-rose-400 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                Date *
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full h-10 px-3 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 text-sm focus:ring-2 focus:ring-rose-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Photos Upload Area */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">
              Upload Photos / Snapshots
            </label>

            <div className="border-2 border-dashed border-stone-200 dark:border-stone-700 rounded-2xl p-4 text-center hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors cursor-pointer relative">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                disabled={isCompressing}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <div className="flex flex-col items-center justify-center space-y-1">
                <Upload className="w-6 h-6 text-stone-400" />
                <span className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                  {isCompressing ? 'Optimizing photo...' : 'Tap or drop photos to upload'}
                </span>
                <span className="text-[11px] text-stone-400">
                  Mobile camera, gallery, or desktop files (automatically compressed for fast offline storage)
                </span>
              </div>
            </div>

            {/* Thumbnail previews */}
            {images.length > 0 && (
              <div className="flex gap-2 overflow-x-auto no-scrollbar py-2">
                {images.map((img, idx) => (
                  <div key={idx} className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0 border border-stone-200">
                    <img src={img} alt="preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute top-1 right-1 w-5 h-5 rounded-full bg-stone-900/80 text-white flex items-center justify-center text-xs"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Description / Story Note */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">
              The Story / Personal Note
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What made this moment unforgettable? What were we laughing about? How did it feel?"
              className="w-full p-3 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 text-sm focus:ring-2 focus:ring-rose-400 focus:outline-none"
            />
          </div>

          {/* Song specific fields if music */}
          {type === 'music' && (
            <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/40 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">Song Title</label>
                  <input
                    type="text"
                    value={songTitle}
                    onChange={(e) => setSongTitle(e.target.value)}
                    placeholder="e.g. Texas Sun"
                    className="w-full h-9 px-3 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs text-stone-900 dark:text-stone-100"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">Artist</label>
                  <input
                    type="text"
                    value={songArtist}
                    onChange={(e) => setSongArtist(e.target.value)}
                    placeholder="e.g. Leon Bridges"
                    className="w-full h-9 px-3 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs text-stone-900 dark:text-stone-100"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">Spotify / Audio Web Link</label>
                <input
                  type="url"
                  value={songUrl}
                  onChange={(e) => setSongUrl(e.target.value)}
                  placeholder="https://open.spotify.com/track/..."
                  className="w-full h-9 px-3 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs text-stone-900 dark:text-stone-100"
                />
              </div>
            </div>
          )}

          {/* Mood Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">
              Mood of this Memory
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {moods.map((m) => (
                <button
                  type="button"
                  key={m.id}
                  onClick={() => setMood(m.id)}
                  className={`py-2 px-2 rounded-xl text-xs font-medium flex flex-col items-center gap-1 transition-all ${
                    mood === m.id
                      ? 'bg-rose-500 text-white font-semibold shadow-sm scale-105'
                      : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200'
                  }`}
                >
                  <span className="text-base">{m.emoji}</span>
                  <span className="text-[10px] capitalize truncate">{m.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Category, Location, Tags */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">Category</label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Dates, Trips, Firsts..."
                className="w-full h-9 px-3 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs text-stone-900 dark:text-stone-100"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Big Sur, CA"
                className="w-full h-9 px-3 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs text-stone-900 dark:text-stone-100"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">Tags (comma separated)</label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="picnic, sunset, beach"
                className="w-full h-9 px-3 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs text-stone-900 dark:text-stone-100"
              />
            </div>
          </div>

          {/* Mark as Core Memory Toggle */}
          <label className="flex items-center gap-2.5 p-3 rounded-xl bg-stone-50 dark:bg-stone-800/50 cursor-pointer">
            <input
              type="checkbox"
              checked={isCore}
              onChange={(e) => setIsCore(e.target.checked)}
              className="w-4 h-4 rounded text-rose-600 focus:ring-rose-400"
            />
            <div className="flex items-center gap-1.5 text-xs text-stone-700 dark:text-stone-300 font-medium">
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
              <span>Mark as Core Memory (Highlight on Core Moments and Spotlight)</span>
            </div>
          </label>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-100 dark:border-stone-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isCompressing}
              className="px-5 py-2.5 rounded-xl bg-stone-900 dark:bg-rose-600 text-white text-xs sm:text-sm font-semibold shadow-sm hover:bg-stone-800 dark:hover:bg-rose-500 active:scale-95 transition-all"
            >
              Save Memory
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
