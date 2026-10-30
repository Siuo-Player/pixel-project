import { runTechnique } from './techniques.js';
import { resolveProposals } from './resolver.js';

export function convertSource(source, palette, techniqueInstances, options = {}) {
  if (!Array.isArray(techniqueInstances)) throw new TypeError('Technique instances must be an array.');
  const proposals = techniqueInstances.filter(instance => instance.enabled !== false).map(instance => runTechnique(source, palette, instance));
  return resolveProposals(source, proposals, palette, options);
}

export function convertProject(project, outputId = project.outputs?.[0]?.id) {
  const output = project.outputs?.find(item => item.id === outputId);
  if (!output) throw new RangeError(`Unknown output: ${outputId}`);
  return convertSource(project.source, output.palette ?? project.palette, output.techniques, {
    mode: output.resolverMode ?? project.resolverMode ?? 'weighted-average'
  });
}
