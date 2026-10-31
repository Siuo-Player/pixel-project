import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('editor provides one original and a dynamic area for up to three output canvases', async () => {
  const html = await readFile(new URL('../../index.html', import.meta.url), 'utf8');
  assert.match(html, /id="source-canvas"/);
  assert.match(html, /id="output-panels"/);
  assert.match(html, /id="add-output"/);
  assert.match(html, /id="settings-panel"[^>]*hidden/);
  assert.match(html, /id="source-settings"/);
  assert.match(html, /id="output-settings"/);
});

test('editor calculation controls include new resolvers and the expanded technique catalogue', async () => {
  const html = await readFile(new URL('../../index.html', import.meta.url), 'utf8');
  assert.match(html, /value="weighted-vote"/);
  const techniques = await readFile(new URL('../../src/engine/techniques.js', import.meta.url), 'utf8');
  for (const id of ['local-majority', 'edge-aware', 'gradient-direction', 'ordered-dither']) {
    assert.match(techniques, new RegExp(id));
  }
});

test('paint colour is an independent selection from the active drawing tool', async () => {
  const main = await readFile(new URL('../../src/main.js', import.meta.url), 'utf8');
  assert.match(main, /paintColorName/);
  assert.match(main, /dataset\.selectedColor/);
  assert.match(main, /function setPaintColor/);
});
