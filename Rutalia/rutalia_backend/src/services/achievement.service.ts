// src/services/achievement.service.ts
import { Types } from 'mongoose';
import { Achievement } from '../models/Achievement.js';

type AchieveInput = {
  userId: string | Types.ObjectId;
  key: string;
  title: string;
  storyId?: string | Types.ObjectId;
  imageUrl?: string;
  meta?: Record<string, any>;
};

export async function unlockAchievement(input: AchieveInput) {
  const { userId, key, title, storyId, imageUrl, meta } = input;

  const filter: any = { user: userId, key };
  if (storyId) filter.story = storyId;

  const doc = await Achievement.findOneAndUpdate(
    filter,
    {
      $setOnInsert: {
        user: userId,
        key,
        title,
        story: storyId,
        imageUrl,
        meta,
        unlockedAt: new Date()
      }
    },
    { new: true, upsert: true }
  );

  // si ya existía, no “duplica”
  const created = doc.createdAt.getTime() === doc.updatedAt.getTime();
  return { achievement: doc, created };
}
