import test from 'node:test';
import assert from 'node:assert/strict';
import { createSourceGrid, setPixel, paintLine, getPixel, TRANSPARENT, BLACK, WHITE } from '../../src/core/grid.js';

test('new source grids are transparent and keep dimensions', () => {
  const grid = createSourceGrid(4, 3);
  assert.equal(grid.width, 4);
  assert.equal(grid.height, 3);
  assert.equal(grid.data.length, 12);
  assert.ok(grid.data.every(value => value === TRANSPARENT));
});

test('painting changes only the addressed pixel', () => {
  const grid = createSourceGrid(3, 2);
  setPixel(grid, 2, 1, WHITE);
  assert.equal(getPixel(grid, 2, 1), WHITE);
  assert.equal(getPixel(grid, 1, 1), TRANSPARENT);
});

test('painting rejects invalid coordinates and invalid states', () => {
  const grid = createSourceGrid(2, 2);
  assert.throws(() => setPixel(grid, -1, 0, BLACK), RangeError);
  assert.throws(() => setPixel(grid, 0, 2, BLACK), RangeError);
  assert.throws(() => setPixel(grid, 0, 0, 3), TypeError);
});

test('line painting fills every pixel between pointer samples', () => {
  const grid = createSourceGrid(6, 3);
  paintLine(grid, 0, 1, 5, 1, BLACK);
  assert.deepEqual(Array.from(grid.data.slice(6, 12)), [BLACK, BLACK, BLACK, BLACK, BLACK, BLACK]);
});
