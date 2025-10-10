import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { CompositeScreenProps } from '@react-navigation/native';

export type RootStackParamList = {
  Splash: undefined;
  Walkthrough: undefined;
  Auth: undefined;
  SignUp: undefined;
  Login: undefined;
  ForgotPassword: undefined;
  ResetPassword: undefined;
  Verification: { email: string };
  CameraPermission: undefined;
  LocationPermission: undefined;
  MicrophonePermission: undefined;
  Main: undefined;
  StoryDetail: { storyId: number };
  Enigma: { enigmaId: string };
  Reward: { rewardId: string };
  FinalReward: { storyId: number };
};

export type TabParamList = {
  MapaTab: undefined;
  Inicio: undefined;
  Perfil: undefined;
};

export type SplashScreenProps = NativeStackScreenProps<RootStackParamList, 'Splash'>;
export type WalkthroughScreenProps = NativeStackScreenProps<RootStackParamList, 'Walkthrough'>;
export type AuthScreenProps = NativeStackScreenProps<RootStackParamList, 'Auth'>;
export type SignUpScreenProps = NativeStackScreenProps<RootStackParamList, 'SignUp'>;
export type LoginScreenProps = NativeStackScreenProps<RootStackParamList, 'Login'>;
export type ForgotPasswordScreenProps = NativeStackScreenProps<RootStackParamList, 'ForgotPassword'>;
export type ResetPasswordScreenProps = NativeStackScreenProps<RootStackParamList, 'ResetPassword'>;
export type VerificationScreenProps = NativeStackScreenProps<RootStackParamList, 'Verification'>;
export type CameraPermissionScreenProps = NativeStackScreenProps<RootStackParamList, 'CameraPermission'>;
export type LocationPermissionScreenProps = NativeStackScreenProps<RootStackParamList, 'LocationPermission'>;
export type MicrophonePermissionScreenProps = NativeStackScreenProps<RootStackParamList, 'MicrophonePermission'>;
export type StoryDetailScreenProps = NativeStackScreenProps<RootStackParamList, 'StoryDetail'>;
export type EnigmaScreenProps = NativeStackScreenProps<RootStackParamList, 'Enigma'>;
export type RewardScreenProps = NativeStackScreenProps<RootStackParamList, 'Reward'>;
export type FinalRewardScreenProps = NativeStackScreenProps<RootStackParamList, 'FinalReward'>;

export type HomeScreenProps = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, 'Inicio'>,
  NativeStackScreenProps<RootStackParamList>
>;

export type MapaBarrioScreenProps = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, 'MapaTab'>,
  NativeStackScreenProps<RootStackParamList>
>;