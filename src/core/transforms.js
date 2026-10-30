import { createSourceGrid, TRANSPARENT, BLACK, WHITE } from './grid.js';

export function flipHorizontal(grid) {
  const result = createSourceGrid(grid.width, grid.height);
  for (let y = 0; y < grid.height; y += 1) {
    for (let x = 0; x < grid.width; x += 1) {
      result.data[y * grid.width + (grid.width - 1 - x)] = grid.data[y * grid.width + x];
    }
  }
  return result;
}

export function flipVertical(grid) {
  const result = createSourceGrid(grid.width, grid.height);
  for (let y = 0; y < grid.height; y += 1) {
    for (let x = 0; x < grid.width; x += 1) {
      result.data[(grid.height - 1 - y) * grid.width + x] = grid.data[y * grid.width + x];
    }
  }
  return result;
}

export function rotateGrid(grid, degrees) {
  const normalized = ((degrees % 360) + 360) % 360;
  if (![0, 90, 180, 270].includes(normalized)) throw new RangeError('Rotation must be 0, 90, 180 or 270 degrees.');
  if (normalized === 0) return createSourceGrid(grid.width, grid.height, grid.data);
  const swapsAxes = normalized === 90 || normalized === 270;
  const width = swapsAxes ? grid.height : grid.width;
  const height = swapsAxes ? grid.width : grid.height;
  const result = createSourceGrid(width, height);
  for (let y = 0; y < grid.height; y += 1) {
    for (let x = 0; x < grid.width; x += 1) {
      let nx;
      let ny;
      if (normalized === 90) { nx = grid.height - 1 - y; ny = x; }
      else if (normalized === 180) { nx = grid.width - 1 - x; ny = grid.height - 1 - y; }
      else { nx = y; ny = grid.width - 1 - x; }
      result.data[ny * width + nx] = grid.data[y * grid.width + x];
    }
  }
  return result;
}

export function invertPolarity(grid) {
  const data = new Uint8Array(grid.data.length);
  for (let i = 0; i < grid.data.length; i += 1) {
    const value = grid.data[i];
    data[i] = value === BLACK ? WHITE : value === WHITE ? BLACK : TRANSPARENT;
  }
  return createSourceGrid(grid.width, grid.height, data);
}
