export interface Story {
  id: number;
  title: string;
  neighborhood: string;
  duration: string;
  enigmas: number;
  tag: string;
  description: string;
  image: any;
  footerImage: any;
  firstEnigmaId: string;
}

export const STORIES: Story[] = [
  {
    id: 1,
    title: 'El beso de Judas',
    neighborhood: "L'Eixample",
    duration: '30 min',
    enigmas: 5,
    tag: 'Histórico',
    description:
      'En unas de las fachadas de la sagrada familia hay una estatua con un cuadro mágico al lado. La estatua representa a Judas, seguidor de Jesús, pero la leyenda que envuelve a la escultura es mucho más romántica.\n\nSe dice que si dos personas enamoradas se besan debajo de esa estatua, su amor durará para siempre.\n\nYo no sé mucho de amor, pero sí sé por qué a ese cuadro se le llama mágico.\n\n¡Vamos a descubrirlo!',
    image: require('../assets/images/beso-judas-inicio.png'),
    footerImage: require('../assets/images/eulalia-cola.png'),
    firstEnigmaId: 'judas1',
  },
];