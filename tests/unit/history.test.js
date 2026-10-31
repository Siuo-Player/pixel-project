import test from 'node:test';
import assert from 'node:assert/strict';
import { createSourceGrid, setPixel, getPixel, BLACK, WHITE, TRANSPARENT } from '../../src/core/grid.js';
import { createHistory, recordHistory, undoGrid, redoGrid } from '../../src/core/history.js';

test('undo restores a snapshot and redo restores the later state', () => {
  const grid = createSourceGrid(3, 2);
  const history = createHistory();
  setPixel(grid, 0, 0, BLACK);
  recordHistory(history, grid);
  setPixel(grid, 1, 0, WHITE);
  const undone = undoGrid(history, grid);
  assert.equal(getPixel(undone, 0, 0), BLACK);
  assert.equal(getPixel(undone, 1, 0), TRANSPARENT);
  const redone = redoGrid(history, undone);
  assert.equal(getPixel(redone, 1, 0), WHITE);
});

test('a new history entry invalidates redo and stored snapshots are independent', () => {
  const grid = createSourceGrid(2, 2);
  const history = createHistory();
  recordHistory(history, grid);
  setPixel(grid, 0, 0, BLACK);
  const undone = undoGrid(history, grid);
  recordHistory(history, undone);
  setPixel(undone, 1, 1, WHITE);
  assert.equal(redoGrid(history, undone), null);
});

test('history obeys its configured limit', () => {
  const grid = createSourceGrid(1, 1);
  const history = createHistory(2);
  for (let value = 0; value < 4; value += 1) {
    recordHistory(history, grid);
    setPixel(grid, 0, 0, value % 2 ? BLACK : WHITE);
  }
  assert.equal(history.undo.length, 2);
});
