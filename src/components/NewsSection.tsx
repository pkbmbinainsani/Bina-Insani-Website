import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Newspaper,
  Calendar,
  Clock,
  User,
  ArrowRight,
  Search,
  X,
  Share2,
  Tag,
  BookOpen,
  PlusCircle,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Check,
  Maximize2
} from 'lucide-react';
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
  const [lightboxImage, setLightboxImage] = useState<{ url: string; title: string } | null>(null);

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
    <section id="berita" className="pt-4 sm:pt-6 pb-16 bg-slate-50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Compact Admin Action Bar (if applicable) */}
        {onOpenAdmin && (
          <div className="mb-3 flex items-center justify-between p-2 sm:px-3 rounded-xl bg-orange-100/60 border border-orange-300/40 text-xs">
            <div className="flex items-center gap-2 text-stone-700 font-semibold">
              <Newspaper className="w-3.5 h-3.5 text-orange-600" />
              <span>Kanal Berita & Pengumuman Resmi • Total {filteredNews.length} Artikel</span>
            </div>
            <button
              onClick={onOpenAdmin}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-white font-extrabold text-[11px] shadow-sm transition-all cursor-pointer border border-orange-300/40"
            >
              <PlusCircle className="w-3.5 h-3.5 text-white" />
              <span>{isAdminAuthenticated ? 'Posting Berita Baru' : 'Kelola Berita (Admin)'}</span>
            </button>
          </div>
        )}

        {/* Filter and Search Bar (Compact & Space-Efficient) */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-2.5 mb-5 bg-white p-2.5 sm:px-3 sm:py-2 rounded-xl border border-stone-200 shadow-xs">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
            {availableCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-xs'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-60">
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari berita..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-7 py-1.5 rounded-lg text-xs bg-stone-50 border border-stone-200 focus:outline-none focus:border-orange-500 focus:bg-white text-slate-800"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* 1. Satu Berita Terbaru: Ketika Diklik Lanjutkan Membaca, Foto Besar Berpindah Ke Bagian Atas Teks Berita */}
        {latestArticle && (() => {
          const isLatestExpanded = !!expandedArticles[latestArticle.id];

          return isLatestExpanded ? (
            /* ================= MODE DIBACA LENGKAP: FOTO BESAR DI ATAS TEKS BERITA ================= */
            <motion.article
              key={`expanded-${latestArticle.id}`}
              layout
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="mb-14 bg-white rounded-3xl border-2 border-orange-400 ring-4 ring-orange-400/15 overflow-hidden shadow-xl"
            >
              {/* FOTO BESAR BERPINDAH KE BAGIAN ATAS TEKS BERITA (TIDAK TERPOTONG) */}
              <div className="relative w-full h-72 sm:h-96 md:h-[460px] lg:h-[520px] bg-stone-950 overflow-hidden flex items-center justify-center group">
                {/* Ambient blurred backdrop untuk estetika latar yang serasi tanpa ruang hampa */}
                <img
                  src={latestArticle.image}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-40 scale-125 pointer-events-none"
                />
                
                {/* Foto Tajam Utuh 100% Tanpa Terpotong */}
                <img
                  src={latestArticle.image}
                  alt={latestArticle.title}
                  className="relative z-10 w-full h-full max-h-[520px] object-contain drop-shadow-2xl cursor-zoom-in"
                  onClick={() => setLightboxImage({ url: latestArticle.image, title: latestArticle.title })}
                  title="Klik untuk melihat foto resolusi penuh"
                />

                {/* Badges di atas foto */}
                <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2 z-20">
                  <span className="px-3 py-1.5 rounded-xl text-xs font-black bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    Berita Utama
                  </span>
                  <span className="px-2.5 py-1.5 rounded-xl text-xs font-extrabold bg-stone-900/90 backdrop-blur-md text-white border border-stone-700 shadow-md">
                    {latestArticle.category}
                  </span>
                  <span className="hidden sm:inline-flex px-2.5 py-1.5 rounded-xl text-[11px] font-bold bg-black/75 text-amber-300 border border-amber-400/30 backdrop-blur-md">
                    Foto Utuh • Tidak Terpotong
                  </span>
                </div>

                {/* Tombol Perbesar Foto */}
                <button
                  onClick={() => setLightboxImage({ url: latestArticle.image, title: latestArticle.title })}
                  className="absolute bottom-4 right-4 z-20 px-3.5 py-2 rounded-xl bg-stone-950/85 hover:bg-stone-900 text-white text-xs font-bold flex items-center gap-2 border border-stone-700 shadow-lg cursor-pointer transition-all hover:scale-105 active:scale-95"
                >
                  <Maximize2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>Lihat Foto Penuh</span>
                </button>
              </div>

              {/* KONTEN TEKS BERITA DI BAWAH FOTO BESAR */}
              <div className="p-6 sm:p-10 lg:p-12 space-y-6">
                {/* Meta Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-stone-200 text-stone-500 text-xs sm:text-sm">
                  <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                    <span className="flex items-center gap-1.5 font-semibold text-slate-700">
                      <Calendar className="w-4 h-4 text-orange-600" />
                      {latestArticle.date}
                    </span>
                    <span className="text-stone-300">•</span>
                    <span className="flex items-center gap-1.5 font-semibold text-slate-700">
                      <Clock className="w-4 h-4 text-orange-600" />
                      {latestArticle.readTime}
                    </span>
                    <span className="text-stone-300">•</span>
                    <span className="flex items-center gap-1.5 font-semibold text-slate-700">
                      <User className="w-4 h-4 text-orange-600" />
                      {latestArticle.author}
                    </span>
                  </div>

                  <button
                    onClick={() => handleShareArticle(latestArticle)}
                    className="inline-flex items-center gap-1.5 text-xs text-stone-600 hover:text-orange-600 font-bold transition-colors cursor-pointer"
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

                {/* Judul Berita Penuh */}
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 leading-tight tracking-tight">
                  {latestArticle.title}
                </h2>

                {/* Kotak Ringkasan / Lead Paragraph */}
                <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-orange-50 via-amber-50/60 to-orange-50/30 border-l-4 border-orange-500 shadow-xs">
                  <p className="text-sm sm:text-base md:text-lg font-semibold text-slate-800 leading-relaxed">
                    {latestArticle.summary}
                  </p>
                </div>

                {/* Paragraf-paragraf Berita Lengkap */}
                <div className="space-y-4 text-stone-700 text-sm sm:text-base leading-relaxed pt-2">
                  {latestArticle.content && latestArticle.content.length > 0 ? (
                    latestArticle.content.map((paragraph, pIdx) => (
                      <p key={pIdx} className="leading-relaxed font-normal text-stone-800">
                        {paragraph}
                      </p>
                    ))
                  ) : (
                    <p className="text-stone-800">{latestArticle.summary}</p>
                  )}
                </div>

                {/* Tagar Berita */}
                {latestArticle.tags && latestArticle.tags.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-stone-200">
                    <Tag className="w-3.5 h-3.5 text-orange-500" />
                    {latestArticle.tags.map((tag, tIdx) => (
                      <span key={tIdx} className="px-2.5 py-1 bg-stone-100 text-stone-600 rounded-lg text-xs font-semibold">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Tombol Tutup Bacaan & Navigasi Bawah */}
                <div className="pt-6 border-t border-stone-200 flex flex-wrap items-center justify-between gap-3">
                  <button
                    onClick={() => toggleArticleExpand(latestArticle.id)}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-extrabold text-xs sm:text-sm bg-stone-900 text-white hover:bg-stone-800 transition-all cursor-pointer shadow-md hover:scale-105 active:scale-95"
                  >
                    <ChevronUp className="w-4 h-4 text-amber-400" />
                    <span>Tutup Bacaan</span>
                  </button>

                  <span className="text-xs text-stone-500 font-medium">
                    Kanal Publikasi Resmi PKBM Bina Insani Sumowono
                  </span>
                </div>
              </div>
            </motion.article>
          ) : (
            /* ================= MODE RINGKAS / PREVIEW ================= */
            <motion.article
              key={`collapsed-${latestArticle.id}`}
              layout
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="mb-14 bg-white rounded-3xl border border-stone-200 hover:border-orange-300 transition-all duration-300 overflow-hidden shadow-sm hover:shadow-xl"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                {/* Kolom Gambar Berita Terbaru (Tidak Terpotong Dengan Ambient Blur) */}
                <div
                  onClick={() => toggleArticleExpand(latestArticle.id)}
                  className="lg:col-span-5 relative h-64 sm:h-80 lg:min-h-[340px] overflow-hidden bg-stone-950 cursor-pointer group flex items-center justify-center"
                >
                  {/* Ambient background blur */}
                  <img
                    src={latestArticle.image}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover blur-xl opacity-35 scale-125 pointer-events-none"
                  />
                  {/* Sharp uncropped foreground image */}
                  <img
                    src={latestArticle.image}
                    alt={latestArticle.title}
                    className="relative z-10 w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                  />
                  
                  {/* Badge Unggulan & Kategori */}
                  <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2 z-20">
                    <span className="px-3 py-1 rounded-xl text-xs font-black bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      Berita Terbaru
                    </span>
                    <span className="px-2.5 py-1 rounded-xl text-xs font-extrabold bg-stone-900/80 backdrop-blur-sm text-white shadow-md">
                      {latestArticle.category}
                    </span>
                  </div>

                  {/* Hover Prompt */}
                  <div className="absolute bottom-3 right-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="px-2.5 py-1 rounded-lg bg-black/80 text-amber-300 text-[11px] font-bold backdrop-blur-sm flex items-center gap-1">
                      <BookOpen className="w-3 h-3" />
                      Klik Lanjutkan Membaca
                    </span>
                  </div>
                </div>

                {/* Kolom Teks Ringkas */}
                <div className="lg:col-span-7 p-6 sm:p-8 lg:p-9 flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
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
                    <p className="text-sm sm:text-base leading-relaxed font-medium text-slate-800 line-clamp-3">
                      {latestArticle.summary}
                    </p>
                  </div>

                  {/* Bagian Tombol Lanjutkan Membaca */}
                  <div className="pt-4 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3">
                    <button
                      onClick={() => toggleArticleExpand(latestArticle.id)}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-sm shadow-orange-950/20 transition-all cursor-pointer hover:scale-105 active:scale-95"
                    >
                      <span>Lanjutkan Membaca</span>
                      <ArrowRight className="w-4 h-4" />
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
          );
        })()}

        {/* 2. Berita-Berita Terdahulu: Foto Tidak Terpotong & Foto Besar Berpindah Ke Atas Teks Saat Dibentangkan */}
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

            {/* Grid Berita Terdahulu (Ketika dibentangkan, merentang lebar dengan foto di atas teks) */}
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
                      isExpanded
                        ? 'border-2 border-orange-400 ring-4 ring-orange-400/15 md:col-span-2 lg:col-span-3'
                        : 'border-stone-200 hover:border-orange-300'
                    }`}
                  >
                    <div>
                      {/* Foto Tidak Terpotong (Bila Lanjutkan Membaca diklik, foto besar berada di bagian atas teks berita) */}
                      <div
                        onClick={() => {
                          if (isExpanded) {
                            setLightboxImage({ url: article.image, title: article.title });
                          } else {
                            toggleArticleExpand(article.id);
                          }
                        }}
                        className={`relative ${
                          isExpanded ? 'h-72 sm:h-96 md:h-[440px]' : 'h-52 sm:h-56'
                        } bg-stone-950 overflow-hidden cursor-pointer group flex items-center justify-center`}
                      >
                        {/* Ambient background blur */}
                        <img
                          src={article.image}
                          alt=""
                          className="absolute inset-0 w-full h-full object-cover blur-xl opacity-35 scale-125 pointer-events-none"
                        />
                        {/* Sharp uncropped foreground photo */}
                        <img
                          src={article.image}
                          alt={article.title}
                          className={`relative z-10 w-full h-full object-contain ${
                            !isExpanded ? 'group-hover:scale-105 transition-transform duration-500' : 'cursor-zoom-in'
                          }`}
                        />
                        
                        <div className="absolute top-3 left-3 flex items-center gap-2 z-20">
                          <span className="px-2.5 py-1 rounded-lg text-[10px] font-extrabold bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-sm">
                            {article.category}
                          </span>
                          {isExpanded && (
                            <span className="hidden sm:inline-flex px-2 py-0.5 rounded-md text-[10px] font-bold bg-black/70 text-amber-300 border border-amber-400/30">
                              Foto Utuh
                            </span>
                          )}
                        </div>

                        {isExpanded && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setLightboxImage({ url: article.image, title: article.title });
                            }}
                            className="absolute bottom-3 right-3 z-20 px-2.5 py-1 rounded-lg bg-black/80 hover:bg-black text-white text-[11px] font-bold flex items-center gap-1 border border-stone-700 shadow-md"
                          >
                            <Maximize2 className="w-3 h-3 text-amber-400" />
                            <span>Perbesar</span>
                          </button>
                        )}
                      </div>

                      {/* Konten Teks Berita di Bawah Foto */}
                      <div className={`p-6 ${isExpanded ? 'sm:p-8 space-y-4' : 'space-y-3'}`}>
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
                          className={`font-black text-slate-900 leading-snug cursor-pointer hover:text-orange-600 transition-colors ${
                            isExpanded ? 'text-xl sm:text-2xl md:text-3xl' : 'text-base sm:text-lg line-clamp-2'
                          }`}
                        >
                          {article.title}
                        </h3>

                        <p className={`text-stone-600 text-xs sm:text-sm leading-relaxed ${isExpanded ? 'font-medium text-slate-800' : 'line-clamp-3'}`}>
                          {article.summary}
                        </p>

                        {/* Paragraf Lengkap Saat Lanjutkan Membaca Aktif */}
                        <AnimatePresence>
                          {isExpanded && article.content && article.content.length > 0 && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.35, ease: 'easeInOut' }}
                              className="pt-4 mt-4 border-t border-stone-100 space-y-3.5 text-stone-800 text-sm sm:text-base leading-relaxed"
                            >
                              {article.content.map((p, pIdx) => (
                                <p key={pIdx} className="leading-relaxed font-normal text-stone-800">
                                  {p}
                                </p>
                              ))}

                              {/* Author meta & Share */}
                              <div className="pt-3 flex items-center justify-between text-xs text-stone-500 border-t border-stone-100">
                                <span>Penulis: <strong className="text-slate-700">{article.author}</strong></span>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleShareArticle(article);
                                  }}
                                  className="text-orange-600 hover:underline flex items-center gap-1 cursor-pointer font-bold"
                                >
                                  {copiedId === article.id ? (
                                    <>
                                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                                      <span className="text-emerald-600">Disalin!</span>
                                    </>
                                  ) : (
                                    <>
                                      <Share2 className="w-3.5 h-3.5" />
                                      <span>Bagikan</span>
                                    </>
                                  )}
                                </button>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>

                    {/* Card Footer Toggle Button */}
                    <div className={`px-6 pb-6 ${isExpanded ? 'pt-4 border-t border-stone-100' : 'pt-2'}`}>
                      <button
                        onClick={() => toggleArticleExpand(article.id)}
                        className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs border transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm ${
                          isExpanded
                            ? 'bg-stone-900 text-white border-stone-900 hover:bg-stone-800'
                            : 'bg-stone-50 hover:bg-orange-50 text-stone-700 hover:text-orange-700 border-stone-200 hover:border-orange-200'
                        }`}
                      >
                        <span>{isExpanded ? 'Tutup Bacaan' : 'Lanjutkan Membaca'}</span>
                        {isExpanded ? (
                          <ChevronUp className="w-3.5 h-3.5" />
                        ) : (
                          <ArrowRight className="w-3.5 h-3.5" />
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

      {/* Lightbox Modal: Menampilkan Foto Utuh Resolusi Tinggi Tanpa Terpotong */}
      <AnimatePresence>
        {lightboxImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col items-center justify-center p-4 sm:p-6"
            onClick={() => setLightboxImage(null)}
          >
            <button
              onClick={() => setLightboxImage(null)}
              className="absolute top-5 right-5 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer z-50"
              title="Tutup Pratinjau Foto"
            >
              <X className="w-6 h-6" />
            </button>

            <div
              className="relative max-w-5xl max-h-[88vh] flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={lightboxImage.url}
                alt={lightboxImage.title}
                className="max-w-full max-h-[75vh] object-contain rounded-2xl shadow-2xl border border-white/10"
              />
              <p className="mt-3 text-center text-white text-sm sm:text-base font-bold max-w-2xl px-4">
                {lightboxImage.title}
              </p>
              <span className="text-xs text-amber-300/90 mt-1 font-medium">
                Foto Dokumentasi Utuh • Resolusi Penuh Tanpa Terpotong
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
