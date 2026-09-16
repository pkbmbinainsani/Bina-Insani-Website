import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Newspaper, Calendar, Clock, User, ArrowRight, Search, X, Share2, Tag, BookOpen, PlusCircle, ShieldCheck, Sparkles, ChevronRight } from 'lucide-react';
import { usePKBM } from '../context/PKBMContext';
import { NewsItem } from '../types';
import { sortNewsByDateDesc } from '../utils/dateHelper';

interface NewsSectionProps {
  onOpenAdmin?: () => void;
}

export const NewsSection: React.FC<NewsSectionProps> = ({ onOpenAdmin }) => {
  const { news, isAdminAuthenticated } = usePKBM();
  const [selectedArticle, setSelectedArticle] = useState<NewsItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');

  // Urutkan berita berdasarkan tanggal terbit terbaru di atas
  const sortedNews = useMemo(() => sortNewsByDateDesc(news), [news]);

  // Dynamic categories from current articles
  const availableCategories = ['Semua', ...Array.from(new Set(sortedNews.map((item) => item.category)))];

  const filteredNews = useMemo(() => {
    return sortedNews.filter((item) => {
      const matchesCategory = selectedCategory === 'Semua' || item.category === selectedCategory;
      const matchesQuery = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           item.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           item.author.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [sortedNews, selectedCategory, searchQuery]);

  // Separate the single latest news item and the previous news items
  const latestArticle = filteredNews.length > 0 ? filteredNews[0] : null;
  const previousNews = filteredNews.length > 1 ? filteredNews.slice(1) : [];

  // Check if an article is long and doesn't fit entirely in the preview
  const isArticleLong = (article: NewsItem) => {
    const wordCount = (article.summary + ' ' + (article.content ? article.content.join(' ') : '')).split(/\s+/).length;
    return wordCount > 45 || (article.content && article.content.length > 1) || article.summary.length > 200;
  };

  return (
    <section id="berita" className="py-20 bg-slate-50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-100 text-orange-900 text-xs font-extrabold uppercase tracking-wider">
            <Newspaper className="w-4 h-4 text-orange-600" />
            Kabar & Informasi Lembaga
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Berita Terkini <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-600">PKBM Bina Insani Sumowono</span>
          </h2>
          <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
            Ikuti informasi pendaftaran terbaru, pengumuman kegiatan akademik, serta dokumentasi program keterampilan warga belajar.
          </p>

          {/* Quick Admin Posting Shortcut */}
          {onOpenAdmin && (
            <div className="pt-2">
              <button
                onClick={onOpenAdmin}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-white font-extrabold text-xs shadow-md shadow-orange-950/20 transition-all cursor-pointer border border-orange-300/40"
              >
                <PlusCircle className="w-4 h-4 text-white" />
                <span>{isAdminAuthenticated ? 'Panel Admin: Posting Berita & Gambar' : 'Kelola Konten & Posting Berita (Admin)'}</span>
              </button>
            </div>
          )}
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10 bg-white p-4 rounded-2xl border border-stone-200 shadow-sm">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {availableCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-sm'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-64">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari berita..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-stone-50 border border-stone-200 focus:outline-none focus:border-orange-500 focus:bg-white text-slate-800"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* 1. Satu Berita Terbaru Dibuat Lebar agar Langsung Mudah Dibaca */}
        {latestArticle && (
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-14 bg-white rounded-3xl border border-stone-200 shadow-sm hover:shadow-xl hover:border-orange-300 transition-all duration-300 overflow-hidden group"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
              {/* Kolom Gambar Berita Terbaru */}
              <div
                onClick={() => setSelectedArticle(latestArticle)}
                className="lg:col-span-5 relative h-64 sm:h-80 lg:h-full min-h-[260px] lg:min-h-[400px] overflow-hidden bg-stone-100 cursor-pointer"
              >
                <img
                  src={latestArticle.image}
                  alt={latestArticle.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent lg:hidden" />
                
                {/* Badge Unggulan & Kategori */}
                <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2 z-10">
                  <span className="px-3 py-1 rounded-xl text-xs font-black bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    Berita Terbaru
                  </span>
                  <span className="px-2.5 py-1 rounded-xl text-xs font-extrabold bg-stone-900/80 backdrop-blur-sm text-white shadow-md">
                    {latestArticle.category}
                  </span>
                </div>
              </div>

              {/* Kolom Teks Konten Berita Lebar */}
              <div className="lg:col-span-7 p-6 sm:p-8 lg:p-10 flex flex-col justify-between space-y-4">
                <div className="space-y-4">
                  {/* Meta Bar */}
                  <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-stone-500 text-xs sm:text-sm">
                    <span className="flex items-center gap-1.5 font-medium">
                      <Calendar className="w-4 h-4 text-orange-600" />
                      {latestArticle.date}
                    </span>
                    <span className="text-stone-300">•</span>
                    <span className="flex items-center gap-1.5 font-medium">
                      <Clock className="w-4 h-4 text-orange-600" />
                      {latestArticle.readTime}
                    </span>
                    <span className="text-stone-300">•</span>
                    <span className="flex items-center gap-1.5 font-medium">
                      <User className="w-4 h-4 text-orange-600" />
                      {latestArticle.author}
                    </span>
                  </div>

                  {/* Judul Berita yang Jelas dan Mudah Dibaca */}
                  <h3
                    onClick={() => setSelectedArticle(latestArticle)}
                    className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 group-hover:text-orange-600 transition-colors leading-snug cursor-pointer"
                  >
                    {latestArticle.title}
                  </h3>

                  {/* Isi Berita Langsung Terbaca di Layar */}
                  <div className="space-y-3 text-stone-700">
                    <p className="text-sm sm:text-base leading-relaxed font-medium text-slate-800">
                      {latestArticle.summary}
                    </p>

                    {/* Paragraf pertama jika tersedia untuk memperjelas konteks berita */}
                    {latestArticle.content && latestArticle.content.length > 0 && latestArticle.content[0] !== latestArticle.summary && (
                      <p className="text-xs sm:text-sm text-stone-600 leading-relaxed line-clamp-3">
                        {latestArticle.content[0]}
                      </p>
                    )}
                  </div>
                </div>

                {/* Bagian Bawah: Teks / Tombol "baca selengkapnya" jika berita panjang / ada isi lengkap */}
                {isArticleLong(latestArticle) ? (
                  <div className="pt-4 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3">
                    <button
                      onClick={() => setSelectedArticle(latestArticle)}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs sm:text-sm shadow-md shadow-orange-950/20 transition-all cursor-pointer group/btn"
                    >
                      <span>baca selengkapnya</span>
                      <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </button>

                    <button
                      onClick={() => setSelectedArticle(latestArticle)}
                      className="text-xs text-stone-500 hover:text-orange-600 font-medium transition-colors cursor-pointer"
                    >
                      Buka artikel lengkap & dokumentasi foto →
                    </button>
                  </div>
                ) : (
                  <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                    <button
                      onClick={() => setSelectedArticle(latestArticle)}
                      className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-orange-600 hover:text-orange-700 transition-colors cursor-pointer"
                    >
                      <span>baca selengkapnya</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.article>
        )}

        {/* 2. Berita-Berita Terdahulu Tampak Sebagaimana Tampilan Berita Saat Ini */}
        {previousNews.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-stone-200 pb-4">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-orange-600" />
                <h3 className="text-lg sm:text-xl font-black text-slate-900">
                  Berita Terdahulu
                </h3>
              </div>
              <span className="text-xs font-bold text-stone-500 bg-stone-100 px-3 py-1 rounded-full">
                {previousNews.length} Berita Terdahulu
              </span>
            </div>

            {/* Grid 3 Kolom Berita Terdahulu */}
            <div className="grid md:grid-cols-3 gap-8">
              {previousNews.map((article, idx) => (
                <motion.article
                  key={article.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="bg-white rounded-3xl border border-stone-200 shadow-sm hover:shadow-xl hover:border-orange-300 transition-all duration-300 overflow-hidden flex flex-col justify-between group"
                >
                  <div>
                    {/* Image Container */}
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={article.image}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3">
                        <span className="px-2.5 py-1 rounded-lg text-[10px] font-extrabold bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-sm">
                          {article.category}
                        </span>
                      </div>
                    </div>

                    {/* Article Meta & Content */}
                    <div className="p-6 space-y-3">
                      <div className="flex items-center gap-3 text-stone-500 text-xs">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-orange-600" />
                          {article.date}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-orange-600" />
                          {article.readTime}
                        </span>
                      </div>

                      <h3 className="font-extrabold text-slate-900 text-base sm:text-lg group-hover:text-orange-600 transition-colors line-clamp-2 leading-snug">
                        {article.title}
                      </h3>

                      <p className="text-stone-600 text-xs line-clamp-3 leading-relaxed">
                        {article.summary}
                      </p>
                    </div>
                  </div>

                  {/* Card Footer Read Button */}
                  <div className="px-6 pb-6 pt-2">
                    <button
                      onClick={() => setSelectedArticle(article)}
                      className="w-full py-2.5 px-4 rounded-xl bg-stone-50 hover:bg-orange-50 text-stone-700 hover:text-orange-700 font-bold text-xs border border-stone-200 hover:border-orange-200 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>baca selengkapnya</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        )}

        {filteredNews.length === 0 && (
          <div className="text-center py-16 px-4 bg-white rounded-3xl border border-stone-200 shadow-sm max-w-xl mx-auto space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-700 flex items-center justify-center mx-auto">
              <Newspaper className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-800">
              {news.length === 0 ? 'Belum Ada Berita yang Dipublikasikan' : 'Tidak ada berita yang sesuai dengan pencarian Anda'}
            </h3>
            <p className="text-stone-500 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
              {news.length === 0
                ? 'Pengumuman resmi, agenda kegiatan, dan kabar terbaru PKBM Bina Insani Sumowono akan ditampilkan di sini.'
                : 'Coba ubah kata kunci pencarian atau pilih kategori berita lainnya.'}
            </p>
          </div>
        )}

      </div>

      {/* Full Article Modal Reader */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-stone-200 relative p-6 sm:p-10"
          >
            <button
              onClick={() => setSelectedArticle(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs">
                  <span className="px-2.5 py-0.5 rounded-md bg-orange-100 text-orange-900 font-bold">
                    {selectedArticle.category}
                  </span>
                  <span className="text-stone-400">•</span>
                  <span className="text-stone-500 font-medium">{selectedArticle.date}</span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
                  {selectedArticle.title}
                </h2>

                <div className="flex items-center gap-2 text-xs text-stone-500 pt-1">
                  <User className="w-3.5 h-3.5 text-orange-600" />
                  <span>Penulis: {selectedArticle.author}</span>
                  <span>•</span>
                  <span>Estimasi baca: {selectedArticle.readTime}</span>
                </div>
              </div>

              {/* Main Image */}
              <div className="rounded-2xl overflow-hidden h-64 sm:h-80 border border-stone-200">
                <img
                  src={selectedArticle.image}
                  alt={selectedArticle.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Full Paragraphs */}
              <div className="space-y-4 text-stone-700 text-sm sm:text-base leading-relaxed">
                {selectedArticle.content.map((paragraph, pIdx) => (
                  <p key={pIdx}>{paragraph}</p>
                ))}
              </div>

              {/* Share and Close */}
              <div className="pt-6 border-t border-stone-200 flex items-center justify-between">
                <button
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: selectedArticle.title,
                        text: selectedArticle.summary,
                        url: window.location.href,
                      }).catch(() => {});
                    } else {
                      navigator.clipboard.writeText(window.location.href);
                      alert('Tautan berita berhasil disalin!');
                    }
                  }}
                  className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  Bagikan Berita
                </button>

                <button
                  onClick={() => setSelectedArticle(null)}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-white text-xs font-bold shadow-md shadow-orange-950/20 transition-colors cursor-pointer"
                >
                  Tutup Berita
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

    </section>
  );
};

