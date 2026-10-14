'use client';

import { useId, useState, type ReactNode } from 'react';

import { CoverArt } from '@/components/content/CoverArt';
import { Check, Printer } from '@/components/icons';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Tag } from '@/components/ui/Tag';
import type { Activity } from '@/types';

import { Lv, useBand } from './Leveled';
import styles from './youth.module.css';

function Block({
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
    <section className={styles.block} data-testid={testId}>
      <SectionHeader kicker={kicker} title={title} />
      {children}
    </section>
  );
}

/** Une activité se fait « en vrai » : on peut en imprimer la fiche (matériel, sécurité, étapes). */
export const isPrintable = (activity: Activity) =>
  activity.activityKind === 'build' || activity.activityKind === 'design';

/**
 * Activité jouable, sans note ni score : chaque retour est une piste. L'explication et le lien
 * avec un métier réel apparaissent une fois l'activité faite.
 */
export function ActivityPlay({ activity }: { activity: Activity }) {
  const band = useBand();
  const groupName = useId();
  const [choice, setChoice] = useState<string | null>(null);
  const [found, setFound] = useState<string[]>([]);
  const [design, setDesign] = useState<Record<string, string>>({});
  const [tried, setTried] = useState(false);

  const picked = activity.choices?.find((c) => c.id === choice);
  const details = activity.details ?? [];
  const designDone = (activity.design ?? []).every((step) => design[step.id]);
  const done =
    activity.activityKind === 'riddle'
      ? choice !== null
      : activity.activityKind === 'observe'
        ? found.length === details.length || tried
        : activity.activityKind === 'design'
          ? designDone
          : tried;

  return (
    <>
      <Lv as="p" text={activity.intro} className="t-body-lg" />
      <div className={styles.tags}>
        <Tag>{activity.minutes} min</Tag>
        <Tag tone="accent">Activité pédagogique</Tag>
        {isPrintable(activity) ? (
          <Button
            variant="secondary"
            icon={Printer}
            iconPosition="start"
            onClick={() => window.print()}
            className="no-print"
            data-testid="activity-print"
          >
            Imprimer la fiche
          </Button>
        ) : null}
      </div>

      {activity.materials.length > 0 ? (
        <Block kicker="Avant de commencer" title="Le matériel" testId="activity-materials">
          <ul className={styles.bullets}>
            {activity.materials.map((m) => (
              <li key={m}>{m}</li>
            ))}
          </ul>
        </Block>
      ) : null}

      {activity.safety?.length ? (
        <Block kicker="Sécurité" title="Les précautions" testId="activity-safety">
          <ul className={styles.bullets}>
            {activity.safety.map((m) => (
              <li key={m}>{m}</li>
            ))}
          </ul>
        </Block>
      ) : null}

      {activity.question && activity.choices ? (
        <Block
          title={activity.activityKind === 'build' ? 'Ta prédiction' : 'L’énigme'}
          testId="activity-question"
        >
          <fieldset className={styles.choices}>
            <legend className="t-body" style={{ marginBottom: 'var(--space-sm)' }}>
              {activity.question[band]}
            </legend>
            {activity.choices.map((c) => {
              const on = choice === c.id;
              return (
                <label key={c.id} className={`${styles.choice} ${on ? styles.choiceOn : ''}`}>
                  <input
                    type="radio"
                    name={groupName}
                    value={c.id}
                    checked={on}
                    onChange={() => setChoice(c.id)}
                    data-testid={`activity-choice-${c.id}`}
                  />
                  <span className={styles.mark} aria-hidden="true">
                    {on ? <Check size={14} strokeWidth={3} /> : null}
                  </span>
                  <span>{c.label}</span>
                </label>
              );
            })}
          </fieldset>
          <div aria-live="polite">
            {picked ? (
              <p className={`t-body ${styles.feedback}`} data-testid="activity-feedback">
                {picked.feedback[band]}
              </p>
            ) : null}
          </div>
        </Block>
      ) : null}

      {activity.steps ? (
        <Block title="Les étapes" testId="activity-steps">
          <ol className={styles.steps}>
            {activity.steps.map((step, index) => (
              <li key={index}>
                <span>{step[band]}</span>
              </li>
            ))}
          </ol>
          {!tried ? (
            <div>
              <Button
                icon={Check}
                iconPosition="start"
                onClick={() => setTried(true)}
                data-testid="activity-tried"
                className="no-print"
              >
                J’ai fait l’essai
              </Button>
            </div>
          ) : null}
        </Block>
      ) : null}

      {activity.activityKind === 'observe' && activity.image && details.length > 0 ? (
        <Block title="À toi d’observer" testId="activity-observe">
          <CoverArt
            artwork={activity.image}
            decorative={false}
            credit
            sizes="(min-width: 900px) 640px, 100vw"
            className={styles.artwork}
          />
          <p className="t-label" aria-live="polite" data-testid="activity-found-count">
            {found.length} détail{found.length > 1 ? 's' : ''} repéré{found.length > 1 ? 's' : ''}{' '}
            sur {details.length}
          </p>
          <ul className={styles.list}>
            {details.map((d) => {
              const on = found.includes(d.id);
              return (
                <li key={d.id} className={styles.link}>
                  <button
                    type="button"
                    aria-pressed={on}
                    className={`${styles.choice} ${on ? styles.choiceOn : ''}`}
                    onClick={() =>
                      setFound((f) => (on ? f.filter((x) => x !== d.id) : [...f, d.id]))
                    }
                    data-testid={`activity-detail-${d.id}`}
                  >
                    <span className={styles.mark} aria-hidden="true">
                      {on ? <Check size={14} strokeWidth={3} /> : null}
                    </span>
                    <span>{d.label[band]}</span>
                  </button>
                  {on ? <p className="t-body c-2">{d.explanation[band]}</p> : null}
                </li>
              );
            })}
          </ul>
          {!done ? (
            <div>
              <Button
                variant="ghost"
                onClick={() => {
                  setFound(details.map((d) => d.id));
                  setTried(true);
                }}
              >
                Voir tous les détails
              </Button>
            </div>
          ) : null}
        </Block>
      ) : null}

      {activity.design ? (
        <Block title="Conçois ton robot" testId="activity-design">
          <div className={`${styles.list} ${styles.noPrintActivity}`}>
            {activity.design.map((step) => (
              <fieldset key={step.id} className={styles.choices}>
                <legend className="t-label" style={{ marginBottom: 'var(--space-sm)' }}>
                  {step.prompt[band]}
                </legend>
                <div className={styles.tags}>
                  {step.options.map((o) => (
                    <Chip
                      key={o.id}
                      type="radio"
                      name={`${groupName}-${step.id}`}
                      value={o.id}
                      checked={design[step.id] === o.id}
                      onChange={() => setDesign((d) => ({ ...d, [step.id]: o.id }))}
                      testId={`activity-design-${step.id}-${o.id}`}
                    >
                      {o.label}
                    </Chip>
                  ))}
                </div>
              </fieldset>
            ))}
          </div>
          {/* Version imprimée : chaque étape de conception avec ses options à cocher. */}
          <div className={styles.printOnly}>
            {activity.design.map((step) => (
              <div key={step.id} style={{ marginBottom: '12pt' }}>
                <p className="t-label">{step.prompt[band]}</p>
                <ul>
                  {step.options.map((o) => (
                    <li key={o.id}>☐ {o.label}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div aria-live="polite">
            {designDone ? (
              <div className={styles.robot} data-testid="activity-robot">
                <p className="t-overline c-accent">Ton robot</p>
                {activity.design.map((step) => (
                  <p key={step.id} className="t-body">
                    <span className="t-label">{step.summary} : </span>
                    {step.options.find((o) => o.id === design[step.id])?.label}
                  </p>
                ))}
              </div>
            ) : null}
          </div>
        </Block>
      ) : null}

      <div aria-live="polite">
        {done ? (
          <div className={styles.explanation} data-testid="activity-explanation">
            <SectionHeader kicker="Ce qu’on peut en retenir" title="L’explication" />
            <p className="t-body">{activity.explanation[band]}</p>
            <SectionHeader kicker="Dans la vraie vie" title="Le lien avec un métier" />
            <p className="t-body">{activity.discipline[band]}</p>
          </div>
        ) : null}
      </div>
    </>
  );
}
