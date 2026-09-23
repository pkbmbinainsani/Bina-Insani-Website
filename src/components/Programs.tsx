import React, { useState } from 'react';
import { motion } from 'motion/react';
import { BookOpen, GraduationCap, Award, CheckCircle, Clock, Calendar, Users, ArrowRight, X, Sparkles, HelpCircle, Share2 } from 'lucide-react';
import { usePKBM } from '../context/PKBMContext';
import { Program } from '../types';

interface ProgramsProps {
  onOpenRegistration: (programName?: string) => void;
  onShareCustom?: (data: { title: string; description: string; hash: string; category?: string }) => void;
}

export const Programs: React.FC<ProgramsProps> = ({ onOpenRegistration, onShareCustom }) => {
  const { programs, pkbmInfo } = usePKBM();
  const [selectedProgramModal, setSelectedProgramModal] = useState<Program | null>(null);

  const getBadgeStyle = (code: string) => {
    switch (code) {
      case 'Paket A':
        return { bg: 'bg-orange-100 text-orange-900 border-orange-300', btn: 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 shadow-orange-950/20' };
      case 'Paket B':
        return { bg: 'bg-amber-100 text-amber-900 border-amber-300', btn: 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 shadow-amber-950/20' };
      case 'Paket C':
        return { bg: 'bg-orange-200 text-orange-950 border-orange-400', btn: 'bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 shadow-orange-950/20' };
      default:
        return { bg: 'bg-stone-100 text-stone-800 border-stone-300', btn: 'bg-stone-800 hover:bg-stone-900' };
    }
  };

  return (
    <section id="program-belajar" className="pt-4 sm:pt-6 pb-16 bg-stone-50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Compact Key Benefits Strip */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 mb-6 p-2 sm:px-3.5 rounded-xl bg-white border border-stone-200 shadow-xs text-xs">
          <div className="flex flex-wrap items-center gap-2 font-semibold text-slate-700">
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-orange-100 text-orange-900 font-extrabold text-[11px]">
              <GraduationCap className="w-3.5 h-3.5 text-orange-600" />
              <span>Pilihan Program Kesetaraan</span>
            </span>
            <span className="hidden sm:inline text-stone-300">•</span>
            <span className="hidden sm:inline text-[11px] text-stone-600">Ijazah Resmi Kemendikbudristek</span>
            <span className="hidden md:inline text-stone-300">•</span>
            <span className="hidden md:inline text-[11px] text-stone-600">SPP 100% Gratis (Usia Sekolah Tercover BOSP)</span>
          </div>
          <button
            onClick={() => onOpenRegistration()}
            className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-white font-extrabold text-[11px] shadow-xs transition-all cursor-pointer"
          >
            <span>Daftar Sekarang</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Programs Cards Grid */}
        <div className="grid md:grid-cols-3 gap-5 lg:gap-6">
          {programs.map((prog, idx) => {
            const style = getBadgeStyle(prog.code);

            return (
              <motion.div
                key={prog.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
                className="bg-white rounded-3xl border border-stone-200/90 shadow-sm hover:shadow-xl hover:border-orange-300 transition-all duration-300 overflow-hidden flex flex-col group"
              >
                {/* Program Header Image & Badge */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={prog.image}
                    alt={prog.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0c0a09]/90 via-[#0c0a09]/30 to-transparent" />
                  
                  <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-extrabold border shadow-sm ${style.bg}`}>
                      {prog.equivalency}
                    </span>
                  </div>

                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-2xl font-black text-white">
                      {prog.title}
                    </h3>
                  </div>
                </div>

                {/* Card Content Body */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-6">
                  <div className="space-y-4">
                    <p className="text-stone-600 text-sm leading-relaxed">
                      {prog.description}
                    </p>

                    {/* Program Meta Info */}
                    <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-100 space-y-2 text-xs">
                      <div className="flex items-center justify-between text-stone-700">
                        <span className="flex items-center gap-1.5 font-medium">
                          <Users className="w-3.5 h-3.5 text-orange-600" />
                          Target Usia:
                        </span>
                        <span className="font-bold text-stone-900">{prog.targetAge}</span>
                      </div>
                      <div className="flex items-center justify-between text-stone-700">
                        <span className="flex items-center gap-1.5 font-medium">
                          <Clock className="w-3.5 h-3.5 text-orange-600" />
                          Lama Studi:
                        </span>
                        <span className="font-bold text-stone-900">{prog.duration}</span>
                      </div>
                    </div>

                    {/* Key Features List */}
                    <div className="space-y-2 pt-2">
                      <p className="text-xs font-bold text-stone-900 uppercase tracking-wider">Keunggulan Utama:</p>
                      {prog.features.slice(0, 3).map((feat, fIdx) => (
                        <div key={fIdx} className="flex items-start gap-2 text-xs text-stone-700">
                          <CheckCircle className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions Buttons */}
                  <div className="pt-4 border-t border-stone-100 space-y-2">
                    <button
                      onClick={() => onOpenRegistration(prog.code)}
                      className={`w-full py-3 px-4 rounded-xl text-white font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer ${style.btn}`}
                    >
                      <span>Daftar {prog.code}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedProgramModal(prog)}
                        className="flex-1 py-2 px-3 rounded-xl text-stone-700 hover:text-orange-700 font-semibold text-xs transition-colors hover:bg-orange-50 flex items-center justify-center gap-1.5 cursor-pointer border border-stone-200"
                      >
                        <HelpCircle className="w-3.5 h-3.5 text-stone-500" />
                        <span>Detail & Syarat</span>
                      </button>

                      {onShareCustom && (
                        <button
                          type="button"
                          onClick={() =>
                            onShareCustom({
                              title: `Program Kesetaraan ${prog.code} (${prog.name}) - PKBM Bina Insani`,
                              description: `${prog.description} Layanan resmi berijazah negara dengan SPP gratis.`,
                              hash: '#program-belajar',
                              category: 'Program Kesetaraan'
                            })
                          }
                          className="p-2 rounded-xl text-orange-600 hover:bg-orange-50 border border-orange-200 cursor-pointer transition-colors"
                          title={`Bagikan info ${prog.code}`}
                        >
                          <Share2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Kurikulum & Modalitas Banner */}
        <div className="mt-16 bg-gradient-to-br from-[#0c0a09] via-[#1c1917] to-stone-900 text-white rounded-3xl p-8 sm:p-10 shadow-2xl border border-orange-500/30 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-2 max-w-2xl">
            <span className="px-3 py-1 rounded-full bg-orange-950 text-amber-300 text-xs font-extrabold border border-orange-700">
              SISTEM PEMBELAJARAN FLEKSIBEL
            </span>
            <h3 className="text-2xl sm:text-3xl font-black">
              Cocok Bagi Anak Usia Sekolah Maupun Warga Belajar Pekerja
            </h3>
            <p className="text-stone-300 text-sm leading-relaxed">
              PKBM Bina Insani Sumowono memadukan sistem Tatap Muka (KBM), Tutorial Mandiri, serta Modul Digital sehingga proses belajar dapat disesuaikan dengan kesibukan warga belajar tanpa mengurangi mutu lulusan.
            </p>
          </div>

          <button
            onClick={() => onOpenRegistration()}
            className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-white font-extrabold text-sm transition-all shadow-lg shadow-orange-950/40 whitespace-nowrap cursor-pointer border border-orange-300/40"
          >
            Konsultasi Pendaftaran Gratis
          </button>
        </div>

      </div>

      {/* Program Detail Popup Modal */}
      {selectedProgramModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-stone-200 p-6 sm:p-8 relative"
          >
            <button
              onClick={() => setSelectedProgramModal(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-orange-100 text-orange-900 border border-orange-300">
                  {selectedProgramModal.equivalency}
                </span>
                <span className="text-xs text-stone-500 font-semibold">{selectedProgramModal.duration}</span>
              </div>

              <div>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-900">
                  {selectedProgramModal.title}
                </h3>
                <p className="text-orange-600 font-semibold text-sm mt-1">
                  {selectedProgramModal.subtitle}
                </p>
              </div>

              <p className="text-stone-600 text-sm leading-relaxed">
                {selectedProgramModal.description}
              </p>

              {/* Schedules */}
              <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-2">
                <p className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">Metode & Mode Belajar:</p>
                <ul className="list-disc list-inside text-xs text-stone-700 space-y-1">
                  {selectedProgramModal.schedule.map((s, idx) => (
                    <li key={idx}>{s}</li>
                  ))}
                </ul>
              </div>

              {/* All Features */}
              <div className="space-y-3">
                <p className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">Fasilitas & Layanan Program:</p>
                <div className="space-y-2">
                  {selectedProgramModal.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-stone-700">
                      <CheckCircle className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Requirement Checklist */}
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1.5">
                <p className="font-bold flex items-center gap-1.5 text-amber-800">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  Berkas Pendaftaran {selectedProgramModal.code}:
                </p>
                <p>1. Fotokopi Kartu Keluarga (KK) & KTP (jika sudah punya)</p>
                <p>2. Pasfoto terbaru ukuran 3x4 (4 lembar, latar merah)</p>
                <p>3. Fotokopi Ijazah Jenjang Sebelumnya / Surat Keterangan Lulus / Rapor Terakhir</p>
              </div>

              {/* Action */}
              <div className="pt-2 flex gap-3">
                <button
                  onClick={() => {
                    const code = selectedProgramModal.code;
                    setSelectedProgramModal(null);
                    onOpenRegistration(code);
                  }}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-white font-bold text-sm shadow-md shadow-orange-950/20 transition-all text-center border border-orange-300/40 cursor-pointer"
                >
                  Daftar Sekarang untuk {selectedProgramModal.code}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

    </section>
  );
};
