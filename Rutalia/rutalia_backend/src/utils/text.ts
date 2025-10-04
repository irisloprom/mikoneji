// src/utils/text.ts
export const stripDiacritics = (s: string) =>
  s.normalize('NFKD').replace(/[\u0300-\u036f]/g, '');

export const normalize = (s: string) =>
  stripDiacritics(s).toLowerCase().trim().replace(/\s+/g, ' ');

export function matchesAny(txt: string, opts: string[]) {
  const t = normalize(txt);
  return opts.some(o => normalize(o) === t);
}
