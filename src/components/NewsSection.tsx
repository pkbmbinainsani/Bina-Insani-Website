import React, { useState, useMemo, useEffect, useCallback } from 'react';
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
  ChevronUp,
  Check,
  Maximize2
} from 'lucide-react';
import { usePKBM } from '../context/PKBMContext';
import { NewsItem } from '../types';
import { sortNewsByDateDesc } from '../utils/dateHelper';

interface NewsSectionProps {
  onOpenAdmin?: () => void;
  onShareCustom?: (data: { title: string; description: string; hash: string; category?: string; image?: string }) => void;
}

export const NewsSection: React.FC<NewsSectionProps> = ({ onOpenAdmin, onShareCustom }) => {
  const { news, isAdminAuthenticated } = usePKBM();
  // activeReadingId: Menyimpan ID artikel yang sedang dibaca secara penuh di bagian atas
  const [activeReadingId, setActiveReadingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [lightboxImage, setLightboxImage] = useState<{ url: string; title: string } | null>(null);

  // Urutkan berita berdasarkan tanggal terbit terbaru di atas
  const sortedNews = useMemo(() => sortNewsByDateDesc(news), [news]);

  // Dynamic categories from current articles
  const availableCategories = ['Semua', ...Array.from(new Set(sortedNews.map((item) => item.category)))];

  const filteredNews = useMemo(() => {
    return sortedNews.filter((item) => {
      const matchesCategory = selectedCategory === 'Semua' || item.category === selectedCategory;
      const matchesQuery =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.author.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [sortedNews, selectedCategory, searchQuery]);

  // Berita terbaru default (artikel pertama secara kronologis terbaru)
  const defaultLatestArticle = filteredNews.length > 0 ? filteredNews[0] : null;

  // Artikel yang sedang aktif dibaca penuh
  const activeReadingArticle = activeReadingId
    ? sortedNews.find((n) => n.id === activeReadingId) || null
    : null;

  // Artikel yang ditampilkan di area pembaca atas:
  // Jika ada berita yang diklik "Baca Selengkapnya", berita tersebut langsung ditampilkan di atas seperti berita terbaru
  const topArticle = activeReadingArticle || defaultLatestArticle;
  const isTopArticleExpanded = !!activeReadingArticle;
  const isReadingOlderArticle = !!(
    activeReadingArticle &&
    defaultLatestArticle &&
    activeReadingArticle.id !== defaultLatestArticle.id
  );

  // Artikel untuk daftar kartu di bawah:
  // Ketika berita lama sedang dibaca di bagian atas, tampilkan seluruh filteredNews agar berita terbaru tetap dapat diakses,
  // dan kartu berita yang sedang dibaca memiliki tanda visual serta tombol ciutkan.
  // Jika dalam kondisi normal, tampilkan filteredNews.slice(1).
  const listArticles = isReadingOlderArticle ? filteredNews : filteredNews.length > 1 ? filteredNews.slice(1) : [];

  // Handler buka berita lengkap di bagian atas
  const handleOpenArticle = useCallback((articleId: string) => {
    setActiveReadingId(articleId);
    const directHash = `#berita?id=${encodeURIComponent(articleId)}`;
    if (window.location.hash !== directHash) {
      history.replaceState(null, '', directHash);
    }
    // Scroll mulus langsung ke area pembaca berita di bagian atas
    setTimeout(() => {
      const readerEl = document.getElementById('berita-top-reader');
      if (readerEl) {
        readerEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 60);
  }, []);

  // Handler ciutkan berita: mengembalikan tampilan ke semula dan scroll mulus kembali ke posisi kartu semula
  const handleCollapseArticle = useCallback((articleId: string) => {
    setActiveReadingId(null);
    if (window.location.hash.includes('berita?')) {
      history.replaceState(null, '', '#berita');
    }
    // Scroll kembali ke posisi kartu berita semula di daftar
    setTimeout(() => {
      const targetCard = document.getElementById(`berita-card-${articleId}`);
      if (targetCard) {
        targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        const topEl = document.getElementById('berita-top-reader');
        if (topEl) {
          topEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    }, 80);
  }, []);

  // Deep-linking: Deteksi jika URL mengandung ID berita spesifik (#berita?id=...)
  useEffect(() => {
    const parseTargetNews = () => {
      if (typeof window === 'undefined') return null;
      const hash = window.location.hash || '';
      if (hash.includes('berita')) {
        const qIndex = hash.indexOf('?');
        if (qIndex !== -1) {
          const params = new URLSearchParams(hash.slice(qIndex + 1));
          const id = params.get('id') || params.get('berita');
          if (id) return decodeURIComponent(id).trim();
        }
      }
      const searchParams = new URLSearchParams(window.location.search);
      const searchId = searchParams.get('berita') || searchParams.get('newsId');
      if (searchId) return decodeURIComponent(searchId).trim();
      return null;
    };

    const targetId = parseTargetNews();
    if (targetId && sortedNews.some((n) => n.id === targetId)) {
      setActiveReadingId(targetId);
      setTimeout(() => {
        const el = document.getElementById('berita-top-reader');
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 200);
    }
  }, [sortedNews]);

  // Bagikan berita
  const handleShareArticle = useCallback(
    (article: NewsItem) => {
      const directHash = `#berita?id=${encodeURIComponent(article.id)}`;
      if (onShareCustom) {
        onShareCustom({
          title: article.title,
          description: article.summary,
          hash: directHash,
          category: article.category,
          image: article.image
        });
        return;
      }
      const url = `${window.location.origin}${window.location.pathname}${directHash}`;
      if (navigator.share) {
        navigator.share({
          title: article.title,
          text: article.summary,
          url
        }).catch(() => {});
      } else {
        navigator.clipboard.writeText(`${article.title}\n\n${article.summary}\n${url}`);
        setCopiedId(article.id);
        setTimeout(() => setCopiedId(null), 2500);
      }
    },
    [onShareCustom]
  );

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

        {/* 1. AREA PEMBACA ATAS: Menampilkan Berita yang Sedang Dibaca (atau Berita Terbaru Default) */}
        <div id="berita-top-reader" className="scroll-mt-24">
          {topArticle && (() => {
            return isTopArticleExpanded ? (
              /* ================= MODE DIBACA LENGKAP DI BAGIAN ATAS ================= */
              <div className="mb-12">
                {/* Banner Status Jika Berita yang Dibaca Adalah Berita Lama / Bukan Berita Terbaru Default */}
                {isReadingOlderArticle && (
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 p-3 sm:px-4 rounded-2xl bg-gradient-to-r from-orange-600 via-amber-600 to-orange-600 text-white shadow-md mb-4 animate-in fade-in duration-300">
                    <div className="flex items-center gap-2.5 text-xs sm:text-sm font-bold min-w-0">
                      <span className="relative flex h-2.5 w-2.5 shrink-0">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-200 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-300"></span>
                      </span>
                      <BookOpen className="w-4 h-4 text-amber-200 shrink-0" />
                      <span className="truncate">
                        Menampilkan Berita: <strong className="text-white">{topArticle.title}</strong>
                      </span>
                    </div>
                    <button
                      onClick={() => handleCollapseArticle(topArticle.id)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-stone-950/85 hover:bg-stone-950 text-amber-300 hover:text-white font-extrabold text-xs transition-all cursor-pointer shadow border border-amber-400/40 hover:scale-105 active:scale-95 shrink-0"
                    >
                      <ChevronUp className="w-3.5 h-3.5" />
                      <span>Ciutkan Berita (Kembali)</span>
                    </button>
                  </div>
                )}

                <motion.article
                  key={`top-expanded-${topArticle.id}`}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35 }}
                  className="bg-white rounded-3xl border-2 border-orange-400 ring-4 ring-orange-400/15 overflow-hidden shadow-xl"
                >
                  {/* FOTO BESAR DI BAGIAN ATAS TEKS BERITA (UTUH TANPA TERPOTONG) */}
                  <div className="relative w-full h-72 sm:h-96 md:h-[460px] lg:h-[520px] bg-stone-950 overflow-hidden flex items-center justify-center group">
                    {/* Ambient blurred backdrop untuk estetika latar yang serasi tanpa ruang hampa */}
                    <img
                      src={topArticle.image}
                      alt=""
                      className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-40 scale-125 pointer-events-none"
                    />
                    
                    {/* Foto Tajam Utuh 100% Tanpa Terpotong */}
                    <img
                      src={topArticle.image}
                      alt={topArticle.title}
                      className="relative z-10 w-full h-full max-h-[520px] object-contain drop-shadow-2xl cursor-zoom-in"
                      onClick={() => setLightboxImage({ url: topArticle.image, title: topArticle.title })}
                    />

                    {/* Badge Status & Kategori */}
                    <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2 z-20">
                      <span className="px-3 py-1 rounded-xl text-xs font-black bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" />
                        {topArticle.id === defaultLatestArticle?.id ? 'Berita Terbaru' : 'Berita Pilihan'}
                      </span>
                      <span className="px-2.5 py-1 rounded-xl text-xs font-extrabold bg-stone-900/85 backdrop-blur-sm text-white shadow-md">
                        {topArticle.category}
                      </span>
                      <span className="px-2.5 py-1 rounded-xl text-xs font-bold bg-amber-400 text-stone-950 shadow-md">
                        Sedang Dibaca
                      </span>
                    </div>

                    {/* Tombol Zoom Foto */}
                    <button
                      onClick={() => setLightboxImage({ url: topArticle.image, title: topArticle.title })}
                      className="absolute bottom-4 right-4 z-20 px-3 py-1.5 rounded-xl bg-black/80 hover:bg-black text-white text-xs font-bold flex items-center gap-1.5 border border-stone-700 shadow-lg cursor-pointer transition-all"
                    >
                      <Maximize2 className="w-3.5 h-3.5 text-amber-400" />
                      <span>Perbesar Foto</span>
                    </button>
                  </div>

                  {/* KONTEN BERITA LENGKAP DI BAWAH FOTO */}
                  <div className="p-6 sm:p-9 lg:p-12 space-y-6">
                    {/* Meta Bar */}
                    <div className="flex flex-wrap items-center justify-between gap-3 text-stone-500 text-xs sm:text-sm border-b border-stone-100 pb-4">
                      <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                        <span className="flex items-center gap-1.5 font-medium">
                          <Calendar className="w-4 h-4 text-orange-600" />
                          {topArticle.date}
                        </span>
                        <span className="text-stone-300">•</span>
                        <span className="flex items-center gap-1.5 font-medium">
                          <Clock className="w-4 h-4 text-orange-600" />
                          {topArticle.readTime}
                        </span>
                        <span className="text-stone-300">•</span>
                        <span className="flex items-center gap-1.5 font-medium">
                          <User className="w-4 h-4 text-orange-600" />
                          {topArticle.author}
                        </span>
                      </div>

                      {/* Tombol Bagikan Cepat */}
                      <button
                        onClick={() => handleShareArticle(topArticle)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-700 font-bold text-xs cursor-pointer transition-colors"
                      >
                        {copiedId === topArticle.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-emerald-700">Tautan Disalin!</span>
                          </>
                        ) : (
                          <>
                            <Share2 className="w-3.5 h-3.5" />
                            <span>Bagikan Berita</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Judul Berita Utama */}
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 leading-tight">
                      {topArticle.title}
                    </h2>

                    {/* Kotak Ringkasan / Lead Paragraph */}
                    <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-orange-50 via-amber-50/60 to-orange-50/30 border-l-4 border-orange-500 shadow-xs">
                      <p className="text-sm sm:text-base md:text-lg font-semibold text-slate-800 leading-relaxed">
                        {topArticle.summary}
                      </p>
                    </div>

                    {/* Paragraf-paragraf Berita Lengkap */}
                    <div className="space-y-4 text-stone-700 text-sm sm:text-base leading-relaxed pt-2">
                      {topArticle.content && topArticle.content.length > 0 ? (
                        topArticle.content.map((paragraph, pIdx) => (
                          <p key={pIdx} className="leading-relaxed font-normal text-stone-800">
                            {paragraph}
                          </p>
                        ))
                      ) : (
                        <p className="text-stone-800">{topArticle.summary}</p>
                      )}
                    </div>

                    {/* Tagar Berita */}
                    {topArticle.tags && topArticle.tags.length > 0 && (
                      <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-stone-200">
                        <Tag className="w-3.5 h-3.5 text-orange-500" />
                        {topArticle.tags.map((tag, tIdx) => (
                          <span key={tIdx} className="px-2.5 py-1 bg-stone-100 text-stone-600 rounded-lg text-xs font-semibold">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Tombol Ciutkan Berita & Kembali Ke Posisi Semula */}
                    <div className="pt-6 border-t border-stone-200 flex flex-wrap items-center justify-between gap-3">
                      <button
                        onClick={() => handleCollapseArticle(topArticle.id)}
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-extrabold text-xs sm:text-sm bg-stone-900 text-white hover:bg-stone-800 transition-all cursor-pointer shadow-md hover:scale-105 active:scale-95"
                      >
                        <ChevronUp className="w-4 h-4 text-amber-400" />
                        <span>Ciutkan Berita</span>
                      </button>

                      <span className="text-xs text-stone-500 font-medium">
                        Kanal Publikasi Resmi PKBM Bina Insani Sumowono
                      </span>
                    </div>
                  </div>
                </motion.article>
              </div>
            ) : (
              /* ================= MODE RINGKAS / PREVIEW BERITA TERBARU DEFAULT ================= */
              <motion.article
                key={`top-collapsed-${topArticle.id}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className="mb-12 bg-white rounded-3xl border border-stone-200 hover:border-orange-300 transition-all duration-300 overflow-hidden shadow-sm hover:shadow-xl"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                  {/* Kolom Gambar Berita Terbaru */}
                  <div
                    onClick={() => handleOpenArticle(topArticle.id)}
                    className="lg:col-span-5 relative h-64 sm:h-80 lg:min-h-[340px] overflow-hidden bg-stone-950 cursor-pointer group flex items-center justify-center"
                  >
                    {/* Ambient background blur */}
                    <img
                      src={topArticle.image}
                      alt=""
                      className="absolute inset-0 w-full h-full object-cover blur-xl opacity-35 scale-125 pointer-events-none"
                    />
                    {/* Sharp uncropped foreground image */}
                    <img
                      src={topArticle.image}
                      alt={topArticle.title}
                      className="relative z-10 w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                    />
                    
                    {/* Badge Unggulan & Kategori */}
                    <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2 z-20">
                      <span className="px-3 py-1 rounded-xl text-xs font-black bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" />
                        Berita Terbaru
                      </span>
                      <span className="px-2.5 py-1 rounded-xl text-xs font-extrabold bg-stone-900/80 backdrop-blur-sm text-white shadow-md">
                        {topArticle.category}
                      </span>
                    </div>

                    {/* Hover Prompt */}
                    <div className="absolute bottom-3 right-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="px-2.5 py-1 rounded-lg bg-black/80 text-amber-300 text-[11px] font-bold backdrop-blur-sm flex items-center gap-1">
                        <BookOpen className="w-3 h-3" />
                        Klik Baca Selengkapnya
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
                          {topArticle.date}
                        </span>
                        <span className="text-stone-300">•</span>
                        <span className="flex items-center gap-1.5 font-medium">
                          <Clock className="w-4 h-4 text-orange-600" />
                          {topArticle.readTime}
                        </span>
                        <span className="text-stone-300">•</span>
                        <span className="flex items-center gap-1.5 font-medium">
                          <User className="w-4 h-4 text-orange-600" />
                          {topArticle.author}
                        </span>
                      </div>

                      {/* Judul Berita */}
                      <h3
                        onClick={() => handleOpenArticle(topArticle.id)}
                        className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 hover:text-orange-600 transition-colors leading-snug cursor-pointer"
                      >
                        {topArticle.title}
                      </h3>

                      {/* Isi Ringkasan Berita */}
                      <p className="text-sm sm:text-base leading-relaxed font-medium text-slate-800 line-clamp-3">
                        {topArticle.summary}
                      </p>
                    </div>

                    {/* Bagian Tombol Baca Selengkapnya */}
                    <div className="pt-4 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3">
                      <button
                        onClick={() => handleOpenArticle(topArticle.id)}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-sm shadow-orange-950/20 transition-all cursor-pointer hover:scale-105 active:scale-95"
                      >
                        <span>Baca Selengkapnya</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleShareArticle(topArticle)}
                        className="inline-flex items-center gap-1.5 text-xs text-stone-500 hover:text-orange-600 font-medium transition-colors cursor-pointer"
                      >
                        {copiedId === topArticle.id ? (
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
        </div>

        {/* 2. DAFTAR BERITA LAINNYA: Seluruh Berita Menciut Rapi Otomatis Agar Tidak Membuang Ruang Website */}
        {listArticles.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-stone-200 pb-4">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-orange-600" />
                <h3 className="text-lg sm:text-xl font-black text-slate-900">
                  {isReadingOlderArticle ? 'Daftar Seluruh Berita' : 'Berita Terdahulu'}
                </h3>
              </div>
              <span className="text-xs font-bold text-stone-500 bg-stone-100 px-3 py-1 rounded-full">
                {listArticles.length} Berita Tersedia
              </span>
            </div>

            {/* Grid Berita: Seluruh Berita Tetap Kompak/Menciut Rapi */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 items-start">
              {listArticles.map((article, idx) => {
                const isCurrentlyReadingThis = activeReadingId === article.id;

                return (
                  <motion.article
                    key={article.id}
                    id={`berita-card-${article.id}`}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.35, delay: idx * 0.05 }}
                    className={`bg-white rounded-3xl border transition-all duration-300 overflow-hidden flex flex-col justify-between shadow-sm hover:shadow-xl scroll-mt-28 ${
                      isCurrentlyReadingThis
                        ? 'border-2 border-orange-500 ring-4 ring-orange-400/25 bg-orange-50/15'
                        : 'border-stone-200 hover:border-orange-300'
                    }`}
                  >
                    <div>
                      {/* Foto Tidak Terpotong dengan Ambient Blur */}
                      <div
                        onClick={() => {
                          if (isCurrentlyReadingThis) {
                            handleCollapseArticle(article.id);
                          } else {
                            handleOpenArticle(article.id);
                          }
                        }}
                        className="relative h-48 sm:h-52 bg-stone-950 overflow-hidden cursor-pointer group flex items-center justify-center"
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
                          className="relative z-10 w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                        />
                        
                        <div className="absolute top-3 left-3 flex items-center gap-1.5 z-20">
                          <span className="px-2.5 py-1 rounded-lg text-[10px] font-extrabold bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-sm">
                            {article.category}
                          </span>
                          {isCurrentlyReadingThis && (
                            <span className="px-2 py-0.5 rounded-lg text-[10px] font-black bg-stone-900 text-amber-300 border border-amber-400/40 shadow-sm flex items-center gap-1">
                              <span>Sedang Dibaca di Atas</span>
                              <span>⬆️</span>
                            </span>
                          )}
                        </div>

                        {/* Tombol Zoom Foto */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setLightboxImage({ url: article.image, title: article.title });
                          }}
                          className="absolute bottom-2.5 right-2.5 z-20 p-1.5 rounded-lg bg-black/70 hover:bg-black text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity border border-stone-700"
                          title="Perbesar Foto"
                        >
                          <Maximize2 className="w-3.5 h-3.5 text-amber-400" />
                        </button>
                      </div>

                      {/* Konten Teks Ringkas (Menciut Rapi Tanpa Memakan Ruang) */}
                      <div className="p-5 sm:p-6 space-y-2.5">
                        <div className="flex items-center gap-2.5 text-stone-500 text-xs">
                          <span className="flex items-center gap-1 font-medium">
                            <Calendar className="w-3.5 h-3.5 text-orange-600" />
                            {article.date}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1 font-medium">
                            <Clock className="w-3.5 h-3.5 text-orange-600" />
                            {article.readTime}
                          </span>
                        </div>

                        <h3
                          onClick={() => {
                            if (isCurrentlyReadingThis) {
                              handleCollapseArticle(article.id);
                            } else {
                              handleOpenArticle(article.id);
                            }
                          }}
                          className={`font-black text-slate-900 leading-snug cursor-pointer hover:text-orange-600 transition-colors text-base sm:text-lg line-clamp-2 ${
                            isCurrentlyReadingThis ? 'text-orange-600' : ''
                          }`}
                        >
                          {article.title}
                        </h3>

                        <p className="text-stone-600 text-xs sm:text-sm leading-relaxed line-clamp-3">
                          {article.summary}
                        </p>
                      </div>
                    </div>

                    {/* Card Footer Action: Baca Selengkapnya / Ciutkan Berita */}
                    <div className="px-5 pb-5 pt-0 flex items-center gap-2">
                      <button
                        onClick={() => {
                          if (isCurrentlyReadingThis) {
                            handleCollapseArticle(article.id);
                          } else {
                            handleOpenArticle(article.id);
                          }
                        }}
                        className={`flex-1 py-2 px-3.5 rounded-xl font-bold text-xs border transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs ${
                          isCurrentlyReadingThis
                            ? 'bg-stone-900 text-amber-300 border-stone-900 hover:bg-stone-800'
                            : 'bg-stone-50 hover:bg-gradient-to-r hover:from-orange-500 hover:to-amber-500 text-stone-700 hover:text-white border-stone-200 hover:border-orange-500'
                        }`}
                      >
                        {isCurrentlyReadingThis ? (
                          <>
                            <ChevronUp className="w-3.5 h-3.5" />
                            <span>Ciutkan Berita</span>
                          </>
                        ) : (
                          <>
                            <span>Baca Selengkapnya</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => handleShareArticle(article)}
                        className="p-2 rounded-xl bg-stone-100 hover:bg-orange-50 text-stone-600 hover:text-orange-600 border border-stone-200 hover:border-orange-200 transition-colors cursor-pointer"
                        title="Bagikan Berita"
                      >
                        {copiedId === article.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Share2 className="w-3.5 h-3.5" />
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
