import { VisiMisi, Program, NewsItem, VokasiProgram, FAQItem, Testimonial, PersonaliaMember } from '../types';

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

export const NEWS_DATA: NewsItem[] = [];

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

export const PERSONALIA_DATA: PersonaliaMember[] = [];

