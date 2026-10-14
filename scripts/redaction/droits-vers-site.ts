/**
 * Transforme une extraction relue (.redaction/droits/<droit>.json) en données du site
 * (src/content/world/<droit>.json), selon des règles explicites, propres à chaque droit.
 *
 *   npm run redaction:droits-site -- universite|majorite|avortement
 */
import path from 'node:path';

import { parseArgs, readJson, ROOT, WORK, writeJson } from './lib';

type Level = 'full' | 'partial' | 'none';

interface Extracted {
  source: string;
  pays: Record<
    string,
    {
      events: {
        annee: number;
        niveau: 'partiel' | 'plein';
        extrait: string;
        remarque: string | null;
      }[];
    }
  >;
}

/** Nom de pays (tel que l'extraction l'écrit) → code de la carte. */
const CODES: Record<string, string> = {
  'Afrique du Sud': 'ZAF',
  'Arabie saoudite': 'SAU',
  Népal: 'NPL',
  Allemagne: 'DEU',
  Angola: 'AGO',
  Argentine: 'ARG',
  Australie: 'AUS',
  Autriche: 'AUT',
  Belgique: 'BEL',
  Bénin: 'BEN',
  Bolivie: 'BOL',
  Botswana: 'BWA',
  Brésil: 'BRA',
  Bulgarie: 'BGR',
  Canada: 'CAN',
  Chili: 'CHL',
  Chine: 'CHN',
  Colombie: 'COL',
  'Corée du Sud': 'KOR',
  'Costa Rica': 'CRI',
  Cuba: 'CUB',
  Danemark: 'DNK',
  'El Salvador': 'SLV',
  Équateur: 'ECU',
  Espagne: 'ESP',
  'États-Unis': 'USA',
  Finlande: 'FIN',
  France: 'FRA',
  Grèce: 'GRC',
  Guatemala: 'GTM',
  Haïti: 'HTI',
  Honduras: 'HND',
  Hongrie: 'HUN',
  Inde: 'IND',
  Indonésie: 'IDN',
  Iran: 'IRN',
  Irlande: 'IRL',
  Islande: 'ISL',
  Italie: 'ITA',
  Japon: 'JPN',
  Lesotho: 'LSO',
  Mexique: 'MEX',
  Monténégro: 'MNE',
  Mozambique: 'MOZ',
  Namibie: 'NAM',
  Nicaragua: 'NIC',
  Norvège: 'NOR',
  'Nouvelle-Zélande': 'NZL',
  Paraguay: 'PRY',
  'Pays-Bas': 'NLD',
  Pérou: 'PER',
  Pologne: 'POL',
  Portugal: 'PRT',
  'République dominicaine': 'DOM',
  Roumanie: 'ROU',
  'Royaume-Uni': 'GBR',
  Russie: 'RUS',
  Rwanda: 'RWA',
  Serbie: 'SRB',
  Singapour: 'SGP',
  Suède: 'SWE',
  Suisse: 'CHE',
  Thaïlande: 'THA',
  Uruguay: 'URY',
  Venezuela: 'VEN',
  Zimbabwe: 'ZWE',
};

interface Step {
  year: number;
  level: Level;
  excerpt: string;
  note?: string;
}

/** Règles propres à chaque droit : quels événements garder, à quel niveau, recul possible ou non. */
const RULES: Record<
  string,
  {
    monotonic: boolean;
    keep: (country: string, e: Extracted['pays'][string]['events'][number]) => Level | null;
    extra?: Record<string, Step[]>;
    drop?: string[];
  }
> = {
  universite: {
    monotonic: true,
    keep: (_c, e) => (e.niveau === 'plein' ? 'full' : 'partial'),
  },
  majorite: {
    monotonic: true,
    // Espagne : accordée en 1931, annulée en 1939, rétablie avec la fin du permiso marital.
    extra: {
      ESP: [
        {
          year: 1939,
          level: 'none',
          excerpt: 'Espagne : majorité légale pour les femmes mariées (rescinded in 1939).',
          note: 'La majorité légale des femmes mariées est annulée en 1939.',
        },
        {
          year: 1975,
          level: 'full',
          excerpt:
            "Espagne : abolition du permiso marital (qui exigeait des femmes mariées qu'elles aient le consentement de leur conjoint pour presque toutes les activités économiques, dont l'emploi, la propriété et voyager sur de longues distances).",
          note: 'Fin du « permiso marital ».',
        },
      ],
    },
    keep: (_c, e) => {
      const text = e.extrait.toLowerCase();
      if (text.includes('majorité légale pour les femmes non mariées')) return 'partial';
      if (text.includes('majorité légale pour les femmes mariées')) return 'full';
      if (text.includes('potestas maritalis') && text.includes("n'abolit pas")) return 'partial';
      const marital =
        text.includes('potestas maritalis') ||
        text.includes('consentement de leur conjoint') ||
        text.includes('consentement de son mari') ||
        text.includes('permiso marital') ||
        text.includes('suprématie du mari');
      if (marital) return e.niveau === 'plein' ? 'full' : 'partial';
      return null;
    },
  },
  avortement: {
    monotonic: false,
    // Loi eugéniste de 1935 (pas un droit des femmes) ; interdiction roumaine de 1966, qu'un
    // pays absent auparavant ferait lire à tort comme une ouverture ; l'Ukraine est comprise
    // dans l'Union soviétique (Russie).
    keep: (country, e) => {
      if (country === 'Allemagne' && e.annee === 1935) return null;
      return e.niveau === 'plein' ? 'full' : 'partial';
    },
    drop: ['Roumanie', 'Ukraine'],
    extra: {
      USA: [
        {
          year: 2022,
          level: 'partial',
          excerpt:
            "Dobbs v. Jackson Women's Health Organization, No. 19-1392, 597 U.S. ___ (2022), is a decision of the United States Supreme Court, in which the Court held that the Constitution of the United States does not confer any right to abortion, thus overruling both Roe v. Wade (1973) and Planned Parenthood v. Casey (1992).",
          note: 'L’arrêt Dobbs supprime la protection fédérale : l’accès dépend désormais de chaque État.',
        },
      ],
    },
  },
};

function main() {
  const { rest } = parseArgs(process.argv.slice(2));
  const id = rest[0];
  const rule = id ? RULES[id] : undefined;
  if (!id || !rule) throw new Error(`Droit attendu : ${Object.keys(RULES).join(', ')}`);
  const data = readJson<Extracted | null>(path.join(WORK, 'droits', `${id}.json`), null);
  if (!data) throw new Error(`Lancez d’abord : npm run redaction:droits -- ${id}`);

  const countries: Record<string, { steps: Step[] }> = {};
  const unknown: string[] = [];
  for (const [name, entry] of Object.entries(data.pays)) {
    if (rule.drop?.includes(name)) continue;
    const code = CODES[name];
    if (!code) {
      unknown.push(name);
      continue;
    }
    const steps: Step[] = [];
    for (const event of [...entry.events].sort((a, b) => a.annee - b.annee)) {
      let level = rule.keep(name, event);
      if (!level) continue;
      const previous = steps.at(-1);
      if (rule.monotonic && previous?.level === 'full') continue;
      if (rule.monotonic && level === 'partial' && previous?.level === 'partial') continue;
      if (previous && previous.year === event.annee) {
        if (previous.level === 'partial' && level === 'full') steps.pop();
        else continue;
      }
      if (!rule.monotonic && previous?.level === level) continue;
      steps.push({
        year: event.annee,
        level,
        excerpt: event.extrait,
        ...(event.remarque ? { note: event.remarque } : {}),
      });
      level = null;
    }
    for (const step of rule.extra?.[code] ?? []) steps.push(step);
    if (steps.length) countries[code] = { steps: steps.sort((a, b) => a.year - b.year) };
  }
  if (unknown.length) throw new Error(`Pays sans code : ${unknown.join(', ')}`);

  const out = path.join(ROOT, 'src/content/world', `${id}.json`);
  writeJson(out, { id, source: data.source, countries });
  console.log(`${Object.keys(countries).length} pays → ${out}`);
}

main();
