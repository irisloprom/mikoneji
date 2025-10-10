import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { globalStyles } from '../../styles/globalStyles';
import { WalkthroughHeader } from './WalkthroughHeader';

export const WalkthroughPage3 = ({ navigation }: { navigation: any }) => {
  return (
    <View style={styles.container}>
      <WalkthroughHeader navigation={navigation} showSkip={false} />
      <View style={styles.content}>
        <Image
          source={require('../../assets/images/eulalia-wt3.png')}
          style={styles.image}
        />
        <View style={styles.textWrapper}>
          <Text style={globalStyles.handwrittenText}>
            Yo lo llevo todo en la mochila, ¡qué ganas tengo de que comencemos a explorar! Cuando quieras continuar con el tutorial, haz clic en el botón de “¡Empieza!"
          </Text>
        </View>
        <TouchableOpacity 
          style={styles.startButton}
          onPress={() => navigation.navigate('Auth')}
        >
          <Text style={globalStyles.primaryButtonText}>¡Empieza!</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  image: {
    width: '90%',
    aspectRatio: 1,
    resizeMode: 'contain',
  },
  textWrapper: {
    marginTop: 52,
    width: 306,
    alignItems: 'center',
  },
  startButton: {
    ...globalStyles.primaryButton,
    width: 272,
    borderRadius: 32,
    marginTop: 40,
  },
});