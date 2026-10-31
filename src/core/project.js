import { createSourceGrid } from './grid.js';
import { createTechniqueInstance } from '../engine/techniques.js';
import { validatePalette } from '../engine/palettes.js';
import { RESOLVER_MODES } from '../engine/resolver.js';

const PROJECT_VERSION = 2;
const MAX_OUTPUTS = 3;

function validateResolverMode(mode) {
  if (!RESOLVER_MODES.includes(mode)) throw new RangeError('Unknown resolver mode: ' + mode);
  return mode;
}

function makeId() {
  return globalThis.crypto?.randomUUID?.() ?? 'project-' + Date.now() + '-' + Math.random().toString(36).slice(2);
}

function validateOutputDimensions(width, height) {
  if (!Number.isInteger(width) || !Number.isInteger(height) || width < 1 || height < 1 || width > 256 || height > 256 || width * height > 65_536) {
    throw new RangeError('Output dimensions must be between 1 and 256 pixels, with at most 65,536 pixels total.');
  }
}

function cloneTechniques(techniques = []) {
  return techniques.map(item => createTechniqueInstance(item.techniqueId, item.params, {
    name: item.name,
    enabled: item.enabled,
    weight: item.weight
  }));
}

function createOutput(name, width, height, palette, techniques = [], followsSourceSize = false) {
  validateOutputDimensions(width, height);
  const safePalette = validatePalette(palette);
  return {
    id: makeId(),
    name,
    width,
    height,
    followsSourceSize,
    palette: safePalette,
    resolverMode: 'weighted-average',
    techniques: cloneTechniques(techniques)
  };
}

export function createProject(width, height, palette, techniques = [createTechniqueInstance()]) {
  const safePalette = validatePalette(palette);
  const output = createOutput('Interpretation 1', width, height, safePalette, techniques, true);
  return {
    version: PROJECT_VERSION,
    id: makeId(),
    name: 'Untitled pixel project',
    resolverMode: 'weighted-average',
    source: createSourceGrid(width, height),
    palette: safePalette,
    outputs: [output]
  };
}

export function addOutput(project, options = {}) {
  if (!project || !Array.isArray(project.outputs)) throw new TypeError('A valid project is required.');
  if (project.outputs.length >= MAX_OUTPUTS) throw new RangeError('A project can contain at most three interpretations.');
  const previous = project.outputs[project.outputs.length - 1];
  const number = project.outputs.length + 1;
  const width = options.width ?? project.source.width;
  const height = options.height ?? project.source.height;
  const palette = options.palette ?? previous?.palette ?? project.palette;
  const techniques = options.techniques ?? previous?.techniques ?? [];
  const output = createOutput(
    options.name ?? 'Interpretation ' + number,
    width,
    height,
    palette,
    techniques,
    options.followsSourceSize ?? (options.width === undefined && options.height === undefined)
  );
  if (options.resolverMode) output.resolverMode = validateResolverMode(options.resolverMode);
  project.outputs.push(output);
  return output;
}

export function removeOutput(project, outputId) {
  if (!project || !Array.isArray(project.outputs)) throw new TypeError('A valid project is required.');
  if (project.outputs.length <= 1) throw new RangeError('A project must keep at least one interpretation.');
  const index = project.outputs.findIndex(output => output.id === outputId);
  if (index < 0) throw new RangeError('Unknown interpretation: ' + outputId);
  return project.outputs.splice(index, 1)[0];
}

export function serializeProject(project) {
  const payload = {
    version: PROJECT_VERSION,
    resolverMode: project.resolverMode ?? 'weighted-average',
    id: project.id,
    name: project.name,
    source: { width: project.source.width, height: project.source.height, data: Array.from(project.source.data) },
    palette: project.palette,
    outputs: project.outputs.map(output => ({
      id: output.id,
      name: output.name,
      width: output.width ?? project.source.width,
      height: output.height ?? project.source.height,
      followsSourceSize: output.followsSourceSize ?? false,
      palette: output.palette,
      resolverMode: output.resolverMode ?? 'weighted-average',
      techniques: output.techniques.map(instance => ({ ...instance, params: { ...instance.params } }))
    }))
  };
  return JSON.stringify(payload, null, 2);
}

export function parseProject(serialized) {
  let parsed;
  try { parsed = typeof serialized === 'string' ? JSON.parse(serialized) : serialized; }
  catch { throw new TypeError('Project file is not valid JSON.'); }
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw new TypeError('Project data must be an object.');
  if (![1, PROJECT_VERSION].includes(parsed.version)) throw new RangeError('Unsupported project version: ' + parsed.version);
  if (parsed.resolverMode !== undefined) validateResolverMode(parsed.resolverMode);
  if (!parsed.source || !Array.isArray(parsed.source.data)) throw new TypeError('Project source is missing or invalid.');
  const source = createSourceGrid(parsed.source.width, parsed.source.height, parsed.source.data);
  const palette = validatePalette(parsed.palette);
  if (!Array.isArray(parsed.outputs) || parsed.outputs.length < 1 || parsed.outputs.length > MAX_OUTPUTS) {
    throw new TypeError('Project must contain between one and three interpretations.');
  }
  const outputs = parsed.outputs.map((output, index) => {
    const width = output.width ?? source.width;
    const height = output.height ?? source.height;
    validateOutputDimensions(width, height);
    return {
      id: output.id ?? makeId(),
      name: output.name ?? 'Interpretation ' + (index + 1),
      width,
      height,
      followsSourceSize: output.followsSourceSize ?? (output.width === undefined && output.height === undefined),
      palette: validatePalette(output.palette ?? palette),
      resolverMode: output.resolverMode === undefined ? 'weighted-average' : validateResolverMode(output.resolverMode),
      techniques: (output.techniques ?? []).map(instance => createTechniqueInstance(instance.techniqueId, instance.params, {
        id: instance.id, name: instance.name, enabled: instance.enabled, weight: instance.weight
      }))
    };
  });
  return {
    version: PROJECT_VERSION,
    resolverMode: parsed.resolverMode ?? 'weighted-average',
    id: parsed.id ?? makeId(),
    name: parsed.name ?? 'Imported project',
    source,
    palette,
    outputs
  };
}
