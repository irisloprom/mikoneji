import { Story } from '../models/Story';
import { Milestone } from '../models/Milestone';
import { slugify } from '../utils/slug';

type ListParams = {
  theme?: string;
  tags?: string[];
  includeDrafts?: boolean;
  lat?: number;
  lng?: number;
  radiusM?: number;
  q?: string;
  isEditor?: boolean;
};

export async function listStories(params: ListParams) {
  const { theme, tags, includeDrafts, lat, lng, radiusM, q, isEditor } = params;
  const filter: any = {};
  if (!isEditor || !includeDrafts) filter.status = 'published';
  if (theme) filter.theme = theme;
  if (tags?.length) filter.tags = { $in: tags };
  if (q) filter.$text = { $search: q };

  if (lat != null && lng != null && radiusM != null) {
    filter.startLocation = {
      $near: {
        $geometry: { type: 'Point', coordinates: [lng, lat] },
        $maxDistance: radiusM
      }
    };
  }

  return Story.find(filter).sort({ publishedAt: -1, _id: -1 }).lean();
}

export async function getStoryByIdOrSlug(idOrSlug: string) {
  return Story.findOne(
    idOrSlug.match(/^[0-9a-f]{24}$/i) ? { _id: idOrSlug } : { slug: idOrSlug }
  );
}

export async function createStory(data: any) {
  const slug = (data.slug?.trim() || slugify(data.title));
  const exists = await Story.findOne({ slug });
  if (exists) throw new Error('Slug en uso');

  const story = await Story.create({
    ...data,
    slug,
    status: data.status ?? 'draft',
    publishedAt: data.status === 'published' ? (data.publishedAt ?? new Date()) : undefined
  });
  return story;
}

export async function updateStory(id: string, data: any) {
  const s = await Story.findById(id);
  if (!s) throw new Error('Historia no encontrada');
  if (data.title && !data.slug) s.slug = slugify(data.title);
  Object.assign(s, data);
  await s.save();
  return s;
}

export async function publishStory(id: string) {
  const s = await Story.findById(id);
  if (!s) throw new Error('Historia no encontrada');
  s.status = 'published';
  s.publishedAt = s.publishedAt ?? new Date();
  await s.save();
  return s;
}

export async function unpublishStory(id: string) {
  const s = await Story.findById(id);
  if (!s) throw new Error('Historia no encontrada');
  s.status = 'draft';
  await s.save();
  return s;
}

export async function archiveStory(id: string) {
  const s = await Story.findById(id);
  if (!s) throw new Error('Historia no encontrada');
  s.status = 'archived';
  await s.save();
  return s;
}

export async function duplicateStory(id: string) {
  const s = await Story.findById(id);
  if (!s) throw new Error('Historia no encontrada');

  const copy = s.toObject();
  delete (copy as any)._id;
  copy.title = `${s.title} (copia)`;
  copy.slug = `${s.slug}-copy-${Date.now()}`;
  copy.status = 'draft';
  copy.publishedAt = undefined;

  const newStory = await Story.create(copy);

  const ms = await Milestone.find({ story: s._id }).sort({ order: 1 });
  const docs = ms.map((m) => {
    const o = m.toObject(); delete (o as any)._id;
    return { ...o, story: newStory._id };
  });
  if (docs.length) await Milestone.insertMany(docs);

  return newStory;
}
