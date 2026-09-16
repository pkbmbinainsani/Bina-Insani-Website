import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  FileSpreadsheet,
  Upload,
  Download,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  FileText,
  Trash2,
  RefreshCw,
  Users,
  Check
} from 'lucide-react';
import {
  parsePersonaliaCSV,
  downloadCSVTemplate,
  generatePersonaliaTemplateCSV,
  ParsedPersonaliaRow
} from '../../../utils/csvHelper';
import { usePKBM } from '../../../context/PKBMContext';
import { PersonaliaMember } from '../../../types';

interface ImportPersonaliaCsvModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportSuccess: (count: number, mode: 'append' | 'replace') => void;
}

export const ImportPersonaliaCsvModal: React.FC<ImportPersonaliaCsvModalProps> = ({
  isOpen,
  onClose,
  onImportSuccess
}) => {
  const { importPersonalia, personalia } = usePKBM();

  const [inputMode, setInputMode] = useState<'upload' | 'paste'>('upload');
  const [csvText, setCsvText] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const [importMode, setImportMode] = useState<'append' | 'replace'>('append');
  const [isDragging, setIsDragging] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Parse result
  const parseResult = React.useMemo(() => {
    if (!csvText.trim()) return null;
    return parsePersonaliaCSV(csvText);
  }, [csvText]);

  if (!isOpen) return null;

  // Handle File Selected
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    if (!file.name.endsWith('.csv') && !file.name.endsWith('.txt')) {
      alert('Mohon pilih berkas dengan format .csv atau .txt');
      return;
    }
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setCsvText(text);
    };
    reader.readAsText(file, 'UTF-8');
  };

  // Drag & Drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  // Load sample data into paste area
  const handleLoadSample = () => {
    const sample = generatePersonaliaTemplateCSV();
    setCsvText(sample);
    setInputMode('paste');
  };

  // Execute Import
  const handleExecuteImport = () => {
    if (!parseResult || parseResult.validCount === 0) {
      alert('Tidak ada data personalia yang valid untuk diimpor.');
      return;
    }

    const validRows = parseResult.rows.filter((r) => r.isValid);

    if (importMode === 'replace') {
      const confirmReplace = confirm(
        `PERINGATAN: Mode 'Ganti Seluruh Data' akan menghapus ${personalia.length} data personalia yang ada dan menggantikannya dengan ${validRows.length} data baru dari CSV. Lanjutkan?`
      );
      if (!confirmReplace) return;
    }

    setIsProcessing(true);

    try {
      const membersToImport: Omit<PersonaliaMember, 'id'>[] = validRows.map((r, idx) => ({
        name: r.name,
        role: r.role,
        category: r.category,
        education: r.education,
        specialization: r.specialization,
        nuptkOrNip: r.nuptkOrNip,
        bio: r.bio,
        photo: r.photo,
        phone: r.phone,
        email: r.email,
        order: r.order || (idx + 1)
      }));

      importPersonalia(membersToImport, importMode);
      onImportSuccess(membersToImport.length, importMode);
      onClose();
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan saat memproses data CSV.');
    } finally {
      setIsProcessing(false);
    }
  };

  const categoryBadgeColors: Record<string, string> = {
    pendiri: 'bg-amber-100 text-amber-900 border-amber-300',
    yayasan: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    pendidik: 'bg-blue-100 text-blue-900 border-blue-300',
    tendik: 'bg-purple-100 text-purple-900 border-purple-300'
  };

  const categoryLabels: Record<string, string> = {
    pendiri: 'Pendiri / Pembina',
    yayasan: 'Pengurus Yayasan',
    pendidik: 'Pendidik / Tutor',
    tendik: 'Tenaga Kependidikan'
  };

  return (
    <div className="fixed inset-0 z-60 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="bg-white w-full max-w-4xl max-h-[92vh] rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col relative"
      >
        {/* Header Modal */}
        <div className="p-6 bg-gradient-to-r from-slate-900 via-stone-900 to-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-400">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black tracking-tight text-white flex items-center gap-2">
                Import Data Personalia via CSV
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-400 text-slate-950">
                  Batch Mode
                </span>
              </h3>
              <p className="text-xs text-slate-300">
                Tambahkan profil pendiri, dewan pengurus, guru/tutor, atau staf tendik sekaligus melalui file spreadsheet.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Bar (Template Download & Format Guide) */}
        <div className="px-6 py-3.5 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={() => downloadCSVTemplate()}
              className="px-3 py-1.5 rounded-xl bg-white hover:bg-amber-50 text-slate-800 hover:text-amber-900 font-bold border border-slate-300 hover:border-amber-300 flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-amber-600" />
              <span>Unduh Template CSV (.csv)</span>
            </button>

            <button
              onClick={() => setShowGuide(!showGuide)}
              className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 font-bold border border-slate-300 flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
              <span>{showGuide ? 'Tutup Panduan Format' : 'Lihat Panduan Format Kolom'}</span>
            </button>
          </div>

          <div className="flex items-center gap-1 bg-slate-200/80 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setInputMode('upload')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                inputMode === 'upload' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Upload Berkas
            </button>
            <button
              type="button"
              onClick={() => setInputMode('paste')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                inputMode === 'paste' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Ketik / Tempel Teks
            </button>
          </div>
        </div>

        {/* Collapsible Format Guide */}
        <AnimatePresence>
          {showGuide && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden bg-amber-50/70 border-b border-amber-200 px-6 py-4 text-xs space-y-2 text-slate-800"
            >
              <div className="font-bold text-amber-900 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                <span>Format Header Kolom CSV yang Didukung:</span>
              </div>
              <p className="text-slate-600 leading-relaxed text-[11px]">
                File CSV dapat menggunakan pemisah koma (<code>,</code>) atau titik-koma (<code>;</code>) standar Excel Indonesia.
                Kolom <strong>nama</strong> dan <strong>jabatan</strong> wajib terisi.
              </p>
              <div className="grid sm:grid-cols-2 gap-2 text-[11px]">
                <div className="bg-white/80 p-2.5 rounded-xl border border-amber-200 space-y-1">
                  <p><strong>nama</strong> <span className="text-red-500">*</span>: Nama lengkap & gelar (contoh: <em>Budi Santoso, S.Pd.</em>)</p>
                  <p><strong>jabatan</strong> <span className="text-red-500">*</span>: Peran/jabatan (contoh: <em>Tutor Matematika</em>, <em>Ketua Yayasan</em>)</p>
                  <p><strong>kategori</strong>: Pilihan: <code>pendiri</code>, <code>yayasan</code>, <code>pendidik</code>, atau <code>tendik</code></p>
                  <p><strong>pendidikan</strong>: Jenjang pendidikan (contoh: <em>S1 Pendidikan Matematika UNNES</em>)</p>
                </div>
                <div className="bg-white/80 p-2.5 rounded-xl border border-amber-200 space-y-1">
                  <p><strong>bidang_keahlian</strong>: Spesialisasi / mapel (contoh: <em>Matematika & Numerasi</em>)</p>
                  <p><strong>nuptk_nip</strong>: Nomor NUPTK atau NIP (opsional)</p>
                  <p><strong>telepon</strong>: Kontak WA/Telepon (contoh: <em>08123456789</em>)</p>
                  <p><strong>email</strong> & <strong>foto</strong>: Alamat email & link URL foto resmi (opsional)</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Input Method: Upload or Paste */}
          {inputMode === 'upload' ? (
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,text/csv,text/plain"
                onChange={handleFileChange}
                className="hidden"
              />

              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-3xl p-8 text-center cursor-pointer transition-all ${
                  isDragging
                    ? 'border-amber-500 bg-amber-50/50 scale-[0.99]'
                    : fileName
                    ? 'border-emerald-400 bg-emerald-50/30 hover:bg-emerald-50/50'
                    : 'border-slate-300 hover:border-amber-400 hover:bg-slate-50/80'
                }`}
              >
                <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mb-3">
                  <Upload className="w-6 h-6" />
                </div>
                {fileName ? (
                  <div>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black">
                      <Check className="w-3.5 h-3.5" /> Berkas Terpilih: {fileName}
                    </span>
                    <p className="text-xs text-slate-500 mt-2">Klik di sini untuk mengganti berkas CSV lain</p>
                  </div>
                ) : (
                  <div>
                    <p className="font-bold text-sm text-slate-800">
                      Tarik & lepas file CSV di sini, atau <span className="text-amber-600 underline">klik untuk memilih</span>
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      Mendukung format .csv hasil ekspor dari Microsoft Excel, Google Sheets, atau LibreOffice Calc
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800">
                  Tempel Teks Berformat CSV di bawah ini:
                </label>
                <button
                  type="button"
                  onClick={handleLoadSample}
                  className="text-xs font-bold text-amber-700 hover:underline flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Muat Contoh Format</span>
                </button>
              </div>
              <textarea
                rows={6}
                value={csvText}
                onChange={(e) => setCsvText(e.target.value)}
                placeholder="nama,jabatan,kategori,pendidikan,bidang_keahlian,nuptk_nip,bio,telepon,email,foto&#10;Budi Santoso,S.Pd.,Tutor Matematika,pendidik,S1 Pendidikan Matematika UNNES,Matematika & Numerasi,,085612345678,,"
                className="w-full p-4 rounded-2xl border border-slate-300 font-mono text-xs focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
              />
            </div>
          )}

          {/* Import Mode Options (Append vs Replace) */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <label className="block text-xs font-bold text-slate-800 mb-2">
              Metode Penyimpanan Data:
            </label>
            <div className="grid sm:grid-cols-2 gap-3 text-xs">
              <label
                className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                  importMode === 'append'
                    ? 'bg-white border-amber-500 ring-2 ring-amber-100 shadow-xs'
                    : 'bg-slate-100/70 border-slate-200 hover:bg-white'
                }`}
              >
                <input
                  type="radio"
                  name="importMode"
                  checked={importMode === 'append'}
                  onChange={() => setImportMode('append')}
                  className="mt-0.5 text-amber-600 focus:ring-amber-500"
                />
                <div>
                  <span className="font-bold text-slate-900 block">Tambahkan ke Data Saat Ini (Append)</span>
                  <span className="text-slate-500 text-[11px]">
                    Data baru dari CSV akan ditambahkan tanpa menghapus {personalia.length} data personalia yang sudah ada.
                  </span>
                </div>
              </label>

              <label
                className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                  importMode === 'replace'
                    ? 'bg-white border-red-500 ring-2 ring-red-100 shadow-xs'
                    : 'bg-slate-100/70 border-slate-200 hover:bg-white'
                }`}
              >
                <input
                  type="radio"
                  name="importMode"
                  checked={importMode === 'replace'}
                  onChange={() => setImportMode('replace')}
                  className="mt-0.5 text-red-600 focus:ring-red-500"
                />
                <div>
                  <span className="font-bold text-red-700 block">Gantikan Seluruh Data (Replace)</span>
                  <span className="text-slate-500 text-[11px]">
                    Mengganti total seluruh personalia lama dengan data yang ada di dalam berkas CSV ini.
                  </span>
                </div>
              </label>
            </div>
          </div>

          {/* Real-time CSV Parsing Preview Table */}
          {parseResult && (
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-slate-700" />
                  <h4 className="font-extrabold text-xs text-slate-900 uppercase tracking-wider">
                    Hasil Analisis Berkas ({parseResult.rows.length} Baris Terdeteksi)
                  </h4>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    {parseResult.validCount} Siap Diimpor
                  </span>
                  {parseResult.invalidCount > 0 && (
                    <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 font-bold flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {parseResult.invalidCount} Baris Tidak Lengkap
                    </span>
                  )}
                </div>
              </div>

              {parseResult.rows.length === 0 ? (
                <div className="p-6 text-center text-slate-400 text-xs border border-dashed rounded-2xl">
                  Belum ada baris data yang terbaca. Pastikan baris pertama berisi nama kolom/header.
                </div>
              ) : (
                <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-xs max-h-72 overflow-y-auto">
                  <table className="w-full text-left text-xs divide-y divide-slate-200">
                    <thead className="bg-slate-100 text-slate-700 font-bold sticky top-0 z-10">
                      <tr>
                        <th className="py-2.5 px-3 w-12 text-center">#</th>
                        <th className="py-2.5 px-3">Nama & Jabatan</th>
                        <th className="py-2.5 px-3">Kategori</th>
                        <th className="py-2.5 px-3">Pendidikan & Keahlian</th>
                        <th className="py-2.5 px-3">Kontak</th>
                        <th className="py-2.5 px-3 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {parseResult.rows.map((row, idx) => (
                        <tr
                          key={idx}
                          className={`hover:bg-slate-50 transition-colors ${
                            !row.isValid ? 'bg-rose-50/40' : ''
                          }`}
                        >
                          <td className="py-2.5 px-3 text-center font-mono text-slate-400 text-[11px]">
                            {idx + 1}
                          </td>
                          <td className="py-2.5 px-3">
                            <div className="flex items-center gap-2.5">
                              <img
                                src={row.photo}
                                alt={row.name}
                                className="w-7 h-7 rounded-lg object-cover shrink-0 border border-slate-200"
                                onError={(e) => {
                                  // Fallback to placeholder if url invalid
                                  (e.target as HTMLElement).style.display = 'none';
                                }}
                              />
                              <div>
                                <p className="font-bold text-slate-900 leading-tight">
                                  {row.name || <span className="text-red-500 italic">Nama kosong</span>}
                                </p>
                                <p className="text-[11px] text-slate-500">
                                  {row.role || <span className="text-red-500 italic">Jabatan kosong</span>}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="py-2.5 px-3">
                            <span
                              className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold border ${
                                categoryBadgeColors[row.category] || 'bg-slate-100 text-slate-800'
                              }`}
                            >
                              {categoryLabels[row.category] || row.category}
                            </span>
                          </td>
                          <td className="py-2.5 px-3">
                            <p className="text-slate-800 font-medium truncate max-w-[180px]">
                              {row.education || '-'}
                            </p>
                            <p className="text-[10px] text-slate-500 truncate max-w-[180px]">
                              {row.specialization || '-'}
                            </p>
                          </td>
                          <td className="py-2.5 px-3">
                            <p className="text-[11px] text-slate-700">{row.phone || '-'}</p>
                            <p className="text-[10px] text-slate-400 truncate max-w-[120px]">{row.email || '-'}</p>
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            {row.isValid ? (
                              <span className="inline-flex items-center gap-1 text-emerald-700 font-bold text-[11px]">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                Valid
                              </span>
                            ) : (
                              <span
                                className="inline-flex items-center gap-1 text-rose-700 font-bold text-[10px]"
                                title={row.errors.join(', ')}
                              >
                                <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                                {row.errors[0]}
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-5 bg-slate-100 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-600">
            {parseResult && parseResult.validCount > 0 ? (
              <span className="font-semibold text-slate-800">
                {parseResult.validCount} profil siap ditambahkan ke database PKBM ({importMode === 'append' ? 'Mode Tambah' : 'Mode Ganti Semua'}).
              </span>
            ) : (
              <span>Pilih file CSV atau tempel teks data untuk memulai analisis data.</span>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-white hover:bg-slate-200 text-slate-700 font-bold text-xs border border-slate-300 transition-all cursor-pointer"
            >
              Batal
            </button>

            <button
              type="button"
              disabled={!parseResult || parseResult.validCount === 0 || isProcessing}
              onClick={handleExecuteImport}
              className={`flex-1 sm:flex-initial px-5 py-2.5 rounded-xl font-black text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer ${
                !parseResult || parseResult.validCount === 0 || isProcessing
                  ? 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white hover:shadow-lg'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>
                {isProcessing
                  ? 'Memproses Impor...'
                  : parseResult && parseResult.validCount > 0
                  ? `Impor ${parseResult.validCount} Personalia`
                  : 'Impor Data Personalia'}
              </span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
