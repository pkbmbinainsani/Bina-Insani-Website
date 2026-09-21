import React, { useState } from 'react';
import { PKBMProvider, usePKBM } from './context/PKBMContext';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { QuickPortalBar } from './components/QuickPortalBar';
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

function MainAppContent() {
  const { isAdminAuthenticated } = usePKBM();
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);
  const [selectedProgramForReg, setSelectedProgramForReg] = useState<string | undefined>(undefined);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState(false);

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
    <div className="min-h-screen pb-20 md:pb-0 bg-slate-50 text-slate-900 font-sans antialiased selection:bg-orange-100 selection:text-orange-900">
      {/* Header Bar with dynamic logo, navigation, and Admin Portal trigger */}
      <Header
        onOpenRegistration={handleOpenRegistration}
        onOpenAdmin={handleOpenAdmin}
      />

      {/* Main Content Sections */}
      <main>
        {/* Hero Landing */}
        <Hero onOpenRegistration={handleOpenRegistration} />

        {/* Quick Portal Access Tiles */}
        <QuickPortalBar onOpenRegistration={handleOpenRegistration} />

        {/* Berita Terkini & Pengumuman (Kelola & Post Berita via Admin) */}
        <NewsSection onOpenAdmin={handleOpenAdmin} />

        {/* Prestasi Warga Belajar (Otomatis Tersinkronisasi dari Berita Berlabel Prestasi Warga Belajar) */}
        <PrestasiSection onOpenAdmin={handleOpenAdmin} />

        {/* Tentang Kami (Visi, Misi 6 Misi, Tujuan 4 Tujuan, Motto HEBAT - MANDIRI - KREATIF) */}
        <AboutUs />

        {/* Profil Personalia (Pendiri, Pengurus Yayasan, Tutor & Tendik) */}
        <PersonaliaSection onOpenAdmin={handleOpenAdmin} />

        {/* Program Belajar (Paket A, Paket B, Paket C) */}
        <Programs onOpenRegistration={handleOpenRegistration} />

        {/* Keterampilan Vokasi & Wirausaha */}
        <VokasiSection />

        {/* Galeri Kegiatan & Dokumentasi Foto (Kelola foto via Admin) */}
        <GallerySection onOpenAdmin={handleOpenAdmin} />

        {/* FAQ Section */}
        <FaqSection />

        {/* Formulir Kontak & Map Location */}
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer onOpenAdmin={handleOpenAdmin} />

      {/* Floating Accessibility & WhatsApp Widget */}
      <FloatingWidget onOpenAdmin={handleOpenAdmin} />

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
