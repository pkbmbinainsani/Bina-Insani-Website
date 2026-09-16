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

interface PrestasiSectionProps {
  onOpenAdmin?: () => void;
  onOpenNewsReader?: (article: NewsItem) => void;
}

export const PrestasiSection: React.FC<PrestasiSectionProps> = ({ onOpenAdmin, onOpenNewsReader }) => {
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

  const handleReadDetail = (item: NewsItem) => {
    if (onOpenNewsReader) {
      onOpenNewsReader(item);
    } else {
      setActiveArticleModal(item);
    }
  };

  return (
    <section id="prestasi" className="py-20 sm:py-24 bg-gradient-to-b from-stone-950 via-[#141210] to-[#0c0a09] text-white relative overflow-hidden">
      {/* Decorative Glow Elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Bagian Prestasi */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-400/40 text-amber-300 text-xs sm:text-sm font-black uppercase tracking-widest shadow-lg backdrop-blur-md">
            <Trophy className="w-4 h-4 text-amber-400 animate-bounce" />
            Prestasi & Rekam Jejak Unggulan
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Prestasi Warga Belajar{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-400 to-yellow-300">
              {pkbmInfo.name || 'PKBM Bina Insani'}
            </span>
          </h2>

          <p className="text-stone-300 text-sm sm:text-base leading-relaxed font-medium">
            Apresiasi dan bukti nyata dedikasi para peserta didik kesetaraan Paket A, B, C, serta pelatihan vokasi wirausaha yang berhasil menorehkan pencapaian membanggakan.
          </p>

          {/* Institutional Highlight Strip */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs text-amber-200/90 font-semibold">
            <span className="flex items-center gap-1.5 bg-stone-900/80 px-3.5 py-1.5 rounded-full border border-amber-500/30">
              <Medal className="w-3.5 h-3.5 text-amber-400" />
              Juara Vokasi & Keterampilan
            </span>
            <span className="flex items-center gap-1.5 bg-stone-900/80 px-3.5 py-1.5 rounded-full border border-amber-500/30">
              <GraduationCap className="w-3.5 h-3.5 text-amber-400" />
              Kelulusan & Lanjut Kuliah PTN/PTS
            </span>
            <span className="flex items-center gap-1.5 bg-stone-900/80 px-3.5 py-1.5 rounded-full border border-amber-500/30">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Kemandirian Wirausaha Desa
            </span>
          </div>
        </div>

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
                className="group bg-gradient-to-b from-stone-900/90 to-[#0f0e0d]/90 rounded-3xl overflow-hidden border-2 border-amber-500/30 hover:border-amber-400 shadow-2xl hover:shadow-amber-500/20 transition-all duration-300 flex flex-col justify-between"
              >
                {/* Image Section with Trophy Badge */}
                <div className="relative h-56 sm:h-64 overflow-hidden bg-stone-950">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-amber-500/40 bg-stone-900">
                      <Trophy className="w-16 h-16 mb-2" />
                      <span className="text-xs font-bold text-stone-500">Dokumentasi Prestasi</span>
                    </div>
                  )}

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0f0e0d] via-transparent to-black/40" />

                  {/* Top Badge: Prestasi Ribbon */}
                  <div className="absolute top-3 left-3">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-gradient-to-r from-amber-500 to-orange-500 text-stone-950 shadow-lg border border-amber-200">
                      <Award className="w-3.5 h-3.5" />
                      Prestasi Warga Belajar
                    </span>
                  </div>

                  {/* Date & Author on Image */}
                  <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs text-stone-300">
                    <span className="flex items-center gap-1.5 text-amber-300 font-semibold bg-stone-950/70 px-2.5 py-1 rounded-lg backdrop-blur-sm border border-stone-800">
                      <Calendar className="w-3.5 h-3.5 text-amber-400" />
                      {item.date}
                    </span>
                    {item.author && (
                      <span className="flex items-center gap-1 text-[11px] text-stone-300 bg-stone-950/70 px-2.5 py-1 rounded-lg backdrop-blur-sm border border-stone-800">
                        <User className="w-3 h-3 text-orange-400" />
                        {item.author}
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <h3 className="text-lg sm:text-xl font-black text-white group-hover:text-amber-300 transition-colors leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-stone-300 text-xs sm:text-sm leading-relaxed line-clamp-3 font-medium">
                      {item.summary}
                    </p>
                  </div>

                  {/* Card Bottom CTA */}
                  <div className="pt-4 border-t border-stone-800/80 flex items-center justify-between">
                    <span className="text-[11px] font-bold text-amber-400/90 uppercase tracking-wider flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      Pencapaian Sah
                    </span>
                    <button
                      onClick={() => handleReadDetail(item)}
                      className="inline-flex items-center gap-1.5 text-xs font-black text-amber-300 group-hover:text-orange-300 hover:underline cursor-pointer"
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
          /* Empty state if no news item is currently marked as prestasi */
          <div className="text-center py-16 px-6 bg-stone-900/60 rounded-3xl border border-amber-500/20 max-w-2xl mx-auto space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto border border-amber-500/30">
              <Trophy className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-black text-white">
              Belum Ada Prestasi yang Ditampilkan
            </h3>
            <p className="text-sm text-stone-300 leading-relaxed max-w-md mx-auto">
              Saat berita baru diterbitkan dengan kategori <span className="text-amber-300 font-bold">"Prestasi Warga Belajar"</span>, foto dan rincian prestasinya akan langsung otomatis tampil di bagian ini dan galeri kegiatan.
            </p>
            {onOpenAdmin && (
              <div className="pt-2">
                <button
                  onClick={onOpenAdmin}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-stone-950 font-black text-xs shadow-lg transition-all cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4" />
                  Tambah Berita Prestasi (Admin)
                </button>
              </div>
            )}
          </div>
        )}

      </div>

      {/* Reader Modal for Prestasi Articles */}
      <AnimatePresence>
        {activeArticleModal && (
          <div className="fixed inset-0 z-60 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white text-slate-900 w-full max-w-3xl max-h-[92vh] rounded-3xl shadow-2xl border border-amber-200 overflow-y-auto p-6 sm:p-8 relative space-y-6"
            >
              {/* Close Button */}
              <button
                onClick={() => setActiveArticleModal(null)}
                className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer z-20"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Modal Header */}
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300">
                    <Trophy className="w-3.5 h-3.5 text-amber-600" />
                    Prestasi Warga Belajar
                  </span>
                  <span className="text-xs text-slate-500 font-semibold flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-orange-500" />
                    {activeArticleModal.date}
                  </span>
                  {activeArticleModal.author && (
                    <span className="text-xs text-slate-500 font-semibold flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-orange-500" />
                      {activeArticleModal.author}
                    </span>
                  )}
                </div>

                <h3 className="text-2xl sm:text-3xl font-black text-slate-950 leading-tight">
                  {activeArticleModal.title}
                </h3>
              </div>

              {/* Photo Showcase */}
              {activeArticleModal.image && (
                <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-950 max-h-96">
                  <img
                    src={activeArticleModal.image}
                    alt={activeArticleModal.title}
                    className="w-full h-full max-h-96 object-contain mx-auto"
                  />
                </div>
              )}

              {/* Summary Callout */}
              <div className="p-4 rounded-2xl bg-amber-50 border-l-4 border-amber-500 text-amber-950 text-sm font-semibold leading-relaxed">
                {activeArticleModal.summary}
              </div>

              {/* Article Paragraphs */}
              <div className="space-y-4 text-slate-700 text-sm sm:text-base leading-relaxed">
                {activeArticleModal.content && activeArticleModal.content.length > 0 ? (
                  activeArticleModal.content.map((paragraph, pIdx) => (
                    <p key={pIdx}>{paragraph}</p>
                  ))
                ) : (
                  <p>{activeArticleModal.summary}</p>
                )}
              </div>

              {/* Footer Modal */}
              <div className="pt-6 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                  <BookmarkCheck className="w-4 h-4 text-emerald-600" />
                  <span>Terdokumentasi Resmi di Portal PKBM Bina Insani</span>
                </div>
                <button
                  onClick={() => setActiveArticleModal(null)}
                  className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs transition-colors cursor-pointer"
                >
                  Tutup Rincian
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
