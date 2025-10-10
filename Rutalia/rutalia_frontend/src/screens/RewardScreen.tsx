import React, { useState } from 'react';
import { View, Text, StyleSheet, StatusBar, TouchableOpacity, Image, ScrollView, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import * as Progress from 'react-native-progress';
import LinearGradient from 'react-native-linear-gradient';
import { COLORS, globalStyles, SIZES, FONTS } from '../styles/globalStyles';
import { REWARDS } from '../data/rewards';
import { ENIGMAS } from '../data/enigmas';
import { RewardScreenProps } from '../navigation/types';

const RewardScreen = ({ route, navigation }: RewardScreenProps) => {
  const { rewardId } = route.params;
  const reward = REWARDS.find(r => r.id === rewardId);
  const enigma = ENIGMAS.find(e => e.rewardId === rewardId);

  const [showTopFade, setShowTopFade] = useState(false);
  const [showBottomFade, setShowBottomFade] = useState(true);

  if (!reward || !enigma) return <View><Text>Contenido no encontrado</Text></View>;

  const progress = enigma.order / enigma.totalEnigmas;

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const isAtTop = contentOffset.y <= 10;
    const isAtBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - 10;
    
    setShowTopFade(!isAtTop);
    setShowBottomFade(!isAtBottom);
  };

  return (
    <View style={globalStyles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      
      <View style={styles.headerContainer}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.navigate('Home')}>
            <Image source={require('../assets/images/boton-chincheta-volver.png')} style={styles.icon30} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>¡Recompensa desbloqueada!</Text>
          <Image source={require('../assets/images/eulalia-avatar.png')} style={styles.profileIcon} />
        </View>
      </View>

      <View style={styles.contentContainer}>
        <Image source={reward.image} style={styles.mainImage} />
        <View style={styles.progressBarContainer}>
          <Progress.Bar 
            progress={progress} 
            width={null} 
            height={20}
            color={COLORS.tagOrange} 
            unfilledColor={'rgba(202, 105, 53, 0.1)'} 
            borderWidth={0} 
          />
        </View>
        <View style={styles.paddedContent}>
          <View style={styles.audioPlayer}>
            <Text style={styles.audioText}>Texto a audio</Text>
            <Image source={require('../assets/images/sound-wave.png')} style={styles.soundWave} />
          </View>
        </View>
        
        <View style={styles.scrollWrapper}>
          <ScrollView 
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
          >
            <Text style={styles.description}>
              <Text style={styles.boldText}>{reward.firstLine}{'\n\n'}</Text>
              <Text style={styles.boldText}>{reward.boldLine}{'\n\n'}</Text>
              {reward.scrollableText}
            </Text>
          </ScrollView>
          {showTopFade && (
            <LinearGradient
              colors={[COLORS.background, 'transparent']}
              style={styles.fadeTop}
            />
          )}
          {showBottomFade && (
            <LinearGradient
              colors={['transparent', COLORS.background]}
              style={styles.fadeBottom}
            />
          )}
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.nextButton}
          onPress={() => navigation.navigate(reward.nextScreen as any, reward.nextScreenParams)}
        >
          <Text style={globalStyles.primaryButtonText}>Siguiente</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    width: '100%',
    alignItems: 'center',
    paddingTop: 50,
  },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    width: 327, 
    height: 88, 
    gap: 24.5,
  },
  icon30: { width: 30, height: 30, resizeMode: 'contain' },
  headerTitle: {
    ...globalStyles.headerTitle,
    fontSize: 28,
    textAlign: 'center',
    flex: 1,
  },
  profileIcon: { 
    width: 55, 
    height: 53, 
    borderRadius: 27.5, 
  },
  contentContainer: {
    flex: 1,
  },
  mainImage: { 
    width: '100%', 
    height: 295, 
    resizeMode: 'cover' 
  },
  progressBarContainer: {
    width: '100%',
    height: 20,
  },
  paddedContent: {
    paddingHorizontal: 15,
  },
  audioPlayer: { 
    borderWidth: 1, 
    borderColor: COLORS.textDark, 
    borderRadius: 12, 
    backgroundColor: 'white', 
    padding: 15, 
    marginTop: 15, 
    marginBottom: 18,
    gap: 10 
  },
  audioText: { 
    fontFamily: FONTS.inter, 
    fontSize: SIZES.body 
  },
  soundWave: { 
    width: '100%', 
    height: 20, 
    resizeMode: 'contain' 
  },
  scrollWrapper: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  description: { 
    ...globalStyles.bodyText, 
    textAlign: 'left', 
  },
  boldText: {
    fontWeight: 'bold',
  },
  footer: {
    padding: 20,
  },
  nextButton: { 
    ...globalStyles.primaryButton, 
    backgroundColor: COLORS.textDark, 
    width: '100%',
  },
  fadeTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 30,
  },
  fadeBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 30,
  },
});

export default RewardScreen;