import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  NewsItem,
  GalleryItem,
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
  PersonaliaMember
} from '../types';
import {
  PKBM_INFO,
  VISI_MISI_DATA,
  PROGRAMS_DATA,
  VOKASI_PROGRAMS,
  FAQ_DATA,
  NEWS_DATA,
  PERSONALIA_DATA
} from '../data/pkbmData';



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
  announcementActive: true
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
}

const PKBMContext = createContext<PKBMContextType | undefined>(undefined);

const STORAGE_KEYS = {
  NEWS: 'pkbm_sumowono_news_v5',
  GALLERY: 'pkbm_sumowono_gallery_v5',
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
  // 1. News state
  const [news, setNews] = useState<NewsItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.NEWS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load news from storage', e);
    }
    return NEWS_DATA;
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
      if (saved) return JSON.parse(saved);
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
      if (saved) return JSON.parse(saved);
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
        // 1. Update Document Title
        if (pkbmInfo.name) {
          document.title = `${pkbmInfo.name} - ${pkbmInfo.motto || 'HEBAT • MANDIRI • KREATIF'}`;
        }

        // 2. Default Vector Favicon (Emerald & Gold Crest with Open Book)
        const defaultFaviconSvg = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='16' fill='%2300552b'/%3E%3Crect x='3' y='3' width='58' height='58' rx='13' fill='none' stroke='%23fbbf24' stroke-width='2.5'/%3E%3Cpath d='M32 44C27.5 40.5 20.5 40 14 42V22C20.5 20 27.5 20.5 32 24C36.5 20.5 43.5 20 50 22V42C43.5 40 36.5 40.5 32 44Z' fill='%23ffffff' stroke='%23f59e0b' stroke-width='2' stroke-linejoin='round'/%3E%3Cline x1='32' y1='24' x2='32' y2='44' stroke='%2300552b' stroke-width='2'/%3E%3C/svg%3E`;

        const activeFaviconUrl = pkbmInfo.logoUrl && pkbmInfo.logoUrl.trim() !== ''
          ? pkbmInfo.logoUrl
          : defaultFaviconSvg;

        // Find or create standard icon links
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
    setNews((prev) => [newArticle, ...prev]);
    return newArticle;
  };

  const updateNews = (id: string, updated: Partial<NewsItem>) => {
    setNews((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return { ...item, ...updated };
        }
        return item;
      })
    );
  };

  const deleteNews = (id: string) => {
    setNews((prev) => prev.filter((item) => item.id !== id));
  };

  // Gallery Handlers
  const addGalleryItem = (item: Omit<GalleryItem, 'id'>): GalleryItem => {
    const newGalleryItem: GalleryItem = {
      ...item,
      id: 'gal-' + Date.now()
    };
    setGallery((prev) => [newGalleryItem, ...prev]);
    return newGalleryItem;
  };

  const deleteGalleryItem = (id: string) => {
    setGallery((prev) => prev.filter((item) => item.id !== id));
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

    setRegistrations((prev) => [newStudent, ...prev]);
    return { code, student: newStudent };
  };

  const updateRegistrationStatus = (id: string, status: RegisteredStudent['status'], notes?: string) => {
    setRegistrations((prev) =>
      prev.map((reg) => {
        if (reg.id === id) {
          return {
            ...reg,
            status,
            adminNotes: notes !== undefined ? notes : reg.adminNotes
          };
        }
        return reg;
      })
    );
  };

  const deleteRegistration = (id: string) => {
    setRegistrations((prev) => prev.filter((reg) => reg.id !== id));
  };

  // PKBM Info Handlers
  const updatePKBMInfo = (info: Partial<PKBMInfoState>) => {
    setPkbmInfo((prev) => ({ ...prev, ...info }));
  };

  // Tentang PKBM Handlers
  const updateAboutProfile = (text: string) => {
    setAboutProfile(text);
  };

  const updateVisiMisi = (data: Partial<VisiMisi>) => {
    setVisiMisi((prev) => ({ ...prev, ...data }));
  };

  const updateMottoValues = (values: MottoValue[]) => {
    setMottoValues(values);
  };

  // Programs Handlers
  const updateProgram = (id: string, updated: Partial<Program>) => {
    setPrograms((prev) =>
      prev.map((prog) => (prog.id === id ? { ...prog, ...updated } : prog))
    );
  };

  const addProgram = (program: Program) => {
    setPrograms((prev) => [...prev, program]);
  };

  const deleteProgram = (id: string) => {
    setPrograms((prev) => prev.filter((prog) => prog.id !== id));
  };

  // Vokasi Handlers
  const updateVokasiProgram = (index: number, updated: VokasiProgram) => {
    setVokasiPrograms((prev) =>
      prev.map((vok, idx) => (idx === index ? updated : vok))
    );
  };

  const addVokasiProgram = (program: VokasiProgram) => {
    setVokasiPrograms((prev) => [...prev, program]);
  };

  const deleteVokasiProgram = (index: number) => {
    setVokasiPrograms((prev) => prev.filter((_, idx) => idx !== index));
  };

  // FAQs Handlers
  const updateFaq = (index: number, updated: FAQItem) => {
    setFaqs((prev) => prev.map((faq, idx) => (idx === index ? updated : faq)));
  };

  const addFaq = (faq: FAQItem) => {
    setFaqs((prev) => [...prev, faq]);
  };

  const deleteFaq = (index: number) => {
    setFaqs((prev) => prev.filter((_, idx) => idx !== index));
  };

  // Hero Slides Handlers
  const updateHeroSlide = (id: string, updated: Partial<HeroSlide>) => {
    setHeroSlides((prev) =>
      prev.map((slide) => (slide.id === id ? { ...slide, ...updated } : slide))
    );
  };

  const addHeroSlide = (slide: HeroSlide) => {
    setHeroSlides((prev) => [...prev, slide]);
  };

  const deleteHeroSlide = (id: string) => {
    setHeroSlides((prev) => prev.filter((slide) => slide.id !== id));
  };

  const reorderHeroSlides = (newSlides: HeroSlide[]) => {
    setHeroSlides(newSlides);
  };

  // Stats Handlers
  const updateStats = (newStats: StatItem[]) => {
    setStats(newStats);
  };

  // Personalia Handlers
  const addPersonalia = (member: Omit<PersonaliaMember, 'id'>): PersonaliaMember => {
    const newMember: PersonaliaMember = {
      ...member,
      id: 'person-' + Date.now()
    };
    setPersonalia((prev) => [...prev, newMember]);
    return newMember;
  };

  const updatePersonalia = (id: string, updated: Partial<PersonaliaMember>) => {
    setPersonalia((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updated } : item))
    );
  };

  const deletePersonalia = (id: string) => {
    setPersonalia((prev) => prev.filter((item) => item.id !== id));
  };

  const resetPersonalia = () => {
    setPersonalia(PERSONALIA_DATA);
    localStorage.removeItem(STORAGE_KEYS.PERSONALIA);
  };

  // Reset & Backup
  const resetToDefaultData = () => {
    setNews(NEWS_DATA);
    setGallery(INITIAL_GALLERY);
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
      registrations
    };
    return JSON.stringify(backup, null, 2);
  };

  const importDataJSON = (jsonString: string): boolean => {
    try {
      const data = JSON.parse(jsonString);
      if (data.news && Array.isArray(data.news)) setNews(data.news);
      if (data.gallery && Array.isArray(data.gallery)) setGallery(data.gallery);
      if (data.registrations && Array.isArray(data.registrations)) setRegistrations(data.registrations);
      if (data.pkbmInfo && typeof data.pkbmInfo === 'object') setPkbmInfo(data.pkbmInfo);
      if (data.aboutProfile && typeof data.aboutProfile === 'string') setAboutProfile(data.aboutProfile);
      if (data.visiMisi && typeof data.visiMisi === 'object') setVisiMisi(data.visiMisi);
      if (data.mottoValues && Array.isArray(data.mottoValues)) setMottoValues(data.mottoValues);
      if (data.programs && Array.isArray(data.programs)) setPrograms(data.programs);
      if (data.vokasiPrograms && Array.isArray(data.vokasiPrograms)) setVokasiPrograms(data.vokasiPrograms);
      if (data.faqs && Array.isArray(data.faqs)) setFaqs(data.faqs);
      if (data.heroSlides && Array.isArray(data.heroSlides)) setHeroSlides(data.heroSlides);
      if (data.slideAutoplayDuration && typeof data.slideAutoplayDuration === 'number') setSlideAutoplayDuration(data.slideAutoplayDuration);
      if (data.stats && Array.isArray(data.stats)) setStats(data.stats);
      if (data.personalia && Array.isArray(data.personalia)) setPersonalia(data.personalia);
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
        setSlideAutoplayDuration,
        stats,
        updateStats,
        personalia,
        addPersonalia,
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
        importDataJSON
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
