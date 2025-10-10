export interface FinalReward {
  storyId: number;
  achievementTitle: string;
  achievementSubtitle: string;
  image: any;
  tag: string;
  bodyText: string;
}

export const FINAL_REWARDS: FinalReward[] = [
  {
    storyId: 1,
    achievementTitle: 'Sello',
    achievementSubtitle: '"Beso de Judas"',
    image: require('../assets/images/logro-final-judas.png'),
    tag: 'Histórico',
    bodyText: '¡Hemos desvelado la magia del 33! Este número, constante en nuestras sumas, esconde un profundo simbolismo. Jesús de Nazaret murió a los 33 años crucificado, un sacrificio con el que se asocian sus milagros y el Salmo 33.\n\nEsta magia numérica se extiende a los Cuadrados Mágicos, como el antiguo Lo Shu, donde el 33 aparece en filas, columnas y diagonales. Distinguimos entre los que no repiten números y los "Cuadrados Mágicos Semánticos" o "con Repetición", como los relacionados con "El Beso de Judas".\n\nFinalmente, el acto de Judas, un beso de traición que entregó a Jesús por 30 monedas de plata, nos recuerda cómo los gestos pueden esconder oscuros significados, tal como vemos en "El Padrino". El 33, los cuadrados mágicos y la traición se entrelazan en este viaje de descubrimientos.\n\nY tú: ¿eres más de dar besos de amor o de darlos envenenados? ¿Estás pensando en darme uno a mí? ¡Qué nervios! Será mi primer beso después de haber sido rechazada 33 veces.',
  },
];