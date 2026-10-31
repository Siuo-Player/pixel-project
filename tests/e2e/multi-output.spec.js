import { test, expect } from '@playwright/test';

async function sampleCell(page, x, y, width = 32, height = 32) {
  return page.locator('#source-canvas').evaluate((canvas, cell) => {
    const rect = canvas.getBoundingClientRect();
    const scale = Math.min(rect.width / cell.width, rect.height / cell.height);
    const offsetX = (rect.width - cell.width * scale) / 2;
    const offsetY = (rect.height - cell.height * scale) / 2;
    const px = Math.floor((offsetX + (cell.x + 0.5) * scale) * canvas.width / rect.width);
    const py = Math.floor((offsetY + (cell.y + 0.5) * scale) * canvas.height / rect.height);
    return Array.from(canvas.getContext('2d').getImageData(px, py, 1, 1).data);
  }, { x, y, width, height });
}

async function cellPoint(page, x, y, width = 32, height = 32) {
  return page.locator('#source-canvas').evaluate((canvas, cell) => {
    const rect = canvas.getBoundingClientRect();
    const scale = Math.min(rect.width / cell.width, rect.height / cell.height);
    return {
      x: rect.left + (rect.width - cell.width * scale) / 2 + (cell.x + 0.5) * scale,
      y: rect.top + (rect.height - cell.height * scale) / 2 + (cell.y + 0.5) * scale
    };
  }, { x, y, width, height });
}

test('shape tools retain their mode when the user changes the paint colour', async ({ page }) => {
  await page.goto('/');
  await page.locator('#create-project').click();
  await page.locator('[data-tool="filled-ellipse"]').click();
  await page.locator('[data-tool="white"]').click();
  await expect(page.locator('[data-tool="filled-ellipse"]')).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('#source-canvas')).toHaveAttribute('data-selected-color', 'white');

  const start = await cellPoint(page, 5, 5);
  const end = await cellPoint(page, 14, 14);
  await page.mouse.move(start.x, start.y);
  await page.mouse.down();
  await page.mouse.move(end.x, end.y, { steps: 8 });
  await page.mouse.up();
  await expect(page.locator('[data-tool="filled-ellipse"]')).toHaveAttribute('aria-pressed', 'true');
  const center = await sampleCell(page, 10, 10);
  expect(center).toEqual([247, 247, 244, 255]);
});

test('one original supports three independently configurable interpretations', async ({ page }) => {
  await page.goto('/');
  await page.locator('#grid-width').fill('32');
  await page.locator('#grid-height').fill('24');
  await page.locator('#create-project').click();

  await expect(page.locator('#settings-panel')).toBeHidden();
  await page.locator('#add-output').click();
  await page.locator('#add-output').click();
  await expect(page.locator('#output-panels .canvas-panel')).toHaveCount(3);
  await expect(page.locator('#add-output')).toBeDisabled();

  const outputs = page.locator('#output-panels .canvas-panel');
  await outputs.nth(1).locator('canvas').click();
  await expect(page.locator('#settings-panel')).toBeVisible();
  await expect(page.locator('#output-settings')).toBeVisible();

  await page.locator('#editor-color-count-select').selectOption('12');
  await page.locator('#editor-palette').selectOption('magma-12');
  await expect(outputs.nth(1)).toHaveAttribute('data-palette-id', 'magma-12');
  await expect(outputs.nth(0)).not.toHaveAttribute('data-palette-id', 'magma-12');

  await page.locator('#output-width').fill('16');
  await page.locator('#output-height').fill('12');
  await page.locator('#apply-output-size').click();
  await expect(outputs.nth(1)).toHaveAttribute('data-output-dimensions', '16 × 12');

  await page.locator('#source-canvas').click();
  await expect(page.locator('#source-settings')).toBeVisible();
  await expect(page.locator('#output-settings')).toBeHidden();
});
