import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';

const workflow = readFileSync(path.join(process.cwd(), '.github', 'workflows', 'desktop-release.yml'), 'utf8');

test('desktop release builds a portable Windows executable and a Linux AppImage', () => {
  assert.match(workflow, /os:\s*windows-latest[\s\S]*?args:\s*--win\s+portable\b/);
  assert.match(workflow, /os:\s*ubuntu-latest[\s\S]*?args:\s*--linux\s+AppImage\b/);
});

test('desktop builds are uploaded separately and one release job publishes the combined assets', () => {
  assert.match(workflow, /actions\/upload-artifact@v\d+/);
  assert.match(workflow, /actions\/download-artifact@v\d+/);
  assert.match(workflow, /needs:\s*build/);
  assert.match(workflow, /name:\s*Publish GitHub Release/);
  assert.match(workflow, /gh release (?:create|upload)/);
  assert.match(workflow, /permissions:[\s\S]*?contents:\s*write/);
});
