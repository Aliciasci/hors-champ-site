import { sortedVoteGaps } from '@/content/world/vote-gap';

import styles from './VoteGap.module.css';

/** Nombre de pays affichés en grand ; les autres sont dans la liste dépliable. */
const SHOWN = 10;

/**
 * Le compteur : combien d'années les femmes ont attendu, après les hommes, pour voter.
 * Un bloc sombre, des nombres en très grand, comme une une de magazine.
 */
export function VoteGap() {
  const gaps = sortedVoteGaps();
  const row = (g: (typeof gaps)[number]) => (
    <li key={g.name} className={styles.row}>
      <span className={`${styles.number} ${g.name === 'France' ? styles.france : ''}`}>
        {g.women - g.men}
      </span>
      <span className={styles.text}>
        <span className={styles.name}>{g.name}</span>
        <span className={styles.years}>
          ans · hommes {g.men}, femmes {g.women}
        </span>
      </span>
    </li>
  );
  return (
    <section className={styles.block} aria-labelledby="attente-title" data-testid="vote-gap">
      <p className={styles.kicker}>Le droit de vote · l’attente des femmes</p>
      <h2 id="attente-title" className={styles.title}>
        Combien d’années les femmes ont-elles attendu, après les hommes, pour voter ?
      </h2>
      <ol className={styles.list}>{gaps.slice(0, SHOWN).map(row)}</ol>
      <details className={styles.more}>
        <summary>Les {gaps.length - SHOWN} autres pays</summary>
        <ol className={styles.list}>{gaps.slice(SHOWN).map(row)}</ol>
      </details>
    </section>
  );
}
