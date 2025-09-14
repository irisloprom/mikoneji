import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import { Story } from '../models/Story.js';
import { Milestone } from '../models/Milestone.js';
import { slugify } from '../utils/slug.js';

async function run() {
  await connectDB();

  const title = 'El Legado Oculto de Mascota — Barrio Chino (Raval)';
  const slug = slugify('barrio-chino-legado-oculto-de-mascota');

  // Coordenadas (lng, lat)
  const LOC_MARSELLA   = { type: 'Point' as const, coordinates: [2.171254, 41.378304] };
  const LOC_TORNO      = { type: 'Point' as const, coordinates: [2.168614, 41.38418] };
  const LOC_GATO       = { type: 'Point' as const, coordinates: [2.169861, 41.378135] };
  const LOC_ROBADOR    = { type: 'Point' as const, coordinates: [2.170093, 41.380267] };
  const LOC_RUBIO_LLUCH= { type: 'Point' as const, coordinates: [2.170000, 41.381110] };

  const session = await mongoose.startSession();
  await session.withTransaction(async () => {
    // 1) Crear/actualizar historia
    let story = await Story.findOne({ slug }).session(session);

    const base = {
      title,
      slug,
      summary:
        'Mascota te guía por la “doble cara” del Barrio Chino de los años 20. Sigue las páginas perdidas de un cronista para desvelar su legado oculto.',
      theme: 'history',
      neighborhood: 'El Raval (Barrio Chino)',
      coverImageUrl: 'https://example.com/portada-barrio-chino.jpg',
      durationMinutes: 45,
      tags: ['raval', 'barrio chino', 'años 20', 'historia', 'mascota'],
      status: 'published' as const,
      startLocation: LOC_MARSELLA
    };

    if (!story) {
      story = await Story.create([{
        ...base,
        // si publicamos por primera vez, ponemos fecha ahora
        publishedAt: new Date()
      }], { session }).then(d => d[0]);
      console.log('✅ Historia creada:', story.slug);
    } else {
      // no pisamos cover si ya hay una; no tocamos publishedAt si ya existía
      Object.assign(story, {
        ...base,
        coverImageUrl: story.coverImageUrl || base.coverImageUrl,
        publishedAt: story.publishedAt ?? new Date()
      });
      await story.save({ session });
      console.log('ℹ️ Historia actualizada:', story.slug);
    }

    // 2) Limpiar hitos anteriores y resembrar (atómico en la transacción)
    await Milestone.deleteMany({ story: story._id }).session(session);

    const milestones = [
      {
        story: story._id,
        order: 0,
        type: 'narrative',
        title: 'Introducción — Mascota',
        description:
          '“¡Hola, exploradores! Soy Mascota, vuestro guía en este viaje al pasado. He encontrado las páginas perdidas de la libreta de un cronista de los años 20. Quería revelar la ‘doble cara’ del Barrio Chino: vida, contrastes y secretos. ¿Me ayudáis a completar su crónica? ¡Nuestra primera parada está muy cerca!”',
        points: 5
      },
      {
        story: story._id,
        order: 1,
        type: 'quiz',
        title: 'El Comienzo de la Crónica',
        description:
          'Lugar: Bar Marsella (C/ Sant Pau, 65). El cronista escribió: “El aire huele a historia y a anís… La absenta es una llave a historias no contadas.”\n\nPregunta: “¿Por qué la llamaban el ‘Hada Verde’?”\n(A) Camarera de verde\n(B) Color y efecto inspirador ✅\n(C) Planta extraña en la puerta\n(D) Receta de curandera\n\nAccesibilidad: permite escribir la letra “B”.',
        location: LOC_MARSELLA,
        proximityRadiusM: 50,
        riddle: {
          question: '¿Por qué la absenta era el “Hada Verde”?',
          acceptedAnswers: ['b', 'B'],
          caseSensitive: false
        },
        points: 10
      },
      {
        story: story._id,
        order: 2,
        type: 'location',
        title: 'La Historia Silenciosa',
        description:
          'Lugar: Torno de los Expósitos (C/ Ramelleres, 17). “Este mecanismo silencioso preservaba un principio fundamental para las madres: el anonimato.”\n\nAccesibilidad: si el GPS falla, escribe la palabra clave.',
        location: LOC_TORNO,
        proximityRadiusM: 35,
        riddle: {
          question: '¿Cuál era el principio fundamental de este lugar?',
          acceptedAnswers: ['anonimato'],
          caseSensitive: false
        },
        points: 10
      },
      {
        story: story._id,
        order: 3,
        type: 'riddle',
        title: 'El Escenario de la Libertad',
        description:
          'Lugar: Rambla del Raval (cerca del Gato de Botero, donde estuvo La Criolla).\n“El suelo no era de baldosas sino de un material que lo absorbía todo… como en antiguas carnicerías.”\n\nPregunta: Palabra de 6 letras.',
        location: LOC_GATO,
        proximityRadiusM: 60,
        riddle: {
          question: 'Material del suelo en La Criolla (6 letras)',
          acceptedAnswers: ['serrin', 'serrín', 'SERRIN', 'SERRÍN'],
          caseSensitive: false
        },
        points: 15,
        hintPenalty: 3
      },
      {
        story: story._id,
        order: 4,
        type: 'photo',
        title: 'Conectando Dos Mundos',
        description:
          'Lugar: Esquina de C/ d’En Robador con C/ Sant Pau. “La leyenda de Enriqueta Martí conecta dos mundos. La calle lleva marcada esa fama.”\n\nPrueba: Saca una foto a la placa oficial de “Carrer d’En Robador”.\nAccesibilidad: escribe el nombre completo de la placa.',
        location: LOC_ROBADOR,
        proximityRadiusM: 60,
        riddle: {
          question: 'Nombre completo de la placa',
          acceptedAnswers: [
            "carrer d'en robador",
            "carrer d’en robador",
            "CARRER D'EN ROBADOR",
            "CARRER D’EN ROBADOR",
            "carrer d en robador"   // variante sin apóstrofe
          ],
          caseSensitive: false
        },
        points: 20
      },
      {
        story: story._id,
        order: 5,
        type: 'riddle',
        title: 'El Legado Revelado',
        description:
          'Lugar: Jardins de Rubió i Lluch (Antiguo Hospital de la Santa Creu).\n“Entre estos muros, el círculo se cierra. Aquí convergen todas las historias.”\n\nPrueba: di en voz alta la palabra que describe su función histórica principal.\nAccesibilidad: permite escribirla.',
        location: LOC_RUBIO_LLUCH,
        proximityRadiusM: 60,
        riddle: {
          question: 'Di o escribe la palabra clave',
          acceptedAnswers: ['hospital'],
          caseSensitive: false
        },
        points: 20
      },
      {
        story: story._id,
        order: 6,
        type: 'narrative',
        title: 'Conclusión — Mascota',
        description:
          '“¡Misión cumplida! La crónica de ‘La Doble Cara’ está completa. Habéis seguido los pasos del cronista y desvelado un legado oculto en las calles del Raval. ¡Nos vemos en la próxima aventura!”',
        points: 5
      }
    ];

    await Milestone.insertMany(milestones, { session });
    story.milestoneCount = milestones.length;
    await story.save({ session });

    console.log(`✅ Sembrados ${milestones.length} hitos para`, story.slug);
  });

  console.log('🎉 Seed completado.');
  await session.endSession();
  process.exit(0);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
