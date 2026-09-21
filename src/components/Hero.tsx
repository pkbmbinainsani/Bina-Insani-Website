import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  GraduationCap,
  ArrowRight,
  Sparkles,
  BookOpen,
  Gift,
  ShieldCheck,
  Calendar
} from 'lucide-react';
import { usePKBM } from '../context/PKBMContext';

interface HeroProps {
  onOpenRegistration: (programName?: string) => void;
  onNavigateTab?: (tabId: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenRegistration, onNavigateTab }) => {
  const {
    pkbmInfo,
    stats,
    heroSlides,
    slideAutoplayDuration
  } = usePKBM();

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  // Fallback if heroSlides is empty
  const slides = heroSlides && heroSlides.length > 0 ? heroSlides : [
    {
      id: 'pwbb-default',
      title: 'PENDAFTARAN WARGA BELAJAR',
      subtitle: 'Tahun Ajaran 2026/2027',
      badge: pkbmInfo.name.toUpperCase(),
      pills: [
        { label: 'Paket A, B, & C', value: 'Bebas Biaya SPP' },
        { label: 'Keterampilan Vokasi', value: 'Gratis Bagi Warga Belajar' }
      ],
      notice: 'Daftarkan diri Anda sekarang juga dan raih ijazah resmi negara.',
      image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1000&q=80',
      domain: 'pkbmbinainsani.sch.id'
    }
  ];

  // Keep index within bounds if slides count changes
  useEffect(() => {
    if (currentSlide >= slides.length) {
      setCurrentSlide(0);
    }
  }, [slides.length, currentSlide]);

  useEffect(() => {
    if (!isPlaying || slides.length <= 1) return;
    const durationMs = (slideAutoplayDuration || 6) * 1000;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, durationMs);
    return () => clearInterval(interval);
  }, [isPlaying, slides.length, slideAutoplayDuration]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  const active = slides[currentSlide] || slides[0];

  return (
    <section id="beranda" className="relative pt-32 sm:pt-36 md:pt-40 lg:pt-44 pb-10 lg:pb-14 bg-gradient-to-b from-[#0c0a09] via-[#1c1917] to-[#0c0a09] text-white overflow-hidden w-full max-w-full">
      
      {/* Background Subtle Geometric Glow & Luxury Ambient Lighting */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(234,88,12,0.18),rgba(251,191,36,0.08),rgba(12,10,9,0.95))] pointer-events-none" />
      <div className="absolute top-1/4 -left-40 w-88 h-88 bg-orange-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-6 -right-40 w-88 h-88 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-5 sm:space-y-6 w-full max-w-full">
        
        {/* Dynamic Main Slide Container Card - Enhanced Proportions & Warm Luxury Orange-Amber Glow */}
        <div className="bg-gradient-to-br from-[#1c1917]/95 via-[#292524]/95 to-[#141210]/95 rounded-2xl sm:rounded-3xl p-3.5 xs:p-4 sm:p-7 lg:p-10 border-2 border-orange-400/40 shadow-[0_20px_60px_-15px_rgba(234,88,12,0.25)] relative overflow-hidden backdrop-blur-md min-h-0 lg:min-h-[560px] flex flex-col justify-between w-full max-w-full">
          
          {/* Top Bar inside Slide: Institution Badge + Controls (Fully responsive with zero overflow) */}
          <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-2.5 pb-3 sm:pb-4 mb-3 sm:mb-6 border-b border-orange-400/30 w-full min-w-0">
            <div className="flex items-center gap-2 min-w-0 max-w-full">
              <div className="inline-flex items-center gap-1.5 bg-stone-950/85 text-[#fed7aa] px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-xl border border-orange-500/50 text-[10px] sm:text-xs font-black uppercase tracking-wider shadow-sm min-w-0 max-w-full">
                <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-orange-400 shrink-0" />
                <span className="truncate max-w-[200px] xs:max-w-none">{active.badge || pkbmInfo.name.toUpperCase()}</span>
              </div>
              <span className="hidden sm:inline-block text-[11px] font-bold text-orange-200/90 bg-stone-950/80 px-3 py-1.5 rounded-xl border border-orange-500/30 shrink-0">
                NPSN: {pkbmInfo.npsn} • {pkbmInfo.accreditation}
              </span>
            </div>

            {/* Slide Navigation & Controls */}
            <div className="flex items-center justify-between xs:justify-end gap-1.5 sm:gap-2 shrink-0 w-full xs:w-auto">
              {/* Play/Pause */}
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-1.5 sm:p-2 rounded-xl bg-stone-900/90 hover:bg-stone-800 text-[#fed7aa] border border-orange-400/40 transition-colors cursor-pointer shadow-xs"
                title={isPlaying ? 'Jeda otomatis' : 'Putar otomatis'}
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              </button>

              {/* Slide Counter Dots */}
              <div className="flex items-center gap-1 sm:gap-1.5 px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-xl bg-stone-950/80 border border-orange-500/40">
                {slides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    className={`h-2 rounded-full transition-all cursor-pointer ${
                      currentSlide === idx ? 'w-5 sm:w-6 bg-gradient-to-r from-orange-400 to-amber-400 shadow-xs' : 'w-2 bg-stone-700 hover:bg-stone-600'
                    }`}
                    aria-label={`Slide ${idx + 1}`}
                  />
                ))}
              </div>

              {/* Prev / Next Arrows */}
              <div className="flex items-center gap-1 sm:gap-1.5">
                <button
                  onClick={prevSlide}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-stone-900 hover:bg-stone-800 border border-orange-400/40 flex items-center justify-center text-[#fed7aa] shadow-sm transition-all cursor-pointer hover:scale-105 active:scale-95"
                  aria-label="Slide sebelumnya"
                >
                  <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
                <button
                  onClick={nextSlide}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-stone-900 hover:bg-stone-800 border border-orange-400/40 flex items-center justify-center text-[#fed7aa] shadow-sm transition-all cursor-pointer hover:scale-105 active:scale-95"
                  aria-label="Slide berikutnya"
                >
                  <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
              </div>
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={active.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35 }}
              className="grid lg:grid-cols-12 gap-5 lg:gap-8 items-center my-auto"
            >
              
              {/* Left Content Column (Title, Highlights, Notice, CTAs) */}
              <div className="lg:col-span-7 space-y-3.5 sm:space-y-5">
                
                {/* Golden Yellow Gradient Box Title (Gradasi Kuning Keemasan Elegan) */}
                <div className="bg-gradient-to-br from-[#FFE270] via-[#F3B712] to-[#B37400] text-slate-950 p-4 sm:p-6 lg:p-7 rounded-2xl sm:rounded-3xl shadow-2xl border-2 border-[#FFF099] relative overflow-hidden w-full max-w-full">
                  
                  {/* Subtle golden metallic sheen overlay */}
                  <div className="absolute top-0 -left-10 w-48 h-48 bg-white/20 rounded-full blur-2xl pointer-events-none" />
                  <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-amber-800/20 rounded-full blur-xl pointer-events-none" />

                  <div className="space-y-1 sm:space-y-1.5 relative z-10 min-w-0">
                    <p className="text-xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight uppercase font-sans text-slate-950 drop-shadow-xs break-words">
                      {active.title}
                    </p>
                    {active.subtitle && (
                      <p className="text-sm sm:text-lg lg:text-xl font-serif italic text-stone-900 font-black break-words">
                        {active.subtitle}
                      </p>
                    )}
                  </div>

                  {/* Motto & Location Tag */}
                  <div className="mt-3 sm:mt-4 pt-3 sm:pt-3.5 border-t border-slate-950/20 flex flex-wrap items-center justify-between gap-2 relative z-10">
                    <div className="inline-flex items-center gap-1.5 bg-slate-950 text-[#FDE68A] px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl border border-[#F5B700]/70 shadow-sm font-black text-[10px] sm:text-xs tracking-wider uppercase">
                      <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#F5B700]" />
                      <span>HEBAT • MANDIRI • KREATIF</span>
                    </div>
                    <span className="text-[11px] sm:text-sm font-black text-slate-900">
                      Kecamatan Sumowono, Kab. Semarang
                    </span>
                  </div>
                </div>

                {/* Key Benefits / Highlights Row */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                  <div className="bg-stone-900/90 p-2.5 sm:p-3 rounded-2xl border border-orange-400/35 flex items-center gap-2 sm:gap-2.5 shadow-sm">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-gradient-to-br from-orange-500/30 to-amber-600/20 text-[#fed7aa] flex items-center justify-center shrink-0 border border-orange-400/30">
                      <GraduationCap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-300" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[9px] sm:text-[10px] text-orange-200/90 font-bold uppercase tracking-wide">Kesetaraan</p>
                      <p className="text-xs sm:text-sm font-black text-white truncate">Paket A, B, & C</p>
                    </div>
                  </div>

                  <div className="bg-stone-900/90 p-2.5 sm:p-3 rounded-2xl border border-orange-400/35 flex items-center gap-2 sm:gap-2.5 shadow-sm">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-gradient-to-br from-orange-500/30 to-amber-600/20 text-[#fed7aa] flex items-center justify-center shrink-0 border border-orange-400/30">
                      <Gift className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-300" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[9px] sm:text-[10px] text-orange-200/90 font-bold uppercase tracking-wide">Biaya SPP</p>
                      <p className="text-xs sm:text-sm font-black text-amber-300 truncate">Bebas Biaya / Gratis</p>
                    </div>
                  </div>

                  <div className="col-span-2 sm:col-span-1 bg-stone-900/90 p-2.5 sm:p-3 rounded-2xl border border-orange-400/35 flex items-center gap-2 sm:gap-2.5 shadow-sm">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-gradient-to-br from-orange-500/30 to-amber-600/20 text-[#fed7aa] flex items-center justify-center shrink-0 border border-orange-400/30">
                      <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-300" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[9px] sm:text-[10px] text-orange-200/90 font-bold uppercase tracking-wide">Ijazah</p>
                      <p className="text-xs sm:text-sm font-black text-white truncate">Resmi Negara</p>
                    </div>
                  </div>
                </div>

                {/* Special Notice Banner */}
                {active.notice && (
                  <div className="bg-gradient-to-r from-stone-950/95 via-[#292524]/90 to-stone-950/95 p-2.5 sm:p-3.5 rounded-2xl border border-orange-400/40 flex items-center gap-2.5 sm:gap-3 shadow-md">
                    <div className="p-1.5 sm:p-2 bg-gradient-to-br from-orange-400 to-amber-500 text-slate-950 rounded-xl shrink-0 font-bold shadow-xs">
                      <Gift className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </div>
                    <p className="text-xs sm:text-sm text-stone-200 font-medium leading-snug">
                      <strong className="text-amber-300 font-black">INFO: </strong>
                      {active.notice}
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="pt-1 flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2 sm:gap-3">
                  <button
                    onClick={() => onOpenRegistration()}
                    className="w-full sm:w-auto px-5 sm:px-7 py-3 sm:py-3.5 rounded-xl sm:rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-400 hover:to-amber-400 text-white font-black text-xs sm:text-sm shadow-xl hover:shadow-orange-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer group border border-orange-300 transform active:scale-95"
                  >
                    <span>Daftar Sekarang (PWBB 2026)</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>

                  <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 sm:gap-3">
                    <button
                      onClick={() => onNavigateTab ? onNavigateTab('program-belajar') : undefined}
                      className="px-3 sm:px-5 py-2.5 sm:py-3.5 rounded-xl sm:rounded-2xl bg-gradient-to-r from-stone-900 to-[#1f1510] hover:from-stone-800 hover:to-[#2e1d15] text-orange-200 font-bold text-xs sm:text-sm border border-orange-400/40 transition-all flex items-center justify-center gap-1.5 shadow-sm text-center cursor-pointer"
                    >
                      <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-300" />
                      <span>Kurikulum</span>
                    </button>

                    <button
                      onClick={() => onNavigateTab ? onNavigateTab('tentang-kami') : undefined}
                      className="px-3 sm:px-4 py-2.5 sm:py-3.5 rounded-xl sm:rounded-2xl bg-stone-950/70 hover:bg-stone-900 text-stone-300 hover:text-white font-semibold text-xs sm:text-sm border border-stone-700 transition-all text-center flex items-center justify-center cursor-pointer"
                    >
                      Profil
                    </button>
                  </div>
                </div>

              </div>

              {/* Right Visual & Informative Cards Column - Proportional Aspect Ratio Frame */}
              <div className="lg:col-span-5 grid sm:grid-cols-12 lg:grid-cols-1 gap-3 sm:gap-3.5 items-center">
                
                {/* Photo Frame with Aspect Ratio */}
                <div className="sm:col-span-7 lg:col-span-1 relative w-full max-w-full">
                  <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden border-2 border-orange-400/50 shadow-2xl w-full h-48 xs:h-56 sm:h-64 lg:h-80 max-w-full">
                    <img
                      src={active.image}
                      alt={active.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-transparent to-transparent" />
                    
                    {/* Official Stamp Overlay */}
                    <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 bg-stone-950/90 backdrop-blur-md px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl border border-orange-400/60 flex items-center gap-1.5 text-[11px] sm:text-xs text-amber-300 font-black shadow-md">
                      <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-400" />
                      <span>Terakreditasi BAN-PDM</span>
                    </div>

                    {/* Domain Footer Pill */}
                    <div className="absolute bottom-2.5 left-2.5 right-2.5 sm:bottom-3 sm:left-3 sm:right-3 bg-stone-950/95 backdrop-blur-md py-1.5 sm:py-2 px-2.5 sm:px-3 rounded-xl border border-orange-400/40 text-center shadow-md flex items-center justify-between text-[11px] sm:text-xs font-bold text-amber-300">
                      <span>🌐 {active.domain || 'pkbmbinainsani.sch.id'}</span>
                      <span className="text-[9px] sm:text-[10px] bg-gradient-to-r from-orange-500 to-amber-500 text-white px-2 py-0.5 rounded-md font-black">Sumowono</span>
                    </div>
                  </div>
                </div>

                {/* Right Stacked Schedule / Info Pills */}
                <div className="sm:col-span-5 lg:col-span-1 grid grid-cols-1 sm:grid-cols-1 gap-2.5">
                  {active.pills && active.pills.slice(0, 2).map((pill, idx) => (
                    <div
                      key={idx}
                      className="bg-gradient-to-br from-white via-orange-50/90 to-amber-50/90 text-slate-900 p-3 sm:p-3.5 rounded-2xl shadow-lg border-l-4 border-orange-500 space-y-1"
                    >
                      <div className="flex items-center gap-1.5 text-orange-950 font-black text-[11px] sm:text-xs uppercase tracking-wider">
                        <Calendar className="w-3.5 h-3.5 text-orange-600" />
                        <span>{pill.label}</span>
                      </div>
                      <p className="text-xs sm:text-sm font-bold text-slate-800 truncate">
                        {pill.value}
                      </p>
                    </div>
                  ))}
                </div>

              </div>

            </motion.div>
          </AnimatePresence>

        </div>

        {/* Quick Stats Grid Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 text-center">
          {stats.map((stat, idx) => (
            <div key={idx} className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-b from-[#1c1917]/90 to-[#0c0a09]/90 border border-orange-400/35 shadow-lg space-y-1 backdrop-blur-sm">
              <p className="text-2xl sm:text-3xl lg:text-4xl font-black text-amber-300 drop-shadow-xs">
                {stat.value}
              </p>
              <p className="text-xs sm:text-sm text-stone-200 font-bold leading-tight">{stat.label}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
