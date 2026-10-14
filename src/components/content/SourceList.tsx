import { ExternalLink } from '@/components/icons';
import { SOURCE_TYPE_LABELS } from '@/constants/labels';
import type { Source } from '@/types';
import { formatDate } from '@/utils/text';

import styles from './SourceList.module.css';

/** Sources vérifiables : titre, éditeur, extrait cité mot pour mot, note, date de consultation. */
export function SourceList({
  sources,
  emptyMessage = 'Aucune source n’est encore associée à ce contenu. Il ne doit pas être considéré comme une analyse documentée.',
}: {
  sources: Source[];
  emptyMessage?: string;
}) {
  if (sources.length === 0) {
    return (
      <p className={`${styles.empty} t-body-sm c-2`} data-testid="source-list-empty">
        {emptyMessage}
      </p>
    );
  }
  return (
    <ol className={styles.list}>
      {sources.map((source, index) => (
        <li key={source.id} className={styles.item} id={`source-${source.id}`}>
          <p className={`${styles.header} t-overline c-primary`}>
            {String(index + 1).padStart(2, '0')} · {SOURCE_TYPE_LABELS[source.sourceType]}
          </p>
          <p className="t-title3">
            <a href={source.url} target="_blank" rel="noopener noreferrer" className={styles.title}>
              {source.title}
              <ExternalLink
                size={16}
                strokeWidth={2.25}
                aria-hidden="true"
                className={styles.ext}
              />
              <span className="sr-only"> (nouvel onglet)</span>
            </a>
          </p>
          <p className="t-body-sm c-2">
            {source.publisher}
            {source.publishedAt ? ` · publié le ${formatDate(source.publishedAt)}` : ''}
          </p>
          {source.relevantExcerpt ? (
            <blockquote cite={source.url} className={`${styles.excerpt} t-quote`}>
              « {source.relevantExcerpt} »
            </blockquote>
          ) : null}
          {source.note ? <p className="t-body-sm c-2">{source.note}</p> : null}
          <p className="t-caption c-muted">Consulté le {formatDate(source.accessedAt)}</p>
        </li>
      ))}
    </ol>
  );
}
