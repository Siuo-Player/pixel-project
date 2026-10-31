import test from 'node:test';
import assert from 'node:assert/strict';
import { createSourceGrid, BLACK, WHITE, TRANSPARENT, setPixel } from '../../src/core/grid.js';
import { resizeGridNearestNeighbor } from '../../src/core/resample.js';

test('nearest-neighbour grid resize changes dimensions and preserves source states', () => {
  const source = createSourceGrid(2, 2);
  setPixel(source, 0, 0, BLACK);
  setPixel(source, 1, 0, WHITE);
  setPixel(source, 0, 1, TRANSPARENT);
  setPixel(source, 1, 1, BLACK);
  const resized = resizeGridNearestNeighbor(source, 4, 4);
  assert.deepEqual([resized.width, resized.height], [4, 4]);
  assert.deepEqual([...resized.data], [
    BLACK, BLACK, WHITE, WHITE,
    BLACK, BLACK, WHITE, WHITE,
    TRANSPARENT, TRANSPARENT, BLACK, BLACK,
    TRANSPARENT, TRANSPARENT, BLACK, BLACK
  ]);
});

test('nearest-neighbour resize rejects invalid dimensions and is safe for identity size', () => {
  const source = createSourceGrid(3, 2);
  assert.throws(() => resizeGridNearestNeighbor(source, 0, 2), RangeError);
  const copy = resizeGridNearestNeighbor(source, 3, 2);
  assert.notEqual(copy.data, source.data);
  assert.deepEqual([...copy.data], [...source.data]);
});
