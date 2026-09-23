import { VisiMisi, Program, NewsItem, VokasiProgram, FAQItem, Testimonial, PersonaliaMember, VideoItem } from '../types';

export const PKBM_INFO = {
  name: 'PKBM BINA INSANI SUMOWONO',
  shortName: 'PKBM Bina Insani',
  tagline: 'HEBAT - MANDIRI - KREATIF',
  motto: 'HEBAT - MANDIRI - KREATIF',
  logoUrl: '',
  logoShape: 'rounded' as const,
  mottoValues: [
    {
      title: 'HEBAT',
      description: 'Humanis, Empati, Berkelanjutan, Adaptif, dan Terampil dalam membina karakter warga belajar.',
      color: 'from-orange-500 to-amber-600',
      textColor: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200'
    },
    {
      title: 'MANDIRI',
      description: 'Mampu berdiri sendiri dengan bekalan jiwa kewirausahaan, vokasi, dan kecakapan hidup abad 21.',
      color: 'from-amber-600 to-orange-700',
      textColor: 'text-amber-700',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200'
    },
    {
      title: 'KREATIF',
      description: 'Inovatif dalam menghasilkan karya unggulan dan solusi cerdas di tengah tantangan masyarakat.',
      color: 'from-orange-600 to-amber-500',
      textColor: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200'
    }
  ],
  address: 'Dusun Kawedusan RT 01 RW 02 Desa Ngadikerso Kecamatan Sumowono Kabupaten Semarang Jawa Tengah',
  phonePrimary: '+62 852-9065-5103',
  phoneSecondary: '+62 852-9065-5103',
  whatsappNumber: '6285290655103',
  email: 'info@pkbmbinainsani.sch.id',
  npsn: 'P9979993',
  operationalHours: 'Senin - Sabtu: 08.00 - 16.00 WIB',
  mapsUrl: 'https://maps.app.goo.gl/rXtEZKokMR9SQqhE8',
  latitude: -7.2574147,
  longitude: 110.3196075,
  stats: [
    { value: '500+', label: 'Lulusan & Alumni' },
    { value: '3', label: 'Program Kesetaraan' },
    { value: '15+', label: 'Tutor & Pengajar' },
    { value: '100%', label: 'Ijazah Resmi Negara' }
  ],
  accreditation: 'Terakreditasi BAN-PDM (NPSN: P9979993)'
};

export const VISI_MISI_DATA: VisiMisi = {
  visi: 'Terwujudnya lembaga pendidikan berkualitas sebagai wahana layanan pendidikan bagi masyarakat untuk meningkatkan SDM yang berakhlak mulia, unggul, terampil, mandiri, kreatif dan inovatif',
  misi: [
    'Menyelenggarakan Pendidikan yang menghasilkan lulusan yang mampu berkompetisi di bidang keilmuan dan berakhlaq mulia',
    'Menyelenggarakan keterampilan untuk mengantarkan lulusan siap memasuki dunia kerja, berwirausaha dan dapat melanjutkan Pendidikan yang lebih unggul',
    'Meningkatkan SDM yang berkualitas sesuai dengan perkembangan jaman dibidang teknologi dan informasi',
    'Meningkatkan kualitas pengelolaan kelembagaan',
    'Meningkatkan kualitas tenaga pendidik dan kependidikan melalui Pendidikan dan pelatihan',
    'Memenuhi sarpras sebagai penunjang KBM'
  ],
  tujuan: [
    'Memfasilitasi masyarakat yang putus sekolah untuk dapat melanjutkan Pendidikan agar mampu berkompetisi di dunia kerja maupun melanjutkan Pendidikan tingkat lanjutan',
    'Meningkatkan kepribadian warga belajar agar berakhlaq mulia sebagai bekal dalam kehidupan bermasyarakat dan sosial',
    'Meningkatkan keterampilan warga belajar sesuai dengan kemapuannya',
    'Meningkatkan keterampilan warga belajar agar lebih berkreasi dan berinovasi'
  ]
};

export const PROGRAMS_DATA: Program[] = [
  {
    id: 'paket-a',
    code: 'Paket A',
    title: 'Program Paket A',
    subtitle: 'Pendidikan Kesetaraan Setara Sekolah Dasar (SD)',
    description: 'Program pendidikan nonformal tingkat dasar yang diperuntukkan bagi warga belajar yang ingin menuntaskan wajib belajar 6 tahun, baik anak usia sekolah maupun dewasa.',
    equivalency: 'Setara SD / MI',
    targetAge: 'Bebas Usia (Anak & Dewasa)',
    duration: 'Fase Kelas 1 - 6 (Dapat Disesuaikan)',
    schedule: ['Tatap Muka Pembelajaran', 'Tutorial Mandiri', 'Kelas Daring / Modul Flexible'],
    features: [
      'Ijazah Resmi Kementerian Pendidikan (Dapat digunakan untuk lanjut ke Paket B / SMP)',
      'Penguatan Literasi & Numerasi Dasar',
      'Pendidikan Karakter & Budi Pekerti Beraqhlak Mulia',
      'Pilihan Waktu Belajar Fleksibel (Cocok untuk yang Bekerja/Membantu Orang Tua)'
    ],
    iconName: 'BookOpen',
    color: 'orange',
    badgeBg: 'bg-orange-100 text-orange-900',
    image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'paket-b',
    code: 'Paket B',
    title: 'Program Paket B',
    subtitle: 'Pendidikan Kesetaraan Setara Sekolah Menengah Pertama (SMP)',
    description: 'Program kesetaraan jenjang menengah pertama yang dirancang untuk membekali ilmu pengetahuan umum, teknologi dasar, dan keterampilan hidup vokasional.',
    equivalency: 'Setara SMP / MTs',
    targetAge: 'Lulusan Paket A / Drop-out SMP / Umum',
    duration: '3 Tahun (6 Semester)',
    schedule: ['Kelas Reguler Tatap Muka', 'Pembelajaran Berbasis Modul', 'Bimbingan Komputer Dasar'],
    features: [
      'Ijazah Resmi Negara untuk Lanjut ke Paket C / SMA / SMK / Kerja',
      'Pelatihan Dasar Komputer & Literasi Digital',
      'Pembelajaran Kurikulum Merdeka Terintegrasi Vokasi',
      'Fasilitas Modul Digital & Cetak Gratis'
    ],
    iconName: 'GraduationCap',
    color: 'blue',
    badgeBg: 'bg-blue-100 text-blue-800',
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'paket-c',
    code: 'Paket C',
    title: 'Program Paket C',
    subtitle: 'Pendidikan Kesetaraan Setara Sekolah Menengah Atas (SMA)',
    description: 'Program jenjang menengah atas dengan pilihan peminatan IPA / IPS yang menyiapkan warga belajar untuk siap kerja, berwirausaha mandiri, maupun berkuliah ke Perguruan Tinggi.',
    equivalency: 'Setara SMA / MA / SMK',
    targetAge: 'Lulusan Paket B / SMP / Umum',
    duration: '3 Tahun (6 Semester)',
    schedule: ['Pembelajaran Tatap Muka', 'Modul Hybrid Learning', 'Praktek Vokasi & Magang Wirausaha'],
    features: [
      'Ijazah Resmi Dapat Digunakan Mendaftar Kuliah PTN / PTS / CPNS / Kerja',
      'Pelatihan Keterampilan Siap Kerja & Kewirausahaan Digital',
      'Bimbingan Persiapan Ujian Kesetaraan & Portofolio Kerja',
      'Jadwal Belajar Menyesuaikan Pekerja atau Kesibukan Warga Belajar'
    ],
    iconName: 'Award',
    color: 'purple',
    badgeBg: 'bg-purple-100 text-purple-800',
    image: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=800&q=80'
  }
];

export const VOKASI_PROGRAMS: VokasiProgram[] = [
  {
    title: 'Komputer & Kewirausahaan Digital',
    description: 'Pelatihan Microsoft Office, Desain Grafis Canva, Pengelolaan Toko Online, dan Pemasaran Digital.',
    icon: 'Laptop',
    duration: '3 Bulan',
    output: 'Sertifikat Keterampilan & Siap Kerja Admin / Digital Marketer'
  },
  {
    title: 'Tata Boga & Kuliner Lokal Sumowono',
    description: 'Pelatihan olahan pangan khas daerah, higiene sanitasi makanan, dan pengemasan produk UMKM.',
    icon: 'Utensils',
    duration: '2 Bulan',
    output: 'Rintangan Usaha Kuliner Mandiri / Produk Siap Jual'
  },
  {
    title: 'Kerajinan Tangan & Olahan Kreatif',
    description: 'Keterampilan daur ulang, pembuatan cinderamata khas daerah Sumowono, dan kreasi tekstil.',
    icon: 'Palette',
    duration: '2 Bulan',
    output: 'Keterampilan Wirausaha Produk Kreatif'
  },
  {
    title: 'Manajemen Usaha & Keuangan Keluarga',
    description: 'Bimbingan literasi keuangan, pencatatan kas, dan pengajuan modal usaha mikro.',
    icon: 'TrendingUp',
    duration: '1 Bulan',
    output: 'Kecakapan Hidup & Kemandirian Finansial'
  }
];

export const NEWS_DATA: NewsItem[] = [
  {
    id: 'news-prestasi-1',
    title: 'Warga Belajar Paket C PKBM Bina Insani Raih Juara 1 Lomba Tata Busana & Desain Mode Kesetaraan',
    slug: 'warga-belajar-raih-juara-1-tata-busana',
    date: '28 Agustus 2026',
    category: 'Prestasi Warga Belajar',
    author: 'Tutor Vokasi & Redaksi',
    summary: 'Karya busana etnik kontemporer hasil rancangan warga belajar PKBM Bina Insani Sumowono berhasil menyabet Juara 1 dalam Lomba Keterampilan Vokasi Kesetaraan tingkat regional.',
    content: [
      'Karya busana etnik kontemporer hasil rancangan warga belajar PKBM Bina Insani Sumowono berhasil menyabet Juara 1 dalam Lomba Keterampilan Vokasi Kesetaraan tingkat regional.',
      'Prestasi membanggakan ini menjadi bukti nyata bahwa pendidikan kesetaraan Paket C mampu melahirkan talenta wirausaha yang kompeten dan siap bersaing di industri kreatif.',
      'Pihak lembaga memberikan apresiasi beasiswa pembinaan serta fasilitasi mesin jahit industri untuk pengembangan unit usaha mandiri warga belajar.'
    ],
    image: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1000&q=80',
    readTime: '3 Menit',
    featured: true,
    tags: ['Prestasi', 'Tata Busana', 'Paket C']
  },
  {
    id: 'news-akademik-1',
    title: 'Pelaksanaan Uji Kesetaraan (UK) Paket A, B, dan C Tahun 2026 Sukses Digelar di Sumowono',
    slug: 'pelaksanaan-uji-kesetaraan-2026-sukses',
    date: '10 September 2026',
    category: 'Akademik',
    author: 'Tim Akademik PKBM',
    summary: 'Sebanyak 128 warga belajar mengikuti Uji Kesetaraan berbasis komputer dengan lancar, tertib, dan tingkat kelulusan yang membanggakan.',
    content: [
      'Sebanyak 128 warga belajar PKBM Bina Insani Sumowono telah menyelesaikan seluruh rangkaian Uji Kesetaraan (UK) berbasis komputer yang diselenggarakan secara resmi oleh Kemendikbudristek.',
      'Dengan persiapan tryout berkala dan pendampingan intensif dari para tutor, seluruh peserta dapat menyelesaikan soal ujian dengan percaya diri.',
      'Ijazah resmi negara berstandar nasional akan segera diterbitkan untuk mendukung kelanjutan studi ke perguruan tinggi maupun persyaratan kenaikan jenjang karir.'
    ],
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1000&q=80',
    readTime: '4 Menit',
    featured: false,
    tags: ['Ujian', 'Paket C', 'Akademik']
  }
];

export const FAQ_DATA: FAQItem[] = [
  {
    question: 'Apakah ijazah dari PKBM Bina Insani Sumowono resmi dari pemerintah?',
    answer: 'Ya, 100% RESMI dari Kementerian Pendidikan, Kebudayaan, Riset, dan Teknologi RI. Ijazah Paket A, B, dan C memiliki kesetaraan hak sipil yang sama dengan ijazah sekolah formal (SD, SMP, SMA) dan terdaftar resmi di Dapodik.',
    category: 'Umum'
  },
  {
    question: 'Apakah ijazah Paket C bisa digunakan untuk daftar kuliah / CPNS / melamar kerja?',
    answer: 'Bisa! Ijazah Paket C sah dan diakui secara penuh untuk melamar pekerjaan di swasta maupun instansi pemerintah (CPNS/PPPK), TNI/POLRI (sesuai ketentuan ketentuan formasi), serta mendaftar ke Perguruan Tinggi Negeri (PTN) maupun Swasta (PTS).',
    category: 'Masa Depan'
  },
  {
    question: 'Apakah ada batasan usia untuk mendaftar?',
    answer: 'Tidak ada batasan usia maksimum. Pendidikan Kesetaraan terbuka bagi siapa saja yang ingin belajar dan menuntaskan pendidikannya, mulai dari usia sekolah hingga usia dewasa.',
    category: 'Pendaftaran'
  },
  {
    question: 'Bagaimana sistem dan waktu pembelajarannya?',
    answer: 'Sistem pembelajaran menggunakan metode Hybrid / Kombinasi (tatap muka berkala, pembelajaran mandiri lewat modul, serta diskusi kelompok/daring). Waktu belajar sangat fleksibel sehingga cocok bagi Anda yang sudah bekerja.',
    category: 'Pembelajaran'
  },
  {
    question: 'Apa saja syarat berkas pendaftaran?',
    answer: 'Syarat umum: 1) Fotokopi Kartu Keluarga (KK) & KTP, 2) Pasfoto ukuran 3x4 (4 lembar, latar merah), 3) Fotokopi Ijazah Pendidikan Terakhir (Ijazah SD untuk Paket B, Ijazah SMP untuk Paket C, atau Rapor Terakhir bagi yang putus sekolah).',
    category: 'Pendaftaran'
  }
];

export const TESTIMONIALS: Testimonial[] = [];

export const PERSONALIA_DATA: PersonaliaMember[] = [
  // 1. PENDIRI (ID Pegawai PEG-001, PEG-002)
  {
    id: 'person-pendiri-1',
    name: 'Drs. H. Ahmad Sudirman, M.Pd.',
    role: 'Ketua Dewan Pembina & Pendiri Lembaga',
    category: 'pendiri',
    education: 'S2 Manajemen Pendidikan UNNES',
    specialization: 'Kebijakan Pendidikan & Manajemen Mutu Kesetaraan',
    nuptkOrNip: 'PEG-001',
    bio: 'Perintis dan pendiri pendidikan kesetaraan PKBM Bina Insani Sumowono sejak 2012 dengan komitmen pengentasan putus sekolah.',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
    phone: '081234567890',
    email: 'pembina@pkbmsumowono.sch.id',
    order: 1
  },
  {
    id: 'person-pendiri-2',
    name: "KH. Syukron Ma'mun, S.Ag.",
    role: 'Dewan Pembina & Tokoh Pendiri',
    category: 'pendiri',
    education: 'S1 Pendidikan Agama Islam UIN Walisongo',
    specialization: 'Pendidikan Karakter & Pengembangan Warga Belajar',
    nuptkOrNip: 'PEG-002',
    bio: 'Tokoh masyarakat dan pembina kerohanian yang mengawal nilai luhur serta budi pekerti warga belajar.',
    photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=600&q=80',
    phone: '081234567891',
    email: 'syukron@pkbmsumowono.sch.id',
    order: 2
  },

  // 2. PENGELOLA - YAYASAN (ID Pegawai PEG-003, PEG-004)
  {
    id: 'person-yayasan-1',
    name: 'Hj. Siti Rahmawati, S.Sos.',
    role: 'Ketua Yayasan Bina Insani',
    category: 'yayasan',
    education: 'S1 Ilmu Komunikasi UNDIP',
    specialization: 'Manajemen Kelembagaan & Hubungan Kemitraan',
    nuptkOrNip: 'PEG-003',
    bio: 'Memimpin koordinasi strategis yayasan, kemitraan DUDI vokasi, dan tata kelola program pendidikan masyarakat.',
    photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80',
    phone: '081398765432',
    email: 'yayasan@pkbmsumowono.sch.id',
    order: 3
  },
  {
    id: 'person-yayasan-2',
    name: 'H. Arif Budiman, S.E.',
    role: 'Sekretaris Yayasan & Pengelola Administrasi',
    category: 'yayasan',
    education: 'S1 Manajemen Ekonomi STIE Widya Manggala',
    specialization: 'Akuntabilitas Lembaga & Perencanaan Program',
    nuptkOrNip: 'PEG-004',
    bio: 'Mengelola tata persuratan, perizinan operasional kesetaraan, dan program penguatan sarana prasarana.',
    photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80',
    phone: '081398765433',
    email: 'sekretariat@pkbmsumowono.sch.id',
    order: 4
  },

  // 2. PENGELOLA - TENAGA KEPENDIDIKAN (ID Pegawai PEG-005, PEG-006)
  {
    id: 'person-tendik-1',
    name: 'Nurul Aini, S.Kom.',
    role: 'Kepala Tenaga Kependidikan & Operator Dapodik',
    category: 'tendik',
    education: 'S1 Sistem Informasi UDINUS',
    specialization: 'Sistem Dapodik Kesetaraan, Asesmen Nasional & Arsip Digital',
    nuptkOrNip: 'PEG-005',
    bio: 'Penanggung jawab administrasi Dapodikmas, sinkronisasi data ijazah, dan operasional laboratorium komputer.',
    photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
    phone: '087812345678',
    email: 'dapodik@pkbmsumowono.sch.id',
    order: 5
  },
  {
    id: 'person-tendik-2',
    name: 'Hendra Setiawan, S.Ak.',
    role: 'Staf Administrasi & Bendahara Operasional',
    category: 'tendik',
    education: 'S1 Akuntansi Universitas Dian Nuswantoro',
    specialization: 'Manajemen Keuangan, BOSP & Layanan Peserta Didik',
    nuptkOrNip: 'PEG-006',
    bio: 'Menangani pembukuan BOS Kesetaraan, administrasi pendaftaran santri/warga belajar, dan inventaris lembaga.',
    photo: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=600&q=80',
    phone: '087812345679',
    email: 'keuangan@pkbmsumowono.sch.id',
    order: 6
  },

  // 3. TUTOR - PENDIDIK (ID Pegawai PEG-007, PEG-008, PEG-009, PEG-010)
  {
    id: 'person-tutor-1',
    name: 'Budi Santoso, S.Pd.',
    role: 'Tutor Matematika & Numerasi Paket B & C',
    category: 'pendidik',
    education: 'S1 Pendidikan Matematika UNNES',
    specialization: 'Matematika Terapan, Aljabar & Logika Bernalar',
    nuptkOrNip: 'PEG-007',
    bio: 'Tutor berdedikasi mengampu numerasi dengan pendekatan kontekstual yang mudah dipahami bagi warga belajar dewasa.',
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    phone: '085612345678',
    email: 'budi.santoso@pkbmsumowono.sch.id',
    order: 7
  },
  {
    id: 'person-tutor-2',
    name: 'Dewi Lestari, S.Pd., M.Hum.',
    role: 'Tutor Bahasa Indonesia & Literasi Budaya',
    category: 'pendidik',
    education: 'S2 Pendidikan Bahasa Indonesia UNNES',
    specialization: 'Literasi Kritis, Menulis Kreatif & Komunikasi Efektif',
    nuptkOrNip: 'PEG-008',
    bio: 'Mengembangkan minat baca dan kemampuan literasi penulisan laporan warga belajar Paket A, B, dan C.',
    photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80',
    phone: '085612345679',
    email: 'dewi.lestari@pkbmsumowono.sch.id',
    order: 8
  },
  {
    id: 'person-tutor-3',
    name: 'Eko Prasetyo, S.Kom.',
    role: 'Tutor Vokasi Komputer & Digital Marketing',
    category: 'pendidik',
    education: 'S1 Teknik Informatika UKSW Salatiga',
    specialization: 'Desain Grafis Canva, Microsoft Office & Pemasaran Online UMKM',
    nuptkOrNip: 'PEG-009',
    bio: 'Instruktur vokasi siap kerja yang membekali warga belajar keterampilan digital praktis bernilai ekonomi.',
    photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80',
    phone: '085612345680',
    email: 'eko.prasetyo@pkbmsumowono.sch.id',
    order: 9
  },
  {
    id: 'person-tutor-4',
    name: 'Siti Maryam, S.Pd.',
    role: 'Tutor Bahasa Inggris & Ilmu Pengetahuan Sosial (IPS)',
    category: 'pendidik',
    education: 'S1 Pendidikan Bahasa Inggris Universitas Negeri Yogyakarta',
    specialization: 'Percakapan Bahasa Inggris Dasar & Pengetahuan Sosial Masyarakat',
    nuptkOrNip: 'PEG-010',
    bio: 'Membimbing percakapan bahasa Inggris praktis dan wawasan kebangsaan yang inklusif serta interaktif.',
    photo: 'https://images.unsplash.com/photo-1534751516642-a171edd2521d?auto=format&fit=crop&w=600&q=80',
    phone: '085612345681',
    email: 'siti.maryam@pkbmsumowono.sch.id',
    order: 10
  }
];

export const INITIAL_VIDEOS: VideoItem[] = [
  {
    id: 'vid-1',
    title: 'Profil PKBM Bina Insani Sumowono & Semangat Belajar Pendidikan Kesetaraan',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    platform: 'youtube',
    category: 'Profil Lembaga',
    date: '10 September 2026',
    description: 'Mengenal lebih dekat PKBM Bina Insani Sumowono, fasilitas ruang belajar, tutor berdedikasi, serta program Paket A, B, dan C.',
    duration: '4:20',
    featured: true
  },
  {
    id: 'vid-2',
    title: 'Praktik Keterampilan Tata Busana & Desain Pakaian Warga Belajar Paket C',
    videoUrl: 'https://www.instagram.com/reel/C8xxxxxxxx/',
    platform: 'instagram',
    category: 'Pelatihan Vokasi',
    date: '28 Agustus 2026',
    description: 'Cuplikan kegiatan praktik menjahit, pembuatan pola busana modern, dan karya busana kreasi warga belajar di Sumowono.',
    duration: '1:00',
    featured: true
  },
  {
    id: 'vid-3',
    title: 'Pelaksanaan Simulasi Uji Kesetaraan (UK) Berbasis Komputer T.A. 2026',
    videoUrl: 'https://www.facebook.com/watch/?v=123456789012345',
    platform: 'facebook',
    category: 'Akademik & Ujian',
    date: '15 Agustus 2026',
    description: 'Dokumentasi kesiapan warga belajar mengikuti simulasi ujian berbasis komputer dengan tertib, mandiri, dan penuh semangat.',
    duration: '3:15'
  },
  {
    id: 'vid-4',
    title: 'Pelatihan Barista Kopi & Pengolahan Hasil Kebun Khas Lereng Sumowono',
    videoUrl: 'https://www.youtube.com/watch?v=ScMzIvxBSi4',
    platform: 'youtube',
    category: 'Wirausaha & UMKM',
    date: '22 Juli 2026',
    description: 'Keseruan kelas vokasi barista dan peracikan kopi lokal sebagai bekal kemandirian ekonomi warga belajar.',
    duration: '5:45'
  }
];

