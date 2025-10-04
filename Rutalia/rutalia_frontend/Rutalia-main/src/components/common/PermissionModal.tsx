import React from 'react';
import { Text, Modal, StyleSheet, Pressable } from 'react-native';
import { COLORS, globalStyles } from '../../styles/globalStyles';

interface PermissionModalProps {
  visible: boolean;
  onClose: () => void;
  text: string;
}

export const PermissionModal = ({ visible, onClose, text }: PermissionModalProps) => {
  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.modalContainer}>
          <Text style={globalStyles.bodyText}>{text}</Text>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: COLORS.background,
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    width: '80%',
  },
});