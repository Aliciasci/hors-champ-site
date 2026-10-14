import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import jsxA11y from 'eslint-plugin-jsx-a11y';

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  // Le plugin jsx-a11y est déjà déclaré par eslint-config-next : on active ses règles recommandées.
  { files: ['**/*.{ts,tsx}'], rules: { ...jsxA11y.flatConfigs.recommended.rules } },
  globalIgnores([
    '.next/**',
    'out/**',
    'next-env.d.ts',
    'src/generated/**',
    'playwright-report/**',
    'test-results/**',
  ]),
]);
