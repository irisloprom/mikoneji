import mongoose, { Schema, Document } from 'mongoose';

export interface ITracking extends Document {
  userId: string;
  routeId: string;
  milestoneId: string;
  location: {
    type: 'Point';
    coordinates: [number, number]; // [lng, lat]
  };
  eventType?: 'start' | 'reach' | 'end';
  timestamp: Date;
}

const TrackingSchema: Schema = new Schema({
  userId: { type: String, required: true },
  routeId: { type: String, required: true },
  milestoneId: { type: String, required: true },
  location: {
    type: { type: String, enum: ['Point'], required: true },
    coordinates: { type: [Number], required: true }
  },
  eventType: { type: String, enum: ['start', 'reach', 'end'], default: 'reach' },
  timestamp: { type: Date, default: Date.now }
});

TrackingSchema.index({ location: '2dsphere' });

export default mongoose.model<ITracking>('Tracking', TrackingSchema);
