import { readFileSync } from 'node:fs';
import path from 'node:path';

import { THEME_IDS, themes, type ThemeColors } from '@/theme';

function luminance(hex: string): number {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255) as [
    number,
    number,
    number,
  ];
  const lin = (v: number) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x) as [number, number];
  return (hi + 0.05) / (lo + 0.05);
}

/** Couples texte / fond réellement utilisés, au seuil WCAG AA du texte courant (4,5:1). */
function textPairs(c: ThemeColors): [string, string, string][] {
  return [
    ['text / background', c.text, c.background],
    ['text / surface', c.text, c.surface],
    ['textSecondary / background', c.textSecondary, c.background],
    ['textMuted / background', c.textMuted, c.background],
    ['textMuted / surface', c.textMuted, c.surface],
    ['primary / background', c.primary, c.background],
    ['primary / surface', c.primary, c.surface],
    ['primary / primarySoft', c.primary, c.primarySoft],
    ['accentInk / background', c.accentInk, c.background],
    ['accentInk / surfaceAccentSoft', c.accentInk, c.surfaceAccentSoft],
    ['text / primarySoft', c.text, c.primarySoft],
    ['onPrimary / primary', c.onPrimary, c.primary],
    ['onAction / action', c.onAction, c.action],
    ['onAccent / accentFill', c.onAccent, c.accentFill],
    ['onSurfaceAccent / surfaceAccent', c.onSurfaceAccent, c.surfaceAccent],
    ['primaryDeep / primarySoft', c.primaryDeep, c.primarySoft],
    ['accentInk / accentSoft', c.accentInk, c.accentSoft],
    ['textInverse / text', c.textInverse, c.text],
    ['solid / solidSoft', c.feedback.solid, c.feedback.solidSoft],
    ['partial / partialSoft', c.feedback.partial, c.feedback.partialSoft],
    ['open / openSoft', c.feedback.open, c.feedback.openSoft],
    ['weak / weakSoft', c.feedback.weak, c.feedback.weakSoft],
  ];
}

describe.each(THEME_IDS.map((id) => [id]))('thème %s', (id) => {
  const theme = themes[id];

  it.each(textPairs(theme.colors))('%s ≥ 4,5:1', (_name, fg, bg) => {
    expect(contrast(fg, bg)).toBeGreaterThanOrEqual(4.5);
  });

  it('définit toutes les variantes typographiques avec une police', () => {
    for (const style of Object.values(theme.typography)) expect(style.fontFamily).toBeTruthy();
  });
});

/** Correspondance entre les jetons du mobile et les variables CSS du site. */
const CSS_VARS: Record<Exclude<keyof ThemeColors, 'feedback'>, string> = {
  background: '--bg',
  surface: '--surface',
  surfaceAlt: '--surface-alt',
  surfaceAccent: '--surface-accent',
  onSurfaceAccent: '--on-surface-accent',
  surfaceAccentSoft: '--surface-accent-soft',
  primary: '--primary',
  primaryDeep: '--primary-deep',
  primarySoft: '--primary-soft',
  onPrimary: '--on-primary',
  action: '--action',
  onAction: '--on-action',
  accent: '--accent',
  accentFill: '--accent-fill',
  onAccent: '--on-accent',
  accentInk: '--accent-ink',
  accentSoft: '--accent-soft',
  text: '--text',
  textSecondary: '--text-2',
  textMuted: '--text-muted',
  textInverse: '--text-inverse',
  border: '--border',
  borderStrong: '--border-strong',
  overlay: '--overlay',
};

function cssBlock(css: string, id: string): Record<string, string> {
  const start = css.indexOf(`[data-theme='${id}'] {`);
  const block = css.slice(start, css.indexOf('\n}', start));
  return Object.fromEntries(
    [...block.matchAll(/(--[\w-]+):\s*([^;]+);/g)].map((m) => [m[1], m[2]!.trim().toLowerCase()]),
  );
}

describe('variables CSS', () => {
  const css = readFileSync(path.resolve(__dirname, '../../src/styles/tokens.css'), 'utf8');

  it.each(THEME_IDS.map((id) => [id]))('%s reprend exactement les couleurs du mobile', (id) => {
    const vars = cssBlock(css, id);
    const c = themes[id].colors;
    for (const [key, name] of Object.entries(CSS_VARS)) {
      expect([name, vars[name]]).toEqual([name, c[key as keyof typeof CSS_VARS].toLowerCase()]);
    }
    for (const [key, value] of Object.entries(c.feedback)) {
      const name = `--fb-${key.replace('Soft', '-soft')}`;
      expect([name, vars[name]]).toEqual([name, value.toLowerCase()]);
    }
  });
});
