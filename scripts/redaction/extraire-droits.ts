/**
 * Extrait, pays par pays, l'année d'un droit à partir d'une chronologie de Wikipédia.
 * Le modèle doit recopier un extrait mot pour mot ; le script rejette toute ligne dont l'extrait
 * est absent du texte ou dont l'année ne correspond pas. Rien n'est publié : le résultat va dans
 * .redaction/droits/<droit>.json, à relire avant d'en faire des données du site.
 *
 *   npm run redaction:droits -- universite|majorite|avortement
 */
import path from 'node:path';

import { chatJson, DEFAULT_MODEL, loadEnv, parseArgs, WORK, wikipediaText, writeJson } from './lib';

const FR_RIGHTS =
  'https://fr.wikipedia.org/wiki/Chronologie_des_droits_des_femmes_autres_que_le_suffrage';
const EN_REPRO = 'https://en.wikipedia.org/wiki/Timeline_of_reproductive_rights_legislation';

const RIGHTS: Record<string, { url: string; criterion: string }> = {
  universite: {
    url: FR_RIGHTS,
    criterion: `l’accès des femmes à l’université. « partiel » : une première ouverture limitée (une seule université, certaines facultés, auditrices, autorisation au cas par cas, un premier diplôme isolé). « plein » : les femmes sont admises dans les universités du pays comme les hommes.`,
  },
  majorite: {
    url: FR_RIGHTS,
    criterion: `la majorité légale ou la capacité juridique des femmes (agir, signer, gérer leurs biens sans tuteur ni mari). « partiel » : seulement les femmes non mariées, ou à un âge plus tardif que les hommes. « plein » : toutes les femmes, y compris mariées.`,
  },
  avortement: {
    url: EN_REPRO,
    criterion: `la légalisation de l’avortement. « partiel » : autorisé pour certains motifs seulement (santé, viol, malformation…). « plein » : autorisé à la demande de la femme (« on request »), au moins en début de grossesse. Signale dans « remarque » tout retour en arrière (nouvelle interdiction).`,
  },
};

const SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['evenements'],
  properties: {
    evenements: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['pays', 'annee', 'niveau', 'extrait', 'remarque'],
        properties: {
          pays: { type: 'string' },
          annee: { type: 'integer' },
          niveau: { type: 'string', enum: ['partiel', 'plein'] },
          extrait: { type: 'string' },
          remarque: { type: ['string', 'null'] },
        },
      },
    },
  },
};

interface Event {
  pays: string;
  annee: number;
  niveau: 'partiel' | 'plein';
  extrait: string;
  remarque: string | null;
}

const normalize = (text: string) =>
  text
    .replace(/[’‘]/g, "'")
    .replace(/[«»“”]/g, '"')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();

/** Découpe le texte en morceaux d'environ `size` caractères, aux sauts de ligne. */
function chunks(text: string, size = 14_000): string[] {
  const out: string[] = [];
  let current = '';
  for (const line of text.split('\n')) {
    if (current.length + line.length > size && current) {
      out.push(current);
      current = '';
    }
    current += `${line}\n`;
  }
  if (current.trim()) out.push(current);
  return out;
}

/**
 * Vérifie qu'un extrait figure mot pour mot dans le texte et que l'année annoncée est bien celle
 * de sa ligne, ou du dernier intitulé d'année qui la précède.
 */
function verify(text: string, event: Event): string | null {
  const lines = text.split('\n');
  const needle = normalize(event.extrait);
  if (needle.length < 20) return 'extrait trop court';
  const index = lines.findIndex((line) => normalize(line).includes(needle));
  if (index === -1) return 'extrait introuvable dans la source';
  const year = String(event.annee);
  if (lines[index]!.includes(year)) return null;
  for (let i = index - 1; i >= 0; i--) {
    const heading = /^\s*(\d{4})\s*$/.exec(lines[i]!);
    if (heading) return heading[1] === year ? null : `année ${year} ≠ intitulé ${heading[1]}`;
  }
  return `année ${year} absente de la ligne`;
}

async function main() {
  loadEnv();
  const { options, rest } = parseArgs(process.argv.slice(2));
  const id = rest[0];
  const right = id ? RIGHTS[id] : undefined;
  if (!id || !right) throw new Error(`Droit attendu : ${Object.keys(RIGHTS).join(', ')}`);
  const model =
    (typeof options.modele === 'string' && options.modele) ||
    process.env.OPENAI_MODEL ||
    DEFAULT_MODEL;
  const text = await wikipediaText(right.url);
  if (!text) throw new Error(`Source illisible : ${right.url}`);

  const system = `Tu extrais des données d’une chronologie, pour une carte du monde. Ne retiens que les événements qui concernent ${right.criterion}

Pour chaque événement : « pays » = le pays actuel, en français (Empire russe → Russie, grand-duché de Finlande → Finlande, Royaume de Prusse → Allemagne). Ignore les mesures limitées à un État fédéré, une province ou une ville (New York, Californie, Bavière…), sauf si la chronologie dit qu’elles valent pour tout le pays. « annee » = l’année de l’événement. « extrait » = une phrase ou un passage d’au moins 20 caractères recopié MOT POUR MOT depuis le texte fourni, qui établit le fait. « remarque » : une précision utile en français (âge, restriction, retour en arrière), sinon null. N’invente rien : un événement sans extrait exact n’existe pas.`;

  const accepted: (Event & { source: string })[] = [];
  const rejected: (Event & { motif: string })[] = [];
  const parts = chunks(text);
  for (const [i, part] of parts.entries()) {
    process.stdout.write(`morceau ${i + 1}/${parts.length} … `);
    const { evenements } = await chatJson<{ evenements: Event[] }>({
      model,
      system,
      user: part,
      schemaName: 'evenements',
      schema: SCHEMA,
    });
    let ok = 0;
    for (const event of evenements) {
      const problem = verify(text, event);
      if (problem) rejected.push({ ...event, motif: problem });
      else {
        accepted.push({ ...event, source: right.url });
        ok++;
      }
    }
    console.log(`${ok} retenu(s), ${evenements.length - ok} rejeté(s)`);
  }

  // Par pays : première année (même partielle) et première année du droit plein.
  const byCountry = new Map<
    string,
    { first: number; full: number | null; events: typeof accepted }
  >();
  for (const event of accepted.sort((a, b) => a.annee - b.annee)) {
    const entry = byCountry.get(event.pays) ?? { first: event.annee, full: null, events: [] };
    entry.first = Math.min(entry.first, event.annee);
    if (event.niveau === 'plein' && entry.full === null) entry.full = event.annee;
    entry.events.push(event);
    byCountry.set(event.pays, entry);
  }

  const out = path.join(WORK, 'droits', `${id}.json`);
  writeJson(out, {
    droit: id,
    source: right.url,
    model,
    createdAt: new Date().toISOString(),
    pays: Object.fromEntries([...byCountry].sort((a, b) => a[1].first - b[1].first)),
    rejetes: rejected,
  });
  console.log(`\n${byCountry.size} pays, ${rejected.length} ligne(s) rejetée(s) → ${out}`);
}

await main();
