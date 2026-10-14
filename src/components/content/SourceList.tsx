import { ExternalLink } from '@/components/icons';
import { SOURCE_TYPE_LABELS } from '@/constants/labels';
import type { Source } from '@/types';
import { formatDate } from '@/utils/text';

import styles from './SourceList.module.css';

/**
 * Sources vérifiables : titre, éditeur, extrait cité mot pour mot, note, date de consultation.
 * `cards` : une carte par source ; `notes` : notes de fin d'article, compactes et numérotées.
 */
export function SourceList({
  sources,
  emptyMessage = 'Ce contenu n’a pas encore de source. Ne le lisez pas comme une analyse documentée.',
  variant = 'cards',
}: {
  sources: Source[];
  emptyMessage?: string;
  variant?: 'cards' | 'notes';
}) {
  if (sources.length === 0) {
    return (
      <p className={`${styles.empty} t-body-sm c-2`} data-testid="source-list-empty">
        {emptyMessage}
      </p>
    );
  }
  if (variant === 'notes') {
    return (
      <ol className={styles.notes}>
        {sources.map((source, index) => (
          <li key={source.id} className={styles.note} id={`source-${source.id}`}>
            <span className={`t-mono c-muted ${styles.number}`} aria-hidden="true">
              {index + 1}.
            </span>
            <div className={styles.noteText}>
              <p className="t-body-sm">
                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${styles.title} ${styles.noteTitle}`}
                >
                  {source.title}
                  <span className="sr-only"> (nouvel onglet)</span>
                </a>
                <span className="c-2">
                  {' '}
                  · {source.publisher}
                  {source.publishedAt ? `, ${formatDate(source.publishedAt)}` : ''}
                </span>
              </p>
              {source.relevantExcerpt ? (
                <blockquote cite={source.url} className={`t-body-sm c-2 ${styles.noteExcerpt}`}>
                  « {source.relevantExcerpt} »
                </blockquote>
              ) : null}
              {source.note ? <p className="t-caption c-2">{source.note}</p> : null}
              <p className="t-caption c-muted">
                {SOURCE_TYPE_LABELS[source.sourceType]} · consulté le{' '}
                {formatDate(source.accessedAt)}
              </p>
            </div>
          </li>
        ))}
      </ol>
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
