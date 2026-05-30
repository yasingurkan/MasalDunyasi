/**
 * Tüm masallara Pollinations.ai tabanlı çizgi karakter görseli URL'si atar.
 * Kullanım:
 *   npm run images:update          — sadece URL'leri günceller
 *   npm run images:update -- --warm — günceller + ön yükleme yapar
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const WARM = process.argv.includes("--warm");
const CONCURRENCY = 4; // paralel ön yükleme sayısı

// ── Prompt üretici ────────────────────────────────────────────────────────────

function buildPrompt(story: {
  imageQuery: string;
  characters: string[];
  source: string;
}): string {
  const scene = story.imageQuery.trim();

  const chars = story.characters
    .slice(0, 3)
    .map((c) => c.replace(/['"]/g, "").trim())
    .filter(Boolean)
    .join(", ");

  // Kaynak bazlı bağlam / tarz
  const src = story.source.toLowerCase();
  let context = "";
  if (/nasreddin/.test(src))
    context = "wise bearded man riding donkey, Turkish village, comedy folk art";
  else if (/grimm/.test(src))
    context = "classic German fairy tale, enchanted forest, magical kingdom, storybook";
  else if (/andersen/.test(src))
    context = "Nordic fairy tale, whimsical snow, mermaid or tin soldier, Hans Christian Andersen style";
  else if (/perrault/.test(src))
    context = "French fairy tale, elegant castle, fairy godmother, royal ball, Cinderella style";
  else if (/binbir gece|arabian/.test(src))
    context = "Arabian Nights, ornate golden palace, flying carpet, magical lamp, desert dunes";
  else if (/yunan|greek/.test(src))
    context = "Greek mythology, ancient temple, gods and heroes, Mount Olympus";
  else if (/norse|viking/.test(src))
    context = "Norse mythology, Viking warrior, Asgard rainbow bridge, thunder god";
  else if (/aztek|aztec/.test(src))
    context = "Aztec mythology, feathered serpent Quetzalcoatl, ancient pyramid, Mesoamerican";
  else if (/dede korkut/.test(src))
    context = "Central Asian Turkic epic, steppe hero on horseback, nomadic warrior, ancient Anatolia";
  else if (/ezop|aesop/.test(src))
    context = "Aesop fable, animals with human traits, moral lesson, classic illustrated fable";
  else if (/collodi|pinocchio/.test(src))
    context = "wooden puppet boy adventure, Italian folk story, magical cricket friend";
  else if (/puşkin|pushkin/.test(src))
    context = "Russian fairy tale, tsar, magical golden fish, talking animals, Russian palace";
  else if (/japon|japan/.test(src))
    context = "Japanese folklore, kimono, cherry blossoms, bamboo forest, samurai adventure";
  else if (/çin|china|chinese/.test(src))
    context = "Chinese folklore, dragon, pagoda, jade, traditional Chinese painting style";
  else if (/rus|russia/.test(src))
    context = "Russian folklore, birch forest, wooden house, Slavic magic, winter snow";
  else if (/hint|india|panchatantra/.test(src))
    context = "Indian folk tale, elephant, colorful palace, tropical jungle, Rajasthan style";
  else if (/ninni|ninnisi/.test(src))
    context = "dreamy nursery, soft moonlight, sleeping baby, lullaby magic, stars and clouds";
  else if (/fransız|french/.test(src))
    context = "French fairy tale, elegant countryside, enchanted castle, romantic garden";
  else if (/ingiliz|english|british/.test(src))
    context = "English folklore, green rolling hills, stone castle, brave knight, cozy village";
  else if (/irlanda|irish/.test(src))
    context = "Irish folklore, emerald green hills, Celtic magic, pot of gold, mischievous sprite";
  else if (/afrika|african|akan/.test(src))
    context = "African folk tale, savanna grasslands, colorful tribal patterns, wise village chief";
  else if (/kırgız|kyrgyz/.test(src))
    context = "Central Asian epic hero Manas, mountain steppe, nomadic warriors on horseback";
  else if (/türk|halk|çocuk|özgün|destan|efsane/.test(src))
    // Atmosfer ipucu — sahneyi köy/pazar sahnesine ZORLAMADAN sıcak Türk masalı havası
    context = "warm Turkish folk-tale atmosphere, Anatolian storybook mood";
  else
    context = "warm magical fairy-tale atmosphere";

  // Sahneyi ana özne yap: imageQuery'yi öne ve vurgulu koy ki görsel metne uysun
  // Net çizgi-film / animasyon filmi stili (kullanıcı isteği)
  const style =
    "fun 2D cartoon illustration, animated movie style, Pixar Disney inspired, " +
    "bold clean outlines, bright cheerful saturated colors, cute expressive cartoon characters, " +
    "smooth cel shading, playful children's storybook art, no text, no watermark, family friendly";

  // Sahne en başta + tekrar bağlamla pekiştirilir; kültür yalnızca atmosfer olarak eklenir
  return [`${scene}, as the main scene`, chars, context, style].filter(Boolean).join(", ");
}

// ── Pollinations URL üretici ──────────────────────────────────────────────────

function pollinationsUrl(prompt: string, seed: number): string {
  const encoded = encodeURIComponent(prompt);
  return (
    `https://image.pollinations.ai/prompt/${encoded}` +
    `?width=1024&height=640&nologo=true&model=flux&seed=${seed}`
  );
}

// ── Ön yükleme (concurrency-sınırlı) ─────────────────────────────────────────

async function warmImages(stories: { id: number; title: string; imageUrl: string | null }[]) {
  console.log(`\n🔥 Görseller ön yükleniyor (${CONCURRENCY} paralel istek)...\n`);

  const chunks: typeof stories[] = [];
  for (let i = 0; i < stories.length; i += CONCURRENCY) {
    chunks.push(stories.slice(i, i + CONCURRENCY));
  }

  let done = 0;
  for (const chunk of chunks) {
    await Promise.allSettled(
      chunk.map(async (s) => {
        if (!s.imageUrl) return;
        try {
          const res = await fetch(s.imageUrl, {
            signal: AbortSignal.timeout(120_000),
          });
          done++;
          const label = s.title.slice(0, 38).padEnd(38);
          console.log(`  ${res.ok ? "✓" : "⚠"} [${done}/${stories.length}] ${label}`);
        } catch {
          done++;
          console.log(`  ✗ [${done}/${stories.length}] ${s.title.slice(0, 38)}`);
        }
      })
    );
  }

  console.log(`\n✅ Ön yükleme tamamlandı.\n`);
}

// ── Ana akış ──────────────────────────────────────────────────────────────────

async function main() {
  const stories = await prisma.story.findMany({
    select: { id: true, title: true, slug: true, imageQuery: true, characters: true, source: true },
    orderBy: { id: "asc" },
  });

  console.log(`\n🎨 ${stories.length} masal için Pollinations URL'leri üretiliyor...\n`);

  const updates: { id: number; title: string; imageUrl: string }[] = [];

  for (const story of stories) {
    const prompt   = buildPrompt(story);
    const imageUrl = pollinationsUrl(prompt, story.id);
    updates.push({ id: story.id, title: story.title, imageUrl });
  }

  // Toplu güncelleme (birer birer — Prisma batch update yok)
  let saved = 0;
  for (const u of updates) {
    await prisma.story.update({
      where: { id: u.id },
      data:  { imageUrl: u.imageUrl },
    });
    saved++;
    if (saved % 20 === 0 || saved === updates.length) {
      console.log(`  ✓ ${saved}/${updates.length} URL güncellendi`);
    }
  }

  console.log(`\n✅ ${saved} masalın görseli güncellendi.\n`);

  if (WARM) {
    await warmImages(updates);
  } else {
    console.log(
      "💡 Görselleri şimdi ön yüklemek için: npm run images:update -- --warm\n"
    );
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
