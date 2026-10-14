'use client';

import { useRouter } from 'next/navigation';
import type { ReactNode } from 'react';

import { ContentCard } from '@/components/content/ContentCard';
import { CultureCard } from '@/components/content/CultureCard';
import { EditorialNotice } from '@/components/content/EditorialNotice';
import { ExperienceBookmarkButton } from '@/components/content/SaveButtons';
import { SourceList } from '@/components/content/SourceList';
import { ArrowRight, Check, MessageCircleQuestionMark, RotateCcw, X } from '@/components/icons';
import { Button, ButtonLink } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import {
  evaluateAnswer,
  OUTCOME_COPY,
  sanitizeSelection,
} from '@/features/experiences/answerLogic';
import { answerForResult, hasCompleted } from '@/features/progress/progressLogic';
import { useAppStore } from '@/store/useAppStore';
import type { Category, CultureEntity, Experience } from '@/types';

import styles from './Analysis.module.css';
import { AssessmentBadge } from './AssessmentBadge';
import { detailHref, playHref } from './routes';

function Section({
  kicker,
  title,
  children,
  testId,
}: {
  kicker?: string;
  title: string;
  children: ReactNode;
  testId?: string;
}) {
  return (
    <section className={styles.section} data-testid={testId}>
      <div className={styles.sectionHead}>
        {kicker ? <p className="t-overline c-accent">{kicker}</p> : null}
        <h2 className="t-title2">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function ConclusionList({ items, kind }: { items: string[]; kind: 'can' | 'cannot' }) {
  const Icon = kind === 'can' ? Check : X;
  return (
    <ul className={styles.conclusionList}>
      {items.map((item) => (
        <li key={item} className={styles.conclusionItem}>
          <Icon
            size={18}
            strokeWidth={3}
            aria-hidden="true"
            className={kind === 'can' ? styles.canIcon : styles.cannotIcon}
          />
          <span className="t-body">{item}</span>
        </li>
      ))}
    </ul>
  );
}

/** Analyse complète d'un contrechamp, à partir de la réponse enregistrée dans ce navigateur. */
export function Analysis({
  experience,
  category,
  related,
  relatedCategories,
  culture,
}: {
  experience: Experience;
  category: Category | undefined;
  related: Experience[];
  relatedCategories: Category[];
  culture: CultureEntity[];
}) {
  const router = useRouter();
  const hydrated = useAppStore((s) => s.hasHydrated);
  const progress = useAppStore((s) => s.progress[experience.id]);
  const allProgress = useAppStore((s) => s.progress);
  const restartExperience = useAppStore((s) => s.restartExperience);

  if (!hydrated) {
    return (
      <p className="t-body-sm c-2" role="status" style={{ minHeight: '40vh' }}>
        Chargement de l’analyse…
      </p>
    );
  }

  const answer = sanitizeSelection(experience, answerForResult(progress) ?? []);
  const next = related.find((item) => !hasCompleted(allProgress[item.id]));
  const restart = () => {
    restartExperience(experience.id);
    router.replace(`${playHref(experience.id)}?etape=1`);
  };

  if (answer.length === 0) {
    return (
      <EmptyState
        testId="result-no-answer"
        icon={MessageCircleQuestionMark}
        kicker="Analyse"
        headingLevel={1}
        title="Pas encore de réponse à analyser"
        description="L’analyse s’affiche une fois que vous avez répondu à la question de ce contrechamp."
        actions={<ButtonLink href={playHref(experience.id)}>Commencer le contrechamp</ButtonLink>}
      />
    );
  }

  const evaluation = evaluateAnswer(experience, answer);
  const copy = OUTCOME_COPY[evaluation.outcome];
  const { explanation, nuance } = experience;
  const categoryById = new Map(relatedCategories.map((c) => [c.id, c]));

  return (
    <article className={styles.article}>
      <header className={styles.hero}>
        <p className="t-overline c-accent">Analyse · {category?.title ?? 'Contrechamp'}</p>
        <h1 className="t-title1">{experience.title}</h1>
      </header>

      <section className={styles.outcome} data-testid="result-outcome" aria-label="Bilan">
        <p className="t-title2">{copy.title}</p>
        <p className="t-body">{copy.description}</p>
      </section>

      <Section
        kicker="Votre lecture"
        title={evaluation.selected.length > 1 ? 'Les éléments retenus' : 'La réponse choisie'}
      >
        <ul className={styles.list}>
          {evaluation.selected.map((option) => (
            <li key={option.id} className={styles.answer}>
              <p className="t-label">{option.label}</p>
              <AssessmentBadge assessment={option.assessment} />
              <p className="t-body-sm c-2">{option.feedback}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section kicker="Comprendre" title="L’explication">
        <p className="t-body-lg measure">{explanation.summary}</p>
        <ol className={styles.points}>
          {explanation.keyPoints.map((point, index) => (
            <li key={point} className={styles.point}>
              <span className={`t-title3 c-primary ${styles.pointNumber}`} aria-hidden="true">
                {index + 1}
              </span>
              <span className="t-body">{point}</span>
            </li>
          ))}
        </ol>
      </Section>

      <div className={styles.conclusions}>
        <section className={`${styles.conclusionBox} ${styles.canBox}`}>
          <h2 className="t-title3">Ce que l’on peut conclure</h2>
          <ConclusionList items={nuance.canConclude} kind="can" />
        </section>
        <section className={`${styles.conclusionBox} ${styles.cannotBox}`}>
          <h2 className="t-title3">Ce que l’on ne peut pas conclure</h2>
          <ConclusionList items={nuance.cannotConclude} kind="cannot" />
        </section>
      </div>

      {nuance.counterArguments.length > 0 ? (
        <Section kicker="Objections" title="Les contre-arguments">
          <ul className={styles.list}>
            {nuance.counterArguments.map((counter) => (
              <li key={counter.claim} className={styles.counter}>
                <p className="t-quote">{counter.claim}</p>
                <p className="t-body c-2">{counter.response}</p>
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      <Section kicker="Lectures possibles" title="Toutes les options, commentées">
        <ul className={styles.list}>
          {experience.answerOptions.map((option) => (
            <li key={option.id} className={styles.option}>
              <p className="t-label">
                {option.label}
                {answer.includes(option.id) ? (
                  <span className="c-primary"> · votre choix</span>
                ) : null}
              </p>
              <AssessmentBadge assessment={option.assessment} />
              <p className="t-body-sm c-2">{option.feedback}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section kicker="Vérifier" title="Sources">
        <EditorialNotice status={experience.editorialStatus} reviewedAt={experience.reviewedAt} />
        <SourceList sources={experience.sources} />
      </Section>

      {related.length > 0 ? (
        <Section kicker="Pour aller plus loin" title="Contrechamps associés">
          <ul>
            {related.map((item, index) => (
              <li key={item.id}>
                <ContentCard
                  variant="compact"
                  index={index}
                  experience={item}
                  category={categoryById.get(item.categoryId)}
                />
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      {culture.length > 0 ? (
        <Section
          kicker="Dans la culture"
          title="Le thème en œuvres et en idées"
          testId="result-culture"
        >
          <ul>
            {culture.map((entity) => (
              <li key={entity.id}>
                <CultureCard entity={entity} testId={`result-culture-${entity.id}`} />
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      <div className={styles.footer}>
        <ExperienceBookmarkButton experienceId={experience.id} full />
        <Button
          variant="secondary"
          icon={RotateCcw}
          iconPosition="start"
          onClick={restart}
          data-testid="result-restart"
        >
          Recommencer
        </Button>
        <ButtonLink
          href={next ? detailHref(next.id) : '/contrechamps/catalogue'}
          icon={ArrowRight}
          data-testid="result-continue"
          aria-label={next ? `Continuer : ${next.title}` : 'Explorer le catalogue des contrechamps'}
        >
          {next ? 'Continuer' : 'Explorer'}
        </ButtonLink>
      </div>
    </article>
  );
}
