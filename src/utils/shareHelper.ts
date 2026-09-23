export interface ShareContentData {
  title: string;
  description: string;
  hash: string;
  category?: string;
  image?: string;
  externalUrl?: string;
  isGeolocation?: boolean;
}

export interface PresetShareItem {
  id: string;
  type: 'berita' | 'prestasi' | 'profil' | 'personalia' | 'program' | 'vokasi' | 'faq' | 'kontak' | 'geolocation';
  title: string;
  shortTitle: string;
  description: string;
  hash: string;
  category: string;
  externalUrl?: string;
}

export const MAPS_LOCATION_URL = 'https://maps.app.goo.gl/rXtEZKokMR9SQqhE8';
export const MAPS_DIRECTIONS_URL = 'https://www.google.com/maps/dir/?api=1&destination=-7.2574147,110.3196075';
export const GPS_COORDINATES = '-7.2574147, 110.3196075';

export const getBaseSiteUrl = (): string => {
  if (typeof window !== 'undefined') {
    return `${window.location.origin}${window.location.pathname}`;
  }
  return '';
};

export const getDirectShareUrl = (hash: string): string => {
  const cleanHash = hash.startsWith('#') ? hash : `#${hash}`;
  return `${getBaseSiteUrl()}${cleanHash}`;
};

export const createWhatsAppShareUrl = (title: string, description: string, url: string): string => {
  const text = `*${title}*
PKBM BINA INSANI SUMOWONO
----------------------------------------
${description}

🔗 *Buka Tautan Langsung:*
${url}`;

  return `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
};

export const createTelegramShareUrl = (title: string, url: string): string => {
  return `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title + ' - PKBM Bina Insani Sumowono')}`;
};

export const createFacebookShareUrl = (url: string): string => {
  return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
};

export const triggerNativeShare = async (data: { title: string; text: string; url: string }): Promise<boolean> => {
  if (typeof navigator !== 'undefined' && navigator.share) {
    try {
      await navigator.share(data);
      return true;
    } catch {
      return false;
    }
  }
  return false;
};

export const PRESET_WEBSITE_SECTIONS: PresetShareItem[] = [
  {
    id: 'berita',
    type: 'berita',
    title: 'Berita & Pengumuman Resmi PKBM Bina Insani',
    shortTitle: 'Berita Terkini',
    description: 'Kabar agenda kegiatan, pengumuman ujian kesetaraan, dan informasi resmi PKBM Bina Insani Sumowono.',
    hash: '#berita',
    category: 'Publikasi Resmi'
  },
  {
    id: 'prestasi',
    type: 'prestasi',
    title: 'Prestasi & Kejuaraan Warga Belajar PKBM Bina Insani',
    shortTitle: 'Prestasi Warga Belajar',
    description: 'Dokumentasi pencapaian kejuaraan, medali, dan penghargaan yang diraih oleh warga belajar PKBM Bina Insani.',
    hash: '#prestasi',
    category: 'Pencapaian'
  },
  {
    id: 'profil',
    type: 'profil',
    title: 'Profil, Visi Misi & Landasan Karakter PKBM Bina Insani',
    shortTitle: 'Profil Lembaga',
    description: 'Visi, 6 misi strategis, 4 tujuan pokok, serta pilar karakter HEBAT - MANDIRI - KREATIF terakreditasi resmi.',
    hash: '#tentang-kami',
    category: 'Kelembagaan'
  },
  {
    id: 'personalia',
    type: 'personalia',
    title: 'Profil Personalia, Tutor & Dewan Guru PKBM Bina Insani',
    shortTitle: 'Personalia & Guru',
    description: 'Struktur dewan pengurus yayasan, jajaran tutor pendidik bersertifikasi, dan tenaga kependidikan resmi.',
    hash: '#personalia',
    category: 'Tenaga Pendidik'
  },
  {
    id: 'program',
    type: 'program',
    title: 'Program Pendidikan Kesetaraan Paket A, B, dan C',
    shortTitle: 'Program Kesetaraan',
    description: 'Pendidikan kesetaraan ijazah resmi negara Paket A (SD), Paket B (SMP), dan Paket C (SMA) ber-SPP Gratis.',
    hash: '#program-belajar',
    category: 'Layanan Pendidikan'
  },
  {
    id: 'vokasi',
    type: 'vokasi',
    title: 'Pelatihan Keterampilan Vokasi Siap Kerja PKBM Bina Insani',
    shortTitle: 'Pelatihan Vokasi',
    description: 'Kursus keterampilan kerja terapan gratis: Komputer TI, Tata Busana/Menjahit, Tata Boga, dan Kerajinan.',
    hash: '#vokasi',
    category: 'Keterampilan Terapan'
  },
  {
    id: 'faq',
    type: 'faq',
    title: 'Pusat Bantuan & Tanya Jawab (FAQ) PKBM Bina Insani',
    shortTitle: 'Tanya Jawab (FAQ)',
    description: 'Informasi lengkap legalitas ijazah kesetaraan, batas usia belajar, biaya gratis BOSP, dan prosedur daftar.',
    hash: '#faq',
    category: 'Pusat Bantuan'
  },
  {
    id: 'kontak',
    type: 'kontak',
    title: 'Kontak & Sekretariat Layanan PKBM Bina Insani Sumowono',
    shortTitle: 'Kontak & Sekretariat',
    description: 'Alamat kantor sekretariat, konsultasi WhatsApp resmi, dan jam operasional pelayanan warga belajar.',
    hash: '#kontak',
    category: 'Informasi Kontak'
  },
  {
    id: 'geolocation',
    type: 'geolocation',
    title: 'Titik Geolocation & Navigasi GPS Google Maps PKBM Bina Insani',
    shortTitle: 'Titik Lokasi & Peta GPS',
    description: 'Koordinat GPS -7.25741, 110.31961 Dusun Kawedusan RT 01/02, Desa Ngadikerso, Kec. Sumowono, Kab. Semarang.',
    hash: '#geolocation',
    category: 'Titik Lokasi Resmi',
    externalUrl: MAPS_LOCATION_URL
  }
];
