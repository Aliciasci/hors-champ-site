'use client';

import { Check } from '@/components/icons';
import { useAppStore } from '@/store/useAppStore';
import { THEME_IDS, themes } from '@/theme';

import styles from './Profile.module.css';

/** Choix de la direction artistique. Chaque option s'affiche dans son propre thème. */
export function ThemePicker() {
  const themeId = useAppStore((s) => s.preferences.themeId);
  const setTheme = useAppStore((s) => s.setTheme);
  return (
    <fieldset className={styles.fieldset}>
      <legend className="sr-only">Apparence</legend>
      <div className={styles.themeList}>
        {THEME_IDS.map((id) => {
          const option = themes[id];
          const selected = themeId === id;
          return (
            <label
              key={id}
              data-theme={id}
              className={`${styles.themeOption} ${selected ? styles.themeOn : ''}`}
            >
              <input
                type="radio"
                name="theme"
                value={id}
                checked={selected}
                onChange={() => setTheme(id)}
                className={styles.hiddenInput}
                data-testid={`theme-${id}`}
              />
              <span className={styles.preview} aria-hidden="true">
                <span className={styles.sample}>Aa</span>
                <span className={styles.swatches}>
                  <span style={{ background: 'var(--primary)' }} />
                  <span style={{ background: 'var(--accent)' }} />
                  <span style={{ background: 'var(--text)' }} />
                </span>
              </span>
              <span className={styles.themeText}>
                <span className={styles.themeName}>{option.name}</span>
                <span className={styles.themeDescription}>{option.description}</span>
              </span>
              <span className={styles.check} aria-hidden="true">
                {selected ? <Check size={16} strokeWidth={3} /> : null}
              </span>
            </label>
          );
        })}
      </div>
      <p className="t-caption c-muted">
        Le choix s’applique immédiatement et reste enregistré dans ce navigateur.
      </p>
    </fieldset>
  );
}
