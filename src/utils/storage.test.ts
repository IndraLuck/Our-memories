import test from 'node:test';
import assert from 'node:assert/strict';
import { generateBackup, validateAndParseBackup } from './storage';
import { DEFAULT_SETTINGS, INITIAL_MEMORIES, INITIAL_APPRECIATIONS } from './defaultData';

test('generateBackup builds valid structure with version and timestamp', () => {
  const payload = generateBackup(INITIAL_MEMORIES, DEFAULT_SETTINGS, INITIAL_APPRECIATIONS);
  assert.equal(payload.version, '2.0.0');
  assert.ok(payload.exportedAt);
  assert.equal(payload.memories.length, INITIAL_MEMORIES.length);
  assert.equal(payload.settings.person1, 'Maya');
});

test('validateAndParseBackup validates well-formed backup JSON', () => {
  const payload = generateBackup(INITIAL_MEMORIES, DEFAULT_SETTINGS, INITIAL_APPRECIATIONS);
  const jsonStr = JSON.stringify(payload);
  const result = validateAndParseBackup(jsonStr);

  assert.equal(result.isValid, true);
  assert.ok(result.data);
  assert.equal(result.data.memories.length, INITIAL_MEMORIES.length);
});

test('validateAndParseBackup rejects invalid or malformed JSON', () => {
  const malformed = '{"version": "2.0.0", invalid json';
  const result = validateAndParseBackup(malformed);
  assert.equal(result.isValid, false);
  assert.ok(result.error);
});

test('validateAndParseBackup rejects payloads missing memory requirements', () => {
  const invalidPayload = JSON.stringify({
    version: '2.0.0',
    memories: [{ id: '1' }], // Missing title & date
  });
  const result = validateAndParseBackup(invalidPayload);
  assert.equal(result.isValid, false);
  assert.ok(result.error?.includes('missing required fields'));
});
