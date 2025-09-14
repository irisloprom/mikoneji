import { Types } from 'mongoose';
import { Story, IStory } from '../models/Story.js';
import { Milestone } from '../models/Milestone.js';
import { slugify } from '../utils/slug.js';

export async function createStory(payload: Partial<IStory>, userId?: string) {
  const title = payload.title?.trim();
  if (!title) throw new Error('title requerido');

  const slug = payload.slug?.trim() || slugify(title);
  const exists = await Story.findOne({ slug });
  if (exists) throw new Error('slug en uso');

  const story = await Story.create({
    ...payload,
    title,
    slug,
    createdBy: userId ? new Types.ObjectId(userId) : undefined,
    updatedBy: userId ? new Types.ObjectId(userId) : undefined,
  });
  return story;
}

export async function updateStory(id: string, payload: Partial<IStory>, userId?: string) {
  const story = await Story.findById(id);
  if (!story) throw new Error('Historia no encontrada');

  if (payload.title && !payload.slug) {
    // si cambia título, mantenemos slug salvo que nos den uno
  }
  if (payload.slug) {
    payload.slug = slugify(payload.slug);
    const clash = await Story.findOne({ slug: payload.slug, _id: { $ne: story._id } });
    if (clash) throw new Error('slug en uso');
  }

  Object.assign(story, payload, { updatedBy: userId ? new Types.ObjectId(userId) : story.updatedBy });
  await story.save();
  return story;
}

export async function publishStory(id: string) {
  const story = await Story.findById(id);
  if (!story) throw new Error('Historia no encontrada');
  story.status = 'published';
  story.publishedAt = new Date();
  await story.save();
  return story;
}

export async function unpublishStory(id: string) {
  const story = await Story.findById(id);
  if (!story) throw new Error('Historia no encontrada');
  story.status = 'draft';
  story.publishedAt = undefined;
  await story.save();
  return story;
}

export async function archiveStory(id: string) {
  const story = await Story.findById(id);
  if (!story) throw new Error('Historia no encontrada');
  story.status = 'archived';
  await story.save();
  return story;
}

export async function duplicateStory(id: string, userId?: string) {
  const story = await Story.findById(id);
  if (!story) throw new Error('Historia no encontrada');

  const baseSlug = story.slug + '-copy';
  let slug = baseSlug;
  let i = 1;
  while (await Story.findOne({ slug })) {
    slug = `${baseSlug}-${i++}`;
  }

  const copy = await Story.create({
    title: story.title + ' (copia)',
    slug,
    summary: story.summary,
    theme: story.theme,
    language: story.language,
    neighborhood: story.neighborhood,
    coverImageUrl: story.coverImageUrl,
    durationMinutes: story.durationMinutes,
    difficulty: story.difficulty,
    tags: story.tags,
    status: 'draft',
    startLocation: story.startLocation,
    createdBy: userId ? new Types.ObjectId(userId) : story.createdBy,
    updatedBy: userId ? new Types.ObjectId(userId) : story.updatedBy,
  });

  const milestones = await Milestone.find({ story: story._id }).sort({ order: 1 });
  if (milestones.length) {
    const docs = milestones.map(m => ({
      story: copy._id,
      order: m.order,
      title: m.title,
      description: m.description,
      type: m.type,
      media: m.media,
      location: m.location,
      proximityRadiusM: m.proximityRadiusM,
      riddle: m.riddle,
      clues: m.clues,
      timeLimitSec: m.timeLimitSec,
      points: m.points,
      hintPenalty: m.hintPenalty,
      requiredToComplete: m.requiredToComplete,
    }));
    await Milestone.insertMany(docs);
    copy.milestoneCount = docs.length;
    await copy.save();
  }

  return copy;
}

export async function listStories(params: {
  q?: string;
  theme?: string;
  status?: 'draft' | 'published' | 'archived';
  lat?: number;
  lng?: number;
  radiusM?: number;
  limit?: number;
  page?: number;
  includeDrafts?: boolean;
}) {
  const {
    q, theme,
    status,
    lat, lng, radiusM,
    limit = 20, page = 1,
    includeDrafts = false
  } = params;

  const filter: any = {};
  if (!includeDrafts) filter.status = 'published';
  if (status) filter.status = status;
  if (theme) filter.theme = theme;
  if (q) filter.$text = { $search: q };

  if (lat != null && lng != null && radiusM != null) {
    filter.startLocation = {
      $near: {
        $geometry: { type: 'Point', coordinates: [lng, lat] },
        $maxDistance: radiusM
      }
    };
  }

  const cursor = Story.find(filter).sort({ publishedAt: -1, createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  const [items, total] = await Promise.all([
    cursor.exec(),
    Story.countDocuments(filter)
  ]);

  return { items, total, page, pages: Math.ceil(total / limit) };
}
