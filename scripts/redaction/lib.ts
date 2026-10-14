/**
 * Atelier de rédaction : outils communs (clé, dossiers, Wikipédia, appel au modèle, contrôles).
 * Tourne uniquement en local, jamais au build ni sur le site.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

export const ROOT = path.resolve(import.meta.dirname, '../..');
/** Dossier de travail, ignoré par Git : cache des sources, propositions, page de relecture. */
export const WORK = path.join(ROOT, '.redaction');
export const PROPOSALS = path.join(WORK, 'propositions');
export const REDACTION_FILE = path.join(ROOT, 'src/content/redaction.json');

export const DEFAULT_MODEL = 'gpt-5.5';

/** Lit `.env.local` (OPENAI_API_KEY, OPENAI_MODEL) sans jamais l'afficher. */
export function loadEnv() {
  const file = path.join(ROOT, '.env.local');
  if (!existsSync(file)) return;
  for (const line of readFileSync(file, 'utf8').split('\n')) {
    const match = /^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.*)\s*$/.exec(line);
    if (match && process.env[match[1]!] === undefined) {
      process.env[match[1]!] = match[2]!.replace(/^['"]|['"]$/g, '');
    }
  }
}

export function ensureDir(dir: string) {
  mkdirSync(dir, { recursive: true });
}

export function readJson<T>(file: string, fallback: T): T {
  return existsSync(file) ? (JSON.parse(readFileSync(file, 'utf8')) as T) : fallback;
}

export function writeJson(file: string, value: unknown) {
  ensureDir(path.dirname(file));
  writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);
}

/** Options de ligne de commande : `--cle valeur`, `--drapeau`, et le reste en positionnel. */
export function parseArgs(argv: string[]) {
  const options: Record<string, string | true> = {};
  const rest: string[] = [];
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i]!;
    if (arg.startsWith('--')) {
      const next = argv[i + 1];
      if (next && !next.startsWith('--')) {
        options[arg.slice(2)] = next;
        i++;
      } else options[arg.slice(2)] = true;
    } else rest.push(arg);
  }
  return { options, rest };
}

/**
 * Texte brut complet d'un article de Wikipédia en français, mis en cache. C'est la matière des
 * articles longs : les extraits cités sur les fiches ne font qu'une phrase.
 */
export async function wikipediaText(url: string): Promise<string | null> {
  const match = /^https:\/\/fr\.wikipedia\.org\/wiki\/(.+)$/.exec(url);
  if (!match) return null;
  const title = decodeURIComponent(match[1]!);
  const cache = path.join(WORK, 'cache', `${title.replace(/[^\p{L}\p{N}_-]+/gu, '_')}.txt`);
  if (existsSync(cache)) return readFileSync(cache, 'utf8');
  const api = new URL('https://fr.wikipedia.org/w/api.php');
  api.search = new URLSearchParams({
    action: 'query',
    prop: 'extracts',
    explaintext: '1',
    redirects: '1',
    format: 'json',
    formatversion: '2',
    titles: title,
  }).toString();
  const response = await fetch(api, {
    headers: { 'User-Agent': 'HorsChamp-redaction/1.0 (outil éditorial local)' },
  });
  if (!response.ok) throw new Error(`Wikipédia ${response.status} pour « ${title} »`);
  const data = (await response.json()) as { query?: { pages?: { extract?: string }[] } };
  const text = data.query?.pages?.[0]?.extract ?? '';
  if (!text) return null;
  ensureDir(path.dirname(cache));
  writeFileSync(cache, text);
  return text;
}

/** Appel au modèle avec une sortie JSON imposée par un schéma strict. */
export async function chatJson<T>({
  model,
  system,
  user,
  schemaName,
  schema,
}: {
  model: string;
  system: string;
  user: string;
  schemaName: string;
  schema: object;
}): Promise<T> {
  const key = process.env.OPENAI_API_KEY;
  if (!key) throw new Error('OPENAI_API_KEY absente : ajoutez-la dans .env.local');
  for (let attempt = 1; ; attempt++) {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: user },
        ],
        response_format: {
          type: 'json_schema',
          json_schema: { name: schemaName, strict: true, schema },
        },
      }),
    });
    if (response.ok) {
      const data = (await response.json()) as {
        choices: { message: { content: string | null; refusal?: string | null } }[];
      };
      const message = data.choices[0]?.message;
      if (!message?.content) throw new Error(`Réponse vide (${message?.refusal ?? 'sans motif'})`);
      return JSON.parse(message.content) as T;
    }
    const retryable = response.status === 429 || response.status >= 500;
    if (!retryable || attempt >= 3) {
      throw new Error(`OpenAI ${response.status} : ${(await response.text()).slice(0, 300)}`);
    }
    await new Promise((resolve) => setTimeout(resolve, 2000 * attempt));
  }
}

/** Tics d'écriture « IA » à éviter : signalés à la relecture s'ils apparaissent. */
export const BANNED = [
  'véritable',
  'incontournable',
  'plonger',
  'plongez',
  'témoigne',
  'à l’heure où',
  'en somme',
  'force est de constater',
  'héritage durable',
  'a marqué l’histoire',
  'femme de son temps',
  'fascinant',
  'remarquable',
  'au fil des',
  'tapisserie',
  'résonne',
  '—',
];

/**
 * Contrôles automatiques d'un texte proposé : tics à éviter, et nombres (dates, chiffres) absents
 * de la matière fournie, signe possible d'un fait inventé.
 */
export function checkText(text: string, material: string): string[] {
  const alerts: string[] = [];
  const lower = text.toLowerCase();
  for (const word of BANNED) {
    if (lower.includes(word.toLowerCase())) alerts.push(`tournure à éviter : « ${word} »`);
  }
  for (const number of new Set(text.match(/\b\d{2,4}\b/g) ?? [])) {
    if (!material.includes(number)) alerts.push(`nombre absent des sources : ${number}`);
  }
  return alerts;
}
