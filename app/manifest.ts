import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Masal Dünyası",
    short_name: "Masallar",
    description: "1-12 yaş arası çocuklar için Türkçe masal platformu",
    start_url: "/",
    display: "standalone",
    background_color: "#0F0A1E",
    theme_color: "#6B21A8",
    lang: "tr",
    categories: ["kids", "education", "entertainment"],
    icons: [
      { src: "/favicon.ico", sizes: "any" },
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
