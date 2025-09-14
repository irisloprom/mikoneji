export const normalize = (s: string) =>
  s.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();

export const matchesAny = (txt: string, opts: string[]) => {
  const t = normalize(txt);
  return opts.some(o => normalize(o) === t);
};
