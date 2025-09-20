import { Router } from 'express';
import crypto from 'crypto';
import { cloudFolder } from '../config/cloudinary';

export const mediaRouter = Router();

/**
 * Compatibilidad dev (antiguo):
 * GET /media/cloudinary-signature
 * Firma sólo con timestamp (sin folder). Úsalo sólo en desarrollo.
 */
mediaRouter.get('/cloudinary-signature', (_req, res) => {
  const { CLOUDINARY_API_SECRET, CLOUDINARY_API_KEY, CLOUDINARY_CLOUD_NAME } = process.env;
  if (!CLOUDINARY_API_SECRET || !CLOUDINARY_API_KEY || !CLOUDINARY_CLOUD_NAME) {
    return res.status(500).json({ error: 'Cloudinary no configurado' });
  }
  const timestamp = Math.floor(Date.now() / 1000);
  const toSign = `timestamp=${timestamp}${CLOUDINARY_API_SECRET}`;
  const signature = crypto.createHash('sha1').update(toSign).digest('hex');
  res.json({ cloudName: CLOUDINARY_CLOUD_NAME, apiKey: CLOUDINARY_API_KEY, timestamp, signature });
});

/**
 * Producción recomendado:
 * POST /media/signature  { path?: string, publicId?: string }
 * Devuelve firma incluyendo carpeta "rutalia/<env>/<path>"
 */
mediaRouter.post('/signature', (req, res) => {
  const { CLOUDINARY_API_SECRET, CLOUDINARY_API_KEY, CLOUDINARY_CLOUD_NAME } = process.env;
  if (!CLOUDINARY_API_SECRET || !CLOUDINARY_API_KEY || !CLOUDINARY_CLOUD_NAME) {
    return res.status(500).json({ error: 'Cloudinary no configurado' });
  }

  const folder = cloudFolder([req.body?.path]); // e.g. attempts/<id>/milestone-3
  const timestamp = Math.floor(Date.now() / 1000);

  const params: Record<string, string | number> = { folder, timestamp };
  if (req.body?.publicId) params.public_id = req.body.publicId;

  const toSign = Object.keys(params)
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
    ...(req.body?.publicId ? { public_id: req.body.publicId } : {})
  });
});

function wrap(handler: any) {
  return (req, res, next) => Promise.resolve(handler(req, res)).catch(next);
}
