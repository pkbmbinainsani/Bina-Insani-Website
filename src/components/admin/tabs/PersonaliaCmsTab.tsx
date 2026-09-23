import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Users,
  Award,
  Building2,
  GraduationCap,
  Briefcase,
  Plus,
  Edit3,
  Trash2,
  Save,
  X,
  Search,
  Upload,
  Image as ImageIcon,
  RotateCcw,
  Sparkles,
  CheckCircle,
  Mail,
  Phone,
  BookOpen,
  FileSpreadsheet
} from 'lucide-react';
import { usePKBM } from '../../../context/PKBMContext';
import { PersonaliaCategory, PersonaliaMember } from '../../../types';
import { ImportPersonaliaCsvModal } from './ImportPersonaliaCsvModal';
import { sortPersonaliaMembers } from '../../../utils/personaliaHelper';

interface PersonaliaCmsTabProps {
  onShowToast: (msg: string) => void;
}

const CATEGORY_OPTIONS: { value: PersonaliaCategory; label: string; icon: React.ElementType }[] = [
  { value: 'pendiri', label: 'Pendiri & Dewan Pembina', icon: Award },
  { value: 'yayasan', label: 'Pengurus Yayasan', icon: Building2 },
  { value: 'pendidik', label: 'Pendidik & Tutor Kesetaraan', icon: GraduationCap },
  { value: 'tendik', label: 'Tenaga Kependidikan (Tendik)', icon: Briefcase }
];

const PHOTO_PRESETS = [
  {
    label: 'Tutor Pria Dewasa (Pendidikan)',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80'
  },
  {
    label: 'Tutor Wanita Berhijab / Formal',
    url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80'
  },
  {
    label: 'Pimpinan & Pengurus Pria',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80'
  },
  {
    label: 'Sekretaris / Pengurus Wanita',
    url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80'
  },
  {
    label: 'Tutor Komputer / Muda',
    url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80'
  },
  {
    label: 'Tutor Guru Perempuan Muda',
    url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80'
  },
  {
    label: 'Operator / Tendik Pria',
    url: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=600&q=80'
  },
  {
    label: 'Bendahara / Tendik Wanita',
    url: 'https://images.unsplash.com/photo-1534751516642-a171edd2521d?auto=format&fit=crop&w=600&q=80'
  }
];

export const PersonaliaCmsTab: React.FC<PersonaliaCmsTabProps> = ({ onShowToast }) => {
  const { personalia, addPersonalia, updatePersonalia, deletePersonalia, resetPersonalia } = usePKBM();

  const [filterCategory, setFilterCategory] = useState<PersonaliaCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCsvModalOpen, setIsCsvModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleCsvImportSuccess = (count: number, mode: 'append' | 'replace') => {
    onShowToast(
      `Berhasil mengimpor ${count} data personalia (${mode === 'append' ? 'Ditambahkan' : 'Ganti Seluruh Data'})!`
    );
  };

  // Form State
  const [formData, setFormData] = useState<Omit<PersonaliaMember, 'id'>>({
    name: '',
    role: '',
    category: 'pendidik',
    education: '',
    specialization: '',
    nuptkOrNip: '',
    bio: '',
    photo: PHOTO_PRESETS[0].url,
    phone: '',
    email: '',
    order: 1
  });

  // Filtered and Sorted List: Pendiri -> Pengelola -> Tutor, dan berdasarkan nomor ID pegawai
  const filteredList = useMemo(() => {
    const list = personalia.filter((item) => {
      const matchCat = filterCategory === 'all' || item.category === filterCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.role.toLowerCase().includes(q) ||
        (item.specialization && item.specialization.toLowerCase().includes(q)) ||
        (item.education && item.education.toLowerCase().includes(q)) ||
        (item.nuptkOrNip && item.nuptkOrNip.toLowerCase().includes(q));

      return matchCat && matchSearch;
    });

    return sortPersonaliaMembers(list);
  }, [personalia, filterCategory, searchQuery]);

  // Counts
  const counts = useMemo(() => {
    return {
      all: personalia.length,
      pendiri: personalia.filter((p) => p.category === 'pendiri').length,
      yayasan: personalia.filter((p) => p.category === 'yayasan').length,
      pendidik: personalia.filter((p) => p.category === 'pendidik').length,
      tendik: personalia.filter((p) => p.category === 'tendik').length
    };
  }, [personalia]);

  // Open Add Modal
  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({
      name: '',
      role: '',
      category: filterCategory === 'all' ? 'pendidik' : filterCategory,
      education: 'S1 Pendidikan',
      specialization: '',
      nuptkOrNip: '',
      bio: '',
      photo: PHOTO_PRESETS[0].url,
      phone: '',
      email: '',
      order: personalia.length + 1
    });
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (item: PersonaliaMember) => {
    setEditingId(item.id);
    setFormData({
      name: item.name,
      role: item.role,
      category: item.category,
      education: item.education || '',
      specialization: item.specialization || '',
      nuptkOrNip: item.nuptkOrNip || '',
      bio: item.bio || '',
      photo: item.photo,
      phone: item.phone || '',
      email: item.email || '',
      order: item.order || 1
    });
    setIsModalOpen(true);
  };

  // Handle Photo File Upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 3 * 1024 * 1024) {
        alert('Ukuran berkas foto maksimal 3MB');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        setFormData((prev) => ({ ...prev, photo: base64 }));
        onShowToast('Foto berhasil dimuat dari perangkat!');
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Save
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.role.trim()) {
      alert('Nama lengkap dan jabatan wajib diisi!');
      return;
    }

    if (editingId) {
      updatePersonalia(editingId, formData);
      onShowToast(`Data ${formData.name} berhasil diperbarui!`);
    } else {
      addPersonalia(formData);
      onShowToast(`Personalia ${formData.name} berhasil ditambahkan!`);
    }
    setIsModalOpen(false);
  };

  // Handle Delete
  const handleDelete = (item: PersonaliaMember) => {
    if (confirm(`Apakah Anda yakin ingin menghapus data "${item.name}" (${item.role})?`)) {
      deletePersonalia(item.id);
      onShowToast(`Data personalia "${item.name}" telah dihapus.`);
    }
  };

  // Handle Reset
  const handleResetData = () => {
    if (confirm('Apakah Anda ingin memulihkan seluruh data personalia ke susunan standar awal PKBM Bina Insani? Data perubahan sebelumnya akan digantikan.')) {
      resetPersonalia();
      onShowToast('Data personalia berhasil dipulihkan ke pengaturan awal!');
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Banner / Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-black text-[#006633] uppercase tracking-wider">
            <Users className="w-4 h-4" />
            <span>Manajemen Personalia & SDM Lembaga</span>
          </div>
          <h3 className="text-xl font-black text-slate-900 mt-1">
            Data Pendiri, Pengurus Yayasan, Pendidik & Tendik
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Kelola profil tim PKBM Bina Insani secara fleksibel. Perubahan akan langsung tampil di halaman publik.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setIsCsvModalOpen(true)}
            title="Import data personalia massal dari file CSV"
            className="px-3.5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-xs transition-all flex items-center gap-2 shadow-sm hover:shadow cursor-pointer border border-amber-400"
          >
            <FileSpreadsheet className="w-4 h-4 text-slate-950" />
            <span>Import CSV</span>
          </button>

          <button
            onClick={handleResetData}
            title="Reset ke susunan default"
            className="p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border border-slate-300"
          >
            <RotateCcw className="w-4 h-4 text-slate-600" />
            <span className="hidden sm:inline">Reset Default</span>
          </button>

          <button
            onClick={handleOpenAdd}
            className="px-4 py-2.5 rounded-2xl bg-[#006633] hover:bg-[#004d26] text-white text-xs font-black transition-all flex items-center gap-2 shadow-md hover:shadow-lg cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Personalia Baru</span>
          </button>
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div
          onClick={() => setFilterCategory('pendiri')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            filterCategory === 'pendiri'
              ? 'bg-amber-50 border-amber-300 ring-2 ring-amber-400 shadow-sm'
              : 'bg-white border-slate-200 hover:border-amber-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-600">Pendiri & Pembina</span>
            <Award className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-amber-900 mt-1">{counts.pendiri}</div>
          <span className="text-[10px] text-amber-700 font-medium">Tokoh Perintis</span>
        </div>

        <div
          onClick={() => setFilterCategory('yayasan')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            filterCategory === 'yayasan'
              ? 'bg-emerald-50 border-emerald-300 ring-2 ring-emerald-400 shadow-sm'
              : 'bg-white border-slate-200 hover:border-emerald-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-600">Pengurus Yayasan</span>
            <Building2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-900 mt-1">{counts.yayasan}</div>
          <span className="text-[10px] text-emerald-700 font-medium">Tata Kelola & Hukum</span>
        </div>

        <div
          onClick={() => setFilterCategory('pendidik')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            filterCategory === 'pendidik'
              ? 'bg-blue-50 border-blue-300 ring-2 ring-blue-400 shadow-sm'
              : 'bg-white border-slate-200 hover:border-blue-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-600">Pendidik & Tutor</span>
            <GraduationCap className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-blue-900 mt-1">{counts.pendidik}</div>
          <span className="text-[10px] text-blue-700 font-medium">Paket A, B, C & Vokasi</span>
        </div>

        <div
          onClick={() => setFilterCategory('tendik')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            filterCategory === 'tendik'
              ? 'bg-purple-50 border-purple-300 ring-2 ring-purple-400 shadow-sm'
              : 'bg-white border-slate-200 hover:border-purple-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-600">Tenaga Kependidikan</span>
            <Briefcase className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-black text-purple-900 mt-1">{counts.tendik}</div>
          <span className="text-[10px] text-purple-700 font-medium">TU, Dapodik, Lab</span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          <button
            onClick={() => setFilterCategory('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filterCategory === 'all'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Semua ({counts.all})
          </button>

          {CATEGORY_OPTIONS.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setFilterCategory(cat.value)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                filterCategory === cat.value
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <span>{cat.label.split(' ')[0]}</span>
              <span className="text-[10px] opacity-75">({counts[cat.value]})</span>
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama, mapel, posisi..."
            className="w-full pl-9 pr-8 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#006633] focus:bg-white"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Personalia Cards Grid */}
      {filteredList.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 space-y-3">
          <Users className="w-12 h-12 text-slate-300 mx-auto" />
          <h4 className="text-base font-bold text-slate-800">Tidak ada personalia yang ditemukan</h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Gunakan filter lain atau tambahkan personalia baru dengan tombol di atas.
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredList.map((item) => {
            const catMeta = CATEGORY_OPTIONS.find((c) => c.value === item.category) || CATEGORY_OPTIONS[2];
            const CatIcon = catMeta.icon;

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-3 group"
              >
                {/* Header info */}
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-slate-900 shrink-0 border border-slate-200 flex items-center justify-center">
                      <img
                        src={item.photo}
                        alt={item.name}
                        className="w-full h-full object-contain p-0.5"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=600&q=80';
                        }}
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                        <CatIcon className="w-3 h-3 text-[#006633]" />
                        {catMeta.label.split(' ')[0]}
                      </span>
                      <h4 className="text-sm font-black text-slate-900 mt-1 truncate group-hover:text-[#006633] transition-colors">
                        {item.name}
                      </h4>
                      <p className="text-xs font-semibold text-amber-700 truncate">{item.role}</p>
                    </div>
                  </div>

                  {/* Metadata fields */}
                  <div className="space-y-1 text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    {item.education && (
                      <div className="flex items-center gap-1.5 truncate">
                        <GraduationCap className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{item.education}</span>
                      </div>
                    )}

                    {item.specialization && (
                      <div className="flex items-center gap-1.5 truncate">
                        <BookOpen className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{item.specialization}</span>
                      </div>
                    )}

                    {item.nuptkOrNip && (
                      <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-500">
                        <span className="font-bold">ID:</span>
                        <span>{item.nuptkOrNip}</span>
                      </div>
                    )}
                  </div>

                  {item.bio && (
                    <p className="text-[11px] text-slate-500 line-clamp-2 italic">
                      "{item.bio}"
                    </p>
                  )}
                </div>

                {/* Card Actions */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
                  <button
                    onClick={() => handleOpenEdit(item)}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-[#006633]" />
                    <span>Edit</span>
                  </button>

                  <button
                    onClick={() => handleDelete(item)}
                    className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                    <span>Hapus</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ADD / EDIT MODAL FORM */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden text-slate-900"
            >
              {/* Modal Header */}
              <div className="p-5 sm:p-6 bg-slate-900 text-white flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#006633] text-amber-300 flex items-center justify-center font-bold">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-white">
                      {editingId ? 'Edit Data Personalia' : 'Tambah Personalia Baru'}
                    </h3>
                    <p className="text-xs text-slate-300">
                      Lengkapi identitas, posisi, dan foto profil personalia lembaga.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-white/10 text-white hover:bg-white/20 flex items-center justify-center cursor-pointer transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Body Form */}
              <form onSubmit={handleSave} className="overflow-y-auto p-5 sm:p-6 space-y-4">
                {/* 1. Name and Category */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">
                      Nama Lengkap & Gelar <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                      placeholder="Contoh: Drs. H. Mulyadi, M.Pd."
                      className="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-[#006633] focus:ring-1 focus:ring-[#006633]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">
                      Kategori Kelompok <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, category: e.target.value as PersonaliaCategory }))
                      }
                      className="w-full p-2.5 rounded-xl border border-slate-300 text-xs bg-white focus:outline-none focus:border-[#006633]"
                    >
                      {CATEGORY_OPTIONS.map((cat) => (
                        <option key={cat.value} value={cat.value}>
                          {cat.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* 2. Position and Education */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">
                      Jabatan / Posisi di Lembaga <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.role}
                      onChange={(e) => setFormData((prev) => ({ ...prev, role: e.target.value }))}
                      placeholder="Contoh: Ketua PKBM & Tutor Paket C"
                      className="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-[#006633] focus:ring-1 focus:ring-[#006633]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">
                      Kualifikasi Pendidikan Terakhir
                    </label>
                    <input
                      type="text"
                      value={formData.education}
                      onChange={(e) => setFormData((prev) => ({ ...prev, education: e.target.value }))}
                      placeholder="Contoh: S1 Pendidikan Matematika / S2 Manajemen"
                      className="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-[#006633]"
                    />
                  </div>
                </div>

                {/* 3. Specialization and NUPTK/NIP */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">
                      Bidang Pengampu / Keahlian
                    </label>
                    <input
                      type="text"
                      value={formData.specialization}
                      onChange={(e) => setFormData((prev) => ({ ...prev, specialization: e.target.value }))}
                      placeholder="Contoh: Bahasa Indonesia & Kurikulum Merdeka"
                      className="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-[#006633]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">
                      Nomor ID Pegawai / NUPTK / NIP
                    </label>
                    <input
                      type="text"
                      value={formData.nuptkOrNip}
                      onChange={(e) => setFormData((prev) => ({ ...prev, nuptkOrNip: e.target.value }))}
                      placeholder="Contoh: PEG-001, 19650412..., atau 001"
                      className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-mono focus:outline-none focus:border-[#006633]"
                    />
                    <p className="text-[10px] text-slate-500">
                      Digunakan untuk urutan tampil otomatis per kelompok serta tautan langsung.
                    </p>
                  </div>
                </div>

                {/* 4. Contact Email & Phone */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Email Lembaga (Opsional)</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                      placeholder="nama@pkbmbinainsani.sch.id"
                      className="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-[#006633]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">No. WhatsApp (Opsional)</label>
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                      placeholder="+62 852-xxxx-xxxx"
                      className="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-[#006633]"
                    />
                  </div>
                </div>

                {/* 5. Bio / Pesan Singkat */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">
                    Profil Singkat / Pesan Inspiratif
                  </label>
                  <textarea
                    rows={3}
                    value={formData.bio}
                    onChange={(e) => setFormData((prev) => ({ ...prev, bio: e.target.value }))}
                    placeholder="Tuliskan pengalaman dedikasi atau pesan motivasi kepada warga belajar..."
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-[#006633]"
                  />
                </div>

                {/* 6. Photo Management */}
                <div className="space-y-3 pt-2 border-t border-slate-200">
                  <label className="text-xs font-bold text-slate-800 block">
                    Foto Profil Personalia
                  </label>

                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    {/* Live Preview Avatar */}
                    <div className="relative w-20 h-24 rounded-2xl overflow-hidden bg-slate-900 border-2 border-[#006633] shrink-0 shadow-md flex items-center justify-center">
                      <img
                        src={formData.photo}
                        alt="Preview Foto"
                        className="w-full h-full object-contain p-1"
                      />
                    </div>

                    <div className="space-y-2 flex-1 w-full">
                      {/* URL input */}
                      <input
                        type="url"
                        value={formData.photo}
                        onChange={(e) => setFormData((prev) => ({ ...prev, photo: e.target.value }))}
                        placeholder="Tempel tautan URL foto gambar..."
                        className="w-full p-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-[#006633]"
                      />

                      {/* File Upload Button */}
                      <label className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold border border-slate-300 cursor-pointer transition-all">
                        <Upload className="w-3.5 h-3.5 text-[#006633]" />
                        <span>Unggah Foto dari Komputer / HP</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>

                  {/* Preset Selector */}
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[11px] font-bold text-slate-500 block">
                      Atau pilih dari koleksi preset foto tutor:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {PHOTO_PRESETS.map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setFormData((prev) => ({ ...prev, photo: preset.url }))}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold transition-all border cursor-pointer ${
                            formData.photo === preset.url
                              ? 'bg-[#006633] text-white border-[#006633]'
                              : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                          }`}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer"
                  >
                    Batal
                  </button>

                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-[#006633] hover:bg-[#004d26] text-white text-xs font-black transition-all flex items-center gap-2 shadow-md cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>{editingId ? 'Simpan Perubahan' : 'Tambah Personalia'}</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal Import CSV Personalia */}
      <ImportPersonaliaCsvModal
        isOpen={isCsvModalOpen}
        onClose={() => setIsCsvModalOpen(false)}
        onImportSuccess={handleCsvImportSuccess}
      />
    </div>
  );
};
