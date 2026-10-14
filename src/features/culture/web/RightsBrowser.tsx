'use client';

import { useState, type ReactNode } from 'react';

import { SearchX, SlidersHorizontal } from '@/components/icons';
import { Button } from '@/components/ui/Button';
import { Chip, ChipGroup } from '@/components/ui/Chip';
import { EmptyState } from '@/components/ui/EmptyState';
import { SearchField } from '@/components/ui/SearchField';
import { toggleInList } from '@/features/experiences/filterExperiences';
import { readList, useQueryState } from '@/lib/useQueryState';
import type { CultureEntity, RightCategory } from '@/types';
import { pluralize } from '@/utils/text';

import {
  EMPTY_RIGHT_FILTERS,
  filterRights,
  PERIOD_FILTERS,
  RIGHT_CATEGORY_LABELS,
  RIGHT_CATEGORY_ORDER,
  type PeriodFilter,
  type RightFilters,
} from '../cultureGraph';
import styles from './RightsBrowser.module.css';

interface Props {
  /** Conquêtes et contributrices, allégées (recherche et filtres). */
  entities: CultureEntity[];
  people: { id: string; title: string }[];
  /** Cartes pré-rendues côté serveur, par identifiant de conquête. */
  cards: Record<string, ReactNode>;
  /** Lire et écrire les filtres dans l'URL (sinon : valeurs par défaut, rendu de repli). */
  withUrl?: boolean;
}

const PERIOD_IDS = PERIOD_FILTERS.map((p) => p.id);

/** Recherche et filtres de « Derrière chaque droit », reflétés dans l'URL. */
export function RightsBrowser(props: Props) {
  return props.withUrl ? (
    <WithUrl {...props} />
  ) : (
    <RightsView {...props} filters={EMPTY_RIGHT_FILTERS} />
  );
}

function WithUrl(props: Props) {
  const { params, set } = useQueryState();
  const personIds = props.people.map((p) => p.id);
  const filters: RightFilters = {
    query: params.get('q') ?? '',
    categories: readList<RightCategory>(params.get('categorie'), RIGHT_CATEGORY_ORDER),
    periods: readList<PeriodFilter>(params.get('periode'), PERIOD_IDS),
    people: readList(params.get('personne'), personIds),
  };
  const onChange = (next: RightFilters) =>
    set({
      q: next.query,
      categorie: next.categories,
      periode: next.periods,
      personne: next.people,
    });
  return <RightsView {...props} filters={filters} onChange={onChange} />;
}

function RightsView({
  entities,
  people,
  cards,
  filters,
  onChange,
}: Props & { filters: RightFilters; onChange?: (filters: RightFilters) => void }) {
  // La saisie reste locale pour ne pas perdre de caractère pendant la mise à jour de l'URL.
  const [query, setQuery] = useState(filters.query);
  const current = { ...filters, query };
  const update = (next: RightFilters) => {
    setQuery(next.query);
    onChange?.(next);
  };

  const results = filterRights(entities, current);
  const activeCount = filters.categories.length + filters.periods.length + filters.people.length;
  const active = activeCount > 0 || query.trim().length > 0;
  const [open, setOpen] = useState(activeCount > 0);
  const reset = () => update(EMPTY_RIGHT_FILTERS);

  const byCategory = RIGHT_CATEGORY_ORDER.map((category) => ({
    category,
    items: results.filter((r) => r.right?.category === category),
  }));
  // Sans filtre, les familles encore vides restent visibles et annoncées comme à documenter.
  const shown = active ? byCategory.filter((g) => g.items.length > 0) : byCategory;

  return (
    <div className={styles.root}>
      <div className={styles.tools}>
        <SearchField
          label="Rechercher une conquête de droits"
          placeholder="Un droit, une femme…"
          value={query}
          onChange={(value) => update({ ...current, query: value })}
          testId="rights-search"
        />
        <button
          type="button"
          className={styles.toggle}
          aria-expanded={open}
          aria-controls="rights-filters"
          onClick={() => setOpen((o) => !o)}
          data-testid="rights-filters-toggle"
        >
          <SlidersHorizontal size={18} strokeWidth={2.25} aria-hidden="true" />
          Filtres
          {activeCount > 0 ? (
            <span className={styles.badge}>
              {activeCount}
              <span className="sr-only"> actif{activeCount > 1 ? 's' : ''}</span>
            </span>
          ) : null}
        </button>
      </div>

      <div id="rights-filters" className={styles.filters} hidden={!open}>
        <ChipGroup legend="Catégorie">
          {RIGHT_CATEGORY_ORDER.map((category) => (
            <Chip
              key={category}
              name="categorie"
              value={category}
              checked={filters.categories.includes(category)}
              onChange={() =>
                update({ ...current, categories: toggleInList(filters.categories, category) })
              }
              testId={`rights-category-${category}`}
            >
              {RIGHT_CATEGORY_LABELS[category]}
            </Chip>
          ))}
        </ChipGroup>
        <ChipGroup legend="Période">
          {PERIOD_FILTERS.map((period) => (
            <Chip
              key={period.id}
              name="periode"
              value={period.id}
              checked={filters.periods.includes(period.id)}
              onChange={() =>
                update({ ...current, periods: toggleInList(filters.periods, period.id) })
              }
              testId={`rights-period-${period.id}`}
            >
              {period.label}
            </Chip>
          ))}
        </ChipGroup>
        <ChipGroup legend="Personnalité">
          {people.map((person) => (
            <Chip
              key={person.id}
              name="personne"
              value={person.id}
              checked={filters.people.includes(person.id)}
              onChange={() =>
                update({ ...current, people: toggleInList(filters.people, person.id) })
              }
              testId={`rights-person-${person.id}`}
            >
              {person.title}
            </Chip>
          ))}
        </ChipGroup>
      </div>

      <div className={styles.bar}>
        <p className="t-label" role="status" aria-live="polite" data-testid="rights-count">
          {pluralize(results.length, 'conquête', 'conquêtes')}
        </p>
        {active ? (
          <Button variant="ghost" onClick={reset}>
            Réinitialiser
          </Button>
        ) : null}
      </div>

      {results.length === 0 && active ? (
        <EmptyState
          testId="rights-no-results"
          icon={SearchX}
          kicker="Recherche"
          title="Aucun résultat"
          description="Aucun droit ne correspond à ces critères. Retirez un filtre ou essayez un autre mot."
          actions={<Button onClick={reset}>Tout réinitialiser</Button>}
        />
      ) : (
        <div className={styles.groups}>
          {shown.map(({ category, items }) => (
            <section
              key={category}
              className={styles.group}
              aria-labelledby={`famille-${category}`}
              data-testid={`rights-group-${category}`}
            >
              <h2 id={`famille-${category}`} className="t-title2">
                {RIGHT_CATEGORY_LABELS[category]}
              </h2>
              {items.length > 0 ? (
                <ul>
                  {items.map((item) => (
                    <li key={item.id}>{cards[item.id]}</li>
                  ))}
                </ul>
              ) : (
                <p className="t-body c-muted" data-testid={`rights-empty-${category}`}>
                  Pas encore de fiche dans cette famille. Elle est en cours d’écriture.
                </p>
              )}
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
