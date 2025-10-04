import 'dotenv/config';
import fs from 'node:fs';
import path from 'node:path';
import { connectDB } from '../config/db.js';
import { Story } from '../models/Story.js';
import { Milestone } from '../models/Milestone.js';

const outDir = process.argv[2] || 'exports';

async function run() {
  await connectDB();
  fs.mkdirSync(outDir, { recursive: true });

  const stories = await Story.find().lean();
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
      tags: s.tags,
      status: s.status,
      publishedAt: s.publishedAt,
      startLocation: s.startLocation,
      milestones: ms.map(m => ({
        order: m.order,
        type: m.type,
        title: m.title,
        description: m.description,
        media: m.media,
        location: m.location,
        proximityRadiusM: m.proximityRadiusM,
        riddle: m.riddle,
        clues: m.clues,
        timeLimitSec: m.timeLimitSec,
        points: m.points,
        hintPenalty: m.hintPenalty,
        requiredToComplete: m.requiredToComplete
      }))
    };

    const file = path.join(outDir, `${s.slug}.json`);
    fs.writeFileSync(file, JSON.stringify(dump, null, 2), 'utf8');
    console.log('⬇️  Exportado', file);
  }
  console.log('✅ Export completo');
  process.exit(0);
}

run().catch(e => { console.error(e); process.exit(1); });
