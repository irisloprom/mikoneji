import { Schema, model, Document, Types } from 'mongoose';

export interface IAttemptStep {
  milestone: Types.ObjectId;
  order: number;
  status: 'pending' | 'passed' | 'failed';
  answerText?: string;
  photoUrl?: string;
  voiceTranscript?: string;
  at?: Date;
  geo?: { lat: number; lng: number; distanceM?: number };
  deltaScore?: number;
}

export interface IAttempt extends Document {
  user: Types.ObjectId;
  story: Types.ObjectId;
  currentOrder: number;
  startedAt: Date;
  finishedAt?: Date;
  score: number;
  hintsUsed: number;
  steps: IAttemptStep[];
  createdAt: Date; updatedAt: Date;
}

const AttemptStepSchema = new Schema<IAttemptStep>(
  {
    milestone: { type: Schema.Types.ObjectId, ref: 'Milestone', required: true },
    order: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'passed', 'failed'], default: 'pending' },
    answerText: String,
    photoUrl: String,
    voiceTranscript: String,
    at: Date,
    geo: { lat: Number, lng: Number, distanceM: Number },
    deltaScore: Number
  },
  { _id: false }
);

const AttemptSchema = new Schema<IAttempt>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    story: { type: Schema.Types.ObjectId, ref: 'Story', required: true, index: true },
    currentOrder: { type: Number, default: 0 },
    startedAt: { type: Date, default: Date.now },
    finishedAt: { type: Date },
    score: { type: Number, default: 0 },
    hintsUsed: { type: Number, default: 0 },
    steps: { type: [AttemptStepSchema], default: [] }
  },
  { timestamps: true }
);

AttemptSchema.index({ user: 1, story: 1, startedAt: -1 });

export const Attempt = model<IAttempt>('Attempt', AttemptSchema);
