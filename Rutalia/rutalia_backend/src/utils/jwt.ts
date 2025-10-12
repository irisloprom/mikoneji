// src/utils/jwt.ts
import jwt, { SignOptions } from 'jsonwebtoken';
import { env } from '../config/env.js';

export type AccessPayload = {
  sub: string;                       // user id
  role?: 'guest'|'user'|'editor'|'admin';
  email?: string;
  provider?: 'local'|'google'|'guest';
  iat?: number; exp?: number;
};

export function signAccessToken(payload: AccessPayload, expires = env.jwtAccessExpires) {
  const options: SignOptions = { algorithm: 'HS256', expiresIn: expires as SignOptions['expiresIn'] };
  return jwt.sign(payload, env.jwtAccessSecret, options);
}

export function verifyAccessToken(token: string): AccessPayload {
  return jwt.verify(token, env.jwtAccessSecret, { algorithms: ['HS256'] }) as AccessPayload;
}
