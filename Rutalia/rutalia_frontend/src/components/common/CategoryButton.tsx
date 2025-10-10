import React from 'react';
import { Text, StyleSheet, TouchableOpacity, Image, ImageSourcePropType } from 'react-native';
import { SIZES, FONTS } from '../../styles/globalStyles';

interface CategoryButtonProps {
  label: string;
  color: string;
  imageSource: ImageSourcePropType;
}

const CategoryButton = ({ label, color, imageSource }: CategoryButtonProps) => {
  return (
    <TouchableOpacity style={[styles.container, { backgroundColor: color }]}>
      <Text style={styles.label}>{label}</Text>
      <Image source={imageSource} style={styles.image} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: { width: 154, height: 85, borderRadius: 12, padding: 15, justifyContent: 'center', overflow: 'hidden' },
  label: { fontFamily: FONTS.title, fontSize: SIZES.body, color: 'white' },
  image: { position: 'absolute', right: -10, bottom: -10, width: 80, height: 80, resizeMode: 'contain' },
});

export default CategoryButton;