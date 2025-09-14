import { Request, Response } from 'express';
import { z } from 'zod';
import { createStory, updateStory, publishStory, unpublishStory, archiveStory, duplicateStory, listStories } from '../services/story.service.js';
import { Story } from '../models/Story.js';
import { Milestone } from '../models/Milestone.js';

const storyBody = z.object({
  title: z.string(),
  slug: z.string().optional(),
  summary: z.string().optional(),
  theme: z.enum(['esoteric','queer','history','romance','legends','custom']).optional(),
  language: z.string().optional(),
  neighborhood: z.string().optional(),
  coverImageUrl: z.string().url().optional(),
  durationMinutes: z.number().int().min(1).optional(),
  difficulty: z.enum(['easy','medium','hard']).optional(),
  tags: z.array(z.string()).optional(),
  status: z.enum(['draft','published','archived']).optional(),
  startLocation: z.object({
    type: z.literal('Point').default('Point'),
    coordinates: z.tuple([z.number(), z.number()]) // [lng, lat]
  }).optional(),
});

export async function postStory(req: Request, res: Response) {
  const data = storyBody.parse(req.body);
  const userId = req.user?.sub;
  const story = await createStory(data as any, userId);
  res.status(201).json(story);
}

export async function patchStory(req: Request, res: Response) {
  const data = storyBody.partial().parse(req.body);
  const story = await updateStory(req.params.id, data as any, req.user?.sub);
  res.json(story);
}

export async function getStories(req: Request, res: Response) {
  const schema = z.object({
    q: z.string().optional(),
    theme: z.string().optional(),
    language: z.string().optional(),
    status: z.enum(['draft','published','archived']).optional(),
    lat: z.coerce.number().optional(),
    lng: z.coerce.number().optional(),
    radiusM: z.coerce.number().optional(),
    limit: z.coerce.number().min(1).max(100).optional(),
    page: z.coerce.number().min(1).optional(),
    includeDrafts: z.coerce.boolean().optional()
  });
  const q = schema.parse(req.query);
  const includeDrafts = req.user?.role === 'admin' ? q.includeDrafts : false;
  const result = await listStories({ ...q, includeDrafts });
  res.json(result);
}

export async function getStory(req: Request, res: Response) {
  const idOrSlug = req.params.idOrSlug;
  const isAdmin = req.user?.role === 'admin';

  const story = await Story.findOne(
    /^[a-f\d]{24}$/i.test(idOrSlug) ? { _id: idOrSlug } : { slug: idOrSlug }
  );

  if (!story) return res.status(404).json({ error: 'No encontrada' });
  if (!isAdmin && story.status !== 'published') {
    return res.status(403).json({ error: 'No disponible' });
  }

  res.json(story);
}

export async function postPublish(req: Request, res: Response) {
  const s = await publishStory(req.params.id);
  res.json(s);
}

export async function postUnpublish(req: Request, res: Response) {
  const s = await unpublishStory(req.params.id);
  res.json(s);
}

export async function postArchive(req: Request, res: Response) {
  const s = await archiveStory(req.params.id);
  res.json(s);
}

export async function postDuplicate(req: Request, res: Response) {
  const dupe = await duplicateStory(req.params.id, req.user?.sub);
  res.status(201).json(dupe);
}

// Milestones “embedded” endpoints
export async function getStoryMilestones(req: Request, res: Response) {
  const storyId = req.params.id;
  const story = await Story.findById(storyId);
  if (!story) return res.status(404).json({ error: 'Historia no encontrada' });

  const isAdmin = req.user?.role === 'admin';
  if (!isAdmin && story.status !== 'published') {
    return res.status(403).json({ error: 'No disponible' });
  }

  const ms = await Milestone.find({ story: storyId }).sort({ order: 1 });
  res.json(ms);
}
