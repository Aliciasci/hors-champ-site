import { CountUp } from '@/components/ui/CountUp';
import type { GapPosterCopy, GapRow } from '@/content/world';

import styles from './GapPoster.module.css';

/** Nombre de pays affichés en grand ; les autres sont dans la liste dépliable. */
const SHOWN = 10;

/**
 * L'affiche sombre d'un droit : combien d'années entre le premier pas et le droit plein, pays par
 * pays, en très grand. La France est en clair, comme repère.
 */
export function GapPoster({ copy, rows }: { copy: GapPosterCopy; rows: GapRow[] }) {
  if (rows.length === 0) return null;
  const row = (g: GapRow) => (
    <li key={g.name} className={styles.row}>
      <CountUp
        value={g.to - g.from}
        className={`${styles.number} ${g.name === 'France' ? styles.france : ''}`}
      />
      <span className={styles.text}>
        <span className={styles.name}>{g.name}</span>
        <span className={styles.years}>
          {g.to - g.from > 1 ? 'ans' : 'an'} · {copy.fromLabel} {g.from}, {copy.toLabel} {g.to}
        </span>
      </span>
    </li>
  );
  return (
    <section className={styles.block} aria-label={copy.title} data-testid="gap-poster">
      <p className={styles.kicker}>{copy.kicker}</p>
      <h3 className={styles.title}>{copy.title}</h3>
      <ol className={styles.list}>{rows.slice(0, SHOWN).map(row)}</ol>
      {rows.length > SHOWN ? (
        <details className={styles.more}>
          <summary>
            {rows.length - SHOWN > 1 ? `Les ${rows.length - SHOWN} autres pays` : 'Un autre pays'}
          </summary>
          <ol className={styles.list}>{rows.slice(SHOWN).map(row)}</ol>
        </details>
      ) : null}
    </section>
  );
}
