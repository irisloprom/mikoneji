// src/controllers/story.controller.ts
import { Request, Response } from 'express';
import { z } from 'zod';
import { Story } from '../models/Story';
import { Milestone } from '../models/Milestone';
import { slugify } from '../utils/slug';
import { isObjectId } from '../utils/objectId';

const storyBody = z.object({
  title: z.string(),
  slug: z.string().optional(),
  summary: z.string().optional(),
  theme: z.enum(['esoteric','queer','history','romance','legends','custom']).optional(),
  neighborhood: z.string().optional(),
  coverImageUrl: z.string().url().optional(),
  durationMinutes: z.number().int().min(1).optional(),
  tags: z.array(z.string()).optional(),
  status: z.enum(['draft','published','archived']).optional(),
  publishedAt: z.coerce.date().optional(),
  startLocation: z.object({
    type: z.literal('Point'),
    coordinates: z.tuple([z.number(), z.number()]) // [lng, lat]
  }).optional()
});

// GET /stories
export async function getStories(req: Request, res: Response) {
  const q = z.object({
    theme: z.string().optional(),
    tags: z.string().optional(),            // "raval,historia"
    includeDrafts: z.coerce.boolean().optional(),
    lat: z.coerce.number().optional(),
    lng: z.coerce.number().optional(),
    radiusM: z.coerce.number().optional(),
    q: z.string().optional()
  }).parse(req.query);

  const filter: any = {};
  const isEditor = ['admin','editor'].includes(req.user?.role || '');

  if (!isEditor || !q.includeDrafts) {
    filter.status = 'published';
  }

  if (q.theme) filter.theme = q.theme;
  if (q.tags) filter.tags = { $in: q.tags.split(',').map(s => s.trim()).filter(Boolean) };
  if (q.q) filter.$text = { $search: q.q };

  // geofiltro (simple) desde startLocation
  if (q.lat != null && q.lng != null && q.radiusM != null) {
    filter.startLocation = {
      $near: {
        $geometry: { type: 'Point', coordinates: [q.lng, q.lat] },
        $maxDistance: q.radiusM
      }
    };
  }

  const items = await Story.find(filter).sort({ publishedAt: -1, _id: -1 }).lean();
  res.json(items);
}

// GET /stories/:idOrSlug
export async function getStory(req: Request, res: Response) {
  const idOrSlug = (req.params as any).idOrSlug ?? req.params.id;
  const query = isObjectId(idOrSlug) ? { _id: idOrSlug } : { slug: idOrSlug };
  const story = await Story.findOne(query);
  if (!story) return res.status(404).json({ error: 'Historia no encontrada' });

  const isEditor = ['admin','editor'].includes(req.user?.role || '');
  if (!isEditor && story.status !== 'published') {
    return res.status(403).json({ error: 'No disponible' });
  }
  res.json(story);
}

// POST /stories
export async function postStory(req: Request, res: Response) {
  const body = storyBody.parse(req.body);
  const slug = body.slug?.trim() || slugify(body.title);
  const exists = await Story.findOne({ slug });
  if (exists) return res.status(409).json({ error: 'Slug en uso' });

  const story = await Story.create({
    ...body,
    slug,
    status: body.status ?? 'draft',
    publishedAt: body.status === 'published' ? (body.publishedAt ?? new Date()) : undefined
  });

  res.status(201).json(story);
}

// PATCH /stories/:id
export async function patchStory(req: Request, res: Response) {
  const id = req.params.id;
  const body = storyBody.partial().parse(req.body);

  const story = await Story.findById(id);
  if (!story) return res.status(404).json({ error: 'Historia no encontrada' });

  if (body.title && !body.slug) story.slug = slugify(body.title);
  Object.assign(story, body);
  await story.save();
  res.json(story);
}

// POST /stories/:id/publish
export async function postPublish(req: Request, res: Response) {
  const id = req.params.id;
  const s = await Story.findById(id);
  if (!s) return res.status(404).json({ error: 'Historia no encontrada' });
  s.status = 'published';
  s.publishedAt = s.publishedAt ?? new Date();
  await s.save();
  res.json(s);
}

// POST /stories/:id/unpublish
export async function postUnpublish(req: Request, res: Response) {
  const id = req.params.id;
  const s = await Story.findById(id);
  if (!s) return res.status(404).json({ error: 'Historia no encontrada' });
  s.status = 'draft';
  await s.save();
  res.json(s);
}

// POST /stories/:id/archive
export async function postArchive(req: Request, res: Response) {
  const id = req.params.id;
  const s = await Story.findById(id);
  if (!s) return res.status(404).json({ error: 'Historia no encontrada' });
  s.status = 'archived';
  await s.save();
  res.json(s);
}

// POST /stories/:id/duplicate
export async function postDuplicate(req: Request, res: Response) {
  const id = req.params.id;
  const s = await Story.findById(id);
  if (!s) return res.status(404).json({ error: 'Historia no encontrada' });

  const copy = s.toObject();
  delete (copy as any)._id;
  copy.title = `${s.title} (copia)`;
  copy.slug = `${s.slug}-copy-${Date.now()}`;
  copy.status = 'draft';
  copy.publishedAt = undefined;

  const newStory = await Story.create(copy);

  // duplicar milestones
  const ms = await Milestone.find({ story: s._id }).sort({ order: 1 });
  const docs = ms.map(m => {
    const o = m.toObject(); delete (o as any)._id;
    return { ...o, story: newStory._id };
  });
  if (docs.length) await Milestone.insertMany(docs);

  res.status(201).json(newStory);
}

// GET /stories/:id/milestones
export async function getStoryMilestones(req: Request, res: Response) {
  const storyId = req.params.id;
  const story = await Story.findById(storyId);
  if (!story) return res.status(404).json({ error: 'Historia no encontrada' });

  const isEditor = ['admin','editor'].includes(req.user?.role || '');
  if (!isEditor && story.status !== 'published') {
    return res.status(403).json({ error: 'No disponible' });
  }

  const ms = await Milestone.find({ story: storyId }).sort({ order: 1 });
  res.json(ms);
}
