import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, StatusBar, TouchableOpacity, Image } from 'react-native';
import { COLORS, globalStyles } from '../styles/globalStyles';
import { VerificationScreenProps } from '../navigation/types';
import { OtpInput } from '../components/common/OtpInput';

const VerificationScreen = ({ route, navigation }: VerificationScreenProps) => {
  const { email } = route.params;
  const [code, setCode] = useState('');
  const [timer, setTimer] = useState(30);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prevTimer) => (prevTimer > 0 ? prevTimer - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleVerify = () => {
    navigation.navigate('MapaBarrio');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={require('../assets/images/boton-arrow-left.png')} style={styles.backIcon} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={globalStyles.screenTitle}>¡Ya casi estás!</Text>
        <Text style={styles.subtitle}>
          Por favor, introduce el código de 6 dígitos enviado a tu correo electrónico {email} para su verificación.
        </Text>
        <OtpInput onCodeFilled={setCode} />
        <TouchableOpacity 
          style={[globalStyles.secondaryButton, code.length < 6 && styles.disabledButton]} 
          onPress={handleVerify}
          disabled={code.length < 6}
        >
          <Text style={[globalStyles.secondaryButtonText, code.length < 6 && styles.disabledButtonText]}>Verifica</Text>
        </TouchableOpacity>
        <View style={styles.resendContainer}>
          <Text style={styles.resendText}>¿No has recibido ningún código?</Text>
          <TouchableOpacity disabled={timer > 0}>
            <Text style={[styles.resendLink, timer > 0 && styles.disabledLink]}>
              {timer > 0 ? `Solicita un nuevo código en 00:${timer.toString().padStart(2, '0')}s` : 'Solicitar de nuevo'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { ...globalStyles.container, paddingHorizontal: 24 },
  header: { paddingTop: 60 },
  backIcon: { width: 30, height: 30, resizeMode: 'contain' },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 24 },
  subtitle: { ...globalStyles.bodyText, paddingHorizontal: 20 },
  resendContainer: { alignItems: 'center', gap: 8, marginTop: 16 },
  resendText: { ...globalStyles.captionText, color: COLORS.textMuted },
  resendLink: { ...globalStyles.captionText, color: COLORS.textDark, fontWeight: 'bold' },
  disabledLink: { color: COLORS.textMuted },
  disabledButton: {
    backgroundColor: COLORS.placeholder,
    borderColor: COLORS.placeholder,
  },
  disabledButtonText: {
    color: COLORS.textMuted,
  },
});

export default VerificationScreen;