import Link from 'next/link';

import { STATUS_DESCRIPTIONS } from '@/components/content/EditorialNotice';
import { Container } from '@/components/ui/Container';
import { EDITORIAL_STATUSES } from '@/constants/enums';
import { EDITORIAL_STATUS_LABELS } from '@/constants/labels';
import { getCatalog } from '@/content/catalog';
import { pageMetadata } from '@/lib/seo';

import styles from './a-propos.module.css';

export const metadata = pageMetadata({
  title: 'À propos et principes éditoriaux',
  description:
    'Aucun fait inventé, aucun jugement moral, transparence éditoriale, images libres de droits, aucune collecte : les principes de Hors-Champ.',
  path: '/a-propos',
});

const PRINCIPLES = [
  {
    title: 'Aucun fait inventé',
    text: 'Chaque affirmation factuelle d’une fiche est appuyée par une source citée mot pour mot. Pas de fausse statistique, de fausse citation ni de fausse étude.',
  },
  {
    title: 'Aucun jugement moral',
    text: 'On évalue un raisonnement, jamais la personne. Aucune note, aucun score, jamais de « mauvaise réponse ».',
  },
  {
    title: 'Transparence éditoriale',
    text: 'Chaque contenu affiche son statut. Un exemple ne passe jamais pour une analyse documentée.',
  },
  {
    title: 'Images libres de droits uniquement',
    text: 'Œuvres et photographies du domaine public ou sous licence libre, créditées, avec un lien vers la page qui atteste la licence.',
  },
  {
    title: 'Aucune collecte',
    text: 'Pas de compte, pas de serveur, pas de mesure d’audience, pas de cookie, pas de traceur. Vos découvertes et votre progression restent dans ce navigateur.',
  },
];

export default function AboutPage() {
  const { culture, experiences, youthItems } = getCatalog();
  const sourceCount = new Set([
    ...culture.flatMap((e) => e.sources.map((s) => s.url + (s.relevantExcerpt ?? ''))),
    ...youthItems.flatMap((i) => i.sources.map((s) => s.url + (s.relevantExcerpt ?? ''))),
    ...experiences.flatMap((e) => e.sources.map((s) => s.url + (s.relevantExcerpt ?? ''))),
  ]).size;

  return (
    <Container width="reading">
      <header className={styles.header}>
        <p className="t-overline c-accent">À propos</p>
        <h1 className="t-title1">Ce que l’on s’engage à faire, et à ne pas faire.</h1>
        <p className="t-body-lg c-2">
          Hors-Champ fait découvrir des femmes artistes et scientifiques, leurs œuvres, leurs
          inventions, les événements, les droits conquis et les idées qui les relient. Puis des
          contrechamps mettent à l’épreuve l’esprit critique face aux mécanismes du sexisme, avec la
          nuance : ce que l’on peut conclure, et ce que l’on ne peut pas.
        </p>
      </header>

      <section className={styles.section} aria-labelledby="principes">
        <h2 id="principes" className="t-title2">
          Principes non négociables
        </h2>
        <ol className={styles.principles}>
          {PRINCIPLES.map((principle, index) => (
            <li key={principle.title} className={styles.principle}>
              <span className={`t-mono c-accent ${styles.number}`} aria-hidden="true">
                N° {String(index + 1).padStart(2, '0')}
              </span>
              <div className={styles.principleText}>
                <h3 className="t-title3">{principle.title}</h3>
                <p className="t-body c-2">{principle.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className={styles.section} aria-labelledby="statuts">
        <h2 id="statuts" className="t-title2">
          Les statuts éditoriaux
        </h2>
        <dl className={styles.statuses}>
          {EDITORIAL_STATUSES.map((status) => (
            <div key={status} className={styles.status}>
              <dt className="t-label">{EDITORIAL_STATUS_LABELS[status]}</dt>
              <dd className="t-body c-2">{STATUS_DESCRIPTIONS[status]}</dd>
            </div>
          ))}
        </dl>
        <p className="t-body-sm c-2">
          Un contenu « Vérifié » porte la date de sa relecture. Les exemples de développement ne
          sont pas publiés sur le site en production, et ne sont jamais indexés par les moteurs de
          recherche.
        </p>
      </section>

      <section className={styles.section} aria-labelledby="methode">
        <h2 id="methode" className="t-title2">
          Méthode de sourçage
        </h2>
        <ul className={styles.list}>
          <li>
            Chaque fiche factuelle cite au moins une source ; chaque source a une adresse https, une
            date de consultation et un extrait cité mot pour mot ou une note.
          </li>
          <li>
            Les résumés reprennent des faits présents dans les extraits cités ; les dates sont
            recoupées avec Wikidata.
          </li>
          <li>
            Une femme n’est reliée à une conquête de droit que si une source décrit son rôle ;
            aucune conquête collective n’est présentée comme l’œuvre d’une seule personne.
          </li>
          <li>
            Pour les plus jeunes, difficultés et aides ne sont mentionnées que si elles sont
            documentées ; les situations des activités sont des exemples pédagogiques, signalés
            comme tels.
          </li>
          <li>
            Le site refuse de se construire si un contenu enfreint ces règles (source manquante,
            lien cassé, doublon).
          </li>
        </ul>
        <p className="t-body-sm c-2">
          {culture.length} fiches, {youthItems.length} éléments jeunesse et {sourceCount} extraits
          ou notes de sources à ce jour. Les illustrations sont détaillées dans les{' '}
          <Link href="/credits" className="link">
            crédits
          </Link>
          .
        </p>
      </section>

      <section className={styles.section} aria-labelledby="donnees">
        <h2 id="donnees" className="t-title2">
          Vos données
        </h2>
        <p className="t-body c-2">
          Le site n’envoie rien : pas de compte, pas de cookie, pas de mesure d’audience.
          Préférences, signets et progression sont enregistrés dans le stockage local de votre
          navigateur. Vous pouvez les exporter, les importer ou les effacer depuis le{' '}
          <Link href="/profil#donnees" className="link">
            profil
          </Link>
          .
        </p>
      </section>
    </Container>
  );
}
