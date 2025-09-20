// src/utils/jwt.ts
import jwt from 'jsonwebtoken';
import { env } from '../config/env';

export type AccessPayload = {
  sub: string;                       // user id
  role?: 'guest'|'user'|'editor'|'admin';
  email?: string;
  provider?: 'local'|'google'|'guest';
  iat?: number; exp?: number;
};

export function signAccessToken(payload: AccessPayload, expires = env.jwtAccessExpires) {
  return jwt.sign(payload, env.jwtAccessSecret, { algorithm: 'HS256', expiresIn: expires });
}

export function verifyAccessToken(token: string): AccessPayload {
  return jwt.verify(token, env.jwtAccessSecret, { algorithms: ['HS256'] }) as AccessPayload;
}
