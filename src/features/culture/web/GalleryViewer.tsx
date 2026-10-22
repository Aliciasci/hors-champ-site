'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react';

import { CoverArt } from '@/components/content/CoverArt';
import { ChevronLeft, ChevronRight, ExternalLink, X } from '@/components/icons';
import type { Artwork } from '@/types';

import styles from './Gallery.module.css';
import viewer from './GalleryViewer.module.css';

const ratioOf = (work: Artwork) =>
  typeof work.image === 'string' ? 4 / 3 : work.image.width / work.image.height;

/**
 * Le mur de la galerie et sa visionneuse : un clic ouvre l'œuvre en plein écran, puis on passe
 * de l'une à l'autre en faisant défiler (molette, pavé tactile, doigt), avec les flèches ou au
 * clavier. Échap ferme ; le focus revient sur l'œuvre ouverte.
 */
export function GalleryViewer({ works }: { works: Artwork[] }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const opener = useRef<HTMLButtonElement | null>(null);
  const [current, setCurrent] = useState(0);

  const goTo = useCallback((index: number, smooth = true) => {
    const slide = track.current?.children[index] as HTMLElement | undefined;
    slide?.scrollIntoView({
      behavior: smooth ? 'smooth' : 'instant',
      inline: 'start',
      block: 'nearest',
    });
  }, []);

  const open = (index: number, button: HTMLButtonElement) => {
    opener.current = button;
    setCurrent(index);
    dialog.current?.showModal();
    // La piste n'a sa largeur qu'une fois la boîte ouverte.
    requestAnimationFrame(() => goTo(index, false));
  };

  // L'œuvre affichée suit le défilement.
  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const onScroll = () => setCurrent(Math.round(el.scrollLeft / Math.max(el.clientWidth, 1)));
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  // Molette verticale : on défile de côté, comme dans une galerie.
  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const onWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
      event.preventDefault();
      el.scrollBy({ left: event.deltaY, behavior: 'auto' });
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  const step = (delta: number) => goTo(Math.min(works.length - 1, Math.max(0, current + delta)));

  return (
    <>
      <ul className={styles.grid}>
        {works.map((work, index) => (
          <li key={work.sourceUrl}>
            <figure className={styles.item} style={{ '--ratio': ratioOf(work) } as CSSProperties}>
              <button
                type="button"
                className={styles.open}
                onClick={(event) => open(index, event.currentTarget)}
                aria-label={`Voir en grand : ${work.title}`}
                data-testid="gallery-open"
              >
                <CoverArt
                  artwork={work}
                  decorative={false}
                  sizes="(min-width: 1100px) 360px, (min-width: 640px) 45vw, 100vw"
                  className={styles.frame}
                />
              </button>
              <Caption work={work} />
            </figure>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialog}
        className={viewer.viewer}
        aria-label="Galerie en plein écran"
        onClose={() => opener.current?.focus()}
        onKeyDown={(event) => {
          if (event.key === 'ArrowRight') {
            event.preventDefault();
            step(1);
          } else if (event.key === 'ArrowLeft') {
            event.preventDefault();
            step(-1);
          }
        }}
        data-testid="gallery-viewer"
      >
        <div className={viewer.viewerBar}>
          <p className={viewer.counter} aria-live="polite">
            {current + 1} / {works.length}
          </p>
          <button
            type="button"
            className={viewer.viewerButton}
            onClick={() => dialog.current?.close()}
            aria-label="Fermer la galerie"
          >
            <X size={22} aria-hidden="true" />
          </button>
        </div>

        <div ref={track} className={viewer.track}>
          {works.map((work) => (
            <figure key={work.sourceUrl} className={viewer.slide}>
              <div className={viewer.slideMedia}>
                <Image
                  src={work.image}
                  alt={work.alt}
                  fill
                  sizes="100vw"
                  className={viewer.slideImage}
                />
              </div>
              <Caption work={work} light />
            </figure>
          ))}
        </div>

        <button
          type="button"
          className={`${viewer.viewerButton} ${viewer.prev}`}
          onClick={() => step(-1)}
          disabled={current === 0}
          aria-label="Œuvre précédente"
        >
          <ChevronLeft size={28} aria-hidden="true" />
        </button>
        <button
          type="button"
          className={`${viewer.viewerButton} ${viewer.next}`}
          onClick={() => step(1)}
          disabled={current === works.length - 1}
          aria-label="Œuvre suivante"
        >
          <ChevronRight size={28} aria-hidden="true" />
        </button>
      </dialog>
    </>
  );
}

function Caption({ work, light = false }: { work: Artwork; light?: boolean }) {
  return (
    <figcaption className={`${styles.caption} ${light ? viewer.captionLight : ''}`}>
      <span className={styles.title}>{work.title}</span>
      <span className="t-caption">{[work.date, work.holder].filter(Boolean).join(' · ')}</span>
      <a
        href={work.sourceUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`t-caption ${styles.link}`}
      >
        {work.license} · fiche et licence
        <ExternalLink size={12} strokeWidth={2.25} aria-hidden="true" />
      </a>
    </figcaption>
  );
}
