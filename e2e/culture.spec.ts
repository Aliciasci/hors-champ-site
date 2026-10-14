import { expect, test } from '@playwright/test';

import { open, seedState, storedState, watchConsole } from './helpers';

test('accueil → fiche → lien relié → enregistrer → bibliothèque', async ({ page }) => {
  const console = watchConsole(page);
  await seedState(page);
  await open(page, '/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText(
    'L’histoire les a laissées hors champ.',
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

test('droits dans le monde : années clés et curseur font évoluer la carte', async ({ page }) => {
  await seedState(page);
  await open(page, '/droits/');
  await page.getByTestId('rights-world').click();
  await expect(page).toHaveURL(/\/droits\/monde\/$/);
  await expect(page.getByTestId('suffrage-tile-FRA')).toHaveAttribute('data-state', 'full');
  await page.getByTestId('suffrage-key-1918').click();
  await expect(page.getByTestId('suffrage-tile-FRA')).toHaveAttribute('data-state', 'none');
  await expect(page.getByTestId('suffrage-tile-GBR')).toHaveAttribute('data-state', 'partial');
  await page.getByTestId('suffrage-year').fill('1893');
  await expect(page.getByTestId('suffrage-count')).toContainText('1 des');

  // Autre droit : l'avortement, avec le recul soviétique de 1936.
  await page.getByTestId('world-right-avortement').click({ force: true });
  await expect(page).toHaveURL(/droit=avortement/);
  await expect(page.getByTestId('suffrage-tile-FRA')).toHaveAttribute('data-state', 'full');
  await page.getByTestId('suffrage-key-1936').click();
  await expect(page.getByTestId('suffrage-tile-RUS')).toHaveAttribute('data-state', 'partial');
  await expect(page.getByTestId('suffrage-tile-FRA')).toHaveAttribute('data-state', 'none');
});

test('activités : « Pour qui ? » filtre les blocs et se reflète dans l’URL', async ({ page }) => {
  await seedState(page);
  await open(page, '/activites/');
  await expect(page.getByTestId('activities-kids')).toBeVisible();
  await page.getByTestId('activities-for-jeunes').click({ force: true });
  await expect(page).toHaveURL(/pour=jeunes/);
  await expect(page.getByTestId('activities-kids')).toBeVisible();
  await expect(page.locator('#contrechamps-title')).toHaveCount(0);
  await page.getByTestId('activities-for-adultes').click({ force: true });
  await expect(page.getByTestId('activities-kids')).toHaveCount(0);
  await expect(page.locator('#contrechamps-title')).toBeVisible();
});

test('« Et vous ? » : l’année de naissance donne l’âge à chaque conquête', async ({ page }) => {
  await seedState(page);
  await open(page, '/droits/');
  await page.getByTestId('birth-year-input').fill('1960');
  const result = page.getByTestId('birth-year-result');
  await expect(result).toContainText('vous aviez 15 ans');
  await expect(result).toContainText('16 ans avant votre naissance');
});
