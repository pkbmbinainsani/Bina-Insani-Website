import React, { useState } from 'react';
import {
  Sliders,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  Sparkles,
  Image as ImageIcon,
  Clock,
  ExternalLink,
  ChevronUp,
  ChevronDown,
  Layers,
  Info,
  Calendar,
  Eye,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { usePKBM } from '../../../context/PKBMContext';
import { HeroSlide, HeroSlidePill } from '../../../types';

interface HeroSlidesCmsTabProps {
  onShowToast: (msg: string) => void;
}

const PRESET_IMAGES = [
  {
    name: 'Ruang Belajar & Diskusi',
    url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1000&q=80'
  },
  {
    name: 'Ujian & Ijazah Resmi',
    url: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1000&q=80'
  },
  {
    name: 'Praktik Vokasi & Keterampilan',
    url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=80'
  },
  {
    name: 'Pelatihan Komputer & Desain',
    url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=1000&q=80'
  },
  {
    name: 'Wisuda & Kelulusan Siswa',
    url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=1000&q=80'
  }
];

export const HeroSlidesCmsTab: React.FC<HeroSlidesCmsTabProps> = ({ onShowToast }) => {
  const {
    heroSlides,
    addHeroSlide,
    updateHeroSlide,
    deleteHeroSlide,
    reorderHeroSlides,
    slideAutoplayDuration,
    setSlideAutoplayDuration
  } = usePKBM();

  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null);
  const [isAddingNew, setIsAddingNew] = useState<boolean>(false);
  const [previewSlideId, setPreviewSlideId] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState<HeroSlide>({
    id: '',
    title: '',
    subtitle: '',
    badge: '',
    pills: [],
    notice: '',
    image: '',
    domain: 'pkbmbinainsani.sch.id'
  });

  // Temporary pill inputs for editor
  const [tempPills, setTempPills] = useState<HeroSlidePill[]>([]);
  const [newPillLabel, setNewPillLabel] = useState('');
  const [newPillValue, setNewPillValue] = useState('');

  const handleStartEdit = (slide: HeroSlide) => {
    setIsAddingNew(false);
    setEditingSlide(slide);
    setFormData({ ...slide });
    setTempPills([...slide.pills]);
  };

  const handleStartAdd = () => {
    const newId = 'slide-' + Date.now();
    const blankSlide: HeroSlide = {
      id: newId,
      title: 'PENDAFTARAN WARGA BELAJAR BARU',
      subtitle: 'Tahun Ajaran 2026/2027',
      badge: 'PKBM BINA INSANI SUMOWONO',
      pills: [
        { label: 'Paket A, B, & C', value: 'Bebas Biaya Pendidikan SPP' },
        { label: 'Kelas Vokasi', value: 'Sertifikat Keterampilan Kerja' }
      ],
      notice: 'Daftarkan diri Anda sekarang juga dan raih ijazah resmi negara setara formal.',
      image: PRESET_IMAGES[0].url,
      domain: 'pkbmbinainsani.sch.id'
    };
    setIsAddingNew(true);
    setEditingSlide(blankSlide);
    setFormData(blankSlide);
    setTempPills([...blankSlide.pills]);
  };

  const handleAddPill = () => {
    if (!newPillLabel.trim() || !newPillValue.trim()) {
      alert('Mohon isi label dan keterangan jadwal/informasi pill.');
      return;
    }
    setTempPills([...tempPills, { label: newPillLabel.trim(), value: newPillValue.trim() }]);
    setNewPillLabel('');
    setNewPillValue('');
  };

  const handleRemovePill = (idx: number) => {
    setTempPills(tempPills.filter((_, i) => i !== idx));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert('Judul banner tidak boleh kosong.');
      return;
    }

    const payload: HeroSlide = {
      ...formData,
      pills: tempPills
    };

    if (isAddingNew) {
      addHeroSlide(payload);
      onShowToast('Banner slide baru berhasil ditambahkan!');
    } else if (editingSlide) {
      updateHeroSlide(editingSlide.id, payload);
      onShowToast('Perubahan banner slide berhasil disimpan!');
    }

    setEditingSlide(null);
    setIsAddingNew(false);
  };

  const handleDelete = (id: string, title: string) => {
    if (heroSlides.length <= 1) {
      alert('Minimal harus ada 1 banner slide utama.');
      return;
    }
    if (window.confirm(`Yakin ingin menghapus banner slide "${title}"?`)) {
      deleteHeroSlide(id);
      onShowToast('Banner slide telah dihapus.');
    }
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const newItems = [...heroSlides];
    const temp = newItems[index - 1];
    newItems[index - 1] = newItems[index];
    newItems[index] = temp;
    reorderHeroSlides(newItems);
    onShowToast('Urutan banner diperbarui.');
  };

  const handleMoveDown = (index: number) => {
    if (index === heroSlides.length - 1) return;
    const newItems = [...heroSlides];
    const temp = newItems[index + 1];
    newItems[index + 1] = newItems[index];
    newItems[index] = temp;
    reorderHeroSlides(newItems);
    onShowToast('Urutan banner diperbarui.');
  };

  return (
    <div className="space-y-6">
      {/* Header Info & Actions */}
      <div className="bg-gradient-to-r from-emerald-900 to-[#004f29] rounded-2xl p-5 text-white border border-emerald-700 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-amber-400 text-slate-950 rounded-xl">
                <Sliders className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-black tracking-tight text-amber-300">
                Kelola Banner Beranda (Halaman Berganti-ganti)
              </h2>
            </div>
            <p className="text-xs text-emerald-100 max-w-2xl leading-relaxed">
              Atur teks headline, sub-judul, kartu info, gambar, serta durasi otomatis bergantinya slide pada bagian atas beranda utama PKBM Bina Insani.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleStartAdd}
              className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg flex items-center gap-2 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Slide Baru</span>
            </button>
          </div>
        </div>

        {/* Autoplay Speed Control */}
        <div className="mt-4 pt-4 border-t border-emerald-700/60 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-200">
            <Clock className="w-4 h-4 text-amber-400" />
            <span>Durasi Ganti Otomatis (Slider Interval):</span>
          </div>

          <div className="flex items-center gap-2">
            {[3, 5, 6, 8, 10].map((sec) => (
              <button
                key={sec}
                onClick={() => {
                  setSlideAutoplayDuration(sec);
                  onShowToast(`Durasi pergantian slide diset ${sec} detik.`);
                }}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  slideAutoplayDuration === sec
                    ? 'bg-amber-400 text-slate-950 shadow-md font-black'
                    : 'bg-emerald-950/80 text-emerald-200 hover:bg-emerald-800'
                }`}
              >
                {sec} Detik
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Slide List */}
      <div className="space-y-4">
        <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
          <Layers className="w-4 h-4 text-[#006633]" />
          Daftar Slide Aktif ({heroSlides.length} Slide)
        </h3>

        <div className="grid gap-4">
          {heroSlides.map((slide, index) => (
            <div
              key={slide.id}
              className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm hover:shadow-md transition-all space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                
                {/* Left: Thumbnail & Main Info */}
                <div className="flex items-start sm:items-center gap-4">
                  <div className="relative w-24 h-20 sm:w-28 sm:h-20 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200 shadow-inner">
                    <img
                      src={slide.image}
                      alt={slide.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-1 left-1 bg-slate-950/80 text-amber-300 px-1.5 py-0.5 rounded text-[10px] font-black">
                      #{index + 1}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-[#006633] px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border border-emerald-200">
                      <Sparkles className="w-3 h-3 text-amber-500" />
                      <span>{slide.badge || 'PKBM BINA INSANI'}</span>
                    </div>

                    <h4 className="text-base font-black text-slate-900 leading-tight">
                      {slide.title}
                    </h4>
                    <p className="text-xs text-emerald-800 font-semibold italic">
                      {slide.subtitle}
                    </p>
                    <p className="text-xs text-slate-500 line-clamp-1">
                      <strong className="text-slate-700">Pemberitahuan:</strong> {slide.notice}
                    </p>
                  </div>
                </div>

                {/* Right: Actions & Ordering */}
                <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
                  <button
                    onClick={() => handleMoveUp(index)}
                    disabled={index === 0}
                    className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Pindahkan Ke Atas"
                  >
                    <ChevronUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleMoveDown(index)}
                    disabled={index === heroSlides.length - 1}
                    className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Pindahkan Ke Bawah"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleStartEdit(slide)}
                    className="px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-[#006633] rounded-lg font-bold text-xs flex items-center gap-1.5 transition-colors border border-emerald-200"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit Slide</span>
                  </button>

                  <button
                    onClick={() => handleDelete(slide.id, slide.title)}
                    disabled={heroSlides.length <= 1}
                    className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    title="Hapus Slide"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

              </div>

              {/* Pills Preview Tags */}
              {slide.pills && slide.pills.length > 0 && (
                <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2">
                  <span className="text-[11px] font-bold text-slate-400">Pills Info:</span>
                  {slide.pills.map((pill, pIdx) => (
                    <div
                      key={pIdx}
                      className="bg-amber-50 border border-amber-200 text-slate-800 text-[11px] font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1.5"
                    >
                      <Calendar className="w-3 h-3 text-amber-600" />
                      <span className="font-bold text-[#006633]">{pill.label}:</span>
                      <span>{pill.value}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Slide Editor Modal */}
      {editingSlide && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-6 sm:p-7 border border-slate-200 my-8 space-y-6 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-emerald-100 text-[#006633] rounded-xl">
                  <Sliders className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">
                    {isAddingNew ? 'Tambah Slide Banner Baru' : 'Edit Konten Slide Banner'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Sesuaikan judul, badge, teks panggilan aksi, dan gambar latar slide.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setEditingSlide(null)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              
              {/* Badge Tag */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Badge Tag Atas (Kategori / Nama Lembaga)
                </label>
                <input
                  type="text"
                  value={formData.badge}
                  onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                  placeholder="Contoh: PKBM BINA INSANI SUMOWONO"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  required
                />
              </div>

              {/* Title & Subtitle */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Judul Utama Banner (Kotak Kuning)
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Contoh: PENDAFTARAN WARGA BELAJAR"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-black focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Sub-Judul / Gelombang
                  </label>
                  <input
                    type="text"
                    value={formData.subtitle}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                    placeholder="Contoh: Tahun Ajaran 2026/2027"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Notice Box */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Teks Info Khusus / Keuntungan Belajar (Notice Box)
                </label>
                <textarea
                  rows={2}
                  value={formData.notice}
                  onChange={(e) => setFormData({ ...formData, notice: e.target.value })}
                  placeholder="Contoh: Bagi warga belajar yang mendaftar awal akan mendapatkan e-modul & perlengkapan belajar gratis!"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              {/* Image URL & Preset Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  URL Foto Banner (Gambar Samping)
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    required
                  />
                </div>

                {/* Preset image suggestions */}
                <div className="mt-2 flex flex-wrap items-center gap-1.5">
                  <span className="text-[11px] font-bold text-slate-400">Pilihan Gambar Cepat:</span>
                  {PRESET_IMAGES.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setFormData({ ...formData, image: preset.url })}
                      className={`text-[11px] px-2 py-1 rounded-lg border transition-all ${
                        formData.image === preset.url
                          ? 'bg-emerald-100 text-[#006633] border-emerald-300 font-bold'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {preset.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Domain / Teks Bawah Gambar */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Domain / Teks Footer Gambar
                </label>
                <input
                  type="text"
                  value={formData.domain}
                  onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                  placeholder="pkbmbinainsani.sch.id"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              {/* Pills Manager */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <label className="block text-xs font-black text-slate-800 uppercase tracking-wide">
                  Pill Kartu Informasi Tambahan (Jadwal / Keunggulan)
                </label>

                <div className="space-y-2">
                  {tempPills.map((pill, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between gap-2 bg-white p-2.5 rounded-xl border border-slate-200 shadow-xs"
                    >
                      <div className="text-xs">
                        <span className="font-extrabold text-[#006633]">{pill.label}: </span>
                        <span className="font-medium text-slate-700">{pill.value}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemovePill(idx)}
                        className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded"
                        title="Hapus Pill"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add new pill input */}
                <div className="pt-2 border-t border-slate-200 grid sm:grid-cols-12 gap-2">
                  <input
                    type="text"
                    value={newPillLabel}
                    onChange={(e) => setNewPillLabel(e.target.value)}
                    placeholder="Label (misal: Paket A, B, C)"
                    className="sm:col-span-5 px-3 py-1.5 rounded-lg border border-slate-300 text-xs focus:outline-none"
                  />
                  <input
                    type="text"
                    value={newPillValue}
                    onChange={(e) => setNewPillValue(e.target.value)}
                    placeholder="Keterangan (misal: 1 Juli - 31 Agust)"
                    className="sm:col-span-5 px-3 py-1.5 rounded-lg border border-slate-300 text-xs focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddPill}
                    className="sm:col-span-2 px-3 py-1.5 bg-[#006633] hover:bg-emerald-800 text-white rounded-lg font-bold text-xs flex items-center justify-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tambah</span>
                  </button>
                </div>
              </div>

              {/* Form Action Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingSlide(null)}
                  className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#006633] hover:bg-emerald-800 text-white text-xs font-black rounded-xl shadow-md flex items-center gap-2 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Simpan Perubahan</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
};
