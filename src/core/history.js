import { cloneGrid } from './grid.js';

export function createHistory(limit = 50) {
  if (!Number.isInteger(limit) || limit < 1) throw new RangeError('History limit must be a positive integer.');
  return { limit, undo: [], redo: [] };
}

export function recordHistory(history, grid) {
  history.undo.push(cloneGrid(grid));
  if (history.undo.length > history.limit) history.undo.shift();
  history.redo.length = 0;
}

export function undoGrid(history, currentGrid) {
  if (!history.undo.length) return null;
  history.redo.push(cloneGrid(currentGrid));
  return history.undo.pop();
}

export function redoGrid(history, currentGrid) {
  if (!history.redo.length) return null;
  history.undo.push(cloneGrid(currentGrid));
  if (history.undo.length > history.limit) history.undo.shift();
  return history.redo.pop();
}
