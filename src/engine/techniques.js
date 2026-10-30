import { BLACK, WHITE, TRANSPARENT } from '../core/grid.js';

export const TECHNIQUE_CATALOG = [
  { id: 'weighted-neighbourhood', name: 'Weighted neighbourhood', description: 'Maps the local white proportion to the selected palette ramp.', defaults: { radius: 1, includeCenter: true, kernel: 'uniform' } },
  { id: 'directional-lines', name: 'Directional lines', description: 'Detects continuous runs and gives line structure additional influence.', defaults: { radius: 2, maxLength: 7, contrastBoost: 1.2, includeCenter: true } },
  { id: 'local-entropy', name: 'Local entropy', description: 'Uses local binary entropy to increase or reduce contextual contrast.', defaults: { radius: 2, contrastBoost: 0.8, includeCenter: true } }
];

const DEFINITIONS = new Map(TECHNIQUE_CATALOG.map(item => [item.id, item]));

function makeId() {
  return globalThis.crypto?.randomUUID?.() ?? `tech-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function createTechniqueInstance(techniqueId = 'weighted-neighbourhood', params = {}, options = {}) {
  const definition = DEFINITIONS.get(techniqueId);
  if (!definition) throw new RangeError(`Unknown technique: ${techniqueId}`);
  const weight = options.weight ?? 1;
  if (!Number.isFinite(weight) || weight < 0) throw new RangeError('Technique weight must be a non-negative number.');
  return {
    id: options.id ?? makeId(),
    techniqueId,
    name: options.name ?? definition.name,
    enabled: options.enabled ?? true,
    weight,
    params: { ...definition.defaults, ...params }
  };
}

function validateRadius(radius) {
  if (!Number.isInteger(radius) || radius < 0 || radius > 64) throw new RangeError('Technique radius must be an integer between 0 and 64.');
}

function contextWhiteRatio(source, x, y, params) {
  const radius = params.radius ?? 1;
  validateRadius(radius);
  let white = 0;
  let total = 0;
  for (let dy = -radius; dy <= radius; dy += 1) {
    for (let dx = -radius; dx <= radius; dx += 1) {
      if (!params.includeCenter && dx === 0 && dy === 0) continue;
      const px = x + dx;
      const py = y + dy;
      if (px < 0 || py < 0 || px >= source.width || py >= source.height) continue;
      const state = source.data[py * source.width + px];
      if (state === TRANSPARENT) continue;
      let weight = 1;
      if (params.kernel === 'inverse-distance') weight = 1 / (1 + Math.hypot(dx, dy));
      else if (params.kernel === 'gaussian') weight = Math.exp(-(dx * dx + dy * dy) / Math.max(1, 2 * radius * radius));
      total += weight;
      if (state === WHITE) white += weight;
    }
  }
  return total > 0 ? white / total : 0.5;
}

function distributionForRatio(ratio, colorCount) {
  const position = Math.max(0, Math.min(1, ratio)) * (colorCount - 1);
  const lower = Math.floor(position);
  const upper = Math.min(colorCount - 1, lower + 1);
  const fraction = position - lower;
  const distribution = new Float32Array(colorCount);
  distribution[lower] += 1 - fraction;
  distribution[upper] += fraction;
  return distribution;
}

function blendToward(distribution, targetIndex, amount) {
  const alpha = Math.max(0, Math.min(1, amount));
  const result = new Float32Array(distribution.length);
  for (let i = 0; i < distribution.length; i += 1) result[i] = distribution[i] * (1 - alpha);
  result[targetIndex] += alpha;
  return result;
}

function longestSameColourRun(source, x, y, maxLength) {
  const center = source.data[y * source.width + x];
  if (center === TRANSPARENT) return 0;
  const axes = [[1, 0], [0, 1], [1, 1], [1, -1]];
  let longest = 1;
  for (const [dx, dy] of axes) {
    let run = 1;
    for (const sign of [-1, 1]) {
      for (let step = 1; step < maxLength; step += 1) {
        const px = x + dx * step * sign;
        const py = y + dy * step * sign;
        if (px < 0 || py < 0 || px >= source.width || py >= source.height) break;
        if (source.data[py * source.width + px] !== center) break;
        run += 1;
      }
    }
    longest = Math.max(longest, run);
  }
  return longest;
}

function binaryEntropy(ratio) {
  if (ratio <= 0 || ratio >= 1) return 0;
  return -(ratio * Math.log2(ratio) + (1 - ratio) * Math.log2(1 - ratio));
}

function runOnePixel(source, palette, instance, x, y) {
  const ratio = contextWhiteRatio(source, x, y, instance.params);
  let effectiveRatio = ratio;
  const colorCount = palette.colors.length;

  if (instance.techniqueId === 'directional-lines') {
    const maxLength = instance.params.maxLength ?? 7;
    if (!Number.isInteger(maxLength) || maxLength < 1 || maxLength > 128) throw new RangeError('maxLength must be an integer from 1 to 128.');
    const run = longestSameColourRun(source, x, y, maxLength);
    const strength = Math.max(0, Math.min(1, (run - 1) / Math.max(1, maxLength - 1)));
    const centerState = source.data[y * source.width + x];
    const lowerMiddle = Math.floor((colorCount - 1) / 2);
    const mirrorTarget = palette.mirror[lowerMiddle];
    const targetIndex = centerState === BLACK ? lowerMiddle : mirrorTarget;
    const base = distributionForRatio(ratio, colorCount);
    return blendToward(base, targetIndex, strength * (instance.params.contrastBoost ?? 1.2) * 0.45);
  }

  if (instance.techniqueId === 'local-entropy') {
    const entropy = binaryEntropy(ratio);
    effectiveRatio = 0.5 + (ratio - 0.5) * (1 + entropy * (instance.params.contrastBoost ?? 0.8));
  } else if (instance.techniqueId !== 'weighted-neighbourhood') {
    throw new RangeError(`Unsupported technique: ${instance.techniqueId}`);
  }
  return distributionForRatio(effectiveRatio, colorCount);
}

export function runTechnique(source, palette, instance) {
  if (!source || !(source.data instanceof Uint8Array) || source.data.length !== source.width * source.height) {
    throw new TypeError('Technique input must be a valid source grid.');
  }
  const definition = DEFINITIONS.get(instance?.techniqueId);
  if (!definition) throw new RangeError(`Unknown technique: ${instance?.techniqueId}`);
  if (!instance.enabled || instance.weight === 0) {
    return { instanceId: instance.id, techniqueId: instance.techniqueId, weight: 0, width: source.width, height: source.height, colorCount: palette.colors.length, mask: new Uint8Array(source.data.length), distributions: new Float32Array(source.data.length * palette.colors.length) };
  }
  const weight = instance.weight ?? 1;
  if (!Number.isFinite(weight) || weight < 0) throw new RangeError('Technique weight must be a non-negative number.');
  validateRadius(instance.params.radius ?? 1);

  const colorCount = palette.colors.length;
  const mask = new Uint8Array(source.data.length);
  const distributions = new Float32Array(source.data.length * colorCount);
  for (let y = 0; y < source.height; y += 1) {
    for (let x = 0; x < source.width; x += 1) {
      const pixelIndex = y * source.width + x;
      if (source.data[pixelIndex] === TRANSPARENT) continue;
      const distribution = runOnePixel(source, palette, instance, x, y);
      mask[pixelIndex] = 1;
      distributions.set(distribution, pixelIndex * colorCount);
    }
  }
  return { instanceId: instance.id, techniqueId: instance.techniqueId, weight, width: source.width, height: source.height, colorCount, mask, distributions };
}
