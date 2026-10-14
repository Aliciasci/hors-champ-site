import Image from 'next/image';
import type { CSSProperties } from 'react';

import type { Artwork, CoverImage, CoverMotif } from '@/types';

import { ArtworkInfo } from './ArtworkInfo';
import { objectPosition } from './artworkCredit';
import styles from './CoverArt.module.css';

type Tone = { bg: string; a: string; b: string; c: string };

const TONES: Tone[] = [
  { bg: 'var(--primary)', a: 'var(--surface-accent)', b: 'var(--accent)', c: 'var(--bg)' },
  { bg: 'var(--surface-accent)', a: 'var(--primary)', b: 'var(--accent)', c: 'var(--text)' },
  { bg: 'var(--accent)', a: 'var(--bg)', b: 'var(--primary-deep)', c: 'var(--surface-accent)' },
];

const f = (fill: string): CSSProperties => ({ fill });

function Motif({ motif, t }: { motif: CoverMotif; t: Tone }) {
  switch (motif) {
    case 'split':
      return (
        <g>
          <rect x={150} y={0} width={150} height={200} style={f(t.a)} />
          <circle cx={150} cy={110} r={58} style={f(t.b)} />
          <rect x={146} y={0} width={8} height={200} style={f(t.c)} />
        </g>
      );
    case 'circles':
      return (
        <g>
          <circle cx={90} cy={150} r={90} style={f(t.a)} />
          <circle cx={210} cy={70} r={52} style={f(t.b)} />
          <circle cx={210} cy={70} r={22} style={f(t.c)} />
        </g>
      );
    case 'frame':
      return (
        <g>
          <rect
            x={70}
            y={34}
            width={160}
            height={132}
            style={{ fill: 'none', stroke: t.a, strokeWidth: 14 }}
          />
          <rect x={92} y={56} width={116} height={88} style={f(t.b)} />
          <circle cx={240} cy={40} r={20} style={f(t.c)} />
        </g>
      );
    case 'stripes':
      return (
        <g>
          {[0, 1, 2, 3, 4, 5].map((index) => (
            <path
              key={index}
              d={`M${-60 + index * 70} 200 L${20 + index * 70} 0 L${48 + index * 70} 0 L${-32 + index * 70} 200 Z`}
              style={f(index % 2 === 0 ? t.a : t.b)}
            />
          ))}
        </g>
      );
    case 'arrows':
      return (
        <g style={{ fill: 'none', strokeWidth: 22 }}>
          <path d="M40 40 L130 100 L40 160" style={{ stroke: t.a }} />
          <path d="M130 40 L220 100 L130 160" style={{ stroke: t.b }} />
          <circle cx={262} cy={100} r={16} style={f(t.c)} />
        </g>
      );
    case 'arch':
      return (
        <g>
          <path d="M30 200 L30 120 A70 70 0 0 1 170 120 L170 200 Z" style={f(t.a)} />
          <path d="M150 200 L150 90 A60 60 0 0 1 270 90 L270 200 Z" style={f(t.b)} />
          <circle cx={100} cy={60} r={14} style={f(t.c)} />
        </g>
      );
  }
}

export interface CoverArtProps {
  /** Œuvre (titre, crédit, cadrage) — prioritaire après `image`. */
  artwork?: Artwork | null;
  /** Image propre à un contenu. */
  image?: CoverImage | null;
  /** Composition géométrique de repli. */
  motif?: CoverMotif;
  tone?: 0 | 1 | 2;
  /** Masque l'image aux lecteurs d'écran (cartes déjà décrites par leur texte). */
  decorative?: boolean;
  /** Aplat d'encre décalé et légère inclinaison (thème Revue uniquement). */
  offset?: boolean;
  /** Bouton « i » affichant le crédit (jamais dans un lien : bouton dans un lien interdit). */
  credit?: boolean;
  /** Image de tête (LCP) : préchargée. */
  priority?: boolean;
  /** Chargée sans attendre le défilement (au-dessus de la ligne de flottaison). */
  eager?: boolean;
  /** Largeurs affichées, pour choisir la bonne déclinaison. */
  sizes: string;
  /** Classe qui fixe le format (hauteur ou ratio). */
  className?: string;
}

/** Couverture : image propre, œuvre, ou composition géométrique en repli. */
export function CoverArt({
  artwork,
  image,
  motif = 'frame',
  tone = 0,
  decorative = true,
  offset = false,
  credit = false,
  priority = false,
  eager = false,
  sizes,
  className,
}: CoverArtProps) {
  const src = image?.source ?? artwork?.image;
  const alt = image?.alt ?? artwork?.alt ?? '';
  const t = TONES[tone] ?? TONES[0]!;

  return (
    <div className={`${styles.wrap} ${offset ? styles.offset : ''}`}>
      {offset ? <span className={`${styles.ink} only-revue`} aria-hidden="true" /> : null}
      <div
        className={`${styles.frame} ${className ?? ''}`}
        style={src === undefined ? { background: t.bg } : undefined}
        aria-hidden={src === undefined || decorative ? true : undefined}
      >
        {src !== undefined ? (
          <Image
            src={src}
            alt={decorative ? '' : alt}
            fill
            sizes={sizes}
            preload={priority}
            fetchPriority={priority || eager ? 'high' : undefined}
            loading={priority || eager ? 'eager' : undefined}
            className={styles.img}
            style={{ objectPosition: image ? 'center' : objectPosition(artwork ?? undefined) }}
          />
        ) : (
          <svg viewBox="0 0 300 200" preserveAspectRatio="xMidYMid slice" className={styles.motif}>
            <Motif motif={motif} t={t} />
          </svg>
        )}
      </div>
      {credit && artwork && !image ? <ArtworkInfo artwork={artwork} /> : null}
    </div>
  );
}
