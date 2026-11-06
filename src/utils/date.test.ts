import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateDaysTogether, formatFriendlyDate, getOnThisDayMemories } from './date';
import { Memory } from '../types';

test('calculateDaysTogether calculates accurate elapsed days and hours', () => {
  const refDate = new Date(2026, 4, 15, 12, 0, 0); // May 15, 2026
  const result = calculateDaysTogether('2026-05-10', refDate);

  assert.equal(result.days, 5);
  assert.equal(result.weeks, 0);
  assert.ok(result.hours >= 120);
});

test('calculateDaysTogether handles multi-year anniversaries accurately', () => {
  const refDate = new Date(2026, 9, 20); // Oct 20, 2026
  const result = calculateDaysTogether('2024-10-15', refDate);

  assert.ok(result.days > 700);
  assert.ok(result.years >= 2);
  assert.ok(result.nextAnniversaryDays <= 365);
});

test('formatFriendlyDate produces clean human-readable date', () => {
  const formatted = formatFriendlyDate('2025-12-25');
  assert.ok(formatted.includes('Dec') || formatted.includes('December'));
  assert.ok(formatted.includes('25'));
  assert.ok(formatted.includes('2025'));
});

test('getOnThisDayMemories finds past year memories matching today', () => {
  const refDate = new Date(2026, 5, 24); // June 24, 2026
  const dummyMemories: Memory[] = [
    {
      id: '1',
      type: 'photo',
      title: 'Beach trip',
      date: '2024-06-24',
      description: 'Sunset on the beach',
      images: [],
      mood: 'romantic',
      tags: ['beach'],
      category: 'Trips',
      isFavorite: true,
      isCore: true,
      createdAt: '2024-06-24',
      updatedAt: '2024-06-24',
    },
    {
      id: '2',
      type: 'journal',
      title: 'Different day',
      date: '2024-06-20',
      description: 'Another day',
      images: [],
      mood: 'cozy',
      tags: [],
      category: 'General',
      isFavorite: false,
      isCore: false,
      createdAt: '2024-06-20',
      updatedAt: '2024-06-20',
    },
    {
      id: '3',
      type: 'photo',
      title: 'Deleted memory',
      date: '2024-06-24',
      description: 'Should not appear',
      images: [],
      mood: 'romantic',
      tags: [],
      category: 'Trips',
      isFavorite: false,
      isCore: false,
      deletedAt: '2026-01-01',
      createdAt: '2024-06-24',
      updatedAt: '2024-06-24',
    },
  ];

  const onThisDay = getOnThisDayMemories(dummyMemories, refDate);
  assert.equal(onThisDay.length, 1);
  assert.equal(onThisDay[0].memory.title, 'Beach trip');
  assert.equal(onThisDay[0].yearsAgo, 2);
});
