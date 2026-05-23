/**
 * Bulk Story Orchestrator
 *
 * SMART:
 *   S - Her 12 kategoride ≥100 masal; her masalda readingMinutes ≥ 10
 *   M - COUNT(*) GROUP BY categoryId → tümü ≥100
 *   A - Pool-tabanlı üretici, 87-90 yeni masal/kategori
 *   R - StoryData tipiyle tam uyumlu
 *   T - Bu oturumda tamamlanır
 *
 * Gherkin:
 *   Scenario: Her kategori 100 masala ulaşır
 *     Given 12 yaş kategorisi var
 *     When bulk-seed çalışır
 *     Then COUNT per category >= 100
 *
 *   Scenario: Yeni masallar ≥10 dk okuma içerir
 *     Given içerik motoru ~1150 kelime üretir
 *     Then ceil(wordCount / 100) >= 11
 *
 *   Scenario: Yapı uyumu
 *     Then slug benzersiz; tüm alanlar dolu; imageQuery İngilizce
 */

import type { StoryData } from "../types-seed";
import { POOLS, getLevel, pickItem } from "./pools";
import { generateContent } from "./engine";

// ── Slug yardımcısı ───────────────────────────────────────────────────────────

function slugify(text: string): string {
  const map: Record<string, string> = {
    ç:"c", Ç:"c", ğ:"g", Ğ:"g", ı:"i", İ:"i",
    ö:"o", Ö:"o", ş:"s", Ş:"s", ü:"u", Ü:"u",
  };
  return text
    .replace(/[çÇğĞıİöÖşŞüÜ]/g, c => map[c] ?? c)
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

// ── Başlık üreticisi ──────────────────────────────────────────────────────────

function buildTitle(
  pattern: string,
  heroName: string,
  conflictShort: string
): string {
  return pattern
    .replace(/\{K\}/g, heroName)
    .replace(/\{S\}/g, conflictShort);
}

// ── imageQuery üreticisi ─────────────────────────────────────────────────────

function buildImageQuery(
  hero: { name: string; type: string },
  setting: string,
  imageTags: string[]
): string {
  const tags = imageTags.slice(0, 4).join(" ");
  return `${hero.type} ${setting.replace(/'/g, "").split(" ").slice(0, 3).join(" ")} ${tags} cartoon children illustration`.trim();
}

// ── Kategori başına hikaye üretici ───────────────────────────────────────────

export interface CategorySpec {
  categorySlug: string;  // "1-yas", "3-yas" …
  ageMin: number;
  ageMax: number;
  needed: number;        // kaç yeni masal gerekiyor
  existingSlugs: Set<string>;
}

export function generateStoriesForCategory(spec: CategorySpec): StoryData[] {
  const { categorySlug, ageMin, ageMax, needed, existingSlugs } = spec;
  const level = getLevel(ageMin);
  const pool  = POOLS[level];
  const stories: StoryData[] = [];
  const usedSlugs = new Set(existingSlugs);
  const usedTitles = new Set<string>();

  let generated = 0;
  let attempt   = 0;
  const MAX_ATTEMPTS = needed * 5;

  while (generated < needed && attempt < MAX_ATTEMPTS) {
    const i = attempt++;
    const prime1 = 7, prime2 = 11, prime3 = 13, prime4 = 17, prime5 = 19;

    const hero     = pickItem(pool.heroes,    i, prime1);
    const setting  = pickItem(pool.settings,  i, prime2);
    const helper   = pickItem(pool.helpers,   i, prime3);
    const conflict = pickItem(pool.conflicts, i, prime4);
    const lesson   = pickItem(pool.lessons,   i, prime5);
    const source   = pickItem(pool.sources,   i, 23);
    const pattern  = pickItem(pool.titlePatterns, i, 29);

    let title = buildTitle(pattern, hero.name, conflict.short);

    // Başlık benzersizliği — çakışırsa helper adı veya ayırt edici ön ek ekle
    if (usedTitles.has(title)) {
      const prefixes = ['Küçük', 'Cesur', 'Bilge', 'Maceracı', 'Yiğit', 'Dürüst', 'Sihirli', 'Şen'];
      const altPatterns = [
        `${hero.name} ile ${helper.name}`,
        `${hero.name}\'nın ${helper.type} Arkadaşı`,
        `${prefixes[i % prefixes.length]} ${hero.name}`,
        `${hero.name} ve ${conflict.short}`,
        `${hero.name}: ${conflict.short}`,
        `${helper.name}\'in ${hero.type} Arkadaşı`,
      ];
      title = altPatterns[i % altPatterns.length];
    }
    if (usedTitles.has(title)) {
      title = `${hero.name} — ${conflict.short} (${generated + 1})`;
    }

    // Slug oluştur ve benzersizliği sağla
    const baseSlug = slugify(title);
    let slug = `${baseSlug}-${slugify(categorySlug)}-${generated + 1}`;
    if (usedSlugs.has(slug)) {
      slug = `${baseSlug}-${slugify(categorySlug)}-${generated + 1}-${i}`;
    }
    if (usedSlugs.has(slug)) continue;

    // İçerik üret
    const content = generateContent(
      {
        K:  hero.name,
        KT: hero.type,
        M:  setting,
        Y:  helper.name,
        YT: helper.type,
        S:  conflict.long,
        D:  lesson,
        level,
      },
      i * 37 + generated * 53
    );

    usedSlugs.add(slug);
    usedTitles.add(title);

    stories.push({
      title,
      slug,
      content,
      ageMin,
      ageMax,
      source,
      sourceType: "generated",
      characters: [hero.name, helper.name],
      tags: [
        lesson.split(" ")[0].toLowerCase(),
        hero.type.split(" ")[0].toLowerCase(),
        level === "A" ? "ninni" :
        level === "B" ? "halk-masalı" :
        level === "C" ? "macera" : "destan",
        conflict.short.split(" ")[0].toLowerCase(),
      ].filter(Boolean),
      imageQuery: buildImageQuery(hero, setting, pool.imageTags),
      featured:   false,
      uploadedAt: new Date(`2024-0${(generated % 9) + 1}-${(generated % 28) + 1}`),
    });

    generated++;
  }

  return stories;
}
