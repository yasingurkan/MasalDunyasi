/**
 * Yabancı dil karakter içeren masalları tespit edip Groq ile yeniden üretir.
 * Sadece veritabanında yabancı karakter tespit edilen masalları günceller.
 */

import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";

const envPath = path.join(__dirname, "../.env");
const envContent = fs.existsSync(envPath) ? fs.readFileSync(envPath, "utf8") : "";
const GROQ_API_KEY = (envContent.match(/GROQ_API_KEY=(.+)/)?.[1]?.trim() || process.env.GROQ_API_KEY || "").trim();

if (!GROQ_API_KEY) { console.error("GROQ_API_KEY bulunamadı."); process.exit(1); }

const prisma = new PrismaClient();
const MODEL    = "llama-3.3-70b-versatile";
const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const DELAY_MS = 9000;

const BANNED = ["intihar","cinayet","öldür","şiddet","kavga","savaş","öl","katil","tecavüz","uyuşturucu","alkol","sigara"];

// Yabancı karakter regex (Çince, Japonca, Korece, Kiril, Arapça, vb.)
const FOREIGN_RE = /[一-鿿぀-ヿ가-힯Ѐ-ӿ؀-ۿ]/;

function calcWordCount(t: string) { return t.trim().split(/\s+/).length; }
function calcReadingMinutes(t: string) { return Math.max(1, Math.ceil(calcWordCount(t) / 100)); }

function slugify(t: string) {
  const m: Record<string,string> = {ç:"c",Ç:"c",ğ:"g",Ğ:"g",ı:"i",İ:"i",ö:"o",Ö:"o",ş:"s",Ş:"s",ü:"u",Ü:"u"};
  return t.replace(/[çÇğĞıİöÖşŞüÜ]/g, c=>m[c]??c).toLowerCase()
    .replace(/[^a-z0-9\s-]/g,"").replace(/\s+/g,"-").replace(/-+/g,"-").trim();
}

function getExcerpt(c: string) {
  const ss = c.split(/(?<=[.!?])\s+/);
  let e = "";
  for (const s of ss) { if ((e+s).length > 220) break; e += (e?" ":"")+s; }
  return e || c.slice(0,220)+"…";
}

function isSafe(text: string): boolean {
  const lower = text.toLowerCase();
  return !BANNED.some(w => lower.includes(w));
}

function hasForeignChars(text: string): boolean {
  return FOREIGN_RE.test(text);
}

function sleep(ms: number) { return new Promise(r => setTimeout(r, ms)); }

async function callGroq(system: string, user: string, retries = 4): Promise<string> {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(GROQ_URL, {
        method: "POST",
        headers: { "Authorization": `Bearer ${GROQ_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model: MODEL,
          messages: [{ role:"system", content:system }, { role:"user", content:user }],
          max_tokens: 1800,
          temperature: 0.75,
        }),
        signal: AbortSignal.timeout(90_000),
      });

      if (res.status === 429) {
        const wait = Math.min(120_000, 20_000 * Math.pow(1.5, attempt));
        console.log(`  ⏳ Rate limit — ${Math.round(wait/1000)}s bekleniyor... (deneme ${attempt+1})`);
        await sleep(wait);
        continue;
      }
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json() as { choices?:{message?:{content?:string}}[]; error?:{message:string} };
      if (data.error?.message?.toLowerCase().includes("rate")) { await sleep(30_000); continue; }
      if (data.error) throw new Error(data.error.message);
      return data.choices?.[0]?.message?.content?.trim() ?? "";
    } catch (err) {
      if (attempt < retries) { await sleep(10_000); }
      else throw err;
    }
  }
  return "";
}

function sysPrompt(ageMin: number): string {
  const safety = `ÖNEMLİ:
1. Sadece Türkçe yaz. Hiçbir yabancı dil kelimesi, karakter veya harf kullanma.
2. İçerik çocuklara %100 uygun olmalı. Şiddet, korku, ölüm, ağlama yasak.
3. Her şey pozitif, umutlu, mutlu bitişle.`;

  if (ageMin <= 2) return `Sen sevecen bir Türk bebek masalı yazarısın. ${safety}
Çok kısa, yalın Türkçe cümleler. Tekrar ve ritim. Sevimli hayvanlar. Mutlu son.`;

  if (ageMin <= 4) return `Sen yetenekli bir Türk çocuk masalı yazarısın. ${safety}
Basit ama tam Türkçe cümleler. Sevimli karakterler. Kısa diyaloglar. Mutlu son.`;

  if (ageMin <= 6) return `Sen yetenekli bir Türk çocuk masalı yazarısın. ${safety}
Akıcı Türkçe. Mantıklı olay örgüsü. Dostluk, yardım, dürüstlük. Mutlu son.`;

  if (ageMin <= 8) return `Sen yetenekli bir Türk halk masalı yazarısın. ${safety}
Zengin Türkçe betimlemeler. Macera ve keşif. Ahlaki ders ama baskı yapmadan. Mutlu son.`;

  if (ageMin <= 10) return `Sen yetenekli bir Türk masalı yazarısın. ${safety}
Güçlü karakter gelişimi. Cesaret, adalet, bilgelik. Türk kültüründen ilham. Mutlu son.`;

  return `Sen yetenekli bir Türk masalı yazarısın. ${safety}
Edebi Türkçe dil. Karmaşık ama pozitif olay örgüsü. Büyüme ve keşif temaları. Umutlu son.`;
}

type StoryRow = {
  id: number;
  title: string;
  categoryId: number;
  tags: string[];
  characters: string[];
  imageQuery: string;
  source: string;
  sourceType: string;
  ageMin: number;
  ageMax: number;
  category: { ageMin: number; ageMax: number; name: string } | null;
};

async function regenerateStory(story: StoryRow): Promise<boolean> {
  const ageMin = story.category?.ageMin ?? story.ageMin;
  const minWords = ageMin <= 2 ? 150 : ageMin <= 5 ? 300 : ageMin <= 8 ? 500 : 600;

  const prompt = `Şu bilgilere göre TAMAMEN TÜRKÇE bir çocuk masalı yaz. Hiçbir yabancı kelime veya karakter kullanma:

BAŞLIK: (İlk satırda güzel bir Türkçe başlık yaz, sonra boş satır bırak)
KAHRAMAN: ${story.characters[0] ?? "Küçük Kahraman"}
MEKAN: Anadolu'nun güzel bir köyü veya ormanı
KONU: Cesaretini kullanarak zorluğun üstesinden gelmek
DERS: İyilik yapan iyilik bulur

Masal "Bir varmış bir yokmuş" ile başlasın. Mutlu sonla bitsin. En az ${minWords} kelime. SADECE TÜRKÇE.`;

  let content = "";
  for (let attempt = 0; attempt < 3; attempt++) {
    content = await callGroq(sysPrompt(ageMin), prompt);

    if (!content || calcWordCount(content) < 80) continue;
    if (!isSafe(content)) { console.log(`    🚫 Uygunsuz içerik, yeniden deniyor...`); continue; }
    if (hasForeignChars(content)) { console.log(`    🔄 Hâlâ yabancı karakter var, yeniden deniyor...`); continue; }

    break;
  }

  if (!content || hasForeignChars(content) || calcWordCount(content) < 80) return false;

  const lines = content.split("\n").map(l => l.trim()).filter(Boolean);
  let title = lines[0]?.replace(/\*+|#+|^[-–—:]+\s*/g, "").replace(/\s+/g, " ").trim() ?? "";
  if (!title || title.length < 3 || title.length > 100 || hasForeignChars(title)) {
    title = story.title; // orijinal başlığı koru
  }

  // Başlık satırını içerikten çıkar
  const bodyLines = lines.slice(1);
  const bodyContent = bodyLines.join("\n\n");
  if (!bodyContent || calcWordCount(bodyContent) < 50) return false;

  const wordCount = calcWordCount(bodyContent);
  const slug = slugify(title);

  // Slug çakışmasını önle
  const existing = await prisma.story.findUnique({ where: { slug } });
  const finalSlug = (existing && existing.id !== story.id) ? `${slug}-${story.id}` : slug;

  await prisma.story.update({
    where: { id: story.id },
    data: {
      title,
      slug: finalSlug,
      content: bodyContent,
      excerpt: getExcerpt(bodyContent),
      wordCount,
      readingMinutes: calcReadingMinutes(bodyContent),
      updatedAt: new Date(),
    },
  });

  return true;
}

async function main() {
  // Regex ile tara (Prisma contains ile tüm unicode range'i tutturamayız)
  const allStories = await prisma.story.findMany({
    select: { id: true, content: true, title: true, categoryId: true, tags: true,
              characters: true, imageQuery: true, source: true, sourceType: true,
              ageMin: true, ageMax: true, category: { select: { ageMin: true, ageMax: true, name: true } } },
  });

  const problematic = allStories.filter(s =>
    hasForeignChars(s.content) || hasForeignChars(s.title)
  );

  console.log(`\n🔍 Yabancı karakter içeren ${problematic.length} masal bulundu.\n`);

  let fixed = 0;
  let failed = 0;

  for (let i = 0; i < problematic.length; i++) {
    const story = problematic[i];
    process.stdout.write(`  [${i+1}/${problematic.length}] ID:${story.id} "${story.title.slice(0,40)}" — `);

    try {
      const ok = await regenerateStory(story as StoryRow);
      if (ok) {
        console.log(`✅ Düzeltildi`);
        fixed++;
      } else {
        console.log(`❌ Başarısız (içerik hâlâ sorunlu)`);
        failed++;
      }
    } catch (err) {
      console.log(`❌ Hata: ${err instanceof Error ? err.message : String(err)}`);
      failed++;
    }

    if (i < problematic.length - 1) await sleep(DELAY_MS);
  }

  console.log(`\n📊 Sonuç: ${fixed} düzeltildi, ${failed} başarısız.`);

  // Kalan sorunlu masalları raporla
  if (failed > 0) {
    const remaining = await prisma.story.findMany({
      where: { id: { in: problematic.map(s => s.id) } },
      select: { id: true, title: true },
    });
    const stillBad = remaining.filter(s => hasForeignChars(s.title));
    if (stillBad.length > 0) {
      console.log(`\n⚠️ Hâlâ sorunlu: ${stillBad.map(s => `#${s.id}`).join(", ")}`);
    }
  }

  await prisma.$disconnect();
}

main().catch(err => { console.error(err); process.exit(1); });
