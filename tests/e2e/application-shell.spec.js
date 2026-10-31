import { test, expect } from '@playwright/test';

test('the app is installable: manifest, icons and offline service worker are wired', async ({ page }) => {
  await page.goto('/');

  const manifestLink = await page.evaluate(() => {
    const link = document.querySelector('link[rel="manifest"]');
    return link ? link.getAttribute('href') : null;
  });
  expect(manifestLink).not.toBeNull();

  const manifestResponse = await page.request.get(new URL(manifestLink, page.url()).toString());
  expect(manifestResponse.status()).toEqual(200);
  expect(manifestResponse.headers()['content-type']).toContain('application/manifest');
  const manifest = await manifestResponse.json();
  expect(manifest.name).toEqual('Pixel Project');
  expect(manifest.display).toEqual('standalone');
  expect(manifest.background_color).toEqual('#111318');
  expect(manifest.start_url).toEqual('./');
  expect(manifest.icons.length).toBeGreaterThanOrEqual(2);
  for (const icon of manifest.icons) {
    const response = await page.request.get(new URL(icon.src, page.url()).toString());
    expect(response.status()).toEqual(200);
    expect(response.headers()['content-type']).toContain('image/png');
  }

  await page.waitForFunction(() => 'serviceWorker' in navigator);
  const registration = await page.evaluate(async () => {
    const swRegistration = await navigator.serviceWorker.getRegistration();
    if (!swRegistration) return null;
    await navigator.serviceWorker.ready;
    const cacheNames = await caches.keys();
    return { scope: swRegistration.scope, caches: cacheNames };
  });
  expect(registration).not.toBeNull();
  expect(registration.scope).toMatch(/\/$/);
  expect(registration.caches).toContain('pixel-project-shell-v1');
});
