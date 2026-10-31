import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';

const root = process.cwd();

test('project wiki pages are versioned with the source and can be synced to GitHub Wiki', () => {
  const pages = ['Home.md', 'Getting-Started.md', 'Development.md', 'Releases.md', 'Memory-and-Agents.md', '_Sidebar.md'];
  for (const page of pages) {
    const file = path.join(root, 'wiki', page);
    assert.ok(existsSync(file), `Missing version-controlled wiki page: ${page}`);
    assert.ok(readFileSync(file, 'utf8').trim().length > 0, `Wiki page is empty: ${page}`);
  }

  const memorySetupScript = path.join(root, 'scripts', 'setup-ai-memory.ps1');
  assert.ok(existsSync(memorySetupScript), 'Provide a one-command PowerShell setup for ai-memory.');
  const setupScript = readFileSync(memorySetupScript, 'utf8');
  assert.match(setupScript, /install\.ps1/);
  assert.match(setupScript, /setup --yes --agent opencode/);
  assert.match(setupScript, /install-hooks --agent opencode --apply --capture-mode allowlist/);
  assert.match(setupScript, /project init/);
  assert.match(setupScript, /ai-memory doctor/);

  const syncScript = path.join(root, 'scripts', 'sync-wiki.ps1');
  assert.ok(existsSync(syncScript), 'Provide a PowerShell helper to publish the versioned pages to GitHub Wiki.');
  const script = readFileSync(syncScript, 'utf8');
  assert.match(script, /pixel-project\.wiki\.git/);
  assert.match(script, /git clone/);
  assert.match(script, /git push/);
  assert.match(script, /wiki\/_new|Create the first Wiki page/i);

  const readme = readFileSync(path.join(root, 'README.md'), 'utf8');
  assert.match(readme, /github\.com\/Siuo-Player\/pixel-project\/wiki/);
  assert.match(readme, /sync-wiki\.ps1/);
});

test('the Windows ai-memory guide uses the verified native release installer and explains the MIT reference', () => {
  const guidePath = path.join(root, 'docs', 'memory', 'procedures', 'ai-memory-windows.md');
  assert.ok(existsSync(guidePath), 'Document the reproducible native Windows installation procedure.');
  const guide = readFileSync(guidePath, 'utf8');
  assert.match(guide, /releases\/latest\/download\/install\.ps1/);
  assert.match(guide, /ai-memory setup/);
  assert.match(guide, /ai-memory project init/);
  assert.match(guide, /allowlist/);
  assert.match(guide, /MIT/i);
  assert.match(guide, /does not copy|não copia/i);
});
