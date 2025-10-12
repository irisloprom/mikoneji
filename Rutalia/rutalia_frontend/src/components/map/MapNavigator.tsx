import React, { useEffect, useMemo, useRef } from 'react';
import MapView, { LatLng, Marker, Polyline, UserLocationChangeEvent } from 'react-native-maps';
import { StyleSheet } from 'react-native';
import { BARCELONA_REGION, getBoundingRegion, haversineDistanceMeters } from '../../utils/geo';
import { Milestone, useNavigationContext } from '../../context/NavigationContext';

interface Props {
  milestones: Milestone[];
  radiusMeters?: number;
  onMilestoneReach?: (milestone: Milestone) => void;
}

const EDGE_PADDING = { top: 48, right: 48, bottom: 48, left: 48 };
const DEFAULT_RADIUS = 50;

const MapNavigator: React.FC<Props> = ({ milestones, radiusMeters = DEFAULT_RADIUS, onMilestoneReach }) => {
  const mapRef = useRef<MapView | null>(null);
  const visitedRef = useRef<Set<string>>(new Set());
  const { setCurrentMilestone } = useNavigationContext();

  const routeCoordinates: LatLng[] = useMemo(
    () =>
      milestones.map((milestone) => ({
        latitude: milestone.coordinates[1],
        longitude: milestone.coordinates[0]
      })),
    [milestones]
  );

  const initialRegion = useMemo(
    () => getBoundingRegion(milestones.map((m) => m.coordinates), BARCELONA_REGION),
    [milestones]
  );

  useEffect(() => {
    if (!mapRef.current || !routeCoordinates.length) {
      return;
    }

    mapRef.current.fitToCoordinates(routeCoordinates, { edgePadding: EDGE_PADDING, animated: true });
  }, [routeCoordinates]);

  const handleUserLocationChange = (event: UserLocationChangeEvent) => {
    const coordinate = event.nativeEvent.coordinate;
    if (!coordinate) {
      return;
    }

    const userPoint: [number, number] = [coordinate.longitude, coordinate.latitude];

    milestones.forEach((milestone) => {
      if (visitedRef.current.has(milestone.id)) {
        return;
      }

      const distance = haversineDistanceMeters(userPoint, milestone.coordinates);
      if (distance <= radiusMeters) {
        visitedRef.current.add(milestone.id);
        setCurrentMilestone(milestone);
        onMilestoneReach?.(milestone);
      }
    });
  };

  return (
    <MapView
      ref={(instance) => {
        mapRef.current = instance;
      }}
      style={styles.map}
      initialRegion={{
        latitude: initialRegion.latitude,
        longitude: initialRegion.longitude,
        latitudeDelta: initialRegion.latitudeDelta,
        longitudeDelta: initialRegion.longitudeDelta
      }}
      showsUserLocation
      onUserLocationChange={handleUserLocationChange}
    >
      {routeCoordinates.map((coordinate, index) => (
        <Marker
          key={milestones[index]?.id ?? index}
          coordinate={coordinate}
          title={milestones[index]?.title}
        />
      ))}

      {routeCoordinates.length > 1 && (
        <Polyline
          coordinates={routeCoordinates}
          strokeColor="#FF0055"
          strokeWidth={4}
        />
      )}
    </MapView>
  );
};

const styles = StyleSheet.create({
  map: {
    flex: 1
  }
});

export default MapNavigator;
