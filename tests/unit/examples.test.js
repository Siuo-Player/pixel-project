import assert from 'node:assert/strict';
import test from 'node:test';
import { BUILTIN_EXAMPLES, getExampleMetadata, loadExampleProject } from '../../src/core/examples.js';
import { convertProject } from '../../src/engine/convert.js';

test('BUILTIN_EXAMPLES contains the 4 curated pixel art examples', () => {
  assert.equal(BUILTIN_EXAMPLES.length, 4);
  const ids = BUILTIN_EXAMPLES.map(ex => ex.id);
  assert.deepEqual(ids, ['lighthouse-at-dusk', 'moonlit-cat', 'mushroom-grove', 'desert-temple']);
});

test('getExampleMetadata provides display information for the UI', () => {
  const meta = getExampleMetadata();
  assert.equal(meta.length, 4);
  for (const item of meta) {
    assert.ok(item.id, 'Example has id');
    assert.ok(item.name, 'Example has name');
    assert.ok(item.dimensions, 'Example has dimensions string');
    assert.ok(item.description, 'Example has description');
  }
});

test('every bundled pixel-art example imports with three independent and convertible interpretations', () => {
  for (const item of BUILTIN_EXAMPLES) {
    const project = loadExampleProject(item.id);
    assert.ok(project, `Loaded example: ${item.id}`);
    assert.ok(project.source.width > 0);
    assert.ok(project.source.height > 0);
    assert.equal(project.outputs.length, 3, 'Every example has 3 interpretations');

    for (const output of project.outputs) {
      const result = convertProject(project, output.id);
      const width = output.followsSourceSize ? project.source.width : (output.width ?? project.source.width);
      const height = output.followsSourceSize ? project.source.height : (output.height ?? project.source.height);
      const colorCount = output.palette.colors?.length ?? output.palette.length;
      assert.equal(result.data.length, width * height);
      assert.ok(result.data.every(pixel => pixel === -1 || (pixel >= 0 && pixel < colorCount)));
    }
  }
});
