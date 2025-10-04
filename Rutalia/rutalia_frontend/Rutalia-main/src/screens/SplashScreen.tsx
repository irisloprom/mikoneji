import React, { useEffect } from 'react';
import { View, Image, StyleSheet, StatusBar, Text } from 'react-native';
import { COLORS, globalStyles } from '../styles/globalStyles';
import { SplashScreenProps } from '../navigation/types';

const SplashScreen = ({ navigation }: SplashScreenProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Walkthrough');
    }, 2500);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <Text style={styles.title}>
        Rutalia
      </Text>
      <Image
        source={require('../assets/images/logo.png')}
        style={styles.logo}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...globalStyles.container,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 50,
  },
  title: {
    ...globalStyles.rutaliaHeader,
    textAlign: 'center',
    letterSpacing: 1.6,
    width: 276,
    height: 44,
  },
  logo: {
    width: 276,
    height: 277,
    resizeMode: 'contain',
  },
});

export default SplashScreen;