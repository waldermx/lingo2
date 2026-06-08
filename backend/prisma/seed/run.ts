import { PrismaClient } from '@prisma/client';
import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { ACHIEVEMENT_CATALOGUE } from '../../src/domain/entities/Gamification.js';

const prisma = new PrismaClient();

// ─── JSON shape ───────────────────────────────────────────────────────────────

interface JsonTranscriptions {
  pinyin: string;
  numeric: string;
  wadegiles: string;
  bopomofo: string;
  romatzyh: string;
}

interface JsonForm {
  traditional: string;
  transcriptions: JsonTranscriptions;
  meanings: string[];
  classifiers: string[];
}

interface JsonEntry {
  simplified: string;
  radical: string;
  frequency: number;
  pos: string[];
  forms: JsonForm[];
}

// ─── Seed helpers ─────────────────────────────────────────────────────────────

async function seedAchievements(): Promise<void> {
  console.log('Seeding achievements...');
  for (const ach of ACHIEVEMENT_CATALOGUE) {
    await prisma.achievement.upsert({
      where: { id: ach.id },
      update: {
        titleEs: ach.titleEs,
        titleEn: ach.titleEn,
        descriptionEs: ach.descriptionEs,
        descriptionEn: ach.descriptionEn,
        xpReward: ach.xpReward,
      },
      create: {
        id: ach.id,
        slug: ach.slug,
        titleEs: ach.titleEs,
        titleEn: ach.titleEn,
        descriptionEs: ach.descriptionEs,
        descriptionEn: ach.descriptionEn,
        type: ach.type,
        xpReward: ach.xpReward,
        iconEmoji: ach.iconEmoji,
      },
    });
  }
  console.log(`  ✓ ${ACHIEVEMENT_CATALOGUE.length} achievements upserted`);
}

async function seedCharacters(): Promise<void> {
  const __dirname = dirname(fileURLToPath(import.meta.url));
  // From backend/prisma/seed/ → repo root → data/
  const dataDir = join(__dirname, '..', '..', '..', 'data');

  for (let hskLevel = 1; hskLevel <= 4; hskLevel++) {
    const filePath = join(dataDir, `${hskLevel}.json`);
    const entries: JsonEntry[] = JSON.parse(readFileSync(filePath, 'utf-8'));

    console.log(`Seeding HSK ${hskLevel}: ${entries.length} entries...`);
    let upserted = 0;

    for (const entry of entries) {
      const form = entry.forms[0];
      if (!form) continue;

      const pinyin = form.transcriptions.pinyin;
      // Join multiple meanings with "; " to produce a single definition string.
      const definition = form.meanings.join('; ');

      await prisma.$transaction(async (tx) => {
        const character = await tx.character.upsert({
          where: { character: entry.simplified },
          update: {
            pinyin,
            hskLevel,
            radical: entry.radical,
            frequencyRank: entry.frequency,
          },
          create: {
            character: entry.simplified,
            pinyin,
            hskLevel,
            // strokeCount is not present in source data; defaults to 1.
            // Update via a dedicated stroke-count enrichment pass if needed.
            strokeCount: 1,
            radical: entry.radical,
            frequencyRank: entry.frequency,
          },
        });

        for (const locale of ['en', 'es'] as const) {
          await tx.characterTranslation.upsert({
            where: {
              characterId_locale: { characterId: character.id, locale },
            },
            update: { definition },
            create: { characterId: character.id, locale, definition },
          });
        }
      });

      upserted++;
    }

    console.log(`  ✓ HSK ${hskLevel}: ${upserted} characters upserted`);
  }
}

// ─── Entry point ──────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  await seedAchievements();
  await seedCharacters();
  console.log('Seed complete.');
}

main()
  .catch((err) => {
    console.error('Seed failed:', err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
