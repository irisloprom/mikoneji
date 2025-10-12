import { StyleSheet } from 'react-native';

export const COLORS = {
  background: '#F6F0E8',
  textDark: '#2B1D17',
  textLight: '#FFFFFF',
  textMuted: '#7C6D64',
  placeholder: 'rgba(43, 29, 23, 0.08)',
  tagOrange: '#CA6935',
  dotActive: '#2B1D17'
} as const;

export const FONTS = {
  heading: 'AwesomeSerif-BoldRegular',
  title: 'AwesomeSerif-BoldRegular',
  body: 'Inter-Regular',
  satoshi: 'Satoshi-Regular',
  inter: 'Inter-Regular',
  barlow: 'Barlow-Regular'
} as const;

export const SIZES = {
  xsmall: 12,
  small: 14,
  body: 16,
  large: 20,
  titleXL: 32
} as const;

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background
  },
  headerTitle: {
    fontFamily: FONTS.heading,
    fontSize: 36,
    letterSpacing: 4,
    color: COLORS.textDark,
    textAlign: 'center'
  },
  rutaliaHeader: {
    fontFamily: FONTS.heading,
    fontSize: 42,
    letterSpacing: 6,
    color: COLORS.textDark
  },
  screenTitle: {
    fontFamily: FONTS.heading,
    fontSize: 26,
    letterSpacing: 4,
    color: COLORS.textDark,
    textAlign: 'center'
  },
  bodyText: {
    fontFamily: FONTS.body,
    fontSize: SIZES.body,
    color: COLORS.textDark,
    textAlign: 'center'
  },
  captionText: {
    fontFamily: FONTS.body,
    fontSize: SIZES.small,
    color: COLORS.textMuted
  },
  primaryButton: {
    backgroundColor: COLORS.textDark,
    paddingVertical: 16,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center'
  },
  primaryButtonText: {
    fontFamily: FONTS.satoshi,
    fontSize: SIZES.body,
    color: COLORS.textLight,
    textTransform: 'uppercase',
    letterSpacing: 1
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: COLORS.textDark,
    paddingVertical: 16,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center'
  },
  secondaryButtonText: {
    fontFamily: FONTS.satoshi,
    fontSize: SIZES.body,
    color: COLORS.textDark,
    textTransform: 'uppercase',
    letterSpacing: 1
  },
  handwrittenTitle: {
    fontFamily: 'Handlee-Regular',
    fontSize: 28,
    color: COLORS.textDark,
    textAlign: 'center'
  },
  handwrittenText: {
    fontFamily: 'Handlee-Regular',
    fontSize: 18,
    color: COLORS.textDark
  },
  titleXL: {
    fontFamily: FONTS.title,
    fontSize: SIZES.titleXL,
    color: COLORS.textDark,
    textAlign: 'center'
  },
  titleXXL: {
    fontFamily: FONTS.title,
    fontSize: SIZES.titleXL + 6,
    color: COLORS.textDark,
    textAlign: 'center'
  }
});
