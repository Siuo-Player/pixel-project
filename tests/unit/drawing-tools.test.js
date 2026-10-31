import test from 'node:test';
import assert from 'node:assert/strict';
import { createSourceGrid, getPixel, BLACK, WHITE, TRANSPARENT } from '../../src/core/grid.js';
import { drawRectangle, drawEllipse, floodFill } from '../../src/core/drawing-tools.js';

test('rectangle outline paints only the four edges', () => {
  const grid = createSourceGrid(5, 5);
  drawRectangle(grid, 1, 1, 3, 3, BLACK);
  assert.equal(getPixel(grid, 1, 1), BLACK);
  assert.equal(getPixel(grid, 2, 1), BLACK);
  assert.equal(getPixel(grid, 3, 3), BLACK);
  assert.equal(getPixel(grid, 2, 2), TRANSPARENT);
});

test('filled rectangle includes its complete normalized bounds', () => {
  const grid = createSourceGrid(5, 4);
  drawRectangle(grid, 3, 2, 1, 1, WHITE, { filled: true });
  assert.deepEqual(Array.from(grid.data), [
    0,0,0,0,0,
    0,2,2,2,0,
    0,2,2,2,0,
    0,0,0,0,0
  ]);
});

test('ellipse outline is symmetric and does not fill its interior', () => {
  const grid = createSourceGrid(7, 7);
  drawEllipse(grid, 1, 1, 5, 5, BLACK);
  assert.equal(getPixel(grid, 3, 1), BLACK);
  assert.equal(getPixel(grid, 3, 5), BLACK);
  assert.equal(getPixel(grid, 1, 3), BLACK);
  assert.equal(getPixel(grid, 5, 3), BLACK);
  assert.equal(getPixel(grid, 3, 3), TRANSPARENT);
});

test('flood fill changes only the connected region and returns its pixel count', () => {
  const grid = createSourceGrid(4, 3);
  grid.data.set([0,0,2,2, 0,2,2,2, 0,0,0,2]);
  const changed = floodFill(grid, 0, 0, BLACK);
  assert.equal(changed, 6);
  assert.equal(getPixel(grid, 0, 0), BLACK);
  assert.equal(getPixel(grid, 1, 0), BLACK);
  assert.equal(getPixel(grid, 2, 0), WHITE);
  assert.equal(getPixel(grid, 3, 2), WHITE);
});

test('flood fill is a no-op when the target already has the selected state', () => {
  const grid = createSourceGrid(2, 2);
  assert.equal(floodFill(grid, 0, 0, TRANSPARENT), 0);
  assert.ok(grid.data.every(value => value === TRANSPARENT));
});

test('filled ellipse colors its interior but leaves the exterior untouched', () => {
  const grid = createSourceGrid(7, 7);
  drawEllipse(grid, 1, 1, 5, 5, WHITE, { filled: true });
  assert.equal(getPixel(grid, 3, 3), WHITE);
  assert.equal(getPixel(grid, 3, 1), WHITE);
  assert.equal(getPixel(grid, 1, 1), TRANSPARENT);
  assert.equal(getPixel(grid, 0, 0), TRANSPARENT);
});
