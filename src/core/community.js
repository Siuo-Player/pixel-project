import { createSafeStorage, sanitizeText, safeJsonParse } from './security.js';
import { BUILTIN_EXAMPLES, loadExampleProject } from './examples.js';

export function createDefaultProfiles() {
  const antigravityArtworks = BUILTIN_EXAMPLES.map(ex => ({
    id: `art-${ex.id}`,
    exampleId: ex.id,
    name: ex.name,
    author: ex.author,
    authorHandle: 'antigravity',
    authorId: 'profile-antigravity',
    dimensions: ex.dimensions,
    description: ex.description,
    inspirations: ex.inspirations,
    citations: ex.citations,
    isPublic: true,
    likesCount: 42,
    project: null
  }));

  return [
    {
      id: 'profile-antigravity',
      handle: 'antigravity',
      name: 'Antigravity (Google DeepMind)',
      verified: true,
      avatar: 'PX',
      bio: 'Agente de Inteligência Artificial para Engenharia e Pixel Art na Google DeepMind.',
      website: 'https://github.com/Siuo-Player/pixel-project',
      artworks: antigravityArtworks
    },
    {
      id: 'profile-retropixel',
      handle: 'retropixel',
      name: 'Retro Pixel Master',
      verified: false,
      avatar: '👾',
      bio: 'Nostálgico por jogos dos anos 80, paletas CGA/EGA e computadores Amiga.',
      website: '',
      artworks: [
        {
          id: 'art-retro-space-invader',
          name: 'Nave em Órbita',
          author: 'Retro Pixel Master',
          authorHandle: 'retropixel',
          authorId: 'profile-retropixel',
          dimensions: '24×24',
          description: 'Nave de exploração retro.',
          inspirations: 'Inspirado nos sprites de ficção científica dos arcades dos anos 80 (Space Invaders, Galaga).',
          citations: ['Tomohiro Nishikado — Space Invaders (Taito, 1978)'],
          isPublic: true,
          likesCount: 19
        }
      ]
    },
    {
      id: 'profile-solarlight',
      handle: 'solarlight',
      name: 'Marina Luz',
      verified: false,
      avatar: '🌿',
      bio: 'Exploradora de botânica, luz suave e paletas de 4 a 12 cores.',
      website: '',
      artworks: [
        {
          id: 'art-solarlight-fern',
          name: 'Feto Dourado',
          author: 'Marina Luz',
          authorHandle: 'solarlight',
          authorId: 'profile-solarlight',
          dimensions: '32×32',
          description: 'Estudo de folhagem ao amanhecer.',
          inspirations: 'Inspirado em ilustrações botânicas naturalistas de Ernst Haeckel adaptadas a píxel.',
          citations: ['Ernst Haeckel — Kunstformen der Natur (1904)'],
          isPublic: true,
          likesCount: 27
        }
      ]
    }
  ];
}

export function createAccountManager(rawStorage = null) {
  const safeStore = createSafeStorage({
    prefix: 'px_community_',
    storage: rawStorage || (typeof window !== 'undefined' ? window.localStorage : null)
  });

  function readJson(key, defaultValue = null) {
    const raw = safeStore.getItem(key);
    if (!raw) return defaultValue;
    try {
      return safeJsonParse(raw);
    } catch {
      return defaultValue;
    }
  }

  function writeJson(key, value) {
    safeStore.setItem(key, JSON.stringify(value));
  }

  const defaultProfiles = createDefaultProfiles();

  function initCurrentUser() {
    const existing = readJson('current_user', null);
    if (existing && existing.id) return existing;

    const initial = {
      id: 'user-local-' + Math.random().toString(36).slice(2, 9),
      handle: 'meu_perfil',
      name: 'Criador Local',
      bio: 'A desenhar e a criar paletas no Pixel Project.',
      avatar: '🎨',
      createdAt: new Date().toISOString()
    };
    writeJson('current_user', initial);
    return initial;
  }

  let currentUser = initCurrentUser();

  function getCurrentUser() {
    return { ...currentUser };
  }

  function setCurrentUser(user) {
    if (!user || typeof user !== 'object') throw new TypeError('Utilizador inválido');
    currentUser = {
      ...currentUser,
      ...user,
      name: sanitizeText(user.name || currentUser.name, 60),
      handle: sanitizeText((user.handle || currentUser.handle).replace(/^@+/, ''), 30),
      bio: sanitizeText(user.bio || currentUser.bio, 240)
    };
    writeJson('current_user', currentUser);
    return getCurrentUser();
  }

  function updateProfile(updates) {
    return setCurrentUser(updates);
  }

  function getUserArtworks(userId = currentUser.id) {
    const all = readJson(`artworks_${userId}`, []);
    return Array.isArray(all) ? all : [];
  }

  function saveArtToAccount(project, options = {}) {
    if (!project || !project.source) throw new TypeError('Projeto inválido');

    const artworks = getUserArtworks(currentUser.id);
    const existingIndex = project.id ? artworks.findIndex(a => a.id === project.id || a.projectId === project.id) : -1;

    const artEntry = {
      id: project.id || `art-${Math.random().toString(36).slice(2, 10)}`,
      projectId: project.id,
      name: sanitizeText(project.name || 'Sem título', 60),
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorHandle: currentUser.handle,
      dimensions: `${project.source.width}×${project.source.height}`,
      isPublic: Boolean(options.isPublic ?? true),
      inspirations: sanitizeText(options.inspirations || '', 200),
      savedAt: new Date().toISOString(),
      project: safeJsonParse(JSON.stringify(project))
    };

    if (existingIndex >= 0) {
      artworks[existingIndex] = artEntry;
    } else {
      artworks.unshift(artEntry);
    }

    writeJson(`artworks_${currentUser.id}`, artworks);
    return artEntry;
  }

  function deleteArtwork(artId, userId = currentUser.id) {
    const artworks = getUserArtworks(userId);
    const filtered = artworks.filter(art => art.id !== artId && art.projectId !== artId);
    writeJson(`artworks_${userId}`, filtered);
    return filtered;
  }

  function setArtworkVisibility(artId, isPublic, userId = currentUser.id) {
    const artworks = getUserArtworks(userId);
    const target = artworks.find(art => art.id === artId || art.projectId === artId);
    if (target) {
      target.isPublic = Boolean(isPublic);
      writeJson(`artworks_${userId}`, artworks);
      return target;
    }
    return null;
  }

  function getFriends(userId = currentUser.id) {
    const friends = readJson(`friends_${userId}`, []);
    return Array.isArray(friends) ? friends : [];
  }

  function isFriend(targetProfileId, userId = currentUser.id) {
    const friends = getFriends(userId);
    return friends.includes(targetProfileId);
  }

  function toggleFriend(targetProfileId, userId = currentUser.id) {
    if (!targetProfileId) return false;
    let friends = getFriends(userId);
    if (friends.includes(targetProfileId)) {
      friends = friends.filter(id => id !== targetProfileId);
    } else {
      friends = [...friends, targetProfileId];
    }
    writeJson(`friends_${userId}`, friends);
    return friends.includes(targetProfileId);
  }

  function getLikes(userId = currentUser.id) {
    const likes = readJson(`likes_${userId}`, []);
    return Array.isArray(likes) ? likes : [];
  }

  function isLiked(artId, userId = currentUser.id) {
    const likes = getLikes(userId);
    return likes.includes(artId);
  }

  function toggleLike(artId, userId = currentUser.id) {
    if (!artId) return false;
    let likes = getLikes(userId);
    if (likes.includes(artId)) {
      likes = likes.filter(id => id !== artId);
    } else {
      likes = [...likes, artId];
    }
    writeJson(`likes_${userId}`, likes);
    return likes.includes(artId);
  }

  function getAllProfiles() {
    const userProfile = {
      ...currentUser,
      artworks: getUserArtworks(currentUser.id).filter(a => a.isPublic)
    };
    return [userProfile, ...defaultProfiles];
  }

  function searchProfiles(query = '') {
    const normalized = query.trim().toLowerCase().replace(/^@+/, '');
    if (!normalized) return getAllProfiles();

    return getAllProfiles().filter(p =>
      p.handle.toLowerCase().includes(normalized) ||
      p.name.toLowerCase().includes(normalized) ||
      (p.bio && p.bio.toLowerCase().includes(normalized))
    );
  }

  function getProfileWithArtworks(profileId) {
    const found = getAllProfiles().find(p => p.id === profileId || p.handle === profileId);
    if (!found) return null;

    if (found.id === currentUser.id) {
      return {
        ...found,
        artworks: getUserArtworks(currentUser.id).filter(a => a.isPublic)
      };
    }

    if (found.id === 'profile-antigravity') {
      return {
        ...found,
        artworks: found.artworks.map(art => {
          if (!art.project && art.exampleId) {
            try {
              return { ...art, project: loadExampleProject(art.exampleId) };
            } catch {
              return art;
            }
          }
          return art;
        })
      };
    }

    return found;
  }

  function getPublicArtworks() {
    const list = [];
    for (const profile of getAllProfiles()) {
      if (Array.isArray(profile.artworks)) {
        for (const art of profile.artworks) {
          if (art.isPublic !== false) {
            list.push({
              ...art,
              author: profile.name,
              authorHandle: profile.handle,
              authorId: profile.id,
              authorAvatar: profile.avatar,
              authorVerified: Boolean(profile.verified)
            });
          }
        }
      }
    }
    return list;
  }

  return {
    getCurrentUser,
    setCurrentUser,
    updateProfile,
    getUserArtworks,
    saveArtToAccount,
    deleteArtwork,
    setArtworkVisibility,
    getFriends,
    isFriend,
    toggleFriend,
    getLikes,
    isLiked,
    toggleLike,
    getAllProfiles,
    searchProfiles,
    getProfileWithArtworks,
    getPublicArtworks
  };
}
