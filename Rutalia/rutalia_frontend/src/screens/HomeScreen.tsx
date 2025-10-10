import React from 'react';
import { View, Text, StyleSheet, StatusBar, TouchableOpacity, Image, ScrollView } from 'react-native';
import { COLORS, globalStyles } from '../styles/globalStyles';
import CategoryButton from '../components/common/CategoryButton';
import RecommendationCard from '../components/common/RecommendationCard';
import { HomeScreenProps } from '../navigation/types';

const HomeScreen = ({ navigation }: HomeScreenProps) => {
  return (
    <View style={globalStyles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.headerTitle}>Rutalia</Text>
        <View style={styles.divider} />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>¿Lo sabías?</Text>
          <View style={styles.curiosityCard}>
            <View style={styles.curiosityTextContainer}>
              <Text style={styles.curiosityText}>Cerca de Plaza Catalunya, un torno giratorio recogía en silencio a los bebés abandonados de la ciudad.</Text>
              <TouchableOpacity><Text style={styles.discoverMore}>→ DESCUBRIR MÁS</Text></TouchableOpacity>
            </View>
            <Image source={require('../assets/images/mascota-lupa.png')} style={styles.curiosityMascot} />
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Escoge una ruta</Text>
            <TouchableOpacity onPress={() => navigation.navigate('MapaTab')}><Text style={styles.linkText}>Ver mapa</Text></TouchableOpacity>
          </View>
          <Image source={require('../assets/images/mapa-placeholder.png')} style={styles.mapImage} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Explora por categoria</Text>
          <View style={styles.categoryGrid}>
            <CategoryButton label="Leyenda" color="#686230" imageSource={require('../assets/images/categoria-leyenda.png')} />
            <CategoryButton label="Romance" color="#C0392B" imageSource={require('../assets/images/categoria-romance.png')} />
            <CategoryButton label="Histórico" color="#CA6935" imageSource={require('../assets/images/categoria-historico.png')} />
            <CategoryButton label="Esotérico" color="#30606E" imageSource={require('../assets/images/categoria-esoterico.png')} />
            <CategoryButton label="Queer" color="#F0AF46" imageSource={require('../assets/images/categoria-queer.png')} />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recomendaciones</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.recommendationsList}>
            <RecommendationCard title="El Barri Xino" duration="30'" category="Històrica" color="#CA6935" imageSource={require('../assets/images/reco-barri-xino.png')} />
            <RecommendationCard title="El Barri Xino" duration="30'" category="Esotèrica" color="#30606E" imageSource={require('../assets/images/reco-barri-xino.png')} />
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { paddingBottom: 100 },
  headerTitle: { ...globalStyles.headerTitle, textAlign: 'center', marginVertical: 20 },
  divider: { height: 3, width: '100%', backgroundColor: COLORS.textDark },
  section: { width: '100%', paddingHorizontal: 24, marginTop: 30 },
  sectionTitle: { ...globalStyles.bodyText, fontFamily: 'AwesomeSerif-BoldRegular', textAlign: 'left', letterSpacing: 1.2, fontSize: 24 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  linkText: { ...globalStyles.captionText, textDecorationLine: 'underline' },
  curiosityCard: { flexDirection: 'row', backgroundColor: 'rgba(202, 105, 53, 0.75)', borderRadius: 12, borderWidth: 0.2, borderColor: 'black', padding: 15, marginTop: 10, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.3, shadowRadius: 3 },
  curiosityTextContainer: { flex: 1, gap: 8 },
  curiosityText: { fontFamily: 'Inter-Regular', fontSize: 16, color: 'black' },
  discoverMore: { fontFamily: 'Inter-Regular', fontSize: 12, fontWeight: '600', color: 'black' },
  curiosityMascot: { position: 'absolute', top: -40, right: 0, width: 93, height: 183, resizeMode: 'contain' },
  mapImage: { width: '100%', height: 215, borderRadius: 12, borderWidth: 0.2, borderColor: 'black', marginTop: 10 },
  categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginTop: 10, rowGap: 10 },
  recommendationsList: { gap: 15, marginTop: 10 },
});

export default HomeScreen;