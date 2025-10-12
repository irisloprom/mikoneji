import { buildApiUrl } from '../config/api';
import type { Milestone } from '../context/NavigationContext';

export interface TrackingEvent {
  routeId: string;
  milestoneId: string;
  location: {
    type: 'Point';
    coordinates: [number, number]; // [lng, lat]
  };
  eventType?: 'start' | 'reach' | 'end';
  timestamp?: string;
}

export async function reportProgress(event: TrackingEvent, token: string): Promise<boolean> {
  try {
    const response = await fetch(buildApiUrl('/tracking'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(event)
    });

    if (!response.ok) {
      const detail = await response.text();
      // eslint-disable-next-line no-console
      console.warn('Tracking API returned error:', detail);
    }

    return response.ok;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Error reporting progress:', err);
    return false;
  }
}

export function buildTrackingEventFromMilestone(routeId: string, milestone: Milestone): TrackingEvent {
  return {
    routeId,
    milestoneId: milestone.id,
    location: {
      type: 'Point',
      coordinates: milestone.coordinates
    },
    eventType: 'reach',
    timestamp: new Date().toISOString()
  };
}
