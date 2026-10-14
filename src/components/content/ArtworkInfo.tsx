'use client';

import { useEffect, useId, useRef, useState } from 'react';

import { ExternalLink, Info, X } from '@/components/icons';
import type { Artwork } from '@/types';

import styles from './ArtworkInfo.module.css';
import { formatArtworkCredit } from './artworkCredit';

/**
 * Crédit d'une illustration, replié par défaut : un bouton « i » posé sur l'image l'affiche
 * en surimpression (Échap ou un second clic le referme). À placer dans un parent positionné.
 */
export function ArtworkInfo({ artwork }: { artwork: Artwork }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const button = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        button.current?.focus();
      }
    };
    const onPointer = (event: PointerEvent) => {
      const target = event.target as Node;
      if (!panel.current?.contains(target) && !button.current?.contains(target)) setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onPointer);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onPointer);
    };
  }, [open]);

  return (
    <>
      {open ? (
        <div
          ref={panel}
          id={id}
          className={styles.panel}
          role="note"
          aria-label="Crédit de l’illustration"
        >
          <p className="t-caption">{formatArtworkCredit(artwork)}</p>
          <a
            href={artwork.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.link}
          >
            Fiche et licence
            <ExternalLink size={14} strokeWidth={2.25} aria-hidden="true" />
            <span className="sr-only"> (nouvel onglet)</span>
          </a>
        </div>
      ) : null}
      <button
        ref={button}
        type="button"
        className={`${styles.button} no-print`}
        aria-expanded={open}
        aria-controls={open ? id : undefined}
        aria-label={
          open ? 'Masquer le crédit de l’illustration' : 'Afficher le crédit de l’illustration'
        }
        onClick={() => setOpen((value) => !value)}
        data-testid="artwork-info"
      >
        {open ? (
          <X size={16} strokeWidth={2.5} aria-hidden="true" />
        ) : (
          <Info size={18} strokeWidth={2.25} aria-hidden="true" />
        )}
      </button>
    </>
  );
}
