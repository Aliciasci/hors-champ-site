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
  // Par défaut, le récit ; la carte à explorer est un mode choisi en haut de page.
  await expect(page.getByTestId('chapter-vote')).toBeVisible();
  await expect(page.locator('[data-testid^="explore-"]')).toHaveCount(0);
  await page.getByTestId('world-mode-explorer').click({ force: true });
  await expect(page).toHaveURL(/mode=explorer/);
  await expect(page.getByTestId('explore-vote')).toBeVisible();
  await expect(page.locator('[data-testid^="chapter-"]')).toHaveCount(0);
  await expect(page.getByTestId('suffrage-tile-FRA')).toHaveAttribute('data-state', 'full');
  await page.getByTestId('suffrage-key-1918').click();
  await expect(page.getByTestId('suffrage-tile-FRA')).toHaveAttribute('data-state', 'none');
  await expect(page.getByTestId('suffrage-tile-GBR')).toHaveAttribute('data-state', 'partial');
  await page.getByTestId('suffrage-year').fill('1893');
  await expect(page.getByTestId('suffrage-count')).toContainText('1 des');

  // Autre droit : l'avortement, avec le recul soviétique de 1936.
  await page.getByTestId('world-right-avortement').click({ force: true });
  await expect(page).toHaveURL(/droit=avortement/);
  await expect(page).toHaveURL(/mode=explorer/);
  await expect(page.getByTestId('explore-avortement')).toBeVisible();
  await expect(page.getByTestId('suffrage-tile-FRA')).toHaveAttribute('data-state', 'full');
  await page.getByTestId('suffrage-key-1936').click();
  await expect(page.getByTestId('suffrage-tile-RUS')).toHaveAttribute('data-state', 'partial');
  await expect(page.getByTestId('suffrage-tile-FRA')).toHaveAttribute('data-state', 'none');

  // Retour au récit : un seul chapitre, celui du droit choisi.
  await page.getByTestId('world-mode-recit').click({ force: true });
  await expect(page).not.toHaveURL(/mode=/);
  await expect(page.locator('[data-testid^="chapter-"]')).toHaveCount(1);
  await expect(page.getByTestId('chapter-avortement')).toBeVisible();
  await expect(page.locator('[data-testid^="explore-"]')).toHaveCount(0);
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

test('ouverture : jouée une seule fois, « Passer » ou la dépasser la retire', async ({ page }) => {
  await seedState(page, {}, { showIntro: true });
  await open(page, '/');
  const intro = page.getByTestId('intro');
  await expect(intro).toBeVisible();
  await page.getByTestId('intro-skip').click();
  await expect(intro).toHaveCount(0);
  await page.reload();
  await page.waitForLoadState('networkidle');
  await expect(page.getByTestId('intro')).toHaveCount(0);
  await expect(page.getByRole('heading', { level: 1 })).toBeInViewport();
});

test('ouverture : la dépasser en faisant défiler la retire sans déplacer le contenu', async ({
  page,
}) => {
  await seedState(page, {}, { showIntro: true });
  await open(page, '/');
  const bottom = await page
    .getByTestId('intro')
    .evaluate((e) => e.getBoundingClientRect().bottom + window.scrollY);
  await page.evaluate((y) => window.scrollTo(0, y), bottom + 50);
  await expect(page.getByTestId('intro')).toHaveCount(0);
  await expect(page.locator('html')).toHaveAttribute('data-intro', 'vue');
  const scroll = await page.evaluate(() => window.scrollY);
  expect(scroll).toBeLessThan(200);
});

test('Elles sur la carte : un pays, ses femmes, et la thématique qui filtre', async ({ page }) => {
  await seedState(page);
  await open(page, '/elles/');
  await page.getByTestId('elles-view-carte').click({ force: true });
  await expect(page).toHaveURL(/vue=carte/);
  await expect(page.getByTestId('women-map')).toBeVisible();
  await expect(page.getByTestId('wall')).toHaveCount(0);

  // Au clavier comme à la souris : la liste des pays.
  await page.getByTestId('women-country-POL').click({ force: true });
  await expect(page).toHaveURL(/pays=POL/);
  await expect(page.getByTestId('women-country-title')).toHaveText('Pologne');
  await expect(page.getByTestId('women-row-person-marie-curie')).toBeVisible();
  // Un pays européen : la carte zoome sur l'Europe.
  await expect(page.getByTestId('women-zoom-europe')).toBeChecked();

  // Le pays sur la carte (sur un petit écran, où les pastilles se touchent : dans la liste).
  await page.getByTestId('women-zoom-monde').click({ force: true });
  if ((page.viewportSize()?.width ?? 0) >= 900) await page.getByTestId('women-bubble-PAK').click();
  else await page.getByTestId('women-country-PAK').click({ force: true });
  await expect(page.getByTestId('women-country-title')).toHaveText('Pakistan');
  await expect(page.getByTestId('women-row-person-malala-yousafzai')).toBeVisible();
  await expect(page.getByTestId('women-row-person-benazir-bhutto')).toBeVisible();
  await expect(page.getByTestId('women-zoom-monde')).toBeChecked();

  // La thématique filtre aussi la carte.
  await page.getByTestId('women-country-back').click();
  await page.getByTestId('elles-theme-oubliees').click({ force: true });
  await expect(page.getByTestId('women-tile-PAK')).toHaveAttribute('data-count', '0');
  await expect(page.getByTestId('women-tile-AUT')).not.toHaveAttribute('data-count', '0');

  // Retour au mur.
  await page.getByTestId('elles-view-mur').click({ force: true });
  await expect(page.getByTestId('wall')).toBeVisible();
  await expect(page).not.toHaveURL(/vue=/);
});

test('page du monde : le chapitre suivant enchaîne les droits, du dernier au premier', async ({
  page,
}) => {
  await seedState(page);
  await open(page, '/droits/monde/?droit=majorite');
  await expect(page.getByTestId('chapter-majorite')).toBeVisible();
  await expect(page.getByTestId('world-next-chapter')).toContainText('Avorter.');
  await page.getByTestId('world-next-chapter').click();
  await expect(page).toHaveURL(/droit=avortement/);
  await expect(page.getByTestId('chapter-avortement')).toBeVisible();
  // Après le dernier droit, on revient au premier.
  await expect(page.getByTestId('world-next-chapter')).toContainText('Voter.');
  await page.getByTestId('world-next-chapter').click();
  await expect(page).not.toHaveURL(/droit=/);
  await expect(page.getByTestId('chapter-vote')).toBeVisible();
});

test('thème Atlas : la page du monde en récit illustré, puis la vraie carte à explorer', async ({
  page,
}) => {
  const console = watchConsole(page);
  await seedState(page, { themeId: 'atlas' });
  await open(page, '/droits/monde/');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'atlas');
  // Le récit Atlas remplace le récit défilant, masqué dans ce thème.
  const story = page.getByTestId('atlas-story-vote');
  await expect(story).toBeVisible();
  await expect(page.getByTestId('chapter-vote')).toBeHidden();
  await expect(story).toContainText('1893');
  await page.getByTestId('atlas-step-2').click();
  await expect(story.getByRole('heading', { level: 2 })).toContainText('Françaises');
  await expect(page.getByTestId('atlas-figure-person-hubertine-auclert')).toBeVisible();
  await expect(page.getByTestId('atlas-dates-vote').locator('li')).toHaveCount(4);

  // Un pays choisi dans la liste : son étiquette sur la carte.
  await page.getByTestId('atlas-country').selectOption('CHE');
  await expect(story).toContainText('Suisse');

  // Autre droit, sans femme associée : pas de portrait.
  await page.getByTestId('world-right-majorite').click({ force: true });
  await expect(page.getByTestId('atlas-story-majorite')).toBeVisible();
  await expect(page.locator('[data-testid^="atlas-figure-"]:visible')).toHaveCount(0);

  // À vous d'explorer : la vraie carte remplace les tuiles.
  await page.getByTestId('world-mode-explorer').click({ force: true });
  await expect(page.getByTestId('suffrage-map')).toBeHidden();
  await page.getByTestId('suffrage-key-1938').click();
  await expect(page.getByTestId('suffrage-count')).toContainText('1938');

  // Retour au thème Cartel : la page classique revient.
  await page.getByTestId('world-mode-recit').click({ force: true });
  await page.getByTestId('footer-theme-cartel').check({ force: true });
  await expect(page.getByTestId('chapter-majorite')).toBeVisible();
  await expect(page.getByTestId('atlas-story-majorite')).toBeHidden();
  console.check();
});
