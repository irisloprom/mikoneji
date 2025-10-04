import { Schema, model, Document } from 'mongoose';

export type UserRole = 'guest' | 'user' | 'editor' | 'admin';
export type Provider = 'local' | 'google' | 'guest';

export interface IUser extends Document {
  email?: string;
  displayName?: string;
  photoURL?: string;
  provider: Provider;
  role: UserRole;
  passwordHash?: string;     // solo para provider 'local'
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, lowercase: true, trim: true, index: true, sparse: true },
    displayName: { type: String, trim: true },
    photoURL: String,
    provider: { type: String, enum: ['local', 'google', 'guest'], default: 'local' },
    role: { type: String, enum: ['guest', 'user', 'editor', 'admin'], default: 'user' },
    passwordHash: { type: String }
  },
  { timestamps: true }
);

UserSchema.index({ email: 1 }, { unique: true, partialFilterExpression: { email: { $type: 'string' } } });

export const User = model<IUser>('User', UserSchema);
