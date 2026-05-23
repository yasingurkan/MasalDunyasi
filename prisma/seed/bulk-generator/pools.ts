export type AgeLevel = 'A' | 'B' | 'C' | 'D';

export interface Hero { name: string; type: string; }
export interface Helper { name: string; type: string; }
export interface Conflict { short: string; long: string; }

export interface LevelPool {
  heroes: Hero[];
  settings: string[];
  helpers: Helper[];
  conflicts: Conflict[];
  lessons: string[];
  titlePatterns: string[];
  sources: string[];
  imageTags: string[];
}

export const POOLS: Record<AgeLevel, LevelPool> = {

  // ─────────────────────────────────────────────────────────────
  // LEVEL A — 0-2 yaş: Bebek/küçük çocuk masalları
  // Çok basit dil, sevimli hayvanlar, duyusal kelimeler
  // ─────────────────────────────────────────────────────────────
  A: {
    heroes: [
      { name: 'Küçük Ayıcık',        type: 'ayı yavrusu'    },
      { name: 'Minik Tavşan',         type: 'tavşan yavrusu' },
      { name: 'Sarı Civciv',          type: 'civciv'         },
      { name: 'Tüylü Kedi',           type: 'kedi yavrusu'   },
      { name: 'Şirin Ördek',          type: 'ördek yavrusu'  },
      { name: 'Beyaz Kuzu',           type: 'kuzu'           },
      { name: 'Maviş Baykuş',         type: 'baykuş yavrusu' },
      { name: 'Pembe Tavuk',          type: 'tavuk'          },
      { name: 'Küçük Kurbağa',        type: 'kurbağa yavrusu'},
      { name: 'Minik Kirpi',          type: 'kirpi yavrusu'  },
      { name: 'Sarı Arı',             type: 'arı'            },
      { name: 'Rengarenk Kelebek',    type: 'kelebek'        },
      { name: 'Şen Horoz',            type: 'horoz'          },
      { name: 'Küçük Fare',           type: 'fare yavrusu'   },
      { name: 'Tatlı Köpek Yavrusu',  type: 'köpek yavrusu'  },
    ],

    settings: [
      'yeşil çayırda',
      'büyük ormanın kenarında',
      'güneşli bahçede',
      'küçük göletin başında',
      'renk renk çiçeklerin arasında',
      'sıcak ahırın içinde',
      'dağın eteğindeki ormanda',
      'mavi nehrin kıyısında',
      'kocaman çınar ağacının altında',
      'ılık bir evde',
      'bulutların arasında',
      'beyaz karlı tarlada',
    ],

    helpers: [
      { name: 'Anne Ayı',       type: 'anne'           },
      { name: 'Baba Horoz',     type: 'baba'           },
      { name: 'Sarı Köpek',     type: 'köpek'          },
      { name: 'Büyük Kaplumbağa', type: 'kaplumbağa'  },
      { name: 'Neşeli Sincap',  type: 'sincap'         },
      { name: 'Tatlı Kelebek',  type: 'kelebek'        },
      { name: 'Güneş Teyze',    type: 'güneş'          },
      { name: 'Yağmur Damlası', type: 'yağmur damlası' },
      { name: 'Çiçek Peri',     type: 'peri'           },
      { name: 'Büyük Ağaç',     type: 'ağaç'           },
      { name: 'Rüzgar Dede',    type: 'rüzgar'         },
      { name: 'Balık Abi',      type: 'balık'          },
    ],

    conflicts: [
      { short: 'kayıp oyuncağı bulmak',    long: 'en sevdiği oyuncağını kaybetti, onu bulmak istedi'                  },
      { short: 'yeni arkadaş edinmek',     long: 'yalnız hissetti ve birlikte oynayacak bir arkadaş aradı'           },
      { short: 'yuvaya dönmek',            long: 'yuvasından uzaklaştı ve geri dönmenin yolunu aradı'                 },
      { short: 'karnı acıktı',             long: 'karnı çok acıktı, yemek bulmak için yola çıktı'                    },
      { short: 'uyumak istemedi',          long: 'uyku gelmedi, geceyi aydınlatacak bir şey aradı'                    },
      { short: 'yağmurdan korktu',         long: 'büyük yağmurdan korktu, sığınacak bir yer aradı'                   },
      { short: 'kayboldu',                 long: 'yolunu kaybetti ve annesini aramaya başladı'                        },
      { short: 'arkadaşı üzüldü',          long: 'en yakın arkadaşı ağlıyordu, onu güldürmek istedi'                 },
      { short: 'karanlıktan korktu',       long: 'karanlık bastırınca korktu ve cesur olmayı öğrenmek istedi'         },
      { short: 'ağaçtan düştü',            long: 'oynarken ağaçtan düştü ve yardım istedi'                           },
      { short: 'soğukta kaldı',            long: 'kar yağınca üşüdü ve sıcak bir yer aramaya çıktı'                  },
      { short: 'yemek yemek istemedi',     long: 'tabağındaki yemeği yemek istemedi, annesi onu ikna etmeye çalıştı' },
    ],

    lessons: [
      'Anneni ve babanı dinlemek seni güvende tutar.',
      'Arkadaşlarınla paylaşmak çok güzel bir şeydir.',
      'Yardım istemek cesaret ister.',
      'Her şeyin bir zamanı vardır; uyku zamanı gelince uyunur.',
      'Sevgi, her korkuyu yener.',
      'Birlikte olmak, yalnız olmaktan çok daha güzeldir.',
      'Küçük adımlar büyük yolculuklar başlatır.',
      'Gülümsemek herkese iyi gelir.',
    ],

    titlePatterns: [
      '{K} ve {S}',
      'Minik {K}\'nın Günü',
      '{K} Nerede?',
      '{K} ile Güneş',
      'Şirin {K}\'nın Macerası',
      'Küçük {K} ve Arkadaşı',
    ],

    sources: [
      'Türk Çocuk Masalı',
      'Türk Ninnisi',
      'Özgün Türk Masalı',
      'Türk Hayvan Masalı',
      'Türk Bebek Masalı',
    ],

    imageTags: [
      'bebek hayvanlar',
      'sevimli hayvanlar çizgi film',
      'renkli oyuncaklar',
      'çiçekli çayır',
      'güneşli orman',
      'sıcak yuva',
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // LEVEL B — 3-5 yaş: Basit halk masalları
  // Hayvan maceraları, kısa diyaloglar, net iyilik/kötülük
  // ─────────────────────────────────────────────────────────────
  B: {
    heroes: [
      { name: 'Keloğlan',              type: 'köylü çocuk'    },
      { name: 'Küçük Çoban Ali',       type: 'çoban çocuk'    },
      { name: 'Meraklı Tilki Tuncay',  type: 'tilki'          },
      { name: 'Peri Kızı Işık',        type: 'peri kızı'      },
      { name: 'Bilge Kaplumbağa',      type: 'kaplumbağa'     },
      { name: 'Cesur Tavşan',          type: 'tavşan'         },
      { name: 'Sihirli Kuş',           type: 'sihirli kuş'    },
      { name: 'Küçük Prens Ömer',      type: 'prens'          },
      { name: 'Bahçıvan Fatma',        type: 'bahçıvan kız'   },
      { name: 'Orman Masalı Aylin',    type: 'orman kızı'     },
      { name: 'Dürüst Oduncu Hasan',   type: 'oduncu'         },
      { name: 'Sihirbaz Dede',         type: 'yaşlı sihirbaz' },
      { name: 'Masal Prensesi Zehra',  type: 'prenses'        },
      { name: 'Aslan Yavrusu',         type: 'aslan yavrusu'  },
      { name: 'Maceracı Sincap Fındık',type: 'sincap'         },
    ],

    settings: [
      'uzak bir dağ köyünde',
      'büyülü bir ormanın içinde',
      'bir nehrin kıyısında',
      'koca bir çınar ağacının altında',
      'yemyeşil bir vadide',
      'şelalenin yanındaki ormanda',
      'bir köy pazarında',
      'güzel çiçeklerle dolu bir bahçede',
      'dağların ardındaki gizli bir vadide',
      'beyaz taşlı bir köyde',
      'güneşin battığı bir ovada',
      'balıkçıların yaşadığı sahil köyünde',
    ],

    helpers: [
      { name: 'Yaşlı Bilge Dede',   type: 'yaşlı bilge'     },
      { name: 'Ormancı Amca',        type: 'ormancı'         },
      { name: 'Peri Anası',          type: 'peri'            },
      { name: 'Konuşan Kuş',         type: 'sihirli kuş'     },
      { name: 'Cesur Köpek Karabaş', type: 'köpek'           },
      { name: 'Orman Perisi',        type: 'orman perisi'    },
      { name: 'Dost Tilki',          type: 'tilki'           },
      { name: 'Büyük Kaplumbağa',    type: 'kaplumbağa'      },
      { name: 'Balıkçı Dede',        type: 'yaşlı balıkçı'   },
      { name: 'Rüzgar Perisi',       type: 'rüzgar perisi'   },
      { name: 'Su Kızı',             type: 'su perisi'       },
      { name: 'Ağaç Cini',           type: 'orman cini'      },
    ],

    conflicts: [
      { short: 'kayıp hazineyi bulmak',       long: 'köyün hazinesi kaybolmuştu ve onu bulmak için yola çıktı'              },
      { short: 'ormanı kurtarmak',            long: 'orman tehlikedeydi ve onu korumak için mücadele etti'                  },
      { short: 'cadıyı alt etmek',            long: 'kötü bir cadı köye zarar veriyordu ve ona karşı durdu'                 },
      { short: 'sihirli çiçeği bulmak',       long: 'hasta annesini iyileştirecek sihirli çiçeği aramaya çıktı'            },
      { short: 'ejderhayı yenmek',            long: 'köyü korkutan ejderhayı cesareti ve zekasıyla yendi'                  },
      { short: 'kayıp arkadaşı aramak',       long: 'en iyi arkadaşı ormanda kaybolmuştu, onu bulmak için yola düştü'      },
      { short: 'büyüyü bozmak',               long: 'kötü bir büyü altındaki köyü kurtarmak için sihiri bozdu'             },
      { short: 'kışı geçirmek',               long: 'uzun kış geçmeden yiyecek bulmak zorundaydı'                          },
      { short: 'köprüyü onarmak',             long: 'sel götüren köprüyü tamir etmek için çalıştı'                         },
      { short: 'kral hediyesini kazanmak',    long: 'krallığı kurtaran kişiye büyük ödül verileceğini duydu ve yola çıktı' },
      { short: 'doğru yolu bulmak',           long: 'ormanda yolunu kaybetti ve eve geri dönmenin yolunu aradı'            },
      { short: 'dürüstlüğü kanıtlamak',       long: 'suçlandığında masum olduğunu herkese kanıtlamak zorunda kaldı'        },
    ],

    lessons: [
      'Dürüstlük en büyük hazinedir.',
      'Yardımseverlik iyilikle karşılık bulur.',
      'Cesaret, korkunun olmadığı yer değil, korkmana rağmen ilerlediğin yerdir.',
      'Paylaşmak, sahip olunanı çoğaltır.',
      'Sabır ve çalışkanlık her zorluğu aşar.',
      'Büyüklere saygı göstermek seni büyütür.',
      'Hayvanları ve doğayı sevmek güzel bir kalbin işaretidir.',
      'Kibir insanı küçük düşürür, alçakgönüllülük yüceltir.',
    ],

    titlePatterns: [
      '{K} ve Kayıp {S}',
      '{K}\'nın Büyük Macerası',
      '{K} ile Sihirli Orman',
      'Cesur {K}',
      '{K} ve Büyülü {S}',
      'Küçük {K}\'nın Sırrı',
    ],

    sources: [
      'Türk Halk Masalı',
      'Anadolu Masalı',
      'Özgün Türk Masalı',
      'Türk Çocuk Masalı',
      'Türk Hayvan Masalı',
    ],

    imageTags: [
      'orman macerası çizgi film',
      'köy masalı illüstrasyon',
      'sihirli orman peri',
      'kahraman çocuk macera',
      'hayvan dostlar doğa',
      'masal diyarı renkli',
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // LEVEL C — 6-8 yaş: Türk halk masalları, Nasreddin Hoca,
  // dünya masalları, Grimm tarzı
  // ─────────────────────────────────────────────────────────────
  C: {
    heroes: [
      { name: 'Kahraman Mehmet',        type: 'genç köylü'        },
      { name: 'Prenses Zeynep',         type: 'prenses'           },
      { name: 'Bilge Tonyukuk',         type: 'bilge danışman'    },
      { name: 'Yiğit Alp',              type: 'yiğit savaşçı'     },
      { name: 'Köylü Kız Ayşe',         type: 'cesur köylü kız'   },
      { name: 'Nasreddin Hoca',         type: 'hoca'              },
      { name: 'Kurnaz Keloğlan',        type: 'kurnaz genç'       },
      { name: 'Demirci Ali',            type: 'usta demirci'      },
      { name: 'Tüccar Musa',            type: 'gezgin tüccar'     },
      { name: 'Sihirbaz Doktor',        type: 'sihirbaz hekim'    },
      { name: 'Denizci Kaptan Hasan',   type: 'denizci kaptan'    },
      { name: 'Genç Çoban İbrahim',     type: 'çoban'             },
      { name: 'Ormancı Kız Sema',       type: 'ormancı kız'       },
      { name: 'Bilgin Dede Orhan',      type: 'yaşlı bilgin'      },
      { name: 'Korkusuz Kız Fatma',     type: 'cesur kız'         },
    ],

    settings: [
      'Anadolu\'nun güzel bir köyünde',
      'Osmanlı zamanında bir kasabada',
      'Karadeniz sahilinde bir balıkçı köyünde',
      'Toroslar\'ın sarp zirvelerinde',
      'İpek Yolu\'nun üzerindeki bir kervansarayda',
      'Orta Anadolu\'nun geniş bozkırında',
      'bir paşanın sarayının yakınındaki köyde',
      'Ege\'nin zeytinliklerle kaplı tepelerinde',
      'Fırat nehri kıyısındaki antik bir kentte',
      'Doğu Anadolu\'nun karlı dağlarında',
      'Ege kıyısındaki bir ticaret limanında',
      'Güneydoğu\'nun tarihi bir kervan yolunda',
    ],

    helpers: [
      { name: 'Yaşlı Ermişi',          type: 'ermiş'             },
      { name: 'Dervişi',               type: 'derviş'            },
      { name: 'Peri Anası',            type: 'peri'              },
      { name: 'Konuşan Atı',           type: 'sihirli at'        },
      { name: 'Bilge Kartal',          type: 'kartal'            },
      { name: 'Sihirli Halısı',        type: 'sihirli halı'      },
      { name: 'Dost Cini',             type: 'cin'               },
      { name: 'Güvenilir Arkadaşı',    type: 'sadık dost'        },
      { name: 'Köy İhtiyarı',          type: 'köy muhtarı'       },
      { name: 'Kahraman Köpeği',       type: 'sadık köpek'       },
      { name: 'Gizemli Dervişi',       type: 'gizemli derviş'    },
      { name: 'Orman Tanrıçası',       type: 'orman tanrıçası'   },
    ],

    conflicts: [
      { short: 'haksızlığa karşı durmak',    long: 'köylülere haksızlık eden paşaya karşı çıkarak adaleti savundu'        },
      { short: 'hazineyi bulmak',             long: 'kayıp hazineyi yalnızca kendi becerileriyle bulmak zorundaydı'        },
      { short: 'büyülü suyu aramak',          long: 'hastaları iyileştirecek büyülü kaynağı bulmak için diyar diyar gezdi' },
      { short: 'ejderhanın büyüsünü bozmak', long: 'köyü büyüleyen ejderhanın lanetini kırmak için yola çıktı'           },
      { short: 'kötü veziri durdurmak',       long: 'sultanı kandıran kötü vezirin planını ortaya çıkardı'                },
      { short: 'kayıp prensesi kurtarmak',    long: 'kötü güçlerin elindeki prensesi özgür kılmak için her tehlikeyi göze aldı' },
      { short: 'gizemi çözmek',               long: 'kasabada herkesin korktuğu gizemli olayın sırrını araştırdı'         },
      { short: 'yarışmayı kazanmak',          long: 'krallıklar arası büyük yarışmayı kazanmak için hazırlandı'           },
      { short: 'açlığa çözüm bulmak',         long: 'kıtlık yaşayan köyü kurtarmak için çözüm aramaya koyuldu'           },
      { short: 'ata emaneti korumak',         long: 'atalarından kalan kutsal emaneti kötülerin elinden korudu'           },
      { short: 'sürgünden dönmek',            long: 'haksız yere sürgüne gönderildi, haklarını almak için geri döndü'     },
      { short: 'zenginle mücadele etmek',     long: 'açgözlü toprak ağasına karşı köylülerin hakkını savundu'             },
    ],

    lessons: [
      'Zeka ve cesaret birleşince hiçbir engel aşılamaz değildir.',
      'Adalet geç de olsa mutlaka yerini bulur.',
      'Gerçek zenginlik altın değil, bilgelik ve iyiliktir.',
      'Gurur insanı mahvedebilir; alçakgönüllülük yüceltir.',
      'İnsanları görünüşlerine göre yargılamak yanıltıcıdır.',
      'Sabır ve azim, güç ve şiddetin üstündedir.',
      'Doğaya saygı göstermek, ona saygı göstermektir.',
      'Öfkeyle kalkan zararla oturur.',
      'Bilgelik yaşla değil, deneyimle kazanılır.',
    ],

    titlePatterns: [
      '{K} ve {S}',
      '{K}\'nın Sınavı',
      '{K} ile Büyük Mücadele',
      'Bir Zamanlar {K}',
      '{K}\'nın Efsanesi',
      'Yiğit {K} ve {S}',
    ],

    sources: [
      'Türk Halk Masalı',
      'Nasreddin Hoca Fıkrası',
      'Anadolu Efsanesi',
      'Dünya Masalı',
      'Türk Destan Geleneği',
    ],

    imageTags: [
      'Anadolu köy masalı',
      'Osmanlı dönem illüstrasyon',
      'halk masalı kahramanı',
      'Türk efsanesi sanat',
      'sihirli doğu masalı',
      'kahraman yolculuğu manzara',
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // LEVEL D — 9-12 yaş: Destanlar, mitoloji, karmaşık temalar
  // ─────────────────────────────────────────────────────────────
  D: {
    heroes: [
      { name: 'Alp Er Tunga',              type: 'efsanevi alp'         },
      { name: 'Bilge Tonyukuk',            type: 'devlet adamı'         },
      { name: 'Genç Yusuf',                type: 'genç kahraman'        },
      { name: 'Şair Sinan',                type: 'gezgin şair'          },
      { name: 'Denizci Emirhan',           type: 'denizci'              },
      { name: 'Efsanevi Selim',            type: 'efsanevi yönetici'    },
      { name: 'Adalı Kız Deniz',           type: 'cesur ada kızı'       },
      { name: 'Prens Osman',               type: 'genç prens'           },
      { name: 'Bilge Sema',                type: 'genç bilge'           },
      { name: 'Dervişlerin Öğrencisi Hasan', type: 'dervişin öğrencisi' },
      { name: 'Ünlü Usta Demir',           type: 'usta zanaatkar'       },
      { name: 'Strateji Dehası Timur',     type: 'strateji dehası'      },
      { name: 'Korkusuz İzci Kaan',        type: 'izci'                 },
      { name: 'Barış Arayan Aylin',        type: 'barış elçisi'         },
      { name: 'Keşifçi Bülent',            type: 'kaşif'                },
    ],

    settings: [
      'Orta Asya\'nın uçsuz bucaksız bozkırlarında',
      'Göktürk Kağanlığı\'nın başkentinde',
      'Bizans surlarının gölgesinde kalan bir şehirde',
      'Dede Korkut\'un dilinden dökülen bir boyda',
      'İpek Yolu\'nun en tehlikeli geçidinde',
      'Türk mitolojisinin Ergenekon vadisinde',
      'Karadeniz\'in fırtınalı sularında',
      'Selçuklu Sultanı\'nın sarayında',
      'Büyük Okyanus\'u aşmaya çalışan bir gemide',
      'Altaylı dağ boylarının kartal yuvalarında',
      'Mezopotamya\'nın antik şehirlerinden birinde',
      'Doğu Roma sınırındaki uç beyliklerde',
    ],

    helpers: [
      { name: 'Yaşlı Şaman',         type: 'şaman'             },
      { name: 'Tanrı Ülgen',         type: 'gök tanrısı'       },
      { name: 'Pir-i Mugân',         type: 'bilge eren'        },
      { name: 'Dede Korkut',         type: 'ozanlık ruhbabanı' },
      { name: 'Konuşan Bozkurt',     type: 'kutsal bozkurt'    },
      { name: 'Ata Ruhları',         type: 'ata ruhları'       },
      { name: 'Kahraman Yoldaşı',    type: 'sadık dost'        },
      { name: 'Bilge Kadın',         type: 'bilge kadın'       },
      { name: 'Gizli Dernek Üyesi',  type: 'gizli dernek'      },
      { name: 'Kutsal At Boz Aygır', type: 'kutsal at'         },
      { name: 'Tanrı Elçisi Simurg', type: 'efsanevi kuş'      },
      { name: 'İlim Meclisi',        type: 'bilginler meclisi'  },
    ],

    conflicts: [
      { short: 'ülkeyi kurtarmak',             long: 'düşman ordularının kuşatması altındaki vatanı kurtarmak için savaştı'              },
      { short: 'zalim hükümdara karşı durmak', long: 'halkı ezen zalim hükümdara karşı direniş örgütledi'                              },
      { short: 'kayıp destanı bulmak',          long: 'atalarından kalma unutulmuş destanı bulmak ve yaşatmak için yola çıktı'           },
      { short: 'kara büyüyü yenmek',            long: 'koca ülkeyi karanlığa boğan kara büyüye karşı tüm bilgeliğini kullandı'          },
      { short: 'barış anlaşması sağlamak',      long: 'yıllarca savaşan iki toplum arasında kalıcı barışı tesis etmeye çalıştı'         },
      { short: 'kutsal emaneti korumak',        long: 'tüm ulusun geleceğini temsil eden kutsal emaneti düşmanlardan korudu'            },
      { short: 'bilinmeyeni keşfetmek',         long: 'kimsenin gitmediği toprakları keşfedip haritaya işlemek için yola düştü'         },
      { short: 'ihanetçiyi bulmak',             long: 'ordunun içindeki hain casusu deşifre ederek savaşın kaderini değiştirdi'        },
      { short: 'kıtlıktan kurtulmak',           long: 'büyük kıtlıkta halkı açlıktan kurtarmak için dağlar aşıp denizler geçti'        },
      { short: 'salgına çare bulmak',           long: 'şehri mahveden hastalığın tedavisini uzak diyarlarda aramaya gitti'             },
      { short: 'gençliği buldurmak',            long: 'efsanedeki "ölümsüzlük suyu"nun sırrını araştırmak için tehlikeli yolculuğa çıktı'},
      { short: 'boyları birleştirmek',          long: 'birbiriyle çatışan göçebe boyları tek çatı altında toplamak için siyasi mücadele verdi'},
    ],

    lessons: [
      'Bir millet birlikte güçlüdür; ayrılık zayıflık getirir.',
      'Güç, adaletten beslendiğinde kalıcı olur; adaletsiz güç çabuk solar.',
      'Tarihini bilen insan, geleceğini de inşa edebilir.',
      'Bilgelik, deneyimden doğan bir meyvedir; köşköşe saklanmaz.',
      'Kahramanlık yalnızca savaş meydanında değil, vicdanda da sınanır.',
      'Özgürlük uğruna verilen mücadele, tarihin en büyük destanlarını yazar.',
      'Farklı geleneklere saygı, medeniyetin temelidir.',
      'İnsanın en büyük düşmanı çoğu zaman kendi kibridir.',
      'Gerçek liderlik, hizmet etmekle başlar.',
    ],

    titlePatterns: [
      '{K}\'nın Destanı',
      '{K} ve {S}',
      'Yiğit {K}\'nın Sınavı',
      '{K}: {S}',
      '{K}\'nın Son Yolculuğu',
      'Efsane: {K} ve {S}',
    ],

    sources: [
      'Türk Destanı',
      'Türk Halk Masalı',
      'Dede Korkut Hikayeleri',
      'Türk Efsanesi',
      'Dünya Masalı',
      'Yunan Mitolojisi',
      'Türk Tarihi Masalı',
    ],

    imageTags: [
      'Türk destanı epik sanat',
      'bozkır savaşçısı illüstrasyon',
      'Orta Asya mitoloji sanat',
      'Dede Korkut efsanesi',
      'Selçuklu Osmanlı tarihi',
      'kahraman yolculuğu epik manzara',
    ],
  },
};

/**
 * Verilen minimum yaşa göre uygun havuz seviyesini döndürür.
 */
export function getLevel(ageMin: number): AgeLevel {
  if (ageMin <= 2) return 'A';
  if (ageMin <= 5) return 'B';
  if (ageMin <= 8) return 'C';
  return 'D';
}

/**
 * Diziden deterministik biçimde bir öğe seçer.
 * `index` ve isteğe bağlı `prime` çarpanı kullanılarak dizi uzunluğuna göre kalan alınır.
 */
export function pickItem<T>(arr: T[], index: number, prime: number = 1): T {
  return arr[Math.abs(index * prime) % arr.length];
}
