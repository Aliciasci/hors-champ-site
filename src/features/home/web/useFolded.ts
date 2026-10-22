import { useCallback, useSyncExternalStore } from 'react';

const EVENT = 'hc-home-folded';

/** Choix faits pendant cette visite, quand le navigateur refuse de les enregistrer. */
const overrides = new Map<string, boolean>();

function read(key: string): boolean {
  if (overrides.has(key)) return overrides.get(key)!;
  try {
    return localStorage.getItem(key) === '1';
  } catch {
    return false;
  }
}

const subscribe = (onChange: () => void) => {
  window.addEventListener(EVENT, onChange);
  window.addEventListener('storage', onChange);
  return () => {
    window.removeEventListener(EVENT, onChange);
    window.removeEventListener('storage', onChange);
  };
};

/** Un bloc de l'accueil réduit ou déplié, retenu d'une visite à l'autre sur cet appareil. */
export function useFolded(key: string): [boolean, () => void] {
  const folded = useSyncExternalStore(
    subscribe,
    () => read(key),
    () => false,
  );
  const toggle = useCallback(() => {
    const next = !read(key);
    overrides.set(key, next);
    try {
      if (next) localStorage.setItem(key, '1');
      else localStorage.removeItem(key);
    } catch {
      // Le choix vaut pour cette visite seulement.
    }
    window.dispatchEvent(new Event(EVENT));
  }, [key]);
  return [folded, toggle];
}
