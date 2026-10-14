import type { CultureEntity } from '@/types';

import { rightsImages } from '../rightsImages';
import { wikipedia } from './sources';

/**
 * « Derrière chaque droit » : conquêtes de droits en France, femmes et organisations qui y ont
 * contribué, textes de loi et événements. Chaque contribution cite la phrase qui l'établit
 * (Wikipédia, consulté le 2026-10-12, vérifié mot pour mot). Statut `draft` : non relu.
 *
 * Règles éditoriales appliquées ici :
 * - une conquête n'est jamais présentée comme l'œuvre d'une seule femme : les étapes nomment
 *   les autres acteurs et la fiche `law` nomme l'institution qui a adopté le texte ;
 * - une femme n'est reliée à un droit que si sa source décrit son rôle ;
 * - la nature de chaque contribution est explicite (revendication, mobilisation…).
 */

// ─── Sources ────────────────────────────────────────────────────────────────

const S = {
  // Droit de vote
  vote1944: wikipedia(
    'Droit de vote des femmes',
    'Droit_de_vote_des_femmes',
    'Le 21 avril 1944, le droit de vote est accordé aux femmes en Métropole par une ordonnance (après un amendement du communiste Fernand Grenier) du Comité français de la Libération nationale, signée par Charles de Gaulle depuis Alger.',
    'ordonnance-1944',
  ),
  voteSenat: wikipedia(
    'Droit de vote des femmes',
    'Droit_de_vote_des_femmes',
    "À plusieurs reprises, de 1919 à 1940, des propositions de loi en faveur du vote des femmes sont votées par la Chambre des députés, avant que le Sénat ne les rejette, soit en repoussant indéfiniment leur examen, soit en s'y opposant par le vote.",
    'senat',
  ),
  vote1922: wikipedia(
    'Droit de vote des femmes',
    'Droit_de_vote_des_femmes',
    '21 novembre 1922 : trois ans et demi après son vote à la Chambre, la proposition est rejetée au Sénat par 156 voix contre 134',
    'senat-1922',
  ),
  vote1945: wikipedia(
    'Droit de vote des femmes',
    'Droit_de_vote_des_femmes',
    'Il est utilisé le 29 avril 1945 pour les élections municipales, puis en octobre pour les élections à l’Assemblée constituante.',
    'premier-vote',
  ),
  gougesIntro: wikipedia(
    'Olympe de Gouges',
    'Olympe_de_Gouges',
    'Olympe de Gouges, de son nom de naissance Marie Gouze, née le 7 mai 1748 à Montauban et morte guillotinée le 3 novembre 1793 à Paris, est une femme de lettres, dramaturge et femme politique française.',
  ),
  gougesDeclaration: wikipedia(
    'Olympe de Gouges',
    'Olympe_de_Gouges',
    "Rédactrice en 1791 de la Déclaration des droits de la femme et de la citoyenne, elle a laissé de nombreux écrits et pamphlets en faveur des droits civils et politiques des femmes et de l'abolition de l'esclavage des Noirs dans les colonies.",
    'declaration',
  ),
  declarationProjet: wikipedia(
    'Déclaration des droits de la femme et de la citoyenne',
    'Déclaration_des_droits_de_la_femme_et_de_la_citoyenne',
    "La Déclaration d'Olympe de Gouges ne parait qu’en cinq exemplaires en septembre 1791 et reste à l’état de projet, car elle ne provoque chez les députés que quelques sarcasmes ou de l'indifférence.",
  ),
  auclertIntro: wikipedia(
    'Hubertine Auclert',
    'Hubertine_Auclert',
    'Hubertine Auclert, née le 10 avril 1848 à Saint-Priest-en-Murat et morte le 8 avril 1914 dans le 11e arrondissement de Paris, est une journaliste, écrivaine et militante féministe française qui combat en faveur de l’éligibilité des femmes et de leur droit de vote.',
  ),
  auclertSociete: wikipedia(
    'Hubertine Auclert',
    'Hubertine_Auclert',
    'En 1876, elle fonde la société Le Droit des femmes, qui soutient le droit de vote pour les femmes et qui devient en 1883, la société Le Suffrage des femmes.',
    'societe',
  ),
  auclertCitoyenne: wikipedia(
    'Hubertine Auclert',
    'Hubertine_Auclert',
    'Le 13 février 1881, elle lance La Citoyenne, un journal qui, plaidant avec force pour la libération féminine, reçoit le soutien de l’élite du mouvement féministe',
    'citoyenne',
  ),
  brunschvicgIntro: wikipedia(
    'Cécile Brunschvicg',
    'Cécile_Brunschvicg',
    'Cécile Kahn, dite Cécile Brunschvicg, née le 19 juillet 1877 à Enghien-les-Bains (Seine-et-Oise) et morte le 5 octobre 1946 à Neuilly-sur-Seine (Seine), est une femme politique et féministe française.',
  ),
  brunschvicgUfsf: wikipedia(
    'Cécile Brunschvicg',
    'Cécile_Brunschvicg',
    "En 1910, elle devient secrétaire générale de l'UFSF puis présidente en 1924.",
    'ufsf',
  ),
  brunschvicg1936: wikipedia(
    'Cécile Brunschvicg',
    'Cécile_Brunschvicg',
    "Le PRS la propose pour participer au premier gouvernement de Léon Blum sans la consulter, et elle est nommée sous-secrétaire d'État à l'Éducation nationale en 1936.",
    'gouvernement',
  ),
  weissIntro: wikipedia(
    'Louise Weiss',
    'Louise_Weiss',
    'Louise Weiss, née le 25 janvier 1893 à Arras et morte le 26 mai 1983 à Paris, est une journaliste, femme de lettres, féministe et femme politique française',
  ),
  weiss1934: wikipedia(
    'Louise Weiss',
    'Louise_Weiss',
    "Droit de voter et d'être élue : elle entend bousculer l'inertie des élus nationaux par des méthodes radicales et fonde en 1934 l'association « Les femmes nouvelles ».",
    'femmes-nouvelles',
  ),
  ufsfCreation: wikipedia(
    'Union française pour le suffrage des femmes',
    'Union_française_pour_le_suffrage_des_femmes',
    "L'Union française pour le suffrage des femmes est créée en 1909 par Jeanne Schmahl avec l'appui de l'hebdomadaire La Française et de sa directrice Jane Misme.",
  ),
  ufsfRole: wikipedia(
    'Union française pour le suffrage des femmes',
    'Union_française_pour_le_suffrage_des_femmes',
    'Elle est la principale organisation en France réclamant le droit de vote des femmes entre 1909 et 1940.',
    'role',
  ),

  // Contraception
  neuwirth1920: wikipedia(
    'Loi Neuwirth',
    'Loi_Neuwirth',
    "Nommée d'après Lucien Neuwirth, le député gaulliste qui la proposa, cette loi vient abroger celle du 31 juillet 1920 qui interdisait non seulement toute contraception, mais jusqu'à l'information sur les moyens contraceptifs.",
  ),
  neuwirth1966: wikipedia(
    'Loi Neuwirth',
    'Loi_Neuwirth',
    'Lucien Neuwirth dépose une première fois sa proposition de loi le 18 mai 1966, jour de son anniversaire, pour marquer son respect de la naissance.',
    'proposition',
  ),
  neuwirthDecrets: wikipedia(
    'Loi Neuwirth',
    'Loi_Neuwirth',
    "Alors que la loi est promulguée le 28 décembre 1967, son application est lente, les décrets ne paraissant qu’entre 1969 et 1972 à cause de multiples freins de l'administration.",
    'decrets',
  ),
  weillHalleIntro: wikipedia(
    'Marie-Andrée Lagroua Weill-Hallé',
    'Marie-Andrée_Lagroua_Weill-Hallé',
    "Marie-Andrée Lagroua Weill-Hallé (1916-1994) est une gynécologue, fondatrice du mouvement « La maternité heureuse » en 1956 à la suite de l'affaire Bac.",
  ),
  weillHalleStatuts: wikipedia(
    'Marie-Andrée Lagroua Weill-Hallé',
    'Marie-Andrée_Lagroua_Weill-Hallé',
    "En 1956, Marie-Andrée Lagroua Weill-Hallé dépose, avec la sociologue Évelyne Sullerot, les statuts de l'association Maternité Heureuse",
    'statuts',
  ),
  planningCreation: wikipedia(
    'Mouvement français pour le Planning familial',
    'Mouvement_français_pour_le_planning_familial',
    'Elle a été créée en 1956 sous le nom de "Maternité heureuse".',
  ),
  planningRelais: wikipedia(
    'Mouvement français pour le Planning familial',
    'Mouvement_français_pour_le_planning_familial',
    "Le Mouvement français pour le planning familial, prend en 1960 le relais de la « Maternité heureuse », poursuivant son œuvre d'information incluant le conseil familial et sexuel",
    'relais',
  ),
  planningNeuwirth: wikipedia(
    'Mouvement français pour le Planning familial',
    'Mouvement_français_pour_le_planning_familial',
    "En décembre 1967, l'Assemblée nationale vote la loi Neuwirth, qui autorise la fabrication et la délivrance de contraceptifs sur ordonnance.",
    'neuwirth',
  ),

  // IVG
  veilLoi: wikipedia(
    'Loi Veil',
    'Loi_Veil',
    "La loi Veil dépénalise pour une durée de cinq ans l'« interruption volontaire de grossesse pratiquée avant la fin de la dixième semaine »",
  ),
  veilPromulgation: wikipedia(
    'Loi Veil',
    'Loi_Veil',
    'La loi est promulguée le 17 janvier 1975, pour 5 ans à titre expérimental.',
    'promulgation',
  ),
  veilDiscours: wikipedia(
    'Loi Veil',
    'Loi_Veil',
    "Elle présente ce projet devant l'Assemblée nationale le 26 novembre 1974",
    'discours',
  ),
  veilVote: wikipedia(
    'Loi Veil',
    'Loi_Veil',
    "Après quelque vingt-cinq heures de débats animés par 74 orateurs, la loi est finalement adoptée par l'Assemblée le 29 novembre 1974 à 3 h 40 du matin par 284 voix contre 189, grâce à la quasi-totalité des votes des députés des partis de la gauche et du centre, et malgré l'opposition de la majeure partie - mais pas de la totalité - des députés de la droite",
    'vote',
  ),
  veilReconduite: wikipedia(
    'Loi Veil',
    'Loi_Veil',
    'Elle est reconduite sans limite de temps par la loi n°79-1204 du 31 décembre 1979.',
    'reconduite',
  ),
  simoneVeilIntro: wikipedia(
    'Simone Veil',
    'Simone_Veil',
    "Simone Veil (/simɔn vɛj/ ), née Jacob le 13 juillet 1927 à Nice (Alpes-Maritimes) et morte le 30 juin 2017 à Paris 7e, est une magistrate et femme d'État française.",
  ),
  simoneVeilMinistre: wikipedia(
    'Simone Veil',
    'Simone_Veil',
    "En 1974, elle est nommée ministre de la Santé par le président Valéry Giscard d'Estaing, qui la charge de faire adopter la loi dépénalisant le recours à l'interruption volontaire de grossesse (IVG), loi qui sera ensuite couramment désignée comme la « loi Veil ».",
    'ministre',
  ),
  manifeste343: wikipedia(
    'Manifeste des 343',
    'Manifeste_des_343',
    "Le manifeste des 343 est une pétition parue le 5 avril 1971 dans Le Nouvel Observateur, appelant à la légalisation de l'avortement en France, en raison notamment des risques médicaux provoqués par la clandestinité dans laquelle il est pratiqué.",
  ),
  manifesteBeauvoir: wikipedia(
    'Manifeste des 343',
    'Manifeste_des_343',
    'Le manifeste, rédigé par Simone de Beauvoir, commence par ces phrases',
    'redaction',
  ),
  beauvoirIntro: wikipedia(
    'Simone de Beauvoir',
    'Simone_de_Beauvoir',
    'Simone de Beauvoir (/simɔn də bovwaʁ/ ), née le 9 janvier 1908 dans le 6e arrondissement de Paris et morte le 14 avril 1986 dans le 14e arrondissement, est une philosophe, romancière, mémorialiste, professeur et essayiste française.',
  ),
  choisirCreation: wikipedia(
    'Choisir la cause des femmes',
    'Choisir_la_cause_des_femmes',
    "Choisir la cause des femmes, en abrégé Choisir, est une association de défense des droits des femmes et des personnes LGBTQIA+ créée dans le cadre des luttes féministes pour la dépénalisation de l'avortement en France en 1971.",
  ),
  choisirMobilisation: wikipedia(
    'Choisir la cause des femmes',
    'Choisir_la_cause_des_femmes',
    "De 1971 à 1975, date d'adoption de la loi sur l'interruption volontaire de grossesse (IVG) défendue par Simone Veil, Choisir est en première ligne de la mobilisation pour le droit à l'avortement.",
    'mobilisation',
  ),
  choisirBeauvoir: wikipedia(
    'Choisir la cause des femmes',
    'Choisir_la_cause_des_femmes',
    'Ce mouvement a le soutien de Simone de Beauvoir, qui devient la première présidente de l’association',
    'beauvoir',
  ),
  choisirHalimi: wikipedia(
    'Choisir la cause des femmes',
    'Choisir_la_cause_des_femmes',
    "Sa présidente Gisèle Halimi revendique d'utiliser les procès et la légalité pour faire avancer ce droit.",
    'halimi',
  ),
  bobigny: wikipedia(
    'Procès de Bobigny',
    'Procès_de_Bobigny',
    "Ce procès, dont la défense des accusées fut assurée par l'avocate Gisèle Halimi, eut un énorme retentissement et contribua à l'évolution vers la dépénalisation de l'interruption volontaire de grossesse en France.",
  ),
  bobignyDates: wikipedia(
    'Procès de Bobigny',
    'Procès_de_Bobigny',
    "Le procès de Bobigny est un procès contre l'avortement qui s'est tenu en octobre et novembre 1972 à Bobigny (Seine-Saint-Denis).",
    'dates',
  ),
  mlac: wikipedia(
    "Mouvement pour la liberté de l'avortement et de la contraception",
    "Mouvement_pour_la_liberté_de_l'avortement_et_de_la_contraception",
    "Le Mouvement pour la liberté de l’avortement et de la contraception (MLAC) était une association française loi de 1901, créée en avril 1973 dans le but de légaliser l'interruption volontaire de grossesse (IVG) en France.",
  ),
  halimiIntro: wikipedia(
    'Gisèle Halimi',
    'Gisèle_Halimi',
    'le 27 juillet 1927 à La Goulette en Tunisie et morte le 28 juillet 2020 à Paris 7e, est une avocate, militante féministe et femme politique franco-tunisienne.',
  ),
  roudyIntro: wikipedia(
    'Yvette Roudy',
    'Yvette_Roudy',
    'Yvette Roudy, née le 10 avril 1929 à Pessac (Gironde) et morte le 18 août 2026 à Cabestany (Pyrénées-Orientales), est une femme politique française ayant notamment soutenu la cause féministe.',
  ),
  roudyLois: wikipedia(
    'Yvette Roudy',
    'Yvette_Roudy',
    "Elle est à l'origine de deux lois qui portent son nom :  la loi Roudy pour l'IVG, loi sur le remboursement de l'IVG du 31 décembre 1982 ; la loi Roudy pour la parité, loi sur « l'égalité de l'homme et de la femme qui travaillent en entreprise » du 13 juillet 1983.",
    'lois',
  ),
  roudyMinistre: wikipedia(
    'Yvette Roudy',
    'Yvette_Roudy',
    "Après la victoire de François Mitterrand lors de l'élection présidentielle de 1981, elle est nommée ministre des Droits de la femme, de mai 1981 jusqu'en mars 1986.",
    'ministre',
  ),

  // Viol
  viol1810: wikipedia(
    'Viol en France',
    'Viol_en_France',
    "En 1810, il est inscrit dans le Code pénal napoléonien, et défini comme « tout autre attentat à la pudeur consommé ou attenté avec violence contre des individus de l'un ou de l'autre sexe ».",
  ),
  violEpoux: wikipedia(
    'Viol en France',
    'Viol_en_France',
    'La jurisprudence de la chambre criminelle de la Cour de cassation, se fondant sur la redéfinition du viol de 1980, admet progressivement la possibilité d’un tel viol entre époux.',
    'epoux',
  ),
  tongletFaits: wikipedia(
    'Affaire Tonglet-Castellano',
    'Affaire_Tonglet-Castellano',
    "L'affaire Tonglet-Castellano débute en 1974 avec le viol de deux touristes belges, Anne Tonglet (24 ans) et Aracelli Castellano (19 ans), dans une calanque près de Marseille (France).",
  ),
  tongletCorrectionnel: wikipedia(
    'Affaire Tonglet-Castellano',
    'Affaire_Tonglet-Castellano',
    "Alors que plusieurs associations féministes manifestent contre cette correctionnalisation du viol, l'avocate Gisèle Halimi, assistée d'Agnès Fichot, obtient du tribunal correctionnel de Marseille qu'il se déclare incompétent en raison de la nature criminelle des faits, le 15 octobre 1975.",
    'correctionnel',
  ),
  tongletProces: wikipedia(
    'Affaire Tonglet-Castellano',
    'Affaire_Tonglet-Castellano',
    "Au terme de débats houleux, lors desquels les plaignantes sont accusées d'avoir été « consentantes », voire provocantes, le verdict tombe le 3 mai 1978",
    'proces',
  ),
  tongletOuverture: wikipedia(
    'Affaire Tonglet-Castellano',
    'Affaire_Tonglet-Castellano',
    "Le procès s'ouvre le 2 mai 1978 devant la cour d'assises des Bouches-du-Rhône, présidée par Marcel Fourgeaud, à Aix-en-Provence.",
    'ouverture',
  ),
  tongletGros: wikipedia(
    'Affaire Tonglet-Castellano',
    'Affaire_Tonglet-Castellano',
    "S'appuyant sur leurs travaux, la sénatrice Brigitte Gros dépose l'année du procès une proposition de loi sur le viol, texte qui est adopté définitivement par l'Assemblée nationale le 19 novembre 1980.",
    'gros',
  ),
  tonglet1980: wikipedia(
    'Affaire Tonglet-Castellano',
    'Affaire_Tonglet-Castellano',
    'Le 23 décembre 1980, à la suite du vote de cette loi n°80-1041 qui remplace la précédente législation datant du Premier Empire (Code pénal de 1810), le viol reçoit une définition juridique plus précise',
    'loi-1980',
  ),
  grosIntro: wikipedia(
    'Brigitte Gros',
    'Brigitte_Gros',
    'Brigitte Gros, née Servan-Schreiber, le 12 juin 1925 à Saint-Germain-en-Laye et morte le 11 mars 1985 dans le 16e arrondissement de Paris, est une femme politique et femme de lettres française.',
  ),
  grosPropositions: wikipedia(
    'Brigitte Gros',
    'Brigitte_Gros',
    "Elle dépose en 1978 deux propositions de loi, l'une pour protéger davantage les femmes du viol et l'autre pour faciliter l'accès des femmes à la vie publique",
    'propositions',
  ),

  // Égalité professionnelle
  roudy1983: wikipedia(
    'Loi Roudy du 13 juillet 1983 sur la parité',
    'Loi_Roudy_du_13_juillet_1983_sur_la_parité',
    "Cette loi lutte contre la discrimination envers les femmes sur l'accès à l'emploi et le salaire d'un travail identique.",
  ),
  roudy1983Avant: wikipedia(
    'Loi Roudy du 13 juillet 1983 sur la parité',
    'Loi_Roudy_du_13_juillet_1983_sur_la_parité',
    "La loi Roudy complète la loi relative à l'égalité de rémunération entre les hommes et les femmes pour les travaux de valeur égale du 22 décembre 1972  (loi no 72-1143) ainsi que celle du 4 juillet 1975, qui interdit les offres d’emplois excluant la femme, et de refuser une embauche ou de licencier une femme sans « motif légitime ».",
    'avant',
  ),
  roudy1983Rapport: wikipedia(
    'Loi Roudy du 13 juillet 1983 sur la parité',
    'Loi_Roudy_du_13_juillet_1983_sur_la_parité',
    "Cette loi exige que les entreprises de plus de 50 salarié(e)s ayant signé un contrat avec l’État publient un RSC (rapport de situation comparée) sur la parité professionnelle entre homme et femme en matière d'embauche, de formation, de promotion, de qualification, de classification, de conditions de travail et de rémunération.",
    'rapport',
  ),
  roudy1983Rsc: wikipedia(
    'Loi Roudy du 13 juillet 1983 sur la parité',
    'Loi_Roudy_du_13_juillet_1983_sur_la_parité',
    "La loi crée le Conseil supérieur de l'égalité professionnelle, chargé de participer à la définition, à la mise en œuvre et à l'application de la politique menée en matière d'égalité professionnelle entre les femmes et les hommes.",
    'conseil',
  ),

  // Régimes matrimoniaux
  foyerLoi: wikipedia(
    'Loi du 13 juillet 1965 portant réforme des régimes matrimoniaux',
    'Loi_du_13_juillet_1965_portant_réforme_des_régimes_matrimoniaux',
    "La loi du 13 juillet 1965 portant réforme des régimes matrimoniaux est une loi en France qui est considérée comme une étape fondamentale dans l'émancipation juridique des femmes françaises.",
  ),
  foyerAvant: wikipedia(
    'Loi du 13 juillet 1965 portant réforme des régimes matrimoniaux',
    'Loi_du_13_juillet_1965_portant_réforme_des_régimes_matrimoniaux',
    "En dehors de ces situations, la femme mariée devait obtenir l'accord de son mari pour ouvrir un compte en banque séparé, pour passer des contrats avec des tiers qui engagent solidairement son conjoint, ou pour s'engager elle-même dans un emploi salarié extérieur.",
    'avant',
  ),
  foyerCommerce: wikipedia(
    'Loi du 13 juillet 1965 portant réforme des régimes matrimoniaux',
    'Loi_du_13_juillet_1965_portant_réforme_des_régimes_matrimoniaux',
    "la femme est désormais habilitée à exercer seule et sans l'autorisation de son conjoint un commerce séparé du sien.",
    'commerce',
  ),
  foyerNom: wikipedia(
    'Loi du 13 juillet 1965 portant réforme des régimes matrimoniaux',
    'Loi_du_13_juillet_1965_portant_réforme_des_régimes_matrimoniaux',
    'La loi est également connue sous le nom de « loi Foyer », du nom du garde des Sceaux Jean Foyer.',
    'nom',
  ),
  foyerAuteurs: wikipedia(
    'Loi du 13 juillet 1965 portant réforme des régimes matrimoniaux',
    'Loi_du_13_juillet_1965_portant_réforme_des_régimes_matrimoniaux',
    'La loi a ensuite été rédigée par le juriste Jean Carbonnier.',
    'auteurs',
  ),
  foyerGouvernement: wikipedia(
    'Loi du 13 juillet 1965 portant réforme des régimes matrimoniaux',
    'Loi_du_13_juillet_1965_portant_réforme_des_régimes_matrimoniaux',
    "Le gouvernement Pompidou, exclusivement composé d'hommes",
    'gouvernement',
  ),

  // Éducation
  daubie: wikipedia(
    'Julie-Victoire Daubié',
    'Julie-Victoire_Daubié',
    "C'est la première femme française à s'inscrire aux épreuves du baccalauréat à Lyon en 1861, et la première à l'obtenir le 17 août 1861.",
  ),
  daubieIntro: wikipedia(
    'Julie-Victoire Daubié',
    'Julie-Victoire_Daubié',
    'née le 26 mars 1824 à Bains-les-Bains (Vosges) et morte le 26 août 1874 (à 50 ans) à Fontenoy-le-Château (Vosges), est une journaliste française, militante des droits des femmes.',
    'identite',
  ),
};

const draft = { editorialStatus: 'draft' as const, reviewedAt: null };

// ─── Conquêtes ──────────────────────────────────────────────────────────────

export const rights: CultureEntity[] = [
  {
    id: 'right-droit-de-vote',
    kind: 'right',
    domain: 'droits',
    title: 'Le droit de vote des femmes',
    subtitle: 'Droit politique et citoyenneté · France',
    period: { label: '1944', sortYear: 1944 },
    summary:
      'Accordé aux femmes par une ordonnance du 21 avril 1944, le droit de vote aboutit après de longues revendications portées par des militantes et des organisations, et après plus de vingt ans de refus du Sénat.',
    right: {
      category: 'politique',
      country: 'France',
      before:
        'De 1919 à 1940, la Chambre des députés vote à plusieurs reprises des propositions de loi en faveur du vote des femmes ; le Sénat les rejette, en repoussant leur examen ou par un vote.',
      steps: [
        {
          date: '1791',
          text: 'Olympe de Gouges rédige la Déclaration des droits de la femme et de la citoyenne, qui reste à l’état de projet.',
        },
        {
          date: '1876',
          text: 'Hubertine Auclert fonde la société Le Droit des femmes, premier groupe suffragiste français.',
        },
        {
          date: '1909',
          text: 'Jeanne Schmahl crée l’Union française pour le suffrage des femmes, avec l’appui de La Française et de sa directrice Jane Misme.',
        },
        {
          date: '21 novembre 1922',
          text: 'Trois ans et demi après son vote à la Chambre, une proposition de loi est rejetée au Sénat par 156 voix contre 134.',
        },
        { date: '1934', text: 'Louise Weiss fonde l’association « Les femmes nouvelles ».' },
        {
          date: '21 avril 1944',
          text: 'Après un amendement de Fernand Grenier, le Comité français de la Libération nationale accorde le droit de vote aux femmes par ordonnance.',
        },
      ],
      outcome:
        'L’ordonnance du 21 avril 1944 du Comité français de la Libération nationale, signée par Charles de Gaulle depuis Alger, accorde le droit de vote aux femmes.',
      limits: [
        'Pendant plus de vingt ans, le Sénat bloque les propositions votées par la Chambre des députés.',
        'La source précise que l’ordonnance accorde le droit de vote aux femmes « en Métropole ».',
      ],
      later: [
        {
          text: 'Le droit de vote est utilisé pour la première fois le 29 avril 1945, aux élections municipales, puis en octobre pour l’Assemblée constituante.',
        },
      ],
    },
    links: [],
    sources: [S.vote1944, S.voteSenat, S.vote1922, S.vote1945, S.declarationProjet, S.ufsfCreation],
    ...draft,
  },
  {
    id: 'right-contraception',
    kind: 'right',
    domain: 'droits',
    title: 'Le droit à la contraception',
    subtitle: 'Contraception et droits reproductifs · France',
    period: { label: '1967', sortYear: 1967 },
    summary:
      'Interdite depuis 1920, la contraception est autorisée par la loi Neuwirth de 1967, après une décennie de mobilisation portée notamment par l’association Maternité heureuse, devenue le Mouvement français pour le planning familial.',
    right: {
      category: 'reproduction',
      country: 'France',
      before:
        'Une loi du 31 juillet 1920 interdit toute contraception, et jusqu’à l’information sur les moyens contraceptifs.',
      steps: [
        {
          date: '1956',
          text: 'Marie-Andrée Lagroua Weill-Hallé et la sociologue Évelyne Sullerot déposent les statuts de l’association Maternité heureuse.',
        },
        {
          date: '1960',
          text: 'Le Mouvement français pour le planning familial prend le relais de la Maternité heureuse.',
        },
        {
          date: '18 mai 1966',
          text: 'Le député Lucien Neuwirth dépose une première fois sa proposition de loi.',
        },
        { date: 'Décembre 1967', text: 'L’Assemblée nationale vote la loi Neuwirth.' },
        { date: '28 décembre 1967', text: 'La loi est promulguée.' },
      ],
      outcome:
        'La loi Neuwirth abroge la loi de 1920 et autorise la fabrication et la délivrance de contraceptifs sur ordonnance.',
      limits: [
        'Son application est lente : les décrets ne paraissent qu’entre 1969 et 1972, à cause de multiples freins de l’administration.',
      ],
      later: [],
    },
    links: [],
    sources: [
      S.neuwirth1920,
      S.neuwirth1966,
      S.neuwirthDecrets,
      S.planningNeuwirth,
      S.weillHalleStatuts,
      S.planningRelais,
    ],
    ...draft,
  },
  {
    id: 'right-ivg',
    kind: 'right',
    domain: 'droits',
    title: 'Le droit à l’interruption volontaire de grossesse',
    subtitle: 'Contraception et droits reproductifs · France',
    period: { label: '1975', sortYear: 1975 },
    summary:
      'Dépénalisée par la loi du 17 janvier 1975, l’IVG est l’aboutissement d’un combat collectif : pétition des 343, procès de Bobigny, associations Choisir et MLAC, puis une loi défendue par Simone Veil et adoptée par l’Assemblée nationale.',
    right: {
      category: 'reproduction',
      country: 'France',
      before:
        'L’avortement est interdit et pratiqué clandestinement ; le manifeste des 343 dénonce en 1971 les risques médicaux de cette clandestinité.',
      steps: [
        {
          date: '5 avril 1971',
          text: 'Le manifeste des 343, rédigé par Simone de Beauvoir, paraît dans Le Nouvel Observateur.',
        },
        { date: '1971', text: 'Création de l’association Choisir la cause des femmes.' },
        {
          date: 'Octobre – novembre 1972',
          text: 'Procès de Bobigny : Gisèle Halimi assure la défense des accusées.',
        },
        {
          date: 'Avril 1973',
          text: 'Création du Mouvement pour la liberté de l’avortement et de la contraception (MLAC).',
        },
        {
          date: '26 novembre 1974',
          text: 'Simone Veil, ministre de la Santé, présente le projet de loi devant l’Assemblée nationale.',
        },
        { date: '29 novembre 1974', text: 'L’Assemblée adopte la loi par 284 voix contre 189.' },
        {
          date: '17 janvier 1975',
          text: 'La loi est promulguée, pour cinq ans à titre expérimental.',
        },
      ],
      outcome:
        'La loi du 17 janvier 1975, dite loi Veil, dépénalise l’interruption volontaire de grossesse pratiquée avant la fin de la dixième semaine.',
      limits: [
        'La loi n’est d’abord adoptée que pour cinq ans, à titre expérimental.',
        'Elle est votée grâce à la quasi-totalité des députés de gauche et du centre, malgré l’opposition de la majeure partie des députés de droite.',
      ],
      later: [
        { text: 'La loi du 31 décembre 1979 la reconduit sans limite de temps.' },
        {
          text: 'La loi du 31 décembre 1982, dont Yvette Roudy est à l’origine, instaure le remboursement de l’IVG.',
          involves: ['person-yvette-roudy'],
        },
      ],
    },
    links: [],
    sources: [
      S.veilLoi,
      S.veilPromulgation,
      S.veilVote,
      S.veilReconduite,
      S.manifeste343,
      S.roudyLois,
    ],
    ...draft,
  },
  {
    id: 'right-viol-crime',
    kind: 'right',
    domain: 'droits',
    title: 'La définition du viol comme crime',
    subtitle: 'Lutte contre les violences · France',
    period: { label: '1980', sortYear: 1980 },
    summary:
      'Avec la loi du 23 décembre 1980, le viol reçoit une définition juridique précise. Elle fait suite au procès d’Aix-en-Provence de 1978, porté par deux plaignantes, leur avocate Gisèle Halimi et des associations féministes.',
    right: {
      category: 'violences',
      country: 'France',
      before:
        'Depuis le Code pénal de 1810, le viol est défini comme « tout autre attentat à la pudeur consommé ou attenté avec violence ».',
      steps: [
        {
          date: '1974',
          text: 'Anne Tonglet et Aracelli Castellano sont violées dans une calanque près de Marseille.',
        },
        {
          date: '15 octobre 1975',
          text: 'Alors que des associations féministes manifestent contre la correctionnalisation du viol, Gisèle Halimi, assistée d’Agnès Fichot, obtient que le tribunal correctionnel se déclare incompétent.',
        },
        {
          date: '2 mai 1978',
          text: 'Ouverture du procès devant la cour d’assises des Bouches-du-Rhône, à Aix-en-Provence.',
        },
        {
          date: '1978',
          text: 'La sénatrice Brigitte Gros dépose une proposition de loi sur le viol.',
        },
        {
          date: '19 novembre 1980',
          text: 'Le texte est adopté définitivement par l’Assemblée nationale.',
        },
      ],
      outcome:
        'La loi n° 80-1041 du 23 décembre 1980 remplace la législation de 1810 et donne au viol une définition juridique plus précise.',
      limits: [
        'Au procès d’Aix, les plaignantes sont accusées d’avoir été « consentantes », voire provocantes.',
      ],
      later: [
        {
          text: 'Se fondant sur cette redéfinition, la Cour de cassation admet progressivement la possibilité d’un viol entre époux.',
        },
      ],
    },
    links: [],
    sources: [
      S.viol1810,
      S.tongletFaits,
      S.tongletCorrectionnel,
      S.tongletOuverture,
      S.tongletProces,
      S.tongletGros,
      S.tonglet1980,
      S.violEpoux,
    ],
    ...draft,
  },
  {
    id: 'right-egalite-professionnelle',
    kind: 'right',
    domain: 'droits',
    title: 'L’égalité professionnelle',
    subtitle: 'Travail et égalité professionnelle · France',
    period: { label: '1983', sortYear: 1983 },
    summary:
      'La loi du 13 juillet 1983, dont Yvette Roudy, ministre des Droits de la femme, est à l’origine, lutte contre la discrimination envers les femmes dans l’accès à l’emploi et le salaire d’un travail identique.',
    right: {
      category: 'travail',
      country: 'France',
      before:
        'Deux lois existent déjà : celle du 22 décembre 1972 sur l’égalité de rémunération pour des travaux de valeur égale, et celle du 4 juillet 1975, qui interdit les offres d’emploi excluant les femmes.',
      steps: [
        {
          date: '22 décembre 1972',
          text: 'Loi relative à l’égalité de rémunération entre les femmes et les hommes pour des travaux de valeur égale.',
        },
        {
          date: '4 juillet 1975',
          text: 'Une loi interdit les offres d’emploi excluant les femmes, et de refuser une embauche ou de licencier une femme sans « motif légitime ».',
        },
        { date: 'Mai 1981', text: 'Yvette Roudy est nommée ministre des Droits de la femme.' },
        { date: '13 juillet 1983', text: 'Adoption de la loi sur l’égalité professionnelle.' },
      ],
      outcome:
        'La loi crée le Conseil supérieur de l’égalité professionnelle et impose aux entreprises de plus de 50 salariés ayant signé un contrat avec l’État de publier un rapport de situation comparée entre femmes et hommes.',
      limits: [],
      later: [],
    },
    links: [],
    sources: [S.roudy1983, S.roudy1983Avant, S.roudy1983Rsc, S.roudy1983Rapport, S.roudyMinistre],
    ...draft,
  },
  {
    id: 'right-regimes-matrimoniaux',
    kind: 'right',
    domain: 'droits',
    title: 'L’autonomie juridique des femmes mariées',
    subtitle: 'Autonomie juridique et financière · France',
    period: { label: '1965', sortYear: 1965 },
    summary:
      'La loi du 13 juillet 1965 réforme les régimes matrimoniaux ; elle est considérée comme une étape fondamentale dans l’émancipation juridique des femmes françaises.',
    right: {
      category: 'autonomie',
      country: 'France',
      before:
        'Sauf exceptions, une femme mariée doit obtenir l’accord de son mari pour ouvrir un compte en banque séparé ou pour occuper un emploi salarié.',
      steps: [
        {
          date: '13 juillet 1965',
          text: 'Adoption de la réforme des régimes matrimoniaux, dite « loi Foyer » du nom du garde des Sceaux Jean Foyer, et rédigée par le juriste Jean Carbonnier.',
        },
      ],
      outcome:
        'La femme mariée peut notamment exercer seule, sans l’autorisation de son conjoint, un commerce séparé du sien.',
      limits: [
        'Le gouvernement Pompidou, exclusivement composé d’hommes, commence par lancer un sondage pour savoir si la réforme sera acceptée.',
      ],
      later: [],
    },
    links: [],
    sources: [
      S.foyerLoi,
      S.foyerAvant,
      S.foyerCommerce,
      S.foyerNom,
      S.foyerAuteurs,
      S.foyerGouvernement,
    ],
    ...draft,
  },
];

// ─── Femmes ─────────────────────────────────────────────────────────────────

export const rightsPeople: CultureEntity[] = [
  {
    id: 'person-olympe-de-gouges',
    kind: 'person',
    domain: 'droits',
    title: 'Olympe de Gouges',
    hook: '1791 : une Déclaration des droits de la femme et de la citoyenne',
    subtitle: 'Femme de lettres et femme politique française',
    period: { label: '1748 – 1793', sortYear: 1748, endYear: 1793 },
    summary:
      'Femme de lettres et dramaturge, Olympe de Gouges rédige en 1791 la Déclaration des droits de la femme et de la citoyenne et laisse de nombreux écrits en faveur des droits civils et politiques des femmes. Elle meurt guillotinée en 1793.',
    image: rightsImages['olympe-de-gouges'],
    links: [
      {
        targetId: 'right-droit-de-vote',
        relation: 'contributed',
        contribution: 'claim',
        year: 1791,
        detail:
          'Rédige la Déclaration des droits de la femme et de la citoyenne et défend par ses écrits les droits civils et politiques des femmes.',
        sourceId: S.gougesDeclaration.id,
      },
      { targetId: 'event-1791-declaration', relation: 'took-part' },
    ],
    sources: [S.gougesIntro, S.gougesDeclaration],
    ...draft,
  },
  {
    id: 'person-hubertine-auclert',
    kind: 'person',
    domain: 'droits',
    title: 'Hubertine Auclert',
    hook: 'Voter et être élues : son combat pour les femmes',
    subtitle: 'Journaliste et militante féministe française',
    period: { label: '1848 – 1914', sortYear: 1848, endYear: 1914 },
    summary:
      'Journaliste, écrivaine et militante féministe, Hubertine Auclert combat en faveur de l’éligibilité des femmes et de leur droit de vote.',
    image: rightsImages['hubertine-auclert'],
    links: [
      {
        targetId: 'right-droit-de-vote',
        relation: 'contributed',
        contribution: 'mobilization',
        year: 1876,
        detail:
          'Fonde en 1876 la société Le Droit des femmes, qui soutient le droit de vote des femmes et devient en 1883 la société Le Suffrage des femmes.',
        sourceId: S.auclertSociete.id,
      },
      {
        targetId: 'right-droit-de-vote',
        relation: 'contributed',
        contribution: 'publication',
        year: 1881,
        detail: 'Lance en 1881 La Citoyenne, un journal qui plaide pour la libération féminine.',
        sourceId: S.auclertCitoyenne.id,
      },
    ],
    sources: [S.auclertIntro, S.auclertSociete, S.auclertCitoyenne],
    ...draft,
  },
  {
    id: 'person-cecile-brunschvicg',
    kind: 'person',
    domain: 'droits',
    title: 'Cécile Brunschvicg',
    hook: 'À la tête de l’Union française pour le suffrage des femmes',
    subtitle: 'Femme politique et féministe française',
    period: { label: '1877 – 1946', sortYear: 1877, endYear: 1946 },
    summary:
      'Féministe, Cécile Brunschvicg devient secrétaire générale de l’Union française pour le suffrage des femmes en 1910, puis sa présidente en 1924. En 1936, elle est nommée sous-secrétaire d’État à l’Éducation nationale.',
    image: rightsImages['cecile-brunschvicg'],
    links: [
      {
        targetId: 'right-droit-de-vote',
        relation: 'contributed',
        contribution: 'mobilization',
        year: 1910,
        detail:
          'Secrétaire générale de l’Union française pour le suffrage des femmes en 1910, puis présidente en 1924.',
        sourceId: S.brunschvicgUfsf.id,
      },
      { targetId: 'organization-ufsf', relation: 'member-of' },
    ],
    sources: [S.brunschvicgIntro, S.brunschvicgUfsf, S.brunschvicg1936],
    ...draft,
  },
  {
    id: 'person-louise-weiss',
    kind: 'person',
    domain: 'droits',
    title: 'Louise Weiss',
    hook: 'Fondatrice des « Femmes nouvelles », pour le droit de vote',
    subtitle: 'Journaliste, féministe et femme politique française',
    period: { label: '1893 – 1983', sortYear: 1893, endYear: 1983 },
    summary:
      'Journaliste, femme de lettres, féministe et femme politique, Louise Weiss fonde en 1934 l’association « Les femmes nouvelles » pour le droit des femmes de voter et d’être élues.',
    links: [
      {
        targetId: 'right-droit-de-vote',
        relation: 'contributed',
        contribution: 'mobilization',
        year: 1934,
        detail:
          'Fonde en 1934 l’association « Les femmes nouvelles », qui veut bousculer l’inertie des élus par des méthodes radicales.',
        sourceId: S.weiss1934.id,
      },
    ],
    sources: [S.weissIntro, S.weiss1934],
    ...draft,
  },
  {
    id: 'person-marie-andree-lagroua-weill-halle',
    kind: 'person',
    domain: 'droits',
    title: 'Marie-Andrée Lagroua Weill-Hallé',
    hook: 'Cofondatrice de la « Maternité heureuse », futur Planning familial',
    subtitle: 'Gynécologue française',
    period: { label: '1916 – 1994', sortYear: 1916, endYear: 1994 },
    summary:
      'Gynécologue, Marie-Andrée Lagroua Weill-Hallé fonde en 1956 le mouvement « La maternité heureuse », avec la sociologue Évelyne Sullerot.',
    links: [
      {
        targetId: 'right-contraception',
        relation: 'contributed',
        contribution: 'mobilization',
        year: 1956,
        detail:
          'Dépose en 1956, avec la sociologue Évelyne Sullerot, les statuts de l’association Maternité heureuse.',
        sourceId: S.weillHalleStatuts.id,
      },
      { targetId: 'organization-planning-familial', relation: 'member-of' },
    ],
    sources: [S.weillHalleIntro, S.weillHalleStatuts],
    ...draft,
  },
  {
    id: 'person-simone-de-beauvoir',
    kind: 'person',
    domain: 'droits',
    title: 'Simone de Beauvoir',
    hook: 'La plume du manifeste des 343',
    subtitle: 'Philosophe et essayiste française',
    period: { label: '1908 – 1986', sortYear: 1908, endYear: 1986 },
    summary:
      'Philosophe, romancière et essayiste, Simone de Beauvoir rédige le manifeste des 343 en 1971 et devient la première présidente de l’association Choisir la cause des femmes.',
    links: [
      {
        targetId: 'right-ivg',
        relation: 'contributed',
        contribution: 'publication',
        year: 1971,
        detail: 'Rédige le manifeste des 343, publié le 5 avril 1971 dans Le Nouvel Observateur.',
        sourceId: S.manifesteBeauvoir.id,
      },
      {
        targetId: 'right-ivg',
        relation: 'contributed',
        contribution: 'mobilization',
        year: 1971,
        detail:
          'Soutient l’association Choisir la cause des femmes, dont elle devient la première présidente.',
        sourceId: S.choisirBeauvoir.id,
      },
      { targetId: 'event-1971-manifeste-343', relation: 'took-part' },
      { targetId: 'organization-choisir', relation: 'member-of' },
    ],
    sources: [S.beauvoirIntro, S.manifesteBeauvoir, S.choisirBeauvoir],
    ...draft,
  },
  {
    id: 'person-gisele-halimi',
    kind: 'person',
    domain: 'droits',
    title: 'Gisèle Halimi',
    hook: 'Avocate des accusées du procès de Bobigny',
    subtitle: 'Avocate, militante féministe et femme politique',
    period: { label: '1927 – 2020', sortYear: 1927, endYear: 2020 },
    summary:
      'Avocate et militante féministe, Gisèle Halimi défend les accusées du procès de Bobigny en 1972 et les plaignantes de l’affaire Tonglet-Castellano, jugée à Aix-en-Provence en 1978.',
    links: [
      {
        targetId: 'right-ivg',
        relation: 'contributed',
        contribution: 'legal-action',
        year: 1972,
        detail:
          'Assure la défense des accusées au procès de Bobigny, qui contribue à l’évolution vers la dépénalisation de l’IVG.',
        sourceId: S.bobigny.id,
      },
      {
        targetId: 'right-ivg',
        relation: 'contributed',
        contribution: 'advocacy',
        year: 1971,
        detail:
          'Présidente de Choisir, elle revendique d’utiliser les procès et la légalité pour faire avancer ce droit.',
        sourceId: S.choisirHalimi.id,
      },
      {
        targetId: 'right-viol-crime',
        relation: 'contributed',
        contribution: 'legal-action',
        year: 1975,
        detail:
          'Avocate des plaignantes, assistée d’Agnès Fichot, elle obtient en 1975 que le tribunal correctionnel se déclare incompétent face à la nature criminelle des faits.',
        sourceId: S.tongletCorrectionnel.id,
      },
      { targetId: 'event-1972-proces-bobigny', relation: 'took-part' },
      { targetId: 'event-1978-proces-aix', relation: 'took-part' },
      { targetId: 'organization-choisir', relation: 'member-of' },
    ],
    sources: [S.halimiIntro, S.bobigny, S.choisirHalimi, S.tongletCorrectionnel],
    ...draft,
  },
  {
    id: 'person-simone-veil',
    kind: 'person',
    domain: 'droits',
    title: 'Simone Veil',
    hook: 'Face aux députés, elle défend la loi sur l’IVG',
    subtitle: 'Magistrate et femme d’État française',
    period: { label: '1927 – 2017', sortYear: 1927, endYear: 2017 },
    summary:
      'Magistrate et femme d’État, Simone Veil est nommée ministre de la Santé en 1974 et chargée de faire adopter la loi dépénalisant l’IVG, couramment désignée depuis comme la « loi Veil ».',
    image: rightsImages['simone-veil'],
    links: [
      {
        targetId: 'right-ivg',
        relation: 'contributed',
        contribution: 'reform',
        year: 1974,
        detail:
          'Ministre de la Santé, chargée par le président Giscard d’Estaing de faire adopter la loi, elle présente le projet devant l’Assemblée nationale le 26 novembre 1974.',
        sourceId: S.simoneVeilMinistre.id,
      },
      { targetId: 'event-1974-discours-veil', relation: 'took-part' },
    ],
    sources: [S.simoneVeilIntro, S.simoneVeilMinistre],
    ...draft,
  },
  {
    id: 'person-yvette-roudy',
    kind: 'person',
    domain: 'droits',
    title: 'Yvette Roudy',
    hook: 'À l’origine de la loi sur l’égalité professionnelle',
    subtitle: 'Femme politique française',
    period: { label: '1929 – 2026', sortYear: 1929, endYear: 2026 },
    summary:
      'Ministre des Droits de la femme de 1981 à 1986, Yvette Roudy est à l’origine de deux lois qui portent son nom : le remboursement de l’IVG (1982) et l’égalité professionnelle (1983).',
    links: [
      {
        targetId: 'right-egalite-professionnelle',
        relation: 'contributed',
        contribution: 'reform',
        year: 1983,
        detail:
          'Ministre des Droits de la femme, elle est à l’origine de la loi du 13 juillet 1983, qui porte son nom.',
        sourceId: S.roudyLois.id,
      },
      {
        targetId: 'right-ivg',
        relation: 'contributed',
        contribution: 'continuation',
        year: 1982,
        detail: 'Est à l’origine de la loi du 31 décembre 1982 sur le remboursement de l’IVG.',
        sourceId: S.roudyLois.id,
      },
    ],
    sources: [S.roudyIntro, S.roudyLois, S.roudyMinistre],
    ...draft,
  },
  {
    id: 'person-brigitte-gros',
    kind: 'person',
    domain: 'droits',
    title: 'Brigitte Gros',
    hook: 'Une proposition de loi pour mieux protéger les femmes du viol',
    subtitle: 'Femme politique et femme de lettres française',
    period: { label: '1925 – 1985', sortYear: 1925, endYear: 1985 },
    summary:
      'Femme politique et femme de lettres, la sénatrice Brigitte Gros dépose en 1978 une proposition de loi pour protéger davantage les femmes du viol.',
    links: [
      {
        targetId: 'right-viol-crime',
        relation: 'contributed',
        contribution: 'drafting',
        year: 1978,
        detail: 'Dépose en 1978 une proposition de loi pour protéger davantage les femmes du viol.',
        sourceId: S.grosPropositions.id,
      },
    ],
    sources: [S.grosIntro, S.grosPropositions],
    ...draft,
  },
  {
    id: 'person-julie-victoire-daubie',
    kind: 'person',
    domain: 'droits',
    title: 'Julie-Victoire Daubié',
    hook: 'Première bachelière de France, en 1861',
    subtitle: 'Journaliste et militante des droits des femmes',
    period: { label: '1824 – 1874', sortYear: 1824, endYear: 1874 },
    summary:
      'Journaliste et militante des droits des femmes, Julie-Victoire Daubié est la première femme en France à obtenir le baccalauréat, le 17 août 1861.',
    image: rightsImages['julie-victoire-daubie'],
    links: [{ targetId: 'event-1861-daubie-baccalaureat', relation: 'took-part' }],
    sources: [S.daubieIntro, S.daubie],
    ...draft,
  },
];

// ─── Organisations ──────────────────────────────────────────────────────────

export const organizations: CultureEntity[] = [
  {
    id: 'organization-ufsf',
    kind: 'organization',
    domain: 'droits',
    title: 'Union française pour le suffrage des femmes',
    subtitle: 'UFSF · association',
    period: { label: '1909 – 1940', sortYear: 1909 },
    summary:
      'Créée en 1909 par Jeanne Schmahl, avec l’appui de l’hebdomadaire La Française et de sa directrice Jane Misme, l’UFSF est la principale organisation française réclamant le droit de vote des femmes jusqu’en 1940.',
    links: [
      {
        targetId: 'right-droit-de-vote',
        relation: 'contributed',
        contribution: 'mobilization',
        year: 1909,
        detail:
          'Principale organisation française réclamant le droit de vote des femmes entre 1909 et 1940.',
        sourceId: S.ufsfRole.id,
      },
    ],
    sources: [S.ufsfCreation, S.ufsfRole],
    ...draft,
  },
  {
    id: 'organization-planning-familial',
    kind: 'organization',
    domain: 'droits',
    title: 'Mouvement français pour le planning familial',
    subtitle: 'D’abord « Maternité heureuse » · association',
    period: { label: 'depuis 1956', sortYear: 1956 },
    summary:
      'Créée en 1956 sous le nom de « Maternité heureuse », l’association devient en 1960 le Mouvement français pour le planning familial et poursuit son œuvre d’information.',
    links: [
      {
        targetId: 'right-contraception',
        relation: 'contributed',
        contribution: 'mobilization',
        year: 1960,
        detail:
          'Prend en 1960 le relais de la Maternité heureuse et poursuit son œuvre d’information, notamment le conseil familial et sexuel.',
        sourceId: S.planningRelais.id,
      },
    ],
    sources: [S.planningCreation, S.planningRelais],
    ...draft,
  },
  {
    id: 'organization-choisir',
    kind: 'organization',
    domain: 'droits',
    title: 'Choisir la cause des femmes',
    subtitle: 'Choisir · association',
    period: { label: 'depuis 1971', sortYear: 1971 },
    summary:
      'Association créée en 1971 dans le cadre des luttes féministes pour la dépénalisation de l’avortement. De 1971 à 1975, elle est en première ligne de la mobilisation pour ce droit.',
    links: [
      {
        targetId: 'right-ivg',
        relation: 'contributed',
        contribution: 'mobilization',
        year: 1971,
        detail:
          'De 1971 à 1975, en première ligne de la mobilisation pour le droit à l’avortement.',
        sourceId: S.choisirMobilisation.id,
      },
    ],
    sources: [S.choisirCreation, S.choisirMobilisation],
    ...draft,
  },
  {
    id: 'organization-mlac',
    kind: 'organization',
    domain: 'droits',
    title: 'Mouvement pour la liberté de l’avortement et de la contraception',
    subtitle: 'MLAC · association',
    period: { label: '1973', sortYear: 1973 },
    summary:
      'Association créée en avril 1973 dans le but de légaliser l’interruption volontaire de grossesse en France.',
    links: [
      {
        targetId: 'right-ivg',
        relation: 'contributed',
        contribution: 'mobilization',
        year: 1973,
        detail: 'Créé en avril 1973 dans le but de légaliser l’IVG.',
        sourceId: S.mlac.id,
      },
    ],
    sources: [S.mlac],
    ...draft,
  },
];

// ─── Textes de loi ──────────────────────────────────────────────────────────

export const laws: CultureEntity[] = [
  {
    id: 'law-ordonnance-21-avril-1944',
    kind: 'law',
    domain: 'droits',
    title: 'Ordonnance du 21 avril 1944',
    subtitle: 'Comité français de la Libération nationale',
    period: { label: '21 avril 1944', sortYear: 1944 },
    summary:
      'Ordonnance du Comité français de la Libération nationale, signée par Charles de Gaulle depuis Alger, qui accorde le droit de vote aux femmes, après un amendement du communiste Fernand Grenier.',
    law: { institution: 'Comité français de la Libération nationale' },
    links: [{ targetId: 'right-droit-de-vote', relation: 'enacted' }],
    sources: [S.vote1944],
    ...draft,
  },
  {
    id: 'law-loi-neuwirth',
    kind: 'law',
    domain: 'droits',
    title: 'Loi Neuwirth',
    subtitle: 'Loi du 28 décembre 1967',
    period: { label: '28 décembre 1967', sortYear: 1967 },
    summary:
      'Proposée par le député gaulliste Lucien Neuwirth et votée par l’Assemblée nationale en décembre 1967, elle abroge la loi de 1920 et autorise la contraception sur ordonnance.',
    law: {
      institution: 'Parlement',
      reference: 'Loi du 28 décembre 1967',
    },
    links: [{ targetId: 'right-contraception', relation: 'enacted' }],
    sources: [S.neuwirth1920, S.planningNeuwirth],
    ...draft,
  },
  {
    id: 'law-loi-veil',
    kind: 'law',
    domain: 'droits',
    title: 'Loi Veil',
    subtitle: 'Loi du 17 janvier 1975 relative à l’IVG',
    period: { label: '17 janvier 1975', sortYear: 1975 },
    summary:
      'Adoptée par l’Assemblée nationale le 29 novembre 1974 par 284 voix contre 189 et promulguée le 17 janvier 1975, elle dépénalise l’IVG pour cinq ans ; elle est reconduite sans limite de temps en 1979.',
    law: {
      institution: 'Parlement',
      reference: 'Loi du 17 janvier 1975',
    },
    links: [{ targetId: 'right-ivg', relation: 'enacted' }],
    sources: [S.veilVote, S.veilPromulgation, S.veilReconduite],
    ...draft,
  },
  {
    id: 'law-loi-viol-1980',
    kind: 'law',
    domain: 'droits',
    title: 'Loi du 23 décembre 1980 sur le viol',
    subtitle: 'Loi n° 80-1041',
    period: { label: '23 décembre 1980', sortYear: 1980 },
    summary:
      'Issue d’une proposition de la sénatrice Brigitte Gros et adoptée définitivement par l’Assemblée nationale le 19 novembre 1980, elle remplace la législation de 1810 et définit précisément le viol.',
    law: {
      institution: 'Parlement',
      reference: 'Loi n° 80-1041 du 23 décembre 1980',
    },
    links: [{ targetId: 'right-viol-crime', relation: 'enacted' }],
    sources: [S.tongletGros, S.tonglet1980],
    ...draft,
  },
  {
    id: 'law-loi-roudy-1983',
    kind: 'law',
    domain: 'droits',
    title: 'Loi Roudy sur l’égalité professionnelle',
    subtitle: 'Loi du 13 juillet 1983',
    period: { label: '13 juillet 1983', sortYear: 1983 },
    summary:
      'Loi pour l’égalité professionnelle entre les femmes et les hommes, qui crée le Conseil supérieur de l’égalité professionnelle.',
    law: { institution: 'Parlement', reference: 'Loi du 13 juillet 1983' },
    links: [{ targetId: 'right-egalite-professionnelle', relation: 'enacted' }],
    sources: [S.roudy1983, S.roudy1983Rsc],
    ...draft,
  },
  {
    id: 'law-loi-1965-regimes-matrimoniaux',
    kind: 'law',
    domain: 'droits',
    title: 'Loi du 13 juillet 1965 portant réforme des régimes matrimoniaux',
    subtitle: 'Dite « loi Foyer »',
    period: { label: '13 juillet 1965', sortYear: 1965 },
    summary:
      'Connue sous le nom de « loi Foyer », du nom du garde des Sceaux Jean Foyer, et rédigée par le juriste Jean Carbonnier, elle réforme les régimes matrimoniaux.',
    law: { institution: 'Parlement', reference: 'Loi du 13 juillet 1965' },
    links: [{ targetId: 'right-regimes-matrimoniaux', relation: 'enacted' }],
    sources: [S.foyerLoi, S.foyerNom, S.foyerAuteurs],
    ...draft,
  },
];

// ─── Événements ─────────────────────────────────────────────────────────────

export const rightsEvents: CultureEntity[] = [
  {
    id: 'event-1791-declaration',
    kind: 'event',
    domain: 'droits',
    title: 'La Déclaration des droits de la femme et de la citoyenne',
    subtitle: 'Un projet resté sans suite',
    period: { label: '1791', sortYear: 1791 },
    summary:
      'Rédigée en 1791 par Olympe de Gouges, la Déclaration ne paraît qu’en cinq exemplaires et reste à l’état de projet : elle ne provoque chez les députés que quelques sarcasmes ou de l’indifférence.',
    image: rightsImages['declaration-1791'],
    links: [{ targetId: 'right-droit-de-vote', relation: 'context' }],
    sources: [S.declarationProjet, S.gougesDeclaration],
    ...draft,
  },
  {
    id: 'event-1971-manifeste-343',
    kind: 'event',
    domain: 'droits',
    title: 'Le manifeste des 343',
    subtitle: 'Le Nouvel Observateur',
    period: { label: '5 avril 1971', sortYear: 1971 },
    summary:
      'Pétition parue le 5 avril 1971 dans Le Nouvel Observateur, appelant à la légalisation de l’avortement en France, en raison notamment des risques médicaux de la clandestinité.',
    links: [{ targetId: 'right-ivg', relation: 'context' }],
    sources: [S.manifeste343, S.manifesteBeauvoir],
    ...draft,
  },
  {
    id: 'event-1972-proces-bobigny',
    kind: 'event',
    domain: 'droits',
    title: 'Le procès de Bobigny',
    subtitle: 'Seine-Saint-Denis',
    period: { label: '1972', sortYear: 1972 },
    summary:
      'Procès contre l’avortement tenu en octobre et novembre 1972, où Gisèle Halimi assure la défense des accusées. Il a un énorme retentissement et contribue à l’évolution vers la dépénalisation de l’IVG.',
    links: [{ targetId: 'right-ivg', relation: 'context' }],
    sources: [S.bobignyDates, S.bobigny],
    ...draft,
  },
  {
    id: 'event-1974-discours-veil',
    kind: 'event',
    domain: 'droits',
    title: 'Simone Veil présente la loi à l’Assemblée',
    subtitle: 'Assemblée nationale',
    period: { label: '26 novembre 1974', sortYear: 1974 },
    summary:
      'Le 26 novembre 1974, la ministre de la Santé présente devant l’Assemblée nationale le projet de loi sur l’interruption volontaire de grossesse.',
    links: [{ targetId: 'right-ivg', relation: 'context' }],
    sources: [S.veilDiscours],
    ...draft,
  },
  {
    id: 'event-1978-proces-aix',
    kind: 'event',
    domain: 'droits',
    title: 'Le procès d’Aix-en-Provence',
    subtitle: 'Affaire Tonglet-Castellano',
    period: { label: 'Mai 1978', sortYear: 1978 },
    summary:
      'Procès des agresseurs d’Anne Tonglet et d’Aracelli Castellano, ouvert le 2 mai 1978 devant la cour d’assises des Bouches-du-Rhône, à Aix-en-Provence. Lors des débats, les plaignantes sont accusées d’avoir été « consentantes ».',
    links: [{ targetId: 'right-viol-crime', relation: 'context' }],
    sources: [S.tongletFaits, S.tongletOuverture, S.tongletProces],
    ...draft,
  },
  {
    id: 'event-1861-daubie-baccalaureat',
    kind: 'event',
    domain: 'droits',
    title: 'Première femme bachelière',
    subtitle: 'Lyon',
    period: { label: '1861', sortYear: 1861 },
    summary:
      'Julie-Victoire Daubié est la première femme française à s’inscrire aux épreuves du baccalauréat, à Lyon en 1861, et la première à l’obtenir, le 17 août 1861.',
    links: [],
    sources: [S.daubie],
    ...draft,
  },
];
