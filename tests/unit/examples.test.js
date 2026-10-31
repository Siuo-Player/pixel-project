import test from 'node:test';
import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseProject } from '../../src/core/project.js';
import { convertProject } from '../../src/engine/convert.js';

const examplesDirectory = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../examples');

test('every bundled pixel-art example imports with three independent and convertible interpretations', async () => {
  const files = (await readdir(examplesDirectory)).filter(name => name.endsWith('.pixelproj'));
  assert.ok(files.length >= 4, 'at least four importable examples should be bundled');

  for (const file of files) {
    const serialized = await readFile(path.join(examplesDirectory, file), 'utf8');
    const project = parseProject(serialized);
    assert.equal(project.outputs.length, 3, file);
    assert.ok(project.source.data.some(value => value === 1 || value === 2), file);

    for (const output of project.outputs) {
      const result = convertProject(project, output.id);
      assert.deepEqual([result.width, result.height], [output.width, output.height], file + ' / ' + output.name);
      assert.ok(result.data.every(value => value === -1 || (value >= 0 && value < output.palette.colors.length)), file + ' / ' + output.name);
    }
  }
});
