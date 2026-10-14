'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Suspense,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type FormEvent,
  type RefObject,
} from 'react';

import { ArrowLeft, ArrowRight, Check, X } from '@/components/icons';
import { Button } from '@/components/ui/Button';
import {
  canSubmit,
  evaluateAnswer,
  OUTCOME_COPY,
  sanitizeSelection,
  toggleOption,
} from '@/features/experiences/answerLogic';
import { useAppStore } from '@/store/useAppStore';
import {
  EXPERIENCE_STEPS,
  type Experience,
  type ExperienceProgress,
  type ExperienceStep,
} from '@/types';
import { pluralize } from '@/utils/text';

import { OptionCard } from './OptionCard';
import styles from './Player.module.css';
import {
  analysisHref,
  detailHref,
  marker,
  playHref,
  STEP_LABELS,
  STEP_NUMBERS,
  stepFromParam,
} from './routes';
import { ScenarioBlock } from './ScenarioBlock';

function previousStep(step: ExperienceStep): ExperienceStep | null {
  const index = EXPERIENCE_STEPS.indexOf(step);
  return index > 0 ? (EXPERIENCE_STEPS[index - 1] ?? null) : null;
}

/** Lecteur de contrechamp. La progression est enregistrée à chaque action : on peut quitter à tout moment. */
export function PlayerIsland({ experience }: { experience: Experience }) {
  return (
    <Suspense fallback={<PlayerLoading title={experience.title} />}>
      <Player experience={experience} />
    </Suspense>
  );
}

function PlayerLoading({ title }: { title: string }) {
  return (
    <div className={styles.shell}>
      <h1 className={`t-label ${styles.experienceTitle}`}>{title}</h1>
      <p className="t-body-sm c-2" role="status">
        Préparation du contrechamp…
      </p>
    </div>
  );
}

function Player({ experience }: { experience: Experience }) {
  const id = experience.id;
  const router = useRouter();
  const params = useSearchParams();
  const urlStep = stepFromParam(params.get('etape'));
  const hydrated = useAppStore((s) => s.hasHydrated);
  const progress = useAppStore((s) => s.progress[id]);
  const startExperience = useAppStore((s) => s.startExperience);
  const goToStep = useAppStore((s) => s.goToStep);
  const setSelection = useAppStore((s) => s.setSelection);
  const submitAnswer = useAppStore((s) => s.submitAnswer);
  const completeExperience = useAppStore((s) => s.completeExperience);
  const [finishing, setFinishing] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const settled = useRef(false);
  const lastStep = useRef<ExperienceStep | null>(null);

  // Démarre une tentative, ou reprend celle en cours (sans effet si elle existe déjà).
  useEffect(() => {
    if (hydrated) startExperience(id);
  }, [hydrated, id, startExperience]);

  const ready = hydrated && progress?.status === 'in-progress';
  const step = progress?.currentStep ?? 'scenario';

  const stepUrl = useCallback(
    (s: ExperienceStep) => `${playHref(id)}?etape=${STEP_NUMBERS[s]}`,
    [id],
  );

  // L'URL reflète l'étape : à l'arrivée, on reprend l'étape enregistrée ; ensuite, le bouton
  // retour du navigateur (changement de `?etape`) fait remonter d'une étape.
  useEffect(() => {
    if (!ready || finishing) return;
    if (!settled.current) {
      settled.current = true;
      if (urlStep !== step) router.replace(stepUrl(step), { scroll: false });
      return;
    }
    if (urlStep && urlStep !== step) {
      if (urlStep === 'feedback' && progress?.submittedOptionIds === null) {
        router.replace(stepUrl(step), { scroll: false });
      } else {
        goToStep(id, urlStep);
      }
    }
    // L'étape enregistrée ne doit pas relancer cet effet : seule l'URL le pilote.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlStep, ready]);

  // Focus sur le titre de l'étape à chaque changement (pas au premier affichage).
  useEffect(() => {
    if (!ready) return;
    if (lastStep.current !== null && lastStep.current !== step) {
      headingRef.current?.focus();
    }
    lastStep.current = step;
  }, [step, ready]);

  const go = (next: ExperienceStep) => {
    goToStep(id, next);
    router.push(stepUrl(next), { scroll: false });
    window.scrollTo({ top: 0 });
  };

  if (!ready && !finishing) return <PlayerLoading title={experience.title} />;
  if (!progress) return <PlayerLoading title={experience.title} />;

  const stepIndex = EXPERIENCE_STEPS.indexOf(step);
  const previous = previousStep(step);
  const submitted = progress.submittedOptionIds !== null;
  const selection = sanitizeSelection(experience, progress.selectedOptionIds);

  const submit = () => {
    if (submitted || !canSubmit(experience, selection)) return;
    submitAnswer(id, selection);
    router.push(stepUrl('feedback'), { scroll: false });
    window.scrollTo({ top: 0 });
  };

  const finish = () => {
    setFinishing(true);
    completeExperience(id);
    router.replace(analysisHref(id));
  };

  return (
    <div className={styles.shell}>
      <div className={styles.topBar}>
        <Link href={detailHref(id)} className={styles.quit} data-testid="player-quit">
          <X size={18} strokeWidth={2.25} aria-hidden="true" />
          <span>
            Quitter
            <span className="sr-only"> le contrechamp. Votre progression est enregistrée.</span>
          </span>
        </Link>
        <h1 className={`t-label ${styles.experienceTitle}`}>{experience.title}</h1>
        {previous ? (
          <Button
            variant="ghost"
            icon={ArrowLeft}
            iconPosition="start"
            onClick={() => go(previous)}
            data-testid="player-previous"
          >
            Précédent
          </Button>
        ) : (
          <span className={styles.spacer} />
        )}
      </div>

      <nav aria-label="Étapes du contrechamp">
        <ol className={styles.steps}>
          {EXPERIENCE_STEPS.map((s, index) => (
            <li
              key={s}
              className={`${styles.stepItem} ${index <= stepIndex ? styles.stepDone : ''}`}
              aria-current={s === step ? 'step' : undefined}
            >
              <span className={styles.stepBar} aria-hidden="true" />
              <span className="t-caption">
                <span className="sr-only">
                  Étape {index + 1} sur {EXPERIENCE_STEPS.length} :{' '}
                </span>
                <span aria-hidden="true">{index + 1}. </span>
                {STEP_LABELS[s]}
              </span>
            </li>
          ))}
        </ol>
      </nav>

      <div className={styles.stage} key={step}>
        {step === 'scenario' ? (
          <>
            <h2 ref={headingRef} tabIndex={-1} className={`t-title1 ${styles.stepTitle}`}>
              {experience.scenario.title}
            </h2>
            <div className={styles.blocks}>
              {experience.scenario.blocks.map((block, index) => (
                <ScenarioBlock key={`${block.kind}-${index}`} block={block} />
              ))}
            </div>
            <div className={styles.footer}>
              <Button
                icon={ArrowRight}
                onClick={() => go('question')}
                data-testid="player-to-question"
              >
                Passer à la question
              </Button>
            </div>
          </>
        ) : null}

        {step === 'question' ? (
          <QuestionStep
            experience={experience}
            headingRef={headingRef}
            selection={submitted ? (progress.submittedOptionIds ?? []) : selection}
            submitted={submitted}
            onToggle={(optionId) =>
              setSelection(id, toggleOption(experience.question.mode, selection, optionId))
            }
            onSelectIndex={(index) => {
              const option = experience.answerOptions[index];
              if (option)
                setSelection(id, toggleOption(experience.question.mode, selection, option.id));
            }}
            onSubmit={submit}
            onShowFeedback={() => go('feedback')}
          />
        ) : null}

        {step === 'feedback' ? (
          <>
            <FeedbackStep experience={experience} progress={progress} headingRef={headingRef} />
            <div className={styles.footer}>
              <Button icon={ArrowRight} onClick={finish} data-testid="player-finish">
                Voir l’analyse complète
              </Button>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}

function QuestionStep({
  experience,
  headingRef,
  selection,
  submitted,
  onToggle,
  onSelectIndex,
  onSubmit,
  onShowFeedback,
}: {
  experience: Experience;
  headingRef: RefObject<HTMLHeadingElement | null>;
  selection: string[];
  submitted: boolean;
  onToggle: (optionId: string) => void;
  onSelectIndex: (index: number) => void;
  onSubmit: () => void;
  onShowFeedback: () => void;
}) {
  const { question } = experience;
  const name = useId();
  const reasonId = `${name}-reason`;
  const valid = canSubmit(experience, selection);

  // Raccourcis : chiffres 1–n pour choisir, Entrée pour valider.
  useEffect(() => {
    if (submitted) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target as HTMLElement | null;
      if (
        target?.closest(
          'textarea, input[type="text"], input[type="search"], [contenteditable="true"]',
        )
      )
        return;
      if (/^[1-9]$/.test(event.key)) {
        const index = Number(event.key) - 1;
        if (index < experience.answerOptions.length) {
          event.preventDefault();
          onSelectIndex(index);
        }
      } else if (event.key === 'Enter') {
        if (target?.closest('button, a, summary')) return;
        event.preventDefault();
        onSubmit();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [submitted, experience.answerOptions.length, onSelectIndex, onSubmit]);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className={styles.question} noValidate>
      <fieldset className={styles.fieldset}>
        <legend className={styles.legend}>
          <span className="t-overline c-accent">
            {question.mode === 'multiple' ? 'Plusieurs réponses possibles' : 'Une réponse'}
          </span>
          <h2 ref={headingRef} tabIndex={-1} className={`t-title1 ${styles.stepTitle}`}>
            {question.prompt}
          </h2>
          {question.helper ? <span className="t-body c-2">{question.helper}</span> : null}
        </legend>
        <p className="sr-only">
          Raccourcis clavier : touches 1 à {experience.answerOptions.length} pour choisir, Entrée
          pour valider.
        </p>
        <div className={styles.options}>
          {experience.answerOptions.map((option, index) => (
            <OptionCard
              key={option.id}
              option={option}
              mode={question.mode}
              name={name}
              marker={marker(index)}
              number={index + 1}
              selected={selection.includes(option.id)}
              revealed={submitted}
              onToggle={submitted ? undefined : () => onToggle(option.id)}
            />
          ))}
        </div>
      </fieldset>

      <div className={styles.footer}>
        {submitted ? (
          <Button type="button" icon={ArrowRight} onClick={onShowFeedback}>
            Voir le retour
          </Button>
        ) : (
          <>
            <p
              id={reasonId}
              className="t-caption c-2"
              aria-live="polite"
              data-testid="player-selection-count"
            >
              {question.mode === 'multiple'
                ? selection.length === 0
                  ? 'Sélectionnez au moins un élément'
                  : pluralize(selection.length, 'élément sélectionné', 'éléments sélectionnés')
                : valid
                  ? 'Une réponse sélectionnée'
                  : 'Sélectionnez une réponse'}
            </p>
            <Button
              type="submit"
              variant="accent"
              icon={Check}
              aria-disabled={!valid}
              aria-describedby={reasonId}
              data-testid="player-submit"
            >
              Valider ma réponse
            </Button>
          </>
        )}
      </div>
    </form>
  );
}

function FeedbackStep({
  experience,
  progress,
  headingRef,
}: {
  experience: Experience;
  progress: ExperienceProgress;
  headingRef: RefObject<HTMLHeadingElement | null>;
}) {
  const name = useId();
  const answer = progress.submittedOptionIds ?? [];
  if (answer.length === 0) return null;
  const evaluation = evaluateAnswer(experience, answer);
  const copy = OUTCOME_COPY[evaluation.outcome];
  const indexOf = (optionId: string) =>
    experience.answerOptions.findIndex((o) => o.id === optionId);

  return (
    <div className={styles.blocks}>
      <section
        className={styles.outcome}
        data-testid="player-outcome"
        aria-labelledby={`${name}-outcome`}
      >
        <p className="t-overline">Premier retour</p>
        <h2
          ref={headingRef}
          tabIndex={-1}
          id={`${name}-outcome`}
          className={`t-title1 ${styles.stepTitle}`}
        >
          {copy.title}
        </h2>
        <p className="t-body">{copy.description}</p>
      </section>

      <h3 className="t-title3">
        {evaluation.selected.length > 1 ? 'Vos réponses' : 'Votre réponse'}
      </h3>
      <div className={styles.options}>
        {evaluation.selected.map((option) => (
          <OptionCard
            key={option.id}
            option={option}
            mode={experience.question.mode}
            name={name}
            marker={marker(indexOf(option.id))}
            selected
            revealed
          />
        ))}
      </div>

      {evaluation.missed.length > 0 ? (
        <>
          <h3 className="t-title3">À considérer aussi</h3>
          <ul className={styles.options}>
            {evaluation.missed.map((option) => (
              <li key={option.id} className={styles.missed}>
                <p className="t-label">
                  {marker(indexOf(option.id))}. {option.label}
                </p>
                <p className="t-body-sm c-2">{option.feedback}</p>
              </li>
            ))}
          </ul>
        </>
      ) : null}
    </div>
  );
}
