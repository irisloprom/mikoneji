import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SplashScreen from './src/screens/SplashScreen';
import WalkthroughScreen from './src/screens/WalkthroughScreen';
import CameraPermissionScreen from './src/screens/permissions/CameraPermissionScreen';
import LocationPermissionScreen from './src/screens/permissions/LocationPermissionScreen';
import MicrophonePermissionScreen from './src/screens/permissions/MicrophonePermissionScreen';
import HomeScreen from './src/screens/HomeScreen';
import StoryDetailScreen from './src/screens/StoryDetailScreen';
import EnigmaScreen from './src/screens/enigmas/EnigmaScreen';
import RewardScreen from './src/screens/RewardScreen';
import MapaBarrioScreen from './src/screens/MapaBarrioScreen';
import FinalRewardScreen from './src/screens/FinalRewardScreen';

import { RootStackParamList } from './src/navigation/types';

const Stack = createNativeStackNavigator<RootStackParamList>();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash">
        <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Walkthrough" component={WalkthroughScreen} options={{ headerShown: false }} />
        <Stack.Screen name="CameraPermission" component={CameraPermissionScreen} options={{ headerShown: false }} />
        <Stack.Screen name="LocationPermission" component={LocationPermissionScreen} options={{ headerShown: false }} />
        <Stack.Screen name="MicrophonePermission" component={MicrophonePermissionScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="StoryDetail" component={StoryDetailScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Enigma" component={EnigmaScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Reward" component={RewardScreen} options={{ headerShown: false }} />
        <Stack.Screen name="MapaBarrio" component={MapaBarrioScreen} options={{ headerShown: false }} />
        <Stack.Screen name="FinalReward" component={FinalRewardScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;