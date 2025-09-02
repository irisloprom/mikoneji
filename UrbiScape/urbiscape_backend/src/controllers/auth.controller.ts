import { Request, Response } from 'express';
import { z } from 'zod';
import { loginLocal, registerLocal, loginWithGoogle, refreshSession, logout, loginAsGuest } from '../services/auth.service.js';
import UAParser from 'ua-parser-js';

function clientMeta(req: Request) {
  const ua = new UAParser(req.headers['user-agent'] || '').getResult();
  return {
    userAgent: `${ua.browser.name ?? 'Unknown'} ${ua.browser.version ?? ''} / ${ua.os.name ?? ''}`,
    ip: (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || req.socket.remoteAddress || undefined
  };
}

export async function postRegister(req: Request, res: Response) {
  const schema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
    displayName: z.string().optional()
  });
  const data = schema.parse(req.body);
  const { user, tokens } = await registerLocal(data.email, data.password, data.displayName);
  res.status(201).json({ user: sanitize(user), tokens });
}

export async function postLogin(req: Request, res: Response) {
  const schema = z.object({
    email: z.string().email(),
    password: z.string().min(8)
  });
  const data = schema.parse(req.body);
  const meta = clientMeta(req);
  const { user, tokens } = await loginLocal(data.email, data.password, meta);
  res.json({ user: sanitize(user), tokens });
}

export async function postGoogle(req: Request, res: Response) {
  const schema = z.object({
    idToken: z.string(),
    displayName: z.string().optional()
  });
  const data = schema.parse(req.body);
  const meta = clientMeta(req);
  const { user, tokens } = await loginWithGoogle(data.idToken, data.displayName, meta);
  res.json({ user: sanitize(user), tokens });
}

export async function postGuest(req: Request, res: Response) {
  const schema = z.object({
    displayName: z.string().optional()
  });
  const data = schema.parse(req.body ?? {});
  const meta = clientMeta(req);
  const { user, tokens } = await loginAsGuest(data.displayName ?? 'Guest', meta);
  res.json({ user: sanitize(user), tokens });
}

export async function postRefresh(req: Request, res: Response) {
  const schema = z.object({ refreshToken: z.string() });
  const data = schema.parse(req.body);
  const meta = clientMeta(req);
  const tokens = await refreshSession(data.refreshToken, meta);
  res.json(tokens);
}

export async function postLogout(req: Request, res: Response) {
  const schema = z.object({ refreshToken: z.string() });
  const data = schema.parse(req.body);
  await logout(data.refreshToken);
  res.json({ ok: true });
}

// esqueletos reset password (pendiente integrar correo)
export async function postForgotPassword(req: Request, res: Response) {
  // generar token y enviarlo por email con provider (Sendgrid, SES...)
  res.json({ ok: true, message: 'Si el email existe, enviaremos instrucciones.' });
}
export async function postResetPassword(req: Request, res: Response) {
  // validar token de reset y cambiar contraseña
  res.json({ ok: true });
}

function sanitize(user: any) {
  const { passwordHash, __v, ...clean } = user.toObject ? user.toObject() : user;
  return clean;
}
