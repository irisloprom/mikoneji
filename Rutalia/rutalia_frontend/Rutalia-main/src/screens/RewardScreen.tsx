import React from 'react';
import { View, Text, StyleSheet, StatusBar, TouchableOpacity, Image, ScrollView } from 'react-native';
import { COLORS, globalStyles } from '../styles/globalStyles';
import { REWARDS } from '../data/rewards';
import { RewardScreenProps } from '../navigation/types';

const RewardScreen = ({ route, navigation }: RewardScreenProps) => {
  const { rewardId } = route.params;
  const reward = REWARDS.find(r => r.id === rewardId);

  if (!reward) return <View><Text>Recompensa no encontrada</Text></View>;

  return (
    <View style={globalStyles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Image source={require('../assets/images/boton-chincheta-volver.png')} style={styles.icon} />
        </TouchableOpacity>
        <Text style={globalStyles.titleXL}>¡Recompensa desbloqueada!</Text>
        <View style={styles.profileIconPlaceholder}><Text>User</Text></View>
      </View>

      <View style={styles.contentContainer}>
        <Image source={reward.image} style={styles.mainImage} />
        <View style={styles.audioControls}>
          <Image source={require('../assets/images/boton-audio-play.png')} style={styles.icon} />
        </View>
        <ScrollView style={styles.descriptionContainer}>
          <Text style={styles.firstLine}>{reward.firstLine}</Text>
          <Text style={styles.description}>{reward.scrollableText}</Text>
        </ScrollView>
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
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingTop: 50 },
  icon: { width: 32, height: 32, resizeMode: 'contain' },
  profileIconPlaceholder: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.placeholder, justifyContent: 'center', alignItems: 'center' },
  contentContainer: { flex: 1, alignItems: 'center', paddingHorizontal: 24, paddingBottom: 40, marginTop: 20 },
  mainImage: { width: '100%', height: 200, borderRadius: 15, resizeMode: 'cover' },
  audioControls: { flexDirection: 'row', alignSelf: 'flex-start', alignItems: 'center', gap: 10, marginVertical: 20 },
  descriptionContainer: { flex: 1 },
  firstLine: { ...globalStyles.bodyText, textAlign: 'left', fontWeight: 'bold', marginBottom: 10 },
  description: { ...globalStyles.bodyText, textAlign: 'left' },
  nextButton: { ...globalStyles.primaryButton, backgroundColor: COLORS.textDark, width: '100%', marginTop: 20 },
});

export default RewardScreen;