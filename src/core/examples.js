import { parseProject } from './project.js';
import { EXAMPLES_DATA } from './examples-data.js';

export const BUILTIN_EXAMPLES = Object.freeze([
  {
    id: 'lighthouse-at-dusk',
    name: 'Farol ao anoitecer',
    dimensions: '40×40',
    description: 'Farol, ilha e mar (8, 12 e 32 cores).'
  },
  {
    id: 'moonlit-cat',
    name: 'Gato sob a lua',
    dimensions: '48×36',
    description: 'Gato, lua e estrelas (8, 16 e 32 cores).'
  },
  {
    id: 'mushroom-grove',
    name: 'Bosque dos cogumelos',
    dimensions: '40×40',
    description: 'Cogumelos e árvores (4, 12 e 32 cores).'
  },
  {
    id: 'desert-temple',
    name: 'Templo no deserto',
    dimensions: '48×40',
    description: 'Templo, dunas e cactos (12 e 16 cores).'
  }
]);

export function getExampleMetadata() {
  return BUILTIN_EXAMPLES.map(example => ({ ...example }));
}

export function loadExampleProject(id) {
  const data = EXAMPLES_DATA[id];
  if (!data) throw new RangeError(`Exemplo desconhecido: ${id}`);
  return parseProject(JSON.stringify(data));
}
