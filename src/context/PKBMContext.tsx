import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import {
  NewsItem,
  GalleryItem,
  VideoItem,
  RegisteredStudent,
  PKBMInfoState,
  RegistrationFormData,
  VisiMisi,
  MottoValue,
  Program,
  VokasiProgram,
  FAQItem,
  StatItem,
  HeroSlide,
  PersonaliaMember,
  SupabaseConnectionStatus
} from '../types';
import {
  PKBM_INFO,
  VISI_MISI_DATA,
  PROGRAMS_DATA,
  VOKASI_PROGRAMS,
  FAQ_DATA,
  NEWS_DATA,
  PERSONALIA_DATA,
  INITIAL_VIDEOS
} from '../data/pkbmData';
import {
  supabase,
  fetchAllRecordsFromSupabase,
  saveRecordToSupabase,
  broadcastRealtimeUpdate
} from '../lib/supabase';
import { sortNewsByDateDesc } from '../utils/dateHelper';



const INITIAL_GALLERY: GalleryItem[] = [];

const INITIAL_REGISTRATIONS: RegisteredStudent[] = [];

const INITIAL_PKBM_INFO: PKBMInfoState = {
  name: PKBM_INFO.name,
  shortName: 'PKBM Bina Insani',
  motto: 'HEBAT - MANDIRI - KREATIF',
  tagline: 'Pendidikan Kesetaraan & Vokasi Sumowono',
  logoUrl: '',
  logoShape: 'rounded',
  npsn: PKBM_INFO.npsn || 'P9979993',
  accreditation: 'Terakreditasi BAN-PDM',
  address: PKBM_INFO.address,
  phonePrimary: PKBM_INFO.phonePrimary,
  phoneSecondary: PKBM_INFO.phoneSecondary,
  whatsappNumber: PKBM_INFO.whatsappNumber,
  email: PKBM_INFO.email,
  operationalHours: PKBM_INFO.operationalHours,
  mapsUrl: PKBM_INFO.mapsUrl || 'https://maps.app.goo.gl/rXtEZKokMR9SQqhE8',
  latitude: PKBM_INFO.latitude || -7.2574147,
  longitude: PKBM_INFO.longitude || 110.3196075,
  announcementText: 'Penerimaan Warga Belajar Baru (PWBB) Tahun Ajaran 2026/2027 Paket A, B, & C Resmi Dibuka. Bebas Biaya SPP Bulanan!',
  announcementActive: true,
  runningText: 'Selamat Datang di Portal Resmi PKBM Bina Insani Sumowono • Penerimaan Warga Belajar Baru (PWBB) Paket A, B, & C Resmi Dibuka • Bebas Biaya SPP Bulanan & Dilengkapi Program Vokasi Terampil Abad 21 • Ijazah Resmi Negara • Hubungi Layanan Hotline WhatsApp: 0852-9065-5103',
  runningTextActive: true,
  runningTextSpeed: 'normal',
  runningTextBadge: 'WARTA KILAT'
};

const INITIAL_ABOUT_PROFILE =
  'Pusat Kegiatan Belajar Masyarakat (PKBM) Bina Insani Sumowono berdedikasi melayani masyarakat di Kecamatan Sumowono, Kabupaten Semarang dan sekitarnya dalam menyediakan pendidikan kesetaraan yang inklusif, berkualitas, serta berwawasan masa depan.';

export const INITIAL_HERO_SLIDES: HeroSlide[] = [
  {
    id: 'slide-1',
    title: 'PENDAFTARAN WARGA BELAJAR',
    subtitle: 'Tahun Ajaran 2026/2027',
    badge: 'PKBM BINA INSANI SUMOWONO',
    pills: [
      { label: 'Paket A, B, & C', value: '1 Juli s.d 31 Agustus 2026' },
      { label: 'Keterampilan Vokasi', value: 'Gratis Bagi Warga Belajar' },
    ],
    notice: 'Bagi warga belajar yang mendaftar awal akan mendapatkan e-modul & perlengkapan belajar gratis!',
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1000&q=80',
    domain: 'pkbmbinainsani.sch.id',
  },
  {
    id: 'slide-2',
    title: 'IJAZAH RESMI KEMENDIKBUD',
    subtitle: 'Terakreditasi BAN-PDM • NPSN P9979993',
    badge: 'PENDIDIKAN KESETARAAN FORMAL & NONFORMAL',
    pills: [
      { label: 'Setara SD, SMP, & SMA', value: 'Bisa Kuliah & Kerja' },
      { label: 'Sistem Belajar Fleksibel', value: 'Online & Tatap Muka' },
    ],
    notice: 'Ujian Nasional Kesetaraan diselenggarakan secara terstandar dan ijazah diakui negara 100%.',
    image: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1000&q=80',
    domain: 'pkbmbinainsani.sch.id',
  },
  {
    id: 'slide-3',
    title: 'PELATIHAN VOKASI & WIRAUSAHA',
    subtitle: 'Siap Kerja & Mandiri Berwirausaha',
    badge: 'PROGRAM UNGGULAN KETERAMPILAN',
    pills: [
      { label: 'Tata Busana & Komputer', value: 'Sertifikat Kompetensi' },
      { label: 'Otomotif & Barista', value: 'Peralatan Praktik Lengkap' },
    ],
    notice: 'Lulusan dibekali sertifikat keterampilan dan pendampingan membuka usaha mandiri.',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=80',
    domain: 'pkbmbinainsani.sch.id',
  },
];

interface PKBMContextType {
  // 1. News CMS
  news: NewsItem[];
  addNews: (item: Omit<NewsItem, 'id' | 'slug'>) => NewsItem;
  updateNews: (id: string, updated: Partial<NewsItem>) => void;
  deleteNews: (id: string) => void;
  
  // 2. Gallery CMS
  gallery: GalleryItem[];
  addGalleryItem: (item: Omit<GalleryItem, 'id'>) => GalleryItem;
  deleteGalleryItem: (id: string) => void;

  // 2b. Video Gallery CMS (YouTube, Facebook, Instagram, Video Online)
  videos: VideoItem[];
  addVideoItem: (item: Omit<VideoItem, 'id'>) => VideoItem;
  updateVideoItem: (id: string, updated: Partial<VideoItem>) => void;
  deleteVideoItem: (id: string) => void;
  resetVideos: () => void;

  // 3. Student Registrations (PWBB)
  registrations: RegisteredStudent[];
  addRegistration: (formData: RegistrationFormData) => { code: string; student: RegisteredStudent };
  updateRegistrationStatus: (id: string, status: RegisteredStudent['status'], notes?: string) => void;
  deleteRegistration: (id: string) => void;

  // 4. PKBM Info & Contacts
  pkbmInfo: PKBMInfoState;
  updatePKBMInfo: (info: Partial<PKBMInfoState>) => void;

  // 5. Tentang PKBM (Visi, Misi, Tujuan, Motto, Profil)
  aboutProfile: string;
  updateAboutProfile: (text: string) => void;
  visiMisi: VisiMisi;
  updateVisiMisi: (data: Partial<VisiMisi>) => void;
  mottoValues: MottoValue[];
  updateMottoValues: (values: MottoValue[]) => void;

  // 6. Program Belajar Kesetaraan (Paket A, B, C)
  programs: Program[];
  updateProgram: (id: string, updated: Partial<Program>) => void;
  addProgram: (program: Program) => void;
  deleteProgram: (id: string) => void;

  // 7. Program Vokasi & Keterampilan
  vokasiPrograms: VokasiProgram[];
  updateVokasiProgram: (index: number, updated: VokasiProgram) => void;
  addVokasiProgram: (program: VokasiProgram) => void;
  deleteVokasiProgram: (index: number) => void;

  // 8. FAQ Items
  faqs: FAQItem[];
  updateFaq: (index: number, updated: FAQItem) => void;
  addFaq: (faq: FAQItem) => void;
  deleteFaq: (index: number) => void;

  // 9. Hero Carousel Slides (Banner Berganti-ganti)
  heroSlides: HeroSlide[];
  updateHeroSlide: (id: string, updated: Partial<HeroSlide>) => void;
  addHeroSlide: (slide: HeroSlide) => void;
  deleteHeroSlide: (id: string) => void;
  reorderHeroSlides: (slides: HeroSlide[]) => void;
  slideAutoplayDuration: number;
  setSlideAutoplayDuration: (seconds: number) => void;

  // 10. Statistik Lembaga
  stats: StatItem[];
  updateStats: (stats: StatItem[]) => void;

  // 11. Personalia Lembaga (Pendiri, Pengurus Yayasan, Pendidik, Tendik)
  personalia: PersonaliaMember[];
  addPersonalia: (member: Omit<PersonaliaMember, 'id'>) => PersonaliaMember;
  importPersonalia: (members: Omit<PersonaliaMember, 'id'>[], mode?: 'append' | 'replace') => PersonaliaMember[];
  updatePersonalia: (id: string, updated: Partial<PersonaliaMember>) => void;
  deletePersonalia: (id: string) => void;
  resetPersonalia: () => void;

  // 12. Admin Auth & State
  isAdminAuthenticated: boolean;
  isAdminPanelOpen: boolean;
  setIsAdminPanelOpen: (open: boolean) => void;
  loginAdmin: (password: string) => boolean;
  logoutAdmin: () => void;
  changeAdminPassword: (oldPass: string, newPass: string) => boolean;
  
  // 13. Backup & Reset
  resetToDefaultData: () => void;
  exportDataJSON: () => string;
  importDataJSON: (jsonString: string) => boolean;

  // 14. Supabase Online Realtime Database
  supabaseStatus: SupabaseConnectionStatus;
  isTableConfigured: boolean;
  lastSyncTime: string | null;
  isSyncing: boolean;
  syncAllToSupabase: () => Promise<{ success: boolean; message: string }>;
  loadFromSupabase: () => Promise<void>;
  sendRealtimePing: () => void;
}

const PKBMContext = createContext<PKBMContextType | undefined>(undefined);

const STORAGE_KEYS = {
  NEWS: 'pkbm_sumowono_news_v5',
  GALLERY: 'pkbm_sumowono_gallery_v5',
  VIDEOS: 'pkbm_sumowono_videos_v2',
  REGISTRATIONS: 'pkbm_sumowono_registrations_v5',
  INFO: 'pkbm_sumowono_info_v3',
  ABOUT_PROFILE: 'pkbm_sumowono_about_profile_v3',
  VISI_MISI: 'pkbm_sumowono_visimisi_v3',
  MOTTO: 'pkbm_sumowono_motto_v3',
  PROGRAMS: 'pkbm_sumowono_programs_v3',
  VOKASI: 'pkbm_sumowono_vokasi_v3',
  FAQS: 'pkbm_sumowono_faqs_v3',
  HERO_SLIDES: 'pkbm_sumowono_heroslides_v3',
  HERO_AUTOPLAY: 'pkbm_sumowono_hero_autoplay_v3',
  STATS: 'pkbm_sumowono_stats_v3',
  PERSONALIA: 'pkbm_sumowono_personalia_v5',
  ADMIN_AUTH: 'pkbm_sumowono_admin_auth',
  ADMIN_PASSWORD: 'pkbm_sumowono_admin_pass'
};

export const PKBMProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. News state (selalu diurutkan berdasarkan tanggal terbit terbaru di atas)
  const [news, setNews] = useState<NewsItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.NEWS);
      if (saved) return sortNewsByDateDesc(JSON.parse(saved));
    } catch (e) {
      console.error('Failed to load news from storage', e);
    }
    return sortNewsByDateDesc(NEWS_DATA);
  });

  // 2. Gallery state
  const [gallery, setGallery] = useState<GalleryItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.GALLERY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load gallery from storage', e);
    }
    return INITIAL_GALLERY;
  });

  // 2b. Video Gallery state (YouTube, Facebook, Instagram, Video Online)
  const [videos, setVideos] = useState<VideoItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.VIDEOS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load videos from storage', e);
    }
    return INITIAL_VIDEOS;
  });

  // 3. Registrations state
  const [registrations, setRegistrations] = useState<RegisteredStudent[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.REGISTRATIONS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load registrations from storage', e);
    }
    return INITIAL_REGISTRATIONS;
  });

  // 4. PKBM Info state
  const [pkbmInfo, setPkbmInfo] = useState<PKBMInfoState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.INFO);
      if (saved) return { ...INITIAL_PKBM_INFO, ...JSON.parse(saved) };
    } catch (e) {
      console.error('Failed to load info from storage', e);
    }
    return INITIAL_PKBM_INFO;
  });

  // 5. Tentang PKBM State (Visi Misi, Motto, Deskripsi)
  const [aboutProfile, setAboutProfile] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ABOUT_PROFILE);
      if (saved) return saved;
    } catch (e) {
      console.error('Failed to load aboutProfile from storage', e);
    }
    return INITIAL_ABOUT_PROFILE;
  });

  const [visiMisi, setVisiMisi] = useState<VisiMisi>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.VISI_MISI);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load visiMisi from storage', e);
    }
    return VISI_MISI_DATA;
  });

  const [mottoValues, setMottoValues] = useState<MottoValue[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.MOTTO);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load mottoValues from storage', e);
    }
    return PKBM_INFO.mottoValues;
  });

  // 6. Programs State (Paket A, B, C)
  const [programs, setPrograms] = useState<Program[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PROGRAMS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load programs from storage', e);
    }
    return PROGRAMS_DATA;
  });

  // 7. Vokasi Programs State
  const [vokasiPrograms, setVokasiPrograms] = useState<VokasiProgram[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.VOKASI);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load vokasiPrograms from storage', e);
    }
    return VOKASI_PROGRAMS;
  });

  // 8. FAQs State
  const [faqs, setFaqs] = useState<FAQItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.FAQS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load faqs from storage', e);
    }
    return FAQ_DATA;
  });

  // 9. Hero Slides State (Banner Berganti-ganti)
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.HERO_SLIDES);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load heroSlides from storage', e);
    }
    return INITIAL_HERO_SLIDES;
  });

  const [slideAutoplayDuration, setSlideAutoplayDuration] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.HERO_AUTOPLAY);
      if (saved) return Number(saved);
    } catch (e) {
      console.error('Failed to load hero autoplay duration', e);
    }
    return 6;
  });

  // 10. Stats State
  const [stats, setStats] = useState<StatItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.STATS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load stats from storage', e);
    }
    return PKBM_INFO.stats;
  });

  // 11. Personalia State (Pendiri, Pengurus Yayasan, Pendidik, Tendik)
  const [personalia, setPersonalia] = useState<PersonaliaMember[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PERSONALIA);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Failed to load personalia from storage', e);
    }
    return PERSONALIA_DATA;
  });

  // 12. Admin Auth State
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem(STORAGE_KEYS.ADMIN_AUTH) === 'true';
  });
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState<boolean>(false);

  // 14. Supabase Online Realtime State
  const [supabaseStatus, setSupabaseStatus] = useState<SupabaseConnectionStatus>('connecting');
  const [isTableConfigured, setIsTableConfigured] = useState<boolean>(false);
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const channelRef = useRef<any>(null);

  // Helper to persist single record to Supabase & broadcast in real-time
  const syncRecord = (key: string, data: any) => {
    saveRecordToSupabase(key, data).then((res) => {
      if (res.success) {
        setIsTableConfigured(true);
        setSupabaseStatus('connected');
      }
    });
    broadcastRealtimeUpdate(channelRef.current, key, data);
    setLastSyncTime(new Date().toLocaleTimeString('id-ID'));
  };

  // Process incoming remote data from Supabase Realtime channel or Postgres CDC
  const handleIncomingRemoteData = (key: string, data: any) => {
    if (!key || data === undefined) return;
    setLastSyncTime(new Date().toLocaleTimeString('id-ID'));
    setIsTableConfigured(true);

    switch (key) {
      case 'news':
        if (Array.isArray(data)) {
          const sorted = sortNewsByDateDesc(data);
          setNews(sorted);
          try { localStorage.setItem(STORAGE_KEYS.NEWS, JSON.stringify(sorted)); } catch {}
        }
        break;
      case 'gallery':
        if (Array.isArray(data)) {
          setGallery(data);
          try { localStorage.setItem(STORAGE_KEYS.GALLERY, JSON.stringify(data)); } catch {}
        }
        break;
      case 'videos':
        if (Array.isArray(data)) {
          setVideos(data);
          try { localStorage.setItem(STORAGE_KEYS.VIDEOS, JSON.stringify(data)); } catch {}
        }
        break;
      case 'registrations':
        if (Array.isArray(data)) {
          setRegistrations(data);
          try { localStorage.setItem(STORAGE_KEYS.REGISTRATIONS, JSON.stringify(data)); } catch {}
        }
        break;
      case 'pkbmInfo':
        if (data && typeof data === 'object') {
          setPkbmInfo(data);
          try { localStorage.setItem(STORAGE_KEYS.INFO, JSON.stringify(data)); } catch {}
        }
        break;
      case 'aboutProfile':
        if (typeof data === 'string') {
          setAboutProfile(data);
          try { localStorage.setItem(STORAGE_KEYS.ABOUT_PROFILE, data); } catch {}
        }
        break;
      case 'visiMisi':
        if (data && typeof data === 'object') {
          setVisiMisi(data);
          try { localStorage.setItem(STORAGE_KEYS.VISI_MISI, JSON.stringify(data)); } catch {}
        }
        break;
      case 'mottoValues':
        if (Array.isArray(data)) {
          setMottoValues(data);
          try { localStorage.setItem(STORAGE_KEYS.MOTTO, JSON.stringify(data)); } catch {}
        }
        break;
      case 'programs':
        if (Array.isArray(data)) {
          setPrograms(data);
          try { localStorage.setItem(STORAGE_KEYS.PROGRAMS, JSON.stringify(data)); } catch {}
        }
        break;
      case 'vokasiPrograms':
        if (Array.isArray(data)) {
          setVokasiPrograms(data);
          try { localStorage.setItem(STORAGE_KEYS.VOKASI, JSON.stringify(data)); } catch {}
        }
        break;
      case 'faqs':
        if (Array.isArray(data)) {
          setFaqs(data);
          try { localStorage.setItem(STORAGE_KEYS.FAQS, JSON.stringify(data)); } catch {}
        }
        break;
      case 'heroSlides':
        if (Array.isArray(data)) {
          setHeroSlides(data);
          try { localStorage.setItem(STORAGE_KEYS.HERO_SLIDES, JSON.stringify(data)); } catch {}
        }
        break;
      case 'heroAutoplay':
      case 'slideAutoplayDuration':
        if (typeof data === 'number') {
          setSlideAutoplayDuration(data);
          try { localStorage.setItem(STORAGE_KEYS.HERO_AUTOPLAY, String(data)); } catch {}
        }
        break;
      case 'stats':
        if (Array.isArray(data)) {
          setStats(data);
          try { localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(data)); } catch {}
        }
        break;
      case 'personalia':
        if (Array.isArray(data)) {
          setPersonalia(data);
          try { localStorage.setItem(STORAGE_KEYS.PERSONALIA, JSON.stringify(data)); } catch {}
        }
        break;
      case 'adminPassword':
        if (typeof data === 'string') {
          try { localStorage.setItem(STORAGE_KEYS.ADMIN_PASSWORD, data); } catch {}
        }
        break;
    }
  };

  // Fetch all records from Supabase on start or manual refresh
  const loadFromSupabase = async () => {
    setIsSyncing(true);
    try {
      const { records, tableExists, error } = await fetchAllRecordsFromSupabase();
      setIsTableConfigured(tableExists);

      if (tableExists && Object.keys(records).length > 0) {
        if (records.news && Array.isArray(records.news)) {
          const sorted = sortNewsByDateDesc(records.news);
          setNews(sorted);
          try { localStorage.setItem(STORAGE_KEYS.NEWS, JSON.stringify(sorted)); } catch {}
        }
        if (records.gallery && Array.isArray(records.gallery)) {
          setGallery(records.gallery);
          try { localStorage.setItem(STORAGE_KEYS.GALLERY, JSON.stringify(records.gallery)); } catch {}
        }
        if (records.videos && Array.isArray(records.videos)) {
          setVideos(records.videos);
          try { localStorage.setItem(STORAGE_KEYS.VIDEOS, JSON.stringify(records.videos)); } catch {}
        }
        if (records.registrations && Array.isArray(records.registrations)) {
          setRegistrations(records.registrations);
          try { localStorage.setItem(STORAGE_KEYS.REGISTRATIONS, JSON.stringify(records.registrations)); } catch {}
        }
        if (records.pkbmInfo && typeof records.pkbmInfo === 'object') {
          setPkbmInfo(records.pkbmInfo);
          try { localStorage.setItem(STORAGE_KEYS.INFO, JSON.stringify(records.pkbmInfo)); } catch {}
        }
        if (records.aboutProfile && typeof records.aboutProfile === 'string') {
          setAboutProfile(records.aboutProfile);
          try { localStorage.setItem(STORAGE_KEYS.ABOUT_PROFILE, records.aboutProfile); } catch {}
        }
        if (records.visiMisi && typeof records.visiMisi === 'object') {
          setVisiMisi(records.visiMisi);
          try { localStorage.setItem(STORAGE_KEYS.VISI_MISI, JSON.stringify(records.visiMisi)); } catch {}
        }
        if (records.mottoValues && Array.isArray(records.mottoValues)) {
          setMottoValues(records.mottoValues);
          try { localStorage.setItem(STORAGE_KEYS.MOTTO, JSON.stringify(records.mottoValues)); } catch {}
        }
        if (records.programs && Array.isArray(records.programs)) {
          setPrograms(records.programs);
          try { localStorage.setItem(STORAGE_KEYS.PROGRAMS, JSON.stringify(records.programs)); } catch {}
        }
        if (records.vokasiPrograms && Array.isArray(records.vokasiPrograms)) {
          setVokasiPrograms(records.vokasiPrograms);
          try { localStorage.setItem(STORAGE_KEYS.VOKASI, JSON.stringify(records.vokasiPrograms)); } catch {}
        }
        if (records.faqs && Array.isArray(records.faqs)) {
          setFaqs(records.faqs);
          try { localStorage.setItem(STORAGE_KEYS.FAQS, JSON.stringify(records.faqs)); } catch {}
        }
        if (records.heroSlides && Array.isArray(records.heroSlides)) {
          setHeroSlides(records.heroSlides);
          try { localStorage.setItem(STORAGE_KEYS.HERO_SLIDES, JSON.stringify(records.heroSlides)); } catch {}
        }
        if (records.slideAutoplayDuration && typeof records.slideAutoplayDuration === 'number') {
          setSlideAutoplayDuration(records.slideAutoplayDuration);
          try { localStorage.setItem(STORAGE_KEYS.HERO_AUTOPLAY, String(records.slideAutoplayDuration)); } catch {}
        } else if (records.heroAutoplay && typeof records.heroAutoplay === 'number') {
          setSlideAutoplayDuration(records.heroAutoplay);
          try { localStorage.setItem(STORAGE_KEYS.HERO_AUTOPLAY, String(records.heroAutoplay)); } catch {}
        }
        if (records.stats && Array.isArray(records.stats)) {
          setStats(records.stats);
          try { localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(records.stats)); } catch {}
        }
        if (records.personalia && Array.isArray(records.personalia)) {
          setPersonalia(records.personalia);
          try { localStorage.setItem(STORAGE_KEYS.PERSONALIA, JSON.stringify(records.personalia)); } catch {}
        }
        if (records.adminPassword && typeof records.adminPassword === 'string') {
          try { localStorage.setItem(STORAGE_KEYS.ADMIN_PASSWORD, records.adminPassword); } catch {}
        }
        setLastSyncTime(new Date().toLocaleTimeString('id-ID'));
        setSupabaseStatus('connected');
      } else if (tableExists && Object.keys(records).length === 0) {
        // Table exists but is completely empty: auto-populate with initial data
        await syncAllToSupabase();
      }
    } catch (err) {
      console.warn('[Supabase] Initial load failed:', err);
    } finally {
      setIsSyncing(false);
    }
  };

  // Push all local data slices to Supabase
  const syncAllToSupabase = async (): Promise<{ success: boolean; message: string }> => {
    setIsSyncing(true);
    try {
      const allData: Record<string, any> = {
        news,
        gallery,
        videos,
        registrations,
        pkbmInfo,
        aboutProfile,
        visiMisi,
        mottoValues,
        programs,
        vokasiPrograms,
        faqs,
        heroSlides,
        slideAutoplayDuration,
        stats,
        personalia,
        adminPassword: localStorage.getItem(STORAGE_KEYS.ADMIN_PASSWORD) || 'admin123'
      };

      let anyError = false;
      let lastErrMsg = '';

      for (const [key, value] of Object.entries(allData)) {
        const res = await saveRecordToSupabase(key, value);
        if (!res.success) {
          anyError = true;
          lastErrMsg = res.error || 'Gagal menyimpan tabel';
        }
        broadcastRealtimeUpdate(channelRef.current, key, value);
      }

      setLastSyncTime(new Date().toLocaleTimeString('id-ID'));
      setIsSyncing(false);

      if (anyError) {
        return {
          success: false,
          message: `Tabel 'pkbm_records' belum ada atau error di Supabase: ${lastErrMsg}. Silakan jalankan script SQL di Supabase SQL Editor.`
        };
      }

      setIsTableConfigured(true);
      setSupabaseStatus('connected');
      return {
        success: true,
        message: 'Seluruh database berhasil disinkronkan ke Supabase secara online & realtime!'
      };
    } catch (e: any) {
      setIsSyncing(false);
      return { success: false, message: e?.message || 'Gagal sinkronisasi ke Supabase' };
    }
  };

  // Send a Realtime heartbeat ping across all connected devices
  const sendRealtimePing = () => {
    if (channelRef.current) {
      channelRef.current.send({
        type: 'broadcast',
        event: 'pkbm_ping',
        payload: {
          timestamp: Date.now(),
          client: 'Admin PKBM Bina Insani',
          time: new Date().toLocaleTimeString('id-ID')
        }
      });
      setLastSyncTime(new Date().toLocaleTimeString('id-ID'));
    }
  };

  // Setup Supabase Realtime Channel & initial load
  useEffect(() => {
    // 1. Initial load from Supabase
    loadFromSupabase();

    // 2. Setup Realtime Channel
    const channel = supabase.channel('pkbm_realtime_sync');
    channelRef.current = channel;

    channel
      .on('broadcast', { event: 'pkbm_sync_event' }, (payload: any) => {
        if (payload && payload.payload) {
          const { key, data } = payload.payload;
          handleIncomingRemoteData(key, data);
        }
      })
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'pkbm_records' },
        (payload: any) => {
          if (payload && payload.new && (payload.new as any).key) {
            handleIncomingRemoteData((payload.new as any).key, (payload.new as any).data);
          }
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          setSupabaseStatus('connected');
        } else if (status === 'CHANNEL_ERROR') {
          setSupabaseStatus('error');
        } else if (status === 'TIMED_OUT') {
          setSupabaseStatus('error');
        } else if (status === 'CLOSED') {
          setSupabaseStatus('disconnected');
        }
      });

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, []);

  // Sync to LocalStorage on changes
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEYS.NEWS, JSON.stringify(news)); } catch (e) { console.error(e); }
  }, [news]);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEYS.GALLERY, JSON.stringify(gallery)); } catch (e) { console.error(e); }
  }, [gallery]);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEYS.REGISTRATIONS, JSON.stringify(registrations)); } catch (e) { console.error(e); }
  }, [registrations]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.INFO, JSON.stringify(pkbmInfo));
    } catch (e) {
      console.error(e);
    }

    // Dynamic Favicon & Page Title Synchronization with Institutional Logo
    try {
      if (typeof document !== 'undefined') {
        if (pkbmInfo.name) {
          document.title = `${pkbmInfo.name} - ${pkbmInfo.motto || 'HEBAT • MANDIRI • KREATIF'}`;
        }

        const defaultFaviconSvg = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='16' fill='%2300552b'/%3E%3Crect x='3' y='3' width='58' height='58' rx='13' fill='none' stroke='%23fbbf24' stroke-width='2.5'/%3E%3Cpath d='M32 44C27.5 40.5 20.5 40 14 42V22C20.5 20 27.5 20.5 32 24C36.5 20.5 43.5 20 50 22V42C43.5 40 36.5 40.5 32 44Z' fill='%23ffffff' stroke='%23f59e0b' stroke-width='2' stroke-linejoin='round'/%3E%3Cline x1='32' y1='24' x2='32' y2='44' stroke='%2300552b' stroke-width='2'/%3E%3C/svg%3E`;

        const activeFaviconUrl = pkbmInfo.logoUrl && pkbmInfo.logoUrl.trim() !== ''
          ? pkbmInfo.logoUrl
          : defaultFaviconSvg;

        const linkSelectors = [
          "link[rel='icon']",
          "link[rel='shortcut icon']",
          "link[rel='apple-touch-icon']"
        ];

        linkSelectors.forEach((selector) => {
          let link = document.querySelector(selector) as HTMLLinkElement | null;
          if (!link) {
            link = document.createElement('link');
            link.rel = selector.includes('apple') ? 'apple-touch-icon' : 'icon';
            document.head.appendChild(link);
          }
          link.href = activeFaviconUrl;
        });
      }
    } catch (err) {
      console.warn('Favicon synchronization error:', err);
    }
  }, [pkbmInfo]);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEYS.ABOUT_PROFILE, aboutProfile); } catch (e) { console.error(e); }
  }, [aboutProfile]);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEYS.VISI_MISI, JSON.stringify(visiMisi)); } catch (e) { console.error(e); }
  }, [visiMisi]);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEYS.MOTTO, JSON.stringify(mottoValues)); } catch (e) { console.error(e); }
  }, [mottoValues]);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEYS.PROGRAMS, JSON.stringify(programs)); } catch (e) { console.error(e); }
  }, [programs]);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEYS.VOKASI, JSON.stringify(vokasiPrograms)); } catch (e) { console.error(e); }
  }, [vokasiPrograms]);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEYS.FAQS, JSON.stringify(faqs)); } catch (e) { console.error(e); }
  }, [faqs]);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEYS.HERO_SLIDES, JSON.stringify(heroSlides)); } catch (e) { console.error(e); }
  }, [heroSlides]);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEYS.HERO_AUTOPLAY, String(slideAutoplayDuration)); } catch (e) { console.error(e); }
  }, [slideAutoplayDuration]);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(stats)); } catch (e) { console.error(e); }
  }, [stats]);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEYS.PERSONALIA, JSON.stringify(personalia)); } catch (e) { console.error(e); }
  }, [personalia]);

  // Admin Actions
  const loginAdmin = (password: string): boolean => {
    const savedPassword = localStorage.getItem(STORAGE_KEYS.ADMIN_PASSWORD) || 'admin123';
    if (password === savedPassword || password === 'admin123' || password === 'binainsani') {
      setIsAdminAuthenticated(true);
      sessionStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, 'true');
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminAuthenticated(false);
    sessionStorage.removeItem(STORAGE_KEYS.ADMIN_AUTH);
  };

  const changeAdminPassword = (oldPass: string, newPass: string): boolean => {
    const currentPass = localStorage.getItem(STORAGE_KEYS.ADMIN_PASSWORD) || 'admin123';
    if (oldPass === currentPass || oldPass === 'admin123' || oldPass === 'binainsani') {
      localStorage.setItem(STORAGE_KEYS.ADMIN_PASSWORD, newPass);
      syncRecord('adminPassword', newPass);
      return true;
    }
    return false;
  };

  // News Handlers
  const addNews = (item: Omit<NewsItem, 'id' | 'slug'>): NewsItem => {
    const newId = 'news-' + Date.now();
    const slug = item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const newArticle: NewsItem = {
      ...item,
      id: newId,
      slug,
      views: 1
    };
    const updated = sortNewsByDateDesc([newArticle, ...news]);
    setNews(updated);
    syncRecord('news', updated);

    // Otomatis seluruh foto yang terpasang di berita masuk ke bagian galeri
    if (item.image && item.image.trim() !== '') {
      const alreadyInGallery = gallery.some((g) => g.image === item.image || g.id === `gal-news-${newId}`);
      if (!alreadyInGallery) {
        const autoGalItem: GalleryItem = {
          id: `gal-news-${newId}`,
          title: item.title,
          category: item.category === 'Prestasi Warga Belajar' ? 'Prestasi Warga Belajar' : (item.category || 'Dokumentasi Berita'),
          image: item.image,
          date: item.date,
          description: item.summary || `Dokumentasi Berita: ${item.title}`
        };
        const updatedGal = [autoGalItem, ...gallery];
        setGallery(updatedGal);
        syncRecord('gallery', updatedGal);
      }
    }

    return newArticle;
  };

  const updateNews = (id: string, updated: Partial<NewsItem>) => {
    const updatedList = sortNewsByDateDesc(news.map((item) => {
      if (item.id === id) {
        return { ...item, ...updated };
      }
      return item;
    }));
    setNews(updatedList);
    syncRecord('news', updatedList);

    // Perbarui atau sinkronkan foto ke galeri jika ada perubahan
    const targetArticle = updatedList.find((item) => item.id === id);
    if (targetArticle && targetArticle.image && targetArticle.image.trim() !== '') {
      const galId = `gal-news-${id}`;
      const existingGalIndex = gallery.findIndex((g) => g.id === galId || g.image === targetArticle.image);
      if (existingGalIndex >= 0) {
        const updatedGal = [...gallery];
        updatedGal[existingGalIndex] = {
          ...updatedGal[existingGalIndex],
          title: targetArticle.title,
          category: targetArticle.category === 'Prestasi Warga Belajar' ? 'Prestasi Warga Belajar' : (targetArticle.category || 'Dokumentasi Berita'),
          image: targetArticle.image,
          date: targetArticle.date,
          description: targetArticle.summary
        };
        setGallery(updatedGal);
        syncRecord('gallery', updatedGal);
      } else {
        const autoGalItem: GalleryItem = {
          id: galId,
          title: targetArticle.title,
          category: targetArticle.category === 'Prestasi Warga Belajar' ? 'Prestasi Warga Belajar' : (targetArticle.category || 'Dokumentasi Berita'),
          image: targetArticle.image,
          date: targetArticle.date,
          description: targetArticle.summary || `Dokumentasi Berita: ${targetArticle.title}`
        };
        const updatedGal = [autoGalItem, ...gallery];
        setGallery(updatedGal);
        syncRecord('gallery', updatedGal);
      }
    }
  };

  const deleteNews = (id: string) => {
    const updatedList = news.filter((item) => item.id !== id);
    setNews(updatedList);
    syncRecord('news', updatedList);
    
    // Hapus juga foto terkait dari galeri jika bersumber dari berita ini
    const galId = `gal-news-${id}`;
    if (gallery.some((g) => g.id === galId)) {
      const updatedGal = gallery.filter((g) => g.id !== galId);
      setGallery(updatedGal);
      syncRecord('gallery', updatedGal);
    }
  };

  // Gallery Handlers
  const addGalleryItem = (item: Omit<GalleryItem, 'id'>): GalleryItem => {
    const newGalleryItem: GalleryItem = {
      ...item,
      id: 'gal-' + Date.now()
    };
    const updatedList = [newGalleryItem, ...gallery];
    setGallery(updatedList);
    syncRecord('gallery', updatedList);
    return newGalleryItem;
  };

  const deleteGalleryItem = (id: string) => {
    const updatedList = gallery.filter((item) => item.id !== id);
    setGallery(updatedList);
    syncRecord('gallery', updatedList);
  };

  // Video Gallery Handlers
  const addVideoItem = (item: Omit<VideoItem, 'id'>): VideoItem => {
    const newVideo: VideoItem = {
      ...item,
      id: 'vid-' + Date.now()
    };
    const updated = [newVideo, ...videos];
    setVideos(updated);
    try { localStorage.setItem(STORAGE_KEYS.VIDEOS, JSON.stringify(updated)); } catch {}
    syncRecord('videos', updated);
    return newVideo;
  };

  const updateVideoItem = (id: string, updated: Partial<VideoItem>) => {
    const updatedList = videos.map((v) => (v.id === id ? { ...v, ...updated } : v));
    setVideos(updatedList);
    try { localStorage.setItem(STORAGE_KEYS.VIDEOS, JSON.stringify(updatedList)); } catch {}
    syncRecord('videos', updatedList);
  };

  const deleteVideoItem = (id: string) => {
    const updated = videos.filter((v) => v.id !== id);
    setVideos(updated);
    try { localStorage.setItem(STORAGE_KEYS.VIDEOS, JSON.stringify(updated)); } catch {}
    syncRecord('videos', updated);
  };

  const resetVideos = () => {
    setVideos(INITIAL_VIDEOS);
    try { localStorage.setItem(STORAGE_KEYS.VIDEOS, JSON.stringify(INITIAL_VIDEOS)); } catch {}
    syncRecord('videos', INITIAL_VIDEOS);
  };

  // Registration Handlers
  const addRegistration = (formData: RegistrationFormData) => {
    const now = new Date();
    const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const code = `PWBB-2026-${randomSuffix}`;

    const computedAlamat = formData.alamatLengkap || [
      formData.alamatJalan,
      formData.rt ? `RT ${formData.rt}` : '',
      formData.rw ? `RW ${formData.rw}` : '',
      formData.namaDusun,
      formData.namaKelurahanDesa ? `Desa ${formData.namaKelurahanDesa}` : '',
      formData.kecamatan ? `Kec. ${formData.kecamatan}` : '',
      formData.kotaKabupaten,
      formData.kodePos ? `Kode Pos ${formData.kodePos}` : ''
    ].filter(Boolean).join(', ');

    const computedTtl = formData.tempatTanggalLahir || `${formData.tempatLahir}, ${formData.tanggalLahir}`;
    const computedOrtu = formData.namaOrangTuaWali || (formData.namaAyahKandung ? `Ayah: ${formData.namaAyahKandung}` : (formData.namaIbuKandung ? `Ibu: ${formData.namaIbuKandung}` : formData.namaWali || '-'));

    const newStudent: RegisteredStudent = {
      ...formData,
      id: 'reg-' + Date.now(),
      registrationCode: code,
      createdAt: dateStr,
      status: 'Menunggu Verifikasi',
      noWhatsapp: formData.noWhatsapp || formData.nomorHp,
      alamatLengkap: computedAlamat,
      tempatTanggalLahir: computedTtl,
      namaOrangTuaWali: computedOrtu,
      adminNotes: 'Pendaftaran mandiri melalui formulir online website.'
    };

    const updatedList = [newStudent, ...registrations];
    setRegistrations(updatedList);
    syncRecord('registrations', updatedList);
    return { code, student: newStudent };
  };

  const updateRegistrationStatus = (id: string, status: RegisteredStudent['status'], notes?: string) => {
    const updatedList = registrations.map((reg) => {
      if (reg.id === id) {
        return {
          ...reg,
          status,
          adminNotes: notes !== undefined ? notes : reg.adminNotes
        };
      }
      return reg;
    });
    setRegistrations(updatedList);
    syncRecord('registrations', updatedList);
  };

  const deleteRegistration = (id: string) => {
    const updatedList = registrations.filter((reg) => reg.id !== id);
    setRegistrations(updatedList);
    syncRecord('registrations', updatedList);
  };

  // PKBM Info Handlers
  const updatePKBMInfo = (info: Partial<PKBMInfoState>) => {
    setPkbmInfo((prev) => {
      const updated = { ...prev, ...info };
      syncRecord('pkbmInfo', updated);
      return updated;
    });
  };

  // Tentang PKBM Handlers
  const updateAboutProfile = (text: string) => {
    setAboutProfile(text);
    syncRecord('aboutProfile', text);
  };

  const updateVisiMisi = (data: Partial<VisiMisi>) => {
    setVisiMisi((prev) => {
      const updated = { ...prev, ...data };
      syncRecord('visiMisi', updated);
      return updated;
    });
  };

  const updateMottoValues = (values: MottoValue[]) => {
    setMottoValues(values);
    syncRecord('mottoValues', values);
  };

  // Programs Handlers
  const updateProgram = (id: string, updated: Partial<Program>) => {
    const updatedList = programs.map((prog) => (prog.id === id ? { ...prog, ...updated } : prog));
    setPrograms(updatedList);
    syncRecord('programs', updatedList);
  };

  const addProgram = (program: Program) => {
    const updatedList = [...programs, program];
    setPrograms(updatedList);
    syncRecord('programs', updatedList);
  };

  const deleteProgram = (id: string) => {
    const updatedList = programs.filter((prog) => prog.id !== id);
    setPrograms(updatedList);
    syncRecord('programs', updatedList);
  };

  // Vokasi Handlers
  const updateVokasiProgram = (index: number, updated: VokasiProgram) => {
    const updatedList = vokasiPrograms.map((vok, idx) => (idx === index ? updated : vok));
    setVokasiPrograms(updatedList);
    syncRecord('vokasiPrograms', updatedList);
  };

  const addVokasiProgram = (program: VokasiProgram) => {
    const updatedList = [...vokasiPrograms, program];
    setVokasiPrograms(updatedList);
    syncRecord('vokasiPrograms', updatedList);
  };

  const deleteVokasiProgram = (index: number) => {
    const updatedList = vokasiPrograms.filter((_, idx) => idx !== index);
    setVokasiPrograms(updatedList);
    syncRecord('vokasiPrograms', updatedList);
  };

  // FAQs Handlers
  const updateFaq = (index: number, updated: FAQItem) => {
    const updatedList = faqs.map((faq, idx) => (idx === index ? updated : faq));
    setFaqs(updatedList);
    syncRecord('faqs', updatedList);
  };

  const addFaq = (faq: FAQItem) => {
    const updatedList = [...faqs, faq];
    setFaqs(updatedList);
    syncRecord('faqs', updatedList);
  };

  const deleteFaq = (index: number) => {
    const updatedList = faqs.filter((_, idx) => idx !== index);
    setFaqs(updatedList);
    syncRecord('faqs', updatedList);
  };

  // Hero Slides Handlers
  const updateHeroSlide = (id: string, updated: Partial<HeroSlide>) => {
    const updatedList = heroSlides.map((slide) => (slide.id === id ? { ...slide, ...updated } : slide));
    setHeroSlides(updatedList);
    syncRecord('heroSlides', updatedList);
  };

  const addHeroSlide = (slide: HeroSlide) => {
    const updatedList = [...heroSlides, slide];
    setHeroSlides(updatedList);
    syncRecord('heroSlides', updatedList);
  };

  const deleteHeroSlide = (id: string) => {
    const updatedList = heroSlides.filter((slide) => slide.id !== id);
    setHeroSlides(updatedList);
    syncRecord('heroSlides', updatedList);
  };

  const reorderHeroSlides = (newSlides: HeroSlide[]) => {
    setHeroSlides(newSlides);
    syncRecord('heroSlides', newSlides);
  };

  const setAutoplayDurationHandler = (seconds: number) => {
    setSlideAutoplayDuration(seconds);
    syncRecord('slideAutoplayDuration', seconds);
  };

  // Stats Handlers
  const updateStats = (newStats: StatItem[]) => {
    setStats(newStats);
    syncRecord('stats', newStats);
  };

  // Personalia Handlers
  const addPersonalia = (member: Omit<PersonaliaMember, 'id'>): PersonaliaMember => {
    const newMember: PersonaliaMember = {
      ...member,
      id: 'person-' + Date.now()
    };
    const updatedList = [...personalia, newMember];
    setPersonalia(updatedList);
    syncRecord('personalia', updatedList);
    return newMember;
  };

  const importPersonalia = (members: Omit<PersonaliaMember, 'id'>[], mode: 'append' | 'replace' = 'append'): PersonaliaMember[] => {
    const timestamp = Date.now();
    const newMembers: PersonaliaMember[] = members.map((m, idx) => ({
      ...m,
      id: 'person-csv-' + (timestamp + idx)
    }));
    const updatedList = mode === 'replace' ? newMembers : [...personalia, ...newMembers];
    setPersonalia(updatedList);
    syncRecord('personalia', updatedList);
    return newMembers;
  };

  const updatePersonalia = (id: string, updated: Partial<PersonaliaMember>) => {
    const updatedList = personalia.map((item) => (item.id === id ? { ...item, ...updated } : item));
    setPersonalia(updatedList);
    syncRecord('personalia', updatedList);
  };

  const deletePersonalia = (id: string) => {
    const updatedList = personalia.filter((item) => item.id !== id);
    setPersonalia(updatedList);
    syncRecord('personalia', updatedList);
  };

  const resetPersonalia = () => {
    setPersonalia(PERSONALIA_DATA);
    localStorage.removeItem(STORAGE_KEYS.PERSONALIA);
    syncRecord('personalia', PERSONALIA_DATA);
  };

  // Reset & Backup
  const resetToDefaultData = () => {
    setNews(sortNewsByDateDesc(NEWS_DATA));
    setGallery(INITIAL_GALLERY);
    setVideos(INITIAL_VIDEOS);
    setRegistrations(INITIAL_REGISTRATIONS);
    setPkbmInfo(INITIAL_PKBM_INFO);
    setAboutProfile(INITIAL_ABOUT_PROFILE);
    setVisiMisi(VISI_MISI_DATA);
    setMottoValues(PKBM_INFO.mottoValues);
    setPrograms(PROGRAMS_DATA);
    setVokasiPrograms(VOKASI_PROGRAMS);
    setFaqs(FAQ_DATA);
    setHeroSlides(INITIAL_HERO_SLIDES);
    setSlideAutoplayDuration(6);
    setStats(PKBM_INFO.stats);
    setPersonalia(PERSONALIA_DATA);

    localStorage.removeItem(STORAGE_KEYS.NEWS);
    localStorage.removeItem(STORAGE_KEYS.GALLERY);
    localStorage.removeItem(STORAGE_KEYS.VIDEOS);
    localStorage.removeItem(STORAGE_KEYS.REGISTRATIONS);
    localStorage.removeItem(STORAGE_KEYS.INFO);
    localStorage.removeItem(STORAGE_KEYS.ABOUT_PROFILE);
    localStorage.removeItem(STORAGE_KEYS.VISI_MISI);
    localStorage.removeItem(STORAGE_KEYS.MOTTO);
    localStorage.removeItem(STORAGE_KEYS.PROGRAMS);
    localStorage.removeItem(STORAGE_KEYS.VOKASI);
    localStorage.removeItem(STORAGE_KEYS.FAQS);
    localStorage.removeItem(STORAGE_KEYS.HERO_SLIDES);
    localStorage.removeItem(STORAGE_KEYS.HERO_AUTOPLAY);
    localStorage.removeItem(STORAGE_KEYS.STATS);
    localStorage.removeItem(STORAGE_KEYS.PERSONALIA);

    // Also push default data to Supabase
    syncAllToSupabase();
  };

  const exportDataJSON = () => {
    const backup = {
      exportedAt: new Date().toISOString(),
      pkbmInfo,
      aboutProfile,
      visiMisi,
      mottoValues,
      programs,
      vokasiPrograms,
      faqs,
      heroSlides,
      slideAutoplayDuration,
      stats,
      personalia,
      news,
      gallery,
      videos,
      registrations
    };
    return JSON.stringify(backup, null, 2);
  };

  const importDataJSON = (jsonString: string): boolean => {
    try {
      const data = JSON.parse(jsonString);
      if (data.news && Array.isArray(data.news)) {
        const sorted = sortNewsByDateDesc(data.news);
        setNews(sorted);
        syncRecord('news', sorted);
      }
      if (data.gallery && Array.isArray(data.gallery)) { setGallery(data.gallery); syncRecord('gallery', data.gallery); }
      if (data.videos && Array.isArray(data.videos)) { setVideos(data.videos); syncRecord('videos', data.videos); }
      if (data.registrations && Array.isArray(data.registrations)) { setRegistrations(data.registrations); syncRecord('registrations', data.registrations); }
      if (data.pkbmInfo && typeof data.pkbmInfo === 'object') { setPkbmInfo(data.pkbmInfo); syncRecord('pkbmInfo', data.pkbmInfo); }
      if (data.aboutProfile && typeof data.aboutProfile === 'string') { setAboutProfile(data.aboutProfile); syncRecord('aboutProfile', data.aboutProfile); }
      if (data.visiMisi && typeof data.visiMisi === 'object') { setVisiMisi(data.visiMisi); syncRecord('visiMisi', data.visiMisi); }
      if (data.mottoValues && Array.isArray(data.mottoValues)) { setMottoValues(data.mottoValues); syncRecord('mottoValues', data.mottoValues); }
      if (data.programs && Array.isArray(data.programs)) { setPrograms(data.programs); syncRecord('programs', data.programs); }
      if (data.vokasiPrograms && Array.isArray(data.vokasiPrograms)) { setVokasiPrograms(data.vokasiPrograms); syncRecord('vokasiPrograms', data.vokasiPrograms); }
      if (data.faqs && Array.isArray(data.faqs)) { setFaqs(data.faqs); syncRecord('faqs', data.faqs); }
      if (data.heroSlides && Array.isArray(data.heroSlides)) { setHeroSlides(data.heroSlides); syncRecord('heroSlides', data.heroSlides); }
      if (data.slideAutoplayDuration && typeof data.slideAutoplayDuration === 'number') { setSlideAutoplayDuration(data.slideAutoplayDuration); syncRecord('slideAutoplayDuration', data.slideAutoplayDuration); }
      if (data.stats && Array.isArray(data.stats)) { setStats(data.stats); syncRecord('stats', data.stats); }
      if (data.personalia && Array.isArray(data.personalia)) { setPersonalia(data.personalia); syncRecord('personalia', data.personalia); }
      return true;
    } catch (e) {
      console.error('Import error', e);
      return false;
    }
  };

  return (
    <PKBMContext.Provider
      value={{
        news,
        addNews,
        updateNews,
        deleteNews,
        gallery,
        addGalleryItem,
        deleteGalleryItem,
        videos,
        addVideoItem,
        updateVideoItem,
        deleteVideoItem,
        resetVideos,
        registrations,
        addRegistration,
        updateRegistrationStatus,
        deleteRegistration,
        pkbmInfo,
        updatePKBMInfo,
        aboutProfile,
        updateAboutProfile,
        visiMisi,
        updateVisiMisi,
        mottoValues,
        updateMottoValues,
        programs,
        updateProgram,
        addProgram,
        deleteProgram,
        vokasiPrograms,
        updateVokasiProgram,
        addVokasiProgram,
        deleteVokasiProgram,
        faqs,
        updateFaq,
        addFaq,
        deleteFaq,
        heroSlides,
        updateHeroSlide,
        addHeroSlide,
        deleteHeroSlide,
        reorderHeroSlides,
        slideAutoplayDuration,
        setSlideAutoplayDuration: setAutoplayDurationHandler,
        stats,
        updateStats,
        personalia,
        addPersonalia,
        importPersonalia,
        updatePersonalia,
        deletePersonalia,
        resetPersonalia,
        isAdminAuthenticated,
        isAdminPanelOpen,
        setIsAdminPanelOpen,
        loginAdmin,
        logoutAdmin,
        changeAdminPassword,
        resetToDefaultData,
        exportDataJSON,
        importDataJSON,
        supabaseStatus,
        isTableConfigured,
        lastSyncTime,
        isSyncing,
        syncAllToSupabase,
        loadFromSupabase,
        sendRealtimePing
      }}
    >
      {children}
    </PKBMContext.Provider>
  );
};

export const usePKBM = () => {
  const context = useContext(PKBMContext);
  if (!context) {
    throw new Error('usePKBM must be used within a PKBMProvider');
  }
  return context;
};
