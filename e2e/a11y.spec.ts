import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

import { open, seedState } from './helpers';

/** Un exemple de chaque gabarit de page, dans les deux thèmes. */
const PAGES = [
  '/',
  '/?rubrique=droits',
  '/bienvenue/',
  '/elles/',
  '/elles/oubliees/',
  '/activites/',
  '/possible/',
  '/possible/metier-astronome/',
  '/possible/portrait-mary-anning/',
  '/possible/activite-observer/',
  '/possible/vie-oceans/',
  '/droits/',
  '/droits/monde/',
  '/droits/monde/?mode=explorer',
  '/collection/',
  '/culture/person-lise-meitner/',
  '/culture/right-ivg/',
  '/culture/event-1903-nobel-curie/',
  '/contrechamps/',
  '/contrechamps/catalogue/',
  '/contrechamps/meme-mail-deux-lectures/',
  '/contrechamps/meme-mail-deux-lectures/jouer/',
  '/contrechamps/meme-mail-deux-lectures/analyse/',
  '/bibliotheque/',
  '/profil/',
  '/credits/',
  '/a-propos/',
  '/page-inexistante/',
];

for (const theme of ['cartel', 'revue'] as const) {
  for (const path of PAGES) {
    test(`axe ${theme} ${path}`, async ({ page, browserName }) => {
      test.skip(browserName !== 'chromium', 'axe : un seul moteur suffit');
      // La une est contrôlée avec son ouverture, telle qu'à la première visite.
      await seedState(page, { themeId: theme }, { showIntro: path === '/' });
      await open(page, path);
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
        .analyze();
      const summary = results.violations.map(
        (v) =>
          `${v.id} (${v.impact}) : ${v.nodes
            .map((n) => n.target.join(' '))
            .slice(0, 3)
            .join(' | ')}`,
      );
      expect(summary, summary.join('\n')).toEqual([]);
    });
  }
}

/** Le mode nuit, sur un échantillon de gabarits, dans les deux thèmes. */
const NIGHT_PAGES = [
  '/',
  '/droits/',
  '/droits/monde/',
  '/droits/monde/?mode=explorer',
  '/elles/',
  '/culture/person-lise-meitner/',
  '/activites/',
];
for (const theme of ['cartel', 'revue'] as const) {
  for (const path of NIGHT_PAGES) {
    test(`axe nuit ${theme} ${path}`, async ({ page, browserName }) => {
      test.skip(browserName !== 'chromium', 'axe : un seul moteur suffit');
      await seedState(page, { themeId: theme });
      await page.addInitScript(() => localStorage.setItem('hors-champ:scheme', 'dark'));
      await open(page, path);
      await expect(page.locator('html')).toHaveAttribute('data-scheme', 'dark');
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
        .analyze();
      const summary = results.violations.map(
        (v) =>
          `${v.id} (${v.impact}) : ${v.nodes
            .map((n) => n.target.join(' '))
            .slice(0, 3)
            .join(' | ')}`,
      );
      expect(summary, summary.join('\n')).toEqual([]);
    });
  }
}

test('un seul h1 par page', async ({ page, browserName }) => {
  test.skip(browserName !== 'chromium');
  await seedState(page);
  for (const path of PAGES) {
    await open(page, path);
    await expect(page.locator('h1'), path).toHaveCount(1);
  }
});
