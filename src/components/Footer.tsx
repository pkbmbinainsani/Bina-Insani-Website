import React from 'react';
import { BookOpen, MapPin, Phone, Mail, Award, ArrowUp, Lock, ShieldCheck, Navigation } from 'lucide-react';
import { usePKBM } from '../context/PKBMContext';

interface FooterProps {
  onOpenAdmin?: () => void;
  onSelectTab?: (tabId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdmin, onSelectTab }) => {
  const { pkbmInfo, isAdminAuthenticated, supabaseStatus } = usePKBM();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const quickNav = [
    { label: 'Beranda Utama', id: 'beranda' },
    { label: 'Berita & Pengumuman', id: 'berita' },
    { label: 'Prestasi Warga Belajar', id: 'prestasi' },
    { label: 'Tentang Kami (Profil & Visi Misi)', id: 'tentang-kami' },
    { label: 'Profil Personalia (Pendiri & Guru)', id: 'personalia' },
    { label: 'Program Belajar Paket A, B, C', id: 'program-belajar' },
    { label: 'Keterampilan Vokasi & Wirausaha', id: 'vokasi' },
    { label: 'Galeri Dokumentasi Foto & Video', id: 'galeri' },
    { label: 'Pertanyaan Umum (FAQ)', id: 'faq' },
    { label: 'Formulir Kontak & Lokasi', id: 'kontak' },
  ];

  return (
    <footer className="bg-[#0F294A] text-white pt-16 pb-8 border-t border-white/10 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Col 1: Institutional Identity */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className={`w-11 h-11 ${
                pkbmInfo.logoShape === 'circle'
                  ? 'rounded-full'
                  : pkbmInfo.logoShape === 'square'
                  ? 'rounded-lg'
                  : 'rounded-xl'
              } bg-white flex items-center justify-center text-[#EA580C] font-bold shadow-sm overflow-hidden shrink-0 border border-white/80 p-1`}>
                {pkbmInfo.logoUrl ? (
                  <img
                    src={pkbmInfo.logoUrl}
                    alt={pkbmInfo.name}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <BookOpen className="w-5 h-5 text-[#EA580C]" />
                )}
              </div>
              <div>
                <h3 className="font-black text-white text-lg tracking-tight">
                  PKBM BINA INSANI SUMOWONO
                </h3>
                <p className="text-[#F59E0B] font-bold text-xs tracking-wider">
                  {pkbmInfo.motto}
                </p>
              </div>
            </div>

            <p className="text-white/80 text-xs leading-relaxed max-w-md">
              Pusat Kegiatan Belajar Masyarakat (PKBM) Bina Insani Sumowono adalah wadah pendidikan nonformal dan kesetaraan (Paket A, B, C) yang terakreditasi di Kecamatan Sumowono, Kabupaten Semarang.
            </p>

            <div className="flex flex-wrap items-center gap-2 text-xs">
              <div className="flex items-center gap-2 text-[#F59E0B] font-medium bg-white/10 px-3 py-2 rounded-xl border border-white/15 w-fit">
                <Award className="w-4 h-4 text-[#F59E0B]" />
                <span className="text-white">NPSN: <strong className="text-[#F59E0B]">{pkbmInfo.npsn}</strong> • {pkbmInfo.accreditation}</span>
              </div>

              {onOpenAdmin && (
                <button
                  onClick={onOpenAdmin}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/15 transition-colors font-bold cursor-pointer"
                >
                  <Lock className="w-3.5 h-3.5 text-[#FDBA74]" />
                  <span>{isAdminAuthenticated ? 'Dashboard Admin (Aktif)' : 'Login Admin Web'}</span>
                </button>
              )}
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="lg:col-span-3 space-y-3">
            <p className="font-extrabold text-[#F59E0B] text-sm uppercase tracking-wider">
              Navigasi Halaman
            </p>
            <ul className="space-y-2 text-xs text-white/80">
              {quickNav.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => {
                      if (onSelectTab) {
                        onSelectTab(item.id);
                      } else {
                        document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    className="hover:text-[#F59E0B] transition-colors text-left cursor-pointer flex items-center gap-1.5 group"
                  >
                    <span className="text-[#FDBA74] opacity-0 group-hover:opacity-100 transition-opacity">›</span>
                    <span>{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Contact & Address */}
          <div className="lg:col-span-4 space-y-3">
            <p className="font-extrabold text-[#F59E0B] text-sm uppercase tracking-wider">
              Kontak & Alamat Lembaga
            </p>

            <div className="space-y-2.5 text-xs text-white/80">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#FDBA74] shrink-0 mt-0.5" />
                <span>{pkbmInfo.address}</span>
              </div>

              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#FDBA74] shrink-0" />
                <span className="text-white font-bold">{pkbmInfo.phonePrimary}</span>
              </div>

              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#FDBA74] shrink-0" />
                <span>{pkbmInfo.email}</span>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap gap-2">
              <a
                href={`https://wa.me/${pkbmInfo.whatsappNumber}?text=Halo%20PKBM%20Bina%20Insani%20Sumowono`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white font-bold text-xs shadow-xs transition-all border border-[#FDBA74]/50"
              >
                <Phone className="w-3.5 h-3.5" />
                Hotline WhatsApp
              </a>

              <a
                href={pkbmInfo.mapsUrl || 'https://maps.app.goo.gl/rXtEZKokMR9SQqhE8'}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition-colors"
              >
                <Navigation className="w-3.5 h-3.5 text-[#F59E0B]" />
                <span>Google Maps</span>
              </a>

              {onOpenAdmin && (
                <button
                  onClick={onOpenAdmin}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition-colors cursor-pointer"
                >
                  <Lock className="w-3.5 h-3.5 text-[#F59E0B]" />
                  <span>Portal Admin</span>
                </button>
              )}
            </div>
          </div>

        </div>

        {/* Bottom Bar & Copyright */}
        <div className="pt-8 border-t border-white/15 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/70">
          <div className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left">
            <p>
              © {new Date().getFullYear()} <strong className="text-white">PKBM BINA INSANI SUMOWONO</strong>. Hak Cipta Dilindungi Undang-Undang.
            </p>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/10 text-white border border-white/15">
              <span className={`w-1.5 h-1.5 rounded-full ${supabaseStatus === 'connected' ? 'bg-emerald-400 animate-pulse' : 'bg-[#F59E0B]'}`} />
              <span>Database Cloud: {supabaseStatus === 'connected' ? 'Realtime Online' : 'Aktif'}</span>
            </div>
          </div>

          <button
            onClick={scrollToTop}
            className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors border border-white/20 flex items-center gap-1.5 cursor-pointer"
            title="Kembali ke atas"
          >
            <span>Atas</span>
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>

      </div>
    </footer>
  );
};
