'use client';

import type { ElementType } from 'react';

import { DEFAULT_AGE_BAND } from '@/features/youth/youthCatalog';
import { useAppStore } from '@/store/useAppStore';
import type { AgeBand, Leveled } from '@/types';

/** Tranche de lecture active (11–14 ans sans choix, et pendant le rendu serveur). */
export function useBand(): AgeBand {
  return useAppStore((s) => s.preferences.ageBand) ?? DEFAULT_AGE_BAND;
}

/**
 * Texte écrit pour chaque tranche d'âge. Pré-rendu en version 11–14 ans, remplacé après
 * hydratation par la version choisie (Profil, sélecteur de « Tout est possible » ou `?age=`).
 */
export function Lv({
  text,
  as: Tag = 'span',
  className,
  testId,
}: {
  text: Leveled;
  as?: ElementType;
  className?: string;
  testId?: string;
}) {
  const band = useBand();
  return (
    <Tag className={className} data-testid={testId} data-band={band}>
      {text[band]}
    </Tag>
  );
}
