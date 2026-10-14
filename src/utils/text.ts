/** Minuscule, sans accents ni ponctuation superflue : pour la recherche locale. */
export function normalizeForSearch(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[’'«»"]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function pluralize(count: number, singular: string, plural: string): string {
  return `${count} ${count > 1 ? plural : singular}`;
}

export function formatMinutes(minutes: number): string {
  return `${minutes} min`;
}

const dateFormatter = new Intl.DateTimeFormat('fr-FR', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

/** Formate une date ISO (AAAA-MM-JJ ou horodatage complet). Renvoie la chaîne brute si invalide. */
export function formatDate(iso: string): string {
  const date = new Date(iso.length === 10 ? `${iso}T12:00:00` : iso);
  return Number.isNaN(date.getTime()) ? iso : dateFormatter.format(date);
}
