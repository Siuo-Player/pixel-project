import test from 'node:test';
import assert from 'node:assert/strict';
import { createSourceGrid, setPixel, BLACK, WHITE, TRANSPARENT } from '../../src/core/grid.js';
import { getPalette, createCustomPalette, mirrorPaletteIndex } from '../../src/engine/palettes.js';
import { createTechniqueInstance, runTechnique } from '../../src/engine/techniques.js';
import { resolveProposals } from '../../src/engine/resolver.js';
import { convertSource } from '../../src/engine/convert.js';
import { invertPolarity } from '../../src/core/transforms.js';

function sampleRatioGrid(whiteCount = 3) {
  const grid = createSourceGrid(3, 3);
  for (let i = 0; i < 9; i += 1) setPixel(grid, i % 3, Math.floor(i / 3), i < whiteCount ? WHITE : BLACK);
  return grid;
}

test('palette mirroring is an involution and returns valid palette indexes', () => {
  const palette = getPalette('blue-red-4');
  for (let i = 0; i < palette.colors.length; i += 1) {
    assert.equal(mirrorPaletteIndex(palette, mirrorPaletteIndex(palette, i)), i);
  }
});

test('custom palettes reject mismatched or non-reversed mirror mappings', () => {
  assert.throws(() => createCustomPalette('bad', ['#000000', '#ffffff'], [1]), TypeError);
  assert.throws(() => createCustomPalette('bad', ['#000000', '#ffffff'], [1, 1]), TypeError);
  assert.throws(() => createCustomPalette('bad', ['#000000', '#ffffff'], [0, 1]), TypeError);
});

test('weighted neighbourhood emits a full distribution for every opaque pixel', () => {
  const source = sampleRatioGrid(3);
  const palette = getPalette('blue-red-4');
  const instance = createTechniqueInstance('weighted-neighbourhood', { radius: 1 }, { weight: 1 });
  const proposal = runTechnique(source, palette, instance);
  const center = 4;
  const distribution = Array.from(proposal.distributions.slice(center * 4, center * 4 + 4));
  assert.deepEqual(distribution, [0, 1, 0, 0]);
  assert.equal(proposal.mask[center], 1);
});

test('transparent pixels are excluded from contextual averages and never receive a proposal', () => {
  const source = createSourceGrid(3, 3);
  setPixel(source, 0, 0, WHITE);
  setPixel(source, 1, 0, BLACK);
  setPixel(source, 1, 1, WHITE);
  const proposal = runTechnique(source, getPalette('blue-red-4'), createTechniqueInstance('weighted-neighbourhood'));
  assert.equal(proposal.mask[2], 0);
  assert.equal(proposal.mask[4], 1);
});

test('directional line technique reacts to long same-colour runs', () => {
  const line = createSourceGrid(5, 5);
  const scattered = createSourceGrid(5, 5);
  for (let x = 0; x < 5; x += 1) setPixel(line, x, 2, BLACK);
  for (const [x, y] of [[2, 2], [1, 1], [3, 1], [1, 3], [3, 3]]) setPixel(scattered, x, y, BLACK);
  const palette = getPalette('grayscale-4');
  const instance = createTechniqueInstance('directional-lines', { radius: 2, contrastBoost: 1.5 });
  const lineProposal = runTechnique(line, palette, instance);
  const scatteredProposal = runTechnique(scattered, palette, instance);
  const at = 12;
  assert.notDeepEqual(
    Array.from(lineProposal.distributions.slice(at * 4, at * 4 + 4)),
    Array.from(scatteredProposal.distributions.slice(at * 4, at * 4 + 4))
  );
});

test('every proposal distribution sums to one and contains no negative or non-finite values', () => {
  const source = sampleRatioGrid(4);
  for (const id of ['weighted-neighbourhood', 'directional-lines', 'local-entropy']) {
    const proposal = runTechnique(source, getPalette('blue-red-4'), createTechniqueInstance(id));
    for (let i = 0; i < source.data.length; i += 1) {
      if (!proposal.mask[i]) continue;
      const values = Array.from(proposal.distributions.slice(i * 4, i * 4 + 4));
      assert.ok(values.every(value => Number.isFinite(value) && value >= 0));
      assert.ok(Math.abs(values.reduce((sum, value) => sum + value, 0) - 1) < 1e-6);
    }
  }
});

test('weighted fusion combines complete colour distributions and instance weights', () => {
  const source = createSourceGrid(1, 1);
  setPixel(source, 0, 0, BLACK);
  const palette = getPalette('blue-red-4');
  const proposals = [
    { weight: 1, mask: Uint8Array.of(1), distributions: Float32Array.of(0, 0.45, 0.55, 0) },
    { weight: 1, mask: Uint8Array.of(1), distributions: Float32Array.of(0, 0.62, 0.38, 0) },
    { weight: 0.1, mask: Uint8Array.of(1), distributions: Float32Array.of(0, 0.08, 0.92, 0) }
  ];
  const result = resolveProposals(source, proposals, palette);
  assert.equal(result.data[0], 1);
  assert.ok(Math.abs(result.probabilities[1] - 0.5133333) < 1e-5);
  assert.ok(Math.abs(result.probabilities[2] - 0.4866667) < 1e-5);
});

test('resolver ignores abstentions, preserves transparent pixels and rejects invalid distributions', () => {
  const source = createSourceGrid(2, 1);
  setPixel(source, 0, 0, BLACK);
  const palette = getPalette('blue-red-4');
  const proposal = { weight: 1, mask: Uint8Array.of(0, 0), distributions: new Float32Array(8) };
  const result = resolveProposals(source, [proposal], palette);
  assert.equal(result.data[1], -1);
  assert.throws(() => resolveProposals(source, [{
    weight: 1, mask: Uint8Array.of(1, 0),
    distributions: Float32Array.of(1, 1, 0, 0, 0, 0, 0, 0)
  }], palette), RangeError);
});

test('contextual conversion reflects palette roles after black-white inversion', () => {
  const source = sampleRatioGrid(3);
  const palette = getPalette('blue-red-4');
  const config = [
    createTechniqueInstance('weighted-neighbourhood', { radius: 1, includeCenter: true }, { weight: 1 }),
    createTechniqueInstance('directional-lines', { radius: 2, contrastBoost: 0.4 }, { weight: 0.7 })
  ];
  const original = convertSource(source, palette, config);
  const inverted = convertSource(invertPolarity(source), palette, config);
  for (let i = 0; i < source.data.length; i += 1) {
    if (source.data[i] === TRANSPARENT) assert.equal(inverted.data[i], -1);
    else assert.equal(inverted.data[i], mirrorPaletteIndex(palette, original.data[i]));
  }
});

test('three white and six black pixels map to one side of the ramp, and inversion maps to the opposite side', () => {
  const palette = getPalette('blue-red-4');
  const technique = [createTechniqueInstance('weighted-neighbourhood', { radius: 1, includeCenter: true })];
  const first = convertSource(sampleRatioGrid(3), palette, technique);
  const second = convertSource(sampleRatioGrid(6), palette, technique);
  assert.equal(first.data[4], 1);
  assert.equal(second.data[4], 2);
  assert.equal(second.data[4], mirrorPaletteIndex(palette, first.data[4]));
});

test('same technique can be instantiated twice with different kernels and produce different evidence', () => {
  const source = createSourceGrid(5, 5);
  for (const [x, y] of [[2, 2], [2, 1], [2, 3], [1, 2], [3, 2], [0, 0], [4, 0], [0, 4], [4, 4]]) setPixel(source, x, y, WHITE);
  for (const [x, y] of [[1, 1], [3, 1], [1, 3], [3, 3], [2, 0], [0, 2], [4, 2], [2, 4]]) setPixel(source, x, y, BLACK);
  const palette = getPalette('blue-red-4');
  const tight = runTechnique(source, palette, createTechniqueInstance('weighted-neighbourhood', { radius: 1 }));
  const broad = runTechnique(source, palette, createTechniqueInstance('weighted-neighbourhood', { radius: 2 }));
  assert.notDeepEqual(
    Array.from(tight.distributions.slice(12 * 4, 12 * 4 + 4)),
    Array.from(broad.distributions.slice(12 * 4, 12 * 4 + 4))
  );
});

test('highest-confidence resolver selects the strongest individual proposal', () => {
  const source = createSourceGrid(1, 1);
  setPixel(source, 0, 0, BLACK);
  const palette = getPalette('blue-red-4');
  const proposals = [
    { weight: 1, mask: Uint8Array.of(1), distributions: Float32Array.of(0, 0.6, 0.4, 0) },
    { weight: 1, mask: Uint8Array.of(1), distributions: Float32Array.of(0, 0.1, 0.9, 0) }
  ];
  const result = resolveProposals(source, proposals, palette, { mode: 'highest-confidence' });
  assert.equal(result.data[0], 2);
  assert.ok(Math.abs(result.probabilities[2] - 0.9) < 1e-6);
});

test('tie-breaking is complementary when the source pixel polarity is inverted', () => {
  const source = createSourceGrid(1, 1);
  setPixel(source, 0, 0, BLACK);
  const palette = getPalette('blue-red-4');
  const proposal = { weight: 1, mask: Uint8Array.of(1), distributions: Float32Array.of(0, 0.5, 0.5, 0) };
  const first = resolveProposals(source, [proposal], palette);
  const second = resolveProposals(createSourceGrid(1, 1, [WHITE]), [proposal], palette);
  assert.equal(second.data[0], mirrorPaletteIndex(palette, first.data[0]));
});
