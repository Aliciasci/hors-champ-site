'use client';

import { Bookmark } from '@/components/icons';
import { useAppStore } from '@/store/useAppStore';

/** Signet plein si la fiche est dans les découvertes (rien avant l'hydratation). */
export function SavedMark({ entityId, size = 16 }: { entityId: string; size?: number }) {
  const saved = useAppStore((s) => s.savedDiscoveries.some((d) => d.entityId === entityId));
  if (!saved) return null;
  return (
    <span style={{ display: 'inline-flex', flex: 'none' }}>
      <Bookmark size={size} fill="currentColor" strokeWidth={2} aria-hidden="true" />
      <span className="sr-only">Enregistrée dans vos découvertes</span>
    </span>
  );
}
