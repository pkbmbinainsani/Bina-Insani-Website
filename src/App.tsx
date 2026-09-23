import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Newspaper,
  Trophy,
  Award,
  Users,
  GraduationCap,
  Wrench,
  ImageIcon,
  HelpCircle,
  MapPin
} from 'lucide-react';
import { PKBMProvider, usePKBM } from './context/PKBMContext';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { QuickPortalBar } from './components/QuickPortalBar';
import { HomeHighlights } from './components/HomeHighlights';
import { PageHeaderBanner } from './components/PageHeaderBanner';
import { AboutUs } from './components/AboutUs';
import { PersonaliaSection } from './components/PersonaliaSection';
import { Programs } from './components/Programs';
import { VokasiSection } from './components/VokasiSection';
import { GallerySection } from './components/GallerySection';
import { NewsSection } from './components/NewsSection';
import { PrestasiSection } from './components/PrestasiSection';
import { FaqSection } from './components/FaqSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { RegistrationModal } from './components/RegistrationModal';
import { FloatingWidget } from './components/FloatingWidget';
import { AdminLoginModal } from './components/admin/AdminLoginModal';
import { AdminDashboardModal } from './components/admin/AdminDashboardModal';
import { ShareModal, ShareData } from './components/ShareModal';

const VALID_TABS = [
  'beranda',
  'berita',
  'prestasi',
  'tentang-kami',
  'personalia',
  'program-belajar',
  'vokasi',
  'galeri',
  'faq',
  'kontak'
];

function MainAppContent() {
  const { isAdminAuthenticated } = usePKBM();
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);
  const [selectedProgramForReg, setSelectedProgramForReg] = useState<string | undefined>(undefined);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState(false);
  const [shareModalState, setShareModalState] = useState<{ isOpen: boolean; data: ShareData }>({
    isOpen: false,
    data: {
      title: 'PKBM Bina Insani Sumowono',
      description: 'Lembaga Pendidikan Nonformal Resmi Terakreditasi di Kecamatan Sumowono.',
      url: window.location.href,
      category: 'Beranda'
    }
  });

  const getPageShareInfo = (tabId: string): ShareData => {
    const origin = window.location.origin + window.location.pathname;
    switch (tabId) {
      case 'berita':
        return {
          title: 'Berita & Pengumuman Resmi - PKBM Bina Insani Sumowono',
          description: 'Kabar terkini, liputan agenda kegiatan akademik, pengumuman ujian kesetaraan, dan informasi resmi lembaga.',
          url: `${origin}#berita`,
          category: 'Berita Resmi'
        };
      case 'prestasi':
        return {
          title: 'Prestasi Warga Belajar - PKBM Bina Insani Sumowono',
          description: 'Pencapaian kejuaraan, medali, dan penghargaan membanggakan dari warga belajar PKBM Bina Insani.',
          url: `${origin}#prestasi`,
          category: 'Prestasi'
        };
      case 'tentang-kami':
        return {
          title: 'Profil, Visi, Misi & Karakter - PKBM Bina Insani Sumowono',
          description: 'Visi kelembagaan, 6 misi strategis, 4 tujuan pokok, dan pilar karakter HEBAT • MANDIRI • KREATIF.',
          url: `${origin}#tentang-kami`,
          category: 'Profil Lembaga'
        };
      case 'personalia':
        return {
          title: 'Profil Personalia & Dewan Guru - PKBM Bina Insani Sumowono',
          description: 'Struktur dewan pengurus yayasan, tutor pendidik bersertifikasi, dan tenaga kependidikan resmi.',
          url: `${origin}#personalia`,
          category: 'Personalia'
        };
      case 'program-belajar':
        return {
          title: 'Program Pendidikan Kesetaraan Paket A, B, C - PKBM Bina Insani',
          description: 'Layanan pendidikan kesetaraan ijazah resmi negara dengan jadwal belajar fleksibel dan SPP gratis.',
          url: `${origin}#program-belajar`,
          category: 'Program Belajar'
        };
      case 'vokasi':
        return {
          title: 'Pelatihan Keterampilan Vokasi - PKBM Bina Insani Sumowono',
          description: 'Kursus keterampilan terapan siap kerja: Komputer TI, Tata Busana, Tata Boga, dan Kerajinan Tangan.',
          url: `${origin}#vokasi`,
          category: 'Vokasi'
        };
      case 'galeri':
        return {
          title: 'Galeri Dokumentasi Foto & Video - PKBM Bina Insani Sumowono',
          description: 'Dokumentasi visual dan video kegiatan pembelajaran, ujian, dan workshop vokasi PKBM Bina Insani.',
          url: `${origin}#galeri`,
          category: 'Galeri'
        };
      case 'faq':
        return {
          title: 'Pusat Bantuan & Tanya Jawab (FAQ) - PKBM Bina Insani Sumowono',
          description: 'Tanya jawab lengkap seputar pendaftaran warga belajar baru, legalitas ijazah kesetaraan, dan beasiswa.',
          url: `${origin}#faq`,
          category: 'Pusat Bantuan'
        };
      case 'kontak':
        return {
          title: 'Kontak & Titik Lokasi - PKBM Bina Insani Sumowono',
          description: 'Sekretariat resmi di Dusun Kawedusan RT 01/02, Desa Ngadikerso, Sumowono. Peta lokasi & konsultasi WA.',
          url: `${origin}#kontak`,
          category: 'Kontak Lembaga'
        };
      default:
        return {
          title: 'PKBM Bina Insani Sumowono - Pusat Kegiatan Belajar Masyarakat',
          description: 'Lembaga Pendidikan Nonformal Resmi Terakreditasi di Kecamatan Sumowono (NPSN: P9908447). Semangat HEBAT • MANDIRI • KREATIF.',
          url: origin,
          category: 'Beranda'
        };
    }
  };

  const handleOpenSharePage = (tabId?: string) => {
    const info = getPageShareInfo(tabId || activeTab);
    setShareModalState({
      isOpen: true,
      data: info
    });
  };

  const handleOpenShareCustom = (custom: {
    title: string;
    description: string;
    hash: string;
    category?: string;
    image?: string;
  }) => {
    const origin = window.location.origin + window.location.pathname;
    setShareModalState({
      isOpen: true,
      data: {
        title: custom.title,
        description: custom.description,
        url: `${origin}${custom.hash}`,
        category: custom.category,
        image: custom.image
      }
    });
  };

  // Initialize active tab from URL hash (e.g. #berita, #prestasi, or #personalia?id=...) or default to 'beranda'
  const [activeTab, setActiveTab] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const initialHash = window.location.hash.replace('#', '').trim();
      const baseTab = initialHash.split('?')[0].split('/')[0];
      if (VALID_TABS.includes(baseTab)) {
        return baseTab;
      }
    }
    return 'beranda';
  });

  // Sync hash changes (e.g. browser back/forward buttons, direct deep links)
  useEffect(() => {
    const handleHashChange = () => {
      const rawHash = window.location.hash.replace('#', '').trim();
      const baseTab = rawHash.split('?')[0].split('/')[0];
      if (baseTab && VALID_TABS.includes(baseTab)) {
        setActiveTab(baseTab);
        if (!rawHash.includes('?')) {
          window.scrollTo({ top: 0, behavior: 'instant' });
        }
      } else if (!rawHash) {
        setActiveTab('beranda');
        window.scrollTo({ top: 0, behavior: 'instant' });
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Handler to navigate between dedicated tab pages directly without continuous page scrolling
  const handleSelectTab = (tabId: string) => {
    if (VALID_TABS.includes(tabId)) {
      setActiveTab(tabId);
      if (tabId === 'beranda') {
        // Clear hash cleanly or set #beranda
        history.pushState(null, '', window.location.pathname);
      } else {
        window.location.hash = tabId;
      }
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  };

  const handleOpenRegistration = (programName?: string) => {
    setSelectedProgramForReg(programName);
    setIsRegistrationOpen(true);
  };

  const handleOpenAdmin = () => {
    if (isAdminAuthenticated) {
      setIsAdminDashboardOpen(true);
    } else {
      setIsAdminLoginOpen(true);
    }
  };

  const handleLoginSuccess = () => {
    setIsAdminLoginOpen(false);
    setIsAdminDashboardOpen(true);
  };

  return (
    <div className="min-h-screen pb-20 md:pb-0 bg-slate-50 text-slate-900 font-sans antialiased selection:bg-orange-100 selection:text-orange-900 flex flex-col justify-between">
      {/* Header Bar with dynamic logo, tab navigation, and Admin Portal trigger */}
      <Header
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        onOpenRegistration={handleOpenRegistration}
        onOpenAdmin={handleOpenAdmin}
      />

      {/* Main Multi-Page Container with Instant Dedicated Page Switching */}
      <main className="flex-1">
        <AnimatePresence mode="wait">
          {activeTab === 'beranda' && (
            <motion.div
              key="page-beranda"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
            >
              {/* Hero Banner Carousel */}
              <Hero
                onOpenRegistration={handleOpenRegistration}
                onNavigateTab={handleSelectTab}
              />

              {/* Quick Portal Access Bar */}
              <QuickPortalBar
                onOpenRegistration={handleOpenRegistration}
                onNavigateTab={handleSelectTab}
              />

              {/* Curated Home Section Previews with Direct Page Launchers */}
              <HomeHighlights
                onNavigateTab={handleSelectTab}
                onOpenRegistration={handleOpenRegistration}
              />
            </motion.div>
          )}

          {activeTab === 'berita' && (
            <motion.div
              key="page-berita"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
            >
              <PageHeaderBanner
                title="Berita & Pengumuman Resmi"
                subtitle="Kabar terkini, liputan agenda kegiatan akademik, pengumuman ujian kesetaraan, dan informasi resmi PKBM Bina Insani Sumowono."
                badge="Berita & Informasi"
                icon={Newspaper}
                onBackToHome={() => handleSelectTab('beranda')}
                onShare={() => handleOpenSharePage('berita')}
              />
              <NewsSection
                onOpenAdmin={handleOpenAdmin}
                onShareCustom={handleOpenShareCustom}
              />
            </motion.div>
          )}

          {activeTab === 'prestasi' && (
            <motion.div
              key="page-prestasi"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
            >
              <PageHeaderBanner
                title="Prestasi Warga Belajar"
                subtitle="Dokumentasi pencapaian, kejuaraan lomba, medali, dan penghargaan membanggakan yang diraih oleh warga belajar PKBM Bina Insani."
                badge="Prestasi Siswa"
                icon={Trophy}
                onBackToHome={() => handleSelectTab('beranda')}
                onShare={() => handleOpenSharePage('prestasi')}
              />
              <PrestasiSection
                onOpenAdmin={handleOpenAdmin}
                onShareCustom={handleOpenShareCustom}
              />
            </motion.div>
          )}

          {activeTab === 'tentang-kami' && (
            <motion.div
              key="page-tentang-kami"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
            >
              <PageHeaderBanner
                title="Profil, Visi, Misi & Landasan Karakter"
                subtitle="Mengenal lebih dekat visi kelembagaan, 6 misi strategis, 4 tujuan pokok, serta pilar karakter HEBAT • MANDIRI • KREATIF di PKBM Bina Insani Sumowono."
                badge="Profil Lembaga"
                icon={Award}
                onBackToHome={() => handleSelectTab('beranda')}
                onShare={() => handleOpenSharePage('tentang-kami')}
              />
              <AboutUs
                onOpenAdmin={handleOpenAdmin}
                onShareCustom={handleOpenShareCustom}
              />
            </motion.div>
          )}

          {activeTab === 'personalia' && (
            <motion.div
              key="page-personalia"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
            >
              <PageHeaderBanner
                title="Profil Personalia & Dewan Guru"
                subtitle="Struktur dewan pengurus yayasan, jajaran tutor pendidik bersertifikasi, serta tenaga kependidikan yang mendampingi proses belajar warga binaan."
                badge="Personalia & Guru"
                icon={Users}
                onBackToHome={() => handleSelectTab('beranda')}
                onShare={() => handleOpenSharePage('personalia')}
              />
              <PersonaliaSection
                onOpenAdmin={handleOpenAdmin}
                onShareCustom={handleOpenShareCustom}
              />
            </motion.div>
          )}

          {activeTab === 'program-belajar' && (
            <motion.div
              key="page-program-belajar"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
            >
              <PageHeaderBanner
                title="Program Pendidikan Kesetaraan"
                subtitle="Layanan pendidikan kesetaraan ijazah resmi negara: Paket A (Setara SD), Paket B (Setara SMP), dan Paket C (Setara SMA) dengan jadwal belajar fleksibel."
                badge="Program Belajar"
                icon={GraduationCap}
                onBackToHome={() => handleSelectTab('beranda')}
                onShare={() => handleOpenSharePage('program-belajar')}
                actionButton={{
                  label: 'Daftar Sekarang (PWBB)',
                  onClick: () => handleOpenRegistration()
                }}
              />
              <Programs
                onOpenRegistration={handleOpenRegistration}
                onShareCustom={handleOpenShareCustom}
              />
            </motion.div>
          )}

          {activeTab === 'vokasi' && (
            <motion.div
              key="page-vokasi"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
            >
              <PageHeaderBanner
                title="Pelatihan Keterampilan Vokasi"
                subtitle="Kursus keterampilan terapan gratis siap kerja: Komputer & TI, Tata Busana / Menjahit, Tata Boga Olahan Pangan Lokal, serta Kerajinan Tangan Kreatif."
                badge="Keterampilan & Vokasi"
                icon={Wrench}
                onBackToHome={() => handleSelectTab('beranda')}
                onShare={() => handleOpenSharePage('vokasi')}
                actionButton={{
                  label: 'Daftar Kursus Vokasi',
                  onClick: () => handleOpenRegistration('Vokasi')
                }}
              />
              <VokasiSection onShareCustom={handleOpenShareCustom} />
            </motion.div>
          )}

          {activeTab === 'galeri' && (
            <motion.div
              key="page-galeri"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
            >
              <PageHeaderBanner
                title="Galeri Dokumentasi Foto & Video"
                subtitle="Koleksi potret dokumentasi visual dan video kegiatan pembelajaran, ujian kesetaraan, workshop vokasi, dan berbagai momen inspiratif."
                badge="Galeri Dokumentasi"
                icon={ImageIcon}
                onBackToHome={() => handleSelectTab('beranda')}
                onShare={() => handleOpenSharePage('galeri')}
              />
              <GallerySection
                onOpenAdmin={handleOpenAdmin}
                onShareCustom={handleOpenShareCustom}
              />
            </motion.div>
          )}

          {activeTab === 'faq' && (
            <motion.div
              key="page-faq"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
            >
              <PageHeaderBanner
                title="Pusat Bantuan & Tanya Jawab (FAQ)"
                subtitle="Informasi lengkap mengenai persyaratan usia, legalitas ijazah kesetaraan, biaya pendidikan SPP gratis, dan prosedur pendaftaran warga belajar."
                badge="Tanya Jawab (FAQ)"
                icon={HelpCircle}
                onBackToHome={() => handleSelectTab('beranda')}
                onShare={() => handleOpenSharePage('faq')}
              />
              <FaqSection onShareCustom={handleOpenShareCustom} />
            </motion.div>
          )}

          {activeTab === 'kontak' && (
            <motion.div
              key="page-kontak"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
            >
              <PageHeaderBanner
                title="Kontak & Lokasi Lembaga"
                subtitle="Alamat kantor sekretariat PKBM Bina Insani Sumowono, peta navigasi Google Maps, jam operasional layanan, dan konsultasi WhatsApp resmi."
                badge="Kontak & Lokasi"
                icon={MapPin}
                onBackToHome={() => handleSelectTab('beranda')}
                onShare={() => handleOpenSharePage('kontak')}
              />
              <ContactSection
                onShareLocation={() =>
                  handleOpenShareCustom({
                    title: 'Titik Geolocation & Peta Navigasi PKBM Bina Insani Sumowono',
                    description:
                      'Dusun Kawedusan RT 01/RW 02, Desa Ngadikerso, Kec. Sumowono, Kab. Semarang, Jawa Tengah 50662. Buka di Google Maps.',
                    hash: '#kontak',
                    category: 'Geolocation & Peta'
                  })
                }
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Site Footer */}
      <Footer
        onOpenAdmin={handleOpenAdmin}
        onSelectTab={handleSelectTab}
      />

      {/* Floating Accessibility & WhatsApp Widget */}
      <FloatingWidget
        onOpenAdmin={handleOpenAdmin}
        onOpenShare={() => handleOpenSharePage()}
      />

      {/* Registration Modal Popup */}
      <RegistrationModal
        isOpen={isRegistrationOpen}
        onClose={() => setIsRegistrationOpen(false)}
        defaultProgram={selectedProgramForReg}
      />

      {/* Admin Authentication Login Modal */}
      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onSuccess={handleLoginSuccess}
      />

      {/* Admin Content Management Dashboard Modal */}
      <AdminDashboardModal
        isOpen={isAdminDashboardOpen}
        onClose={() => setIsAdminDashboardOpen(false)}
      />

      {/* Global Share Modal */}
      <ShareModal
        isOpen={shareModalState.isOpen}
        onClose={() =>
          setShareModalState((prev) => ({
            ...prev,
            isOpen: false
          }))
        }
        data={shareModalState.data}
      />
    </div>
  );
}

export default function App() {
  return (
    <PKBMProvider>
      <MainAppContent />
    </PKBMProvider>
  );
}
