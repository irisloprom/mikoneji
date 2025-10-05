import 'dotenv/config';
import fs from 'node:fs';
import path from 'node:path';
import { connectDB } from '../config/db.js';
import { Story } from '../models/Story.js';
import { Milestone } from '../models/Milestone.js';

const outDir = process.argv[2] || 'exports';

/**
 * Limpia campos internos de Mongoose y devuelve JSON listo para exportar.
 */
function cleanDoc<T extends Record<string, any>>(doc: T) {
  const clone = { ...doc };
  delete (clone as any)._id;
  delete (clone as any).__v;
  delete (clone as any).createdAt;
  delete (clone as any).updatedAt;
  return clone;
}

/**
 * Convierte un milestone del modelo a JSON compatible con el import.
 */
function formatMilestone(m: any) {
  return {
    order: m.order,
    type: m.type,
    title: m.title,
    description: m.description,
    media: m.media,
    location: m.location,
    proximityRadiusM: m.proximityRadiusM,
    // normaliza riddle: usa prompt y omite question duplicada
    riddle: m.riddle
      ? {
          prompt: m.riddle.prompt ?? m.riddle.question,
          acceptedAnswers: m.riddle.acceptedAnswers ?? [],
          caseSensitive: m.riddle.caseSensitive ?? false,
        }
      : undefined,
    clues: m.clues,
    timeLimitSec: m.timeLimitSec,
    points: m.points,
    hintPenalty: m.hintPenalty,
    requiredToComplete: m.requiredToComplete,
  };
}

async function run() {
  await connectDB();
  fs.mkdirSync(outDir, { recursive: true });

  const stories = await Story.find().lean();
  console.log(`📤 Exportando ${stories.length} historias...`);

  for (const s of stories) {
    const ms = await Milestone.find({ story: s._id }).sort({ order: 1 }).lean();

    const dump = {
      title: s.title,
      slug: s.slug,
      summary: s.summary,
      theme: s.theme,
      neighborhood: s.neighborhood,
      coverImageUrl: s.coverImageUrl,
      durationMinutes: s.durationMinutes,
      estimatedMinutes: s.estimatedMinutes,
      difficulty: s.difficulty,
      tags: s.tags,
      status: s.status,
      publishedAt: s.publishedAt,
      startLocation: s.startLocation,
      center: s.center,
      milestones: ms.map(formatMilestone),
    };

    const file = path.join(outDir, `${s.slug}.json`);
    fs.writeFileSync(file, JSON.stringify(dump, null, 2), 'utf8');
    console.log('⬇️  Exportado', file);
  }

  console.log('\n✅ Export completo');
  process.exit(0);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
