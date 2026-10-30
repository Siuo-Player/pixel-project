import test from 'node:test';
import assert from 'node:assert/strict';
import { createSourceGrid, setPixel, BLACK, WHITE, TRANSPARENT } from '../../src/core/grid.js';
import { flipHorizontal, flipVertical, rotateGrid, invertPolarity } from '../../src/core/transforms.js';

function sampleGrid() {
  const grid = createSourceGrid(3, 2);
  setPixel(grid, 0, 0, BLACK);
  setPixel(grid, 2, 0, WHITE);
  setPixel(grid, 1, 1, WHITE);
  return grid;
}

test('horizontal and vertical flips move pixels without changing values', () => {
  const grid = sampleGrid();
  const horizontal = flipHorizontal(grid);
  assert.deepEqual(Array.from(horizontal.data), [WHITE, TRANSPARENT, BLACK, TRANSPARENT, WHITE, TRANSPARENT]);
  const vertical = flipVertical(grid);
  assert.deepEqual(Array.from(vertical.data), [TRANSPARENT, WHITE, TRANSPARENT, BLACK, TRANSPARENT, WHITE]);
});

test('rotations preserve pixels and update dimensions for non-square grids', () => {
  const grid = sampleGrid();
  const clockwise = rotateGrid(grid, 90);
  assert.equal(clockwise.width, 2);
  assert.equal(clockwise.height, 3);
  assert.deepEqual(Array.from(clockwise.data), [TRANSPARENT, BLACK, WHITE, TRANSPARENT, TRANSPARENT, WHITE]);
  const halfTurn = rotateGrid(grid, 180);
  assert.equal(halfTurn.width, 3);
  assert.equal(halfTurn.height, 2);
  assert.deepEqual(Array.from(halfTurn.data), [TRANSPARENT, WHITE, TRANSPARENT, WHITE, TRANSPARENT, BLACK]);
  const counterClockwise = rotateGrid(grid, 270);
  assert.deepEqual(Array.from(counterClockwise.data), [WHITE, TRANSPARENT, TRANSPARENT, WHITE, BLACK, TRANSPARENT]);
});

test('two horizontal flips and four quarter turns restore the original grid', () => {
  const grid = sampleGrid();
  assert.deepEqual(flipHorizontal(flipHorizontal(grid)).data, grid.data);
  assert.deepEqual(rotateGrid(rotateGrid(rotateGrid(rotateGrid(grid, 90), 90), 90), 90).data, grid.data);
});

test('polarity inversion swaps black and white but preserves transparency', () => {
  const grid = sampleGrid();
  const inverted = invertPolarity(grid);
  assert.deepEqual(Array.from(inverted.data), [WHITE, TRANSPARENT, BLACK, TRANSPARENT, BLACK, TRANSPARENT]);
  assert.deepEqual(invertPolarity(inverted).data, grid.data);
});
