import { useSyncExternalStore } from 'react';

const subscribe = () => () => undefined;

/** Faux pendant le rendu serveur et l'hydratation, vrai ensuite (sans effet en cascade). */
export function useMounted(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
