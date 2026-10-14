import { expect, test } from '@playwright/test';

import { isDesktop, open, seedState, watchConsole } from './helpers';

const ID = 'meme-mail-deux-lectures';

test('catalogue filtré → jouer → quitter à l’étape 2 → recharger → reprendre → valider → analyse → continuer', async ({
  page,
}) => {
  const console = watchConsole(page);
  await seedState(page);
  await open(page, '/contrechamps/');
  await open(page, '/contrechamps/catalogue/');

  // Filtre « Doubles standards » (colonne sur grand écran, panneau sur mobile).
  if (isDesktop(page)) {
    await page.getByTestId('filtre-theme-doubles-standards').click({ force: true });
  } else {
    await page.getByTestId('catalogue-filters-toggle').click();
    await page.getByTestId('panneau-theme-doubles-standards').click({ force: true });
    await page.getByTestId('catalogue-filters-apply').click();
  }
  await expect(page).toHaveURL(/themes=doubles-standards/);
  await page.getByTestId(`catalogue-card-${ID}`).click();

  await expect(page).toHaveURL(new RegExp(`/contrechamps/${ID}/$`));
  await page.getByTestId('detail-start').click();
  await expect(page).toHaveURL(/jouer/);
  await page.getByTestId('player-to-question').click();
  await expect(page).toHaveURL(/etape=2/);
  await page.getByTestId('option-indice-double-standard').click();

  // Quitter, recharger : même étape, même sélection.
  await open(page, '/');
  await open(page, `/contrechamps/${ID}/`);
  await page.getByTestId('detail-resume').click();
  await expect(page).toHaveURL(/etape=2/);
  await expect(page.locator(`input[value="indice-double-standard"]`)).toBeChecked();
  await page.reload();
  await expect(page.locator(`input[value="indice-double-standard"]`)).toBeChecked();

  await page.getByTestId('player-submit').click();
  await expect(page.getByTestId('player-outcome')).toBeVisible();
  await page.getByTestId('player-finish').click();
  await expect(page).toHaveURL(/analyse/);
  await expect(page.getByTestId('result-outcome')).toContainText('Un raisonnement bien appuyé');
  await page.getByTestId('result-continue').click();
  await expect(page).toHaveURL(/\/contrechamps\//);
  console.check();
});

test('lecteur entièrement utilisable au clavier', async ({ page, browserName }) => {
  test.skip(
    browserName === 'webkit',
    'WebKit (macOS) ne place pas le focus sur les liens avec Tab par défaut',
  );
  await seedState(page);
  await open(page, `/contrechamps/${ID}/jouer/`);
  // Étape 1 → 2 au clavier.
  await page.getByTestId('player-to-question').focus();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/etape=2/);
  // Le focus est sur le titre de l'étape.
  await expect(page.locator(':focus')).toHaveText(/.+/);
  // Chiffre 1 : sélectionne la première option ; Entrée : valide.
  await page.keyboard.press('1');
  await expect(page.locator('input[name]').first()).toBeChecked();
  await page.keyboard.press('Enter');
  await expect(page.getByTestId('player-outcome')).toBeVisible();
  await expect(page).toHaveURL(/etape=3/);
  // Le bouton retour du navigateur remonte d'une étape.
  await page.goBack();
  await expect(page).toHaveURL(/etape=2/);
});

test('analyse sans réponse enregistrée : invitation à faire le contrechamp', async ({ page }) => {
  await seedState(page);
  await open(page, `/contrechamps/${ID}/analyse/`);
  await expect(page.getByTestId('result-no-answer')).toBeVisible();
});
