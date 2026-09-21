import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Users,
  GraduationCap,
  Award,
  BookOpen,
  Briefcase,
  Search,
  Mail,
  Phone,
  Sparkles,
  ShieldCheck,
  Building2,
  X,
  ExternalLink,
  ChevronRight,
  SlidersHorizontal,
  CheckCircle2,
  UserCheck,
  Edit3,
  Maximize2,
  ZoomIn,
  Download
} from 'lucide-react';
import { usePKBM } from '../context/PKBMContext';
import { PersonaliaCategory, PersonaliaMember } from '../types';
import { MediaShowcaseView, ShowcaseItem } from './MediaShowcaseView';

interface PersonaliaSectionProps {
  onOpenAdmin?: () => void;
}

const CATEGORY_CONFIG: Record<
  PersonaliaCategory,
  {
    label: string;
    shortLabel: string;
    description: string;
    icon: React.ElementType;
    badgeBg: string;
    badgeText: string;
    badgeBorder: string;
    gradient: string;
  }
> = {
  pendiri: {
    label: 'Pendiri & Dewan Pembina',
    shortLabel: 'Pendiri',
    description: 'Tokoh penggagas, perintis, dan pembina utama berdirinya PKBM Bina Insani Sumowono.',
    icon: Award,
    badgeBg: 'bg-amber-950/80',
    badgeText: 'text-amber-300',
    badgeBorder: 'border-amber-400/40',
    gradient: 'from-amber-400 to-yellow-500'
  },
  yayasan: {
    label: 'Pengurus Yayasan',
    shortLabel: 'Yayasan',
    description: 'Badan penyelenggara yang mengawal legalitas, tata kelola, dan kebijakan strategis lembaga.',
    icon: Building2,
    badgeBg: 'bg-orange-950/80',
    badgeText: 'text-orange-300',
    badgeBorder: 'border-orange-400/40',
    gradient: 'from-orange-500 to-amber-500'
  },
  pendidik: {
    label: 'Pendidik & Tutor Kesetaraan',
    shortLabel: 'Pendidik / Tutor',
    description: 'Guru, pamong, dan instruktur profesional pengampu kurikulum Paket A, B, C, serta Vokasi.',
    icon: GraduationCap,
    badgeBg: 'bg-stone-900',
    badgeText: 'text-amber-200',
    badgeBorder: 'border-orange-400/40',
    gradient: 'from-orange-400 to-amber-400'
  },
  tendik: {
    label: 'Tenaga Kependidikan (Tendik)',
    shortLabel: 'Staf Administrasi',
    description: 'Staf tata usaha, operator Dapodik, pengelola sarana prasarana, dan layanan warga belajar.',
    icon: Briefcase,
    badgeBg: 'bg-stone-900',
    badgeText: 'text-orange-300',
    badgeBorder: 'border-stone-700',
    gradient: 'from-stone-700 to-stone-900'
  }
};

export const PersonaliaSection: React.FC<PersonaliaSectionProps> = ({ onOpenAdmin }) => {
  const { personalia, pkbmInfo, isAdminAuthenticated } = usePKBM();
  const [selectedCategory, setSelectedCategory] = useState<PersonaliaCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeModalMember, setActiveModalMember] = useState<PersonaliaMember | null>(null);
  const [zoomPhotoMember, setZoomPhotoMember] = useState<PersonaliaMember | null>(null);

  // Category counts
  const categoryCounts = useMemo(() => {
    return {
      all: personalia.length,
      pendiri: personalia.filter((p) => p.category === 'pendiri').length,
      yayasan: personalia.filter((p) => p.category === 'yayasan').length,
      pendidik: personalia.filter((p) => p.category === 'pendidik').length,
      tendik: personalia.filter((p) => p.category === 'tendik').length
    };
  }, [personalia]);

  // Filtered members
  const filteredMembers = useMemo(() => {
    return personalia.filter((m) => {
      const matchCategory = selectedCategory === 'all' || m.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        m.name.toLowerCase().includes(q) ||
        m.role.toLowerCase().includes(q) ||
        (m.specialization && m.specialization.toLowerCase().includes(q)) ||
        (m.education && m.education.toLowerCase().includes(q)) ||
        (m.nuptkOrNip && m.nuptkOrNip.toLowerCase().includes(q)) ||
        (m.bio && m.bio.toLowerCase().includes(q));

      return matchCategory && matchSearch;
    });
  }, [personalia, selectedCategory, searchQuery]);

  // Transform personalia members to 2-column showcase layout
  const personaliaShowcaseItems: ShowcaseItem[] = filteredMembers.map((member) => {
    const catConfig = CATEGORY_CONFIG[member.category] || CATEGORY_CONFIG.pendidik;
    return {
      id: member.id,
      title: member.name,
      subtitle: `${member.role} • ${catConfig.label}`,
      description:
        member.bio ||
        `${member.name} mendedikasikan keahlian dan pengalamannya sebagai ${member.role} di ${pkbmInfo.name || 'PKBM Bina Insani Sumowono'} guna mendukung kemandirian dan kesetaraan pendidikan warga belajar.`,
      image: member.photo,
      category: catConfig.label,
      badge: catConfig.shortLabel,
      education: member.education,
      specialization: member.specialization,
      email: member.email,
      nuptkOrNip: member.nuptkOrNip,
      actionUrl: `https://wa.me/${pkbmInfo.whatsappNumber}?text=Halo%20PKBM%20Bina%20Insani,%20saya%20ingin%20berkonsultasi%20dengan%20${encodeURIComponent(member.name)}%20(${encodeURIComponent(member.role)})`,
      actionLabel: `Hubungi / Konsultasi dengan ${member.name.split(',')[0]}`
    };
  });

  return (
    <section
      id="personalia"
      className="pt-4 sm:pt-6 pb-16 bg-gradient-to-b from-[#0c0a09] via-[#1c1917] to-[#0c0a09] text-white relative overflow-hidden"
    >
      {/* Glow Effects */}
      <div className="absolute top-1/4 left-0 w-80 h-80 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Compact Admin Notice / Action (if authenticated) */}
        {isAdminAuthenticated && (
          <div className="mb-3 flex items-center justify-between p-2 sm:px-3 rounded-xl bg-orange-950/40 border border-orange-500/30 text-xs">
            <div className="flex items-center gap-2 text-amber-300 font-semibold">
              <UserCheck className="w-4 h-4 text-orange-400" />
              <span>Mode Pengelola Aktif • Total {categoryCounts.all} Anggota Personalia</span>
            </div>
            <button
              onClick={onOpenAdmin}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 text-white text-[11px] font-black hover:from-orange-400 hover:to-amber-400 transition-all cursor-pointer shadow-sm"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Buka Portal Admin</span>
            </button>
          </div>
        )}

        {/* Quick Highlights Summary Chips (Compact & Space-Efficient) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-2.5 mb-3.5">
          <div className="p-2 sm:px-3 sm:py-2 rounded-xl bg-stone-900/85 border border-orange-500/25 backdrop-blur-md flex items-center gap-2.5 hover:border-orange-400/40 transition-colors">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-amber-400/20 border border-amber-400/30 text-amber-300 flex items-center justify-center shrink-0">
              <Award className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-base sm:text-lg font-black text-amber-300 leading-tight">{categoryCounts.pendiri}</div>
              <div className="text-[10px] sm:text-[11px] text-stone-300 font-semibold truncate leading-tight">Pendiri & Pembina</div>
            </div>
          </div>

          <div className="p-2 sm:px-3 sm:py-2 rounded-xl bg-stone-900/85 border border-orange-500/25 backdrop-blur-md flex items-center gap-2.5 hover:border-orange-400/40 transition-colors">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-orange-500/20 border border-orange-400/30 text-orange-300 flex items-center justify-center shrink-0">
              <Building2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-base sm:text-lg font-black text-orange-300 leading-tight">{categoryCounts.yayasan}</div>
              <div className="text-[10px] sm:text-[11px] text-stone-300 font-semibold truncate leading-tight">Pengurus Yayasan</div>
            </div>
          </div>

          <div className="p-2 sm:px-3 sm:py-2 rounded-xl bg-stone-900/85 border border-orange-500/25 backdrop-blur-md flex items-center gap-2.5 hover:border-orange-400/40 transition-colors">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-amber-500/20 border border-amber-400/30 text-amber-300 flex items-center justify-center shrink-0">
              <GraduationCap className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-base sm:text-lg font-black text-amber-300 leading-tight">{categoryCounts.pendidik}</div>
              <div className="text-[10px] sm:text-[11px] text-stone-300 font-semibold truncate leading-tight">Pendidik & Tutor</div>
            </div>
          </div>

          <div className="p-2 sm:px-3 sm:py-2 rounded-xl bg-stone-900/85 border border-orange-500/25 backdrop-blur-md flex items-center gap-2.5 hover:border-orange-400/40 transition-colors">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-stone-800 border border-stone-600 text-stone-300 flex items-center justify-center shrink-0">
              <Briefcase className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-base sm:text-lg font-black text-white leading-tight">{categoryCounts.tendik}</div>
              <div className="text-[10px] sm:text-[11px] text-stone-300 font-semibold truncate leading-tight">Tenaga Kependidikan</div>
            </div>
          </div>
        </div>

        {/* Filter Controls & Search Bar (Compact & Low-Profile) */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-2.5 mb-5 pb-3 border-b border-stone-800/80">
          {/* Category Filter Tabs */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5 w-full lg:w-auto">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-sm border border-orange-300'
                  : 'bg-stone-950/80 text-stone-300 border border-stone-800 hover:border-orange-400/40'
              }`}
            >
              <Users className="w-3 h-3" />
              <span>Semua</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-black/40 text-current font-bold">
                {categoryCounts.all}
              </span>
            </button>

            {(['pendiri', 'yayasan', 'pendidik', 'tendik'] as PersonaliaCategory[]).map((cat) => {
              const cfg = CATEGORY_CONFIG[cat];
              const Icon = cfg.icon;
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    isSelected
                      ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-sm border border-orange-300'
                      : 'bg-stone-950/80 text-stone-300 border border-stone-800 hover:border-orange-400/40'
                  }`}
                >
                  <Icon className="w-3 h-3" />
                  <span>{cfg.shortLabel}</span>
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-black/40 text-current font-bold">
                    {categoryCounts[cat]}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Input Box */}
          <div className="relative w-full lg:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-orange-400/70" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama, mapel, posisi..."
              className="w-full pl-8 pr-8 py-1.5 rounded-lg bg-stone-950/90 border border-orange-400/25 text-white text-xs placeholder-stone-500 focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400/50"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-white cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Selected Category Description Note */}
        {selectedCategory !== 'all' && (
          <div className="mb-8 p-4 rounded-2xl bg-gradient-to-r from-stone-900 to-stone-950 border border-orange-400/30 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 text-white">
                {React.createElement(CATEGORY_CONFIG[selectedCategory].icon, { className: 'w-5 h-5' })}
              </div>
              <div>
                <h4 className="text-sm font-black text-amber-300">
                  {CATEGORY_CONFIG[selectedCategory].label}
                </h4>
                <p className="text-xs text-stone-300 font-medium">
                  {CATEGORY_CONFIG[selectedCategory].description}
                </p>
              </div>
            </div>
            <button
              onClick={() => setSelectedCategory('all')}
              className="text-xs text-amber-300 underline hover:text-white shrink-0 cursor-pointer"
            >
              Tampilkan Semua
            </button>
          </div>
        )}

        {/* Tampilan Fokus Split 2 Kolom Sesuai Gambar Layout */}
        {activeModalMember && (
          <div className="mb-12">
            <MediaShowcaseView
              items={personaliaShowcaseItems}
              activeId={activeModalMember.id}
              onSelect={(item) => {
                const found = personalia.find((p) => p.id === item.id);
                if (found) setActiveModalMember(found);
              }}
              onClose={() => setActiveModalMember(null)}
              sectionTitle="Profil Personalia & Tim Pengelola"
              mediaType="person"
              theme="dark"
            />
          </div>
        )}

        {/* Personalia Grid */}
        {filteredMembers.length === 0 ? (
          <div className="text-center py-16 bg-stone-900/60 rounded-3xl border border-stone-800 p-8 space-y-4 max-w-xl mx-auto">
            <Users className="w-12 h-12 text-orange-400/60 mx-auto" />
            <h4 className="text-lg font-bold text-white">
              {personalia.length === 0 ? 'Belum Ada Data Personalia yang Ditampilkan' : 'Tidak ada data personalia yang cocok'}
            </h4>
            <p className="text-xs sm:text-sm text-stone-400 max-w-md mx-auto leading-relaxed">
              {personalia.length === 0
                ? 'Struktur pengurus yayasan, pendidik, dan tenaga kependidikan PKBM Bina Insani Sumowono akan segera diperbarui.'
                : 'Coba gunakan kata kunci pencarian lain atau klik tab "Semua Personalia".'}
            </p>
            {personalia.length > 0 && (
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSearchQuery('');
                }}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white text-xs font-bold transition-all cursor-pointer"
              >
                Reset Filter Pencarian
              </button>
            )}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
            {filteredMembers.map((member, idx) => {
              const catConfig = CATEGORY_CONFIG[member.category] || CATEGORY_CONFIG.pendidik;
              const CatIcon = catConfig.icon;

              return (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: (idx % 4) * 0.08 }}
                  onClick={() => setActiveModalMember(member)}
                  className={`rounded-2xl bg-gradient-to-b from-stone-900 via-[#1c1917] to-stone-950 border shadow-lg transition-all flex flex-col justify-between overflow-hidden group backdrop-blur-md cursor-pointer ${
                    activeModalMember?.id === member.id
                      ? 'border-amber-400 ring-2 ring-amber-400/50 shadow-amber-500/20'
                      : 'border-orange-400/30 hover:border-orange-400 hover:shadow-orange-400/10'
                  }`}
                >
                  {/* Card Top: Photo Display (Utuh Tanpa Terpotong) and Badge */}
                  <div>
                    <div className="relative h-56 sm:h-60 w-full overflow-hidden bg-stone-950 flex items-center justify-center border-b border-orange-500/20">
                      {/* Ambient soft glow backdrop of the same photo so all aspect ratios blend seamlessly */}
                      <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <img
                          src={member.photo}
                          alt=""
                          aria-hidden="true"
                          className="w-full h-full object-cover blur-2xl opacity-30 scale-125 pointer-events-none"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/40 to-black/30" />
                      </div>

                      {/* Foreground photo: 100% UTUH tanpa terpotong */}
                      <div className="relative z-10 w-full h-full p-2.5 sm:p-3 flex items-center justify-center">
                        <img
                          src={member.photo}
                          alt={member.name}
                          className="max-h-full max-w-full w-auto h-auto object-contain rounded-xl drop-shadow-2xl transition-transform duration-500 group-hover:scale-105"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=600&q=80';
                          }}
                        />
                      </div>

                      {/* Category Badge */}
                      <div className="absolute top-2.5 left-2.5 z-20 pointer-events-none">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider backdrop-blur-md border ${catConfig.badgeBg} ${catConfig.badgeText} ${catConfig.badgeBorder} shadow-sm`}
                        >
                          <CatIcon className="w-3 h-3" />
                          {catConfig.shortLabel}
                        </span>
                      </div>

                      {/* Order / Status Badge & Zoom Photo Button */}
                      <div className="absolute top-2.5 right-2.5 z-20 flex items-center gap-1">
                        {member.nuptkOrNip && (
                          <span className="px-1.5 py-0.5 rounded-md bg-stone-950/90 text-[9px] text-amber-300 font-mono border border-orange-500/40 backdrop-blur-sm shadow">
                            Terdaftar
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setZoomPhotoMember(member);
                          }}
                          title="Lihat Foto Utuh Resolusi Penuh"
                          className="p-1 rounded-lg bg-black/75 hover:bg-orange-600 text-stone-300 hover:text-white border border-stone-700 hover:border-orange-400 backdrop-blur-md transition-all cursor-pointer shadow-sm"
                        >
                          <Maximize2 className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Hint label "Foto Utuh" */}
                      <div className="absolute bottom-1.5 right-1.5 z-20 pointer-events-none">
                        <span className="px-1.5 py-0.2 rounded bg-black/60 backdrop-blur-md text-[8px] font-semibold text-stone-400 border border-stone-800/80">
                          Foto Utuh
                        </span>
                      </div>
                    </div>

                    {/* Content Details */}
                    <div className="p-4 space-y-2">
                      <div>
                        <h3 className="text-base font-extrabold text-white group-hover:text-amber-300 transition-colors leading-snug">
                          {member.name}
                        </h3>
                        <p className="text-[11px] font-bold text-amber-300/90 mt-0.5">
                          {member.role}
                        </p>
                      </div>

                      {/* Education & Specialization */}
                      <div className="space-y-1 pt-0.5 text-xs">
                        {member.education && (
                          <div className="flex items-start gap-1.5 text-stone-300">
                            <GraduationCap className="w-3 h-3 text-orange-400 shrink-0 mt-0.5" />
                            <span className="line-clamp-1 text-[11px]">{member.education}</span>
                          </div>
                        )}

                        {member.specialization && (
                          <div className="flex items-start gap-1.5 text-stone-400">
                            <BookOpen className="w-3 h-3 text-orange-400 shrink-0 mt-0.5" />
                            <span className="line-clamp-1 text-[11px]">{member.specialization}</span>
                          </div>
                        )}
                      </div>

                      {/* Short Bio */}
                      {member.bio && (
                        <p className="text-[10px] text-stone-400 line-clamp-1 italic pt-1 border-t border-stone-800/80">
                          "{member.bio}"
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Card Bottom Actions */}
                  <div className="p-4 pt-0">
                    <button
                      onClick={() => setActiveModalMember(member)}
                      className="w-full py-1.5 px-3 rounded-lg bg-stone-950 text-amber-300 hover:bg-gradient-to-r hover:from-orange-500 hover:to-amber-500 hover:text-white border border-orange-400/35 text-[11px] font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow"
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>Lihat Profil Lengkap</span>
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Accreditation & Integrity Footnote */}
        <div className="mt-16 p-6 rounded-3xl bg-gradient-to-r from-stone-900 to-stone-950 border border-orange-400/30 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 text-white flex items-center justify-center font-black text-2xl shrink-0 shadow-lg border border-orange-300">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div>
              <h4 className="text-base sm:text-lg font-black text-amber-300">
                Pendidik & Tenaga Kependidikan Terdaftar Resmi di Kemendikbudristek
              </h4>
              <p className="text-xs text-stone-300 mt-0.5">
                Data tutor dan pengelola PKBM Bina Insani Sumowono tersinkronisasi dengan Dapodik Kesetaraan dan berstandar BAN-PDM.
              </p>
            </div>
          </div>

          <a
            href={`https://wa.me/${pkbmInfo.whatsappNumber}?text=Halo%20PKBM%20Bina%20Insani,%20saya%20ingin%20bertanya%20mengenai%20informasi%20tutor%20dan%20pembelajaran`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-white text-xs font-black shadow-xl transition-all shrink-0 flex items-center gap-2 border border-orange-300"
          >
            <Phone className="w-4 h-4" />
            <span>Konsultasi dengan Pengelola</span>
          </a>
        </div>
      </div>

      {/* Full-Screen Lightbox Modal Foto Utuh Resolusi Tinggi */}
      <AnimatePresence>
        {zoomPhotoMember && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
            onClick={() => setZoomPhotoMember(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-3xl w-full bg-stone-900 border border-orange-500/30 rounded-3xl overflow-hidden shadow-2xl flex flex-col"
            >
              {/* Header Modal */}
              <div className="p-4 sm:p-5 bg-stone-950/90 border-b border-stone-800 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-lg bg-orange-500/20 text-orange-400 border border-orange-500/30 text-[11px] font-black uppercase">
                      {CATEGORY_CONFIG[zoomPhotoMember.category]?.shortLabel || 'Personalia'}
                    </span>
                    {zoomPhotoMember.nuptkOrNip && (
                      <span className="text-xs font-mono text-stone-400">
                        NUPTK/NIP: {zoomPhotoMember.nuptkOrNip}
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-black text-white truncate mt-1">
                    {zoomPhotoMember.name}
                  </h3>
                  <p className="text-xs text-amber-300 font-semibold truncate">
                    {zoomPhotoMember.role}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href={zoomPhotoMember.photo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white border border-stone-700 transition-colors cursor-pointer"
                    title="Buka Gambar di Tab Baru"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  <button
                    onClick={() => setZoomPhotoMember(null)}
                    className="p-2 rounded-xl bg-stone-800 hover:bg-red-500/20 text-stone-300 hover:text-red-400 border border-stone-700 transition-colors cursor-pointer"
                    title="Tutup Modal"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Main Photo Container - Utuh 100% Bebas Terpotong */}
              <div className="relative w-full h-[60vh] sm:h-[68vh] bg-stone-950 flex items-center justify-center p-4 sm:p-6 overflow-hidden">
                {/* Background Ambient Glow */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  <img
                    src={zoomPhotoMember.photo}
                    alt=""
                    aria-hidden="true"
                    className="w-full h-full object-cover blur-3xl opacity-20 scale-125"
                  />
                </div>

                <img
                  src={zoomPhotoMember.photo}
                  alt={zoomPhotoMember.name}
                  className="relative z-10 max-h-full max-w-full w-auto h-auto object-contain rounded-2xl drop-shadow-2xl border border-stone-800"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=600&q=80';
                  }}
                />
              </div>

              {/* Footer Information */}
              <div className="p-4 bg-stone-950 border-t border-stone-800 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="text-stone-400">
                  {zoomPhotoMember.education && (
                    <span className="text-stone-300 mr-3">
                      🎓 {zoomPhotoMember.education}
                    </span>
                  )}
                  {zoomPhotoMember.specialization && (
                    <span className="text-stone-400">
                      📖 {zoomPhotoMember.specialization}
                    </span>
                  )}
                </div>

                <button
                  onClick={() => {
                    const member = zoomPhotoMember;
                    setZoomPhotoMember(null);
                    setActiveModalMember(member);
                  }}
                  className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-white font-bold cursor-pointer transition-all shadow"
                >
                  Buka Profil Lengkap
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
