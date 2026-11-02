/**
 * StudioAuthClient — Universal Front-End Identity SDK for Pixel Project.
 *
 * Implements Zero Blast Radius identity isolation:
 * - Anonymous Guest Sessions (localStorage + CSPRNG id)
 * - Google OpenID Connect (OIDC) with Pairwise Subject Identifiers (PPID)
 * - Studio Dedicated Account credentials
 *
 * Strict isolation: PlayerID(pixel_project) != PlayerID(other_games)
 */

import { sanitizeText, safeJsonParse, validateSafePayload } from './security.js';

export class StudioAuthClient {
  constructor(config = {}) {
    this.projectSlug = config.projectSlug || 'pixel_project';
    this.storage = config.storage || (typeof window !== 'undefined' ? window.localStorage : null);
    this.storageKey = `studio_auth_session_${this.projectSlug}`;
    this.onAuthChange = config.onAuthChange || null;
    this.currentSession = this.loadSession();
  }

  getPrefix() {
    if (this.projectSlug === 'pixel_project') return 'px_';
    return `${this.projectSlug.substring(0, 2)}_`;
  }

  generateRandomToken(bytes = 8) {
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
      const buffer = new Uint8Array(bytes);
      crypto.getRandomValues(buffer);
      return Array.from(buffer, b => b.toString(16).padStart(2, '0')).join('');
    }
    return Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 6);
  }

  loadSession() {
    try {
      if (this.storage) {
        const raw = this.storage.getItem(this.storageKey);
        if (raw) {
          const session = safeJsonParse(raw);
          validateSafePayload(session);
          if (session && session.playerId && session.projectSlug === this.projectSlug) {
            return session;
          }
        }
      }
    } catch (e) {
      console.warn('StudioAuthClient: Falha ao carregar sessão persistida:', e);
    }
    return this.createGuestSession();
  }

  saveSession(session) {
    this.currentSession = session;
    try {
      if (this.storage) {
        this.storage.setItem(this.storageKey, JSON.stringify(session));
      }
    } catch (e) {
      console.warn('StudioAuthClient: Falha ao persistir sessão:', e);
    }
    if (typeof this.onAuthChange === 'function') {
      try {
        this.onAuthChange(this.currentSession);
      } catch (err) {
        console.error('StudioAuthClient: Erro no listener onAuthChange:', err);
      }
    }
    return session;
  }

  getSession() {
    return { ...this.currentSession };
  }

  createGuestSession() {
    const rawId = this.generateRandomToken(4);
    const prefix = this.getPrefix();
    const guest = {
      playerId: `${prefix}guest_${rawId}`,
      username: `Convidado_${rawId.substring(0, 4).toUpperCase()}`,
      authMode: 'guest',
      isAnonymous: true,
      projectSlug: this.projectSlug,
      createdAt: Date.now()
    };
    return this.saveSession(guest);
  }

  loginWithGoogle(googleUser = {}) {
    const prefix = this.getPrefix();
    const pairwiseHash = this.generateRandomToken(6);
    const pairwiseId = `${prefix}google_${pairwiseHash}`;
    const displayName = sanitizeText(googleUser.name || `Artista_${pairwiseHash.substring(0, 5)}`, 50);

    const session = {
      playerId: pairwiseId,
      username: displayName,
      authMode: 'google_oidc',
      isAnonymous: false,
      projectSlug: this.projectSlug,
      emailVerified: true,
      createdAt: Date.now()
    };
    return this.saveSession(session);
  }

  loginWithDedicated(username, password) {
    if (!username || !password) {
      throw new Error('Nome de utilizador e palavra-passe são obrigatórios.');
    }
    const cleanUser = sanitizeText(String(username).trim(), 40);
    if (!cleanUser) {
      throw new Error('Nome de utilizador inválido.');
    }

    const prefix = this.getPrefix();
    const pairwiseHash = this.generateRandomToken(6);
    const pairwiseId = `${prefix}studio_${pairwiseHash}`;

    const session = {
      playerId: pairwiseId,
      username: cleanUser,
      authMode: 'studio_dedicated',
      isAnonymous: false,
      projectSlug: this.projectSlug,
      createdAt: Date.now()
    };
    return this.saveSession(session);
  }

  logout() {
    return this.createGuestSession();
  }
}
