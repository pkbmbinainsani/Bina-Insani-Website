import React from 'react';
import { motion } from 'motion/react';
import { usePKBM } from '../context/PKBMContext';
import { Laptop, Utensils, Palette, TrendingUp, Sparkles, CheckCircle2, Award, Wrench, Scissors, Share2 } from 'lucide-react';

const renderIcon = (iconName: string) => {
  switch (iconName) {
    case 'Laptop':
      return <Laptop className="w-6 h-6 text-[#1976D2]" />;
    case 'Utensils':
      return <Utensils className="w-6 h-6 text-[#F97316]" />;
    case 'Palette':
      return <Palette className="w-6 h-6 text-purple-600" />;
    case 'TrendingUp':
      return <TrendingUp className="w-6 h-6 text-[#EA580C]" />;
    case 'Scissors':
      return <Scissors className="w-6 h-6 text-pink-600" />;
    case 'Wrench':
      return <Wrench className="w-6 h-6 text-[#F97316]" />;
    default:
      return <Award className="w-6 h-6 text-[#F4B942]" />;
  }
};

interface VokasiSectionProps {
  onShareCustom?: (data: { title: string; description: string; hash: string; category?: string }) => void;
}

export const VokasiSection: React.FC<VokasiSectionProps> = ({ onShareCustom }) => {
  const { vokasiPrograms } = usePKBM();

  return (
    <section id="vokasi" className="pt-4 sm:pt-6 pb-16 bg-[#F8FAFC] text-[#1E293B] relative overflow-hidden">
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#FDBA74]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#F97316]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Compact Highlight Strip */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 mb-5 p-2 sm:px-3.5 rounded-xl bg-white border border-[#E2E8F0] shadow-xs text-xs">
          <div className="flex flex-wrap items-center gap-2 font-semibold text-[#193B63]">
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#FFF7ED] text-[#EA580C] font-extrabold text-[11px] border border-[#FDBA74]">
              <Sparkles className="w-3.5 h-3.5 text-[#F97316]" />
              <span>{vokasiPrograms.length} Bidang Keahlian Praktis</span>
            </span>
            <span className="hidden sm:inline text-[#CBD5E1]">•</span>
            <span className="hidden sm:inline text-[11px] text-[#486581]">Siap Kerja & Wirausaha Mandiri</span>
            <span className="hidden md:inline text-[#CBD5E1]">•</span>
            <span className="hidden md:inline text-[11px] text-[#486581]">Sertifikat Keterampilan Terapan Lembaga</span>
          </div>
          <span className="text-[11px] text-[#EA580C] font-mono hidden lg:inline font-bold">
            Gratis Untuk Warga Belajar Aktif
          </span>
        </div>

        {/* Vokasi Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {vokasiPrograms.map((vokasi, idx) => (
            <motion.div
              key={vokasi.title + idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-white border border-[#E2E8F0] rounded-2xl p-6 hover:border-[#FDBA74] hover:shadow-md transition-all group flex flex-col justify-between shadow-xs"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-[#FFF7ED] border border-[#FDBA74] flex items-center justify-center group-hover:scale-110 transition-transform">
                  {renderIcon(vokasi.icon)}
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] font-extrabold tracking-wider uppercase px-2 py-0.5 rounded bg-[#FFF7ED] text-[#EA580C] border border-[#FDBA74]">
                    Durasi: {vokasi.duration}
                  </span>
                  <h3 className="text-lg font-bold text-[#193B63] group-hover:text-[#EA580C] transition-colors">
                    {vokasi.title}
                  </h3>
                  <p className="text-[#486581] text-xs leading-relaxed">
                    {vokasi.description}
                  </p>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-[#E2E8F0] flex items-center justify-between gap-2">
                <div className="text-xs text-[#193B63] flex items-start gap-1.5 font-medium flex-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="line-clamp-2">Capaian: {vokasi.output}</span>
                </div>
                {onShareCustom && (
                  <button
                    type="button"
                    onClick={() =>
                      onShareCustom({
                        title: `Kursus Vokasi: ${vokasi.title} - PKBM Bina Insani`,
                        description: `${vokasi.description} Durasi ${vokasi.duration}, capaian: ${vokasi.output}.`,
                        hash: '#vokasi',
                        category: 'Pelatihan Vokasi'
                      })
                    }
                    className="p-1.5 rounded-lg bg-[#FFF7ED] hover:bg-[#FDBA74]/30 text-[#EA580C] border border-[#FDBA74] cursor-pointer transition-colors shrink-0"
                    title={`Bagikan info ${vokasi.title}`}
                  >
                    <Share2 className="w-3.5 h-3.5 text-[#F97316]" />
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
