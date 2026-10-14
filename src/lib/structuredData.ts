import { relatedEntities } from '@/features/culture/cultureGraph';
import type { CultureEntity } from '@/types';

import { imageUrl } from './seo';
import { absoluteUrl } from './site';

/**
 * Données structurées d'une fiche. Uniquement des faits présents dans les données :
 * titre, résumé, période affichée, illustration, liens déclarés.
 */
export function cultureJsonLd(entity: CultureEntity, all: readonly CultureEntity[]) {
  const url = absoluteUrl(`/culture/${entity.id}`);
  const base = {
    '@context': 'https://schema.org',
    name: entity.title,
    description: entity.hook ?? entity.summary,
    url,
    ...(entity.image ? { image: imageUrl(entity.image) } : {}),
    sameAs: entity.sources.filter((s) => s.sourceType === 'encyclopedia').map((s) => s.url),
  };
  const related = relatedEntities(all, entity.id);
  const year = entity.period ? String(entity.period.sortYear) : undefined;

  switch (entity.kind) {
    case 'person':
      return {
        ...base,
        '@type': 'Person',
        ...(entity.subtitle ? { jobTitle: entity.subtitle } : {}),
      };
    case 'work': {
      const creator = related.find((r) => r.relation === 'created' && r.entity.kind === 'person');
      return {
        ...base,
        '@type': 'VisualArtwork',
        ...(entity.period ? { dateCreated: entity.period.label } : {}),
        ...(creator
          ? {
              creator: {
                '@type': 'Person',
                name: creator.entity.title,
                url: absoluteUrl(`/culture/${creator.entity.id}`),
              },
            }
          : {}),
      };
    }
    case 'event':
      return { ...base, '@type': 'Event', ...(year ? { startDate: year } : {}) };
    case 'law':
      return {
        ...base,
        '@type': 'Legislation',
        ...(year ? { legislationDate: year } : {}),
        ...(entity.law?.institution
          ? { legislationPassedBy: { '@type': 'Organization', name: entity.law.institution } }
          : {}),
        ...(entity.law?.reference ? { legislationIdentifier: entity.law.reference } : {}),
      };
    case 'organization':
      return { ...base, '@type': 'Organization' };
    default:
      return { ...base, '@type': 'Thing' };
  }
}
