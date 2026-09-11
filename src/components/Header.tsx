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
}

export const Header: React.FC<HeaderProps> = ({ onOpenRegistration, onOpenAdmin }) => {
  const { pkbmInfo, isAdminAuthenticated, heroSlides } = usePKBM();
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuDrawerOpen, setMenuDrawerOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('beranda');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLogoModalOpen, setIsLogoModalOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      const sections = ['beranda', 'berita', 'tentang-kami', 'personalia', 'program-belajar', 'vokasi', 'galeri', 'faq', 'kontak'];
      const scrollPosition = window.scrollY + 140;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Beranda Utama', href: '#beranda', id: 'beranda', icon: BookOpen, desc: 'Informasi & Pendaftaran PWBB' },
    { name: 'Berita & Pengumuman', href: '#berita', id: 'berita', icon: Newspaper, desc: 'Kabar Terbaru & Agenda' },
    { name: 'Profil & Visi Misi', href: '#tentang-kami', id: 'tentang-kami', icon: Award, desc: 'Landasan & Karakter Lembaga' },
    { name: 'Profil Personalia & Guru', href: '#personalia', id: 'personalia', icon: Users, desc: 'Pendiri, Pengurus, Tutor & Tendik' },
    { name: 'Program Kesetaraan', href: '#program-belajar', id: 'program-belajar', icon: GraduationCap, desc: 'Paket A, Paket B, & Paket C' },
    { name: 'Pelatihan Vokasi', href: '#vokasi', id: 'vokasi', icon: Wrench, desc: 'Kursus Keterampilan Siap Kerja' },
    { name: 'Galeri Kegiatan', href: '#galeri', id: 'galeri', icon: ImageIcon, desc: 'Dokumentasi & Aktivitas Siswa' },
    { name: 'Tanya Jawab (FAQ)', href: '#faq', id: 'faq', icon: HelpCircle, desc: 'Informasi & Syarat Belajar' },
    { name: 'Kontak & Lokasi', href: '#kontak', id: 'kontak', icon: MapPin, desc: 'Alamat & WhatsApp Hotline' },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
        
        {/* Top Info Bar - Luxurious Dark Obsidian & Warm Amber Gradient */}
        <div className="bg-gradient-to-r from-[#0c0a09] via-[#1c1917] to-[#0c0a09] text-white text-xs border-b border-orange-500/30 shadow-sm backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-9">
            
            {/* Left Notice with Golden-Orange Pulse */}
            <div className="flex items-center space-x-3 overflow-hidden">
              <span className="flex items-center gap-2 font-medium text-orange-100 truncate text-[11px] sm:text-xs">
                <span className="w-2 h-2 rounded-full bg-orange-400 animate-ping shrink-0" />
                <span className="truncate font-semibold text-amber-200">
                  {pkbmInfo.announcementText || 'Penerimaan Warga Belajar Baru T.A. 2026/2027 Telah Dibuka'}
                </span>
              </span>
              <span className="hidden md:inline text-orange-500/50">|</span>
              <span className="hidden md:flex items-center gap-1.5 text-amber-300 font-bold shrink-0 text-xs">
                <ShieldCheck className="w-3.5 h-3.5 text-orange-400" />
                <span>NPSN: {pkbmInfo.npsn} • {pkbmInfo.accreditation}</span>
              </span>
            </div>

            {/* Right Quick Links with Luxury Styling */}
            <div className="flex items-center space-x-2 sm:space-x-4 text-[11px] sm:text-xs shrink-0">
              <a
                href={`https://wa.me/${pkbmInfo.whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-amber-300 transition-colors flex items-center gap-1.5 text-orange-100 font-bold"
              >
                <MessageCircle className="w-3.5 h-3.5 text-orange-400" />
                <span className="hidden sm:inline">Hotline:</span> {pkbmInfo.phonePrimary}
              </a>
            </div>
          </div>
        </div>

        {/* Main Header Bar - Deep Royal Obsidian to Espresso Warm Orange Gradient */}
        <div
          className={`transition-all duration-300 border-b border-orange-500/30 ${
            isScrolled
              ? 'bg-gradient-to-r from-[#0c0a09]/95 via-[#1c1917]/95 to-[#0c0a09]/95 backdrop-blur-md shadow-2xl py-2.5'
              : 'bg-gradient-to-r from-[#140e0b] via-[#1f1510] to-[#140e0b] py-3 shadow-xl'
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between gap-4">
              
              {/* Left Brand Identity: Emblem Logo Badge with ENLARGED Title */}
              <div className="flex items-center gap-3 sm:gap-4 group shrink-0">
                <div className="relative group/logo">
                  <a
                    href="#beranda"
                    className="bg-gradient-to-br from-amber-50 via-white to-orange-50 p-2.5 sm:p-3 rounded-2xl shadow-xl border-2 border-orange-400/80 flex items-center gap-3 group-hover:scale-105 transition-all group-hover:shadow-orange-500/20 block"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-11 h-11 sm:w-13 sm:h-13 ${
                          pkbmInfo.logoShape === 'circle'
                            ? 'rounded-full'
                            : pkbmInfo.logoShape === 'square'
                            ? 'rounded-lg'
                            : 'rounded-xl'
                        } bg-gradient-to-br from-orange-600 via-amber-600 to-orange-700 flex items-center justify-center text-white font-bold shadow-md shrink-0 border border-orange-300/50 overflow-hidden relative`}
                      >
                        {pkbmInfo.logoUrl ? (
                          <img
                            src={pkbmInfo.logoUrl}
                            alt={pkbmInfo.name}
                            className="w-full h-full object-contain p-1"
                          />
                        ) : (
                          <BookOpen className="w-6 h-6 sm:w-7 sm:h-7 text-amber-200" />
                        )}
                      </div>
                      <div className="flex flex-col text-left pr-1 sm:pr-2">
                        <span className="text-lg sm:text-2xl lg:text-3xl font-black tracking-tight text-orange-950 leading-tight uppercase font-sans drop-shadow-sm">
                          PKBM BINA INSANI
                        </span>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs sm:text-sm font-black tracking-widest text-orange-700 uppercase">
                            SUMOWONO
                          </span>
                          <span className="text-[10px] sm:text-[11px] font-extrabold bg-gradient-to-r from-orange-900 to-stone-950 text-amber-300 px-2 py-0.5 rounded-md border border-orange-400/40 shadow-xs">
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
                    className="absolute -top-2 -left-2 p-1.5 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-white shadow-lg border-2 border-stone-900 transition-all opacity-0 group-hover/logo:opacity-100 scale-90 hover:scale-110 cursor-pointer z-20 flex items-center gap-1 text-[10px] font-black"
                  >
                    <Camera className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* BRAND MOTTO BLOCK: SEMANGAT & LANDASAN KARAKTER LEMBAGA + HEBAT • MANDIRI • KREATIF + SUBTEXT */}
                <div className="hidden md:flex flex-col border-l-2 border-orange-500/40 pl-3.5 xl:pl-4 max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl">
                  {/* Micro Title Tag */}
                  <div className="flex items-center gap-1.5 text-[9px] sm:text-[10px] xl:text-[11px] font-black tracking-widest text-amber-300 uppercase">
                    <Sparkles className="w-3 h-3 text-orange-400 animate-pulse shrink-0" />
                    <span className="truncate">SEMANGAT & LANDASAN KARAKTER LEMBAGA</span>
                  </div>

                  {/* Enlarged Prominent Animated Motto */}
                  <div className="flex items-center gap-1.5 my-0.5">
                    <motion.div
                      animate={{
                        filter: [
                          'drop-shadow(0 0 3px rgba(251,146,60,0.4))',
                          'drop-shadow(0 0 10px rgba(249,115,22,0.8))',
                          'drop-shadow(0 0 3px rgba(251,146,60,0.4))'
                        ]
                      }}
                      transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut' }}
                      className="text-xs sm:text-sm lg:text-base xl:text-lg 2xl:text-xl font-black tracking-wide uppercase font-sans text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-300 to-yellow-200 drop-shadow-sm whitespace-nowrap"
                    >
                      HEBAT <span className="text-orange-400 mx-0.5 sm:mx-1 font-black">•</span> MANDIRI <span className="text-orange-400 mx-0.5 sm:mx-1 font-black">•</span> KREATIF
                    </motion.div>
                  </div>

                  {/* Subtext Quote in Header */}
                  <p className="text-[10px] xl:text-[11.5px] font-medium text-orange-100/90 leading-tight italic font-serif line-clamp-1">
                    "Pusat Kegiatan Masyarakat Kecamatan Sumowono"
                  </p>
                </div>
              </div>

              {/* Right Side Control Panel: Search + Daftar Online + 3-LINE MENU DRAWER BUTTON */}
              <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                
                {/* Quick Search Button */}
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="p-2.5 sm:p-3 rounded-2xl bg-stone-900/90 hover:bg-stone-800 text-amber-300 hover:text-white transition-all cursor-pointer border border-orange-400/40 shadow-md hover:scale-105"
                  title="Cari Informasi"
                >
                  <Search className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>

                {/* Registration CTA - Luxury Gold-Orange Gradient Button */}
                <button
                  onClick={() => onOpenRegistration()}
                  className="px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl text-xs sm:text-sm font-black bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-400 hover:to-amber-500 text-white shadow-lg shadow-orange-950/50 transition-all flex items-center gap-2 cursor-pointer transform hover:scale-105 active:scale-95 whitespace-nowrap border border-orange-300"
                >
                  <UserPlus className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-white" />
                  <span>Daftar Online</span>
                </button>

                {/* THE 3-LINE MENU HAMBURGER BUTTON (FOR ALL SCREENS TO KEEP HEADER UNOBSTRUCTED) */}
                <button
                  onClick={() => setMenuDrawerOpen(true)}
                  className="p-2.5 sm:px-4 sm:py-3 rounded-2xl bg-gradient-to-r from-stone-900 to-[#1f1510] hover:from-stone-800 hover:to-[#2b1c14] text-white border-2 border-orange-400/60 shadow-lg hover:shadow-orange-400/20 transition-all flex items-center gap-2.5 cursor-pointer hover:scale-105 active:scale-95"
                  aria-label="Buka Menu Navigasi Lengkap"
                  title="Buka Menu Halaman & Navigasi"
                >
                  <Menu className="w-5 h-5 sm:w-6 sm:h-6 text-amber-300" />
                  <span className="hidden md:inline font-black text-xs sm:text-sm text-amber-300 tracking-wider uppercase">
                    Menu
                  </span>
                </button>

              </div>

            </div>
          </div>
        </div>
      </header>

      {/* Quick Search Modal */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-start justify-center pt-20 px-4">
          <div className="bg-gradient-to-b from-white to-slate-50 rounded-3xl shadow-2xl max-w-xl w-full p-6 border-2 border-orange-400/40 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <h3 className="font-black text-slate-900 text-lg flex items-center gap-2">
                <Search className="w-5 h-5 text-orange-600" />
                Cari di Website PKBM Bina Insani
              </h3>
              <button
                onClick={() => setIsSearchOpen(false)}
                className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 hover:text-slate-900 cursor-pointer"
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
                className="w-full px-4 py-3.5 rounded-2xl border-2 border-orange-200 focus:border-orange-500 outline-none text-sm font-semibold text-slate-900 bg-orange-50/40"
                autoFocus
              />
              <div className="space-y-2">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pencarian Populer:</p>
                <div className="flex flex-wrap gap-2">
                  {['Paket C Setara SMA', 'Vokasi Komputer', 'Syarat Pendaftaran', 'Jadwal Belajar', 'Alamat Lokasi'].map((item) => (
                    <a
                      key={item}
                      href="#program-belajar"
                      onClick={() => setIsSearchOpen(false)}
                      className="px-3.5 py-2 rounded-xl bg-orange-100/80 hover:bg-orange-200 text-orange-800 text-xs font-bold transition-all border border-orange-300"
                    >
                      {item}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FULL-SCREEN LUXURIOUS RIGHT-SIDE MENU DRAWER (GARIS TIGA DI KANAN LAYAR) */}
      <AnimatePresence>
        {menuDrawerOpen && (
          <>
            {/* Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuDrawerOpen(false)}
              className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md"
            />

            {/* Slide-over Panel from Right */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-full sm:w-[420px] md:w-[480px] z-50 bg-gradient-to-b from-[#0c0a09] via-[#1c1917] to-[#0c0a09] text-white shadow-2xl border-l-2 border-orange-400/50 flex flex-col justify-between overflow-hidden"
            >
              
              {/* Drawer Top Header */}
              <div className="p-5 sm:p-6 border-b border-orange-500/30 bg-black/20 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 text-white flex items-center justify-center font-black shadow-md border border-orange-300">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-black text-sm text-amber-300 tracking-tight leading-tight">
                      MENU PKBM BINA INSANI
                    </h3>
                    <p className="text-[11px] text-orange-200 font-semibold">
                      NPSN: {pkbmInfo.npsn} • {pkbmInfo.accreditation}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setMenuDrawerOpen(false)}
                  className="p-2.5 rounded-xl bg-stone-900/90 hover:bg-stone-800 text-amber-300 border border-orange-400/40 transition-all cursor-pointer hover:scale-105"
                  aria-label="Tutup Menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Middle: Navigation Link List */}
              <div className="flex-1 p-5 sm:p-6 space-y-2 overflow-y-auto custom-scrollbar">
                
                {/* Quick Motto Tag in Drawer */}
                <div className="bg-gradient-to-r from-stone-950 via-stone-900 to-stone-950 p-3.5 rounded-2xl border border-orange-400/60 shadow-inner mb-4 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-orange-400">
                      Motto Pendidikan
                    </span>
                    <p className="text-xs font-black text-white flex items-center gap-1.5 mt-0.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      HEBAT • MANDIRI • KREATIF
                    </p>
                  </div>
                  <span className="text-[10px] bg-gradient-to-r from-orange-500 to-amber-500 text-white font-black px-2.5 py-1 rounded-lg">
                    Resmi
                  </span>
                </div>

                <p className="text-[11px] font-bold text-orange-400/80 uppercase tracking-wider mb-2">
                  Daftar Halaman & Konten
                </p>

                {/* Nav Items */}
                <div className="space-y-1.5">
                  {navLinks.map((link) => {
                    const Icon = link.icon;
                    const isActive = activeSection === link.id;
                    return (
                      <a
                        key={link.name}
                        href={link.href}
                        onClick={() => setMenuDrawerOpen(false)}
                        className={`p-3 rounded-2xl flex items-center justify-between transition-all group ${
                          isActive
                            ? 'bg-gradient-to-r from-orange-600 to-amber-600 border-2 border-amber-300 shadow-md text-white'
                            : 'hover:bg-stone-900/60 text-stone-200 hover:text-white border border-stone-800/60'
                        }`}
                      >
                        <div className="flex items-center gap-3.5">
                          <div className={`p-2.5 rounded-xl ${
                            isActive ? 'bg-white text-orange-900' : 'bg-stone-950 text-amber-300 group-hover:bg-orange-500 group-hover:text-white'
                          } transition-colors`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-sm font-bold leading-tight group-hover:text-amber-300 transition-colors">
                              {link.name}
                            </p>
                            <p className="text-[11px] text-orange-200/90 font-medium">
                              {link.desc}
                            </p>
                          </div>
                        </div>

                        <ChevronRight className={`w-4 h-4 ${
                          isActive ? 'text-amber-300' : 'text-stone-500 group-hover:text-amber-300 group-hover:translate-x-1'
                        } transition-all`} />
                      </a>
                    );
                  })}
                </div>
              </div>

              {/* Drawer Bottom Actions */}
              <div className="p-5 sm:p-6 border-t border-orange-500/30 bg-black/30 space-y-3">
                
                {/* Pendaftaran Button */}
                <button
                  onClick={() => {
                    setMenuDrawerOpen(false);
                    onOpenRegistration();
                  }}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-400 hover:to-amber-400 text-white font-black text-sm shadow-xl flex items-center justify-center gap-2 cursor-pointer transform hover:scale-[1.02] active:scale-98 transition-all border border-orange-300"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Daftar Warga Belajar Baru (PWBB 2026)</span>
                </button>

                {/* Ganti Logo Lembaga Action */}
                <button
                  onClick={() => {
                    setMenuDrawerOpen(false);
                    setIsLogoModalOpen(true);
                  }}
                  className="w-full py-2.5 rounded-xl bg-stone-900/90 hover:bg-stone-800 text-amber-300 font-bold text-xs flex items-center justify-center gap-2 border border-orange-400/40 transition-all cursor-pointer"
                >
                  <Camera className="w-3.5 h-3.5 text-orange-400" />
                  <span>Pengaturan / Ganti Logo Lembaga</span>
                </button>

                {/* WhatsApp Hotline */}
                <a
                  href={`https://wa.me/${pkbmInfo.whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 rounded-xl bg-stone-900/90 hover:bg-stone-800 text-orange-100 font-bold text-xs flex items-center justify-center gap-2 border border-stone-700/80 transition-all"
                >
                  <Phone className="w-3.5 h-3.5 text-amber-300" />
                  <span>Konsultasi WA: {pkbmInfo.phonePrimary}</span>
                </a>
              </div>

            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Logo Manager Modal */}
      <LogoManagerModal
        isOpen={isLogoModalOpen}
        onClose={() => setIsLogoModalOpen(false)}
      />
    </>
  );
};

