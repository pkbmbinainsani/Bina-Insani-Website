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

        {/* Showcase Tampilan Split 2 Kolom Sesuai Gambar Layout */}
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
              theme="dark"
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
                className={`group bg-gradient-to-b from-stone-900/90 to-[#0f0e0d]/90 rounded-3xl overflow-hidden border-2 shadow-2xl transition-all duration-300 flex flex-col justify-between cursor-pointer ${
                  activeArticleModal?.id === item.id
                    ? 'border-amber-400 ring-2 ring-amber-400/50 shadow-amber-500/30'
                    : 'border-amber-500/30 hover:border-amber-400 hover:shadow-amber-500/20'
                }`}
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
    </section>
  );
};
