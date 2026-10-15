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
  // La définition et la source se déplient sans quitter le récit.
  await figure.getByText('Ce que l’on compte, et la source').click();
  await expect(figure.getByRole('link')).toHaveAttribute('href', /^https:/);

  // La progression mène au dernier acte, qui ouvre trois sorties.
  // Au clavier : les points de progression, fixés à l'écran, mènent à chaque mouvement.
  await page.getByTestId('fem-progress-4').focus();
  await page.keyboard.press('Enter');
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
  await expect(page.getByText('Un avenir qui n’aurait jamais dû lui être retiré.')).toHaveCSS(
    'opacity',
    '1',
  );

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
    await expect(page.getByText('Des absences qui n’auraient jamais dû exister.')).toHaveCSS(
      'opacity',
      '1',
    );
    await expect(page.getByText('Agir l’est aussi.')).toHaveCSS('opacity', '1');
  });
});
