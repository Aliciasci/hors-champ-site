'use client';

import Link from 'next/link';
import { useMemo, useRef, useState, type ChangeEvent } from 'react';

import { ArrowRight, Download, Info, Library, RotateCcw, Trash, Upload } from '@/components/icons';
import { Button, ButtonLink } from '@/components/ui/Button';
import { Chip, ChipGroup, Segmented } from '@/components/ui/Chip';
import { Container } from '@/components/ui/Container';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { DIFFICULTIES } from '@/constants/enums';
import { DIFFICULTY_DESCRIPTIONS, DIFFICULTY_LABELS } from '@/constants/labels';
import type { SlimExperience } from '@/content/slim';
import { toggleInList } from '@/features/experiences/filterExperiences';
import { computeProgressSummary } from '@/features/progress/progressLogic';
import { AGE_BANDS } from '@/features/youth/youthCatalog';
import { pickPersisted, useAppStore } from '@/store/useAppStore';
import type { AgeBand, Category, Difficulty } from '@/types';

import { buildExport, exportFileName, parseImport } from './dataTransfer';
import styles from './Profile.module.css';
import { ThemePicker } from './ThemePicker';

const plural = (n: number, one: string, many: string) => (n > 1 ? many : one);

function Stat({ value, label, tone }: { value: number; label: string; tone: string }) {
  return (
    <div className={`${styles.stat} ${tone}`}>
      <span className="t-title1">{value}</span>
      <span className="t-label">{label}</span>
    </div>
  );
}

export function ProfileView({
  cultureIds,
  youthIds,
  experiences,
  categories,
}: {
  cultureIds: string[];
  youthIds: string[];
  experiences: SlimExperience[];
  categories: Category[];
}) {
  const progress = useAppStore((s) => s.progress);
  const bookmarks = useAppStore((s) => s.bookmarks);
  const exploredEntityIds = useAppStore((s) => s.exploredEntityIds);
  const savedDiscoveries = useAppStore((s) => s.savedDiscoveries);
  const preferences = useAppStore((s) => s.preferences);
  const setFavoriteCategories = useAppStore((s) => s.setFavoriteCategories);
  const setPreferredDifficulty = useAppStore((s) => s.setPreferredDifficulty);
  const setAgeBand = useAppStore((s) => s.setAgeBand);

  const summary = useMemo(
    () => computeProgressSummary(progress, experiences, categories),
    [progress, experiences, categories],
  );
  const known = useMemo(() => new Set([...cultureIds, ...youthIds]), [cultureIds, youthIds]);
  const cultureSet = useMemo(() => new Set(cultureIds), [cultureIds]);
  const exploredCulture = exploredEntityIds.filter((id) => cultureSet.has(id)).length;
  const discoveriesCount = savedDiscoveries.filter((d) => known.has(d.entityId)).length;
  const savedCount = bookmarks.filter((b) =>
    experiences.some((e) => e.id === b.experienceId),
  ).length;
  const cultureTotal = cultureIds.length;

  return (
    <Container width="reading">
      <div className={styles.header}>
        <p className="t-overline c-accent">Profil</p>
        <h1 className="t-title1">Votre exploration</h1>
      </div>

      <Link href="/bibliotheque" className={styles.library} data-testid="profile-library">
        <Library size={28} aria-hidden="true" className="c-primary" />
        <span className={styles.flex}>
          <span className="t-overline c-accent">Bibliothèque</span>
          <span className="t-title3">Ma bibliothèque</span>
          <span className="t-caption c-2">
            {discoveriesCount} {plural(discoveriesCount, 'découverte', 'découvertes')} ·{' '}
            {savedCount} {plural(savedCount, 'contrechamp enregistré', 'contrechamps enregistrés')}
          </span>
        </span>
        <ArrowRight size={20} aria-hidden="true" className="c-primary" />
      </Link>

      <section
        className={styles.section}
        aria-labelledby="profile-culture"
        data-testid="profile-culture"
      >
        <SectionHeader
          id="profile-culture"
          kicker="Culture"
          title={`${exploredCulture} ${plural(exploredCulture, 'fiche explorée', 'fiches explorées')} sur ${cultureTotal}`}
        />
        <progress
          className={styles.progress}
          value={exploredCulture}
          max={Math.max(cultureTotal, 1)}
          aria-label={`${exploredCulture} fiches culturelles explorées sur ${cultureTotal}`}
        />
        <p className="t-body-sm c-2">
          {discoveriesCount}{' '}
          {plural(discoveriesCount, 'découverte enregistrée', 'découvertes enregistrées')} dans
          votre bibliothèque.
        </p>
      </section>

      <section className={styles.section} aria-labelledby="profile-practice">
        <SectionHeader id="profile-practice" kicker="Contrechamps" title="Mise à l’épreuve" />
        <div className={styles.stats} data-testid="profile-stats">
          <Stat value={summary.inProgressCount} label="en cours" tone={styles.toneA!} />
          <Stat
            value={summary.completedCount}
            label={plural(summary.completedCount, 'terminé', 'terminés')}
            tone={styles.toneB!}
          />
          <Stat
            value={savedCount}
            label={plural(savedCount, 'enregistré', 'enregistrés')}
            tone={styles.toneC!}
          />
        </div>
        <p className={styles.note}>
          <Info size={18} aria-hidden="true" />
          <span className="t-body-sm c-2">
            La progression mesure ce que vous avez exploré. Vos réponses ne sont ni notées, ni
            comparées, et restent dans ce navigateur.
          </span>
        </p>
      </section>

      <section className={styles.section} aria-labelledby="profile-coverage">
        <SectionHeader
          id="profile-coverage"
          kicker="Thèmes"
          title={`${summary.exploredCategoryIds.length} sur ${categories.length} explorés`}
        />
        <ul className={styles.coverage}>
          {summary.coverage.map((entry) => (
            <li key={entry.categoryId} className={styles.coverageRow}>
              <span className={styles.coverageHeader}>
                <span className="t-label">{entry.title}</span>
                <span className="t-caption c-2">
                  {entry.total === 0 ? 'à venir' : `${entry.completed} / ${entry.total}`}
                </span>
              </span>
              <progress
                className={styles.progress}
                value={entry.completed}
                max={Math.max(entry.total, 1)}
                aria-label={
                  entry.total === 0
                    ? `${entry.title} : aucun contrechamp publié pour l’instant`
                    : `${entry.title} : ${entry.completed} contrechamps terminés sur ${entry.total}`
                }
              />
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.section} aria-labelledby="profile-theme">
        <SectionHeader id="profile-theme" kicker="Apparence" title="Direction artistique" />
        <ThemePicker />
      </section>

      <section className={styles.section} aria-labelledby="profile-prefs">
        <SectionHeader id="profile-prefs" kicker="Préférences" title="Thèmes favoris" />
        <ChipGroup legend="Thèmes favoris" hideLegend>
          {categories.map((category) => (
            <Chip
              key={category.id}
              name="favorite-categories"
              value={category.id}
              checked={preferences.favoriteCategoryIds.includes(category.id)}
              onChange={() =>
                setFavoriteCategories(toggleInList(preferences.favoriteCategoryIds, category.id))
              }
            >
              {category.title}
            </Chip>
          ))}
        </ChipGroup>

        <fieldset className={styles.fieldset}>
          <legend className={`t-title3 ${styles.legend}`}>Niveau proposé</legend>
          <div className={styles.levels}>
            {[null, ...DIFFICULTIES].map((difficulty: Difficulty | null) => (
              <label key={difficulty ?? 'all'} className={styles.level}>
                <input
                  type="radio"
                  name="difficulty"
                  checked={preferences.preferredDifficulty === difficulty}
                  onChange={() => setPreferredDifficulty(difficulty)}
                />
                <span>
                  <span className="t-label">
                    {difficulty ? DIFFICULTY_LABELS[difficulty] : 'Tous les niveaux'}
                  </span>
                  {difficulty ? (
                    <span className="t-body-sm c-2">{DIFFICULTY_DESCRIPTIONS[difficulty]}</span>
                  ) : null}
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className={styles.fieldset}>
          <h3 className={`t-title3 ${styles.legend}`}>Tout est possible : niveau de lecture</h3>
          <Segmented<AgeBand | 'none'>
            legend="Niveau de lecture de Tout est possible"
            name="age-band"
            value={preferences.ageBand ?? 'none'}
            onChange={(value) => setAgeBand(value === 'none' ? null : value)}
            testIdPrefix="profile-age-band"
            options={[
              { id: 'none', label: 'Pas de choix' },
              ...AGE_BANDS.map((b) => ({ id: b.id, label: b.label })),
            ]}
          />
          <p className="t-caption c-muted">Sans choix, on lit la version 11 – 14 ans.</p>
        </div>

        <div>
          <ButtonLink href="/bienvenue" variant="secondary" icon={RotateCcw} iconPosition="start">
            Relancer l’accueil
          </ButtonLink>
        </div>
      </section>

      <LocalData />
    </Container>
  );
}

/** Données locales : effacer (avec confirmation), exporter, importer. */
function LocalData() {
  const resetAllData = useAppStore((s) => s.resetAllData);
  const importData = useAppStore((s) => s.importData);
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLButtonElement>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState<{ tone: 'ok' | 'error'; text: string } | null>(null);

  const closeDialog = () => {
    dialog.current?.close();
    opener.current?.focus();
  };

  const confirmReset = () => {
    resetAllData();
    closeDialog();
    setMessage({ tone: 'ok', text: 'Vos données ont été effacées de ce navigateur.' });
  };

  const exportData = () => {
    const data = buildExport(pickPersisted(useAppStore.getState()));
    const url = URL.createObjectURL(
      new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }),
    );
    const link = document.createElement('a');
    link.href = url;
    link.download = exportFileName();
    document.body.append(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    setMessage({ tone: 'ok', text: 'Le fichier de vos données a été téléchargé.' });
  };

  const onFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    if (file.size > 5_000_000) {
      setMessage({
        tone: 'error',
        text: 'Ce fichier est trop volumineux pour être un export Hors-Champ.',
      });
      return;
    }
    const result = parseImport(await file.text());
    if (!result.ok) {
      setMessage({ tone: 'error', text: `Import impossible : ${result.error}` });
      return;
    }
    importData(result.state);
    setMessage({ tone: 'ok', text: 'Vos données ont été importées.' });
  };

  return (
    <section
      id="donnees"
      className={`${styles.section} ${styles.data}`}
      aria-labelledby="profile-data"
    >
      <h2 id="profile-data" className="t-title2">
        Données locales
      </h2>
      <p className="t-body-sm c-2">
        Hors-Champ fonctionne sans compte. Tout est stocké dans ce navigateur uniquement : vous
        pouvez l’effacer à tout moment, ou l’exporter pour le reprendre ailleurs.
      </p>
      <div className={styles.dataActions}>
        <Button
          variant="secondary"
          icon={Download}
          iconPosition="start"
          onClick={exportData}
          data-testid="profile-export"
        >
          Exporter mes données
        </Button>
        <Button
          variant="secondary"
          icon={Upload}
          iconPosition="start"
          onClick={() => fileInput.current?.click()}
          data-testid="profile-import"
        >
          Importer
        </Button>
        <input
          ref={fileInput}
          type="file"
          accept="application/json,.json"
          className="sr-only"
          tabIndex={-1}
          aria-hidden="true"
          onChange={onFile}
          data-testid="profile-import-file"
        />
        <Button
          ref={opener}
          variant="secondary"
          icon={Trash}
          iconPosition="start"
          onClick={() => dialog.current?.showModal()}
          data-testid="profile-reset"
        >
          Effacer mes données
        </Button>
      </div>
      <p
        role="status"
        aria-live="polite"
        className={`t-body-sm ${message?.tone === 'error' ? styles.error : styles.success}`}
        data-testid="profile-data-message"
      >
        {message?.text}
      </p>

      <dialog
        ref={dialog}
        className={styles.dialog}
        aria-labelledby="reset-title"
        aria-describedby="reset-description"
        onClose={() => opener.current?.focus()}
        data-testid="reset-dialog"
      >
        <h2 id="reset-title" className="t-title2">
          Effacer toutes les données ?
        </h2>
        <p id="reset-description" className="t-body c-2">
          Vos favoris, votre progression, votre historique et vos préférences seront supprimés de ce
          navigateur. Le thème visuel est conservé. Cette action est définitive.
        </p>
        <div className={styles.dialogActions}>
          <Button variant="secondary" onClick={closeDialog}>
            Annuler
          </Button>
          <Button
            variant="primary"
            icon={Trash}
            iconPosition="start"
            onClick={confirmReset}
            data-testid="reset-confirm"
          >
            Tout effacer
          </Button>
        </div>
      </dialog>
    </section>
  );
}
