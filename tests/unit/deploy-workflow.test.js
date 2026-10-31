import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';

const root = process.cwd();

test('the GitHub Pages deployment publishes the app shell with hardened permissions', () => {
  const workflowPath = path.join(root, '.github', 'workflows', 'deploy.yml');
  assert.ok(existsSync(workflowPath), 'The repository must deploy the app to GitHub Pages.');
  const workflow = readFileSync(workflowPath, 'utf8');

  assert.match(workflow, /permissions:[\s\S]*?pages:\s*write/);
  assert.match(workflow, /id-token:\s*write/);
  assert.match(workflow, /node scripts\/build-site\.mjs/);
  assert.match(workflow, /actions\/upload-pages-artifact@v\d+/);
  assert.match(workflow, /actions\/deploy-pages@v\d+/);
  assert.match(workflow, /environment:[\s\S]*?name:\s*github-pages/);
  assert.match(workflow, /concurrency:[\s\S]*?group:\s*pages/);
});

test('the site build script copies exactly the app shell files', async () => {
  const { cp, mkdir, mkdtemp, readdir, rm } = await import('node:fs/promises');
  const { tmpdir } = await import('node:os');
  const directory = await mkdtemp(path.join(tmpdir(), 'site-'));
  const process = await import('node:process');

  const module = await import('../../scripts/build-site.mjs');
  await module.buildSite(path.join(directory, 'site'));

  const copied = (await readdir(path.join(directory, 'site'), { recursive: true })).map(entry => entry.replace(/\\/g, '/'));
  for (const required of ['index.html', 'manifest.webmanifest', 'sw.js', 'src/main.js', 'assets/icons/icon-512.png']) {
    assert.ok(copied.includes(required.replace(/\\/g, '/')), `Missing site file: ${required}`);
  }
  assert.ok(!copied.some(entry => /AGENTS\.md|node_modules|playwright\.config\.js/.test(entry)), 'Non-app files must stay out of the deployment.');
  await rm(directory, { recursive: true, force: true });
  await mkdir(path.join(root, 'artifacts'), { recursive: true });
  void cp;
  void process;
});
