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
  FORMS_SOURCE,
  FRANCE_FACTS,
  HELP,
  HELP_SOURCE,
  ORGANISATIONS,
  PROTECTION_FACT,
  PROTECTIONS,
  VIOLENCE_FORMS,
  type FemicideFigure,
  type FemicideSource,
} from '@/content/feminicides';

import styles from './Feminicides.module.css';
import { NightScene, type StoryPosition } from './NightScene';
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
  as?: 'p' | 'div' | 'span' | 'h2' | 'h3' | 'li';
  className?: string;
  /** Décalage, en secondes, par rapport aux textes voisins. */
  wait?: number;
  testId?: string;
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

/**
 * Un chiffre composé comme un monument typographique, posé dans le paysage. Ce qu'il compte et
 * sa source se déplient à la demande, sans interrompre le récit.
 */
function Monument({
  figure,
  lead,
  side,
  testId,
}: {
  figure: FemicideFigure;
  /** La phrase qui accompagne le nombre. */
  lead: ReactNode;
  side: 'left' | 'right';
  testId: string;
}) {
  return (
    <Reveal
      as="div"
      className={`${styles.monument} ${side === 'right' ? styles.monumentRight : ''}`}
      testId={testId}
    >
      <p className={styles.monumentValue}>
        {figure.value}
        <span className="sr-only"> {figure.label}</span>
      </p>
      <div className={styles.monumentText}>
        <p className={styles.monumentLead}>{lead}</p>
        <p className={styles.monumentMeta}>
          {figure.scope} · {figure.year}
        </p>
        <details className={styles.details}>
          <summary>Ce que l’on compte, et la source</summary>
          <dl>
            <dt>Ce que l’on compte</dt>
            <dd>{figure.definition}</dd>
            <dt>Ce que ce chiffre ne dit pas</dt>
            <dd>{figure.caveat}</dd>
            <dt>{figure.sources.length > 1 ? 'Sources' : 'Source'}</dt>
            {figure.sources.map((source) => (
              <dd key={source.url}>
                <SourceLink source={source} />
              </dd>
            ))}
          </dl>
        </details>
      </div>
    </Reveal>
  );
}

/** Une liste éditoriale : un titre et deux lignes par entrée, des filets, pas de cartes. */
function Notes({ items }: { items: { title: ReactNode; text: string }[] }) {
  return (
    <ul className={styles.notes}>
      {items.map((item, index) => (
        <Reveal key={index} as="li" className={styles.noteItem} wait={(index % 4) * 0.15}>
          <strong>{item.title}</strong>
          <span>{item.text}</span>
        </Reveal>
      ))}
    </ul>
  );
}

/**
 * Féminicides : un récit en cinq mouvements dans une prairie de nuit. Le défilement est la caméra ;
 * rien n'est imposé, tout se lit aussi sans animation et sans JavaScript.
 */
export function FeminicidesStory() {
  const root = useRef<HTMLDivElement>(null);
  const position = useRef<StoryPosition>({ act: 0, progress: 0, page: 0 });
  const [act, setAct] = useState(0);
  const motion = useSyncExternalStore(subscribeMotion, readMotion, () => 'server' as const);
  const ready = motion !== 'server';
  const animate = motion === 'on';

  const toggleMotion = () => writeMotion(animate ? 'off' : 'on');

  // Le mouvement en cours, l'avancée dans ce mouvement et dans la page, au plus une fois par image.
  useEffect(() => {
    let frame = 0;
    let lastAct = -1;
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
      const box = root.current?.getBoundingClientRect();
      const page = box
        ? Math.min(1, Math.max(0, -box.top / Math.max(1, box.height - window.innerHeight)))
        : 0;
      position.current = { act: index, progress, page };
      if (index !== lastAct) {
        lastAct = index;
        window.dispatchEvent(new Event('hc-story-act'));
      }
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
      { rootMargin: '0px 0px -14% 0px' },
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
      data-feminicides=""
      data-act={act}
      data-ready={ready ? '' : undefined}
      data-motion={animate ? 'on' : 'off'}
      data-testid="feminicides"
    >
      <NightScene position={position} animate={animate && ready} />

      {/* Au-dessus du paysage : quitter, arrêter les animations, se repérer. */}
      <div className={styles.chrome}>
        <div className={styles.controls}>
          <Link href="/" replace className={styles.exit} data-testid="fem-exit">
            Quitter la page
          </Link>
          <MotionButton animate={animate} onToggle={toggleMotion} />
        </div>
        <StoryProgress active={act} onJump={jump} />
      </div>

      {/* MOUVEMENT I — Les lumières */}
      <section id={ACTS[0].id} className={styles.act} aria-labelledby="fem-title">
        <div className={styles.opening}>
          <h1
            id="fem-title"
            className={`${styles.intro} ${styles.title}`}
            style={delay(4.6)}
            tabIndex={-1}
            data-act-title=""
          >
            Derrière chaque chiffre, <br />
            une histoire.
          </h1>
          <p className={`${styles.intro} ${styles.subtitle}`} style={delay(7.2)}>
            Des vies. Des rêves. Des avenirs. <br />
            Des absences qui n’auraient jamais dû exister.
          </p>
          <a
            href={`#${ACTS[1].id}`}
            className={`${styles.intro} ${styles.enter}`}
            style={delay(9.4)}
            onClick={(event) => {
              event.preventDefault();
              jump(1);
            }}
            data-testid="fem-enter"
          >
            Entrer dans le récit <span aria-hidden="true">↓</span>
          </a>
        </div>
        <aside
          className={`${styles.intro} ${styles.warning}`}
          style={delay(1.2)}
          aria-label="Avertissement"
        >
          <p>
            Cette page évoque des violences conjugales et des meurtres de femmes. Aucune image de
            victime. Vous pouvez la quitter à tout moment.
          </p>
          <p>
            Besoin de parler, en France : <a href="tel:3919">3919</a>, gratuit, anonyme, jour et
            nuit. En danger : <a href="tel:17">17</a>, ou <a href="sms:114">114</a> par SMS.
          </p>
          <p className={styles.inlineMotion}>
            <MotionButton animate={animate} onToggle={toggleMotion} inline />
          </p>
        </aside>

        <div className={styles.meaning}>
          <Reveal className={`${styles.whisper} ${styles.atLeft}`}>
            Chaque lumière, ici, évoque une vie.
          </Reveal>
          <Reveal className={`${styles.whisper} ${styles.atRight}`}>Une vie qui comptait.</Reveal>
        </div>
      </section>

      {/* MOUVEMENT II — L'ampleur */}
      <section
        id={ACTS[1].id}
        className={`${styles.act} ${styles.scale}`}
        aria-labelledby="fem-act-2"
      >
        <h2 id="fem-act-2" className="sr-only" tabIndex={-1} data-act-title="">
          {ACTS[1].title}
        </h2>
        <Reveal className={`${styles.huge} ${styles.atLeft}`}>Puis des milliers.</Reveal>
        <Reveal className={`${styles.aside} ${styles.atRight}`}>
          À force de compter, on risque d’oublier ce que l’on compte.
        </Reveal>

        <Monument
          figure={FIGURE_FRANCE}
          side="left"
          testId="fem-figure-france"
          lead={
            <>
              femmes tuées par leur conjoint ou ex-conjoint en France, en {FIGURE_FRANCE.year}.
              <span className={styles.leadSoft}>
                {' '}
                Hommes et femmes confondus, un décès au sein du couple tous les trois jours, en
                moyenne.
              </span>
            </>
          }
        />

        <Reveal className={`${styles.metaphor} ${styles.atRight}`}>
          <span className={styles.hand} aria-hidden="true">
            une image, pas un décompte
          </span>
          Les lumières de cette page ne représentent aucune personne réelle, et leur nombre n’est
          pas celui des victimes.
        </Reveal>

        <Monument
          figure={FIGURE_WORLD}
          side="right"
          testId="fem-figure-world"
          lead={
            <>
              femmes et filles tuées dans le monde en {FIGURE_WORLD.year} par un partenaire ou un
              membre de leur famille, selon une estimation des Nations unies.
              <span className={styles.leadSoft}>
                {' '}
                Toutes causes confondues, 83 000 femmes et filles ont été tuées intentionnellement
                cette année-là.
              </span>
            </>
          }
        />
      </section>

      {/* MOUVEMENT III — Les vies derrière les chiffres */}
      <section
        id={ACTS[2].id}
        className={`${styles.act} ${styles.lives}`}
        aria-labelledby="fem-act-3"
      >
        <h2 id="fem-act-3" className="sr-only" tabIndex={-1} data-act-title="">
          {ACTS[2].title}
        </h2>
        <ol className={styles.fragments}>
          {[
            'Elle avait un prénom.',
            'Des choses qu’elle aimait.',
            'Des projets qui lui appartenaient.',
            'Un avenir qui n’aurait jamais dû lui être retiré.',
          ].map((text) => (
            <Reveal key={text} as="li" className={styles.fragment}>
              {text}
            </Reveal>
          ))}
        </ol>
        <Reveal className={`${styles.metaphor} ${styles.atLeft}`}>
          <span className={styles.hand} aria-hidden="true">
            aucune histoire inventée
          </span>
          Ces phrases ont été écrites pour cette page. Ce ne sont pas des témoignages, et elles ne
          parlent d’aucune femme en particulier. Les histoires réelles n’y seront racontées qu’avec
          leurs sources, dans le respect de la dignité et de la vie privée des personnes.
        </Reveal>
      </section>

      {/* MOUVEMENT IV — Comprendre */}
      <section
        id={ACTS[3].id}
        className={`${styles.act} ${styles.understand}`}
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

        <div id="comprendre" className={styles.chapter}>
          <Reveal as="h3" className={styles.chapterTitle}>
            Ce que recouvre le mot
          </Reveal>
          <Reveal className={styles.chapterLead}>
            Le meurtre d’une femme ou d’une fille lié au fait qu’elle est une femme. Depuis 2022, un
            cadre des Nations unies permet de le compter partout de la même façon. Il distingue :
          </Reveal>
          <Notes items={FORMS} />
          <p className={styles.cite}>
            Source : <SourceLink source={FORMS_SOURCE} />
          </p>
        </div>

        <div className={styles.chapter}>
          <Reveal as="h3" className={styles.chapterTitle}>
            Avant, il y a souvent eu des violences
          </Reveal>
          <Reveal className={styles.chapterLead}>
            Physiques, psychologiques, sexuelles, économiques : elles se mêlent souvent. L’emprise
            passe par le contrôle, les menaces, l’isolement, l’argent. Aucun scénario unique ne
            résume ces histoires.
          </Reveal>
          <Notes items={VIOLENCE_FORMS} />
          <p className={styles.cite}>
            Source : <SourceLink source={HELP_SOURCE} />
          </p>
        </div>

        <div className={styles.chapter}>
          <Reveal as="h3" className={styles.chapterTitle}>
            Des signaux, et des protections qui manquent
          </Reveal>
          <ul className={styles.facts}>
            {[...FRANCE_FACTS, PROTECTION_FACT].map((fact) => (
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

        <div id="proteger" className={styles.chapter}>
          <Reveal as="h3" className={styles.chapterTitle}>
            Ce que la loi prévoit pour protéger
          </Reveal>
          <Notes items={PROTECTIONS} />
          <p className={styles.cite}>
            En France. Source : <SourceLink source={HELP_SOURCE} />
          </p>
        </div>

        <div id="aide" className={`${styles.chapter} ${styles.help}`} data-testid="fem-help">
          <h3 className={styles.chapterTitle}>Trouver de l’aide, en France</h3>
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

        <div id="associations" className={styles.chapter}>
          <h3 className={styles.chapterTitle}>Celles et ceux qui agissent</h3>
          <ul className={styles.notes}>
            {ORGANISATIONS.map((org) => (
              <li key={org.name} className={styles.noteItem}>
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

      {/* MOUVEMENT V — Ce qui reste */}
      <section
        id={ACTS[4].id}
        className={`${styles.act} ${styles.remains}`}
        aria-labelledby="fem-act-5"
      >
        <div className={styles.closingStage}>
          <h2 id="fem-act-5" className={styles.closing} tabIndex={-1} data-act-title="">
            <Reveal as="span">Se souvenir ne suffit pas.</Reveal>{' '}
            <Reveal as="span" wait={0.9}>
              Comprendre est nécessaire.
            </Reveal>{' '}
            <Reveal as="span" wait={1.8}>
              Agir l’est aussi.
            </Reveal>
          </h2>
        </div>
        <ul className={styles.exits}>
          <li>
            <a href="#comprendre" className={styles.exitLink} data-testid="fem-out-comprendre">
              Comprendre les féminicides <span aria-hidden="true">→</span>
            </a>
          </li>
          <li>
            <a href="#aide" className={styles.exitLink} data-testid="fem-out-aide">
              Trouver de l’aide <span aria-hidden="true">→</span>
            </a>
          </li>
          <li>
            <a href="#associations" className={styles.exitLink} data-testid="fem-out-associations">
              Découvrir celles et ceux qui agissent <span aria-hidden="true">→</span>
            </a>
          </li>
        </ul>
      </section>

      <section className={styles.sources} aria-labelledby="fem-sources">
        <h2 id="fem-sources" className={styles.sourcesTitle}>
          Sources et méthode
        </h2>
        <p>
          Chaque chiffre porte son année, sa définition et sa source. Les décomptes français sont
          ceux des forces de l’ordre ; le chiffre mondial est une estimation des Nations unies. Les
          lumières sont une image : elles ne correspondent à aucun dossier réel. Page vérifiée le{' '}
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
