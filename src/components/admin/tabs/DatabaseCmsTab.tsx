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
  Sparkles
} from 'lucide-react';
import { usePKBM } from '../../../context/PKBMContext';
import {
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  SUPABASE_SQL_SETUP_SCRIPT
} from '../../../lib/supabase';

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
    pkbmInfo
  } = usePKBM();

  const [copiedSql, setCopiedSql] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);
  const [showSql, setShowSql] = useState(false);
  const [syncFeedback, setSyncFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [pingLog, setPingLog] = useState<string | null>(null);

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

  const handleManualSync = async () => {
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
