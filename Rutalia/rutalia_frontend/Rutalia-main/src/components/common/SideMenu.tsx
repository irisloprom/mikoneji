import React from 'react';
import { Modal, Text, StyleSheet, Pressable, TouchableOpacity } from 'react-native';
import { COLORS, globalStyles } from '../../styles/globalStyles';

interface SideMenuProps {
  visible: boolean;
  onClose: () => void;
}

export const SideMenu = ({ visible, onClose }: SideMenuProps) => {
  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.menuContainer} onPress={() => {}}>
          <TouchableOpacity style={styles.menuItem}><Text style={globalStyles.bodyText}>Perfil</Text></TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}><Text style={globalStyles.bodyText}>Configuración</Text></TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}><Text style={globalStyles.bodyText}>Pausa la misión</Text></TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'transparent' },
  menuContainer: { position: 'absolute', top: 100, right: 24, width: 200, backgroundColor: COLORS.background, borderRadius: 10, padding: 10, elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84 },
  menuItem: { paddingVertical: 15, paddingHorizontal: 10 },
});