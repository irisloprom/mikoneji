import 'dotenv/config';
import fs from 'node:fs';
import path from 'node:path';
import { z } from 'zod';
import { connectDB } from '../config/db.js';
import { Story } from '../models/Story.js';
import { Milestone } from '../models/Milestone.js';
import { slugify } from '../utils/slug.js';

// === CLI args muy simples ===
// Ejemplos:
//   ts-node src/scripts/import-stories.ts --file src/data/stories/barrio-chino.json
//   ts-node src/scripts/import-stories.ts --dir src/data/stories
// Flags:
//   --mode replace | append | skip (default: replace)
//   --dry (no escribe)
//
const args = process.argv.slice(2);
let files: string[] = [];
let mode: 'replace' | 'append' | 'skip' = 'replace';
let dryRun = false;

for (let i = 0; i < args.length; i++) {
  const a = args[i];
  if (a === '--file' && args[i+1]) {
    files.push(args[++i]);
  } else if (a === '--dir' && args[i+1]) {
    const dir = args[++i];
    const all = fs.readdirSync(dir)
      .filter(f => f.endsWith('.json'))
      .map(f => path.join(dir, f));
    files.push(...all);
  } else if (a === '--mode' && args[i+1]) {
    const m = args[++i] as any;
    if (['replace','append','skip'].includes(m)) mode = m;
  } else if (a === '--dry') {
    dryRun = true;
  }
}

if (!files.length) {
  console.error('Uso: --file <ruta.json> | --dir <carpeta> [--mode replace|append|skip] [--dry]');
  process.exit(1);
}

// === Esquemas JSON ===
const GeoPoint = z.object({
  type: z.literal('Point'),
  coordinates: z.tuple([z.number(), z.number()]) // [lng, lat]
});

const MilestoneJson = z.object({
  order: z.number().int().nonnegative().optional(),
  type: z.enum(['narrative','location','riddle','photo','quiz','checkpoint']),
  title: z.string(),
  description: z.string().optional(),
  media: z.object({
    imageUrl: z.string().url().optional(),
    audioUrl: z.string().url().optional(),
    videoUrl: z.string().url().optional()
  }).optional(),
  location: GeoPoint.optional(),
  proximityRadiusM: z.number().int().optional(),
  riddle: z.object({
    question: z.string().optional(),
    acceptedAnswers: z.array(z.string()).optional(),
    caseSensitive: z.boolean().optional()
  }).optional(),
  clues: z.array(z.string()).optional(),
  timeLimitSec: z.number().int().optional(),
  points: z.number().int().optional(),
  hintPenalty: z.number().int().optional(),
  requiredToComplete: z.boolean().optional()
});

const StoryJson = z.object({
  title: z.string(),
  slug: z.string().optional(),
  summary: z.string().optional(),
  theme: z.enum(['esoteric','queer','history','romance','legends','custom']).optional(),
  neighborhood: z.string().optional(),
  coverImageUrl: z.string().url().optional(),
  durationMinutes: z.number().int().optional(),
  tags: z.array(z.string()).optional(),
  status: z.enum(['draft','published','archived']).optional(),
  publishedAt: z.coerce.date().optional(),
  startLocation: GeoPoint.optional(),
  milestones: z.array(MilestoneJson).default([])
});

type StoryInput = z.infer<typeof StoryJson>;

async function importOne(filePath: string) {
  const raw = fs.readFileSync(filePath, 'utf8');
  const json = StoryJson.parse(JSON.parse(raw));

  const slug = (json.slug?.trim() || slugify(json.title));
  const storyData = {
    title: json.title,
    slug,
    summary: json.summary,
    theme: json.theme,
    neighborhood: json.neighborhood,
    coverImageUrl: json.coverImageUrl,
    durationMinutes: json.durationMinutes,
    tags: json.tags,
    status: json.status ?? 'draft',
    publishedAt: json.status === 'published'
      ? (json.publishedAt ?? new Date())
      : json.publishedAt, // si es draft, lo ignorará el modelo
    startLocation: json.startLocation
  };

  const existing = await Story.findOne({ slug });

  if (!existing) {
    console.log(`➕ Creando historia: ${slug}`);
    if (dryRun) return;
    const story = await Story.create(storyData);

    if (json.milestones.length) {
      const docs = json.milestones.map((m, idx) => ({
        story: story._id,
        order: m.order ?? idx,
        title: m.title,
        description: m.description,
        type: m.type,
        media: m.media,
        location: m.location,
        proximityRadiusM: m.proximityRadiusM,
        riddle: m.riddle ? {
          question: m.riddle.question,
          acceptedAnswers: m.riddle.acceptedAnswers ?? [],
          caseSensitive: m.riddle.caseSensitive ?? false
        } : undefined,
        clues: m.clues,
        timeLimitSec: m.timeLimitSec,
        points: m.points,
        hintPenalty: m.hintPenalty,
        requiredToComplete: m.requiredToComplete ?? true
      }));
      await Milestone.insertMany(docs);
      story.milestoneCount = docs.length;
      await story.save();
    }
    return;
  }

  // Historia existe → según modo
  console.log(`ℹ️ Historia ya existe: ${slug}  (mode=${mode})`);

  if (mode === 'skip') return;

  if (!dryRun) {
    // upsert de datos básicos
    Object.assign(existing, storyData);
    await existing.save();
  }

  if (json.milestones.length) {
    if (mode === 'replace') {
      console.log(`  ↻ Reemplazando milestones…`);
      if (!dryRun) await Milestone.deleteMany({ story: existing._id });
      const docs = json.milestones.map((m, idx) => ({
        story: existing._id,
        order: m.order ?? idx,
        title: m.title,
        description: m.description,
        type: m.type,
        media: m.media,
        location: m.location,
        proximityRadiusM: m.proximityRadiusM,
        riddle: m.riddle ? {
          question: m.riddle.question,
          acceptedAnswers: m.riddle.acceptedAnswers ?? [],
          caseSensitive: m.riddle.caseSensitive ?? false
        } : undefined,
        clues: m.clues,
        timeLimitSec: m.timeLimitSec,
        points: m.points,
        hintPenalty: m.hintPenalty,
        requiredToComplete: m.requiredToComplete ?? true
      }));
      if (!dryRun) {
        await Milestone.insertMany(docs);
        existing.milestoneCount = docs.length;
        await existing.save();
      }
    } else if (mode === 'append') {
      console.log(`  ➕ Añadiendo milestones al final…`);
      const count = await Milestone.countDocuments({ story: existing._id });
      const docs = json.milestones.map((m, idx) => ({
        story: existing._id,
        order: m.order ?? (count + idx),
        title: m.title,
        description: m.description,
        type: m.type,
        media: m.media,
        location: m.location,
        proximityRadiusM: m.proximityRadiusM,
        riddle: m.riddle ? {
          question: m.riddle.question,
          acceptedAnswers: m.riddle.acceptedAnswers ?? [],
          caseSensitive: m.riddle.caseSensitive ?? false
        } : undefined,
        clues: m.clues,
        timeLimitSec: m.timeLimitSec,
        points: m.points,
        hintPenalty: m.hintPenalty,
        requiredToComplete: m.requiredToComplete ?? true
      }));
      if (!dryRun) {
        await Milestone.insertMany(docs);
        existing.milestoneCount = count + docs.length;
        await existing.save();
      }
    }
  }
}

async function run() {
  await connectDB();
  console.log(`📦 Importando ${files.length} archivo(s)…`);
  for (const f of files) {
    try {
      console.log(`\n— ${f}`);
      await importOne(f);
    } catch (e: any) {
      console.error('❌ Error en', f, '\n', e?.message || e);
    }
  }
  console.log('\n✅ Import terminado.');
  process.exit(0);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
