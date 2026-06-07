# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Komutlar

```bash
# Geliştirme
npm run dev           # Geliştirme sunucusu (http://localhost:3000)
npm run build         # Üretim build'i
npm run lint          # ESLint (tek kod kalitesi aracı — test framework yok)

# Veritabanı
npm run db:generate   # Schema değişikliklerinden sonra Prisma client üret
npm run db:migrate    # Bekleyen migration'ları uygula (deploy modu)
npm run db:push       # Migration oluşturmadan schema'yı gönder (geliştirme kısayolu)
npm run db:seed       # Veritabanını masal ve kategorilerle doldur
npm run db:studio     # Prisma Studio'yu aç

# Docker (tam yığın)
docker compose up -d  # Postgres + uygulamayı başlat (üretim imajı)
docker compose down   # Container'ları durdur

# İçerik üretimi / bakım scriptleri (scripts/ — hepsi ts-node --project tsconfig.seed.json ile çalışır)
npm run stories:rewrite          # DB'deki masalları LLM ile (Gemini varsayılan, PROVIDER=groq) yeniden yazar
npm run stories:generate         # Groq (Llama 3.3 70B) ile yeni masal üretir
npm run stories:fix-lang         # Yabancı dildeki masalları düzeltir
npm run stories:replace-foreign  # Metindeki yabancı kelimeleri Türkçeleştirir
npm run images:update            # Tüm masallara Pollinations.ai görsel URL'si atar (-- --warm ile ön yükler)
npm run db:bulk                  # Toplu masal ekleme (prisma/seed/add-bulk-stories.ts)
```

Test framework yoktur; `playwright` yüklüdür ancak yapılandırılmış bir test paketi yoktur.

### Yerel geliştirme kurulumu

1. `.env.example` → `.env` olarak kopyala (varsayılanlar `docker-compose.yml` ile uyumlu)
2. Postgres'i başlat: `docker compose up -d db`
3. Schema'yı uygula: `npm run db:push`
4. Verileri yükle: `npm run db:seed`
5. Geliştirme sunucusunu başlat: `npm run dev`

## Mimari

**Yığın:** Next.js 16 App Router · TypeScript · Tailwind CSS v4 · Prisma 5 · PostgreSQL 16 · React 19

### Rota yapısı

| Rota | Dosya | Açıklama |
|---|---|---|
| `/` | `app/page.tsx` | Anasayfa — öne çıkan masallar + kategori ızgarası |
| `/kategoriler/[yas]` | `app/kategoriler/[yas]/page.tsx` | Kategori listesi; `siralama` ve `sayfa` search params |
| `/masallar/[slug]` | `app/masallar/[slug]/page.tsx` | Masal detayı + sesli okuma |
| `/arama` | `app/arama/page.tsx` | Arama sayfası; `q` search param (min 2 karakter) |
| `/hakkimizda` | `app/hakkimizda/page.tsx` | Hakkımızda sayfası |
| `/iletisim` | `app/iletisim/page.tsx` | İletişim formu |
| `/kvkk` | `app/kvkk/page.tsx` | KVKK sayfası |
| `/gizlilik-politikasi` | `app/gizlilik-politikasi/page.tsx` | Gizlilik politikası |
| `/api/tts` | `app/api/tts/route.ts` | Edge TTS ses üretimi (GET, `?text=`); MP3 döner — sesli okumanın backend'i |

Tüm sayfalar **async Server Component**'tır. Next.js 16'da `params` ve `searchParams` birer **Promise**'dir — her zaman `await` edilmeli.

Tüm veri getiren sayfalarda `export const dynamic = "force-dynamic"` kullanılır; statik üretim ya da ISR yoktur.

### SEO deseni

Veri gerektiren her sayfada (`/masallar/[slug]`, `/kategoriler/[yas]`, vb.) iki SEO bileşeni bulunur:
- `generateMetadata` — başlık, açıklama, OpenGraph ve Twitter kartları için
- Sayfa JSX içinde `<script type="application/ld+json">` — schema.org JSON-LD yapılandırılmış verisi

`app/sitemap.ts` ve `app/robots.ts`, veritabanını doğrudan sorgulayan özel Next.js dosyalarıdır.

### Veri katmanı

`lib/db.ts` — Prisma singleton (hot-reload döngüleri boyunca tek instance)

`lib/stories.ts` — tüm veritabanı sorguları:
- `getAllCategories` / `getCategoryBySlug` — kategori sorgular
- `getStoriesByCategory(slug, sort, page)` — sayfalanmış liste; `StoryListItem` select döner
- `getStoryBySlug(slug)` — tam içerikle birlikte, `category` include edilir
- `getFeaturedStories(limit)` — öne çıkan masallar
- `searchStories(query)` — başlık/özet/kaynak/tag'de OR araması, max 48 sonuç; viewCount'a göre sıralı
- `incrementViewCount(slug)` — atomik sayaç artırma; sayfa render'ını bloke etmemesi için `void` ile çağrılır

`lib/utils.ts` — saf yardımcı fonksiyonlar: `slugify` (Türkçe karakter desteğiyle), `calcReadingMinutes`, `calcWordCount`, `getExcerpt`, `splitIntoSentences`, `getImageUrl`, `formatReadingTime`, `formatAgeRange`

`types/index.ts` — paylaşımlı TypeScript tipleri: `AgeCategory`, `Story`, `StoryListItem`, `PaginatedStories`, `SortOrder`, `StoryData`, `CookieConsent`, `AudioState`

Sayfalama sayfa başına 24 masaldır (`PER_PAGE = 24`, `lib/stories.ts`). `StoryListItem`, liste görünümlerinde tam masal içeriği çekilmemesi için `content`, `characters` ve `tags` alanlarını dışarıda bırakır.

### Görseller

Masalın `imageUrl` alanı dolu ise öncelikli kullanılır; boşsa `lib/utils.ts:getImageUrl(imageQuery)` ile `picsum.photos` placeholder URL'si üretilir. `imageUrl` alanı `npm run images:update` (`scripts/update-images.ts`) ile `image.pollinations.ai` (flux modeli, 1024×640) URL'leri üretilerek doldurulur; prompt, masalın `imageQuery` + `characters` + `source` alanlarından çizgi-film stilinde kurgulanır.

Görseller `next/image` ile değil, `components/story/StoryIllustration.tsx` içinde CSS `background-image: url(...)` ile çizilir — bu yüzden `next.config.ts` `remotePatterns` (yalnızca `picsum.photos` + Unsplash) görsel host'larını kısıtlamaz; Pollinations URL'leri optimizasyona girmeden doğrudan yüklenir.

### Client component adaları

Çoğu bileşen Server Component'tır. Client `"use client"` işaretli bileşenler:

- `components/layout/Header.tsx` — yapışkan navigasyon; arama formu, dropdown ve mobil çekmece state yönetimi
- `components/story/StoryReader.tsx` — masal içeriğini ve `AudioPlayer`'ı sarar; `currentSentenceIndex` state'ini ikisi arasında taşır
- `components/story/AudioPlayer.tsx` + `lib/speech.ts` — sunucu taraflı **Edge TTS** ile sesli okuma. `lib/speech.ts:createSpeechController` metni paragraflara böler, her paragrafı `/api/tts?text=...` adresine gönderip dönen MP3'ü `HTMLAudioElement` ile çalar; sonraki paragrafı arka planda prefetch eder. Cümle vurgulaması, ses süresi paragraf cümle sayısına bölünerek `setTimeout`'larla zamanlanır (gerçek kelime sınırı yoktur — yaklaşık). `app/api/tts/route.ts`, `msedge-tts` ile `tr-TR-EmelNeural` sesini (`rate -12%`, `pitch -4%`) `runtime = "nodejs"` altında üretir; geçici dosya `os.tmpdir()`'a yazılıp okunduktan sonra silinir, yanıt 1 gün cache'lenir
- `components/story/HighlightedText.tsx` — cümleleri `<span>` olarak render eder; aktif cümleye `sentence-current`, okunmuşlara `sentence-done` CSS sınıfı uygular; aktif cümleyi `scrollIntoView` ile görünüme getirir
- `components/cookie/CookieConsent.tsx` — KVKK çerez onay banner'ı (localStorage)
- `components/ui/SortingBar.tsx` — sıralama kontrolü (URL search param yönetimi)
- `components/contact/ContactForm.tsx` — istemci tarafı doğrulama; backend gönderimi yok (API route ya da Server Action bağlı değil)

### Yazı tipleri

`app/layout.tsx`'te `next/font/google` ile iki font yüklenir ve CSS değişkeni olarak aktarılır:
- `--font-nunito` → gövde metni (weight: 400–900)
- `--font-display` → logo ve başlıklar (`Fredoka One`)

### Stil

Tailwind CSS v4 — **v3 değil**. Temel farklar:
- Yapılandırma `tailwind.config.js` yerine `globals.css` içindeki `@theme { }` bloğunda
- Import `@tailwind base/components/utilities` yerine `@import "tailwindcss"`
- Keyfi değerler hâlâ çalışır: `bg-[#F59E0B]`

`globals.css` içinde tanımlı tasarım token'ları:

| Token | Değer | Kullanım |
|---|---|---|
| `--color-night` | `#0F0A1E` | Sayfa arkaplanı |
| `--color-night-soft` | `#1A1035` | Kart arkaplanları |
| `--color-night-card` | `#231545` | Yükseltilmiş kartlar |
| `--color-purple` | `#6B21A8` | Birincil vurgu |
| `--color-purple-light` | `#9333EA` | Vurgu açık tonu |
| `--color-purple-dark` | `#4C1D95` | Vurgu koyu tonu |
| `--color-gold` | `#F59E0B` | CTA / vurgular |
| `--color-gold-light` | `#FCD34D` | Altın açık tonu |
| `--color-gold-dark` | `#D97706` | Altın koyu tonu |
| `--color-star` | `#FEF9C3` | Birincil metin |
| `--color-read` | `#22C55E` | Okundu göstergeleri |
| `--color-read-bg` | `#14532D` | Okundu arkaplanı |
| `--radius-card` | `1rem` | Kart köşe yarıçapı |
| `--radius-badge` | `9999px` | Rozet/pill köşe yarıçapı |

Token'lara `style={}` prop'larında `var(--color-night)` ya da className'de `text-[var(--color-gold)]` şeklinde erişilir. `globals.css`'te `shimmer-text`, `logo-text`, `sparkle-anim`, `star`, `float-anim`, `sentence-current`, `sentence-done`, `story-card` gibi CSS sınıfları da tanımlıdır.

### Seed verileri

`prisma/seed/` — 1.200'den fazla Türkçe masal yaş grubuna göre düzenlenmiştir (`stories/age-1.ts` … `age-12.ts`). Kategoriler `categories.ts` içindedir. Seed komutu `ts-node --project tsconfig.seed.json` ile çalışır (ayrı bir tsconfig: `tsconfig.seed.json`).

### Ortam değişkenleri

| Değişken | Açıklama |
|---|---|
| `DATABASE_URL` | PostgreSQL bağlantı dizesi (zorunlu) |
| `NEXT_PUBLIC_SITE_URL` | Canonical URL; sitemap ve robots.txt'te kullanılır (ör. `https://masaldunyasi.com`) |
| `GEMINI_API_KEY` | `stories:rewrite` için (Gemini varsayılan sağlayıcı); `.env`'den okunur |
| `GROQ_API_KEY` | `stories:generate` ve `PROVIDER=groq stories:rewrite` için |

Not: içerik scriptleri API anahtarını hem `process.env`'den hem de doğrudan `.env` dosyasını regex'le okuyarak alır.

### Dağıtım

`next.config.ts`, Docker için `output: "standalone"` kullanır. `Dockerfile` 3 aşamalıdır (deps → builder → runner). `docker-entrypoint.sh` önce migration'ları (`prisma migrate deploy`) çalıştırır, ardından sunucuyu başlatır. `docker-compose.yml`, Postgres ve uygulamayı healthcheck bağımlılığıyla birbirine bağlar.

### Notlar

- `@/` import alias'ı proje köküne işaret eder (ör. `@/lib/stories`).
- `framer-motion` ve `playwright` `package.json`'a eklenmiş ancak kod içinde kullanılmıyor (playwright için yapılandırılmış test paketi yok).
- `scripts/rewrite-all-stories.ts` ilerlemeyi `.rewrite-progress.json`'a yazar; `START_OFFSET` verilmezse buradan otomatik devam eder. Gemini günlük kotası dolunca `gemini-2.5-flash → gemini-2.5-flash-lite` modeline geçer.
