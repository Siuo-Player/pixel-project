/** Calculate a contain-fit transform shared by the source and converted canvases. */
export function getCanvasGeometry(viewportWidth, viewportHeight, grid, camera = { zoom: 1, panX: 0, panY: 0 }) {
  if (!(viewportWidth > 0) || !(viewportHeight > 0) || !(grid?.width > 0) || !(grid?.height > 0)) {
    throw new RangeError('Canvas and grid dimensions must be positive.');
  }
  const zoom = Number.isFinite(camera.zoom) && camera.zoom > 0 ? camera.zoom : 1;
  const fit = Math.min(viewportWidth / grid.width, viewportHeight / grid.height);
  const scale = fit * zoom;
  const width = grid.width * scale;
  const height = grid.height * scale;
  return {
    scale,
    x: (viewportWidth - width) / 2 + (camera.panX ?? 0),
    y: (viewportHeight - height) / 2 + (camera.panY ?? 0),
    width,
    height
  };
}

/** Map a pointer position to a logical pixel, or null when outside the artwork. */
export function pointerToGrid(clientX, clientY, rect, grid, camera) {
  const geometry = getCanvasGeometry(rect.width, rect.height, grid, camera);
  const x = Math.floor((clientX - rect.left - geometry.x) / geometry.scale);
  const y = Math.floor((clientY - rect.top - geometry.y) / geometry.scale);
  if (x < 0 || y < 0 || x >= grid.width || y >= grid.height) return null;
  return { x, y };
}
