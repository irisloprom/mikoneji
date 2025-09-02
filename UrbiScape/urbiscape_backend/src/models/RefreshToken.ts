import { Schema, model, Document, Types } from 'mongoose';

export interface IRefreshToken extends Document {
  user: Types.ObjectId;
  hashedToken: string;     // guardamos hash del refresh token (no el raw)
  expiresAt: Date;
  revokedAt?: Date;
  replacedByTokenId?: Types.ObjectId;
  userAgent?: string;
  ip?: string;
  createdAt: Date;
  updatedAt: Date;
}

const RefreshTokenSchema = new Schema<IRefreshToken>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    hashedToken: { type: String, required: true, index: true },
    expiresAt: { type: Date, required: true },
    revokedAt: { type: Date },
    replacedByTokenId: { type: Schema.Types.ObjectId, ref: 'RefreshToken' },
    userAgent: { type: String },
    ip: { type: String }
  },
  { timestamps: true }
);

export const RefreshToken = model<IRefreshToken>('RefreshToken', RefreshTokenSchema);
