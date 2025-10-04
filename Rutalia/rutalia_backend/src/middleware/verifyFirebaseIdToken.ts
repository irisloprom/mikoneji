// src/middleware/verifyFirebaseIdToken.ts
import { Request, Response, NextFunction } from 'express';
import { verifyFirebaseIdToken } from '../config/firebase.js';

export async function verifyFirebaseIdTokenMw(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No autorizado' });
  }
  const idToken = header.slice('Bearer '.length).trim();
  try {
    const decoded = await verifyFirebaseIdToken(idToken);
    // lo colocamos en req.firebaseUser; no sustituye a req.user
    (req as any).firebaseUser = decoded;
    next();
  } catch {
    return res.status(401).json({ error: 'Firebase token inválido' });
  }
}
