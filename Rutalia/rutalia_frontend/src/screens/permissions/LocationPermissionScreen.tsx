import React from 'react';
import PermissionScreen from './PermissionScreen';
import { LocationPermissionScreenProps } from '../../navigation/types';

const LocationPermissionScreen = ({ navigation }: LocationPermissionScreenProps) => {
  return (
    <PermissionScreen
      navigation={navigation}
      permissionType="ACCESS_FINE_LOCATION"
      imageSource={require('../../assets/images/boton-gps.png')}
      title="Ubicación"
      description="Tu ubicación es la brújula del juego. La necesitamos para guiarte en los enigmas y que la aventura cobre vida. No la guardamos ni la compartimos."
      modalText="La aplicación requiere acceso a la ubicación (GPS), ya que esta función es fundamental para la experiencia de juego. Gracias a ella podrás explorar tu entorno, desbloquear contenidos y encontrar pistas vinculadas a tu posición real."
      nextScreen="MicrophonePermission"
    />
  );
};

export default LocationPermissionScreen;