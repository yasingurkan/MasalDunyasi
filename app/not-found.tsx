import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-8xl font-bold text-purple-500 mb-4">404</div>
        <h1 className="text-3xl font-bold text-white mb-3">
          Sayfa Bulunamadı
        </h1>
        <p className="text-gray-400 text-lg mb-8">
          Aradığınız sayfa taşınmış, silinmiş ya da hiç var olmamış olabilir.
          Masallar sizi bekliyor!
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-purple-600 px-6 py-3 text-white font-semibold hover:bg-purple-500 transition-colors"
          >
            <span>&#8592;</span>
            Ana Sayfaya Dön
          </Link>
          <Link
            href="/kategoriler"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-purple-600 px-6 py-3 text-purple-400 font-semibold hover:bg-purple-600 hover:text-white transition-colors"
          >
            Masallara Göz At
          </Link>
        </div>
      </div>
    </div>
  );
}
