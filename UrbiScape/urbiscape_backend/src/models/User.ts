import { Schema, model, Document } from 'mongoose';

export type UserRole = 'user' | 'guest' | 'admin';

export interface IUser extends Document {
  email?: string;
  passwordHash?: string;
  displayName?: string;
  provider?: 'local' | 'google' | 'guest';
  googleUid?: string;
  role: UserRole;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, index: true, sparse: true, lowercase: true, trim: true },
    passwordHash: { type: String },
    displayName: { type: String },
    provider: { type: String, enum: ['local', 'google', 'guest'], default: 'local' },
    googleUid: { type: String, index: true, sparse: true },
    role: { type: String, enum: ['user', 'guest', 'admin'], default: 'user' },
    lastLoginAt: { type: Date }
  },
  { timestamps: true }
);

UserSchema.index({ email: 1 }, { unique: true, partialFilterExpression: { email: { $exists: true } } });
UserSchema.index({ googleUid: 1 }, { unique: true, partialFilterExpression: { googleUid: { $exists: true } } });

export const User = model<IUser>('User', UserSchema);
