import { PrismaClient } from "@prisma/client";
import { categories } from "./categories";
import { age1Stories } from "./stories/age-1";
import { age2Stories } from "./stories/age-2";
import { age3Stories } from "./stories/age-3";
import { age4Stories } from "./stories/age-4";
import { age5Stories } from "./stories/age-5";
import { age6Stories } from "./stories/age-6";
import { age7Stories } from "./stories/age-7";
import { age8Stories } from "./stories/age-8";
import { age9Stories } from "./stories/age-9";
import { age10Stories } from "./stories/age-10";
import { age11Stories } from "./stories/age-11";
import { age12Stories } from "./stories/age-12";

const prisma = new PrismaClient();

function calcWordCount(content: string): number {
  return content.trim().split(/\s+/).length;
}

function calcReadingMinutes(content: string): number {
  // 100 WPM = sesli okuma hızı (ebeveyn çocuğa yavaş ve ifadeli okur)
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
  console.log("🌙 Masal Dünyası seed başlıyor...");

  // Kategorileri oluştur
  console.log("📂 Kategoriler oluşturuluyor...");
  const categoryMap: Record<string, number> = {};
  for (const cat of categories) {
    const created = await prisma.ageCategory.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    });
    categoryMap[cat.slug] = created.id;
    console.log(`  ✓ ${cat.name} (${cat.label})`);
  }

  // Tüm yaş gruplarının masalları
  const allGroups = [
    { slug: "1-yas", stories: age1Stories },
    { slug: "2-yas", stories: age2Stories },
    { slug: "3-yas", stories: age3Stories },
    { slug: "4-yas", stories: age4Stories },
    { slug: "5-yas", stories: age5Stories },
    { slug: "6-yas", stories: age6Stories },
    { slug: "7-yas", stories: age7Stories },
    { slug: "8-yas", stories: age8Stories },
    { slug: "9-yas", stories: age9Stories },
    { slug: "10-yas", stories: age10Stories },
    { slug: "11-yas", stories: age11Stories },
    { slug: "12-yas", stories: age12Stories },
  ];

  let totalInserted = 0;
  for (const group of allGroups) {
    const categoryId = categoryMap[group.slug];
    if (!categoryId) {
      console.error(`  ✗ Kategori bulunamadı: ${group.slug}`);
      continue;
    }
    console.log(`\n📖 ${group.slug}: ${group.stories.length} masal işleniyor...`);
    let inserted = 0;
    for (const story of group.stories) {
      const wordCount = calcWordCount(story.content);
      const readingMinutes = calcReadingMinutes(story.content);
      const excerpt = getExcerpt(story.content);
      await prisma.story.upsert({
        where: { slug: story.slug },
        update: {
          title: story.title,
          content: story.content,
          excerpt,
          ageMin: story.ageMin,
          ageMax: story.ageMax,
          readingMinutes,
          wordCount,
          source: story.source,
          sourceType: story.sourceType ?? "generated",
          characters: story.characters,
          tags: story.tags,
          imageQuery: story.imageQuery,
          featured: story.featured ?? false,
          uploadedAt: story.uploadedAt,
          categoryId,
        },
        create: {
          title: story.title,
          slug: story.slug,
          content: story.content,
          excerpt,
          ageMin: story.ageMin,
          ageMax: story.ageMax,
          readingMinutes,
          wordCount,
          source: story.source,
          sourceType: story.sourceType ?? "generated",
          characters: story.characters,
          tags: story.tags,
          imageQuery: story.imageQuery,
          featured: story.featured ?? false,
          uploadedAt: story.uploadedAt,
          categoryId,
        },
      });
      inserted++;
    }
    console.log(`  ✓ ${inserted} masal eklendi`);
    totalInserted += inserted;
  }

  const storyCount = await prisma.story.count();
  const catCount = await prisma.ageCategory.count();
  console.log(`\n🎉 Seed tamamlandı!`);
  console.log(`   Kategoriler: ${catCount}`);
  console.log(`   Masallar: ${storyCount} (${totalInserted} işlendi)`);
}

main()
  .catch((e) => {
    console.error("Seed hatası:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
