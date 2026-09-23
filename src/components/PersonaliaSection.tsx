import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Users,
  Award,
  BookOpen,
  GraduationCap,
  Briefcase,
  Search,
  Building2,
  Share2,
  Maximize2,
  X,
  ExternalLink,
  ShieldCheck,
  Phone,
  UserCheck,
  Edit3
} from 'lucide-react';
import { usePKBM } from '../context/PKBMContext';
import { PersonaliaCategory, PersonaliaMember } from '../types';
import { MediaShowcaseView, ShowcaseItem } from './MediaShowcaseView';

interface PersonaliaSectionProps {
  onOpenAdmin?: () => void;
  onShareCustom?: (data: { title: string; description: string; hash: string; category?: string; image?: string }) => void;
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
    badgeBg: 'bg-[#FEF9C3]',
    badgeText: 'text-[#854D0E]',
    badgeBorder: 'border-[#F4B942]',
    gradient: 'from-[#F4B942] to-[#D97706]'
  },
  yayasan: {
    label: 'Pengurus Yayasan',
    shortLabel: 'Yayasan',
    description: 'Badan penyelenggara yang mengawal legalitas, tata kelola, dan kebijakan strategis lembaga.',
    icon: Building2,
    badgeBg: 'bg-[#FFF7ED]',
    badgeText: 'text-[#EA580C]',
    badgeBorder: 'border-[#FDBA74]',
    gradient: 'from-[#F97316] to-[#EA580C]'
  },
  pendidik: {
    label: 'Pendidik & Tutor Kesetaraan',
    shortLabel: 'Pendidik / Tutor',
    description: 'Guru, pamong, dan instruktur profesional pengampu kurikulum Paket A, B, C, serta Vokasi.',
    icon: GraduationCap,
    badgeBg: 'bg-[#E3F2FD]',
    badgeText: 'text-[#1976D2]',
    badgeBorder: 'border-[#90CAF9]',
    gradient: 'from-[#1976D2] to-[#1554A0]'
  },
  tendik: {
    label: 'Tenaga Kependidikan (Tendik)',
    shortLabel: 'Staf Administrasi',
    description: 'Staf tata usaha, operator Dapodik, pengelola sarana prasarana, dan layanan warga belajar.',
    icon: Briefcase,
    badgeBg: 'bg-[#F8FAFC]',
    badgeText: 'text-[#193B63]',
    badgeBorder: 'border-[#E2E8F0]',
    gradient: 'from-[#193B63] to-[#486581]'
  }
};

export const PersonaliaSection: React.FC<PersonaliaSectionProps> = ({ onOpenAdmin, onShareCustom }) => {
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

  // Filtered and Sorted members according to requested order:
  // 1. Urutan kategori: Pendiri -> Pengelola (Yayasan & Tendik) -> Tutor (Pendidik)
  // 2. Pada masing-masing urutan ditentukan berdasarkan nomor ID pegawai
  const filteredMembers = useMemo(() => {
    const list = personalia.filter((m) => {
      const matchCategory = selectedCategory === 'all' || m.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        m.name.toLowerCase().includes(q) ||
        m.role.toLowerCase().includes(q) ||
        (m.specialization && m.specialization.toLowerCase().includes(q)) ||
        (m.nuptkOrNip && m.nuptkOrNip.toLowerCase().includes(q));
      return matchCategory && matchSearch;
    });

    const getCategoryRank = (cat: PersonaliaCategory) => {
      switch (cat) {
        case 'pendiri':
          return 1;
        case 'yayasan':
        case 'tendik':
          return 2;
        case 'pendidik':
          return 3;
        default:
          return 4;
      }
    };

    const parseIdNumeric = (idStr?: string) => {
      if (!idStr) return Number.MAX_SAFE_INTEGER;
      const digits = idStr.replace(/\D/g, '');
      return digits ? parseInt(digits, 10) : Number.MAX_SAFE_INTEGER;
    };

    return [...list].sort((a, b) => {
      const rankA = getCategoryRank(a.category);
      const rankB = getCategoryRank(b.category);

      if (rankA !== rankB) {
        return rankA - rankB;
      }

      const numA = parseIdNumeric(a.nuptkOrNip || a.id);
      const numB = parseIdNumeric(b.nuptkOrNip || b.id);
      if (numA !== numB) {
        return numA - numB;
      }

      return (a.nuptkOrNip || a.id).localeCompare(b.nuptkOrNip || b.id, undefined, {
        numeric: true,
        sensitivity: 'base'
      });
    });
  }, [personalia, selectedCategory, searchQuery]);

  // Transform personalia items into showcase format
  const personaliaShowcaseItems: ShowcaseItem[] = useMemo(() => {
    return filteredMembers.map((m) => ({
      id: m.id,
      title: m.name,
      subtitle: `${m.role} • ${m.education || 'Tenaga Ahli Bersertifikat'}`,
      description: [
        m.bio ? `"${m.bio}"` : '',
        m.specialization ? `Bidang Keahlian / Mapel: ${m.specialization}` : '',
        m.nuptkOrNip ? `NUPTK / NIP: ${m.nuptkOrNip}` : '',
        m.joinedYear ? `Tahun Bergabung: ${m.joinedYear}` : '',
        m.category === 'pendiri'
          ? 'Peran Utama: Pendiri & Pembina yang meletakkan dasar visi misi pendidikan nonformal di Sumowono.'
          : m.category === 'yayasan'
          ? 'Peran Utama: Mengawal legalitas, manajemen sarana, dan kebijakan program pendidikan masyarakat.'
          : m.category === 'pendidik'
          ? 'Peran Utama: Pendidik pengampu modul kesetaraan Paket A/B/C dan instruktur vokasi terapan.'
          : 'Peran Utama: Tenaga kependidikan pengelola administrasi, sinkronisasi Dapodik, dan layanan siswa.'
      ]
        .filter(Boolean)
        .join('\n\n'),
      image: m.photo,
      category: CATEGORY_CONFIG[m.category]?.label || 'Personalia',
      badge: CATEGORY_CONFIG[m.category]?.shortLabel || 'Personalia',
      meta: [
        ...(m.education ? [{ label: 'Pendidikan', value: m.education }] : []),
        ...(m.specialization ? [{ label: 'Spesialisasi', value: m.specialization }] : []),
        ...(m.nuptkOrNip ? [{ label: 'ID Pegawai / NIP', value: m.nuptkOrNip }] : []),
        ...(m.joinedYear ? [{ label: 'Bergabung Sejak', value: String(m.joinedYear) }] : [])
      ]
    }));
  }, [filteredMembers]);

  // Deep linking: Listen to hash changes (#personalia?id=...)
  useEffect(() => {
    const handleHashCheck = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#personalia')) {
        const queryIndex = hash.indexOf('?');
        if (queryIndex !== -1) {
          const queryString = hash.substring(queryIndex + 1);
          const params = new URLSearchParams(queryString);
          const memberId = params.get('id');
          if (memberId && personalia.length > 0) {
            const found = personalia.find((p) => p.id === memberId);
            if (found) {
              setActiveModalMember(found);
              setTimeout(() => {
                const el = document.getElementById('personalia-showcase-container');
                if (el) {
                  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              }, 150);
            }
          }
        }
      }
    };

    handleHashCheck();
    window.addEventListener('hashchange', handleHashCheck);
    return () => window.removeEventListener('hashchange', handleHashCheck);
  }, [personalia]);

  const handleSelectMember = (member: PersonaliaMember) => {
    setActiveModalMember(member);
    if (window.location.hash.startsWith('#personalia')) {
      window.history.replaceState(null, '', `#personalia?id=${member.id}`);
    }
    setTimeout(() => {
      const showcaseEl = document.getElementById('personalia-showcase-container');
      if (showcaseEl) {
        showcaseEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const handleCloseShowcase = () => {
    setActiveModalMember(null);
    if (window.location.hash.includes('?id=')) {
      window.history.replaceState(null, '', '#personalia');
    }
  };

  const getPersonaliaDirectHash = (memberId: string) => {
    return `#personalia?id=${encodeURIComponent(memberId)}`;
  };

  const handleShareMember = (member: PersonaliaMember) => {
    if (onShareCustom) {
      onShareCustom({
        title: `Profil ${member.name} (${member.role}) - PKBM Bina Insani`,
        description: `Mengenal profil ${member.name}, ${member.role} di PKBM Bina Insani Sumowono. Spesialisasi: ${member.specialization || member.education || 'Pendidik & Tenaga Kependidikan Resmi'}.`,
        hash: getPersonaliaDirectHash(member.id),
        category: CATEGORY_CONFIG[member.category]?.shortLabel || 'Personalia',
        image: member.photo
      });
    }
  };

  return (
    <section
      id="personalia"
      className="pt-4 sm:pt-6 pb-16 bg-[#F8FAFC] text-[#1E293B] relative overflow-hidden"
    >
      {/* Glow Effects */}
      <div className="absolute top-1/4 left-0 w-80 h-80 bg-[#FDBA74]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-80 h-80 bg-[#F97316]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Compact Admin Notice / Action (if authenticated) */}
        {isAdminAuthenticated && (
          <div className="mb-3 flex items-center justify-between p-2 sm:px-3 rounded-xl bg-[#FFF7ED] border border-[#FDBA74] text-xs">
            <div className="flex items-center gap-2 text-[#EA580C] font-semibold">
              <UserCheck className="w-4 h-4 text-[#F97316]" />
              <span>Mode Pengelola Aktif • Total {categoryCounts.all} Anggota Personalia</span>
            </div>
            <button
              onClick={onOpenAdmin}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#F97316] text-white text-[11px] font-black hover:bg-[#EA580C] transition-all cursor-pointer shadow-xs border border-[#FDBA74]/50"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Buka Portal Admin</span>
            </button>
          </div>
        )}

        {/* Quick Highlights Summary Chips */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-2.5 mb-3.5">
          <div className="p-2 sm:px-3 sm:py-2 rounded-xl bg-white border border-[#E2E8F0] shadow-xs flex items-center gap-2.5 hover:border-[#F4B942] transition-colors">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#FEF9C3] border border-[#F4B942] text-[#854D0E] flex items-center justify-center shrink-0">
              <Award className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-base sm:text-lg font-black text-[#193B63] leading-tight">{categoryCounts.pendiri}</div>
              <div className="text-[10px] sm:text-[11px] text-[#486581] font-semibold truncate leading-tight">Pendiri & Pembina</div>
            </div>
          </div>

          <div className="p-2 sm:px-3 sm:py-2 rounded-xl bg-white border border-[#E2E8F0] shadow-xs flex items-center gap-2.5 hover:border-[#FDBA74] transition-colors">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#FFF7ED] border border-[#FDBA74] text-[#EA580C] flex items-center justify-center shrink-0">
              <Building2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-base sm:text-lg font-black text-[#193B63] leading-tight">{categoryCounts.yayasan}</div>
              <div className="text-[10px] sm:text-[11px] text-[#486581] font-semibold truncate leading-tight">Pengurus Yayasan</div>
            </div>
          </div>

          <div className="p-2 sm:px-3 sm:py-2 rounded-xl bg-white border border-[#E2E8F0] shadow-xs flex items-center gap-2.5 hover:border-[#90CAF9] transition-colors">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#E3F2FD] border border-[#90CAF9] text-[#1976D2] flex items-center justify-center shrink-0">
              <GraduationCap className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-base sm:text-lg font-black text-[#193B63] leading-tight">{categoryCounts.pendidik}</div>
              <div className="text-[10px] sm:text-[11px] text-[#486581] font-semibold truncate leading-tight">Pendidik & Tutor</div>
            </div>
          </div>

          <div className="p-2 sm:px-3 sm:py-2 rounded-xl bg-white border border-[#E2E8F0] shadow-xs flex items-center gap-2.5 hover:border-[#CBD5E1] transition-colors">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-[#193B63] flex items-center justify-center shrink-0">
              <Briefcase className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-base sm:text-lg font-black text-[#193B63] leading-tight">{categoryCounts.tendik}</div>
              <div className="text-[10px] sm:text-[11px] text-[#486581] font-semibold truncate leading-tight">Tenaga Kependidikan</div>
            </div>
          </div>
        </div>

        {/* Filter Controls & Search Bar */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-2.5 mb-5 pb-3 border-b border-[#E2E8F0]">
          {/* Category Filter Tabs */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5 w-full lg:w-auto">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-[#F97316] text-white shadow-xs border border-[#FDBA74]/50'
                  : 'bg-white text-[#193B63] border border-[#E2E8F0] hover:bg-[#FFF7ED] hover:text-[#EA580C]'
              }`}
            >
              <Users className="w-3 h-3" />
              <span>Semua</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${selectedCategory === 'all' ? 'bg-white/25 text-white' : 'bg-[#F8FAFC] text-[#486581]'}`}>
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
                      ? 'bg-[#F97316] text-white shadow-xs border border-[#FDBA74]/50'
                      : 'bg-white text-[#193B63] border border-[#E2E8F0] hover:bg-[#FFF7ED] hover:text-[#EA580C]'
                  }`}
                >
                  <Icon className="w-3 h-3" />
                  <span>{cfg.shortLabel}</span>
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${isSelected ? 'bg-white/25 text-white' : 'bg-[#F8FAFC] text-[#486581]'}`}>
                    {categoryCounts[cat]}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Input Box */}
          <div className="relative w-full lg:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#486581]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama, mapel, posisi..."
              className="w-full pl-8 pr-8 py-1.5 rounded-lg bg-white border border-[#E2E8F0] text-[#1E293B] text-xs placeholder-[#486581]/60 focus:outline-none focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316]/50 shadow-xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#486581] hover:text-[#1E293B] cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Selected Category Description Note */}
        {selectedCategory !== 'all' && (
          <div className="mb-8 p-4 rounded-2xl bg-[#FFF7ED] border border-[#FDBA74] flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-[#F97316] text-white">
                {React.createElement(CATEGORY_CONFIG[selectedCategory].icon, { className: 'w-5 h-5' })}
              </div>
              <div>
                <h4 className="text-sm font-black text-[#193B63]">
                  {CATEGORY_CONFIG[selectedCategory].label}
                </h4>
                <p className="text-xs text-[#486581] font-medium">
                  {CATEGORY_CONFIG[selectedCategory].description}
                </p>
              </div>
            </div>
            <button
              onClick={() => setSelectedCategory('all')}
              className="text-xs text-[#EA580C] underline hover:text-[#F97316] shrink-0 cursor-pointer font-bold"
            >
              Tampilkan Semua
            </button>
          </div>
        )}

        {/* Tampilan Fokus Split 2 Kolom */}
        {activeModalMember && (
          <div id="personalia-showcase-container" className="mb-12 scroll-mt-28">
            <MediaShowcaseView
              items={personaliaShowcaseItems}
              activeId={activeModalMember.id}
              onSelect={(item) => {
                const found = personalia.find((p) => p.id === item.id);
                if (found) handleSelectMember(found);
              }}
              onClose={handleCloseShowcase}
              sectionTitle="Profil Personalia & Tim Pengelola"
              mediaType="person"
              theme="light"
              onShareItem={(item) => {
                const found = personalia.find((p) => p.id === item.id);
                if (found) {
                  handleShareMember(found);
                } else if (onShareCustom) {
                  onShareCustom({
                    title: `Profil ${item.title} - ${item.subtitle || 'Personalia PKBM Bina Insani'}`,
                    description: item.description,
                    hash: getPersonaliaDirectHash(item.id),
                    category: item.category,
                    image: item.image
                  });
                }
              }}
            />
          </div>
        )}

        {/* Personalia Grid */}
        {filteredMembers.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-[#E2E8F0] p-8 space-y-4 max-w-xl mx-auto shadow-xs">
            <Users className="w-12 h-12 text-[#F97316]/60 mx-auto" />
            <h4 className="text-lg font-bold text-[#193B63]">
              {personalia.length === 0 ? 'Belum Ada Data Personalia yang Ditampilkan' : 'Tidak ada data personalia yang cocok'}
            </h4>
            <p className="text-xs sm:text-sm text-[#486581] max-w-md mx-auto leading-relaxed">
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
                className="px-4 py-2 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white text-xs font-bold transition-all cursor-pointer shadow-xs border border-[#FDBA74]/50"
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
                  id={`personalia-member-${member.id}`}
                  data-member-id={member.id}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: (idx % 4) * 0.08 }}
                  onClick={() => handleSelectMember(member)}
                  className={`rounded-2xl bg-white border shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group cursor-pointer scroll-mt-28 ${
                    activeModalMember?.id === member.id
                      ? 'border-[#F4B942] ring-2 ring-[#F4B942]/40 shadow-sm'
                      : 'border-[#E2E8F0] hover:border-[#FDBA74]'
                  }`}
                >
                  {/* Card Top: Photo Display and Badge */}
                  <div>
                    <div className="relative h-56 sm:h-60 w-full overflow-hidden bg-[#F8FAFC] flex items-center justify-center border-b border-[#E2E8F0]">
                      {/* Ambient soft glow backdrop */}
                      <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <img
                          src={member.photo}
                          alt=""
                          aria-hidden="true"
                          className="w-full h-full object-cover blur-2xl opacity-20 scale-125 pointer-events-none"
                        />
                      </div>

                      {/* Foreground photo: 100% UTUH tanpa terpotong */}
                      <div className="relative z-10 w-full h-full p-2.5 sm:p-3 flex items-center justify-center">
                        <img
                          src={member.photo}
                          alt={member.name}
                          className="max-h-full max-w-full w-auto h-auto object-contain rounded-xl drop-shadow-md transition-transform duration-500 group-hover:scale-105"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=600&q=80';
                          }}
                        />
                      </div>

                      {/* Category Badge */}
                      <div className="absolute top-2.5 left-2.5 z-20 pointer-events-none">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider border ${catConfig.badgeBg} ${catConfig.badgeText} ${catConfig.badgeBorder} shadow-xs`}
                        >
                          <CatIcon className="w-3 h-3" />
                          {catConfig.shortLabel}
                        </span>
                      </div>

                      {/* Nomor ID Pegawai Badge & Zoom Photo Button */}
                      <div className="absolute top-2.5 right-2.5 z-20 flex items-center gap-1">
                        {member.nuptkOrNip && (
                          <span
                            className="px-2 py-0.5 rounded-md bg-white/90 text-[10px] text-[#193B63] font-mono font-bold border border-[#E2E8F0] shadow-xs"
                            title={`Nomor ID Pegawai / NIP: ${member.nuptkOrNip}`}
                          >
                            ID: {member.nuptkOrNip}
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setZoomPhotoMember(member);
                          }}
                          title="Lihat Foto Utuh Resolusi Penuh"
                          className="p-1 rounded-lg bg-white hover:bg-[#F97316] text-[#486581] hover:text-white border border-[#E2E8F0] hover:border-[#F97316] transition-all cursor-pointer shadow-xs"
                        >
                          <Maximize2 className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Hint label "Foto Utuh" */}
                      <div className="absolute bottom-1.5 right-1.5 z-20 pointer-events-none">
                        <span className="px-1.5 py-0.2 rounded bg-white/80 text-[8px] font-semibold text-[#486581] border border-[#E2E8F0]">
                          Foto Utuh
                        </span>
                      </div>
                    </div>

                    {/* Content Details */}
                    <div className="p-4 space-y-2">
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="text-base font-extrabold text-[#193B63] group-hover:text-[#EA580C] transition-colors leading-snug">
                            {member.name}
                          </h3>
                        </div>
                        <p className="text-[11px] font-bold text-[#EA580C] mt-0.5">
                          {member.role}
                        </p>
                      </div>

                      {/* Education & Specialization */}
                      <div className="space-y-1 pt-0.5 text-xs">
                        {member.education && (
                          <div className="flex items-start gap-1.5 text-[#1E293B]">
                            <GraduationCap className="w-3 h-3 text-[#1976D2] shrink-0 mt-0.5" />
                            <span className="line-clamp-1 text-[11px]">{member.education}</span>
                          </div>
                        )}

                        {member.specialization && (
                          <div className="flex items-start gap-1.5 text-[#486581]">
                            <BookOpen className="w-3 h-3 text-[#F97316] shrink-0 mt-0.5" />
                            <span className="line-clamp-1 text-[11px]">{member.specialization}</span>
                          </div>
                        )}
                      </div>

                      {/* Short Bio */}
                      {member.bio && (
                        <p className="text-[10px] text-[#486581] line-clamp-1 italic pt-1 border-t border-[#E2E8F0]">
                          "{member.bio}"
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Card Bottom Actions */}
                  <div className="p-4 pt-0 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectMember(member);
                      }}
                      className="flex-1 py-1.5 px-3 rounded-lg bg-[#F8FAFC] text-[#193B63] hover:bg-[#F97316] hover:text-white border border-[#E2E8F0] text-[11px] font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>Lihat Detail</span>
                    </button>
                    {onShareCustom && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleShareMember(member);
                        }}
                        className="p-1.5 rounded-lg bg-[#FFF7ED] hover:bg-[#FDBA74]/30 text-[#EA580C] border border-[#FDBA74] cursor-pointer transition-colors"
                        title="Bagikan Tautan Langsung Profil Ini"
                      >
                        <Share2 className="w-3.5 h-3.5 text-[#F97316]" />
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Accreditation & Integrity Footnote */}
        <div className="mt-16 p-6 rounded-3xl bg-[#FFF7ED] border-2 border-[#FDBA74] text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xs">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#F97316] text-white flex items-center justify-center font-black text-2xl shrink-0 shadow-xs border border-[#FDBA74]">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div>
              <h4 className="text-base sm:text-lg font-black text-[#193B63]">
                Pendidik & Tenaga Kependidikan Terdaftar Resmi di Kemendikbudristek
              </h4>
              <p className="text-xs text-[#486581] mt-0.5">
                Data tutor dan pengelola PKBM Bina Insani Sumowono tersinkronisasi dengan Dapodik Kesetaraan dan berstandar BAN-PDM.
              </p>
            </div>
          </div>

          <a
            href={`https://wa.me/${pkbmInfo.whatsappNumber}?text=Halo%20PKBM%20Bina%20Insani,%20saya%20ingin%20bertanya%20mengenai%20informasi%20tutor%20dan%20pembelajaran`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white text-xs font-black shadow-xs transition-all shrink-0 flex items-center gap-2 border border-[#FDBA74]/50"
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
            className="fixed inset-0 z-50 bg-[#1E293B]/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
            onClick={() => setZoomPhotoMember(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-3xl w-full bg-white border border-[#E2E8F0] rounded-3xl overflow-hidden shadow-2xl flex flex-col"
            >
              {/* Header Modal */}
              <div className="p-4 sm:p-5 bg-white border-b border-[#E2E8F0] flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-lg bg-[#FFF7ED] text-[#EA580C] border border-[#FDBA74] text-[11px] font-black uppercase">
                      {CATEGORY_CONFIG[zoomPhotoMember.category]?.shortLabel || 'Personalia'}
                    </span>
                    {zoomPhotoMember.nuptkOrNip && (
                      <span className="text-xs font-mono text-[#486581]">
                        NUPTK/NIP: {zoomPhotoMember.nuptkOrNip}
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-black text-[#193B63] truncate mt-1">
                    {zoomPhotoMember.name}
                  </h3>
                  <p className="text-xs text-[#EA580C] font-semibold truncate">
                    {zoomPhotoMember.role}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href={zoomPhotoMember.photo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl bg-[#F8FAFC] hover:bg-[#E2E8F0] text-[#486581] hover:text-[#193B63] border border-[#E2E8F0] transition-colors cursor-pointer"
                    title="Buka Gambar di Tab Baru"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  <button
                    onClick={() => setZoomPhotoMember(null)}
                    className="p-2 rounded-xl bg-[#F8FAFC] hover:bg-red-50 text-[#486581] hover:text-red-600 border border-[#E2E8F0] transition-colors cursor-pointer"
                    title="Tutup Modal"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Main Photo Container - Utuh 100% Bebas Terpotong */}
              <div className="relative w-full h-[60vh] sm:h-[68vh] bg-[#F8FAFC] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
                <img
                  src={zoomPhotoMember.photo}
                  alt={zoomPhotoMember.name}
                  className="relative z-10 max-h-full max-w-full w-auto h-auto object-contain rounded-2xl drop-shadow-md border border-[#E2E8F0]"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=600&q=80';
                  }}
                />
              </div>

              {/* Footer Information */}
              <div className="p-4 bg-white border-t border-[#E2E8F0] flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="text-[#486581]">
                  {zoomPhotoMember.education && (
                    <span className="text-[#1E293B] mr-3 font-semibold">
                      🎓 {zoomPhotoMember.education}
                    </span>
                  )}
                  {zoomPhotoMember.specialization && (
                    <span className="text-[#486581]">
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
                  className="px-4 py-1.5 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white font-bold cursor-pointer transition-all shadow-xs border border-[#FDBA74]/50"
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
