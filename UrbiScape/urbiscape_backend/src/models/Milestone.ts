import { Schema, model, Document, Types } from 'mongoose';

export type MilestoneType = 'narrative' | 'location' | 'riddle' | 'photo' | 'quiz' | 'checkpoint';

export interface IGeoPoint {
  type: 'Point';
  coordinates: [number, number]; // [lng, lat]
}

export interface IMilestone extends Document {
  story: Types.ObjectId;
  order: number;

  title: string;
  description?: string;
  type: MilestoneType;

  media?: {
    imageUrl?: string;
    audioUrl?: string;
    videoUrl?: string;
  };

  location?: IGeoPoint;       // para 'location'/'photo'/'checkpoint'
  proximityRadiusM?: number;  // radio para desbloquear por proximidad

  riddle?: {
    question?: string;
    acceptedAnswers?: string[];
    caseSensitive?: boolean;
  };

  clues?: string[]; // pistas
  timeLimitSec?: number;
  points?: number;
  hintPenalty?: number;

  requiredToComplete?: boolean;

  createdAt: Date;
  updatedAt: Date;
}

const GeoPoint = {
  type: { type: String, enum: ['Point'], default: 'Point' },
  coordinates: { type: [Number], required: true }, // [lng, lat]
};

const MilestoneSchema = new Schema<IMilestone>(
  {
    story: { type: Schema.Types.ObjectId, ref: 'Story', required: true, index: true },
    order: { type: Number, required: true }, // único por historia
    title: { type: String, required: true, trim: true },
    description: { type: String },
    type: { type: String, enum: ['narrative', 'location', 'riddle', 'photo', 'quiz', 'checkpoint'], default: 'narrative' },
    media: {
      imageUrl: { type: String },
      audioUrl: { type: String },
      videoUrl: { type: String },
    },
    location: { type: { ...GeoPoint }, index: '2dsphere' },
    proximityRadiusM: { type: Number, default: 30 },

    riddle: {
      question: { type: String },
      acceptedAnswers: [{ type: String }],
      caseSensitive: { type: Boolean, default: false },
    },

    clues: [{ type: String }],
    timeLimitSec: { type: Number },
    points: { type: Number, default: 10 },
    hintPenalty: { type: Number, default: 2 },

    requiredToComplete: { type: Boolean, default: true },
  },
  { timestamps: true }
);

MilestoneSchema.index({ story: 1, order: 1 }, { unique: true });

export const Milestone = model<IMilestone>('Milestone', MilestoneSchema);
