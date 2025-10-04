import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { globalStyles } from '../styles/globalStyles';
import { HomeScreenProps } from '../navigation/types';
import { STORIES } from '../data/stories';

const HomeScreen = ({ navigation }: HomeScreenProps) => {
  const testStory = STORIES[0];

  return (
    <View style={styles.container}>
      <Text style={globalStyles.titleXL}>Pantalla Principal</Text>
      <TouchableOpacity 
        style={styles.button}
        onPress={() => navigation.navigate('StoryDetail', { storyId: testStory.id })}
      >
        <Text style={globalStyles.primaryButtonText}>Ir a "{testStory.title}"</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...globalStyles.container,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    ...globalStyles.primaryButton,
    marginTop: 20,
  },
});

export default HomeScreen;