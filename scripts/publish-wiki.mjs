import { mkdtemp, readFile, writeFile, readdir } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const wikiRemote = 'https://github.com/Siuo-Player/pixel-project.wiki.git';

function git(args, cwd) {
  const result = spawnSync('git', args, { cwd, encoding: 'utf8' });
  if (result.error) throw result.error;
  if (result.status !== 0) {
    const detail = (result.stderr || result.stdout || '').trim();
    throw new Error(`git ${args[0]} failed${detail ? `: ${detail}` : ''}`);
  }
  return (result.stdout || '').trim();
}

async function readRepoFile(relativePath) {
  return readFile(path.join(root, relativePath), 'utf8');
}

function pageSlug(prefix, filename) {
  return `${prefix}-${path.basename(filename, '.md')}.md`;
}

function wikiHome(memoryPages) {
  const links = memoryPages.map(page => `- [${page.title}](${page.filename.replace(/\.md$/i, '')})`).join('\n');
  return [
    '# Pixel Project Wiki',
    '',
    'Documentação pública do Pixel Project. A fonte oficial e versionada é o repositório; esta Wiki é uma cópia navegável para leitura.',
    '',
    '- [Aplicação online](https://siuo-player.github.io/pixel-project/)',
    '- [Repositório e código-fonte](https://github.com/Siuo-Player/pixel-project)',
    '- [Memória do projeto](Project-Memory)',
    '- [Processo de engenharia](Engineering-Workflow)',
    '- [Catálogo de regressões](Regression-Catalog)',
    '',
    '## Notas de memória',
    '',
    links,
    '',
    '## Como contribuir',
    '',
    'Altera primeiro os documentos em `docs/memory/` no repositório e executa `npm run wiki:publish` para atualizar esta Wiki.'
  ].join('\n');
}

async function collectPages() {
  const pages = new Map();
  pages.set('Engineering-Workflow.md', await readRepoFile('AGENTS.md'));
  pages.set('Regression-Catalog.md', await readRepoFile('docs/REGRESSION_CATALOG.md'));
  pages.set('Project-Memory.md', await readRepoFile('docs/memory/README.md'));
  pages.set('Project-Overview.md', [
    '# Pixel Project',
    '',
    'Editor de pixel art contextual, com uma imagem original e até três interpretações calculadas de forma independente.',
    '',
    '- App: https://siuo-player.github.io/pixel-project/',
    '- Código, issues e releases: https://github.com/Siuo-Player/pixel-project',
    '- Instalação PWA e executáveis: [README](https://github.com/Siuo-Player/pixel-project#publicar-e-instalar-tudo-gratuito)',
    '- Licença do projeto: MIT.'
  ].join('\n'));

  const categories = [
    ['decisions', 'Decision'],
    ['gotchas', 'Gotcha'],
    ['procedures', 'Procedure'],
    ['sessions', 'Session']
  ];
  const memoryPages = [];
  for (const [directory, prefix] of categories) {
    const sourceDirectory = path.join(root, 'docs', 'memory', directory);
    const entries = (await readdir(sourceDirectory, { withFileTypes: true }))
      .filter(entry => entry.isFile() && entry.name.endsWith('.md'))
      .map(entry => entry.name)
      .sort();
    for (const filename of entries) {
      const outputName = pageSlug(prefix, filename);
      const title = `${prefix}: ${path.basename(filename, '.md')}`;
      pages.set(outputName, await readRepoFile(path.join('docs', 'memory', directory, filename)));
      memoryPages.push({ title, filename: outputName });
    }
  }

  pages.set('Home.md', wikiHome(memoryPages));
  return pages;
}

async function publishWiki() {
  const temporaryRoot = await mkdtemp(path.join(tmpdir(), 'pixel-project-wiki-'));
  const wikiDirectory = path.join(temporaryRoot, 'wiki');

  try {
    try {
      git(['clone', wikiRemote, wikiDirectory], temporaryRoot);
    } catch (error) {
      throw new Error(
        'Não foi possível clonar a Wiki. Abre primeiro o separador Wiki do repositório, cria a página inicial (Home) na interface GitHub e volta a executar este comando. ' + error.message
      );
    }

    const pages = await collectPages();
    for (const [filename, content] of pages) {
      await writeFile(path.join(wikiDirectory, filename), content, 'utf8');
    }

    git(['add', '--', ...pages.keys()], wikiDirectory);
    const diff = spawnSync('git', ['diff', '--cached', '--quiet'], { cwd: wikiDirectory });
    if (diff.status === 0) {
      process.stdout.write('A Wiki já está sincronizada; não há alterações.\n');
      return;
    }
    if (diff.status !== 1) throw new Error('Não foi possível verificar as alterações preparadas da Wiki.');

    git(['commit', '-m', 'docs(wiki): sync project memory and engineering docs'], wikiDirectory);
    git(['push', 'origin', 'HEAD'], wikiDirectory);
    process.stdout.write(`Wiki publicada: ${pages.size} páginas sincronizadas.\n`);
  } finally {
    const { rm } = await import('node:fs/promises');
    await rm(temporaryRoot, { recursive: true, force: true });
  }
}

publishWiki().catch(error => {
  console.error(error.message);
  process.exitCode = 1;
});
