/**
 * Valide des propositions : elles passent dans src/content/redaction.json, que le site
 * superpose aux fiches au prochain build.
 *
 *   npm run redaction:accepter -- person-lise-meitner [autre-id …]
 *   npm run redaction:accepter -- person-lise-meitner --champs accroche,article
 *   npm run redaction:accepter -- --retirer person-lise-meitner
 */
import path from 'node:path';

import type { RedactionEntry } from '@/content/redaction';

import { parseArgs, PROPOSALS, readJson, REDACTION_FILE, writeJson } from './lib';

const FIELDS = ['titre', 'accroche', 'resume', 'article'] as const;
type Field = (typeof FIELDS)[number];

interface Proposal {
  id: string;
  model: string;
  apres: {
    title: string | null;
    hook: string | null;
    summary: string;
    article: { heading?: string; text: string; sourceIds: string[] }[];
  };
}

/** « gpt-5.5 » → « GPT-5.5 », pour la mention affichée sous l'article. */
const modelLabel = (model: string) => model.replace(/^gpt/i, 'GPT');

function main() {
  const { options, rest } = parseArgs(process.argv.slice(2));
  const file = readJson<{ entities: Record<string, RedactionEntry> }>(REDACTION_FILE, {
    entities: {},
  });

  if (typeof options.retirer === 'string') {
    for (const id of [options.retirer, ...rest]) {
      delete file.entities[id];
      console.log(`Retiré : ${id}`);
    }
    writeJson(REDACTION_FILE, file);
    return;
  }

  if (rest.length === 0) throw new Error('Précisez au moins un identifiant de fiche.');
  const fields: Field[] =
    typeof options.champs === 'string'
      ? options.champs.split(',').map((f) => {
          if (!FIELDS.includes(f as Field)) throw new Error(`Champ inconnu : ${f}`);
          return f as Field;
        })
      : [...FIELDS];
  const today = new Date().toISOString().slice(0, 10);

  for (const id of rest) {
    const proposal = readJson<Proposal | null>(path.join(PROPOSALS, `${id}.json`), null);
    if (!proposal) throw new Error(`Pas de proposition pour ${id}`);
    const entry: RedactionEntry = { ...file.entities[id] };
    if (fields.includes('titre') && proposal.apres.title) entry.title = proposal.apres.title;
    if (fields.includes('accroche') && proposal.apres.hook) entry.hook = proposal.apres.hook;
    if (fields.includes('resume')) entry.summary = proposal.apres.summary;
    if (fields.includes('article') && proposal.apres.article.length > 0) {
      entry.article = {
        paragraphs: proposal.apres.article.map((p) => ({
          ...(p.heading ? { heading: p.heading } : {}),
          text: p.text,
          sourceIds: p.sourceIds,
        })),
        preparedWith: modelLabel(proposal.model),
        acceptedAt: today,
      };
    }
    file.entities[id] = entry;
    console.log(`Accepté : ${id} (${fields.join(', ')})`);
  }
  writeJson(REDACTION_FILE, file);
  console.log('\nVérifiez avec npm run build, puis committez src/content/redaction.json.');
}

main();
