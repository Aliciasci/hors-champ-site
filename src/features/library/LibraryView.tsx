'use client';

import { useMemo } from 'react';

import { ContentCard } from '@/components/content/ContentCard';
import { CultureCard } from '@/components/content/CultureCard';
import { ExperienceBookmarkButton } from '@/components/content/SaveButtons';
import { Bookmark, CircleCheck, CircleDot } from '@/components/icons';
import { ButtonLink } from '@/components/ui/Button';
import { Chip, ChipGroup, Segmented } from '@/components/ui/Chip';
import { Container } from '@/components/ui/Container';
import { EmptyState } from '@/components/ui/EmptyState';
import type { SlimEntity, SlimExperience, SlimYouth } from '@/content/slim';
import { selectLibrarySection, type LibrarySection } from '@/features/bookmarks/librarySelectors';
import { KIND_LABELS, KIND_ORDER } from '@/features/culture/cultureGraph';
import { readOne, useQueryState, type QueryPatch } from '@/lib/useQueryState';
import { useAppStore } from '@/store/useAppStore';
import type { Category, CategoryId, CultureKind } from '@/types';

import styles from './Library.module.css';
import { YouthRow } from './YouthRow';

interface Props {
  entities: SlimEntity[];
  experiences: SlimExperience[];
  categories: Category[];
  youth: SlimYouth[];
}

const SHELVES = ['decouvertes', 'contrechamps'] as const;
type Shelf = (typeof SHELVES)[number];

const SECTIONS: { id: LibrarySection; slug: string; label: string }[] = [
  { id: 'saved', slug: 'favoris', label: 'Favoris' },
  { id: 'in-progress', slug: 'en-cours', label: 'En cours' },
  { id: 'completed', slug: 'termines', label: 'Terminés' },
];
const SECTION_SLUGS = SECTIONS.map((s) => s.slug);

const EMPTY_COPY: Record<
  LibrarySection,
  { title: string; description: string; icon: typeof Bookmark }
> = {
  saved: {
    title: 'Votre bibliothèque attend ses premiers titres',
    description: 'Utilisez le signet d’un contrechamp pour le retrouver ici.',
    icon: Bookmark,
  },
  'in-progress': {
    title: 'Aucun contrechamp en cours',
    description:
      'Quand vous quittez un contrechamp en route, il vous attend ici, à l’étape où vous l’avez laissé.',
    icon: CircleDot,
  },
  completed: {
    title: 'Rien de terminé pour le moment',
    description: 'Les contrechamps terminés restent consultables ici, avec leur analyse.',
    icon: CircleCheck,
  },
};

/** Avec l'URL (onglet, liste, filtres). */
export function LibraryView(props: Props) {
  const { params, set } = useQueryState();
  return <LibraryContent {...props} params={params} set={set} />;
}

/** Rendu pré-calculé, avant lecture de l'URL. */
export function LibraryFallback(props: Props) {
  return <LibraryContent {...props} params={null} set={() => undefined} />;
}

function LibraryContent({
  entities,
  experiences,
  categories,
  youth,
  params,
  set,
}: Props & { params: URLSearchParams | null; set: (patch: QueryPatch) => void }) {
  const hydrated = useAppStore((s) => s.hasHydrated);
  const progress = useAppStore((s) => s.progress);
  const bookmarks = useAppStore((s) => s.bookmarks);
  const savedDiscoveries = useAppStore((s) => s.savedDiscoveries);

  const shelf: Shelf = readOne(params?.get('onglet') ?? null, SHELVES, 'decouvertes');
  const sectionSlug = readOne(params?.get('liste') ?? null, SECTION_SLUGS, 'favoris');
  const section = SECTIONS.find((s) => s.slug === sectionSlug)?.id ?? 'saved';
  const kindParam = params?.get('type') ?? null;
  const themeParam = params?.get('theme') ?? null;

  const categoryById = useMemo(() => new Map(categories.map((c) => [c.id, c])), [categories]);

  // Découvertes : fiches culturelles et éléments jeunesse, la plus récente en premier.
  const ordered = useMemo(
    () => [...savedDiscoveries].sort((a, b) => b.savedAt.localeCompare(a.savedAt)),
    [savedDiscoveries],
  );
  const discoveries = useMemo(() => {
    const byId = new Map(entities.map((e) => [e.id, e]));
    return ordered.flatMap((d) => {
      const e = byId.get(d.entityId);
      return e ? [e] : [];
    });
  }, [ordered, entities]);
  const youthSaved = useMemo(() => {
    const byId = new Map(youth.map((y) => [y.id, y]));
    return ordered.flatMap((d) => {
      const y = byId.get(d.entityId);
      return y ? [y] : [];
    });
  }, [ordered, youth]);

  const counts = useMemo(
    () =>
      Object.fromEntries(
        SECTIONS.map((s) => [
          s.id,
          selectLibrarySection(s.id, experiences, bookmarks, progress).length,
        ]),
      ) as Record<LibrarySection, number>,
    [experiences, bookmarks, progress],
  );
  const listed = useMemo(
    () => selectLibrarySection(section, experiences, bookmarks, progress),
    [section, experiences, bookmarks, progress],
  );

  const discoveryCount = discoveries.length + youthSaved.length;

  const shelfSwitch = (
    <div className={styles.shelf}>
      <Segmented<Shelf>
        legend="Rayon de la bibliothèque"
        name="library-shelf"
        value={shelf}
        onChange={(value) =>
          set({
            onglet: value === 'decouvertes' ? null : value,
            type: null,
            theme: null,
            liste: null,
          })
        }
        testIdPrefix="library-shelf"
        options={[
          {
            id: 'decouvertes',
            label: hydrated ? `Découvertes · ${discoveryCount}` : 'Découvertes',
          },
          { id: 'contrechamps', label: 'Contrechamps' },
        ]}
      />
    </div>
  );

  let body;
  if (!hydrated) {
    // Les données sont dans le navigateur : place réservée jusqu'à leur lecture.
    body = <div className={styles.placeholder} aria-busy="true" />;
  } else if (shelf === 'decouvertes') {
    const kinds = KIND_ORDER.filter((k) => discoveries.some((e) => e.kind === k));
    const activeKind: CultureKind | null =
      kindParam && (kinds as string[]).includes(kindParam) ? (kindParam as CultureKind) : null;
    const shown = activeKind ? discoveries.filter((e) => e.kind === activeKind) : discoveries;
    body =
      discoveryCount === 0 ? (
        <EmptyState
          testId="library-empty-discoveries"
          icon={Bookmark}
          title="Votre bibliothèque culturelle est vide"
          description="Enregistrez une fiche — une artiste, une œuvre, un événement — pour la retrouver ici et construire votre propre collection."
          actions={<ButtonLink href="/">Explorer la culture</ButtonLink>}
        />
      ) : (
        <>
          {kinds.length > 1 ? (
            <ChipGroup legend="Type de fiche">
              <Chip
                type="radio"
                name="library-kind"
                value="all"
                checked={activeKind === null}
                onChange={() => set({ type: null })}
              >
                Tout
              </Chip>
              {kinds.map((k) => (
                <Chip
                  key={k}
                  type="radio"
                  name="library-kind"
                  value={k}
                  checked={activeKind === k}
                  onChange={() => set({ type: k })}
                  count={discoveries.filter((e) => e.kind === k).length}
                >
                  {KIND_LABELS[k].plural}
                </Chip>
              ))}
            </ChipGroup>
          ) : null}
          {shown.length > 0 ? (
            <ul className={styles.grid} data-testid="library-discoveries">
              {shown.map((entity) => (
                <li key={entity.id}>
                  <CultureCard entity={entity} testId={`library-discovery-${entity.id}`} />
                </li>
              ))}
            </ul>
          ) : null}
          {youthSaved.length > 0 && activeKind === null ? (
            <section
              className={styles.youth}
              aria-labelledby="library-youth-title"
              data-testid="library-youth"
            >
              <h2 id="library-youth-title" className="t-overline c-2">
                Tout est possible
              </h2>
              <ul className={styles.grid}>
                {youthSaved.map((item) => (
                  <li key={item.id}>
                    <YouthRow item={item} />
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </>
      );
  } else {
    const themesInSection = [...new Set(listed.map((e) => e.categoryId))];
    const activeTheme: CategoryId | null =
      themeParam && (themesInSection as string[]).includes(themeParam)
        ? (themeParam as CategoryId)
        : null;
    const visible = activeTheme ? listed.filter((e) => e.categoryId === activeTheme) : listed;
    const empty = EMPTY_COPY[section];
    const target = (id: string) =>
      section === 'in-progress'
        ? `/contrechamps/${id}/jouer`
        : section === 'completed'
          ? `/contrechamps/${id}/analyse`
          : undefined;
    body = (
      <>
        <ChipGroup legend="Liste" hideLegend>
          {SECTIONS.map((item) => (
            <Chip
              key={item.id}
              type="radio"
              name="library-section"
              value={item.slug}
              checked={item.id === section}
              onChange={() =>
                set({ liste: item.slug === 'favoris' ? null : item.slug, theme: null })
              }
              count={counts[item.id]}
              testId={`library-tab-${item.id}`}
            >
              {item.label}
            </Chip>
          ))}
        </ChipGroup>
        {themesInSection.length > 1 ? (
          <ChipGroup legend="Thème">
            <Chip
              type="radio"
              name="library-theme"
              value="all"
              checked={activeTheme === null}
              onChange={() => set({ theme: null })}
            >
              Tous les thèmes
            </Chip>
            {themesInSection.map((id) => (
              <Chip
                key={id}
                type="radio"
                name="library-theme"
                value={id}
                checked={activeTheme === id}
                onChange={() => set({ theme: id })}
              >
                {categoryById.get(id)?.shortTitle ?? id}
              </Chip>
            ))}
          </ChipGroup>
        ) : null}
        <p className="sr-only" aria-live="polite">
          {visible.length} contrechamp{visible.length > 1 ? 's' : ''}
        </p>
        {visible.length === 0 ? (
          <EmptyState
            testId={`library-empty-${section}`}
            icon={empty.icon}
            title={empty.title}
            description={empty.description}
            actions={
              experiences.length > 0 ? (
                <ButtonLink href="/contrechamps/catalogue">Explorer les contrechamps</ButtonLink>
              ) : undefined
            }
          />
        ) : (
          <ul className={styles.list}>
            {visible.map((experience, index) => (
              <li key={experience.id} className={styles.experienceRow}>
                <ContentCard
                  variant="compact"
                  index={index}
                  experience={experience}
                  category={categoryById.get(experience.categoryId)}
                  href={target(experience.id)}
                  testId={`library-card-${experience.id}`}
                />
                <ExperienceBookmarkButton experienceId={experience.id} />
              </li>
            ))}
          </ul>
        )}
      </>
    );
  }

  return (
    <Container width="wide">
      <div className={styles.header}>
        <p className="t-overline c-accent">Bibliothèque</p>
        <h1 className="t-title1">
          {shelf === 'decouvertes' ? 'Vos découvertes' : 'Vos contrechamps'}
        </h1>
      </div>
      {shelfSwitch}
      <div className={styles.body}>{body}</div>
    </Container>
  );
}
