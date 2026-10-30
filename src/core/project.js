import { createSourceGrid } from './grid.js';
import { createTechniqueInstance } from '../engine/techniques.js';
import { validatePalette } from '../engine/palettes.js';

const PROJECT_VERSION = 1;
function makeId() {
  return globalThis.crypto?.randomUUID?.() ?? `project-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function createProject(width, height, palette, techniques = [createTechniqueInstance()]) {
  const safePalette = validatePalette(palette);
  return {
    version: PROJECT_VERSION,
    id: makeId(),
    name: 'Untitled pixel project',
    resolverMode: 'weighted-average',
    source: createSourceGrid(width, height),
    palette: safePalette,
    outputs: [{
      id: makeId(),
      name: 'Interpretation 1',
      palette: safePalette,
      resolverMode: 'weighted-average',
      techniques: techniques.map(item => ({ ...item, params: { ...item.params } }))
    }]
  };
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
  if (parsed.version !== PROJECT_VERSION) throw new RangeError(`Unsupported project version: ${parsed.version}`);
  if (!parsed.source || !Array.isArray(parsed.source.data)) throw new TypeError('Project source is missing or invalid.');
  const source = createSourceGrid(parsed.source.width, parsed.source.height, parsed.source.data);
  const palette = validatePalette(parsed.palette);
  if (!Array.isArray(parsed.outputs) || parsed.outputs.length < 1) throw new TypeError('Project must contain at least one output.');
  const outputs = parsed.outputs.map(output => ({
    id: output.id ?? makeId(),
    name: output.name ?? 'Interpretation',
    palette: validatePalette(output.palette ?? palette),
    resolverMode: output.resolverMode ?? 'weighted-average',
    techniques: (output.techniques ?? []).map(instance => createTechniqueInstance(instance.techniqueId, instance.params, {
      id: instance.id, name: instance.name, enabled: instance.enabled, weight: instance.weight
    }))
  }));
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
