// src/controllers/auth.controller.ts
import { Request, Response } from 'express';
import { z } from 'zod';
import UAParser from 'ua-parser-js';
import {
  loginLocal,
  registerLocal,
  loginWithGoogle,
  refreshSession,
  logout,
  loginAsGuest
} from '../services/auth.service.js';

function clientMeta(req: Request) {
  const ua = new UAParser(req.headers['user-agent'] || '').getResult();
  return {
    userAgent: `${ua.browser.name ?? 'Unknown'} ${ua.browser.version ?? ''} / ${ua.os.name ?? ''}`,
    ip: (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || req.socket.remoteAddress || undefined
  };
}

function sanitize(user: any) {
  const { passwordHash, __v, ...clean } = user.toObject ? user.toObject() : user;
  return clean;
}

export async function postRegister(req: Request, res: Response) {
  const schema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
    displayName: z.string().min(2).max(80).optional()
  });
  const body = schema.parse(req.body);
  const out = await registerLocal(body, clientMeta(req));
  res.status(201).json({ user: sanitize(out.user), tokens: out.tokens });
}

export async function postLogin(req: Request, res: Response) {
  const schema = z.object({
    email: z.string().email(),
    password: z.string().min(8)
  });
  const body = schema.parse(req.body);
  const out = await loginLocal(body, clientMeta(req));
  res.json({ user: sanitize(out.user), tokens: out.tokens });
}

export async function postLoginGoogle(req: Request, res: Response) {
  const schema = z.object({ idToken: z.string().min(10) });
  const body = schema.parse(req.body);
  const out = await loginWithGoogle(body, clientMeta(req));
  res.json({ user: sanitize(out.user), tokens: out.tokens });
}

export async function postLoginGuest(_req: Request, res: Response) {
  const out = await loginAsGuest();
  res.json({ user: sanitize(out.user), tokens: out.tokens });
}

export async function postRefresh(req: Request, res: Response) {
  const schema = z.object({ refreshToken: z.string().min(10) });
  const body = schema.parse(req.body);
  const out = await refreshSession(body.refreshToken);
  res.json({ tokens: out.tokens });
}

export async function postLogout(req: Request, res: Response) {
  const schema = z.object({ refreshToken: z.string().min(10) });
  const body = schema.parse(req.body);
  await logout(body.refreshToken);
  res.json({ ok: true });
}

// Esqueletos reset password (pendiente proveedor de correo)
export async function postForgotPassword(_req: Request, res: Response) {
  res.json({ ok: true, message: 'Si el email existe, enviaremos instrucciones.' });
}
export async function postResetPassword(_req: Request, res: Response) {
  res.json({ ok: true });
}
