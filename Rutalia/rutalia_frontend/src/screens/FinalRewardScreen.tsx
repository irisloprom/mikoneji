import React, { useState } from 'react';
import { View, Text, StyleSheet, StatusBar, TouchableOpacity, Image, ScrollView, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { COLORS, globalStyles, FONTS, SIZES } from '../styles/globalStyles';
import { FINAL_REWARDS } from '../data/finalRewards';
import { FinalRewardScreenProps } from '../navigation/types';

const FinalRewardScreen = ({ route, navigation }: FinalRewardScreenProps) => {
  const { storyId } = route.params;
  const reward = FINAL_REWARDS.find(r => r.storyId === storyId);
  const [showTopFade, setShowTopFade] = useState(false);
  const [showBottomFade, setShowBottomFade] = useState(true);
  const [isUserRegistered, _setIsUserRegistered] = useState(false);

  if (!reward) return <View><Text>Logro no encontrado</Text></View>;

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const isAtTop = contentOffset.y <= 10;
    const isAtBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - 10;
    setShowTopFade(!isAtTop);
    setShowBottomFade(!isAtBottom);
  };

  const renderFooterButton = () => {
    if (isUserRegistered) {
      return (
        <>
          <Text style={styles.footerText}>¡Ahora puedes adentrarte al mundo de Rutalia!</Text>
          <TouchableOpacity style={styles.footerButton} onPress={() => navigation.navigate('Home')}>
            <Text style={styles.footerButtonText}>Vuelve al mapa</Text>
          </TouchableOpacity>
        </>
      );
    }
    return (
      <>
        <Text style={styles.footerText}>Regístrate para guardar tu progreso y continuar desbloqueando enigmas</Text>
        <TouchableOpacity style={styles.footerButton} onPress={() => {}}>
          <Text style={styles.footerButtonText}>Regístrate</Text>
        </TouchableOpacity>
      </>
    );
  };

  return (
    <View style={globalStyles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}><Image source={require('../assets/images/boton-chincheta-volver.png')} style={styles.icon} /></TouchableOpacity>
        <Text style={globalStyles.headerTitle}>¡Logro desbloqueado!</Text>
        <Image source={require('../assets/images/eulalia-avatar.png')} style={styles.profileIcon} />
      </View>
      <View style={styles.divider} />

      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Image source={require('../assets/images/eulalia-logro.png')} style={styles.characterImage} />
        <Text style={styles.storyTitle}>{reward.achievementSubtitle}</Text>
        <Image source={reward.image} style={styles.rewardImage} />
        <View style={styles.tag}><Text style={styles.tagText}>{reward.tag}</Text></View>
        <View style={styles.divider} />
        <View style={styles.audioPlayer}>
          <Text style={styles.audioText}>Texto a audio</Text>
          <Image source={require('../assets/images/sound-wave.png')} style={styles.soundWave} />
        </View>
        <View style={styles.scrollWrapper}>
          <ScrollView showsVerticalScrollIndicator={false} onScroll={handleScroll} scrollEventThrottle={16}>
            <Text style={styles.bodyText}>{reward.bodyText}</Text>
          </ScrollView>
          {showTopFade && <LinearGradient colors={[COLORS.background, 'transparent']} style={styles.fadeTop} />}
          {showBottomFade && <LinearGradient colors={['transparent', COLORS.background]} style={styles.fadeBottom} />}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        {renderFooterButton()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingTop: 50, width: '100%' },
  icon: { width: 32, height: 32, resizeMode: 'contain' },
  profileIcon: { width: 40, height: 40, borderRadius: 20 },
  divider: { height: 3, width: '100%', backgroundColor: COLORS.textDark, marginTop: 10 },
  contentContainer: { alignItems: 'center', paddingHorizontal: 32, paddingBottom: 150 },
  characterImage: { width: 100, height: 100, resizeMode: 'contain', alignSelf: 'flex-start', marginLeft: -10 },
  storyTitle: { ...globalStyles.screenTitle, textAlign: 'center', marginTop: -20 },
  rewardImage: { width: 231, height: 231, borderRadius: 12, backgroundColor: 'rgba(202, 105, 53, 0.75)', marginVertical: 20 },
  tag: { backgroundColor: COLORS.tagOrange, paddingVertical: 8, paddingHorizontal: 15, borderRadius: 12, marginBottom: 20 },
  tagText: { ...globalStyles.captionText, color: COLORS.textLight, fontWeight: 'bold' },
  audioPlayer: { width: 346, height: 81, borderWidth: 1, borderColor: COLORS.textDark, borderRadius: 12, backgroundColor: 'white', padding: 15, marginVertical: 20, gap: 10 },
  audioText: { fontFamily: FONTS.inter, fontSize: SIZES.body },
  soundWave: { width: '100%', height: 20, resizeMode: 'contain' },
  scrollWrapper: { flex: 1, width: 346, height: 342 },
  bodyText: { ...globalStyles.bodyText, textAlign: 'justify' },
  footer: { position: 'absolute', bottom: 0, width: '100%', alignItems: 'center', padding: 20, backgroundColor: COLORS.background },
  footerText: { fontFamily: FONTS.barlow, fontStyle: 'italic', fontSize: SIZES.xsmall, color: COLORS.textDark, textAlign: 'center', marginBottom: 10 },
  footerButton: { width: 303, height: 52, backgroundColor: COLORS.background, justifyContent: 'center', alignItems: 'center', borderRadius: 30, elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84 },
  footerButtonText: { ...globalStyles.bodyText },
  fadeTop: { position: 'absolute', top: 0, left: 0, right: 0, height: 30 },
  fadeBottom: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 30 },
});

export default FinalRewardScreen;