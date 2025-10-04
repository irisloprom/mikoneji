import React, { useState } from 'react';
import { View, Text, StyleSheet, StatusBar, TouchableOpacity, Image } from 'react-native';
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { COLORS, globalStyles } from '../../styles/globalStyles';
import { PermissionModal } from '../../components/common/PermissionModal';

interface PermissionScreenProps {
  navigation: any;
  permissionType: keyof typeof PERMISSIONS.ANDROID;
  imageSource: any;
  title: string;
  description: string;
  modalText: string;
  nextScreen: string;
}

const PermissionScreen = ({
  navigation,
  permissionType,
  imageSource,
  title,
  description,
  modalText,
  nextScreen,
}: PermissionScreenProps) => {
  const [isModalVisible, setModalVisible] = useState(false);

  const handleGrantAccess = async () => {
    const result = await request(PERMISSIONS.ANDROID[permissionType]);
    if (result === RESULTS.GRANTED) {
      navigation.navigate(nextScreen);
    }
  };

  const handleSkip = () => {
    navigation.navigate(nextScreen);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <TouchableOpacity style={styles.skipContainer} onPress={handleSkip}>
        <Text style={[globalStyles.captionText, { color: COLORS.textMuted }]}>Saltar</Text>
      </TouchableOpacity>

      <View style={styles.content}>
        <Text style={globalStyles.titleXL}>{title}</Text>
        <Image source={imageSource} style={styles.icon} />
        <Text style={globalStyles.bodyText}>{description}</Text>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.primaryButton} onPress={handleGrantAccess}>
          <Text style={globalStyles.primaryButtonText}>Permitir acceso</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Text style={globalStyles.captionText}>Saber más</Text>
        </TouchableOpacity>
      </View>

      <PermissionModal
        visible={isModalVisible}
        onClose={() => setModalVisible(false)}
        text={modalText}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...globalStyles.container,
    paddingHorizontal: 24,
    paddingTop: 50,
    paddingBottom: 40,
  },
  skipContainer: {
    alignSelf: 'flex-end',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 32,
  },
  icon: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  footer: {
    alignItems: 'center',
    gap: 16,
  },
  primaryButton: {
    ...globalStyles.primaryButton,
    backgroundColor: COLORS.textDark,
    width: '100%',
  },
});

export default PermissionScreen;