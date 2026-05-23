/**
 * Yabancı dil kelimelerini Türkçe karşılıklarıyla değiştirir.
 * Find-and-replace yaklaşımı — LLM kullanmadan hızlı çözüm.
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const FOREIGN_RE = /[一-鿿぀-ヿ가-힯Ѐ-ӿ؀-ۿ]/;

// Sıralı sözlük: önce uzun kelimeler, sonra kısalar
const REPLACEMENTS: Array<[string, string]> = [
  // Mixed (yabancı + Türkçe ek) — önce bunları çöz
  ["словаlarını", "sözlerini"],
  ["стояyordu", "duruyordu"],
  ["答ladılar", "yanıtladılar"],
  ["力量dır", "güçtür"],
  ["必요ğun", "gerekliliğin"],
  ["必oyun", "oyun"],
  ["天de", "gökyüzünde"],
  ["yağmur开始", "yağmur başladı"],
  ["ayıcık,一起", "ayıcık, birlikte"],
  ["Birden,轻", "Birden, hafifçe"],
  ["Çобан", "Çoban"],
  ["yеди", "yedi"],

  // Çince 2-karakterli
  ["永远", "sonsuza dek"],
  ["永遠", "sonsuza dek"],
  ["必要", "gerekli"],
  ["未来", "gelecek"],
  ["力量", "güç"],
  ["开始", "başladı"],
  ["一起", "birlikte"],

  // Çince 1-karakterli (kalan)
  ["永", "sonsuz"],
  ["必", ""],
  ["天", "gök"],
  ["轻", "hafif"],
  ["答", "yanıt"],
  ["中", "içinde"],
  ["高", "yüksek"],

  // Arapça
  ["معروف", "tanınmış"],

  // Rusça/Kiril
  ["никто", "kimse"],
  ["иногда", "bazen"],
  ["слова", "söz"],
  ["стоя", "durarak"],

  // Vietnamca
  ["giữa", "ortasında"],
  ["thiếu", "eksik"],

  // İngilizce
  ["existed", "vardı"],
];

function applyReplacements(text: string): string {
  let result = text;
  for (const [from, to] of REPLACEMENTS) {
    if (result.includes(from)) {
      result = result.split(from).join(to);
    }
  }
  // Çift boşluk temizleme
  result = result.replace(/  +/g, " ");
  // Boşluk + noktalama düzeltme
  result = result.replace(/ ([,.!?;:])/g, "$1");
  return result;
}

async function main() {
  const stories = await prisma.story.findMany({
    select: { id: true, title: true, content: true, excerpt: true },
  });

  const problematic = stories.filter(s =>
    FOREIGN_RE.test(s.content) || FOREIGN_RE.test(s.title) || FOREIGN_RE.test(s.excerpt ?? "")
  );

  console.log(`\n🔍 ${problematic.length} masalda yabancı karakter bulundu.\n`);

  let fixed = 0;
  let stillBad: number[] = [];

  for (const story of problematic) {
    const newTitle = applyReplacements(story.title);
    const newContent = applyReplacements(story.content);
    const newExcerpt = applyReplacements(story.excerpt ?? "");

    const titleStillBad = FOREIGN_RE.test(newTitle);
    const contentStillBad = FOREIGN_RE.test(newContent);
    const excerptStillBad = FOREIGN_RE.test(newExcerpt);

    if (titleStillBad || contentStillBad || excerptStillBad) {
      stillBad.push(story.id);
      // Yine de kısmi düzeltmeyi kaydet
    }

    if (
      newTitle !== story.title ||
      newContent !== story.content ||
      newExcerpt !== (story.excerpt ?? "")
    ) {
      await prisma.story.update({
        where: { id: story.id },
        data: { title: newTitle, content: newContent, excerpt: newExcerpt },
      });
      fixed++;
      console.log(`  ✅ ID:${story.id} "${story.title.slice(0,50)}" düzeltildi`);
    }
  }

  console.log(`\n📊 Sonuç: ${fixed} masal güncellendi.`);

  if (stillBad.length > 0) {
    console.log(`\n⚠️ Hâlâ yabancı karakter içeren ${stillBad.length} masal: ${stillBad.join(", ")}`);

    // Detayını göster
    const detail = await prisma.story.findMany({
      where: { id: { in: stillBad } },
      select: { id: true, title: true, content: true },
    });

    for (const s of detail) {
      const matches = (s.content + " " + s.title).match(/\S*[一-鿿぀-ヿ가-힯Ѐ-ӿ؀-ۿ]\S*/g);
      console.log(`  ID:${s.id} → ${matches?.join(" | ") ?? "?"}`);
    }
  } else {
    console.log(`\n✅ Tüm yabancı karakterler temizlendi!`);
  }

  await prisma.$disconnect();
}

main().catch(err => { console.error(err); process.exit(1); });
