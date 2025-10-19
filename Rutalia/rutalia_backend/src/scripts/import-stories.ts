import 'dotenv/config';
import fs from 'node:fs';
import path from 'node:path';
import { z } from 'zod';
import { connectDB } from '../config/db.js';
import { Story } from '../models/Story.js';
import { Milestone } from '../models/Milestone.js';
import { slugify } from '../utils/slug.js';

// === CLI args ===
// Ejemplos:
//   ts-node src/scripts/import-stories.ts --file src/data/stories/barrio-chino.json
//   ts-node src/scripts/import-stories.ts --dir src/data/stories
// Flags:
//   --mode replace | append | skip (default: replace)
//   --dry (no escribe)
const args = process.argv.slice(2);
let files: string[] = [];
let mode: 'replace' | 'append' | 'skip' = 'replace';
let dryRun = false;

for (let i = 0; i < args.length; i++) {
  const a = args[i];
  if (a === '--file' && args[i + 1]) {
    files.push(args[++i]);
  } else if (a === '--dir' && args[i + 1]) {
    const dir = args[++i];
    const all = fs
      .readdirSync(dir)
      .filter((f) => f.endsWith('.json'))
      .map((f) => path.join(dir, f));
    files.push(...all);
  } else if (a === '--mode' && args[i + 1]) {
    const m = args[++i] as any;
    if (['replace', 'append', 'skip'].includes(m)) mode = m;
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
  coordinates: z.tuple([z.number(), z.number()]), // [lng, lat]
  name: z.string().optional()
});

const MediaJson = z.object({
  imageUrl: z.string().url().optional(),
  audioUrl: z.string().url().optional(),
  videoUrl: z.string().url().optional()
}).partial().optional();

const AccessibilityJson = z.object({
  type: z.string().optional(),
  description: z.string().optional()
}).optional();

const RiddleJson = z.object({
  prompt: z.string().optional(),
  question: z.string().optional(),
  acceptedAnswers: z.array(z.string()).optional(),
  caseSensitive: z.boolean().optional()
}).partial().optional();

const MilestoneJson = z.object({
  order: z.number().int().nonnegative().optional(),
  id: z.string().optional(),
  type: z.enum(['narrative', 'location', 'riddle', 'photo', 'quiz', 'voice', 'camera', 'gps', 'checkpoint']),
  title: z.string(),
  description: z.string().optional(),
  media: MediaJson,
  location: GeoPoint.optional(),
  proximityRadiusM: z.number().int().optional(),
  riddle: RiddleJson,
  clues: z.array(z.string()).optional(),
  timeLimitSec: z.number().int().optional(),
  points: z.number().int().optional(),
  hintPenalty: z.number().int().optional(),
  requiredToComplete: z.boolean().optional(),
  accessibility: AccessibilityJson,
  choices: z.array(z.string()).optional(),
  options: z.array(z.string()).optional()
});

const RequiresJson = z.object({
  gps: z.boolean().optional(),
  camera: z.boolean().optional(),
  voice: z.boolean().optional()
}).partial().optional();

const AnalyticsJson = z.object({
  category: z.string().optional(),
  kpiTags: z.array(z.string()).optional()
}).partial().optional();

const StoryJson = z.object({
  title: z.string(),
  slug: z.string().optional(),
  summary: z.string().optional(),
  theme: z.string().optional(),
  neighborhood: z.string().optional(),
  coverImageUrl: z.string().url().optional(),
  durationMinutes: z.number().int().optional(),
  estimatedMinutes: z.number().int().optional(),
  estimatedSteps: z.number().int().optional(),
  difficulty: z.enum(['easy', 'medium', 'hard']).optional(),
  language: z.string().optional(),
  createdBy: z.string().optional(),
  updatedAt: z.coerce.date().optional(),
  version: z.string().optional(),
  requires: RequiresJson,
  analytics: AnalyticsJson,
  tags: z.array(z.string()).optional(),
  status: z.enum(['draft', 'published', 'archived']).optional(),
  publishedAt: z.coerce.date().optional(),
  startLocation: GeoPoint.optional(),
  center: GeoPoint.optional(),
  milestones: z.array(MilestoneJson).default([])
});

type StoryInput = z.infer<typeof StoryJson>;

function normalizeAnswers(arr?: string[], caseSensitive?: boolean) {
  if (!arr?.length) return [];
  const trimmed = arr.map((s) => s.trim()).filter(Boolean);
  return trimmed;
}

function milestoneToDoc(m: z.infer<typeof MilestoneJson>, idx: number, storyId: any) {
  const prompt = m.riddle?.prompt ?? m.riddle?.question;
  const acceptedAnswers = normalizeAnswers(m.riddle?.acceptedAnswers, m.riddle?.caseSensitive);
  const radius = m.type === 'location' ? (m.proximityRadiusM ?? 50) : m.proximityRadiusM;

  return {
    story: storyId,
    order: m.order ?? idx,
    id: m.id,
    title: m.title,
    description: m.description,
    type: m.type,
    media: m.media,
    location: m.location,
    proximityRadiusM: radius,
    accessibility: m.accessibility,
    riddle: m.riddle
      ? {
          prompt,
          acceptedAnswers,
          caseSensitive: m.riddle.caseSensitive ?? false
        }
      : undefined,
    clues: m.clues,
    choices: m.choices,
    options: m.options,
    timeLimitSec: m.timeLimitSec,
    points: m.points,
    hintPenalty: m.hintPenalty,
    requiredToComplete: m.requiredToComplete ?? true
  };
}

async function importOne(filePath: string) {
  const raw = fs.readFileSync(filePath, 'utf8');
  const json = StoryJson.parse(JSON.parse(raw));

  const slug = (json.slug?.trim() || slugify(json.title));
  const storyData: Partial<StoryInput> & Record<string, any> = {
    title: json.title,
    slug,
    summary: json.summary,
    theme: json.theme,
    neighborhood: json.neighborhood,
    coverImageUrl: json.coverImageUrl,
    durationMinutes: json.durationMinutes,
    estimatedMinutes: json.estimatedMinutes,
    estimatedSteps: json.estimatedSteps ?? json.milestones.length,
    difficulty: json.difficulty,
    language: json.language ?? 'es',
    createdBy: json.createdBy ?? 'Rutalia Team',
    updatedAt: json.updatedAt ?? new Date(),
    version: json.version ?? '1.0',
    requires: json.requires ?? { gps: false, camera: false, voice: false },
    analytics: json.analytics ?? { category: 'educational', kpiTags: [] },
    tags: json.tags,
    status: json.status ?? 'draft',
    publishedAt: json.status === 'published'
      ? (json.publishedAt ?? new Date())
      : json.publishedAt,
    startLocation: json.startLocation,
    center: json.center
  };

  const existing = await Story.findOne({ slug });

  if (!existing) {
    console.log(`➕ Creando historia: ${slug}`);
    if (dryRun) return;

    const story = await Story.create(storyData);

    if (json.milestones.length) {
      const docs = json.milestones.map((m, idx) => milestoneToDoc(m, idx, story._id));
      await Milestone.insertMany(docs);
      story.milestoneCount = docs.length;
      await story.save();
    }
    return;
  }

  console.log(`ℹ️ Historia ya existe: ${slug} (mode=${mode})`);

  if (mode === 'skip') return;

  if (!dryRun) {
    Object.assign(existing, storyData);
    await existing.save();
  }

  if (json.milestones.length) {
    if (mode === 'replace') {
      console.log(`  ↻ Reemplazando milestones…`);
      if (!dryRun) await Milestone.deleteMany({ story: existing._id });
      const docs = json.milestones.map((m, idx) => milestoneToDoc(m, idx, existing._id));
      if (!dryRun) {
        await Milestone.insertMany(docs);
        existing.milestoneCount = docs.length;
        await existing.save();
      }
    } else if (mode === 'append') {
      console.log(`  ➕ Añadiendo milestones al final…`);
      const count = await Milestone.countDocuments({ story: existing._id });
      const docs = json.milestones.map((m, idx) => milestoneToDoc(m, count + idx, existing._id));
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
