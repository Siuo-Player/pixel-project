import assert from 'node:assert/strict';
import test from 'node:test';
import { validateSafePayload, sanitizeText, createSafeStorage } from '../../src/core/security.js';
import { parseProject } from '../../src/core/project.js';

test('validateSafePayload accepts valid nested structures', () => {
  const safeData = {
    name: 'Test Project',
    width: 32,
    active: true,
    tags: ['retro', 'pixel'],
    nested: { count: 4, items: [{ id: '1' }, { id: '2' }] }
  };
  assert.equal(validateSafePayload(safeData), safeData);
});

test('validateSafePayload rejects prototype pollution vectors', () => {
  assert.throws(
    () => validateSafePayload(JSON.parse('{"__proto__": {"admin": true}}')),
    /forbidden property: __proto__/
  );

  assert.throws(
    () => validateSafePayload(JSON.parse('{"nested": {"constructor": {"prototype": {"admin": true}}}}')),
    /forbidden property: constructor/
  );

  assert.throws(
    () => validateSafePayload(JSON.parse('{"items": [{"prototype": {}}]}')),
    /forbidden property: prototype/
  );
});

test('sanitizeText trims and strips control characters', () => {
  assert.equal(sanitizeText('  Farol ao anoitecer  '), 'Farol ao anoitecer');
  assert.equal(sanitizeText('hello\x00world\x1f'), 'helloworld');
  assert.equal(sanitizeText('A'.repeat(200), 50).length, 50);
});

test('parseProject rejects payloads with prototype pollution attempts', () => {
  const maliciousPayload = '{"version": 2, "__proto__": {"polluted": true}, "palette": ["#000000", "#ffffff"], "source": {"width": 4, "height": 4, "data": [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]}, "outputs": [{"width": 4, "height": 4}]}';

  assert.throws(
    () => parseProject(maliciousPayload),
    /forbidden property: __proto__/
  );
});

test('createSafeStorage safely manages items and handles failures', () => {
  const store = createSafeStorage({ prefix: 'px_test_' });
  store.setItem('token', 'sample_val');
  assert.equal(store.getItem('token'), 'sample_val');
  store.removeItem('token');
  assert.equal(store.getItem('token'), null);
});
