import { expect, test } from '@playwright/test';

import { open, seedState, storedState, watchConsole } from './helpers';

test('accueil → fiche → lien relié → enregistrer → bibliothèque', async ({ page }) => {
  const console = watchConsole(page);
  await seedState(page);
  await open(page, '/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText(
    'Elles ont peint, calculé, découvert.',
  );

  await page.getByTestId('discover-feed').getByRole('link').first().click();
  await expect(page).toHaveURL(/\/culture\//);
  const firstTitle = await page.getByRole('heading', { level: 1 }).textContent();

  const related = page.locator('[data-testid^="culture-link-"]').first();
  await related.click();
  await expect(page.getByRole('heading', { level: 1 })).not.toHaveText(firstTitle ?? '');
  const title = (await page.getByRole('heading', { level: 1 }).textContent())!.trim();

  const save = page.getByTestId('discovery-save');
  await expect(save).toHaveAttribute('aria-pressed', 'false');
  await save.click();
  await expect(save).toHaveAttribute('aria-pressed', 'true');

  await page.getByTestId('header-library').click();
  await expect(page).toHaveURL(/\/bibliotheque\//);
  await expect(page.getByTestId('library-discoveries')).toContainText(title);
  console.check();
});

test('lien profond sans historique : « Retour » mène à la page parente', async ({ page }) => {
  await seedState(page);
  await open(page, '/culture/person-lise-meitner/');
  await page.getByTestId('back-link').click();
  await expect(page).toHaveURL(/\/elles\/revolutionne\/$/);
});

test('après navigation interne, « Retour » revient à la page précédente', async ({ page }) => {
  await seedState(page);
  await open(page, '/collection/');
  await page.getByTestId('culture-person-lise-meitner').click();
  await expect(page).toHaveURL(/lise-meitner/);
  await page.getByTestId('back-link').click();
  await expect(page).toHaveURL(/\/collection\/$/);
});

test('l’ouverture d’une fiche est mémorisée comme exploration', async ({ page }) => {
  await seedState(page);
  await open(page, '/culture/person-ada-lovelace/');
  await expect
    .poll(async () => (await storedState(page)).state?.exploredEntityIds)
    .toContain('person-ada-lovelace');
});

test('droits : recherche sans accents, reflétée dans l’URL', async ({ page }) => {
  await seedState(page);
  await open(page, '/droits/');
  // Saisie sans accents : « égalité » est trouvé.
  await page.getByTestId('rights-search').fill('egalite professionnelle');
  await expect(page.getByTestId('rights-right-egalite-professionnelle')).toBeVisible();
  await expect(page.getByTestId('rights-right-droit-de-vote')).toHaveCount(0);
  await expect(page).toHaveURL(/q=egalite/);
  await page.reload();
  await expect(page.getByTestId('rights-search')).toHaveValue('egalite professionnelle');
  await expect(page.getByTestId('rights-right-egalite-professionnelle')).toBeVisible();
  // Recherche par nom de contributrice.
  await page.getByTestId('rights-search').fill('halimi');
  await expect(page.getByTestId('rights-count')).not.toHaveText('0 conquête');
});

test('collection : filtre de domaine dans l’URL', async ({ page }) => {
  await seedState(page);
  await open(page, '/collection/?domaine=droits');
  await expect(page.getByTestId('culture-domain-droits')).toBeChecked();
  await expect(page.getByRole('heading', { name: 'Conquêtes' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Œuvres' })).toHaveCount(0);
});
