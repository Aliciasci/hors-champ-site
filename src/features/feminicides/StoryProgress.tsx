'use client';

import styles from './Feminicides.module.css';

export const ACTS = [
  { id: 'les-lumieres', numeral: 'I', title: 'Les lumières' },
  { id: 'l-ampleur', numeral: 'II', title: 'L’ampleur' },
  { id: 'les-vies', numeral: 'III', title: 'Les vies derrière les chiffres' },
  { id: 'comprendre-les-violences', numeral: 'IV', title: 'Comprendre' },
  { id: 'ce-qui-reste', numeral: 'V', title: 'Ce qui reste' },
] as const;

/**
 * Où l'on en est : un point par mouvement, sur le bord droit. Chaque point mène à son mouvement ; aucun
 * n'est obligatoire, on peut lire dans l'ordre ou sauter.
 */
export function StoryProgress({
  active,
  onJump,
}: {
  active: number;
  onJump: (index: number) => void;
}) {
  return (
    <nav className={styles.progress} aria-label="Les cinq mouvements du récit">
      <ol>
        {ACTS.map((act, index) => (
          <li key={act.id}>
            <a
              href={`#${act.id}`}
              className={`${styles.progressDot} ${index <= active ? styles.progressPast : ''}`}
              aria-current={index === active ? 'step' : undefined}
              onClick={(event) => {
                event.preventDefault();
                onJump(index);
              }}
              data-testid={`fem-progress-${index}`}
            >
              <span className={styles.progressLabel}>
                <span aria-hidden="true">{act.numeral} · </span>
                {act.title}
              </span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
