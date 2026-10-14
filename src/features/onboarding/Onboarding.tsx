'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState, type KeyboardEvent } from 'react';

import { CoverArt } from '@/components/content/CoverArt';
import { ArrowLeft, ArrowRight } from '@/components/icons';
import { Button } from '@/components/ui/Button';
import { Chip, ChipGroup } from '@/components/ui/Chip';
import { DIFFICULTIES } from '@/constants/enums';
import { DIFFICULTY_DESCRIPTIONS, DIFFICULTY_LABELS } from '@/constants/labels';
import { categoryArtworks } from '@/data/artworks';
import { toggleInList } from '@/features/experiences/filterExperiences';
import { useAppStore } from '@/store/useAppStore';
import type { Category, CategoryId, Difficulty } from '@/types';

import styles from './Onboarding.module.css';

const STEPS = ['promesse', 'approche', 'themes', 'niveau'] as const;

const PRINCIPLES = [
  {
    title: 'Lire',
    text: 'Des portraits de peintres, de chercheuses, de militantes. Leurs œuvres, leurs découvertes, les combats qu’elles ont menés.',
  },
  {
    title: 'Tirer le fil',
    text: 'Une fiche en appelle une autre. On passe d’une peintre à son tableau, d’une invention à l’effet Matilda. Gardez ce qui vous plaît.',
  },
  {
    title: 'Changer d’angle',
    text: 'Les contrechamps sont de courtes scènes du quotidien. Vous dites ce que vous y voyez, on en discute, y compris ce qu’on ne peut pas en conclure.',
  },
];

/** Accueil en quatre étapes, toujours passable. Aucune donnée personnelle n'est demandée. */
export function Onboarding({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const completeOnboarding = useAppStore((s) => s.completeOnboarding);
  const [stepIndex, setStepIndex] = useState(0);
  const [favoriteCategoryIds, setFavorites] = useState<CategoryId[]>([]);
  const [preferredDifficulty, setDifficulty] = useState<Difficulty | null>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const firstRender = useRef(true);

  const step = STEPS[stepIndex] ?? 'promesse';
  const isLast = stepIndex === STEPS.length - 1;

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    heading.current?.focus();
  }, [stepIndex]);

  const go = (delta: number) =>
    setStepIndex((i) => Math.min(STEPS.length - 1, Math.max(0, i + delta)));

  const finish = () => {
    completeOnboarding({ favoriteCategoryIds, preferredDifficulty });
    router.replace('/');
  };
  const skip = () => {
    completeOnboarding({ favoriteCategoryIds: [], preferredDifficulty: null });
    router.replace('/');
  };

  // ←/→ changent d'étape, sauf dans un champ (les radios utilisent déjà les flèches).
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    if (target.closest('input, textarea, select')) return;
    if (event.key === 'ArrowRight' && !isLast) {
      event.preventDefault();
      go(1);
    } else if (event.key === 'ArrowLeft' && stepIndex > 0) {
      event.preventDefault();
      go(-1);
    }
  };

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions -- raccourcis clavier en complément des boutons
    <div className={styles.page} onKeyDown={onKeyDown}>
      <div className={`${styles.art} ${step === 'promesse' ? '' : styles.artDesktopOnly}`}>
        <CoverArt
          artwork={categoryArtworks.raisonnement}
          decorative={false}
          credit
          offset
          priority
          sizes="(min-width: 900px) 45vw, 100vw"
          className={styles.cover}
        />
      </div>

      <div className={styles.panel}>
        <div className={styles.top}>
          <ol className={styles.steps} aria-hidden="true">
            {STEPS.map((s, index) => (
              <li key={s} className={index <= stepIndex ? styles.stepOn : styles.stepOff} />
            ))}
          </ol>
          <p className="sr-only" aria-live="polite" data-testid="onboarding-step">
            Étape {stepIndex + 1} sur {STEPS.length}
          </p>
          <span className="t-caption c-2" aria-hidden="true">
            {stepIndex + 1} / {STEPS.length}
          </span>
          <Button
            variant="ghost"
            onClick={skip}
            data-testid="onboarding-skip"
            className={styles.skip}
          >
            Passer
          </Button>
        </div>

        <div className={styles.body}>
          {step === 'promesse' ? (
            <>
              <p className="t-overline c-accent">Hors-Champ</p>
              <h1 ref={heading} tabIndex={-1} className="t-hero">
                L’histoire les a laissées hors champ.
              </h1>
              <p className="t-body-lg c-2 measure">
                Elles ont peint, calculé, découvert, et on a souvent oublié leur nom. Hors-Champ les
                remet dans le cadre, et vous apprend à repérer ce qui les en avait sorties.
              </p>
            </>
          ) : null}

          {step === 'approche' ? (
            <>
              <p className="t-overline c-accent">L’approche</p>
              <h1 ref={heading} tabIndex={-1} className="t-title1">
                Ici, personne ne vous fait passer d’examen.
              </h1>
              <ol className={styles.principles}>
                {PRINCIPLES.map((principle, index) => (
                  <li key={principle.title} className={styles.principle}>
                    <span className={`t-title1 c-primary ${styles.number}`} aria-hidden="true">
                      {index + 1}
                    </span>
                    <span className={styles.principleText}>
                      <span className="t-title3">{principle.title}</span>
                      <span className="t-body c-2">{principle.text}</span>
                    </span>
                  </li>
                ))}
              </ol>
              <p className="t-body-sm c-muted">
                Vos opinions ne sont jamais notées. La progression compte seulement ce que vous avez
                lu.
              </p>
            </>
          ) : null}

          {step === 'themes' ? (
            <>
              <p className="t-overline c-accent">Facultatif</p>
              <h1 ref={heading} tabIndex={-1} className="t-title1">
                Quels thèmes vous intéressent ?
              </h1>
              <p className="t-body c-2">
                On vous proposera d’abord des contrechamps sur ces sujets. Vous pourrez changer
                d’avis dans votre profil.
              </p>
              <ChipGroup legend="Thèmes favoris" hideLegend>
                {categories.map((category) => (
                  <Chip
                    key={category.id}
                    name="onboarding-themes"
                    value={category.id}
                    checked={favoriteCategoryIds.includes(category.id)}
                    onChange={() => setFavorites((list) => toggleInList(list, category.id))}
                  >
                    {category.title}
                  </Chip>
                ))}
              </ChipGroup>
            </>
          ) : null}

          {step === 'niveau' ? (
            <>
              <p className="t-overline c-accent">Facultatif</p>
              <h1 ref={heading} tabIndex={-1} className="t-title1">
                Par où commencer ?
              </h1>
              <fieldset className={styles.levels}>
                <legend className="sr-only">Niveau</legend>
                {DIFFICULTIES.map((difficulty) => (
                  <label key={difficulty} className={styles.level}>
                    <input
                      type="radio"
                      name="onboarding-level"
                      checked={preferredDifficulty === difficulty}
                      onChange={() => setDifficulty(difficulty)}
                    />
                    <span className="t-label">{DIFFICULTY_LABELS[difficulty]}</span>
                    <span className="t-body-sm c-2">{DIFFICULTY_DESCRIPTIONS[difficulty]}</span>
                  </label>
                ))}
              </fieldset>
              <p className="t-body-sm c-muted">Pas de préférence ? On vous propose de tout.</p>
            </>
          ) : null}
        </div>

        <div className={styles.footer}>
          {stepIndex > 0 ? (
            <Button variant="ghost" icon={ArrowLeft} iconPosition="start" onClick={() => go(-1)}>
              Précédent
            </Button>
          ) : (
            <span />
          )}
          <Button
            variant={isLast ? 'accent' : 'primary'}
            icon={ArrowRight}
            onClick={isLast ? finish : () => go(1)}
            data-testid="onboarding-next"
          >
            {isLast ? 'Commencer' : 'Suivant'}
          </Button>
        </div>
      </div>
    </div>
  );
}
