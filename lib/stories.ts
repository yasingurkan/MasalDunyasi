import { prisma } from "./db";
import type { SortOrder, PaginatedStories } from "@/types";

const PER_PAGE = 24;

function buildOrderBy(sort: SortOrder) {
  switch (sort) {
    case "tarih-yeni":
      return { uploadedAt: "desc" as const };
    case "tarih-eski":
      return { uploadedAt: "asc" as const };
    case "a-z":
      return { title: "asc" as const };
    case "z-a":
      return { title: "desc" as const };
    default:
      return { uploadedAt: "desc" as const };
  }
}

export async function getAllCategories() {
  return prisma.ageCategory.findMany({
    orderBy: { ageMin: "asc" },
    include: { _count: { select: { stories: true } } },
  });
}

export async function getCategoryBySlug(slug: string) {
  return prisma.ageCategory.findUnique({
    where: { slug },
    include: { _count: { select: { stories: true } } },
  });
}

export async function getStoriesByCategory(
  categorySlug: string,
  sort: SortOrder = "tarih-yeni",
  page: number = 1
): Promise<PaginatedStories> {
  const skip = (page - 1) * PER_PAGE;
  const orderBy = buildOrderBy(sort);

  const category = await prisma.ageCategory.findUnique({
    where: { slug: categorySlug },
  });
  if (!category) return { stories: [], total: 0, page, totalPages: 0, perPage: PER_PAGE };

  const [stories, total] = await Promise.all([
    prisma.story.findMany({
      where: { categoryId: category.id },
      orderBy,
      skip,
      take: PER_PAGE,
      select: {
        id: true,
        slug: true,
        title: true,
        excerpt: true,
        ageMin: true,
        ageMax: true,
        readingMinutes: true,
        wordCount: true,
        source: true,
        sourceType: true,
        imageQuery: true,
        imageUrl: true,
        categoryId: true,
        featured: true,
        viewCount: true,
        uploadedAt: true,
        updatedAt: true,
      },
    }),
    prisma.story.count({ where: { categoryId: category.id } }),
  ]);

  return {
    stories,
    total,
    page,
    totalPages: Math.ceil(total / PER_PAGE),
    perPage: PER_PAGE,
  };
}

export async function getStoryBySlug(slug: string) {
  return prisma.story.findUnique({
    where: { slug },
    include: { category: true },
  });
}

export async function getFeaturedStories(limit = 6) {
  return prisma.story.findMany({
    where: { featured: true },
    take: limit,
    orderBy: { uploadedAt: "desc" },
    select: {
      id: true,
      slug: true,
      title: true,
      excerpt: true,
      ageMin: true,
      ageMax: true,
      readingMinutes: true,
      wordCount: true,
      source: true,
      sourceType: true,
      imageQuery: true,
      imageUrl: true,
      categoryId: true,
      featured: true,
      viewCount: true,
      uploadedAt: true,
      updatedAt: true,
      category: { select: { name: true, slug: true, color: true } },
    },
  });
}

export async function getRelatedStories(categoryId: number, excludeSlug: string, limit = 4) {
  return prisma.story.findMany({
    where: { categoryId, slug: { not: excludeSlug } },
    orderBy: { viewCount: "desc" },
    take: limit,
    select: {
      id: true, slug: true, title: true, excerpt: true,
      ageMin: true, ageMax: true, readingMinutes: true, wordCount: true,
      source: true, sourceType: true, imageQuery: true, imageUrl: true,
      categoryId: true, featured: true, viewCount: true,
      uploadedAt: true, updatedAt: true,
      category: { select: { name: true, slug: true, color: true } },
    },
  });
}

export async function incrementViewCount(slug: string) {
  return prisma.story.update({
    where: { slug },
    data: { viewCount: { increment: 1 } },
  });
}

export async function searchStories(query: string) {
  return prisma.story.findMany({
    where: {
      OR: [
        { title: { contains: query, mode: "insensitive" } },
        { excerpt: { contains: query, mode: "insensitive" } },
        { source: { contains: query, mode: "insensitive" } },
        { tags: { hasSome: [query.toLowerCase()] } },
      ],
    },
    take: 48,
    orderBy: { viewCount: "desc" },
    select: {
      id: true,
      slug: true,
      title: true,
      excerpt: true,
      ageMin: true,
      ageMax: true,
      readingMinutes: true,
      wordCount: true,
      source: true,
      sourceType: true,
      imageQuery: true,
      imageUrl: true,
      categoryId: true,
      featured: true,
      viewCount: true,
      uploadedAt: true,
      updatedAt: true,
      category: { select: { name: true, slug: true, color: true, icon: true } },
    },
  });
}
