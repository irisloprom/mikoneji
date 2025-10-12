import React, { useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, StatusBar } from 'react-native';
import { COLORS, FONTS, SIZES, globalStyles } from '../styles/globalStyles';
import { MapaBarrioScreenProps } from '../navigation/types';
import MapNavigator from '../components/map/MapNavigator';
import { DEFAULT_ROUTE_ID, ROUTES } from '../data/routes';
import { useNavigationContext } from '../context/NavigationContext';

const MapaBarrioScreen = ({ navigation }: MapaBarrioScreenProps) => {
  const { activeRouteId, setActiveRouteId, currentMilestone } = useNavigationContext();

  const routeId = activeRouteId ?? DEFAULT_ROUTE_ID;
  const milestones = useMemo(() => ROUTES[routeId] ?? [], [routeId]);

  useEffect(() => {
    if (!activeRouteId) {
      setActiveRouteId(DEFAULT_ROUTE_ID);
    }
  }, [activeRouteId, setActiveRouteId]);

  return (
    <View style={globalStyles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={require('../assets/images/boton-arrow-left.png')} style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={globalStyles.screenTitle}>MAPA</Text>
        <View style={styles.headerPlaceholder} />
      </View>

      <View style={styles.mapContainer}>
        <MapNavigator
          milestones={milestones}
          onMilestoneReach={(milestone) => {
            // eslint-disable-next-line no-console
            console.log('Milestone reached', milestone.id);
          }}
        />
      </View>

      <View style={styles.panel}>
        <Text style={styles.panelTitle}>{currentMilestone?.title ?? 'Explora la ruta'}</Text>
        <Text style={styles.panelSubtitle}>
          {currentMilestone
            ? 'Estás dentro del radio de este hito. Sigue las instrucciones para desbloquear el siguiente.'
            : 'Activa tu ubicación y acércate a los hitos destacados en el mapa para desbloquear contenido.'}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 50,
    width: '100%'
  },
  backIcon: {
    width: 24,
    height: 24
  },
  headerPlaceholder: {
    width: 24
  },
  mapContainer: {
    flex: 1,
    width: '100%',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
    marginTop: 16
  },
  panel: {
    width: '100%',
    paddingHorizontal: 24,
    paddingVertical: 20,
    backgroundColor: COLORS.background
  },
  panelTitle: {
    fontFamily: FONTS.heading,
    fontSize: SIZES.large,
    color: COLORS.textDark,
    marginBottom: 8
  },
  panelSubtitle: {
    fontFamily: FONTS.body,
    fontSize: SIZES.small,
    color: COLORS.textMuted,
    lineHeight: 20
  }
});

export default MapaBarrioScreen;
