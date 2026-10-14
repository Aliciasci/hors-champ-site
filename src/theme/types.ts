export type ThemeId = 'cartel' | 'revue';

export const THEME_IDS: readonly ThemeId[] = ['cartel', 'revue'];

export const DEFAULT_THEME_ID: ThemeId = 'cartel';

export interface ThemeColors {
  background: string;
  surface: string;
  surfaceAlt: string;
  /** Surface de mise en avant (carte de progression, pastilles). */
  surfaceAccent: string;
  onSurfaceAccent: string;
  surfaceAccentSoft: string;
  primary: string;
  primaryDeep: string;
  primarySoft: string;
  onPrimary: string;
  /** Bouton d'action principal. */
  action: string;
  onAction: string;
  /** Accent décoratif (traits, repères) — jamais pour du texte courant. */
  accent: string;
  /** Fond des boutons d'accent. */
  accentFill: string;
  onAccent: string;
  /** Accent lisible en texte courant. */
  accentInk: string;
  accentSoft: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  textInverse: string;
  border: string;
  borderStrong: string;
  overlay: string;
  feedback: {
    solid: string;
    solidSoft: string;
    partial: string;
    partialSoft: string;
    open: string;
    openSoft: string;
    weak: string;
    weakSoft: string;
  };
}

export interface ThemeFonts {
  display: string;
  displayStrong: string;
  displayItalic: string;
  body: string;
  bodyMedium: string;
  bodySemiBold: string;
  bodyBold: string;
  mono: string;
  monoMedium: string;
}

export type TypographyVariant =
  | 'hero'
  | 'title1'
  | 'title2'
  | 'title3'
  | 'quote'
  | 'bodyLarge'
  | 'body'
  | 'bodySmall'
  | 'label'
  | 'overline'
  | 'caption'
  | 'mono';

export interface ThemeRadii {
  none: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  pill: number;
  /** Cartes éditoriales. */
  card: number;
  /** Boutons. */
  button: number;
  /** Filtres et étiquettes sélectionnables. */
  chip: number;
  /** Couvertures et œuvres. */
  cover: number;
}

export interface ThemeDecor {
  /** Aplat d'encre décalé derrière les couvertures (effet de repérage risographique). */
  inkOffset: boolean;
  /** Soulignements et cercles tracés « à la main ». */
  handDrawn: boolean;
  /** Numérotation des thèmes (salles en chiffres romains). */
  numbering: 'roman' | 'none';
  /** Sélection d'une réponse : aplat de couleur ou cercle tracé. */
  selection: 'fill' | 'circle';
}

/** Style typographique, exprimé en px comme sur mobile (les variables CSS en dérivent). */
export interface TypeStyle {
  fontFamily: string;
  fontSize: number;
  lineHeight: number;
  letterSpacing?: number;
  textTransform?: 'uppercase' | 'lowercase';
}

export interface Theme {
  id: ThemeId;
  name: string;
  description: string;
  colors: ThemeColors;
  fonts: ThemeFonts;
  typography: Record<TypographyVariant, TypeStyle>;
  radii: ThemeRadii;
  borders: { hairline: number; regular: number; bold: number };
  shadows: { none: Record<string, never>; card: Record<string, never> };
  decor: ThemeDecor;
}
