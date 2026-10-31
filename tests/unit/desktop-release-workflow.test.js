import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';

const root = process.cwd();

test('desktop release builds Windows, Linux and macOS artifacts before one release publication', () => {
  const workflow = readFileSync(path.join(root, '.github', 'workflows', 'desktop-release.yml'), 'utf8');
  assert.match(workflow, /windows-latest/);
  assert.match(workflow, /ubuntu-latest/);
  assert.match(workflow, /macos-latest/);
  assert.match(workflow, /electron@45\.2\.1/);
  assert.match(workflow, /electron-builder@26\.18\.0/);
  assert.match(workflow, /actions\/upload-artifact@v7/);
  assert.match(workflow, /release:\s*\n\s*needs:\s*build/);
  assert.match(workflow, /actions\/download-artifact@v7/);
  assert.match(workflow, /gh release (?:create|edit)/);
  assert.match(workflow, /gh release upload/);
  assert.doesNotMatch(workflow, /gh release upload[\s\S]{0,120}jobs\.build/);

  const builder = readFileSync(path.join(root, 'electron-builder.yml'), 'utf8');
  assert.match(builder, /target:[\s\S]*portable/);
  assert.match(builder, /target:[\s\S]*AppImage/);
  assert.match(builder, /target:[\s\S]*dmg/);
});

test('only the release publisher receives contents write permission', () => {
  const workflow = readFileSync(path.join(root, '.github', 'workflows', 'desktop-release.yml'), 'utf8');
  assert.match(workflow, /permissions:\s*\n\s*contents:\s*read/);
  assert.match(workflow, /release:[\s\S]*?permissions:\s*\n\s*contents:\s*write/);
});
