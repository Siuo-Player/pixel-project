/**
 * Core security and defensive utilities for Pixel Project.
 * Guards against prototype pollution, XSS, and unsafe storage access.
 */

const FORBIDDEN_PROPERTIES = Object.freeze(['__proto__', 'constructor', 'prototype']);

/**
 * Parses JSON while inspecting every key via a reviver function, preventing
 * prototype pollution at the parser level.
 * @param {string} text
 * @returns {unknown}
 */
export function safeJsonParse(text) {
  return JSON.parse(text, (key, value) => {
    if (FORBIDDEN_PROPERTIES.includes(key)) {
      throw new TypeError(`Malicious payload rejected: forbidden property: ${key}`);
    }
    return value;
  });
}

/**
 * Recursively inspects parsed JSON objects and arrays to ensure no prototype
 * pollution properties are present.
 * @param {unknown} value
 * @returns {unknown} The validated value
 * @throws {TypeError} If a forbidden property is found
 */
export function validateSafePayload(value) {
  if (value === null || typeof value !== 'object') {
    return value;
  }

  if (Array.isArray(value)) {
    for (let i = 0; i < value.length; i++) {
      validateSafePayload(value[i]);
    }
    return value;
  }

  const ownKeys = Object.getOwnPropertyNames(value);
  for (const key of ownKeys) {
    if (FORBIDDEN_PROPERTIES.includes(key)) {
      throw new TypeError(`Malicious payload rejected: forbidden property: ${key}`);
    }
    validateSafePayload(value[key]);
  }

  return value;
}

/**
 * Sanitizes user-provided text by stripping invisible/control characters,
 * trimming leading/trailing whitespace, and capping length.
 * @param {string} input
 * @param {number} [maxLength=100]
 * @returns {string}
 */
export function sanitizeText(input, maxLength = 100) {
  if (typeof input !== 'string') return '';
  return input
    .replace(/[\x00-\x1F\x7F]/g, '')
    .trim()
    .slice(0, maxLength);
}

/**
 * Safe, isolated storage wrapper with quota and permission safety.
 * Gracefully falls back to an in-memory Map if storage is disabled or unavailable.
 * @param {object} options
 * @param {string} [options.prefix='px_']
 * @param {Storage|null} [options.storage]
 */
export function createSafeStorage({ prefix = 'px_', storage = null } = {}) {
  const memoryFallback = new Map();
  const getBackend = () => {
    if (storage) return storage;
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        return window.localStorage;
      }
    } catch {
      // Storage access blocked by browser policy (e.g. private window)
    }
    return null;
  };

  return {
    getItem(key) {
      const backend = getBackend();
      if (!backend) return memoryFallback.get(key) ?? null;
      try {
        return backend.getItem(`${prefix}${key}`);
      } catch {
        return memoryFallback.get(key) ?? null;
      }
    },
    setItem(key, value) {
      const stringValue = String(value);
      const backend = getBackend();
      if (!backend) {
        memoryFallback.set(key, stringValue);
        return;
      }
      try {
        backend.setItem(`${prefix}${key}`, stringValue);
      } catch {
        memoryFallback.set(key, stringValue);
      }
    },
    removeItem(key) {
      const backend = getBackend();
      if (!backend) {
        memoryFallback.delete(key);
        return;
      }
      try {
        backend.removeItem(`${prefix}${key}`);
      } catch {
        memoryFallback.delete(key);
      }
    },
    clear() {
      memoryFallback.clear();
      const backend = getBackend();
      if (!backend) return;
      try {
        const keysToRemove = [];
        for (let i = 0; i < backend.length; i++) {
          const k = backend.key(i);
          if (k && k.startsWith(prefix)) keysToRemove.push(k);
        }
        for (const k of keysToRemove) backend.removeItem(k);
      } catch {
        // Ignore storage exceptions
      }
    }
  };
}
