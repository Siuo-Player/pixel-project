function makePalette(id, name, colors) {
  return {
    id,
    name,
    colors,
    mirror: colors.map((_, index) => colors.length - 1 - index)
  };
}

const BUILT_IN = {
  // 4 colours — compact high-contrast ramps.
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
  'candy-4': makePalette('candy-4', 'Candy', [
    '#321B3E', '#9D3D78', '#EF8E9F', '#FFE0B5'
  ]),
  'ice-fire-4': makePalette('ice-fire-4', 'Ice & Fire', [
    '#172B4D', '#4A91B8', '#E36A54', '#F5D49B'
  ]),
  'moss-4': makePalette('moss-4', 'Moss', [
    '#23372D', '#55734B', '#A2A85D', '#E5D6A4'
  ]),
  'monochrome-warm-4': makePalette('monochrome-warm-4', 'Warm Monochrome', [
    '#24201D', '#6D6258', '#B9A995', '#F3E7D2'
  ]),

  // 8 colours — short ramps for classic sprite work.
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
  'gameboy-8': makePalette('gameboy-8', 'Handheld Green', [
    '#0F1B0F', '#203820', '#355B35', '#4D794A',
    '#6E985A', '#93B86B', '#BBD98B', '#E5F2C4'
  ]),
  'lavender-8': makePalette('lavender-8', 'Lavender', [
    '#24203D', '#40365F', '#625184', '#856FA3',
    '#A58AB8', '#C3A6C8', '#DFC4D5', '#F5E2E0'
  ]),
  'copper-8': makePalette('copper-8', 'Copper', [
    '#271923', '#4A2930', '#713B35', '#99513B',
    '#BC7044', '#D99455', '#EABF7B', '#F5E2B4'
  ]),
  'tropical-8': makePalette('tropical-8', 'Tropical', [
    '#142A42', '#20516A', '#287D7A', '#43A28A',
    '#80BD86', '#B9CE83', '#E2D18C', '#F5E5C0'
  ]),

  // 12 colours — more nuanced contextual transitions.
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
  ]),
  'candy-12': makePalette('candy-12', 'Candy Shop', [
    '#25152F', '#452044', '#692B5B', '#913B72',
    '#B94F85', '#D76B91', '#EA8BA0', '#F2AFAE',
    '#F6C9B7', '#F7DCC5', '#F8EBD8', '#FFF7EA'
  ]),
  'magma-12': makePalette('magma-12', 'Magma', [
    '#17152B', '#302044', '#4B2850', '#682D50',
    '#87364C', '#A94743', '#C85E3E', '#E1783D',
    '#EE9845', '#F5B95A', '#F8D989', '#FFF1C5'
  ]),
  'meadow-12': makePalette('meadow-12', 'Meadow', [
    '#182B26', '#234333', '#315D3D', '#477847',
    '#62924E', '#83A957', '#A4BD67', '#C2CE7E',
    '#D7D99A', '#E6E3B7', '#F0EBD0', '#FBF7E6'
  ]),

  // 16 colours — palettes for richer sprites and smoother local ramps.
  'pastel-16': makePalette('pastel-16', 'Pastel Dream', [
    '#1B1735', '#2B2350', '#3C306B', '#514082',
    '#69529A', '#8064AA', '#9A77B6', '#B18BC1',
    '#C59ECC', '#D5B0D2', '#E0C1D4', '#E9D2D8',
    '#F0DED6', '#F4E8D4', '#F7EFD9', '#FFF8E8'
  ]),
  'earth-16': makePalette('earth-16', 'Earth Tones', [
    '#1F2422', '#2D3027', '#3E3B2C', '#51452E',
    '#65502F', '#785B32', '#8C6636', '#A0713D',
    '#B17E4A', '#BD8D5D', '#CBA073', '#D6B48A',
    '#DEC4A0', '#E6D3B8', '#EEE2CE', '#F8F0E1'
  ]),
  'fantasy-16': makePalette('fantasy-16', 'Fantasy', [
    '#19132B', '#28203E', '#392A55', '#4C346D',
    '#604082', '#765097', '#8D61A9', '#A275B8',
    '#B58CC5', '#C8A4CF', '#D6BCD5', '#DFCDD3',
    '#E8D7C6', '#EFE2B0', '#F5EBA0', '#FFF6D4'
  ]),
  'neon-16': makePalette('neon-16', 'Neon Night', [
    '#101326', '#191D3F', '#25285D', '#30357B',
    '#39479B', '#3F5DB2', '#3A79B9', '#3B98B2',
    '#50B49D', '#72CA85', '#A2D46D', '#CFD45C',
    '#E8C84D', '#F2A344', '#EA7548', '#D84B75'
  ]),
  'classic-16': makePalette('classic-16', 'Classic Arcade 16', [
    '#140C1C', '#442434', '#30346D', '#4E4A4E',
    '#854C30', '#346524', '#D04648', '#757161',
    '#597DCE', '#D27D2C', '#8595A1', '#6DAA2C',
    '#DAD45E', '#6DC2CA', '#D2AA99', '#DEEED6'
  ]),
  'meadow-16': makePalette('meadow-16', 'Meadow Garden 16', [
    '#142B25', '#1D4030', '#285637', '#356C3D',
    '#478247', '#5D9850', '#78AD5D', '#95BF6E',
    '#B2CF83', '#C9DC9E', '#D8E7B7', '#E4EFD0',
    '#C7DAB0', '#A6C69A', '#88AF83', '#6B9574'
  ]),

  // 32 colours — expanded ramps for detailed sprites and richer shading.
  'spectrum-32': makePalette('spectrum-32', 'Spectrum 32', [
    '#17152C', '#252044', '#34285B', '#443174',
    '#563B8A', '#69469C', '#7C52AA', '#9060B5',
    '#A46FC0', '#B77FC8', '#C98FD0', '#D99FD3',
    '#E6AFD1', '#EEC0C8', '#F3D0B8', '#F5DFA6',
    '#F5EB91', '#E8E77D', '#D5DF70', '#B9D76B',
    '#98CE75', '#77C184', '#5AB295', '#43A5A7',
    '#328FB4', '#3079B4', '#3564A8', '#3D5194',
    '#4B407B', '#5C345F', '#71364E', '#8D4150'
  ]),
  'terrain-32': makePalette('terrain-32', 'Terrain 32', [
    '#17201E', '#202A24', '#29352A', '#35402C',
    '#424A2E', '#515431', '#626034', '#756A38',
    '#887640', '#9B8248', '#AC9053', '#BA9E60',
    '#C7AD70', '#D1BA81', '#D9C895', '#E0D5A9',
    '#E5DEBA', '#DED7A7', '#D0CB91', '#BEC17A',
    '#A9B76B', '#91AB63', '#789A5E', '#60875B',
    '#4C7658', '#3B6655', '#315A55', '#31505A',
    '#3B5366', '#4B5C70', '#657080', '#87909A'
  ]),
  'arcade-32': makePalette('arcade-32', 'Arcade 32', [
    '#15152B', '#25234C', '#38306D', '#51408A',
    '#6C4DA0', '#8758AD', '#A263B2', '#BD70B0',
    '#D47BA5', '#E78A91', '#F19D79', '#F4B36B',
    '#F3CA68', '#E9DF70', '#CDE77A', '#A5E58B',
    '#79D99F', '#59CBB5', '#49B9CA', '#4DA3D7',
    '#5889DD', '#686ED6', '#8056C4', '#9D49A8',
    '#B33F82', '#C43C60', '#D34C49', '#DE683D',
    '#E98B3C', '#F0AD46', '#F2D071', '#F8E8B4'
  ]),
  'oceanic-32': makePalette('oceanic-32', 'Oceanic 32', [
    '#0D1B2A', '#10263A', '#133247', '#163E55',
    '#194B63', '#1C5871', '#20667E', '#24748A',
    '#2A8293', '#32909B', '#3D9EA0', '#4AACA2',
    '#5ABAA3', '#6DC7A5', '#83D2A8', '#9ADDAE',
    '#B2E5B8', '#C8EBC4', '#DDF0D2', '#EFF3DF',
    '#F6F0CB', '#F6E2B5', '#F2D2A4', '#EBC197',
    '#D9AB87', '#C49479', '#AD7D70', '#956A6B',
    '#7C5B68', '#654D68', '#50456A', '#3F3C67'
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
