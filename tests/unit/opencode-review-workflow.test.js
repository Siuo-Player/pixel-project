import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import test from 'node:test';

const root = process.cwd();
const checker = path.join(root, 'scripts', 'check-opencode-review-config.mjs');

function runChecker(apiKey) {
  const directory = mkdtempSync(path.join(os.tmpdir(), 'pixel-opencode-config-'));
  const output = path.join(directory, 'github-output');
  writeFileSync(output, '');
  try {
    const env = { ...process.env, GITHUB_OUTPUT: output };
    if (apiKey === undefined) delete env.OPENCODE_API_KEY;
    else env.OPENCODE_API_KEY = apiKey;
    const result = spawnSync(process.execPath, [checker], { cwd: root, env, encoding: 'utf8' });
    return { ...result, output: readFileSync(output, 'utf8') };
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
}

test('OpenCode review skips cleanly when the OpenCode API key is absent', () => {
  const result = runChecker('');
  assert.equal(result.status, 0, result.stderr || result.stdout);
  assert.match(result.output, /^configured=false$/m);
  assert.match(result.stdout + result.stderr, /skip|ignora/i);
});

test('OpenCode review enables the provider when an API key is configured', () => {
  const result = runChecker('test-key-not-used-for-network');
  assert.equal(result.status, 0, result.stderr || result.stdout);
  assert.match(result.output, /^configured=true$/m);
});

test('GitHub review workflow gates installation and model calls on provider configuration', () => {
  const workflow = readFileSync(path.join(root, '.github', 'workflows', 'opencode-review.yml'), 'utf8');
  assert.match(workflow, /id:\s*provider/);
  assert.match(workflow, /name:\s*Check OpenCode provider configuration/);
  assert.match(workflow, /if:\s*steps\.provider\.outputs\.configured == 'true'/);
  assert.match(workflow, /OPENCODE_API_KEY:\s*\$\{\{\s*secrets\.OPENCODE_API_KEY\s*\}\}/);
  assert.match(workflow, /permissions:\s*[\r\n]+\s*contents:\s*read/);
  assert.match(workflow, /npm install --global @opencode\/cli@\d+/);
  assert.match(workflow, /OPENCODE_REVIEW_MODEL/);
});
