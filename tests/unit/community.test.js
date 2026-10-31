import assert from 'node:assert/strict';
import test from 'node:test';
import { createAccountManager, createDefaultProfiles } from '../../src/core/community.js';
import { createProject } from '../../src/core/project.js';
import { getPalette } from '../../src/engine/palettes.js';

function createMemoryStorage() {
  const store = new Map();
  return {
    getItem: key => store.get(key) ?? null,
    setItem: (key, val) => store.set(key, String(val)),
    removeItem: key => store.delete(key),
    clear: () => store.clear()
  };
}

test('account manager initializes default user and allows profile updates', () => {
  const storage = createMemoryStorage();
  const manager = createAccountManager(storage);

  const currentUser = manager.getCurrentUser();
  assert.ok(currentUser.id, 'User has an id');
  assert.ok(currentUser.handle, 'User has a handle');
  assert.equal(typeof currentUser.name, 'string');

  manager.updateProfile({ name: 'Artista Pixel', bio: 'Apaixonado por 8-bit' });
  const updated = manager.getCurrentUser();
  assert.equal(updated.name, 'Artista Pixel');
  assert.equal(updated.bio, 'Apaixonado por 8-bit');
});

test('saving an artwork to the account preserves project data and manages library', () => {
  const storage = createMemoryStorage();
  const manager = createAccountManager(storage);
  const project = createProject(16, 16, getPalette('blue-red-4'));
  project.name = 'Castelo Mágico';

  const saved = manager.saveArtToAccount(project, { isPublic: true });
  assert.ok(saved.id, 'Saved artwork has an id');
  assert.equal(saved.name, 'Castelo Mágico');
  assert.equal(saved.isPublic, true);
  assert.equal(saved.authorId, manager.getCurrentUser().id);

  const artworks = manager.getUserArtworks();
  assert.equal(artworks.length, 1);
  assert.equal(artworks[0].name, 'Castelo Mágico');
  assert.equal(artworks[0].project.source.width, 16);

  manager.deleteArtwork(saved.id);
  assert.equal(manager.getUserArtworks().length, 0);
});

test('toggling artwork visibility updates public state and public gallery', () => {
  const storage = createMemoryStorage();
  const manager = createAccountManager(storage);
  const project = createProject(8, 8, getPalette('blue-red-4'));
  project.name = 'Arte Secreta';

  const saved = manager.saveArtToAccount(project, { isPublic: false });
  assert.equal(saved.isPublic, false);

  let publicArts = manager.getPublicArtworks();
  assert.ok(!publicArts.some(art => art.id === saved.id), 'Private art is not in public gallery');

  manager.setArtworkVisibility(saved.id, true);
  publicArts = manager.getPublicArtworks();
  assert.ok(publicArts.some(art => art.id === saved.id), 'Public art appears in public gallery');
});

test('friends system allows adding/removing friends and tracks social state', () => {
  const storage = createMemoryStorage();
  const manager = createAccountManager(storage);
  const targetId = 'profile-antigravity';

  assert.equal(manager.isFriend(targetId), false);
  manager.toggleFriend(targetId);
  assert.equal(manager.isFriend(targetId), true);

  const friends = manager.getFriends();
  assert.ok(friends.includes(targetId));

  manager.toggleFriend(targetId);
  assert.equal(manager.isFriend(targetId), false);
});

test('profile search matches names and handles case-insensitively', () => {
  const storage = createMemoryStorage();
  const manager = createAccountManager(storage);

  const matchesByHandle = manager.searchProfiles('antigravity');
  assert.ok(matchesByHandle.length > 0);
  assert.ok(matchesByHandle.some(p => p.handle.toLowerCase().includes('antigravity')));

  const matchesByName = manager.searchProfiles('DeepMind');
  assert.ok(matchesByName.length > 0);

  const matchesEmpty = manager.searchProfiles('xyz-nonexistent-999');
  assert.equal(matchesEmpty.length, 0);
});

test('antigravity showcase profile exposes author works with citations and inspirations', () => {
  const profiles = createDefaultProfiles();
  const antigravity = profiles.find(p => p.handle === 'antigravity');

  assert.ok(antigravity, 'Antigravity profile exists');
  assert.ok(antigravity.verified, 'Antigravity is verified');
  assert.equal(antigravity.name, 'Antigravity (Google DeepMind)');
  assert.ok(antigravity.artworks.length >= 4, 'Has at least 4 showcased works');

  for (const art of antigravity.artworks) {
    assert.ok(art.id);
    assert.ok(art.name);
    assert.ok(art.inspirations, `${art.name} must specify artistic inspirations`);
    assert.ok(art.author, `${art.name} must specify author`);
    assert.equal(art.author, 'Antigravity (Google DeepMind)');
  }
});
