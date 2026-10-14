import { defineConfig, devices } from '@playwright/test';

/**
 * Parcours de bout en bout sur l'export statique (dossier `out/`, construit avec les exemples
 * de développement pour disposer des six contrechamps). Trois moteurs, trois largeurs.
 */
const PORT = 4321;

const widths = [
  { name: '320', viewport: { width: 320, height: 720 } },
  { name: '390', viewport: { width: 390, height: 844 } },
  { name: '1280', viewport: { width: 1280, height: 900 } },
];
const engines = [
  { name: 'chromium', use: devices['Desktop Chrome'] },
  { name: 'webkit', use: devices['Desktop Safari'] },
  { name: 'firefox', use: devices['Desktop Firefox'] },
];

export default defineConfig({
  testDir: './e2e',
  timeout: 30_000,
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  reporter: [['list']],
  use: { baseURL: `http://localhost:${PORT}`, locale: 'fr-FR', trace: 'retain-on-failure' },
  projects: engines.flatMap((engine) =>
    widths.map((w) => ({
      name: `${engine.name}-${w.name}`,
      use: { ...engine.use, viewport: w.viewport },
    })),
  ),
  webServer: {
    command: `NEXT_PUBLIC_INCLUDE_DEV_EXAMPLES=true npm run build && python3 -m http.server ${PORT} -d out`,
    url: `http://localhost:${PORT}/`,
    reuseExistingServer: !process.env.CI,
    timeout: 300_000,
  },
});
