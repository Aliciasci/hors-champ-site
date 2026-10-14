import type { CultureEntity } from '@/types';
import { formatDate } from '@/utils/text';

import styles from './ArticleBody.module.css';

/**
 * Article long d'une fiche : intertitres, paragraphes, et après chaque paragraphe des appels
 * numérotés vers les sources dont il tire ses faits (mêmes numéros que les cartes « Sources »).
 */
export function ArticleBody({ entity }: { entity: CultureEntity }) {
  const article = entity.article;
  if (!article) return null;
  const number = new Map(entity.sources.map((source, index) => [source.id, index + 1]));
  return (
    <div className={styles.article} data-testid="culture-article">
      {article.paragraphs.map((paragraph, index) => (
        <div key={index} className={styles.block}>
          {paragraph.heading ? <h2 className={styles.heading}>{paragraph.heading}</h2> : null}
          <p className="t-reading">
            {paragraph.text}
            {paragraph.sourceIds.map((id) => (
              <sup key={id} className={styles.ref}>
                <a href={`#source-${id}`} aria-label={`Source ${number.get(id)}`}>
                  {number.get(id)}
                </a>
              </sup>
            ))}
          </p>
        </div>
      ))}
      <p className={`t-caption c-muted ${styles.note}`}>
        Texte préparé avec l’aide d’une IA ({article.preparedWith}) à partir des sources citées,
        puis relu et validé par la rédaction le {formatDate(article.acceptedAt)}.
      </p>
    </div>
  );
}
