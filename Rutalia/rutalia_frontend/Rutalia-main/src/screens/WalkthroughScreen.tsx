import React, { useState } from 'react';
import { View, Text, StyleSheet, StatusBar, TouchableOpacity } from 'react-native';
import PagerView from 'react-native-pager-view';
import { COLORS, globalStyles, walkthroughStyles } from '../styles/globalStyles';
import { WalkthroughPage1 } from '../components/walkthrough/WalkthroughPage1';
import { WalkthroughPage2 } from '../components/walkthrough/WalkthroughPage2';
import { WalkthroughPage3 } from '../components/walkthrough/WalkthroughPage3';
import { WalkthroughScreenProps } from '../navigation/types';

const WalkthroughScreen = ({ navigation }: WalkthroughScreenProps) => {
  const [pageIndex, setPageIndex] = useState(0);

  return (
    <View style={globalStyles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      
      <View style={styles.header}>
        <Text style={globalStyles.rutaliaHeader}>Rutalia</Text>
        {pageIndex !== 2 && (
          <TouchableOpacity onPress={() => navigation.navigate('Home')}>
            <Text style={styles.skipButton}>Saltar</Text>
          </TouchableOpacity>
        )}
      </View>

      <PagerView 
        style={styles.pagerView} 
        initialPage={0}
        onPageSelected={e => setPageIndex(e.nativeEvent.position)}
      >
        <View key="1"><WalkthroughPage1 /></View>
        <View key="2"><WalkthroughPage2 /></View>
        <View key="3"><WalkthroughPage3 navigation={navigation} /></View>
      </PagerView>

      <View style={styles.paginationContainer}>
        {[0, 1, 2].map(index => (
          <View
            key={index}
            style={[
              walkthroughStyles.dot,
              pageIndex === index && styles.activeDot,
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 41,
    paddingTop: 65,
    minHeight: 32 + 65,
  },
  skipButton: {
    ...globalStyles.captionText,
    fontFamily: 'TT Hoves Pro Trial Variable',
    color: COLORS.textMuted,
  },
  pagerView: {
    flex: 1,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    height: 67.65,
  },
  activeDot: {
    backgroundColor: COLORS.dotActive,
  },
});

export default WalkthroughScreen;