import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Trophy,
  Award,
  Medal,
  Sparkles,
  Calendar,
  User,
  ArrowRight,
  ExternalLink,
  CheckCircle2,
  X,
  Share2,
  BookmarkCheck,
  PlusCircle,
  GraduationCap
} from 'lucide-react';
import { usePKBM } from '../context/PKBMContext';
import { NewsItem } from '../types';
import { sortNewsByDateDesc } from '../utils/dateHelper';
import { MediaShowcaseView, ShowcaseItem } from './MediaShowcaseView';

interface PrestasiSectionProps {
  onOpenAdmin?: () => void;
  onOpenNewsReader?: (article: NewsItem) => void;
  onShareCustom?: (data: { title: string; description: string; hash: string; category?: string; image?: string }) => void;
}

export const PrestasiSection: React.FC<PrestasiSectionProps> = ({ onOpenAdmin, onOpenNewsReader, onShareCustom }) => {
  const { news, pkbmInfo, isAdminAuthenticated } = usePKBM();
  const [activeArticleModal, setActiveArticleModal] = useState<NewsItem | null>(null);

  // Ambil seluruh berita yang berkategori atau berlabel "Prestasi Warga Belajar" dan urutkan tanggal terbit terbaru
  const prestasiItems: NewsItem[] = sortNewsByDateDesc(
    news.filter((item) => {
      const isCategoryPrestasi = item.category === 'Prestasi Warga Belajar' ||
        item.category.toLowerCase().includes('prestasi');
      const isTaggedPrestasi = item.tags && item.tags.some((t) => t.toLowerCase().includes('prestasi'));
      const isTitlePrestasi = item.title.toLowerCase().includes('prestasi') || item.title.toLowerCase().includes('juara');
      return isCategoryPrestasi || isTaggedPrestasi || isTitlePrestasi;
    })
  );

  // Transform prestasi items into showcase format
  const prestasiShowcaseItems: ShowcaseItem[] = prestasiItems.map((item) => ({
    id: item.id,
    title: item.title,
    subtitle: `Pencapaian Sah • Penulis: ${item.author || 'Tim PKBM Bina Insani'}`,
    description: (item.content && item.content.length > 0)
      ? item.content.join('\n\n')
      : item.summary,
    image: item.image,
    category: item.category || 'Prestasi Warga Belajar',
    date: item.date,
    badge: 'Prestasi Warga Belajar'
  }));

  const handleReadDetail = (item: NewsItem) => {
    setActiveArticleModal(item);
  };

  return (
    <section id="prestasi" className="pt-4 sm:pt-6 pb-16 bg-[#F8FAFC] text-[#1E293B] relative overflow-hidden">
      {/* Decorative Glow Elements */}
      <div className="absolute top-0 left-1/4 w-72 h-72 bg-[#FDBA74]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-[#F97316]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Institutional Highlights Strip & Admin Action */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 mb-5 p-2 sm:px-3 rounded-xl bg-white border border-[#E2E8F0] shadow-xs">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#FEF9C3] text-[#854D0E] font-extrabold text-[11px] border border-[#F4B942]">
              <Trophy className="w-3.5 h-3.5 text-[#854D0E]" />
              <span>{prestasiItems.length} Prestasi Tercatat</span>
            </span>
            <span className="hidden md:flex items-center gap-1.5 text-[#486581] text-[11px]">
              <Medal className="w-3 h-3 text-[#F4B942]" />
              <span>Kejuaraan Vokasi</span>
            </span>
            <span className="hidden lg:flex items-center gap-1.5 text-[#486581] text-[11px]">
              <GraduationCap className="w-3 h-3 text-[#1976D2]" />
              <span>Kelulusan Lanjut PTN/PTS</span>
            </span>
            <span className="hidden sm:flex items-center gap-1.5 text-[#486581] text-[11px]">
              <Sparkles className="w-3 h-3 text-[#F97316]" />
              <span>Wirausaha Mandiri</span>
            </span>
          </div>

          {onOpenAdmin && (
            <button
              onClick={onOpenAdmin}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#F97316] hover:bg-[#EA580C] text-white font-extrabold text-[11px] shadow-xs transition-all cursor-pointer border border-[#FDBA74]/50"
            >
              <PlusCircle className="w-3.5 h-3.5 text-white" />
              <span>{isAdminAuthenticated ? 'Tambah Prestasi Baru' : 'Kelola Prestasi (Admin)'}</span>
            </button>
          )}
        </div>

        {/* Showcase Tampilan Split 2 Kolom */}
        {activeArticleModal && (
          <div className="mb-12">
            <MediaShowcaseView
              items={prestasiShowcaseItems}
              activeId={activeArticleModal.id}
              onSelect={(item) => {
                const found = prestasiItems.find((p) => p.id === item.id);
                if (found) setActiveArticleModal(found);
              }}
              onClose={() => setActiveArticleModal(null)}
              sectionTitle="Prestasi & Penghargaan Warga Belajar"
              mediaType="achievement"
              theme="light"
              onShareItem={(item) => {
                if (onShareCustom) {
                  onShareCustom({
                    title: item.title,
                    description: item.description,
                    hash: '#prestasi',
                    category: item.category,
                    image: item.image
                  });
                }
              }}
            />
          </div>
        )}

        {/* List of Prestasi Cards */}
        {prestasiItems.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {prestasiItems.map((item, idx) => (
              <motion.article
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.12 }}
                onClick={() => handleReadDetail(item)}
                className={`group bg-white rounded-3xl overflow-hidden border-2 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between cursor-pointer ${
                  activeArticleModal?.id === item.id
                    ? 'border-[#F4B942] ring-2 ring-[#F4B942]/30 shadow-md'
                    : 'border-[#E2E8F0] hover:border-[#F4B942]'
                }`}
              >
                {/* Image Section with Trophy Badge */}
                <div className="relative h-56 sm:h-64 overflow-hidden bg-[#1E293B]">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-[#F4B942] bg-[#F8FAFC]">
                      <Trophy className="w-16 h-16 mb-2 text-[#F4B942]" />
                      <span className="text-xs font-bold text-[#486581]">Dokumentasi Prestasi</span>
                    </div>
                  )}

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                  {/* Top Badge: Prestasi Ribbon */}
                  <div className="absolute top-3 left-3">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-[#FEF9C3] text-[#854D0E] shadow-xs border border-[#F4B942]">
                      <Award className="w-3.5 h-3.5 text-[#854D0E]" />
                      Prestasi Warga Belajar
                    </span>
                  </div>

                  {/* Date & Author on Image */}
                  <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs text-white">
                    <span className="flex items-center gap-1.5 text-[#F4B942] font-semibold bg-black/60 px-2.5 py-1 rounded-lg backdrop-blur-sm border border-white/20">
                      <Calendar className="w-3.5 h-3.5 text-[#F4B942]" />
                      {item.date}
                    </span>
                    {item.author && (
                      <span className="flex items-center gap-1 text-[11px] text-white bg-black/60 px-2.5 py-1 rounded-lg backdrop-blur-sm border border-white/20">
                        <User className="w-3 h-3 text-[#FDBA74]" />
                        {item.author}
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <h3 className="text-lg sm:text-xl font-black text-[#193B63] group-hover:text-[#EA580C] transition-colors leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-[#486581] text-xs sm:text-sm leading-relaxed line-clamp-3 font-medium">
                      {item.summary}
                    </p>
                  </div>

                  {/* Card Bottom CTA */}
                  <div className="pt-4 border-t border-[#E2E8F0] flex items-center justify-between">
                    {onShareCustom ? (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onShareCustom({
                            title: item.title,
                            description: item.summary,
                            hash: '#prestasi',
                            category: item.category,
                            image: item.image
                          });
                        }}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#FFF7ED] hover:bg-[#FDBA74]/30 text-[#EA580C] text-xs font-bold border border-[#FDBA74] transition-colors cursor-pointer"
                        title="Bagikan Prestasi Ini"
                      >
                        <Share2 className="w-3.5 h-3.5 text-[#F97316]" />
                        <span>Bagikan</span>
                      </button>
                    ) : (
                      <span className="text-[11px] font-bold text-[#854D0E] uppercase tracking-wider flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-[#F4B942]" />
                        Pencapaian Sah
                      </span>
                    )}
                    <button
                      onClick={() => handleReadDetail(item)}
                      className="inline-flex items-center gap-1.5 text-xs font-black text-[#EA580C] group-hover:text-[#F97316] hover:underline cursor-pointer"
                    >
                      Baca Selengkapnya
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 px-6 bg-white rounded-3xl border border-[#E2E8F0] max-w-2xl mx-auto space-y-4 shadow-xs">
            <div className="w-16 h-16 rounded-2xl bg-[#FEF9C3] text-[#854D0E] flex items-center justify-center mx-auto border border-[#F4B942]">
              <Trophy className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-black text-[#193B63]">
              Belum Ada Prestasi yang Ditampilkan
            </h3>
            <p className="text-sm text-[#486581] leading-relaxed max-w-md mx-auto">
              Saat berita baru diterbitkan dengan kategori <span className="text-[#EA580C] font-bold">"Prestasi Warga Belajar"</span>, foto dan rincian prestasinya akan langsung otomatis tampil di bagian ini dan galeri kegiatan.
            </p>
            {onOpenAdmin && (
              <div className="pt-2">
                <button
                  onClick={onOpenAdmin}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white font-black text-xs shadow-xs transition-all cursor-pointer border border-[#FDBA74]/50"
                >
                  <PlusCircle className="w-4 h-4" />
                  Tambah Berita Prestasi (Admin)
                </button>
              </div>
            )}
          </div>
        )}

      </div>
    </section>
  );
};
