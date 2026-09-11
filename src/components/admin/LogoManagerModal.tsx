import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Upload,
  Link as LinkIcon,
  Image as ImageIcon,
  Check,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  BookOpen,
  Eye,
  Award,
  GraduationCap,
  Layers,
  HelpCircle,
  FileCheck
} from 'lucide-react';
import { usePKBM } from '../../context/PKBMContext';

interface LogoManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Crisp SVG preset logos commonly used in Indonesian educational institutions
const LOGO_PRESETS = [
  {
    id: 'preset-tutwuri',
    name: 'Lambang Tut Wuri Handayani (Kemendikbudristek)',
    category: 'Resmi Kemendikbud',
    description: 'Lambang resmi pendidikan nasional Indonesia warna biru & kuning emas',
    url: 'https://upload.wikimedia.org/wikipedia/commons/9/9c/Logo_of_Ministry_of_Education_and_Culture_of_Republic_of_Indonesia.svg'
  },
  {
    id: 'preset-garuda-gold',
    name: 'Emblem Perisai Garuda Emas & Bintang',
    category: 'Nasional & Karakter',
    description: 'Simbol perisai kebangsaan dengan bintang emas dan sulur padi kapas',
    url: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'preset-buku-obor',
    name: 'Lambang Buku Terbuka & Obor Ilmu Emas',
    category: 'Pendidikan Kesetaraan',
    description: 'Ikon cahaya ilmu pengetahuan dan buku pedoman pembinaan karakter',
    url: 'https://images.unsplash.com/photo-1532012164546-f432f2e37b73?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'preset-tunas-bangsa',
    name: 'Lambang Tunas Harapan & Bina Insani',
    category: 'Pemberdayaan Masyarakat',
    description: 'Siluet tunas hijau emas melambangkan kemandirian warga belajar',
    url: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'preset-vokasi-tech',
    name: 'Lambang Vokasi & Keterampilan Terpadu',
    category: 'Kecakapan Kerja',
    description: 'Paduan roda gerigi keterampilan kerja dan topi wisuda kesetaraan',
    url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=400&q=80'
  }
];

export const LogoManagerModal: React.FC<LogoManagerModalProps> = ({ isOpen, onClose }) => {
  const { pkbmInfo, updatePKBMInfo } = usePKBM();

  const [currentLogo, setCurrentLogo] = useState<string>(pkbmInfo.logoUrl || '');
  const [currentShape, setCurrentShape] = useState<'rounded' | 'circle' | 'square'>(pkbmInfo.logoShape || 'rounded');
  const [activeTab, setActiveTab] = useState<'upload' | 'url' | 'presets'>('upload');
  const [urlInput, setUrlInput] = useState<string>('');
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  if (!isOpen) return null;

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setStatusMessage({ type, text });
    setTimeout(() => {
      setStatusMessage(null);
    }, 3500);
  };

  const handleFileUpload = (file: File) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Mohon pilih file gambar (PNG, JPG, JPEG, SVG, WebP).', 'error');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast('Ukuran file maksimal 5MB.', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        setCurrentLogo(result);
        showToast('Gambar logo berhasil dimuat! Klik "Terapkan & Simpan Logo" untuk menyimpan.');
      }
    };
    reader.onerror = () => {
      showToast('Gagal membaca file gambar.', 'error');
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleApplyUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) {
      showToast('Masukkan link URL gambar logo.', 'error');
      return;
    }
    setCurrentLogo(urlInput.trim());
    showToast('Link logo diterapkan ke pratinjau. Klik "Terapkan & Simpan Logo" untuk menyimpan.');
  };

  const handleSelectPreset = (presetUrl: string) => {
    setCurrentLogo(presetUrl);
    showToast('Preset logo dipilih! Klik "Terapkan & Simpan Logo" untuk menyimpan.');
  };

  const handleResetToDefault = () => {
    setCurrentLogo('');
    showToast('Logo dikembalikan ke lambang bawaan (Buku Emas). Simpan untuk menerapkan.');
  };

  const handleSave = () => {
    updatePKBMInfo({
      logoUrl: currentLogo,
      logoShape: currentShape
    });
    showToast('✅ Logo lembaga berhasil diperbarui dan diterapkan ke seluruh website!');
    setTimeout(() => {
      onClose();
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Header Modal */}
        <div className="bg-gradient-to-r from-[#011d0e] via-[#033b1e] to-slate-950 text-white p-5 sm:p-6 flex items-center justify-between border-b border-amber-400/40 relative">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold shadow-lg shadow-amber-400/20">
              <ImageIcon className="w-6 h-6" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 text-[10px] font-black uppercase tracking-wider mb-0.5">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>Identitas Visual Resmi</span>
              </div>
              <h2 className="text-lg sm:text-xl font-black tracking-tight text-white">
                Pengaturan & Ganti Logo Lembaga
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            aria-label="Tutup modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Toast Alert */}
        <AnimatePresence>
          {statusMessage && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className={`px-6 py-2.5 text-xs font-bold flex items-center justify-between ${
                statusMessage.type === 'success'
                  ? 'bg-orange-600 text-white'
                  : 'bg-red-600 text-white'
              }`}
            >
              <span>{statusMessage.text}</span>
              <button onClick={() => setStatusMessage(null)} className="text-white/80 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Modal Body */}
        <div className="p-5 sm:p-7 overflow-y-auto space-y-6 flex-1 bg-slate-50/50">
          
          {/* Dual Live Preview Section */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-2">
                <Eye className="w-4 h-4 text-orange-600" />
                <span>Pratinjau Tampilan Logo (Live Preview)</span>
              </h3>
              <span className="text-[11px] font-bold text-slate-500">
                {currentLogo ? 'Logo Kustom Aktif' : 'Lambang Standar (Buku Emas)'}
              </span>
            </div>

            <div className="grid sm:grid-cols-3 gap-3.5">
              {/* Preview 1: In Header Dark Green Theme */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-[#011c0e] via-[#023119] to-slate-950 border-2 border-amber-400/40 text-white space-y-2 relative overflow-hidden">
                <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider block">
                  1. Header Website (Gelap)
                </span>
                
                <div className="flex items-center gap-2.5 pt-1">
                  <div
                    className={`w-12 h-12 bg-gradient-to-br from-amber-50 via-white to-amber-100 p-1.5 shadow-xl border-2 border-amber-400 flex items-center justify-center shrink-0 overflow-hidden ${
                      currentShape === 'circle' ? 'rounded-full' : currentShape === 'square' ? 'rounded-lg' : 'rounded-xl'
                    }`}
                  >
                    {currentLogo ? (
                      <img
                        src={currentLogo}
                        alt="Logo Preview Header"
                        className="w-full h-full object-contain"
                        onError={() => showToast('Gambar tidak dapat dimuat dari tautan tersebut.', 'error')}
                      />
                    ) : (
                      <div className="w-full h-full rounded-lg bg-gradient-to-br from-[#00552b] to-[#002b15] flex items-center justify-center text-white font-bold">
                        <BookOpen className="w-5 h-5 text-amber-300" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="font-black text-white text-xs uppercase leading-tight truncate">
                      {pkbmInfo.name}
                    </p>
                    <p className="text-[9px] font-bold text-amber-300 tracking-wider truncate">
                      HEBAT • MANDIRI • KREATIF
                    </p>
                  </div>
                </div>
              </div>

              {/* Preview 2: On White/Document Surface */}
              <div className="p-3.5 rounded-2xl bg-slate-100 border border-slate-300 text-slate-900 space-y-2">
                <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">
                  2. Dokumen / Kartu Terang
                </span>

                <div className="flex items-center gap-2.5 pt-1">
                  <div
                    className={`w-12 h-12 bg-white p-1.5 shadow-md border border-slate-300 flex items-center justify-center shrink-0 overflow-hidden ${
                      currentShape === 'circle' ? 'rounded-full' : currentShape === 'square' ? 'rounded-lg' : 'rounded-xl'
                    }`}
                  >
                    {currentLogo ? (
                      <img
                        src={currentLogo}
                        alt="Logo Preview Light"
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="w-full h-full rounded-lg bg-[#006633] flex items-center justify-center text-white font-bold">
                        <BookOpen className="w-5 h-5 text-amber-300" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="font-black text-slate-900 text-xs uppercase leading-tight truncate">
                      {pkbmInfo.name}
                    </p>
                    <p className="text-[9px] font-semibold text-slate-600 truncate">
                      NPSN: {pkbmInfo.npsn}
                    </p>
                  </div>
                </div>
              </div>

              {/* Preview 3: Browser Tab Favicon Preview */}
              <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-slate-100 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
                    3. Favicon Tab Browser
                  </span>
                  <span className="text-[9px] bg-orange-500/20 text-amber-300 px-1.5 py-0.5 rounded font-mono font-bold">
                    Otomatis Sama
                  </span>
                </div>

                <div className="pt-1">
                  <div className="bg-slate-800/90 rounded-t-xl px-2.5 py-1.5 border-t border-x border-slate-700 flex items-center gap-2 shadow-inner">
                    <div className="w-4 h-4 rounded-sm bg-white p-0.5 flex items-center justify-center shrink-0 overflow-hidden shadow-xs">
                      {currentLogo ? (
                        <img
                          src={currentLogo}
                          alt="Favicon Preview"
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <div className="w-full h-full rounded-xs bg-[#00552b] flex items-center justify-center text-amber-300">
                          <BookOpen className="w-2.5 h-2.5" />
                        </div>
                      )}
                    </div>
                    <span className="text-[11px] font-semibold text-slate-200 truncate flex-1">
                      {pkbmInfo.name || 'PKBM Bina Insani'} - Hebat...
                    </span>
                    <span className="text-[10px] text-slate-500">×</span>
                  </div>
                  <div className="h-2 bg-slate-800 rounded-b-lg border-b border-x border-slate-700" />
                </div>
              </div>
            </div>

            {/* Shape Customizer */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100">
              <span className="text-xs font-bold text-slate-700">Pilihan Bentuk Bingkai Logo:</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCurrentShape('rounded')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    currentShape === 'rounded'
                      ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  Sudut Membulat (Modern)
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentShape('circle')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    currentShape === 'circle'
                      ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  Lingkaran (Bulat)
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentShape('square')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    currentShape === 'square'
                      ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  Persegi (Kotak)
                </button>
              </div>
            </div>
          </div>

          {/* Action Tabs: Upload, URL, Presets */}
          <div className="space-y-4">
            <div className="flex border-b border-slate-200">
              <button
                type="button"
                onClick={() => setActiveTab('upload')}
                className={`pb-3 px-4 text-xs sm:text-sm font-black transition-all flex items-center gap-2 border-b-2 cursor-pointer ${
                  activeTab === 'upload'
                    ? 'border-orange-600 text-orange-700'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Upload className="w-4 h-4" />
                <span>1. Upload File Gambar</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('url')}
                className={`pb-3 px-4 text-xs sm:text-sm font-black transition-all flex items-center gap-2 border-b-2 cursor-pointer ${
                  activeTab === 'url'
                    ? 'border-orange-600 text-orange-700'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <LinkIcon className="w-4 h-4" />
                <span>2. Tempel URL / Link</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('presets')}
                className={`pb-3 px-4 text-xs sm:text-sm font-black transition-all flex items-center gap-2 border-b-2 cursor-pointer ${
                  activeTab === 'presets'
                    ? 'border-orange-600 text-orange-700'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>3. Pilihan Preset Logo</span>
              </button>
            </div>

            {/* TAB 1: FILE UPLOAD */}
            {activeTab === 'upload' && (
              <div className="space-y-4">
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragOver(true);
                  }}
                  onDragLeave={() => setIsDragOver(false)}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-3xl p-6 sm:p-8 text-center transition-all bg-white flex flex-col items-center justify-center gap-3 cursor-pointer ${
                    isDragOver
                      ? 'border-orange-500 bg-orange-50/50 scale-[0.99]'
                      : 'border-slate-300 hover:border-orange-500 hover:bg-slate-50'
                  }`}
                  onClick={() => document.getElementById('logo-file-input')?.click()}
                >
                  <input
                    id="logo-file-input"
                    type="file"
                    accept="image/png, image/jpeg, image/jpg, image/svg+xml, image/webp"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleFileUpload(e.target.files[0]);
                      }
                    }}
                  />
                  <div className="w-16 h-16 rounded-2xl bg-orange-100 text-orange-900 flex items-center justify-center font-bold shadow-inner">
                    <Upload className="w-8 h-8 text-orange-600" />
                  </div>
                  <div>
                    <p className="font-extrabold text-sm sm:text-base text-slate-900">
                      Klik untuk Memilih File Logo dari Perangkat Anda
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      Mendukung format PNG transparan, JPG, JPEG, SVG, dan WebP (Maksimal 5MB)
                    </p>
                  </div>
                  <button
                    type="button"
                    className="px-5 py-2.5 rounded-xl bg-[#006633] hover:bg-[#00552b] text-white font-bold text-xs shadow-md transition-colors pointer-events-none"
                  >
                    Pilih File Gambar
                  </button>
                </div>
              </div>
            )}

            {/* TAB 2: URL INPUT */}
            {activeTab === 'url' && (
              <form onSubmit={handleApplyUrl} className="space-y-4 bg-white p-5 rounded-2xl border border-slate-200">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">
                    Tautan / URL Gambar Logo Online
                  </label>
                  <div className="relative">
                    <LinkIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="url"
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      placeholder="https://domain-anda.com/logo-pkbm-bina-insani.png"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1.5">
                    💡 Gunakan tautan langsung gambar logo berformat .png dengan latar transparan untuk hasil terbaik.
                  </p>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow transition-colors cursor-pointer flex items-center gap-2"
                  >
                    <Check className="w-4 h-4 text-amber-300" />
                    <span>Terapkan Tautan Logo</span>
                  </button>
                </div>
              </form>
            )}

            {/* TAB 3: PRESETS */}
            {activeTab === 'presets' && (
              <div className="space-y-3 bg-white p-5 rounded-2xl border border-slate-200">
                <p className="text-xs text-slate-600 font-medium">
                  Pilih salah satu logo standar pendidikan nasional di bawah ini:
                </p>
                
                <div className="grid sm:grid-cols-2 gap-3">
                  {LOGO_PRESETS.map((preset) => (
                    <div
                      key={preset.id}
                      onClick={() => handleSelectPreset(preset.url)}
                      className={`p-3.5 rounded-2xl border-2 transition-all flex items-center gap-3.5 cursor-pointer ${
                        currentLogo === preset.url
                          ? 'border-orange-500 bg-orange-50/60 shadow-md'
                          : 'border-slate-200 hover:border-orange-400 hover:bg-slate-50'
                      }`}
                    >
                      <div className="w-12 h-12 rounded-xl bg-white p-1.5 border border-slate-200 shrink-0 flex items-center justify-center shadow-sm">
                        <img src={preset.url} alt={preset.name} className="w-full h-full object-contain" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="text-[9px] font-black uppercase tracking-wider bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                          {preset.category}
                        </span>
                        <p className="text-xs font-bold text-slate-900 truncate mt-1">
                          {preset.name}
                        </p>
                        <p className="text-[10px] text-slate-500 truncate">
                          {preset.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="bg-slate-100 px-5 sm:px-7 py-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleResetToDefault}
            className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-200 text-slate-700 font-bold text-xs border border-slate-300 flex items-center gap-2 transition-colors cursor-pointer"
            title="Kembalikan ke lambang default"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>Reset ke Lambang Bawaan</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 font-black text-xs sm:text-sm shadow-xl hover:shadow-amber-400/30 flex items-center gap-2 transition-all cursor-pointer border border-amber-200"
            >
              <Check className="w-4 h-4 text-slate-950" />
              <span>Terapkan & Simpan Logo</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
