export const dynamic = "force-dynamic";

import Link from 'next/link';
import { getAllCategories, getFeaturedStories } from '@/lib/stories';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import StarBackground from '@/components/layout/StarBackground';
import StoryGrid from '@/components/story/StoryGrid';
import AdUnit from '@/components/ads/AdUnit';
import type { AgeCategory } from '@/types';

// ---------------------------------------------------------------------------
// Category card — server-rendered, no client JS required
// ---------------------------------------------------------------------------

interface CategoryCardProps {
  category: AgeCategory & { _count?: { stories: number } };
}

function CategoryCard({ category }: CategoryCardProps) {
  const storyCount = category._count?.stories ?? 0;

  return (
    <Link
      href={`/kategoriler/${category.slug}`}
      className="group relative flex flex-col items-center gap-3 rounded-2xl p-5 text-center transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F59E0B] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0F0A1E]"
      style={{
        backgroundColor: '#231545',
        border: `1px solid ${category.color}30`,
      }}
      aria-label={`${category.label} — ${storyCount} masal`}
      onMouseEnter={undefined}
    >
      {/* Hover glow using pseudo-element via inline style trick */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        style={{
          boxShadow: `0 0 0 1px ${category.color}60, 0 8px 32px ${category.color}30`,
        }}
      />

      {/* Icon */}
      <span
        className="relative z-10 flex items-center justify-center w-14 h-14 rounded-2xl text-3xl leading-none shrink-0 transition-transform duration-200 group-hover:scale-110"
        style={{ backgroundColor: `${category.color}20` }}
        aria-hidden="true"
      >
        {category.icon}
      </span>

      {/* Category name */}
      <span
        className="relative z-10 text-sm font-bold leading-snug"
        style={{ color: category.color }}
      >
        {category.label}
      </span>

      {/* Story count badge */}
      <span
        className="relative z-10 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold"
        style={{
          backgroundColor: `${category.color}18`,
          color: '#FCD34D',
          border: `1px solid ${category.color}35`,
        }}
      >
        {storyCount.toLocaleString('tr-TR')} masal
      </span>
    </Link>
  );
}

// ---------------------------------------------------------------------------
// Homepage (async server component)
// ---------------------------------------------------------------------------

export default async function HomePage() {
  const [categories, featuredStories] = await Promise.all([
    getAllCategories(),
    getFeaturedStories(6),
  ]);

  return (
    <>
      <StarBackground />

      <div className="relative z-10 flex flex-col flex-1">
        <Header categories={categories} />

        <main className="flex-1">
          {/* ----------------------------------------------------------------
              1. Hero section
          ---------------------------------------------------------------- */}
          <section
            aria-labelledby="hero-heading"
            className="relative overflow-hidden py-20 sm:py-28 lg:py-36"
          >
            {/* Radial glow behind the hero text */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  'radial-gradient(ellipse 80% 60% at 50% 40%, rgba(107,33,168,0.22) 0%, transparent 70%)',
              }}
            />

            <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center gap-8">
              {/* Eyebrow badge */}
              <span
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase"
                style={{
                  backgroundColor: 'rgba(107,33,168,0.25)',
                  border: '1px solid rgba(107,33,168,0.5)',
                  color: '#FCD34D',
                }}
              >
                ✨ Türk Çocukları İçin
              </span>

              {/* Main title */}
              <h1
                id="hero-heading"
                className="shimmer-text text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight"
              >
                🌙 Masal Dünyası&apos;na Hoş Geldiniz
              </h1>

              {/* Subtitle */}
              <p
                className="max-w-2xl text-lg sm:text-xl leading-relaxed font-medium"
                style={{ color: '#C4BBDB' }}
              >
                1–12 yaş arası çocuklar için 1.200&apos;den fazla Türkçe masal
              </p>

              {/* CTA buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mt-2">
                <Link
                  href="/kategoriler/3-yas"
                  className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl text-base font-bold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F59E0B]"
                  style={{
                    backgroundColor: '#F59E0B',
                    color: '#0F0A1E',
                    boxShadow: '0 4px 24px rgba(245,158,11,0.35)',
                  }}
                >
                  <span aria-hidden="true">📖</span> Masallara Göz At
                </Link>
                <Link
                  href="/kategoriler"
                  className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl text-base font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6B21A8]"
                  style={{
                    backgroundColor: 'rgba(107,33,168,0.22)',
                    color: '#F3F0FF',
                    border: '1px solid rgba(107,33,168,0.45)',
                  }}
                >
                  <span aria-hidden="true">🗂️</span> Tüm Kategoriler
                </Link>
              </div>

              {/* Trust indicators */}
              <div
                className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs font-semibold"
                style={{ color: '#9C92B8' }}
              >
                <span className="flex items-center gap-1.5">
                  <span aria-hidden="true">🔊</span> Sesli Okuma
                </span>
                <span className="flex items-center gap-1.5">
                  <span aria-hidden="true">🇹🇷</span> %100 Türkçe İçerik
                </span>
                <span className="flex items-center gap-1.5">
                  <span aria-hidden="true">📚</span> 1.200+ Masal
                </span>
              </div>
            </div>
          </section>

          {/* ----------------------------------------------------------------
              2. Age categories grid
          ---------------------------------------------------------------- */}
          <section
            aria-labelledby="categories-heading"
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20"
          >
            <div className="flex flex-col items-center gap-3 mb-10 text-center">
              <h2
                id="categories-heading"
                className="text-2xl sm:text-3xl font-extrabold text-[#F3F0FF]"
              >
                Yaş Gruplarına Göre Masallar
              </h2>
              <p className="text-sm sm:text-base max-w-xl" style={{ color: '#9C92B8' }}>
                Çocuğunuzun yaşına uygun masalları keşfedin. Her yaş grubu için özenle seçilmiş
                hikayeler sizi bekliyor.
              </p>
            </div>

            {categories.length > 0 ? (
              <ul
                className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"
                role="list"
                aria-label="Yaş kategorileri"
              >
                {categories.map((category) => (
                  <li key={category.id}>
                    <CategoryCard category={category} />
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center py-12" style={{ color: '#9C92B8' }}>
                Kategoriler yüklenirken bir hata oluştu. Lütfen sayfayı yenileyin.
              </p>
            )}
          </section>

          {/* Reklam — kategori ızgarası altı */}
          <div className="max-w-4xl mx-auto px-4 pb-8">
            <AdUnit slot="5507015106" format="auto" className="rounded-xl overflow-hidden" />
          </div>

          {/* ----------------------------------------------------------------
              3. Featured stories section
          ---------------------------------------------------------------- */}
          <section
            aria-labelledby="featured-heading"
            className="py-16 sm:py-20"
            style={{
              background:
                'linear-gradient(180deg, transparent 0%, rgba(35,21,69,0.35) 30%, rgba(35,21,69,0.35) 70%, transparent 100%)',
            }}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-10">
                <div className="flex flex-col gap-2">
                  <h2
                    id="featured-heading"
                    className="text-2xl sm:text-3xl font-extrabold text-[#F3F0FF]"
                  >
                    <span aria-hidden="true">⭐ </span>Öne Çıkan Masallar
                  </h2>
                  <p className="text-sm" style={{ color: '#9C92B8' }}>
                    Editörlerimiz tarafından öne çıkarılan en sevilen masallar
                  </p>
                </div>
                <Link
                  href="/kategoriler"
                  className="shrink-0 text-sm font-bold transition-colors duration-150 hover:text-[#FCD34D] focus-visible:outline-none focus-visible:underline"
                  style={{ color: '#F59E0B' }}
                >
                  Tümünü Gör →
                </Link>
              </div>

              {featuredStories.length > 0 ? (
                <StoryGrid stories={featuredStories} />
              ) : (
                <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
                  <span className="text-5xl" aria-hidden="true">📖</span>
                  <p style={{ color: '#9C92B8' }}>Henüz öne çıkan masal eklenmemiş.</p>
                </div>
              )}
            </div>
          </section>

          {/* ----------------------------------------------------------------
              4. About section
          ---------------------------------------------------------------- */}
          <section
            aria-labelledby="about-heading"
            className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24"
          >
            {/* Decorative separator */}
            <div
              aria-hidden="true"
              className="w-24 h-0.5 mx-auto mb-12 rounded-full"
              style={{
                background: 'linear-gradient(90deg, transparent, #6B21A8, transparent)',
              }}
            />

            <div
              className="rounded-3xl p-8 sm:p-12 flex flex-col gap-8"
              style={{
                backgroundColor: '#1A1035',
                border: '1px solid rgba(107,33,168,0.3)',
                boxShadow: '0 8px 48px rgba(15,10,30,0.6)',
              }}
            >
              <div className="flex flex-col gap-3 text-center">
                <h2
                  id="about-heading"
                  className="text-2xl sm:text-3xl font-extrabold text-[#F3F0FF]"
                >
                  Masal Dünyası Hakkında
                </h2>
                <p className="text-sm sm:text-base leading-relaxed mx-auto max-w-2xl" style={{ color: '#C4BBDB' }}>
                  Masal Dünyası, Türkiye&apos;nin en kapsamlı çocuk masalları platformudur.
                  1–12 yaş arası çocuklar için 1.200&apos;den fazla Türkçe masal, ninni ve hikaye
                  sunuyoruz.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {[
                  {
                    icon: '🔊',
                    title: 'Sesli Okuma',
                    desc: 'Tüm masallar sesli okuma özelliğiyle gelir. Çocuğunuz masalları hem okuyabilir hem de dinleyebilir.',
                  },
                  {
                    icon: '🇹🇷',
                    title: 'Türkçe İçerik',
                    desc: 'Tüm masallar özenle Türkçe olarak hazırlanmıştır. Keloğlan, Nasreddin Hoca ve daha fazlası.',
                  },
                  {
                    icon: '🛡️',
                    title: 'KVKK Uyumlu',
                    desc: 'Kişisel Verilerin Korunması Kanunu (KVKK) kapsamında verileriniz güvende. Çocuğunuzun gizliliği önceliğimiz.',
                  },
                ].map(({ icon, title, desc }) => (
                  <div
                    key={title}
                    className="flex flex-col items-center sm:items-start gap-3 p-5 rounded-2xl text-center sm:text-left"
                    style={{
                      backgroundColor: 'rgba(35,21,69,0.6)',
                      border: '1px solid rgba(107,33,168,0.2)',
                    }}
                  >
                    <span className="text-3xl" aria-hidden="true">{icon}</span>
                    <h3 className="text-sm font-bold text-[#F3F0FF]">{title}</h3>
                    <p className="text-xs leading-relaxed" style={{ color: '#9C92B8' }}>
                      {desc}
                    </p>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                <Link
                  href="/kategoriler/3-yas"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F59E0B]"
                  style={{
                    backgroundColor: '#F59E0B',
                    color: '#0F0A1E',
                  }}
                >
                  <span aria-hidden="true">🌙</span> Hemen Masal Oku
                </Link>
                <Link
                  href="/kvkk"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6B21A8]"
                  style={{
                    backgroundColor: 'transparent',
                    color: '#9333EA',
                    border: '1px solid rgba(107,33,168,0.4)',
                  }}
                >
                  KVKK Metnini İncele
                </Link>
              </div>
            </div>
          </section>
        </main>

        {/* SSS — FAQ yapılandırılmış verisi için görünmez bölüm */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": [
                {
                  "@type": "Question",
                  "name": "Masal Dünyası'nda kaç masal var?",
                  "acceptedAnswer": { "@type": "Answer", "text": "Masal Dünyası'nda 1-12 yaş arası çocuklar için 1.000'den fazla Türkçe masal bulunmaktadır. Keloğlan, Nasreddin Hoca, Grimm masalları ve daha fazlası." }
                },
                {
                  "@type": "Question",
                  "name": "Masallar sesli okunuyor mu?",
                  "acceptedAnswer": { "@type": "Answer", "text": "Evet! Tüm masallar doğal yapay zeka sesiyle sesli okunabilir. Cümle cümle vurgulama özelliği sayesinde çocuklar takip edebilir." }
                },
                {
                  "@type": "Question",
                  "name": "Hangi yaş grubu için masal var?",
                  "acceptedAnswer": { "@type": "Answer", "text": "Masal Dünyası'nda 1 yaştan 12 yaşa kadar tüm çocuklar için yaşa uygun masallar mevcuttur. Her kategoride 100'den fazla masal bulabilirsiniz." }
                },
                {
                  "@type": "Question",
                  "name": "Masallar ücretsiz mi?",
                  "acceptedAnswer": { "@type": "Answer", "text": "Evet, Masal Dünyası'ndaki tüm masallar tamamen ücretsizdir. Kayıt olmadan hemen okuyabilir ve dinleyebilirsiniz." }
                },
                {
                  "@type": "Question",
                  "name": "Hangi masallar var?",
                  "acceptedAnswer": { "@type": "Answer", "text": "Keloğlan masalları, Nasreddin Hoca fıkraları, Grimm kardeşler masalları, Binbir Gece Masalları, Hans Christian Andersen masalları, Türk halk masalları ve özgün Türkçe masallar bulunmaktadır." }
                },
              ],
            }),
          }}
        />

        <Footer />
      </div>
    </>
  );
}
