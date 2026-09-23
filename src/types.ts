export interface HeroSlidePill {
  label: string;
  value: string;
}

export interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  pills: HeroSlidePill[];
  notice: string;
  image: string;
  domain: string;
}

export interface VisiMisi {
  visi: string;
  misi: string[];
  tujuan: string[];
}

export interface MottoValue {
  title: string;
  description: string;
  color?: string;
  textColor?: string;
  bgColor?: string;
  borderColor?: string;
}

export interface StatItem {
  value: string;
  label: string;
}

export interface Program {
  id: string;
  code: string;
  title: string;
  subtitle: string;
  description: string;
  equivalency: string; // e.g. Setara SD
  targetAge: string;
  duration: string;
  schedule: string[];
  features: string[];
  iconName: string;
  color: string;
  badgeBg: string;
  image: string;
}

export interface NewsItem {
  id: string;
  title: string;
  slug: string;
  date: string;
  category: string;
  author: string;
  summary: string;
  content: string[];
  image: string;
  readTime: string;
  featured?: boolean;
  tags?: string[];
  views?: number;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: string;
  image: string;
  date: string;
  description?: string;
}

export type VideoPlatform = 'youtube' | 'facebook' | 'instagram' | 'tiktok' | 'vimeo' | 'direct' | 'other';

export interface VideoItem {
  id: string;
  title: string;
  videoUrl: string;
  platform: VideoPlatform;
  category: string;
  date: string;
  description?: string;
  thumbnail?: string;
  duration?: string;
  featured?: boolean;
}

export interface VokasiProgram {
  title: string;
  description: string;
  icon: string;
  duration: string;
  output: string;
}

export interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

export interface Testimonial {
  name: string;
  role: string; // e.g., Alumni Paket C 2024
  program: string;
  quote: string;
  currentActivity: string;
  avatar: string;
}

export interface ContactFormData {
  nama: string;
  email: string;
  telepon: string;
  subjek: string;
  pesan: string;
}

export interface RegistrationFormData {
  // 1. Jenis Pendaftaran & Minat
  pilihanProgram: 'Paket A (Setara SD)' | 'Paket B (Setara SMP)' | 'Paket C (Setara SMA)';
  jenisPendaftaran: 'Baru' | 'Pindahan';
  pendidikanTerakhir?: string;
  hobi?: string;
  citaCita?: string;

  // 2. Data Pribadi
  namaLengkap: string; // *
  nik?: string;
  jenisKelamin: 'Laki-Laki' | 'Perempuan'; // *
  tempatLahir: string; // *
  tanggalLahir: string; // * (YYYY-MM-DD)
  agama: 'Islam' | 'Kristen' | 'Katolik' | 'Hindu' | 'Buddha' | 'Konghucu' | 'Lainnya'; // *
  kebutuhanKhusus?: string;
  alamatJalan: string; // *
  rt?: string;
  rw?: string;
  namaDusun?: string;
  namaKelurahanDesa?: string;
  kecamatan?: string;
  kotaKabupaten: string; // *
  kodePos?: string;
  tempatTinggal?: 'Milik Pribadi' | 'Tinggal Bersama Orang Tua' | 'Asrama' | 'Panti Asuhan' | 'Kost / Sewa' | 'Lainnya';
  modaTransportasi?: 'Jalan Kaki' | 'Sepeda Motor' | 'Sepeda' | 'Mobil Pribadi' | 'Angkutan Umum' | 'Ojek / Online' | 'Lainnya';
  nomorHp: string; // * (WhatsApp)
  nomorTelepon?: string;
  emailPribadi?: string;
  kewarganegaraan: 'WNI' | 'WNA'; // *
  namaNegara?: string;
  passPhoto?: string; // Base64 / URL

  // 3. Data Ayah Kandung
  namaAyahKandung: string; // *
  tahunLahirAyah: string; // *
  pendidikanAyah?: string;
  pekerjaanAyah?: string;
  penghasilanBulananAyah?: string;
  kebutuhanKhususAyah?: string;

  // 4. Data Ibu Kandung
  namaIbuKandung: string; // *
  tahunLahirIbu?: string;
  pendidikanIbu?: string;
  pekerjaanIbu?: string;
  penghasilanBulananIbu?: string;
  kebutuhanKhususIbu?: string;

  // 5. Data Wali
  namaWali?: string;
  tahunLahirWali?: string;
  pendidikanWali?: string;
  pekerjaanWali?: string;
  penghasilanBulananWali?: string;

  // 6. Data Periodik
  tinggiBadan?: string; // Cm
  beratBadan?: string; // Kg
  jarakKeSekolah?: string; // Km
  waktuTempuhKeSekolah?: string; // Menit
  jumlahSaudaraKandung?: string;

  // 7. Dokumen Berkas Persyaratan (Upload KK, Ijazah, KTP)
  dokumenKK?: string; // Base64 data URI (Wajib)
  namaFileKK?: string;
  dokumenIjazah?: string; // Base64 data URI (Wajib)
  namaFileIjazah?: string;
  dokumenKTP?: string; // Base64 data URI (Opsional)
  namaFileKTP?: string;

  // 8. Pernyataan & Keamanan
  pernyataan: boolean; // *

  // Backwards compatibility legacy fields
  tempatTanggalLahir?: string;
  noWhatsapp?: string;
  alamatLengkap?: string;
  namaOrangTuaWali?: string;
  catatanKhusus?: string;
}

export interface RegisteredStudent extends RegistrationFormData {
  id: string;
  registrationCode: string;
  createdAt: string;
  status: 'Menunggu Verifikasi' | 'Terverifikasi' | 'Diterima' | 'Dihubungi';
  adminNotes?: string;
}

export interface PKBMInfoState {
  name: string;
  shortName?: string;
  motto: string;
  tagline: string;
  logoUrl?: string;
  logoShape?: 'square' | 'rounded' | 'circle';
  npsn: string;
  accreditation: string;
  address: string;
  phonePrimary: string;
  phoneSecondary: string;
  whatsappNumber: string;
  email: string;
  operationalHours: string;
  mapsUrl?: string;
  latitude?: number;
  longitude?: number;
  announcementText?: string;
  announcementActive?: boolean;
  // Running Text Ticker di bawah tab menu
  runningText?: string;
  runningTextActive?: boolean;
  runningTextSpeed?: 'slow' | 'normal' | 'fast';
  runningTextBadge?: string;
}

export type PersonaliaCategory = 'pendiri' | 'yayasan' | 'pendidik' | 'tendik';

export type SupabaseConnectionStatus = 'connected' | 'connecting' | 'error' | 'disconnected';

export interface PersonaliaMember {
  id: string;
  name: string;
  role: string;
  category: PersonaliaCategory;
  education?: string;
  specialization?: string;
  nuptkOrNip?: string;
  bio?: string;
  photo: string;
  phone?: string;
  email?: string;
  order?: number;
}

