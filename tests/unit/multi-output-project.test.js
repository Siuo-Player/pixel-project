import test from 'node:test';
import assert from 'node:assert/strict';
import { createProject, addOutput, removeOutput, serializeProject, parseProject } from '../../src/core/project.js';
import { getPalette } from '../../src/engine/palettes.js';
import { createTechniqueInstance } from '../../src/engine/techniques.js';

test('a project supports up to three independent outputs with their own palettes, resolutions and techniques', () => {
  const project = createProject(32, 24, getPalette('retro-8'), []);
  assert.equal(project.outputs.length, 1);
  assert.deepEqual([project.outputs[0].width, project.outputs[0].height], [32, 24]);
  assert.equal(project.outputs[0].followsSourceSize, true);
  const second = addOutput(project, {
    name: 'Interpretação 2',
    width: 16,
    height: 12,
    palette: getPalette('magma-12'),
    techniques: [createTechniqueInstance('ordered-dither')]
  });
  const third = addOutput(project, {
    name: 'Interpretação 3',
    width: 48,
    height: 36,
    palette: getPalette('spectrum-32'),
    techniques: [createTechniqueInstance('edge-aware')]
  });
  assert.equal(project.outputs.length, 3);
  assert.deepEqual([second.width, second.height], [16, 12]);
  assert.equal(second.followsSourceSize, false);
  assert.equal(second.palette.id, 'magma-12');
  assert.equal(second.techniques[0].techniqueId, 'ordered-dither');
  assert.equal(third.palette.id, 'spectrum-32');
  assert.throws(() => addOutput(project), RangeError);
});

test('multi-output projects round-trip and removing an output never removes the last one', () => {
  const project = createProject(20, 18, getPalette('blue-red-4'), []);
  const second = addOutput(project, { palette: getPalette('oceanic-32'), width: 10, height: 9 });
  const restored = parseProject(serializeProject(project));
  assert.equal(restored.outputs.length, 2);
  assert.equal(restored.outputs[1].palette.id, 'oceanic-32');
  assert.deepEqual([restored.outputs[1].width, restored.outputs[1].height], [10, 9]);
  removeOutput(restored, second.id);
  assert.equal(restored.outputs.length, 1);
  assert.throws(() => removeOutput(restored, restored.outputs[0].id), RangeError);
});

test('version 1 project files remain importable and receive output dimensions', () => {
  const palette = getPalette('blue-red-4');
  const legacy = {
    version: 1,
    id: 'legacy',
    name: 'Legacy',
    source: { width: 4, height: 4, data: Array(16).fill(0) },
    palette,
    outputs: [{ id: 'old-output', name: 'Old output', palette, resolverMode: 'weighted-average', techniques: [] }]
  };
  const imported = parseProject(legacy);
  assert.deepEqual([imported.outputs[0].width, imported.outputs[0].height], [4, 4]);
});


test('source-following outputs resize with source transforms while custom outputs remain independent', () => {
  const project = createProject(8, 6, getPalette('retro-8'), []);
  const fixed = addOutput(project, { width: 12, height: 10, palette: getPalette('magma-12') });
  project.source = { ...project.source, width: 6, height: 8, data: new Uint8Array(48) };
  const { convertProject } = await import('../../src/engine/convert.js');
  const following = convertProject(project, project.outputs[0].id);
  const independent = convertProject(project, fixed.id);
  assert.deepEqual([following.width, following.height], [6, 8]);
  assert.deepEqual([independent.width, independent.height], [12, 10]);
});
