export const TRANSPARENT = 0;
export const BLACK = 1;
export const WHITE = 2;

function assertDimensions(width, height) {
  if (!Number.isInteger(width) || !Number.isInteger(height) || width < 1 || height < 1) {
    throw new RangeError('Grid dimensions must be positive integers.');
  }
  if (width * height > 1_000_000) throw new RangeError('Grid is too large (maximum: 1,000,000 pixels).');
}

export function createSourceGrid(width, height, data = null) {
  assertDimensions(width, height);
  const pixels = data === null ? new Uint8Array(width * height) : new Uint8Array(data);
  if (pixels.length !== width * height) throw new RangeError('Pixel buffer length does not match grid dimensions.');
  for (const value of pixels) {
    if (![TRANSPARENT, BLACK, WHITE].includes(value)) throw new TypeError(`Invalid source pixel state: ${value}`);
  }
  return { width, height, data: pixels };
}

function indexOf(grid, x, y) {
  if (!Number.isInteger(x) || !Number.isInteger(y) || x < 0 || y < 0 || x >= grid.width || y >= grid.height) {
    throw new RangeError(`Pixel coordinate (${x}, ${y}) is outside the grid.`);
  }
  return y * grid.width + x;
}

export function getPixel(grid, x, y) {
  return grid.data[indexOf(grid, x, y)];
}

export function setPixel(grid, x, y, state) {
  if (![TRANSPARENT, BLACK, WHITE].includes(state)) throw new TypeError(`Invalid source pixel state: ${state}`);
  grid.data[indexOf(grid, x, y)] = state;
  return grid;
}

export function paintLine(grid, x0, y0, x1, y1, state) {
  if (![TRANSPARENT, BLACK, WHITE].includes(state)) throw new TypeError(`Invalid source pixel state: ${state}`);
  indexOf(grid, x0, y0);
  indexOf(grid, x1, y1);
  let x = x0;
  let y = y0;
  const dx = Math.abs(x1 - x0);
  const sx = x0 < x1 ? 1 : -1;
  const dy = -Math.abs(y1 - y0);
  const sy = y0 < y1 ? 1 : -1;
  let error = dx + dy;
  while (true) {
    setPixel(grid, x, y, state);
    if (x === x1 && y === y1) break;
    const doubled = 2 * error;
    if (doubled >= dy) { error += dy; x += sx; }
    if (doubled <= dx) { error += dx; y += sy; }
  }
  return grid;
}

export function cloneGrid(grid) {
  return createSourceGrid(grid.width, grid.height, grid.data);
}
