'use client';

import { Suspense, useEffect, useMemo, useRef, useState } from 'react';

import { ContentCard } from '@/components/content/ContentCard';
import { Search, SearchX, SlidersHorizontal, X } from '@/components/icons';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { CATEGORY_IDS, CONTENT_TYPES } from '@/constants/enums';
import {
  countActiveFilters,
  EMPTY_FILTERS,
  filterExperiences,
  hasActiveFilters,
  type DurationFilter,
  type ExperienceFilters,
} from '@/features/experiences/filterExperiences';
import { readList, useQueryState } from '@/lib/useQueryState';
import type { Category, CategoryId, Experience } from '@/types';
import { pluralize } from '@/utils/text';

import styles from './Catalogue.module.css';
import { CatalogueFilters } from './CatalogueFilters';

const DURATIONS: readonly DurationFilter[] = ['short', 'medium', 'long'];

interface CatalogueProps {
  experiences: Experience[];
  categories: Category[];
}

export function filtersFromParams(params: URLSearchParams | null): ExperienceFilters {
  if (!params) return EMPTY_FILTERS;
  return {
    query: params.get('q') ?? '',
    categoryIds: readList(params.get('themes'), CATEGORY_IDS),
    contentTypes: readList(params.get('formats'), CONTENT_TYPES),
    durations: readList(params.get('durees'), DURATIONS),
  };
}

/** Catalogue des contrechamps : recherche et filtres reflétés dans l'URL. */
export function CatalogueIsland(props: CatalogueProps) {
  return (
    <Suspense
      fallback={<CatalogueView {...props} filters={EMPTY_FILTERS} onChange={() => undefined} />}
    >
      <CatalogueWithUrl {...props} />
    </Suspense>
  );
}

function CatalogueWithUrl(props: CatalogueProps) {
  const { params, set } = useQueryState();
  const filters = useMemo(() => filtersFromParams(params), [params]);
  const onChange = (next: ExperienceFilters) =>
    set({
      q: next.query.trim() ? next.query : null,
      themes: next.categoryIds,
      formats: next.contentTypes,
      durees: next.durations,
    });
  return <CatalogueView {...props} filters={filters} onChange={onChange} />;
}

export function CatalogueView({
  experiences,
  categories,
  filters,
  onChange,
}: CatalogueProps & {
  filters: ExperienceFilters;
  onChange: (filters: ExperienceFilters) => void;
}) {
  // Le champ garde sa propre valeur pendant la frappe ; l'URL suit (sans revenir écraser le champ :
  // seules nos propres mises à jour modifient `q`, et l'URL est relue au montage).
  const [query, setQuery] = useState(filters.query);
  const current = { ...filters, query };

  const searchRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const [panelOpen, setPanelOpen] = useState(false);

  const categoryTitles = useMemo(
    () =>
      Object.fromEntries(categories.map((c) => [c.id, c.title])) as Partial<
        Record<CategoryId, string>
      >,
    [categories],
  );
  const categoryById = useMemo(() => new Map(categories.map((c) => [c.id, c])), [categories]);
  const results = filterExperiences(experiences, current, categoryTitles);
  const contentTypes = useMemo(
    () => CONTENT_TYPES.filter((type) => experiences.some((e) => e.contentType === type)),
    [experiences],
  );
  const activeCount = countActiveFilters(filters);
  const active = hasActiveFilters(current);

  // Raccourci « / » : place le focus dans la recherche.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== '/' || event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target as HTMLElement | null;
      if (target?.closest('input, textarea, select, [contenteditable="true"]')) return;
      event.preventDefault();
      searchRef.current?.focus();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  const openPanel = () => {
    setPanelOpen(true);
    dialogRef.current?.showModal();
  };
  const closePanel = () => {
    dialogRef.current?.close();
  };

  const reset = () => {
    setQuery('');
    onChange(EMPTY_FILTERS);
  };

  const update = (next: ExperienceFilters) => onChange({ ...next, query });

  return (
    <div className={styles.layout}>
      <div className={styles.searchRow}>
        <label className={styles.search}>
          <Search size={18} strokeWidth={2.25} aria-hidden="true" />
          <span className="sr-only">Rechercher un contrechamp</span>
          <input
            ref={searchRef}
            type="search"
            value={query}
            placeholder="Rechercher un sujet, un mot…"
            onChange={(event) => {
              setQuery(event.target.value);
              onChange({ ...filters, query: event.target.value });
            }}
            aria-keyshortcuts="/"
            data-testid="catalogue-search"
            enterKeyHint="search"
          />
          <kbd className={styles.kbd} aria-hidden="true">
            /
          </kbd>
        </label>
        <button
          ref={toggleRef}
          type="button"
          className={styles.filtersButton}
          onClick={openPanel}
          aria-haspopup="dialog"
          data-testid="catalogue-filters-toggle"
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

      <aside className={styles.sidebar} aria-label="Filtres">
        <div className={styles.sidebarHead}>
          <h2 className="t-title3">
            Filtres
            {activeCount > 0 ? (
              <span className={styles.badge}>
                {activeCount}
                <span className="sr-only"> actif{activeCount > 1 ? 's' : ''}</span>
              </span>
            ) : null}
          </h2>
        </div>
        <CatalogueFilters
          filters={filters}
          categories={categories}
          contentTypes={contentTypes}
          onChange={update}
          idPrefix="filtre"
        />
      </aside>

      <dialog
        ref={dialogRef}
        className={styles.dialog}
        aria-labelledby="catalogue-filters-title"
        onClose={() => {
          setPanelOpen(false);
          toggleRef.current?.focus();
        }}
      >
        {panelOpen ? (
          <div className={styles.dialogInner}>
            <div className={styles.dialogHead}>
              <h2 id="catalogue-filters-title" className="t-title2">
                Filtres
              </h2>
              <button
                type="button"
                className={styles.close}
                onClick={closePanel}
                aria-label="Fermer les filtres"
              >
                <X size={20} strokeWidth={2.25} aria-hidden="true" />
              </button>
            </div>
            <CatalogueFilters
              filters={filters}
              categories={categories}
              contentTypes={contentTypes}
              onChange={update}
              idPrefix="panneau"
            />
            <div className={styles.dialogActions}>
              {activeCount > 0 ? (
                <Button variant="ghost" onClick={() => onChange({ ...EMPTY_FILTERS, query })}>
                  Réinitialiser
                </Button>
              ) : null}
              <Button onClick={closePanel} data-testid="catalogue-filters-apply">
                Voir {pluralize(results.length, 'contrechamp', 'contrechamps')}
              </Button>
            </div>
          </div>
        ) : null}
      </dialog>

      <section className={styles.results} aria-labelledby="catalogue-results-title">
        <h2 id="catalogue-results-title" className="sr-only">
          Résultats
        </h2>
        <div className={styles.resultsBar}>
          <p className="t-label" role="status" aria-live="polite" data-testid="catalogue-count">
            {pluralize(results.length, 'contrechamp', 'contrechamps')}
          </p>
          {active ? (
            <Button variant="ghost" onClick={reset} data-testid="catalogue-reset">
              Réinitialiser
            </Button>
          ) : null}
        </div>

        {results.length > 0 ? (
          <ul className={styles.grid}>
            {results.map((experience, index) => (
              <li key={experience.id}>
                <ContentCard
                  experience={experience}
                  category={categoryById.get(experience.categoryId)}
                  index={index}
                  eager={index < 2}
                  testId={`catalogue-card-${experience.id}`}
                />
              </li>
            ))}
          </ul>
        ) : experiences.length === 0 ? (
          <EmptyState
            kicker="En préparation"
            title="Pas encore de contrechamp publié"
            description="Les premiers sont en cours d’écriture et de vérification. Revenez bientôt."
            testId="catalogue-empty"
          />
        ) : (
          <EmptyState
            icon={SearchX}
            kicker="Recherche"
            title="Aucun résultat"
            description={
              query.trim()
                ? `Rien sur « ${query.trim()} » avec ces filtres. Essayez un autre mot, ou retirez un filtre.`
                : 'Aucun contrechamp ne correspond à tous ces filtres. Retirez-en un.'
            }
            actions={<Button onClick={reset}>Tout réinitialiser</Button>}
            testId="catalogue-no-results"
          />
        )}
      </section>
    </div>
  );
}
