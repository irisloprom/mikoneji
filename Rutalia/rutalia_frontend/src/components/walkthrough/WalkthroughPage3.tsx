import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { globalStyles, walkthroughStyles } from '../../styles/globalStyles';

export const WalkthroughPage3 = ({ navigation }: { navigation: any }) => {
  return (
    <View style={styles.content}>
      <Image
        source={require('../../assets/images/eulalia-wt3.png')}
        style={walkthroughStyles.image}
        resizeMode="contain"
      />
      <View style={styles.textWrapper}>
        <Text style={globalStyles.handwrittenText}>
          Yo lo llevo todo en la mochila, ¡qué ganas tengo de que comencemos a explorar! Cuando quieras continuar con el tutorial, haz clic en el botón de “¡Empieza!"
        </Text>
      </View>
      <TouchableOpacity 
        style={styles.startButton}
        onPress={() => navigation.navigate('CameraPermission')}
      >
        <Text style={globalStyles.primaryButtonText}>¡Empieza!</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
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