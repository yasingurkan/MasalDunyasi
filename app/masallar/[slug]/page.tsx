export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import StoryIllustration from "@/components/story/StoryIllustration";
import {
  getAllCategories,
  getStoryBySlug,
  getRelatedStories,
  incrementViewCount,
} from "@/lib/stories";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import StarBackground from "@/components/layout/StarBackground";
import AgeBadge from "@/components/ui/AgeBadge";
import ReadingTimeBadge from "@/components/ui/ReadingTimeBadge";
import StoryReader from "@/components/story/StoryReader";
import AdUnit from "@/components/ads/AdUnit";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface PageProps {
  params: Promise<{ slug: string }>;
}

// ---------------------------------------------------------------------------
// generateMetadata
// ---------------------------------------------------------------------------

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const story = await getStoryBySlug(slug);

  if (!story) {
    return { title: "Masal Bulunamadı" };
  }

  const imageSlug = encodeURIComponent(story.imageQuery.replace(/\s+/g, "-"));
  const ogImage =
    story.imageUrl ?? `https://picsum.photos/seed/${imageSlug}/1200/630`;

  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://masaldunyasi.com").replace(/\/$/, "");
  const pageUrl = `${siteUrl}/masallar/${story.slug}`;
  const enrichedDesc = `${story.excerpt} ${story.category?.name ? `${story.category.name} kategorisinde` : ""} ${story.ageMin}-${story.ageMax} yaş için Türkçe masal. Sesli dinleyin!`;

  return {
    title: `${story.title} — Türkçe Masal`,
    description: enrichedDesc.slice(0, 160),
    keywords: [
      "türkçe masal",
      story.title,
      story.source,
      story.category?.name ?? "",
      `${story.ageMin}-${story.ageMax} yaş masal`,
      "sesli masal",
      "çocuk masalı",
      ...story.tags,
    ].filter(Boolean),
    alternates: { canonical: pageUrl },
    openGraph: {
      title: story.title,
      description: story.excerpt,
      type: "article",
      locale: "tr_TR",
      url: pageUrl,
      siteName: "Masal Dünyası",
      images: [{ url: ogImage, width: 1200, height: 630, alt: story.title }],
      publishedTime: story.uploadedAt.toISOString(),
      modifiedTime: story.updatedAt.toISOString(),
    },
    twitter: {
      card: "summary_large_image",
      title: story.title,
      description: story.excerpt,
      images: [ogImage],
    },
  };
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default async function StoryPage({ params }: PageProps) {
  const { slug } = await params;

  const [categories, story] = await Promise.all([
    getAllCategories(),
    getStoryBySlug(slug),
  ]);

  if (!story) {
    notFound();
  }

  const relatedStories = await getRelatedStories(story.categoryId, story.slug, 4);

  // Fire-and-forget — do not block render
  void incrementViewCount(slug);

  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://masaldunyasi.com").replace(/\/$/, "");

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Ana Sayfa", "item": siteUrl },
      ...(story.category ? [
        { "@type": "ListItem", "position": 2, "name": story.category.name, "item": `${siteUrl}/kategoriler/${story.category.slug}` },
      ] : []),
      { "@type": "ListItem", "position": story.category ? 3 : 2, "name": story.title, "item": `${siteUrl}/masallar/${story.slug}` },
    ],
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": story.title,
    "description": story.excerpt,
    "inLanguage": "tr",
    "url": `${siteUrl}/masallar/${story.slug}`,
    "author": { "@type": "Organization", "name": "Masal Dünyası" },
    "publisher": {
      "@type": "Organization",
      "name": "Masal Dünyası",
      "url": siteUrl,
    },
    "datePublished": story.uploadedAt.toISOString(),
    "dateModified": story.updatedAt.toISOString(),
    "genre": "Children's Story",
    "keywords": story.tags.join(", "),
    "audience": {
      "@type": "Audience",
      "audienceType": "Children",
      "suggestedMinAge": story.ageMin,
      "suggestedMaxAge": story.ageMax,
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <StarBackground />
      <div className="relative z-10 flex flex-col min-h-dvh">
        <Header categories={categories} />

        <main className="flex-1 w-full">
          {/* ----------------------------------------------------------------
              Hero illustration — full width, fixed height
          ---------------------------------------------------------------- */}
          <div className="relative w-full h-[400px] sm:h-[460px] md:h-[500px] overflow-hidden">
            <StoryIllustration
              slug={story.slug}
              imageQuery={story.imageQuery}
              imageUrl={story.imageUrl}
              categoryColor={story.category?.color}
              categoryIcon={story.category?.icon}
              title={story.title}
              width={1200}
              height={500}
              className="w-full h-full"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0F0A1E] via-[#0F0A1E]/40 to-transparent pointer-events-none" />
          </div>

          {/* ----------------------------------------------------------------
              Content column
          ---------------------------------------------------------------- */}
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col gap-8">
            {/* Story metadata */}
            <header className="flex flex-col gap-4">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--color-star)] leading-tight">
                {story.title}
              </h1>

              <div className="flex flex-wrap items-center gap-2">
                {/* Source badge */}
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-[var(--color-night-card)] text-[var(--color-star)]/70 text-xs font-semibold border border-white/10">
                  {story.source}
                </span>

                {/* Category badge */}
                {story.category && (
                  <Link
                    href={`/kategoriler/${story.category.slug}`}
                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold text-white/90 transition-opacity hover:opacity-80"
                    style={{ backgroundColor: story.category.color }}
                  >
                    {story.category.icon}&nbsp;{story.category.name}
                  </Link>
                )}

                {/* Age + reading time badges */}
                <AgeBadge ageMin={story.ageMin} ageMax={story.ageMax} />
                <ReadingTimeBadge minutes={story.readingMinutes} />

                {/* View count */}
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[var(--color-night-card)] text-[var(--color-star)]/40 text-xs font-medium border border-white/5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    className="w-3 h-3"
                    aria-hidden="true"
                  >
                    <path d="M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" />
                    <path
                      fillRule="evenodd"
                      d="M1.38 8a7.014 7.014 0 0 1 13.24 0 7.014 7.014 0 0 1-13.24 0ZM8 5a3 3 0 1 0 0 6A3 3 0 0 0 8 5Z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {story.viewCount.toLocaleString("tr-TR")}
                </span>
              </div>

              {/* Excerpt as lead paragraph */}
              {story.excerpt && (
                <p className="text-[var(--color-star)]/70 text-base leading-relaxed italic border-l-2 border-[var(--color-purple)] pl-4">
                  {story.excerpt}
                </p>
              )}
            </header>

            {/* Reklam — içerik öncesi */}
            <AdUnit
              slot="5427124054"
              format="auto"
              className="my-2 rounded-xl overflow-hidden"
            />

            {/* ----------------------------------------------------------------
                Audio player + highlighted story text (client component island)
            ---------------------------------------------------------------- */}
            <section aria-label="Masal metni ve sesli okuma">
              <StoryReader content={story.content} />
            </section>

            {/* Reklam — içerik sonrası */}
            <AdUnit
              slot="7572421183"
              format="auto"
              className="my-4 rounded-xl overflow-hidden"
            />

            {/* ----------------------------------------------------------------
                Tags
            ---------------------------------------------------------------- */}
            {story.tags.length > 0 && (
              <section aria-label="Etiketler">
                <h2 className="text-sm font-bold uppercase tracking-widest text-[var(--color-gold)] mb-3">
                  Etiketler
                </h2>
                <div className="flex flex-wrap gap-2">
                  {story.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 rounded-full text-xs font-semibold bg-[var(--color-night-card)] text-[var(--color-star)]/70 border border-[var(--color-purple)]/30"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* Characters */}
            {story.characters.length > 0 && (
              <section aria-label="Karakterler">
                <h2 className="text-sm font-bold uppercase tracking-widest text-[var(--color-gold)] mb-3">
                  Karakterler
                </h2>
                <div className="flex flex-wrap gap-2">
                  {story.characters.map((char) => (
                    <span
                      key={char}
                      className="px-3 py-1 rounded-full text-xs font-semibold bg-[var(--color-purple)]/20 text-[var(--color-purple-light)] border border-[var(--color-purple)]/40"
                    >
                      {char}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* ----------------------------------------------------------------
                Benzer Masallar — iç bağlantı / SEO
            ---------------------------------------------------------------- */}
            {relatedStories.length > 0 && (
              <section aria-labelledby="related-heading" className="pt-6 border-t border-[var(--color-purple)]/20">
                <h2
                  id="related-heading"
                  className="text-sm font-bold uppercase tracking-widest text-[var(--color-gold)] mb-4"
                >
                  Benzer Masallar
                </h2>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {relatedStories.map((r) => (
                    <li key={r.slug}>
                      <Link
                        href={`/masallar/${r.slug}`}
                        className="flex items-start gap-3 p-3 rounded-xl bg-[var(--color-night-card)] border border-[var(--color-purple)]/20 hover:border-[var(--color-purple)]/50 transition-colors duration-150 group"
                      >
                        <div className="flex flex-col gap-1 min-w-0">
                          <span className="text-sm font-semibold text-[var(--color-star)] group-hover:text-[var(--color-gold)] transition-colors line-clamp-2 leading-snug">
                            {r.title}
                          </span>
                          <span className="text-xs text-[var(--color-star)]/40">
                            {r.readingMinutes} dk okuma
                          </span>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* ----------------------------------------------------------------
                Back navigation
            ---------------------------------------------------------------- */}
            <div className="pt-4 border-t border-[var(--color-purple)]/20 flex flex-wrap items-center gap-3">
              {story.category && (
                <Link
                  href={`/kategoriler/${story.category.slug}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold border border-[var(--color-purple)]/40 text-[var(--color-star)]/80 bg-[var(--color-night-card)] hover:text-[var(--color-gold)] hover:border-[var(--color-purple)] transition-colors duration-150"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    className="w-4 h-4"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M9.78 4.22a.75.75 0 0 1 0 1.06L7.06 8l2.72 2.72a.75.75 0 1 1-1.06 1.06L5.47 8.53a.75.75 0 0 1 0-1.06l3.25-3.25a.75.75 0 0 1 1.06 0Z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {story.category.name} Masallarına Dön
                </Link>
              )}

              <Link
                href="/"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold border border-[var(--color-purple)]/40 text-[var(--color-star)]/60 bg-[var(--color-night-card)] hover:text-[var(--color-gold)] hover:border-[var(--color-purple)] transition-colors duration-150"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="w-4 h-4"
                  aria-hidden="true"
                >
                  <path d="M8.543 2.232a.75.75 0 0 0-1.085 0l-5.25 5.5A.75.75 0 0 0 2.75 9H4v4.75A.25.25 0 0 0 4.25 14h2.5a.25.25 0 0 0 .25-.25v-3.5a.25.25 0 0 1 .25-.25h1.5a.25.25 0 0 1 .25.25v3.5c0 .138.112.25.25.25h2.5a.25.25 0 0 0 .25-.25V9h1.25a.75.75 0 0 0 .543-1.268l-5.25-5.5Z" />
                </svg>
                Ana Sayfa
              </Link>
            </div>
          </div>
        </main>

        <Footer />
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
