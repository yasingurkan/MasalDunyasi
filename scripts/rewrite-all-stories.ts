/**
 * Masalları Google Gemini ile yeniden yazar — daha doğal, akıcı ve yaşa uygun Türkçe.
 *
 * Ücretsiz tier (gemini-2.0-flash): 15 RPM, 1500 istek/gün — 1296 masal tek günde biter.
 *
 * Kullanım:
 *   npm run stories:rewrite                       # DB'deki TÜM masalları yeniden yazar
 *   SAMPLE=1 npm run stories:rewrite              # DB'ye DOKUNMADAN birkaç örnek üretip ekrana basar (kalite testi)
 *   ONLY_GENERATED=1 npm run stories:rewrite      # Sadece sourceType=generated olanları yazar
 *   START_OFFSET=200 npm run stories:rewrite      # Yarıda kalmışsa devam et
 *   GEMINI_MODEL=gemini-2.5-flash npm run stories:rewrite   # Farklı model
 */

import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";

const envPath = path.join(__dirname, "../.env");
const envContent = fs.existsSync(envPath) ? fs.readFileSync(envPath, "utf8") : "";
const GEMINI_API_KEY = (
  envContent.match(/GEMINI_API_KEY=["']?([^"'\n]+)/)?.[1]?.trim() ||
  process.env.GEMINI_API_KEY || ""
).trim();
const GROQ_API_KEY = (
  envContent.match(/GROQ_API_KEY=["']?([^"'\n]+)/)?.[1]?.trim() ||
  process.env.GROQ_API_KEY || ""
).trim();

// PROVIDER=gemini (varsayılan) | groq
const PROVIDER = (process.env.PROVIDER || "gemini").toLowerCase();

// Gemini: günlük kota dolunca sıradakine geç (flash → flash-lite). Env ile özelleştirilebilir.
const GEMINI_MODELS = (process.env.GEMINI_MODEL || "gemini-2.5-flash,gemini-2.5-flash-lite")
  .split(",").map(m => m.trim()).filter(Boolean);
let   geminiIdx     = 0;
const geminiUrl     = (model: string) =>
  `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;
const GROQ_MODEL   = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";
const GROQ_URL     = "https://api.groq.com/openai/v1/chat/completions";
const MODEL        = PROVIDER === "groq" ? GROQ_MODEL : GEMINI_MODELS[0];

// İlerleme dosyası — START_OFFSET verilmezse buradan otomatik devam
const PROGRESS_FILE = path.join(__dirname, "../.rewrite-progress.json");
function readProgress(): number {
  try { return JSON.parse(fs.readFileSync(PROGRESS_FILE, "utf8")).offset || 0; } catch { return 0; }
}
function writeProgress(offset: number) {
  try { fs.writeFileSync(PROGRESS_FILE, JSON.stringify({ offset, updatedAt: new Date().toISOString() }, null, 2)); } catch {}
}

// Gemini free tier ~10 RPM → 7s; Groq daha cömert → 4s
const DELAY_MS     = PROVIDER === "groq" ? 4000 : 7000;

if (PROVIDER === "gemini" && !GEMINI_API_KEY) {
  console.error("\n❌ GEMINI_API_KEY bulunamadı (.env).\n"); process.exit(1);
}
if (PROVIDER === "groq" && !GROQ_API_KEY) {
  console.error("\n❌ GROQ_API_KEY bulunamadı (.env).\n"); process.exit(1);
}

class DailyQuotaError extends Error {}
// START_OFFSET verilmişse onu kullan; yoksa ilerleme dosyasından otomatik devam et
const START_OFFSET = process.env.START_OFFSET != null
  ? parseInt(process.env.START_OFFSET, 10)
  : readProgress();
const SAMPLE_MODE  = process.env.SAMPLE === "1";
const ONLY_GEN     = process.env.ONLY_GENERATED === "1";

const SYSTEM_PROMPT = `Sen usta bir Türk çocuk masalı yazarısın. Türk halk masallarının sıcak, akıcı anlatım geleneğini bilirsin.

YAZIM KURALLARI (HEPSİNE KESİNLİKLE UY):
- Tertemiz, doğal, akıcı Türkçe yaz. Yabancı kelime, bozuk çeviri kalıbı, makine-Türkçesi YASAK.
- ASLA cümle ya da kalıp tekrarı yapma. Her cümle bir öncekinden farklı kurulsun; cümle uzunluklarını değiştir.
- Somut, canlı ayrıntı kullan: renk, ses, koku, his. "Anlatma, göster" — duyguyu olayla hisset.
- Gerçek bir olay örgüsü kur: giriş (durum) → bir sorun/engel → çabalama → çözüm → doğal bir ders.
- Karakterlerin adlarını ve kimliğini KORU; verilen başlığa ve karakterlere sadık kal.
- Klişe ve dolgu cümlelerden kaçın ("ve böylece herkes mutlu oldu" gibi kolaycılıktan uzak dur).
- Ders/mesaj didaktik olmasın; hikâyenin içinden doğal çıksın.
- Sadece masalın METNİNİ yaz. Başlık, "Masal:" öneki, açıklama, emoji veya not EKLEME.`;

interface Src {
  id: number;
  title: string;
  characters: string[];
  source: string;
  ageMin: number;
  ageMax: number;
}

function calcWordCount(t: string)      { return t.trim().split(/\s+/).length; }
function calcReadingMinutes(t: string) { return Math.max(1, Math.ceil(calcWordCount(t) / 100)); }

function getExcerpt(c: string): string {
  const sentences = c.split(/(?<=[.!?])\s+/);
  let excerpt = "";
  for (const s of sentences) {
    if ((excerpt + s).length > 220) break;
    excerpt += (excerpt ? " " : "") + s;
  }
  return excerpt || c.slice(0, 220) + "…";
}

// Yaşa göre hedef uzunluk ve dil tonu
function ageGuide(ageMin: number, ageMax: number): { length: string; tone: string; maxTokens: number } {
  const a = ageMax;
  if (a <= 3)  return { length: "200-350 kelime", tone: "çok sade, kısa cümleler, bol tekrarsız ritim, sevecen ve yumuşak", maxTokens: 900 };
  if (a <= 6)  return { length: "350-550 kelime", tone: "sade ama renkli, hayal gücünü besleyen, meraklı", maxTokens: 1300 };
  if (a <= 9)  return { length: "550-800 kelime", tone: "akıcı, biraz daha gelişmiş kelime dağarcığı, küçük gerilim ve mizah", maxTokens: 1800 };
  return            { length: "750-1000 kelime", tone: "zengin betimleme, katmanlı olay örgüsü, düşündüren", maxTokens: 2200 };
}

function buildPrompt(s: Src): { prompt: string; maxTokens: number } {
  const chars  = s.characters.slice(0, 5).join(", ") || "masalın kahramanı";
  const g      = ageGuide(s.ageMin, s.ageMax);
  const prompt = `"${s.title}" başlıklı Türk çocuk masalını baştan, en güzel haliyle yaz.

Yaş grubu: ${s.ageMin}-${s.ageMax} yaş
Ana karakterler: ${chars}
Tür/kaynak: ${s.source}
Hedef uzunluk: ${g.length}
İstenen ton: ${g.tone}

Bu yaş grubuna tam oturan, çocuğun severek dinleyeceği, akılda kalıcı bir masal yaz.`;
  return { prompt, maxTokens: g.maxTokens };
}

function sleep(ms: number) { return new Promise(r => setTimeout(r, ms)); }

async function callGemini(userPrompt: string, maxTokens: number, retries = 4): Promise<string> {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(geminiUrl(GEMINI_MODELS[geminiIdx]), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
          contents: [{ role: "user", parts: [{ text: userPrompt }] }],
          generationConfig: {
            temperature: 0.9,
            topP: 0.95,
            maxOutputTokens: maxTokens,
            // 2.5 modelleri "düşünme" modelidir; masal yazımında gereksiz, kapatıyoruz (hız + token tasarrufu)
            thinkingConfig: { thinkingBudget: 0 },
          },
        }),
      });

      if (res.status === 404 || res.status === 403) {
        const err = await res.text();
        console.error(`\n\n❌ Kalıcı hata (${res.status}) — script durduruluyor.\n${err.slice(0, 300)}\n`);
        process.exit(1);
      }
      if (res.status === 429) {
        const body = await res.text();
        // Günlük kota tükendiyse beklemenin anlamı yok — özel hata fırlat, ana döngü zarifçe dursun
        if (/per ?day|PerDay|RequestsPerDay/i.test(body)) {
          throw new DailyQuotaError("Günlük ücretsiz kota tükendi");
        }
        // Dakika limiti (RPM) — bir sonraki pencere ~60s içinde açılır
        const wait = 35000;
        console.log(`\n  ⏳ Dakika limiti — ${wait / 1000}s bekleniyor...`);
        await sleep(wait);
        continue;
      }
      if (!res.ok) {
        const err = await res.text();
        throw new Error(`HTTP ${res.status}: ${err.slice(0, 100)}`);
      }

      const data = await res.json() as { candidates?: { content?: { parts?: { text?: string }[] } }[] };
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
      if (!text || text.length < 200) throw new Error("Çok kısa veya boş yanıt");
      return text;
    } catch (err) {
      if (err instanceof DailyQuotaError) throw err;   // beklemeden hemen çık
      if (attempt === retries) throw err;
      await sleep(5000 * (attempt + 1));
    }
  }
  throw new Error("Tüm denemeler başarısız");
}

async function callGroq(userPrompt: string, maxTokens: number, retries = 4): Promise<string> {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(GROQ_URL, {
        method: "POST",
        headers: { "Authorization": `Bearer ${GROQ_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model: GROQ_MODEL,
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: userPrompt },
          ],
          max_tokens: maxTokens,
          temperature: 0.85,
          top_p: 0.95,
        }),
        signal: AbortSignal.timeout(90_000),
      });

      if (res.status === 429) {
        const body = await res.text();
        if (/per ?day|RequestsPerDay|tokens per day/i.test(body)) {
          throw new DailyQuotaError("Groq günlük kota tükendi");
        }
        const wait = 30000;
        console.log(`\n  ⏳ Dakika limiti — ${wait / 1000}s bekleniyor...`);
        await sleep(wait);
        continue;
      }
      if (!res.ok) {
        const err = await res.text();
        throw new Error(`HTTP ${res.status}: ${err.slice(0, 120)}`);
      }

      const data = await res.json() as { choices?: { message?: { content?: string } }[] };
      const text = data.choices?.[0]?.message?.content?.trim();
      if (!text || text.length < 200) throw new Error("Çok kısa veya boş yanıt");
      return text;
    } catch (err) {
      if (err instanceof DailyQuotaError) throw err;
      if (attempt === retries) throw err;
      await sleep(5000 * (attempt + 1));
    }
  }
  throw new Error("Tüm denemeler başarısız");
}

async function generate(prompt: string, maxTokens: number): Promise<string> {
  if (PROVIDER === "groq") return callGroq(prompt, maxTokens);
  // Gemini: günlük kota dolan modelden sıradakine geç; hepsi dolunca DailyQuotaError yukarı çıkar
  while (true) {
    try {
      return await callGemini(prompt, maxTokens);
    } catch (err) {
      if (err instanceof DailyQuotaError && geminiIdx < GEMINI_MODELS.length - 1) {
        console.log(`\n  ↪ ${GEMINI_MODELS[geminiIdx]} günlük kota doldu → ${GEMINI_MODELS[geminiIdx + 1]} ile devam`);
        geminiIdx++;
        continue;
      }
      throw err;
    }
  }
}

// ── Kalite testi: DB'siz birkaç örnek üret ────────────────────────────────
const SAMPLES: Src[] = [
  { id: 0, title: "Tembel Karınca ile Çalışkan Cırcır Böceği", characters: ["Karınca", "Cırcır Böceği"], source: "generated", ageMin: 4, ageMax: 6 },
  { id: 0, title: "Ay'a Gitmek İsteyen Küçük Tavşan",          characters: ["Tavşan", "Ay"],            source: "generated", ageMin: 2, ageMax: 3 },
  { id: 0, title: "Cesur Köylü Çocuk ve Dağdaki Dev",          characters: ["Ali", "Dev"],              source: "generated", ageMin: 7, ageMax: 9 },
];

async function runSample() {
  console.log(`\n🧪 KALİTE TESTİ — ${PROVIDER}/${MODEL} (DB'ye dokunulmuyor)\n${"=".repeat(70)}`);
  for (const s of SAMPLES) {
    const { prompt, maxTokens } = buildPrompt(s);
    console.log(`\n\n📖 [${s.ageMin}-${s.ageMax} yaş] ${s.title}\n${"-".repeat(70)}`);
    try {
      const text = await generate(prompt, maxTokens);
      console.log(text);
      console.log(`\n   → ${calcWordCount(text)} kelime, ~${calcReadingMinutes(text)} dk`);
    } catch (err) {
      console.error(`   ✗ Hata: ${err}`);
    }
    await sleep(DELAY_MS);
  }
  console.log(`\n\n${"=".repeat(70)}\n✅ Test bitti. Kaliteyi beğendiysen: npm run stories:rewrite\n`);
}

// ── Gerçek çalışma: DB'deki masalları yeniden yaz ─────────────────────────
async function runDb() {
  const prisma = new PrismaClient();
  try {
    const stories = await prisma.story.findMany({
      where: ONLY_GEN ? { sourceType: "generated" } : undefined,
      select: {
        id: true, title: true, characters: true, source: true,
        category: { select: { ageMin: true, ageMax: true } },
      },
      orderBy: { id: "asc" },
      skip: START_OFFSET,
    });

    console.log(`\n✍️  ${stories.length} masal yeniden yazılacak — model: ${MODEL}, offset: ${START_OFFSET}`);
    console.log(`   Kapsam: ${ONLY_GEN ? "sadece generated" : "TÜM masallar"}`);
    console.log(`   Tahmini süre: ~${Math.ceil(stories.length * DELAY_MS / 60000)} dakika\n`);

    let done = 0, failed = 0;
    const failedIds: number[] = [];

    for (let i = 0; i < stories.length; i++) {
      const st = stories[i];
      const src: Src = {
        id: st.id, title: st.title, characters: st.characters, source: st.source,
        ageMin: st.category.ageMin, ageMax: st.category.ageMax,
      };
      const { prompt, maxTokens } = buildPrompt(src);

      try {
        const newContent = await generate(prompt, maxTokens);
        await prisma.story.update({
          where: { id: st.id },
          data: {
            content:        newContent,
            excerpt:        getExcerpt(newContent),
            wordCount:      calcWordCount(newContent),
            readingMinutes: calcReadingMinutes(newContent),
          },
        });
        done++;
      } catch (err) {
        if (err instanceof DailyQuotaError) {
          const resumeAt = START_OFFSET + done + failed;
          writeProgress(resumeAt);
          console.log(`\n\n🛑 Tüm modellerin günlük ücretsiz kotası tükendi. Bu turda ${done} masal yazıldı.`);
          console.log(`   İlerleme kaydedildi (offset: ${resumeAt}). Yarın 'npm run stories:rewrite' otomatik kaldığı yerden devam eder.`);
          if (failedIds.length > 0) console.log(`   Atlanan/hatalı ID'ler: ${failedIds.join(", ")}`);
          return;
        }
        failed++;
        failedIds.push(st.id);
        console.error(`\n  ✗ [${st.id}] ${st.title}: ${err}`);
      }

      writeProgress(START_OFFSET + done + failed);   // her masaldan sonra ilerlemeyi kaydet
      const completed = START_OFFSET + done + failed;
      const total     = stories.length + START_OFFSET;
      const pct       = Math.round((completed / total) * 100);
      process.stdout.write(`\r  ✓ ${done} yazıldı | ✗ ${failed} hata | %${pct} | kalan: ${stories.length - done - failed}   `);

      if (i + 1 < stories.length) await sleep(DELAY_MS);
    }

    console.log(`\n\n🎉 Tamamlandı! ${done} masal yeniden yazıldı, ${failed} hata.`);
    if (failedIds.length > 0) {
      console.log(`Hatalı ID'ler: ${failedIds.join(", ")}`);
      console.log(`Tekrar dene: START_OFFSET=${START_OFFSET + done} npm run stories:rewrite`);
    }
  } finally {
    await prisma.$disconnect();
  }
}

(SAMPLE_MODE ? runSample() : runDb()).catch(console.error);
