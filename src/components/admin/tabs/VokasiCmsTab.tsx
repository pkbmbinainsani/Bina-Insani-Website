import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Wrench,
  Plus,
  Edit3,
  Trash2,
  Save,
  Laptop,
  Utensils,
  Palette,
  TrendingUp,
  Scissors,
  Award,
  Sparkles,
  X,
  CheckCircle2
} from 'lucide-react';
import { usePKBM } from '../../../context/PKBMContext';
import { VokasiProgram } from '../../../types';

interface VokasiCmsTabProps {
  onShowToast: (msg: string) => void;
}

const AVAILABLE_ICONS = [
  { name: 'Laptop', label: 'Komputer & IT', icon: <Laptop className="w-5 h-5" /> },
  { name: 'Utensils', label: 'Tata Boga & Kuliner', icon: <Utensils className="w-5 h-5" /> },
  { name: 'Palette', label: 'Kerajinan & Desain', icon: <Palette className="w-5 h-5" /> },
  { name: 'TrendingUp', label: 'Bisnis & Wirausaha', icon: <TrendingUp className="w-5 h-5" /> },
  { name: 'Scissors', label: 'Tata Busana & Menjahit', icon: <Scissors className="w-5 h-5" /> },
  { name: 'Wrench', label: 'Teknik & Otomotif', icon: <Wrench className="w-5 h-5" /> }
];

export const VokasiCmsTab: React.FC<VokasiCmsTabProps> = ({ onShowToast }) => {
  const { vokasiPrograms, updateVokasiProgram, addVokasiProgram, deleteVokasiProgram } = usePKBM();

  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  const [formData, setFormData] = useState<VokasiProgram>({
    title: '',
    description: '',
    icon: 'Laptop',
    duration: '2 Bulan',
    output: 'Sertifikat Kompetensi & Siap Wirausaha'
  });

  const handleOpenAdd = () => {
    setEditingIndex(null);
    setIsAddingNew(true);
    setFormData({
      title: 'Pelatihan Barista & Kopi Lokal',
      description: 'Teknik seduh kopi manual, pengoperasian mesin espresso, dan manajemen kedai kopi kekinian.',
      icon: 'Utensils',
      duration: '1.5 Bulan',
      output: 'Keahlian Barista & Usaha Mandiri'
    });
  };

  const handleOpenEdit = (index: number) => {
    setEditingIndex(index);
    setIsAddingNew(false);
    setFormData({ ...vokasiPrograms[index] });
  };

  const handleCloseForm = () => {
    setEditingIndex(null);
    setIsAddingNew(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isAddingNew) {
      addVokasiProgram(formData);
      onShowToast(`Program Vokasi "${formData.title}" berhasil ditambahkan!`);
    } else if (editingIndex !== null) {
      updateVokasiProgram(editingIndex, formData);
      onShowToast(`Program Vokasi "${formData.title}" berhasil diperbarui!`);
    }
    handleCloseForm();
  };

  const handleDeleteConfirm = (index: number, title: string) => {
    if (window.confirm(`Hapus program vokasi "${title}"?`)) {
      deleteVokasiProgram(index);
      onShowToast(`Program Vokasi "${title}" berhasil dihapus.`);
    }
  };

  return (
    <div className="space-y-8 pb-10">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-800 text-white p-6 rounded-2xl shadow flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-200 text-xs font-bold uppercase tracking-wider mb-1">
            <Wrench className="w-4 h-4" />
            CMS Pelatihan Keterampilan & Wirausaha
          </div>
          <h2 className="text-2xl font-black">Kelola Program Vokasi ({vokasiPrograms.length} Kelas)</h2>
          <p className="text-emerald-100 text-xs sm:text-sm mt-1">
            Atur kursus vokasi gratis yang dibekalkan kepada warga belajar PKBM Bina Insani Sumowono.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm transition-all shadow-md flex items-center gap-2 shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Pelatihan Vokasi</span>
        </button>
      </div>

      {/* Vokasi Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {vokasiPrograms.map((vok, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  {vok.duration}
                </span>
                <span className="text-xs text-slate-400 font-mono">Ikon: {vok.icon}</span>
              </div>

              <h3 className="font-bold text-slate-900 text-base leading-snug">
                {vok.title}
              </h3>

              <p className="text-slate-600 text-xs leading-relaxed line-clamp-3">
                {vok.description}
              </p>

              <div className="pt-2 border-t border-slate-100 text-xs text-emerald-700 font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-600" />
                <span className="truncate">{vok.output}</span>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between gap-2">
              <button
                onClick={() => handleOpenEdit(idx)}
                className="flex-1 py-1.5 px-3 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center gap-1 cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
              <button
                onClick={() => handleDeleteConfirm(idx, vok.title)}
                className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg border border-slate-200 cursor-pointer"
                title="Hapus Vokasi"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit / Add Modal */}
      <AnimatePresence>
        {(editingIndex !== null || isAddingNew) && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 p-6 sm:p-8 relative"
            >
              <button
                onClick={handleCloseForm}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  <Wrench className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900">
                    {isAddingNew ? 'Tambah Program Vokasi Baru' : `Edit ${formData.title}`}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Isi detail pelatihan keahlian praktis di bawah ini.
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Nama Program Pelatihan</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Contoh: Pelatihan Komputer & Desain Grafis"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 text-sm font-bold"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Deskripsi Keterampilan</label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Tuliskan materi praktik, software yang diajarkan, atau keterampilan yang dilatih..."
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 text-xs leading-relaxed"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Durasi Pelatihan</label>
                    <input
                      type="text"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      placeholder="Contoh: 2 Bulan / 24 Pertemuan"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Capaian & Output</label>
                    <input
                      type="text"
                      value={formData.output}
                      onChange={(e) => setFormData({ ...formData, output: e.target.value })}
                      placeholder="Contoh: Sertifikat & Portofolio Kerja"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 text-sm"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">Pilih Ikon Representatif</label>
                  <div className="grid grid-cols-3 gap-2">
                    {AVAILABLE_ICONS.map((ic) => (
                      <button
                        key={ic.name}
                        type="button"
                        onClick={() => setFormData({ ...formData, icon: ic.name })}
                        className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 text-center transition-all cursor-pointer ${
                          formData.icon === ic.name
                            ? 'border-emerald-600 bg-emerald-50 text-emerald-800 font-bold'
                            : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                        }`}
                      >
                        {ic.icon}
                        <span className="text-[10px] leading-tight">{ic.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={handleCloseForm}
                    className="px-5 py-2 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md flex items-center gap-2 cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>Simpan Vokasi</span>
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
