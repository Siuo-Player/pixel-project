import { createHistory } from './history.js';

function makeDocumentId() {
  return globalThis.crypto?.randomUUID?.() ?? `document-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function createWorkspace() {
  return { documents: [], activeDocumentId: null };
}

export function addDocument(workspace, project) {
  if (!workspace || !Array.isArray(workspace.documents) || !project) throw new TypeError('Workspace and project are required.');
  const document = {
    id: makeDocumentId(),
    project,
    converted: null,
    selectedTool: 'black',
    paintState: 1,
    camera: { zoom: 1, panX: 0, panY: 0 },
    history: createHistory(),
    dirty: false
  };
  workspace.documents.push(document);
  workspace.activeDocumentId = document.id;
  return document;
}

export function getActiveDocument(workspace) {
  return workspace.documents.find(document => document.id === workspace.activeDocumentId) ?? null;
}

export function activateDocument(workspace, documentId) {
  const document = workspace.documents.find(item => item.id === documentId);
  if (!document) throw new RangeError(`Unknown document: ${documentId}`);
  workspace.activeDocumentId = document.id;
  return document;
}

export function closeDocument(workspace, documentId) {
  const index = workspace.documents.findIndex(item => item.id === documentId);
  if (index < 0) throw new RangeError(`Unknown document: ${documentId}`);
  const wasActive = workspace.activeDocumentId === documentId;
  workspace.documents.splice(index, 1);
  if (!workspace.documents.length) {
    workspace.activeDocumentId = null;
  } else if (wasActive) {
    workspace.activeDocumentId = workspace.documents[Math.min(index, workspace.documents.length - 1)].id;
  }
  return getActiveDocument(workspace);
}
