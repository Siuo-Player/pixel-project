import { createSourceGrid, cloneGrid, setPixel, paintLine, BLACK, WHITE, TRANSPARENT } from './core/grid.js';
import { drawRectangle, drawEllipse, floodFill } from './core/drawing-tools.js';
import { createHistory, recordHistory, undoGrid, redoGrid } from './core/history.js';
import { createWorkspace, addDocument, activateDocument, closeDocument, getActiveDocument } from './core/workspace.js';
import { flipHorizontal, flipVertical, rotateGrid } from './core/transforms.js';
import { createProject, serializeProject, parseProject } from './core/project.js';
import { listPalettes, getPalette, createCustomPalette } from './engine/palettes.js';
import { TECHNIQUE_CATALOG, createTechniqueInstance } from './engine/techniques.js';
import { convertProject } from './engine/convert.js';
import { getCanvasGeometry, pointerToGrid } from './ui/canvas-coordinates.js';

const $ = selector => document.querySelector(selector);
const DEFAULT_PALETTE_BY_SIZE = {
  4: 'blue-red-4',
  8: 'retro-8',
  12: 'aurora-12'
};
const TRANSPARENT_CELL_COLORS = [
  [48, 54, 65, 255],
  [65, 73, 86, 255]
];
const sourceCanvas = $('#source-canvas');
const outputCanvas = $('#output-canvas');
const workspace = $('#workspace');
const sourceContext = sourceCanvas.getContext('2d');
const outputContext = outputCanvas.getContext('2d');

let project = null;
let converted = null;
let activeTool = BLACK;
let selectedTool = 'black';
let workspaceState = createWorkspace();
let activeDocument = null;
let history = createHistory();
let shapeStart = null;
let shapeEnd = null;
let shapeBaseGrid = null;
let isDrawing = false;
let lastPaintCell = null;
let isPanning = false;
let panStart = null;
let spaceHeld = false;
let camera = { zoom: 1, panX: 0, panY: 0 };
let setupCustom = false;
let editorCustom = false;
let setupCustomColors = [];
let editorCustomColors = [];
let toastTimer;

function toast(message, kind = 'info') {
  const element = $('#toast');
  element.textContent = message;
  element.dataset.kind = kind;
  element.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { element.hidden = true; }, 3200);
}

function saveActiveDocumentState() {
  if (!activeDocument) return;
  activeDocument.project = project;
  activeDocument.converted = converted;
  activeDocument.camera = camera;
  activeDocument.selectedTool = selectedTool;
  activeDocument.paintState = activeTool;
  activeDocument.history = history;
}

function loadDocument(documentState) {
  activeDocument = documentState;
  project = documentState.project;
  converted = documentState.converted;
  camera = documentState.camera;
  selectedTool = documentState.selectedTool ?? 'black';
  activeTool = documentState.paintState ?? BLACK;
  history = documentState.history;
  editorCustom = false;
  setActiveTool(selectedTool);
}

function renderDocumentTabs() {
  const container = $('#document-tabs');
  container.replaceChildren();
  for (const doc of workspaceState.documents) {
    const group = document.createElement('div');
    group.className = 'document-tab-group';
    const tab = document.createElement('button');
    tab.type = 'button';
    tab.className = 'document-tab';
    tab.dataset.documentTab = '';
    tab.dataset.documentId = doc.id;
    tab.setAttribute('role', 'tab');
    tab.setAttribute('aria-selected', String(doc.id === activeDocument?.id));
    tab.classList.toggle('is-active', doc.id === activeDocument?.id);
    const name = document.createElement('span');
    name.textContent = doc.project.name || 'Tela sem nome';
    tab.append(name);
    tab.addEventListener('click', () => switchDocument(doc.id));
    const close = document.createElement('button');
    close.type = 'button';
    close.className = 'document-tab-close';
    close.textContent = '×';
    close.title = 'Fechar esta tela';
    close.setAttribute('aria-label', `Fechar ${doc.project.name || 'tela'}`);
    close.addEventListener('click', event => {
      event.stopPropagation();
      closeDocumentTab(doc.id);
    });
    group.append(tab, close);
    container.append(group);
  }
  $('#resume-project').hidden = workspaceState.documents.length === 0;
  $('#close-document').hidden = !activeDocument;
  updateHistoryButtons();
}

function updateHistoryButtons() {
  if (!$('#undo-action')) return;
  $('#undo-action').disabled = !history.undo.length;
  $('#redo-action').disabled = !history.redo.length;
  $('#menu-undo').disabled = !history.undo.length;
  $('#menu-redo').disabled = !history.redo.length;
}

function markDocumentDirty() {
  if (activeDocument) {
    activeDocument.dirty = true;
    renderDocumentTabs();
  }
}

function showSetup() {
  saveActiveDocumentState();
  $('#setup-view').hidden = false;
  $('#editor-view').hidden = true;
  $('#project-name').hidden = true;
  $('#back-to-setup').hidden = true;
  $('#close-document').hidden = true;
  $('#editor-menu-bar').hidden = true;
  $('#export-project').hidden = true;
  $('#resume-project').hidden = workspaceState.documents.length === 0;
  $('#footer-status').textContent = workspaceState.documents.length
    ? `${workspaceState.documents.length} tela(s) aberta(s)`
    : 'Sem projeto aberto';
}

function showEditor() {
  if (!project || !activeDocument) return;
  $('#setup-view').hidden = true;
  $('#editor-view').hidden = false;
  $('#editor-menu-bar').hidden = false;
  $('#project-name').hidden = false;
  $('#project-name').textContent = project.name;
  $('#back-to-setup').hidden = false;
  $('#close-document').hidden = false;
  $('#export-project').hidden = false;
  renderDocumentTabs();
  updateEditorControls();
  updateLayout();
  recalculate();
}

function switchDocument(documentId) {
  if (activeDocument?.id === documentId) return;
  saveActiveDocumentState();
  const documentState = activateDocument(workspaceState, documentId);
  loadDocument(documentState);
  showEditor();
}

function closeDocumentTab(documentId) {
  const doc = workspaceState.documents.find(item => item.id === documentId);
  if (!doc) return;
  if (doc.dirty && !confirm(`Fechar "${doc.project.name}"? As alterações não exportadas serão perdidas.`)) return;
  saveActiveDocumentState();
  const wasActive = activeDocument?.id === documentId;
  const next = closeDocument(workspaceState, documentId);
  if (wasActive) {
    if (next) {
      loadDocument(next);
      showEditor();
    } else {
      activeDocument = null;
      project = null;
      converted = null;
      showSetup();
    }
  } else {
    renderDocumentTabs();
  }
}

function resumeEditor() {
  const documentState = getActiveDocument(workspaceState);
  if (!documentState) return;
  loadDocument(documentState);
  showEditor();
}

function createAdditionalDocument() {
  try {
    saveActiveDocumentState();
    const width = project?.source.width ?? Number($('#grid-width').value);
    const height = project?.source.height ?? Number($('#grid-height').value);
    const palette = project?.palette ?? getPalette($('#setup-palette').value || 'blue-red-4');
    const createdProject = createProject(width, height, palette, makeInitialTechniques());
    createdProject.name = `Pixel art ${width}×${height} · ${workspaceState.documents.length + 1}`;
    const documentState = addDocument(workspaceState, createdProject);
    documentState.dirty = true;
    loadDocument(documentState);
    setActiveTool('black');
    showEditor();
  } catch (error) {
    toast(error.message, 'error');
  }
}

function palettesOfSize(count) {
  return listPalettes().filter(item => item.colors.length === count);
}

function fillPaletteSelect(select, count, selectedId) {
  select.replaceChildren();
  for (const palette of palettesOfSize(count)) {
    const option = document.createElement('option');
    option.value = palette.id;
    option.textContent = palette.name;
    select.append(option);
  }
  if (selectedId && ![...select.options].some(option => option.value === selectedId)) {
    const option = document.createElement('option');
    option.value = selectedId;
    option.textContent = 'Paleta personalizada';
    select.append(option);
  }
  if (selectedId) select.value = selectedId;
  if (!select.value && select.options.length) select.selectedIndex = 0;
}

function renderSwatches(container, colors) {
  container.replaceChildren();
  colors.forEach((color, index) => {
    const swatch = document.createElement('span');
    swatch.className = 'palette-swatch';
    swatch.style.backgroundColor = color;
    swatch.title = `Cor ${index + 1}: ${color}`;
    swatch.setAttribute('aria-label', `Cor ${index + 1}: ${color}`);
    container.append(swatch);
  });
}

function renderColorInputs(container, colors, onChange) {
  container.replaceChildren();
  colors.forEach((color, index) => {
    const label = document.createElement('label');
    label.className = 'color-picker';
    const input = document.createElement('input');
    input.type = 'color';
    input.value = color;
    input.setAttribute('aria-label', `Editar cor ${index + 1}`);
    input.addEventListener('input', () => onChange(index, input.value));
    const number = document.createElement('span');
    number.textContent = String(index + 1).padStart(2, '0');
    label.append(input, number);
    container.append(label);
  });
}

function refreshSetupPalette() {
  const palette = getPalette($('#setup-palette').value);
  setupCustomColors = [...palette.colors];
  renderSwatches($('#setup-palette-swatches'), setupCustom ? setupCustomColors : palette.colors);
  $('#setup-custom-colors').hidden = !setupCustom;
  if (setupCustom) {
    renderColorInputs($('#setup-custom-colors'), setupCustomColors, (index, color) => {
      setupCustomColors[index] = color;
      renderSwatches($('#setup-palette-swatches'), setupCustomColors);
    });
  }
}

function makeInitialTechniques() {
  return [
    createTechniqueInstance('weighted-neighbourhood', { radius: 1, kernel: 'uniform' }, { weight: 1 }),
    createTechniqueInstance('directional-lines', { radius: 2, maxLength: 5, contrastBoost: 1.15 }, { weight: 0.65 }),
    createTechniqueInstance('local-entropy', { radius: 2, contrastBoost: 0.6 }, { weight: 0.35 })
  ];
}

function createNewProject() {
  try {
    const width = Number($('#grid-width').value);
    const height = Number($('#grid-height').value);
    if (!Number.isInteger(width) || !Number.isInteger(height) || width < 4 || height < 4 || width > 256 || height > 256 || width * height > 65_536) {
      throw new RangeError('Usa dimensões entre 4 e 256 pixels e um máximo de 65 536 pixels no total.');
    }
    let palette = getPalette($('#setup-palette').value);
    if (setupCustom) {
      palette = createCustomPalette(`custom-${Date.now()}`, setupCustomColors, setupCustomColors.map((_, i) => setupCustomColors.length - 1 - i), 'Paleta personalizada');
    }
    const createdProject = createProject(width, height, palette, makeInitialTechniques());
    createdProject.name = `Pixel art ${width}×${height}`;
    const documentState = addDocument(workspaceState, createdProject);
    documentState.dirty = true;
    loadDocument(documentState);
    setActiveTool('black');
    showEditor();
  } catch (error) {
    toast(error.message, 'error');
  }
}

const outputConfig = () => project.outputs[0];

function hexToRgba(hex) {
  const value = hex.slice(1);
  return [parseInt(value.slice(0, 2), 16), parseInt(value.slice(2, 4), 16), parseInt(value.slice(4, 6), 16), 255];
}

function getPaletteForCanvas() {
  return project.palette.colors;
}

function drawGrid(canvas, context, grid, paletteColors = null) {
  if (!grid) return;
  const width = Math.max(1, canvas.clientWidth);
  const height = Math.max(1, canvas.clientHeight);
  const dpr = Math.max(1, window.devicePixelRatio || 1);
  const pixelWidth = Math.round(width * dpr);
  const pixelHeight = Math.round(height * dpr);
  if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
    canvas.width = pixelWidth;
    canvas.height = pixelHeight;
  }
  context.setTransform(dpr, 0, 0, dpr, 0, 0);
  context.clearRect(0, 0, width, height);
  // The area outside the artwork is a neutral matte, not a fake pixel grid.
  context.fillStyle = '#20232b';
  context.fillRect(0, 0, width, height);
  const geometry = getCanvasGeometry(width, height, grid, camera);
  const buffer = document.createElement('canvas');
  buffer.width = grid.width;
  buffer.height = grid.height;
  const bufferContext = buffer.getContext('2d');
  const image = bufferContext.createImageData(grid.width, grid.height);
  for (let i = 0; i < grid.data.length; i += 1) {
    const value = grid.data[i];
    const x = i % grid.width;
    const y = Math.floor(i / grid.width);
    const transparentColor = TRANSPARENT_CELL_COLORS[(x + y) % 2];
    let rgba = transparentColor;
    if (paletteColors) {
      if (value >= 0) rgba = hexToRgba(paletteColors[value]);
    } else if (value === BLACK) rgba = [15, 16, 19, 255];
    else if (value === WHITE) rgba = [247, 247, 244, 255];
    const offset = i * 4;
    image.data[offset] = rgba[0];
    image.data[offset + 1] = rgba[1];
    image.data[offset + 2] = rgba[2];
    image.data[offset + 3] = rgba[3];
  }
  bufferContext.putImageData(image, 0, 0);
  context.imageSmoothingEnabled = false;
  context.drawImage(buffer, geometry.x, geometry.y, geometry.width, geometry.height);
  if (geometry.scale >= 3.5) {
    context.beginPath();
    context.strokeStyle = 'rgba(15, 18, 24, 0.24)';
    context.lineWidth = Math.max(0.35, Math.min(0.85, 0.65 / camera.zoom));
    for (let x = 0; x <= grid.width; x += 1) {
      const px = geometry.x + x * geometry.scale;
      context.moveTo(px, geometry.y);
      context.lineTo(px, geometry.y + geometry.height);
    }
    for (let y = 0; y <= grid.height; y += 1) {
      const py = geometry.y + y * geometry.scale;
      context.moveTo(geometry.x, py);
      context.lineTo(geometry.x + geometry.width, py);
    }
    context.stroke();
  }

  // A clear outline identifies the exact rectangle containing editable grid cells.
  context.strokeStyle = 'rgba(220, 230, 242, 0.62)';
  context.lineWidth = 1;
  context.strokeRect(
    geometry.x + 0.5,
    geometry.y + 0.5,
    Math.max(0, geometry.width - 1),
    Math.max(0, geometry.height - 1)
  );
}

function drawAll() {
  if (!project) return;
  drawGrid(sourceCanvas, sourceContext, project.source);
  if (converted) drawGrid(outputCanvas, outputContext, converted, getPaletteForCanvas());
  $('#source-dimensions').textContent = `${project.source.width} × ${project.source.height}`;
  $('#output-dimensions').textContent = `${converted?.width ?? project.source.width} × ${converted?.height ?? project.source.height}`;
  $('#zoom-label').textContent = `${Math.round(camera.zoom * 100)}%`;
}

function recalculate() {
  if (!project) return;
  try {
    project.resolverMode = $('#resolver-mode').value;
    outputConfig().resolverMode = project.resolverMode;
    converted = convertProject(project);
    drawAll();
    if (activeDocument) activeDocument.converted = converted;
    $('#engine-status').textContent = `${outputConfig().techniques.filter(item => item.enabled).length} técnicas · ${project.source.width * project.source.height} pixels`;
    $('#footer-status').textContent = `${project.source.width} × ${project.source.height} · ${project.palette.colors.length} cores`;
  } catch (error) {
    $('#engine-status').textContent = 'Erro na conversão';
    toast(`Erro no motor: ${error.message}`, 'error');
  }
}

function updateLayout() {
  if ($('#editor-view').hidden) return;
  const mode = $('#layout-mode').value;
  workspace.dataset.layout = mode;

  // Base auto layout on the usable viewport, not the settings panel's content height.
  // The settings column can grow as techniques are added, but that must not rotate
  // the canvas workspace into a vertical arrangement on a wide desktop.
  const bounds = workspace.getBoundingClientRect();
  const availableHeight = Math.max(1, window.innerHeight - bounds.top - 24);
  const effectiveHeight = Math.min(workspace.clientHeight || availableHeight, availableHeight);
  const horizontal = mode === 'side-by-side'
    || (mode === 'auto' && bounds.width >= effectiveHeight);
  workspace.dataset.flow = horizontal ? 'horizontal' : 'vertical';
}

function setActiveTool(name) {
  const paintStates = { black: BLACK, white: WHITE, erase: TRANSPARENT };
  if (Object.hasOwn(paintStates, name)) activeTool = paintStates[name];
  selectedTool = name;
  document.querySelectorAll('[data-tool]').forEach(button => {
    const active = button.dataset.tool === name;
    button.classList.toggle('is-active', active);
    button.setAttribute('aria-pressed', String(active));
  });
  sourceCanvas.style.cursor = name === 'eyedropper' ? 'copy' : name === 'fill' ? 'cell' : 'crosshair';
  if (activeDocument) {
    activeDocument.selectedTool = selectedTool;
    activeDocument.paintState = activeTool;
  }
}

function isShapeTool(name = selectedTool) {
  return ['line', 'rectangle', 'filled-rectangle', 'ellipse'].includes(name);
}

function applyShape(grid, start, end, tool = selectedTool, state = activeTool) {
  if (tool === 'line') paintLine(grid, start.x, start.y, end.x, end.y, state);
  else if (tool === 'rectangle') drawRectangle(grid, start.x, start.y, end.x, end.y, state);
  else if (tool === 'filled-rectangle') drawRectangle(grid, start.x, start.y, end.x, end.y, state, { filled: true });
  else if (tool === 'ellipse') drawEllipse(grid, start.x, start.y, end.x, end.y, state);
}

function undoAction() {
  if (!project) return;
  const restored = undoGrid(history, project.source);
  if (!restored) return;
  project.source = restored;
  markDocumentDirty();
  recalculate();
  updateHistoryButtons();
}

function redoAction() {
  if (!project) return;
  const restored = redoGrid(history, project.source);
  if (!restored) return;
  project.source = restored;
  markDocumentDirty();
  recalculate();
  updateHistoryButtons();
}

function cellFromPointer(canvas, event) {
  return pointerToGrid(event.clientX, event.clientY, canvas.getBoundingClientRect(), project.source, camera);
}

function startDrawing(event) {
  if (!project || event.button !== 0 || spaceHeld) return;
  event.preventDefault();
  const cell = cellFromPointer(sourceCanvas, event);
  if (!cell) return;

  if (selectedTool === 'eyedropper') {
    const picked = project.source.data[cell.y * project.source.width + cell.x];
    setActiveTool(picked === BLACK ? 'black' : picked === WHITE ? 'white' : 'erase');
    return;
  }
  if (selectedTool === 'fill') {
    if (project.source.data[cell.y * project.source.width + cell.x] === activeTool) return;
    recordHistory(history, project.source);
    const changed = floodFill(project.source, cell.x, cell.y, activeTool);
    if (changed) {
      markDocumentDirty();
      recalculate();
    }
    updateHistoryButtons();
    return;
  }

  isDrawing = true;
  lastPaintCell = cell;
  shapeStart = cell;
  shapeEnd = cell;
  sourceCanvas.setPointerCapture(event.pointerId);
  recordHistory(history, project.source);
  markDocumentDirty();
  if (isShapeTool()) {
    shapeBaseGrid = cloneGrid(project.source);
  } else {
    setPixel(project.source, cell.x, cell.y, activeTool);
    recalculate();
  }
  updateHistoryButtons();
}

function continueDrawing(event) {
  if (!isDrawing || !project) return;
  const cell = cellFromPointer(sourceCanvas, event);
  if (!cell) return;
  if (isShapeTool()) {
    shapeEnd = cell;
    const preview = cloneGrid(shapeBaseGrid);
    applyShape(preview, shapeStart, shapeEnd);
    drawGrid(sourceCanvas, sourceContext, preview);
    return;
  }
  paintLine(project.source, lastPaintCell.x, lastPaintCell.y, cell.x, cell.y, activeTool);
  lastPaintCell = cell;
  recalculate();
}

function stopDrawing() {
  if (isDrawing && project && isShapeTool() && shapeBaseGrid && shapeStart && shapeEnd) {
    applyShape(project.source, shapeStart, shapeEnd);
    recalculate();
  }
  isDrawing = false;
  lastPaintCell = null;
  shapeStart = null;
  shapeEnd = null;
  shapeBaseGrid = null;
}

function startPanning(event) {
  if (!project || !(spaceHeld || event.button === 1 || event.button === 2)) return;
  event.preventDefault();
  isPanning = true;
  panStart = { x: event.clientX, y: event.clientY, panX: camera.panX, panY: camera.panY };
  event.currentTarget.setPointerCapture?.(event.pointerId);
}

function movePanning(event) {
  if (!isPanning || !panStart) return;
  camera.panX = panStart.panX + event.clientX - panStart.x;
  camera.panY = panStart.panY + event.clientY - panStart.y;
  drawAll();
}

function stopPanning() { isPanning = false; panStart = null; }
function updateZoom(factor) { camera.zoom = Math.max(0.25, Math.min(24, camera.zoom * factor)); drawAll(); }

function renderRange(parent, caption, min, max, step, value, onChange) {
  const label = document.createElement('label');
  label.className = 'range-control';
  const title = document.createElement('span');
  title.textContent = caption;
  const input = document.createElement('input');
  input.type = 'range';
  input.min = String(min);
  input.max = String(max);
  input.step = String(step);
  input.value = String(value);
  input.addEventListener('change', () => onChange(Number(input.value)));
  label.append(title, input);
  parent.append(label);
}

function renderTechniqueList() {
  if (!project) return;
  const list = $('#technique-list');
  list.replaceChildren();
  const techniques = outputConfig().techniques;
  $('#technique-count').textContent = String(techniques.length);
  techniques.forEach((instance, index) => {
    const card = document.createElement('article');
    card.className = 'technique-card';
    const header = document.createElement('div');
    header.className = 'technique-card-header';
    const title = document.createElement('strong');
    title.textContent = `${String(index + 1).padStart(2, '0')} · ${instance.name}`;
    const remove = document.createElement('button');
    remove.className = 'remove-technique';
    remove.type = 'button';
    remove.textContent = '×';
    remove.title = 'Remover instância';
    remove.setAttribute('aria-label', `Remover ${instance.name}`);
    remove.addEventListener('click', () => {
      outputConfig().techniques = outputConfig().techniques.filter(item => item.id !== instance.id);
      markDocumentDirty();
      renderTechniqueList();
      recalculate();
    });
    header.append(title, remove);
    card.append(header);
    const enabledLabel = document.createElement('label');
    enabledLabel.className = 'checkbox-field';
    const enabled = document.createElement('input');
    enabled.type = 'checkbox';
    enabled.checked = instance.enabled;
    enabled.addEventListener('change', () => {
      instance.enabled = enabled.checked;
      markDocumentDirty();
      recalculate();
    });
    enabledLabel.append(enabled, document.createTextNode(' Ativa'));
    card.append(enabledLabel);
    renderRange(card, `Peso ${instance.weight.toFixed(2)}`, 0, 2, 0.05, instance.weight, value => {
      instance.weight = value;
      markDocumentDirty();
      renderTechniqueList();
      recalculate();
    });
    if (instance.params.radius !== undefined) {
      renderRange(card, `Raio ${instance.params.radius}`, 0, 8, 1, instance.params.radius, value => {
        instance.params.radius = value;
        markDocumentDirty();
        renderTechniqueList();
        recalculate();
      });
    }
    if (instance.params.contrastBoost !== undefined) {
      renderRange(card, `Intensidade ${instance.params.contrastBoost.toFixed(1)}`, 0, 2, 0.1, instance.params.contrastBoost, value => {
        instance.params.contrastBoost = value;
        markDocumentDirty();
        renderTechniqueList();
        recalculate();
      });
    }
    if (instance.params.kernel !== undefined) {
      const label = document.createElement('label');
      label.className = 'field compact-field mini-field';
      const titleText = document.createElement('span');
      titleText.textContent = 'Distribuição espacial';
      const select = document.createElement('select');
      for (const key of ['uniform', 'inverse-distance', 'gaussian']) {
        const option = document.createElement('option');
        option.value = key;
        option.textContent = key === 'uniform' ? 'Uniforme' : key === 'gaussian' ? 'Gaussiana' : 'Inversa da distância';
        select.append(option);
      }
      select.value = instance.params.kernel;
      select.addEventListener('change', () => {
        instance.params.kernel = select.value;
        markDocumentDirty();
        recalculate();
      });
      label.append(titleText, select);
      card.append(label);
    }
    list.append(card);
  });
}

function updateEditorControls() {
  const palette = project.palette;
  fillPaletteSelect($('#editor-palette'), palette.colors.length, palette.id);
  $('#editor-color-count-select').value = String(palette.colors.length);
  $('#editor-color-count').textContent = `${palette.colors.length} cores`;
  renderSwatches($('#editor-palette-swatches'), palette.colors);
  $('#resolver-mode').value = outputConfig().resolverMode ?? project.resolverMode ?? 'weighted-average';
  $('#new-technique').replaceChildren();
  for (const definition of TECHNIQUE_CATALOG) {
    const option = document.createElement('option');
    option.value = definition.id;
    option.textContent = definition.name;
    $('#new-technique').append(option);
  }
  renderTechniqueList();
}

function setProjectPalette(palette) {
  project.palette = palette;
  outputConfig().palette = palette;
  fillPaletteSelect($('#editor-palette'), palette.colors.length, palette.id);
  $('#editor-color-count-select').value = String(palette.colors.length);
  renderSwatches($('#editor-palette-swatches'), palette.colors);
  $('#editor-color-count').textContent = `${palette.colors.length} cores`;
  markDocumentDirty();
  recalculate();
}

function changeEditorPaletteSize() {
  const count = Number($('#editor-color-count-select').value);
  const paletteId = DEFAULT_PALETTE_BY_SIZE[count];
  if (!paletteId) return;
  editorCustom = false;
  $('#editor-custom-colors').hidden = true;
  $('#editor-custom-toggle').textContent = 'Editar cores desta paleta';
  setProjectPalette(getPalette(paletteId));
}

function addTechnique() {
  outputConfig().techniques.push(createTechniqueInstance($('#new-technique').value));
  markDocumentDirty();
  renderTechniqueList();
  recalculate();
}

function exportProject() {
  if (!project) return;
  const blob = new Blob([serializeProject(project)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `${project.name.toLowerCase().replace(/[^a-z0-9-]+/g, '-')}.pixelproj`;
  anchor.click();
  URL.revokeObjectURL(url);
  if (activeDocument) {
    activeDocument.dirty = false;
    renderDocumentTabs();
  }
  toast('Projeto exportado.', 'success');
}

async function importProject(file) {
  if (!file) return;
  try {
    saveActiveDocumentState();
    const importedProject = parseProject(await file.text());
    const documentState = addDocument(workspaceState, importedProject);
    documentState.dirty = false;
    loadDocument(documentState);
    showEditor();
    toast('Projeto importado como uma nova tela.', 'success');
  } catch (error) {
    toast(`Não foi possível importar: ${error.message}`, 'error');
  }
}

function transformSource(transform) {
  if (!project) return;
  recordHistory(history, project.source);
  project.source = transform(project.source);
  markDocumentDirty();
  updateHistoryButtons();
  recalculate();
  toast('Imagem original transformada.', 'success');
}

function attachCanvasEvents(canvas, editable) {
  canvas.addEventListener('pointerdown', event => {
    if (spaceHeld || event.button === 1 || event.button === 2) startPanning(event);
    else if (editable) startDrawing(event);
  });
  canvas.addEventListener('pointermove', event => {
    if (isPanning) movePanning(event);
    else if (editable) continueDrawing(event);
  });
  canvas.addEventListener('pointerup', () => { stopDrawing(); stopPanning(); });
  canvas.addEventListener('pointercancel', () => { stopDrawing(); stopPanning(); });
  canvas.addEventListener('lostpointercapture', () => { stopDrawing(); stopPanning(); });
  canvas.addEventListener('contextmenu', event => event.preventDefault());
  canvas.addEventListener('wheel', event => {
    event.preventDefault();
    updateZoom(event.deltaY < 0 ? 1.12 : 1 / 1.12);
  }, { passive: false });
}

function initialize() {
  fillPaletteSelect($('#setup-palette'), 4, 'blue-red-4');
  refreshSetupPalette();
  $('#color-count').addEventListener('change', () => {
    const count = Number($('#color-count').value);
    fillPaletteSelect($('#setup-palette'), count, DEFAULT_PALETTE_BY_SIZE[count] ?? 'blue-red-4');
    setupCustom = false;
    $('#toggle-custom-palette').textContent = 'Personalizar cores';
    refreshSetupPalette();
  });
  $('#setup-palette').addEventListener('change', refreshSetupPalette);
  $('#toggle-custom-palette').addEventListener('click', () => {
    setupCustom = !setupCustom;
    $('#toggle-custom-palette').textContent = setupCustom ? 'Usar paleta predefinida' : 'Personalizar cores';
    refreshSetupPalette();
  });
  $('#create-project').addEventListener('click', createNewProject);
  $('#resume-project').addEventListener('click', resumeEditor);
  $('#new-document').addEventListener('click', createAdditionalDocument);
  $('#close-document').addEventListener('click', () => activeDocument && closeDocumentTab(activeDocument.id));
  $('#menu-new-document').addEventListener('click', createAdditionalDocument);
  $('#menu-import-project').addEventListener('click', () => $('#import-project-file').click());
  $('#menu-export-project').addEventListener('click', exportProject);
  $('#menu-close-document').addEventListener('click', () => activeDocument && closeDocumentTab(activeDocument.id));
  $('#menu-home').addEventListener('click', showSetup);
  $('#menu-undo').addEventListener('click', undoAction);
  $('#menu-redo').addEventListener('click', redoAction);
  $('#menu-clear').addEventListener('click', () => $('#clear-canvas').click());
  $('#menu-reset-zoom').addEventListener('click', () => {
    camera = { zoom: 1, panX: 0, panY: 0 };
    drawAll();
  });
  document.querySelectorAll('.app-menu button').forEach(button => {
    button.addEventListener('click', () => button.closest('details').removeAttribute('open'));
  });

  document.querySelectorAll('[data-tool]').forEach(button => button.addEventListener('click', () => setActiveTool(button.dataset.tool)));
  $('#flip-horizontal').addEventListener('click', () => transformSource(flipHorizontal));
  $('#flip-vertical').addEventListener('click', () => transformSource(flipVertical));
  $('#rotate-left').addEventListener('click', () => transformSource(grid => rotateGrid(grid, 270)));
  $('#rotate-right').addEventListener('click', () => transformSource(grid => rotateGrid(grid, 90)));
  $('#zoom-in').addEventListener('click', () => updateZoom(1.2));
  $('#zoom-out').addEventListener('click', () => updateZoom(1 / 1.2));
  $('#zoom-reset').addEventListener('click', () => { camera = { zoom: 1, panX: 0, panY: 0 }; drawAll(); });
  $('#layout-mode').addEventListener('change', () => { updateLayout(); drawAll(); });
  $('#add-technique').addEventListener('click', addTechnique);
  $('#undo-action').addEventListener('click', undoAction);
  $('#redo-action').addEventListener('click', redoAction);
  $('#editor-color-count-select').addEventListener('change', changeEditorPaletteSize);
  $('#resolver-mode').addEventListener('change', () => {
    project.resolverMode = $('#resolver-mode').value;
    markDocumentDirty();
    outputConfig().resolverMode = project.resolverMode;
    recalculate();
  });
  $('#clear-canvas').addEventListener('click', () => {
    if (!project) return;
    recordHistory(history, project.source);
    project.source = createSourceGrid(project.source.width, project.source.height);
    markDocumentDirty();
    updateHistoryButtons();
    recalculate();
  });
  $('#editor-palette').addEventListener('change', () => {
    editorCustom = false;
    setProjectPalette(getPalette($('#editor-palette').value));
    $('#editor-custom-colors').hidden = true;
    $('#editor-custom-toggle').textContent = 'Editar cores desta paleta';
  });
  $('#editor-custom-toggle').addEventListener('click', () => {
    editorCustom = !editorCustom;
    $('#editor-custom-colors').hidden = !editorCustom;
    $('#editor-custom-toggle').textContent = editorCustom ? 'Terminar edição da paleta' : 'Editar cores desta paleta';
    if (editorCustom) {
      editorCustomColors = [...project.palette.colors];
      renderColorInputs($('#editor-custom-colors'), editorCustomColors, (index, color) => {
        editorCustomColors[index] = color;
        setProjectPalette(createCustomPalette(`custom-${Date.now()}`, editorCustomColors, project.palette.mirror, 'Paleta personalizada'));
      });
    }
  });
  $('#back-to-setup').addEventListener('click', showSetup);
  $('#export-project').addEventListener('click', exportProject);
  $('#import-project-button').addEventListener('click', () => $('#import-project-file').click());
  $('#import-project-file').addEventListener('change', event => importProject(event.target.files?.[0]));

  attachCanvasEvents(sourceCanvas, true);
  attachCanvasEvents(outputCanvas, false);
  window.addEventListener('pointerup', () => { stopDrawing(); stopPanning(); });
  window.addEventListener('keydown', event => {
    const typing = ['INPUT', 'SELECT', 'TEXTAREA'].includes(document.activeElement?.tagName);
    if ((event.ctrlKey || event.metaKey) && !typing) {
      const key = event.key.toLowerCase();
      if (key === 'z') {
        event.preventDefault();
        if (event.shiftKey) redoAction(); else undoAction();
        return;
      }
      if (key === 'y') { event.preventDefault(); redoAction(); return; }
      if (key === 'n') { event.preventDefault(); createAdditionalDocument(); return; }
      if (key === 's') { event.preventDefault(); exportProject(); return; }
      if (key === 'w') { event.preventDefault(); if (activeDocument) closeDocumentTab(activeDocument.id); return; }
    }
    if (event.code === 'Space' && !typing) {
      spaceHeld = true;
      event.preventDefault();
    }
  });
  window.addEventListener('keyup', event => { if (event.code === 'Space') spaceHeld = false; });
  window.addEventListener('blur', () => { spaceHeld = false; stopDrawing(); stopPanning(); });
  if ('ResizeObserver' in window) {
    const observer = new ResizeObserver(() => { updateLayout(); drawAll(); });
    observer.observe(workspace);
  } else {
    window.addEventListener('resize', () => { updateLayout(); drawAll(); });
  }
  showSetup();
}

initialize();
