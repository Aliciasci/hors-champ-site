import { DiscoveryButton } from './SaveButtons';
import { ShareActions } from './ShareActions';
import styles from './ArticleActions.module.css';

/**
 * Barre d'actions d'un article, entre deux filets : enregistrer, partager, imprimer.
 * En tête d'article, le signet est libellé ; en fin d'article, il se réduit à une icône.
 */
export function ArticleActions({
  entityId,
  title,
  position = 'top',
}: {
  entityId: string;
  title: string;
  position?: 'top' | 'end';
}) {
  return (
    <div className={`${styles.bar} no-print`} data-testid={`article-actions-${position}`}>
      {position === 'top' ? (
        <DiscoveryButton entityId={entityId} bar />
      ) : (
        <DiscoveryButton entityId={entityId} />
      )}
      <ShareActions title={title} printOnMobile={false} />
    </div>
  );
}
