import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, StatusBar } from 'react-native';
import { COLORS, globalStyles } from '../styles/globalStyles';
import { MapaBarrioScreenProps } from '../navigation/types';

const MapaBarrioScreen = ({ navigation }: MapaBarrioScreenProps) => {
  return (
    <View style={globalStyles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={require('../assets/images/boton-arrow-left.png')} style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={globalStyles.titleXXL}>MAPA</Text>
        <View style={styles.headerPlaceholder} />
      </View>
      <View style={styles.content} />
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
    width: '100%',
  },
  backIcon: {
    width: 24,
    height: 24,
  },
  headerPlaceholder: {
    width: 24,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MapaBarrioScreen;