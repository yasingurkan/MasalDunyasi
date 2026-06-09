/**
 * İçeriğin başında, başlığın AYRI BİR SATIR olarak tekrarlandığı durumları temizler.
 * Sadece `başlık\n` kalıbını siler; başlıkla başlayan gerçek nesre (ör. "Kasaba sönmekteydi") dokunmaz.
 * Çalıştır: npx ts-node --project tsconfig.seed.json scripts/strip-title-line.ts
 */
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

function calcWordCount(t: string) { return t.trim().split(/\s+/).length; }
function calcReadingMinutes(t: string) { return Math.max(1, Math.ceil(calcWordCount(t) / 100)); }
function getExcerpt(c: string): string {
  const sentences = c.split(/(?<=[.!?])\s+/);
  let ex = "";
  for (const s of sentences) { if ((ex + s).length > 220) break; ex += (ex ? " " : "") + s; }
  return ex || c.slice(0, 220) + "…";
}

async function main() {
  const stories = await prisma.story.findMany({ select: { id: true, title: true, content: true } });
  let fixed = 0;
  for (const s of stories) {
    const t = s.title.trim();
    const firstLine = s.content.split(/\r?\n/)[0].trim();
    // Yalnız ilk satır TAM olarak başlığa eşitse (ayrı satır), sıyır
    if (firstLine.toLowerCase() !== t.toLowerCase()) continue;
    const newContent = s.content.replace(/^\s*[^\n]*\r?\n\r?\n?/, "").trim();
    if (newContent.length < 100 || newContent === s.content.trim()) continue;
    await prisma.story.update({
      where: { id: s.id },
      data: {
        content: newContent,
        excerpt: getExcerpt(newContent),
        wordCount: calcWordCount(newContent),
        readingMinutes: calcReadingMinutes(newContent),
        updatedAt: new Date(),
      },
    });
    console.log(`✅ #${s.id} "${t}" — başlık satırı sıyrıldı`);
    fixed++;
  }
  console.log(`\n📊 ${fixed} masalda başlık satırı temizlendi.`);
}
main().catch(console.error).finally(() => prisma.$disconnect());
