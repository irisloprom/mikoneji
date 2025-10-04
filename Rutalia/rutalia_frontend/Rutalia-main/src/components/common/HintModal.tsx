import React, { useState, useEffect } from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, Pressable, Image } from 'react-native';
import { COLORS, globalStyles } from '../../styles/globalStyles';

interface HintModalProps {
  visible: boolean;
  onClose: () => void;
  hints: string[];
  solution: string;
}

export const HintModal = ({ visible, onClose, hints, solution }: HintModalProps) => {
  const [step, setStep] = useState(1);

  useEffect(() => {
    if (visible) {
      setStep(1);
    }
  }, [visible]);

  const isSolution = step > hints.length;
  const title = isSolution ? 'Solución' : `Pista ${step}`;
  const bodyText = isSolution ? solution : hints[step - 1];

  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.modalContainer} onPress={() => {}}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
             <Text>X</Text>
          </TouchableOpacity>
          <Text style={globalStyles.titleXL}>{title}</Text>
          <Text style={globalStyles.bodyText}>{bodyText}</Text>
          <View style={styles.buttonContainer}>
            {step > 1 && (
              <TouchableOpacity style={styles.secondaryButton} onPress={() => setStep(step - 1)}>
                <Text>Pista anterior</Text>
              </TouchableOpacity>
            )}
            {!isSolution && (
              <TouchableOpacity style={styles.primaryButton} onPress={() => setStep(step + 1)}>
                <Text style={globalStyles.primaryButtonText}>
                  {step < hints.length ? 'Siguiente pista' : 'Ver solución'}
                </Text>
              </TouchableOpacity>
            )}
             {isSolution && (
              <TouchableOpacity style={styles.primaryButton} onPress={onClose}>
                <Text style={globalStyles.primaryButtonText}>Aceptar</Text>
              </TouchableOpacity>
            )}
          </View>
        </Pressable>
        <Image 
          source={isSolution ? require('../../assets/images/eulalia-medio-apunta.png') : require('../../assets/images/eulalia-medio-lupa.png')} 
          style={styles.characterImage} 
        />
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center' },
  modalContainer: { backgroundColor: 'white', borderRadius: 20, padding: 25, width: '85%', alignItems: 'center', gap: 15 },
  closeButton: { position: 'absolute', top: 15, right: 15 },
  buttonContainer: { flexDirection: 'row', gap: 10, marginTop: 10 },
  primaryButton: { ...globalStyles.primaryButton, backgroundColor: '#686230' },
  secondaryButton: { ...globalStyles.primaryButton, backgroundColor: COLORS.placeholder },
  characterImage: { position: 'absolute', bottom: 0, right: 0, width: 150, height: 200, resizeMode: 'contain' },
});