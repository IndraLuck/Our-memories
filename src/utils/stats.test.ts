import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateMemoryStats } from './stats';
import { INITIAL_MEMORIES } from './defaultData';

test('calculateMemoryStats accurately aggregates counts', () => {
  const stats = calculateMemoryStats(INITIAL_MEMORIES);
  assert.equal(stats.totalMemories, INITIAL_MEMORIES.length);
  assert.ok(stats.totalPhotos >= 4);
  assert.ok(stats.totalJournalWords > 50);
  assert.ok(stats.yearsCovered >= 1);
  assert.ok(stats.uniqueLocationsCount >= 2);
});

test('calculateMemoryStats excludes deleted memories from active counts', () => {
  const testMemories = [
    ...INITIAL_MEMORIES,
    {
      ...INITIAL_MEMORIES[0],
      id: 'deleted-1',
      deletedAt: '2026-01-01T00:00:00Z',
    },
  ];
  const stats = calculateMemoryStats(testMemories);
  assert.equal(stats.totalMemories, INITIAL_MEMORIES.length);
});
