import type { Metadata } from "next";
import { Nunito, Fredoka } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import CookieConsent from "@/components/cookie/CookieConsent";

const nunito = Nunito({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-nunito",
  display: "swap",
});

const fredoka = Fredoka({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-display",
  display: "swap",
});

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://masaldunyasi.com").replace(/\/$/, "");
const adsensePubId = process.env.NEXT_PUBLIC_ADSENSE_PUB_ID;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Masal Dünyası — Çocuklar için Türkçe Masallar",
    template: "%s | Masal Dünyası",
  },
  description:
    "1-12 yaş arası çocuklar için 1.200'den fazla Türkçe masal, ninni ve hikaye. Sesli okuma özelliği, yaş gruplarına göre masallar, Keloğlan, Nasreddin Hoca ve daha fazlası!",
  keywords: [
    "türkçe masal",
    "çocuk masalları",
    "sesli masal",
    "ninni",
    "grimm masalları türkçe",
    "andersen masalları",
    "keloğlan masalı",
    "nasreddin hoca fıkraları",
    "1 yaş masal",
    "2 yaş masal",
    "3 yaş masal",
    "4 yaş masal",
    "5 yaş masal",
    "çocuklara masal",
    "uyku masalı",
    "türk halk masalları",
    "masal oku",
    "masal dinle",
    "ücretsiz masal",
    "online masal",
  ],
  authors: [{ name: "Masal Dünyası", url: siteUrl }],
  creator: "Masal Dünyası",
  publisher: "Masal Dünyası",
  category: "children",
  classification: "Children's Entertainment",
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: siteUrl,
    siteName: "Masal Dünyası",
    title: "Masal Dünyası — Çocuklar için Türkçe Masallar",
    description:
      "1-12 yaş arası çocuklar için 1.200'den fazla Türkçe masal. Sesli okuma, yaş grupları ve daha fazlası.",
    images: [
      {
        url: `${siteUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "Masal Dünyası — Türkçe Çocuk Masalları",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Masal Dünyası — Çocuklar için Türkçe Masallar",
    description: "1-12 yaş arası çocuklar için 1.200'den fazla Türkçe masal.",
    images: [`${siteUrl}/og-image.png`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  alternates: {
    canonical: siteUrl,
    languages: { "tr-TR": siteUrl },
  },
  verification: {
    google: "cmSuFSZN-HQX_2EVsdl0YjdwTG7t86cl0NJr6qCv66U",
  },
  other: adsensePubId
    ? {
        "google-adsense-account": adsensePubId,
      }
    : {},
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className={`${nunito.variable} ${fredoka.variable} h-full`}>
      <head>
        {/* Google AdSense */}
        {adsensePubId && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsensePubId}`}
            crossOrigin="anonymous"
            strategy="lazyOnload"
          />
        )}
      </head>
      <body className="min-h-full flex flex-col antialiased">
        {children}
        <CookieConsent />

        {/* Organizasyon yapılandırılmış verisi */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "Masal Dünyası",
              "url": siteUrl,
              "description": "1-12 yaş arası çocuklar için Türkçe masal platformu",
              "inLanguage": "tr",
              "potentialAction": {
                "@type": "SearchAction",
                "target": { "@type": "EntryPoint", "urlTemplate": `${siteUrl}/arama?q={search_term_string}` },
                "query-input": "required name=search_term_string",
              },
              "publisher": {
                "@type": "Organization",
                "name": "Masal Dünyası",
                "url": siteUrl,
                "logo": { "@type": "ImageObject", "url": `${siteUrl}/logo.png` },
              },
            }),
          }}
        />
      </body>
    </html>
  );
}
