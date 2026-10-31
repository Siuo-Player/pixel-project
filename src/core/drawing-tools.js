import { setPixel, getPixel, TRANSPARENT, BLACK, WHITE } from './grid.js';

function assertState(state) {
  if (![TRANSPARENT, BLACK, WHITE].includes(state)) throw new TypeError('Invalid drawing state.');
}

function assertPoint(grid, x, y) {
  if (!Number.isInteger(x) || !Number.isInteger(y) || x < 0 || y < 0 || x >= grid.width || y >= grid.height) {
    throw new RangeError('Drawing coordinates must be inside the grid.');
  }
}

export function drawRectangle(grid, x0, y0, x1, y1, state, { filled = false } = {}) {
  assertState(state);
  assertPoint(grid, x0, y0);
  assertPoint(grid, x1, y1);
  const left = Math.min(x0, x1);
  const right = Math.max(x0, x1);
  const top = Math.min(y0, y1);
  const bottom = Math.max(y0, y1);
  for (let y = top; y <= bottom; y += 1) {
    for (let x = left; x <= right; x += 1) {
      if (filled || x === left || x === right || y === top || y === bottom) setPixel(grid, x, y, state);
    }
  }
  return grid;
}

export function drawEllipse(grid, x0, y0, x1, y1, state, { filled = false } = {}) {
  assertState(state);
  assertPoint(grid, x0, y0);
  assertPoint(grid, x1, y1);
  const left = Math.min(x0, x1);
  const right = Math.max(x0, x1);
  const top = Math.min(y0, y1);
  const bottom = Math.max(y0, y1);
  const cx = (left + right) / 2;
  const cy = (top + bottom) / 2;
  const rx = Math.max(0.5, (right - left + 1) / 2);
  const ry = Math.max(0.5, (bottom - top + 1) / 2);
  const inside = (x, y) => {
    const dx = (x - cx) / rx;
    const dy = (y - cy) / ry;
    return dx * dx + dy * dy <= 1;
  };
  for (let y = top; y <= bottom; y += 1) {
    for (let x = left; x <= right; x += 1) {
      if (!inside(x, y)) continue;
      const edge = !inside(x - 1, y) || !inside(x + 1, y)
        || !inside(x, y - 1) || !inside(x, y + 1);
      if (filled || edge) setPixel(grid, x, y, state);
    }
  }
  return grid;
}

export function floodFill(grid, startX, startY, state) {
  assertState(state);
  assertPoint(grid, startX, startY);
  const target = getPixel(grid, startX, startY);
  if (target === state) return 0;
  const stack = [startY * grid.width + startX];
  let changed = 0;
  while (stack.length) {
    const index = stack.pop();
    if (grid.data[index] !== target) continue;
    grid.data[index] = state;
    changed += 1;
    const x = index % grid.width;
    const y = Math.floor(index / grid.width);
    if (x > 0 && grid.data[index - 1] === target) stack.push(index - 1);
    if (x + 1 < grid.width && grid.data[index + 1] === target) stack.push(index + 1);
    if (y > 0 && grid.data[index - grid.width] === target) stack.push(index - grid.width);
    if (y + 1 < grid.height && grid.data[index + grid.width] === target) stack.push(index + grid.width);
  }
  return changed;
}
