import 'dotenv/config';
import fs from 'node:fs';
import path from 'node:path';
import { connectDB } from '../config/db';
import { Story } from '../models/Story';
import { Milestone } from '../models/Milestone';

// === CLI args ===
// Ejemplos:
//   ts-node src/scripts/export-stories.ts --slug barrio-chino
//   ts-node src/scripts/export-stories.ts --all
// Flags:
//   --dir <carpeta destino> (por defecto ./exports)
const args = process.argv.slice(2);
let exportAll = false;
let slugs: string[] = [];
let exportDir = './exports';

for (let i = 0; i < args.length; i++) {
  const a = args[i];
  if (a === '--slug' && args[i + 1]) {
    slugs.push(args[++i]);
  } else if (a === '--all') {
    exportAll = true;
  } else if (a === '--dir' && args[i + 1]) {
    exportDir = args[++i];
  }
}

if (!exportAll && !slugs.length) {
  console.error('Uso: --slug <nombre> | --all [--dir <carpeta>]');
  process.exit(1);
}

// === Función principal ===
async function exportStories() {
  await connectDB();

  const query = exportAll ? {} : { slug: { $in: slugs } };
  const stories = await Story.find(query);
  if (!stories.length) {
    console.log('⚠️ No se encontraron historias para exportar.');
    process.exit(0);
  }

  if (!fs.existsSync(exportDir)) fs.mkdirSync(exportDir, { recursive: true });

  for (const story of stories) {
    const milestones = await Milestone.find({ story: story._id }).sort({ order: 1 }).lean();

    const storyJson = {
      title: story.title,
      slug: story.slug,
      summary: story.summary,
      theme: story.theme,
      neighborhood: story.neighborhood,
      coverImageUrl: story.coverImageUrl,
      durationMinutes: story.durationMinutes,
      estimatedMinutes: story.estimatedMinutes,
      estimatedSteps: story.estimatedSteps ?? milestones.length,
      difficulty: story.difficulty,
      language: story.language ?? 'es',
      createdBy: story.createdBy ?? 'Rutalia Team',
      updatedAt: story.updatedAt ?? new Date(),
      version: story.version ?? '1.0',
      requires: story.requires ?? { gps: false, camera: false, voice: false },
      analytics: story.analytics ?? { category: 'educational', kpiTags: [] },
      tags: story.tags ?? [],
      status: story.status ?? 'draft',
      publishedAt: story.publishedAt,
      startLocation: story.startLocation ?? {
        type: 'Point',
        coordinates: [0, 0],
        name: 'Ubicación no especificada'
      },
      center: story.center,
      milestones: milestones.map((m: any) => ({
        order: m.order,
        id: m.id,
        type: m.type,
        title: m.title,
        description: m.description,
        media: m.media ?? null,
        location: m.location ?? null,
        proximityRadiusM: m.proximityRadiusM,
        riddle: m.riddle
          ? {
              prompt: m.riddle.prompt,
              acceptedAnswers: m.riddle.acceptedAnswers,
              caseSensitive: m.riddle.caseSensitive ?? false
            }
          : undefined,
        clues: m.clues ?? [],
        choices: m.choices ?? [],
        options: m.options ?? [],
        accessibility: m.accessibility ?? null,
        points: m.points ?? 0,
        hintPenalty: m.hintPenalty ?? 0,
        timeLimitSec: m.timeLimitSec ?? null,
        requiredToComplete: m.requiredToComplete ?? true
      }))
    };

    const filename = `${story.slug}_${story.language || 'es'}.json`;
    const filepath = path.join(exportDir, filename);
    fs.writeFileSync(filepath, JSON.stringify(storyJson, null, 2), 'utf8');
    console.log(`💾 Exportado: ${filename}`);
  }

  console.log(`\n✅ Exportación completada en ${path.resolve(exportDir)}`);
  process.exit(0);
}

exportStories().catch((err) => {
  console.error('❌ Error exportando historias:', err);
  process.exit(1);
});
