import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('editor exposes the original and generated canvases with distinct roles', async () => {
  const html = await readFile(new URL('../../index.html', import.meta.url), 'utf8');
  assert.match(html, /id="source-canvas"[^>]*aria-label="Tela original, desenha aqui"/);
  assert.match(html, /id="output-panels"[^>]*class="output-panels"/);
  assert.match(html, /class="canvas-wrap"><canvas id="source-canvas"/);
  assert.match(html, /data-tool="black"/);
  assert.match(html, /data-tool="white"/);
  assert.match(html, /data-tool="erase"/);
});

test('editor includes import/export and independently configurable technique controls', async () => {
  const html = await readFile(new URL('../../index.html', import.meta.url), 'utf8');
  assert.match(html, /id="export-project"/);
  assert.match(html, /id="import-project-file"/);
  assert.match(html, /id="new-technique"/);
  assert.match(html, /id="resolver-mode"/);
  assert.match(html, /id="layout-mode"/);
});

test('setup exposes 4, 8 and 12 colour counts', async () => {
  const html = await readFile(new URL('../../index.html', import.meta.url), 'utf8');
  assert.match(html, /<option value="4" selected>4 cores<\/option>/);
  assert.match(html, /<option value="8">8 cores<\/option>/);
  assert.match(html, /<option value="12">12 cores<\/option>/);
  assert.match(html, /<option value="16">16 cores<\/option>/);
  assert.match(html, /<option value="32">32 cores<\/option>/);
  assert.match(html, /id="editor-color-count-select"[\s\S]*?<option value="32">32 cores<\/option>/);
});

test('canvas uses an actual matrix-aligned transparency grid, not viewport-wide checkerboard noise', async () => {
  const main = await readFile(new URL('../../src/main.js', import.meta.url), 'utf8');
  assert.match(main, /TRANSPARENT_CELL_COLORS/);
  assert.match(main, /geometry\.width/);
  assert.match(main, /strokeRect\(/);
  assert.match(main, /geometry\.height/);
  assert.doesNotMatch(main, /const tile = 10/);
});

test('editor exposes document tabs, three interpretation controls, inspector and shape tools', async () => {
  const html = await readFile(new URL('../../index.html', import.meta.url), 'utf8');
  for (const id of ['document-tabs', 'new-document', 'add-output', 'close-document', 'back-to-setup', 'undo-action', 'redo-action', 'settings-panel', 'source-settings', 'output-settings', 'editor-color-count-select']) {
    assert.match(html, new RegExp(`id="${id}"`));
  }
  for (const tool of ['line', 'rectangle', 'filled-rectangle', 'ellipse', 'filled-ellipse', 'fill', 'eyedropper']) {
    assert.match(html, new RegExp(`data-tool="${tool}"`));
  }
});
