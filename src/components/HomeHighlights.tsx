import React from 'react';
import { motion } from 'motion/react';
import {
  Newspaper,
  Trophy,
  GraduationCap,
  Wrench,
  ImageIcon,
  Users,
  HelpCircle,
  MapPin,
  ArrowRight,
  Sparkles,
  Calendar,
  CheckCircle2,
  Award,
  ChevronRight,
  Building2
} from 'lucide-react';
import { usePKBM } from '../context/PKBMContext';
import { sortNewsByDateDesc } from '../utils/dateHelper';

interface HomeHighlightsProps {
  onNavigateTab: (tabId: string) => void;
  onOpenRegistration: (programName?: string) => void;
}

export const HomeHighlights: React.FC<HomeHighlightsProps> = ({
  onNavigateTab,
  onOpenRegistration
}) => {
  const { news, programs, prestasiItems, galleryItems, personalia, pkbmInfo, visiMisi } = usePKBM();

  const sortedNews = sortNewsByDateDesc(news).slice(0, 3);
  const featuredPrestasi = (prestasiItems && prestasiItems.length > 0) ? prestasiItems.slice(0, 2) : [];
  const featuredGallery = (galleryItems && galleryItems.length > 0) ? galleryItems.slice(0, 4) : [];

  return (
    <div className="space-y-16 sm:space-y-24 py-12 sm:py-16">
      
      {/* 1. HIGHLIGHT BERITA & PENGUMUMAN TERKINI */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF7ED] text-[#EA580C] border border-[#FDBA74] text-xs font-black uppercase tracking-wider mb-2">
              <Newspaper className="w-3.5 h-3.5 text-[#F97316]" />
              Kabar Lembaga & Informasi
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#0F294A] tracking-tight">
              Berita & Pengumuman Terbaru
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm mt-1">
              Ikuti perkembangan kegiatan belajar, ujian kesetaraan, dan agenda penting PKBM Bina Insani.
            </p>
          </div>

          <button
            onClick={() => onNavigateTab('berita')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white text-xs font-black shadow-sm transition-all cursor-pointer group shrink-0 border border-[#FDBA74]/50"
          >
            <span>Buka Semua Berita & Pengumuman</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {sortedNews.map((item) => (
            <div
              key={item.id}
              onClick={() => onNavigateTab('berita')}
              className="bg-white rounded-3xl overflow-hidden border border-[#E2E8F0] hover:border-[#FDBA74] shadow-sm hover:shadow-md transition-all flex flex-col justify-between cursor-pointer group"
            >
              {item.image && (
                <div className="relative h-48 overflow-hidden bg-[#0F294A] flex items-center justify-center">
                  <img
                    src={item.image}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover blur-xl opacity-35 scale-125 pointer-events-none"
                  />
                  <img
                    src={item.image}
                    alt={item.title}
                    className="relative z-10 w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-black/75 backdrop-blur-md text-[#F59E0B] text-[10px] font-black uppercase z-20">
                    {item.category}
                  </div>
                </div>
              )}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <span className="text-[11px] text-slate-500 font-bold flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-[#F97316]" />
                    {item.date}
                  </span>
                  <h3 className="font-black text-[#0F294A] text-base leading-snug group-hover:text-[#EA580C] transition-colors line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="text-slate-600 text-xs leading-relaxed line-clamp-3">
                    {item.summary}
                  </p>
                </div>
                <div className="pt-3 border-t border-[#E2E8F0] flex items-center justify-between text-xs font-black text-[#EA580C]">
                  <span>Lanjutkan Membaca</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 2. HIGHLIGHT PRESTASI WARGA BELAJAR */}
      {featuredPrestasi.length > 0 && (
        <section className="bg-gradient-to-b from-[#F8FAFC] via-[#FFF7ED]/25 to-[#F8FAFC] py-14 sm:py-18 border-y border-[#E2E8F0]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FEF9C3] text-[#854D0E] border border-[#F4B942] text-xs font-black uppercase tracking-wider mb-2">
                  <Trophy className="w-3.5 h-3.5 text-[#854D0E]" />
                  Pencapaian & Kejuaraan
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-[#0F294A] tracking-tight">
                  Prestasi Membanggakan Warga Belajar
                </h2>
                <p className="text-slate-600 text-xs sm:text-sm mt-1">
                  Bukti nyata kualitas lulusan nonformal yang kompetitif, berprestasi, dan siap berkontribusi bagi masyarakat.
                </p>
              </div>

              <button
                onClick={() => onNavigateTab('prestasi')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white text-xs font-black shadow-sm transition-all cursor-pointer group shrink-0 border border-[#FDBA74]/50"
              >
                <span>Buka Halaman Prestasi Lengkap</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {featuredPrestasi.map((item) => (
                <div
                  key={item.id}
                  onClick={() => onNavigateTab('prestasi')}
                  className="bg-white rounded-3xl overflow-hidden border border-[#E2E8F0] hover:border-[#F4B942] shadow-sm hover:shadow-md transition-all p-5 sm:p-6 flex flex-col sm:flex-row gap-5 cursor-pointer group"
                >
                  {item.image && (
                    <div className="sm:w-44 h-40 rounded-2xl overflow-hidden shrink-0 bg-[#F8FAFC] border border-[#E2E8F0]">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                  )}
                  <div className="flex-1 flex flex-col justify-between space-y-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="px-2.5 py-0.5 rounded-md bg-[#FEF9C3] text-[#854D0E] border border-[#F4B942] text-[10px] font-black uppercase">
                          {item.rank || 'Prestasi'}
                        </span>
                        <span className="text-[11px] text-slate-500 font-semibold">{item.date}</span>
                      </div>
                      <h3 className="font-black text-[#0F294A] text-base leading-snug group-hover:text-[#EA580C] transition-colors line-clamp-2">
                        {item.title}
                      </h3>
                      <p className="text-slate-600 text-xs leading-relaxed line-clamp-2 mt-1">
                        {item.summary}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#EA580C] group-hover:translate-x-1 transition-transform">
                      <span>Rincian Penghargaan</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 3. HIGHLIGHT PROGRAM KESETARAAN (PAKET A, B, C) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F0F9FF] text-[#0284C7] border border-[#BAE6FD] text-xs font-black uppercase tracking-wider mb-2">
              <GraduationCap className="w-3.5 h-3.5 text-[#0284C7]" />
              Pendidikan Kesetaraan
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#0F294A] tracking-tight">
              Layanan Program Ijazah Resmi Negara
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm mt-1">
              Raih ijazah resmi negara setara SD, SMP, dan SMA dengan jadwal fleksibel dan bimbingan tutor berpengalaman.
            </p>
          </div>

          <button
            onClick={() => onNavigateTab('program-belajar')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white hover:bg-[#FFF7ED] text-[#0F294A] hover:text-[#EA580C] text-xs font-black border border-[#E2E8F0] transition-all cursor-pointer group shrink-0 shadow-xs"
          >
            <span>Pelajari Semua Program Kesetaraan</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {programs.map((prog) => {
            const isPaketB = prog.code.includes('B');
            const isPaketC = prog.code.includes('C');
            const borderColor = isPaketB ? 'border-[#BAE6FD]' : isPaketC ? 'border-[#BFDBFE]' : 'border-[#FDBA74]';
            const badgeBg = isPaketB ? 'bg-[#F0F9FF] text-[#0284C7] border-[#BAE6FD]' : isPaketC ? 'bg-[#EFF6FF] text-[#1E40AF] border-[#BFDBFE]' : 'bg-[#FFF7ED] text-[#EA580C] border-[#FDBA74]';
            const actionColor = isPaketB ? 'text-[#0284C7] hover:text-[#0369A1]' : isPaketC ? 'text-[#1E40AF] hover:text-[#1D4ED8]' : 'text-[#EA580C] hover:text-[#C2410C]';

            return (
              <div
                key={prog.id}
                className={`bg-white rounded-3xl p-6 border-2 ${borderColor} shadow-xs hover:shadow-md transition-all flex flex-col justify-between group`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className={`px-3 py-1 rounded-xl border text-xs font-black ${badgeBg}`}>
                      {prog.code}
                    </span>
                    <span className="text-[11px] font-bold text-slate-500">
                      Akreditasi Resmi
                    </span>
                  </div>
                  <h3 className="font-black text-[#0F294A] text-lg leading-snug">
                    {prog.name}
                  </h3>
                  <p className="text-slate-600 text-xs leading-relaxed">
                    {prog.description}
                  </p>
                  <div className="p-3 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs font-bold text-[#0F294A] space-y-1">
                    <p className="flex items-center gap-1.5 text-[#0F294A]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#0284C7] shrink-0" />
                      Ijazah Diakui Melanjutkan Pendidikan / Kerja
                    </p>
                    <p className="flex items-center gap-1.5 text-[#0F294A]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#0284C7] shrink-0" />
                      Fleksibel Tatap Muka & Daring Mandiri
                    </p>
                  </div>
                </div>

                <div className="pt-5 border-t border-[#E2E8F0] mt-5 flex items-center justify-between gap-2">
                  <button
                    onClick={() => onNavigateTab('program-belajar')}
                    className={`text-xs font-black cursor-pointer flex items-center gap-1 ${actionColor}`}
                  >
                    <span>Lihat Rincian</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onOpenRegistration(prog.code)}
                    className="px-4 py-2 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white font-black text-xs cursor-pointer shadow-xs border border-[#FDBA74]/50"
                  >
                    Daftar
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. HIGHLIGHT PELATIHAN VOKASI */}
      <section className="bg-gradient-to-r from-white via-[#FFF7ED]/35 to-white text-[#0F172A] py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto rounded-3xl border-2 border-[#FDBA74] shadow-sm relative overflow-hidden">
        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-[#EA580C] border border-[#FDBA74] text-xs font-black uppercase tracking-wider">
              <Wrench className="w-3.5 h-3.5 text-[#F97316]" />
              Keterampilan & Kewirausahaan
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#0F294A]">
              Pelatihan Vokasi Siap Kerja Gratis
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              Dapatkan sertifikasi keahlian terapan: Komputer & TI, Menjahit / Tata Busana, Tata Boga Olahan Pangan Lokal, serta Kerajinan Kreatif guna mendukung kemandirian ekonomi.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full lg:w-auto">
            <button
              onClick={() => onNavigateTab('vokasi')}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-white text-[#0F294A] hover:bg-[#F8FAFC] font-black text-xs sm:text-sm shadow-xs transition-all cursor-pointer flex items-center justify-center gap-2 border border-[#E2E8F0] group"
            >
              <span>Buka Pelatihan Vokasi</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-[#F97316]" />
            </button>
            <button
              onClick={() => onOpenRegistration('Vokasi')}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-[#F97316] hover:bg-[#EA580C] text-white font-black text-xs sm:text-sm shadow-sm transition-all cursor-pointer border border-[#FDBA74]/50 text-center"
            >
              Daftar Kursus Vokasi
            </button>
          </div>
        </div>
      </section>

      {/* 5. HIGHLIGHT GALERI KEGIATAN CUPLIKAN */}
      {featuredGallery.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF7ED] text-[#EA580C] border border-[#FDBA74] text-xs font-black uppercase tracking-wider mb-2">
                <ImageIcon className="w-3.5 h-3.5 text-[#F97316]" />
                Dokumentasi Kegiatan
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-[#0F294A] tracking-tight">
                Galeri Foto & Video Aktivitas Siswa
              </h2>
              <p className="text-slate-600 text-xs sm:text-sm mt-1">
                Suasana pembelajaran interaktif, workshop wirausaha, dan kebersamaan warga belajar.
              </p>
            </div>

            <button
              onClick={() => onNavigateTab('galeri')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white hover:bg-[#FFF7ED] text-[#0F294A] hover:text-[#EA580C] text-xs font-black border border-[#E2E8F0] transition-all cursor-pointer group shrink-0 shadow-xs"
            >
              <span>Kunjungi Galeri Lengkap</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {featuredGallery.map((media) => (
              <div
                key={media.id}
                onClick={() => onNavigateTab('galeri')}
                className="relative rounded-2xl overflow-hidden h-44 sm:h-52 bg-[#0F294A] border border-[#E2E8F0] cursor-pointer group shadow-xs hover:shadow-md transition-all"
              >
                <img
                  src={media.url}
                  alt={media.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3">
                  <p className="text-white text-xs font-bold leading-snug line-clamp-2">
                    {media.title}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 6. HIGHLIGHT TENTANG KAMI & MOTTO KARAKTER LEMBAGA */}
      <section className="bg-[#F8FAFC] text-[#0F172A] py-14 sm:py-18 border-t border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF7ED] text-[#EA580C] border border-[#FDBA74] text-xs font-black uppercase tracking-wider">
                <Building2 className="w-3.5 h-3.5 text-[#F97316]" />
                Profil Lembaga & Karakter
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-[#0F294A] leading-tight">
                Membangun Generasi <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#EA580C] via-[#F97316] to-[#F59E0B]">HEBAT • MANDIRI • KREATIF</span>
              </h2>
              <p className="text-slate-600 text-xs sm:text-base leading-relaxed">
                Pusat Kegiatan Belajar Masyarakat (PKBM) Bina Insani Sumowono hadir sebagai solusi pendidikan kesetaraan yang berkeadilan, inklusif, dan berorientasi pada kemandirian wirausaha di Kabupaten Semarang.
              </p>
              
              <div className="pt-2 flex flex-wrap gap-3">
                <button
                  onClick={() => onNavigateTab('tentang-kami')}
                  className="px-5 py-2.5 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white font-black text-xs shadow-sm cursor-pointer transition-all border border-[#FDBA74]/50"
                >
                  Buka Visi Misi & Profil Lengkap
                </button>
                <button
                  onClick={() => onNavigateTab('personalia')}
                  className="px-5 py-2.5 rounded-xl bg-white text-[#0F294A] border border-[#E2E8F0] hover:bg-[#FFF7ED] hover:text-[#EA580C] font-bold text-xs cursor-pointer transition-all flex items-center gap-1.5 shadow-xs"
                >
                  <Users className="w-3.5 h-3.5 text-[#F97316]" />
                  <span>Profil Dewan Guru & Pengelola</span>
                </button>
              </div>
            </div>

            <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-[#E2E8F0] shadow-md space-y-4">
              <span className="text-xs font-black uppercase text-[#0F294A] tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#F97316]" />
                Legalitas & Akreditasi
              </span>
              <div className="space-y-2 text-xs text-[#0F172A]">
                <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between">
                  <span className="text-slate-500 font-bold">NPSN Resmi Kemendikbud:</span>
                  <span className="font-mono font-black text-[#EA580C]">{pkbmInfo.npsn}</span>
                </div>
                <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between">
                  <span className="text-slate-500 font-bold">Status Akreditasi:</span>
                  <span className="font-black text-[#0F294A]">{pkbmInfo.accreditation}</span>
                </div>
                <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between">
                  <span className="text-slate-500 font-bold">Wilayah Pelayanan:</span>
                  <span className="font-black text-[#0F172A]">Kec. Sumowono, Kab. Semarang</span>
                </div>
              </div>
              <div className="pt-2 flex items-center justify-between text-xs">
                <button
                  onClick={() => onNavigateTab('faq')}
                  className="text-[#0284C7] hover:underline font-bold flex items-center gap-1 cursor-pointer"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Tanya Jawab (FAQ)</span>
                </button>
                <button
                  onClick={() => onNavigateTab('kontak')}
                  className="text-[#EA580C] hover:underline font-bold flex items-center gap-1 cursor-pointer"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Lokasi & Kontak</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
