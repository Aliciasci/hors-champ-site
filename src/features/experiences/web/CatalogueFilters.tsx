'use client';

import { Chip, ChipGroup } from '@/components/ui/Chip';
import { CONTENT_TYPE_LABELS } from '@/constants/labels';
import {
  DURATION_FILTERS,
  toggleInList,
  type ExperienceFilters,
} from '@/features/experiences/filterExperiences';
import type { Category, ExperienceContentType } from '@/types';

import styles from './Catalogue.module.css';

/**
 * Filtres du catalogue : un `<fieldset>` par groupe. « Ou » à l'intérieur d'un groupe,
 * « et » entre les groupes (voir filterExperiences).
 */
export function CatalogueFilters({
  filters,
  categories,
  contentTypes,
  onChange,
  idPrefix,
}: {
  filters: ExperienceFilters;
  categories: Pick<Category, 'id' | 'title' | 'shortTitle'>[];
  /** Formats présents dans le catalogue. */
  contentTypes: ExperienceContentType[];
  onChange: (filters: ExperienceFilters) => void;
  /** Préfixe des noms de champs, pour distinguer colonne et panneau. */
  idPrefix: string;
}) {
  return (
    <div className={styles.filterGroups}>
      <ChipGroup legend="Thèmes">
        {categories.map((category) => (
          <Chip
            key={category.id}
            name={`${idPrefix}-themes`}
            value={category.id}
            checked={filters.categoryIds.includes(category.id)}
            onChange={() =>
              onChange({ ...filters, categoryIds: toggleInList(filters.categoryIds, category.id) })
            }
            ariaLabel={`Thème ${category.title}`}
            testId={`${idPrefix}-theme-${category.id}`}
          >
            {category.shortTitle}
          </Chip>
        ))}
      </ChipGroup>

      {contentTypes.length > 1 ? (
        <ChipGroup legend="Formats">
          {contentTypes.map((type) => (
            <Chip
              key={type}
              name={`${idPrefix}-formats`}
              value={type}
              checked={filters.contentTypes.includes(type)}
              onChange={() =>
                onChange({ ...filters, contentTypes: toggleInList(filters.contentTypes, type) })
              }
              testId={`${idPrefix}-format-${type}`}
            >
              {CONTENT_TYPE_LABELS[type]}
            </Chip>
          ))}
        </ChipGroup>
      ) : null}

      <ChipGroup legend="Durée">
        {DURATION_FILTERS.map((duration) => (
          <Chip
            key={duration.id}
            name={`${idPrefix}-durees`}
            value={duration.id}
            checked={filters.durations.includes(duration.id)}
            onChange={() =>
              onChange({ ...filters, durations: toggleInList(filters.durations, duration.id) })
            }
            ariaLabel={`Durée : ${duration.accessibilityLabel}`}
            testId={`${idPrefix}-duree-${duration.id}`}
          >
            {duration.label}
          </Chip>
        ))}
      </ChipGroup>
    </div>
  );
}
