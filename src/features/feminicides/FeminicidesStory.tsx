'use client';

import Link from 'next/link';
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
  type ReactNode,
} from 'react';

import {
  FEMICIDE_SOURCES,
  FEMICIDES_CHECKED_AT,
  FIGURE_FRANCE,
  FIGURE_WORLD,
  FORMS,
  FRANCE_FACTS,
  HELP,
  HELP_SOURCE,
  ORGANISATIONS,
  PROTECTIONS,
  VIOLENCE_FORMS,
  type FemicideFigure,
  type FemicideSource,
} from '@/content/feminicides';

import styles from './Feminicides.module.css';
import { Fireflies, type StoryPosition } from './Fireflies';
import { Grass } from './Grass';
import { ACTS, StoryProgress } from './StoryProgress';

const MOTION_KEY = 'hors-champ:feminicides-animations';
const MOTION_EVENT = 'hc-feminicides-motion';
const REDUCED = '(prefers-reduced-motion: reduce)';

/** Choix fait sur cette page, quand le navigateur refuse de l'enregistrer. */
let motionOverride: 'on' | 'off' | null = null;

/** Animations : le choix fait sur cette page, sinon le réglage du système. */
function readMotion(): 'on' | 'off' {
  let saved: string | null = motionOverride;
  try {
    saved = localStorage.getItem(MOTION_KEY) ?? saved;
  } catch {
    // Stockage indisponible : le choix de cette visite, ou le réglage du système.
  }
  if (saved === 'on' || saved === 'off') return saved;
  return window.matchMedia(REDUCED).matches ? 'off' : 'on';
}

function writeMotion(value: 'on' | 'off') {
  motionOverride = value;
  try {
    localStorage.setItem(MOTION_KEY, value);
  } catch {
    // Le choix vaut pour cette visite seulement.
  }
  window.dispatchEvent(new Event(MOTION_EVENT));
}

function subscribeMotion(onChange: () => void) {
  const query = window.matchMedia(REDUCED);
  query.addEventListener('change', onChange);
  window.addEventListener(MOTION_EVENT, onChange);
  return () => {
    query.removeEventListener('change', onChange);
    window.removeEventListener(MOTION_EVENT, onChange);
  };
}

const delay = (seconds: number) => ({ '--d': `${seconds}s` }) as CSSProperties;

/** Un texte qui apparaît en fondu quand il entre à l'écran (visible d'emblée sans JavaScript). */
function Reveal({
  children,
  as: Tag = 'p',
  className = '',
  wait = 0,
  testId,
}: {
  children: ReactNode;
  testId?: string;
  as?: 'p' | 'div' | 'span' | 'h2' | 'h3' | 'li';
  className?: string;
  /** Décalage, en secondes, par rapport aux textes voisins. */
  wait?: number;
}) {
  return (
    <Tag
      className={`${styles.reveal} ${className}`}
      data-reveal=""
      style={delay(wait)}
      data-testid={testId}
    >
      {children}
    </Tag>
  );
}

/** Arrêter ou relancer les animations : en haut de l'écran, ou dans l'avertissement (mobile). */
function MotionButton({
  animate,
  onToggle,
  inline = false,
}: {
  animate: boolean;
  onToggle: () => void;
  inline?: boolean;
}) {
  return (
    <button
      type="button"
      className={styles.motion}
      aria-pressed={!animate}
      onClick={onToggle}
      data-testid={inline ? 'fem-motion-inline' : 'fem-motion'}
    >
      {animate ? 'Arrêter les animations' : 'Animations arrêtées'}
    </button>
  );
}

const formatDate = (iso: string) =>
  new Date(`${iso}T12:00:00`).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

function SourceLink({ source }: { source: FemicideSource }) {
  return (
    <a href={source.url} className={styles.sourceLink} rel="noopener noreferrer" target="_blank">
      {source.publisher}, « {source.label} », {source.date}
      <span className="sr-only"> (nouvel onglet)</span>
    </a>
  );
}

/** Un chiffre, avec tout ce qu'il faut pour le lire : année, définition, périmètre, limites. */
function Figure({
  figure,
  large = false,
  testId,
}: {
  figure: FemicideFigure;
  large?: boolean;
  testId?: string;
}) {
  return (
    <Reveal
      as="div"
      className={`${styles.figure} ${large ? styles.figureLarge : ''}`}
      testId={testId}
    >
      <p className={styles.figureValue}>
        {figure.value}
        <span className="sr-only"> {figure.label}</span>
      </p>
      <p className={styles.figureLabel} aria-hidden="true">
        {figure.label}
      </p>
      <dl className={styles.figureFacts}>
        <div>
          <dt>Année</dt>
          <dd>{figure.year}</dd>
        </div>
        <div>
          <dt>Périmètre</dt>
          <dd>{figure.scope}</dd>
        </div>
        <div className={styles.wide}>
          <dt>Ce que l’on compte</dt>
          <dd>{figure.definition}</dd>
        </div>
        <div className={styles.wide}>
          <dt>Ce que ce chiffre ne dit pas</dt>
          <dd>{figure.caveat}</dd>
        </div>
        <div className={styles.wide}>
          <dt>{figure.sources.length > 1 ? 'Sources' : 'Source'}</dt>
          {figure.sources.map((source) => (
            <dd key={source.url}>
              <SourceLink source={source} />
            </dd>
          ))}
        </div>
      </dl>
    </Reveal>
  );
}

/**
 * Féminicides : un récit en cinq actes, de la nuit au chemin de lumière. Le défilement fait
 * avancer le récit ; rien n'est imposé, tout se lit aussi sans animation et sans JavaScript.
 */
export function FeminicidesStory() {
  const root = useRef<HTMLDivElement>(null);
  const position = useRef<StoryPosition>({ act: 0, progress: 0 });
  const [act, setAct] = useState(0);
  const motion = useSyncExternalStore(subscribeMotion, readMotion, () => 'server' as const);
  const ready = motion !== 'server';
  const animate = motion === 'on';

  const toggleMotion = () => writeMotion(animate ? 'off' : 'on');

  // L'acte en cours et l'avancée dans l'acte, recalculés au plus une fois par image.
  useEffect(() => {
    let frame = 0;
    const measure = () => {
      frame = 0;
      const line = window.innerHeight * 0.55;
      let index = 0;
      let progress = 0;
      ACTS.forEach(({ id }, i) => {
        const section = document.getElementById(id);
        if (!section) return;
        const rect = section.getBoundingClientRect();
        if (rect.top <= line) {
          index = i;
          progress = Math.min(1, Math.max(0, (line - rect.top) / rect.height));
        }
      });
      position.current = { act: index, progress };
      window.dispatchEvent(new Event('hc-story-move'));
      setAct(index);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, []);

  // Les textes apparaissent en entrant à l'écran, une fois pour toutes.
  useEffect(() => {
    const items = root.current?.querySelectorAll<HTMLElement>('[data-reveal]') ?? [];
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          (entry.target as HTMLElement).dataset.shown = '';
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: '0px 0px -12% 0px' },
    );
    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  const jump = useCallback(
    (index: number) => {
      const section = document.getElementById(ACTS[index]?.id ?? '');
      if (!section) return;
      section.scrollIntoView({ behavior: animate ? 'smooth' : 'auto', block: 'start' });
      section.querySelector<HTMLElement>('[data-act-title]')?.focus({ preventScroll: true });
    },
    [animate],
  );

  return (
    <div
      ref={root}
      className={styles.page}
      data-act={act}
      data-ready={ready ? '' : undefined}
      data-motion={animate ? 'on' : 'off'}
      data-testid="feminicides"
    >
      {/* La scène fixe, sous le texte : le ciel et les lucioles. */}
      <div className={styles.stage}>
        <div className={styles.sky} aria-hidden="true" />
        <Fireflies position={position} animate={animate && ready} />
      </div>
      {/* Au-dessus du texte : quitter, arrêter les animations, se repérer. */}
      <div className={styles.chrome}>
        <div className={styles.controls}>
          <Link href="/" replace className={styles.exit} data-testid="fem-exit">
            Quitter la page
          </Link>
          <MotionButton animate={animate} onToggle={toggleMotion} />
        </div>
        <StoryProgress active={act} onJump={jump} />
      </div>

      {/* ACTE I — La nuit */}
      <section
        id={ACTS[0].id}
        className={`${styles.act} ${styles.night}`}
        aria-labelledby="fem-title"
      >
        <aside className={styles.warning} aria-label="Avertissement">
          <p>
            <strong>Avant d’entrer.</strong> Cette page parle de violences conjugales et de meurtres
            de femmes. Elle ne montre aucune image de victime. Vous pouvez la quitter à tout moment.
          </p>
          <p>
            Besoin de parler (France) : <a href="tel:3919">3919</a>, gratuit et anonyme, jour et
            nuit. En danger immédiat : <a href="tel:17">17</a>, ou <a href="sms:114">114</a> par
            SMS.
          </p>
          <p className={styles.inlineMotion}>
            <MotionButton animate={animate} onToggle={toggleMotion} inline />
          </p>
        </aside>

        <div className={styles.opening}>
          <p className={styles.intro} style={delay(0.6)}>
            Elles avaient des projets.
          </p>
          <p className={styles.intro} style={delay(1.8)}>
            Des habitudes.
          </p>
          <p className={styles.intro} style={delay(3)}>
            Des gens qui les attendaient.
          </p>
          <p className={`${styles.intro} ${styles.breath}`} style={delay(5)}>
            Certaines n’ont jamais pu rentrer chez elles.
          </p>
          <h1
            id="fem-title"
            className={`${styles.intro} ${styles.title}`}
            style={delay(7)}
            tabIndex={-1}
            data-act-title=""
          >
            Derrière chaque chiffre, une histoire.
          </h1>
          <a
            href={`#${ACTS[1].id}`}
            className={`${styles.intro} ${styles.enter}`}
            style={delay(8.4)}
            onClick={(event) => {
              event.preventDefault();
              jump(1);
            }}
            data-testid="fem-enter"
          >
            Entrer dans le récit <span aria-hidden="true">↓</span>
          </a>
        </div>
        <Grass seed={3} />
      </section>

      {/* ACTE II — Des vies, pas seulement des chiffres */}
      <section
        id={ACTS[1].id}
        className={`${styles.act} ${styles.lives}`}
        aria-labelledby="fem-act-2"
      >
        <h2 id="fem-act-2" className="sr-only" tabIndex={-1} data-act-title="">
          Acte II : {ACTS[1].title}
        </h2>
        <div className={styles.lines}>
          <Reveal className={styles.line}>Une lumière.</Reveal>
          <Reveal className={styles.line}>Puis une autre.</Reveal>
          <Reveal className={`${styles.line} ${styles.lineBig}`}>Puis des milliers.</Reveal>
        </div>
        <Reveal className={styles.quiet}>
          À force de compter, on risque d’oublier ce que l’on compte.
        </Reveal>

        <Figure figure={FIGURE_FRANCE} large testId="fem-figure-france" />
        <Reveal className={styles.metaphor}>
          <span className={styles.hand} aria-hidden="true">
            une image, pas un décompte
          </span>
          Les lumières de cette page sont une image. Aucune ne représente une personne réelle, et
          leur nombre n’est pas celui des victimes.
        </Reveal>
        <Figure figure={FIGURE_WORLD} />
      </section>

      {/* ACTE III — Derrière les lumières */}
      <section
        id={ACTS[2].id}
        className={`${styles.act} ${styles.behind}`}
        aria-labelledby="fem-act-3"
      >
        <h2 id="fem-act-3" className="sr-only" tabIndex={-1} data-act-title="">
          Acte III : {ACTS[2].title}
        </h2>
        <ol className={styles.fragments}>
          {[
            'Elle avait un prénom.',
            'Une histoire.',
            'Des projets qui n’avaient pas encore commencé.',
            'Des personnes qui l’aimaient.',
            'Un avenir qui lui appartenait.',
          ].map((text, index) => (
            <Reveal key={text} as="li" className={styles.fragment}>
              <span
                className={styles.paper}
                style={{ '--tilt': `${[-1.6, 1.2, -0.8, 1.8, -1.2][index]}deg` } as CSSProperties}
              >
                {text}
              </span>
            </Reveal>
          ))}
        </ol>
        <Reveal className={styles.after}>
          Des filles, des sœurs, des amies, des collègues, des voisines. Des vies entières, que leur
          mort ne résume pas.
        </Reveal>
        <Reveal className={styles.note}>
          <span className={styles.hand} aria-hidden="true">
            aucune histoire inventée
          </span>
          Ces phrases ont été écrites pour cette page : ce ne sont pas des témoignages, et elles ne
          parlent d’aucune femme en particulier. Les histoires réelles ne seront racontées ici
          qu’avec des sources, et dans le respect de la dignité et de la vie privée des personnes.
        </Reveal>
      </section>

      {/* ACTE IV — Ce n'est pas une fatalité */}
      <section
        id={ACTS[3].id}
        className={`${styles.act} ${styles.dawn}`}
        aria-labelledby="fem-act-4"
      >
        <Reveal as="h2" className={styles.statement}>
          <span id="fem-act-4" tabIndex={-1} data-act-title="">
            Les féminicides ne sont pas des fatalités.
          </span>
        </Reveal>
        <Reveal className={styles.lead}>
          Comprendre les violences, reconnaître les signaux, protéger les personnes et agir : la
          prévention compte.
        </Reveal>

        <div id="comprendre" className={styles.block}>
          <Reveal as="h3" className={styles.blockTitle}>
            Ce que recouvre le mot
          </Reveal>
          <Reveal className={styles.blockLead}>
            « Féminicide » désigne le meurtre d’une femme ou d’une fille lié au fait qu’elle est une
            femme. Les Nations unies ont adopté en 2022 un cadre pour les compter de la même façon
            partout. Il distingue :
          </Reveal>
          <ul className={styles.cards}>
            {FORMS.map((form) => (
              <Reveal key={form.title} as="li" className={styles.card}>
                <strong>{form.title}</strong>
                <span>{form.text}</span>
              </Reveal>
            ))}
          </ul>
          <p className={styles.cite}>
            Source : <SourceLink source={FEMICIDE_SOURCES[4]!} />
          </p>
        </div>

        <div className={styles.block}>
          <Reveal as="h3" className={styles.blockTitle}>
            Avant, il y a souvent eu des violences
          </Reveal>
          <Reveal className={styles.blockLead}>
            Les violences au sein du couple prennent plusieurs formes, souvent mêlées. L’emprise
            passe par le contrôle, les menaces, l’isolement, l’argent. Chaque histoire est
            différente : aucun scénario unique ne les résume.
          </Reveal>
          <ul className={styles.cards}>
            {VIOLENCE_FORMS.map((form) => (
              <Reveal key={form.title} as="li" className={styles.card}>
                <strong>{form.title}</strong>
                <span>{form.text}</span>
              </Reveal>
            ))}
          </ul>
          <p className={styles.cite}>
            Source : <SourceLink source={HELP_SOURCE} />
          </p>

          <ul className={styles.facts}>
            {FRANCE_FACTS.map((fact) => (
              <Reveal key={fact.text} as="li" className={styles.fact}>
                <span className={styles.factYear}>France, {fact.year}</span>
                <span>{fact.text}</span>
                <span className={styles.cite}>
                  <SourceLink source={fact.source} />
                </span>
              </Reveal>
            ))}
          </ul>
          <Reveal className={styles.responsibility}>
            Repérer les signaux est l’affaire de l’entourage, des professionnels et des
            institutions. La responsabilité des violences appartient à ceux qui les commettent,
            jamais à celles qui les subissent.
          </Reveal>
        </div>

        <div id="proteger" className={styles.block}>
          <Reveal as="h3" className={styles.blockTitle}>
            Ce que la loi prévoit pour protéger
          </Reveal>
          <ul className={styles.cards}>
            {PROTECTIONS.map((item) => (
              <Reveal key={item.title} as="li" className={styles.card}>
                <strong>{item.title}</strong>
                <span>{item.text}</span>
              </Reveal>
            ))}
          </ul>
          <p className={styles.cite}>
            En France. Source : <SourceLink source={HELP_SOURCE} />
          </p>
        </div>

        <div id="aide" className={`${styles.block} ${styles.help}`} data-testid="fem-help">
          <h3 className={styles.blockTitle}>Ressources d’aide, en France</h3>
          <ul className={styles.helpList}>
            {HELP.map((item) => (
              <li key={item.contact}>
                <span className={styles.helpName}>{item.name}</span>
                <a
                  href={item.href}
                  className={styles.helpContact}
                  {...(item.href.startsWith('http')
                    ? { target: '_blank', rel: 'noopener noreferrer' }
                    : {})}
                >
                  {item.contact}
                </a>
                <span>{item.text}</span>
              </li>
            ))}
          </ul>
          <p className={styles.cite}>
            Coordonnées vérifiées le {formatDate(FEMICIDES_CHECKED_AT)} sur{' '}
            <SourceLink source={HELP_SOURCE} />. Hors de France, ces numéros ne fonctionnent pas :
            le 112 est le numéro d’urgence dans toute l’Union européenne.
          </p>
        </div>

        <div id="associations" className={styles.block}>
          <h3 className={styles.blockTitle}>Les associations qui agissent</h3>
          <ul className={styles.cards}>
            {ORGANISATIONS.map((org) => (
              <li key={org.name} className={styles.card}>
                <a
                  href={org.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.orgLink}
                >
                  {org.name}
                  <span className="sr-only"> (nouvel onglet)</span>
                </a>
                <span>{org.text}</span>
              </li>
            ))}
          </ul>
          <p className={styles.cite}>
            Pour les soutenir : un don, du bénévolat, ou simplement relayer leurs numéros. Leurs
            sites disent comment.
          </p>
        </div>
      </section>

      {/* ACTE V — Ne pas laisser le silence gagner */}
      <section
        id={ACTS[4].id}
        className={`${styles.act} ${styles.path}`}
        aria-labelledby="fem-act-5"
      >
        <h2 id="fem-act-5" className={styles.closing} tabIndex={-1} data-act-title="">
          <Reveal as="span">Se souvenir ne suffit pas.</Reveal>{' '}
          <Reveal as="span" wait={0.6}>
            Comprendre est nécessaire.
          </Reveal>{' '}
          <Reveal as="span" wait={1.2}>
            Agir l’est aussi.
          </Reveal>
        </h2>
        <ul className={styles.exits}>
          <li>
            <a href="#comprendre" className={styles.exitCard} data-testid="fem-out-comprendre">
              <strong>Comprendre les féminicides</strong>
              <span>Les faits, les formes, les mécanismes.</span>
            </a>
          </li>
          <li>
            <a href="#aide" className={styles.exitCard} data-testid="fem-out-aide">
              <strong>Découvrir les ressources d’aide</strong>
              <span>Les numéros et les recours, vérifiés, en France.</span>
            </a>
          </li>
          <li>
            <a href="#associations" className={styles.exitCard} data-testid="fem-out-associations">
              <strong>Les associations qui agissent</strong>
              <span>Qui elles sont, comment les soutenir.</span>
            </a>
          </li>
        </ul>
        <Grass seed={11} tall />
      </section>

      <section className={styles.sources} aria-labelledby="fem-sources">
        <h2 id="fem-sources" className={styles.sourcesTitle}>
          Sources et méthode
        </h2>
        <p>
          Chaque chiffre porte son année, sa définition et sa source. Les décomptes français sont
          ceux des forces de l’ordre ; le chiffre mondial est une estimation. Les lumières sont une
          image : elles ne correspondent à aucun dossier réel. Page vérifiée le{' '}
          {formatDate(FEMICIDES_CHECKED_AT)}.
        </p>
        <ul>
          {FEMICIDE_SOURCES.map((source) => (
            <li key={source.url}>
              <SourceLink source={source} />
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
