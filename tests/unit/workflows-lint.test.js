import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';

// Regression for PX-028: GitHub rejects workflow YAML when an unquoted plain
// scalar value contains a ": " sequence (e.g. "ex.: desktop-v0.6.0"). The file
// still passes local tooling, but Actions fails every push with a ghost run
// titled by the file path. This linter keeps that failure out of CI forever.
const workflowsDirectory = path.join(process.cwd(), '.github', 'workflows');

function stripBlockScalars(lines) {
  const blockHeader = /^(?:\s*-?\s*)[\w."'-]+\s*(:)\s*[|>](?:[+-]\d?|\d[+-]?)?\s*$/;
  const kept = [];
  let blockIndent = null;
  for (const line of lines) {
    const indent = line.match(/^ */)[0].length;
    if (blockIndent !== null) {
      if (line.trim() === '' || indent > blockIndent) continue;
      blockIndent = null;
    }
    if (blockHeader.test(line)) {
      blockIndent = line.match(/^ */)[0].length;
      continue;
    }
    kept.push(line);
  }
  return kept;
}

function isComment(line) {
  const trimmed = line.trim();
  return trimmed === '' || trimmed.startsWith('#');
}

function unquotedValueWithBareColon(line) {
  const match = line.match(/^\s*(?:-\s*)?([\w."'-]+):\s*(.*)$/);
  if (!match) return null;
  const value = match[2];
  if (value.startsWith('"') || value.startsWith("'")) return null;
  if (value.includes(': ')) return value;
  return null;
}

test('every workflow YAML value is quoted or free of bare ": " sequences', () => {
  const files = readdirSync(workflowsDirectory).filter(file => file.endsWith('.yml'));
  assert.ok(files.length > 0, 'expected at least one workflow file');

  for (const file of files) {
    const lines = readFileSync(path.join(workflowsDirectory, file), 'utf8').split(/\r?\n/);
    for (const line of stripBlockScalars(lines)) {
      if (isComment(line)) continue;
      const offender = unquotedValueWithBareColon(line);
      assert.equal(offender, null, `${file}: unquoted value with an embedded ": " breaks the Actions parser: ${line.trim()}`);
    }
  }
});
