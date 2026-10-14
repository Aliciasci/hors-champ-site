import type { Artwork } from '@/types';

export function formatArtworkCredit(artwork: Artwork): string {
  return [artwork.artist, `« ${artwork.title} »`, artwork.date, artwork.holder, artwork.license]
    .filter(Boolean)
    .join(', ');
}

/** Cadrage d'une œuvre recadrée (`focus`) en `object-position` CSS. */
export function objectPosition(artwork: Pick<Artwork, 'focus'> | undefined): string {
  return `${artwork?.focus?.left ?? '50%'} ${artwork?.focus?.top ?? '50%'}`;
}
