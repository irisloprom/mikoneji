import React from 'react';
import { View, Text, StyleSheet, StatusBar, TouchableOpacity, TextInput, Image, ScrollView } from 'react-native';
import { COLORS, globalStyles, SIZES, FONTS } from '../styles/globalStyles';
import { ForgotPasswordScreenProps } from '../navigation/types';

const ForgotPasswordScreen = ({ navigation }: ForgotPasswordScreenProps) => {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Image source={require('../assets/images/boton-arrow-left.png')} style={styles.backIcon} />
          </TouchableOpacity>
        </View>
        <View style={styles.content}>
          <Text style={styles.title}>¿Has olvidado tu contraseña?</Text>
          <Text style={styles.subtitle}>
            Introduce tu dirección de correo electrónico para obtener el enlace de restablecimiento de contraseña.
          </Text>
          <View style={styles.inputContainer}>
            <TextInput placeholder="Correo electrónico" style={styles.input} placeholderTextColor={COLORS.textMuted} keyboardType="email-address" />
            <Image source={require('../assets/images/icon-email.png')} style={styles.icon} />
          </View>
          <TouchableOpacity 
            style={globalStyles.primaryButton}
            onPress={() => navigation.navigate('ResetPassword')}
          >
            <Text style={globalStyles.primaryButtonText}>Restablecer contraseña</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.footer}>
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
  scrollContainer: { flexGrow: 1, paddingHorizontal: 24, paddingVertical: 60 },
  header: { alignSelf: 'flex-start' },
  backButton: { marginBottom: 40 },
  backIcon: { width: 30, height: 30, resizeMode: 'contain' },
  content: { flex: 1, alignItems: 'center', gap: 24 },
  title: { ...globalStyles.screenTitle, marginBottom: 8 },
  subtitle: { ...globalStyles.bodyText, color: COLORS.textMuted },
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', borderRadius: 25, paddingHorizontal: 20, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, width: '100%' },
  input: { flex: 1, height: 55, fontFamily: FONTS.body, fontSize: SIZES.body, color: COLORS.textDark },
  icon: { width: 24, height: 24, resizeMode: 'contain' },
  footer: { flex: 1, justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 20 },
  signupLink: { fontFamily: FONTS.inter, fontSize: SIZES.small, color: COLORS.textMuted },
  signupLinkBold: { fontWeight: 'bold', color: COLORS.textDark, textDecorationLine: 'underline' },
});

export default ForgotPasswordScreen;