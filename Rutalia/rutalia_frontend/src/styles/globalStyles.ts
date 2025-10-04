import { StyleSheet } from 'react-native';

export const COLORS = {
  background: '#FFFBF4',
  primaryRed: '#C0392B',
  primaryBlue: '#30606E',
  tagOrange: '#CA6935',
  textDark: '#1E1E1E',
  textLight: '#FFFFFF',
  textMuted: 'rgba(30, 30, 30, 0.5)',
  dotActive: 'rgba(30, 30, 30, 0.4)',
  dotInactive: 'rgba(30, 30, 30, 0.1)',
  placeholder: '#EFEFEF',
  divider: 'rgba(202, 105, 53, 0.5)',
};

export const FONTS = {
  title: 'AwesomeSerif-BoldRegular',
  body: 'TT Hoves Pro Trial Variable',
  handwritten: 'Handlee-Regular',
};

export const SIZES = {
  titleXXL: 32,
  titleXL: 24,
  body: 18,
  caption: 16,
};

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  rutaliaHeader: {
    fontFamily: FONTS.title,
    fontSize: SIZES.titleXXL,
    color: COLORS.textDark,
  },
  titleXL: {
    fontFamily: FONTS.title,
    fontSize: SIZES.titleXL,
    fontWeight: '700',
    color: COLORS.textDark,
    textAlign: 'center',
  },
  bodyText: {
    fontFamily: FONTS.body,
    fontSize: SIZES.body,
    color: COLORS.textDark,
    textAlign: 'center',
    lineHeight: 25,
  },
  captionText: {
    fontFamily: FONTS.body,
    fontSize: SIZES.caption,
    color: COLORS.textDark,
  },
  handwrittenTitle: {
    fontFamily: FONTS.handwritten,
    fontSize: SIZES.titleXL,
    fontWeight: '400',
    color: COLORS.textDark,
    textAlign: 'center',
  },
  handwrittenText: {
    fontFamily: FONTS.handwritten,
    fontSize: SIZES.body,
    fontWeight: '400',
    color: COLORS.textDark,
    textAlign: 'center',
  },
  primaryButton: {
    backgroundColor: COLORS.primaryBlue,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    fontFamily: FONTS.body,
    fontSize: SIZES.body,
    color: COLORS.textLight,
    fontWeight: 'bold',
  },
});

export const walkthroughStyles = StyleSheet.create({
  screen: {
    ...globalStyles.container,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: 250,
    resizeMode: 'contain',
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  subtitle: {
    ...globalStyles.bodyText,
    marginTop: 16,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    width: 70,
    height: 30,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.dotInactive,
  },
});