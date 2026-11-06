import { Memory, MemoryStats, MoodType } from '../types';

export function calculateMemoryStats(memories: Memory[]): MemoryStats {
  const active = memories.filter((m) => !m.deletedAt);

  const initialMoodCounts: Record<MoodType, number> = {
    romantic: 0,
    magical: 0,
    cozy: 0,
    adventurous: 0,
    silly: 0,
    bittersweet: 0,
    grateful: 0,
  };

  let totalPhotos = 0;
  let totalJournalWords = 0;
  let totalSongs = 0;
  let totalJournalEntries = 0;
  let totalCoreMemories = 0;
  let favoriteCount = 0;

  const locationsSet = new Set<string>();
  const yearsSet = new Set<string>();

  for (const m of active) {
    if (m.images && m.images.length > 0) {
      totalPhotos += m.images.length;
    }
    if (m.type === 'journal' || (!m.images?.length && m.description)) {
      totalJournalEntries++;
      const words = m.description.trim().split(/\s+/).filter(Boolean).length;
      totalJournalWords += words;
    }
    if (m.type === 'music' || m.songTitle) {
      totalSongs++;
    }
    if (m.isCore) {
      totalCoreMemories++;
    }
    if (m.isFavorite) {
      favoriteCount++;
    }
    if (m.location) {
      locationsSet.add(m.location.trim().toLowerCase());
    }
    if (m.date) {
      yearsSet.add(m.date.slice(0, 4));
    }
    if (m.mood && initialMoodCounts[m.mood] !== undefined) {
      initialMoodCounts[m.mood]++;
    }
  }

  // Find top mood
  let topMood: MoodType = 'romantic';
  let maxCount = -1;
  for (const [moodKey, count] of Object.entries(initialMoodCounts)) {
    if (count > maxCount) {
      maxCount = count;
      topMood = moodKey as MoodType;
    }
  }

  return {
    totalMemories: active.length,
    totalPhotos,
    totalJournalEntries,
    totalSongs,
    totalCoreMemories,
    favoriteCount,
    totalJournalWords,
    topMood,
    moodCounts: initialMoodCounts,
    yearsCovered: Math.max(1, yearsSet.size),
    uniqueLocationsCount: locationsSet.size,
  };
}
