import { Schema, model, Document, Types } from 'mongoose';

export interface IAchievement extends Document {
  user: Types.ObjectId;              // quién lo consigue
  story?: Types.ObjectId;            // opcional: logro ligado a una historia
  key: string;                       // identificador estable (p.ej. 'story_completed')
  title: string;                     // texto visible ("Historia completada")
  imageUrl?: string;                 // badge/medalla opcional
  meta?: Record<string, any>;        // campos extra (score, tiempo, etc.)
  unlockedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const AchievementSchema = new Schema<IAchievement>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    story: { type: Schema.Types.ObjectId, ref: 'Story', required: false, index: true },
    key:   { type: String, required: true },
    title: { type: String, required: true },
    imageUrl: { type: String },
    meta: { type: Schema.Types.Mixed },
    unlockedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

/**
 * Unicidad:
 * - Si el logro está ligado a una historia: (user, story, key) único.
 * - Si NO está ligado a historia (global): (user, key) único.
 */
AchievementSchema.index(
  { user: 1, story: 1, key: 1 },
  { unique: true, partialFilterExpression: { story: { $type: 'objectId' } } }
);

AchievementSchema.index(
  { user: 1, key: 1 },
  { unique: true, partialFilterExpression: { story: { $exists: false } } }
);

export const Achievement = model<IAchievement>('Achievement', AchievementSchema);
