import { createSourceGrid } from './grid.js';

export function resizeGridNearestNeighbor(source, width, height) {
  if (!source || !(source.data instanceof Uint8Array) || source.data.length !== source.width * source.height) {
    throw new TypeError('A valid source grid is required.');
  }
  if (!Number.isInteger(width) || !Number.isInteger(height) || width < 1 || height < 1 || width > 256 || height > 256 || width * height > 65_536) {
    throw new RangeError('Grid dimensions must be positive integers up to 256 pixels, with at most 65,536 pixels total.');
  }
  if (width === source.width && height === source.height) return createSourceGrid(width, height, source.data);
  const data = new Uint8Array(width * height);
  for (let y = 0; y < height; y += 1) {
    const sourceY = Math.min(source.height - 1, Math.floor((y + 0.5) * source.height / height));
    for (let x = 0; x < width; x += 1) {
      const sourceX = Math.min(source.width - 1, Math.floor((x + 0.5) * source.width / width));
      data[y * width + x] = source.data[sourceY * source.width + sourceX];
    }
  }
  return createSourceGrid(width, height, data);
}
