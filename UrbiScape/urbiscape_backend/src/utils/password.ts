// src/utils/password.ts
import bcrypt from 'bcrypt';

const ROUNDS = 12; // si quieres, permite override con env

export async function hashPassword(plain: string) {
  return bcrypt.hash(plain, ROUNDS);
}

export async function verifyPassword(plain: string, hash: string) {
  return bcrypt.compare(plain, hash);
}
