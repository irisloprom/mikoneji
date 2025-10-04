import { RootStackParamList } from "../navigation/types";

export interface Reward {
  id: string;
  image: any;
  firstLine: string;
  scrollableText: string;
  nextScreen: keyof RootStackParamList;
  nextScreenParams?: any;
}

export const REWARDS: Reward[] = [
  {
    id: 'judas1_reward',
    image: require('../assets/images/judas-recompensa-1.png'),
    firstLine: '¡Así es! La suma de los números es 33.',
    scrollableText:
      '33 es un número muy especial para la religión católica, ¿lo sabías?\n\nJesús de Nazaret murió a los 33 años.\n\nEl método de ejecución elegido fue la crucifixión, una pena brutal y humillante reservada por los romanos para criminales y rebeldes. Jesús fue forzado a cargar su propia cruz, o al menos el madero horizontal, a través de las calles de Jerusalén hasta el Gólgota, también conocido como el Calvario. Allí, fue clavado a la cruz, una forma lenta y dolorosa de morir por asfixia y agotamiento, mientras era expuesto públicamente.\n\nFinalmente, Jesús murió en la cruz tras varias horas de sufrimiento. La tradición cristiana sostiene que su muerte fue un sacrificio voluntario para la redención de los pecados de la humanidad, y que al tercer día resucitó de entre los muertos, culminando así el plan divino de salvación. Este evento es conmemorado anualmente por los cristianos durante la Semana Santa.',
    nextScreen: 'Enigma',
    nextScreenParams: { enigmaId: 'judas2' },
  },
  {
    id: 'judas2_reward',
    image: require('../assets/images/judas-recompensa-2.png'),
    firstLine: '¡Efectivamente, también 33! Si sumamos los números de cada fila obtendremos siempre el número 33, curioso, ¿verdad?',
    scrollableText: 
      'Algunos historiadores y teólogos señalan que el número de milagros atribuidos a Jesús es a menudo asociado con el 33, aunque no hay una cifra exacta y universalmente aceptada.\n\nEl Salmo 33 de la Biblia, a pesar de no estar directamente relacionado con la vida de Jesús, es un salmo de alabanza a Dios por su palabra y su poder.\n\nSigamos descubriendo el poder y la magia de los números.',
    nextScreen: 'Enigma',
    nextScreenParams: { enigmaId: 'judas3' },
  },
  {
    id: 'judas3_reward',
    image: require('../assets/images/judas-recompensa-3.png'),
    firstLine: '¡Exacto, la respuesta es 33 otra vez! ¿Vas entendiendo la magia?',
    scrollableText:
      'Si sumamos los números de cada cuadrícula de cada fila y columna, el resultado es el mismo: 33.\n\n¡También ocurre si sumamos las dos diagonales!\n\nA estos tipos de cuadrados se les llama Cuadrados Mágicos.\n\nEl más antiguo conocido se llama Lo Shu (河圖洛書), y se dice que se originó en la antigua China, alrededor del 650 a.C. Se encontró en el caparazón de una tortuga mítica, y es un cuadrado mágico de 3x3.',
    nextScreen: 'Enigma',
    nextScreenParams: { enigmaId: 'judas4' },
  },
  {
    id: 'judas4_reward',
    image: require('../assets/images/judas-recompensa-4.png'),
    firstLine: '¡Correcto! ¡La respuesta es 7!',
    scrollableText: 
      "Este tipo de Cuadrado Mágico es el más común y tiene una peculiaridad: no hay ningún número que se repita. ¿Te has dado cuenta?\n\nEntonces… ¿Cómo se llama el tipo de Cuadrado Mágico en el que se repiten números como en El Beso de Judas?\n\nSe les conoce como “Cuadrados Mágicos Semánticos” o “Cuadrados Mágicos con Repetición\".\n\n¿Hemos acabado con la magia? Aún queda hablar de la leyenda y del amor. \n\n¿Acaso el amor no es un tipo de magia?",
    nextScreen: 'Enigma',
    nextScreenParams: { enigmaId: 'judas5' },
  },
  {
    id: 'judas5_reward',
    image: require('../assets/images/judas-recompensa-5.png'),
    firstLine: 'Exacto, fue Judas.',
    scrollableText:
      'La traición de Judas es uno de los episodios más oscuros y trágicos de la Biblia. En los evangelios canónicos, se narra que Judas hizo un pacto con los sumos sacerdotes para entregar a Jesús a cambio de 30 monedas de plata. El acto de traición se consumó con el famoso "Beso de Judas" en el Huerto de los Olivos. Este gesto, que normalmente es una señal de afecto, fue utilizado como una señal para identificar a Jesús ante los soldados que lo arrestarían.\n\nAsí que un beso no siempre está relacionado con el amor. Lo podemos ver en otras obras que ejemplifican las leyendas mafiosas, como en El Padrino (1972) de Francis Ford Coppola.',
    nextScreen: 'FinalReward',
    nextScreenParams: { storyId: 1 },
  },
];