import { Router } from 'express';
import crypto from 'crypto';

export const mediaRouter = Router();
// firma simple para direct upload (unsigned preset opcional)
mediaRouter.get('/cloudinary-signature', (_req, res) => {
  const { CLOUDINARY_API_SECRET, CLOUDINARY_API_KEY, CLOUDINARY_CLOUD_NAME } = process.env;
  if (!CLOUDINARY_API_SECRET || !CLOUDINARY_API_KEY || !CLOUDINARY_CLOUD_NAME) {
    return res.status(500).json({ error: 'Cloudinary no configurado' });
  }
  const timestamp = Math.floor(Date.now()/1000);
  const toSign = `timestamp=${timestamp}${CLOUDINARY_API_SECRET}`;
  const signature = crypto.createHash('sha1').update(toSign).digest('hex');
  res.json({ cloudName: CLOUDINARY_CLOUD_NAME, apiKey: CLOUDINARY_API_KEY, timestamp, signature });
});
