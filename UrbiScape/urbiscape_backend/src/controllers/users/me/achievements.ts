import { Request, Response } from 'express';
import { z } from 'zod';
import { Achievement } from '../../../models/Achievement';
import { Story } from '../../../models/Story';
import { isObjectId, toObjectId } from '../../../utils/objectId';

async function resolveStoryId(idOrSlug?: string) {
  if (!idOrSlug) return undefined;
  if (isObjectId(idOrSlug)) return toObjectId(idOrSlug);
  const s = await Story.findOne({ slug: idOrSlug }).select('_id').lean();
  return s?._id;
}

export async function getMyAchievements(req: Request, res: Response) {
  const q = z.object({
    story: z.string().optional(),       // id o slug
    key: z.string().optional(),         // filtrar por tipo de logro
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(100).default(50)
  }).parse(req.query);

  const userId = req.user!.sub;

  const filter: any = { user: userId };
  const storyId = await resolveStoryId(q.story);
  if (storyId) filter.story = storyId;
  if (q.key) filter.key = q.key;

  const skip = (q.page - 1) * q.limit;

  const [items, total] = await Promise.all([
    Achievement.find(filter)
      .sort({ unlockedAt: -1, _id: -1 })
      .skip(skip)
      .limit(q.limit)
      .populate('story', 'title slug coverImageUrl theme')
      .lean(),
    Achievement.countDocuments(filter)
  ]);

  const data = items.map((a: any) => ({
    id: String(a._id),
    key: a.key,
    title: a.title,
    imageUrl: a.imageUrl,
    unlockedAt: a.unlockedAt,
    story: a.story ? {
      id: String(a.story._id),
      title: a.story.title,
      slug: a.story.slug,
      coverImageUrl: a.story.coverImageUrl,
      theme: a.story.theme
    } : undefined
  }));

  res.json({
    page: q.page,
    pageSize: q.limit,
    total,
    pages: Math.max(1, Math.ceil(total / q.limit)),
    data
  });
}
