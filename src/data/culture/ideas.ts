import type { CultureEntity } from '@/types';

import { categoryArtworks } from '../artworks';
import { categories } from '../categories';

/**
 * Idées : les grands thèmes de l'application. Leur texte est éditorial (définition du thème),
 * sans affirmation factuelle à sourcer ; elles relient les fiches culturelles aux expériences.
 */
export const ideas: CultureEntity[] = categories.map((category) => ({
  id: `idea-${category.id}`,
  kind: 'idea',
  title: category.title,
  subtitle: 'Thème de Hors-Champ',
  summary: category.description,
  // L'œuvre choisie pour illustrer ce thème (voir works.ts, relation `illustrates`).
  image: categoryArtworks[category.id],
  categoryId: category.id,
  links: [],
  sources: [],
  editorialStatus: 'draft',
  reviewedAt: null,
}));
