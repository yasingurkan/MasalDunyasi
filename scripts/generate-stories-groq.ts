/**
 * Groq (Llama 3.3 70B) ile kaliteli, güvenli Türkçe çocuk masalı üretimi.
 * İçerik güvenliği: uygunsuz kelimeler otomatik filtrelenir.
 */

import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";

const envPath = path.join(__dirname, "../.env");
const envContent = fs.existsSync(envPath) ? fs.readFileSync(envPath, "utf8") : "";
const GROQ_API_KEY = (envContent.match(/GROQ_API_KEY=(.+)/)?.[1]?.trim() || process.env.GROQ_API_KEY || "").trim();

if (!GROQ_API_KEY) { console.error("GROQ_API_KEY bulunamadı."); process.exit(1); }

const prisma = new PrismaClient();
const TARGET   = 100;
const MODEL    = "llama-3.3-70b-versatile";  // Daha kaliteli model
const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const DELAY_MS = 9000; // 9s → ~6.5 istek/dk → güvenli rate limit

// İçerik güvenliği — çocuk sitesinde bulunmayacak kelimeler
const BANNED = ["intihar","cinayet","öldür","şiddet","kavga","savaş","öl","katil","tecavüz","uyuşturucu","alkol","sigara","korku","kabus"];

// ── Yardımcılar ───────────────────────────────────────────────────────────────

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

function sleep(ms: number) { return new Promise(r => setTimeout(r, ms)); }

// ── Groq API ──────────────────────────────────────────────────────────────────

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
          temperature: 0.7,
        }),
        signal: AbortSignal.timeout(90_000),
      });

      if (res.status === 429) {
        const wait = Math.min(120_000, 20_000 * Math.pow(1.5, attempt));
        console.log(`  ⏳ Rate limit — ${Math.round(wait/1000)}s bekleniyor...`);
        await sleep(wait);
        continue;
      }
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json() as { choices?:{message?:{content?:string}}[]; error?:{message:string} };
      if (data.error?.message?.toLowerCase().includes("rate")) {
        await sleep(30_000); continue;
      }
      if (data.error) throw new Error(data.error.message);

      return data.choices?.[0]?.message?.content?.trim() ?? "";
    } catch (err) {
      if (attempt < retries) { await sleep(10_000); }
      else throw err;
    }
  }
  return "";
}

// ── Sistem promptları (yaşa göre) ─────────────────────────────────────────────

function sysPrompt(ageMin: number): string {
  const safety = "ÖNEMLİ: İçerik çocuklara %100 uygun olmalı. Şiddet, korku, ölüm, ağlama, hastalık, ayrılık veya olumsuz temalar kesinlikle yasak. Her şey pozitif, umutlu, mutlu bitişle.";

  if (ageMin <= 2) return `Sen sevecen bir Türk bebek masalı yazarısın. ${safety}
Çok kısa, yalın cümleler. Tekrar ve ritim. Sevimli hayvanlar. Renkler ve sesler. Mutlu son.`;

  if (ageMin <= 4) return `Sen yetenekli bir Türk çocuk masalı yazarısın. ${safety}
Basit ama tam cümleler. Sevimli karakterler. Kısa diyaloglar. Mutlu, neşeli son.`;

  if (ageMin <= 6) return `Sen yetenekli bir Türk çocuk masalı yazarısın. ${safety}
Akıcı Türkçe. Mantıklı olay örgüsü. Dostluk, yardım, dürüstlük temaları. Mutlu son.`;

  if (ageMin <= 8) return `Sen yetenekli bir Türk halk masalı yazarısın. ${safety}
Zengin betimlemeler. Macera ve keşif. Ahlaki ders ama baskı yapmadan. Mutlu son.`;

  if (ageMin <= 10) return `Sen yetenekli bir Türk masalı yazarısın. ${safety}
Güçlü karakter gelişimi. Cesaret, adalet, bilgelik temaları. Türk kültüründen ilham. Mutlu son.`;

  return `Sen yetenekli bir Türk masalı yazarısın. ${safety}
Edebi dil. Karmaşık ama pozitif olay örgüsü. Büyüme ve keşif temaları. Umutlu son.`;
}

// ── Masal üretici ─────────────────────────────────────────────────────────────

type HeroPool = { n: string; t: string };
type Pool = { heroes: HeroPool[]; settings: string[]; conflicts: string[]; lessons: string[]; helpers: HeroPool[]; sources: string[] };

const POOLS: Record<string, Pool> = {
  A: {
    heroes: [{n:"Küçük Ayıcık",t:"ayı yavrusu"},{n:"Minik Tavşan",t:"tavşan"},{n:"Sarı Civciv",t:"civciv"},{n:"Tüylü Kedi",t:"kedi"},{n:"Şirin Ördek",t:"ördek"},{n:"Beyaz Kuzu",t:"kuzu"},{n:"Minik Kirpi",t:"kirpi"},{n:"Sarı Arı",t:"arı"},{n:"Pembe Tavuk",t:"tavuk"},{n:"Küçük Kurbağa",t:"kurbağa"},{n:"Şen Horoz",t:"horoz"},{n:"Küçük Fare",t:"fare"},{n:"Minik Tavşan Pamuk",t:"tavşan"},{n:"Sarışın Köpek Yavrusu",t:"köpek"},{n:"Küçük Sincap",t:"sincap"}],
    settings:  ["yeşil çayırda","ormanın kenarında","güneşli bahçede","göletin başında","çiçek tarlasında","ahır yanında","dağ eteğinde","nehir kıyısında","büyük çınar altında","baharın geldiği vadide"],
    conflicts: ["kayıp oyuncağını arıyor","yeni arkadaş edinmek istiyor","annesine sürpriz hazırlıyor","güzel bir çiçek arıyor","ilk kez yürümeyi öğreniyor","yeni bir oyun keşfediyor","sevdiği arkadaşına hediye bulmak istiyor","ormanda kaybolup yolunu buluyor","yağmurda barınak arıyor","kendi başına bir şeyler yapmayı öğreniyor"],
    lessons:   ["paylaşmak sevindirir","dostluk çok değerlidir","yardım etmek güzeldir","sabır ödüllendirilir","cesaret güçlü olmak demektir","merak öğretir","aile en güzel hazinedir","doğayı sevmek önemlidir"],
    helpers:   [{n:"Anne",t:"anne"},{n:"Büyük Kaplumbağa",t:"kaplumbağa"},{n:"Neşeli Sincap",t:"sincap"},{n:"Güneş Teyze",t:"güneş"},{n:"Rüzgar Dede",t:"rüzgar"},{n:"Tatlı Kelebek",t:"kelebek"}],
    sources:   ["Türk Çocuk Masalı","Türk Ninnisi","Özgün Türk Masalı"],
  },
  B: {
    heroes: [{n:"Keloğlan",t:"zeki çocuk"},{n:"Küçük Ali",t:"çoban çocuk"},{n:"Peri Kızı Işık",t:"peri"},{n:"Bilge Kaplumbağa",t:"kaplumbağa"},{n:"Cesur Tavşan",t:"tavşan"},{n:"Küçük Prens Ömer",t:"prens"},{n:"Bahçıvan Fatma",t:"küçük kız"},{n:"Maceracı Sincap",t:"sincap"},{n:"Sihirbaz Dede",t:"yaşlı sihirbaz"},{n:"Ormancı Kız Aylin",t:"küçük kız"},{n:"Dürüst Oduncu",t:"oduncu"},{n:"Küçük Prenses Elif",t:"prenses"},{n:"Masal Çocuğu Can",t:"meraklı çocuk"},{n:"Gülen Kız Selin",t:"neşeli kız"},{n:"Bilge Tilki",t:"tilki"}],
    settings:  ["güzel bir dağ köyünde","büyülü bir ormanda","nehrin kıyısında","çınar ağacının altında","çiçekli bir bahçede","dağlık yolda","masal ülkesinde","eski bir kale bahçesinde","güneşli bir vadide","berrak göl kenarında"],
    conflicts: ["kayıp hazineyi bulmak istiyor","hasta annesine ilaç arıyor","kayıp kardeşini bulmak istiyor","köye su getirmek istiyor","büyülü tohumu bulmak istiyor","sihirli armağanı teslim etmek istiyor","yitik hayvanını arıyor","dağın ardını keşfetmek istiyor","gizli bahçeyi bulmak istiyor","sihirli aynayı geri getirmek istiyor"],
    lessons:   ["dürüstlük her zaman kazanır","cesaret ödüllendirilir","yardımlaşmak güçlendirir","azim başarı getirir","büyüklere saygı önemlidir","paylaşmak bereket getirir","sabır en büyük güçtür","iyilik yapan iyilik bulur"],
    helpers:   [{n:"Yaşlı Bilge",t:"yaşlı adam"},{n:"Peri Kızı",t:"peri"},{n:"Konuşan Kuş",t:"sihirli kuş"},{n:"Sihirli Kaplumbağa",t:"kaplumbağa"},{n:"Orman Perisi",t:"peri"},{n:"Gülen Tilki",t:"tilki"}],
    sources:   ["Türk Çocuk Masalı","Türk Halk Masalı","Özgün Türk Masalı","Grimm Kardeşler"],
  },
  C: {
    heroes: [{n:"Kahraman Mehmet",t:"delikanlı"},{n:"Prenses Zeynep",t:"prenses"},{n:"Nasreddin Hoca",t:"hoca"},{n:"Kurnaz Keloğlan",t:"akıllı çocuk"},{n:"Cesur Çoban İbrahim",t:"çoban"},{n:"Bilge Dede Orhan",t:"bilge"},{n:"Denizci Kaptan Hasan",t:"denizci"},{n:"Ormancı Kız Sema",t:"genç kız"},{n:"Akıllı Kız Ayşe",t:"köy kızı"},{n:"Demirci Usta Ali",t:"usta"},{n:"Maceracı Yusuf",t:"genç"},{n:"Güçlü Kız Fatma",t:"cesur kız"},{n:"Bilgin Çocuk Murat",t:"meraklı çocuk"},{n:"Neşeli Satıcı Hasan",t:"satıcı"},{n:"Dürüst Bahçıvan",t:"bahçıvan"}],
    settings:  ["Anadolu'nun güzel bir köyünde","eski bir kasabada","Karadeniz kıyısında","Torosların eteklerinde","bir pazar yerinde","güzel bir sahil köyünde","şehrin ortasındaki bahçede","bereketli bir ovada","meyve bahçelerinin arasında","güzel bir vadide"],
    conflicts: ["zalim olmayan ama hatalı beyi uyarmak istiyor","yedi dağı aşarak sihirli suyu bulmak istiyor","haksızlığı düzeltmek istiyor","kayıp kız kardeşini bulmak istiyor","köye yağmur yağdıracak tohumu bulmak istiyor","büyülü bahçeyi kurtarmak istiyor","sihirli aynayı bulup köyü aydınlatmak istiyor","altın elmaları toplamak istiyor","büyülü müziği öğrenmek istiyor","hazine haritasını çözmek istiyor"],
    lessons:   ["adalet geç de olsa gelir","akıl kılıçtan güçlüdür","yardım eden yardım bulur","dürüstlük en büyük hazinedir","bilgelik güçten üstündür","birlik beraberlik getirir","iyilik yapan iyilik bulur","sabır zaferi getirir"],
    helpers:   [{n:"Yaşlı Derviş",t:"derviş"},{n:"Sihirli Kartal",t:"kartal"},{n:"Bilge Nine",t:"yaşlı kadın"},{n:"Konuşan At",t:"sihirli at"},{n:"Orman Perisi",t:"peri"},{n:"Gizem Kuşu",t:"sihirli kuş"}],
    sources:   ["Türk Halk Masalı","Nasreddin Hoca Fıkraları","Binbir Gece Masalları","Ezop Masalları","Grimm Kardeşler"],
  },
  D: {
    heroes: [{n:"Genç Yusuf",t:"genç kahraman"},{n:"Şair Sinan",t:"şair"},{n:"Denizci Emirhan",t:"denizci"},{n:"Prens Osman",t:"prens"},{n:"Bilge Sema",t:"genç bilge"},{n:"Korkusuz İzci Kaan",t:"genç kaşif"},{n:"Barış Arayan Aylin",t:"genç kız"},{n:"Usta Demir",t:"usta"},{n:"Köroğlu'nun Torunu",t:"yiğit"},{n:"Keloğlan'ın Torunu",t:"zeki genç"},{n:"Sihirbaz Çırağı",t:"sihir öğrencisi"},{n:"Kahraman Neslihan",t:"cesur kız"},{n:"Genç Bilge Tarık",t:"araştırmacı"},{n:"Maceracı Leyla",t:"kaşif kız"},{n:"Dürüst Mehmet",t:"adil genç"}],
    settings:  ["Türkiye'nin güzel bir şehrinde","eski bir kütüphanenin gizli odasında","Anadolu'nun antik yollarında","İpek Yolu üzerindeki kervansarayda","sarp dağlar arasındaki vadide","kadim bir bahçede","büyülü bir kütüphanede","tarihî bir şehrin çarşısında","gizemli mağara yakınında","büyük destan ülkesinde"],
    conflicts: ["efsanevi kitabı bulmak istiyor","kayıp müziği yeniden keşfetmek istiyor","iki toplum arasında barış kurmak istiyor","gizemli kehaneti çözmeye çalışıyor","büyülü sanatı öğrenmek istiyor","kadim sırrı çözmek istiyor","gizli bahçeyi keşfetmek istiyor","eski ustayı bulmak istiyor","kayıp eseri bulmak istiyor","dünyanın harikalarını keşfetmek istiyor"],
    lessons:   ["bilgelik en büyük güçtür","sanatta sabır gereklidir","barış her şeyden değerlidir","keşfetmek hayatı güzelleştirir","dürüstlük taht bile kazandırır","geçmiş geleceğe ışık tutar","sevgi en büyük güçtür","öğrenmek hiç bitmez"],
    helpers:   [{n:"Yaşlı Ozan",t:"ozan"},{n:"Bilge Kütüphaneci",t:"kütüphaneci"},{n:"Sihirli Harita",t:"gizem"},{n:"Gizli Dost",t:"yardımcı"},{n:"Cesur Kız",t:"yardımcı"},{n:"Efsanevi Kuş",t:"sihirli kuş"}],
    sources:   ["Türk Destanı","Türk Halk Masalı","Türk Efsanesi","Binbir Gece Masalları","Özgün Türk Masalı"],
  },
};

function getPoolKey(ageMin: number): string {
  if (ageMin <= 2) return "A";
  if (ageMin <= 5) return "B";
  if (ageMin <= 8) return "C";
  return "D";
}

function pick<T>(arr: T[], idx: number, prime = 1): T {
  return arr[Math.abs(idx * prime) % arr.length];
}

// ── Tek masal üret ────────────────────────────────────────────────────────────

async function generateOne(
  hero: HeroPool, setting: string, conflict: string,
  lesson: string, helper: HeroPool, ageMin: number
): Promise<{ title: string; content: string; characters: string[]; tags: string[]; imageQuery: string } | null> {

  const minWords = ageMin <= 2 ? 150 : ageMin <= 5 ? 300 : ageMin <= 8 ? 500 : 600;

  const prompt = `Şu bilgilere göre Türkçe bir çocuk masalı yaz:

BAŞLIK: (İlk satırda kısa ve güzel bir Türkçe başlık yaz, sonra boş satır bırak)
KAHRAMAN: ${hero.n} (${hero.t})
YARDIMCI: ${helper.n}
MEKAN: ${setting}
KONU: ${conflict}
DERS: ${lesson}

Masal "Bir varmış bir yokmuş" ile başlasın. Mutlu sonla bitsin. En az ${minWords} kelime.`;

  const content = await callGroq(sysPrompt(ageMin), prompt);
  if (!content || calcWordCount(content) < 80) return null;

  // İçerik güvenliği
  if (!isSafe(content)) {
    console.log(`  🚫 Uygunsuz içerik algılandı, atlanıyor`);
    return null;
  }

  // Başlık ayıkla
  const lines = content.split("\n").map(l => l.trim()).filter(Boolean);
  let title = lines[0]?.replace(/\*+|#+|^[-–—:]+\s*/g, "").replace(/\s+/g, " ").trim() ?? "";

  // Başlık bozuksa yeniden üret
  const invalidTitle = !title || title.length < 3 || title.length > 80
    || /^(bir|evvel|varmış|merhaba|başlık|title|masal|konu|kahraman)/i.test(title)
    || !isSafe(title);

  const suffix = /[aeıioöuü]$/i.test(hero.n) ? "nın" : "ın";
  if (invalidTitle) title = `${hero.n}'${suffix} Büyük Macerası`;

  const story = lines.slice(1).join("\n\n").trim() || content;
  if (!isSafe(story)) { console.log(`  🚫 Hikaye içeriği uygunsuz, atlanıyor`); return null; }

  return {
    title,
    content: story,
    characters: [hero.n, helper.n],
    tags: [lesson.split(" ")[0].toLowerCase(), hero.t.split(" ")[0].toLowerCase(), "macera"],
    imageQuery: `${hero.t} ${setting.split(" ").slice(0,3).join(" ")} ${conflict.split(" ").slice(0,3).join(" ")} cartoon children story`,
  };
}

// ── Ana ───────────────────────────────────────────────────────────────────────

async function main() {
  console.log(`\n🌙 Groq (${MODEL}) ile kaliteli Türkçe masal üretimi\n`);

  const categories = await prisma.ageCategory.findMany({ orderBy: { ageMin: "asc" } });
  let grandTotal = 0;

  for (const cat of categories) {
    const existing   = await prisma.story.findMany({ where: { categoryId: cat.id }, select: { slug: true } });
    const existSlug  = new Set(existing.map(s => s.slug));
    const needed     = Math.max(0, TARGET - existing.length);

    console.log(`\n📖 ${cat.name}: mevcut=${existing.length}, üretilecek=${needed}`);
    if (needed === 0) { console.log("   ✓ Zaten yeterli"); continue; }

    const pool = POOLS[getPoolKey(cat.ageMin)];
    let inserted = 0;

    for (let i = 0; i < needed * 2 && inserted < needed; i++) {
      const hero     = pick(pool.heroes,    i, 7);
      const setting  = pick(pool.settings,  i, 11);
      const conflict = pick(pool.conflicts, i, 13);
      const lesson   = pick(pool.lessons,   i, 17);
      const helper   = pick(pool.helpers,   i, 19);
      const source   = pick(pool.sources,   i, 23);

      process.stdout.write(`  [${inserted+1}/${needed}] ${hero.n} — `);

      try {
        const story = await generateOne(hero, setting, conflict, lesson, helper, cat.ageMin);
        if (!story) { console.log("atlandı"); await sleep(DELAY_MS); continue; }

        const wc  = calcWordCount(story.content);
        const rm  = calcReadingMinutes(story.content);
        const exc = getExcerpt(story.content);

        let slug = `${slugify(story.title)}-${cat.slug.replace("-yas","")}-${i+1}`;
        if (existSlug.has(slug)) slug += `-v${(Date.now()%9999)}`;
        existSlug.add(slug);

        await prisma.story.create({
          data: {
            title: story.title, slug, content: story.content, excerpt: exc,
            ageMin: cat.ageMin, ageMax: cat.ageMax,
            readingMinutes: rm, wordCount: wc,
            source, sourceType: "generated",
            characters: story.characters, tags: story.tags,
            imageQuery: story.imageQuery,
            featured: false, uploadedAt: new Date(), categoryId: cat.id,
          },
        });

        inserted++; grandTotal++;
        console.log(`✓ "${story.title.slice(0,45)}" (${wc} kelime)`);
      } catch (err) {
        console.log(`✗ ${err}`);
      }

      await sleep(DELAY_MS);
    }

    console.log(`   ✅ ${inserted} yeni masal eklendi`);
  }

  // Doğrulama
  console.log("\n🔍 Doğrulama:\n");
  const rows = await prisma.$queryRaw<{name:string;count:bigint}[]>`
    SELECT ac.name, COUNT(s.id) as count FROM "AgeCategory" ac
    LEFT JOIN "Story" s ON s."categoryId"=ac.id GROUP BY ac.id,ac.name ORDER BY ac."ageMin"`;
  let allOk = true;
  for (const r of rows) {
    const n = Number(r.count);
    console.log(`  ${n>=TARGET?"✓":"✗"} ${r.name}: ${n} masal`);
    if (n < TARGET) allOk = false;
  }

  console.log(`\n🎉 Tamamlandı! Toplam ${grandTotal} yeni masal üretildi.`);
  console.log(allOk ? "✅ Tüm kategoriler hedefine ulaştı." : "⚠  Scripti tekrar çalıştır.");
}

main().catch(e=>{console.error(e);process.exit(1);}).finally(()=>prisma.$disconnect());
