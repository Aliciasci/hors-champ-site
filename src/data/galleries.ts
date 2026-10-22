import { img } from '@/data/images';
import type { Artwork } from '@/types';

/**
 * Galeries des artistes : leurs œuvres, seulement si elles sont dans le domaine public (artistes
 * mortes depuis plus de 70 ans) et que la reproduction l'est aussi (domaine public ou CC0).
 * Titre, date et musée viennent de Wikidata ; licence et page de l'image, de Wikimedia Commons
 * (consultés le 2026-10-22). Images redimensionnées à 900 px. Les reproductions sous licence
 * CC BY-SA ou CC BY 4.0 sont écartées, comme ailleurs sur le site.
 */
export const galleries: Record<string, Artwork[]> = {
  'person-suzanne-valadon': [
    {
      image: img('artworks/gallery-suzanne-valadon-la-poupee-delaissee.jpg'),
      alt: 'Peinture : une femme assise sur un lit essuie une adolescente nue ; une poupée gît sur le tapis.',
      title: 'La Poupée délaissée',
      artist: 'Suzanne Valadon',
      date: '1921',
      holder: 'National Museum of Women in the Arts',
      license: 'Domaine public',
      sourceUrl:
        'https://commons.wikimedia.org/wiki/File:La_Poup%C3%A9e_abandonn%C3%A9e,_par_Suzanne_Valadon.jpg',
    },
    {
      image: img('artworks/gallery-suzanne-valadon-la-chambre-bleue.jpg'),
      alt: 'Peinture : une femme allongée sur un lit à motifs bleus, en pantalon rayé vert et blanc, des livres posés près d’elle.',
      title: 'La Chambre bleue',
      artist: 'Suzanne Valadon',
      date: '1923',
      holder: "Musée national d'Art moderne",
      license: 'Domaine public',
      sourceUrl:
        'https://commons.wikimedia.org/wiki/File:(Barcelona)_La_chambre_bleue_-_Suzanne_Valadon.jpg',
    },
    {
      image: img('artworks/gallery-suzanne-valadon-la-joie-de-vivre.jpg'),
      alt: 'Peinture : des baigneuses nues dans un paysage boisé, observées par un homme à l’écart.',
      title: 'La Joie de vivre',
      artist: 'Suzanne Valadon',
      date: '1911',
      holder: 'Metropolitan Museum of Art',
      license: 'CC0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Joy_of_Life_MET_DT356454.jpg',
    },
    {
      image: img('artworks/gallery-suzanne-valadon-portrait-d-erik-satie.jpg'),
      alt: 'Portrait peint d’Erik Satie, barbu, en chapeau noir et lorgnon.',
      title: "Portrait d'Erik Satie",
      artist: 'Suzanne Valadon',
      date: '1892',
      holder: "Musée national d'Art moderne",
      license: 'Domaine public',
      sourceUrl:
        'https://commons.wikimedia.org/wiki/File:Suzanne_Valadon_-_Portrait_d%27Erik_Satie.jpg',
    },
  ],
  'person-mary-cassatt': [
    {
      image: img('artworks/gallery-mary-cassatt-le-bain.jpg'),
      alt: 'Peinture : une femme lave les pieds d’une petite fille assise sur ses genoux, au-dessus d’une bassine.',
      title: 'Le Bain',
      artist: 'Mary Cassatt',
      date: '1893',
      holder: 'Art Institute of Chicago',
      license: 'Domaine public',
      sourceUrl:
        'https://commons.wikimedia.org/wiki/File:Mary_Cassatt_-_The_Child%27s_Bath_-_Google_Art_Project.jpg',
    },
    {
      image: img('artworks/gallery-mary-cassatt-petite-fille-dans-un-fauteuil-bleu.jpg'),
      alt: 'Peinture : une petite fille affalée dans un grand fauteuil bleu turquoise, un chien endormi dans le fauteuil voisin.',
      title: 'Petite Fille dans un fauteuil bleu',
      artist: 'Mary Cassatt',
      date: '1878',
      holder: 'National Gallery of Art',
      license: 'Domaine public',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Cassat_-_Blue_Armchair_NGA.jpg',
    },
    {
      image: img('artworks/gallery-mary-cassatt-femme-dans-une-loge.jpg'),
      alt: 'Peinture : une jeune femme rousse en robe rose et collier de perles, assise dans une loge de théâtre.',
      title: 'Femme dans une loge',
      artist: 'Mary Cassatt',
      date: '1879',
      holder: 'Philadelphia Museum of Art',
      license: 'Domaine public',
      sourceUrl:
        'https://commons.wikimedia.org/wiki/File:Mary_Stevenson_Cassatt,_American_-_Woman_with_a_Pearl_Necklace_in_a_Loge_-_Google_Art_Project.jpg',
    },
    {
      image: img('artworks/gallery-mary-cassatt-la-tasse-de-the.jpg'),
      alt: 'Peinture : une femme en robe rose et chapeau, assise dans un fauteuil, une tasse de thé à la main.',
      title: 'La Tasse de thé',
      artist: 'Mary Cassatt',
      date: '1880',
      holder: 'Metropolitan Museum of Art',
      license: 'Domaine public',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Cassatt_Mary_The_Cup_of_Tea_1880.jpg',
    },
    {
      image: img('artworks/gallery-mary-cassatt-promenade-en-barque.jpg'),
      alt: 'Peinture : un homme rame dans une barque face à une femme qui tient un enfant, sur une eau bleu profond.',
      title: 'Promenade en barque',
      artist: 'Mary Cassatt',
      date: '1893',
      holder: 'National Gallery of Art',
      license: 'Domaine public',
      sourceUrl:
        'https://commons.wikimedia.org/wiki/File:Mary_Cassatt_-_The_Boating_Party_-_Google_Art_Project.jpg',
    },
    {
      image: img('artworks/gallery-mary-cassatt-jeune-mere-cousant.jpg'),
      alt: 'Peinture : une femme coud près d’une fenêtre ; une fillette appuyée sur ses genoux regarde vers nous.',
      title: 'Jeune Mère cousant',
      artist: 'Mary Cassatt',
      date: '1900',
      holder: 'Metropolitan Museum of Art',
      license: 'CC0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Young_Mother_Sewing_MET_DP139632.jpg',
    },
  ],
  'person-artemisia-gentileschi': [
    {
      image: img('artworks/gallery-artemisia-gentileschi-judith-decapitant-holopherne.jpg'),
      alt: 'Peinture : deux femmes maintiennent un homme sur un lit ; l’une lui tranche la gorge avec une épée.',
      title: 'Judith décapitant Holopherne',
      artist: 'Artemisia Gentileschi',
      date: '1613',
      holder: 'musée de Capodimonte',
      license: 'Domaine public',
      sourceUrl:
        'https://commons.wikimedia.org/wiki/File:Artemisia_Gentileschi_-_Judith_Beheading_Holofernes_-_WGA8563.jpg',
    },
    {
      image: img('artworks/gallery-artemisia-gentileschi-judith-et-sa-servante.jpg'),
      alt: 'Peinture : deux femmes se retournent, l’une tenant une épée sur l’épaule, l’autre un panier où repose une tête.',
      title: 'Judith et sa Servante',
      artist: 'Artemisia Gentileschi',
      date: '1610',
      holder: 'Galerie Palatine',
      license: 'Domaine public',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Gentileschi_judith1.jpg',
    },
    {
      image: img('artworks/gallery-artemisia-gentileschi-suzanne-et-les-vieillards.jpg'),
      alt: 'Peinture : une jeune femme nue assise se détourne de deux hommes qui chuchotent, penchés au-dessus d’elle.',
      title: 'Suzanne et les Vieillards',
      artist: 'Artemisia Gentileschi',
      date: '1610',
      holder: 'château Weissenstein',
      license: 'Domaine public',
      sourceUrl:
        'https://commons.wikimedia.org/wiki/File:Susanna_and_the_Elders_(1610),_Artemisia_GentileschiFXD.jpg',
    },
    {
      image: img(
        'artworks/gallery-artemisia-gentileschi-autoportrait-en-allegorie-de-la-peinture.jpg',
      ),
      alt: 'Autoportrait peint : une femme en robe verte, le bras levé, peint sur une toile hors du cadre.',
      title: 'Autoportrait en allégorie de la Peinture',
      artist: 'Artemisia Gentileschi',
      date: '1630',
      holder: 'Royal Collection',
      license: 'Domaine public',
      sourceUrl:
        'https://commons.wikimedia.org/wiki/File:Self-Portrait_as_the_Allegory_of_Painting_(La_Pittura)_-_Artemisia_Gentileschi.jpg',
    },
    {
      image: img('artworks/gallery-artemisia-gentileschi-danae.jpg'),
      alt: 'Peinture : une femme nue allongée sur un lit aux draps rouges et blancs, une servante à l’arrière-plan.',
      title: 'Danaé',
      artist: 'Artemisia Gentileschi',
      date: '1612',
      holder: "musée d'Art de Saint-Louis",
      license: 'Domaine public',
      sourceUrl:
        'https://commons.wikimedia.org/wiki/File:Artemisia_Gentileschi_-_Dana%C3%AB_-_93-1986_-_Saint_Louis_Art_Museum.jpg',
    },
    {
      image: img('artworks/gallery-artemisia-gentileschi-esther-et-assuerus.jpg'),
      alt: 'Peinture : à gauche, une femme en robe jaune défaille, soutenue par deux servantes ; à droite, un roi assis sur une estrade.',
      title: 'Esther et Assuérus',
      artist: 'Artemisia Gentileschi',
      date: '1629',
      holder: 'Metropolitan Museum of Art',
      license: 'Domaine public',
      sourceUrl:
        'https://commons.wikimedia.org/wiki/File:Gentileschi,_Artemisia_-_Esther_before_Ahasuerus_-_c._1628%E2%80%931635.jpg',
    },
  ],
  'person-sofonisba-anguissola': [
    {
      image: img('artworks/gallery-sofonisba-anguissola-partie-d-echecs.jpg'),
      alt: 'Peinture : trois jeunes filles autour d’un échiquier, une servante âgée les observe, un paysage au fond.',
      title: "Partie d'échecs",
      artist: 'Sofonisba Anguissola',
      date: '1555',
      holder: 'musée national de Poznań',
      license: 'Domaine public',
      sourceUrl:
        'https://commons.wikimedia.org/wiki/File:The_Chess_Game_(Sofonisba_Anguissola)_1555_(4096x3236px).jpg',
    },
    {
      image: img('artworks/gallery-sofonisba-anguissola-autoportrait.jpg'),
      alt: 'Miniature ovale : une jeune femme tient un médaillon orné d’un monogramme entrelacé.',
      title: 'Autoportrait',
      artist: 'Sofonisba Anguissola',
      date: '1556',
      holder: 'musée des Beaux-Arts de Boston',
      license: 'Domaine public',
      sourceUrl:
        'https://commons.wikimedia.org/wiki/File:Sofonisba_Anguissola_-_Self-Portrait_-_c._1556.jpg',
    },
    {
      image: img(
        'artworks/gallery-sofonisba-anguissola-portrait-d-amilcare-minerva-et-astrubale.jpg',
      ),
      alt: 'Peinture : un homme âgé assis entre une jeune femme et un garçon qu’il tient par la main, un petit chien à leurs pieds.',
      title: "Portrait d'Amilcare, Minerva et Astrubale Anguissola",
      artist: 'Sofonisba Anguissola',
      date: '1559',
      holder: 'Nivaagaards Malerisamling',
      license: 'CC0',
      sourceUrl:
        'https://commons.wikimedia.org/wiki/File:Sofonisba_Anguissola,_Portr%C3%A6tgruppe_med_kunstnerens_fader_Amilcare_Anguissola_og_hendes_s%C3%B8skende_Minerva_og_Astrubale,_ca._1559,_0001NMK,_Nivaagaards_Malerisamling.jpg',
    },
    {
      image: img('artworks/gallery-sofonisba-anguissola-portrait-de-massimiliano-stampa.jpg'),
      alt: 'Portrait peint en pied : un jeune garçon vêtu de noir, une main sur une colonne, un chien couché à ses pieds.',
      title: 'Portrait de Massimiliano Stampa',
      artist: 'Sofonisba Anguissola',
      date: '1557',
      holder: 'Walters Art Museum',
      license: 'Domaine public',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:MassimilianoStampa.jpg',
    },
  ],
  'person-rosa-bonheur': [
    {
      image: img('artworks/gallery-rosa-bonheur-le-marche-aux-chevaux.jpg'),
      alt: 'Peinture : des chevaux blancs et bais cabrés, menés par des cavaliers sur une place bordée d’arbres.',
      title: 'Le Marché aux chevaux',
      artist: 'Rosa Bonheur',
      date: '1853',
      holder: 'Metropolitan Museum of Art',
      license: 'Domaine public',
      sourceUrl:
        'https://commons.wikimedia.org/wiki/File:Rosa_Bonheur,_The_Horse_Fair,_1852%E2%80%9355.jpg',
    },
    {
      image: img('artworks/gallery-rosa-bonheur-labourage-nivernais.jpg'),
      alt: 'Peinture : deux attelages de bœufs labourent un champ sous un ciel clair.',
      title: 'Labourage nivernais',
      artist: 'Rosa Bonheur',
      date: '1849',
      holder: "musée d'Orsay",
      license: 'Domaine public',
      sourceUrl:
        'https://commons.wikimedia.org/wiki/File:Rosa_Bonheur_-_Ploughing_in_Nevers_-_Google_Art_Project.jpg',
    },
    {
      image: img('artworks/gallery-rosa-bonheur-la-foulaison-du-ble-en-camargue.jpg'),
      alt: 'Peinture : un homme mène au fouet des chevaux qui tournent sur une aire de terre battue.',
      title: 'La Foulaison du blé en Camargue',
      artist: 'Rosa Bonheur',
      date: '1864',
      holder: "musée d'Orsay",
      license: 'Domaine public',
      sourceUrl:
        'https://commons.wikimedia.org/wiki/File:La_Foulaison_du_bl%C3%A9_en_Camargue_-_Rosa_Bonheur.jpg',
    },
  ],
  'person-emily-mary-osborn': [
    {
      image: img('artworks/gallery-emily-mary-osborn-nameless-and-friendless.jpg'),
      alt: 'Peinture : une jeune femme en deuil, accompagnée d’un garçon, présente un tableau à un marchand, sous le regard des clients.',
      title: 'Nameless and Friendless',
      artist: 'Emily Mary Osborn',
      date: '1857',
      holder: 'Tate Britain',
      license: 'Domaine public',
      sourceUrl:
        'https://commons.wikimedia.org/wiki/File:Emily_Mary_Osborn_-_Nameless_and_Friendless._%22The_rich_man%27s_wealth_is_his_strong_city,_etc.%22_-_Proverbs,_x,_15_-_Google_Art_Project.jpg',
    },
    {
      image: img('artworks/gallery-emily-mary-osborn-the-governess.jpg'),
      alt: 'Peinture : une gouvernante en robe noire se tient debout, à l’écart d’une mère et d’enfants richement vêtus.',
      title: 'The Governess',
      artist: 'Emily Mary Osborn',
      date: '1860',
      holder: "centre d'art britannique de Yale",
      license: 'Domaine public',
      sourceUrl:
        'https://commons.wikimedia.org/wiki/File:Emily_Mary_Osborn_-_The_Governess_-_Google_Art_Project.jpg',
    },
    {
      image: img('artworks/gallery-emily-mary-osborn-the-bal-maidens.jpg'),
      alt: 'Peinture : trois jeunes femmes en coiffe blanche marchent sur un chemin, un enfant derrière elles.',
      title: 'The Bal Maidens',
      artist: 'Emily Mary Osborn',
      date: '1870',
      holder: 'musée national de Cardiff',
      license: 'Domaine public',
      sourceUrl:
        'https://commons.wikimedia.org/wiki/File:Emily_Mary_Osborn_-_The_Bal_Maidens_-_NMW_A_5012_-_National_Museum_Cardiff.jpg',
    },
    {
      image: img('artworks/gallery-emily-mary-osborn-barbara-bodichon.jpg'),
      alt: 'Portrait peint : une femme en robe verte assise près d’un chevalet, un carnet sur les genoux.',
      title: 'Portrait de Barbara Bodichon',
      artist: 'Emily Mary Osborn',
      date: 'date inconnue',
      holder: 'Girton College',
      license: 'Domaine public',
      sourceUrl:
        'https://commons.wikimedia.org/wiki/File:Emily_Mary_Osborn_-_Barbara_Bodichon_-_142_-_Girton_College.jpg',
    },
  ],
};
