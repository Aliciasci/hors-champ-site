/**
 * Page de relecture des propositions : avant / après, article complet, alertes et doutes.
 *
 *   npm run redaction:relire
 *
 * Écrit .redaction/relecture.html et l'ouvre dans le navigateur (macOS).
 */
import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';

import { ensureDir, PROPOSALS, readJson, WORK } from './lib';

interface Proposal {
  id: string;
  kind: string;
  model: string;
  createdAt: string;
  avant: { title: string; hook: string | null; summary: string };
  apres: {
    title: string | null;
    hook: string | null;
    summary: string;
    article: { heading?: string; text: string; sourceIds: string[] }[];
  };
  mots: number;
  doutes: string[];
  alertes: string[];
  sources: { n: number; id: string; title: string; url: string }[];
}

interface InterfaceProposals {
  model: string;
  textes: {
    id: string;
    ou: string;
    actuel: string;
    contrainte: string;
    propositions: string[];
    commentaire: string;
    alertes: string[];
  }[];
}

const esc = (text: string) =>
  text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function list(title: string, items: string[], tone: 'alert' | 'doubt') {
  if (items.length === 0) return '';
  return `<div class="${tone}"><strong>${title}</strong><ul>${items.map((i) => `<li>${esc(i)}</li>`).join('')}</ul></div>`;
}

function proposalHtml(p: Proposal) {
  const number = new Map(p.sources.map((s) => [s.id, s.n]));
  const article = p.apres.article
    .map(
      (para) =>
        `${para.heading ? `<h4>${esc(para.heading)}</h4>` : ''}<p>${esc(para.text)} ${para.sourceIds
          .map((id) => `<sup>${number.get(id)}</sup>`)
          .join('')}</p>`,
    )
    .join('');
  return `<section class="fiche" id="${p.id}">
  <header><h2>${esc(p.avant.title)}</h2><code>${p.id}</code> · ${esc(p.model)} · ${p.mots} mots</header>
  ${list('Alertes automatiques (à vérifier)', p.alertes, 'alert')}
  ${list('Doutes signalés par le modèle', p.doutes, 'doubt')}
  <div class="pair">
    <div><h3>Avant</h3>
      <p class="label">Accroche</p><p>${esc(p.avant.hook ?? '—')}</p>
      <p class="label">Résumé</p><p>${esc(p.avant.summary)}</p></div>
    <div><h3>Après</h3>
      ${p.apres.title ? `<p class="label">Titre</p><p>${esc(p.apres.title)}</p>` : ''}
      ${p.apres.hook ? `<p class="label">Accroche</p><p>${esc(p.apres.hook)}</p>` : '<p class="label">Accroche</p><p><em>inchangée</em></p>'}
      <p class="label">${p.apres.article.length ? 'Résumé' : 'Description'}</p><p>${esc(p.apres.summary)}</p></div>
  </div>
  ${article ? `<h3>Article proposé</h3>\n  <div class="article">${article}</div>` : ''}
  <p class="label">Sources</p>
  <ol class="sources">${p.sources.map((s) => `<li><a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.title)}</a> <code>${s.id}</code></li>`).join('')}</ol>
  <p class="accept">Tout garder : <code>npm run redaction:accepter -- ${p.id}</code><br>
  Une partie : <code>npm run redaction:accepter -- ${p.id} --champs ${p.apres.article.length ? `accroche,resume,article${p.apres.title ? ',titre' : ''}` : 'resume'}</code></p>
</section>`;
}

function interfaceHtml(ui: InterfaceProposals) {
  return `<section class="fiche" id="interface"><header><h2>Interface : menu et titres</h2>${esc(ui.model)}</header>
  <table><thead><tr><th>Où</th><th>Actuel</th><th>Propositions</th></tr></thead><tbody>
  ${ui.textes
    .map(
      (
        t,
      ) => `<tr><td><code>${t.id}</code><br><small>${esc(t.ou)}<br><em>${esc(t.contrainte)}</em></small></td>
      <td>${esc(t.actuel)}</td>
      <td><ol>${t.propositions.map((p) => `<li>${esc(p)}</li>`).join('')}</ol><small>${esc(t.commentaire)}</small>${list('Alertes', t.alertes, 'alert')}</td></tr>`,
    )
    .join('')}
  </tbody></table>
  <p class="accept">Pour appliquer un choix, dites-le à Claude (ex. « menu.elles : 2 ») : ces textes sont dans le code.</p>
</section>`;
}

function main() {
  const files = existsSync(PROPOSALS)
    ? readdirSync(PROPOSALS).filter((f) => f.endsWith('.json'))
    : [];
  if (files.length === 0) {
    console.log('Aucune proposition. Lancez d’abord : npm run redaction:proposer -- …');
    return;
  }
  const fiches = files
    .filter((f) => !f.startsWith('_'))
    .map((f) => readJson<Proposal>(path.join(PROPOSALS, f), null as never))
    .sort((a, b) => a.id.localeCompare(b.id));
  const ui = files.includes('_interface.json')
    ? readJson<InterfaceProposals>(path.join(PROPOSALS, '_interface.json'), null as never)
    : null;

  const html = `<!doctype html><html lang="fr"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Relecture — Hors-Champ</title>
<style>
:root{--bg:#f3eee5;--text:#15130f;--muted:#5e584d;--line:#d3c9b6;--primary:#1e3aa8;--alert:#a12f16}
body{margin:0;background:var(--bg);color:var(--text);font:16px/1.55 Georgia,serif}
main{max-width:1100px;margin:0 auto;padding:32px 16px 96px}
h1{font-size:40px;margin:0 0 8px}nav a{color:var(--primary);margin-right:12px}
.fiche{border-top:2px solid var(--text);margin-top:48px;padding-top:16px}
header{color:var(--muted);font:14px system-ui,sans-serif}header h2{color:var(--text);font:600 30px Georgia,serif;margin:0 0 4px}
.pair{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:24px;margin:16px 0}
.pair>div{background:#fbf8f2;border:1px solid var(--line);padding:16px}
h3{font:600 13px system-ui,sans-serif;text-transform:uppercase;letter-spacing:1px;color:var(--muted)}
.label{font:600 12px system-ui,sans-serif;color:var(--muted);margin:12px 0 2px;text-transform:uppercase;letter-spacing:.5px}
.article{max-width:680px;font-size:19px;line-height:1.65}.article h4{font-size:22px;margin:28px 0 4px}
sup{color:var(--primary);font:600 11px system-ui,sans-serif}
.alert,.doubt{font:14px system-ui,sans-serif;padding:8px 12px;margin:12px 0;border-left:4px solid var(--alert);background:#f2ddd5}
.doubt{border-color:#b07a00;background:#f5ead0}.alert ul,.doubt ul{margin:4px 0 0;padding-left:18px}
.sources{font:14px system-ui,sans-serif}.sources a{color:var(--primary)}
.accept{font:14px system-ui,sans-serif;background:#e9e2d5;padding:12px}code{font-size:13px}
table{border-collapse:collapse;width:100%;font:14px system-ui,sans-serif}td,th{border-bottom:1px solid var(--line);padding:10px;vertical-align:top;text-align:left}
</style></head><body><main>
<h1>Relecture des propositions</h1>
<p>Rien n’est publié tant que vous n’avez pas accepté. Vérifiez chaque fait contre les sources.</p>
<nav>${ui ? '<a href="#interface">Interface</a>' : ''}${fiches.map((p) => `<a href="#${p.id}">${esc(p.avant.title)}</a>`).join('')}</nav>
${ui ? interfaceHtml(ui) : ''}
${fiches.map(proposalHtml).join('\n')}
</main></body></html>`;

  ensureDir(WORK);
  const out = path.join(WORK, 'relecture.html');
  writeFileSync(out, html);
  console.log(`Page de relecture : ${out}`);
  if (process.platform === 'darwin' && !process.argv.includes('--sans-ouvrir')) {
    execFileSync('open', [out]);
  }
}

main();
