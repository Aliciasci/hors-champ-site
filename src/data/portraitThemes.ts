import type { PortraitTheme } from '@/types';

/**
 * Thématiques de l'onglet « Elles ». Une femme n'est rangée dans une thématique que si sa fiche
 * (résumé sourcé) le justifie ; la raison affichée en reprend le contenu. Les thématiques sans
 * fiche documentée restent vides et s'affichent « à documenter » : on n'y range personne pour
 * les remplir.
 *
 * Pistes éditoriales proposées pour les compléter (fiches à rédiger et sourcer avant tout ajout) :
 * Nina Simone, pionnières du cinéma (culture) ; bell hooks,
 * Angela Davis, Judith Butler (idées) ; Alice Ball (oubliées) ; premières femmes médecins
 * (pionnières) ; Alice Milliat, aviatrices, exploratrices, alpinistes (limites) ; militantes
 * ouvrières (droits).
 */
export const portraitThemes: PortraitTheme[] = [
  {
    id: 'epoque',
    title: 'Elles changent notre époque',
    subtitle: 'Sciences, droits, arts : nos contemporaines',
    description:
      'Prix Nobel, présidente, juge, architecte, astronaute : des femmes de notre temps, dont les combats et les découvertes transforment encore le monde.',
    members: [
      {
        personId: 'person-malala-yousafzai',
        reason: 'Plus jeune lauréate du prix Nobel de la paix, en 2014, pour l’école des filles.',
      },
      {
        personId: 'person-katalin-kariko',
        reason:
          'Ses recherches sur l’ARN messager ont permis de nouveaux vaccins, dont celui contre le Covid-19.',
      },
      {
        personId: 'person-emmanuelle-charpentier',
        reason:
          'A inventé avec Jennifer Doudna la technique CRISPR-Cas9, prix Nobel de chimie 2020.',
      },
      {
        personId: 'person-wangari-maathai',
        reason: 'Fonde le Mouvement de la ceinture verte, prix Nobel de la paix en 2004.',
      },
      {
        personId: 'person-ellen-johnson-sirleaf',
        reason:
          'Première femme élue à la tête d’un État africain, présidente du Liberia de 2006 à 2018.',
      },
      {
        personId: 'person-ruth-bader-ginsburg',
        reason:
          'Plaide contre les discriminations sexistes, puis siège à la Cour suprême de 1993 à 2020.',
      },
      {
        personId: 'person-tu-youyou',
        reason: 'Identifie l’artémisinine contre le paludisme, prix Nobel de médecine en 2015.',
      },
      {
        personId: 'person-zaha-hadid',
        reason: 'Première femme à recevoir le prix Pritzker d’architecture, en 2004.',
      },
      {
        personId: 'person-toni-morrison',
        reason: 'Première Afro-Américaine prix Nobel de littérature, en 1993.',
      },
      {
        personId: 'person-mae-jemison',
        reason: 'Première femme afro-américaine à aller dans l’espace, en 1992.',
      },
      {
        personId: 'person-jane-goodall',
        reason: 'La première à observer que les chimpanzés utilisent des outils.',
      },
      {
        personId: 'person-agnes-varda',
        reason: 'Cinéaste de Cléo de 5 à 7, signataire du manifeste des 343.',
      },
    ],
  },
  {
    id: 'revolutionne',
    title: 'Elles ont révolutionné le monde',
    subtitle: 'Inventions, sciences, technologies et découvertes',
    description:
      'Les femmes dont les travaux ont transformé nos connaissances ou nos technologies.',
    members: [
      {
        personId: 'person-ada-lovelace',
        reason: 'A conçu et décrit le premier programme informatique publié.',
      },
      { personId: 'person-marie-curie', reason: 'La seule femme à avoir reçu deux prix Nobel.' },
      {
        personId: 'person-emmy-noether',
        reason: 'A révolutionné les théories des anneaux, des corps et des algèbres.',
      },
      {
        personId: 'person-lise-meitner',
        reason: 'A joué un rôle majeur dans la découverte de la fission nucléaire.',
      },
      {
        personId: 'person-hedy-lamarr',
        reason: 'A inventé avec George Antheil un moyen de coder des transmissions.',
      },
      {
        personId: 'person-grace-hopper',
        reason: 'Conceptrice du premier compilateur et du langage Cobol.',
      },
      {
        personId: 'person-rosalind-franklin',
        reason: 'A joué un rôle important dans la découverte de la structure de l’ADN.',
      },
      {
        personId: 'person-katherine-johnson',
        reason: 'Calculait et vérifiait les trajectoires de vols spatiaux de la NASA.',
      },
      {
        personId: 'person-jane-goodall',
        reason: 'A transformé la compréhension des rapports entre humains et animaux.',
      },
      {
        personId: 'person-tu-youyou',
        reason: 'A identifié l’artémisinine, le remède le plus efficace contre le paludisme.',
      },
      {
        personId: 'person-katalin-kariko',
        reason: 'Ses travaux sur l’ARN messager ont permis des vaccins d’un nouveau type.',
      },
      {
        personId: 'person-emmanuelle-charpentier',
        reason: 'A inventé avec Jennifer Doudna la technique CRISPR-Cas9.',
      },
    ],
  },
  {
    id: 'culture',
    title: 'Elles ont changé la culture',
    subtitle: 'Art, cinéma, littérature, musique et photographie',
    description:
      'Les créatrices qui ont transformé les mouvements artistiques, raconté d’autres histoires ou bousculé les conventions.',
    members: [
      {
        personId: 'person-artemisia-gentileschi',
        reason: 'L’une des premières femmes à peindre des sujets historiques et religieux.',
      },
      {
        personId: 'person-sofonisba-anguissola',
        reason: 'Portraitiste maniériste, appelée à la cour d’Espagne de Philippe II.',
      },
      {
        personId: 'person-rosa-bonheur',
        reason: 'Peintre animalière, de renommée considérable en France et aux États-Unis.',
      },
      {
        personId: 'person-emily-mary-osborn',
        reason: 'Expose à la Royal Academy à partir de 1851.',
      },
      {
        personId: 'person-mary-cassatt',
        reason: 'L’une des rares femmes artistes associées à l’impressionnisme.',
      },
      {
        personId: 'person-suzanne-valadon',
        reason: 'Modèle devenue peintre, qui peint notamment la nudité masculine et féminine.',
      },
      {
        personId: 'person-toni-morrison',
        reason: 'Romancière, prix Pulitzer en 1988 et prix Nobel de littérature en 1993.',
      },
      {
        personId: 'person-zaha-hadid',
        reason:
          'Architecte du déconstructivisme, de l’Aquatics Centre de Londres à l’opéra de Canton.',
      },
      {
        personId: 'person-agnes-varda',
        reason: 'Cinéaste de La Pointe courte, de Cléo de 5 à 7 et de L’une chante, l’autre pas.',
      },
    ],
  },
  {
    id: 'droits',
    title: 'Elles ont conquis des droits',
    subtitle: 'Libertés, égalité et luttes collectives',
    description:
      'Les femmes qui ont revendiqué, défendu ou contribué à faire évoluer les droits. Chaque conquête est collective : leur fiche précise leur rôle.',
    members: [
      {
        personId: 'person-olympe-de-gouges',
        reason: 'Rédige en 1791 la Déclaration des droits de la femme et de la citoyenne.',
      },
      {
        personId: 'person-hubertine-auclert',
        reason: 'Combat pour l’éligibilité des femmes et leur droit de vote.',
      },
      {
        personId: 'person-cecile-brunschvicg',
        reason: 'Préside l’Union française pour le suffrage des femmes à partir de 1924.',
      },
      {
        personId: 'person-louise-weiss',
        reason: 'Fonde en 1934 « Les femmes nouvelles » pour le droit de vote.',
      },
      {
        personId: 'person-marie-andree-lagroua-weill-halle',
        reason: 'Fonde en 1956, avec Évelyne Sullerot, la « Maternité heureuse ».',
      },
      { personId: 'person-simone-de-beauvoir', reason: 'Rédige le manifeste des 343 en 1971.' },
      {
        personId: 'person-gisele-halimi',
        reason: 'Défend les accusées du procès de Bobigny en 1972.',
      },
      {
        personId: 'person-simone-veil',
        reason: 'Ministre de la Santé, chargée de faire adopter la loi sur l’IVG.',
      },
      {
        personId: 'person-yvette-roudy',
        reason: 'À l’origine des lois sur le remboursement de l’IVG et l’égalité professionnelle.',
      },
      {
        personId: 'person-brigitte-gros',
        reason: 'Dépose en 1978 une proposition de loi pour mieux protéger les femmes du viol.',
      },
      {
        personId: 'person-agnes-varda',
        reason: 'Signe le manifeste des 343 et manifeste pour le droit à l’IVG en 1972.',
      },
      {
        personId: 'person-ruth-bader-ginsburg',
        reason:
          'Cofonde le Women’s Rights Project, qui défend plus de 300 cas de discriminations sexistes.',
      },
      {
        personId: 'person-malala-yousafzai',
        reason: 'Défend la scolarisation des filles face aux talibans pakistanais.',
      },
    ],
  },
  {
    id: 'idees',
    title: 'Elles ont changé nos idées',
    subtitle: 'Philosophie, pensée féministe et sciences sociales',
    description:
      'Les penseuses qui ont transformé notre compréhension du genre, du pouvoir, du travail et des rapports sociaux.',
    members: [
      { personId: 'person-simone-de-beauvoir', reason: 'Philosophe, romancière et essayiste.' },
    ],
  },
  {
    id: 'oubliees',
    title: 'Elles ont été oubliées',
    subtitle: 'Effet Matilda, contributions invisibilisées et histoire à redécouvrir',
    description:
      'Les femmes dont les travaux ont été minimisés, attribués à d’autres ou effacés des récits historiques.',
    caution:
      'Ne figurent ici que les femmes que la source de l’effet Matilda cite nommément. Leurs fiches détaillent les faits, sans raccourci.',
    members: [
      {
        personId: 'person-lise-meitner',
        reason:
          'Souvent citée comme l’un des cas les plus flagrants de scientifique ignorée par le comité Nobel.',
      },
      { personId: 'person-rosalind-franklin', reason: 'Citée comme exemple de l’effet Matilda.' },
      { personId: 'person-hedy-lamarr', reason: 'Citée comme exemple de l’effet Matilda.' },
      { personId: 'person-grace-hopper', reason: 'Citée comme exemple de l’effet Matilda.' },
    ],
  },
  {
    id: 'pionnieres',
    title: 'Elles étaient là avant tout le monde',
    subtitle: 'Pionnières et premières fois',
    description:
      'Les premières femmes à accéder à un domaine, à franchir une barrière ou à ouvrir une voie pour les suivantes.',
    members: [
      {
        personId: 'person-julie-victoire-daubie',
        reason: 'Première femme en France à obtenir le baccalauréat, le 17 août 1861.',
      },
      {
        personId: 'person-marie-curie',
        reason: 'Première femme à recevoir le prix Nobel et première à enseigner à la Sorbonne.',
      },
      { personId: 'person-ada-lovelace', reason: 'Pionnière de la science informatique.' },
      {
        personId: 'person-artemisia-gentileschi',
        reason: 'L’une des premières femmes à peindre des sujets historiques et religieux.',
      },
      {
        personId: 'person-toni-morrison',
        reason: 'Première Afro-Américaine à recevoir le prix Nobel de littérature.',
      },
      {
        personId: 'person-zaha-hadid',
        reason: 'Première femme à recevoir le prix Pritzker.',
      },
      {
        personId: 'person-ellen-johnson-sirleaf',
        reason: 'Première femme élue au suffrage universel à la tête d’un État africain.',
      },
      {
        personId: 'person-wangari-maathai',
        reason: 'Première femme africaine à recevoir le prix Nobel de la paix.',
      },
    ],
  },
  {
    id: 'quotidien',
    title: 'Elles ont fait tourner le monde',
    subtitle: 'Travail, économie, soin et vie quotidienne',
    description:
      'Les contributions collectives et souvent invisibles : travail domestique, agriculture, industrie, éducation, soin et organisation des sociétés.',
    members: [],
  },
  {
    id: 'histoire',
    title: 'Elles ont changé le cours de l’histoire',
    subtitle: 'Politique, résistances, mouvements sociaux et environnement',
    description:
      'Les femmes qui ont participé aux révolutions, aux mouvements de libération, aux résistances, aux combats anticoloniaux et aux mobilisations écologistes.',
    members: [
      {
        personId: 'person-olympe-de-gouges',
        reason: 'Femme politique, autrice de la Déclaration de 1791, guillotinée en 1793.',
      },
      {
        personId: 'person-cecile-brunschvicg',
        reason: 'Nommée sous-secrétaire d’État à l’Éducation nationale en 1936.',
      },
      { personId: 'person-simone-veil', reason: 'Magistrate et femme d’État.' },
      {
        personId: 'person-wangari-maathai',
        reason: 'Mobilise les femmes des villages kényans contre la déforestation.',
      },
      {
        personId: 'person-ellen-johnson-sirleaf',
        reason: 'Présidente du Liberia de 2006 à 2018, prix Nobel de la paix en 2011.',
      },
    ],
  },
  {
    id: 'limites',
    title: 'Elles ont repoussé les limites',
    subtitle: 'Exploration, sport, aventure et exploits',
    description:
      'Des femmes qui ont ouvert des voies dans des domaines où elles étaient exclues ou sous-représentées.',
    members: [
      {
        personId: 'person-mae-jemison',
        reason:
          'Première femme afro-américaine à aller dans l’espace, à bord de la navette Endeavour.',
      },
    ],
  },
];
