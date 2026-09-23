import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Target, Compass, Flag, Sparkles, CheckCircle, ShieldCheck, Building2, Share2 } from 'lucide-react';
import { usePKBM } from '../context/PKBMContext';

interface AboutUsProps {
  onOpenAdmin?: () => void;
  onShareCustom?: (data: { title: string; description: string; hash: string; category?: string }) => void;
}

export const AboutUs: React.FC<AboutUsProps> = ({ onOpenAdmin, onShareCustom }) => {
  const { visiMisi, mottoValues, aboutProfile, pkbmInfo } = usePKBM();
  const [activeTab, setActiveTab] = useState<'visi-misi' | 'motto' | 'tujuan'>('visi-misi');

  return (
    <section id="tentang-kami" className="pt-4 sm:pt-6 pb-16 bg-[#F8FAFC] text-[#1E293B] relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#FDBA74]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#F97316]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Compact Institutional Identity Banner */}
        <div className="mb-6 p-3.5 sm:p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FFF7ED] border border-[#FDBA74] text-[#EA580C] flex items-center justify-center shrink-0">
              <Building2 className="w-5 h-5 text-[#F97316]" />
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-[#EA580C]">Profil & Landasan Karakter Lembaga</div>
              <p className="text-slate-600 text-xs sm:text-sm font-medium leading-snug line-clamp-2">
                {aboutProfile}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
            {onShareCustom && (
              <button
                type="button"
                onClick={() => onShareCustom({
                  title: 'Profil & Visi Misi PKBM Bina Insani Sumowono',
                  description: aboutProfile || 'Lembaga Pendidikan Nonformal terakreditasi resmi di Kecamatan Sumowono.',
                  hash: '#tentang-kami',
                  category: 'Profil Lembaga'
                })}
                className="px-2.5 py-1 rounded-lg bg-[#FFF7ED] hover:bg-[#FDBA74]/30 text-[#EA580C] border border-[#FDBA74] text-[11px] font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Bagikan Profil Lembaga"
              >
                <Share2 className="w-3.5 h-3.5 text-[#F97316]" />
                <span>Bagikan Profil</span>
              </button>
            )}
            <span className="px-2.5 py-1 rounded-lg bg-[#F8FAFC] text-[#0F294A] border border-[#E2E8F0] text-[11px] font-mono font-semibold">
              NPSN: {pkbmInfo.npsn}
            </span>
          </div>
        </div>

        {/* Tagline Card Breakdown: Compact HEBAT - MANDIRI - KREATIF PILLARS */}
        <div className="grid md:grid-cols-3 gap-4 lg:gap-5 mb-10">
          {mottoValues.map((motto, idx) => (
            <motion.div
              key={motto.title + idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="p-4 sm:p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs hover:border-[#FDBA74] hover:shadow-md transition-all relative overflow-hidden group"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-[#F97316] text-white flex items-center justify-center font-black text-lg shadow-xs group-hover:scale-105 transition-transform border border-[#FDBA74]/50">
                  {motto.title[0]}
                </div>
                <span className="text-[10px] font-black tracking-widest uppercase bg-[#F8FAFC] text-[#0F294A] px-2.5 py-0.5 rounded-lg border border-[#E2E8F0]">
                  Pilar {idx + 1}
                </span>
              </div>

              <h3 className="text-lg sm:text-xl font-black mb-1.5 text-[#0F294A] tracking-tight flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#F97316]" />
                {motto.title}
              </h3>

              <p className="text-slate-600 text-xs sm:text-[13px] leading-relaxed font-normal">
                {motto.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* VISI Highlight Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-[#0F294A] text-white rounded-3xl p-8 sm:p-12 shadow-lg border border-white/10 mb-16 relative overflow-hidden"
        >
          <div className="absolute -right-12 -bottom-12 opacity-10 pointer-events-none">
            <Compass className="w-80 h-80 text-white" />
          </div>

          <div className="relative z-10 max-w-4xl space-y-5">
            <div className="inline-flex items-center gap-2 bg-white/10 text-[#F59E0B] border border-white/15 px-4 py-1.5 rounded-full text-xs sm:text-sm font-black uppercase tracking-wider">
              <Compass className="w-4 h-4 text-[#FDBA74]" />
              VISI UTAMA {pkbmInfo.name}
            </div>
            
            <blockquote className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white leading-snug tracking-tight font-serif italic">
              "{visiMisi.visi}"
            </blockquote>

            <p className="text-xs sm:text-base text-white/85 pt-2 flex items-center gap-2 font-semibold">
              <Sparkles className="w-5 h-5 text-[#F59E0B] shrink-0" />
              Komitmen mewujudkan SDM unggul, terampil, mandiri, dan berakhlak mulia di Sumowono.
            </p>
          </div>
        </motion.div>

        {/* Tab Navigation for MISI vs TUJUAN */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex p-1.5 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs">
            <button
              onClick={() => setActiveTab('visi-misi')}
              className={`px-6 py-3 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'visi-misi'
                  ? 'bg-[#F97316] text-white shadow-xs border border-[#FDBA74]/50'
                  : 'text-[#0F294A] hover:text-[#EA580C]'
              }`}
            >
              <Target className="w-4 h-4" />
              <span>MISI LEMBAGA ({visiMisi.misi.length} Pilar)</span>
            </button>
            
            <button
              onClick={() => setActiveTab('tujuan')}
              className={`px-6 py-3 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'tujuan'
                  ? 'bg-[#F97316] text-white shadow-xs border border-[#FDBA74]/50'
                  : 'text-[#0F294A] hover:text-[#EA580C]'
              }`}
            >
              <Flag className="w-4 h-4" />
              <span>TUJUAN PENDIDIKAN ({visiMisi.tujuan.length} Sasaran)</span>
            </button>
          </div>
        </div>

        {/* Tab Content Display */}
        {activeTab === 'visi-misi' && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {visiMisi.misi.map((misiText, index) => (
              <div
                key={index}
                className="bg-white p-7 rounded-3xl border border-[#E2E8F0] shadow-xs hover:border-[#FDBA74] hover:shadow-md transition-all space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-[#F97316] text-white font-black text-base flex items-center justify-center border border-[#FDBA74]/50 shadow-xs">
                    {index + 1}
                  </div>
                  <h4 className="font-black text-[#0F294A] text-lg leading-snug">
                    Misi ke-{index + 1}
                  </h4>
                  <p className="text-slate-600 text-sm leading-relaxed font-medium">
                    {misiText}
                  </p>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {activeTab === 'tujuan' && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="grid md:grid-cols-2 gap-6"
          >
            {visiMisi.tujuan.map((tujuanText, index) => (
              <div
                key={index}
                className="bg-white p-7 rounded-3xl border border-[#E2E8F0] shadow-xs hover:border-[#FDBA74] hover:shadow-md transition-all flex items-start gap-4"
              >
                <div className="p-3.5 rounded-2xl bg-[#F97316] text-white font-black text-xl shrink-0 border border-[#FDBA74]/50 shadow-xs">
                  0{index + 1}
                </div>
                <div className="space-y-2">
                  <h4 className="font-black text-[#0F294A] text-lg sm:text-xl">
                    Tujuan Strategis {index + 1}
                  </h4>
                  <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-medium">
                    {tujuanText}
                  </p>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {/* Operational Excellence Footer Banner */}
        <div className="mt-16 bg-white rounded-2xl p-6 sm:p-8 border border-[#E2E8F0] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#FFF7ED] text-[#EA580C] border border-[#FDBA74] flex items-center justify-center font-bold text-xl shrink-0">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <h4 className="font-bold text-[#0F294A] text-base sm:text-lg">
                Ijazah Resmi & Pengelolaan Terakreditasi
              </h4>
              <p className="text-slate-600 text-xs sm:text-sm">
                NPSN: {pkbmInfo.npsn} • {pkbmInfo.accreditation}
              </p>
            </div>
          </div>
          <a
            href="#program-belajar"
            className="px-5 py-2.5 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white font-bold text-xs sm:text-sm transition-all whitespace-nowrap shadow-xs border border-[#FDBA74]/50"
          >
            Pilih Program Belajar
          </a>
        </div>

      </div>
    </section>
  );
};
