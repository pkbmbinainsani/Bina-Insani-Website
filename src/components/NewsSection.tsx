import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Newspaper, Calendar, Clock, User, ArrowRight, Search, X, Share2, Tag, BookOpen, PlusCircle, ShieldCheck, Sparkles, ChevronDown, ChevronUp, Check } from 'lucide-react';
import { usePKBM } from '../context/PKBMContext';
import { NewsItem } from '../types';
import { sortNewsByDateDesc } from '../utils/dateHelper';

interface NewsSectionProps {
  onOpenAdmin?: () => void;
}

export const NewsSection: React.FC<NewsSectionProps> = ({ onOpenAdmin }) => {
  const { news, isAdminAuthenticated } = usePKBM();
  const [expandedArticles, setExpandedArticles] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');

  // Toggle expand in place
  const toggleArticleExpand = (articleId: string) => {
    setExpandedArticles((prev) => ({
      ...prev,
      [articleId]: !prev[articleId],
    }));
  };

  const handleShareArticle = (article: NewsItem) => {
    const url = `${window.location.origin}${window.location.pathname}#berita`;
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.summary,
        url,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(`${article.title}\n\n${article.summary}\n${url}`);
      setCopiedId(article.id);
      setTimeout(() => setCopiedId(null), 2500);
    }
  };

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

        {/* 1. Satu Berita Terbaru: Membentang Ke Bawah Saat Diklik Baca Selengkapnya */}
        {latestArticle && (
          <motion.article
            layout
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className={`mb-14 bg-white rounded-3xl border transition-all duration-300 overflow-hidden shadow-sm hover:shadow-xl ${
              expandedArticles[latestArticle.id] ? 'border-orange-400 ring-2 ring-orange-400/20' : 'border-stone-200 hover:border-orange-300'
            }`}
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
              {/* Kolom Gambar Berita Terbaru */}
              <div
                onClick={() => toggleArticleExpand(latestArticle.id)}
                className="lg:col-span-5 relative h-64 sm:h-80 lg:h-full min-h-[260px] lg:min-h-[380px] overflow-hidden bg-stone-100 cursor-pointer group"
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

                  {/* Judul Berita */}
                  <h3
                    onClick={() => toggleArticleExpand(latestArticle.id)}
                    className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 hover:text-orange-600 transition-colors leading-snug cursor-pointer"
                  >
                    {latestArticle.title}
                  </h3>

                  {/* Isi Ringkasan Berita */}
                  <div className="space-y-3 text-stone-700">
                    <p className="text-sm sm:text-base leading-relaxed font-medium text-slate-800">
                      {latestArticle.summary}
                    </p>

                    {/* Preview paragraf jika belum dibentangkan */}
                    {!expandedArticles[latestArticle.id] && latestArticle.content && latestArticle.content.length > 0 && latestArticle.content[0] !== latestArticle.summary && (
                      <p className="text-xs sm:text-sm text-stone-600 leading-relaxed line-clamp-2">
                        {latestArticle.content[0]}
                      </p>
                    )}
                  </div>

                  {/* Pembentangan Teks Berita Secara Luas Ke Bawah (Inline Expansion) */}
                  <AnimatePresence>
                    {expandedArticles[latestArticle.id] && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.35, ease: 'easeInOut' }}
                        className="pt-4 border-t border-stone-200 space-y-4 overflow-hidden"
                      >
                        <div className="space-y-3.5 text-stone-800 text-sm sm:text-base leading-relaxed">
                          {latestArticle.content && latestArticle.content.length > 0 ? (
                            latestArticle.content.map((paragraph, pIdx) => (
                              <p key={pIdx} className="leading-relaxed text-stone-700 font-normal">
                                {paragraph}
                              </p>
                            ))
                          ) : (
                            <p className="text-stone-700">{latestArticle.summary}</p>
                          )}
                        </div>

                        {/* Dokumentasi / Footer Metadata Tambahan */}
                        {latestArticle.tags && latestArticle.tags.length > 0 && (
                          <div className="flex flex-wrap items-center gap-2 pt-2">
                            <Tag className="w-3.5 h-3.5 text-orange-500" />
                            {latestArticle.tags.map((tag, tIdx) => (
                              <span key={tIdx} className="px-2.5 py-1 bg-stone-100 text-stone-600 rounded-lg text-xs font-semibold">
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Bagian Tombol Aksi Pembentang Berita (Tanpa Popup) */}
                <div className="pt-4 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3">
                  <button
                    onClick={() => toggleArticleExpand(latestArticle.id)}
                    className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer shadow-sm ${
                      expandedArticles[latestArticle.id]
                        ? 'bg-stone-900 text-white hover:bg-stone-800'
                        : 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-orange-950/20'
                    }`}
                  >
                    <span>{expandedArticles[latestArticle.id] ? 'Tutup / Perkecil Berita' : 'baca selengkapnya'}</span>
                    {expandedArticles[latestArticle.id] ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>

                  <button
                    onClick={() => handleShareArticle(latestArticle)}
                    className="inline-flex items-center gap-1.5 text-xs text-stone-500 hover:text-orange-600 font-medium transition-colors cursor-pointer"
                  >
                    {copiedId === latestArticle.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-600 font-bold">Tautan Disalin!</span>
                      </>
                    ) : (
                      <>
                        <Share2 className="w-3.5 h-3.5" />
                        <span>Bagikan Berita</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </motion.article>
        )}

        {/* 2. Berita-Berita Terdahulu: Teks Juga Membentang Luas Ke Bawah Saat Diklik */}
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

            {/* Grid Berita Terdahulu */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
              {previousNews.map((article, idx) => {
                const isExpanded = !!expandedArticles[article.id];

                return (
                  <motion.article
                    key={article.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: idx * 0.08 }}
                    className={`bg-white rounded-3xl border transition-all duration-300 overflow-hidden flex flex-col justify-between shadow-sm hover:shadow-xl ${
                      isExpanded ? 'border-orange-400 ring-2 ring-orange-400/20' : 'border-stone-200 hover:border-orange-300'
                    }`}
                  >
                    <div>
                      {/* Image Container */}
                      <div
                        onClick={() => toggleArticleExpand(article.id)}
                        className="relative h-48 overflow-hidden cursor-pointer group"
                      >
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

                        <h3
                          onClick={() => toggleArticleExpand(article.id)}
                          className={`font-extrabold text-slate-900 text-base sm:text-lg hover:text-orange-600 transition-colors leading-snug cursor-pointer ${
                            isExpanded ? '' : 'line-clamp-2'
                          }`}
                        >
                          {article.title}
                        </h3>

                        <p className={`text-stone-600 text-xs sm:text-sm leading-relaxed ${isExpanded ? '' : 'line-clamp-3'}`}>
                          {article.summary}
                        </p>

                        {/* Paragraf Lengkap Saat Dibentangkan */}
                        <AnimatePresence>
                          {isExpanded && article.content && article.content.length > 0 && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.35, ease: 'easeInOut' }}
                              className="pt-3 mt-3 border-t border-stone-100 space-y-2.5 text-stone-700 text-xs sm:text-sm leading-relaxed"
                            >
                              {article.content.map((p, pIdx) => (
                                <p key={pIdx} className="leading-relaxed">
                                  {p}
                                </p>
                              ))}

                              {/* Author meta */}
                              <div className="pt-2 flex items-center justify-between text-[11px] text-stone-500 border-t border-stone-100">
                                <span>Penulis: <strong>{article.author}</strong></span>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleShareArticle(article);
                                  }}
                                  className="text-orange-600 hover:underline flex items-center gap-1 cursor-pointer font-bold"
                                >
                                  <Share2 className="w-3 h-3" />
                                  <span>Bagikan</span>
                                </button>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>

                    {/* Card Footer Toggle Button (Membentang Tanpa Popup) */}
                    <div className="px-6 pb-6 pt-2">
                      <button
                        onClick={() => toggleArticleExpand(article.id)}
                        className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs border transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm ${
                          isExpanded
                            ? 'bg-stone-900 text-white border-stone-900 hover:bg-stone-800'
                            : 'bg-stone-50 hover:bg-orange-50 text-stone-700 hover:text-orange-700 border-stone-200 hover:border-orange-200'
                        }`}
                      >
                        <span>{isExpanded ? 'Tutup / Perkecil Berita' : 'baca selengkapnya'}</span>
                        {isExpanded ? (
                          <ChevronUp className="w-3.5 h-3.5" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </motion.article>
                );
              })}
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
    </section>
  );
};

