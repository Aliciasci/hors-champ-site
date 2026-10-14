import { readFileSync } from 'node:fs';
import path from 'node:path';

/** Couleurs hexadécimales d'un bloc CSS, repéré par son sélecteur. */
function block(file: string, selector: string): Record<string, string> {
  const css = readFileSync(path.join(process.cwd(), file), 'utf8');
  const start = css.indexOf(selector);
  const body = css.slice(css.indexOf('{', start) + 1, css.indexOf('\n}', start));
  return Object.fromEntries(
    [...body.matchAll(/--([a-z0-9-]+):\s*(#[0-9a-f]{6})/gi)].map((m) => [m[1]!, m[2]!]),
  );
}

function luminance(hex: string): number {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255) as [
    number,
    number,
    number,
  ];
  const lin = (v: number) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

const contrast = (a: string, b: string) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x) as [number, number];
  return (hi + 0.05) / (lo + 0.05);
};

const DOMAINS = ['arts', 'sciences', 'droits'];

/**
 * Surtitres de rubrique ou de teinte sur le fond, les cartes et leur fond pâle ; pastille pleine
 * (texte clair sur la teinte) ; textes sur les encarts.
 */
const PAIRS: [string, string][] = [
  ...DOMAINS.flatMap((d): [string, string][] => [
    [`dom-${d}`, 'bg'],
    [`dom-${d}`, 'surface'],
    [`dom-${d}`, `dom-${d}-soft`],
    ['text', `dom-${d}-soft`],
    ['on-primary', `dom-${d}`],
  ]),
  ['day-ink', 'bg'],
  ['day-ink', 'surface'],
  ['on-primary', 'day-ink'],
  ['day-ink', 'day-soft'],
  ['text', 'day-soft'],
  ['accent-ink', 'possible-soft'],
  ['text', 'possible-soft'],
];

describe.each([
  ['Cartel', 'src/styles/tokens.css', ":root,\n[data-theme='cartel']"],
  ['Revue', 'src/styles/tokens.css', "[data-theme='revue']"],
  ['Atlas', 'src/styles/tokens.css', "[data-theme='atlas']"],
  ['Cartel nuit', 'src/styles/night.css', "[data-scheme='dark'],"],
  ['Revue nuit', 'src/styles/night.css', "[data-scheme='dark'][data-theme='revue']"],
  ['Atlas nuit', 'src/styles/night.css', "[data-scheme='dark'][data-theme='atlas']"],
])('couleurs de rubrique, %s', (_name, file, selector) => {
  const colors = block(file, selector);
  it.each(PAIRS)('%s sur %s ≥ 4,5:1', (fg, bg) => {
    expect(colors[fg], fg).toBeDefined();
    expect(colors[bg], bg).toBeDefined();
    expect(contrast(colors[fg]!, colors[bg]!)).toBeGreaterThanOrEqual(4.5);
  });
});
