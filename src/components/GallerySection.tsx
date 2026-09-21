import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Image as ImageIcon,
  Calendar,
  Tag,
  PlusCircle,
  X,
  ExternalLink,
  Sparkles,
  Camera,
  Video,
  Play,
  Film,
  Clock,
  Layers,
  ArrowRight
} from 'lucide-react';
import { usePKBM } from '../context/PKBMContext';
import { GalleryItem, VideoItem } from '../types';
import {
  getVideoEmbedUrl,
  getVideoThumbnail,
  getVideoPlatformInfo
} from '../utils/videoHelper';
import { MediaShowcaseView, ShowcaseItem } from './MediaShowcaseView';

interface GallerySectionProps {
  onOpenAdmin?: () => void;
}

export const GallerySection: React.FC<GallerySectionProps> = ({ onOpenAdmin }) => {
  const { gallery, news, videos } = usePKBM();

  // Mode Tampilan: 'photos' | 'videos'
  const [activeMediaTab, setActiveMediaTab] = useState<'photos' | 'videos'>('photos');

  // Filter Foto
  const [selectedPhotoCategory, setSelectedPhotoCategory] = useState<string>('Semua');
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryItem | null>(null);

  // Filter Video
  const [selectedVideoCategory, setSelectedVideoCategory] = useState<string>('Semua');
  const [selectedVideoPlatform, setSelectedVideoPlatform] = useState<string>('Semua');
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);

  // 1. Ambil foto-foto yang bersumber dari berita secara dinamis dan otomatis
  const newsGalleryItems: GalleryItem[] = news
    .filter((article) => article.image && article.image.trim() !== '')
    .map((article) => ({
      id: `news-photo-${article.id}`,
      title: article.title,
      category:
        article.category === 'Prestasi Warga Belajar'
          ? 'Prestasi Warga Belajar'
          : article.category || 'Dokumentasi Berita',
      image: article.image,
      date: article.date,
      description: article.summary || `Dokumentasi Berita: ${article.title}`
    }));

  // 2. Gabungkan galeri mandiri + seluruh foto berita tanpa duplikasi URL foto
  const seenImages = new Set<string>();
  const combinedGallery: GalleryItem[] = [];

  for (const item of gallery) {
    if (item.image && !seenImages.has(item.image)) {
      seenImages.add(item.image);
      combinedGallery.push(item);
    }
  }

  for (const item of newsGalleryItems) {
    if (item.image && !seenImages.has(item.image)) {
      seenImages.add(item.image);
      combinedGallery.push(item);
    }
  }

  const photoCategories = ['Semua', ...Array.from(new Set(combinedGallery.map((item) => item.category)))];

  const filteredGallery = combinedGallery.filter((item) => {
    return selectedPhotoCategory === 'Semua' || item.category === selectedPhotoCategory;
  });

  // Filter Video
  const videoCategories = ['Semua', ...Array.from(new Set(videos.map((v) => v.category)))];

  const filteredVideos = videos.filter((vid) => {
    const matchCategory = selectedVideoCategory === 'Semua' || vid.category === selectedVideoCategory;
    const matchPlatform =
      selectedVideoPlatform === 'Semua' ||
      (selectedVideoPlatform === 'youtube' && vid.platform === 'youtube') ||
      (selectedVideoPlatform === 'facebook' && vid.platform === 'facebook') ||
      (selectedVideoPlatform === 'instagram' && vid.platform === 'instagram') ||
      (selectedVideoPlatform === 'other' && !['youtube', 'facebook', 'instagram'].includes(vid.platform));

    return matchCategory && matchPlatform;
  });

  // Transform to 2-column showcase items matching Layout PKBM.png
  const photoShowcaseItems: ShowcaseItem[] = filteredGallery.map((item) => ({
    id: item.id,
    title: item.title,
    description:
      item.description ||
      `Dokumentasi resmi kegiatan pembelajaran, pelatihan keterampilan vokasi, dan aktivitas kemandirian warga belajar PKBM Bina Insani Sumowono.`,
    image: item.image,
    category: item.category,
    date: item.date,
    badge: 'Foto Kegiatan'
  }));

  const videoShowcaseItems: ShowcaseItem[] = filteredVideos.map((vid) => ({
    id: vid.id,
    title: vid.title,
    description:
      vid.description ||
      `Dokumentasi video pembelajaran kesetaraan dan keterampilan warga belajar PKBM Bina Insani Sumowono.`,
    image: vid.thumbnail || getVideoThumbnail(vid.videoUrl, vid.platform),
    videoUrl: vid.videoUrl,
    platform: vid.platform,
    duration: vid.duration,
    category: vid.category,
    date: vid.date,
    badge: getVideoPlatformInfo(vid.platform).label
  }));

  return (
    <section id="galeri" className="py-20 bg-slate-50/70 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-100 text-orange-900 text-xs font-extrabold uppercase tracking-wider">
            <ImageIcon className="w-4 h-4 text-orange-600" />
            Dokumentasi & Aktivitas Warga Belajar
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Galeri Kegiatan <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-600">PKBM Bina Insani Sumowono</span>
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Potret nyata dan video dokumentasi pembelajaran kesetaraan Paket A, B, C, pelatihan vokasi terapan, simulasi ujian berbasis komputer, serta kegiatan kemandirian warga belajar.
          </p>

          {onOpenAdmin && (
            <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
              <button
                onClick={onOpenAdmin}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 font-extrabold text-xs shadow-md shadow-slate-950/20 transition-all cursor-pointer border border-orange-500/40"
              >
                <PlusCircle className="w-4 h-4 text-orange-400" />
                <span>Kelola Galeri Foto & Video (Admin)</span>
              </button>
            </div>
          )}
        </div>

        {/* Media Switcher Tab: Foto vs Video */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex p-1.5 bg-white rounded-3xl border border-slate-200 shadow-sm">
            <button
              onClick={() => setActiveMediaTab('photos')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
                activeMediaTab === 'photos'
                  ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-md shadow-orange-950/20'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Camera className="w-4 h-4" />
              <span>Foto Kegiatan</span>
              <span
                className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
                  activeMediaTab === 'photos' ? 'bg-orange-900/40 text-amber-100' : 'bg-slate-100 text-slate-600'
                }`}
              >
                {combinedGallery.length}
              </span>
            </button>

            <button
              onClick={() => setActiveMediaTab('videos')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
                activeMediaTab === 'videos'
                  ? 'bg-gradient-to-r from-red-600 to-pink-600 text-white shadow-md shadow-red-950/20'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Film className="w-4 h-4" />
              <span>Galeri Video</span>
              <span
                className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
                  activeMediaTab === 'videos' ? 'bg-red-950/40 text-red-100' : 'bg-red-50 text-red-600 border border-red-200'
                }`}
              >
                {videos.length}
              </span>
            </button>
          </div>
        </div>

        {/* ==================== TAB 1: FOTO KEGIATAN ==================== */}
        {activeMediaTab === 'photos' && (
          <div className="space-y-8">
            {/* Tampilan Fokus Split 2 Kolom Sesuai Gambar Layout */}
            {selectedPhoto && (
              <MediaShowcaseView
                items={photoShowcaseItems}
                activeId={selectedPhoto.id}
                onSelect={(item) => {
                  const found = filteredGallery.find((g) => g.id === item.id);
                  if (found) setSelectedPhoto(found);
                }}
                onClose={() => setSelectedPhoto(null)}
                sectionTitle="Dokumentasi Foto Kegiatan"
                mediaType="photo"
                theme="light"
              />
            )}

            {/* Category Tabs */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              {photoCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedPhotoCategory(cat)}
                  className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                    selectedPhotoCategory === cat
                      ? 'bg-slate-900 text-white shadow-md'
                      : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Photo Gallery Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredGallery.map((item, idx) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                  onClick={() => setSelectedPhoto(item)}
                  className="group bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl hover:border-orange-300 transition-all duration-300 cursor-pointer flex flex-col justify-between"
                >
                  <div className="relative h-60 overflow-hidden bg-slate-100">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                    
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 rounded-lg text-[10px] font-extrabold bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-sm">
                        {item.category}
                      </span>
                    </div>

                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <span className="text-[11px] text-amber-300 font-semibold flex items-center gap-1 mb-1">
                        <Calendar className="w-3 h-3" />
                        {item.date}
                      </span>
                      <h3 className="font-extrabold text-sm sm:text-base leading-snug line-clamp-2 drop-shadow-sm">
                        {item.title}
                      </h3>
                    </div>
                  </div>

                  {item.description && (
                    <div className="p-4 bg-slate-50 border-t border-slate-100">
                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>

            {filteredGallery.length === 0 && (
              <div className="text-center py-16 px-4 bg-white rounded-3xl border border-slate-200 shadow-sm max-w-xl mx-auto space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-700 flex items-center justify-center mx-auto">
                  <Camera className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-800">
                  {gallery.length === 0 ? 'Belum Ada Foto Kegiatan' : 'Belum ada foto dalam kategori ini'}
                </h3>
                <p className="text-slate-500 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
                  {gallery.length === 0
                    ? 'Dokumentasi foto kegiatan pembelajaran dan pelatihan vokasi akan segera diunggah.'
                    : 'Silakan pilih kategori galeri lain di atas.'}
                </p>
              </div>
            )}
          </div>
        )}

        {/* ==================== TAB 2: GALERI VIDEO ==================== */}
        {activeMediaTab === 'videos' && (
          <div className="space-y-8">
            {/* Tampilan Fokus Split 2 Kolom Video Sesuai Gambar Layout */}
            {selectedVideo && (
              <MediaShowcaseView
                items={videoShowcaseItems}
                activeId={selectedVideo.id}
                onSelect={(item) => {
                  const found = filteredVideos.find((v) => v.id === item.id);
                  if (found) setSelectedVideo(found);
                }}
                onClose={() => setSelectedVideo(null)}
                sectionTitle="Video Dokumentasi Kegiatan"
                mediaType="video"
                theme="light"
              />
            )}

            {/* Platform & Category Filter Row */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-slate-200 shadow-sm">
              {/* Platform Badges */}
              <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
                <span className="text-xs font-bold text-slate-500 whitespace-nowrap hidden sm:inline mr-1">
                  Sumber Platform:
                </span>
                {[
                  { id: 'Semua', label: 'Semua Video' },
                  { id: 'youtube', label: 'YouTube' },
                  { id: 'facebook', label: 'Facebook' },
                  { id: 'instagram', label: 'Instagram' },
                  { id: 'other', label: 'Video Lainnya' }
                ].map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedVideoPlatform(p.id)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                      selectedVideoPlatform === p.id
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>

              {/* Category Dropdown/Pills */}
              <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                <span className="text-xs font-bold text-slate-500 whitespace-nowrap hidden sm:inline">
                  Kategori:
                </span>
                <select
                  value={selectedVideoCategory}
                  onChange={(e) => setSelectedVideoCategory(e.target.value)}
                  className="px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800 bg-white focus:outline-none focus:border-orange-500"
                >
                  {videoCategories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Video Cards Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVideos.map((video, idx) => {
                const platformInfo = getVideoPlatformInfo(video.platform);
                const thumbUrl = getVideoThumbnail(video.videoUrl, video.platform, video.thumbnail);

                return (
                  <motion.div
                    key={video.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: idx * 0.05 }}
                    onClick={() => setSelectedVideo(video)}
                    className="group bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl hover:border-red-300 transition-all duration-300 cursor-pointer flex flex-col justify-between"
                  >
                    <div>
                      {/* Video Thumbnail with Play Button */}
                      <div className="relative h-56 bg-slate-950 overflow-hidden">
                        <img
                          src={thumbUrl}
                          alt={video.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-slate-950/30" />

                        {/* Centered Play Button Overlay */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-14 h-14 rounded-full bg-white/90 text-slate-950 flex items-center justify-center shadow-xl group-hover:scale-115 group-hover:bg-red-600 group-hover:text-white transition-all duration-300">
                            <Play className="w-6 h-6 fill-current ml-1" />
                          </div>
                        </div>

                        {/* Platform Badge */}
                        <div className="absolute top-3 left-3 flex items-center gap-1.5">
                          <span
                            className={`px-2.5 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider shadow-sm ${platformInfo.badgeColor}`}
                          >
                            {platformInfo.label}
                          </span>
                          {video.featured && (
                            <span className="px-2 py-1 rounded-xl text-[10px] font-black bg-amber-400 text-slate-950 shadow-sm flex items-center gap-1">
                              <Sparkles className="w-2.5 h-2.5" /> Unggulan
                            </span>
                          )}
                        </div>

                        {/* Duration & Category Bar */}
                        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-[11px]">
                          <span className="px-2.5 py-0.5 rounded-lg bg-black/60 backdrop-blur-xs font-semibold">
                            {video.category}
                          </span>
                          {video.duration && (
                            <span className="px-2.5 py-0.5 rounded-lg bg-black/70 backdrop-blur-xs font-mono font-bold flex items-center gap-1 text-amber-300">
                              <Clock className="w-3 h-3" />
                              {video.duration}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Video Info Content */}
                      <div className="p-5 space-y-2">
                        <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-orange-600" />
                          {video.date}
                        </span>

                        <h3 className="font-extrabold text-sm sm:text-base text-slate-900 leading-snug line-clamp-2 group-hover:text-red-700 transition-colors">
                          {video.title}
                        </h3>

                        {video.description && (
                          <p className="text-slate-600 text-xs leading-relaxed line-clamp-2">
                            {video.description}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Card Footer Call to Action */}
                    <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-700 group-hover:bg-red-50/50 transition-colors">
                      <span className="flex items-center gap-1 text-red-600">
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Putar Video</span>
                      </span>
                      <span className="text-[11px] text-slate-500 group-hover:translate-x-1 transition-transform flex items-center gap-0.5">
                        Tonton <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {filteredVideos.length === 0 && (
              <div className="text-center py-16 px-4 bg-white rounded-3xl border border-slate-200 shadow-sm max-w-xl mx-auto space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto">
                  <Film className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-800">
                  {videos.length === 0 ? 'Belum Ada Galeri Video' : 'Tidak Ada Video Sesuai Filter'}
                </h3>
                <p className="text-slate-500 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
                  {videos.length === 0
                    ? 'Video dokumentasi pembelajaran YouTube, Facebook, dan Instagram akan segera ditayangkan.'
                    : 'Coba pilih filter platform atau kategori video lainnya.'}
                </p>
              </div>
            )}
          </div>
        )}

      </div>
    </section>
  );
};
