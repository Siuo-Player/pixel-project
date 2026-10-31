import test from 'node:test';
import assert from 'node:assert/strict';
import { createSourceGrid, setPixel, BLACK, WHITE, TRANSPARENT } from '../../src/core/grid.js';
import { createTechniqueInstance, TECHNIQUE_CATALOG, runTechnique } from '../../src/engine/techniques.js';
import { getPalette } from '../../src/engine/palettes.js';
import { convertSource } from '../../src/engine/convert.js';
import { invertPolarity } from '../../src/core/transforms.js';
import { mirrorPaletteIndex } from '../../src/engine/palettes.js';
import { resolveProposals } from '../../src/engine/resolver.js';

test('catalog exposes four additional, conceptually distinct calculation techniques', () => {
  const ids = TECHNIQUE_CATALOG.map(item => item.id);
  for (const id of ['local-majority', 'edge-aware', 'gradient-direction', 'ordered-dither']) {
    assert.ok(ids.includes(id), `Missing technique: ${id}`);
  }
});

test('all calculation techniques emit valid distributions and preserve transparency', () => {
  const source = createSourceGrid(7, 7);
  for (let y = 0; y < 7; y += 1) {
    for (let x = 0; x < 7; x += 1) {
      if ((x + y) % 3) setPixel(source, x, y, (x > 3 ? WHITE : BLACK));
    }
  }
  const palette = getPalette('spectrum-32');
  const ids = ['weighted-neighbourhood', 'directional-lines', 'local-entropy', 'local-majority', 'edge-aware', 'gradient-direction', 'ordered-dither'];
  for (const id of ids) {
    const proposal = runTechnique(source, palette, createTechniqueInstance(id));
    assert.equal(proposal.mask[0], 0);
    assert.equal(proposal.distributions.length, source.data.length * palette.colors.length);
    for (let p = 0; p < source.data.length; p += 1) {
      if (!proposal.mask[p]) continue;
      const distribution = proposal.distributions.slice(p * palette.colors.length, (p + 1) * palette.colors.length);
      assert.ok([...distribution].every(value => Number.isFinite(value) && value >= 0), id);
      assert.ok(Math.abs([...distribution].reduce((sum, value) => sum + value, 0) - 1) < 1e-5, id);
    }
  }
});

test('ordered dithering remains complementary after black-white polarity inversion', () => {
  const source = createSourceGrid(8, 8);
  for (let y = 0; y < 8; y += 1) {
    for (let x = 0; x < 8; x += 1) {
      if ((x * 7 + y * 3) % 5 !== 0) setPixel(source, x, y, (x + y) % 2 ? BLACK : WHITE);
    }
  }
  const palette = getPalette('arcade-32');
  const technique = [createTechniqueInstance('ordered-dither', { radius: 2 })];
  const original = convertSource(source, palette, technique);
  const inverted = convertSource(invertPolarity(source), palette, technique);
  for (let p = 0; p < source.data.length; p += 1) {
    if (source.data[p] === TRANSPARENT) assert.equal(inverted.data[p], -1);
    else assert.equal(inverted.data[p], mirrorPaletteIndex(palette, original.data[p]));
  }
});

test('weighted-vote resolver counts technique winners instead of averaging soft probabilities', () => {
  const source = createSourceGrid(1, 1);
  setPixel(source, 0, 0, BLACK);
  const palette = getPalette('blue-red-4');
  const proposals = [
    { weight: 1, mask: Uint8Array.of(1), distributions: Float32Array.of(0.05, 0.85, 0.1, 0) },
    { weight: 1, mask: Uint8Array.of(1), distributions: Float32Array.of(0.1, 0.8, 0.1, 0) },
    { weight: 1, mask: Uint8Array.of(1), distributions: Float32Array.of(0, 0.05, 0.9, 0.05) }
  ];
  const result = resolveProposals(source, proposals, palette, { mode: 'weighted-vote' });
  assert.equal(result.data[0], 1);
  assert.ok(Math.abs(result.probabilities[1] - 2 / 3) < 1e-6);
  assert.ok(Math.abs(result.probabilities[2] - 1 / 3) < 1e-6);
});
