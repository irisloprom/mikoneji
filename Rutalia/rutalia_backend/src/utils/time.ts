// src/utils/time.ts
export function parseDurationToMs(s: string, fallbackMs: number) {
  const m = s?.trim().match(/^(\d+)\s*([mhd])$/i);
  if (!m) return fallbackMs;
  const n = parseInt(m[1], 10);
  switch (m[2].toLowerCase()) {
    case 'm': return n * 60_000;
    case 'h': return n * 3_600_000;
    case 'd': return n * 86_400_000;
    default: return fallbackMs;
  }
}
