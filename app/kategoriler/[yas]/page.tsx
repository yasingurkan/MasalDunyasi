export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  getAllCategories,
  getCategoryBySlug,
  getStoriesByCategory,
} from "@/lib/stories";
import type { SortOrder } from "@/types";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import StarBackground from "@/components/layout/StarBackground";
import StoryGrid from "@/components/story/StoryGrid";
import SortingBar from "@/components/ui/SortingBar";
import Pagination from "@/components/ui/Pagination";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface PageProps {
  params: Promise<{ yas: string }>;
  searchParams: Promise<{ siralama?: string; sayfa?: string }>;
}

// ---------------------------------------------------------------------------
// generateMetadata
// ---------------------------------------------------------------------------

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { yas } = await params;
  const category = await getCategoryBySlug(yas);

  if (!category) {
    return { title: "Kategori Bulunamadı" };
  }

  const storyCount = category._count?.stories ?? 0;
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://masaldunyasi.com").replace(/\/$/, "");
  const pageUrl = `${siteUrl}/kategoriler/${yas}`;

  const description = `${category.ageMin}-${category.ageMax} yaş arası çocuklar için ${storyCount}+ Türkçe masal. ${category.description} Sesli okuma özelliği ile masalları dinleyin!`;

  return {
    title: `${category.name} Masalları — ${storyCount}+ Türkçe Hikaye`,
    description,
    keywords: [
      `${category.ageMin} yaş masal`,
      `${category.ageMax} yaş masal`,
      `${category.ageMin}-${category.ageMax} yaş çocuk masalı`,
      `${category.name.toLowerCase()} masalları`,
      "türkçe masal",
      "sesli masal",
      "çocuk masalı",
      "uyku masalı",
    ],
    alternates: { canonical: pageUrl },
    openGraph: {
      title: `${category.name} Masalları — Masal Dünyası`,
      description,
      type: "website",
      locale: "tr_TR",
      url: pageUrl,
    },
  };
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function parseSortOrder(raw: string | undefined): SortOrder {
  const valid: SortOrder[] = ["tarih-yeni", "tarih-eski", "a-z", "z-a"];
  return valid.includes(raw as SortOrder) ? (raw as SortOrder) : "tarih-yeni";
}

function parsePage(raw: string | undefined): number {
  const n = parseInt(raw ?? "1", 10);
  return Number.isFinite(n) && n >= 1 ? n : 1;
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default async function CategoryPage({ params, searchParams }: PageProps) {
  const { yas } = await params;
  const { siralama, sayfa } = await searchParams;

  const sortOrder = parseSortOrder(siralama);
  const page = parsePage(sayfa);

  const [categories, category] = await Promise.all([
    getAllCategories(),
    getCategoryBySlug(yas),
  ]);

  if (!category) {
    notFound();
  }

  const { stories, total, totalPages } = await getStoriesByCategory(yas, sortOrder, page);

  const basePath = `/kategoriler/${yas}`;
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://masaldunyasi.com").replace(/\/$/, "");

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Ana Sayfa", "item": siteUrl },
      { "@type": "ListItem", "position": 2, "name": "Kategoriler", "item": `${siteUrl}/kategoriler` },
      { "@type": "ListItem", "position": 3, "name": `${category.name} Masalları`, "item": `${siteUrl}/kategoriler/${yas}` },
    ],
  };

  const collectionLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": `${category.name} Masalları`,
    "description": category.description,
    "url": `${siteUrl}/kategoriler/${yas}`,
    "inLanguage": "tr",
    "audience": {
      "@type": "Audience",
      "audienceType": "Children",
      "suggestedMinAge": category.ageMin,
      "suggestedMaxAge": category.ageMax,
    },
    "numberOfItems": total,
    "publisher": { "@type": "Organization", "name": "Masal Dünyası", "url": siteUrl },
  };

  return (
    <>
      <StarBackground />
      <div className="relative z-10 flex flex-col min-h-dvh">
        <Header categories={categories} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionLd) }} />

        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col gap-8">
          {/* Category header */}
          <header className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              {/* Icon bubble */}
              <div
                className="flex-shrink-0 flex items-center justify-center w-16 h-16 rounded-2xl text-3xl shadow-lg"
                style={{
                  backgroundColor: `${category.color}22`,
                  border: `2px solid ${category.color}55`,
                }}
                aria-hidden="true"
              >
                {category.icon}
              </div>

              <div className="flex flex-col gap-1">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--color-star)] leading-tight">
                  {category.name}{" "}
                  <span className="text-[var(--color-gold)]">Masalları</span>
                </h1>
                <p className="text-sm text-[var(--color-star)]/60 font-medium">
                  {category.ageMin}–{category.ageMax} yaş &middot;{" "}
                  <span className="text-[var(--color-gold-light)] font-semibold">
                    {(category._count?.stories ?? total).toLocaleString("tr-TR")}
                  </span>{" "}
                  masal
                </p>
              </div>
            </div>

            {category.description && (
              <p className="max-w-2xl text-base text-[var(--color-star)]/70 leading-relaxed">
                {category.description}
              </p>
            )}
          </header>

          {/* Sorting bar */}
          <SortingBar currentSort={sortOrder} totalCount={total} />

          {/* Story grid */}
          <StoryGrid stories={stories} />

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              basePath={basePath}
            />
          )}
        </main>

        <Footer />
      </div>
    </>
  );
}
