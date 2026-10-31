import test from 'node:test';
import assert from 'node:assert/strict';
import { createProject } from '../../src/core/project.js';
import { getPalette } from '../../src/engine/palettes.js';
import {
  createWorkspace, addDocument, activateDocument, closeDocument, getActiveDocument
} from '../../src/core/workspace.js';

function makeProject(name) {
  const project = createProject(4, 4, getPalette('grayscale-4'));
  project.name = name;
  return project;
}

test('workspace creates independent document tabs and activates the newest one', () => {
  const workspace = createWorkspace();
  const first = addDocument(workspace, makeProject('First'));
  const second = addDocument(workspace, makeProject('Second'));
  assert.equal(workspace.documents.length, 2);
  assert.equal(getActiveDocument(workspace).id, second.id);
  activateDocument(workspace, first.id);
  assert.equal(getActiveDocument(workspace).project.name, 'First');
  assert.notEqual(first.project.source, second.project.source);
});

test('closing the active document selects a remaining tab and closing the last clears active id', () => {
  const workspace = createWorkspace();
  const first = addDocument(workspace, makeProject('First'));
  const second = addDocument(workspace, makeProject('Second'));
  closeDocument(workspace, second.id);
  assert.equal(getActiveDocument(workspace).id, first.id);
  closeDocument(workspace, first.id);
  assert.equal(workspace.activeDocumentId, null);
  assert.equal(getActiveDocument(workspace), null);
});

test('activating or closing an unknown document id is rejected', () => {
  const workspace = createWorkspace();
  assert.throws(() => activateDocument(workspace, 'missing'), RangeError);
  assert.throws(() => closeDocument(workspace, 'missing'), RangeError);
});
