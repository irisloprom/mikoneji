// src/controllers/attempt.controller.ts
import { Request, Response } from 'express';
import { Attempt } from '../models/Attempt.js';
import { Story } from '../models/Story.js';

/**
 * GET /attempts/active
 * Devuelve el intento no finalizado más reciente del usuario.
 * Acepta ?story=<id|slug> para limitar a una historia concreta.
 */
export async function getActiveAttempt(req: Request, res: Response) {
  try {
    const userId = req.user!.sub; // consistente con otros controladores
    const { story } = req.query as { story?: string };

    const filter: any = { user: userId, finishedAt: { $exists: false } };

    if (story) {
      // story puede ser ID o slug
      const s = await Story.findOne({ $or: [{ _id: story }, { slug: story }] }, { _id: 1 }).lean();
      if (!s) return res.status(404).json({ error: 'Historia no encontrada' });
      filter.story = s._id;
    }

    const attempt = await Attempt.findOne(filter).sort({ createdAt: -1 }).lean();

    // Si no hay intento activo, devolvemos null (no error)
    return res.json({ attempt: attempt || null });
  } catch (err) {
    console.error('[getActiveAttempt]', err);
    return res.status(500).json({ error: 'Error obteniendo intento activo' });
  }
}
