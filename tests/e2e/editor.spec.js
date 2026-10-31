import { test, expect } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const screenshotDirectory = path.resolve(process.cwd(), 'artifacts', 'screenshots');

async function capture(page, name) {
  await mkdir(screenshotDirectory, { recursive: true });
  const image = await page.screenshot({ fullPage: true, animations: 'disabled' });
  await writeFile(path.join(screenshotDirectory, name), image);
  await test.info().attach(name, { body: image, contentType: 'image/png' });
}

async function cellPoint(page, selector, gridWidth, gridHeight, x, y) {
  return page.locator(selector).evaluate((canvas, cell) => {
    const rect = canvas.getBoundingClientRect();
    const scale = Math.min(rect.width / cell.width, rect.height / cell.height);
    const offsetX = (rect.width - cell.width * scale) / 2;
    const offsetY = (rect.height - cell.height * scale) / 2;
    return {
      x: rect.left + offsetX + (cell.x + 0.5) * scale,
      y: rect.top + offsetY + (cell.y + 0.5) * scale
    };
  }, { width: gridWidth, height: gridHeight, x, y });
}

async function sampleCell(page, selector, gridWidth, gridHeight, x, y) {
  return page.locator(selector).evaluate((canvas, cell) => {
    const rect = canvas.getBoundingClientRect();
    const scale = Math.min(rect.width / cell.width, rect.height / cell.height);
    const offsetX = (rect.width - cell.width * scale) / 2;
    const offsetY = (rect.height - cell.height * scale) / 2;
    const ratioX = canvas.width / rect.width;
    const ratioY = canvas.height / rect.height;
    const px = Math.max(0, Math.min(canvas.width - 1, Math.floor((offsetX + (cell.x + 0.5) * scale) * ratioX)));
    const py = Math.max(0, Math.min(canvas.height - 1, Math.floor((offsetY + (cell.y + 0.5) * scale) * ratioY)));
    return Array.from(canvas.getContext('2d').getImageData(px, py, 1, 1).data);
  }, { width: gridWidth, height: gridHeight, x, y });
}

async function sampleCanvasRatio(page, selector, xRatio, yRatio) {
  return page.locator(selector).evaluate((canvas, point) => {
    const x = Math.max(0, Math.min(canvas.width - 1, Math.floor(canvas.width * point.x)));
    const y = Math.max(0, Math.min(canvas.height - 1, Math.floor(canvas.height * point.y)));
    return Array.from(canvas.getContext('2d').getImageData(x, y, 1, 1).data);
  }, { x: xRatio, y: yRatio });
}

async function clickCell(page, selector, gridWidth, gridHeight, x, y) {
  const point = await cellPoint(page, selector, gridWidth, gridHeight, x, y);
  await page.mouse.click(point.x, point.y);
}

function hexFromRgba(rgba) {
  return '#' + rgba.slice(0, 3).map(value => value.toString(16).padStart(2, '0')).join('').toUpperCase();
}

test('fluxo visual completo: desenhar, transformar, configurar e importar/exportar', async ({ page }, testInfo) => {
  const pageErrors = [];
  page.on('pageerror', error => pageErrors.push(error.message));

  await page.goto('/');
  await expect(page).toHaveTitle(/Pixel Project/);
  await expect(page.locator('#setup-view')).toBeVisible();
  await capture(page, '01-setup.png');

  await page.locator('#grid-width').fill('24');
  await page.locator('#grid-height').fill('16');
  await page.locator('#create-project').click();

  await expect(page.locator('#editor-view')).toBeVisible();
  await expect(page.locator('#source-dimensions')).toHaveText('24 × 16');
  await expect(page.locator('#output-canvas')).toBeVisible();
  await capture(page, '02-editor-criado.png');

  const blankBlackCell = await sampleCell(page, '#source-canvas', 24, 16, 5, 5);
  const blankWhiteCell = await sampleCell(page, '#source-canvas', 24, 16, 6, 5);

  await page.getByRole('button', { name: /Preto/ }).click();
  await clickCell(page, '#source-canvas', 24, 16, 5, 5);
  await expect.poll(() => sampleCell(page, '#source-canvas', 24, 16, 5, 5)).toEqual([15, 16, 19, 255]);
  await capture(page, '03-desenho-preto.png');

  await page.getByRole('button', { name: /Branco/ }).click();
  await clickCell(page, '#source-canvas', 24, 16, 6, 5);
  await expect.poll(() => sampleCell(page, '#source-canvas', 24, 16, 6, 5)).toEqual([247, 247, 244, 255]);
  await capture(page, '04-desenho-branco.png');

  await page.getByRole('button', { name: /Apagar/ }).click();
  await clickCell(page, '#source-canvas', 24, 16, 6, 5);
  await expect.poll(() => sampleCell(page, '#source-canvas', 24, 16, 6, 5)).toEqual(blankWhiteCell);
  await capture(page, '05-transparencia.png');

  await page.getByRole('button', { name: 'Espelhar horizontalmente' }).click();
  await expect.poll(() => sampleCell(page, '#source-canvas', 24, 16, 18, 5)).toEqual([15, 16, 19, 255]);
  await capture(page, '06-espelhamento.png');

  await page.getByRole('button', { name: 'Rodar 90 graus à direita' }).click();
  await expect(page.locator('#source-dimensions')).toHaveText('16 × 24');
  await expect.poll(() => sampleCell(page, '#source-canvas', 16, 24, 10, 18)).toEqual([15, 16, 19, 255]);
  await capture(page, '07-rotacao.png');

  await page.locator('#resolver-mode').selectOption('highest-confidence');
  await expect(page.locator('#resolver-mode')).toHaveValue('highest-confidence');
  await page.locator('#new-technique').selectOption('local-entropy');
  await page.locator('#add-technique').click();
  await expect(page.locator('#technique-count')).toHaveText('4');
  await capture(page, '08-tecnicas-e-resolvedor.png');
  // A growing settings list must not force a wide desktop workspace into vertical flow.
  await expect(page.locator('#workspace')).toHaveAttribute('data-flow', 'horizontal');
  const desktopMetrics = await page.evaluate(() => {
    const measure = selector => {
      const element = document.querySelector(selector);
      if (!element) return null;
      const rect = element.getBoundingClientRect();
      return {
        top: Math.round(rect.top),
        bottom: Math.round(rect.bottom),
        height: Math.round(rect.height),
        clientHeight: element.clientHeight,
        scrollHeight: element.scrollHeight,
        overflowY: getComputedStyle(element).overflowY
      };
    };
    return {
      viewportHeight: window.innerHeight,
      documentHeight: document.documentElement.scrollHeight,
      bodyHeight: document.body.scrollHeight,
      shell: measure('.app-shell'),
      main: measure('main'),
      editor: measure('#editor-view'),
      editorLayout: measure('.editor-layout'),
      workspace: measure('#workspace'),
      settings: measure('.settings-panel'),
      footer: measure('.app-footer'),
      overflowingElements: [...document.querySelectorAll('body *')].map(element => {
        const rect = element.getBoundingClientRect();
        const style = getComputedStyle(element);
        return {
          tag: element.tagName,
          id: element.id,
          className: typeof element.className === 'string' ? element.className : '',
          top: Math.round(rect.top),
          bottom: Math.round(rect.bottom),
          height: Math.round(rect.height),
          position: style.position,
          overflowY: style.overflowY
        };
      }).filter(item => item.bottom > window.innerHeight + 2 && item.height > 0)
        .sort((a, b) => b.bottom - a.bottom).slice(0, 20)
    };
  });
  expect(
    desktopMetrics.documentHeight,
    `Desktop editor should fit its viewport: ${JSON.stringify(desktopMetrics)}`
  ).toBeLessThanOrEqual(desktopMetrics.viewportHeight + 2);

  await page.locator('#editor-palette').selectOption('forest-4');
  await expect(page.locator('#editor-color-count')).toHaveText('4 cores');
  const outputPixel = await sampleCell(page, '#output-canvas', 16, 24, 10, 18);
  const outputHex = hexFromRgba(outputPixel);
  expect(['#1D3C35', '#4F8061', '#B6B65D', '#E8D69C']).toContain(outputHex);
  await capture(page, '09-paleta-e-resultado.png');

  await page.locator('#layout-mode').selectOption('side-by-side');
  await expect(page.locator('#workspace')).toHaveAttribute('data-flow', 'horizontal');
  await page.locator('#zoom-in').click();
  await expect(page.locator('#zoom-label')).toHaveText('120%');
  await capture(page, '10-layout-e-zoom.png');

  await page.locator('#clear-canvas').click();
  const clearedPixel = await sampleCell(page, '#source-canvas', 16, 24, 10, 18);
  expect(clearedPixel).not.toEqual([15, 16, 19, 255]);
  expect(clearedPixel).not.toEqual([247, 247, 244, 255]);
  await capture(page, '11-imagem-limpa.png');

  const downloadPromise = page.waitForEvent('download');
  await page.locator('#export-project').click();
  const download = await downloadPromise;
  const exportedProject = testInfo.outputPath(download.suggestedFilename());
  await download.saveAs(exportedProject);
  await expect(page.locator('#toast')).toContainText('Projeto exportado');
  await page.locator('#import-project-file').setInputFiles(exportedProject);
  await expect(page.locator('#toast')).toContainText('Projeto importado com sucesso');
  await expect(page.locator('#source-dimensions')).toHaveText('16 × 24');
  await capture(page, '12-exportacao-importacao.png');

  expect(pageErrors).toEqual([]);
});

test('layout móvel: o editor passa para duas telas empilhadas sem overflow horizontal', async ({ page }) => {
  const pageErrors = [];
  page.on('pageerror', error => pageErrors.push(error.message));

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await capture(page, '13-mobile-setup.png');
  await page.locator('#create-project').click();
  await expect(page.locator('#editor-view')).toBeVisible();
  await expect(page.locator('#workspace')).toHaveAttribute('data-flow', 'vertical');
  const noHorizontalOverflow = await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth);
  expect(noHorizontalOverflow).toBe(true);
  await capture(page, '14-mobile-editor.png');

  expect(pageErrors).toEqual([]);
});


test('12-colour palette selection is available and renders one of its discrete colours', async ({ page }) => {
  const pageErrors = [];
  page.on('pageerror', error => pageErrors.push(error.message));

  await page.goto('/');
  await page.locator('#color-count').selectOption('12');
  await expect(page.locator('#setup-palette')).toHaveValue('aurora-12');
  await expect(page.locator('#setup-palette option')).toHaveCount(3);
  await expect(page.locator('#setup-palette-swatches .palette-swatch')).toHaveCount(12);
  await page.locator('#setup-palette').selectOption('ember-12');
  await expect(page.locator('#setup-palette-swatches .palette-swatch')).toHaveCount(12);

  await page.locator('#grid-width').fill('32');
  await page.locator('#grid-height').fill('16');
  await page.locator('#create-project').click();
  await expect(page.locator('#editor-color-count')).toHaveText('12 cores');
  const swatchOverflow = await page.locator('#editor-palette-swatches').evaluate(container => {
    const bounds = container.getBoundingClientRect();
    const lastSwatch = container.lastElementChild.getBoundingClientRect();
    return lastSwatch.right - bounds.right;
  });
  expect(swatchOverflow).toBeLessThanOrEqual(1);

  await page.getByRole('button', { name: /Preto/ }).click();
  await clickCell(page, '#source-canvas', 32, 16, 15, 8);
  const output = hexFromRgba(await sampleCell(page, '#output-canvas', 32, 16, 15, 8));
  expect([
    '#24162E', '#3D1F3D', '#5B274B', '#7B3150',
    '#A6404D', '#C95645', '#E36F3D', '#F18F3B',
    '#F5B84C', '#F3D56A', '#F5E4A5', '#FFF2D6'
  ]).toContain(output);
  await capture(page, '15-paleta-12-cores.png');
  expect(pageErrors).toEqual([]);
});

test('transparent cells align to real matrix pixels and the area outside the grid is uniform', async ({ page }) => {
  await page.goto('/');
  await page.locator('#grid-width').fill('32');
  await page.locator('#grid-height').fill('16');
  await page.locator('#create-project').click();
  await expect(page.locator('#editor-view')).toBeVisible();

  const firstTransparent = await sampleCell(page, '#source-canvas', 32, 16, 10, 7);
  const nextTransparent = await sampleCell(page, '#source-canvas', 32, 16, 11, 7);
  expect(firstTransparent).not.toEqual(nextTransparent);

  const outsideTop = await sampleCanvasRatio(page, '#source-canvas', 0.04, 0.04);
  const outsideBottom = await sampleCanvasRatio(page, '#source-canvas', 0.04, 0.96);
  expect(outsideTop).toEqual(outsideBottom);
  await capture(page, '16-grelha-pixeis-reais.png');
});

test('multiple document tabs keep independent drawings and support undo/redo and editor palette sizing', async ({ page }) => {
  page.on('dialog', dialog => dialog.accept());
  await page.goto('/');
  await page.locator('#grid-width').fill('16');
  await page.locator('#grid-height').fill('16');
  await page.locator('#create-project').click();
  await expect(page.locator('#document-tabs [data-document-tab]')).toHaveCount(1);
  await page.locator('#new-document').click();
  await expect(page.locator('#document-tabs [data-document-tab]')).toHaveCount(2);

  await page.getByRole('button', { name: /Preto/ }).click();
  await clickCell(page, '#source-canvas', 16, 16, 3, 4);
  await page.locator('#undo-action').click();
  const transparent = await sampleCell(page, '#source-canvas', 16, 16, 3, 4);
  expect(transparent).not.toEqual([15, 16, 19, 255]);
  await page.locator('#redo-action').click();
  await expect.poll(() => sampleCell(page, '#source-canvas', 16, 16, 3, 4)).toEqual([15, 16, 19, 255]);

  await page.locator('#editor-color-count-select').selectOption('12');
  await expect(page.locator('#editor-color-count')).toHaveText('12 cores');
  await expect(page.locator('#editor-palette-swatches .palette-swatch')).toHaveCount(12);

  const firstTab = page.locator('#document-tabs [data-document-tab]').first();
  await firstTab.click();
  await expect.poll(() => sampleCell(page, '#source-canvas', 16, 16, 3, 4)).not.toEqual([15, 16, 19, 255]);
  await page.locator('#document-tabs [data-document-tab]').last().click();
  await expect.poll(() => sampleCell(page, '#source-canvas', 16, 16, 3, 4)).toEqual([15, 16, 19, 255]);

  await page.locator('#close-document').click();
  await expect(page.locator('#document-tabs [data-document-tab]')).toHaveCount(1);
});

test('shape tools draw lines and filled rectangles and ellipses on the actual source matrix', async ({ page }) => {
  await page.goto('/');
  await page.locator('#grid-width').fill('16');
  await page.locator('#grid-height').fill('16');
  await page.locator('#create-project').click();
  const start = await cellPoint(page, '#source-canvas', 16, 16, 2, 2);
  const end = await cellPoint(page, '#source-canvas', 16, 16, 7, 2);
  await page.locator('[data-tool="line"]').click();
  await page.mouse.move(start.x, start.y);
  await page.mouse.down();
  await page.mouse.move(end.x, end.y);
  await page.mouse.up();
  await expect.poll(() => sampleCell(page, '#source-canvas', 16, 16, 5, 2)).toEqual([15, 16, 19, 255]);

  await page.locator('[data-tool="filled-rectangle"]').click();
  const a = await cellPoint(page, '#source-canvas', 16, 16, 8, 8);
  const b = await cellPoint(page, '#source-canvas', 16, 16, 10, 10);
  await page.mouse.move(a.x, a.y);
  await page.mouse.down();
  await page.mouse.move(b.x, b.y);
  await page.mouse.up();
  await expect.poll(() => sampleCell(page, '#source-canvas', 16, 16, 9, 9)).toEqual([15, 16, 19, 255]);

  await page.locator('[data-tool="filled-ellipse"]').click();
  const ellipseA = await cellPoint(page, '#source-canvas', 16, 16, 3, 8);
  const ellipseB = await cellPoint(page, '#source-canvas', 16, 16, 7, 12);
  await page.mouse.move(ellipseA.x, ellipseA.y);
  await page.mouse.down();
  await page.mouse.move(ellipseB.x, ellipseB.y);
  await page.mouse.up();
  await expect.poll(() => sampleCell(page, '#source-canvas', 16, 16, 5, 10)).toEqual([15, 16, 19, 255]);
});

test('16 and 32 colour palettes are selectable in setup and editor', async ({ page }) => {
  await page.goto('/');
  await page.locator('#color-count').selectOption('16');
  await expect(page.locator('#setup-palette')).toHaveValue('pastel-16');
  await expect(page.locator('#setup-palette option')).toHaveCount(6);
  await expect(page.locator('#setup-palette-swatches .palette-swatch')).toHaveCount(16);
  await page.locator('#setup-palette').selectOption('earth-16');
  await page.locator('#create-project').click();
  await expect(page.locator('#editor-color-count')).toHaveText('16 cores');
  await expect(page.locator('#editor-palette-swatches .palette-swatch')).toHaveCount(16);

  await page.locator('#editor-color-count-select').selectOption('32');
  await expect(page.locator('#editor-color-count')).toHaveText('32 cores');
  await expect(page.locator('#editor-palette')).toHaveValue('spectrum-32');
  await expect(page.locator('#editor-palette option')).toHaveCount(4);
  await expect(page.locator('#editor-palette-swatches .palette-swatch')).toHaveCount(32);
  await page.locator('#editor-palette').selectOption('terrain-32');
  await expect(page.locator('#editor-palette-swatches .palette-swatch')).toHaveCount(32);

  await page.getByRole('button', { name: /Preto/ }).click();
  await clickCell(page, '#source-canvas', 32, 32, 16, 16);
  const outputHex = hexFromRgba(await sampleCell(page, '#output-canvas', 32, 32, 16, 16));
  expect((await page.locator('#editor-palette-swatches .palette-swatch').count())).toBe(32);
  const editorPalette = await page.locator('#editor-palette').inputValue();
  expect(['spectrum-32', 'terrain-32', 'arcade-32', 'oceanic-32']).toContain(editorPalette);
  expect(outputHex).toMatch(/^#[0-9A-F]{6}$/);
  await capture(page, '17-paletas-16-e-32-cores.png');
});

test('all supported palette sizes expose multiple presets', async ({ page }) => {
  await page.goto('/');
  const expected = { 4: 10, 8: 8, 12: 6, 16: 6, 32: 4 };
  for (const [count, minimum] of Object.entries(expected)) {
    await page.locator('#color-count').selectOption(count);
    await expect(page.locator('#setup-palette option')).toHaveCount(minimum);
    await expect(page.locator('#setup-palette-swatches .palette-swatch')).toHaveCount(Number(count));
  }
});
