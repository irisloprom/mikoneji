import { Schema, model, Document } from 'mongoose';

export type StoryTheme = 'esoteric' | 'queer' | 'history' | 'romance' | 'legends' | 'custom';
export type StoryStatus = 'draft' | 'published' | 'archived';
export type StoryDifficulty = 'easy' | 'medium' | 'hard';

export interface IGeoPoint {
  type: 'Point';
  coordinates: [number, number]; // [lng, lat]
}

export interface IStory extends Document {
  title: string;
  slug: string;
  summary?: string;
  theme?: StoryTheme;
  neighborhood?: string;
  coverImageUrl?: string;
  durationMinutes?: number;
  estimatedMinutes?: number;
  difficulty?: StoryDifficulty;
  tags?: string[];
  status: StoryStatus;
  publishedAt?: Date;
  startLocation?: IGeoPoint;
  center?: IGeoPoint;
  milestoneCount?: number;
  createdAt: Date;
  updatedAt: Date;
}

const GeoPointSchema = new Schema<IGeoPoint>(
  {
    type: { type: String, enum: ['Point'], required: true },
    coordinates: { type: [Number], required: true } // [lng, lat]
  },
  { _id: false }
);

const StorySchema = new Schema<IStory>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    summary: String,
    theme: {
      type: String,
      enum: ['esoteric', 'queer', 'history', 'romance', 'legends', 'custom'],
    },
    neighborhood: String,
    coverImageUrl: String,
    durationMinutes: Number,
    estimatedMinutes: Number, // alias
    difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
    tags: [String],
    status: {
      type: String,
      enum: ['draft', 'published', 'archived'],
      default: 'draft',
      index: true,
    },
    publishedAt: { type: Date, index: true },

    // ubicación principal (inicio de historia)
    startLocation: { type: GeoPointSchema, index: '2dsphere' },

    // ubicación central opcional (punto medio)
    center: { type: GeoPointSchema, index: '2dsphere' },

    milestoneCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

/* -------------------------------------------------------------------------- */
/*                                 Indexes                                   */
/* -------------------------------------------------------------------------- */

// Búsqueda por texto (título + resumen + tags)
StorySchema.index({ title: 'text', summary: 'text', tags: 'text' });

/* -------------------------------------------------------------------------- */
/*                               Middleware                                  */
/* -------------------------------------------------------------------------- */

// Actualiza automáticamente milestoneCount si se cambian hitos (solo si lo necesitas)
StorySchema.pre('save', async function (next) {
  try {
    const story = this as IStory;
    if (story.isNew || story.isModified('milestoneCount')) return next();
    // Nota: si quieres recalcular, puedes importar Milestone aquí (lazy)
    next();
  } catch (err) {
    console.error('[StorySchema pre-save]', err);
    next(err as any);
  }
});

export const Story = model<IStory>('Story', StorySchema);
