import test from 'node:test';
import assert from 'node:assert/strict';
import { generateBackup, validateAndParseBackup } from './storage';
import { DEFAULT_SETTINGS, INITIAL_MEMORIES, INITIAL_APPRECIATIONS, INITIAL_COLLECTIONS, INITIAL_SPECIAL_DATES } from './defaultData';

test('generateBackup builds valid structure with collections and special dates', () => {
  const payload = generateBackup(
    INITIAL_MEMORIES,
    DEFAULT_SETTINGS,
    INITIAL_APPRECIATIONS,
    INITIAL_COLLECTIONS,
    INITIAL_SPECIAL_DATES
  );
  assert.equal(payload.version, '3.0.0');
  assert.ok(payload.exportedAt);
  assert.equal(payload.memories.length, INITIAL_MEMORIES.length);
  assert.equal(payload.collections?.length, INITIAL_COLLECTIONS.length);
  assert.equal(payload.specialDates?.length, INITIAL_SPECIAL_DATES.length);
  assert.equal(payload.settings.person1, 'Maya');
});

test('validateAndParseBackup validates well-formed v3 backup JSON', () => {
  const payload = generateBackup(
    INITIAL_MEMORIES,
    DEFAULT_SETTINGS,
    INITIAL_APPRECIATIONS,
    INITIAL_COLLECTIONS,
    INITIAL_SPECIAL_DATES
  );
  const jsonStr = JSON.stringify(payload);
  const result = validateAndParseBackup(jsonStr);

  assert.equal(result.isValid, true);
  assert.ok(result.data);
  assert.equal(result.data.memories.length, INITIAL_MEMORIES.length);
  assert.equal(result.data.collections?.length, INITIAL_COLLECTIONS.length);
});

test('validateAndParseBackup rejects invalid or malformed JSON', () => {
  const malformed = '{"version": "3.0.0", invalid json';
  const result = validateAndParseBackup(malformed);
  assert.equal(result.isValid, false);
  assert.ok(result.error);
});
