import { test, expect } from '@playwright/test';

test.describe('Galeria de projetos de exemplo', () => {
  test('o utilizador pode abrir um projeto de exemplo diretamente do ecrã inicial', async ({ page }) => {
    await page.goto('/');

    const exampleCard = page.locator('#examples-list [data-example="lighthouse-at-dusk"]');
    await expect(exampleCard).toBeVisible();

    await exampleCard.click();

    await expect(page.locator('#editor-view')).toBeVisible();
    await expect(page.locator('#setup-view')).toBeHidden();

    // The document tab shows the example's title
    const activeTab = page.locator('.document-tab.is-active');
    await expect(activeTab).toContainText('Farol ao anoitecer');

    // Canvas outputs: 1 original + 3 calculated interpretations
    await expect(page.locator('#source-canvas')).toBeVisible();
    const outputCanvases = page.locator('#output-panels canvas');
    await expect(outputCanvases).toHaveCount(3);

    // Dimension pill reflects the 40x40 example dimensions
    await expect(page.locator('#source-dimensions')).toHaveText('40 × 40');

    // Clicking the source canvas opens inspector with dimension values populated
    await page.locator('[data-canvas-kind="source"]').click();
    await expect(page.locator('#source-width')).toHaveValue('40');
    await expect(page.locator('#source-height')).toHaveValue('40');
  });

  test('o utilizador pode abrir um exemplo através do diálogo do menu do editor', async ({ page }) => {
    await page.goto('/');

    // Start with a new empty project
    await page.locator('#create-project').click();
    await expect(page.locator('#editor-view')).toBeVisible();

    // Open file menu and click example option
    await page.locator('#file-menu summary').click();
    await page.locator('#menu-open-example').click();

    const dialog = page.locator('#examples-dialog');
    await expect(dialog).toBeVisible();

    // Select the cat example
    const catButton = page.locator('#dialog-examples-list [data-example="moonlit-cat"]');
    await expect(catButton).toBeVisible();
    await catButton.click();

    await expect(dialog).toBeHidden();

    // New tab should be opened and active
    const tabs = page.locator('.document-tab');
    await expect(tabs).toHaveCount(2);

    const activeTab = page.locator('.document-tab.is-active');
    await expect(activeTab).toContainText('Gato sob a lua');
  });
});
