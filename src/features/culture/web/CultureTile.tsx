import Link from 'next/link';

import { cultureHref } from '@/components/content/CultureCard';
import { CultureThumb } from '@/components/content/CultureThumb';
import { KIND_LABELS } from '@/features/culture/cultureGraph';
import type { CultureEntity } from '@/types';

/** Petite tuile (vignette + titre), pour les rangées défilantes. */
export function CultureTile({ entity, size = 104 }: { entity: CultureEntity; size?: number }) {
  return (
    <Link
      href={cultureHref(entity.id)}
      style={{ display: 'grid', gap: 'var(--space-xs)' }}
      aria-label={`${KIND_LABELS[entity.kind].singular} : ${entity.title}`}
    >
      <CultureThumb entity={entity} size={size} />
      <span
        className="t-caption"
        style={{
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}
      >
        {entity.title}
      </span>
    </Link>
  );
}
