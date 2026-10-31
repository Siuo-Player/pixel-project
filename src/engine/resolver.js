import { BLACK, WHITE, TRANSPARENT } from '../core/grid.js';

export function resolveProposals(source, proposals, palette, { mode = 'weighted-average' } = {}) {
  if (!['weighted-average', 'highest-confidence', 'weighted-vote'].includes(mode)) {
    throw new RangeError('Unknown resolver mode: ' + mode);
  }
  const pixelCount = source.width * source.height;
  const colorCount = palette.colors.length;
  const sums = new Float64Array(pixelCount * colorCount);
  const votes = new Float64Array(pixelCount * colorCount);
  const weights = new Float64Array(pixelCount);
  const bestScores = new Float64Array(pixelCount).fill(-Infinity);
  const bestDistributions = new Float32Array(pixelCount * colorCount);

  for (const proposal of proposals) {
    if (!Number.isFinite(proposal.weight) || proposal.weight < 0) throw new RangeError('Proposal weight must be non-negative.');
    if (proposal.width !== undefined && proposal.width !== source.width) throw new RangeError('Proposal width does not match source.');
    if (proposal.height !== undefined && proposal.height !== source.height) throw new RangeError('Proposal height does not match source.');
    if (proposal.colorCount !== undefined && proposal.colorCount !== colorCount) throw new RangeError('Proposal palette size does not match.');
    if (!(proposal.mask instanceof Uint8Array) || proposal.mask.length !== pixelCount) throw new RangeError('Proposal mask has an invalid length.');
    if (!(proposal.distributions instanceof Float32Array) || proposal.distributions.length !== pixelCount * colorCount) throw new RangeError('Proposal distributions have an invalid length.');
    if (proposal.weight === 0) continue;

    for (let p = 0; p < pixelCount; p += 1) {
      if (!proposal.mask[p] || source.data[p] === TRANSPARENT) continue;
      let total = 0;
      let maximum = -Infinity;
      let winningColor = 0;
      const offset = p * colorCount;
      for (let c = 0; c < colorCount; c += 1) {
        const value = proposal.distributions[offset + c];
        if (!Number.isFinite(value) || value < 0) throw new RangeError('Proposal probabilities must be finite and non-negative.');
        total += value;
        if (value > maximum) {
          maximum = value;
          winningColor = c;
        }
      }
      if (Math.abs(total - 1) > 1e-5) throw new RangeError('Proposal distribution for pixel ' + p + ' must sum to 1 (got ' + total + ').');
      if (mode === 'weighted-average') {
        for (let c = 0; c < colorCount; c += 1) sums[offset + c] += proposal.distributions[offset + c] * proposal.weight;
        weights[p] += proposal.weight;
      } else if (mode === 'weighted-vote') {
        votes[offset + winningColor] += proposal.weight;
        weights[p] += proposal.weight;
      } else if (maximum * proposal.weight > bestScores[p]) {
        bestScores[p] = maximum * proposal.weight;
        bestDistributions.set(proposal.distributions.subarray(offset, offset + colorCount), offset);
      }
    }
  }

  const data = new Int16Array(pixelCount);
  data.fill(-1);
  const probabilities = new Float32Array(pixelCount * colorCount);
  for (let p = 0; p < pixelCount; p += 1) {
    if (source.data[p] === TRANSPARENT) continue;
    const offset = p * colorCount;
    if (mode === 'highest-confidence' && bestScores[p] > -Infinity) {
      probabilities.set(bestDistributions.subarray(offset, offset + colorCount), offset);
    } else if (mode === 'weighted-average' && weights[p] > 0) {
      for (let c = 0; c < colorCount; c += 1) probabilities[offset + c] = sums[offset + c] / weights[p];
    } else if (mode === 'weighted-vote' && weights[p] > 0) {
      for (let c = 0; c < colorCount; c += 1) probabilities[offset + c] = votes[offset + c] / weights[p];
    } else {
      for (let c = 0; c < colorCount; c += 1) probabilities[offset + c] = 1 / colorCount;
    }
    let maximum = -Infinity;
    for (let c = 0; c < colorCount; c += 1) maximum = Math.max(maximum, probabilities[offset + c]);
    const tied = [];
    for (let c = 0; c < colorCount; c += 1) if (Math.abs(probabilities[offset + c] - maximum) <= 1e-7) tied.push(c);
    data[p] = source.data[p] === BLACK ? tied[0] : source.data[p] === WHITE ? tied[tied.length - 1] : -1;
  }
  return { width: source.width, height: source.height, data, probabilities, colorCount };
}
