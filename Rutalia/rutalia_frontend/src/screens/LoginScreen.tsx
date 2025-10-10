import React, { useState } from 'react';
import { View, Text, StyleSheet, StatusBar, TouchableOpacity, TextInput, Image, ScrollView } from 'react-native';
import { COLORS, globalStyles, SIZES, FONTS } from '../styles/globalStyles';
import { LoginScreenProps } from '../navigation/types';

const LoginScreen = ({ navigation }: LoginScreenProps) => {
  const [rememberMe, setRememberMe] = useState(false);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={globalStyles.screenTitle}>Bienvenide</Text>
          <Text style={styles.subtitle}>inicia sesión para acceder a tu cuenta</Text>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <TextInput placeholder="Correo electrónico" style={styles.input} placeholderTextColor={COLORS.textMuted} keyboardType="email-address" />
            <Image source={require('../assets/images/icon-email.png')} style={styles.icon} />
          </View>
          <View style={styles.inputContainer}>
            <TextInput placeholder="Contraseña" style={styles.input} placeholderTextColor={COLORS.textMuted} secureTextEntry />
            <Image source={require('../assets/images/icon-password.png')} style={styles.icon} />
          </View>
        </View>

        <View style={styles.optionsContainer}>
          <TouchableOpacity style={styles.checkboxContainer} onPress={() => setRememberMe(!rememberMe)}>
            <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
              {rememberMe && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={styles.checkboxLabel}>Recuérdame</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
            <Text style={styles.forgotPassword}>¿Has olvidado la contraseña?</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.captchaPlaceholder}>
          <View style={styles.captchaCheckbox} />
          <Text>I'm not a robot</Text>
          <Image source={require('../assets/images/recaptcha-logo.png')} style={styles.recaptchaLogo} />
        </View>

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
            onPress={() => navigation.navigate('MapaBarrio')}
          >
            <Text style={styles.submitButtonText}>Siguiente</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
            <Text style={styles.signupLink}>¿Nuevo miembro? <Text style={styles.signupLinkBold}>Regístrate ya</Text></Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { ...globalStyles.container },
  scrollContainer: { paddingHorizontal: 24, paddingVertical: 60, flexGrow: 1 },
  header: { alignItems: 'center', marginBottom: 40 },
  subtitle: { ...globalStyles.bodyText, color: COLORS.textMuted, marginTop: 8 },
  formContainer: { gap: 16 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', borderRadius: 25, paddingHorizontal: 20, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2 },
  input: { flex: 1, height: 55, fontFamily: FONTS.body, fontSize: SIZES.body, color: COLORS.textDark },
  icon: { width: 24, height: 24, resizeMode: 'contain' },
  optionsContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 20 },
  checkboxContainer: { flexDirection: 'row', alignItems: 'center' },
  checkbox: { width: 20, height: 20, borderWidth: 1, borderColor: COLORS.textDark, borderRadius: 4, justifyContent: 'center', alignItems: 'center' },
  checkboxChecked: { backgroundColor: COLORS.textDark },
  checkmark: { color: 'white', fontWeight: 'bold' },
  checkboxLabel: { marginLeft: 10, fontFamily: FONTS.inter, fontSize: SIZES.small, color: COLORS.textMuted },
  forgotPassword: { fontFamily: FONTS.inter, fontSize: SIZES.small, color: COLORS.textMuted, textDecorationLine: 'underline' },
  captchaPlaceholder: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f9f9f9', padding: 10, borderRadius: 4, borderWidth: 1, borderColor: '#d3d3d3', marginVertical: 20 },
  captchaCheckbox: { width: 28, height: 28, borderWidth: 2, borderColor: '#c1c1c1', marginRight: 12, borderRadius: 2 },
  recaptchaLogo: { width: 50, height: 50, resizeMode: 'contain', marginLeft: 'auto' },
  socialButtonContainer: { gap: 12, marginVertical: 20 },
  socialButton: { ...globalStyles.secondaryButton, flexDirection: 'row', gap: 10 },
  socialIcon: { width: 24, height: 24 },
  socialButtonText: { ...globalStyles.secondaryButtonText },
  appleButton: { ...globalStyles.primaryButton },
  appleButtonText: { ...globalStyles.primaryButtonText },
  footer: { flex: 1, justifyContent: 'flex-end', alignItems: 'center', gap: 16 },
  submitButton: { ...globalStyles.secondaryButton, borderColor: '#D4A33C', backgroundColor: '#D4A33C' },
  submitButtonText: { ...globalStyles.secondaryButtonText, color: 'white' },
  signupLink: { fontFamily: FONTS.inter, fontSize: SIZES.small, color: COLORS.textMuted },
  signupLinkBold: { fontWeight: 'bold', color: COLORS.textDark, textDecorationLine: 'underline' },
});

export default LoginScreen;