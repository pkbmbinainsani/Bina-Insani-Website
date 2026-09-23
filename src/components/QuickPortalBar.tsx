import React, { useState } from 'react';
import { UserPlus, ShieldCheck, BookOpen, Briefcase, MessageCircle, ArrowRight, ExternalLink, FileText, CheckCircle, X } from 'lucide-react';
import { PKBM_INFO } from '../data/pkbmData';

interface QuickPortalBarProps {
  onOpenRegistration: (programName?: string) => void;
  onNavigateTab?: (tabId: string) => void;
}

export const QuickPortalBar: React.FC<QuickPortalBarProps> = ({ onOpenRegistration, onNavigateTab }) => {
  const [activeModal, setActiveModal] = useState<'dapodik' | 'modul' | null>(null);

  return (
    <>
      <section className="relative z-20 -mt-8 sm:-mt-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-white rounded-3xl shadow-lg border border-[#E2E8F0] p-4 sm:p-6 grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
          
          {/* Tile 1: Pendaftaran Online */}
          <button
            onClick={() => onOpenRegistration()}
            className="p-4 rounded-2xl bg-[#F97316] hover:bg-[#EA580C] text-white transition-all flex flex-col justify-between group shadow-sm text-left cursor-pointer border border-[#FDBA74]/50"
          >
            <div className="flex items-center justify-between">
              <div className="p-2.5 rounded-xl bg-[#193B63] text-[#F4B942]">
                <UserPlus className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-black bg-[#193B63] text-white px-2 py-0.5 rounded uppercase">PWBB 2026</span>
            </div>
            <div className="mt-3">
              <p className="font-extrabold text-sm sm:text-base leading-snug">Pendaftaran Online</p>
              <p className="text-[11px] font-semibold text-white/90 mt-0.5 flex items-center gap-1">
                Isi Formulir Belajar <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </p>
            </div>
          </button>

          {/* Tile 2: Cek Dapodik & Ijazah */}
          <button
            onClick={() => setActiveModal('dapodik')}
            className="p-4 rounded-2xl bg-[#FFF7ED] hover:bg-[#FDBA74]/25 text-[#193B63] border border-[#FDBA74]/60 transition-all flex flex-col justify-between group shadow-xs text-left cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div className="p-2.5 rounded-xl bg-[#1976D2] text-white">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold bg-[#E3F2FD] text-[#1554A0] px-2 py-0.5 rounded border border-[#90CAF9]">Resmi Kemendikbud</span>
            </div>
            <div className="mt-3">
              <p className="font-extrabold text-sm sm:text-base leading-snug text-[#193B63]">Keabsahan Ijazah</p>
              <p className="text-[11px] text-[#486581] font-medium mt-0.5 flex items-center gap-1">
                Info Sistem Dapodik <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform text-[#1976D2]" />
              </p>
            </div>
          </button>

          {/* Tile 3: Akses E-Modul */}
          <button
            onClick={() => setActiveModal('modul')}
            className="p-4 rounded-2xl bg-[#F8FAFC] hover:bg-[#FFF7ED] text-[#193B63] border border-[#E2E8F0] transition-all flex flex-col justify-between group shadow-xs text-left cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div className="p-2.5 rounded-xl bg-[#F97316] text-white">
                <BookOpen className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold bg-[#FFF7ED] text-[#EA580C] px-2 py-0.5 rounded border border-[#FDBA74]">Bahan Ajar</span>
            </div>
            <div className="mt-3">
              <p className="font-extrabold text-sm sm:text-base leading-snug text-[#193B63]">Perpustakaan E-Modul</p>
              <p className="text-[11px] text-[#486581] font-medium mt-0.5 flex items-center gap-1">
                Download Modul Gratis <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform text-[#F97316]" />
              </p>
            </div>
          </button>

          {/* Tile 4: Pelatihan Vokasi */}
          <button
            onClick={() => onNavigateTab ? onNavigateTab('vokasi') : undefined}
            className="p-4 rounded-2xl bg-[#FFF7ED] hover:bg-[#FDBA74]/25 text-[#193B63] border border-[#FDBA74]/60 transition-all flex flex-col justify-between group shadow-xs text-left cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div className="p-2.5 rounded-xl bg-[#F4B942] text-stone-950 font-black">
                <Briefcase className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold bg-[#FEF9C3] text-[#854D0E] px-2 py-0.5 rounded border border-[#F4B942]">Keterampilan</span>
            </div>
            <div className="mt-3">
              <p className="font-extrabold text-sm sm:text-base leading-snug text-[#193B63]">Program Vokasi</p>
              <p className="text-[11px] text-[#486581] font-medium mt-0.5 flex items-center gap-1">
                4 Skill Siap Kerja <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform text-[#EA580C]" />
              </p>
            </div>
          </button>

          {/* Tile 5: WhatsApp Hotline */}
          <a
            href={`https://wa.me/${PKBM_INFO.whatsappNumber}?text=Halo%20Sekretariat%20PKBM%20Bina%20Insani%20Sumowono,%20saya%20ingin%20konsultasi`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 rounded-2xl bg-[#1976D2] hover:bg-[#1554A0] text-white transition-all flex flex-col justify-between group shadow-sm text-left col-span-2 lg:col-span-1 border border-blue-400/40"
          >
            <div className="flex items-center justify-between">
              <div className="p-2.5 rounded-xl bg-white text-[#1976D2]">
                <MessageCircle className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold bg-white/20 text-white px-2 py-0.5 rounded">Respon Cepat</span>
            </div>
            <div className="mt-3">
              <p className="font-extrabold text-sm sm:text-base leading-snug">Hotline Sekretariat</p>
              <p className="text-[11px] text-white/90 font-medium mt-0.5 flex items-center gap-1">
                Chat WA Sekarang <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </p>
            </div>
          </a>

        </div>
      </section>

      {/* Info Modal: Cek Dapodik & Ijazah */}
      {activeModal === 'dapodik' && (
        <div className="fixed inset-0 z-50 bg-[#1E293B]/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 space-y-4 border border-[#E2E8F0]">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
              <div className="flex items-center gap-2 text-[#1976D2]">
                <ShieldCheck className="w-6 h-6" />
                <h3 className="font-extrabold text-lg text-[#193B63]">Keabsahan Ijazah & Dapodik</h3>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1 rounded-lg hover:bg-[#F8FAFC] text-[#486581] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-sm text-[#1E293B]">
              <div className="p-3 bg-[#FFF7ED] rounded-2xl border border-[#FDBA74] space-y-1">
                <p className="font-bold text-[#EA580C] text-sm">Status Resmi Kelembagaan:</p>
                <p className="text-xs text-[#1E293B]"><strong>NPSN:</strong> P9979993</p>
                <p className="text-xs text-[#1E293B]"><strong>Akreditasi:</strong> Terakreditasi BAN-PDM</p>
                <p className="text-xs text-[#1E293B]"><strong>Izin Operasional:</strong> SK Dindikpora Kab. Semarang</p>
              </div>

              <p className="text-xs leading-relaxed text-[#486581]">
                Seluruh Warga Belajar di PKBM Bina Insani Sumowono terdaftar secara nasional di sistem Data Pokok Pendidikan (Dapodik) Kemendikbudristek RI. Ijazah Paket A, B, dan C yang diterbitkan sah 100% dan berhak melanjutkan ke perguruan tinggi negeri/swasta maupun melamar pekerjaan formal.
              </p>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 rounded-xl bg-[#F8FAFC] hover:bg-[#E2E8F0] text-[#486581] font-bold text-xs cursor-pointer"
              >
                Tutup
              </button>
              <button
                onClick={() => {
                  setActiveModal(null);
                  onOpenRegistration();
                }}
                className="px-4 py-2 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white font-bold text-xs shadow-xs cursor-pointer"
              >
                Daftar Warga Belajar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Info Modal: E-Modul Perpustakaan */}
      {activeModal === 'modul' && (
        <div className="fixed inset-0 z-50 bg-[#1E293B]/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 space-y-4 border border-[#E2E8F0]">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
              <div className="flex items-center gap-2 text-[#F97316]">
                <BookOpen className="w-6 h-6" />
                <h3 className="font-extrabold text-lg text-[#193B63]">Akses E-Modul & Kurikulum Merdeka</h3>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1 rounded-lg hover:bg-[#F8FAFC] text-[#486581] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <p className="text-xs text-[#486581]">
                PKBM Bina Insani Sumowono menyediakan akses bahan ajar digital (e-modul) lengkap secara gratis untuk seluruh warga belajar terdaftar:
              </p>

              <div className="space-y-2">
                <div className="p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] flex items-center justify-between">
                  <div>
                    <p className="font-bold text-xs text-[#193B63]">E-Modul Paket A (Setara SD)</p>
                    <p className="text-[10px] text-[#486581]">Mata Pelajaran Tematik & Literasi Dasar</p>
                  </div>
                  <span className="text-[10px] bg-[#FFF7ED] text-[#EA580C] font-bold px-2 py-0.5 rounded border border-[#FDBA74]">Tersedia</span>
                </div>

                <div className="p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] flex items-center justify-between">
                  <div>
                    <p className="font-bold text-xs text-[#193B63]">E-Modul Paket B (Setara SMP)</p>
                    <p className="text-[10px] text-[#486581]">IPA, IPS, Bahasa Indonesia, Matematika, B.Inggris</p>
                  </div>
                  <span className="text-[10px] bg-[#E3F2FD] text-[#1554A0] font-bold px-2 py-0.5 rounded border border-[#90CAF9]">Tersedia</span>
                </div>

                <div className="p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] flex items-center justify-between">
                  <div>
                    <p className="font-bold text-xs text-[#193B63]">E-Modul Paket C (Setara SMA)</p>
                    <p className="text-[10px] text-[#486581]">Jurusan IPA / IPS & Modul Kewirausahaan</p>
                  </div>
                  <span className="text-[10px] bg-[#FEF9C3] text-[#854D0E] font-bold px-2 py-0.5 rounded border border-[#F4B942]">Tersedia</span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 rounded-xl bg-[#F8FAFC] hover:bg-[#E2E8F0] text-[#486581] font-bold text-xs cursor-pointer"
              >
                Tutup
              </button>
              <button
                onClick={() => {
                  setActiveModal(null);
                  onOpenRegistration();
                }}
                className="px-4 py-2 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white font-bold text-xs shadow-xs cursor-pointer"
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
