import { expect, test } from '@playwright/test';

import { open, seedState, storedState } from './helpers';

test('changer de thème → rechargement sans flash → thème conservé', async ({ page }) => {
  await seedState(page);
  await open(page, '/');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'cartel');
  await page.getByTestId('footer-theme-revue').check({ force: true });
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'revue');

  // Le thème doit être posé avant tout script React : on lit l'attribut dès le DOM initial.
  const themes: string[] = [];
  await page.exposeFunction('reportTheme', (t: string) => themes.push(t));
  await page.addInitScript(() => {
    document.addEventListener('DOMContentLoaded', () =>
      (window as unknown as { reportTheme: (t: string) => void }).reportTheme(
        document.documentElement.dataset.theme ?? '',
      ),
    );
  });
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'revue');
  expect(themes[0]).toBe('revue');
});

test('effacer mes données : onboarding et thème conservés', async ({ page }) => {
  await seedState(page, { themeId: 'revue' });
  await open(page, '/culture/person-ada-lovelace/');
  await page.getByTestId('discovery-save').click();
  await open(page, '/profil/');
  await page.getByTestId('profile-reset').click();
  await expect(page.getByTestId('reset-dialog')).toBeVisible();
  await page.getByTestId('reset-confirm').click();
  await expect.poll(async () => (await storedState(page)).state?.savedDiscoveries).toEqual([]);
  const state = (await storedState(page)).state;
  expect(state.preferences.onboardingCompleted).toBe(true);
  expect(state.preferences.themeId).toBe('revue');
  expect(state.exploredEntityIds).toEqual([]);
});

test('première visite : bandeau de bienvenue, onboarding passable', async ({ page }) => {
  await open(page, '/');
  await expect(page.getByTestId('welcome-banner')).toBeVisible();
  await page.getByTestId('welcome-banner').getByRole('link', { name: 'Commencer' }).click();
  await expect(page).toHaveURL(/\/bienvenue\//);
  await page.getByTestId('onboarding-skip').click();
  await expect(page).toHaveURL(/localhost:\d+\/$/);
  await expect(page.getByTestId('welcome-banner')).toHaveCount(0);
});

test('Tout est possible : la tranche d’âge adapte les textes', async ({ page }) => {
  await seedState(page);
  await open(page, '/possible/metier-astronome/');
  await expect(
    page.getByText('Étudier l’Univers, des étoiles aux galaxies', { exact: false }).first(),
  ).toBeVisible();
  await open(page, '/possible/metier-astronome/?age=6-10');
  await expect(page.getByText('Comprendre les étoiles et les galaxies.').first()).toBeVisible();
  await expect.poll(async () => (await storedState(page)).state?.preferences?.ageBand).toBe('6-10');
  // Le choix est conservé sans paramètre d'URL.
  await open(page, '/possible/metier-astronome/');
  await expect(page.getByText('Comprendre les étoiles et les galaxies.').first()).toBeVisible();
});
