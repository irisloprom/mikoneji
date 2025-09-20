// src/routes/attempts.routes.ts
import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { Attempt } from '../models/Attempt';
import { Story } from '../models/Story';
import { Milestone } from '../models/Milestone';
import { haversineM } from '../utils/geo';
import { unlockAchievement } from '../services/achievement.service';

export const attemptsRouter = Router();

/** Helpers locales (evita depender de utils extra) */
const normalize = (s: string) =>
  s.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
const matchesAny = (txt: string, opts: string[]) => {
  const t = normalize(txt);
  return opts.some((o) => normalize(o) === t);
};

// POST /attempts/start  { storyId }
attemptsRouter.post('/start', requireAuth, async (req, res, next) => {
  try {
    const { storyId } = req.body as { storyId?: string };
    if (!storyId) return res.status(400).json({ error: 'storyId requerido' });

    const story = await Story.findById(storyId);
    if (!story) return res.status(404).json({ error: 'Historia no encontrada' });

    const milestones = await Milestone.find({ story: storyId }).sort({ order: 1 });
    if (!milestones.length) return res.status(400).json({ error: 'Historia sin hitos' });

    const steps = milestones.map((m) => ({
      milestone: m._id,
      order: m.order,
      status: 'pending' as const,
    }));

    const attempt = await Attempt.create({
      user: req.user!.sub,
      story: story._id,
      currentOrder: 0,
      steps,
    });

    res.status(201).json(attempt);
  } catch (e) {
    next(e);
  }
});

// GET /attempts/:id  (estado completo)
attemptsRouter.get('/:id', requireAuth, async (req, res, next) => {
  try {
    const a = await Attempt.findById(req.params.id).populate('story');
    if (!a) return res.status(404).json({ error: 'Intento no encontrado' });
    if (String(a.user) !== String(req.user!.sub))
      return res.status(403).json({ error: 'No permitido' });
    res.json(a);
  } catch (e) {
    next(e);
  }
});

/**
 * POST /attempts/:id/submit
 * body:
 *  - answerText?: string
 *  - lat?: number
 *  - lng?: number
 *  - okOverride?: boolean   // si ya validaste foto/voz en otro endpoint y traes el resultado
 */
attemptsRouter.post('/:id/submit', requireAuth, async (req, res, next) => {
  try {
    const { answerText, lat, lng, okOverride } = req.body as {
      answerText?: string;
      lat?: number;
      lng?: number;
      okOverride?: boolean;
    };

    const a = await Attempt.findById(req.params.id);
    if (!a) return res.status(404).json({ error: 'Intento no encontrado' });
    if (String(a.user) !== String(req.user!.sub))
      return res.status(403).json({ error: 'No permitido' });

    const step = a.steps.find((s) => s.order === a.currentOrder);
    if (!step) return res.status(400).json({ error: 'No hay paso actual' });
    if (step.status === 'passed') return res.json({ ok: true, already: true, attempt: a });

    const m = await Milestone.findById(step.milestone);
    if (!m) return res.status(404).json({ error: 'Hito no encontrado' });

    // --- 1) GPS (obligatorio si el tipo es "location", opcional en otros si envías lat/lng)
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
          // lejos → no avanzamos
          await a.save();
          return res
            .status(200)
            .json({ ok: false, reason: 'far', distanceM: dist, maxM: max, attempt: a });
        }
      }
    }

    // --- 2) Validación de respuesta
    let ok = true;

    // Si el front ya trae un veredicto (foto/voz verificada en otro endpoint)
    if (typeof okOverride === 'boolean') {
      ok = okOverride;
    } else if (m.riddle?.acceptedAnswers?.length) {
      if (!answerText) return res.status(400).json({ error: 'Falta answerText' });
      ok = matchesAny(answerText, m.riddle.acceptedAnswers);
    } else {
      // Si no hay acceptedAnswers y no hay okOverride, damos por válido al estar en zona
      ok = true;
    }

    // Guardamos el resultado del paso
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
        // --- FIN DE HISTORIA ---
        a.finishedAt = new Date();
        await a.save();

        // <<<<<< DESBLOQUEO DE LOGRO AQUÍ >>>>>>
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
  } catch (e) {
    next(e);
  }
});

// POST /attempts/:id/hint  (descuento de puntos)
attemptsRouter.post('/:id/hint', requireAuth, async (req, res, next) => {
  try {
    const a = await Attempt.findById(req.params.id);
    if (!a) return res.status(404).json({ error: 'Intento no encontrado' });
    if (String(a.user) !== String(req.user!.sub))
      return res.status(403).json({ error: 'No permitido' });

    const step = a.steps.find((s) => s.order === a.currentOrder);
    if (!step) return res.status(400).json({ error: 'No hay paso actual' });

    const m = await Milestone.findById(step.milestone);
    const penalty = m?.hintPenalty ?? 0;

    a.hintsUsed += 1;
    a.score = Math.max(0, a.score - penalty);
    await a.save();

    res.json({ ok: true, penalty, score: a.score });
  } catch (e) {
    next(e);
  }
});

// GET /attempts/:id/summary
attemptsRouter.get('/:id/summary', requireAuth, async (req, res, next) => {
  try {
    const a = await Attempt.findById(req.params.id).populate('story');
    if (!a) return res.status(404).json({ error: 'Intento no encontrado' });
    if (String(a.user) !== String(req.user!.sub))
      return res.status(403).json({ error: 'No permitido' });

    res.json({
      finished: !!a.finishedAt,
      durationSec: a.finishedAt
        ? Math.round((+a.finishedAt - +a.startedAt) / 1000)
        : null,
      score: a.score,
      steps: a.steps,
      story: a.story,
    });
  } catch (e) {
    next(e);
  }
});
