export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Link from "next/link";
import { getAllCategories } from "@/lib/stories";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import StarBackground from "@/components/layout/StarBackground";

export const metadata: Metadata = {
  title: "Hakkımızda",
  description:
    "Masal Dünyası hakkında bilgi edinin. Türk çocukları için 1-12 yaş arası 1.200'den fazla Türkçe masal, ninni ve hikaye.",
  openGraph: {
    title: "Hakkımızda — Masal Dünyası",
    description: "Türk çocukları için en kapsamlı Türkçe masal platformu.",
    type: "website",
    locale: "tr_TR",
  },
};

const features = [
  {
    icon: '🔊',
    title: 'Sesli Okuma',
    desc: 'Tüm masallar Web Speech API ile sesli okunabilir. Hangi cümle okunuyorsa ekranda vurgulanır, çocuğunuz hem okur hem dinler.',
  },
  {
    icon: '📚',
    title: '1.200+ Masal',
    desc: 'Keloğlan, Nasreddin Hoca, Grimm Kardeşler, Andersen ve dünya klasiklerinden derlenen zengin Türkçe içerik.',
  },
  {
    icon: '🗂️',
    title: 'Yaş Kategorileri',
    desc: '1 yaştan 12 yaşa kadar her çocuk için uygun masallar. Yaş grubuna göre sıralama ve filtreleme desteği.',
  },
  {
    icon: '🇹🇷',
    title: '%100 Türkçe',
    desc: 'Tüm masallar özenle Türkçe olarak hazırlanmıştır. Dil gelişimini destekleyen zengin kelime dağarcığı.',
  },
  {
    icon: '📱',
    title: 'Her Cihazda',
    desc: 'Masaüstü, tablet veya telefon — her ekran boyutunda kusursuz deneyim. İnternet bağlantısı gerektirmez.',
  },
  {
    icon: '🛡️',
    title: 'Güvenli İçerik',
    desc: 'Tüm masallar çocuk gelişimi uzmanları gözetiminde seçilmiş, KVKK kapsamında kişisel verileriniz korunmaktadır.',
  },
];

export default async function HakkimizdaPage() {
  const categories = await getAllCategories();

  return (
    <>
      <StarBackground />
      <div className="relative z-10 flex flex-col min-h-dvh">
        <Header categories={categories} />

        <main className="flex-1">
          {/* Hero */}
          <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center flex flex-col items-center gap-6">
            <span
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase"
              style={{
                backgroundColor: 'rgba(107,33,168,0.22)',
                border: '1px solid rgba(107,33,168,0.45)',
                color: '#FCD34D',
              }}
            >
              🌙 Platformumuz Hakkında
            </span>

            <h1 className="text-4xl sm:text-5xl font-extrabold text-[#F3F0FF] leading-tight">
              Masal Dünyası&apos;na Hoş Geldiniz
            </h1>

            <p className="max-w-2xl text-base sm:text-lg leading-relaxed" style={{ color: '#C4BBDB' }}>
              Masal Dünyası, Türkiye&apos;nin en kapsamlı çocuk masalları platformudur.
              1–12 yaş arası çocuklar için 1.200&apos;den fazla Türkçe masal, ninni ve
              hikaye sunuyoruz. Amacımız her çocuğun kendi dilinde, kendi kültüründen
              masallarla büyümesini sağlamak.
            </p>

            <Link
              href="/kategoriler"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl text-base font-bold transition-all duration-200 hover:brightness-110"
              style={{
                backgroundColor: '#F59E0B',
                color: '#0F0A1E',
                boxShadow: '0 4px 24px rgba(245,158,11,0.35)',
              }}
            >
              📖 Masallara Göz At
            </Link>
          </section>

          {/* Features grid */}
          <section
            aria-labelledby="features-heading"
            className="py-16 sm:py-20"
            style={{
              background:
                'linear-gradient(180deg, transparent 0%, rgba(35,21,69,0.4) 30%, rgba(35,21,69,0.4) 70%, transparent 100%)',
            }}
          >
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2
                id="features-heading"
                className="text-2xl sm:text-3xl font-extrabold text-[#F3F0FF] text-center mb-12"
              >
                ✨ Neden Masal Dünyası?
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {features.map(({ icon, title, desc }) => (
                  <div
                    key={title}
                    className="flex flex-col gap-3 p-6 rounded-2xl"
                    style={{
                      backgroundColor: '#1A1035',
                      border: '1px solid rgba(107,33,168,0.25)',
                    }}
                  >
                    <span className="text-3xl" aria-hidden="true">{icon}</span>
                    <h3 className="font-extrabold text-[#F3F0FF]">{title}</h3>
                    <p className="text-sm leading-relaxed" style={{ color: '#9C92B8' }}>{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Mission */}
          <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
            <div
              className="rounded-3xl p-8 sm:p-12 flex flex-col gap-6 text-center"
              style={{
                backgroundColor: '#1A1035',
                border: '1px solid rgba(107,33,168,0.3)',
                boxShadow: '0 8px 48px rgba(15,10,30,0.6)',
              }}
            >
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#F3F0FF]">
                🌱 Misyonumuz
              </h2>
              <p className="text-sm sm:text-base leading-relaxed mx-auto max-w-xl" style={{ color: '#C4BBDB' }}>
                Her çocuğun hayal gücünü besleyen, dil gelişimini destekleyen ve okuma
                sevgisini aşılayan kaliteli Türkçe içerik üretmek. Masallar sadece
                eğlence değil; değerleri, kültürü ve dili kuşaktan kuşağa aktaran köprülerdir.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center mt-2">
                <Link
                  href="/iletisim"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all duration-200"
                  style={{
                    backgroundColor: 'transparent',
                    color: '#9333EA',
                    border: '1px solid rgba(107,33,168,0.45)',
                  }}
                >
                  ✉️ İletişime Geç
                </Link>
                <Link
                  href="/kategoriler"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all duration-200 hover:brightness-110"
                  style={{ backgroundColor: '#F59E0B', color: '#0F0A1E' }}
                >
                  📚 Masalları Keşfet
                </Link>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
}
