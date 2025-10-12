import { Request, Response } from 'express';
import { z } from 'zod';
import { Tracking } from '../models/Tracking.js';

const trackingEventSchema = z.object({
  routeId: z.string().min(1),
  milestoneId: z.string().min(1),
  location: z.object({
    type: z.literal('Point'),
    coordinates: z.tuple([z.number(), z.number()]) // [lng, lat]
  }),
  eventType: z.enum(['start', 'reach', 'end']).optional(),
  timestamp: z.string().datetime({ offset: true }).optional()
});

export async function trackProgress(req: Request, res: Response) {
  try {
    const userId = req.user?.sub;
    if (!userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const payload = trackingEventSchema.parse(req.body);
    const timestamp = payload.timestamp ? new Date(payload.timestamp) : new Date();

    const tracking = await Tracking.create({
      userId,
      routeId: payload.routeId,
      milestoneId: payload.milestoneId,
      location: payload.location,
      eventType: payload.eventType ?? 'reach',
      timestamp
    });

    return res.status(201).json({ success: true, tracking });
  } catch (err) {
    console.error('[trackProgress]', err);
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid tracking payload', issues: err.issues });
    }
    return res.status(500).json({ error: 'Error registrando el tracking.' });
  }
}
