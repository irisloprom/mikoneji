import { Request, Response } from 'express';
import { z } from 'zod';
import { Milestone } from '../models/Milestone.js';
import { Story } from '../models/Story.js';

const msBody = z.object({
  story: z.string(),
  order: z.number().int().nonnegative().default(0),
  title: z.string(),
  description: z.string().optional(),
  type: z.enum(['narrative','location','riddle','photo','quiz','checkpoint']).default('narrative'),
  media: z.object({
    imageUrl: z.string().url().optional(),
    audioUrl: z.string().url().optional(),
    videoUrl: z.string().url().optional(),
  }).optional(),
  location: z.object({
    type: z.literal('Point').default('Point'),
    coordinates: z.tuple([z.number(), z.number()])
  }).optional(),
  proximityRadiusM: z.number().int().optional(),
  riddle: z.object({
    question: z.string().optional(),
    acceptedAnswers: z.array(z.string()).optional(),
    caseSensitive: z.boolean().optional(),
  }).optional(),
  clues: z.array(z.string()).optional(),
  timeLimitSec: z.number().int().optional(),
  points: z.number().int().optional(),
  hintPenalty: z.number().int().optional(),
  requiredToComplete: z.boolean().optional(),
});

export async function postMilestone(req: Request, res: Response) {
  const data = msBody.parse(req.body);
  const story = await Story.findById(data.story);
  if (!story) return res.status(404).json({ error: 'Historia no encontrada' });

  const created = await Milestone.create(data);
  // actualizamos contador
  story.milestoneCount = await Milestone.countDocuments({ story: story._id });
  await story.save();

  res.status(201).json(created);
}

export async function getMilestone(req: Request, res: Response) {
  const m = await Milestone.findById(req.params.id);
  if (!m) return res.status(404).json({ error: 'No encontrado' });
  res.json(m);
}

export async function patchMilestone(req: Request, res: Response) {
  const data = msBody.partial().parse(req.body);
  const m = await Milestone.findById(req.params.id);
  if (!m) return res.status(404).json({ error: 'No encontrado' });

  Object.assign(m, data);
  await m.save();

  // si cambia de historia, recalcular contadores de ambas
  const s1 = await Story.findById(m.story);
  if (s1) {
    s1.milestoneCount = await Milestone.countDocuments({ story: s1._id });
    await s1.save();
  }

  res.json(m);
}

export async function deleteMilestone(req: Request, res: Response) {
  const m = await Milestone.findById(req.params.id);
  if (!m) return res.status(404).json({ error: 'No encontrado' });

  const storyId = m.story;
  await m.deleteOne();

  // re-compactar orden en esa historia
  const ms = await Milestone.find({ story: storyId }).sort({ order: 1 });
  for (let i = 0; i < ms.length; i++) {
    if (ms[i].order !== i) {
      ms[i].order = i;
      await ms[i].save();
    }
  }

  // actualizar contador
  const s = await Story.findById(storyId);
  if (s) {
    s.milestoneCount = ms.length;
    await s.save();
  }

  res.json({ ok: true });
}

export async function postReorderMilestones(req: Request, res: Response) {
  // body: { order: string[] } -> array de milestoneIds en el orden deseado
  const schema = z.object({ order: z.array(z.string()) });
  const { order } = schema.parse(req.body);

  const ms = await Milestone.find({ _id: { $in: order } });
  const storyIds = new Set(ms.map(m => m.story.toString()));
  if (storyIds.size > 1) return res.status(400).json({ error: 'Todos los hitos deben pertenecer a la misma historia' });

  const storyId = ms[0]?.story;
  if (!storyId) return res.status(400).json({ error: 'Lista vacía' });

  // aplicar orden estable
  for (let i = 0; i < order.length; i++) {
    await Milestone.updateOne({ _id: order[i] }, { $set: { order: i } });
  }

  const s = await Story.findById(storyId);
  if (s) {
    s.milestoneCount = await Milestone.countDocuments({ story: storyId });
    await s.save();
  }

  const updated = await Milestone.find({ story: storyId }).sort({ order: 1 });
  res.json(updated);
}
