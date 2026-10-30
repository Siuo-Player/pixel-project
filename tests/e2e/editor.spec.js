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
      footer: measure('.app-footer')
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
