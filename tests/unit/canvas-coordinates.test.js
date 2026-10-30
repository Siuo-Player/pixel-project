import test from 'node:test';
import assert from 'node:assert/strict';
import { getCanvasGeometry, pointerToGrid } from '../../src/ui/canvas-coordinates.js';

test('canvas geometry preserves the grid aspect ratio', () => {
  const geometry = getCanvasGeometry(800, 400, { width: 32, height: 16 }, { zoom: 1, panX: 0, panY: 0 });
  assert.equal(geometry.width / geometry.height, 2);
  assert.equal(geometry.scale, 25);
});

test('pointer coordinates map to the correct pixel after centering, zoom and pan', () => {
  const grid = { width: 10, height: 5 };
  const rect = { left: 100, top: 50, width: 500, height: 400 };
  const camera = { zoom: 2, panX: 13, panY: -7 };
  const geometry = getCanvasGeometry(rect.width, rect.height, grid, camera);
  const cell = pointerToGrid(100 + geometry.x + 4 * geometry.scale + geometry.scale / 2, 50 + geometry.y + 2 * geometry.scale + geometry.scale / 2, rect, grid, camera);
  assert.deepEqual(cell, { x: 4, y: 2 });
});

test('pointer positions outside the artwork are ignored', () => {
  const rect = { left: 0, top: 0, width: 200, height: 200 };
  assert.equal(pointerToGrid(-1, 0, rect, { width: 10, height: 10 }, { zoom: 1, panX: 0, panY: 0 }), null);
});

test('invalid canvas geometry is rejected instead of producing invalid pixel indexes', () => {
  assert.throws(() => getCanvasGeometry(0, 100, { width: 10, height: 10 }), RangeError);
});
