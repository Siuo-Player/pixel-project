import test from 'node:test';
import assert from 'node:assert/strict';
import { createProject, serializeProject, parseProject } from '../../src/core/project.js';
import { getPalette } from '../../src/engine/palettes.js';
import { createTechniqueInstance } from '../../src/engine/techniques.js';
import { convertProject } from '../../src/engine/convert.js';
import { setPixel, BLACK, WHITE, TRANSPARENT } from '../../src/core/grid.js';
import { rotateGrid, invertPolarity } from '../../src/core/transforms.js';

test('project round-trip preserves source, palette and independent technique instances', () => {
  const palette = getPalette('blue-red-4');
  const project = createProject(4, 3, palette, [
    createTechniqueInstance('weighted-neighbourhood', { radius: 1 }, { weight: 1 }),
    createTechniqueInstance('weighted-neighbourhood', { radius: 2 }, { weight: 0.5 })
  ]);
  setPixel(project.source, 1, 1, BLACK);
  setPixel(project.source, 2, 1, WHITE);
  const restored = parseProject(serializeProject(project));
  assert.equal(restored.source.width, 4);
  assert.deepEqual(Array.from(restored.source.data), Array.from(project.source.data));
  assert.equal(restored.outputs[0].techniques.length, 2);
  assert.notEqual(restored.outputs[0].techniques[0].id, restored.outputs[0].techniques[1].id);
  assert.equal(restored.outputs[0].techniques[0].params.radius, 1);
  assert.equal(restored.outputs[0].techniques[1].params.radius, 2);
});

test('project pipeline converts source and remains complementary after polarity inversion', () => {
  const project = createProject(5, 5, getPalette('blue-red-4'), [
    createTechniqueInstance('weighted-neighbourhood', { radius: 2 }),
    createTechniqueInstance('directional-lines', { radius: 2 }, { weight: 0.6 })
  ]);
  for (let y = 0; y < 5; y += 1) {
    for (let x = 0; x < 5; x += 1) {
      if ((x + y) % 3 === 0) setPixel(project.source, x, y, WHITE);
      else if ((x * 2 + y) % 2 === 0) setPixel(project.source, x, y, BLACK);
    }
  }
  const first = convertProject(project);
  const second = convertProject({ ...project, source: invertPolarity(project.source) });
  assert.equal(first.width, 5);
  assert.equal(first.height, 5);
  for (let i = 0; i < first.data.length; i += 1) {
    if (project.source.data[i] === TRANSPARENT) assert.equal(second.data[i], -1);
    else assert.equal(second.data[i], project.palette.mirror[first.data[i]]);
  }
});

test('rotating the source matrix changes dimensions and project conversion follows it', () => {
  const project = createProject(3, 2, getPalette('grayscale-4'));
  setPixel(project.source, 0, 0, BLACK);
  setPixel(project.source, 2, 1, WHITE);
  project.source = rotateGrid(project.source, 90);
  const converted = convertProject(project);
  assert.equal(converted.width, 2);
  assert.equal(converted.height, 3);
  assert.equal(converted.data.length, 6);
});

test('project export/import preserves the selected resolver strategy', () => {
  const project = createProject(4, 4, getPalette('grayscale-4'));
  project.outputs[0].resolverMode = 'highest-confidence';
  const restored = parseProject(serializeProject(project));
  assert.equal(restored.outputs[0].resolverMode, 'highest-confidence');
});

test('project import rejects unsupported versions and invalid source states', () => {
  const project = createProject(4, 4, getPalette('grayscale-4'));
  const parsed = JSON.parse(serializeProject(project));
  assert.throws(() => parseProject({ ...parsed, version: 999 }), RangeError);
  const invalidPixels = [...parsed.source.data];
  invalidPixels[0] = 3;
  assert.throws(() => parseProject({ ...parsed, source: { ...parsed.source, data: invalidPixels } }), TypeError);
});
