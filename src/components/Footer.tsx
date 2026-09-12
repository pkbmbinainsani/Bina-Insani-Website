import React from 'react';
import { BookOpen, MapPin, Phone, Mail, Award, ArrowUp, Lock, ShieldCheck, Navigation } from 'lucide-react';
import { usePKBM } from '../context/PKBMContext';

interface FooterProps {
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdmin }) => {
  const { pkbmInfo, isAdminAuthenticated, supabaseStatus } = usePKBM();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#090807] text-stone-300 pt-16 pb-8 border-t border-stone-800 relative">
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
              } bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-white font-bold shadow-lg shadow-orange-950/40 overflow-hidden shrink-0 border border-orange-400/40 p-1`}>
                {pkbmInfo.logoUrl ? (
                  <img
                    src={pkbmInfo.logoUrl}
                    alt={pkbmInfo.name}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <BookOpen className="w-5 h-5 text-white" />
                )}
              </div>
              <div>
                <h3 className="font-black text-white text-lg tracking-tight">
                  PKBM BINA INSANI SUMOWONO
                </h3>
                <p className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300 font-bold text-xs tracking-wider">
                  {pkbmInfo.motto}
                </p>
              </div>
            </div>

            <p className="text-stone-400 text-xs leading-relaxed max-w-md">
              Pusat Kegiatan Belajar Masyarakat (PKBM) Bina Insani Sumowono adalah wadah pendidikan nonformal dan kesetaraan (Paket A, B, C) yang terakreditasi di Kecamatan Sumowono, Kabupaten Semarang.
            </p>

            <div className="flex flex-wrap items-center gap-2 text-xs">
              <div className="flex items-center gap-2 text-amber-300/90 font-medium bg-stone-900/90 px-3 py-2 rounded-xl border border-stone-800 w-fit">
                <Award className="w-4 h-4 text-amber-400" />
                <span>NPSN: {pkbmInfo.npsn} • {pkbmInfo.accreditation}</span>
              </div>

              {onOpenAdmin && (
                <button
                  onClick={onOpenAdmin}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-orange-300 hover:text-orange-200 border border-stone-800 transition-colors font-bold cursor-pointer"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>{isAdminAuthenticated ? 'Dashboard Admin (Aktif)' : 'Login Admin Web'}</span>
                </button>
              )}
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="lg:col-span-3 space-y-3">
            <p className="font-extrabold text-white text-sm uppercase tracking-wider">
              Navigasi Cepat
            </p>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <a href="#beranda" className="hover:text-orange-400 transition-colors">
                  Beranda Utama
                </a>
              </li>
              <li>
                <a href="#tentang-kami" className="hover:text-orange-400 transition-colors">
                  Tentang Kami (Visi & Misi)
                </a>
              </li>
              <li>
                <a href="#personalia" className="hover:text-amber-300 font-medium text-orange-300 transition-colors">
                  Profil Personalia (Pendiri, Guru & Tendik)
                </a>
              </li>
              <li>
                <a href="#program-belajar" className="hover:text-orange-400 transition-colors">
                  Program Belajar Paket A, B, C
                </a>
              </li>
              <li>
                <a href="#vokasi" className="hover:text-orange-400 transition-colors">
                  Keterampilan Vokasi & Wirausaha
                </a>
              </li>
              <li>
                <a href="#galeri" className="hover:text-orange-400 transition-colors">
                  Galeri Dokumentasi Foto
                </a>
              </li>
              <li>
                <a href="#berita" className="hover:text-orange-400 transition-colors">
                  Berita & Pengumuman Terkini
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-orange-400 transition-colors">
                  Pertanyaan Umum (FAQ)
                </a>
              </li>
              <li>
                <a href="#kontak" className="hover:text-orange-400 transition-colors">
                  Formulir Kontak & Lokasi
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Contact & Address */}
          <div className="lg:col-span-4 space-y-3">
            <p className="font-extrabold text-white text-sm uppercase tracking-wider">
              Kontak & Alamat Lembaga
            </p>

            <div className="space-y-2.5 text-xs text-stone-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                <span>{pkbmInfo.address}</span>
              </div>

              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-orange-400 shrink-0" />
                <span className="text-white font-bold">{pkbmInfo.phonePrimary}</span>
              </div>

              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-orange-400 shrink-0" />
                <span>{pkbmInfo.email}</span>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap gap-2">
              <a
                href={`https://wa.me/${pkbmInfo.whatsappNumber}?text=Halo%20PKBM%20Bina%20Insani%20Sumowono`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-white font-bold text-xs shadow-md shadow-orange-950/40 transition-all border border-orange-300/40"
              >
                <Phone className="w-3.5 h-3.5" />
                Hotline WhatsApp
              </a>

              <a
                href={pkbmInfo.mapsUrl || 'https://maps.app.goo.gl/rXtEZKokMR9SQqhE8'}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-200 hover:text-white font-bold text-xs border border-stone-800 transition-colors"
              >
                <Navigation className="w-3.5 h-3.5 text-orange-400" />
                <span>Google Maps</span>
              </a>

              {onOpenAdmin && (
                <button
                  onClick={onOpenAdmin}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-300 hover:text-white font-bold text-xs border border-stone-800 transition-colors cursor-pointer"
                >
                  <Lock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Portal Admin</span>
                </button>
              )}
            </div>
          </div>

        </div>

        {/* Bottom Bar & Copyright */}
        <div className="pt-8 border-t border-stone-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <div className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left">
            <p>
              © {new Date().getFullYear()} <strong className="text-stone-300">PKBM BINA INSANI SUMOWONO</strong>. Hak Cipta Dilindungi Undang-Undang.
            </p>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-stone-900 text-stone-400 border border-stone-800">
              <span className={`w-1.5 h-1.5 rounded-full ${supabaseStatus === 'connected' ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
              <span>Database Cloud: {supabaseStatus === 'connected' ? 'Realtime Online' : 'Aktif'}</span>
            </div>
          </div>

          <button
            onClick={scrollToTop}
            className="p-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-300 hover:text-white transition-colors border border-stone-800 flex items-center gap-1.5 cursor-pointer"
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

