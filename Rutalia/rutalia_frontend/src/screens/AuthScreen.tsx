import React from 'react';
import { View, Text, StyleSheet, StatusBar, TouchableOpacity } from 'react-native';
import { COLORS, globalStyles, FONTS, SIZES } from '../styles/globalStyles';
import { AuthScreenProps } from '../navigation/types';

const AuthScreen = ({ navigation }: AuthScreenProps) => {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      
      <View style={styles.header}>
        <Text style={globalStyles.headerTitle}>Rutalia</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.avatarPlaceholder}><Text style={styles.avatarText}>GM</Text></View>
        <Text style={styles.welcomeTitle}>Bienvenide</Text>
        <Text style={globalStyles.bodyText}>Elige cómo empezar</Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={globalStyles.primaryButton}
          onPress={() => navigation.navigate('SignUp')}
        >
          <Text style={globalStyles.primaryButtonText}>Regístrate</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={globalStyles.secondaryButton}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={globalStyles.secondaryButtonText}>Log in</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Text style={styles.guestText}>Continuar como invitade</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Términos</Text>
        <View style={styles.footerDivider} />
        <Text style={styles.footerText}>Privacidad</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...globalStyles.container,
    paddingHorizontal: 24,
  },
  header: {
    alignItems: 'center',
    paddingTop: 80,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  avatarPlaceholder: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: COLORS.placeholder,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontFamily: FONTS.body,
    fontSize: 40,
    fontWeight: 'bold',
    color: COLORS.textDark,
  },
  welcomeTitle: {
    fontFamily: FONTS.title,
    fontSize: SIZES.titleXL,
    color: COLORS.textDark,
  },
  buttonContainer: {
    gap: 16,
    paddingBottom: 24,
  },
  guestText: {
    ...globalStyles.captionText,
    color: COLORS.textMuted,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 40,
    gap: 10,
  },
  footerText: {
    ...globalStyles.captionText,
    fontSize: SIZES.small,
    color: COLORS.textMuted,
  },
  footerDivider: {
    width: 1,
    height: '100%',
    backgroundColor: COLORS.textMuted,
  },
});

export default AuthScreen;