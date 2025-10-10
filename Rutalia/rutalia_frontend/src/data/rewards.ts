import { RootStackParamList } from "../navigation/types";

export interface Reward {
  id: string;
  image: any;
  firstLine: string;
  boldLine: string;
  scrollableText: string;
  nextScreen: keyof RootStackParamList;
  nextScreenParams?: any;
}

export const REWARDS: Reward[] = [
  {
    id: 'judas1_reward',
    image: require('../assets/images/judas-recompensa-1.png'),
    firstLine: '¡Así es! La suma de los números es 33.',
    boldLine: 'Jesús de Nazaret murió a los 33 años.',
    scrollableText:
      'El método de ejecución elegido fue la crucifixión, una pena brutal y humillante...',
    nextScreen: 'Enigma',
    nextScreenParams: { enigmaId: 'judas2' },
  },
  {
    id: 'judas2_reward',
    image: require('../assets/images/judas-recompensa-2.png'),
    firstLine: '¡Efectivamente, también 33!',
    boldLine: '',
    scrollableText: 
      'Algunos historiadores y teólogos señalan que el número de milagros atribuidos a Jesús es a menudo asociado con el 33...',
    nextScreen: 'Enigma',
    nextScreenParams: { enigmaId: 'judas3' },
  },
  {
    id: 'judas3_reward',
    image: require('../assets/images/judas-recompensa-3.png'),
    firstLine: '¡Exacto, la respuesta es 33 otra vez!',
    boldLine: '',
    scrollableText:
      'Si sumamos los números de cada cuadrícula de cada fila y columna, el resultado es el mismo: 33...',
    nextScreen: 'Enigma',
    nextScreenParams: { enigmaId: 'judas4' },
  },
  {
    id: 'judas4_reward',
    image: require('../assets/images/judas-recompensa-4.png'),
    firstLine: '¡Correcto! ¡La respuesta es 7!',
    boldLine: '',
    scrollableText: 
      "Este tipo de Cuadrado Mágico es el más común...",
    nextScreen: 'Enigma',
    nextScreenParams: { enigmaId: 'judas5' },
  },
  {
    id: 'judas5_reward',
    image: require('../assets/images/judas-recompensa-5.png'),
    firstLine: 'Exacto, fue Judas.',
    boldLine: '',
    scrollableText:
      'La traición de Judas es uno de los episodios más oscuros y trágicos de la Biblia...',
    nextScreen: 'FinalReward',
    nextScreenParams: { storyId: 1 },
  },
];