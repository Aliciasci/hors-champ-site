import {
  Caveat,
  Cormorant_Garamond,
  DM_Mono,
  IBM_Plex_Mono,
  IBM_Plex_Sans,
  Instrument_Sans,
  Noto_Serif_Display,
  Source_Serif_4,
  Young_Serif,
} from 'next/font/google';

/*
 * Polices auto-hébergées par next/font (téléchargées au build, aucune requête vers Google
 * côté visiteur). Sous-ensemble latin, graisses réellement utilisées.
 * Cartel (thème par défaut) est préchargé ; Revue et Atlas ne le sont pas, leurs polices arrivent
 * à la demande.
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
/** Texte courant des articles (fiches), commun aux deux thèmes : un serif de lecture longue. */
export const sourceSerif = Source_Serif_4({
  subsets: ['latin'],
  weight: ['400', '600'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-source-serif',
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

/** Atlas : titres en serif condensé très gras (axe de largeur), notes manuscrites. */
export const notoSerifDisplay = Noto_Serif_Display({
  subsets: ['latin'],
  axes: ['wdth'],
  display: 'swap',
  preload: false,
  variable: '--font-noto-serif-display',
});
export const caveat = Caveat({
  subsets: ['latin'],
  weight: ['500'],
  display: 'swap',
  preload: false,
  variable: '--font-caveat',
});

export const fontVariables = [
  cormorant,
  plexSans,
  plexMono,
  sourceSerif,
  youngSerif,
  instrumentSans,
  dmMono,
  notoSerifDisplay,
  caveat,
]
  .map((font) => font.variable)
  .join(' ');
