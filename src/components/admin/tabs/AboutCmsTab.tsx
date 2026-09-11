import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Compass,
  Target,
  Flag,
  Sparkles,
  Plus,
  Trash2,
  Save,
  CheckCircle,
  Building2,
  Edit3,
  HelpCircle
} from 'lucide-react';
import { usePKBM } from '../../../context/PKBMContext';
import { VisiMisi, MottoValue } from '../../../types';

interface AboutCmsTabProps {
  onShowToast: (msg: string) => void;
}

export const AboutCmsTab: React.FC<AboutCmsTabProps> = ({ onShowToast }) => {
  const {
    aboutProfile,
    updateAboutProfile,
    visiMisi,
    updateVisiMisi,
    mottoValues,
    updateMottoValues,
    pkbmInfo
  } = usePKBM();

  // Local Form States
  const [profileText, setProfileText] = useState(aboutProfile);
  const [visiText, setVisiText] = useState(visiMisi.visi);
  const [misiList, setMisiList] = useState<string[]>([...visiMisi.misi]);
  const [newMisiItem, setNewMisiItem] = useState('');
  const [tujuanList, setTujuanList] = useState<string[]>([...visiMisi.tujuan]);
  const [newTujuanItem, setNewTujuanItem] = useState('');
  const [mottos, setMottos] = useState<MottoValue[]>([...mottoValues]);

  // Handlers for Misi
  const handleAddMisi = () => {
    if (!newMisiItem.trim()) return;
    setMisiList([...misiList, newMisiItem.trim()]);
    setNewMisiItem('');
  };

  const handleUpdateMisi = (index: number, val: string) => {
    const updated = [...misiList];
    updated[index] = val;
    setMisiList(updated);
  };

  const handleDeleteMisi = (index: number) => {
    setMisiList(misiList.filter((_, idx) => idx !== index));
  };

  // Handlers for Tujuan
  const handleAddTujuan = () => {
    if (!newTujuanItem.trim()) return;
    setTujuanList([...tujuanList, newTujuanItem.trim()]);
    setNewTujuanItem('');
  };

  const handleUpdateTujuan = (index: number, val: string) => {
    const updated = [...tujuanList];
    updated[index] = val;
    setTujuanList(updated);
  };

  const handleDeleteTujuan = (index: number) => {
    setTujuanList(tujuanList.filter((_, idx) => idx !== index));
  };

  // Handlers for Motto
  const handleUpdateMotto = (index: number, field: keyof MottoValue, val: string) => {
    const updated = [...mottos];
    updated[index] = { ...updated[index], [field]: val };
    setMottos(updated);
  };

  // Save All Handler
  const handleSaveAll = (e: React.FormEvent) => {
    e.preventDefault();
    updateAboutProfile(profileText);
    updateVisiMisi({
      visi: visiText,
      misi: misiList,
      tujuan: tujuanList
    });
    updateMottoValues(mottos);
    onShowToast('Data Profil & Visi Misi Lembaga berhasil diperbarui!');
  };

  return (
    <form onSubmit={handleSaveAll} className="space-y-8 pb-10">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-800 text-white p-6 rounded-2xl shadow flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-200 text-xs font-bold uppercase tracking-wider mb-1">
            <Building2 className="w-4 h-4" />
            CMS Profil Lembaga & Landasan Filosofis
          </div>
          <h2 className="text-2xl font-black">Kelola Bagian "Tentang PKBM"</h2>
          <p className="text-emerald-100 text-xs sm:text-sm mt-1">
            Perbarui deskripsi pengantar, teks Visi, butir-butir Misi, sasaran Tujuan, dan pilar Motto karakter.
          </p>
        </div>
        <button
          type="submit"
          className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm transition-all shadow-md flex items-center gap-2 shrink-0 cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>Simpan Perubahan</span>
        </button>
      </div>

      {/* 1. Profil Pengantar Lembaga */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <Building2 className="w-5 h-5 text-emerald-600" />
          <h3 className="text-lg font-bold text-slate-900">1. Ringkasan Profil Lembaga</h3>
        </div>
        <p className="text-xs text-slate-500">
          Teks ini ditampilkan di bawah judul utama bagian "Tentang PKBM" pada beranda website.
        </p>
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Deskripsi Pengantar Profil
          </label>
          <textarea
            rows={3}
            value={profileText}
            onChange={(e) => setProfileText(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm leading-relaxed"
            placeholder="Tuliskan deskripsi ringkas tentang sejarah, komitmen, dan peran PKBM..."
            required
          />
        </div>
      </div>

      {/* 2. Motto HEBAT - MANDIRI - KREATIF */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <Sparkles className="w-5 h-5 text-amber-500" />
          <h3 className="text-lg font-bold text-slate-900">2. Motto & Nilai Karakter (3 Kartu Utama)</h3>
        </div>
        <p className="text-xs text-slate-500">
          Tiga pilar motto yang menjadi ciri khas warga belajar PKBM Bina Insani Sumowono.
        </p>

        <div className="grid md:grid-cols-3 gap-4">
          {mottos.map((motto, idx) => (
            <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  Pilar #{idx + 1}
                </span>
                <span className="text-xs text-slate-400 font-mono">Inisial: {motto.title[0]}</span>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Kata Kunci Motto</label>
                <input
                  type="text"
                  value={motto.title}
                  onChange={(e) => handleUpdateMotto(idx, 'title', e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-bold"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Deskripsi Nilai Karakter</label>
                <textarea
                  rows={3}
                  value={motto.description}
                  onChange={(e) => handleUpdateMotto(idx, 'description', e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs leading-relaxed"
                  required
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. VISI Lembaga */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <Compass className="w-5 h-5 text-emerald-600" />
          <h3 className="text-lg font-bold text-slate-900">3. Visi PKBM Bina Insani Sumowono</h3>
        </div>
        <p className="text-xs text-slate-500">
          Visi tampil di banner bergradasi hijau gelap dengan tipografi besar.
        </p>
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Pernyataan Visi Resmi
          </label>
          <textarea
            rows={3}
            value={visiText}
            onChange={(e) => setVisiText(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-medium leading-relaxed"
            placeholder="Terwujudnya pusat kegiatan belajar masyarakat yang unggul..."
            required
          />
        </div>
      </div>

      {/* 4. MISI Lembaga (Daftar Butir) */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-emerald-600" />
            <h3 className="text-lg font-bold text-slate-900">
              4. Butir-Butir Misi Lembaga ({misiList.length} Butir)
            </h3>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold">
            Tampil di Tab Misi
          </span>
        </div>

        <div className="space-y-3">
          {misiList.map((misi, idx) => (
            <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div className="w-7 h-7 rounded-lg bg-emerald-700 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-1">
                {idx + 1}
              </div>
              <div className="flex-1">
                <textarea
                  rows={2}
                  value={misi}
                  onChange={(e) => handleUpdateMisi(idx, e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs sm:text-sm"
                  required
                />
              </div>
              <button
                type="button"
                onClick={() => handleDeleteMisi(idx)}
                className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                title="Hapus butir misi ini"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Add New Misi Input */}
        <div className="pt-2 flex items-center gap-2">
          <input
            type="text"
            value={newMisiItem}
            onChange={(e) => setNewMisiItem(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddMisi();
              }
            }}
            placeholder="Ketik butir misi baru lalu klik Tambah..."
            className="flex-1 px-4 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs sm:text-sm"
          />
          <button
            type="button"
            onClick={handleAddMisi}
            className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Misi</span>
          </button>
        </div>
      </div>

      {/* 5. TUJUAN Pendidikan (Daftar Sasaran) */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Flag className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-bold text-slate-900">
              5. Sasaran & Tujuan Pendidikan ({tujuanList.length} Sasaran)
            </h3>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-blue-100 text-blue-800 font-bold">
            Tampil di Tab Tujuan
          </span>
        </div>

        <div className="space-y-3">
          {tujuanList.map((tujuan, idx) => (
            <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div className="w-7 h-7 rounded-lg bg-blue-700 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-1">
                0{idx + 1}
              </div>
              <div className="flex-1">
                <textarea
                  rows={2}
                  value={tujuan}
                  onChange={(e) => handleUpdateTujuan(idx, e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm"
                  required
                />
              </div>
              <button
                type="button"
                onClick={() => handleDeleteTujuan(idx)}
                className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                title="Hapus butir tujuan ini"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Add New Tujuan Input */}
        <div className="pt-2 flex items-center gap-2">
          <input
            type="text"
            value={newTujuanItem}
            onChange={(e) => setNewTujuanItem(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddTujuan();
              }
            }}
            placeholder="Ketik sasaran tujuan baru lalu klik Tambah..."
            className="flex-1 px-4 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm"
          />
          <button
            type="button"
            onClick={handleAddTujuan}
            className="px-4 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Tujuan</span>
          </button>
        </div>
      </div>

      {/* Floating Save Bar */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
        <button
          type="submit"
          className="px-6 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-sm transition-all shadow-lg flex items-center gap-2 cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>Simpan Seluruh Data Profil & Visi Misi</span>
        </button>
      </div>

    </form>
  );
};
