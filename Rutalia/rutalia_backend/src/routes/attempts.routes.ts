import { Router } from 'express';
import { z } from 'zod';

import { requireAuth } from '../middleware/auth.js';
import { wrap } from '../utils/wrap.js';
import { Attempt } from '../models/Attempt.js';
import { Story } from '../models/Story.js';
import { Milestone } from '../models/Milestone.js';
import { haversineM } from '../utils/geo.js';
import { matchesAny } from '../utils/text.js';
import { unlockAchievement } from '../services/achievement.service.js';
import { submitAttemptLimiter } from '../middleware/rateLimiter.js'; // ⬅️ rate-limit para /submit

export const attemptsRouter = Router();

/* ------------------------------- Schemas ------------------------------- */
const startSchema = z.object({
  storyId: z.string().min(1)
});

const submitSchema = z.object({
  answerText: z.string().optional(),
  lat: z.number().optional(),
  lng: z.number().optional(),
  okOverride: z.boolean().optional()
});

const activeQuerySchema = z.object({
  story: z.string().min(1).optional(), // id o slug
});

/* ------------------------- GET /attempts/active ------------------------ */
/** Devuelve el intento no finalizado más reciente del usuario.
 *  Soporta ?story=<id|slug> para reanudar una historia concreta.
 */
attemptsRouter.get('/active', requireAuth, wrap(async (req, res) => {
  const { story } = activeQuerySchema.parse(req.query);

  const filter: any = { user: req.user!.sub, finishedAt: { $exists: false } };

  if (story) {
    const s = await Story.findOne({ $or: [{ _id: story }, { slug: story }] }, { _id: 1 }).lean();
    if (!s) return res.status(404).json({ error: 'Historia no encontrada' });
    filter.story = s._id;
  }

  const attempt = await Attempt.findOne(filter).sort({ createdAt: -1 }).lean();
  return res.json({ attempt: attempt || null });
}));

/* --------------------------- POST /attempts/start ---------------------- */
attemptsRouter.post('/start', requireAuth, wrap(async (req, res) => {
  const { storyId } = startSchema.parse(req.body);

  const story = await Story.findById(storyId);
  if (!story) return res.status(404).json({ error: 'Historia no encontrada' });

  const milestones = await Milestone.find({ story: storyId }).sort({ order: 1 });
  if (!milestones.length) return res.status(400).json({ error: 'Historia sin hitos' });

  const steps = milestones.map((m) => ({
    milestone: m._id,
    order: m.order,
    status: 'pending' as const,
  }));

  // (opcional) si hay intento activo para esta historia, reutilizarlo:
  // const existing = await Attempt.findOne({ user: req.user!.sub, story: story._id, finishedAt: { $exists: false } });
  // if (existing) return res.status(200).json(existing);

  const attempt = await Attempt.create({
    user: req.user!.sub,
    story: story._id,
    currentOrder: 0,
    steps,
  });

  res.status(201).json(attempt);
}));

/* ------------------------------ GET /:id ------------------------------- */
attemptsRouter.get('/:id', requireAuth, wrap(async (req, res) => {
  const a = await Attempt.findById(req.params.id).populate('story');
  if (!a) return res.status(404).json({ error: 'Intento no encontrado' });
  if (String(a.user) !== String(req.user!.sub)) return res.status(403).json({ error: 'No permitido' });
  res.json(a);
}));

/* --------------------------- POST /:id/submit -------------------------- */
/** Valida el paso actual del intento:
 *  - type "location": requiere lat/lng y valida distancia <= proximityRadiusM
 *  - type "riddle": compara answerText con acceptedAnswers
 *  - okOverride: permite validar previamente (foto/voz) en otro endpoint
 */
attemptsRouter.post('/:id/submit', requireAuth, submitAttemptLimiter, wrap(async (req, res) => {
  const { answerText, lat, lng, okOverride } = submitSchema.parse(req.body);

  const a = await Attempt.findById(req.params.id);
  if (!a) return res.status(404).json({ error: 'Intento no encontrado' });
  if (String(a.user) !== String(req.user!.sub)) return res.status(403).json({ error: 'No permitido' });

  if (a.finishedAt) {
    return res.status(200).json({ ok: true, finished: true, attempt: a });
  }

  const step = a.steps.find((s) => s.order === a.currentOrder);
  if (!step) return res.status(400).json({ error: 'No hay paso actual' });
  if (step.status === 'passed') return res.json({ ok: true, already: true, attempt: a });

  const m = await Milestone.findById(step.milestone);
  if (!m) return res.status(404).json({ error: 'Hito no encontrado' });

  // 1) Validación GPS si el hito tiene ubicación
  if (m.location?.coordinates) {
    if (m.type === 'location' && (typeof lat !== 'number' || typeof lng !== 'number')) {
      return res.status(400).json({ error: 'Se requiere ubicación para este hito' });
    }
    if (typeof lat === 'number' && typeof lng === 'number') {
      const [lng0, lat0] = m.location.coordinates; // [lng, lat]
      const dist = haversineM(lat, lng, lat0, lng0);
      step.geo = { lat, lng, distanceM: dist };
      const max = m.proximityRadiusM ?? 50;
      if (dist > max) {
        await a.save(); // guardamos la distancia registrada
        return res.status(200).json({ ok: false, reason: 'far', distanceM: dist, maxM: max, attempt: a });
      }
    }
  }

  // 2) Validación de respuesta
  let ok = true;

  if (typeof okOverride === 'boolean') {
    ok = okOverride; // resultado ya verificado en otro endpoint
  } else if (m.riddle?.acceptedAnswers?.length) {
    if (!answerText) return res.status(400).json({ error: 'Falta answerText' });
    ok = matchesAny(answerText, m.riddle.acceptedAnswers);
  } else {
    ok = true; // sin acertijo ni override → estar en zona basta
  }

  // Guardar resultado del paso
  step.status = ok ? 'passed' : 'failed';
  step.answerText = answerText;
  step.at = new Date();

  if (ok) {
    const delta = m.points ?? 0;
    a.score += delta;
    step.deltaScore = delta;
    a.currentOrder += 1;

    const remaining = a.steps.length - a.currentOrder;
    if (remaining <= 0) {
      // fin de historia
      a.finishedAt = new Date();
      await a.save();

      await unlockAchievement({
        userId: a.user,
        storyId: a.story,
        key: 'story_completed',
        title: 'Historia completada',
        meta: { score: a.score },
      });

      return res.json({ ok: true, finished: true, attempt: a });
    }
  }

  await a.save();
  res.json({ ok, attempt: a });
}));

/* --------------------------- POST /:id/hint ---------------------------- */
attemptsRouter.post('/:id/hint', requireAuth, wrap(async (req, res) => {
  const a = await Attempt.findById(req.params.id);
  if (!a) return res.status(404).json({ error: 'Intento no encontrado' });
  if (String(a.user) !== String(req.user!.sub)) return res.status(403).json({ error: 'No permitido' });

  const step = a.steps.find((s) => s.order === a.currentOrder);
  if (!step) return res.status(400).json({ error: 'No hay paso actual' });

  const m = await Milestone.findById(step.milestone);
  const penalty = m?.hintPenalty ?? 0;

  a.hintsUsed += 1;
  a.score = Math.max(0, a.score - penalty);
  await a.save();

  res.json({ ok: true, penalty, score: a.score });
}));

/* --------------------------- GET /:id/summary -------------------------- */
attemptsRouter.get('/:id/summary', requireAuth, wrap(async (req, res) => {
  const a = await Attempt.findById(req.params.id).populate('story');
  if (!a) return res.status(404).json({ error: 'Intento no encontrado' });
  if (String(a.user) !== String(req.user!.sub)) return res.status(403).json({ error: 'No permitido' });

  res.json({
    finished: !!a.finishedAt,
    durationSec: a.finishedAt ? Math.round((+a.finishedAt - +a.startedAt) / 1000) : null,
    score: a.score,
    steps: a.steps,
    story: a.story,
  });
}));
