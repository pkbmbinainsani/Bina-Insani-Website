import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  HelpCircle,
  Plus,
  Edit3,
  Trash2,
  Save,
  X,
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { usePKBM } from '../../../context/PKBMContext';
import { FAQItem } from '../../../types';

interface FaqCmsTabProps {
  onShowToast: (msg: string) => void;
}

export const FaqCmsTab: React.FC<FaqCmsTabProps> = ({ onShowToast }) => {
  const { faqs, updateFaq, addFaq, deleteFaq } = usePKBM();

  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  const [formData, setFormData] = useState<FAQItem>({
    question: '',
    answer: '',
    category: 'Umum'
  });

  const handleOpenAdd = () => {
    setEditingIndex(null);
    setIsAddingNew(true);
    setFormData({
      question: 'Apakah ada fasilitas modul dan bimbingan online?',
      answer: 'Ya, seluruh warga belajar mendapatkan akses e-modul kurikulum merdeka dan grup bimbingan dengan para tutor.',
      category: 'Pembelajaran'
    });
  };

  const handleOpenEdit = (index: number) => {
    setEditingIndex(index);
    setIsAddingNew(false);
    setFormData({ ...faqs[index] });
  };

  const handleCloseForm = () => {
    setEditingIndex(null);
    setIsAddingNew(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isAddingNew) {
      addFaq(formData);
      onShowToast('Pertanyaan FAQ baru berhasil ditambahkan!');
    } else if (editingIndex !== null) {
      updateFaq(editingIndex, formData);
      onShowToast('Pertanyaan FAQ berhasil diperbarui!');
    }
    handleCloseForm();
  };

  const handleDeleteConfirm = (index: number, question: string) => {
    if (window.confirm(`Hapus pertanyaan FAQ "${question}"?`)) {
      deleteFaq(index);
      onShowToast('Pertanyaan FAQ berhasil dihapus.');
    }
  };

  return (
    <div className="space-y-8 pb-10">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-800 text-white p-6 rounded-2xl shadow flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-200 text-xs font-bold uppercase tracking-wider mb-1">
            <HelpCircle className="w-4 h-4" />
            CMS Tanya Jawab & Informasi Umum
          </div>
          <h2 className="text-2xl font-black">Kelola FAQ ({faqs.length} Pertanyaan)</h2>
          <p className="text-emerald-100 text-xs sm:text-sm mt-1">
            Daftar pertanyaan umum seputar keabsahan ijazah, fleksibilitas belajar, dan persyaratan pendaftaran.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm transition-all shadow-md flex items-center gap-2 shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Pertanyaan FAQ</span>
        </button>
      </div>

      {/* FAQ List */}
      <div className="space-y-4">
        {faqs.map((faq, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          >
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  {faq.category}
                </span>
                <span className="text-xs text-slate-400">Pertanyaan #{idx + 1}</span>
              </div>
              <h3 className="font-extrabold text-slate-900 text-base">
                {faq.question}
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                {faq.answer}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
              <button
                onClick={() => handleOpenEdit(idx)}
                className="py-1.5 px-3 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-1 cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
              <button
                onClick={() => handleDeleteConfirm(idx, faq.question)}
                className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg border border-slate-200 cursor-pointer"
                title="Hapus FAQ"
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
                  <HelpCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900">
                    {isAddingNew ? 'Tambah Pertanyaan FAQ' : 'Edit Pertanyaan FAQ'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Lengkapi pertanyaan dan jawaban yang informatif.
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Kategori FAQ</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 text-sm"
                  >
                    <option value="Umum">Umum & Legalitas Ijazah</option>
                    <option value="Pendaftaran">Pendaftaran & Syarat</option>
                    <option value="Pembelajaran">Sistem & Jadwal Belajar</option>
                    <option value="Masa Depan">Kuliah & Karir Lulusan</option>
                    <option value="Biaya">Biaya & Fasilitas</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Pertanyaan (Question)</label>
                  <input
                    type="text"
                    value={formData.question}
                    onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                    placeholder="Contoh: Apakah ijazah Paket C bisa dipakai untuk daftar kuliah?"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 text-sm font-bold"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Jawaban Lengkap (Answer)</label>
                  <textarea
                    rows={4}
                    value={formData.answer}
                    onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                    placeholder="Tuliskan jawaban yang jelas dan meyakinkan..."
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 text-xs leading-relaxed"
                    required
                  />
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
                    <span>Simpan FAQ</span>
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
