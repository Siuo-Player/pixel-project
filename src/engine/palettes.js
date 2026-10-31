function makePalette(id, name, colors) {
  return {
    id,
    name,
    colors,
    mirror: colors.map((_, index) => colors.length - 1 - index)
  };
}

const BUILT_IN = {
  'blue-red-4': makePalette('blue-red-4', 'Blue ↔ Red', [
    '#253B64', '#318CC4', '#D94E55', '#742A3D'
  ]),
  'grayscale-4': makePalette('grayscale-4', 'Grayscale 4', [
    '#171717', '#555555', '#AAAAAA', '#F4F4F4'
  ]),
  'forest-4': makePalette('forest-4', 'Forest', [
    '#1D3C35', '#4F8061', '#B6B65D', '#E8D69C'
  ]),
  'twilight-4': makePalette('twilight-4', 'Twilight', [
    '#24213B', '#51466F', '#A17C9D', '#E8C6B8'
  ]),
  'sakura-4': makePalette('sakura-4', 'Sakura', [
    '#39263D', '#8E526E', '#D98F9B', '#F1D6BE'
  ]),
  'desert-4': makePalette('desert-4', 'Desert', [
    '#49352E', '#9E6650', '#D49A63', '#EAD7A1'
  ]),
  'retro-8': makePalette('retro-8', 'Retro 8', [
    '#20234A', '#384F8B', '#347E9B', '#5BAA86',
    '#C4C66B', '#E6A653', '#D66A52', '#873D56'
  ]),
  'vaporwave-8': makePalette('vaporwave-8', 'Vaporwave', [
    '#211C4A', '#3B2F75', '#594B9B', '#786FB4',
    '#9C9AC6', '#C7A8B8', '#E5B59A', '#F2D3AE'
  ]),
  'autumn-8': makePalette('autumn-8', 'Autumn', [
    '#2D1E26', '#57303A', '#834147', '#B75A45',
    '#D77A48', '#E6A45C', '#E8C37B', '#F1E5B2'
  ]),
  'ocean-8': makePalette('ocean-8', 'Ocean', [
    '#11283F', '#1B4464', '#286387', '#36849B',
    '#4BA5A5', '#78BEA9', '#B3D5AF', '#E9E9C8'
  ]),
  'aurora-12': makePalette('aurora-12', 'Aurora Borealis', [
    '#101B3B', '#1D3260', '#28548A', '#267AA3',
    '#2B9B9A', '#49B88B', '#8ACB78', '#C7D66F',
    '#E8D978', '#F2C36B', '#E99A62', '#D76D74'
  ]),
  'ember-12': makePalette('ember-12', 'Ember', [
    '#24162E', '#3D1F3D', '#5B274B', '#7B3150',
    '#A6404D', '#C95645', '#E36F3D', '#F18F3B',
    '#F5B84C', '#F3D56A', '#F5E4A5', '#FFF2D6'
  ]),
  'deep-sea-12': makePalette('deep-sea-12', 'Deep Sea', [
    '#101D39', '#142D59', '#174477', '#1A6090',
    '#1B7B9B', '#2795A2', '#46AEAA', '#72C5B0',
    '#A5D8B8', '#CBE8CD', '#E5F0DF', '#F6F5E8'
  ])
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
