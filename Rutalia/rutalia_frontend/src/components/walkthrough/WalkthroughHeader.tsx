import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, globalStyles } from '../../styles/globalStyles';

interface WalkthroughHeaderProps {
  navigation: any;
  showSkip?: boolean;
}

export const WalkthroughHeader = ({ navigation, showSkip = true }: WalkthroughHeaderProps) => {
  return (
    <View style={styles.header}>
      <Text style={globalStyles.rutaliaHeader}>Rutalia</Text>
      {showSkip ? (
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Text style={styles.skipButton}>Saltar</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.skipButtonPlaceholder} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 41,
    paddingTop: 65,
  },
  skipButton: {
    ...globalStyles.captionText,
    fontFamily: 'TT Hoves Pro Trial Variable',
    color: COLORS.textMuted,
  },
  skipButtonPlaceholder: {
    width: 50,
  },
});