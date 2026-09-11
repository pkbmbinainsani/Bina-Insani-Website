import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Image as ImageIcon, Calendar, Tag, PlusCircle, X, ExternalLink, Sparkles, Camera } from 'lucide-react';
import { usePKBM } from '../context/PKBMContext';
import { GalleryItem } from '../types';

interface GallerySectionProps {
  onOpenAdmin?: () => void;
}

export const GallerySection: React.FC<GallerySectionProps> = ({ onOpenAdmin }) => {
  const { gallery, isAdminAuthenticated } = usePKBM();
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryItem | null>(null);

  const categories = ['Semua', ...Array.from(new Set(gallery.map((item) => item.category)))];

  const filteredGallery = gallery.filter((item) => {
    return selectedCategory === 'Semua' || item.category === selectedCategory;
  });

  return (
    <section id="galeri" className="py-20 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-100 text-orange-900 text-xs font-extrabold uppercase tracking-wider">
            <ImageIcon className="w-4 h-4 text-orange-600" />
            Dokumentasi & Aktivitas Warga Belajar
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Galeri Kegiatan <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-600">PKBM Bina Insani Sumowono</span>
          </h2>
          <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
            Potret nyata proses pembelajaran kesetaraan, pelatihan vokasi terapan, ujian UPK/ANBK, dan kemandirian wirausaha warga belajar di Kecamatan Sumowono.
          </p>

          {onOpenAdmin && (
            <div className="pt-2">
              <button
                onClick={onOpenAdmin}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-amber-300 font-extrabold text-xs shadow-md shadow-stone-950/20 transition-all cursor-pointer border border-orange-500/40"
              >
                <PlusCircle className="w-4 h-4 text-orange-400" />
                <span>Upload Foto Dokumentasi Baru (Admin)</span>
              </button>
            </div>
          )}
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-950/20'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGallery.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              onClick={() => setSelectedPhoto(item)}
              className="group bg-white rounded-3xl overflow-hidden border border-stone-200 shadow-sm hover:shadow-xl hover:border-orange-300 transition-all duration-300 cursor-pointer flex flex-col justify-between"
            >
              <div className="relative h-60 overflow-hidden bg-stone-100">
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
                <div className="p-4 bg-stone-50 border-t border-stone-100">
                  <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {filteredGallery.length === 0 && (
          <div className="text-center py-16 px-4 bg-white rounded-3xl border border-stone-200 shadow-sm max-w-xl mx-auto space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-700 flex items-center justify-center mx-auto">
              <Camera className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-800">
              {gallery.length === 0 ? 'Belum Ada Foto Kegiatan' : 'Belum ada foto dalam kategori ini'}
            </h3>
            <p className="text-stone-500 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
              {gallery.length === 0
                ? 'Dokumentasi foto kegiatan pembelajaran dan pelatihan vokasi akan segera diunggah.'
                : 'Silakan pilih kategori galeri lain di atas.'}
            </p>
          </div>
        )}

      </div>

      {/* Lightbox / Full Photo Preview Modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl border border-stone-700 relative"
          >
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="max-h-[65vh] bg-slate-950 flex items-center justify-center overflow-hidden">
              <img
                src={selectedPhoto.image}
                alt={selectedPhoto.title}
                className="w-full h-full max-h-[65vh] object-contain"
              />
            </div>

            <div className="p-6 space-y-3 bg-white">
              <div className="flex items-center gap-2 text-xs">
                <span className="px-2.5 py-0.5 rounded-md bg-orange-100 text-orange-900 font-bold">
                  {selectedPhoto.category}
                </span>
                <span className="text-stone-400">•</span>
                <span className="text-stone-500 font-medium">{selectedPhoto.date}</span>
              </div>

              <h3 className="text-xl font-black text-slate-900 leading-snug">
                {selectedPhoto.title}
              </h3>

              {selectedPhoto.description && (
                <p className="text-stone-600 text-sm leading-relaxed">
                  {selectedPhoto.description}
                </p>
              )}

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setSelectedPhoto(null)}
                  className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  Tutup Foto
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

    </section>
  );
};
