import test from 'node:test';
import assert from 'node:assert/strict';
import { StudioAuthClient } from '../../src/core/auth_client.js';
import { constantTimeCompare, enforcePayloadSizeLimit } from '../../src/core/security.js';
import { createAccountManager } from '../../src/core/community.js';
import { createProject } from '../../src/core/project.js';
import { getPalette } from '../../src/engine/palettes.js';

test('StudioAuthClient defaults to guest session with project prefix and zero blast radius', () => {
  const memoryStore = new Map();
  const mockStorage = {
    getItem: (k) => memoryStore.get(k) ?? null,
    setItem: (k, v) => memoryStore.set(k, String(v)),
    removeItem: (k) => memoryStore.delete(k)
  };

  const auth = new StudioAuthClient({
    projectSlug: 'pixel_project',
    storage: mockStorage
  });

  const session = auth.getSession();
  assert.equal(session.projectSlug, 'pixel_project');
  assert.equal(session.authMode, 'guest');
  assert.equal(session.isAnonymous, true);
  assert.match(session.playerId, /^px_guest_/);
  assert.match(session.username, /^Convidado_/);
});

test('StudioAuthClient derives pairwise identifier for Google OIDC without exposing master credentials', () => {
  const memoryStore = new Map();
  const mockStorage = {
    getItem: (k) => memoryStore.get(k) ?? null,
    setItem: (k, v) => memoryStore.set(k, String(v)),
    removeItem: (k) => memoryStore.delete(k)
  };

  const auth = new StudioAuthClient({
    projectSlug: 'pixel_project',
    storage: mockStorage
  });

  const googleSession = auth.loginWithGoogle({
    name: 'Sofia Pixel Art',
    email: 'sofia@example.com'
  });

  assert.equal(googleSession.authMode, 'google_oidc');
  assert.equal(googleSession.isAnonymous, false);
  assert.equal(googleSession.username, 'Sofia Pixel Art');
  assert.match(googleSession.playerId, /^px_google_/);
  // Master email must not be stored as plaintext player identity
  assert.notEqual(googleSession.playerId, 'sofia@example.com');
});

test('StudioAuthClient supports dedicated studio account login and logout', () => {
  const memoryStore = new Map();
  const mockStorage = {
    getItem: (k) => memoryStore.get(k) ?? null,
    setItem: (k, v) => memoryStore.set(k, String(v)),
    removeItem: (k) => memoryStore.delete(k)
  };

  const auth = new StudioAuthClient({
    projectSlug: 'pixel_project',
    storage: mockStorage
  });

  const dedicated = auth.loginWithDedicated('PixelCrafter', 'SuperSecurePass123!');
  assert.equal(dedicated.authMode, 'studio_dedicated');
  assert.equal(dedicated.username, 'PixelCrafter');
  assert.match(dedicated.playerId, /^px_studio_/);

  const guestAgain = auth.logout();
  assert.equal(guestAgain.authMode, 'guest');
  assert.match(guestAgain.playerId, /^px_guest_/);
});

test('constantTimeCompare performs constant-time string comparison', () => {
  assert.equal(constantTimeCompare('secret-token-123', 'secret-token-123'), true);
  assert.equal(constantTimeCompare('secret-token-123', 'secret-token-999'), false);
  assert.equal(constantTimeCompare('abc', 'abcd'), false);
  assert.equal(constantTimeCompare('', ''), true);
  assert.equal(constantTimeCompare(null, 'abc'), false);
});

test('enforcePayloadSizeLimit enforces 64 KB ceiling and protects against memory exhaustion', () => {
  const validSmallPayload = JSON.stringify({ message: 'hello', count: 42 });
  assert.doesNotThrow(() => enforcePayloadSizeLimit(validSmallPayload, 64 * 1024));

  const massivePayload = 'X'.repeat(65 * 1024); // 65 KB > 64 KB ceiling
  assert.throws(
    () => enforcePayloadSizeLimit(massivePayload, 64 * 1024),
    /Payload excede o teto defensivo de 64 KB/
  );
});

test('AccountManager seamlessly migrates guest artworks when user upgrades to Google or Studio account', () => {
  const memoryStore = new Map();
  const mockStorage = {
    getItem: (k) => memoryStore.get(k) ?? null,
    setItem: (k, v) => memoryStore.set(k, String(v)),
    removeItem: (k) => memoryStore.delete(k)
  };

  const auth = new StudioAuthClient({
    projectSlug: 'pixel_project',
    storage: mockStorage
  });

  const accountMgr = createAccountManager(mockStorage, { authClient: auth });
  const guestUser = accountMgr.getCurrentUser();
  assert.equal(guestUser.authMode, 'guest');

  // Create an artwork under guest session
  const project = createProject(16, 16, getPalette('blue-red-4'));
  project.name = 'Arte do Convidado';
  const savedArt = accountMgr.saveArtToAccount(project);
  assert.equal(accountMgr.getUserArtworks().length, 1);
  assert.equal(accountMgr.getUserArtworks()[0].name, 'Arte do Convidado');

  // Upgrade session to Google OIDC
  accountMgr.upgradeAuthWithGoogle({ name: 'Artista Verificado' });
  const upgradedUser = accountMgr.getCurrentUser();
  assert.equal(upgradedUser.authMode, 'google_oidc');
  assert.equal(upgradedUser.name, 'Artista Verificado');

  // Artworks created during guest session must be preserved and migrated!
  const userArts = accountMgr.getUserArtworks();
  assert.equal(userArts.length, 1);
  assert.equal(userArts[0].id, savedArt.id);
  assert.equal(userArts[0].authorName, 'Artista Verificado');
});
