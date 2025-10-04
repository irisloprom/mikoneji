import React from 'react';
import PermissionScreen from './PermissionScreen';
import { CameraPermissionScreenProps } from '../../navigation/types';

const CameraPermissionScreen = ({ navigation }: CameraPermissionScreenProps) => {
  return (
    <PermissionScreen
      navigation={navigation}
      permissionType="CAMERA"
      imageSource={require('../../assets/images/boton-camara.png')}
      title="Cámara"
      description="La cámara no es un extra, ¡es parte del juego! Úsala para sacar fotos y descubrir pistas ocultas.."
      modalText="La aplicación requiere acceso a la cámara, ya que esta función es esencial para la experiencia de juego. A través de la cámara podrás tomar fotografías y descubrir pistas ocultas que forman parte de la dinámica principal."
      nextScreen="LocationPermission"
    />
  );
};

export default CameraPermissionScreen;