import { readFileSync } from 'node:fs';
import path from 'node:path';

/** Valeurs d'un bloc du mode nuit, lues dans src/styles/night.css. */
function block(selector: string): Record<string, string> {
  const css = readFileSync(path.join(process.cwd(), 'src/styles/night.css'), 'utf8');
  const start = css.indexOf(selector);
  const body = css.slice(css.indexOf('{', start) + 1, css.indexOf('}', start));
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

/** Couples texte / fond utilisés, au seuil WCAG AA du texte courant. */
const PAIRS: [string, string][] = [
  ['text', 'bg'],
  ['text', 'surface'],
  ['text-2', 'bg'],
  ['text-muted', 'bg'],
  ['text-muted', 'surface'],
  ['primary', 'bg'],
  ['primary', 'surface'],
  ['primary-deep', 'primary-soft'],
  ['accent-ink', 'bg'],
  ['accent-ink', 'surface-accent-soft'],
  ['on-primary', 'primary'],
  ['on-action', 'action'],
  ['on-accent', 'accent-fill'],
  ['on-accent', 'accent'],
  ['on-surface-accent', 'surface-accent'],
  ['fb-solid', 'fb-solid-soft'],
  ['fb-partial', 'fb-partial-soft'],
  ['fb-open', 'fb-open-soft'],
  ['fb-weak', 'fb-weak-soft'],
];

describe.each([
  ['Cartel', "[data-scheme='dark'],"],
  ['Revue', "[data-scheme='dark'][data-theme='revue']"],
  ['Atlas', "[data-scheme='dark'][data-theme='atlas']"],
])('mode nuit %s', (_name, selector) => {
  const colors = block(selector);
  it.each(PAIRS)('%s sur %s ≥ 4,5:1', (fg, bg) => {
    expect(colors[fg], fg).toBeDefined();
    expect(colors[bg], bg).toBeDefined();
    expect(contrast(colors[fg]!, colors[bg]!)).toBeGreaterThanOrEqual(4.5);
  });
});
