/**
 * Masal veri bütünlüğü denetimi — DB'ye DOKUNMAZ, sadece raporlar.
 * Çalıştır: npx ts-node --project tsconfig.seed.json scripts/audit-stories.ts
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Latin dışı / yaygın yabancı dil karakter blokları (Türkçe harfler hariç)
const FOREIGN_RE =
  /[Ѐ-ӿ؀-ۿ一-鿿぀-ヿ฀-๿]/;

// Vietnamca'ya özgü işaretler — â/î/û Türkçe inceltme olduğu için DAHİL DEĞİL
const VIET_RE = /[ăđơưĂĐƠƯạảấầẩẫậắằẳẵặẹẻẽếềểễệỉịọỏốồổỗộớờởỡợụủứừửữựỳỵỷỹ]/;

function endsBadly(c: string): boolean {
  const t = c.trimEnd();
  if (!t) return true;
  const last = t[t.length - 1];
  // Düzgün masal nokta/ünlem/soru/tırnak ile biter
  return !/[.!?»"'…)]/.test(last);
}

async function main() {
  const stories = await prisma.story.findMany({
    select: {
      id: true, slug: true, title: true, content: true, excerpt: true,
      wordCount: true, imageQuery: true, characters: true,
      category: { select: { ageMin: true, ageMax: true, slug: true } },
    },
    orderBy: { id: "asc" },
  });

  const issues = {
    foreign: [] as number[],
    viet: [] as number[],
    tooShort: [] as number[],
    truncated: [] as number[],
    emptyContent: [] as number[],
    wordCountMismatch: [] as number[],
    noImageQuery: [] as number[],
    dupSentences: [] as number[],
    titleInContent: [] as number[],
  };

  for (const s of stories) {
    const c = s.content ?? "";
    if (!c.trim()) { issues.emptyContent.push(s.id); continue; }
    if (FOREIGN_RE.test(c) || FOREIGN_RE.test(s.title)) issues.foreign.push(s.id);
    if (VIET_RE.test(c)) issues.viet.push(s.id);

    const words = c.trim().split(/\s+/).length;
    if (words < 60) issues.tooShort.push(s.id);
    if (endsBadly(c)) issues.truncated.push(s.id);
    if (s.wordCount && Math.abs(s.wordCount - words) > Math.max(20, words * 0.25))
      issues.wordCountMismatch.push(s.id);
    if (!s.imageQuery || !s.imageQuery.trim()) issues.noImageQuery.push(s.id);

    // Ardışık tekrarlanan cümle (kopuk üretim işareti)
    const sents = c.split(/(?<=[.!?])\s+/).map(x => x.trim()).filter(Boolean);
    for (let i = 1; i < sents.length; i++) {
      if (sents[i].length > 15 && sents[i] === sents[i - 1]) { issues.dupSentences.push(s.id); break; }
    }
    // İçerik başlıkla başlıyorsa (model başlığı metne karıştırmış)
    if (c.trimStart().toLowerCase().startsWith(s.title.trim().toLowerCase()))
      issues.titleInContent.push(s.id);
  }

  console.log(`\n📊 TOPLAM MASAL: ${stories.length}\n${"=".repeat(50)}`);
  const report = (label: string, arr: number[]) => {
    console.log(`${arr.length === 0 ? "✅" : "⚠️ "} ${label}: ${arr.length}` +
      (arr.length ? `  → ID: ${arr.slice(0, 25).join(", ")}${arr.length > 25 ? " …" : ""}` : ""));
  };
  report("Boş içerik", issues.emptyContent);
  report("Yabancı karakter (Çince/Kiril/Arapça/…)", issues.foreign);
  report("Vietnamca/diakritik işaret", issues.viet);
  report("Çok kısa (<60 kelime)", issues.tooShort);
  report("Yarıda kesik (cümle bitmemiş)", issues.truncated);
  report("wordCount tutarsız (±%25)", issues.wordCountMismatch);
  report("imageQuery boş", issues.noImageQuery);
  report("Ardışık tekrar cümle", issues.dupSentences);
  report("İçerik başlıkla başlıyor", issues.titleInContent);

  const totalBad = new Set([
    ...issues.foreign, ...issues.viet, ...issues.tooShort,
    ...issues.truncated, ...issues.emptyContent, ...issues.dupSentences,
  ]).size;
  console.log(`${"=".repeat(50)}\n🔴 İçerik sorunu olan benzersiz masal: ${totalBad}`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
