'use client';

import { useEffect } from 'react';

import { useAppStore } from '@/store/useAppStore';

/** Mémorise l'ouverture d'une fiche (exploration) ou d'un contrechamp (consultation), après montage. */
export function RecordVisit({
  entityId,
  experienceId,
}: {
  entityId?: string;
  experienceId?: string;
}) {
  const recordExploration = useAppStore((s) => s.recordExploration);
  const recordView = useAppStore((s) => s.recordView);
  useEffect(() => {
    if (entityId) recordExploration(entityId);
  }, [entityId, recordExploration]);
  useEffect(() => {
    if (experienceId) recordView(experienceId);
  }, [experienceId, recordView]);
  return null;
}
