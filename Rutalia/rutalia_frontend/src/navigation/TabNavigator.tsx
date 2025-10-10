import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, Image, StyleSheet } from 'react-native';
import HomeScreen from '../screens/HomeScreen';
import MapaBarrioScreen from '../screens/MapaBarrioScreen';
import { COLORS, FONTS, SIZES } from '../styles/globalStyles';
import { TabParamList } from './types';

const Tab = createBottomTabNavigator<TabParamList>();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
      }}
    >
      <Tab.Screen 
        name="MapaTab" 
        component={MapaBarrioScreen} 
        options={{
          tabBarIcon: ({ focused }: { focused: boolean }) => (
            <View style={styles.tabIconContainer}>
              <Image source={require('../assets/images/icon-mapa.png')} style={[styles.tabIcon, { tintColor: focused ? COLORS.textDark : COLORS.textMuted }]} />
              <Text style={[styles.tabLabel, { color: focused ? COLORS.textDark : COLORS.textMuted }]}>Mapa</Text>
            </View>
          )
        }}
      />
      <Tab.Screen 
        name="Inicio" 
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }: { focused: boolean }) => (
            <View style={styles.tabIconContainer}>
              <Image source={require('../assets/images/icon-inicio.png')} style={[styles.tabIcon, { tintColor: focused ? COLORS.textDark : COLORS.textMuted }]} />
              <Text style={[styles.tabLabel, { color: focused ? COLORS.textDark : COLORS.textMuted }]}>Inicio</Text>
            </View>
          )
        }}
       />
      <Tab.Screen 
        name="Perfil" 
        component={HomeScreen} 
        options={{
          tabBarIcon: ({ focused }: { focused: boolean }) => (
            <View style={styles.tabIconContainer}>
              <Image source={require('../assets/images/icon-perfil.png')} style={[styles.tabIcon, { tintColor: focused ? COLORS.textDark : COLORS.textMuted }]} />
              <Text style={[styles.tabLabel, { color: focused ? COLORS.textDark : COLORS.textMuted }]}>Perfil</Text>
            </View>
          )
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: { height: 80, backgroundColor: COLORS.background, borderTopWidth: 2, borderColor: COLORS.textDark },
  tabIconContainer: { alignItems: 'center', justifyContent: 'center', top: 10 },
  tabIcon: { width: 24, height: 24, resizeMode: 'contain' },
  tabLabel: { fontFamily: FONTS.body, fontSize: SIZES.xsmall, marginTop: 4 },
});

export default TabNavigator;