import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Video,
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  Play,
  RotateCcw,
  Sparkles,
  Search,
  Calendar,
  Clock,
  X,
  Check,
  AlertCircle,
  Film,
  Tag,
  Eye,
  Layers,
  HelpCircle
} from 'lucide-react';
import { usePKBM } from '../../../context/PKBMContext';
import { VideoItem, VideoPlatform } from '../../../types';
import {
  detectVideoPlatform,
  getYouTubeVideoId,
  getInstagramMediaCode,
  getVideoEmbedUrl,
  getVideoThumbnail,
  getVideoPlatformInfo
} from '../../../utils/videoHelper';

interface VideoGalleryCmsTabProps {
  onShowToast: (msg: string) => void;
}

const CATEGORY_PRESETS = [
  'Profil Lembaga',
  'Kegiatan Belajar',
  'Pelatihan Vokasi',
  'Akademik & Ujian',
  'Wirausaha & UMKM',
  'Prestasi Warga Belajar',
  'Wisuda & Kelulusan'
];

export const VideoGalleryCmsTab: React.FC<VideoGalleryCmsTabProps> = ({ onShowToast }) => {
  const { videos, addVideoItem, updateVideoItem, deleteVideoItem, resetVideos } = usePKBM();

  const [searchQuery, setSearchQuery] = useState('');
  const [platformFilter, setPlatformFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Preview Player Modal
  const [previewingVideo, setPreviewingVideo] = useState<VideoItem | null>(null);

  // Form State
  const [formData, setFormData] = useState<Omit<VideoItem, 'id'>>({
    title: '',
    videoUrl: '',
    platform: 'youtube',
    category: 'Kegiatan Belajar',
    date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
    description: '',
    thumbnail: '',
    duration: '',
    featured: false
  });

  // Auto-detect platform when videoUrl changes
  const handleUrlChange = (url: string) => {
    const detected = detectVideoPlatform(url);
    let suggestedThumb = formData.thumbnail;
    
    // Auto-fill thumbnail if YouTube
    if (detected === 'youtube') {
      const ytId = getYouTubeVideoId(url);
      if (ytId && (!formData.thumbnail || formData.thumbnail.includes('img.youtube.com'))) {
        suggestedThumb = `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;
      }
    }

    setFormData((prev) => ({
      ...prev,
      videoUrl: url,
      platform: detected,
      thumbnail: suggestedThumb
    }));
  };

  const handleOpenAdd = () => {
    setFormData({
      title: '',
      videoUrl: '',
      platform: 'youtube',
      category: 'Kegiatan Belajar',
      date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
      description: '',
      thumbnail: '',
      duration: '',
      featured: false
    });
    setEditingId(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: VideoItem) => {
    setFormData({
      title: item.title,
      videoUrl: item.videoUrl,
      platform: item.platform,
      category: item.category,
      date: item.date,
      description: item.description || '',
      thumbnail: item.thumbnail || '',
      duration: item.duration || '',
      featured: !!item.featured
    });
    setEditingId(item.id);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      alert('Mohon masukkan judul video');
      return;
    }

    if (!formData.videoUrl.trim()) {
      alert('Mohon masukkan tautan (URL) video');
      return;
    }

    // Auto-detect platform if not set correctly
    const finalPlatform = formData.platform || detectVideoPlatform(formData.videoUrl);
    const finalThumbnail = getVideoThumbnail(formData.videoUrl, finalPlatform, formData.thumbnail);

    const payload = {
      ...formData,
      title: formData.title.trim(),
      videoUrl: formData.videoUrl.trim(),
      platform: finalPlatform,
      thumbnail: finalThumbnail
    };

    if (editingId) {
      updateVideoItem(editingId, payload);
      onShowToast('Video kegiatan berhasil diperbarui!');
    } else {
      addVideoItem(payload);
      onShowToast('Video kegiatan baru berhasil ditambahkan!');
    }

    setIsModalOpen(false);
  };

  const handleDelete = (id: string, title: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus video "${title}"?`)) {
      deleteVideoItem(id);
      onShowToast('Video berhasil dihapus dari galeri.');
    }
  };

  const handleResetData = () => {
    if (confirm('Kembalikan galeri video ke daftar contoh bawaan?')) {
      resetVideos();
      onShowToast('Galeri video berhasil direset ke susunan awal.');
    }
  };

  // Filtered Videos
  const filteredVideos = videos.filter((vid) => {
    const matchesSearch =
      vid.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (vid.description && vid.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      vid.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesPlatform = platformFilter === 'all' || vid.platform === platformFilter;
    const matchesCategory = categoryFilter === 'all' || vid.category === categoryFilter;

    return matchesSearch && matchesPlatform && matchesCategory;
  });

  // Stats
  const countByPlatform = {
    total: videos.length,
    youtube: videos.filter((v) => v.platform === 'youtube').length,
    facebook: videos.filter((v) => v.platform === 'facebook').length,
    instagram: videos.filter((v) => v.platform === 'instagram').length,
    other: videos.filter((v) => !['youtube', 'facebook', 'instagram'].includes(v.platform)).length
  };

  const detectedInfo = getVideoPlatformInfo(formData.platform);

  return (
    <div className="space-y-6">
      {/* Top Header & Stats */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-xs">
                <Video className="w-5 h-5" />
              </span>
              <div>
                <h3 className="text-xl font-black text-slate-900">Galeri Video Kegiatan</h3>
                <p className="text-xs text-slate-600">
                  Dukung video dari YouTube, Facebook Watch/Reels, Instagram Reels/Post, dan tautan video daring lainnya
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleResetData}
              title="Reset ke susunan default"
              className="p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border border-slate-300"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>

            <button
              onClick={handleOpenAdd}
              className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-extrabold text-xs transition-all flex items-center gap-2 shadow-md shadow-orange-950/20 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Video Baru</span>
            </button>
          </div>
        </div>

        {/* Platform Stat Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 pt-2 border-t border-slate-100 text-xs">
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col justify-between">
            <span className="text-slate-500 font-semibold text-[11px]">Total Video</span>
            <span className="text-xl font-black text-slate-900 mt-1">{countByPlatform.total}</span>
          </div>
          <div className="p-3 bg-red-50 rounded-2xl border border-red-200 flex flex-col justify-between">
            <span className="text-red-700 font-bold text-[11px] flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-red-600" /> YouTube
            </span>
            <span className="text-xl font-black text-red-900 mt-1">{countByPlatform.youtube}</span>
          </div>
          <div className="p-3 bg-blue-50 rounded-2xl border border-blue-200 flex flex-col justify-between">
            <span className="text-blue-700 font-bold text-[11px] flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-blue-600" /> Facebook
            </span>
            <span className="text-xl font-black text-blue-900 mt-1">{countByPlatform.facebook}</span>
          </div>
          <div className="p-3 bg-pink-50 rounded-2xl border border-pink-200 flex flex-col justify-between">
            <span className="text-pink-700 font-bold text-[11px] flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-pink-600" /> Instagram
            </span>
            <span className="text-xl font-black text-pink-900 mt-1">{countByPlatform.instagram}</span>
          </div>
          <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 flex flex-col justify-between col-span-2 sm:col-span-1">
            <span className="text-amber-800 font-bold text-[11px] flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-600" /> Video Lain
            </span>
            <span className="text-xl font-black text-amber-950 mt-1">{countByPlatform.other}</span>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari judul video, deskripsi, atau kategori..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs focus:outline-none focus:border-orange-500 transition-colors"
          />
        </div>

        {/* Platform Selector */}
        <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <span className="text-[11px] font-bold text-slate-500 whitespace-nowrap hidden sm:inline">Platform:</span>
          {[
            { id: 'all', label: 'Semua' },
            { id: 'youtube', label: 'YouTube' },
            { id: 'facebook', label: 'Facebook' },
            { id: 'instagram', label: 'Instagram' },
            { id: 'direct', label: 'MP4/Direct' }
          ].map((p) => (
            <button
              key={p.id}
              onClick={() => setPlatformFilter(p.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                platformFilter === p.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Video Cards Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVideos.map((video) => {
          const platformInfo = getVideoPlatformInfo(video.platform);
          const thumbUrl = getVideoThumbnail(video.videoUrl, video.platform, video.thumbnail);

          return (
            <div
              key={video.id}
              className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-md hover:border-orange-300 transition-all duration-300 overflow-hidden flex flex-col justify-between group"
            >
              <div>
                {/* Thumbnail Header with Play Trigger */}
                <div className="relative h-48 bg-slate-950 overflow-hidden cursor-pointer" onClick={() => setPreviewingVideo(video)}>
                  <img
                    src={thumbUrl}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/20" />

                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-white/90 text-slate-950 flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:bg-orange-500 group-hover:text-white transition-all">
                      <Play className="w-5 h-5 fill-current ml-0.5" />
                    </div>
                  </div>

                  {/* Platform Badge */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className={`px-2.5 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider shadow-sm ${platformInfo.badgeColor}`}>
                      {platformInfo.label}
                    </span>
                    {video.featured && (
                      <span className="px-2 py-1 rounded-xl text-[10px] font-black bg-amber-400 text-slate-950 shadow-sm flex items-center gap-1">
                        <Sparkles className="w-2.5 h-2.5" /> Unggulan
                      </span>
                    )}
                  </div>

                  {/* Duration & Category */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-[11px]">
                    <span className="px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-xs font-semibold">
                      {video.category}
                    </span>
                    {video.duration && (
                      <span className="px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-xs font-mono font-bold flex items-center gap-1">
                        <Clock className="w-3 h-3 text-amber-400" />
                        {video.duration}
                      </span>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 space-y-2">
                  <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-orange-600" />
                    {video.date}
                  </span>

                  <h4 className="font-extrabold text-sm sm:text-base text-slate-900 leading-snug line-clamp-2">
                    {video.title}
                  </h4>

                  {video.description && (
                    <p className="text-slate-600 text-xs leading-relaxed line-clamp-2">
                      {video.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setPreviewingVideo(video)}
                    title="Pratinjau Pemutar"
                    className="p-2 rounded-xl bg-white hover:bg-slate-200 text-slate-700 transition-colors border border-slate-200 flex items-center gap-1 text-xs font-bold"
                  >
                    <Eye className="w-3.5 h-3.5 text-orange-600" />
                    <span className="hidden sm:inline">Putar</span>
                  </button>
                  <a
                    href={video.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Buka URL asli di tab baru"
                    className="p-2 rounded-xl bg-white hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition-colors border border-slate-200"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleOpenEdit(video)}
                    className="p-2 rounded-xl bg-white hover:bg-blue-50 text-blue-700 border border-blue-200 transition-colors flex items-center gap-1 text-xs font-bold"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(video.id, video.title)}
                    className="p-2 rounded-xl bg-white hover:bg-red-50 text-red-700 border border-red-200 transition-colors"
                    title="Hapus Video"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredVideos.length === 0 && (
        <div className="text-center py-16 px-4 bg-white rounded-3xl border border-slate-200 shadow-sm max-w-xl mx-auto space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center mx-auto">
            <Film className="w-6 h-6" />
          </div>
          <h4 className="text-base font-bold text-slate-900">Tidak ada video yang sesuai</h4>
          <p className="text-slate-500 text-xs max-w-md mx-auto">
            Coba ubah kata kunci pencarian atau ganti filter platform di atas.
          </p>
        </div>
      )}

      {/* MODAL: Form Tambah / Edit Video */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 my-8 space-y-5"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-orange-100 text-orange-950 font-bold">
                    <Video className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-900">
                      {editingId ? 'Edit Data Video Kegiatan' : 'Tambah Video Kegiatan Baru'}
                    </h3>
                    <p className="text-xs text-slate-500">
                      Masukkan tautan video dari YouTube, Facebook, Instagram, atau video daring lainnya
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-4">
                {/* Judul Video */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Judul Video <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Praktik Keterampilan Tata Busana Warga Belajar Paket C"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-orange-500"
                  />
                </div>

                {/* Link Video (URL) */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-slate-800">
                      Tautan / URL Video <span className="text-red-500">*</span>
                    </label>
                    <span className="text-[10px] text-slate-500 font-semibold">
                      Mendukung YouTube, FB, IG, MP4
                    </span>
                  </div>
                  <input
                    type="url"
                    required
                    placeholder="Contoh: https://www.youtube.com/watch?v=... atau https://www.instagram.com/reel/..."
                    value={formData.videoUrl}
                    onChange={(e) => handleUrlChange(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-mono focus:outline-none focus:border-orange-500"
                  />

                  {/* Realtime Platform Detection Indicator */}
                  {formData.videoUrl.trim() && (
                    <div className="mt-2 p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs">
                        <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase ${detectedInfo.badgeColor}`}>
                          {detectedInfo.label}
                        </span>
                        <span className="text-slate-700 font-semibold text-[11px]">{detectedInfo.desc}</span>
                      </div>
                      <span className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> Terdeteksi
                      </span>
                    </div>
                  )}

                  <div className="mt-1.5 flex flex-wrap gap-1.5 text-[11px] text-slate-500">
                    <span className="font-semibold text-slate-700">Contoh format:</span>
                    <span className="bg-slate-100 px-1.5 py-0.5 rounded">youtube.com/watch?v=...</span>
                    <span className="bg-slate-100 px-1.5 py-0.5 rounded">youtu.be/...</span>
                    <span className="bg-slate-100 px-1.5 py-0.5 rounded">facebook.com/watch/?v=...</span>
                    <span className="bg-slate-100 px-1.5 py-0.5 rounded">instagram.com/reel/...</span>
                  </div>
                </div>

                {/* 2 Kolom: Kategori & Tanggal */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">Kategori Kegiatan</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-orange-500 bg-white"
                    >
                      {CATEGORY_PRESETS.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">Tanggal Kegiatan</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        placeholder="Contoh: 15 September 2026"
                        className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-orange-500"
                      />
                      <input
                        type="date"
                        title="Pilih kalender"
                        onChange={(e) => {
                          if (e.target.value) {
                            const d = new Date(e.target.value + 'T00:00:00');
                            setFormData({
                              ...formData,
                              date: d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
                            });
                          }
                        }}
                        className="px-2 py-2 rounded-xl border border-slate-300 text-xs bg-slate-50 cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                {/* 2 Kolom: Durasi & Pilihan Platform Manual */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">Durasi Video (Opsional)</label>
                    <input
                      type="text"
                      placeholder="Contoh: 4:20 atau 1 Menit"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">Platform Video</label>
                    <select
                      value={formData.platform}
                      onChange={(e) => setFormData({ ...formData, platform: e.target.value as VideoPlatform })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-orange-500 bg-white"
                    >
                      <option value="youtube">YouTube</option>
                      <option value="facebook">Facebook Video</option>
                      <option value="instagram">Instagram Reel / Post</option>
                      <option value="direct">Berkas Video Langsung (MP4)</option>
                      <option value="other">Video Online Lainnya</option>
                    </select>
                  </div>
                </div>

                {/* Deskripsi Singkat */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Deskripsi Singkat Video</label>
                  <textarea
                    rows={3}
                    placeholder="Ceritakan gambaran singkat tentang aktivitas warga belajar dalam video ini..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-orange-500 leading-relaxed"
                  />
                </div>

                {/* Thumbnail Kustom */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    URL Gambar Thumbnail (Opsional)
                  </label>
                  <input
                    type="url"
                    placeholder="Kosongkan untuk menggunakan thumbnail otomatis dari YouTube / platform"
                    value={formData.thumbnail}
                    onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-orange-500"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">
                    * Untuk link YouTube, thumbnail otomatis diambil langsung dari video bersangkutan jika dikosongkan.
                  </p>
                </div>

                {/* Checkbox Featured */}
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="featured-video-checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-4 h-4 rounded text-orange-600 focus:ring-orange-500"
                  />
                  <label htmlFor="featured-video-checkbox" className="text-xs font-bold text-slate-800 cursor-pointer">
                    Tampilkan sebagai Video Unggulan di Halaman Depan
                  </label>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white text-xs font-extrabold shadow-md shadow-orange-950/20 transition-all cursor-pointer flex items-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    <span>{editingId ? 'Simpan Perubahan' : 'Terbitkan Video'}</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: Lightbox / Player Preview */}
      <AnimatePresence>
        {previewingVideo && (
          <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl border border-slate-700 relative text-white"
            >
              {/* Close Button */}
              <button
                onClick={() => setPreviewingVideo(null)}
                className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/60 hover:bg-black text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Video Player Container */}
              <div className="relative w-full aspect-video bg-black flex items-center justify-center overflow-hidden">
                {previewingVideo.platform === 'direct' ? (
                  <video
                    src={previewingVideo.videoUrl}
                    controls
                    autoPlay
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <iframe
                    src={getVideoEmbedUrl(previewingVideo.videoUrl, previewingVideo.platform) || previewingVideo.videoUrl}
                    title={previewingVideo.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="w-full h-full border-0"
                  />
                )}
              </div>

              {/* Video Details */}
              <div className="p-6 bg-slate-900 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-xs">
                    <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-black uppercase ${getVideoPlatformInfo(previewingVideo.platform).badgeColor}`}>
                      {getVideoPlatformInfo(previewingVideo.platform).label}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-md bg-white/10 text-amber-300 font-bold">
                      {previewingVideo.category}
                    </span>
                    <span className="text-slate-400">•</span>
                    <span className="text-slate-400">{previewingVideo.date}</span>
                  </div>

                  <a
                    href={previewingVideo.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white transition-colors"
                  >
                    <span>Buka Sumber Video</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                <h3 className="text-lg sm:text-xl font-black text-white leading-snug">
                  {previewingVideo.title}
                </h3>

                {previewingVideo.description && (
                  <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                    {previewingVideo.description}
                  </p>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
