'use client';

import Link from 'next/link';
import type { MouseEvent } from 'react';

import { ArrowLeft } from '@/components/icons';

import styles from './BackLink.module.css';
import { hasInternalHistory } from './navigationHistory';

/**
 * Retour « sûr » : revient à la page précédente si elle appartient au site,
 * sinon (lien partagé, moteur de recherche) mène à la page parente.
 */
export function BackLink({ fallback, label = 'Retour' }: { fallback: string; label?: string }) {
  const onClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
    if (hasInternalHistory()) {
      event.preventDefault();
      window.history.back();
    }
  };
  return (
    <Link
      href={fallback}
      onClick={onClick}
      className={`${styles.back} no-print`}
      data-testid="back-link"
    >
      <ArrowLeft size={18} strokeWidth={2.25} aria-hidden="true" />
      <span>{label}</span>
    </Link>
  );
}
