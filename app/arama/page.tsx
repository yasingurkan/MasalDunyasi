export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Link from "next/link";
import { getAllCategories, searchStories } from "@/lib/stories";
import type { StoryListItem } from "@/types";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import StarBackground from "@/components/layout/StarBackground";
import StoryGrid from "@/components/story/StoryGrid";

interface PageProps {
  searchParams: Promise<{ q?: string }>;
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const { q } = await searchParams;
  const query = q?.trim() ?? '';
  return {
    title: query
      ? `"${query}" için Arama Sonuçları | Masal Dünyası`
      : 'Masal Ara | Masal Dünyası',
    description: query
      ? `"${query}" için Masal Dünyası'ndaki arama sonuçları.`
      : '1-12 yaş arası çocuklar için Türkçe masallarda arama yapın.',
    robots: { index: false, follow: true },
  };
}

export default async function AramaPage({ searchParams }: PageProps) {
  const { q } = await searchParams;
  const query = q?.trim() ?? '';

  const [categories, rawStories] = await Promise.all([
    getAllCategories(),
    query.length >= 2 ? searchStories(query) : Promise.resolve([]),
  ]);
  // searchStories returns a Prisma-narrowed select; cast is safe because
  // StoryCard only accesses category.name/color/icon which are all selected.
  const stories = rawStories as unknown as StoryListItem[];

  return (
    <>
      <StarBackground />
      <div className="relative z-10 flex flex-col min-h-dvh">
        <Header categories={categories} />

        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col gap-8">
          {/* Page header */}
          <header className="flex flex-col gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F3F0FF]">
              {query ? (
                <>
                  <span className="text-[#9C92B8] font-semibold text-lg sm:text-xl block mb-1">
                    Arama sonuçları:
                  </span>
                  &ldquo;{query}&rdquo;
                </>
              ) : (
                '🔍 Masal Ara'
              )}
            </h1>
            {stories.length > 0 && (
              <p className="text-sm" style={{ color: '#9C92B8' }}>
                {stories.length} masal bulundu
              </p>
            )}
          </header>

          {/* Results */}
          {query.length < 2 ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
              <span className="text-6xl" aria-hidden="true">🔍</span>
              <p className="text-lg font-semibold text-[#F3F0FF]">Masal aramak için en az 2 karakter girin</p>
              <p className="text-sm" style={{ color: '#9C92B8' }}>
                Yukarıdaki arama kutusunu kullanabilirsiniz.
              </p>
            </div>
          ) : stories.length > 0 ? (
            <StoryGrid stories={stories} />
          ) : (
            <div className="flex flex-col items-center justify-center py-24 gap-6 text-center">
              <span className="text-6xl" aria-hidden="true">📭</span>
              <div className="flex flex-col gap-2">
                <p className="text-lg font-semibold text-[#F3F0FF]">
                  &ldquo;{query}&rdquo; için sonuç bulunamadı
                </p>
                <p className="text-sm" style={{ color: '#9C92B8' }}>
                  Farklı bir kelime deneyin veya kategorilere göz atın.
                </p>
              </div>
              <Link
                href="/kategoriler"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all duration-200"
                style={{ backgroundColor: '#F59E0B', color: '#0F0A1E' }}
              >
                🗂️ Kategorilere Git
              </Link>
            </div>
          )}
        </main>

        <Footer />
      </div>
    </>
  );
}
