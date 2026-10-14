import type { Theme } from '../types';

/**
 * Cartel — le musée éditorial.
 * Papier ivoire, filets fins, angles droits, œuvres en couleurs d'origine.
 * Le cobalt est l'unique accent ; le vermillon ne sert qu'aux repères.
 * Contrastes calculés sur `background` (WCAG 2.x) : voir __tests__/theme-test.ts.
 */
const fonts = {
  display: 'CormorantGaramond_600SemiBold',
  displayStrong: 'CormorantGaramond_700Bold',
  displayItalic: 'CormorantGaramond_600SemiBold_Italic',
  body: 'IBMPlexSans_400Regular',
  bodyMedium: 'IBMPlexSans_500Medium',
  bodySemiBold: 'IBMPlexSans_600SemiBold',
  bodyBold: 'IBMPlexSans_700Bold',
  mono: 'IBMPlexMono_400Regular',
  monoMedium: 'IBMPlexMono_500Medium',
};

export const cartel: Theme = {
  id: 'cartel',
  name: 'Cartel',
  description: 'Le musée éditorial : papier ivoire, filets fins, œuvres en couleurs.',
  colors: {
    background: '#F3EEE5',
    surface: '#FBF8F2',
    surfaceAlt: '#E9E2D5',
    surfaceAccent: '#E4DCCB',
    onSurfaceAccent: '#15130F',
    surfaceAccentSoft: '#EFE9DD',
    primary: '#1E3AA8',
    primaryDeep: '#15297A',
    primarySoft: '#DFE3F3',
    onPrimary: '#F3EEE5',
    action: '#15130F',
    onAction: '#F3EEE5',
    accent: '#B8361A',
    accentFill: '#1E3AA8',
    onAccent: '#F3EEE5',
    accentInk: '#A12F16',
    accentSoft: '#F2DDD5',
    text: '#15130F',
    textSecondary: '#3E3A33',
    textMuted: '#5E584D',
    textInverse: '#F3EEE5',
    border: '#CFC6B4',
    borderStrong: '#15130F',
    overlay: 'rgba(21, 19, 15, 0.5)',
    feedback: {
      solid: '#1E6B45',
      solidSoft: '#DCEADF',
      partial: '#865700',
      partialSoft: '#F1E6CC',
      open: '#1E3AA8',
      openSoft: '#DFE3F3',
      weak: '#A12F16',
      weakSoft: '#F2DDD5',
    },
  },
  fonts,
  typography: {
    hero: { fontFamily: fonts.display, fontSize: 48, lineHeight: 48, letterSpacing: -0.5 },
    title1: { fontFamily: fonts.display, fontSize: 36, lineHeight: 38, letterSpacing: -0.3 },
    title2: { fontFamily: fonts.display, fontSize: 27, lineHeight: 30 },
    title3: { fontFamily: fonts.display, fontSize: 22, lineHeight: 26 },
    quote: { fontFamily: fonts.displayItalic, fontSize: 23, lineHeight: 29 },
    bodyLarge: { fontFamily: fonts.body, fontSize: 17, lineHeight: 27 },
    body: { fontFamily: fonts.body, fontSize: 15, lineHeight: 23 },
    bodySmall: { fontFamily: fonts.body, fontSize: 14, lineHeight: 20 },
    label: { fontFamily: fonts.bodySemiBold, fontSize: 15, lineHeight: 20 },
    overline: {
      fontFamily: fonts.monoMedium,
      fontSize: 11,
      lineHeight: 16,
      letterSpacing: 1.6,
      textTransform: 'uppercase',
    },
    caption: { fontFamily: fonts.bodyMedium, fontSize: 12, lineHeight: 17 },
    mono: { fontFamily: fonts.mono, fontSize: 12, lineHeight: 17 },
  },
  radii: { none: 0, sm: 0, md: 0, lg: 0, xl: 0, pill: 999, card: 0, button: 0, chip: 0, cover: 0 },
  borders: { hairline: 1, regular: 1, bold: 2 },
  shadows: { none: {}, card: {} },
  decor: {
    inkOffset: false,
    handDrawn: false,
    numbering: 'roman',
    selection: 'fill',
  },
};
