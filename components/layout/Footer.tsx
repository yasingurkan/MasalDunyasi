import Link from 'next/link';

export default function Footer() {
  return (
    <footer
      style={{
        backgroundColor: '#0F0A1E',
        borderTop: '1px solid rgba(107, 33, 168, 0.3)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {/* Brand column */}
          <div className="flex flex-col gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xl font-extrabold tracking-tight"
              aria-label="Masal Dünyası ana sayfa"
            >
              <span className="shimmer-text text-xl font-extrabold">🌙 Masal Dünyası</span>
            </Link>
            <p className="text-sm leading-relaxed" style={{ color: '#B8B0CC' }}>
              1–12 yaş arası çocuklar için 1.200&apos;den fazla Türkçe masal, ninni ve hikaye.
              Sesli okuma özelliği ile masalları dinleyin!
            </p>
            <p className="text-xs font-medium" style={{ color: '#9333EA' }}>
              ❤️ Türk çocukları için sevgiyle hazırlandı
            </p>
          </div>

          {/* Quick links column */}
          <div className="flex flex-col gap-4">
            <h2 className="text-sm font-bold uppercase tracking-widest" style={{ color: '#F59E0B' }}>
              Hızlı Bağlantılar
            </h2>
            <nav aria-label="Hızlı bağlantılar">
              <ul className="flex flex-col gap-2.5">
                {[
                  { href: '/', label: 'Ana Sayfa' },
                  { href: '/kategoriler', label: 'Kategoriler' },
                  { href: '/iletisim', label: 'İletişim' },
                  { href: '/hakkimizda', label: 'Hakkımızda' },
                ].map(({ href, label }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="text-sm font-medium transition-colors duration-150 hover:text-[#F59E0B]"
                      style={{ color: '#B8B0CC' }}
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Legal column */}
          <div className="flex flex-col gap-4">
            <h2 className="text-sm font-bold uppercase tracking-widest" style={{ color: '#F59E0B' }}>
              Yasal
            </h2>
            <nav aria-label="Yasal bağlantılar">
              <ul className="flex flex-col gap-2.5">
                {[
                  { href: '/kvkk', label: 'KVKK Aydınlatma Metni' },
                  { href: '/gizlilik-politikasi', label: 'Gizlilik Politikası' },
                ].map(({ href, label }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="text-sm font-medium transition-colors duration-150 hover:text-[#F59E0B]"
                      style={{ color: '#B8B0CC' }}
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>

        {/* Divider */}
        <div
          className="mt-10 pt-6"
          style={{ borderTop: '1px solid rgba(107, 33, 168, 0.25)' }}
        >
          <p className="text-center text-xs" style={{ color: '#6B5E8A' }}>
            © {new Date().getFullYear()} Masal Dünyası. Tüm hakları saklıdır.
          </p>
        </div>
      </div>
    </footer>
  );
}
