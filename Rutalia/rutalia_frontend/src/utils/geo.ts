export type Coordinate = [number, number];

export interface MapRegion {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

const EARTH_RADIUS_M = 6371_000; // metres

export function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

export function haversineDistanceMeters(a: Coordinate, b: Coordinate): number {
  const [lng1, lat1] = a.map(toRadians) as [number, number];
  const [lng2, lat2] = b.map(toRadians) as [number, number];

  const dLat = lat2 - lat1;
  const dLng = lng2 - lng1;

  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;

  return 2 * EARTH_RADIUS_M * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

export function getBoundingRegion(
  coordinates: Coordinate[],
  fallback: MapRegion
): MapRegion {
  if (!coordinates.length) {
    return fallback;
  }

  const lats = coordinates.map(([, lat]) => lat);
  const lngs = coordinates.map(([lng]) => lng);

  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);

  const latitudeDelta = Math.max((maxLat - minLat) * 1.2, 0.01);
  const longitudeDelta = Math.max((maxLng - minLng) * 1.2, 0.01);

  return {
    latitude: (minLat + maxLat) / 2,
    longitude: (minLng + maxLng) / 2,
    latitudeDelta,
    longitudeDelta
  };
}

export const BARCELONA_REGION: MapRegion = {
  latitude: 41.3874,
  longitude: 2.1686,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05
};
