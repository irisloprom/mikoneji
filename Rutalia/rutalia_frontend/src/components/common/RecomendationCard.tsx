import React from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, ImageSourcePropType } from 'react-native';
import { SIZES, FONTS } from '../../styles/globalStyles';

interface RecommendationCardProps {
  title: string;
  duration: string;
  category: string;
  color: string;
  imageSource: ImageSourcePropType;
}

const RecommendationCard = ({ title, duration, category, color, imageSource }: RecommendationCardProps) => {
  return (
    <TouchableOpacity style={styles.container}>
      <ImageBackground source={imageSource} style={styles.image} imageStyle={styles.imageStyle}>
        <View style={[styles.overlay, { backgroundColor: color }]}>
          <Text style={styles.title}>{title}</Text>
          <View style={styles.divider} />
          <Text style={styles.info}>{duration}</Text>
          <Text style={styles.info}>{category}</Text>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: { width: 153, height: 197, borderRadius: 12, borderWidth: 2, borderColor: '#252525', overflow: 'hidden', elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.9 },
  image: { flex: 1 },
  imageStyle: { resizeMode: 'cover' },
  overlay: { flex: 1, justifyContent: 'flex-end', padding: 10 },
  title: { fontFamily: FONTS.title, fontSize: SIZES.titleXL, color: 'white' },
  divider: { height: 1, backgroundColor: 'white', marginVertical: 4 },
  info: { fontFamily: FONTS.body, fontSize: SIZES.small, color: 'white' },
});

export default RecommendationCard;