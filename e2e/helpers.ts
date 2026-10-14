import { expect, type Page } from '@playwright/test';

/**
 * Visite déjà accueillie : pas de bandeau de bienvenue, et ouverture de la une déjà vue (sauf
 * `showIntro`, pour les tests qui portent sur elle).
 */
export async function seedState(
  page: Page,
  preferences: Record<string, unknown> = {},
  { showIntro = false }: { showIntro?: boolean } = {},
) {
  await page.addInitScript(
    ({ prefs, showIntro }) => {
      if (sessionStorage.getItem('seeded')) return;
      sessionStorage.setItem('seeded', '1');
      if (!showIntro) localStorage.setItem('hors-champ:intro-vue', '1');
      localStorage.setItem(
        'hors-champ:state',
        JSON.stringify({
          version: 4,
          state: { preferences: { onboardingCompleted: true, ...prefs } },
        }),
      );
    },
    { prefs: preferences, showIntro },
  );
}

export const isDesktop = (page: Page) => (page.viewportSize()?.width ?? 0) >= 900;

/** Aucune erreur console ni exception pendant le parcours. */
export function watchConsole(page: Page) {
  const errors: string[] = [];
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text());
  });
  page.on('pageerror', (e) => errors.push(e.message));
  return {
    check: () => expect(errors, errors.join('\n')).toEqual([]),
  };
}

export async function storedState(page: Page) {
  return page.evaluate(() => JSON.parse(localStorage.getItem('hors-champ:state') ?? '{}'));
}

/** Navigue et attend l'hydratation (plus aucune requête en cours). */
export async function open(page: Page, url: string) {
  await page.goto(url);
  await page.waitForLoadState('networkidle');
}
