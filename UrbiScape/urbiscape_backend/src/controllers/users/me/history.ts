import { Request, Response } from 'express';
import { z } from 'zod';
import mongoose from 'mongoose';
import { Attempt } from '../../../models/Attempt';
import { Story } from '../../../models/Story';

const isObjectId = (s: string) => /^[0-9a-fA-F]{24}$/.test(s);

async function resolveStoryId(idOrSlug?: string) {
  if (!idOrSlug) return undefined;
  if (isObjectId(idOrSlug)) return new mongoose.Types.ObjectId(idOrSlug);
  const s = await Story.findOne({ slug: idOrSlug }).select('_id').lean();
  return s?._id;
}

export async function getMyHistory(req: Request, res: Response) {
  const q = z.object({
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(100).default(20),
    finished: z.coerce.boolean().optional(),              // true=terminadas, false=en curso
    story: z.string().optional(),                         // id o slug
    sort: z.enum(['recent', 'score']).default('recent')
  }).parse(req.query);

  const userId = req.user!.sub; // requiere requireAuth en la ruta

  const filter: any = { user: userId };
  if (q.finished === true) filter.finishedAt = { $ne: null };
  if (q.finished === false) filter.finishedAt = null;

  const storyId = await resolveStoryId(q.story);
  if (storyId) filter.story = storyId;

  const sort = q.sort === 'recent'
    ? { updatedAt: -1, startedAt: -1 }
    : { score: -1, updatedAt: -1 };

  const skip = (q.page - 1) * q.limit;

  const [items, total] = await Promise.all([
    Attempt.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(q.limit)
      .populate('story', 'title slug coverImageUrl milestoneCount theme')
      .lean(),
    Attempt.countDocuments(filter)
  ]);

  const data = items.map((a: any) => {
    const totalMilestones = a?.story?.milestoneCount ?? a.steps?.length ?? 0;
    const passed = (a.steps || []).filter((s: any) => s.status === 'passed').length;
    const failed = (a.steps || []).filter((s: any) => s.status === 'failed').length;

    const durationSec = a.finishedAt
      ? Math.round((+new Date(a.finishedAt) - +new Date(a.startedAt)) / 1000)
      : null;

    return {
