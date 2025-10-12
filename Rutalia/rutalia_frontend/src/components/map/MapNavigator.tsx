import React, { useEffect, useRef, useState } from 'react';
import mapboxgl, { Map } from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { initMapbox, fitToRouteBounds, getDirectionsGeoJSON } from '@/utils/mapbox';
import { useNavigationContext } from '@/context/NavigationContext';

type Coordinate = [number, number];

interface Milestone {
  id: string;
  title: string;
  coordinates: Coordinate;
}

interface Props {
  milestones: Milestone[];
  onMilestoneReach?: (milestone: Milestone) => void;
}

const MapNavigator: React.FC<Props> = ({ milestones, onMilestoneReach }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Map | null>(null);
  const [userCoords, setUserCoords] = useState<Coordinate | null>(null);
  const reached = useRef<Set<string>>(new Set());

  const { setCurrentMilestone } = useNavigationContext();

  useEffect(() => {
    initMapbox();

    if (!mapContainer.current) return;

    mapRef.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [2.17, 41.38],
      zoom: 14
    });

    mapRef.current.on('load', async () => {
      const routeSegments: Coordinate[] = [];

      for (let i = 0; i < milestones.length - 1; i++) {
        const from = milestones[i].coordinates;
        const to = milestones[i + 1].coordinates;
        const segment = await getDirectionsGeoJSON(from, to);
        if (segment) {
          routeSegments.push(...(segment.geometry.coordinates as Coordinate[]));
        }
      }

      if (routeSegments.length > 0) {
        const fullRoute = {
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: routeSegments
          },
          properties: {}
        };

        mapRef.current?.addSource('route', {
          type: 'geojson',
          data: fullRoute
        });

        mapRef.current?.addLayer({
          id: 'route-line',
          type: 'line',
          source: 'route',
          paint: {
            'line-color': '#FF0055',
            'line-width': 4
          }
        });

        fitToRouteBounds(mapRef.current, routeSegments);
      }

      milestones.forEach((m) => {
        const el = document.createElement('div');
        el.className = 'marker';
        el.style.width = '12px';
        el.style.height = '12px';
        el.style.backgroundColor = 'blue';
        el.style.borderRadius = '50%';

        new mapboxgl.Marker(el).setLngLat(m.coordinates).setPopup(
          new mapboxgl.Popup().setText(m.title)
        ).addTo(mapRef.current!);
      });
    });

    return () => mapRef.current?.remove();
  }, [milestones]);

  useEffect(() => {
    const watch = navigator.geolocation.watchPosition((pos) => {
      const coords: Coordinate = [pos.coords.longitude, pos.coords.latitude];
      setUserCoords(coords);

      milestones.forEach((m) => {
        const distance = getDistance(coords, m.coordinates);
        if (distance < 50 && !reached.current.has(m.id)) {
          reached.current.add(m.id);
          setCurrentMilestone(m);
          onMilestoneReach?.(m);
        }
      });
    });

    return () => navigator.geolocation.clearWatch(watch);
  }, [milestones, onMilestoneReach, setCurrentMilestone]);

  useEffect(() => {
    if (!mapRef.current || !userCoords) return;

    const userMarker = new mapboxgl.Marker({ color: 'red' })
      .setLngLat(userCoords)
      .addTo(mapRef.current);

    mapRef.current.flyTo({ center: userCoords, zoom: 16 });

    return () => userMarker.remove();
  }, [userCoords]);

  return <div ref={mapContainer} style={{ height: '100vh', width: '100%' }} />;
};

export default MapNavigator;

function getDistance(a: Coordinate, b: Coordinate) {
  const R = 6371e3;
  const toRad = (d: number) => d * Math.PI / 180;
  const [lon1, lat1] = a.map(toRad);
  const [lon2, lat2] = b.map(toRad);
  const dLat = lat2 - lat1;
  const dLon = lon2 - lon1;
  const aVal = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(aVal), Math.sqrt(1 - aVal));
}
