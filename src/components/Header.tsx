import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Menu,
  X,
  Phone,
  UserPlus,
  BookOpen,
  ChevronRight,
  Award,
  Trophy,
  Users,
  Search,
  Globe,
  ShieldCheck,
  ExternalLink,
  MessageCircle,
  Sparkles,
  Lock,
  GraduationCap,
  Wrench,
  Image as ImageIcon,
  Newspaper,
  HelpCircle,
  MapPin,
  Clock,
  Layers,
  ArrowRight,
  Camera,
  Edit3
} from 'lucide-react';
import { usePKBM } from '../context/PKBMContext';
import { LogoManagerModal } from './admin/LogoManagerModal';

interface HeaderProps {
  onOpenRegistration: (programName?: string) => void;
  onOpenAdmin?: () => void;
  activeTab?: string;
  onSelectTab?: (tabId: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenRegistration,
  onOpenAdmin,
  activeTab = 'beranda',
  onSelectTab
}) => {
  const { pkbmInfo, isAdminAuthenticated } = usePKBM();
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuDrawerOpen, setMenuDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLogoModalOpen, setIsLogoModalOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent, tabId: string) => {
    e.preventDefault();
    if (onSelectTab) {
      onSelectTab(tabId);
    } else {
      const el = document.getElementById(tabId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const navLinks = [
    { name: 'Beranda Utama', shortName: 'Beranda', href: '#beranda', id: 'beranda', icon: BookOpen, desc: 'Informasi & Pendaftaran PWBB' },
    { name: 'Berita & Pengumuman', shortName: 'Berita', href: '#berita', id: 'berita', icon: Newspaper, desc: 'Kabar Terbaru & Agenda' },
    { name: 'Prestasi Warga Belajar', shortName: 'Prestasi', href: '#prestasi', id: 'prestasi', icon: Trophy, desc: 'Pencapaian & Juara Siswa' },
    { name: 'Profil & Visi Misi', shortName: 'Profil', href: '#tentang-kami', id: 'tentang-kami', icon: Award, desc: 'Landasan & Karakter Lembaga' },
    { name: 'Profil Personalia & Guru', shortName: 'Personalia', href: '#personalia', id: 'personalia', icon: Users, desc: 'Pendiri, Pengurus, Tutor & Tendik' },
    { name: 'Program Kesetaraan', shortName: 'Program', href: '#program-belajar', id: 'program-belajar', icon: GraduationCap, desc: 'Paket A, Paket B, & Paket C' },
    { name: 'Pelatihan Vokasi', shortName: 'Vokasi', href: '#vokasi', id: 'vokasi', icon: Wrench, desc: 'Kursus Keterampilan Siap Kerja' },
    { name: 'Galeri Kegiatan', shortName: 'Galeri', href: '#galeri', id: 'galeri', icon: ImageIcon, desc: 'Dokumentasi & Aktivitas Siswa' },
    { name: 'Tanya Jawab (FAQ)', shortName: 'FAQ', href: '#faq', id: 'faq', icon: HelpCircle, desc: 'Informasi & Syarat Belajar' },
    { name: 'Kontak & Lokasi', shortName: 'Kontak', href: '#kontak', id: 'kontak', icon: MapPin, desc: 'Alamat & WhatsApp Hotline' },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
        
        {/* Top Info Bar - Modern Dark Tone */}
        <div className="bg-[#060E1A] text-slate-300 text-xs border-b border-white/10 shadow-xs">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-9">
            
            {/* Left Notice with Golden Pulse */}
            <div className="flex items-center space-x-3 overflow-hidden min-w-0 flex-1 mr-2">
              <span className="flex items-center gap-2 font-medium text-white truncate text-[11px] sm:text-xs">
                <span className="w-2 h-2 rounded-full bg-[#F59E0B] animate-ping shrink-0" />
                <span className="truncate font-semibold text-white">
                  {pkbmInfo.announcementText || 'Penerimaan Warga Belajar Baru T.A. 2026/2027 Telah Dibuka'}
                </span>
              </span>
              <span className="hidden md:inline text-white/30">|</span>
              <span className="hidden md:flex items-center gap-1.5 text-amber-400 font-black shrink-0 text-xs">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>NPSN: {pkbmInfo.npsn} • {pkbmInfo.accreditation}</span>
              </span>
            </div>

            {/* Right Quick Links */}
            <div className="flex items-center space-x-2 sm:space-x-4 text-[11px] sm:text-xs shrink-0">
              <a
                href={`https://wa.me/${pkbmInfo.whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-amber-300 transition-colors flex items-center gap-1.5 text-slate-200 hover:text-white font-bold"
              >
                <MessageCircle className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Hotline:</span> {pkbmInfo.phonePrimary}
              </a>
            </div>
          </div>
        </div>

        {/* Main Header Bar - Modern Executive Deep Slate Navy */}
        <div
          className={`transition-all duration-300 border-b border-white/10 ${
            isScrolled
              ? 'bg-[#0F1E36]/95 backdrop-blur-md shadow-lg py-2.5'
              : 'bg-[#0B1728] py-3 shadow-md'
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between gap-2 sm:gap-4">
              
              {/* Left Brand Identity: Emblem Logo Badge */}
              <div className="flex items-center gap-2 sm:gap-4 group min-w-0 flex-1 md:flex-initial">
                <div className="relative group/logo min-w-0">
                  <a
                    href="#beranda"
                    onClick={(e) => handleNavClick(e, 'beranda')}
                    className="bg-white/10 hover:bg-white/15 p-1.5 sm:p-2 md:p-2 rounded-xl sm:rounded-2xl border border-white/15 flex items-center gap-2 sm:gap-3 group-hover:scale-102 transition-all group-hover:border-amber-400/40 block min-w-0 cursor-pointer backdrop-blur-sm shadow-inner"
                  >
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                      <div
                        className={`w-9 h-9 sm:w-11 sm:h-11 md:w-12 md:h-12 ${
                          pkbmInfo.logoShape === 'circle'
                            ? 'rounded-full'
                            : pkbmInfo.logoShape === 'square'
                            ? 'rounded-lg'
                            : 'rounded-xl'
                        } bg-white flex items-center justify-center text-[#EA580C] font-bold shadow-md shrink-0 border-2 border-white/90 overflow-hidden relative p-1`}
                      >
                        {pkbmInfo.logoUrl ? (
                          <img
                            src={pkbmInfo.logoUrl}
                            alt={pkbmInfo.name}
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-[#EA580C]" />
                        )}
                      </div>
                      <div className="flex flex-col text-left pr-1 sm:pr-2 min-w-0">
                        <span className="text-sm xs:text-base sm:text-lg md:text-xl font-black tracking-tight text-white leading-tight uppercase font-sans truncate">
                          PKBM BINA INSANI
                        </span>
                        <div className="flex items-center gap-1.5 sm:gap-2 mt-0.5 min-w-0">
                          <span className="text-[10px] xs:text-xs sm:text-xs font-black tracking-wider text-[#FB923C] uppercase shrink-0">
                            SUMOWONO
                          </span>
                          <span className="text-[8.5px] xs:text-[9.5px] sm:text-[10.5px] font-extrabold bg-white/15 text-amber-300 px-1.5 sm:px-2 py-0.5 rounded-md border border-white/20 whitespace-nowrap shrink-0">
                            NPSN P9979993
                          </span>
                        </div>
                      </div>
                    </div>
                  </a>

                  {/* Quick Logo Edit Hover Button */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setIsLogoModalOpen(true);
                    }}
                    title="Ganti Logo Lembaga"
                    className="absolute -top-1.5 -left-1.5 sm:-top-2 sm:-left-2 p-1 sm:p-1.5 rounded-full bg-[#F97316] hover:bg-[#EA580C] text-white shadow-md border-2 border-white transition-all opacity-0 group-hover/logo:opacity-100 scale-90 hover:scale-110 cursor-pointer z-20 flex items-center gap-1 text-[10px] font-black"
                  >
                    <Camera className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  </button>
                </div>

                {/* BRAND MOTTO BLOCK: SEMANGAT & LANDASAN KARAKTER LEMBAGA */}
                <div className="hidden md:flex flex-col border-l-2 border-white/15 pl-3.5 xl:pl-4 max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl">
                  <div className="flex items-center gap-1.5 text-[9px] sm:text-[10px] xl:text-[10.5px] font-bold tracking-widest text-slate-300 uppercase">
                    <Sparkles className="w-3 h-3 text-[#FB923C] shrink-0" />
                    <span className="truncate">SEMANGAT & LANDASAN KARAKTER LEMBAGA</span>
                  </div>

                  {/* Prominent Motto */}
                  <div className="flex items-center gap-1.5 my-0.5">
                    <div className="text-xs sm:text-sm lg:text-base font-black tracking-wide uppercase font-sans text-transparent bg-clip-text bg-gradient-to-r from-[#FB923C] via-[#FDBA74] to-[#F59E0B] whitespace-nowrap">
                      HEBAT <span className="text-[#FB923C] mx-0.5 sm:mx-1 font-black">•</span> MANDIRI <span className="text-[#FB923C] mx-0.5 sm:mx-1 font-black">•</span> KREATIF
                    </div>
                  </div>

                  {/* Subtext Quote in Header */}
                  <p className="text-[10px] xl:text-[11.5px] font-medium text-slate-400 leading-tight italic font-serif line-clamp-1">
                    "Pusat Kegiatan Belajar Masyarakat Kecamatan Sumowono"
                  </p>
                </div>
              </div>

              {/* Right Side Control Panel: Search & Daftar Online (Desktop) + HAMBURGER (Mobile) */}
              <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                
                {/* Quick Search Button (Desktop Only) */}
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="hidden md:flex p-2.5 sm:p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer border border-white/15 shadow-sm hover:scale-105"
                  title="Cari Informasi"
                >
                  <Search className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                </button>

                {/* Registration CTA (Desktop Only) */}
                <button
                  onClick={() => onOpenRegistration()}
                  className="hidden md:flex px-4 sm:px-5 py-2.5 sm:py-2.5 rounded-xl text-xs sm:text-sm font-black bg-gradient-to-r from-[#F97316] to-[#EA580C] hover:from-[#EA580C] hover:to-[#C2410C] text-white shadow-md shadow-orange-500/25 transition-all items-center gap-2 cursor-pointer transform hover:scale-102 active:scale-95 whitespace-nowrap border border-orange-400/40"
                >
                  <UserPlus className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-white" />
                  <span>Daftar Online</span>
                </button>

                {/* THE 3-LINE MENU HAMBURGER BUTTON (Mobile / < md) */}
                <button
                  onClick={() => setMenuDrawerOpen(true)}
                  className="md:hidden p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/15 shadow-sm transition-all flex items-center justify-center cursor-pointer hover:scale-105 active:scale-95 shrink-0"
                  aria-label="Buka Menu Navigasi Lengkap"
                  title="Buka Menu Navigasi"
                >
                  <Menu className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </button>

              </div>

            </div>
          </div>
        </div>

        {/* BARIS TAB MENU UTAMA (Sleek Compact, Oranye dengan Teks Huruf Kapital & Font Bersih Modern) */}
        <div className="bg-gradient-to-r from-[#EA580C] via-[#F97316] to-[#EA580C] border-b border-[#C2410C]/80 shadow-sm">
          <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
            <nav
              className="flex items-center justify-start md:justify-between py-1 gap-1 sm:gap-1.5 overflow-x-auto no-scrollbar scroll-smooth"
              aria-label="Navigasi Menu Utama PKBM Bina Insani"
            >
              {navLinks.map((link) => {
                const isActive = activeTab === link.id;
                const Icon = link.icon;
                return (
                  <a
                    key={link.id}
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.id)}
                    className={`px-2 sm:px-2.5 lg:px-3 py-1 rounded-lg text-[10.5px] sm:text-[11px] lg:text-[11.5px] font-sans uppercase tracking-wider leading-none transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer select-none shrink-0 ${
                      isActive
                        ? 'bg-white text-[#EA580C] shadow-xs font-black ring-1 ring-white/70 scale-[1.02]'
                        : 'text-white/95 font-extrabold hover:bg-white/20 hover:text-white active:bg-white/30 border border-transparent'
                    }`}
                    title={link.name}
                  >
                    <Icon className={`w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0 transition-transform ${isActive ? 'text-[#EA580C] scale-105' : 'text-white'}`} />
                    <span>{link.shortName}</span>
                    {isActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#EA580C] ml-0.5 animate-pulse shrink-0" />
                    )}
                  </a>
                );
              })}
            </nav>
          </div>
        </div>
      </header>

      {/* Quick Search Modal */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 bg-[#0F294A]/60 backdrop-blur-sm flex items-start justify-center pt-20 px-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full p-6 border border-[#E2E8F0] animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0]">
              <h3 className="font-black text-[#0F294A] text-lg flex items-center gap-2">
                <Search className="w-5 h-5 text-[#F97316]" />
                Cari di Website PKBM Bina Insani
              </h3>
              <button
                onClick={() => setIsSearchOpen(false)}
                className="p-2 rounded-xl hover:bg-[#F8FAFC] text-slate-500 hover:text-[#0F294A] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="mt-4 space-y-4">
              <input
                type="text"
                placeholder="Ketik kata kunci, misal: Paket C, Tata Busana, Syarat Pendaftaran..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-[#E2E8F0] focus:border-[#F97316] outline-none text-sm font-semibold text-[#1E293B] bg-[#FFF7ED]"
                autoFocus
              />
              <div className="space-y-2">
                <p className="text-xs font-bold text-[#486581] uppercase tracking-wider">Pencarian Populer:</p>
                <div className="flex flex-wrap gap-2">
                  {[
                    { label: 'Paket C Setara SMA', tabId: 'program-belajar' },
                    { label: 'Paket B Setara SMP', tabId: 'program-belajar' },
                    { label: 'Vokasi Komputer', tabId: 'vokasi' },
                    { label: 'Syarat Pendaftaran', tabId: 'faq' },
                    { label: 'Jadwal Belajar', tabId: 'program-belajar' },
                    { label: 'Alamat Lokasi', tabId: 'kontak' },
                  ].map((item) => (
                    <button
                      key={item.label}
                      onClick={(e) => {
                        setIsSearchOpen(false);
                        handleNavClick(e, item.tabId);
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-[#FFF7ED] hover:bg-[#FDBA74]/40 text-[#EA580C] text-xs font-bold transition-all border border-[#FDBA74]/50 cursor-pointer"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FULL-SCREEN RIGHT-SIDE MENU DRAWER (Mobile) */}
      <AnimatePresence>
        {menuDrawerOpen && (
          <>
            {/* Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuDrawerOpen(false)}
              className="fixed inset-0 z-50 bg-[#1E293B]/70 backdrop-blur-sm"
            />

            {/* Slide-over Panel from Right */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-full sm:w-[420px] md:w-[480px] z-50 bg-white text-[#1E293B] shadow-2xl border-l border-[#E2E8F0] flex flex-col justify-between overflow-hidden"
            >
              
              {/* Drawer Top Header */}
              <div className="p-5 sm:p-6 border-b border-[#E2E8F0] bg-[#FFF7ED] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#F97316] to-[#EA580C] text-white flex items-center justify-center font-black shadow-sm border border-[#FDBA74]/60">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-black text-sm text-[#0F294A] tracking-tight leading-tight">
                      MENU PKBM BINA INSANI
                    </h3>
                    <p className="text-[11px] text-slate-500 font-semibold">
                      NPSN: {pkbmInfo.npsn} • {pkbmInfo.accreditation}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setMenuDrawerOpen(false)}
                  className="p-2 rounded-xl bg-white hover:bg-[#F8FAFC] text-slate-500 hover:text-[#0F294A] border border-[#E2E8F0] transition-all cursor-pointer"
                  aria-label="Tutup Menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Middle: Navigation Link List */}
              <div className="flex-1 p-4 sm:p-6 space-y-3 overflow-y-auto no-scrollbar">
                
                {/* Search & Daftar Online on Mobile */}
                <div className="space-y-2 p-3 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0]">
                  <button
                    onClick={() => {
                      setMenuDrawerOpen(false);
                      setIsSearchOpen(true);
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white hover:bg-[#FFF7ED] text-left text-slate-500 border border-[#E2E8F0] flex items-center justify-between transition-all cursor-pointer shadow-xs group"
                  >
                    <div className="flex items-center gap-2.5">
                      <Search className="w-4 h-4 text-[#F97316] group-hover:scale-110 transition-transform" />
                      <span className="text-xs font-semibold text-[#0F172A]">Cari info, berita, program...</span>
                    </div>
                    <span className="text-[10px] font-bold bg-[#FFF7ED] text-[#EA580C] px-2 py-0.5 rounded-md border border-[#FDBA74]">
                      Cari
                    </span>
                  </button>

                  <button
                    onClick={() => {
                      setMenuDrawerOpen(false);
                      onOpenRegistration();
                    }}
                    className="w-full py-2.5 px-3.5 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white font-black text-xs sm:text-sm shadow-sm flex items-center justify-center gap-2 cursor-pointer border border-[#FDBA74]/50 transform active:scale-98 transition-all"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Daftar Online Warga Belajar (PWBB)</span>
                  </button>
                </div>

                {/* Motto Tag in Drawer */}
                <div className="bg-[#FFF7ED] p-3 rounded-2xl border border-[#FDBA74]/50 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#EA580C]">
                      Motto Pendidikan
                    </span>
                    <p className="text-xs font-black text-[#0F294A] flex items-center gap-1.5 mt-0.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#F97316]" />
                      HEBAT • MANDIRI • KREATIF
                    </p>
                  </div>
                  <span className="text-[10px] bg-[#F97316] text-white font-black px-2.5 py-1 rounded-lg">
                    Resmi
                  </span>
                </div>

                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Daftar Halaman & Konten
                </p>

                {/* Nav Items */}
                <div className="space-y-1.5">
                  {navLinks.map((link) => {
                    const Icon = link.icon;
                    const isActive = activeTab === link.id;
                    return (
                      <a
                        key={link.name}
                        href={link.href}
                        onClick={(e) => {
                          setMenuDrawerOpen(false);
                          handleNavClick(e, link.id);
                        }}
                        className={`p-3 rounded-2xl flex items-center justify-between transition-all group ${
                          isActive
                            ? 'bg-[#FFF7ED] border-2 border-[#F97316] shadow-xs text-[#EA580C]'
                            : 'hover:bg-[#F8FAFC] text-[#0F172A] border border-[#E2E8F0]'
                        }`}
                      >
                        <div className="flex items-center gap-3.5">
                          <div className={`p-2 rounded-xl ${
                            isActive ? 'bg-[#F97316] text-white' : 'bg-[#FFF7ED] text-[#EA580C] group-hover:bg-[#F97316] group-hover:text-white'
                          } transition-colors`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-sm font-bold leading-tight text-[#0F294A] group-hover:text-[#EA580C] transition-colors">
                              {link.name}
                            </p>
                            <p className="text-[11px] text-slate-500 font-medium">
                              {link.desc}
                            </p>
                          </div>
                        </div>

                        <ChevronRight className={`w-4 h-4 ${
                          isActive ? 'text-[#EA580C]' : 'text-slate-400 group-hover:text-[#EA580C] group-hover:translate-x-1'
                        } transition-all`} />
                      </a>
                    );
                  })}
                </div>
              </div>

              {/* Drawer Bottom Actions */}
              <div className="p-5 sm:p-6 border-t border-[#E2E8F0] bg-[#F8FAFC] space-y-2.5">
                <button
                  onClick={() => {
                    setMenuDrawerOpen(false);
                    onOpenRegistration();
                  }}
                  className="w-full py-3 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white font-black text-sm shadow-sm flex items-center justify-center gap-2 cursor-pointer transform hover:scale-[1.01] active:scale-98 transition-all border border-[#FDBA74]/50"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Daftar Warga Belajar Baru (PWBB 2026)</span>
                </button>

                <button
                  onClick={() => {
                    setMenuDrawerOpen(false);
                    setIsLogoModalOpen(true);
                  }}
                  className="w-full py-2 rounded-xl bg-white hover:bg-[#FFF7ED] text-[#0F294A] font-bold text-xs flex items-center justify-center gap-2 border border-[#E2E8F0] transition-all cursor-pointer"
                >
                  <Camera className="w-3.5 h-3.5 text-[#F97316]" />
                  <span>Pengaturan / Ganti Logo Lembaga</span>
                </button>

                <a
                  href={`https://wa.me/${pkbmInfo.whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2 rounded-xl bg-white hover:bg-[#FFF7ED] text-slate-600 hover:text-[#0F294A] font-bold text-xs flex items-center justify-center gap-2 border border-[#E2E8F0] transition-all"
                >
                  <Phone className="w-3.5 h-3.5 text-[#0284C7]" />
                  <span>Konsultasi WA: {pkbmInfo.phonePrimary}</span>
                </a>
              </div>

            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* MOBILE BOTTOM NAVIGATION & ACTION BAR (< md) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E2E8F0] px-3 pt-1.5 pb-safe shadow-lg">
        <div className="max-w-md mx-auto grid grid-cols-4 gap-1.5 items-center">
          
          {/* 1. Beranda */}
          <a
            href="#beranda"
            onClick={(e) => handleNavClick(e, 'beranda')}
            className={`min-h-[44px] flex flex-col items-center justify-center py-1 rounded-xl text-[10px] font-bold transition-all cursor-pointer ${
              activeTab === 'beranda'
                ? 'text-[#EA580C] bg-[#FFF7ED] border border-[#FDBA74]'
                : 'text-slate-500 hover:text-[#0F294A]'
            }`}
          >
            <BookOpen className="w-4 h-4 mb-0.5" />
            <span>Beranda</span>
          </a>

          {/* 2. Tombol Pencarian */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="min-h-[44px] flex flex-col items-center justify-center py-1 rounded-xl text-[10px] font-bold text-slate-500 hover:text-[#EA580C] transition-all cursor-pointer"
            title="Cari Berita & Program"
          >
            <Search className="w-4 h-4 mb-0.5 text-[#F97316]" />
            <span>Cari</span>
          </button>

          {/* 3. Tombol Daftar Online (CTA Utama) */}
          <button
            onClick={() => onOpenRegistration()}
            className="min-h-[44px] flex flex-col items-center justify-center py-1 px-2 rounded-xl text-[10px] font-black bg-[#F97316] text-white shadow-sm border border-[#FDBA74]/50 cursor-pointer transform active:scale-95 transition-all"
            title="Daftar Online Warga Belajar Baru (PWBB)"
          >
            <UserPlus className="w-4 h-4 mb-0.5 text-white" />
            <span className="whitespace-nowrap">Daftar</span>
          </button>

          {/* 4. Tombol Menu Garis Tiga */}
          <button
            onClick={() => setMenuDrawerOpen(true)}
            className={`min-h-[44px] flex flex-col items-center justify-center py-1 rounded-xl text-[10px] font-bold transition-all cursor-pointer ${
              menuDrawerOpen
                ? 'text-[#EA580C] bg-[#FFF7ED] border border-[#FDBA74]'
                : 'text-slate-500 hover:text-[#EA580C]'
            }`}
            title="Buka Menu Halaman"
          >
            <Menu className="w-4 h-4 mb-0.5 text-[#EA580C]" />
            <span>Menu</span>
          </button>

        </div>
      </div>

      {/* Logo Manager Modal */}
      <LogoManagerModal
        isOpen={isLogoModalOpen}
        onClose={() => setIsLogoModalOpen(false)}
      />
    </>
  );
};
