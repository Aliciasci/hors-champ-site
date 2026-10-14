import type { StateStorage } from 'zustand/middleware';

/**
 * Seul point d'accès au stockage du navigateur.
 * Les erreurs de lecture/écriture (mode privé, quota dépassé, stockage bloqué, Safari ITP) sont
 * journalisées sans faire planter l'interface : le site continue avec l'état en mémoire.
 */
export interface KeyValueStorage {
  getItem(key: string): string | null | Promise<string | null>;
  setItem(key: string, value: string): void | Promise<void>;
  removeItem(key: string): void | Promise<void>;
}

const isPromise = <T>(value: unknown): value is Promise<T> =>
  typeof (value as Promise<T> | null)?.then === 'function';

/** localStorage, résolu à l'usage : il n'existe pas pendant le rendu serveur. */
const browserStorage: KeyValueStorage = {
  getItem: (key) => window.localStorage.getItem(key),
  setItem: (key, value) => window.localStorage.setItem(key, value),
  removeItem: (key) => window.localStorage.removeItem(key),
};

function guard<T>(label: string, key: string, run: () => T | Promise<T>, fallback: T) {
  const warn = (error: unknown) => {
    console.warn(`[storage] ${label} impossible (${key})`, error);
    return fallback;
  };
  try {
    const result = run();
    return isPromise<T>(result) ? result.catch(warn) : result;
  } catch (error) {
    return warn(error);
  }
}

export function createStorageService(backend: KeyValueStorage = browserStorage): StateStorage {
  return {
    getItem: (key) => guard('lecture', key, () => backend.getItem(key), null),
    setItem: (key, value) => guard('écriture', key, () => backend.setItem(key, value), undefined),
    removeItem: (key) => guard('suppression', key, () => backend.removeItem(key), undefined),
  };
}

export const storageService = createStorageService();
