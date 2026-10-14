import {
  Cormorant_Garamond,
  DM_Mono,
  IBM_Plex_Mono,
  IBM_Plex_Sans,
  Instrument_Sans,
  Young_Serif,
} from 'next/font/google';

/*
 * Polices auto-hébergées par next/font (téléchargées au build, aucune requête vers Google
 * côté visiteur). Sous-ensemble latin, graisses réellement utilisées.
 * Cartel (thème par défaut) est préchargé ; Revue ne l'est pas, ses polices arrivent à la demande.
 */
export const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['600', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-cormorant',
});
export const plexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-plex-sans',
});
export const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  display: 'swap',
  // Surtitres en petits corps : pas de préchargement, ils ne retardent pas l'affichage.
  preload: false,
  variable: '--font-plex-mono',
});
export const youngSerif = Young_Serif({
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
  preload: false,
  variable: '--font-young-serif',
});
export const instrumentSans = Instrument_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  preload: false,
  variable: '--font-instrument-sans',
});
export const dmMono = DM_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  display: 'swap',
  preload: false,
  variable: '--font-dm-mono',
});

export const fontVariables = [cormorant, plexSans, plexMono, youngSerif, instrumentSans, dmMono]
  .map((font) => font.variable)
  .join(' ');
