import React from 'react';
import { motion } from 'motion/react';
import { usePKBM } from '../context/PKBMContext';
import { Laptop, Utensils, Palette, TrendingUp, Sparkles, CheckCircle2, Award, BookOpen, Wrench, Scissors } from 'lucide-react';

const renderIcon = (iconName: string) => {
  switch (iconName) {
    case 'Laptop':
      return <Laptop className="w-6 h-6 text-blue-400" />;
    case 'Utensils':
      return <Utensils className="w-6 h-6 text-amber-400" />;
    case 'Palette':
      return <Palette className="w-6 h-6 text-purple-400" />;
    case 'TrendingUp':
      return <TrendingUp className="w-6 h-6 text-amber-400" />;
    case 'Scissors':
      return <Scissors className="w-6 h-6 text-pink-400" />;
    case 'Wrench':
      return <Wrench className="w-6 h-6 text-orange-400" />;
    default:
      return <Award className="w-6 h-6 text-amber-400" />;
  }
};

export const VokasiSection: React.FC = () => {
  const { vokasiPrograms, pkbmInfo } = usePKBM();

  return (
    <section id="vokasi" className="py-20 bg-[#0c0a09] text-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-80 h-80 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-500/20 text-orange-300 border border-orange-500/30 text-xs font-extrabold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Penguatan Kemandirian & Kreativitas Warga Belajar
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Program Keterampilan <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-yellow-400">Vokasional & Wirausaha</span>
          </h2>
          <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
            Tidak hanya sekadar mendapatkan ijazah formal, setiap warga belajar di {pkbmInfo.name} dibekali dengan keahlian terapan untuk siap kerja dan berwirausaha secara mandiri.
          </p>
        </div>

        {/* Vokasi Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {vokasiPrograms.map((vokasi, idx) => (
            <motion.div
              key={vokasi.title + idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-stone-900/90 border border-stone-800 rounded-2xl p-6 hover:border-orange-400/50 hover:shadow-lg hover:shadow-orange-950/40 transition-all group flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-stone-950 border border-stone-700 flex items-center justify-center group-hover:scale-110 group-hover:border-orange-500/40 transition-transform">
                  {renderIcon(vokasi.icon)}
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] font-extrabold tracking-wider uppercase px-2 py-0.5 rounded bg-orange-950/80 text-orange-300 border border-orange-800">
                    Durasi: {vokasi.duration}
                  </span>
                  <h3 className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors">
                    {vokasi.title}
                  </h3>
                  <p className="text-stone-300 text-xs leading-relaxed">
                    {vokasi.description}
                  </p>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-stone-800 text-xs text-orange-200 flex items-start gap-1.5 font-medium">
                <CheckCircle2 className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                <span>Capaian: {vokasi.output}</span>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
