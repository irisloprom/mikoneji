import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import FastImage from 'react-native-fast-image';
import { globalStyles, walkthroughStyles } from '../../styles/globalStyles';

export const WalkthroughPage2 = () => {
  return (
    <View style={styles.content}>
      <FastImage
        source={require('../../assets/images/eulalia_W2.gif')}
        style={walkthroughStyles.image}
        resizeMode={FastImage.resizeMode.contain}
      />
      <View style={styles.textWrapper}>
        <Text style={globalStyles.handwrittenTitle}>Resuelve enigmas para descubrir las historias</Text>
        <Text style={styles.paragraph}>
          A través de la resolución de enigmas relacionados con las historias, descubrirás la memoria oculta y alternativa
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