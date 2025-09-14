import { Schema, model, Document, Types } from 'mongoose';

export type StoryStatus = 'draft' | 'published' | 'archived';
export type StoryTheme = 'esoteric' | 'queer' | 'history' | 'romance' | 'legends' | 'custom';
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
  language?: string; // 'es', 'ca', 'en'...
  neighborhood?: string;
  coverImageUrl?: string;
  durationMinutes?: number;
  difficulty?: StoryDifficulty;
  tags?: string[];

  status: StoryStatus;
  publishedAt?: Date;

  startLocation?: IGeoPoint;

  createdBy?: Types.ObjectId;
  updatedBy?: Types.ObjectId;

  milestoneCount: number; // mantenemos el contador
  ratingAverage?: number;
  ratingCount?: number;

  createdAt: Date;
  updatedAt: Date;
}

const GeoPoint = {
  type: { type: String, enum: ['Point'], default: 'Point' },
  coordinates: { type: [Number], required: true }, // [lng, lat]
};

const StorySchema = new Schema<IStory>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    summary: { type: String },
    theme: { type: String, enum: ['esoteric', 'queer', 'history', 'romance', 'legends', 'custom'], default: 'custom' },
    neighborhood: { type: String },
    coverImageUrl: { type: String },
    durationMinutes: { type: Number },
    tags: [{ type: String }],

    status: { type: String, enum: ['draft', 'published', 'archived'], default: 'draft', index: true },
    publishedAt: { type: Date },

    startLocation: { type: { ...GeoPoint }, index: '2dsphere' },

    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },

    milestoneCount: { type: Number, default: 0 },
    ratingAverage: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

StorySchema.index({ slug: 1 }, { unique: true });
StorySchema.index({ theme: 1, language: 1, status: 1 });

export const Story = model<IStory>('Story', StorySchema);
