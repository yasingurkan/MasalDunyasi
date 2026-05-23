import type { AgeLevel } from './pools';

// ─────────────────────────────────────────────────────────────────────────────
// Arayüz tanımları
// ─────────────────────────────────────────────────────────────────────────────

export interface StoryParams {
  K: string;   // kahraman adı
  KT: string;  // kahraman tipi
  M: string;   // mekan
  Y: string;   // yardımcı adı
  YT: string;  // yardımcı tipi
  S: string;   // çatışma (uzun açıklama)
  D: string;   // ders
  level: AgeLevel;
}

// ─────────────────────────────────────────────────────────────────────────────
// Placeholder doldurma yardımcısı
// ─────────────────────────────────────────────────────────────────────────────

function fill(template: string, p: StoryParams): string {
  return template
    .replace(/\{K\}/g,  p.K)
    .replace(/\{KT\}/g, p.KT)
    .replace(/\{M\}/g,  p.M)
    .replace(/\{Y\}/g,  p.Y)
    .replace(/\{YT\}/g, p.YT)
    .replace(/\{S\}/g,  p.S)
    .replace(/\{D\}/g,  p.D);
}

// ─────────────────────────────────────────────────────────────────────────────
// Bölüm primleri (her bölüm farklı bir asal sayıyla çarpılır → daha iyi dağılım)
// ─────────────────────────────────────────────────────────────────────────────

const PRIMES = [2, 3, 5, 7, 11, 13, 17, 19, 23] as const;

function pick(variants: string[], seed: number, sectionIndex: number): string {
  const prime = PRIMES[sectionIndex % PRIMES.length];
  return variants[Math.abs(seed * prime) % variants.length];
}

// ─────────────────────────────────────────────────────────────────────────────
// LEVEL A — 0-2 yaş varyantları (kısa cümleler, duyusal dil, tekrar)
// ─────────────────────────────────────────────────────────────────────────────

const A_ACILIS: string[] = [
  'Bir gün. Güzel bir gün. {M} küçük bir {KT} yaşıyordu. Orası çok güzeldi. Güneş parlıyordu. Çiçekler açıyordu. Kuşlar ötüyordu. Cıvıl cıvıl. Her şey iyiydi. Rüzgar esiyordu; hafif hafif. Yapraklar sallanıyordu. Tatlı bir koku vardı. İşte böyle bir yerde, böyle güzel bir yerde, küçük {KT} yaşıyordu. Adı {K}\'dı. {K} burayı çok seviyordu.',

  'Güneş doğdu. Sarı sarı doğdu. {M} her şey uyandı. Küçük {KT} {K} da uyandı. Gözlerini ovuşturdu. Uzandı, gerildi. Dışarısı parlıyordu. Yeşil çimenler ıslaktı. Çiy damlası parlıyordu. Küçük {K} etrafına baktı. Ağaçlar vardı, çiçekler vardı, böcekler vardı. Her şey güzeldi. Her şey mükemmeldi. Bugün güzel bir gün olacaktı.',

  '{M} çok güzeldi. Yeşildi. Pembe çiçekler vardı. Sarı çiçekler vardı. Mavi böcekler uçuyordu. Ve orada bir {KT} yaşıyordu. Adı {K}\'dı. {K} çok tatlıydı. Yumuşacıktı. Minicik ayakları vardı. Minicik elleri vardı. Hep gülerdi. Hep oyundu. Sabah olunca hep dışarı çıkardı. Böceklere bakardı. Çiçekleri koklar, yaprakları dokunurdu. Burası onun yeriydi.',

  'Koca bir dünya vardı. Ve bu dünyada {M} vardı. İşte orada küçük {KT} {K} oturuyordu. Evi sıcacıktı. Yatağı yumuşacıktı. Her sabah annesi "günaydın" derdi. Her sabah {K} güler, zıplar, koşardı. Güneş giriyordu pencereden. Altın gibi. Sıcak gibi. Bugün de öyle bir sabah oldu. {K} gözlerini açtı. Baktı. Güneş oradaydı. Her zaman olduğu gibi.',

  'Çok çok uzakta değil. Çok çok yakında. {M} şirin bir yer vardı. Orada küçük {KT} yaşardı. Adı ne mi? {K}. {K} her sabah yuvasından fırlardı. Taze hava çekerdi. Etrafı koklardı. Toprak kokardı. Çiçek kokardı. Yağmur kokardı. Sonra oyuna başlardı. Zıplar, koşar, yuvarlanırdı. Gülüşü her yere yayılırdı. İşte o günlerden birinde bir şey oldu. Beklenmedik bir şey.',
];

const A_KAHRAMAN: string[] = [
  '{K} sevimli bir {KT}\'ydu. Küçücük. Tatlıcık. Büyük gözleri vardı. Merak dolu bakışları. Her şeye bakardı. Her şeye dokunmak isterdi. Yumuşak tüyleri vardı. Sarı mıydı? Beyaz mıydı? Rengarenkti! Annesi onu çok severdi. Sarılırdı ona. "Benim minik {K}\'m" derdi. {K} de gülerdi. Kıkır kıkır gülerdi. Koşardı. Zıplardı. En çok sevdiği şey oynamaktı. Ve keşfetmek. Her köşeye bakardı. Her şeyi merak ederdi.',

  'Küçük {K} kimdi? Minik bir {KT}\'ydu. En sevdiği şey ne miydi? Oyun! Sabah erken kalkardı. Annesi daha uyurken {K} zaten ayaktaydı. Etrafta koşardı. Bir şeyler arardı. Bir şeyler bulurdu. Bir böcek. Bir taş. Bir yaprak. Hepsini inceledi. Hepsine dokunurdu. Meraklıydı. Çok meraklıydı. Ama bir şeyden korkardı. O şey ne mi? Yabancılardan değil. Karanlıktan da değil. Yalnız kalmaktan. Annesi yanında olunca her şey iyiydi.',

  '{K} büyümek istiyordu. Ama henüz çok küçüktü. Ufacık adımları vardı. Ama hızlı koşardı. Minik elleri vardı. Ama sıkı tutunurdu. Tüyleri vardı. Ya da kürkü. Pek fark etmezdi. Güzeldi. Sağlıklıydı. Neşeliydi. Güldüğünde hepsi gülerdi. Ağladığında hepsi üzülürdü. O bu yerde çok önemliydi. Herkes onu severdi. Hepsi onunla oynamak isterdi. {K} bu aileyle, bu yerde çok mutluydu.',

  'Bu küçük {KT}\'nun adı {K}\'dı. {K} çok meraklıydı. Her şeyi bilmek isterdi. Neden? Neden? Neden? diye sorardı. Ama konuşamazdı henüz. Sadece sesler çıkarırdı. Bazen "Öö öö!" Bazen "Aa aa!" Bazen sadece gülerdi. Yuvarlandığında gülerdi. Koşarken gülerdi. Oynarken gülerdi. Annesi "Çok mutlu bir {KT}" derdi. "Çok şanslıyız." {K} bunu duyunca daha çok gülerdi.',

  'Herkes {K}\'yı tanırdı. Neden mi? Çünkü {K} çok tatlıydı. Yuvarlak yüzü vardı. Büyük gözleri vardı. Hep gülerdi. Hep zıplardı. Kim onu görse "Aa ne şirin!" derdi. {K} bunu duyunca kıkırdar, kaçardı. Utangaçtı biraz. Ama meraklıydı. Her şeyi görmek isterdi. Her şeyi tatmak isterdi. Her şeye dokunmak isterdi. Annesinin yakınında olmayı severdi. Ama keşfetmek de isterdi. İkisi birden mümkün müydü?',
];

const A_GUNLUK: string[] = [
  'Her gün aynıydı. Ama güzeldi. Sabah uyandı. Gerindi. Kahvaltı etti. Sonra oyun. Koştu. Zıpladı. Geri döndü. Uyudu. Uyandı. Tekrar oyun. Çiçeklere baktı. Böceklere baktı. Annesine sarıldı. Güldü. Güldü. Güldü. {K}\'nın hayatı böyleydi. Basitti. Güzeldi. Sıcaktı. Ve bugün de öyle başladı. Sabah oldu. {K} uyandı. Güneş parlıyordu. Hava güzeldi. "Bugün de güzel bir gün!" diye düşündü {K}.',

  'O sabah {K} erkenden uyandı. Dışarıdan sesler geliyordu. Kuşlar ötüyordu. Bir kuş, iki kuş, üç kuş. Hepsi beraber şakıyordu. {K} kulak verdi. Dinledi. Sonra o da ses çıkardı. "Öö öö!" Kuşlara cevap veriyordu. Annesi güldü. {K} de güldü. Sonra dışarı çıktılar. Birlikte yürüdüler. Çimenlere bastılar. Islaktı. Soğuktu biraz. Ama güzeldi. {K} her şeye dokundu. Güzel bir sabah.',

  'Güneş tepedeydi. Öğle olmuştu. {K} oynuyordu. Ne oynuyordu? Her şeyi oynuyordu! Önce bir taşı yuvarladı. Sonra bir yaprağı taşıdı. Sonra bir çukur kazdı. Sonra içine girdi. Sonra çıktı. Sonra güldü. Kıkır kıkır güldü. Annesi baktı. O da güldü. Birlikte güldüler. Sonra öğle yemeği. Nefis. Sonra uyku vakti. Ama {K} uyumak istemiyordu. Henüz oynamak istiyordu.',

  '{K} o sabah çimenlerde yürüdü. Her adımda çimen sesleri. Çıt çıt. Çıt çıt. Çok güzeldi. Sonra bir kelebek geldi. Sarı bir kelebek. Çok güzel. {K} uzandı. Dokunmak istedi. Ama kelebek uçtu. Gitti. {K} peşinden koştu. Koştu. Koştu. Kelebek durdu. {K} yavaşladı. Yavaşça yaklaştı. Kelebek bekledi. Bekledi. Sonra uçtu yine. {K} güldü. Güzel bir oyundu bu.',

  'Her sabah {K} pencereden bakardı. Bugün de öyle yaptı. Dışarısı ıslaktı. Yağmur yağmış gece. Gökyüzü bulutluydu. Gri gri bulutlar. Ama {K} üzülmedi. Çünkü su birikintileri vardı. Su birikintileri! En sevdiği şey. Koştu. Annesine koştu. "Bak bak!" der gibi işaret etti. Annesi anladı. Giyindiler. Dışarı çıktılar. {K} su birikintisine bastı. Sıçradı su. Çok güzel.',
];

const A_SORUN: string[] = [
  'Ama bir gün bir şey oldu. Kötü bir şey değil. Ama zorlayıcıydı. {K}, {S}. Ne yapacaktı? Bilmiyordu. Aradı. Bulamadı. Seslendi. Kimse cevap vermedi. Bekledi. Bekledi. Yavaşça gözleri doldu. Bir damla. İki damla. Sonra ağladı. Üzülmüştü. Ama korkmamıştı. Sadece ne yapacağını bilmiyordu. Etrafına baktı. Sonra baktı yine. Bir çıkış yolu olmalıydı.',

  'O gün her şey değişti. {K}, {S}. İşte bu oldu. Bir anda. Beklenmedik. {K} şaşırdı. Ne yapacağını bilemedi. Durdu. Düşündü. Sonra yürüdü. Sonra durdu. Sonra bağırdı. Kimse duymadı. Sonra tekrar aradı. Yoktu. Gerçekten yoktu. {K}\'nın gözleri büyüdü. Kalbi çarpıyordu. Hızlı hızlı. Çünkü endişelenmişti. Çünkü yardıma ihtiyacı vardı.',

  'Bir şey kaybolmuştu. Ya da bir şey olmuştu. {K}, {S}. Başta fark etmemişti. Sonra anlamıştı. Durumu anladığında durdu. Öylece durdu. Sonra içini çekti. Derin bir iç çekiş. Sonra düşünmeye başladı. Küçük kafası çalışıyordu. Ne yapmalıydı? Aramaya mı gitmeli? Beklemeli miydi? Çağırmalı mıydı? Bilmiyordu. Küçüktü çünkü. Ama deneyecekti. Yine de deneyecekti.',

  '{K} oynarken fark etti. Bir şey yoktu. Yoktu işte. {S}. Bu olmuştu. {K} etrafına baktı. Sağa baktı. Sola baktı. Arkasına baktı. Önüne baktı. Yoktu. Gerçekten yoktu. Küçük {KT} ne yapacağını şaşırdı. Elleri sallandı. Ayakları yere vurdu. Burnunu çekti. Neredeydi? Nereye gitmişti? Biraz ağladı. Ama durdu. Çünkü ağlamak işe yaramazdı. Aramak gerekirdi.',

  'Tam o sırada bir şey oldu. {K} fark etti. {S}. Bu hiç olmamıştı daha önce. İlk defa böyle bir şey oluyordu. {K} şaşırdı. Büyük gözleri daha da büyüdü. "Aa!" diye ses çıkardı. Sonra sustu. Düşündü. Ne yapacaktı? Annesi neredeydi? Yakınlarda mıydı? {K} döndü. Annesini aradı. Ama annesi göremedi hemen. Biraz panikledi. Çünkü yardıma ihtiyacı vardı. Hemen.',
];

const A_YOLCULUK: string[] = [
  '{K} harekete geçti. Küçük adımlarla. Ama kararlı adımlarla. Baktı. Aradı. Bir yöne gitti. Sonra döndü. Başka bir yöne gitti. Etrafı kokladu. Etrafı dinledi. Bir ses mi? Evet, bir ses! Oraya gitti. Hızlı hızlı gitti. Ayakları koşuyordu. Küçük ama hızlı ayaklar. Nefes nefese. Ama bırakmadı. Devam etti. Çünkü bulması gerekiyordu. Çünkü çözmesi gerekiyordu.',

  'Gitmek gerekiyordu. {K} biliyordu bunu. Küçük olmasına rağmen. Korkmasına rağmen. Adım attı. Bir adım. İki adım. Üç adım. Her adım biraz daha uzaklaştırıyordu onu güvenli yerinden. Ama ilerledi. Çünkü başka çaresi yoktu. Çimenler ıslaktı. Ayakları ıslandı. Ama durdurmadı. Devam etti. Devam etti. Devam etti. Bir gün çözeceğini biliyordu.',

  'Küçük ayaklar yürüdü. Küçük eller tuttu. Küçük gözler baktı. {K} gidiyordu. Nereye mi? Bilmiyordu tam olarak. Ama devam etti. Çünkü içinden bir ses "git" diyordu. İçgüdüsüydü bu. Hayvanların bilgeliği. Yavaş yavaş. Adım adım. Etrafı dinleyerek. Etrafı koklayarak. Yoluna devam etti. Çözüm bir yerlerdeydi. Mutlaka bir yerlerdeydi.',

  '{K} karar verdi. Oturup ağlamayacaktı. Kalkacaktı. Bakacaktı. Arayacaktı. Küçük bir {KT}\'ydu. Ama bırakmayacaktı. Ayağa kalktı. Sallandı biraz. Ama düşmedi. Derin bir nefes aldı. Sonra yürüdü. Her yere baktı. Taşların altına. Yaprakların arkasına. Her köşeye. Bulamadı hemen. Ama vazgeçmedi. Devam etti. Devam etti. Çünkü vazgeçmek yoktu.',

  'Artık harekete geçme zamanıydı. {K} bunu hissetti. Kalktı. Yürüdü. Etrafı inceledi. Bir yere baktı, bir yere baktı. Küçük burnunu havaya kaldırdı. Kokladı. Sağa gitti. Durdu. Sola gitti. Durdu. Sonra düz gitti. Evet, bu yön doğruydu. Bir şeyler hissediyordu. İçgüdüsü çekiyordu onu. Küçük ama güçlü bir his. "Oraya git," diyordu. Ve {K} gitti.',
];

const A_YARDIMCI: string[] = [
  'Ve tam o sırada {Y} göründü. {Y} bir {YT}\'ydu. Büyücek. Güvenilir. {K} durdu. Baktı. {Y} de baktı. İkisi birbirine baktı. Sonra {Y} yaklaştı. Yavaşça. Korkmadı {K}. Çünkü {Y} kötü değildi. İyiydi. Hissediliyordu bu. {Y} bir ses çıkardı. Yumuşak bir ses. Dostane bir ses. {K} cevap verdi. Kendi sesiyle. "Öö öö!" dedi. {Y} güldü sanki. Ve yardım etmeye hazırdı.',

  '{Y} nereden çıktı? Bilmiyordu {K}. Ama oradaydı işte. Tam ihtiyaç anında. Büyük {YT} sakince yaklaştı. {K}\'ya baktı. Gözleri iyiydi. Sıcaktı bakışı. {K} hemen anladı. Bu dost bir {YT}\'ydu. Kötü değildi. Yardım edecekti. {K} biraz yaklaştı. {Y} de biraz yaklaştı. Sonra daha da yaklaştılar. Ve {Y} bir şey söyledi. Ya da gösterdi. Ve {K} anladı.',

  'Tam o anda bir ses geldi. {Y}\'nin sesiydi. Nereden geliyordu? Yakından. {K} döndü. Ve gördü. {Y} oradaydı. Büyük, iyi bir {YT}. Sakince duruyordu. Tehlike yoktu. {K} içini çekti. Rahatladı. {Y} geldi yanına. Dokunmadı hemen. Sadece durdu. Bekledi. {K} hazır olunca yaklaştı. Ve yardım teklif etti. Ses çıkarmadan. Sadece orada olarak. Ve bu yeterliydi.',

  '{Y} çıkıp geldi. Büyük bir {YT}. Ama nazik. Ama şefkatli. {K} ilk başta duraksadı. Çünkü büyüktü {Y}. Ama sonra anladı. Kötü değildi. İyiydi. Gözleri güzeldi. Sesi yumuşaktı. {K} yaklaştı. {Y} de yaklaştı. Ve buluştular. Ve konuştular, ses sesiyle. Ve {Y} gösterdi. Ne yapması gerektiğini gösterdi. {K} baktı. Anladı. Takip etti.',

  'O sırada {Y} göründü. Tam ihtiyaç anında. Masal hep böyle değil midir? En karanlık anda bir ışık çıkar. En zor anda bir yardım gelir. {Y} bir {YT}\'ydu. Büyük değil. Küçük de değil. Tam yerinde. Ve {K}\'ya baktı. Anlayışla baktı. "Biliyorum" der gibi. "Yardım edeceğim" der gibi. {K} güvendi. Ve birlikte harekete geçtiler.',
];

const A_ENGEL: string[] = [
  'Ama kolay değildi. Bir engel vardı. Büyük bir şey. Ya da zor bir şey. {K} durdu. Baktı. Nasıl geçecekti? Bilmiyordu. {Y} de baktı. Birlikte düşündüler. {K} denedi. Olmadı. Tekrar denedi. Yine olmadı. Düştü. Ama kalktı. Tekrar denedi. Hâlâ olmadı. Ama bırakmadı. Çünkü {Y} yanındaydı. Ve {Y} cesaret verdi. "Yapabilirsin" der gibi baktı. Ve {K} tekrar denedi.',

  'Yolda bir sorun vardı. Büyük bir sorun. {K} için çok büyük. Küçük bir {KT} için çok zor. Durdu. Nefes aldı. Etrafına baktı. {Y} yanındaydı. Ama {Y} de bilemiyordu hemen. İkisi birden düşündü. Sonra {Y} bir şey denedi. Olmadı. {K} bir şey denedi. Neredeyse oldu. Tekrar denedi. Daha da yakın. Bir kez daha. Ve oldu! İkisi sevinçle zıpladı.',

  'O an çok zordu. {K} için en zor andı. Bir engel vardı. Geçemiyordu. Çok büyüktü. Çok yüksekti. Çok ağırdı. {K} baktı. Ağlamak istedi. Ama tuttu. Çünkü {Y} bakıyordu. Ve {Y}\'nin bakışları "yapabilirsin" diyordu. {K} nefes aldı. Derin bir nefes. Sonra denedi. Tam gücüyle. Bütün küçük gücüyle. Ve bir adım attı. Bir adım. Sadece bir adım. Ama büyük bir adım.',

  'Zorluk karşısında {K} durdu. {Y} de durdu. İkisi baktı. Nasıl aşacaklar? Büyük problem. Küçük {KT} için çok büyük. Ama {Y} vardı yanında. {Y} bir şey gösterdi. Bir yol. Belki. Belki bir yol. {K} baktı. Anlamaya çalıştı. Sonra anladı. Ve denedi. İlk başta olmadı. İkinci denemede de olmadı. Ama üçüncüde... Evet! Oldu! Heyecanla baktı {Y}\'ye. {Y} de sevindi.',

  'Engel büyüktü. {K} küçüktü. Ama kalbi büyüktü. Ve {Y} yanındaydı. İkisi birlikte baktı. İkisi birlikte düşündü. {Y} bir fikir söyledi, sesle, hareketle. {K} anladı. "Öyle mi yapayım?" der gibi baktı. {Y} başını salladı. {K} denedi. Titrek elleri, küçük ayakları. Ama denedi. Ve kısmen oldu. Daha fazla denedi. Ve oldu. Tamamen oldu. Sevinç!',
];

const A_COZUM: string[] = [
  'Ve sonunda oldu. {K} çözdü. Küçük ama akıllı {KT}. {Y} yardım etti. Birlikte çözdüler. {K} çok mutlu oldu. Zıpladı. Güldü. Kıkır kıkır güldü. {Y} de mutlu oldu. İkisi birlikte sevindi. Sorun çözülmüştü. Her şey yolundaydı. Güneş hâlâ parlıyordu. Kuşlar hâlâ ötüyordu. Ve {K} artık biliyordu. Zor anlarda bile çözüm bulunur. Yeter ki deneye ve yeter ki yardım iste.',

  'İşte o an geldi. Çözüm anı. {K} ve {Y} birlikte yaptılar. Olmayan şey oldu. Kayıp şey bulundu. Zor şey kolaylaştı. Ve {K} güldü. Güldü güldü güldü. En güzel gülüşüyle güldü. {Y} de ona katıldı. Birlikte sevindiler. Birlikte kutladılar. Annesine koşacaktı {K}. Anlatacaktı. Her şeyi anlatacaktı. Ne kadar harika bir hikâye!',

  'Çözüm oradaydı. Her zaman oradaydı. Sadece görmek gerekiyordu. {K} gördü sonunda. {Y}\'nin yardımıyla gördü. Ve yaptı. Ve her şey düzeldi. {K} rahatladı. Derin bir nefes aldı. Güzel bir nefes. Ve gülümsedi. Büyük bir gülümseme. Minik yüzünde kocaman bir gülüş. {Y} de memnundu. Her şey çözülmüştü. Artık eve gidebilirdi. Annesinin kollarına.',

  'Sonunda {K} başardı. Küçük {KT} başardı. {Y} yardım etmişti ama asıl {K} yapmıştı. Kendi elleriyle. Kendi adımlarıyla. Ve çok mutlu oldu. Çünkü başarmıştı. Çünkü denemişti. Çünkü bırakmamıştı. {Y} ona baktı. Gururla baktı sanki. "Aferin" der gibiydi. {K} kıkırdadı. Ve koşmaya başladı. Eve koşacaktı. Annesine koşacaktı.',

  'Ve bitti. Sorun bitti. {K} çözdü, {Y} ile birlikte. Güneş battıktan sonra değil, batmadan önce çözüldü. Her şey iyiydi. Her şey güzeldi. {K} etrafına baktı. Aynı çimenler. Aynı çiçekler. Aynı kuşlar. Ama her şey farklı hissettiriyordu. Çünkü {K} artık biraz daha büyümüştü. Biraz daha güçlüydü. Biraz daha bilgeydi. Ve bundan mutluydu.',
];

const A_SONUC: string[] = [
  'O günden sonra {K} çok şey öğrendi. {D} İşte bu öğrendi. Annesi sarıldı ona. Sıkıca sarıldı. "Benim cesur {KT}\'m," dedi. {K} güldü. Ve o gece çok güzel uyudu. Yıldızlar parlıyordu. Ay parlıyordu. Her şey iyiydi. Ve {K} hep böyle hatırladı o günü. Zor bir gündü. Ama güzel bir gündü. Çünkü bir şeyler öğrenmişti. Ve öğrenmek güzeldir.',

  '{K} eve döndü. Mutlu mutlu döndü. Annesi kapıda bekliyordu. Sarıldılar. Uzun uzun sarıldılar. Sıcacık. Annesi sordu, "Neredeydin?" {K} anlatamadı kelimelerle. Ama gözleri anlattı. Mutlu gözler. Başaran gözler. Annesi anladı. Ve güldü. İkisi birlikte güldü. O gece masal dinlediler. Ve {K} uyurken rüyasında gördü. {Y}\'yi. Ve gülümseyerek uyudu.',

  'Mutlu son geldi. Her masalın sonu gibi. {K} mutluydu. {Y} mutluydu. Anne mutluydu. Hepsi mutluydu. Çünkü {D} Ve bu doğruydu. Her zaman doğruydu. Büyük ya da küçük. İnsan ya da hayvan. Hepsi için doğruydu. O gün {K} bunu öğrendi. Ve unutmadı. Hiç unutmadı. Her zaman hatırladı. Ve büyüdükçe daha iyi anladı.',

  'Akşam oldu. Güneş battı. Yıldızlar çıktı. {K} annesinin kucağındaydı. Gözleri kapanıyordu. Uyku geliyordu. Annesi ninni söyledi. Yumuşak bir ninni. {K} güldü biraz. Sonra gözleri kapandı. Ve uyudu. Rüyasında o günü gördü. Ve mutluydu. Çünkü öğrenmişti. {D} Bunu öğrenmişti. Ve bu en güzel hazineydi.',

  'Ve hepsi mutlu yaşadı. {K} de mutlu yaşadı. Çünkü {D} Bunu bilmek güzeldi. Bunu yaşamak daha güzeldi. {K} büyüyecekti. Daha büyük olacaktı. Ama o günü unutmayacaktı. Asla unutmayacaktı. Çünkü o gün önemli bir şey öğrenmişti. Ve öğrenmek... Öğrenmek her zaman güzeldir.',
];

// ─────────────────────────────────────────────────────────────────────────────
// LEVEL B/C/D — Ortak zengin Türkçe halk masalı üslubu varyantları
// ─────────────────────────────────────────────────────────────────────────────

const BCD_ACILIS: string[] = [
  'Bir varmış bir yokmuş, evvel zaman içinde kalbur saman içinde, {M} {K} adında bir {KT} yaşarmış. Bu {KT}, köyde herkesin sevdiği, iyi kalpli biriydi. Sabahları güneşle birlikte uyanır, akşamları yıldızları sayarak uyurdu. Evin etrafındaki bahçede güller açardı, armut ağaçları meyve verirdi. Komşular sıkışınca hep {K}\'ya gelirdi; o da elinden geldiği kadar yardım ederdi. Yoksulların kapısını hiç boş çevirmez, hastaların yanından ayrılmadan önce ellerini tutardı. Güçlü bir dayanışma duygusu vardı içinde; bu duygu, onu hem sevdiren hem de saydıran bir erdeme dönüşmüştü. Ama o günden önce, {K} hiç bu kadar zorlu bir yolla karşılaşmamıştı. O sabah güneş farklı doğdu sanki; ışıkları daha solgun, esinti daha ürpertici, kuşlar daha sessizdi. Sanki doğanın kendisi bir şeyden haberdardı. Ve her şeyin değişmesi için o günü bekliyordu kader.',

  'Çok çok uzaklarda, yedi dağın ötesinde, yedi denizin berisinde, {M} bir masal kurulmuştu sanki. Orada, zamanın durduğu o köşede, {K} adında bir {KT} yaşarmış. Dağlar onun komşusuymuş, nehirler onun arkadaşıymış, yıldızlar onun aydınlatıcısıymış. Gece olunca bülbüller ona nağme söylermiş, gündüz olunca güneş ona kucak açarmış. Yağmur yağınca toprağın kokusu yükselirmiş, kar yağınca beyaz örtünün altında sessizlik çökermiş. {K} bu topraklara kök salmıştı; hem bedeninin hem de ruhunun kökleri bu toprağa işlemişti. Burayı terk etmeyi hiç düşünmemişti; burası onun nefesiydi, burası onun kanıydı. Ama o güne kadar {K}, kaderinin kendisine ne büyük bir sınav hazırladığından habersiz, günlerini sade bir iyilikle geçirmekteydi.',

  'Vaktiyle, belki de dünyanın gençliğinde, {M} huzur içinde yaşayan bir {KT} varmış: {K}. Bu yerin taşını toprağını ezbere bilir, suyunun sesini dinleyerek uyurdu. İnsanlar onu bilge bilir, çocuklar onu sevimli bulurdu; yaşlılar ise ona "bu toprakların en değerli armağanı" derdi. Köyün her meselesinde adı geçer, her darlıkta yüzü görünürdü. Mevsimler gelir geçer, yıllar birbiri ardınca devrilirdi; ama {K} her daim aynı sadelikle, aynı iyiliğiyle sürer giderdi hayatını. Küçük sevinçleri büyük görmesini, büyük sıkıntıları küçük tutmasını bilirdi. Ta ki o gün gelene dek. Ta ki kader kapısını o sabah çalana dek. Ve o kapı çalındığında, artık geri dönüş yoktu.',

  'Uzun zaman önce, belki de sizin büyük büyük büyük dedenizin zamanında, {M} bambaşka bir dünya vardı. O dünyanın ortasında, söğüt ağaçlarının gölgesinde, kuru otların kokusuyla uykuya dalan bir {KT} yaşardı; adına {K} derlerdi. {K} bu topraklara öyle alışkındı ki, toprağın her damarını tanırdı. Bir bakışta havanın ne getireceğini anlardı; bir koklayışta yağmurun ne zaman yağacağını bilirdi. Sabahın ilk ışığında hangi kuşun ötteğini, akşamın son gölgesinde hangi böceğin seslendiğini ezbere söylerdi. Komşular derdini ona anlatır, çocuklar onun masallarını dinlerdi. O ise hepsine bütün kalbini verir, karşılık beklemezdi. Ama daha büyük bir sınavın eşiğinde olduğunu bilmiyordu henüz; ta ki o sabah kapısı çalınana kadar.',

  'Rivayet olunur ki, devirler devirler içinde, {M} bir kahraman yetişmiş. Adı {K}\'ymış, tipi {KT}\'ymuş ve kalbi saf altın gibi temizmiş. Sabah ezanı okunmadan önce kalkar, akşam yıldızlar doğmadan önce yatardı. Çalışkanlığı dillere destandı; iyiliği ise efsane olmuştu çoktan. Elleri emeğin izini taşır, gözleri doğruluğun ışığını saçardı. Komşu köylerden bile {K}\'nın iyilik haberini duymuş olanlar gelir, yüzüne bakmak için yüzlerce adım yol katederdi. Herkese eşit davranır, zengine de yoksula da aynı tebessümü esirgemeyen bir {KT}\'ydi. Bir güz sabahıydı, kavakların sararmaya başladığı, sislerin vadiye indiği o meşhur sabah. İşte o sabah her şey değişti. Ve {K}\'nın adı, o günden sonra yalnızca köyde değil, çok daha geniş bir coğrafyada anılmaya başlandı.',
];

const BCD_KAHRAMAN: string[] = [
  '{K} sıradan bir {KT} değildi. Bunu görmek için uzun uzun bakmak gerekmiyordu; bir an için gözlerine bakman yeterliydi. O gözlerde hem bir merak ateşi yanardı hem de derin bir huzur çöreklenirdi. Çocukluğundan beri farklıydı; ötekiler uyurken o düşünürdü, ötekiler eğlenirken o gözlemlerdi. Güçlü bir kalbi vardı — yalnızca bedenen değil, içten de güçlüydü. Zorla değil, seçimle iyiydi; isteyerek, bilerek, severek iyiydi. Elinden geleni esirgemez, iyiliği karşılıklı bir hesaba dönüştürmezdi. Küçük bir iyiliği bile büyük bir içtenlikle yapardı; bu özelliği onu sıradan insanlardan ayıran en belirgin yöndü. Köydekiler derdi ki, "{K}\'nın içinde bir kor var, söndürmek mümkün değil." Ve haklıydılar. O kor, zor zamanlarda daha da alevlenir, çevresine ısı ve ışık saçardı. Fırtınalar geçince insanlar kor ateşine koşardı; {K} da hep oradaydı, yanmaktan yorulmadan. İşte bu nedenle kader, büyük sınavını {K}\'ya layık görmüştü.',

  'Kimdi {K}? Bir {KT}\'ydu, evet. Ama bu tanım onu anlatmaya yetmezdi. Sabahları yürürken serçeler omuzuna konardı; akşamları oturduğunda köpekler ayağının dibine uzanırdı. İnsanlar onu severdi çünkü o da insanları severdi — gerçekten, yürekten, beklentisizce severdi. Kurnazlık bilmezdi, yalan söylemezdi; yaşadığı yerde dürüstlük onun diğer adıydı sanki. Bir yanlışlık görünce sessiz kalamazdı; bir haksızlık karşısında yüzünü çeviremezdi. Bu özellik ona zaman zaman zahmet çıkarırdı; ama o hiç pişman olmadı. Ama asıl büyük erdemi şuydu: Zor anlarda asla çökmezdi. Belki ağlardı, belki titredi; ama çökmezdi, eğilmezdi, kırılmazdı. Çünkü içindeki o ışık, her fırtınada sönmek yerine daha parlak yanardı. Bu da onun en büyük gücüydü ve kader onu tam da bu özelliği için seçmişti.',

  'Onun adı {K}\'dı ve o bir {KT}\'ydu. Ama zamanla herkesçe anlaşıldı ki, {K} olağanüstü bir insandı. Cesareti dağlar kadar büyüktü; ama kibrinden eser yoktu. Bilgeliği derin sulara benziyordu; sessiz, derin ve herkese açık. Güçlüydü; ama bu gücü başkalarını ezmek için değil, korumak için kullanırdı. Küçüklerin yanında eğilir onlara kulak verirdi; yaşlıların önünde diz çöker hikâyelerini sabırla ve saygıyla dinlerdi. Hiç kimseyi küçümsemez, hiç kimsenin söyleyeceği bir şey olmadığını düşünmezdi. Bir söz verdiğinde o sözü tutardı; bir yanlışlık gördüğünde ise geri adım atmadan karşısında dururdu. Zor anlarda değil, kolay anlarda da aynı ilkeleri koruması onu gerçek anlamda erdemli kılıyordu. İşte bu yüzden herkes onu severdi. İşte bu yüzden kader de büyük sınav için onu seçmişti.',

  '{K} hakkında çok şey söylenirdi. Kimileri onun bilgeliğini överdi; kimileri cesaretini; kimileri ise sonsuz sabrını; kimileri de güler yüzünü. Ama en doğru tanım şuydu belki de: {K} bir {KT}\'ydu ve tam anlamıyla kendisiydi. Başkasına benzemek istemezdi; başkasının yolunu körü körüne izlemezdi. Kendi izini bırakırdı her geçtiği toprakta, iz bırakacak şeyler yapardı. Doğruluktan taviz vermezdi; adaletin olmadığı yerde rahat edemezdi. Herkes uyurken o düşünür, herkes vazgeçerken o ısrar ederdi. Bu özellikleri onu bazen zorlu durumlara sürüklerdi; ama aynı özellikler sayesinde bu zorlu durumlardan da sıyrılırdı. Çünkü {K}\'nın içinde her zaman yanmakta olan bir meşale vardı; ne yağmur söndürebilirdi onu ne de rüzgar. Böyleydi {K}. Böyle birine ihtiyaç duyulduğunda, kader onu mutlaka bulurdu.',

  'Bir {KT} olan {K}, bu topraklarda nadir yetişen türden biriydi. Yüzünde her zaman bir düşünce vardı; gözlerinde ise her zaman bir karar — bulanık, kararsız değil, net ve sakin. Kolayı seçmezdi; zoru seçerdi, ama yalnızca zoru doğru olan zaman. Güçlünün yanında değil, haklının yanında dururdu; kalabalığa değil, vicdanına kulak verirdi. Halkı için hata kabul eder, ama hakikatten asla vazgeçmezdi. Bir duvarın önünde dursa yıkmaz; etrafından dolaşırdı. Yıkılması gereken şeyin karşısında ise eğilmezdi. Belki de bu yüzden hayatı hiç kolay olmamıştı. Belki de bu yüzden bugün de karşısında çetin bir yol uzanıyordu. Ama {K} korkmazdı bundan; korktuğunda bile ilerlerdi. Çünkü doğru olanı yaptığında, yalnız olmadığını bilirdi. Her zaman birisi vardı — görünür ya da görünmez — yanında yürüyen.',
];

const BCD_GUNLUK: string[] = [
  'O gün her şey olağan gibiydi. {K} sabah namazının ardından hava alığına çıktı. Kuşların sesi tam yerindeydi; yapraklar rüzgarda tanıdık bir nağme tutturmuştu. Komşu ihtiyar selam verdi; çocuklar oyunlarıyla dalmış gidiyorlardı. {K} bu manzarayı her sabah görürdü ve her sabah içi aynı sıcaklıkla dolardı. Öğleye doğru işine koyuldu; ellerini emeğin ısıttığı o saatlerde zihin de berraklaşırdı. Öğle vakti gölgede dinlendi, bir parça ekmekle birkaç zeytin yedi. Akşama ise komşularla bir arada oturdu, çay içti, sohbet etti; kahkahalar geceye karıştı. Sıradan bir gün. Güzel, sakin, huzurlu bir gün. Ama bazen en sıradan günlerin içine en sıradışı şeyler sığar; o gün de öyle oldu.',

  'Sabahın alacakaranlığında kalktığında önce gökyüzüne baktı {K}. Bulutlar dağılıyordu; ufuk pembe bir örtüyle kaplanmıştı. "İyi işaret," dedi kendi kendine. Ardından günlük işlerine koyuldu. Önce bu, sonra şu; alışkanlık haline gelmiş adımlarla günü örmeye başladı. Bir komşunun ağır yükünü taşımasına yardım etti; bir yaşlının ekmeğini kapısına bıraktı. Küçük iyilikler, büyük anlam. Öğle sıcağında gölgeye çekildi, bir süre gözlerini kapattı; dünyanın sesi uzaklaştı, iç ses yakınlaştı. Akşam ise köy meydanından sesler geldi — sadece çocukların neşesi, ama o neşe tüm yorgunluğu silindi. {K} gülümsedi. Sıradan günlerin bu sıcaklığını, bu olağan güzelliğini çok severdi.',

  'O hafta her gün aynıydı — ve bu güzeldi. {K} alışkınlığın rahatlığı içinde yüzerdi. Sabah kalkar, işine bakar, akşam dinlenirdi. Arasında komşularla sohbet eder, çocuklara bir şeyler öğretir, yaşlılara destek olurdu. Hayat basitti ama anlamlıydı; her küçük andaki anlam, büyük mutluluğun tuğlasıydı. Sabahın o ilk serin nefesi, öğlenin güneş dolu saatleri, akşamın ocak başı sıcaklığı — hepsi birleşince güzel bir hayat oluyordu. Güneş battığında her şey yerli yerindeydi; ay doğduğunda da böyleydi. Ama bu denge, bu sessiz huzur, bazen bir kırılma noktasının habercisi olabilir. Tıpkı durgun bir göl yüzeyinin altında gizlenen akıntı gibi — görünmez ama oradadır. Ve günü gelince yüzeye vurur, her şeyi birlikte sürükler.',

  '{K}\'nın günleri genellikle şöyle geçerdi: Erkenden kalkmak, serin havayla birlikte derin bir nefes almak, ardından işe dalmak. Ellerin emeği, günün anlamını yaratırdı; boş geçen her saat bir kayıp gibiydi. Öğlen bir soluklanma, bir yudum su, bir lokma ekmek; basit ama yeterdi. Sonra yeniden emek, yeniden çaba, yeniden o tanıdık ritim. Akşam ise köyün sesi yükselirdi: Çocukların kahkahası, büyüklerin ciddi fısıltısı, ocak başlarında akan sohbet, bazen bir türkü. {K} bunları sever, bunları benimsemişti; bu sesler olmadan bir gün eksik kalırdı sanki. Hayatın bu ritmi ona yetiyordu; ne fazlasını istedi ne eksikliğini hissetti. Ama o gün bu ritim bozulacaktı; beklenmedik, dönüştürücü, kalıcı bir biçimde.',

  'Güneş doğduğunda {K} zaten uyanıktı. Ufku boyayan o altın-turuncu şerit her sabah onu büyülürdü; sanki kader kendisini sabah ışığında gizliyordu, gün başlamadan önce bir işaret bırakıyordu. Kalktı, ellerini yüzünü yıkadı, dışarı çıktı. Bahçedeki ağaçlar henüz tazeydi; çiğ henüz kurumamıştı yapraklardan. {K} derin bir nefes aldı ve tuttu bir an; sonra bıraktı. Toprak kokusu, çiçek kokusu, uzaktan ahır kokusu — hepsi tanıdık, hepsi huzur vericiydi. Günlük işlere başladı: Birini selamladı, birine yardım etti, birinin derdini sabırla dinledi. Bu küçük iyilikler günü anlamlı kılardı. Her şey olağandı. Her şey yerindeydi. Ta ki o haberi alana kadar; ta ki hayatın ritmi aniden değişene kadar.',
];

const BCD_SORUN: string[] = [
  'Ama bir gün her şey değişti. Haber geldi; kötü, beklenmedik, sarsan bir haber. {K}, {S}. Kimsenin beklediği bir şey değildi bu. Bir anda köyün üzerine karanlık bir bulut çöktü sanki. Büyükler baş salladı, küçükler sustu; hatta hayvanlar bile o gün daha az ses çıkardı. Herkes ne yapacağını bilemez hale geldi. {K} de ilk anda dondu kaldı; oturup düşünmek gerekiyordu. Olup biteni sindirmek zaman alıyordu; her haberin kendi ağırlığı vardı. Ama sonra içinden bir ses konuşmaya başladı — önce kısık, sonra giderek daha güçlü. Sesini duymak zaman aldı; ama duyduğunda net bir sestir. "Bir şey yapılmalı," diyordu. "Ve bunu yapacak olan sensin." Bu ses susmadı; susmayacaktı.',

  'Her şey o gün bozuldu. {K} o sabah uyanınca bir şeylerin yanlış olduğunu hissetti — ama tam olarak ne olduğunu anlayamadı önce. İçinde tuhaf bir ağırlık, tanımlanamayan bir sıkıntı vardı. Sonra geldi haberler; biri ardından öbürü, bir çığ gibi. {S}. Söylenmesi kolay ama yaşanması çok ağır. Bu büyük bir sorundu, basit değildi. Üstesinden gelmek için yalnızca niyet yetmezdi; cesaret gerekiyordu, akıl gerekiyordu, sabır gerekiyordu, belki biraz da şans. {K} önce derin bir sessizliğe büründü. Düşündü. Sorunu her yönden çevirdi aklında; zayıf noktalarını aradı, güçlü yanlarını belirledi. Sonra doğruldu. Oturmak için gelmemişti buraya.',

  'O günün öğlesinde {K}\'ya büyük bir haber ulaştı: {S}. Kulaktan kulağa yayılan bu haber herkesi sarstı, şehrin dört bir yanında fısıldandı, ocak başlarında tartışıldı. Kimisi kaçmak istedi, kimisi görmezden gelmeye çalıştı, kimisi yas tuttu; hepsi de aynı şoku farklı biçimde yaşadı. Ama {K} farklıydı. Çünkü {K}, sorunun büyüklüğünü tüm çıplaklığıyla gördü ve yine de kaçmadı. Omuzları ağırlaştı, gözleri geçici olarak karardı; ama yürüyüşü sertleşti, adımları daha kararlı oldu. İçinden bir karar oluşuyordu yavaş yavaş, ağaçta bir meyvenin olgunlaşması gibi. Bu sorun çözülmeliydi. Ve çözecek olan da buydu.',

  'Hiçbir şey olmasaydı çok daha kolay olurdu. Ama işte oldu; kader bazen tercih bırakmaz. {K}\'nın önüne büyük bir engel dikildi: {S}. Ne kadar ağır bir yüktü bu. Omuzlar böyle yükleri taşımak için mi yapılmıştı? {K} sormadı bunu kendine — sormak işe yaramazdı, zaman harcardı. Bunun yerine gözlemledi, değerlendirdi, kendi iç sesiyle sessizce tartıştı. Kolay bir çözüm yoktu. Kestirme bir yol yoktu. Önünde uzun, çetin, belirsizliğini koruyan bir yol vardı. Ama yolun ne kadar uzun olduğu önemli değildi; önemli olan yürümek isteğiydi. Ve {K} istemekteydi.',

  'Kader bazen çok sert kapı çalar. O gün {K}\'nın kapısını öyle çaldı — duvarları titretti, göğsü sıktı. {S}. Gerçek buydu, kaçış yoktu; yok saymak da çözüm değildi; görmezden gelmek ise vicdana ihanetti. {K} ilk duyduğunda gözleri büyüdü; elleri biraz titredi, nefesi biraz kesildi. İçinde fırtına koptu — büyük, gürültülü, her şeyi sallayan bir fırtına. Ama o fırtınayı yüzüne yansıtmadı. Çünkü çevresindekiler ona bakıyordu; gözlerinde umut arıyorlardı ve o ümidi boşa çıkarmak istemiyordu. O yüzden içindeki fırtınayı susturmadı — yönlendirdi, dönüştürdü. Panikten kararlılığa, çaresizlikten azme döndü. Derin bir nefes aldı. Ve ilk adımı atmaya hazırlandı; çünkü ilk adım en zor olanıydı.',
];

const BCD_YOLCULUK: string[] = [
  '{K} kalkıp yola düştü. Kolay bir karar değildi bu. Arkasında bıraktıkları vardı — tanıdık yüzler, alışkın mekânlar, sıcak ocaklar, yıllarca benimsenen bir hayat. Ama önünde daha büyük bir sorumluluk duruyordu; o sorumluluktan kaçmak vicdanına yük olmaya başlamıştı ve bu yük her geçen gün ağırlaşıyordu. Hazırlandı; azığını sardı, üstünü giydi, kalbini topladı. Son bir kez geriye döndü baktı — her şeyi hatırasına kazımak için. Güneş o sabah kırmızı doğmuştu; bir işaret miydi, bilmiyordu. Sonra ilk adımını attı. Bir adım, sonra bir daha. Yol uzundu ve belirsizdi; ne kadar süreceği belli değildi, ne bulacağı meçhuldü. Ama bir şey kesindi: Bırakmak yoktu. Dönmek, yalnızca başardığında mümkündü. Ve bu düşünce, her yorulduğunda {K}\'ya yeniden güç verdi; bacaklarına, sırtına, kalbine.',

  'Artık beklemenin zamanı geçmişti. {K} bir karar vermişti ve o kararda geri adım yoktu; bu hem güçlü hem de korkutucu bir histi. Yola çıktı. İlk adımı attığında içinde tuhaf bir his belirdi — korku ile heyecanın karışımı, belirsizlik ile kararlılığın buluşması. Tanıdık topraklar geride kaldı; önüne yabancı ufuklar açıldı. Yol bazen düzdü, bazen taşlı; bazen geniş, bazen dar; bazen güneşli, bazen karanlık. Her köşede yeni bir manzara, her manzarada yeni bir soru bekliyordu. Ama {K} yürüdü. Yorulduğunda yürüdü, susamışken yürüdü, korktuğunda da yürüdü; durdurmak için bir güç gerekirdi onu. Çünkü yapılması gereken şey buydu. Ve {K}, yapılması gereken şeyi mutlaka yapardı — bu onun en derin, en değişmez özelliğiydi.',

  'Bir sabah erken vakitte {K} evden çıktı. Kimseye söylemeden değil; herkese söyleyerek, hesap verir gibi, sözünü tutar gibi. "Gidiyorum," dedi. "Döneceğim." Sadece bu iki cümle. Yeterliydi. Kimse sormadı nereye, ne zaman, nasıl. Çünkü {K}\'ya güveniyorlardı — o güven yıllarda, her verilen sözde, her tutulan vaaatte kazanılmıştı. Yola koyuldu. Adımları başta yavaştı; vedanın ağırlığı çökmüştü omuzlarına, sevdiklerinin yüzü zihninde canlı canlı canlanıyordu. Bu ağırlığı da taşıdı, onu da yüklendi sırtına. Sonra hızlandı; görevin çekimi zamanla vedanın ağırlığını geride bıraktı. Ufuk her adımda biraz daha yaklaştı, biraz daha büyüdü, biraz daha somutlaştı. Ve {K} o ufka doğru, durmaksızın, geri dönmeden ilerledi.',

  'Harekete geçmek için daha iyi bir an beklemek saçmalıktı. {K} bunu biliyordu. En iyi an şimdiydi; en doğru an her zaman şimdiydi, sonsuz bir "yarın"a ertelemek olmaz. Ertelemenin kendisi bir tür vazgeçmekti. Hazırlıklarını tamamladı, yolculuk için gerekli olanları dikkatlice bir araya getirdi. Azık, kararlılık, iyi niyet ve öğrenilmiş sabır — en değerli yol arkadaşları bunlardı; hiçbirini geride bırakmak istemedi. Ve yola düştü. Yolun başında rüzgar karşıdan sert esiyordu; sanki bir sınav gibiydi, sanki doğa bile onu test ediyordu. Ama {K} eğilmedi; eğilmek yerine nefes aldı, doğruldu, ileriye sağlam bir adım attı. Ardından bir tane daha. Kararlılık her zaman rüzgardan güçlüdür ve {K} bunu yalnızca bilmekle kalmayıp yaşıyordu.',

  '{K} düşündü, tartı ve sustu bir süre — bu sessizlik içinde kendi ruhunu dinledi. Sonra ayağa kalktı ve içinden geçenleri yüksek sesle söyledi: "Olmaz. Bu böyle bırakılamaz. Ben gidip çözeceğim." Bu kararı vermek kolay değildi; ağır, korkutucu, sorumluluğu büyük bir karardı. Ama vermesi zorunluydu. Ve o, zorunlu olanı yapmaktan hiçbir zaman çekinmezdi — bu onun en belirgin özelliğiydi. Hazırlandı; yola çıkmadan önce bir an için gözlerini kapattı, içindeki sesi bir kez daha dinledi. Yola çıktı. Arkasında güneş batıyordu; turuncu-kırmızı bir batış, sanki uğurlu bir uğurlamaydı. Önünde ise belirsizliğini koruyan, uzun ve engebeli bir yol uzanıyordu. Ama {K}\'nın içindeki o söndürülmez kararlılık, o yolu adım adım kısaltacak güçteydi. Ve öyle de oldu.',
];

const BCD_YARDIMCI: string[] = [
  'Yolun tam ortasında, yorgunluğun en yoğun bastırdığı anda, {Y} çıkageldi karşısına. {Y} bir {YT}\'ydu ve {K}\'nın bu yolda karşılaşacağı en önemli varlıktı; kader onu oraya koymuştu. İlk bakışta kim olduğu belli değildi; ikinci bakışta ise anlaşıldı. Konuştular. {Y} dinledi, {K} anlattı — her şeyi, en zor kısmını bile. Söylemek bazen yükü hafifletir. Sonra {Y} bildiğini paylaştı; o bilgelikten bir soluk, o deneyimden bir ışık. Sözleri kısa ama derindi; az kelimeyle çok anlam taşıyordu. {K} içini çekti. Sanki bir yük kalkmıştı omuzlarından; ya da tam tersine, yükü taşıyacak gücü bulmuştu sonunda. İkisi de bu yola ayrı girmiş olabilirdi; ama artık ayrı yürümeyeceklerdi.',

  '{K} yolda tek değildi artık. Çünkü {Y} gelmişti. {Y} bir {YT}\'ydu; bu yolları bilen, bu sınavları yaşayan, bu acıları tanıyan biriydi. Bir ömür boyu öğrendiklerini şimdi bu kritik anda paylaşmaya hazırdı. Yan yana yürüdüklerinde {K} fark etti: Bazı yükler tek başına taşınamaz — taşınmamalı da zaten. {Y} çok konuşmadı; ama her söylediği kelime yerli yerindeydi, her cümlesi bir amaca hizmet etti. Bilgelik böyle olur: Çok değil, doğru konuşmak. {K} bu sözleri içine çekti ve güçlendi; ne yapacağını daha net gördü, nereye gideceğini daha iyi bildi. {Y}\'nin varlığı, yolu fiilen aydınlatmıştı.',

  'En çaresiz anlarda yardım en beklenmedik yerden gelir. {K} de bunu yaşadı. Tam umudunu kesmeye başlamıştı ki — tam içinden "artık olmaz" geçmişti ki — {Y} göründü. Hayalet gibi değil; et ve kemikten, gerçek bir {YT} olarak. Kader onu oraya koymuştu, {K}\'nın en çok ihtiyaç duyduğu anda, başka hiçbir zamanda değil. Karşılaştılar. Bir süre baktılar birbirlerine; tanımayan ama tanıdık hisseden bir bakış. Sonra {Y} konuştu, {K} dinledi. Ve o andan itibaren {K}\'nın dünyası biraz daha anlaşılır, yol biraz daha aydınlık oldu. Sanki bir perde aralanmıştı.',

  '{Y} bir {YT}\'ydu ve {K} onunla bu yolda, tesadüf ya da kader sayesinde karşılaştı. Bu sorunun cevabı belki önemli değildi. Önemli olan şuydu: {Y} yardım etmeye hazırdı ve {K}\'nın bu yardıma gerçekten ihtiyacı vardı. Kibir bir yana bırakıldı; gurur rafa kaldırıldı; yaşananlar öğretti ki yardım istemek zayıflık değil, aksine büyük bir güçtü. {K} bunu anladı ve {Y}\'ye açıldı. {Y} de vermekten çekinmedi; sahip olduğu tüm bilgiyi, tüm deneyimi cömertçe paylaştı. Ve iki dost gibi, iki yol arkadaşı gibi, birbirlerini tamamlayarak hedefe doğru yöneldiler.',

  'O noktada {Y} göründü. Beklenmedik bir anda, beklenmedik bir yerden. Ama tam o anda. {K} durdu; {Y}\'ye baktı. Bu {YT}\'nin kim olduğunu sormadı; zira hissetti. Kalbi "bu dost" dedi; içgüdüsü "güven" dedi. Ve haklıydı. {Y} selam verdi, {K} da selam verdi. Konuştular; uzun, derin, karşılıklı ve dürüst bir konuşma. {Y}, {K}\'nın anlattıklarını kesintisiz, dikkatle dinledi. Sonra söyledi: Sorunun çözümünü biliyordu. En azından bir yolunu biliyordu. Ve bu bir yol, başlamak için yeterliydi. Birlikte çizmeye başladılar o yolu.',
];

const BCD_ENGEL: string[] = [
  'Ama yol hiç kolay olmadı. Büyük bir engel dikildi karşılarına — belki somut bir kötülük, belki doğanın gaddar bir sınavı, belki insanların körleştirici önyargısı. {K} böyle bir şeyle karşılaşabileceğini öngörmüştü; ama öngörmek ile yaşamak arasında derin bir uçurum vardı. İçindeki o eski korku nüksetmek istedi; ama {K} izin vermedi. {Y}\'ye baktı; {Y}\'nin gözleri kararlıydı, karanlıkta yakılmış iki meşale gibiydi. Bu iki kararlı yüreğin önünde engel daha küçük görünmeye başladı — küçülmedi gerçekte, ama küçülmüş gibi hissettirdi. Çünkü kararlılık, engeli yok etmez; ama onu aşacak insanı büyütür. Ve büyüyen insanın önünde her engel erişilebilir hale gelir.',

  'Yolun en çetin kısmına geldiklerinde, {K} ile {Y} durdu. Önlerindeki engel gerçekten büyüktü — aşılmaz gibi görünüyordu ilk bakışta, devasa, soğuk, kayıtsız. Birçoğu bu noktada geri dönerdi; geri dönenler de haklı sayılırdı. Ama {K} ve {Y} geri dönmek için gelmemişti. Düşündüler; tartıştılar; farklı yollar denediler; başarısız olanlardan ders çıkardılar. Biri tutmadı, öbürü tutmadı, üçüncüsü de ilk denemede olmadı. Ama dördüncüde bir kıpırdanma oldu — küçük bir umut kıvılcımı. Yetti bu. Çünkü bir kıvılcım, doğru ellerde büyük bir alev olabilir.',

  'İşte o an geldi — en zor an, en sert viraj. Bu engel, bir insanın tüm gücünü ve aklını sınayan, sabır taşını ölçen, iradesini tartan türdendi. Kolay çözüm yoktu; kestirme yol yoktu. Sadece emek vardı, azim vardı, akıl vardı ve pes etmeme iradesi vardı. {K} ve {Y} hepsini kullandı. Düştüler mi? Düştüler. Kalkıp devam ettiler mi? Her seferinde ettiler. Yoruldular mı? Kemiklerine kadar yoruldular. Pes ettiler mi? Asla. Çünkü bu yolun başında bir söz vermişlerdi — kendilerine, bu toprağa, bu insanlara. Ve sözler tutulmak için verilir.',

  'En büyük engel en son çıkar; hep böyledir, masallarda da gerçek hayatta da. {K} ve {Y} tam hedefe yaklaştıklarında, önlerine geçti o büyük engel; sanki ödül kapısını koruyordu. Bu, her şeyi geri döndürebilirdi — gerçekten geri döndürebilirdi. {K}\'nın içinde o tanıdık his nüksetti: Vazgeçme isteği, yıkılma arzusu. Ama vazgeçmek ne demekti? Tüm bu yolu, tüm bu emeği, tüm bu umudu boşa çıkarmak demekti. Olmaz. Olmaz. {K} omuzlarını geriye çekti, çenesini kaldırdı. {Y} yanındaydı. Ve birlikte son hamleyi, en büyük hamleyi planladılar.',

  'Düşman büyüktü, engel sağlamdı, yol zordu — ama {K} ve {Y} geri çekilmedi. Çünkü gerçek cesaret tam bu anda doğar: Korku hissederken, titreyerek de olsa, ilerlemeye devam etmek. İkisi birlikte çalıştı; {K}\'nın gücü {Y}\'nin bilgeliğiyle birleşince bambaşka bir güce dönüştü; tek başlarına aşılamayacak olanı birlikte aşabileceklerdi. Sabır tükenmedi, azim yavaşlamadı, akıl bulanmadı. Zamanla — uzun, yorucu, ama vazgeçilmeyen bir süreç sonunda — engel geçildi. Tam anlamıyla geçildi. Arkalarında bıraktılar o karanlık noktayı ve yüzleri ışığa dönerek ilerlediler.',
];

const BCD_COZUM: string[] = [
  'Ve sonunda geldi o an. Çözüm, bazen büyük bir patlamayla değil, sessizce gelir — bir şeyin yerli yerine oturması, uzun süredir bozuk olan bir kilidi doğru anahtarın açması gibi. {K} ve {Y} birlikte yaptıklarında anladılar: Bu buymuş. Tüm o yol, tüm o çile, tüm o engel, tüm o düşüş ve kalkışlar hep bunun içindi. Sonuç göründüğünde ikisi de sustu bir an. Bir soluk aldılar — derin, temiz, özgür bir soluk. Sonra birbirlerine baktılar. Gözlerde ne vardı? Yorgunluk, evet, ağır bir yorgunluk. Ama onun çok üzerinde bir şey: Zafer. Ve bu zafer, yalnızca onlara değil, bu yüzden mücadele ettikleri herkese aitti. Ortak emekten doğan ortak bir zaferdi.',

  '{K} ve {Y} çözümü buldu. Zor değil miydi? Çok zordu — her adımı, her düşünüşü, her denemesi. Zaman almadı mı? Çok aldı; saatler, belki günler. Pişmanlık duydular mı? Hiç. Çünkü sonuca ulaştıklarında, her şey anlam kazanıyordu; her zorluk birer basamağa dönüşüyordu geriye bakınca. Çözüm uygulandı; sonuç yavaş yavaş ortaya çıktı. İnsanlar rahladı, sorun geçti, huzur geri döndü. {K} bu manzaraya baktı. İçi doldu; boğazı düğümlendi. Gözleri dolmak istedi — dolmasın diye gözlerini kıstı biraz. Ama o dolu gözler, içindeki minnetin ve derin sevincin işaretiydi. Ve bunu hak etmişti, tam anlamıyla hak etmişti.',

  'Çözüm oradaydı — hep oradaydı. Ama görmek için o yolculuğu yapmak, o sınavı geçmek, o engeli aşmak gerekiyordu; olgunlaşmak gerekiyordu. İnsan bazen cevabı bulmak için değil, o cevabı anlayacak ve taşıyacak olgunluğa ulaşmak için yola çıkar. {K} de öyle yaptı. Ve artık her ikisi de hem sorunun çözümüne hem de kendi içindeki derin bir anlayışa ulaşmıştı. {K}, {Y}\'ye döndü. "Teşekkür ederim," dedi — basit ama içinde her şeyi barındıran bir teşekkür. {Y} başını eğdi. "Sen yapabilirdin zaten," dedi. "Ben sadece yoldaştım." Bu cümle, {K}\'nın kalbine kazındı.',

  'Çözüm geldiğinde herkes şaşırdı — ama {K} şaşırmadı. Çünkü içinde hep bilmişti: Çözüm olacaktı. Bulunacaktı. Yeter ki bırakılmasın, yeter ki aranılsın, yeter ki inanılsın. {Y}\'nin derin bilgeliği ve {K}\'nın yorulmaz cesareti birleşince ortaya çıkmıştı o çözüm; ikisinden biri eksik olsaydı belki mümkün olmazdı. Şimdi her şey düzeliyordu. Bir taş yerine oturur gibi, bozuk parçalar birleşiyordu. Uzun süredir bozuk olan denge yeniden kuruluyordu. Ve bu yeni denge, eskisinden daha sağlam olacaktı — çünkü emekle, sınavdan geçerek kurulmuştu.',

  'O son adım atıldığında {K} durdu. Etrafına baktı. Her şey tamamlanmıştı; sorun çözülmüştü, yük kalkmıştı. Nasıl bir his olduğunu tarif etmek zordu — belki hafiflemek gibiydi, ağır bir yükü bırakıvermek gibiydi, ya da uzun bir yolculuktan sonra eve ulaşmak gibiydi. {Y} yanındaydı ve ikisi birlikte baktılar çözüldüğü o noktaya; tanık oldukları an, her ikisi için de ömürboyu hatırlanacak bir andı. Uzun bir sessizlik oldu. Sonra {K} konuştu: "Oldu." İki küçük kelime. Ama içinde bir dünyanın ağırlığı, bir yolculuğun özeti vardı.',
];

const BCD_SONUC: string[] = [
  '{K} eve döndüğünde her şey aynıydı — ama aynı zamanda her şey farklıydı. Tanıdık yüzler, tanıdık sesler, tanıdık kokular. Ama {K} artık aynı {K} değildi. Gözleri biraz daha derin, omuzları biraz daha geniş, kalbi biraz daha olgun ve sabırlı. O yolculuk onu dönüştürmüştü; dönüşüm dışarıdan değil, içeriden gelmişti. Ve o günden sonra hep söyledi: "{D}" Bunu yaşayarak öğrenmişti; kitaptan değil, yoldan; teoriden değil, düşüşten ve kalkıştan. Yoldan öğrenilen dersler, zihinden hiç silinmez. Uzun yıllar sonra bile, o sabahı, o engeli, o çözümü, {Y}\'nin yüzünü hatırladı. Ve her seferinde şükretti — o zorluğun ona kazandırdıkları için, o sınavın onu büyüttüğü için.',

  'Günler geldi geçti. Zaman nehir gibi aktı ve götürdü. Ama {K}\'nın o yolculuktan öğrendikleri hep kaldı; tazeliğini, canlılığını korudu. Her zorlu anda içinden bir ses geldi: O yolculuğun sesi, o anın öğretisi. Ve o ses her seferinde dedi ki: "{D}" Bu ders, {K}\'yı hem daha güçlü hem de daha alçakgönüllü kıldı; çünkü zorluğu yaşayan insan, başkasının zorluğunu da anlar. Gerçek bir ders böyle yapar insana: Sırtınızı diker ama başınızı indirmeyi de öğretir. Ve bu ikisini birden taşıyabilen insan — işte o insan gerçekten büyümüştür, gerçekten olgunlaşmıştır.',

  'Ve hepsi mutlu yaşadı. Ama bu "mutlu son" bedavadan gelmemişti; armağan edilmemişti. Emekle, cesaretle, bilgelikle ve {Y}\'nin kıymetli yardımıyla, adım adım kazanılmıştı. {K} bunu biliyordu; bu yüzden hiçbir zaman şımarmadı, yaptıklarıyla övünmedi. Sonuna kadar şükretti. Her sabah kalktığında o yolculuğu hatırladı ve içinden sessizce geçirdi: "{D}" Bu düşünce, her günün anlamlı olmasını, her anın değerli hissettirmesini sağladı. Ve yıllar sonra {K}\'nın hikâyesi çocuklara anlatıldı; çocuklar da öğrendi. Böylece o ders, nesilden nesile, kalpten kalbe aktarıldı.',

  'Her şey bitti. Ya da daha doğrusu, her şey yeni bir biçimde başladı. Çünkü her son aynı zamanda bir başlangıçtır; biten yol, açılan kapıdır. {K} bunu anladı. O yolculuk sona ermişti; ama o yolculuktan doğan {K} yeni, daha derin bir yolculuğa başlamıştı — hem içinde hem de dışında daha anlamlı, daha bilinçli bir hayata. Ve her gün yaşarken hatırladı: "{D}" Bu hatıra, onu yürüttü karanlık anlarda. Bu ders, onu taşıdı yorgun anlarda. Ve böylece {K}\'nın masalı, yalnızca o güne ait olmaktan çıktı; her güne, her ana, her yüreğe yayıldı.',

  'O günden sonra çok şey değişti. Ama asıl değişen ve en güzel biçimde dönüşen {K}\'ydı. İçten, derinden, kalıcı olarak değişmişti; o yolculuktan dönen {K}, giden {K}\'nın daha olgun, daha bilge, daha sabırlı hali olmuştu. Ve bu değişimin özü şuydu: "{D}" Hayatında her gün bu derse sarıldı; bir pusula gibi taşıdı içinde. Zor anlarda hatırladı, kolay anlarda da hatırladı. Ve bir gün, uzun yıllar sonra, genç bir yüz geldi yanına. "Nasıl bu kadar bilge oldun?" diye sordu meraklı gözlerle. {K} gülümsedi. "Zorlu bir yoldan geçtim," dedi. "Ve o yol hem beni hem de anlayışımı büyüttü." Genç baktı, anlamadı tam. Ama günü gelince anlayacaktı. Her zaman olduğu gibi, her yolculuk kendi zamanında öğretir.',
];

// ─────────────────────────────────────────────────────────────────────────────
// Ana üretim fonksiyonu
// ─────────────────────────────────────────────────────────────────────────────

export function generateContent(params: StoryParams, seed: number): string {
  const isA = params.level === 'A';

  function variant(
    aVariants: string[],
    bcdVariants: string[],
    sectionIndex: number
  ): string {
    const pool = isA ? aVariants : bcdVariants;
    const raw = pick(pool, seed, sectionIndex);
    return fill(raw, params);
  }

  const acilis    = variant(A_ACILIS,    BCD_ACILIS,    0);
  const kahraman  = variant(A_KAHRAMAN,  BCD_KAHRAMAN,  1);
  const gunluk    = variant(A_GUNLUK,    BCD_GUNLUK,    2);
  const sorun     = variant(A_SORUN,     BCD_SORUN,     3);
  const yolculuk  = variant(A_YOLCULUK,  BCD_YOLCULUK,  4);
  const yardimci  = variant(A_YARDIMCI,  BCD_YARDIMCI,  5);
  const engel     = variant(A_ENGEL,     BCD_ENGEL,     6);
  const cozum     = variant(A_COZUM,     BCD_COZUM,     7);
  const sonuc     = variant(A_SONUC,     BCD_SONUC,     8);

  // Ek bölümler için sabit genişleme metni (her story için seed'e göre farklılaşır)
  const ekA = [
    `${params.K} bu yolda çok şey öğrendi. ${params.M} ayrılmak kolay olmamıştı ama geri dönmek için ilerlemeye devam etti. Etrafındaki her şeyi dikkatle izledi. Küçük bir böcek toprakta koşuyordu. Bir kelebek çiçekten çiçeğe uçuyordu. Uzaktan su sesi geliyordu. ${params.K} bu sesleri içine çekti. Doğa her zaman oradaydı; dinlemeyi bilene konuşurdu. ${params.Y} de fark etti bunu. İkisi bir süre sessizce yürüdü. Bu sessizlik boş değil, doluydu. Birlikte olmanın sessizliğiydi; güvenin sessizliğiydi. ${params.K} içinden geçirdiklerini topladı. Gördüklerini, öğrendiklerini, hissettiklerini. Bunlar artık onundu. Alınamazdı. Silinmezdi. Her zor anda bu günü hatırlayacaktı ve güç bulacaktı. Çünkü yaşanan her zorluk, içimize işler ve bizi güçlendirir. ${params.K} bunu artık biliyordu.`,
    `O anlarda ${params.K}\'nın aklından pek çok şey geçti. Neden bu yolu seçmişti? Çünkü doğruydu. Neden devam etmişti? Çünkü gerekiyordu. Neden ${params.Y}\'ye güvenmişti? Çünkü kalbi öyle söylemişti. Bu kararların hepsi doğruydu. Ve bu doğrular, onu bu noktaya getirmişti. ${params.M} bambaşka görünüyordu artık. Aynı yer, ama farklı gözlerle bakılıyordu. Zor bir yoldan geçmek, gözleri değiştirir. Daha derin bakmayı öğretir. Daha çok şükretmeyi öğretir. ${params.K} şükretti. ${params.D} Bunu öğrenmişti bu yolda. Ve bu ders, ömrü boyunca yanında kalacaktı. Tıpkı ${params.Y} gibi. Tıpkı bu günün anısı gibi. Bazı şeyler insan içinde yaşar, hiç çıkmaz.`,
  ];
  const ekB = [
    `Akşam yaklaşırken gökyüzü renk renk oldu. ${params.K} ve ${params.Y} bir an durdu, bu manzaraya baktı. Kırmızı, turuncu, pembe — gökyüzü adeta bir tablo gibiydi. Böyle güzellikler insanı susturur; kelimeler yetmez. ${params.K} içini çekti. Uzun, derin bir nefes. Bugün ne kadar çok şey olmuştu. Ne kadar yorulmuşlardı. Ve ne kadar büyümüşlerdi. Büyümek hep böyle olur — fark edilmeden, yavaşça, ama gerçekten. ${params.Y}\'e döndü. "Teşekkür ederim," dedi. Sesi titredi biraz. Ama net çıktı. ${params.Y} başını salladı. "Sen de," dedi sadece. Bu iki kelime yeterliydi. Bazen en derin şeyler en az kelimeyle söylenir. ${params.K} gülümsedi. Ve yürümeye devam ettiler. Son adımlar en hafif adımlardı. Çünkü hedef artık çok yakındı.`,
    `Dönüş yolunda ${params.K} daha hafif hissetti. Aynı yorgunluk vardı; ama üzerindeki ağırlık kalkmıştı. Başarmanın getirdiği hafiflik buydu. Çözmenin getirdiği rahatlama. ${params.D} Bu öğrenmişti. Ve bu öğrenme, bedava gelmemişti. Emek vermişti. Cesaret göstermişti. ${params.Y}\'nin yardımını kabul etmişti — bu da ayrı bir cesaret gerektiriyordu. Yardım isteyebilmek. Zayıflık değil, güçtü bu. ${params.K} bunu anlamıştı. Eve döndüğünde anlatacaktı. Herkese anlatacaktı. Bu hikâye, anlatılmayı hak ediyordu. Çünkü içinde gerçek vardı. İçinde emek vardı. İçinde ${params.K} vardı — olduğundan biraz daha büyük, olduğundan biraz daha bilge, olduğundan biraz daha kendisi.`,
  ];

  const ekIdx1 = Math.abs(seed * 41) % ekA.length;
  const ekIdx2 = Math.abs(seed * 43) % ekB.length;

  // Level A için ek uzatma bölümü — bebek/yürüyen çocuk masallarını ≥1000 kelimeye taşır
  const ekC_A = [
    `${params.K} annesini düşündü. Annesi şu an ne yapıyordur? Bekliyordur. Merak ediyordur. ${params.K}\'nın gecikmesi onu endişelendirmiştir. Ama ${params.K} dönecekti. Yakında dönecekti. Ve her şeyi anlatacaktı. Nasıl zorluk yaşadığını. Nasıl ${params.Y} ile tanıştığını. Nasıl çözdüğünü. Her şeyi. Annesi dinleyecekti. Dikkatlice dinleyecekti. Sonra gülümseyecekti. Sarılacaktı belki. Sarılmak bazen her şeyi söyler. Kelimeden daha güçlü. ${params.K} bu sarılmayı düşündü. Çok istedi o sarılmayı. Hızlı hızlı yürüdü. Eve doğru. Annesine doğru. Eve. Yorgundu. Ama mutluydu. İkisi birlikte de olabilirdi. Yorgun ve mutlu. Hem hem. ${params.K} bunu öğrendi bugün. Hem yorgun hem mutlu olunabilir. Ve bu güzel bir şeydi. Çok güzel.`,
    `Yavaş yavaş her şey sakinleşti. Sesler azaldı. Kuşlar sustu. Rüzgar dindi. Sadece uzaktan hafif bir su sesi geliyordu. Ve bu ses güzeldi. Uyutucu bir güzellik. ${params.K}\'nın gözleri ağırlaştı. Hayır, henüz değil. Biraz daha bakmak istedi etrafına. Biraz daha hissetmek istedi bu anı. Çünkü bu güzel bir andı. Yaşanması gereken bir an. Ve ${params.K} hissetti. Tam olarak hissetti. Sonra gözleri kapandı. Bu sefer gerçekten kapandı. Uyku geliyordu. Hoş bir uyku. Hak edilmiş bir uyku. Çünkü o gün çok şey yapmıştı. Çok şey öğrenmişti. Ve yorgundu artık. Güzel bir yorgunluktu bu. Çalışmanın yorgunluğu. Öğrenmenin yorgunluğu. ${params.K} gülümseyerek uyudu. Güzel rüyalar görecekti. Hep böyle olurdu. Güzel günler güzel rüyalar getirir.`,
    `O gün ${params.K} çok şey fark etti. Küçük şeylerin güzelliğini fark etti. Bir böceğin nasıl koştuğunu. Bir kuşun nasıl ötüğünü. Suyun nasıl aktığını. Bunlar her gün oluyordu. Ama ${params.K} bugün ilk kez gerçekten gördü. Gerçekten duydu. Gerçekten hissetti. Dikkat etmek böyle bir şeydi. Dikkat ettiğinde her şey daha güzel görünürdü. Daha renkli. Daha canlı. ${params.K} bunu bugün öğrendi. Dikkat et. Her şeye dikkat et. Küçük şeylere de. Büyük şeylere de. Hepsine. Çünkü güzellik her yerdeydi. Yeter ki bakılsın. Yeter ki hissedilsin. Ve ${params.Y} de öğretmişti bunu ona. Sessizce. Sadece orada olarak. Bazen öğretmek kelime gerektirmez. Sadece bir örnek olmak yeter.`,
  ];
  const ekIdx3 = Math.abs(seed * 47) % ekC_A.length;
  const sections = [acilis, kahraman, gunluk, sorun, ekA[ekIdx1], yolculuk, yardimci, engel, ekB[ekIdx2], cozum, sonuc];
  // Level A için bir ek bölüm daha ekle (→ ~1000 kelimeye ulaşır)
  if (isA) sections.splice(sections.length - 1, 0, ekC_A[ekIdx3]);

  return sections.map(s => s.trim()).join('\n\n');
}
