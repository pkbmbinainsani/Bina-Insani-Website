import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  GraduationCap,
  Plus,
  Edit3,
  Trash2,
  Save,
  CheckCircle,
  Clock,
  Users,
  Calendar,
  Image as ImageIcon,
  BookOpen,
  X,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { usePKBM } from '../../../context/PKBMContext';
import { Program } from '../../../types';

interface ProgramsCmsTabProps {
  onShowToast: (msg: string) => void;
}

export const ProgramsCmsTab: React.FC<ProgramsCmsTabProps> = ({ onShowToast }) => {
  const { programs, updateProgram, addProgram, deleteProgram } = usePKBM();

  const [editingProgram, setEditingProgram] = useState<Program | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  // Form State
  const [formData, setFormData] = useState<Program>({
    id: '',
    code: 'Paket C',
    title: 'Program Paket C (Setara SMA/MA)',
    subtitle: 'Pendidikan Kesetaraan Tingkat Menengah Atas',
    description: '',
    equivalency: 'Setara SMA / MA',
    targetAge: 'Minimal 15 Tahun s.d Dewasa',
    duration: '3 Tahun (Fleksibel)',
    schedule: ['Sabtu - Minggu: Tatap Muka', 'Senin - Jumat: E-Modul Daring'],
    features: ['Ijazah Resmi Kemendikbud', 'Pelatihan Komputer & Desain', 'Persiapan Kuliah / Kerja'],
    iconName: 'GraduationCap',
    color: 'from-purple-600 to-indigo-700',
    badgeBg: 'bg-purple-100 text-purple-800',
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=1000'
  });

  const [scheduleInput, setScheduleInput] = useState('');
  const [featureInput, setFeatureInput] = useState('');

  const handleOpenEdit = (prog: Program) => {
    setEditingProgram(prog);
    setIsAddingNew(false);
    setFormData({ ...prog });
    setScheduleInput('');
    setFeatureInput('');
  };

  const handleOpenAdd = () => {
    setEditingProgram(null);
    setIsAddingNew(true);
    setFormData({
      id: 'prog-' + Date.now(),
      code: 'Paket Baru',
      title: 'Program Paket Baru',
      subtitle: 'Pendidikan Kesetaraan / Kursus',
      description: 'Deskripsi lengkap tentang kurikulum, target capaian, dan metode belajar program ini.',
      equivalency: 'Setara Formal',
      targetAge: 'Bebas Usia',
      duration: 'Fleksibel',
      schedule: ['Jadwal Fleksibel Daring & Luring'],
      features: ['Ijazah / Sertifikat Resmi', 'Bimbingan Tutor Berpengalaman', 'Modul Belajar Lengkap'],
      iconName: 'GraduationCap',
      color: 'from-emerald-600 to-teal-700',
      badgeBg: 'bg-emerald-100 text-emerald-800',
      image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=1000'
    });
    setScheduleInput('');
    setFeatureInput('');
  };

  const handleCloseForm = () => {
    setEditingProgram(null);
    setIsAddingNew(false);
  };

  // Schedule Helpers
  const handleAddSchedule = () => {
    if (!scheduleInput.trim()) return;
    setFormData({
      ...formData,
      schedule: [...formData.schedule, scheduleInput.trim()]
    });
    setScheduleInput('');
  };

  const handleDeleteSchedule = (index: number) => {
    setFormData({
      ...formData,
      schedule: formData.schedule.filter((_, idx) => idx !== index)
    });
  };

  // Feature Helpers
  const handleAddFeature = () => {
    if (!featureInput.trim()) return;
    setFormData({
      ...formData,
      features: [...formData.features, featureInput.trim()]
    });
    setFeatureInput('');
  };

  const handleDeleteFeature = (index: number) => {
    setFormData({
      ...formData,
      features: formData.features.filter((_, idx) => idx !== index)
    });
  };

  // Save Program
  const handleSaveProgram = (e: React.FormEvent) => {
    e.preventDefault();
    if (isAddingNew) {
      addProgram(formData);
      onShowToast(`Program "${formData.title}" berhasil ditambahkan!`);
    } else if (editingProgram) {
      updateProgram(editingProgram.id, formData);
      onShowToast(`Program "${formData.title}" berhasil diperbarui!`);
    }
    handleCloseForm();
  };

  const handleDeleteConfirm = (id: string, title: string) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus program "${title}"?`)) {
      deleteProgram(id);
      onShowToast(`Program "${title}" berhasil dihapus.`);
    }
  };

  return (
    <div className="space-y-8 pb-10">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-800 text-white p-6 rounded-2xl shadow flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-200 text-xs font-bold uppercase tracking-wider mb-1">
            <GraduationCap className="w-4 h-4" />
            CMS Kurikulum & Program Belajar Kesetaraan
          </div>
          <h2 className="text-2xl font-black">Kelola Program Belajar (Paket A, B, C)</h2>
          <p className="text-emerald-100 text-xs sm:text-sm mt-1">
            Atur informasi program, ekuivalensi, target usia, lama studi, jadwal belajar, dan foto sampul tiap paket.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm transition-all shadow-md flex items-center gap-2 shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Program Baru</span>
        </button>
      </div>

      {/* Programs List Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {programs.map((prog) => (
          <div
            key={prog.id}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow"
          >
            <div>
              {/* Card Image Banner */}
              <div className="relative h-44 overflow-hidden">
                <img
                  src={prog.image}
                  alt={prog.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
                <div className="absolute top-3 left-3">
                  <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-600 text-white shadow">
                    {prog.equivalency}
                  </span>
                </div>
                <div className="absolute bottom-3 left-3 right-3 text-white font-black text-lg leading-snug">
                  {prog.title}
                </div>
              </div>

              {/* Card Meta Body */}
              <div className="p-5 space-y-4">
                <p className="text-slate-600 text-xs leading-relaxed line-clamp-2">
                  {prog.description}
                </p>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1.5 text-xs text-slate-700">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Target Usia:</span>
                    <span className="font-bold text-slate-900">{prog.targetAge}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Lama Studi:</span>
                    <span className="font-bold text-slate-900">{prog.duration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Fitur Unggulan:</span>
                    <span className="font-bold text-emerald-700">{prog.features.length} Keunggulan</span>
                  </div>
                </div>

                {/* Features Pill List */}
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Keunggulan Program:
                  </span>
                  <ul className="space-y-1 text-xs text-slate-600">
                    {prog.features.slice(0, 3).map((f, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="truncate">{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
              <button
                onClick={() => handleOpenEdit(prog)}
                className="flex-1 py-2 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Program</span>
              </button>
              <button
                onClick={() => handleDeleteConfirm(prog.id, prog.title)}
                className="p-2 rounded-xl text-rose-600 hover:bg-rose-50 border border-slate-200 transition-colors cursor-pointer"
                title="Hapus Program"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit / Add Modal */}
      <AnimatePresence>
        {(editingProgram || isAddingNew) && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 p-6 sm:p-8 relative my-8"
            >
              <button
                onClick={handleCloseForm}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900">
                    {isAddingNew ? 'Tambah Program Belajar Baru' : `Edit ${formData.title}`}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Lengkapi form rincian program kesetaraan di bawah ini.
                  </p>
                </div>
              </div>

              <form onSubmit={handleSaveProgram} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Kode Program</label>
                    <input
                      type="text"
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                      placeholder="Contoh: Paket A / Paket B / Paket C"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 text-sm font-bold"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Ekuivalensi</label>
                    <input
                      type="text"
                      value={formData.equivalency}
                      onChange={(e) => setFormData({ ...formData, equivalency: e.target.value })}
                      placeholder="Contoh: Setara SD / Setara SMP / Setara SMA"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 text-sm font-bold"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Judul Lengkap Program</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Contoh: Program Paket C (Setara SMA/MA)"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 text-sm font-bold"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Sub-Judul / Keterangan Singkat</label>
                  <input
                    type="text"
                    value={formData.subtitle}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                    placeholder="Pendidikan Kesetaraan Tingkat Menengah Atas"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Deskripsi Lengkap Program</label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Tuliskan tujuan belajar, sasaran siswa, dan materi pokok..."
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 text-xs leading-relaxed"
                    required
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Target Usia</label>
                    <input
                      type="text"
                      value={formData.targetAge}
                      onChange={(e) => setFormData({ ...formData, targetAge: e.target.value })}
                      placeholder="Contoh: Usia 15 - Dewasa (Tanpa Batas Usia)"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Lama Studi</label>
                    <input
                      type="text"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      placeholder="Contoh: 3 Tahun / Penyesuaian Rapor"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 text-sm"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">URL Foto Sampul Program</label>
                  <input
                    type="url"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 text-xs font-mono"
                    required
                  />
                </div>

                {/* Schedule Management */}
                <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50 space-y-2">
                  <label className="block text-xs font-bold text-slate-800">
                    Jadwal Belajar ({formData.schedule.length} Item)
                  </label>
                  <div className="space-y-1.5">
                    {formData.schedule.map((sch, i) => (
                      <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200 text-xs">
                        <span>{sch}</span>
                        <button
                          type="button"
                          onClick={() => handleDeleteSchedule(i)}
                          className="text-rose-600 hover:text-rose-800 cursor-pointer p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2 pt-1">
                    <input
                      type="text"
                      value={scheduleInput}
                      onChange={(e) => setScheduleInput(e.target.value)}
                      placeholder="Tambah jadwal (cth: Minggu: Kelas Tatap Muka)..."
                      className="flex-1 px-3 py-1.5 rounded-lg border border-slate-300 text-xs"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddSchedule();
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={handleAddSchedule}
                      className="px-3 py-1.5 rounded-lg bg-emerald-700 text-white font-bold text-xs cursor-pointer"
                    >
                      Tambah
                    </button>
                  </div>
                </div>

                {/* Features Management */}
                <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50 space-y-2">
                  <label className="block text-xs font-bold text-slate-800">
                    Fitur & Keunggulan Program ({formData.features.length} Item)
                  </label>
                  <div className="space-y-1.5">
                    {formData.features.map((feat, i) => (
                      <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200 text-xs">
                        <span>{feat}</span>
                        <button
                          type="button"
                          onClick={() => handleDeleteFeature(i)}
                          className="text-rose-600 hover:text-rose-800 cursor-pointer p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2 pt-1">
                    <input
                      type="text"
                      value={featureInput}
                      onChange={(e) => setFeatureInput(e.target.value)}
                      placeholder="Tambah keunggulan (cth: Bimbingan Karir & Magang)..."
                      className="flex-1 px-3 py-1.5 rounded-lg border border-slate-300 text-xs"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddFeature();
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={handleAddFeature}
                      className="px-3 py-1.5 rounded-lg bg-emerald-700 text-white font-bold text-xs cursor-pointer"
                    >
                      Tambah
                    </button>
                  </div>
                </div>

                {/* Form Buttons */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={handleCloseForm}
                    className="px-5 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md flex items-center gap-2 cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>Simpan Program</span>
                  </button>
                </div>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
