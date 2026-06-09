import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gizlilik Politikası",
  description:
    "Masal Dünyası gizlilik politikası: Verilerinizi nasıl topladığımız, kullandığımız ve koruduğumuz hakkında bilgi.",
};

export default function GizlilikPolitikasiPage() {
  return (
    <div className="min-h-screen bg-gray-950 py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 mb-8 transition-colors"
        >
          <span>&#8592;</span> Ana Sayfaya Dön
        </Link>

        <h1 className="text-4xl font-bold text-white mb-2">
          Gizlilik Politikası
        </h1>
        <p className="text-gray-400 mb-10 text-sm">
          Son güncelleme: Mayıs 2025
        </p>

        <div className="prose prose-invert prose-purple max-w-none space-y-8 text-gray-300">
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              1. Genel Bakış
            </h2>
            <p>
              Masal Dünyası olarak gizliliğinize saygı duyuyor ve kişisel
              verilerinizi korumayı taahhüt ediyoruz. Bu Gizlilik Politikası,{" "}
              <strong className="text-white">masaldunyasi.com</strong>{" "}
              adresini ziyaret ettiğinizde hangi bilgilerin toplandığını,
              bu bilgilerin nasıl kullanıldığını ve haklarınızın neler
              olduğunu açıklamaktadır.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              2. Topladığımız Bilgiler
            </h2>

            <h3 className="text-xl font-semibold text-gray-200 mb-2">
              2.1 Otomatik Olarak Toplanan Bilgiler
            </h3>
            <p>
              Siteyi ziyaret ettiğinizde sunucularımız ve analitik araçlarımız
              aşağıdaki bilgileri otomatik olarak kaydedebilir:
            </p>
            <ul className="list-disc list-inside space-y-2 mt-3 ml-2">
              <li>IP adresi (anonim hale getirilerek saklanır)</li>
              <li>Tarayıcı türü ve sürümü</li>
              <li>İşletim sistemi</li>
              <li>Ziyaret tarihi ve saati</li>
              <li>Görüntülenen sayfalar</li>
              <li>Referans URL (hangi siteden geldiğiniz)</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-200 mb-2 mt-6">
              2.2 Çerezler (Cookies)
            </h3>
            <p>
              Sitemiz, kullanıcı deneyimini iyileştirmek amacıyla çerezler
              kullanmaktadır. Çerezler, tarayıcınıza kaydedilen küçük metin
              dosyalarıdır. Tarayıcı ayarlarınızdan çerezleri devre dışı
              bırakabilirsiniz; ancak bu, sitenin bazı özelliklerinin
              çalışmamasına yol açabilir.
            </p>
            <p className="mt-3">Kullandığımız çerez türleri:</p>
            <ul className="list-disc list-inside space-y-2 mt-3 ml-2">
              <li>
                <strong className="text-gray-200">Zorunlu çerezler:</strong>{" "}
                Sitenin temel işlevleri için gereklidir.
              </li>
              <li>
                <strong className="text-gray-200">Analitik çerezler:</strong>{" "}
                Ziyaretçi davranışlarını anonim olarak analiz etmemizi sağlar.
              </li>
              <li>
                <strong className="text-gray-200">Tercih çerezleri:</strong>{" "}
                Tema, dil gibi kullanıcı tercihlerini hatırlar.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              3. Bilgilerin Kullanım Amaçları
            </h2>
            <p>Topladığımız bilgileri şu amaçlarla kullanırız:</p>
            <ul className="list-disc list-inside space-y-2 mt-3 ml-2">
              <li>Web sitesini işletmek ve bakımını yapmak</li>
              <li>
                Kullanıcı deneyimini kişiselleştirmek ve geliştirmek
              </li>
              <li>Site trafiğini ve kullanım kalıplarını analiz etmek</li>
              <li>Güvenlik tehditlerini tespit etmek ve önlemek</li>
              <li>Yasal yükümlülüklere uymak</li>
              <li>Teknik sorunları tanılamak ve çözmek</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              4. Bilgilerin Paylaşımı
            </h2>
            <p>
              Kişisel verilerinizi satmıyor, kiralıyor veya ticari amaçlarla
              üçüncü taraflarla paylaşmıyoruz. Yalnızca aşağıdaki
              durumlarda paylaşım yapılabilir:
            </p>
            <ul className="list-disc list-inside space-y-2 mt-3 ml-2">
              <li>
                <strong className="text-gray-200">Hizmet sağlayıcılar:</strong>{" "}
                Barındırma, analitik ve altyapı hizmetleri sunan güvenilir
                iş ortakları (yalnızca gerekli ölçüde).
              </li>
              <li>
                <strong className="text-gray-200">Yasal zorunluluklar:</strong>{" "}
                Mahkeme kararı veya yasal düzenlemeler gerektirdiğinde yetkili
                makamlarla.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              5. Çocukların Gizliliği
            </h2>
            <p>
              Masal Dünyası çocuklara yönelik bir içerik sitesidir. Bu nedenle
              çocuklardan bilerek kişisel veri toplamıyoruz. Ebeveynler veya
              veliler, çocuklarının gizliliği konusundaki endişelerini{" "}
              <a
                href="mailto:gizlilik@masaldunyasi.com"
                className="text-purple-400 hover:text-purple-300"
              >
                gizlilik@masaldunyasi.com
              </a>{" "}
              adresi üzerinden bize iletebilir.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              6. Veri Güvenliği
            </h2>
            <p>
              Verilerinizi korumak için sektör standardı güvenlik önlemleri
              uyguluyoruz:
            </p>
            <ul className="list-disc list-inside space-y-2 mt-3 ml-2">
              <li>HTTPS (TLS şifreleme) ile veri iletimi</li>
              <li>Güvenlik duvarı ve saldırı tespit sistemleri</li>
              <li>Düzenli güvenlik güncellemeleri</li>
              <li>Erişim kontrolü ve yetkilendirme</li>
            </ul>
            <p className="mt-3">
              Bununla birlikte, internet üzerinden hiçbir veri iletiminin veya
              depolamasının yüzde yüz güvenli olmadığını belirtmek isteriz.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              7. Veri Saklama Süresi
            </h2>
            <p>
              Kişisel verilerinizi yalnızca işleme amacının gerektirdiği süre
              boyunca saklarız. Analitik veriler anonimleştirilerek en fazla
              26 ay saklanır. Yasal yükümlülükler gerektirdiğinde bu süre
              uzayabilir.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              8. Üçüncü Taraf Bağlantılar
            </h2>
            <p>
              Sitemiz üçüncü taraf web sitelerine bağlantılar içerebilir. Bu
              sitelerin gizlilik uygulamalarından sorumlu değiliz. Bağlantıya
              tıklamadan önce ilgili sitenin gizlilik politikasını incelemenizi
              öneririz.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              9. Politika Değişiklikleri
            </h2>
            <p>
              Bu Gizlilik Politikası zaman zaman güncellenebilir. Önemli
              değişiklikler olması halinde siteye görünür bir bildirim
              ekleyeceğiz. Güncel politikayı düzenli aralıklarla kontrol
              etmenizi öneririz.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              10. İletişim
            </h2>
            <p>
              Gizlilik politikamıza ilişkin sorularınız için:
            </p>
            <div className="mt-4 p-4 bg-gray-900 rounded-xl border border-gray-800">
              <p className="font-semibold text-white">Masal Dünyası</p>
              <p className="mt-1">
                E-posta:{" "}
                <a
                  href="mailto:gizlilik@masaldunyasi.com"
                  className="text-purple-400 hover:text-purple-300"
                >
                  gizlilik@masaldunyasi.com
                </a>
              </p>
              <p className="mt-2">
                KVKK kapsamındaki haklarınız için:{" "}
                <Link
                  href="/kvkk"
                  className="text-purple-400 hover:text-purple-300"
                >
                  KVKK Aydınlatma Metni
                </Link>
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
