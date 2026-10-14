'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useId } from 'react';

import { Segmented } from '@/components/ui/Chip';
import { AGE_BANDS } from '@/features/youth/youthCatalog';
import { useAppStore } from '@/store/useAppStore';
import type { AgeBand } from '@/types';

const BANDS = AGE_BANDS.map((b) => b.id);
const isBand = (value: string | null): value is AgeBand =>
  value !== null && (BANDS as string[]).includes(value);

/** Paramètre d'URL du niveau de lecture : `?age=6-10` ou `?age=11-14`. */
export const AGE_PARAM = 'age';

/**
 * Le niveau présent dans l'URL l'emporte au chargement et devient la préférence enregistrée.
 * À placer sous une frontière <Suspense> (lecture des paramètres d'URL).
 */
export function AgeBandFromUrl() {
  const params = useSearchParams();
  const fromUrl = params.get(AGE_PARAM);
  const setAgeBand = useAppStore((s) => s.setAgeBand);
  useEffect(() => {
    if (isBand(fromUrl) && useAppStore.getState().preferences.ageBand !== fromUrl) {
      setAgeBand(fromUrl);
    }
  }, [fromUrl, setAgeBand]);
  return null;
}

/** Choix facultatif du niveau de lecture : enregistré dans ce navigateur et reflété dans l'URL. */
export function AgeBandPicker() {
  const name = useId();
  const router = useRouter();
  const pathname = usePathname();
  const ageBand = useAppStore((s) => s.preferences.ageBand);
  const setAgeBand = useAppStore((s) => s.setAgeBand);

  const change = (value: AgeBand | 'none') => {
    const band = value === 'none' ? null : value;
    setAgeBand(band);
    const next = new URLSearchParams(window.location.search);
    if (band) next.set(AGE_PARAM, band);
    else next.delete(AGE_PARAM);
    const query = next.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  return (
    <div data-testid="age-band-picker" style={{ display: 'grid', gap: 'var(--space-sm)' }}>
      <Segmented<AgeBand | 'none'>
        legend="Niveau de lecture"
        name={name}
        testIdPrefix="age-band"
        value={ageBand ?? 'none'}
        onChange={change}
        options={[{ id: 'none', label: 'Pas de choix' }, ...AGE_BANDS]}
      />
      <p className="t-caption c-muted">
        Facultatif. Le niveau change la longueur des textes, pas les sujets proposés. Rien n’est
        envoyé : ce choix reste dans ce navigateur.
      </p>
    </div>
  );
}
