import React, { useState } from 'react';
import { View, Text, StyleSheet, StatusBar, TouchableOpacity, Image, ScrollView, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { COLORS, FONTS, globalStyles } from '../styles/globalStyles';
import { StoryDetailScreenProps } from '../navigation/types';
import { STORIES } from '../data/stories';

const StoryDetailScreen = ({ route, navigation }: StoryDetailScreenProps) => {
  const { storyId } = route.params;
  const story = STORIES.find(s => s.id === storyId);
  const [showTopFade, setShowTopFade] = useState(false);
  const [showBottomFade, setShowBottomFade] = useState(true);

  if (!story) return <View style={styles.container}><Text>Historia no encontrada</Text></View>;

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const isAtTop = contentOffset.y <= 10;
    const isAtBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - 10;
    setShowTopFade(!isAtTop);
    setShowBottomFade(!isAtBottom);
  };
  
  const descriptionWithoutBoldPart = story.description.substring(0, story.description.lastIndexOf('¡Vamos a descubrirlo!'));
  const boldPart = '¡Vamos a descubrirlo!';

  return (
    <View style={globalStyles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <View style={styles.headerContainer}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}><Image source={require('../assets/images/boton-arrow-left.png')} style={styles.backIcon} /></TouchableOpacity>
          <Text style={styles.headerTitle}>Rutalia</Text>
          <Image source={require('../assets/images/eulalia-avatar.png')} style={styles.profileIcon} />
        </View>
      </View>
      <View style={styles.headerSeparator} />
      <View style={styles.contentContainer}>
        <Image source={story.image} style={styles.mainImage} />
        <Text style={styles.mainTitle}>{story.title}</Text>
        <Text style={styles.subtitle}>{story.neighborhood}</Text>
        <View style={styles.infoBar}>
          <View style={styles.infoItem}><Text style={styles.infoLabel}>Duración</Text><Text style={styles.infoValue}>{story.duration}</Text></View>
          <View style={styles.infoDivider} />
          <TouchableOpacity style={styles.tag}><Text style={styles.tagText}>{story.tag}</Text></TouchableOpacity>
          <View style={styles.infoDivider} />
          <View style={styles.infoItem}><Text style={styles.infoLabel}>Enigmas</Text><Text style={styles.infoValue}>{story.enigmas}</Text></View>
        </View>
        <View style={styles.scrollWrapper}>
          <ScrollView showsVerticalScrollIndicator={false} onScroll={handleScroll} scrollEventThrottle={16}>
            <Text style={styles.description}>
              {descriptionWithoutBoldPart}
              <Text style={styles.boldText}>{boldPart}</Text>
            </Text>
          </ScrollView>
          {showTopFade && <LinearGradient colors={[COLORS.background, 'transparent']} style={styles.fadeTop} />}
          {showBottomFade && <LinearGradient colors={['transparent', COLORS.background]} style={styles.fadeBottom} />}
        </View>
        <TouchableOpacity style={styles.startButton} onPress={() => navigation.navigate('Enigma', { enigmaId: story.firstEnigmaId })}>
          <Text style={globalStyles.primaryButtonText}>Iniciar</Text>
        </TouchableOpacity>
      </View>
      <Image source={story.footerImage} style={styles.footerImage} />
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: { width: '100%', alignItems: 'center', paddingTop: 50 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: 327, height: 53 },
  backIcon: { width: 19.47, height: 29.97, resizeMode: 'contain' },
  headerTitle: { ...globalStyles.headerTitle, width: 98, height: 44 },
  profileIcon: { width: 55, height: 53, borderRadius: 27.5 },
  headerSeparator: { height: 3, backgroundColor: COLORS.textDark, marginTop: 12, marginHorizontal: 24 },
  contentContainer: { flex: 1, alignItems: 'center', paddingHorizontal: 35, paddingBottom: 100 },
  mainImage: { width: 300, height: 200, resizeMode: 'contain', marginTop: 20 },
  mainTitle: { ...globalStyles.titleXXL, marginTop: 20 },
  subtitle: { fontFamily: FONTS.title, textDecorationLine: 'underline', color: COLORS.textMuted, marginTop: 8, fontSize: 20, letterSpacing: 1 },
  infoBar: { flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', width: '100%', marginVertical: 24, borderBottomWidth: 1, borderColor: COLORS.tagOrange, paddingBottom: 12 },
  infoItem: { alignItems: 'center' },
  infoLabel: { ...globalStyles.captionText, color: COLORS.textMuted },
  infoValue: { ...globalStyles.captionText },
  infoDivider: { width: 1, height: '100%', backgroundColor: COLORS.tagOrange },
  tag: { backgroundColor: COLORS.tagOrange, borderRadius: 20, paddingVertical: 8, paddingHorizontal: 24 },
  tagText: { ...globalStyles.captionText, color: COLORS.textLight, fontWeight: 'bold' },
  scrollWrapper: { flex: 1, width: '100%' },
  description: { ...globalStyles.bodyText, textAlign: 'justify' },
  boldText: { fontWeight: 'bold' },
  startButton: { ...globalStyles.primaryButton, backgroundColor: COLORS.textDark, width: 170, height: 53, borderRadius: 32, marginTop: 32 },
  footerImage: { position: 'absolute', bottom: 0, width: '100%', height: 80, resizeMode: 'contain' },
  container: { ...globalStyles.container, justifyContent: 'center', alignItems: 'center' },
  fadeTop: { position: 'absolute', top: 0, left: 0, right: 0, height: 30 },
  fadeBottom: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 30 },
});

export default StoryDetailScreen;