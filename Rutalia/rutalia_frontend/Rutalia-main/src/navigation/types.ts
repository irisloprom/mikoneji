import type { NativeStackScreenProps } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Splash: undefined;
  Walkthrough: undefined;
  CameraPermission: undefined;
  LocationPermission: undefined;
  MicrophonePermission: undefined;
  Home: undefined;
  StoryDetail: { storyId: number };
  Enigma: { enigmaId: string };
  Reward: { rewardId: string };
  MapaBarrio: undefined;
  FinalReward: { storyId: number };
};

export type SplashScreenProps = NativeStackScreenProps<RootStackParamList, 'Splash'>;
export type WalkthroughScreenProps = NativeStackScreenProps<RootStackParamList, 'Walkthrough'>;
export type CameraPermissionScreenProps = NativeStackScreenProps<RootStackParamList, 'CameraPermission'>;
export type LocationPermissionScreenProps = NativeStackScreenProps<RootStackParamList, 'LocationPermission'>;
export type MicrophonePermissionScreenProps = NativeStackScreenProps<RootStackParamList, 'MicrophonePermission'>;
export type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Home'>;
export type StoryDetailScreenProps = NativeStackScreenProps<RootStackParamList, 'StoryDetail'>;
export type EnigmaScreenProps = NativeStackScreenProps<RootStackParamList, 'Enigma'>;
export type RewardScreenProps = NativeStackScreenProps<RootStackParamList, 'Reward'>;
export type MapaBarrioScreenProps = NativeStackScreenProps<RootStackParamList, 'MapaBarrio'>;
export type FinalRewardScreenProps = NativeStackScreenProps<RootStackParamList, 'FinalReward'>;