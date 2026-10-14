import { Eye, Quote } from '@/components/icons';
import { CoverArt } from '@/components/content/CoverArt';
import type { ScenarioBlock as Block } from '@/types';

import styles from './ScenarioBlock.module.css';

/** Un bloc de la mise en situation. Les répliques sont celles de personnages fictifs. */
export function ScenarioBlock({ block }: { block: Block }) {
  switch (block.kind) {
    case 'paragraph':
      return <p className="t-body-lg measure">{block.text}</p>;

    case 'dialogue':
      return (
        <figure className={styles.dialogue}>
          <Quote size={20} strokeWidth={2.5} aria-hidden="true" className={styles.quoteIcon} />
          <div className={styles.dialogueText}>
            <blockquote className="t-quote">{block.text}</blockquote>
            <figcaption className="t-caption c-2">
              — {block.speaker} <span className="sr-only">(personnage fictif)</span>
            </figcaption>
          </div>
        </figure>
      );

    case 'comparison':
      return (
        <div className={styles.comparison}>
          {[block.left, block.right].map((side, index) => (
            <section
              key={side.label}
              className={`${styles.side} ${index === 0 ? styles.sideA : styles.sideB}`}
              aria-label={`${index === 0 ? 'A' : 'B'} · ${side.label}`}
            >
              <p
                className={`t-overline ${index === 0 ? 'c-primary' : 'c-accent'}`}
                aria-hidden="true"
              >
                {index === 0 ? 'A' : 'B'} · {side.label}
              </p>
              <p className="t-body">{side.text}</p>
            </section>
          ))}
        </div>
      );

    case 'visual':
      return (
        <div className={styles.visual}>
          {block.image ? (
            <CoverArt
              image={block.image}
              decorative={false}
              sizes="(min-width: 900px) 680px, 100vw"
              className={styles.visualImage}
            />
          ) : null}
          <p className={`${styles.visualHeader} t-label c-primary`}>
            <Eye size={18} strokeWidth={2.25} aria-hidden="true" />
            <span>
              <span className="sr-only">Description d’un visuel : </span>
              {block.title}
            </span>
          </p>
          <p className="t-body">{block.description}</p>
        </div>
      );

    case 'argument':
      return (
        <dl className={styles.argument}>
          {block.premises.map((premise, index) => (
            <div key={premise} className={styles.argumentRow}>
              <dt className="t-overline c-muted">
                {block.premises.length > 1 ? `Prémisse ${index + 1}` : 'Prémisse'}
              </dt>
              <dd className="t-body">{premise}</dd>
            </div>
          ))}
          <div className={`${styles.argumentRow} ${styles.conclusion}`}>
            <dt className="t-overline c-accent">Conclusion</dt>
            <dd className="t-title3">{block.conclusion}</dd>
          </div>
        </dl>
      );

    case 'context':
      return (
        <aside className={styles.context} aria-label={block.title}>
          <p className="t-overline c-primary">{block.title}</p>
          <p className="t-body">{block.text}</p>
        </aside>
      );
  }
}
