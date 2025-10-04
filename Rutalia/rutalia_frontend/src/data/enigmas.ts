export interface Enigma {
  id: string;
  storyId: number;
  order: number;
  totalEnigmas: number;
  storyTitle: string;
  image: any;
  introText: string;
  question: string;
  inputType: 'written' | 'audio' | 'multipleChoice' | 'gps' | 'photo';
  options?: string[];
  hints: string[];
  solution: string;
  correctAnswer: string;
  rewardId: string;
}

export const ENIGMAS: Enigma[] = [
  {
    id: 'judas1',
    storyId: 1,
    order: 1,
    totalEnigmas: 5,
    storyTitle: 'El beso de Judas',
    image: require('../assets/images/magico-judas.png'),
    introText: 'Para empezar con la magia, vamos con una pequeña suma.',
    question: '¿Podrías decirme cuál es el resultado de la suma de todos los números de la primera fila?',
    inputType: 'written',
    hints: ['La primera fila tiene 4 números.', 'Los números son 1, 14, 14 y 4.'],
    solution: 'El resultado es 33.',
    correctAnswer: '33',
    rewardId: 'judas1_reward',
  },
  {
    id: 'judas2',
    storyId: 1,
    order: 2,
    totalEnigmas: 5,
    storyTitle: 'El beso de Judas',
    image: require('../assets/images/magico-judas.png'),
    introText: 'Sigamos con la magia',
    question: '¿Podrías decir a través de tu micrófono cuál es la suma de los números de la segunda fila?',
    inputType: 'audio',
    hints: ['La operación es la misma que antes, pero esta vez céntrate en la segunda línea de números del cuadrado.', 'Suma los siguientes números: 11, 7, 6 y 9.'],
    solution: 'La respuesta es 33.',
    correctAnswer: '33',
    rewardId: 'judas2_reward',
  },
  {
    id: 'judas3',
    storyId: 1,
    order: 3,
    totalEnigmas: 5,
    storyTitle: 'El beso de Judas',
    image: require('../assets/images/magico-judas.png'),
    introText: 'Estamos a punto de acabar la magia, solo un pequeño empujoncito más.\n\nHemos visto que si sumamos los números de una misma fila, el resultado es 33.',
    question: '¿Qué número es el resultado de sumar los números de una misma columna?',
    inputType: 'multipleChoice',
    options: ['31', '23', '33', '13'],
    hints: ["El cuadrado es 'mágico' por una razón. ¿Qué resultado has obtenido en las dos sumas anteriores? Quizás haya un patrón...", 'No necesitas ni sumar. Si todas las filas suman 33, y es un cuadrado mágico... las columnas también sumarán lo mismo.'],
    solution: 'La respuesta es 33.',
    correctAnswer: '33',
    rewardId: 'judas3_reward',
  },
  {
    id: 'judas4',
    storyId: 1,
    order: 4,
    totalEnigmas: 5,
    storyTitle: 'El beso de Judas',
    image: require('../assets/images/magico-nuestro.png'),
    introText: '¡Ahora ya sabes cómo funciona un cuadrado mágico! Me preguntaba si... ¡Seguro que sí!\n\n¿Puedes completar este cuadrado mágico?',
    question: '¿Cuál es el número que falta en esta casilla?',
    inputType: 'written',
    hints: ['Concéntrate en la fila o columna donde está la casilla vacía. Ya conoces tres de los cuatro números. ¿Cuánto te falta para llegar a la suma mágica?', 'Los números de la fila son 10, 11 y 5. La suma de esos tres es 26. ¿Qué número necesitas añadirle a 26 para que el resultado sea 33?'],
    solution: 'La respuesta es 7.',
    correctAnswer: '7',
    rewardId: 'judas4_reward',
  },
  {
    id: 'judas5',
    storyId: 1,
    order: 5,
    totalEnigmas: 5,
    storyTitle: 'El beso de Judas',
    image: require('../assets/images/beso-traicion.png'),
    introText: 'El amor... ¡Qué bonito es! O eso me han dicho. Dicen que del amor al odio hay solo un paso o que existen besos envenenados. En esta escultura hay representadas dos personas, una de ellas es Jesús, mientras que la persona que le da el beso es su traidor.',
    question: '¿Sabrías cuál es su nombre?',
    inputType: 'multipleChoice',
    options: ['Judas', 'Mateo', 'Santiago'],
    hints: ['La expresión "un beso de..." se usa comúnmente para describir un acto de traición de alguien que parecía un amigo. El nombre del traidor ha dado origen a esa frase.', 'El propio nombre de la escultura que inspira este enigma es "El Beso de...". ¡El nombre que buscas está en el título!'],
    solution: 'La respuesta es Judas.',
    correctAnswer: 'Judas',
    rewardId: 'judas5_reward',
  },
];