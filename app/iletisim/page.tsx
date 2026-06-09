export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Link from "next/link";
import { getAllCategories } from "@/lib/stories";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import StarBackground from "@/components/layout/StarBackground";
import ContactForm from "@/components/contact/ContactForm";

export const metadata: Metadata = {
  title: "İletişim",
  description:
    "Masal Dünyası ile iletişime geçin. Sorularınız, önerileriniz ve geri bildirimleriniz için bize ulaşın.",
  openGraph: {
    title: "İletişim — Masal Dünyası",
    description: "Sorularınız ve önerileriniz için bize ulaşın.",
    type: "website",
    locale: "tr_TR",
  },
};

export default async function IletisimPage() {
  const categories = await getAllCategories();

  return (
    <>
      <StarBackground />
      <div className="relative z-10 flex flex-col min-h-dvh">
        <Header categories={categories} />

        <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col gap-12">
          {/* Page header */}
          <header className="flex flex-col items-center gap-3 text-center">
            <span
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase"
              style={{
                backgroundColor: 'rgba(107,33,168,0.22)',
                border: '1px solid rgba(107,33,168,0.45)',
                color: '#FCD34D',
              }}
            >
              ✉️ Bize Ulaşın
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#F3F0FF]">İletişim</h1>
            <p className="max-w-md text-sm sm:text-base leading-relaxed" style={{ color: '#B8B0CC' }}>
              Sorularınız, önerileriniz veya geri bildirimleriniz için aşağıdaki formu
              doldurabilir ya da doğrudan e-posta gönderebilirsiniz.
            </p>
          </header>

          {/* Two-column layout */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
            {/* Contact form — 3 columns */}
            <div
              className="lg:col-span-3 rounded-2xl p-6 sm:p-8"
              style={{
                backgroundColor: '#1A1035',
                border: '1px solid rgba(107,33,168,0.3)',
              }}
            >
              <h2 className="text-lg font-extrabold text-[#F3F0FF] mb-6">Mesaj Gönder</h2>
              <ContactForm />
            </div>

            {/* Info sidebar — 2 columns */}
            <aside className="lg:col-span-2 flex flex-col gap-5">
              {/* Contact info card */}
              <div
                className="rounded-2xl p-6 flex flex-col gap-4"
                style={{
                  backgroundColor: '#1A1035',
                  border: '1px solid rgba(107,33,168,0.3)',
                }}
              >
                <h2 className="text-sm font-extrabold uppercase tracking-wide" style={{ color: '#F59E0B' }}>
                  İletişim Bilgileri
                </h2>
                <div className="flex items-center gap-3">
                  <span className="text-2xl" aria-hidden="true">📧</span>
                  <div>
                    <p className="text-xs font-semibold mb-0.5" style={{ color: '#9C92B8' }}>E-posta</p>
                    <a
                      href="mailto:iletisim@masaldunyasi.com"
                      className="text-sm font-bold text-[#F3F0FF] hover:text-[#F59E0B] transition-colors duration-150"
                    >
                      iletisim@masaldunyasi.com
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl" aria-hidden="true">⏰</span>
                  <div>
                    <p className="text-xs font-semibold mb-0.5" style={{ color: '#9C92B8' }}>Yanıt Süresi</p>
                    <p className="text-sm font-medium text-[#F3F0FF]">En geç 3 iş günü</p>
                  </div>
                </div>
              </div>

              {/* KVKK note */}
              <div
                className="rounded-2xl p-5 flex flex-col gap-2"
                style={{
                  backgroundColor: 'rgba(107,33,168,0.1)',
                  border: '1px solid rgba(107,33,168,0.25)',
                }}
              >
                <p className="text-xs font-bold uppercase tracking-wide" style={{ color: '#9333EA' }}>
                  🛡️ Gizlilik Notu
                </p>
                <p className="text-xs leading-relaxed" style={{ color: '#9C92B8' }}>
                  Form aracılığıyla ilettiğiniz kişisel veriler yalnızca talebinize
                  yanıt vermek amacıyla işlenir ve üçüncü taraflarla paylaşılmaz.
                </p>
                <Link
                  href="/kvkk"
                  className="text-xs font-semibold hover:text-[#FCD34D] transition-colors duration-150"
                  style={{ color: '#9333EA' }}
                >
                  KVKK Aydınlatma Metnini İncele →
                </Link>
              </div>

              {/* Quick links */}
              <div
                className="rounded-2xl p-5 flex flex-col gap-3"
                style={{
                  backgroundColor: '#1A1035',
                  border: '1px solid rgba(107,33,168,0.2)',
                }}
              >
                <p className="text-xs font-bold uppercase tracking-wide" style={{ color: '#F59E0B' }}>
                  Hızlı Bağlantılar
                </p>
                <div className="flex flex-col gap-2">
                  {[
                    { href: '/', label: '🏠 Ana Sayfa' },
                    { href: '/kategoriler', label: '🗂️ Tüm Kategoriler' },
                    { href: '/hakkimizda', label: 'ℹ️ Hakkımızda' },
                  ].map(({ href, label }) => (
                    <Link
                      key={href}
                      href={href}
                      className="text-sm font-medium hover:text-[#F59E0B] transition-colors duration-150"
                      style={{ color: '#B8B0CC' }}
                    >
                      {label}
                    </Link>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
