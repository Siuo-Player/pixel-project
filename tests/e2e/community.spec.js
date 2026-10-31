import { test, expect } from '@playwright/test';

test.describe('Comunidade, Contas e Perfis', () => {
  test('o utilizador pode explorar a comunidade, pesquisar perfis e adicionar aos amigos', async ({ page }) => {
    await page.goto('/');

    const communityBtn = page.locator('#community-button');
    await expect(communityBtn).toBeVisible();
    await communityBtn.click();

    const dialog = page.locator('#community-dialog');
    await expect(dialog).toBeVisible();

    // Search for Antigravity
    const searchInput = page.locator('#community-search-input');
    await searchInput.fill('antigravity');

    const antigravityCard = page.locator('[data-profile-handle="antigravity"]');
    await expect(antigravityCard).toBeVisible();
    await expect(antigravityCard).toContainText('Antigravity (Google DeepMind)');

    // Friend / follow toggle
    const friendBtn = antigravityCard.locator('[data-action="toggle-friend"]');
    await expect(friendBtn).toBeVisible();
    await expect(friendBtn).toContainText('+ Seguir');

    await friendBtn.click();
    await expect(friendBtn).toContainText('A seguir');

    // View public artworks of Antigravity
    const viewArtBtn = antigravityCard.locator('[data-action="view-artworks"]');
    await viewArtBtn.click();

    const artCard = page.locator('[data-community-art="art-lighthouse-at-dusk"]');
    await expect(artCard).toBeVisible();
    await expect(artCard).toContainText('Farol ao anoitecer');
    await expect(artCard).toContainText('Paul Signac'); // Citations / inspirations visible

    // Open artwork directly into editor
    const openInEditorBtn = artCard.locator('[data-action="open-art"]');
    await openInEditorBtn.click();

    await expect(dialog).toBeHidden();
    await expect(page.locator('#editor-view')).toBeVisible();

    const activeTab = page.locator('.document-tab.is-active');
    await expect(activeTab).toContainText('Farol ao anoitecer');
  });

  test('o utilizador pode guardar uma arte na sua conta e geri-la na sua biblioteca', async ({ page }) => {
    await page.goto('/');

    // Start a new project
    await page.locator('#create-project').click();
    await expect(page.locator('#editor-view')).toBeVisible();

    // Click Save to Account button
    const saveToAccountBtn = page.locator('#save-to-account');
    await expect(saveToAccountBtn).toBeVisible();
    await saveToAccountBtn.click();

    // Open User Account modal
    const userAccountBtn = page.locator('#user-account-button');
    await expect(userAccountBtn).toBeVisible();
    await userAccountBtn.click();

    const accountDialog = page.locator('#account-dialog');
    await expect(accountDialog).toBeVisible();

    // Verify the saved art is in the account artworks list
    const myArtEntry = accountDialog.locator('#account-artworks-list .account-art-item').first();
    await expect(myArtEntry).toBeVisible();

    // Toggle public/private visibility
    const visibilityBtn = myArtEntry.locator('[data-action="toggle-visibility"]');
    await expect(visibilityBtn).toBeVisible();
    const currentText = await visibilityBtn.textContent();

    await visibilityBtn.click();
    await expect(visibilityBtn).not.toHaveText(currentText);

    // Close dialog
    await accountDialog.locator('#close-account-dialog').click();
    await expect(accountDialog).toBeHidden();
  });
});
