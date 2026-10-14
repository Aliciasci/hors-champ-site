import Link from 'next/link';

import { STATUS_DESCRIPTIONS } from '@/components/content/EditorialNotice';
import { Container } from '@/components/ui/Container';
import { EDITORIAL_STATUSES } from '@/constants/enums';
import { EDITORIAL_STATUS_LABELS } from '@/constants/labels';
import { getCatalog } from '@/content/catalog';
import { pageMetadata } from '@/lib/seo';
import { PageMasthead } from '@/components/layout/PageMasthead';

import styles from './a-propos.module.css';

export const metadata = pageMetadata({
  title: 'Qui sommes-nous',
  description:
    'Comment Hors-Champ choisit ses portraits, vérifie ses sources et traite vos données. Notre charte, sans détour.',
  path: '/a-propos',
});

const PRINCIPLES = [
  {
    title: 'On n’invente rien',
    text: 'Chaque fait avancé dans une fiche renvoie à une source, citée mot pour mot. Si on ne peut pas le prouver, on ne l’écrit pas.',
  },
  {
    title: 'On ne vous note pas',
    text: 'Dans les contrechamps, on discute un raisonnement, pas la personne qui le tient. Il n’y a ni score ni « mauvaise réponse ».',
  },
  {
    title: 'On dit où on en est',
    text: 'Chaque contenu affiche son statut éditorial. Un texte encore en relecture le dit clairement.',
  },
  {
    title: 'Des images qu’on a le droit de montrer',
    text: 'Toutes les œuvres et photos sont dans le domaine public ou sous licence libre. Chacune est créditée, avec un lien vers la page qui le prouve.',
  },
  {
    title: 'On ne sait rien de vous',
    text: 'Le site n’a ni compte, ni cookie, ni outil de mesure d’audience. Ce que vous lisez et enregistrez reste dans votre navigateur.',
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
      <PageMasthead
        kicker="Qui sommes-nous"
        title="Notre charte."
        accent="Noir sur blanc."
        dek="Hors-Champ raconte des femmes que les manuels ont oubliées. Des peintres, des mathématiciennes, des militantes, et les droits qu’elles ont fini par obtenir. À côté, des contrechamps vous mettent face à des situations ordinaires pour apprendre à y repérer le sexisme. Sans caricature, et en disant aussi ce qu’on ne peut pas conclure."
      />

      <section className={styles.section} aria-labelledby="principes">
        <h2 id="principes" className="t-title2">
          Cinq engagements
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
          Où en est chaque texte
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
          Un contenu « Vérifié » porte la date de sa dernière relecture. Les exemples de
          développement ne sont jamais publiés en ligne, ni indexés par les moteurs de recherche.
        </p>
      </section>

      <section className={styles.section} aria-labelledby="methode">
        <h2 id="methode" className="t-title2">
          Comment on vérifie
        </h2>
        <ul className={styles.list}>
          <li>
            Chaque fiche cite au moins une source. Pour chacune, on garde l’adresse, la date de
            consultation et l’extrait exact sur lequel on s’appuie.
          </li>
          <li>
            Les résumés ne disent rien que les extraits ne disent déjà. Les dates sont recoupées
            avec Wikidata.
          </li>
          <li>
            Une femme n’est associée à un droit que si une source décrit son rôle. Une victoire
            collective n’est jamais attribuée à une seule personne.
          </li>
          <li>
            Dans les pages pour les plus jeunes, on ne parle des obstacles et des soutiens d’une
            femme que s’ils sont documentés. Les activités mettent en scène des situations
            inventées, et le disent.
          </li>
          <li>
            Ces règles sont vérifiées automatiquement. S’il manque une source, si un lien est cassé
            ou si une fiche est en double, le site ne se publie pas.
          </li>
        </ul>
        <p className="t-body-sm c-2">
          À ce jour, {culture.length} fiches, {youthItems.length} contenus jeunesse et {sourceCount}{' '}
          extraits de sources. L’origine de chaque image est indiquée dans les{' '}
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
          Rien ne quitte votre ordinateur. Vos préférences, vos signets et votre progression sont
          enregistrés dans votre navigateur, et nulle part ailleurs. Vous pouvez les exporter, les
          importer ou les effacer depuis votre{' '}
          <Link href="/profil#donnees" className="link">
            profil
          </Link>
          .
        </p>
      </section>
    </Container>
  );
}
