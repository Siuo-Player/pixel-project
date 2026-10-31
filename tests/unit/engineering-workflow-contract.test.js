import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';

const root = process.cwd();

test('AGENTS.md makes the test-first debugging workflow mandatory', () => {
  const file = path.join(root, 'AGENTS.md');
  assert.ok(existsSync(file), 'The repository must keep its coding-agent rules in AGENTS.md.');
  const instructions = readFileSync(file, 'utf8');

  for (const [label, pattern] of [
    ['observed behaviour, expected behaviour and hypothesis are separated', /observado.*esperado.*hip[oó]tese/is],
    ['the failing RED test is run before implementation', /RED.*(?:antes|primeiro).*implementa/is],
    ['the fixed GREEN test is run after implementation', /GREEN/is],
    ['bugs are reproduced with controlled data in a sandbox', /sandbox/i],
    ['the complete local suite is required', /npm run test:all/],
    ['the exact commit SHA must have green CI', /SHA exato/i],
    ['tests must not be weakened to obtain a pass', /n[aã]o.*enfraquec/i],
    ['the final diff receives a separate review', /revis[aã]o independente/i]
  ]) {
    assert.match(instructions, pattern, `Missing agent rule: ${label}`);
  }
});

test('the regression catalogue maps known failures to real named automated tests', () => {
  const file = path.join(root, 'docs', 'REGRESSION_CATALOG.md');
  assert.ok(existsSync(file), 'Add docs/REGRESSION_CATALOG.md to preserve the project failure history.');
  const catalogue = readFileSync(file, 'utf8');
  const rowPattern = /^\|\s*(PX-\d{3})\s*\|\s*([^|]+?)\s*\|\s*`([^`]+)`\s+—\s+`([^`]+)`\s*\|\s*([^|]+?)\s*\|$/gm;
  const rows = [...catalogue.matchAll(rowPattern)];

  assert.ok(rows.length >= 10, 'The catalogue must include the known regression cases, not just a placeholder.');
  assert.equal(new Set(rows.map(row => row[1])).size, rows.length, 'Regression IDs must be unique.');

  for (const [, id, origin, behaviour, relativePath, testName] of rows) {
    const testPath = path.join(root, relativePath);
    assert.ok(existsSync(testPath), `${id} points to a missing test file: ${relativePath}`);
    const source = readFileSync(testPath, 'utf8');
    assert.ok(source.includes(testName), `${id} points to a test name that does not exist: ${testName}`);
    assert.ok(origin.trim().length > 0, `${id} must identify where the failure came from.`);
    assert.ok(behaviour.trim().length > 0, `${id} must describe the behaviour that must not regress.`);
  }

  assert.ok(rows.some(row => /relatado pelo utilizador/i.test(row[2]) && /cor de desenho/i.test(row[3]) && /paint colour/i.test(row[5])),
    'The shape-tool/paint-colour bug reported by the user must remain in the catalogue.');
});
