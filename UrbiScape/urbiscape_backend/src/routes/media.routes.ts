import { Router } from 'express';
import crypto from 'node:crypto';
import { z } from 'zod';

import { requireAuth } from '../middleware/auth';
import { verifyLimiter } from '../middleware/rateLimiter'; // si tu export se llama distinto, ajusta
import { wrap } from '../utils/wrap';
import { cloudFolder } from '../config/cloudinary';

export const mediaRouter = Router();

/**
 * DEV LEGACY:
 * GET /media/cloudinary-signature
 * Firma solo con timestamp (sin folder) — bloqueado en producción.
 */
mediaRouter.get(
  '/cloudinary-signature',
  wrap((req, res) => {
    if (process.env.NODE_ENV === 'production') {
      return res.status(403).json({ error: 'No disponible en producción' });
    }
    const { CLOUDINARY_API_SECRET, CLOUDINARY_API_KEY, CLOUDINARY_CLOUD_NAME } = process.env;
    if (!CLOUDINARY_API_SECRET || !CLOUDINARY_API_KEY || !CLOUDINARY_CLOUD_NAME) {
      return res.status(500).json({ error: 'Cloudinary no configurado' });
    }
    const timestamp = Math.floor(Date.now() / 1000);
    const toSign = `timestamp=${timestamp}${CLOUDINARY_API_SECRET}`;
    const signature = crypto.createHash('sha1').update(toSign).digest('hex');
    res.json({ cloudName: CLOUDINARY_CLOUD_NAME, apiKey: CLOUDINARY_API_KEY, timestamp, signature });
  })
);

/**
 * PROD/DEV RECOMENDADO:
 * POST /media/signature  { path: string, publicId?: string }
 * Devuelve firma para subir al folder: "rutalia/<env>/<path_saneado>"
 * Requiere usuario autenticado y rate limit.
 */
const bodySchema = z.object({
  path: z.string().min(1),
  publicId: z.string().min(1).optional()
});

// sanea el path para evitar `..`, dobles slashes o caracteres extraños
function sanitizePath(input: string) {
  return input
    .split('/')
    .map(seg => seg.trim())
    .filter(Boolean)
    .filter(seg => /^[a-zA-Z0-9_\-]+$/.test(seg)) // solo seguro
    .join('/');
}

mediaRouter.post(
  '/signature',
  requireAuth,
  verifyLimiter,
  wrap((req, res) => {
    const { CLOUDINARY_API_SECRET, CLOUDINARY_API_KEY, CLOUDINARY_CLOUD_NAME } = process.env;
    if (!CLOUDINARY_API_SECRET || !CLOUDINARY_API_KEY || !CLOUDINARY_CLOUD_NAME) {
      return res.status(500).json({ error: 'Cloudinary no configurado' });
    }

    const parsed = bodySchema.parse(req.body);
    const safePath = sanitizePath(parsed.path); // e.g. attempts/671abc/milestone-3
    if (!safePath) return res.status(400).json({ error: 'path inválido' });

    const folder = cloudFolder([safePath]); // => rutalia/<env>/<safePath>
    const timestamp = Math.floor(Date.now() / 1000);

    const params: Record<string, string | number> = { folder, timestamp };
    if (parsed.publicId) params.public_id = parsed.publicId;

    // firma Cloudinary (params ordenados)
    const toSign =
      Object.keys(params)
        .sort()
        .map(k => `${k}=${params[k]}`)
        .join('&') + CLOUDINARY_API_SECRET;

    const signature = crypto.createHash('sha1').update(toSign).digest('hex');

    res.json({
      cloudName: CLOUDINARY_CLOUD_NAME,
      apiKey: CLOUDINARY_API_KEY,
      folder,
      timestamp,
      signature,
      ...(parsed.publicId ? { public_id: parsed.publicId } : {})
    });
  })
);
