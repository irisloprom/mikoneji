import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import FastImage from 'react-native-fast-image';
import { globalStyles, walkthroughStyles } from '../../styles/globalStyles';

export const WalkthroughPage1 = () => {
  return (
    <View style={styles.content}>
      <FastImage
        source={require('../../assets/images/eulalia_W1.gif')}
        style={walkthroughStyles.image}
        resizeMode={FastImage.resizeMode.contain}
      />
      <View style={styles.textWrapper}>
        <Text style={globalStyles.handwrittenTitle}>¡Hola! Soy Eulàlia</Text>
        <Text style={styles.paragraph}>
          Pero puedes llamarme Eu. {'\n'}
          Te doy la bienvenida a Rutalia, la app para descubrir historias alternativas de la ciudad.
        </Text>
      </View>
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
    width: 305,
    alignItems: 'center',
  },
  paragraph: {
    ...globalStyles.handwrittenText,
    marginTop: 10,
  },
});