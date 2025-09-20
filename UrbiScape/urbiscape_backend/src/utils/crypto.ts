// src/utils/crypto.ts
import crypto from 'crypto';
import { randomBytes, createHash, timingSafeEqual } from 'node:crypto';


/** Hex aleatorio (2*bytes caracteres). 32 bytes => 64 hex chars. */
export function randomHex(bytes = 32): string {
  return randomBytes(bytes).toString('hex');
}

/** Token aleatorio (alias de randomHex). */
export const randomToken = randomHex;

/** Variante URL-safe (útil para links en emails). */
export function randomTokenUrlSafe(bytes = 32): string {
  return randomBytes(bytes).toString('base64url'); // Node 16+
}

/** SHA-256 en hex. */
export function sha256(input: string): string {
  return createHash('sha256').update(input).digest('hex');
}

/** Hash de token (alias de sha256). */
export const hashToken = sha256;

/** Comparación en tiempo constante (utf8). */
export function secureCompare(a: string, b: string): boolean {
  const ab = Buffer.from(a, 'utf8');
  const bb = Buffer.from(b, 'utf8');
  if (ab.length !== bb.length) return false;
  return timingSafeEqual(ab, bb);
}

/** (Opcional) Comparación constante si los valores están en HEX. */
export function secureCompareHex(aHex: string, bHex: string): boolean {
  if (aHex.length !== bHex.length) return false;
  const ab = Buffer.from(aHex, 'hex');
  const bb = Buffer.from(bHex, 'hex');
  return timingSafeEqual(ab, bb);
}
