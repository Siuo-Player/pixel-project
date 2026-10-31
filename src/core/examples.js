import { parseProject } from './project.js';
import { EXAMPLES_DATA } from './examples-data.js';

export const BUILTIN_EXAMPLES = Object.freeze([
  {
    id: 'lighthouse-at-dusk',
    name: 'Farol ao anoitecer',
    author: 'Antigravity (Google DeepMind)',
    dimensions: '40×40',
    description: 'Farol, ilha e mar (8, 12 e 32 cores).',
    inspirations: 'Inspirado na estética náutica da era Amiga/Atari ST, no pontilhismo marítimo de Paul Signac e nos estudos de composição e iluminação atmosférica de Brandon James Greer.',
    citations: [
      'Paul Signac — Concarneau, Calme du soir (1891)',
      'Brandon James Greer — Pixel Art Lighting & Atmospheric Dithering (2020)',
      'Deluxe Paint IV / Commodore Amiga 32-color palette masters'
    ]
  },
  {
    id: 'moonlit-cat',
    name: 'Gato sob a lua',
    author: 'Antigravity (Google DeepMind)',
    dimensions: '48×36',
    description: 'Gato, lua e estrelas (8, 16 e 32 cores).',
    inspirations: 'Inspirado no movimento xilogravurista japonês Shin-hanga de Takahashi Shōtei (silhuetas noturnas e gatos ao luar) e na sensibilidade visual poética de Studio Ghibli (Kiki\'s Delivery Service).',
    citations: [
      'Takahashi Shōtei (Hiroaki) — Cat in the Moonlight (1927, Shin-hanga)',
      'Studio Ghibli / Hayao Miyazaki — Kiki\'s Delivery Service (1989, direção de arte noturna)',
      'Fool (Yuriy Gusev) — Dithering & Shading in Restricted Palettes'
    ]
  },
  {
    id: 'mushroom-grove',
    name: 'Bosque dos cogumelos',
    author: 'Antigravity (Google DeepMind)',
    dimensions: '40×40',
    description: 'Cogumelos e árvores (4, 12 e 32 cores).',
    inspirations: 'Inspirado nos ecossistemas de fantasia de Nausicaä do Vale do Vento e nas técnicas de clustering e color cycling da lenda do pixel art Mark Ferrari (LucasArts / The Secret of Monkey Island).',
    citations: [
      'Mark Ferrari — 8-bit Background Art & Natural Color Palettes (LucasArts, 1990)',
      'Hayao Miyazaki — Nausicaä of the Valley of the Wind (1984, cenários de esporos e floresta)',
      'DawnBringer — DB16 & DB32 Palette Architecture (PixelJoint)'
    ]
  },
  {
    id: 'desert-temple',
    name: 'Templo no deserto',
    author: 'Antigravity (Google DeepMind)',
    dimensions: '48×40',
    description: 'Templo, dunas e cactos (12 e 16 cores).',
    inspirations: 'Inspirado na arquitetura monumental dos templos do Médio Oriente antigo, na paleta solar de areia e arenito dos clássicos cinematográficos de aventura e no jogo clássico Prince of Persia de Jordan Mechner.',
    citations: [
      'Jordan Mechner — Prince of Persia (1989, arte e proporções clássicas)',
      'David Lean — Lawrence of Arabia (1962, cinematografia de contraste térmico no deserto)',
      'Arne Niklas Jansson (Android Arts) — 16-color Famicube & Desert Color Ramps'
    ]
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
