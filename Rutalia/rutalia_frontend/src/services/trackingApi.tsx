export interface TrackingEvent {
  userId: string;
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
    const response = await fetch('/api/tracking', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(event)
    });

    return response.ok;
  } catch (err) {
    console.error('Error reporting progress:', err);
    return false;
  }
}
