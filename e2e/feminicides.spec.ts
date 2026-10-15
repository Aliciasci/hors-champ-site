import { expect, test } from '@playwright/test';

import { open, seedState, watchConsole } from './helpers';

test('féminicides : avertissement, aide, et un récit qu’on parcourt librement', async ({
  page,
}) => {
  const console = watchConsole(page);
  await seedState(page);
  await open(page, '/feminicides/');

  // L'avertissement et les numéros d'aide, dès l'entrée.
  await expect(page.getByLabel('Avertissement')).toContainText('3919');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Derrière chaque chiffre, une histoire.',
  );

  // Les chiffres portent leur année et leur source.
  const figure = page.getByTestId('fem-figure-france');
  await expect(figure).toContainText('111');
  await expect(figure).toContainText('2025');
  await expect(figure.getByRole('link')).toHaveAttribute('href', /^https:/);

  // La progression mène au dernier acte, qui ouvre trois sorties.
  await page.getByTestId('fem-progress-4').click();
  await expect(page.getByTestId('fem-progress-4')).toHaveAttribute('aria-current', 'step');
  await page.getByTestId('fem-out-aide').click();
  await expect(page).toHaveURL(/#aide$/);
  const help = page.getByTestId('fem-help');
  await expect(help).toBeInViewport();
  await expect(help.getByRole('link', { name: '3919' })).toHaveAttribute('href', 'tel:3919');
  await expect(help.getByRole('link', { name: '17' })).toHaveAttribute('href', 'tel:17');

  // Quitter ramène à l'accueil, sans détour.
  await page.getByTestId('fem-exit').click();
  await expect(page).toHaveURL(/\/$/);
  console.check();
});

test('féminicides : les animations s’arrêtent, et tout reste lisible', async ({ page }) => {
  await seedState(page);
  await open(page, '/feminicides/');
  const root = page.getByTestId('feminicides');
  const toggle = page.locator('[data-testid^="fem-motion"]:visible');
  await expect(root).toHaveAttribute('data-motion', 'on');
  await toggle.click();
  await expect(root).toHaveAttribute('data-motion', 'off');
  await expect(toggle).toHaveAttribute('aria-pressed', 'true');
  // Sans animation, aucun texte n'attend d'apparaître.
  await expect(page.getByText('Un avenir qui lui appartenait.')).toHaveCSS('opacity', '1');

  // Le choix tient au rechargement.
  await page.reload();
  await expect(root).toHaveAttribute('data-motion', 'off');
});

test.describe('féminicides, réglage « réduire les animations »', () => {
  test.use({ reducedMotion: 'reduce' });

  test('la version immobile garde tout le récit', async ({ page }) => {
    await seedState(page);
    await open(page, '/feminicides/');
    await expect(page.getByTestId('feminicides')).toHaveAttribute('data-motion', 'off');
    await expect(page.getByText('Certaines n’ont jamais pu rentrer chez elles.')).toHaveCSS(
      'opacity',
      '1',
    );
    await expect(page.getByText('Agir l’est aussi.')).toHaveCSS('opacity', '1');
  });
});
