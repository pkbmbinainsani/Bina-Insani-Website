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
  ArrowRight,
  Share2
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
  onShareCustom?: (data: { title: string; description: string; hash: string; category?: string; image?: string }) => void;
}

export const GallerySection: React.FC<GallerySectionProps> = ({ onOpenAdmin, onShareCustom }) => {
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
    <section id="galeri" className="pt-4 sm:pt-6 pb-16 bg-[#F8FAFC] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Compact Media Control & Switcher Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-6 p-2 sm:px-3 bg-white rounded-2xl border border-[#E2E8F0] shadow-xs">
          {/* Media Switcher Tab: Foto vs Video */}
          <div className="inline-flex p-1 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
            <button
              onClick={() => setActiveMediaTab('photos')}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                activeMediaTab === 'photos'
                  ? 'bg-[#F97316] text-white shadow-xs border border-[#FDBA74]/50'
                  : 'text-[#486581] hover:text-[#193B63] hover:bg-[#FFF7ED]'
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Foto Kegiatan</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-md font-bold ${
                  activeMediaTab === 'photos' ? 'bg-white/25 text-white' : 'bg-white text-[#486581] border border-[#E2E8F0]'
                }`}
              >
                {combinedGallery.length}
              </span>
            </button>

            <button
              onClick={() => setActiveMediaTab('videos')}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                activeMediaTab === 'videos'
                  ? 'bg-[#F97316] text-white shadow-xs border border-[#FDBA74]/50'
                  : 'text-[#486581] hover:text-[#193B63] hover:bg-[#FFF7ED]'
              }`}
            >
              <Video className="w-3.5 h-3.5" />
              <span>Video Resmi</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-md font-bold ${
                  activeMediaTab === 'videos' ? 'bg-white/25 text-white' : 'bg-white text-[#486581] border border-[#E2E8F0]'
                }`}
              >
                {videos.length}
              </span>
            </button>
          </div>

          {/* Admin Action Button */}
          {onOpenAdmin && (
            <button
              onClick={onOpenAdmin}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#193B63] hover:bg-[#EA580C] text-white font-extrabold text-[11px] shadow-xs transition-all cursor-pointer border border-white/20"
            >
              <PlusCircle className="w-3.5 h-3.5 text-[#F4B942]" />
              <span>Kelola Galeri (Admin)</span>
            </button>
          )}
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
                onShareItem={(item) => {
                  if (onShareCustom) {
                    onShareCustom({
                      title: `Dokumentasi Foto: ${item.title}`,
                      description: item.description,
                      hash: '#galeri',
                      category: item.category,
                      image: item.image
                    });
                  }
                }}
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
                      ? 'bg-[#193B63] text-white shadow-xs'
                      : 'bg-white text-[#486581] hover:bg-[#FFF7ED] hover:text-[#EA580C] border border-[#E2E8F0]'
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
                  className="group bg-white rounded-3xl overflow-hidden border border-[#E2E8F0] shadow-xs hover:shadow-md hover:border-[#FDBA74] transition-all duration-300 cursor-pointer flex flex-col justify-between"
                >
                  <div className="relative h-60 overflow-hidden bg-[#1E293B]">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                    
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 rounded-lg text-[10px] font-extrabold bg-[#F97316] text-white shadow-xs border border-[#FDBA74]/50">
                        {item.category}
                      </span>
                    </div>

                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <span className="text-[11px] text-[#F4B942] font-semibold flex items-center gap-1 mb-1">
                        <Calendar className="w-3 h-3" />
                        {item.date}
                      </span>
                      <h3 className="font-extrabold text-sm sm:text-base leading-snug line-clamp-2 drop-shadow-sm text-white">
                        {item.title}
                      </h3>
                    </div>
                  </div>

                  {item.description && (
                    <div className="p-4 bg-[#F8FAFC] border-t border-[#E2E8F0]">
                      <p className="text-xs text-[#486581] line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>

            {filteredGallery.length === 0 && (
              <div className="text-center py-16 px-4 bg-white rounded-3xl border border-[#E2E8F0] shadow-xs max-w-xl mx-auto space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-[#FFF7ED] text-[#EA580C] border border-[#FDBA74] flex items-center justify-center mx-auto">
                  <Camera className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-[#193B63]">
                  {gallery.length === 0 ? 'Belum Ada Foto Kegiatan' : 'Belum ada foto dalam kategori ini'}
                </h3>
                <p className="text-[#486581] text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
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
                onShareItem={(item) => {
                  if (onShareCustom) {
                    onShareCustom({
                      title: `Video Dokumentasi: ${item.title}`,
                      description: item.description,
                      hash: '#galeri',
                      category: item.category,
                      image: item.image
                    });
                  }
                }}
              />
            )}

            {/* Platform & Category Filter Row */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-[#E2E8F0] shadow-xs">
              {/* Platform Badges */}
              <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
                <span className="text-xs font-bold text-[#486581] whitespace-nowrap hidden sm:inline mr-1">
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
                        ? 'bg-[#193B63] text-white shadow-xs'
                        : 'bg-[#F8FAFC] text-[#486581] hover:bg-[#FFF7ED] hover:text-[#EA580C] border border-[#E2E8F0]'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>

              {/* Category Dropdown/Pills */}
              <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                <span className="text-xs font-bold text-[#486581] whitespace-nowrap hidden sm:inline">
                  Kategori:
                </span>
                <select
                  value={selectedVideoCategory}
                  onChange={(e) => setSelectedVideoCategory(e.target.value)}
                  className="px-3 py-1.5 rounded-xl border border-[#CBD5E1] text-xs font-semibold text-[#1E293B] bg-white focus:outline-none focus:border-[#F97316]"
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
                    className="group bg-white rounded-3xl overflow-hidden border border-[#E2E8F0] shadow-xs hover:shadow-md hover:border-[#FDBA74] transition-all duration-300 cursor-pointer flex flex-col justify-between"
                  >
                    <div>
                      {/* Video Thumbnail with Play Button */}
                      <div className="relative h-56 bg-[#1E293B] overflow-hidden">
                        <img
                          src={thumbUrl}
                          alt={video.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/30" />

                        {/* Centered Play Button Overlay */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-14 h-14 rounded-full bg-white/90 text-[#193B63] flex items-center justify-center shadow-lg group-hover:scale-115 group-hover:bg-[#F97316] group-hover:text-white transition-all duration-300">
                            <Play className="w-6 h-6 fill-current ml-1" />
                          </div>
                        </div>

                        {/* Platform Badge */}
                        <div className="absolute top-3 left-3 flex items-center gap-1.5">
                          <span
                            className={`px-2.5 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider shadow-xs ${platformInfo.badgeColor}`}
                          >
                            {platformInfo.label}
                          </span>
                          {video.featured && (
                            <span className="px-2 py-1 rounded-xl text-[10px] font-black bg-[#FEF9C3] text-[#854D0E] border border-[#F4B942] shadow-xs flex items-center gap-1">
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
                            <span className="px-2.5 py-0.5 rounded-lg bg-black/70 backdrop-blur-xs font-mono font-bold flex items-center gap-1 text-[#F4B942]">
                              <Clock className="w-3 h-3" />
                              {video.duration}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Video Info Content */}
                      <div className="p-5 space-y-2">
                        <span className="text-[11px] text-[#486581] font-medium flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-[#F97316]" />
                          {video.date}
                        </span>

                        <h3 className="font-extrabold text-sm sm:text-base text-[#193B63] leading-snug line-clamp-2 group-hover:text-[#EA580C] transition-colors">
                          {video.title}
                        </h3>

                        {video.description && (
                          <p className="text-[#486581] text-xs leading-relaxed line-clamp-2">
                            {video.description}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Card Footer Call to Action */}
                    <div className="px-5 py-3.5 bg-[#F8FAFC] border-t border-[#E2E8F0] flex items-center justify-between text-xs font-bold text-[#193B63] group-hover:bg-[#FFF7ED] transition-colors">
                      <span className="flex items-center gap-1 text-[#EA580C]">
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Putar Video</span>
                      </span>
                      <span className="text-[11px] text-[#486581] group-hover:translate-x-1 transition-transform flex items-center gap-0.5">
                        Tonton <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {filteredVideos.length === 0 && (
              <div className="text-center py-16 px-4 bg-white rounded-3xl border border-[#E2E8F0] shadow-xs max-w-xl mx-auto space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-[#FFF7ED] text-[#EA580C] border border-[#FDBA74] flex items-center justify-center mx-auto">
                  <Film className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-[#193B63]">
                  {videos.length === 0 ? 'Belum Ada Galeri Video' : 'Tidak Ada Video Sesuai Filter'}
                </h3>
                <p className="text-[#486581] text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
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
