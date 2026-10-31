import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { resolveAppAssetPath } from '../../desktop/app-protocol.cjs';

test('the desktop protocol serves the app entry point and in-root assets', () => {
  const root = path.resolve('/opt/pixel-project/resources/app.asar');
  assert.equal(resolveAppAssetPath(root, 'pixel-project://bundle/'), path.join(root, 'index.html'));
  assert.equal(
    resolveAppAssetPath(root, 'pixel-project://bundle/src/main.js'),
    path.join(root, 'src', 'main.js')
  );
  assert.equal(
    resolveAppAssetPath(root, 'pixel-project://bundle/assets/icons/icon-512.png'),
    path.join(root, 'assets', 'icons', 'icon-512.png')
  );
});

test('the desktop protocol rejects foreign origins, malformed URLs and path traversal', () => {
  const root = path.resolve('/opt/pixel-project/resources/app.asar');
  assert.equal(resolveAppAssetPath(root, 'https://example.com/'), null);
  assert.equal(resolveAppAssetPath(root, 'pixel-project://other-host/index.html'), null);
  assert.equal(resolveAppAssetPath(root, 'not a url'), null);
  assert.equal(resolveAppAssetPath(root, 'pixel-project://bundle/%2e%2e%2fsecret.txt'), null);
  assert.equal(resolveAppAssetPath(root, 'pixel-project://bundle/%2e%2e/%2e%2e/secret.txt'), null);
});

test('Electron serves the renderer through a secure standard protocol without Node integration', () => {
  const main = readFileSync(new URL('../../desktop/main.cjs', import.meta.url), 'utf8');
  assert.match(main, /registerSchemesAsPrivileged/);
  assert.match(main, /standard:\s*true/);
  assert.match(main, /secure:\s*true/);
  assert.match(main, /protocol\.handle/);
  assert.match(main, /resolveAppAssetPath/);
  assert.match(main, /nodeIntegration:\s*false/);
  assert.match(main, /contextIsolation:\s*true/);
  assert.match(main, /loadURL\(['"`]pixel-project:\/\/bundle\//);
  assert.doesNotMatch(main, /\.loadFile\(/);
});
