/**
 * Lokal Docker DB'deki masal içeriklerini production (Neon/Vercel) DB'ye senkronlar.
 *
 * - Eşleştirme SLUG ile yapılır (id'ler iki DB'de farklı olabilir).
 * - Yalnız lokal `updatedAt` > prod `updatedAt` olan kayıtlar güncellenir → idempotent,
 *   her rewrite/onarım turundan sonra güvenle tekrar çalıştırılabilir.
 * - Sadece içerik alanları yazılır; prod'a özgü `viewCount` KORUNUR.
 * - Masal eklemez/silmez; prod'da karşılığı olmayan slug'ları raporlar.
 *
 * Kullanım:
 *   npm run stories:sync              # lokal → prod senkron
 *   DRY_RUN=1 npm run stories:sync    # yazmadan ne yapılacağını gösterir
 *
 * Prod bağlantısı: PROD_DATABASE_URL env > .env.production.local içindeki DATABASE_URL.
 * (.env.production.local, `npx vercel env pull .env.production.local` ile indirilir.)
 */
import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";

const DRY_RUN = process.env.DRY_RUN === "1";

function readEnvVar(file: string, key: string): string | undefined {
  const p = path.join(__dirname, "..", file);
  if (!fs.existsSync(p)) return undefined;
  const m = fs.readFileSync(p, "utf8").match(new RegExp(`^${key}=["']?([^"'\\r\\n]+)`, "m"));
  return m?.[1]?.trim();
}

const LOCAL_URL = process.env.DATABASE_URL || readEnvVar(".env", "DATABASE_URL");
const PROD_URL  = process.env.PROD_DATABASE_URL || readEnvVar(".env.production.local", "DATABASE_URL");

if (!LOCAL_URL) { console.error("❌ Lokal DATABASE_URL bulunamadı (.env)."); process.exit(1); }
if (!PROD_URL)  {
  console.error("❌ Prod DATABASE_URL bulunamadı. Önce: npx vercel env pull .env.production.local");
  process.exit(1);
}
if (PROD_URL === LOCAL_URL) { console.error("❌ Prod URL lokal URL ile aynı — senkron anlamsız."); process.exit(1); }

const local = new PrismaClient({ datasources: { db: { url: LOCAL_URL } } });
const prod  = new PrismaClient({ datasources: { db: { url: PROD_URL } } });

async function main() {
  console.log(`\n🔄 Lokal → Prod masal senkronu${DRY_RUN ? " (DRY RUN — yazılmayacak)" : ""}`);

  const [localStories, prodStories] = await Promise.all([
    local.story.findMany({
      select: {
        slug: true, title: true, content: true, excerpt: true, wordCount: true,
        readingMinutes: true, imageQuery: true, imageUrl: true, updatedAt: true,
      },
    }),
    prod.story.findMany({ select: { slug: true, updatedAt: true } }),
  ]);

  const prodBySlug = new Map(prodStories.map(s => [s.slug, s.updatedAt]));
  console.log(`   Lokal: ${localStories.length} masal | Prod: ${prodStories.length} masal`);

  const missing: string[] = [];
  let updated = 0, skipped = 0, failed = 0;

  for (const s of localStories) {
    const prodUpdatedAt = prodBySlug.get(s.slug);
    if (prodUpdatedAt === undefined) { missing.push(s.slug); continue; }
    if (s.updatedAt <= prodUpdatedAt) { skipped++; continue; }

    if (DRY_RUN) {
      console.log(`   → güncellenecek: ${s.slug} (lokal ${s.updatedAt.toISOString()} > prod ${prodUpdatedAt.toISOString()})`);
      updated++;
      continue;
    }
    try {
      await prod.story.update({
        where: { slug: s.slug },
        data: {
          title: s.title,
          content: s.content,
          excerpt: s.excerpt,
          wordCount: s.wordCount,
          readingMinutes: s.readingMinutes,
          imageQuery: s.imageQuery,
          imageUrl: s.imageUrl,
          // updatedAt @updatedAt ile otomatik şimdiye çekilir → bir sonraki turda atlanır
        },
      });
      updated++;
      process.stdout.write(`\r   ✓ ${updated} güncellendi | ${skipped} güncel | ${failed} hata   `);
    } catch (err) {
      failed++;
      console.error(`\n   ✗ ${s.slug}: ${err instanceof Error ? err.message.slice(0, 120) : err}`);
    }
  }

  console.log(`\n\n📊 Sonuç: ${updated} ${DRY_RUN ? "güncellenecek" : "güncellendi"}, ${skipped} zaten güncel, ${failed} hata.`);
  if (missing.length > 0) {
    console.log(`⚠️  Prod'da karşılığı olmayan ${missing.length} slug (eklenmedi): ${missing.slice(0, 10).join(", ")}${missing.length > 10 ? " …" : ""}`);
  }
}

main()
  .catch(err => { console.error(err); process.exitCode = 1; })
  .finally(async () => { await local.$disconnect(); await prod.$disconnect(); });
