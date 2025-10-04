import React from 'react';
import PermissionScreen from './PermissionScreen';
import { MicrophonePermissionScreenProps } from '../../navigation/types';

const MicrophonePermissionScreen = ({ navigation }: MicrophonePermissionScreenProps) => {
  return (
    <PermissionScreen
      navigation={navigation}
      permissionType="RECORD_AUDIO"
      imageSource={require('../../assets/images/boton-micro.png')}
      title="Micrófono"
      description="Habla, grita o susurra, el micrófono hace parte de la experiencia..."
      modalText="La aplicación requiere acceso al micrófono, ya que esta función es parte esencial de la experiencia de juego. Con ella podrás registrar sonidos, resolver retos auditivos y activar dinámicas que dependen de tu voz o del entorno."
      nextScreen="Home"
    />
  );
};

export default MicrophonePermissionScreen;