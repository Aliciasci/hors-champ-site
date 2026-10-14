import { CultureCard } from '@/components/content/CultureCard';
import type { CultureEntity } from '@/types';

/** Élément de frise : l'année en grand, puis la fiche. */
export function TimelineEntry({ entity }: { entity: CultureEntity }) {
  return (
    <div style={{ display: 'grid', gap: 'var(--space-xxs)' }}>
      <p className="t-title2 c-primary">{entity.period?.label}</p>
      <CultureCard entity={entity} hidePeriod testId={`culture-${entity.id}`} />
    </div>
  );
}
