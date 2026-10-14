# Hors-Champ — site web

Site féministe de découverte culturelle et d’esprit critique : des femmes artistes et
scientifiques, leurs œuvres, leurs inventions, les droits conquis et les idées qui les relient ;
puis des **contrechamps** pour exercer son esprit critique face aux mécanismes du sexisme.

Version web de l’application mobile Hors-Champ (dépôt « décodeur du sexisme »). Contenus, modèle de
données et règles métier sont **repris à l’identique** ; seules l’interface, la navigation et la
persistance sont propres au web.

Next.js 16 (App Router, export statique) · React 19 · TypeScript strict · CSS Modules · Zustand
(localStorage). Aucun backend, aucun compte, aucun cookie, aucun traceur.

## Démarrer

```bash
npm install
npm run dev                      # http://localhost:3000
```

En développement, les **exemples de développement** (les six contrechamps actuels) sont visibles.
En production, ils sont masqués, sauf avec `NEXT_PUBLIC_INCLUDE_DEV_EXAMPLES=true`.

| Script              | Rôle                                                                    |
| ------------------- | ----------------------------------------------------------------------- |
| `npm run dev`       | Serveur de développement                                                |
| `npm run build`     | Prépare les images puis exporte le site statique dans `out/`            |
| `npm start`         | Sert `out/` localement (port 3000)                                      |
| `npm run typecheck` | Types des routes (`next typegen`) puis `tsc --noEmit`                   |
| `npm run lint`      | ESLint (`next/core-web-vitals`, TypeScript, `jsx-a11y` recommandé)      |
| `npm test`          | Vitest : logique, persistance, validation des contenus, composants      |
| `npm run test:e2e`  | Playwright : parcours et axe (Chromium, WebKit, Firefox ; 320/390/1280) |
| `npm run format`    | Prettier                                                                |
| `npm run check`     | typecheck + lint + tests unitaires                                      |

`test:e2e` construit le site avec les exemples de développement puis le sert sur le port 4321
(Python 3 requis) ; installer d’abord les navigateurs : `npx playwright install`.

## Structure

```
assets/                 Illustrations d'origine (domaine public / licences libres) et icône
scripts/build-images.mjs  Déclinaisons WebP (public/images), manifeste des tailles, favicon, OG
src/
  app/                  Routes (fichiers minces) : /, /elles, /possible, /droits, /collection,
                        /culture/[id], /contrechamps/**, /bibliotheque, /profil, /bienvenue,
                        /credits, /a-propos, sitemap.ts, robots.ts
  content/catalog.ts    Catalogue validé au build (échec explicite si un contenu est invalide)
  components/layout/    En-tête, barre d'onglets, pied de page, retour sûr, fil d'Ariane
  components/ui/        Boutons, étiquettes, pastilles, contrôle segmenté, recherche, états vides
  components/content/   Couvertures, cartes, statut éditorial, sources, signets
  features/             Logique pure reprise du mobile (*.ts) + vues web (*/web/*.tsx)
  data/                 Contenus éditoriaux (copiés du mobile)
  services/             Schéma de persistance v4 (migrations, nettoyage), stockage, dépôt
  store/                Store Zustand persistant (localStorage, synchronisé entre onglets)
  styles/               tokens.css (jetons des deux thèmes) et globals.css
  theme/                Thèmes du mobile, référence des jetons (concordance testée)
__tests__/              Tests Vitest (logique portée du mobile + composants)
e2e/                    Parcours Playwright et tests axe
```

## Principes appliqués par le code

- **Aucun fait inventé** : chaque fiche factuelle cite au moins une source (URL https, date de
  consultation, extrait ou note). Validation au build : `next build` échoue avec le fichier, la
  fiche et la règle en cause (`src/content/catalog.ts`).
- **Aucun jugement** : les réponses sont qualifiées (`solid`, `partial`, `open`, `weak`), jamais
  notées ; aucun score n'est calculé.
- **Transparence** : le statut éditorial est toujours affiché ; les exemples de développement ne
  sont jamais indexés.
- **Aucune collecte** : l’état (préférences, signets, progression) reste dans le navigateur, clé
  `hors-champ:state`. Export / import JSON depuis le Profil (un export mobile est accepté).

## Ajouter un contrechamp

1. Créer `src/data/experiences/<slug>.ts` exportant un objet typé `Experience`.
2. L’ajouter à la liste de `src/data/experiences/index.ts`.
3. `npm test` puis `npm run build` : le contenu est validé (champs, options uniques, sources,
   liens internes ; un contrechamp `verified` exige des sources et une date `reviewedAt`).

## Ajouter une fiche culturelle

1. Ajouter l’objet `CultureEntity` dans le fichier de `src/data/culture/` correspondant à son type
   (identifiant préfixé : `person-`, `work-`, `right-`…).
2. Déclarer ses liens dans **un seul sens** (`created`, `member-of`, `took-part`, `illustrates`,
   `contributed`, `enacted`, `context`) : le sens inverse est calculé.
3. Une illustration : fichier dans `assets/<dossier>/`, puis `img('<dossier>/<fichier>.jpg')`
   avec crédit, licence et lien vers la page qui l’atteste. `npm run build` régénère les
   déclinaisons.

## Déployer

`npm run build` produit un site entièrement statique dans `out/` (URL avec barre finale,
`trailingSlash`). Il se sert tel quel sur Vercel, Netlify, GitHub Pages ou tout serveur de fichiers.
Définir `NEXT_PUBLIC_SITE_URL` (ex. `https://hors-champ.fr`) pour les URL canoniques, le sitemap et
Open Graph. Activer la compression gzip/brotli côté hébergeur.

Sans exemple de développement publié, les routes de contrechamps génèrent une seule page
`/contrechamps/aucun/` (introuvable, `noindex`) : Next refuse un export statique dont
`generateStaticParams` est vide.
