/** Initiales du prénom et du nom (« Simone de Beauvoir » → « SB »), pour un portrait absent. */
export function initials(name: string): string {
  const all = name.split(/\s+/).filter(Boolean);
  // Sans majuscule (« bell hooks »), on prend tous les mots.
  const capitalized = all.filter((word) => /^\p{Lu}/u.test(word));
  const words = capitalized.length > 0 ? capitalized : all;
  const first = words[0]?.[0] ?? '';
  const last = words.length > 1 ? (words[words.length - 1]?.[0] ?? '') : '';
  return `${first}${last}`.toUpperCase();
}
