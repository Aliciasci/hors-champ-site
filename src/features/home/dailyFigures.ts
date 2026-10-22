import { rightGaps, WORLD_RIGHTS } from '@/content/world';
import { VOTE_GAP_SOURCE, VOTE_GAPS } from '@/content/world/vote-gap';

/**
 * « Le chiffre du jour » de l'accueil : un chiffre tiré des données sourcées de la page du
 * monde, différent chaque jour. Aucun texte propre : chaque phrase reprend les années de la
 * source citée.
 */
export interface DailyFigure {
  id: string;
  /** Surtitre : le droit concerné. */
  topic: string;
  value: string;
  unit: string;
  text: string;
  href: string;
  source: { publisher: string; url: string };
}

const chapter = (id: string) => `/droits/monde#chapitre-${id}`;

/** Écarts de moins de dix ans : peu parlants, laissés de côté. */
const MIN_GAP = 10;

/** Pour les autres droits, les trois plus longues attentes de chacun. */
const GAPS_PER_RIGHT = 3;

export function dailyFigures(): DailyFigure[] {
  const vote = VOTE_GAPS.filter((g) => g.women - g.men >= MIN_GAP).map((g) => ({
    id: `vote-${g.name}`,
    topic: 'Droit de vote',
    value: String(g.women - g.men),
    unit: 'ans d’attente',
    text: `${g.name} : les hommes votent dès ${g.men}, les femmes en ${g.women}.`,
    href: chapter('vote'),
    source: { publisher: VOTE_GAP_SOURCE.publisher, url: VOTE_GAP_SOURCE.url },
  }));

  const gaps = WORLD_RIGHTS.filter((right) => right.id !== 'vote').flatMap((right) =>
    rightGaps(right)
      .filter((g) => g.to - g.from >= MIN_GAP)
      .slice(0, GAPS_PER_RIGHT)
      .map((g) => ({
        id: `gap-${right.id}-${g.name}`,
        topic: right.name,
        value: String(g.to - g.from),
        unit: 'ans d’attente',
        text: `${g.name} : un premier pas en ${g.from} (${right.partialPhrase}), le droit plein en ${g.to}.`,
        href: chapter(right.id),
        source: { publisher: right.source.publisher, url: right.source.url },
      })),
  );

  // Les familles alternent : un écart de vote, un autre droit…
  // Pas de décompte de pays : la carte ne recense que ceux qui ont avancé, « 39 sur 39 » tromperait.
  const lanes = [vote, gaps];
  const out: DailyFigure[] = [];
  for (let i = 0; lanes.some((lane) => i < lane.length); i++) {
    for (const lane of lanes) if (lane[i]) out.push(lane[i]!);
  }
  return out;
}
