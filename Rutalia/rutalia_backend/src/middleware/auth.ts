// src/middleware/auth.ts
import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt.js';

type JwtUser = {
  sub: string;              // user id
  role?: 'guest' | 'user' | 'editor' | 'admin';
  email?: string;
  provider?: 'local' | 'google' | 'guest';
};

// req.user viene tipado desde src/types/express.d.ts,
// si no lo tienes, añade:
// declare global { namespace Express { interface Request { user?: JwtUser } } }

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No autorizado' });
  }
  const token = header.slice('Bearer '.length).trim();
  try {
    const payload = verifyAccessToken(token) as JwtUser;
    if (!payload?.sub) return res.status(401).json({ error: 'Token inválido' });
    req.user = {
      sub: payload.sub,
      role: payload.role ?? 'user',
      email: payload.email,
      provider: payload.provider
    };
    next();
  } catch {
    return res.status(401).json({ error: 'Token inválido' });
  }
}

export function requireRole(...allowed: Array<JwtUser['role']>) {
  return (req: Request, res: Response, next: NextFunction) => {
    const role = req.user?.role ?? 'guest';
    if (!allowed.includes(role)) {
      return res.status(403).json({ error: 'Permisos insuficientes' });
    }
    next();
  };
}
