import React from 'react';
import { View, Text, StyleSheet, StatusBar, TouchableOpacity, Image, ScrollView } from 'react-native';
import { COLORS, globalStyles } from '../styles/globalStyles';
import { FINAL_REWARDS } from '../data/finalRewards';
import { FinalRewardScreenProps } from '../navigation/types';

const FinalRewardScreen = ({ route, navigation }: FinalRewardScreenProps) => {
  const { storyId } = route.params;
  const reward = FINAL_REWARDS.find(r => r.storyId === storyId);

  if (!reward) return <View><Text>Logro no encontrado</Text></View>;

  return (
    <View style={globalStyles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <View style={styles.header}>
        <Text style={globalStyles.titleXL}>¡Logro desbloqueado!</Text>
        <View style={styles.profileIconPlaceholder}><Text>User</Text></View>
      </View>

      <View style={styles.contentContainer}>
        <Image source={require('../assets/images/eulalia-cara-hablando.png')} style={styles.characterImage} />
        <Text style={styles.storyTitle}>{reward.storyTitle}</Text>
        <Image source={reward.image} style={styles.rewardImage} />
        <View style={styles.tag}>
          <Text style={styles.tagText}>{reward.tag}</Text>
        </View>
        <Text style={styles.dateText}>{reward.date}</Text>
        <View style={styles.divider} />

        <ScrollView style={styles.descriptionContainer}>
          <Text style={styles.bodyText}>{reward.bodyText}</Text>
        </ScrollView>
      </View>

      <TouchableOpacity 
        style={styles.mapButton}
        onPress={() => navigation.navigate('Home')}
      >
        <Text style={globalStyles.bodyText}>Vuelve al mapa</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingTop: 50, width: '100%' },
  profileIconPlaceholder: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.placeholder, justifyContent: 'center', alignItems: 'center' },
  contentContainer: { flex: 1, alignItems: 'center', paddingHorizontal: 32, paddingBottom: 100 },
  characterImage: { width: 100, height: 100, resizeMode: 'contain', alignSelf: 'flex-start', marginLeft: -10 },
  storyTitle: { ...globalStyles.titleXXL, textAlign: 'center', marginTop: -20 },
  rewardImage: { width: 200, height: 200, borderRadius: 20, backgroundColor: COLORS.placeholder, marginVertical: 20 },
  tag: { backgroundColor: COLORS.tagOrange, paddingVertical: 8, paddingHorizontal: 24, borderRadius: 20 },
  tagText: { ...globalStyles.captionText, color: COLORS.textLight, fontWeight: 'bold' },
  dateText: { ...globalStyles.captionText, color: COLORS.textMuted, marginVertical: 10 },
  divider: { height: 1, width: '100%', backgroundColor: COLORS.divider, marginBottom: 20 },
  descriptionContainer: {
    flex: 1,
  },
  bodyText: { ...globalStyles.bodyText, textAlign: 'left' },
  mapButton: { position: 'absolute', bottom: 40, alignSelf: 'center', backgroundColor: 'white', paddingVertical: 15, paddingHorizontal: 40, borderRadius: 50, elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 3.84 },
});

export default FinalRewardScreen;