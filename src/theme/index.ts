import { cartel } from './themes/cartel';
import { revue } from './themes/revue';
import type { Theme, ThemeId } from './types';

/**
 * Thèmes de l'application mobile, conservés comme référence des jetons : le site les applique
 * par des variables CSS (src/styles/tokens.css), dont la concordance est testée.
 */
export const themes: Record<ThemeId, Theme> = { cartel, revue };

export { DEFAULT_THEME_ID, THEME_IDS } from './types';
export type { Theme, ThemeColors, ThemeId } from './types';
