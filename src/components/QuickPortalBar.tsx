import React, { useState } from 'react';
import { UserPlus, ShieldCheck, BookOpen, Briefcase, MessageCircle, ArrowRight, ExternalLink, FileText, CheckCircle, X } from 'lucide-react';
import { PKBM_INFO } from '../data/pkbmData';

interface QuickPortalBarProps {
  onOpenRegistration: (programName?: string) => void;
}

export const QuickPortalBar: React.FC<QuickPortalBarProps> = ({ onOpenRegistration }) => {
  const [activeModal, setActiveModal] = useState<'dapodik' | 'modul' | null>(null);

  return (
    <>
      <section className="relative z-20 -mt-8 sm:-mt-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-gradient-to-b from-white to-orange-50/40 rounded-3xl shadow-2xl border-2 border-orange-200/90 p-4 sm:p-6 grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
          
          {/* Tile 1: Pendaftaran Online */}
          <button
            onClick={() => onOpenRegistration()}
            className="p-4 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-white transition-all flex flex-col justify-between group shadow-md text-left cursor-pointer border border-orange-300"
          >
            <div className="flex items-center justify-between">
              <div className="p-2.5 rounded-xl bg-slate-950 text-amber-300">
                <UserPlus className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-black bg-slate-950 text-white px-2 py-0.5 rounded uppercase">PWBB 2026</span>
            </div>
            <div className="mt-3">
              <p className="font-extrabold text-sm sm:text-base leading-snug">Pendaftaran Online</p>
              <p className="text-[11px] font-semibold text-orange-100 mt-0.5 flex items-center gap-1">
                Isi Formulir Belajar <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </p>
            </div>
          </button>

          {/* Tile 2: Cek Dapodik & Ijazah */}
          <button
            onClick={() => setActiveModal('dapodik')}
            className="p-4 rounded-2xl bg-orange-50/80 hover:bg-orange-100/90 text-orange-950 border border-orange-200 transition-all flex flex-col justify-between group shadow-sm text-left cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div className="p-2.5 rounded-xl bg-orange-600 text-white">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold bg-orange-200 text-orange-900 px-2 py-0.5 rounded">Resmi Kemendikbud</span>
            </div>
            <div className="mt-3">
              <p className="font-extrabold text-sm sm:text-base leading-snug text-slate-900">Keabsahan Ijazah</p>
              <p className="text-[11px] text-orange-800 font-medium mt-0.5 flex items-center gap-1">
                Info Sistem Dapodik <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform text-orange-600" />
              </p>
            </div>
          </button>

          {/* Tile 3: Akses E-Modul */}
          <button
            onClick={() => setActiveModal('modul')}
            className="p-4 rounded-2xl bg-stone-50 hover:bg-stone-100 text-stone-900 border border-stone-200 transition-all flex flex-col justify-between group shadow-sm text-left cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div className="p-2.5 rounded-xl bg-amber-600 text-white">
                <BookOpen className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded">Bahan Ajar</span>
            </div>
            <div className="mt-3">
              <p className="font-extrabold text-sm sm:text-base leading-snug text-slate-900">Perpustakaan E-Modul</p>
              <p className="text-[11px] text-stone-600 font-medium mt-0.5 flex items-center gap-1">
                Download Modul Gratis <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform text-amber-600" />
              </p>
            </div>
          </button>

          {/* Tile 4: Pelatihan Vokasi */}
          <a
            href="#vokasi"
            className="p-4 rounded-2xl bg-amber-50/80 hover:bg-amber-100/90 text-amber-950 border border-amber-200/90 transition-all flex flex-col justify-between group shadow-sm text-left"
          >
            <div className="flex items-center justify-between">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 text-white">
                <Briefcase className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold bg-amber-200 text-amber-950 px-2 py-0.5 rounded">Keterampilan</span>
            </div>
            <div className="mt-3">
              <p className="font-extrabold text-sm sm:text-base leading-snug text-slate-900">Program Vokasi</p>
              <p className="text-[11px] text-stone-600 font-medium mt-0.5 flex items-center gap-1">
                4 Skill Siap Kerja <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform text-orange-600" />
              </p>
            </div>
          </a>

          {/* Tile 5: WhatsApp Hotline */}
          <a
            href={`https://wa.me/${PKBM_INFO.whatsappNumber}?text=Halo%20Sekretariat%20PKBM%20Bina%20Insani%20Sumowono,%20saya%20ingin%20konsultasi`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white transition-all flex flex-col justify-between group shadow-md text-left col-span-2 lg:col-span-1"
          >
            <div className="flex items-center justify-between">
              <div className="p-2.5 rounded-xl bg-white text-orange-600">
                <MessageCircle className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold bg-orange-950/70 text-orange-100 px-2 py-0.5 rounded">Respon Cepat</span>
            </div>
            <div className="mt-3">
              <p className="font-extrabold text-sm sm:text-base leading-snug">Hotline Sekretariat</p>
              <p className="text-[11px] text-orange-100 font-medium mt-0.5 flex items-center gap-1">
                Chat WA Sekarang <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </p>
            </div>
          </a>

        </div>
      </section>

      {/* Info Modal: Cek Dapodik & Ijazah */}
      {activeModal === 'dapodik' && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 space-y-4 border border-orange-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 text-orange-600">
                <ShieldCheck className="w-6 h-6" />
                <h3 className="font-extrabold text-lg text-slate-900">Keabsahan Ijazah & Dapodik</h3>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-500 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-sm text-slate-600">
              <div className="p-3 bg-orange-50 rounded-2xl border border-orange-200 space-y-1">
                <p className="font-bold text-orange-700 text-sm">Status Resmi Kelembagaan:</p>
                <p className="text-xs text-slate-700"><strong>NPSN:</strong> P9979993</p>
                <p className="text-xs text-slate-700"><strong>Akreditasi:</strong> Terakreditasi BAN-PDM</p>
                <p className="text-xs text-slate-700"><strong>Izin Operasional:</strong> SK Dindikpora Kab. Semarang</p>
              </div>

              <p className="text-xs leading-relaxed text-slate-600">
                Seluruh Warga Belajar di PKBM Bina Insani Sumowono terdaftar secara nasional di sistem Data Pokok Pendidikan (Dapodik) Kemendikbudristek RI. Ijazah Paket A, B, dan C yang diterbitkan sah 100% dan berhak melanjutkan ke perguruan tinggi negeri/swasta maupun melamar pekerjaan formal.
              </p>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
              >
                Tutup
              </button>
              <button
                onClick={() => {
                  setActiveModal(null);
                  onOpenRegistration();
                }}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold text-xs shadow-md cursor-pointer"
              >
                Daftar Warga Belajar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Info Modal: E-Modul Perpustakaan */}
      {activeModal === 'modul' && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 space-y-4 border border-orange-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 text-orange-600">
                <BookOpen className="w-6 h-6" />
                <h3 className="font-extrabold text-lg text-slate-900">Akses E-Modul & Kurikulum Merdeka</h3>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-500 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <p className="text-xs text-slate-600">
                PKBM Bina Insani Sumowono menyediakan akses bahan ajar digital (e-modul) lengkap secara gratis untuk seluruh warga belajar terdaftar:
              </p>

              <div className="space-y-2">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-xs text-slate-800">E-Modul Paket A (Setara SD)</p>
                    <p className="text-[10px] text-slate-500">Mata Pelajaran Tematik & Literasi Dasar</p>
                  </div>
                  <span className="text-[10px] bg-orange-100 text-orange-800 font-bold px-2 py-0.5 rounded">Tersedia</span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-xs text-slate-800">E-Modul Paket B (Setara SMP)</p>
                    <p className="text-[10px] text-slate-500">IPA, IPS, Bahasa Indonesia, Matematika, B.Inggris</p>
                  </div>
                  <span className="text-[10px] bg-orange-100 text-orange-800 font-bold px-2 py-0.5 rounded">Tersedia</span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-xs text-slate-800">E-Modul Paket C (Setara SMA)</p>
                    <p className="text-[10px] text-slate-500">Jurusan IPA / IPS & Modul Kewirausahaan</p>
                  </div>
                  <span className="text-[10px] bg-orange-100 text-orange-800 font-bold px-2 py-0.5 rounded">Tersedia</span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
              >
                Tutup
              </button>
              <button
                onClick={() => {
                  setActiveModal(null);
                  onOpenRegistration();
                }}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold text-xs shadow-md cursor-pointer"
              >
                Dapatkan Modul Gratis
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
