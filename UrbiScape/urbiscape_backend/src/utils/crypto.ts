import crypto from 'crypto';

export function randomToken(size = 64) {
  return crypto.randomBytes(size).toString('hex');
}
export async function hashToken(token: string) {
  return crypto.createHash('sha256').update(token).digest('hex');
}
