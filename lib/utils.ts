export function slugify(text: string): string {
  const charMap: Record<string, string> = {
    ç: "c", Ç: "c", ğ: "g", Ğ: "g", ı: "i", İ: "i",
    ö: "o", Ö: "o", ş: "s", Ş: "s", ü: "u", Ü: "u",
  };
  return text
    .replace(/[çÇğĞıİöÖşŞüÜ]/g, (c) => charMap[c] || c)
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export function calcReadingMinutes(content: string): number {
  const wordsPerMinute = 180;
  const wordCount = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
}

export function calcWordCount(content: string): number {
  return content.trim().split(/\s+/).length;
}

export function getExcerpt(content: string, maxLength = 200): string {
  const sentences = content.split(/(?<=[.!?])\s+/);
  let excerpt = "";
  for (const sentence of sentences) {
    if ((excerpt + sentence).length > maxLength) break;
    excerpt += (excerpt ? " " : "") + sentence;
  }
  return excerpt || content.slice(0, maxLength) + "…";
}

export function splitIntoSentences(text: string): string[] {
  return text
    // ! ve ? her zaman cümle sonudur.
    // . yalnızca ardından büyük harf/rakam/tırnak geliyorsa cümle sonu sayılır
    // → böylece "Dr.", "vs.", "vb." gibi kısaltmalarda bölünme olmaz.
    .split(/(?<=[!?])\s+|(?<=\.)\s+(?=[A-ZÇĞİÖŞÜ"“\d])/u)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

export function getImageUrl(query: string, width = 800, height = 450): string {
  const seed = query.replace(/\s+/g, "-").slice(0, 30);
  return `https://picsum.photos/seed/${seed}/${width}/${height}`;
}

export function formatReadingTime(minutes: number): string {
  if (minutes < 60) return `${minutes} dk`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h} sa ${m} dk` : `${h} sa`;
}

export function formatAgeRange(min: number, max: number): string {
  if (min === max) return `${min} yaş`;
  return `${min}-${max} yaş`;
}
