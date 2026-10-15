/**
 * Page « Féminicides » : les chiffres, les ressources et leurs sources.
 *
 * Règles de cette page, à garder en tête à chaque mise à jour :
 * - chaque chiffre porte une année, une définition, un périmètre et une source qu'on peut ouvrir ;
 * - une estimation est dite estimation ; un décompte de police n'est pas un décompte exhaustif ;
 * - aucun nom, aucune date, aucune citation de victime n'est inventé ;
 * - les coordonnées d'aide sont vérifiées pour la France, et revérifiées avant chaque publication.
 */

/** Date de la dernière vérification de l'ensemble de la page (chiffres et coordonnées). */
export const FEMICIDES_CHECKED_AT = '2026-10-15';

export interface FemicideSource {
  label: string;
  publisher: string;
  /** Date de publication, telle qu'annoncée. */
  date: string;
  url: string;
}

export interface FemicideFigure {
  /** Le nombre, tel que publié. */
  value: string;
  /** Ce qu'il compte, en une phrase. */
  label: string;
  year: number;
  /** Définition retenue par la source. */
  definition: string;
  /** Périmètre géographique. */
  scope: string;
  /** Ce que le chiffre ne dit pas. */
  caveat: string;
  sources: FemicideSource[];
}

const INTERIEUR_2025: FemicideSource = {
  label: 'Étude nationale sur les morts violentes au sein du couple, année 2025',
  publisher: 'Ministère de l’Intérieur, Délégation aux victimes (chiffres relayés par l’AFP)',
  date: '14 octobre 2026',
  url: 'https://www.ici.fr/infos/societe/violences-conjugales-111-femmes-tuees-en-2025-par-leur-conjoint-ou-ex-conjoint-en-hausse-de-4-sur-un-an-9509573',
};

const INTERIEUR_2024: FemicideSource = {
  label: 'Étude nationale sur les morts violentes au sein du couple en 2024',
  publisher: 'Ministère de l’Intérieur',
  date: '31 octobre 2025',
  url: 'https://www.interieur.gouv.fr/documentation/etudes-et-statistiques/etude-nationale-sur-morts-violentes-au-sein-du-couple-en-2024.html-0',
};

const INTERIEUR_2024_AFP: FemicideSource = {
  label: 'Violences conjugales : 107 femmes tuées en 2024, en hausse de 11 % en un an',
  publisher: 'Maire-info, d’après l’AFP et l’étude nationale du ministère de l’Intérieur',
  date: '31 octobre 2025',
  url: 'https://www.maire-info.com/violences-faites-aux-femmes/violences-conjugales-107-femmes-tuees-en-2024-en-hausse-de-11-en-un-an-article-30156',
};

const ONU_2024: FemicideSource = {
  label: 'Femicides in 2024: Global estimates of intimate partner/family member femicides',
  publisher: 'ONUDC et ONU Femmes',
  date: 'novembre 2025',
  url: 'https://www.unwomen.org/en/digital-library/publications/2025/11/femicides-in-2024-global-estimates-of-intimate-partner-family-member-femicides',
};

const ONU_2024_PRESS: FemicideSource = {
  label: 'Every day, 137 women and girls are killed by intimate partners or family members',
  publisher: 'ONU Femmes, communiqué',
  date: '24 novembre 2025',
  url: 'https://www.unwomen.org/en/news-stories/press-release/2025/11/every-day-137-women-and-girls-are-killed-by-intimate-partners-or-family-members',
};

const SERVICE_PUBLIC: FemicideSource = {
  label: 'Violences conjugales',
  publisher: 'Service-Public.gouv.fr (Direction de l’information légale et administrative)',
  date: 'page vérifiée le 1ᵉʳ avril 2026',
  url: 'https://www.service-public.gouv.fr/particuliers/vosdroits/F12544',
};

const UNODC_FRAMEWORK: FemicideSource = {
  label:
    'Statistical framework for measuring the gender-related killing of women and girls (femicide/feminicide)',
  publisher: 'ONUDC et ONU Femmes, adopté par la Commission de statistique de l’ONU',
  date: 'mars 2022',
  url: 'https://www.unodc.org/unodc/data-and-analysis/statistics/crime/femicide-framework.html',
};

/** Le chiffre de l'acte II : la France, l'année la plus récente publiée. */
export const FIGURE_FRANCE: FemicideFigure = {
  value: '111',
  label: 'femmes tuées par leur conjoint ou ex-conjoint en France',
  year: 2025,
  definition:
    'Morts violentes au sein du couple enregistrées par la police et la gendarmerie : la victime est tuée par son partenaire ou un ancien partenaire (mariage, Pacs, concubinage).',
  scope: 'France',
  caveat:
    'Un décompte des faits connus des forces de l’ordre, pas de tous les meurtres de femmes. Il ne compte ni les femmes tuées par un autre membre de la famille, ni les suicides consécutifs aux violences.',
  sources: [INTERIEUR_2025],
};

/** Le chiffre mondial : une estimation, présentée comme telle. */
export const FIGURE_WORLD: FemicideFigure = {
  value: '50 000',
  label:
    'femmes et filles tuées dans le monde par un partenaire intime ou un membre de leur famille, selon une estimation',
  year: 2024,
  definition:
    'Meurtres intentionnels de femmes et de filles commis par un partenaire intime ou un autre membre de la famille. Ils représentent environ 60 % des 83 000 femmes et filles tuées intentionnellement cette année-là.',
  scope: 'Monde',
  caveat:
    'Une estimation : beaucoup de pays ne transmettent pas de données. L’écart avec 2023 (51 100) ne traduit pas une baisse réelle, préviennent les auteurs, mais surtout des différences de données disponibles.',
  sources: [ONU_2024, ONU_2024_PRESS],
};

/** Quelques constats de l'étude française, avec leur année. */
export const FRANCE_FACTS: { text: string; year: number; source: FemicideSource }[] = [
  {
    text: '136 morts violentes au sein du couple ont été enregistrées, dont 111 femmes et 25 hommes. En moyenne, un décès tous les trois jours.',
    year: 2025,
    source: INTERIEUR_2025,
  },
  {
    text: '435 tentatives d’homicide au sein du couple ont aussi été recensées.',
    year: 2025,
    source: INTERIEUR_2025,
  },
  {
    text: '37 % des femmes tuées avaient déjà subi des violences. Parmi elles, 61 % les avaient signalées à la police ou à la gendarmerie, et 88 % de celles-ci avaient porté plainte.',
    year: 2025,
    source: INTERIEUR_2025,
  },
  {
    text: '16 % des faits ont eu lieu dans le contexte d’une séparation que l’auteur n’acceptait pas.',
    year: 2024,
    source: INTERIEUR_2024,
  },
];

/** Ce que disent les chiffres des protections en place au moment des faits. */
export const PROTECTION_FACT = {
  text: 'Sur les 107 femmes tuées par leur conjoint ou ex-conjoint cette année-là, une seule disposait d’un téléphone grave danger, et deux d’une ordonnance de protection.',
  year: 2024,
  source: INTERIEUR_2024_AFP,
};

/** Les formes de féminicide, d'après le cadre statistique des Nations unies. */
export const FORMS: { title: string; text: string }[] = [
  {
    title: 'Par un partenaire ou un ex-partenaire',
    text: 'Le meurtre d’une femme par son conjoint, son compagnon ou un ancien partenaire. C’est ce que compte l’étude française.',
  },
  {
    title: 'Par un membre de la famille',
    text: 'Un père, un frère, un fils, un autre parent. Les estimations mondiales réunissent ces meurtres et ceux commis par un partenaire : ce sont les féminicides de la sphère privée.',
  },
  {
    title: 'Par d’autres auteurs, lorsque le mobile est lié au genre',
    text: 'Le cadre des Nations unies inclut aussi des meurtres commis hors de la famille, quand des éléments montrent qu’ils sont liés au fait que la victime est une femme. Ce sont les plus difficiles à mesurer : leur nombre reste inconnu.',
  },
];

/** Les formes de violences conjugales, telles que les décrit Service-Public. */
export const VIOLENCE_FORMS: { title: string; text: string }[] = [
  {
    title: 'Physiques',
    text: 'Des gestes violents dans le but de blesser : gifles, coups, cheveux tirés, bousculades.',
  },
  {
    title: 'Psychologiques',
    text: 'Des paroles et des actes qui visent à rabaisser, dénigrer, menacer.',
  },
  {
    title: 'Sexuelles',
    text: 'Viol, agression sexuelle, harcèlement sexuel, y compris au sein du couple.',
  },
  {
    title: 'Économiques',
    text: 'Priver l’autre de son autonomie financière : contrôler l’argent du foyer, mettre ses biens en danger.',
  },
];

/** Ce que la loi prévoit pour protéger, d'après Service-Public. */
export const PROTECTIONS: { title: string; text: string }[] = [
  {
    title: 'L’ordonnance de protection',
    text: 'Décidée en urgence par le juge aux affaires familiales, même sans plainte. Elle peut interdire à l’auteur de s’approcher du domicile ou du travail de la victime.',
  },
  {
    title: 'Le téléphone grave danger',
    text: 'Un téléphone géolocalisé qui permet d’alerter les forces de l’ordre en cas de danger grave.',
  },
  {
    title: 'Le bracelet anti-rapprochement',
    text: 'Un dispositif électronique qui géolocalise l’auteur et la victime, pour tenir l’auteur à distance.',
  },
  {
    title: 'L’hébergement d’urgence',
    text: 'Les violences peuvent justifier de quitter le domicile. Le 115 (Samu social) est gratuit et répond jour et nuit.',
  },
];

export interface HelpResource {
  name: string;
  /** Ce que l'on compose ou ouvre. */
  contact: string;
  href: string;
  text: string;
}

/** Les ressources d'aide en France, vérifiées sur Service-Public. */
export const HELP: HelpResource[] = [
  {
    name: 'En cas de danger immédiat',
    contact: '17',
    href: 'tel:17',
    text: 'Police-secours. Le 112 est le numéro d’urgence européen.',
  },
  {
    name: 'Si vous ne pouvez pas parler',
    contact: '114 par SMS',
    href: 'sms:114',
    text: 'Gratuit, 24 heures sur 24 et 7 jours sur 7.',
  },
  {
    name: 'Violences Femmes Info',
    contact: '3919',
    href: 'tel:3919',
    text: 'Écoute, information et orientation. Gratuit et anonyme, 24 heures sur 24 et 7 jours sur 7. Ce n’est pas un numéro d’urgence.',
  },
  {
    name: 'Signaler en ligne',
    contact: 'Tchat avec la police ou la gendarmerie',
    href: 'https://www.service-public.gouv.fr/particuliers/vosdroits/R50511',
    text: 'Un tchat gratuit pour signaler des violences conjugales.',
  },
];

export const HELP_SOURCE = SERVICE_PUBLIC;

export interface Organisation {
  name: string;
  href: string;
  text: string;
}

/** Des organisations qui agissent en France. */
export const ORGANISATIONS: Organisation[] = [
  {
    name: 'Fédération nationale Solidarité Femmes',
    href: 'https://www.solidaritefemmes.org/',
    text: 'Un réseau d’associations spécialisées dans l’accompagnement des femmes victimes de violences. Elle gère le 3919.',
  },
  {
    name: 'France Victimes',
    href: 'https://www.france-victimes.fr/',
    text: 'La fédération des associations d’aide aux victimes. Elle répond au 116 006, numéro national d’aide aux victimes, gratuit.',
  },
  {
    name: 'Fondation des femmes',
    href: 'https://fondationdesfemmes.org/',
    text: 'Grâce aux dons, elle soutient financièrement, juridiquement et matériellement des associations de terrain partout en France.',
  },
  {
    name: 'Arrêtons les violences',
    href: 'https://arretonslesviolences.gouv.fr/',
    text: 'Le site du gouvernement pour trouver, près de chez soi, une association qui accompagne les victimes.',
  },
];

/** Toutes les sources de la page, dans l'ordre où elles servent. */
export const FEMICIDE_SOURCES: FemicideSource[] = [
  INTERIEUR_2025,
  INTERIEUR_2024,
  INTERIEUR_2024_AFP,
  ONU_2024,
  ONU_2024_PRESS,
  UNODC_FRAMEWORK,
  SERVICE_PUBLIC,
];

/** Source des formes de féminicide (cadre statistique des Nations unies). */
export const FORMS_SOURCE = UNODC_FRAMEWORK;
