import React, { useState } from 'react';
import { View, Text, StyleSheet, StatusBar, TouchableOpacity, TextInput, Image, ScrollView } from 'react-native';
import { COLORS, globalStyles, SIZES, FONTS } from '../styles/globalStyles';
import { SignUpScreenProps } from '../navigation/types';

const SignUpScreen = ({ navigation }: SignUpScreenProps) => {
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [email, setEmail] = useState('');

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={globalStyles.screenTitle}>Empieza</Text>
          <Text style={styles.subtitle}>por crearte una cuenta</Text>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <TextInput placeholder="Nombre" style={styles.input} placeholderTextColor={COLORS.textMuted} />
            <Image source={require('../assets/images/icon-user.png')} style={styles.icon} />
          </View>
          <View style={styles.inputContainer}>
            <TextInput 
              placeholder="Correo electrónico" 
              style={styles.input} 
              placeholderTextColor={COLORS.textMuted} 
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />
            <Image source={require('../assets/images/icon-email.png')} style={styles.icon} />
          </View>
          <View style={styles.inputContainer}>
            <TextInput placeholder="Número de teléfono" style={styles.input} placeholderTextColor={COLORS.textMuted} keyboardType="phone-pad" />
            <Image source={require('../assets/images/icon-phone.png')} style={styles.icon} />
          </View>
          <View style={styles.inputContainer}>
            <TextInput placeholder="Contraseña" style={styles.input} placeholderTextColor={COLORS.textMuted} secureTextEntry />
            <Image source={require('../assets/images/icon-password.png')} style={styles.icon} />
          </View>
        </View>

        <TouchableOpacity style={styles.checkboxContainer} onPress={() => setTermsAccepted(!termsAccepted)}>
          <View style={[styles.checkbox, termsAccepted && styles.checkboxChecked]}>
            {termsAccepted && <Text style={styles.checkmark}>✓</Text>}
          </View>
          <Text style={styles.checkboxLabel}>Al marcar la casilla aceptas nuestros <Text style={styles.linkText}>Términos y Condiciones</Text>.</Text>
        </TouchableOpacity>

        <View style={styles.socialButtonContainer}>
          <TouchableOpacity style={styles.socialButton} disabled>
            <Image source={require('../assets/images/icon-google.png')} style={styles.socialIcon} />
            <Text style={styles.socialButtonText}>Continúa con Google</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.socialButton, styles.appleButton]} disabled>
            <Image source={require('../assets/images/icon-apple.png')} style={styles.socialIcon} />
            <Text style={[styles.socialButtonText, styles.appleButtonText]}>Continuar con Apple</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity 
            style={styles.submitButton}
            onPress={() => navigation.navigate('Verification', { email: email || 'xxxxx@gmail.com' })}
          >
            <Text style={styles.submitButtonText}>Siguiente</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginLink}>¿Ya tienes cuenta? <Text style={styles.loginLinkBold}>Inicia sesión</Text></Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { ...globalStyles.container },
  scrollContainer: { paddingHorizontal: 24, paddingVertical: 60 },
  header: { alignItems: 'center', marginBottom: 40 },
  subtitle: { ...globalStyles.bodyText, color: COLORS.textMuted, marginTop: 8 },
  formContainer: { gap: 16 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', borderRadius: 25, paddingHorizontal: 20, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2 },
  input: { flex: 1, height: 55, fontFamily: FONTS.body, fontSize: SIZES.body, color: COLORS.textDark },
  icon: { width: 24, height: 24, resizeMode: 'contain' },
  checkboxContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 20 },
  checkbox: { width: 20, height: 20, borderWidth: 1, borderColor: COLORS.textDark, borderRadius: 4, justifyContent: 'center', alignItems: 'center' },
  checkboxChecked: { backgroundColor: COLORS.textDark },
  checkmark: { color: 'white', fontWeight: 'bold' },
  checkboxLabel: { flex: 1, marginLeft: 10, fontFamily: FONTS.inter, fontSize: SIZES.small, color: COLORS.textMuted },
  linkText: { textDecorationLine: 'underline' },
  socialButtonContainer: { gap: 12, marginVertical: 30 },
  socialButton: { ...globalStyles.secondaryButton, flexDirection: 'row', gap: 10 },
  socialIcon: { width: 24, height: 24 },
  socialButtonText: { ...globalStyles.secondaryButtonText },
  appleButton: { ...globalStyles.primaryButton },
  appleButtonText: { ...globalStyles.primaryButtonText },
  footer: { alignItems: 'center', gap: 16 },
  submitButton: { ...globalStyles.secondaryButton, borderColor: COLORS.tagOrange, backgroundColor: 'rgba(202, 105, 53, 0.1)' },
  submitButtonText: { ...globalStyles.secondaryButtonText, color: COLORS.tagOrange },
  loginLink: { fontFamily: FONTS.inter, fontSize: SIZES.small, color: COLORS.textMuted },
  loginLinkBold: { fontWeight: 'bold', color: COLORS.textDark },
});

export default SignUpScreen;