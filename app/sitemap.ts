import type { MetadataRoute } from 'next';
import { prisma } from '@/lib/db';

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://masaldunyasi.com').replace(/\/$/, '');

  const [stories, categories] = await Promise.all([
    prisma.story.findMany({ select: { slug: true, updatedAt: true, viewCount: true } }).catch(() => []),
    prisma.ageCategory.findMany({ select: { slug: true } }).catch(() => []),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/kategoriler`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/hakkimizda`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/iletisim`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/kvkk`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/gizlilik-politikasi`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
  ];

  const categoryRoutes: MetadataRoute.Sitemap = categories.map((c) => ({
    url: `${baseUrl}/kategoriler/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.85,
  }));

  // Popüler masallar (viewCount > 10) daha yüksek öncelik alır
  const storyRoutes: MetadataRoute.Sitemap = stories.map((s) => ({
    url: `${baseUrl}/masallar/${s.slug}`,
    lastModified: s.updatedAt,
    changeFrequency: 'monthly' as const,
    priority: s.viewCount > 100 ? 0.9 : s.viewCount > 10 ? 0.8 : 0.7,
  }));

  return [...staticRoutes, ...categoryRoutes, ...storyRoutes];
}
