import { Schema, model, Document, Types } from 'mongoose';
import { IGeoPoint } from './Story';

export type MilestoneType = 'narrative' | 'location' | 'riddle' | 'photo' | 'quiz' | 'checkpoint';

export interface IMedia {
  imageUrl?: string;
  audioUrl?: string;
  videoUrl?: string;
}

export interface IRiddle {
  question?: string;
  acceptedAnswers?: string[];
  caseSensitive?: boolean;
}

export interface IMilestone extends Document {
  story: Types.ObjectId;
  order: number;
  title: string;
  description?: string;
  type: MilestoneType;
  media?: IMedia;
  location?: IGeoPoint;
  proximityRadiusM?: number;
  riddle?: IRiddle;
  clues?: string[];
  timeLimitSec?: number;
  points?: number;
  hintPenalty?: number;
  requiredToComplete?: boolean;
  createdAt: Date; updatedAt: Date;
}

const MediaSchema = new Schema<IMedia>(
  {
    imageUrl: String,
    audioUrl: String,
    videoUrl: String
  },
  { _id: false }
);

const RiddleSchema = new Schema<IRiddle>(
  {
    question: String,
    acceptedAnswers: { type: [String], default: [] },
    caseSensitive: { type: Boolean, default: false }
  },
  { _id: false }
);

const GeoPointSchema = new Schema<IGeoPoint>(
  {
    type: { type: String, enum: ['Point'], required: true },
    coordinates: { type: [Number], required: true }
  },
  { _id: false }
);

const MilestoneSchema = new Schema<IMilestone>(
  {
    story: { type: Schema.Types.ObjectId, ref: 'Story', required: true, index: true },
    order: { type: Number, required: true, index: true },
    title: { type: String, required: true },
    description: String,
    type: { type: String, enum: ['narrative', 'location', 'riddle', 'photo', 'quiz', 'checkpoint'], default: 'narrative' },
    media: { type: MediaSchema, default: undefined },
    location: { type: GeoPointSchema, index: '2dsphere', default: undefined },
    proximityRadiusM: Number,
    riddle: { type: RiddleSchema, default: undefined },
    clues: [String],
    timeLimitSec: Number,
    points: Number,
    hintPenalty: Number,
    requiredToComplete: { type: Boolean, default: true }
  },
  { timestamps: true }
);

// Evita duplicar órdenes en una misma historia
MilestoneSchema.index({ story: 1, order: 1 }, { unique: true });

export const Milestone = model<IMilestone>('Milestone', MilestoneSchema);
