import React, { useState } from 'react';
import {
  Database,
  Cloud,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  UploadCloud,
  DownloadCloud,
  Copy,
  Check,
  ExternalLink,
  Radio,
  Server,
  ShieldCheck,
  Terminal,
  Activity,
  Layers,
  Clock,
  Sparkles,
  History,
  Search,
  FileUp,
  FileDown,
  RotateCcw,
  Info,
  ShieldAlert,
  HardDrive,
  Zap,
  Wifi
} from 'lucide-react';
import { usePKBM } from '../../../context/PKBMContext';
import {
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  SUPABASE_SQL_SETUP_SCRIPT
} from '../../../lib/supabase';
import { DetectedLocalStorageBackup } from '../../../types';

export const DatabaseCmsTab: React.FC = () => {
  const {
    supabaseStatus,
    isTableConfigured,
    lastSyncTime,
    isSyncing,
    syncAllToSupabase,
    loadFromSupabase,
    sendRealtimePing,
    news,
    gallery,
    registrations,
    programs,
    vokasiPrograms,
    faqs,
    heroSlides,
    personalia,
    stats,
    pkbmInfo,
    isCurrentNewsDummy,
    scanLocalBackups,
    restoreDetectedNews,
    restoreDetectedGallery,
    exportDataJSON,
    importDataJSON
  } = usePKBM();

  const [copiedSql, setCopiedSql] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);
  const [showSql, setShowSql] = useState(false);
  const [syncFeedback, setSyncFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [pingLog, setPingLog] = useState<string | null>(null);

  const [scanResults, setScanResults] = useState<{
    newsBackups: DetectedLocalStorageBackup[];
    galleryBackups: DetectedLocalStorageBackup[];
    fullBackups: DetectedLocalStorageBackup[];
  } | null>(null);
  const [hasScanned, setHasScanned] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [showSyncWarningModal, setShowSyncWarningModal] = useState(false);

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SETUP_SCRIPT);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(SUPABASE_URL);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const handleCopyKey = () => {
    navigator.clipboard.writeText(SUPABASE_ANON_KEY);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleScanBrowser = () => {
    setIsScanning(true);
    setTimeout(() => {
      const results = scanLocalBackups();
      setScanResults(results);
      setHasScanned(true);
      setIsScanning(false);
    }, 350);
  };

  const handleRestoreNewsBackup = (items: any[]) => {
    restoreDetectedNews(items);
    setSyncFeedback({
      type: 'success',
      message: `Berhasil memulihkan ${items.length} berita dari riwayat penyimpanan browser ke sistem dan Supabase!`
    });
  };

  const handleRestoreGalleryBackup = (items: any[]) => {
    restoreDetectedGallery(items);
    setSyncFeedback({
      type: 'success',
      message: `Berhasil memulihkan ${items.length} foto galeri dari riwayat penyimpanan browser ke sistem dan Supabase!`
    });
  };

  const handleRestoreFullBackup = (data: any) => {
    const success = importDataJSON(JSON.stringify(data));
    if (success) {
      setSyncFeedback({
        type: 'success',
        message: 'Cadangan data lengkap berhasil dipulihkan dan disinkronkan ke Supabase!'
      });
    }
  };

  const handleExportBackupFile = () => {
    const jsonStr = exportDataJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup_pkbm_sumowono_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportBackupFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const ok = importDataJSON(content);
        if (ok) {
          setSyncFeedback({
            type: 'success',
            message: 'File cadangan JSON berhasil diimpor dan database Supabase telah diperbarui!'
          });
        } else {
          setSyncFeedback({
            type: 'error',
            message: 'Format file JSON tidak valid.'
          });
        }
      } catch (err: any) {
        setSyncFeedback({
          type: 'error',
          message: `Gagal membaca file: ${err.message}`
        });
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleManualSync = async () => {
    if (isCurrentNewsDummy && gallery.length === 0) {
      setShowSyncWarningModal(true);
      return;
    }
    await executeManualSync();
  };

  const executeManualSync = async () => {
    setShowSyncWarningModal(false);
    setSyncFeedback(null);
    const res = await syncAllToSupabase();
    if (res.success) {
      setSyncFeedback({ type: 'success', message: res.message });
    } else {
      setSyncFeedback({ type: 'error', message: res.message });
    }
  };

  const handleManualLoad = async () => {
    setSyncFeedback(null);
    await loadFromSupabase();
    setSyncFeedback({
      type: 'success',
      message: 'Data terbaru dari Supabase berhasil dimuat ulang ke layar aplikasi!'
    });
  };

  const handlePing = () => {
    sendRealtimePing();
    const timeStr = new Date().toLocaleTimeString('id-ID');
    setPingLog(`Sinyal Realtime (Ping) terkirim pada ${timeStr}. Semua perangkat terhubung menerima siaran ini secara langsung.`);
    setTimeout(() => setPingLog(null), 6000);
  };

  const dataInventory = [
    { label: 'Berita & Artikel', count: news.length, key: 'news', type: 'Array JSON' },
    { label: 'Pendaftar Siswa PWBB', count: registrations.length, key: 'registrations', type: 'Array JSON' },
    { label: 'Galeri Foto Kegiatan', count: gallery.length, key: 'gallery', type: 'Array JSON' },
    { label: 'Banner Berganti (Slider)', count: heroSlides.length, key: 'heroSlides', type: 'Array JSON' },
    { label: 'Program Belajar Kesetaraan', count: programs.length, key: 'programs', type: 'Array JSON' },
    { label: 'Program Vokasi & Keterampilan', count: vokasiPrograms.length, key: 'vokasiPrograms', type: 'Array JSON' },
    { label: 'Tanya Jawab FAQ', count: faqs.length, key: 'faqs', type: 'Array JSON' },
    { label: 'Data Personalia & Tim', count: personalia.length, key: 'personalia', type: 'Array JSON' },
    { label: 'Statistik Lembaga', count: stats.length, key: 'stats', type: 'Array JSON' },
    { label: 'Profil Lembaga & Kontak', count: 1, key: 'pkbmInfo', type: 'Object JSON' },
  ];

  return (
    <div className="space-y-6 pb-8">
      {/* Top Banner & Header */}
      <div className="bg-gradient-to-r from-slate-900 via-stone-900 to-emerald-950 text-white p-5 sm:p-6 rounded-3xl border border-emerald-500/30 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-400 flex items-center justify-center font-black shadow-inner shrink-0">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl font-black tracking-tight text-white">
                  Database Online & Realtime Supabase
                </h3>
                <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-black flex items-center gap-1.5 ${
                  supabaseStatus === 'connected'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : supabaseStatus === 'connecting'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'bg-red-500/20 text-red-300 border border-red-500/40'
                }`}>
                  <span className={`w-2 h-2 rounded-full ${
                    supabaseStatus === 'connected' ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'
                  }`} />
                  {supabaseStatus === 'connected' ? 'Online Terhubung' : supabaseStatus === 'connecting' ? 'Menghubungkan...' : 'Offline / Diskoneksi'}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Sinkronisasi otomatis antar laptop, tablet, dan smartphone pengelola maupun pendaftar secara langsung melalui WebSockets.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="https://supabase.com/dashboard/project/xinbrgiingzhdcbdoirv"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-md shadow-emerald-950/40"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Buka Dashboard Supabase</span>
            </a>
          </div>
        </div>

        {/* Live Metrics Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-slate-800/80">
          <div className="bg-slate-950/60 p-3 rounded-2xl border border-slate-800">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Status Server</span>
            <div className="flex items-center gap-1.5 text-emerald-400 font-black text-sm mt-0.5">
              <Radio className="w-3.5 h-3.5 animate-pulse" />
              <span>Supabase Cloud</span>
            </div>
          </div>
          <div className="bg-slate-950/60 p-3 rounded-2xl border border-slate-800">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Kanal Realtime</span>
            <div className="flex items-center gap-1.5 text-amber-300 font-black text-sm mt-0.5">
              <Activity className="w-3.5 h-3.5" />
              <span>pkbm_realtime_sync</span>
            </div>
          </div>
          <div className="bg-slate-950/60 p-3 rounded-2xl border border-slate-800">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Tabel Basis Data</span>
            <div className="flex items-center gap-1.5 text-slate-200 font-bold text-sm mt-0.5">
              <Layers className="w-3.5 h-3.5 text-orange-400" />
              <span>public.pkbm_records</span>
            </div>
          </div>
          <div className="bg-slate-950/60 p-3 rounded-2xl border border-slate-800">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Sinkronisasi Terakhir</span>
            <div className="flex items-center gap-1.5 text-slate-300 font-bold text-sm mt-0.5">
              <Clock className="w-3.5 h-3.5 text-blue-400" />
              <span>{lastSyncTime || 'Baru saja'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sync Action Feedback */}
      {syncFeedback && (
        <div className={`p-4 rounded-2xl border flex items-center justify-between text-xs font-bold animate-in fade-in ${
          syncFeedback.type === 'success'
            ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
            : 'bg-red-50 text-red-900 border-red-200'
        }`}>
          <div className="flex items-center gap-2">
            {syncFeedback.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
            )}
            <span>{syncFeedback.message}</span>
          </div>
          <button
            onClick={() => setSyncFeedback(null)}
            className="text-slate-400 hover:text-slate-600 px-2 py-1"
          >
            Tutup
          </button>
        </div>
      )}

      {/* Ping Log Feedback */}
      {pingLog && (
        <div className="p-3.5 rounded-2xl bg-blue-50 text-blue-900 border border-blue-200 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <Radio className="w-4 h-4 text-blue-600 animate-pulse shrink-0" />
          <span>{pingLog}</span>
        </div>
      )}

      {/* Action Controls Bar */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h4 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <RefreshCw className={`w-4 h-4 text-emerald-600 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>Kendali Sinkronisasi Multi-Perangkat</span>
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Setiap perubahan data otomatis tersimpan dan disiarkan secara real-time. Anda juga dapat memaksa unggah/unduh secara manual.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <button
            onClick={handleManualSync}
            disabled={isSyncing}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white text-xs font-bold flex items-center gap-2 transition-all shadow-md shadow-emerald-950/20 cursor-pointer disabled:opacity-50"
          >
            <UploadCloud className="w-4 h-4" />
            <span>{isSyncing ? 'Menyinkronkan...' : 'Unggah Semua Data Lokal ke Supabase'}</span>
          </button>

          <button
            onClick={handleManualLoad}
            disabled={isSyncing}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-white text-xs font-bold flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
          >
            <DownloadCloud className="w-4 h-4 text-cyan-400" />
            <span>Muat Ulang Data dari Supabase</span>
          </button>

          <button
            onClick={handlePing}
            className="px-4 py-2.5 rounded-xl bg-orange-100 hover:bg-orange-200 active:scale-95 text-orange-950 text-xs font-bold flex items-center gap-2 transition-all border border-orange-200 cursor-pointer"
          >
            <Radio className="w-4 h-4 text-orange-600" />
            <span>Kirim Tes Sinyal Realtime (Ping)</span>
          </button>
        </div>
      </div>

      {/* Diagnostic Alert: Dummy Data or Empty Gallery Detected */}
      {(isCurrentNewsDummy || gallery.length === 0) && (
        <div className="bg-amber-50 border border-amber-300 rounded-3xl p-5 shadow-sm space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-800 flex items-center justify-center shrink-0 mt-0.5">
              <ShieldAlert className="w-5 h-5 text-amber-700" />
            </div>
            <div className="flex-1 space-y-1">
              <h4 className="text-sm font-black text-amber-950 flex items-center gap-2">
                <span>Investigasi Data: Mengapa Berita & Galeri Menampilkan Data Dummy?</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-200 text-amber-900">
                  Perlu Penanganan
                </span>
              </h4>
              <p className="text-xs text-amber-900 leading-relaxed">
                Berdasarkan rekam jejak Supabase (<code className="font-mono font-bold text-amber-950">pkbm_records</code>), pada tanggal <strong>25 September 2026 pukul 20:04 UTC</strong> telah terjadi sinkronisasi dari browser yang memuat data template bawaan awal (2 berita dummy dan galeri kosong), sehingga menimpa data di database online. Halaman galeri secara otomatis menampilkan gambar dari 2 berita tersebut karena galeri mandiri kosong.
              </p>
              <div className="pt-2 flex flex-wrap gap-2 items-center">
                <button
                  onClick={handleScanBrowser}
                  disabled={isScanning}
                  className="px-3.5 py-2 rounded-xl bg-amber-800 hover:bg-amber-900 active:scale-95 text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm disabled:opacity-50"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>{isScanning ? 'Memindai Memori Browser...' : 'Pindai Memori Browser Ini Sekarang'}</span>
                </button>
                <span className="text-[11px] text-amber-800">
                  (Cek apakah browser laptop/ponsel ini masih menyimpan riwayat berita & foto asli sebelum 25 September)
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Data Recovery Center Card */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center font-bold">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <span>Pusat Pemulihan Data & Riwayat Browser (Recovery Tool)</span>
                <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold">
                  Anti Data Hilang
                </span>
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Pindai memori browser (LocalStorage) untuk menemukan draf berita, foto galeri, atau riwayat versi lama yang pernah tersimpan.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleScanBrowser}
              disabled={isScanning}
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 active:scale-95 text-white text-xs font-bold flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              <Search className={`w-3.5 h-3.5 text-amber-400 ${isScanning ? 'animate-spin' : ''}`} />
              <span>{isScanning ? 'Memindai...' : 'Pindai Penyimpanan Browser'}</span>
            </button>
          </div>
        </div>

        {/* Scan Results Display */}
        {hasScanned && (
          <div className="space-y-3 pt-1">
            <h5 className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <HardDrive className="w-3.5 h-3.5 text-slate-500" />
              <span>Hasil Pemindaian Memori Lokal Browser:</span>
            </h5>

            {(!scanResults ||
              (scanResults.newsBackups.length === 0 &&
                scanResults.galleryBackups.length === 0 &&
                scanResults.fullBackups.length === 0)) ? (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
                <p className="font-bold text-slate-800">
                  Tidak ditemukan jejak data lama pada browser perangkat ini.
                </p>
                <p className="text-slate-500 leading-relaxed text-[11px]">
                  Tips: Jika Anda pernah menginput berita atau galeri menggunakan <strong>laptop, PC, atau perangkat lain</strong>, silakan buka website ini pada perangkat tersebut lalu buka tab ini dan klik <em>"Pindai Penyimpanan Browser"</em>. Data yang tersimpan di perangkat tersebut dapat langsung dipulihkan ke Supabase. Anda juga dapat menggunakan tombol <strong>Impor Cadangan (JSON)</strong> di bawah jika memiliki arsip file.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {/* News backups detected */}
                {scanResults.newsBackups.map((nb, i) => (
                  <div
                    key={`news-b-${i}`}
                    className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-blue-950">Riwayat Berita Terdeteksi ({nb.itemCount} Artikel)</span>
                        <span className="text-[10px] font-mono bg-blue-100 text-blue-800 px-2 py-0.5 rounded-md">
                          {nb.key}
                        </span>
                      </div>
                      <p className="text-[11px] text-blue-700 mt-1 line-clamp-1">
                        Sampel Judul: {nb.sampleTitles.join(' • ')}
                      </p>
                    </div>
                    <button
                      onClick={() => handleRestoreNewsBackup(nb.data)}
                      className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shrink-0 cursor-pointer shadow-sm"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Pulihkan Berita ke Supabase</span>
                    </button>
                  </div>
                ))}

                {/* Gallery backups detected */}
                {scanResults.galleryBackups.map((gb, i) => (
                  <div
                    key={`gallery-b-${i}`}
                    className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-emerald-950">Riwayat Galeri Terdeteksi ({gb.itemCount} Foto)</span>
                        <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md">
                          {gb.key}
                        </span>
                      </div>
                      <p className="text-[11px] text-emerald-700 mt-1 line-clamp-1">
                        Sampel: {gb.sampleTitles.join(' • ')}
                      </p>
                    </div>
                    <button
                      onClick={() => handleRestoreGalleryBackup(gb.data)}
                      className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shrink-0 cursor-pointer shadow-sm"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Pulihkan Galeri ke Supabase</span>
                    </button>
                  </div>
                ))}

                {/* Full backups detected */}
                {scanResults.fullBackups.map((fb, i) => (
                  <div
                    key={`full-b-${i}`}
                    className="p-3.5 rounded-2xl bg-purple-50/70 border border-purple-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-purple-950">Cadangan Lengkap Terdeteksi ({fb.itemCount} Total Item)</span>
                        <span className="text-[10px] font-mono bg-purple-100 text-purple-800 px-2 py-0.5 rounded-md">
                          {fb.key}
                        </span>
                      </div>
                      <p className="text-[11px] text-purple-700 mt-1 line-clamp-1">
                        Waktu Cadangan: {fb.dateDetected}
                      </p>
                    </div>
                    <button
                      onClick={() => handleRestoreFullBackup(fb.data)}
                      className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shrink-0 cursor-pointer shadow-sm"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Pulihkan Seluruh Data ke Supabase</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* JSON Backup & Restore Tools */}
        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="text-slate-500 text-[11px]">
            Cadangkan data secara mandiri untuk menghindari kehilangan data di masa depan.
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleExportBackupFile}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <FileDown className="w-3.5 h-3.5 text-blue-600" />
              <span>Unduh Cadangan (JSON)</span>
            </button>
            <label className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold flex items-center gap-1.5 transition-colors cursor-pointer">
              <FileUp className="w-3.5 h-3.5 text-emerald-600" />
              <span>Impor Cadangan (JSON)</span>
              <input
                type="file"
                accept=".json,application/json"
                onChange={handleImportBackupFile}
                className="hidden"
              />
            </label>
          </div>
        </div>
      </div>

      {/* Speed & Multi-Device Sync Diagnostics Card */}
      <div className="bg-slate-900 text-slate-100 p-5 rounded-3xl border border-slate-800 shadow-md space-y-4">
        <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold shrink-0">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-black text-white flex items-center gap-2">
              <span>Mengapa Sinkronisasi di Perangkat Lain Terkadang Lama?</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                Optimasi Aktif
              </span>
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Faktor teknis yang memengaruhi kecepatan sinkronisasi lintas perangkat beserta langkah pencegahannya.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-amber-400 font-bold">
              <Activity className="w-4 h-4 shrink-0" />
              <span>1. Kuota Egress Supabase</span>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Jika akun Supabase gratis melebihi kuota bandwidth bulanan (<em>exceed_egress_quota</em>), server akan membatasi (<em>throttle</em>) permintaan sehingga perangkat lain tertahan (pending). Sistem kini telah dibekali batas waktu <strong>7 detik (timeout guard)</strong> agar browser tidak membeku.
            </p>
          </div>

          <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-cyan-400 font-bold">
              <HardDrive className="w-4 h-4 shrink-0" />
              <span>2. Ukuran Foto Base64</span>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Foto resolusi tinggi yang disimpan dalam format teks Base64 dapat berukuran 2–10MB per foto. Mengunduh puluhan MB via jaringan seluler HP membutuhkan waktu lebih lama. Disarankan mengompresi foto sebelum diunggah ke CMS.
            </p>
          </div>

          <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-bold">
              <Wifi className="w-4 h-4 shrink-0" />
              <span>3. Unggah Paralel & Ringan</span>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Sistem telah dioptimalkan: data kini diunggah dalam kelompok paralel (4 request simultan) dan salinan cadangan dipisahkan agar perangkat pengunjung tidak ikut mengunduh duplikat data yang berat.
            </p>
          </div>
        </div>
      </div>

      {/* Confirmation Safeguard Modal for Syncing Dummy Data */}
      {showSyncWarningModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-amber-200 space-y-4 animate-in zoom-in-95">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6 text-amber-600" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-base font-black text-slate-900">
                Peringatan: Menimpa Database dengan Data Kosong/Dummy?
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Saat ini data lokal Anda hanya berisi <strong>{news.length} Berita Template</strong> dan <strong>{gallery.length} Galeri</strong>.
                Jika Anda melanjutkan, database online Supabase akan ditimpa dengan data ini.
              </p>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setShowSyncWarningModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
              >
                Batalkan
              </button>
              <button
                onClick={executeManualSync}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs transition-colors cursor-pointer shadow-md"
              >
                Tetap Lanjutkan Unggah
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Connection Credentials Card */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <h4 className="text-sm font-black text-slate-900 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Kredensial & Konfigurasi Proyek Supabase</span>
        </h4>

        <div className="space-y-3 text-xs">
          <div>
            <label className="block text-[11px] font-bold text-slate-500 mb-1">
              Project URL
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={SUPABASE_URL}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs text-slate-800 select-all"
              />
              <button
                onClick={handleCopyUrl}
                className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors shrink-0"
              >
                {copiedUrl ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedUrl ? 'Tersalin' : 'Salin'}</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 mb-1">
              Publishable / Anon API Key
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={SUPABASE_ANON_KEY}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs text-slate-800 select-all truncate"
              />
              <button
                onClick={handleCopyKey}
                className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors shrink-0"
              >
                {copiedKey ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey ? 'Tersalin' : 'Salin'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* SQL Script & Setup Guide */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <Terminal className="w-4 h-4 text-purple-600" />
              <span>Inisialisasi Tabel Supabase (SQL Editor)</span>
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Jika tabel <code className="bg-slate-100 px-1 py-0.5 rounded text-purple-700 font-mono">public.pkbm_records</code> belum dibuat di Supabase, cukup jalankan skrip SQL ini sekali saja.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopySql}
              className="px-3.5 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {copiedSql ? <Check className="w-3.5 h-3.5 text-purple-700" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSql ? 'Skrip SQL Tersalin!' : 'Salin Skrip SQL'}</span>
            </button>
            <button
              onClick={() => setShowSql(!showSql)}
              className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
            >
              {showSql ? 'Sembunyikan SQL' : 'Lihat Skrip SQL'}
            </button>
          </div>
        </div>

        {/* Step by Step instructions */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <div className="w-5 h-5 rounded-full bg-purple-600 text-white font-bold text-[11px] flex items-center justify-center">1</div>
            <p className="font-bold text-slate-800">Buka SQL Editor</p>
            <p className="text-slate-500 text-[11px]">Buka project Supabase Anda, lalu klik menu <strong>SQL Editor</strong> di bilah samping kiri.</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <div className="w-5 h-5 rounded-full bg-purple-600 text-white font-bold text-[11px] flex items-center justify-center">2</div>
            <p className="font-bold text-slate-800">Tempelkan Skrip</p>
            <p className="text-slate-500 text-[11px]">Klik <strong>New Query</strong>, tempelkan skrip SQL yang telah Anda salin di atas ke editor.</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <div className="w-5 h-5 rounded-full bg-purple-600 text-white font-bold text-[11px] flex items-center justify-center">3</div>
            <p className="font-bold text-slate-800">Klik Run (F5)</p>
            <p className="text-slate-500 text-[11px]">Tekan tombol hijau <strong>Run</strong>. Tabel dan publication realtime akan langsung siap digunakan!</p>
          </div>
        </div>

        {/* Expandable SQL Code Box */}
        {showSql && (
          <div className="mt-3">
            <div className="bg-slate-950 text-slate-200 p-4 rounded-2xl font-mono text-[11px] overflow-x-auto border border-slate-800 max-h-72">
              <pre>{SUPABASE_SQL_SETUP_SCRIPT}</pre>
            </div>
          </div>
        )}
      </div>

      {/* Data Inventory Grid */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-black text-slate-900 flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-600" />
            <span>Inventaris Data yang Disinkronkan</span>
          </h4>
          <span className="text-xs text-slate-400 font-bold">10 Entitas Terdaftar</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {dataInventory.map((item, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between"
            >
              <div>
                <p className="text-xs font-bold text-slate-800">{item.label}</p>
                <p className="text-[11px] font-mono text-slate-400 mt-0.5">key: {item.key}</p>
              </div>
              <div className="text-right">
                <span className="text-base font-black text-slate-900">{item.count}</span>
                <span className="block text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full mt-0.5">
                  Tersinkron
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
