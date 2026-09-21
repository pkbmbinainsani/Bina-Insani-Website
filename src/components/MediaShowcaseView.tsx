import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Play,
  Calendar,
  Tag,
  ExternalLink,
  Sparkles,
  Award,
  GraduationCap,
  BookOpen,
  Mail,
  UserCheck
} from 'lucide-react';
import { getVideoEmbedUrl, getVideoPlatformInfo } from '../utils/videoHelper';

export interface ShowcaseItem {
  id: string;
  title: string;
  description: string;
  image?: string;
  videoUrl?: string;
  platform?: 'youtube' | 'facebook' | 'instagram' | 'direct' | 'other';
  duration?: string;
  category?: string;
  date?: string;
  badge?: string;
  subtitle?: string; // e.g. Jabatan in personalia
  education?: string;
  specialization?: string;
  email?: string;
  nuptkOrNip?: string;
  actionUrl?: string;
  actionLabel?: string;
}

interface MediaShowcaseViewProps {
  items: ShowcaseItem[];
  activeId: string;
  onSelect: (item: ShowcaseItem) => void;
  onClose: () => void;
  sectionTitle?: string;
  mediaType?: 'photo' | 'video' | 'person' | 'achievement';
  theme?: 'dark' | 'light';
}

export const MediaShowcaseView: React.FC<MediaShowcaseViewProps> = ({
  items,
  activeId,
  onSelect,
  onClose,
  sectionTitle = 'Galeri & Dokumentasi',
  mediaType = 'photo',
  theme = 'light'
}) => {
  const showcaseRef = useRef<HTMLDivElement>(null);
  const activeIndex = items.findIndex((item) => item.id === activeId);
  const currentItem = activeIndex !== -1 ? items[activeIndex] : items[0];

  // Auto scroll to showcase header when mounted or item selected
  useEffect(() => {
    if (showcaseRef.current) {
      showcaseRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  if (!currentItem) return null;

  const handlePrev = () => {
    const prevIdx = activeIndex > 0 ? activeIndex - 1 : items.length - 1;
    onSelect(items[prevIdx]);
  };

  const handleNext = () => {
    const nextIdx = activeIndex < items.length - 1 ? activeIndex + 1 : 0;
    onSelect(items[nextIdx]);
  };

  const isDark = theme === 'dark';

  return (
    <div
      ref={showcaseRef}
      className={`rounded-3xl border shadow-2xl overflow-hidden transition-all duration-300 mb-12 scroll-mt-28 ${
        isDark
          ? 'bg-stone-950 border-orange-500/30 text-white'
          : 'bg-white border-stone-200 text-slate-900'
      }`}
    >
      {/* Top Bar Navigation (Kembali & Item Counter) */}
      <div
        className={`px-4 sm:px-6 py-4 flex flex-wrap items-center justify-between gap-3 border-b ${
          isDark ? 'bg-stone-900/90 border-stone-800' : 'bg-slate-50 border-stone-200'
        }`}
      >
        <div className="flex items-center gap-2">
          <button
            onClick={onClose}
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl font-bold text-xs transition-colors cursor-pointer ${
              isDark
                ? 'bg-stone-800 hover:bg-stone-700 text-amber-300 border border-stone-700'
                : 'bg-white hover:bg-orange-50 text-orange-600 border border-stone-200 shadow-sm'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Grid Tampilan</span>
          </button>

          <span
            className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${
              isDark ? 'bg-stone-800 text-stone-300' : 'bg-stone-200/70 text-stone-600'
            }`}
          >
            {sectionTitle}
          </span>
        </div>

        {/* Carousel Prev/Next & Close */}
        <div className="flex items-center gap-2">
          <span className={`text-xs font-mono font-bold ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
            {activeIndex + 1} / {items.length}
          </span>

          <button
            onClick={handlePrev}
            title="Item Sebelumnya"
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              isDark ? 'hover:bg-stone-800 text-stone-300' : 'hover:bg-stone-200 text-stone-700'
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={handleNext}
            title="Item Selanjutnya"
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              isDark ? 'hover:bg-stone-800 text-stone-300' : 'hover:bg-stone-200 text-stone-700'
            }`}
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          <button
            onClick={onClose}
            title="Tutup Tampilan Fokus"
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ml-2 ${
              isDark
                ? 'hover:bg-red-500/20 text-stone-400 hover:text-red-400'
                : 'hover:bg-red-50 text-stone-500 hover:text-red-600'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Showcase Body (Layout Persis Seperti Gambar Terupload: Kiri = Gambar/Video Ditampilkan, Kanan = Gambar/Video Lain) */}
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          {/* ==================== KOLOM KIRI (UTAMA ~65%): GAMBAR / VIDEO YANG DITAMPILKAN ==================== */}
          <div className="lg:col-span-8 flex flex-col space-y-4">
            
            {/* Box Media Utama (Hitam / Dark Frame Seperti Pada Gambar Layout) */}
            <div
              className={`relative w-full ${
                mediaType === 'person'
                  ? 'h-80 sm:h-[480px] max-h-[540px]'
                  : 'aspect-video sm:aspect-[16/10]'
              } bg-black rounded-2xl overflow-hidden border border-stone-800 shadow-xl flex items-center justify-center`}
            >
              {currentItem.videoUrl ? (
                currentItem.platform === 'direct' ? (
                  <video
                    key={currentItem.videoUrl}
                    src={currentItem.videoUrl}
                    controls
                    autoPlay
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <iframe
                    key={currentItem.videoUrl}
                    src={getVideoEmbedUrl(currentItem.videoUrl, currentItem.platform) || currentItem.videoUrl}
                    title={currentItem.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="w-full h-full border-0"
                  />
                )
              ) : currentItem.image ? (
                <div className="relative w-full h-full flex items-center justify-center bg-stone-950 p-2 sm:p-4 overflow-hidden">
                  {/* Ambient soft blur glow */}
                  <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <img
                      src={currentItem.image}
                      alt=""
                      aria-hidden="true"
                      className="w-full h-full object-cover blur-2xl opacity-25 scale-125 pointer-events-none"
                    />
                    <div className="absolute inset-0 bg-stone-950/70" />
                  </div>

                  <img
                    key={currentItem.image}
                    src={currentItem.image}
                    alt={currentItem.title}
                    className="relative z-10 max-h-full max-w-full w-auto h-auto object-contain rounded-xl drop-shadow-2xl"
                  />
                  {currentItem.category && (
                    <div className="absolute top-4 left-4 z-20">
                      <span className="px-3 py-1 rounded-xl text-xs font-black bg-black/75 backdrop-blur-md text-amber-300 border border-orange-500/30 shadow-md">
                        {currentItem.category}
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-stone-500 text-center p-8">
                  <Play className="w-12 h-12 mx-auto mb-2 opacity-40" />
                  <span className="text-sm font-semibold">Media Tidak Tersedia</span>
                </div>
              )}
            </div>

            {/* Bagian Bawah Gambar/Video: JUDUL & DESKRIPSI (Tepat Sesuai Sketsa Gambar Layout) */}
            <div className="space-y-3 pt-2">
              {/* Tag / Category / Date Meta Strip */}
              <div className="flex flex-wrap items-center gap-2 text-xs">
                {currentItem.badge && (
                  <span className="px-2.5 py-0.5 rounded-lg bg-orange-500 text-white font-black uppercase text-[10px]">
                    {currentItem.badge}
                  </span>
                )}
                {currentItem.category && (
                  <span
                    className={`px-2.5 py-0.5 rounded-lg font-bold ${
                      isDark ? 'bg-stone-800 text-amber-300' : 'bg-orange-100 text-orange-900'
                    }`}
                  >
                    {currentItem.category}
                  </span>
                )}
                {currentItem.date && (
                  <span className={`flex items-center gap-1 font-medium ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
                    <Calendar className="w-3.5 h-3.5 text-orange-500" />
                    {currentItem.date}
                  </span>
                )}
                {currentItem.duration && (
                  <span className={`font-mono text-xs ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
                    • {currentItem.duration}
                  </span>
                )}
              </div>

              {/* JUDUL GAMBAR/VIDEO YANG DITAMPILKAN */}
              <h2
                className={`text-xl sm:text-2xl lg:text-3xl font-black leading-tight tracking-tight ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}
              >
                {currentItem.title}
              </h2>

              {/* Subtitle jika personalia / prestasi */}
              {currentItem.subtitle && (
                <p className="text-sm font-extrabold text-orange-500">{currentItem.subtitle}</p>
              )}

              {/* DESKRIPSI FOTO / VIDEO YANG DITAMPILKAN */}
              <div
                className={`text-sm sm:text-base leading-relaxed font-normal ${
                  isDark ? 'text-stone-300' : 'text-stone-700'
                }`}
              >
                <p className="whitespace-pre-line">{currentItem.description}</p>
              </div>

              {/* Detail Ekstra Untuk Personalia */}
              {(currentItem.education || currentItem.specialization || currentItem.nuptkOrNip || currentItem.email) && (
                <div
                  className={`p-4 rounded-2xl space-y-2 text-xs mt-3 ${
                    isDark ? 'bg-stone-900 border border-stone-800' : 'bg-stone-50 border border-stone-200'
                  }`}
                >
                  {currentItem.nuptkOrNip && (
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-orange-500">NUPTK/NIP:</span>
                      <span className="font-mono">{currentItem.nuptkOrNip}</span>
                    </div>
                  )}
                  {currentItem.education && (
                    <div className="flex items-start gap-2">
                      <GraduationCap className="w-3.5 h-3.5 text-orange-500 shrink-0 mt-0.5" />
                      <span>
                        <strong>Pendidikan:</strong> {currentItem.education}
                      </span>
                    </div>
                  )}
                  {currentItem.specialization && (
                    <div className="flex items-start gap-2">
                      <BookOpen className="w-3.5 h-3.5 text-orange-500 shrink-0 mt-0.5" />
                      <span>
                        <strong>Bidang Keahlian:</strong> {currentItem.specialization}
                      </span>
                    </div>
                  )}
                  {currentItem.email && (
                    <div className="flex items-start gap-2">
                      <Mail className="w-3.5 h-3.5 text-orange-500 shrink-0 mt-0.5" />
                      <span>
                        <strong>Email:</strong>{' '}
                        <a href={`mailto:${currentItem.email}`} className="text-orange-500 hover:underline">
                          {currentItem.email}
                        </a>
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Action Link jika ada */}
              {currentItem.actionUrl && (
                <div className="pt-2">
                  <a
                    href={currentItem.actionUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold transition-all shadow-md"
                  >
                    <span>{currentItem.actionLabel || 'Buka Tautan Terkait'}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* ==================== KOLOM KANAN (~35%): DAFTAR GAMBAR / VIDEO LAIN ==================== */}
          <div className="lg:col-span-4 flex flex-col space-y-3">
            
            {/* Header Kolom Kanan */}
            <div
              className={`pb-2 border-b flex items-center justify-between ${
                isDark ? 'border-stone-800' : 'border-stone-200'
              }`}
            >
              <h3 className="font-black text-sm uppercase tracking-wider text-orange-500">
                {mediaType === 'video'
                  ? 'Video Dokumentasi Lain'
                  : mediaType === 'person'
                  ? 'Personalia Lain'
                  : mediaType === 'achievement'
                  ? 'Prestasi Lainnya'
                  : 'Gambar / Foto Lain'}
              </h3>
              <span className={`text-xs ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
                {items.length} Item
              </span>
            </div>

            {/* List Vertikal Gambar / Video Lain (Persis Pada Gambar Layout) */}
            <div className="max-h-[560px] overflow-y-auto space-y-3 pr-1.5 custom-scrollbar">
              {items.map((item) => {
                const isActive = item.id === currentItem.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => onSelect(item)}
                    className={`w-full text-left p-2.5 rounded-2xl transition-all cursor-pointer flex items-start gap-3 border ${
                      isActive
                        ? isDark
                          ? 'bg-orange-500/15 border-orange-500 shadow-md ring-1 ring-orange-500/40'
                          : 'bg-orange-50 border-orange-400 shadow-sm ring-1 ring-orange-400/30'
                        : isDark
                        ? 'bg-stone-900/80 border-stone-800 hover:border-orange-500/50 hover:bg-stone-900'
                        : 'bg-white border-stone-200 hover:border-orange-300 hover:bg-stone-50 shadow-xs'
                    }`}
                  >
                    {/* Thumbnail Kiri (Kotak Hitam / Thumbnail [GAMBAR/VIDEO LAIN]) */}
                    <div
                      className={`relative w-24 sm:w-28 ${
                        mediaType === 'person' ? 'aspect-[4/5]' : 'aspect-[16/11]'
                      } bg-black rounded-xl overflow-hidden shrink-0 border border-stone-800 flex items-center justify-center`}
                    >
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.title}
                          className={`w-full h-full ${
                            mediaType === 'person' ? 'object-contain p-1' : 'object-cover group-hover:scale-105'
                          } transition-transform`}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-stone-900 text-stone-500">
                          <Play className="w-5 h-5 opacity-40" />
                        </div>
                      )}

                      {/* Video Indicator Icon */}
                      {item.videoUrl && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <div className="w-6 h-6 rounded-full bg-orange-500 text-white flex items-center justify-center shadow-md">
                            <Play className="w-3 h-3 fill-current ml-0.5" />
                          </div>
                        </div>
                      )}

                      {/* Active Label Pin */}
                      {isActive && (
                        <div className="absolute bottom-1 left-1 right-1">
                          <span className="block text-center text-[9px] font-black bg-orange-600 text-white py-0.5 rounded px-1 shadow">
                            DITAMPILKAN
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Teks Kanan: JUDUL GAMBAR/VIDEO LAIN + Deskripsi foto/vedio lain */}
                    <div className="min-w-0 flex-1 space-y-1">
                      <h4
                        className={`font-black text-xs sm:text-sm leading-snug line-clamp-2 ${
                          isActive
                            ? 'text-orange-600'
                            : isDark
                            ? 'text-white hover:text-amber-300'
                            : 'text-slate-900 hover:text-orange-600'
                        }`}
                      >
                        {item.title}
                      </h4>

                      {item.subtitle && (
                        <p className="text-[11px] font-bold text-orange-500 truncate">
                          {item.subtitle}
                        </p>
                      )}

                      <p
                        className={`text-[11px] line-clamp-2 leading-relaxed ${
                          isDark ? 'text-stone-400' : 'text-stone-600'
                        }`}
                      >
                        {item.description}
                      </p>

                      <div className="flex items-center gap-2 pt-0.5 text-[10px]">
                        {item.category && (
                          <span
                            className={`px-2 py-0.5 rounded font-bold ${
                              isDark ? 'bg-stone-800 text-amber-300' : 'bg-stone-100 text-stone-700'
                            }`}
                          >
                            {item.category}
                          </span>
                        )}
                        {item.date && (
                          <span className={`${isDark ? 'text-stone-500' : 'text-stone-400'}`}>
                            {item.date}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
