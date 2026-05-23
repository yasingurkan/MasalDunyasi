export interface CategoryData {
  slug: string;
  name: string;
  label: string;
  ageMin: number;
  ageMax: number;
  description: string;
  icon: string;
  color: string;
}

export const categories: CategoryData[] = [
  {
    slug: "1-yas",
    name: "1 Yaş",
    label: "Bebekler için Ninniler",
    ageMin: 0,
    ageMax: 1,
    description:
      "Bebekler için sakinleştirici ninniler ve kısa uyku hikayeleri. Nazik sesler ve tekrarlayan motifler ile uyku öncesi en güzel anları yaşayın.",
    icon: "🌙",
    color: "#8B5CF6",
  },
  {
    slug: "2-yas",
    name: "2 Yaş",
    label: "Küçük Yürüyenler için Hikayeler",
    ageMin: 2,
    ageMax: 2,
    description:
      "Hayvan dostları, renkler ve basit maceralarla dolu kısa hikayeler. Tekrarlayan cümle yapıları ile dil gelişimini destekler.",
    icon: "🐣",
    color: "#EC4899",
  },
  {
    slug: "3-yas",
    name: "3 Yaş",
    label: "Meraklı Küçükler için Masallar",
    ageMin: 3,
    ageMax: 4,
    description:
      "İlk masallar! Üç küçük domuz, kırmızı başlıklı kız ve sevimli Keloğlan hikayeleri ile hayal gücü gelişir.",
    icon: "🧸",
    color: "#F59E0B",
  },
  {
    slug: "4-yas",
    name: "4 Yaş",
    label: "Prensesler ve Şövalyeler",
    ageMin: 4,
    ageMax: 5,
    description:
      "Pamuk Prenses, Sindirella ve cesur şövalyelerle dolu büyülü masallar. İyilik ve cesaret temalarıyla değer eğitimi.",
    icon: "👑",
    color: "#EF4444",
  },
  {
    slug: "5-yas",
    name: "5 Yaş",
    label: "Büyülü Ormanlar ve Maceralar",
    ageMin: 5,
    ageMax: 6,
    description:
      "Rapunzel, Hansel ve Gretel ve büyülü orman hikayeleri. Daha uzun ve derin masallarla hayal gücü zenginleşir.",
    icon: "🌳",
    color: "#10B981",
  },
  {
    slug: "6-yas",
    name: "6 Yaş",
    label: "Denizler ve Uzak Ülkeler",
    ageMin: 6,
    ageMax: 7,
    description:
      "Küçük Deniz Kızı, Kar Kraliçesi ve Nasreddin Hoca fıkraları. Empati ve farklı kültürlere merak uyandıran hikayeler.",
    icon: "🌊",
    color: "#3B82F6",
  },
  {
    slug: "7-yas",
    name: "7 Yaş",
    label: "Cesur Kahramanlar",
    ageMin: 7,
    ageMax: 8,
    description:
      "Daha karmaşık olay örgüleri, La Fontaine masalları ve Türk kahramanlık hikayeleri. Okuma sevgisi ve eleştirel düşünce.",
    icon: "⚔️",
    color: "#F97316",
  },
  {
    slug: "8-yas",
    name: "8 Yaş",
    label: "Binbir Gece Dünyası",
    ageMin: 8,
    ageMax: 9,
    description:
      "Ali Baba, Sinbad ve Aladdin'in büyülü dünyasına yolculuk. Binbir Gece Masalları'nın en sevilen hikayeleri.",
    icon: "🪔",
    color: "#8B5CF6",
  },
  {
    slug: "9-yas",
    name: "9 Yaş",
    label: "Efsaneler ve Mitoloji",
    ageMin: 9,
    ageMax: 10,
    description:
      "Yunan mitolojisi, Türk efsaneleri ve Dede Korkut hikayeleri. Tarih ve kültür zenginliğini keşfeden uzun anlatılar.",
    icon: "🏛️",
    color: "#06B6D4",
  },
  {
    slug: "10-yas",
    name: "10 Yaş",
    label: "Dünya Masalları",
    ageMin: 10,
    ageMax: 11,
    description:
      "İtalyan, Rus, Japon ve İskandinav masalları. Farklı kültürlerin hikaye anlatım geleneklerini keşfeden çocuklar için.",
    icon: "🌍",
    color: "#84CC16",
  },
  {
    slug: "11-yas",
    name: "11 Yaş",
    label: "Fantezi ve Büyü Dünyası",
    ageMin: 11,
    ageMax: 12,
    description:
      "Ejderhalar, sihirbazlar ve büyülü krallıklar. Karmaşık karakter gelişimi ve uzun epik hikayelerle fantezi dünyasına dalış.",
    icon: "🐉",
    color: "#A855F7",
  },
  {
    slug: "12-yas",
    name: "12 Yaş",
    label: "Genç Okuyucular için Epik Hikayeler",
    ageMin: 12,
    ageMax: 13,
    description:
      "Uzun ve derin hikayeler, karmaşık ahlaki temalar ve güçlü karakter arklarıyla genç okuyucular için seçilmiş eserler.",
    icon: "📚",
    color: "#F43F5E",
  },
];
