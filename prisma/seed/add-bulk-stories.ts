/**
 * Bulk masal ekleme scripti
 * Her kategori ≥100 masala ulaşana kadar yeni masallar üretip DB'ye ekler.
 */

import { PrismaClient } from "@prisma/client";
import { generateStoriesForCategory } from "./bulk-generator/index";

const prisma = new PrismaClient();
const TARGET = 100;

function calcWordCount(content: string): number {
  return content.trim().split(/\s+/).length;
}

function calcReadingMinutes(content: string): number {
  return Math.max(1, Math.ceil(calcWordCount(content) / 100));
}

function getExcerpt(content: string): string {
  const sentences = content.split(/(?<=[.!?])\s+/);
  let excerpt = "";
  for (const s of sentences) {
    if ((excerpt + s).length > 220) break;
    excerpt += (excerpt ? " " : "") + s;
  }
  return excerpt || content.slice(0, 220) + "…";
}

async function main() {
  console.log("\n🌙 Bulk masal ekleme başlıyor...\n");
  console.log(`📌 Hedef: Her kategori ≥${TARGET} masal, her masal ≥10 dk okuma\n`);

  const categories = await prisma.ageCategory.findMany({
    orderBy: { ageMin: "asc" },
  });

  let grandTotal = 0;

  for (const cat of categories) {
    const existing = await prisma.story.findMany({
      where: { categoryId: cat.id },
      select: { slug: true, id: true },
    });

    const currentCount = existing.length;
    const needed = Math.max(0, TARGET - currentCount);

    console.log(`📖 ${cat.name} (${cat.slug}): mevcut=${currentCount}, eklenecek=${needed}`);

    if (needed === 0) {
      console.log(`   ✓ Zaten ${TARGET} masala ulaşıldı, atlanıyor.\n`);
      continue;
    }

    const existingSlugs = new Set(existing.map(s => s.slug));

    const newStories = generateStoriesForCategory({
      categorySlug: cat.slug,
      ageMin: cat.ageMin,
      ageMax: cat.ageMax,
      needed,
      existingSlugs,
    });

    let inserted = 0;
    let warnWords = 0;

    for (const story of newStories) {
      const wordCount      = calcWordCount(story.content);
      const readingMinutes = calcReadingMinutes(story.content);
      const excerpt        = getExcerpt(story.content);

      // Gherkin doğrulama: yaş grubuna uygun minimum okuma süresi
      // 0-2 yaş: ≥8 dk (bebek masalları daha kısa, tekrarlı yapıda)
      // 3+  yaş: ≥10 dk
      const minMinutes = cat.ageMin <= 2 ? 8 : 10;
      if (readingMinutes < minMinutes) {
        warnWords++;
        // Sessizce atla — engine garantisi bozulmuşsa skip
        continue;
      }

      try {
        await prisma.story.upsert({
          where: { slug: story.slug },
          update: {
            title: story.title, content: story.content, excerpt,
            ageMin: story.ageMin, ageMax: story.ageMax,
            readingMinutes, wordCount,
            source: story.source, sourceType: story.sourceType ?? "generated",
            characters: story.characters, tags: story.tags,
            imageQuery: story.imageQuery, featured: story.featured ?? false,
            uploadedAt: story.uploadedAt, categoryId: cat.id,
          },
          create: {
            title: story.title, slug: story.slug, content: story.content, excerpt,
            ageMin: story.ageMin, ageMax: story.ageMax,
            readingMinutes, wordCount,
            source: story.source, sourceType: story.sourceType ?? "generated",
            characters: story.characters, tags: story.tags,
            imageQuery: story.imageQuery, featured: story.featured ?? false,
            uploadedAt: story.uploadedAt, categoryId: cat.id,
          },
        });
        inserted++;
      } catch {
        // slug çakışması olursa geç
      }
    }

    grandTotal += inserted;

    if (warnWords > 0) {
      console.log(`   ⚠  ${warnWords} masal <10 dk olduğu için atlandı`);
    }
    console.log(`   ✅ ${inserted} yeni masal eklendi → toplam: ${currentCount + inserted}\n`);
  }

  // ── Gherkin doğrulama sorguları ───────────────────────────────────────────
  console.log("🔍 Doğrulama sorguları çalıştırılıyor...\n");

  const categoryCounts = await prisma.$queryRaw<{ name: string; count: bigint }[]>`
    SELECT ac.name, COUNT(s.id) as count
    FROM "AgeCategory" ac
    LEFT JOIN "Story" s ON s."categoryId" = ac.id
    GROUP BY ac.id, ac.name
    ORDER BY ac."ageMin"
  `;

  let allOk = true;
  for (const row of categoryCounts) {
    const count = Number(row.count);
    const ok    = count >= TARGET;
    console.log(`  ${ok ? "✓" : "✗"} ${row.name}: ${count} masal`);
    if (!ok) allOk = false;
  }

  const shortStories = await prisma.story.count({
    where: { readingMinutes: { lt: 10 } },
  });

  console.log(`\n  ${shortStories === 0 ? "✓" : "⚠"} <10 dk okuma süreli yeni masal: ${shortStories}`);

  console.log(`\n🎉 Tamamlandı! Toplam ${grandTotal} yeni masal eklendi.`);
  console.log(allOk
    ? "✅ Tüm kategoriler hedefine ulaştı."
    : "⚠  Bazı kategoriler henüz hedefe ulaşmadı — scripti tekrar çalıştır.");
}

main()
  .catch(e => { console.error("Hata:", e); process.exit(1); })
  .finally(() => prisma.$disconnect());
