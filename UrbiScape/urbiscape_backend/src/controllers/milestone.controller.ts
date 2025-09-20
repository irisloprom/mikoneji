// src/controllers/milestone.controller.ts
import { Request, Response } from 'express';
import { z } from 'zod';
import { Milestone } from '../models/Milestone.js';
import { Story } from '../models/Story.js';

const msBody = z.object({
  story: z.string(),
  order: z.number().int().nonnegative().optional(),
  title: z.string(),
  description: z.string().optional(),
  type: z.enum(['narrative','location','riddle','photo','quiz','checkpoint']).default('narrative'),
  media: z.object({
    imageUrl: z.string().url().optional(),
    audioUrl: z.string().url().optional(),
    videoUrl: z.string().url().optional(),
  }).optional(),
  location: z.object({
    type: z.literal('Point'),
    coordinates: z.tuple([z.number(), z.number()])
  }).optional(),
  proximityRadiusM: z.number().int().optional(),
  riddle: z.object({
    question: z.string().optional(),
    acceptedAnswers: z.array(z.string()).default([]),
    caseSensitive: z.boolean().default(false),
  }).optional(),
  clues: z.array(z.string()).optional(),
  timeLimitSec: z.number().int().optional(),
  points: z.number().int().optional(),
  hintPenalty: z.number().int().optional(),
  requiredToComplete: z.boolean().optional()
});

// POST /milestones
export async function postMilestone(req: Request, res: Response) {
  const body = msBody.parse(req.body);

  const story = await Story.findById(body.story);
  if (!story) return res.status(404).json({ error: 'Historia no encontrada' });

  let order = body.order;
  if (order == null) {
    const count = await Milestone.countDocuments({ story: body.story });
    order = count;
  }

  const doc = await Milestone.create({ ...body, order });
  story.milestoneCount = await Milestone.countDocuments({ story: body.story });
  await story.save();

  res.status(201).json(doc);
}

// PATCH /milestones/:id
export async function patchMilestone(req: Request, res: Response) {
  const id = req.params.id;
  const body = msBody.partial().parse(req.body);

  const m = await Milestone.findById(id);
  if (!m) return res.status(404).json({ error: 'Hito no encontrado' });

  Object.assign(m, body);
  await m.save();
  res.json(m);
}

// DELETE /milestones/:id
export async function deleteMilestone(req: Request, res: Response) {
  const id = req.params.id;
  const m = await Milestone.findById(id);
  if (!m) return res.status(404).json({ error: 'Hito no encontrado' });

  const storyId = m.story;
  await m.deleteOne();

  // reordenar los que quedan
  const items = await Milestone.find({ story: storyId }).sort({ order: 1 });
  for (let i = 0; i < items.length; i++) {
    if (items[i].order !== i) {
      items[i].order = i;
      await items[i].save();
    }
  }

  const s = await Story.findById(storyId);
  if (s) {
    s.milestoneCount = await Milestone.countDocuments({ story: storyId });
    await s.save();
  }

  res.json({ ok: true });
}

// POST /milestones/reorder  { storyId, order: [milestoneIds en el orden nuevo] }
export async function postReorderMilestones(req: Request, res: Response) {
  const schema = z.object({
    storyId: z.string(),
    order: z.array(z.string().min(1))
  });
  const { storyId, order } = schema.parse(req.body);

  const story = await Story.findById(storyId);
  if (!story) return res.status(404).json({ error: 'Historia no encontrada' });

  // aplicar orden estable
  for (let i = 0; i < order.length; i++) {
    await Milestone.updateOne({ _id: order[i] }, { $set: { order: i } });
  }

  story.milestoneCount = await Milestone.countDocuments({ story: storyId });
  await story.save();

  const updated = await Milestone.find({ story: storyId }).sort({ order: 1 });
  res.json(updated);
}
