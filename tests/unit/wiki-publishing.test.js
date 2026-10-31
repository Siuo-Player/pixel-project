import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';

const root = process.cwd();

test('the GitHub Wiki sync tool publishes the versioned project memory and engineering rules', () => {
  const file = path.join(root, 'scripts', 'publish-wiki.mjs');
  assert.ok(existsSync(file), 'Add a cross-platform script to publish the repo memory to GitHub Wiki.');
  const source = readFileSync(file, 'utf8');

  for (const [label, pattern] of [
    ['the dedicated GitHub Wiki remote', /pixel-project\.wiki\.git/],
    ['the Home page', /Home\.md/],
    ['the engineering rules', /AGENTS\.md/],
    ['the regression catalogue', /REGRESSION_CATALOG\.md/],
    ['the versioned memory directory', /docs[\\/]memory/],
    ['a git commit for changes', /git[\\s\S]{0,200}commit/],
    ['a git push for publication', /git[\\s\S]{0,250}push/]
  ]) assert.match(source, pattern, `Wiki publisher is missing ${label}.`);

  assert.doesNotMatch(source, /git\s+clean\s+-fdx|Remove-Item\s+-Recurse\s+.*wiki/i,
    'The Wiki publisher must not delete unrelated pages or files.');
});

test('the README explains that docs/memory is canonical and links to the GitHub Wiki', () => {
  const readme = readFileSync(path.join(root, 'README.md'), 'utf8');
  assert.match(readme, /https:\/\/github\.com\/Siuo-Player\/pixel-project\/wiki/);
  assert.match(readme, /scripts\/publish-wiki\.mjs/);
});
