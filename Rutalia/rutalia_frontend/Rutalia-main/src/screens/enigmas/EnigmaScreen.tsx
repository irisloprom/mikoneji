import React, { useState } from 'react';
import { View, Text, StyleSheet, StatusBar, TouchableOpacity, Image, TextInput, Alert } from 'react-native';
import * as Progress from 'react-native-progress';
import { COLORS, globalStyles, SIZES } from '../../styles/globalStyles';
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

  const handleMultipleChoice = (option: string) => {
    if (option.trim().toLowerCase() === enigma.correctAnswer.toLowerCase()) {
      navigation.navigate('Reward', { rewardId: enigma.rewardId });
    } else {
      Alert.alert('Respuesta incorrecta', 'Esa no es la respuesta, ¡prueba otra vez!');
    }
  };

  const renderInput = () => {
    if (enigma.inputType === 'multipleChoice') {
      return (
        <View style={styles.mcqContainer}>
          {enigma.options?.map((option) => (
            <TouchableOpacity 
              key={option} 
              style={styles.mcqOption}
              onPress={() => handleMultipleChoice(option)}
            >
              <Text style={globalStyles.bodyText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      );
    }

    if (enigma.inputType === 'audio' && !showAlternativeInput) {
      return (
        <TouchableOpacity style={styles.inputContainer}>
          <Image source={require('../../assets/images/boton-micro.png')} style={styles.icon} />
          <Image source={require('../../assets/images/boton-enviar-respuesta.png')} style={styles.icon} />
        </TouchableOpacity>
      );
    }
    
    return (
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="Escriba su respuesta"
          placeholderTextColor={COLORS.textMuted}
          value={userAnswer}
          onChangeText={setUserAnswer}
        />
        <TouchableOpacity onPress={handleWrittenSubmit}>
          <Image source={require('../../assets/images/boton-enviar-respuesta.png')} style={styles.icon} />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={globalStyles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <Progress.Bar progress={progress} width={null} style={styles.progressBar} color={COLORS.tagOrange} unfilledColor={COLORS.placeholder} borderWidth={0} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}><Image source={require('../../assets/images/boton-arrow-left.png')} style={styles.icon} /></TouchableOpacity>
        <Text style={globalStyles.bodyText}>{enigma.storyTitle}</Text>
        <TouchableOpacity onPress={() => setMenuVisible(true)} style={styles.profileIconPlaceholder}><Text>User</Text></TouchableOpacity>
      </View>
      <Image source={enigma.image} style={styles.mainImage} />
      <Text style={[globalStyles.bodyText, styles.introText]}>{enigma.introText}</Text>
      <View style={styles.questionContainer}>
        <Image source={require('../../assets/images/eulalia-cara-hablando.png')} style={styles.charHead} />
        <Text style={styles.questionText}>{enigma.question}</Text>
        {renderInput()}
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.hintButton} onPress={() => setHintVisible(true)}>
            <Image source={require('../../assets/images/boton-pista.png')} style={styles.iconSmall} />
            <Text style={globalStyles.captionText}>Ver pista</Text>
          </TouchableOpacity>
          {enigma.inputType === 'audio' && !showAlternativeInput && (
            <TouchableOpacity style={styles.hintButton} onPress={() => setShowAlternativeInput(true)}>
              <Image source={require('../../assets/images/boton-teclado.png')} style={styles.iconSmall} />
              <Text style={globalStyles.captionText}>Respuesta alternativa</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
      <HintModal visible={isHintVisible} onClose={() => setHintVisible(false)} hints={enigma.hints} solution={enigma.solution} />
      <SideMenu visible={isMenuVisible} onClose={() => setMenuVisible(false)} />
    </View>
  );
};

const styles = StyleSheet.create({
  progressBar: { width: '100%', height: 8 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingTop: 20 },
  icon: { width: 32, height: 32, resizeMode: 'contain' },
  iconSmall: { width: 24, height: 24, resizeMode: 'contain' },
  profileIconPlaceholder: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.placeholder, justifyContent: 'center', alignItems: 'center' },
  mainImage: { width: '80%', height: 150, resizeMode: 'contain', alignSelf: 'center', marginVertical: 20 },
  introText: { paddingHorizontal: 24, marginVertical: 15 },
  questionContainer: { marginHorizontal: 12, backgroundColor: '#F8EFE1', borderRadius: 20, padding: 20, gap: 15, alignItems: 'center' },
  charHead: { position: 'absolute', top: -40, right: 10, width: 80, height: 80, resizeMode: 'contain' },
  inputContainer: { flexDirection: 'row', backgroundColor: 'white', width: '100%', borderRadius: 50, paddingHorizontal: 20, paddingVertical: 5, justifyContent: 'space-between', alignItems: 'center' },
  textInput: { flex: 1, color: COLORS.textDark, fontSize: SIZES.body },
  actionsContainer: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', paddingHorizontal: 10 },
  hintButton: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  questionText: { ...globalStyles.bodyText, fontWeight: 'bold' },
  mcqContainer: { width: '100%', gap: 10 },
  mcqOption: { backgroundColor: 'white', padding: 15, borderRadius: 20, borderWidth: 1, borderColor: 'transparent' },
});

export default EnigmaScreen;