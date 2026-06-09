export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Link from "next/link";
import { getAllCategories } from "@/lib/stories";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import StarBackground from "@/components/layout/StarBackground";

export async function generateMetadata(): Promise<Metadata> {
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://masaldunyasi.com").replace(/\/$/, "");

  return {
    title: "Tüm Kategoriler — Yaş Gruplarına Göre Türkçe Masallar",
    description: "1 yaştan 12 yaşa kadar tüm yaş gruplarına özel Türkçe masallar. Yaş kategorisine göre çocuğunuza uygun masalları keşfedin.",
    keywords: ["yaş kategorileri", "türkçe masal kategorileri", "çocuk masalları yaşa göre", "1 yaş masal", "12 yaş masal"],
    alternates: { canonical: `${siteUrl}/kategoriler` },
    openGraph: {
      title: "Tüm Kategoriler — Masal Dünyası",
      description: "Yaş gruplarına göre Türkçe masal kategorileri",
      type: "website",
      locale: "tr_TR",
      url: `${siteUrl}/kategoriler`,
    },
  };
}

export default async function CategoriesIndexPage() {
  const categories = await getAllCategories();
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://masaldunyasi.com").replace(/\/$/, "");

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Ana Sayfa", "item": siteUrl },
      { "@type": "ListItem", "position": 2, "name": "Kategoriler", "item": `${siteUrl}/kategoriler` },
    ],
  };

  const totalStories = categories.reduce((sum, c) => sum + (c._count?.stories ?? 0), 0);

  return (
    <>
      <StarBackground />
      <div className="relative z-10 flex flex-col min-h-dvh">
        <Header categories={categories} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
        />

        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col gap-10">
          <header className="flex flex-col gap-3">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--color-star)] leading-tight">
              Tüm <span className="text-[var(--color-gold)]">Kategoriler</span>
            </h1>
            <p className="text-base text-[var(--color-star)]/70 max-w-2xl leading-relaxed">
              1 yaştan 12 yaşa kadar her yaş grubuna özel hazırlanmış{" "}
              <span className="text-[var(--color-gold-light)] font-semibold">
                {totalStories.toLocaleString("tr-TR")}
              </span>{" "}
              Türkçe masal. Çocuğunuzun yaşına uygun kategoriyi seçin.
            </p>
          </header>

          <section aria-label="Yaş kategorileri">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((category) => {
                const storyCount = category._count?.stories ?? 0;
                return (
                  <Link
                    key={category.id}
                    href={`/kategoriler/${category.slug}`}
                    className="group flex items-center gap-4 p-5 rounded-2xl bg-[var(--color-night-card)] border border-[var(--color-purple)]/20 hover:border-[var(--color-purple)]/60 transition-colors duration-150"
                  >
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

                    <div className="flex flex-col gap-1 min-w-0">
                      <h2 className="text-lg font-extrabold text-[var(--color-star)] group-hover:text-[var(--color-gold)] transition-colors leading-tight">
                        {category.name}
                      </h2>
                      <p className="text-sm text-[var(--color-star)]/60 font-medium">
                        {category.ageMin}–{category.ageMax} yaş ·{" "}
                        <span className="text-[var(--color-gold-light)] font-semibold">
                          {storyCount.toLocaleString("tr-TR")}
                        </span>{" "}
                        masal
                      </p>
                      {category.description && (
                        <p className="text-xs text-[var(--color-star)]/50 mt-1 line-clamp-2 leading-relaxed">
                          {category.description}
                        </p>
                      )}
                    </div>

                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 16 16"
                      fill="currentColor"
                      className="w-5 h-5 ml-auto text-[var(--color-star)]/40 group-hover:text-[var(--color-gold)] transition-colors"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M6.22 3.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L9.94 8 6.22 4.28a.75.75 0 0 1 0-1.06Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </Link>
                );
              })}
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
}
