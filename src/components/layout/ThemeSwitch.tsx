'use client';

import { useId } from 'react';

import { useAppStore } from '@/store/useAppStore';
import type { ThemeId } from '@/theme/types';

import styles from './ThemeSwitch.module.css';

const OPTIONS: { id: ThemeId; label: string }[] = [
  { id: 'cartel', label: 'Cartel' },
  { id: 'revue', label: 'Revue' },
  { id: 'atlas', label: 'Atlas' },
];

/** Choix compact du thème visuel (pied de page). Le Profil propose la version avec aperçus. */
export function ThemeSwitch() {
  const name = useId();
  const themeId = useAppStore((s) => s.preferences.themeId);
  const setTheme = useAppStore((s) => s.setTheme);
  return (
    <fieldset className={styles.group}>
      <legend className="t-overline">Thème visuel</legend>
      <div className={styles.options}>
        {OPTIONS.map((option) => (
          <label key={option.id} className={styles.option}>
            <input
              type="radio"
              name={name}
              value={option.id}
              checked={themeId === option.id}
              onChange={() => setTheme(option.id)}
              data-testid={`footer-theme-${option.id}`}
            />
            <span>{option.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
