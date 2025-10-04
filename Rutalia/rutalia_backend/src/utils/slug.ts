// src/utils/slug.ts
export function slugify(input: string) {
  return input
    .normalize('NFKD').replace(/[\u0300-\u036f]/g, '')  // quita tildes
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')                        // no alfanum -> guión
    .replace(/^-+|-+$/g, '')                            // recorta guiones extremos
    .slice(0, 80);                                      // límite sano
}
