const BUILT_IN = {
  'blue-red-4': {
    id: 'blue-red-4', name: 'Blue ↔ Red',
    colors: ['#253B64', '#318CC4', '#D94E55', '#742A3D'], mirror: [3, 2, 1, 0]
  },
  'grayscale-4': {
    id: 'grayscale-4', name: 'Grayscale 4',
    colors: ['#171717', '#555555', '#AAAAAA', '#F4F4F4'], mirror: [3, 2, 1, 0]
  },
  'retro-8': {
    id: 'retro-8', name: 'Retro 8',
    colors: ['#20234A', '#384F8B', '#347E9B', '#5BAA86', '#C4C66B', '#E6A653', '#D66A52', '#873D56'],
    mirror: [7, 6, 5, 4, 3, 2, 1, 0]
  },
  'forest-4': {
    id: 'forest-4', name: 'Forest',
    colors: ['#1D3C35', '#4F8061', '#B6B65D', '#E8D69C'], mirror: [3, 2, 1, 0]
  }
};

function validateMirror(colors, mirror) {
  if (!Array.isArray(mirror) || mirror.length !== colors.length) {
    throw new TypeError('Mirror mapping must have one entry for each palette color.');
  }
  for (let i = 0; i < mirror.length; i += 1) {
    if (!Number.isInteger(mirror[i]) || mirror[i] !== colors.length - 1 - i) {
      throw new TypeError('A contextual palette ramp must mirror by reversing its color order.');
    }
  }
}

export function createCustomPalette(id, colors, mirror = colors.map((_, i) => colors.length - 1 - i), name = 'Custom palette') {
  if (typeof id !== 'string' || !id.trim()) throw new TypeError('Palette id is required.');
  if (!Array.isArray(colors) || colors.length < 2) throw new TypeError('A palette must contain at least two colors.');
  if (!colors.every(color => typeof color === 'string' && /^#[0-9a-fA-F]{6}$/.test(color))) {
    throw new TypeError('Palette colors must be six-digit hexadecimal values.');
  }
  validateMirror(colors, mirror);
  return { id, name, colors: [...colors], mirror: [...mirror] };
}

export function getPalette(id) {
  const palette = BUILT_IN[id];
  if (!palette) throw new RangeError(`Unknown palette: ${id}`);
  return createCustomPalette(palette.id, palette.colors, palette.mirror, palette.name);
}

export function listPalettes() {
  return Object.values(BUILT_IN).map(palette => getPalette(palette.id));
}

export function mirrorPaletteIndex(palette, index) {
  if (!Number.isInteger(index) || index < 0 || index >= palette.colors.length) throw new RangeError('Palette index is out of range.');
  return palette.mirror[index];
}

export function validatePalette(palette) {
  if (!palette || typeof palette !== 'object') throw new TypeError('Palette is required.');
  return createCustomPalette(palette.id, palette.colors, palette.mirror, palette.name ?? 'Imported palette');
}
