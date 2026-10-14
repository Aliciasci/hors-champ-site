/**
 * Demande au modèle des propositions de réécriture, sans rien modifier sur le site.
 *
 *   npm run redaction:proposer -- --fiches person-lise-meitner,person-hubertine-auclert
 *   npm run redaction:proposer -- --type person [--limite 5]
 *   npm run redaction:proposer -- --interface
 *   Options : --format court (une description de quelques phrases au lieu d'un article),
 *   --modele gpt-5.5 (ou OPENAI_MODEL), --refaire (écrase les propositions existantes)
 *
 * Les propositions vont dans .redaction/propositions/ ; `npm run redaction:relire` les affiche.
 */
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

import { getCatalog } from '@/content/catalog';
import type { CultureEntity } from '@/types';

import {
  checkText,
  chatJson,
  DEFAULT_MODEL,
  loadEnv,
  parseArgs,
  PROPOSALS,
  wikipediaText,
  writeJson,
} from './lib';

const STYLE = `Tu es secrétaire de rédaction à Hors-Champ, un site qui raconte des femmes que l’histoire a laissées au bord du cadre. Le ton est celui d’un magazine incarné (Society, Les Jours) : des phrases nettes et concrètes, un vrai point de vue sur ce qui rend l’histoire intéressante, jamais de grandiloquence.

Interdits de style : les énumérations après deux-points, les séries de trois adjectifs ou de trois verbes, le tiret cadratin (—), les questions rhétoriques, les conclusions morales, et ces mots : véritable, incontournable, plonger, témoigner de, fascinant, remarquable, héritage durable, a marqué l’histoire, femme de son temps, au fil des, résonner. Présente une femme par ce qu’elle a fait, pas par les hommes qui l’entourent, sauf si c’est le sujet. Typographie française : apostrophe ’, guillemets « ».`;

const FACTS = `Règle absolue, c’est la charte du site : n’écris AUCUN fait absent des textes fournis. Pas de date, de chiffre, de lieu, de nom, de titre d’œuvre ni de citation qui n’y figure pas. Une citation entre guillemets doit être recopiée mot pour mot depuis les textes. En cas de doute, n’écris pas la phrase et note le point dans « doutes ».`;

const ENTITY_TASK = `Réécris la fiche fournie.

- « accroche » : une phrase de 12 mots au plus, ce qu’elle a fait ou ce qui s’est passé, tirée des EXTRAITS cités.
- « resume » : 2 ou 3 phrases, uniquement avec des faits présents dans les EXTRAITS cités (pas dans les textes complets).
- « titre » : null si le titre actuel est un nom propre (personne, œuvre, loi, organisation) ; sinon une proposition plus vivante, ou null pour le garder.
- « article » : un vrai article tiré des TEXTES COMPLETS, de 500 à 900 mots si la matière le permet, plus court sinon (jamais de remplissage). 4 à 8 paragraphes, dont 2 ou 3 commencent par un intertitre court ; « intertitre » vaut null pour les autres. Une ouverture qui accroche par un fait précis, pas par une généralité. Chaque paragraphe donne dans « sources » les identifiants des sources dont il tire ses faits (au moins une). Ne répète pas le résumé mot pour mot.
- « doutes » : ce que tu n’as pas pu vérifier, les points ambigus des textes, ou une liste vide.

${FACTS}`;

const ENTITY_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['titre', 'accroche', 'resume', 'article', 'doutes'],
  properties: {
    titre: { type: ['string', 'null'] },
    accroche: { type: 'string' },
    resume: { type: 'string' },
    article: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['intertitre', 'texte', 'sources'],
        properties: {
          intertitre: { type: ['string', 'null'] },
          texte: { type: 'string' },
          sources: { type: 'array', items: { type: 'string' } },
        },
      },
    },
    doutes: { type: 'array', items: { type: 'string' } },
  },
};

interface EntityAnswer {
  titre: string | null;
  accroche: string;
  resume: string;
  article: { intertitre: string | null; texte: string; sources: string[] }[];
  doutes: string[];
}

const SHORT_TASK = `Écris une courte description de la fiche fournie, rien de très élaboré : 3 à 5 phrases simples, 60 à 110 mots, sans intertitre. Dis qui elle est (ou ce qu’est la fiche) et ce qu’elle a fait de plus marquant, avec un ou deux faits précis tirés des textes. Pas d’effet de style, pas de conclusion. Donne dans « sources » les identifiants des sources utilisées, et dans « doutes » ce que tu n’as pas pu vérifier.

${FACTS}`;

const SHORT_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['description', 'sources', 'doutes'],
  properties: {
    description: { type: 'string' },
    sources: { type: 'array', items: { type: 'string' } },
    doutes: { type: 'array', items: { type: 'string' } },
  },
};

/** Longueur maximale d'un texte complet envoyé au modèle (caractères). */
const MAX_FULL_TEXT = 60_000;

async function proposeEntity(entity: CultureEntity, model: string, short: boolean) {
  const fullTexts: { sourceId: string; texte: string }[] = [];
  const seen = new Set<string>();
  for (const source of entity.sources) {
    if (seen.has(source.url)) continue;
    seen.add(source.url);
    const text = await wikipediaText(source.url);
    if (text) fullTexts.push({ sourceId: source.id, texte: text.slice(0, MAX_FULL_TEXT) });
  }
  const sources = entity.sources.map((source) => ({
    id: source.id,
    titre: source.title,
    editeur: source.publisher,
    extrait: source.relevantExcerpt ?? null,
    note: source.note ?? null,
  }));
  const input = {
    type: entity.kind,
    titre: entity.title,
    sousTitre: entity.subtitle ?? null,
    periode: entity.period?.label ?? null,
    accrocheActuelle: entity.hook ?? null,
    resumeActuel: entity.summary,
    sources,
    textesComplets: fullTexts,
  };
  if (short) return proposeShort(entity, model, input, fullTexts);
  const answer = await chatJson<EntityAnswer>({
    model,
    system: `${STYLE}\n\n${ENTITY_TASK}`,
    user: JSON.stringify(input, null, 1),
    schemaName: 'fiche',
    schema: ENTITY_SCHEMA,
  });

  // Contrôles : sources citées, tournures, nombres absents de la matière.
  const known = new Set(entity.sources.map((s) => s.id));
  const excerpts = [
    entity.title,
    entity.summary,
    entity.period?.label ?? '',
    ...sources.map((s) => `${s.extrait ?? ''} ${s.note ?? ''}`),
  ].join('\n');
  const material = `${excerpts}\n${fullTexts.map((t) => t.texte).join('\n')}`;
  const alerts = [
    ...checkText(answer.accroche, excerpts).map((a) => `accroche : ${a}`),
    ...checkText(answer.resume, excerpts).map((a) => `résumé : ${a}`),
    ...answer.article.flatMap((p, i) => [
      ...checkText(`${p.intertitre ?? ''} ${p.texte}`, material).map(
        (a) => `paragraphe ${i + 1} : ${a}`,
      ),
      ...p.sources
        .filter((id) => !known.has(id))
        .map((id) => `paragraphe ${i + 1} : source inconnue ${id}`),
      ...(p.sources.length === 0 ? [`paragraphe ${i + 1} : aucune source citée`] : []),
    ]),
  ];
  if (fullTexts.length === 0)
    alerts.unshift('aucun texte complet disponible : article tiré des seuls extraits');

  const words = answer.article.reduce((n, p) => n + p.texte.split(/\s+/).length, 0);
  writeJson(path.join(PROPOSALS, `${entity.id}.json`), {
    id: entity.id,
    kind: entity.kind,
    model,
    createdAt: new Date().toISOString(),
    avant: { title: entity.title, hook: entity.hook ?? null, summary: entity.summary },
    apres: {
      title: answer.titre,
      hook: answer.accroche,
      summary: answer.resume,
      article: answer.article.map((p) => ({
        heading: p.intertitre ?? undefined,
        text: p.texte,
        sourceIds: p.sources.filter((id) => known.has(id)),
      })),
    },
    mots: words,
    doutes: answer.doutes,
    alertes: alerts,
    sources: entity.sources.map((s, i) => ({ n: i + 1, id: s.id, title: s.title, url: s.url })),
  });
  return { words, alerts: alerts.length, doubts: answer.doutes.length };
}

/** Format court : une description de quelques phrases, qui remplace le résumé de la fiche. */
async function proposeShort(
  entity: CultureEntity,
  model: string,
  input: object,
  fullTexts: { texte: string }[],
) {
  const answer = await chatJson<{ description: string; sources: string[]; doutes: string[] }>({
    model,
    system: `${STYLE}\n\n${SHORT_TASK}`,
    user: JSON.stringify(input, null, 1),
    schemaName: 'description',
    schema: SHORT_SCHEMA,
  });
  const known = new Set(entity.sources.map((s) => s.id));
  const material = [
    entity.title,
    entity.summary,
    entity.period?.label ?? '',
    ...entity.sources.map((s) => `${s.relevantExcerpt ?? ''} ${s.note ?? ''}`),
    ...fullTexts.map((t) => t.texte),
  ].join('\n');
  const alerts = [
    ...checkText(answer.description, material),
    ...answer.sources.filter((id) => !known.has(id)).map((id) => `source inconnue ${id}`),
  ];
  const words = answer.description.split(/\s+/).length;
  writeJson(path.join(PROPOSALS, `${entity.id}.json`), {
    id: entity.id,
    kind: entity.kind,
    model,
    format: 'court',
    createdAt: new Date().toISOString(),
    avant: { title: entity.title, hook: entity.hook ?? null, summary: entity.summary },
    apres: { title: null, hook: null, summary: answer.description, article: [] },
    mots: words,
    doutes: answer.doutes,
    alertes: alerts,
    sources: entity.sources.map((s, i) => ({ n: i + 1, id: s.id, title: s.title, url: s.url })),
  });
  return { words, alerts: alerts.length, doubts: answer.doutes.length };
}

const INTERFACE_TASK = `On te donne des textes d’interface du site (menu, titres de rubriques, lignes d’accent, chapôs) avec leurs contraintes. Pour chacun, propose 3 variantes dans le ton du site, en respectant la contrainte de longueur. Un libellé de menu doit rester immédiatement compréhensible. N’invente aucun fait : un chapô ne contient que des informations présentes dans le texte actuel ou dans le contexte donné.`;

const INTERFACE_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['textes'],
  properties: {
    textes: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['id', 'propositions', 'commentaire'],
        properties: {
          id: { type: 'string' },
          propositions: { type: 'array', items: { type: 'string' } },
          commentaire: { type: 'string' },
        },
      },
    },
  },
};

async function proposeInterface(model: string) {
  const items = JSON.parse(
    readFileSync(path.join(import.meta.dirname, 'interface.json'), 'utf8'),
  ) as { id: string; ou: string; actuel: string; contrainte: string }[];
  const answer = await chatJson<{
    textes: { id: string; propositions: string[]; commentaire: string }[];
  }>({
    model,
    system: `${STYLE}\n\n${INTERFACE_TASK}`,
    user: JSON.stringify(items, null, 1),
    schemaName: 'interface',
    schema: INTERFACE_SCHEMA,
  });
  writeJson(path.join(PROPOSALS, '_interface.json'), {
    model,
    createdAt: new Date().toISOString(),
    textes: items.map((item) => {
      const found = answer.textes.find((t) => t.id === item.id);
      return {
        ...item,
        propositions: found?.propositions ?? [],
        commentaire: found?.commentaire ?? '',
        alertes: (found?.propositions ?? []).flatMap((p) =>
          checkText(p, `${item.actuel} ${item.contrainte}`).map((a) => `« ${p} » : ${a}`),
        ),
      };
    }),
  });
  console.log(`Interface : ${items.length} textes, propositions écrites.`);
}

async function main() {
  loadEnv();
  const { options } = parseArgs(process.argv.slice(2));
  const model =
    (typeof options.modele === 'string' && options.modele) ||
    process.env.OPENAI_MODEL ||
    DEFAULT_MODEL;

  if (options.interface) {
    await proposeInterface(model);
    return;
  }

  const { culture } = getCatalog();
  let targets: CultureEntity[];
  if (typeof options.fiches === 'string') {
    const ids = options.fiches.split(',').map((id) => id.trim());
    const unknown = ids.filter((id) => !culture.some((e) => e.id === id));
    if (unknown.length) throw new Error(`Fiches inconnues : ${unknown.join(', ')}`);
    targets = culture.filter((e) => ids.includes(e.id));
  } else if (typeof options.type === 'string') {
    targets = culture.filter((e) => e.kind === options.type);
  } else {
    throw new Error('Précisez --fiches id1,id2, --type person ou --interface');
  }
  if (!options.refaire) {
    targets = targets.filter((e) => !existsSync(path.join(PROPOSALS, `${e.id}.json`)));
  }
  if (typeof options.limite === 'string') targets = targets.slice(0, Number(options.limite));
  if (targets.length === 0) {
    console.log('Rien à faire (propositions déjà présentes ? ajoutez --refaire).');
    return;
  }

  console.log(`${targets.length} fiche(s), modèle ${model}.`);
  let failures = 0;
  for (const entity of targets) {
    process.stdout.write(`• ${entity.id} … `);
    try {
      const result = await proposeEntity(entity, model, options.format === 'court');
      console.log(`${result.words} mots, ${result.alerts} alerte(s), ${result.doubts} doute(s)`);
    } catch (error) {
      failures++;
      console.log(`échec : ${(error as Error).message}`);
    }
  }
  console.log(`\nRelisez avec : npm run redaction:relire`);
  if (failures) process.exitCode = 1;
}

await main();
