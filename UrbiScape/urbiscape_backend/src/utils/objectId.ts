// src/utils/objectId.ts
import mongoose from 'mongoose';
export const isObjectId = (s: string) => /^[0-9a-fA-F]{24}$/.test(s);
export const toObjectId = (s: string) => new mongoose.Types.ObjectId(s);
