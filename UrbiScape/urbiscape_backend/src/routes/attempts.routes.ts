import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { Attempt } from '../models/Attempt';
import { Story } from '../models/Story';
import { Milestone } from '../models/Milestone';
import { matchesAny } from '../utils/text';
import { haversineM } from '../utils/geo';

export const attemptsRouter = Router();

// iniciar progreso
attemptsRouter.post('/start', requireAuth, async (req, res, next) => {
  try {
    const { storyId } = req.body;
    const story = await Story.findById(storyId);
    if (!story) return res.status(404).json({ error: 'Historia no encontrada' });
    const milestones = await Milestone.find({ story: storyId }).sort({ order: 1 });
    const steps = milestones.map(m => ({ milestone: m._id, order: m.order, status: 'pending' as const }));
    const attempt = await Attempt.create({ user: req.user!.sub, story: story._id, currentOrder: 0, steps });
    res.status(201).json(attempt);
  } catch (e) { next(e); }
});

// enviar respuesta (texto/opción + GPS básico)
attemptsRouter.post('/:id/submit', requireAuth, async (req, res, next) => {
  try {
    const { answerText, lat, lng } = req.body as { answerText?: string; lat?: number; lng?: number };
    const a = await Attempt.findById(req.params.id);
    if (!a) return res.status(404).json({ error: 'Intento no encontrado' });

    const step = a.steps.find(s => s.order === a.currentOrder);
    if (!step) return res.status(400).json({ error: 'No hay paso actual' });
    if (step.status === 'passed') return res.json({ ok: true, already: true, attempt: a });

    const m = await Milestone.findById(step.milestone);
    if (!m) return res.status(404).json({ error: 'Hito no encontrado' });

    // GPS
    if (m.location?.coordinates && typeof lat === 'number' && typeof lng === 'number') {
      const [lng0, lat0] = m.location.coordinates;
      const dist = haversineM(lat, lng, lat0, lng0);
      step.geo = { lat, lng, distanceM: dist };
      const max = m.proximityRadiusM ?? 50;
      if (dist > max) return res.status(200).json({ ok: false, reason: 'far', distanceM: dist, maxM: max });
    }

    // texto/opción
    let ok = true;
    if (m.riddle?.acceptedAnswers?.length) {
      if (!answerText) return res.status(400).json({ error: 'Falta answerText' });
      ok = matchesAny(answerText, m.riddle.acceptedAnswers);
    }

    step.status = ok ? 'passed' : 'failed';
    step.answerText = answerText;
    step.at = new Date();

    if (ok) {
      const delta = (m.points ?? 0);
      a.score += delta;
      step.deltaScore = delta;
      a.currentOrder += 1;

      if (a.steps.length - a.currentOrder <= 0) {
        a.finishedAt = new Date();
      }
    }
    await a.save();
    res.json({ ok, attempt: a });
  } catch (e) { next(e); }
});

// pista
attemptsRouter.post('/:id/hint', requireAuth, async (req, res, next) => {
  try {
    const a = await Attempt.findById(req.params.id);
    if (!a) return res.status(404).json({ error: 'Intento no encontrado' });
    const step = a.steps.find(s => s.order === a.currentOrder);
    if (!step) return res.status(400).json({ error: 'No hay paso actual' });
    const m = await Milestone.findById(step.milestone);
    const penalty = m?.hintPenalty ?? 0;
    a.hintsUsed += 1;
    a.score = Math.max(0, a.score - penalty);
    await a.save();
    res.json({ ok: true, penalty, score: a.score });
  } catch (e) { next(e); }
});

// resumen
attemptsRouter.get('/:id/summary', requireAuth, async (req, res, next) => {
  try {
    const a = await Attempt.findById(req.params.id).populate('story');
    if (!a) return res.status(404).json({ error: 'Intento no encontrado' });
    res.json({
      finished: !!a.finishedAt,
      durationSec: a.finishedAt ? Math.round((+a.finishedAt - +a.startedAt)/1000) : null,
      score: a.score,
      steps: a.steps
    });
  } catch (e) { next(e); }
});
