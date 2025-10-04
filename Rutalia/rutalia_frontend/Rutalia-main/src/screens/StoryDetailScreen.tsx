import React from 'react';
import { View, Text, StyleSheet, StatusBar, TouchableOpacity, Image, ScrollView } from 'react-native';
import { COLORS, globalStyles } from '../styles/globalStyles';
import { StoryDetailScreenProps } from '../navigation/types';
import { STORIES } from '../data/stories';

const StoryDetailScreen = ({ route, navigation }: StoryDetailScreenProps) => {
  const { storyId } = route.params;
  const story = STORIES.find(s => s.id === storyId);

  if (!story) {
    return (
      <View style={styles.container}>
        <Text>Historia no encontrada</Text>
      </View>
    );
  }

  return (
    <View style={globalStyles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={require('../assets/images/boton-arrow-left.png')} style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={globalStyles.titleXXL}>Rutalia</Text>
        <View style={styles.profileIconPlaceholder} />
      </View>

      <View style={styles.contentContainer}>
        <Image source={story.image} style={styles.mainImage} />
        <Text style={styles.mainTitle}>{story.title}</Text>
        <Text style={styles.subtitle}>{story.neighborhood}</Text>
        <View style={styles.infoBar}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Duración</Text>
            <Text style={styles.infoValue}>{story.duration}</Text>
          </View>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.tag}>
            <Text style={styles.tagText}>{story.tag}</Text>
          </TouchableOpacity>
          <View style={styles.divider} />
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Enigmas</Text>
            <Text style={styles.infoValue}>{story.enigmas}</Text>
          </View>
        </View>

        <ScrollView style={styles.descriptionContainer}>
          <Text style={styles.description}>{story.description}</Text>
        </ScrollView>
        
        <TouchableOpacity 
          style={styles.startButton}
          onPress={() => navigation.navigate('Enigma', { enigmaId: story.firstEnigmaId })}
        >
          <Text style={globalStyles.primaryButtonText}>Iniciar</Text>
        </TouchableOpacity>
      </View>
      
      <Image source={story.footerImage} style={styles.footerImage} />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 50,
  },
  backIcon: { width: 24, height: 24 },
  profileIconPlaceholder: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.placeholder },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 100,
  },
  mainImage: {
    width: 300,
    height: 150,
    resizeMode: 'contain',
    marginTop: 20,
  },
  mainTitle: {
    ...globalStyles.titleXXL,
    fontSize: 40,
    marginTop: 10,
  },
  subtitle: {
    ...globalStyles.captionText,
    textDecorationLine: 'underline',
    color: COLORS.textMuted,
    marginTop: 8,
  },
  infoBar: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    width: '100%',
    marginVertical: 20,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: COLORS.divider,
    paddingVertical: 12,
  },
  infoItem: {
    alignItems: 'center',
  },
  infoLabel: {
    ...globalStyles.captionText,
    color: COLORS.textMuted,
  },
  infoValue: {
    ...globalStyles.bodyText,
  },
  divider: {
    width: 1,
    height: '100%',
    backgroundColor: COLORS.divider,
  },
  tag: {
    backgroundColor: COLORS.tagOrange,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 24,
  },
  tagText: {
    ...globalStyles.captionText,
    color: COLORS.textLight,
    fontWeight: 'bold',
  },
  descriptionContainer: {
    flex: 1,
    width: '100%',
  },
  description: {
    ...globalStyles.bodyText,
    textAlign: 'left',
  },
  startButton: {
    ...globalStyles.primaryButton,
    backgroundColor: COLORS.textDark,
    width: '100%',
    marginTop: 20,
  },
  footerImage: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 80,
    resizeMode: 'contain',
  },
  container: {
    ...globalStyles.container,
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default StoryDetailScreen;