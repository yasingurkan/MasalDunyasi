import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "KVKK Aydınlatma Metni",
  description:
    "Masal Dünyası KVKK (Kişisel Verilerin Korunması Kanunu) kapsamında kişisel verilerin işlenmesine ilişkin aydınlatma metni.",
};

export default function KVKKPage() {
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
          KVKK Aydınlatma Metni
        </h1>
        <p className="text-gray-400 mb-10 text-sm">
          Son güncelleme: Mayıs 2025
        </p>

        <div className="prose prose-invert prose-purple max-w-none space-y-8 text-gray-300">
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              1. Veri Sorumlusu
            </h2>
            <p>
              6698 sayılı Kişisel Verilerin Korunması Kanunu (&quot;KVKK&quot;)
              uyarınca, kişisel verileriniz; veri sorumlusu sıfatıyla{" "}
              <strong className="text-white">Masal Dünyası</strong> tarafından
              aşağıda açıklanan kapsamda işlenebilecektir.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              2. İşlenen Kişisel Veriler
            </h2>
            <p>
              Sitemizi ziyaret ettiğinizde aşağıdaki veriler otomatik olarak
              toplanabilir:
            </p>
            <ul className="list-disc list-inside space-y-2 mt-3 ml-2">
              <li>IP adresi ve tarayıcı bilgileri</li>
              <li>Ziyaret edilen sayfalar ve gezinme davranışı</li>
              <li>Oturum süresi ve etkileşim verileri</li>
              <li>Cihaz türü ve işletim sistemi bilgisi</li>
              <li>
                Çerezler aracılığıyla toplanan teknik veriler (bkz. Çerez
                Politikası)
              </li>
            </ul>
            <p className="mt-3">
              İletişim formu kullanmanız halinde adınız, soyadınız ve e-posta
              adresiniz de işlenebilir.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              3. Kişisel Verilerin İşlenme Amacı
            </h2>
            <p>
              Kişisel verileriniz aşağıdaki amaçlarla işlenmektedir:
            </p>
            <ul className="list-disc list-inside space-y-2 mt-3 ml-2">
              <li>Web sitesinin düzgün çalışmasının sağlanması</li>
              <li>Kullanıcı deneyiminin iyileştirilmesi</li>
              <li>
                Güvenlik açıklarının ve kötü niyetli kullanımların tespiti
              </li>
              <li>Yasal yükümlülüklerin yerine getirilmesi</li>
              <li>İstatistiksel analiz ve raporlama (anonim olarak)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              4. Kişisel Verilerin Aktarılması
            </h2>
            <p>
              Kişisel verileriniz; hizmet sağlayıcılarımız (barındırma, analitik
              araçlar vb.) ile yasal zorunluluklar doğrultusunda yetkili kamu
              kurumlarına aktarılabilir. Üçüncü taraflarla paylaşım yalnızca
              KVKK&apos;nın 8. ve 9. maddeleri kapsamında ve gerekli güvenlik
              önlemleri alınarak gerçekleştirilir.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              5. Kişisel Veri Toplamanın Yöntemi ve Hukuki Sebebi
            </h2>
            <p>
              Kişisel verileriniz; otomatik ya da otomatik olmayan yollarla,
              çerezler, sunucu kayıtları ve iletişim formları aracılığıyla
              toplanmaktadır. Hukuki dayanak olarak KVKK&apos;nın 5. maddesi
              kapsamında &quot;meşru menfaat&quot; ve &quot;açık rıza&quot; esasları
              benimsenmektedir.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              6. İlgili Kişinin Hakları
            </h2>
            <p>
              KVKK&apos;nın 11. maddesi uyarınca aşağıdaki haklara
              sahipsiniz:
            </p>
            <ul className="list-disc list-inside space-y-2 mt-3 ml-2">
              <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
              <li>
                İşlenmişse buna ilişkin bilgi talep etme
              </li>
              <li>
                İşlenme amacını ve amacına uygun kullanılıp kullanılmadığını
                öğrenme
              </li>
              <li>
                Yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri
                bilme
              </li>
              <li>
                Eksik veya yanlış işlenmesi halinde düzeltilmesini isteme
              </li>
              <li>
                KVKK&apos;nın 7. maddesinde öngörülen şartlar çerçevesinde
                silinmesini ya da yok edilmesini isteme
              </li>
              <li>
                İşlemenin otomatik sistemler aracılığıyla gerçekleştirilmesi
                halinde analiz sonucuna itiraz etme
              </li>
              <li>
                Kanuna aykırı işlenmesi sebebiyle zarara uğraması halinde
                zararın giderilmesini talep etme
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              7. İletişim
            </h2>
            <p>
              KVKK kapsamındaki haklarınızı kullanmak veya kişisel verilerinize
              ilişkin sorularınız için aşağıdaki iletişim kanallarını
              kullanabilirsiniz:
            </p>
            <div className="mt-4 p-4 bg-gray-900 rounded-xl border border-gray-800">
              <p className="font-semibold text-white">Masal Dünyası</p>
              <p className="mt-1">
                E-posta:{" "}
                <a
                  href="mailto:kvkk@masaldunyasi.com"
                  className="text-purple-400 hover:text-purple-300"
                >
                  kvkk@masaldunyasi.com
                </a>
              </p>
              <p className="mt-1 text-sm text-gray-500">
                Başvurularınız en geç 30 gün içinde yanıtlanacaktır.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
