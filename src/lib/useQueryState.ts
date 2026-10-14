'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

export type QueryPatch = Record<string, string | readonly string[] | null | undefined>;

/**
 * État d'interface partageable, reflété dans l'URL (`?rubrique=`, `?q=`, filtres…).
 * Les mises à jour remplacent l'entrée d'historique (pas d'empilement à chaque frappe).
 *
 * `useSearchParams` impose une frontière <Suspense> à l'export statique : les composants qui
 * l'utilisent sont rendus, en repli, avec leurs valeurs par défaut (même HTML pré-rendu).
 */
export function useQueryState() {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const set = useCallback(
    (patch: QueryPatch) => {
      const next = new URLSearchParams(window.location.search);
      for (const [key, value] of Object.entries(patch)) {
        const text = Array.isArray(value) ? value.join(',') : (value as string | null | undefined);
        if (text === null || text === undefined || text === '') next.delete(key);
        else next.set(key, text);
      }
      const query = next.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    },
    [pathname, router],
  );

  return { params, set };
}

/** Liste lue dans un paramètre (`a,b,c`), restreinte aux valeurs connues. */
export function readList<T extends string>(value: string | null, allowed: readonly T[]): T[] {
  if (!value) return [];
  return [...new Set(value.split(','))].filter((v): v is T =>
    (allowed as readonly string[]).includes(v),
  );
}

/** Valeur unique lue dans un paramètre, ou la valeur par défaut. */
export function readOne<T extends string>(
  value: string | null,
  allowed: readonly T[],
  fallback: T,
): T {
  return value && (allowed as readonly string[]).includes(value) ? (value as T) : fallback;
}
