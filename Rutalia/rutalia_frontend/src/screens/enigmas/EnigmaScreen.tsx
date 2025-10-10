import React, { useState } from 'react';
import { View, Text, StyleSheet, StatusBar, TouchableOpacity, Image, TextInput, Alert, ScrollView } from 'react-native';
import * as Progress from 'react-native-progress';
import { COLORS, globalStyles, SIZES, FONTS } from '../../styles/globalStyles';
import { ENIGMAS } from '../../data/enigmas';
import { EnigmaScreenProps } from '../../navigation/types';
import { HintModal } from '../../components/common/HintModal';
import { SideMenu } from '../../components/common/SideMenu';

const EnigmaScreen = ({ route, navigation }: EnigmaScreenProps) => {
  const { enigmaId } = route.params;
  const enigma = ENIGMAS.find(e => e.id === enigmaId);
  const [userAnswer, setUserAnswer] = useState('');
  const [isHintVisible, setHintVisible] = useState(false);
  const [isMenuVisible, setMenuVisible] = useState(false);
  const [showAlternativeInput, setShowAlternativeInput] = useState(false);

  if (!enigma) return <View><Text>Enigma no encontrado</Text></View>;

  const progress = enigma.order / enigma.totalEnigmas;

  const handleWrittenSubmit = () => {
    if (userAnswer.trim().toLowerCase() === enigma.correctAnswer.toLowerCase()) {
      navigation.navigate('Reward', { rewardId: enigma.rewardId });
    } else {
      Alert.alert('Respuesta incorrecta', '¡Sigue intentándolo!');
    }
  };

  const handleMultipleChoiceSubmit = (option: string) => {
    if (option.trim().toLowerCase() === enigma.correctAnswer.toLowerCase()) {
      navigation.navigate('Reward', { rewardId: enigma.rewardId });
    } else {
      Alert.alert('Respuesta incorrecta', '¡Esa no es la respuesta!');
    }
  };
  
  const handleAudioSubmit = () => Alert.alert('Función no disponible', 'La grabación de audio estará disponible próximamente.');

  const renderInput = () => {
    const currentInputType = showAlternativeInput ? 'written' : enigma.inputType;

    switch (currentInputType) {
      case 'multipleChoice':
        return (
          <View style={styles.mcqContainer}>
            {enigma.options?.map((option, index) => (
              <TouchableOpacity 
                key={option} 
                style={[styles.mcqOption, index === enigma.options!.length - 1 && styles.lastMcqOption]}
                onPress={() => handleMultipleChoiceSubmit(option)}
              >
                <Text style={styles.mcqOptionText}>{option}</Text>
                <Image source={require('../../assets/images/arrow-respuesta.png')} style={styles.icon20} />
              </TouchableOpacity>
            ))}
          </View>
        );
      case 'audio':
        return (
          <View style={styles.answerContainer}>
            <Text style={styles.textInput}>Grabar audio</Text>
            <TouchableOpacity onPress={handleAudioSubmit}><Image source={require('../../assets/images/boton-micro.png')} style={styles.icon20} /></TouchableOpacity>
          </View>
        );
      default:
        return (
          <View style={styles.answerContainer}>
            <TextInput
              style={styles.textInput}
              placeholder="Escriba su respuesta"
              placeholderTextColor={COLORS.textMuted}
              value={userAnswer}
              onChangeText={setUserAnswer}
            />
            <TouchableOpacity onPress={handleWrittenSubmit}>
              <Image source={require('../../assets/images/arrow-respuesta.png')} style={styles.icon20} />
            </TouchableOpacity>
          </View>
        );
    }
  };

  const renderFooter = () => {
    const isSpecialInput = ['audio', 'gps', 'photo'].includes(enigma.inputType);
    let secondButton = null;

    if (isSpecialInput) {
      if (showAlternativeInput) {
        secondButton = (
          <TouchableOpacity style={styles.footerButton} onPress={() => setShowAlternativeInput(false)}>
            <Text style={styles.footerButtonText}>{enigma.inputType.charAt(0).toUpperCase() + enigma.inputType.slice(1)}</Text>
            <Image source={require(`../../assets/images/boton-${enigma.inputType === 'audio' ? 'micro' : enigma.inputType}.png`)} style={styles.icon15} />
          </TouchableOpacity>
        );
      } else {
        secondButton = (
          <TouchableOpacity style={styles.footerButton} onPress={() => setShowAlternativeInput(true)}>
            <Text style={styles.footerButtonText}>Teclado</Text>
            <Image source={require('../../assets/images/boton-teclado.png')} style={styles.icon15} />
          </TouchableOpacity>
        );
      }
    } else if (enigma.inputType === 'written') {
      secondButton = (
        <TouchableOpacity style={styles.footerButton} onPress={handleWrittenSubmit}>
          <Text style={styles.footerButtonText}>Enviar</Text>
          <Image source={require('../../assets/images/boton-enviar-respuesta.png')} style={styles.icon15} />
        </TouchableOpacity>
      );
    }
    
    return (
      <View style={[styles.footer, !secondButton && styles.footerSingleButton]}>
        <TouchableOpacity style={styles.footerButton} onPress={() => setHintVisible(true)}>
          <Text style={styles.footerButtonText}>Pista</Text>
          <Image source={require('../../assets/images/boton-pista.png')} style={styles.icon15} />
        </TouchableOpacity>
        {secondButton}
      </View>
    );
  };

  return (
    <View style={globalStyles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <View style={styles.headerContainer}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}><Image source={require('../../assets/images/boton-arrow-left.png')} style={styles.icon30} /></TouchableOpacity>
          <View style={styles.headerTitleContainer}><Text style={styles.headerTitle}>{enigma.storyTitle}</Text></View>
          <TouchableOpacity onPress={() => setMenuVisible(true)}><Image source={require('../../assets/images/eulalia-avatar.png')} style={styles.profileIcon} /></TouchableOpacity>
        </View>
      </View>

      <View style={styles.mainContent}>
        <ScrollView>
          <Image source={enigma.image} style={styles.mainImage} />
          <View style={styles.progressBarContainer}>
            <Progress.Bar progress={progress} width={null} height={20} color={COLORS.tagOrange} unfilledColor={'rgba(202, 105, 53, 0.1)'} borderWidth={0} />
          </View>
          <View style={styles.audioPlayer}>
            <Text style={styles.audioText}>Texto a audio</Text>
            <Image source={require('../../assets/images/sound-wave.png')} style={styles.soundWave} />
          </View>
          <Text style={styles.introText}>{enigma.introText}</Text>
        </ScrollView>
      </View>

      <View style={styles.bottomContainer}>
        <View style={styles.questionContainer}>
          <Image source={require('../../assets/images/eulalia-cara-hablando.png')} style={styles.charHead} />
          <Text style={styles.questionText}>{enigma.question}</Text>
        </View>
        {renderInput()}
        {renderFooter()}
      </View>

      <HintModal visible={isHintVisible} onClose={() => setHintVisible(false)} hints={enigma.hints} solution={enigma.solution} />
      <SideMenu visible={isMenuVisible} onClose={() => setMenuVisible(false)} />
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: { width: '100%', alignItems: 'center', paddingTop: 50 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: 327, height: 88, gap: 24.5 },
  icon30: { width: 30, height: 30, resizeMode: 'contain' },
  icon20: { width: 20, height: 20, resizeMode: 'contain' },
  icon15: { width: 15, height: 15, resizeMode: 'contain' },
  headerTitleContainer: { width: 193, height: 88, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { ...globalStyles.headerTitle, letterSpacing: 1.6 },
  profileIcon: { width: 55, height: 53, borderRadius: 27.5 },
  mainContent: {
    flex: 1,
  },
  mainImage: { width: '100%', height: 295, resizeMode: 'cover' },
  progressBarContainer: { width: '100%', height: 20 },
  audioPlayer: { borderWidth: 1, borderColor: COLORS.textDark, borderRadius: 12, backgroundColor: 'white', padding: 15, margin: 15, gap: 10 },
  audioText: { fontFamily: FONTS.inter, fontSize: SIZES.body },
  soundWave: { width: '100%', height: 20, resizeMode: 'contain' },
  introText: { ...globalStyles.bodyText, textAlign: 'left', paddingHorizontal: 15, marginBottom: 15 },
  bottomContainer: { 
    width: '100%',
    position: 'absolute',
    bottom: 0,
  },
  questionContainer: { backgroundColor: COLORS.tagOrange, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 16, paddingRight: 80, alignItems: 'flex-start' },
  charHead: { position: 'absolute', top: -50, right: 0, width: 100, height: 100, resizeMode: 'contain' },
  questionText: { fontFamily: FONTS.title, fontSize: 20, color: COLORS.textLight, textAlign: 'left', letterSpacing: 0.8 },
  answerContainer: { flexDirection: 'row', backgroundColor: 'white', width: '100%', height: 50, paddingHorizontal: 13, justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderColor: COLORS.textDark },
  textInput: { flex: 1, fontFamily: FONTS.inter, fontSize: SIZES.small, color: COLORS.textDark },
  footer: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', backgroundColor: COLORS.background, paddingVertical: 10 },
  footerSingleButton: { justifyContent: 'flex-start', paddingLeft: 20 },
  footerButton: { flexDirection: 'row', backgroundColor: COLORS.textDark, borderRadius: 50, width: 118, height: 30, justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 15 },
  footerButtonText: { fontFamily: FONTS.satoshi, fontSize: SIZES.small, color: COLORS.textLight },
  mcqContainer: { width: '100%', backgroundColor: 'white', borderWidth: 1, borderColor: COLORS.textDark },
  mcqOption: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 13, borderBottomWidth: 1, borderColor: COLORS.placeholder },
  lastMcqOption: { borderBottomWidth: 0 },
  mcqOptionText: { fontFamily: FONTS.inter, fontSize: SIZES.small, color: COLORS.textDark },
});

export default EnigmaScreen;