import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Target, Compass, Flag, Sparkles, CheckCircle, ShieldCheck, Building2 } from 'lucide-react';
import { usePKBM } from '../context/PKBMContext';

interface AboutUsProps {
  onOpenAdmin?: () => void;
}

export const AboutUs: React.FC<AboutUsProps> = ({ onOpenAdmin }) => {
  const { visiMisi, mottoValues, aboutProfile, pkbmInfo } = usePKBM();
  const [activeTab, setActiveTab] = useState<'visi-misi' | 'motto' | 'tujuan'>('visi-misi');

  return (
    <section id="tentang-kami" className="py-24 bg-gradient-to-b from-[#0c0a09] via-[#1c1917] to-[#0c0a09] text-white relative overflow-hidden">
      {/* Decorative luxury background glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-stone-900 to-stone-950 text-amber-300 border border-orange-500/40 text-xs sm:text-sm font-black uppercase tracking-widest shadow-md">
            <Building2 className="w-4 h-4 text-orange-400" />
            Profil & Landasan Karakter Lembaga
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Tentang <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-yellow-400">{pkbmInfo.name}</span>
          </h2>
          <p className="text-stone-300 text-sm sm:text-lg leading-relaxed font-medium">
            {aboutProfile}
          </p>
        </div>

        {/* Tagline Card Breakdown: ENLARGED HEBAT - MANDIRI - KREATIF PILLARS */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 mb-20">
          {mottoValues.map((motto, idx) => (
            <motion.div
              key={motto.title + idx}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              className="p-7 sm:p-8 rounded-3xl bg-gradient-to-b from-stone-900/90 to-[#0c0a09]/90 border-2 border-orange-500/40 shadow-2xl hover:border-orange-400 hover:shadow-orange-500/20 transition-all relative overflow-hidden group backdrop-blur-md"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl group-hover:bg-orange-500/20 transition-all pointer-events-none" />
              
              <div className="flex items-center justify-between mb-6">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-400 via-amber-400 to-yellow-500 text-slate-950 flex items-center justify-center font-black text-2xl shadow-xl group-hover:scale-110 transition-transform border border-amber-200">
                  {motto.title[0]}
                </div>
                <span className="text-xs font-black tracking-widest uppercase bg-stone-950/80 text-amber-300 px-3 py-1 rounded-xl border border-orange-500/40">
                  Pilar {idx + 1}
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-black mb-3 text-amber-300 tracking-tight flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-orange-400" />
                {motto.title}
              </h3>

              <p className="text-stone-300 text-sm sm:text-base leading-relaxed font-medium">
                {motto.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* VISI Highlight Banner - Luxurious Royal Palette */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-r from-stone-950 via-stone-900 to-[#1c1917] text-white rounded-3xl p-8 sm:p-12 shadow-2xl border-2 border-orange-500/40 mb-20 relative overflow-hidden"
        >
          <div className="absolute -right-12 -bottom-12 opacity-10 pointer-events-none">
            <Compass className="w-80 h-80 text-amber-300" />
          </div>

          <div className="relative z-10 max-w-4xl space-y-5">
            <div className="inline-flex items-center gap-2 bg-stone-950 text-amber-300 border border-orange-500/40 px-4 py-1.5 rounded-full text-xs sm:text-sm font-black uppercase tracking-wider shadow-md">
              <Compass className="w-4 h-4 text-orange-400" />
              VISI UTAMA {pkbmInfo.name}
            </div>
            
            <blockquote className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-white to-amber-300 leading-snug tracking-tight font-serif italic">
              "{visiMisi.visi}"
            </blockquote>

            <p className="text-xs sm:text-base text-stone-300 pt-2 flex items-center gap-2 font-semibold">
              <Sparkles className="w-5 h-5 text-orange-400 shrink-0" />
              Komitmen mewujudkan SDM unggul, terampil, mandiri, dan berakhlak mulia di Sumowono.
            </p>
          </div>
        </motion.div>

        {/* Tab Navigation for MISI vs TUJUAN */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex p-1.5 rounded-2xl bg-stone-950/80 border border-orange-500/40 shadow-xl backdrop-blur-md">
            <button
              onClick={() => setActiveTab('visi-misi')}
              className={`px-6 py-3 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'visi-misi'
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-950/40'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              <Target className="w-4 h-4" />
              <span>MISI LEMBAGA ({visiMisi.misi.length} Pilar)</span>
            </button>
            
            <button
              onClick={() => setActiveTab('tujuan')}
              className={`px-6 py-3 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'tujuan'
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-950/40'
                  : 'text-stone-400 hover:text-white'
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
                className="bg-gradient-to-b from-stone-900/80 to-[#0c0a09]/80 p-7 rounded-3xl border border-orange-500/30 shadow-xl hover:border-orange-400 transition-all space-y-4 flex flex-col justify-between backdrop-blur-sm"
              >
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 text-white font-black text-base flex items-center justify-center border border-amber-200 shadow-md">
                    {index + 1}
                  </div>
                  <h4 className="font-black text-amber-300 text-lg leading-snug">
                    Misi ke-{index + 1}
                  </h4>
                  <p className="text-stone-300 text-sm leading-relaxed font-medium">
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
                className="bg-gradient-to-b from-stone-900/80 to-[#0c0a09]/80 p-7 rounded-3xl border border-orange-500/30 shadow-xl hover:border-orange-400 transition-all flex items-start gap-4 backdrop-blur-sm"
              >
                <div className="p-3.5 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 text-white font-black text-xl shrink-0 border border-amber-200 shadow-md">
                  0{index + 1}
                </div>
                <div className="space-y-2">
                  <h4 className="font-black text-amber-300 text-lg sm:text-xl">
                    Tujuan Strategis {index + 1}
                  </h4>
                  <p className="text-stone-300 text-sm sm:text-base leading-relaxed font-medium">
                    {tujuanText}
                  </p>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {/* Operational Excellence Footer Banner */}
        <div className="mt-16 bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-800 flex items-center justify-center font-bold text-xl shrink-0">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-base sm:text-lg">
                Ijazah Resmi & Pengelolaan Terakreditasi
              </h4>
              <p className="text-slate-600 text-xs sm:text-sm">
                NPSN: {pkbmInfo.npsn} • {pkbmInfo.accreditation}
              </p>
            </div>
          </div>
          <a
            href="#program-belajar"
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-white font-bold text-xs sm:text-sm transition-all whitespace-nowrap shadow-md shadow-orange-950/20"
          >
            Pilih Program Belajar
          </a>
        </div>

      </div>
    </section>
  );
};
