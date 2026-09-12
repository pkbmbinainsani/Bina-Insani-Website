import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  LayoutDashboard,
  Newspaper,
  Users,
  Image as ImageIcon,
  Settings,
  Plus,
  Edit,
  Trash2,
  ExternalLink,
  Search,
  CheckCircle2,
  Clock,
  Calendar,
  User,
  Upload,
  Link as LinkIcon,
  MessageCircle,
  FileSpreadsheet,
  FileText,
  Download,
  UploadCloud,
  LogOut,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  Eye,
  Check,
  RefreshCw,
  Tag,
  BookOpen,
  ArrowRight,
  Phone,
  MapPin,
  HelpCircle,
  Building2,
  GraduationCap,
  Wrench,
  Compass,
  Sliders,
  Camera,
  Award,
  Navigation,
  Database,
  Radio
} from 'lucide-react';
import { usePKBM } from '../../context/PKBMContext';
import { NewsItem, GalleryItem, RegisteredStudent, PKBMInfoState } from '../../types';
import { AboutCmsTab } from './tabs/AboutCmsTab';
import { ProgramsCmsTab } from './tabs/ProgramsCmsTab';
import { VokasiCmsTab } from './tabs/VokasiCmsTab';
import { FaqCmsTab } from './tabs/FaqCmsTab';
import { HeroSlidesCmsTab } from './tabs/HeroSlidesCmsTab';
import { PersonaliaCmsTab } from './tabs/PersonaliaCmsTab';
import { DatabaseCmsTab } from './tabs/DatabaseCmsTab';
import { LogoManagerModal } from './LogoManagerModal';

interface AdminDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type TabType =
  | 'overview'
  | 'database'
  | 'heroslides'
  | 'news'
  | 'personalia'
  | 'registrations'
  | 'gallery'
  | 'about'
  | 'programs'
  | 'vokasi'
  | 'faqs'
  | 'settings';

export const AdminDashboardModal: React.FC<AdminDashboardModalProps> = ({ isOpen, onClose }) => {
  const {
    news,
    addNews,
    updateNews,
    deleteNews,
    gallery,
    addGalleryItem,
    deleteGalleryItem,
    registrations,
    updateRegistrationStatus,
    deleteRegistration,
    heroSlides,
    personalia,
    pkbmInfo,
    updatePKBMInfo,
    logoutAdmin,
    changeAdminPassword,
    resetToDefaultData,
    exportDataJSON,
    importDataJSON,
    supabaseStatus,
    isTableConfigured,
    lastSyncTime,
    isSyncing
  } = usePKBM();

  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // News CMS State
  const [newsSearch, setNewsSearch] = useState('');
  const [selectedNewsCategory, setSelectedNewsCategory] = useState('Semua');
  const [isEditingNews, setIsEditingNews] = useState(false);
  const [editingNewsId, setEditingNewsId] = useState<string | null>(null);
  const [newsFormData, setNewsFormData] = useState<{
    title: string;
    category: string;
    date: string;
    author: string;
    summary: string;
    content: string;
    image: string;
    readTime: string;
    featured: boolean;
  }>({
    title: '',
    category: 'Pengumuman Resmi',
    date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
    author: 'Humas PKBM Bina Insani Sumowono',
    summary: '',
    content: '',
    image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=1000',
    readTime: '3 menit baca',
    featured: false
  });

  // Registrations Management State
  const [regSearch, setRegSearch] = useState('');
  const [regFilterProgram, setRegFilterProgram] = useState('Semua');
  const [regFilterStatus, setRegFilterStatus] = useState('Semua');
  const [selectedStudentDetail, setSelectedStudentDetail] = useState<RegisteredStudent | null>(null);
  const [adminPreviewDoc, setAdminPreviewDoc] = useState<{ title: string; url: string; isPdf: boolean } | null>(null);

  // Gallery CMS State
  const [isAddingGallery, setIsAddingGallery] = useState(false);
  const [galleryFormData, setGalleryFormData] = useState({
    title: '',
    category: 'Akademik Kesetaraan',
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=1000',
    date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
    description: ''
  });

  // Settings State
  const [settingsForm, setSettingsForm] = useState<PKBMInfoState>({ ...pkbmInfo });
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isLogoModalOpen, setIsLogoModalOpen] = useState(false);

  React.useEffect(() => {
    setSettingsForm({ ...pkbmInfo });
  }, [pkbmInfo]);

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Image Presets for Quick Selection
  const imagePresets = [
    { label: 'Kelas Belajar & Guru', url: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=1000' },
    { label: 'Lab Komputer & Vokasi', url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=1000' },
    { label: 'Kopi & Barista Desa', url: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=1000' },
    { label: 'Tata Boga & Kuliner', url: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=1000' },
    { label: 'Wisuda & Ijazah Resmi', url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=1000' },
    { label: 'Diskusi & Kerjasama', url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1000' }
  ];

  // Handle Image File Upload (Convert to Base64 Data URL)
  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>, target: 'news' | 'gallery') => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) {
        alert('Ukuran file foto maksimal 4MB');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64Url = event.target?.result as string;
        if (target === 'news') {
          setNewsFormData((prev) => ({ ...prev, image: base64Url }));
        } else {
          setGalleryFormData((prev) => ({ ...prev, image: base64Url }));
        }
        showToast('Foto berhasil dimuat dari perangkat!');
      };
      reader.readAsDataURL(file);
    }
  };

  // NEWS ACTIONS
  const handleOpenAddNews = () => {
    setNewsFormData({
      title: '',
      category: 'Pengumuman Resmi',
      date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
      author: 'Humas PKBM Bina Insani Sumowono',
      summary: '',
      content: '',
      image: imagePresets[0].url,
      readTime: '3 menit baca',
      featured: false
    });
    setEditingNewsId(null);
    setIsEditingNews(true);
  };

  const handleOpenEditNews = (item: NewsItem) => {
    setNewsFormData({
      title: item.title,
      category: item.category,
      date: item.date,
      author: item.author,
      summary: item.summary,
      content: item.content.join('\n\n'),
      image: item.image,
      readTime: item.readTime,
      featured: !!item.featured
    });
    setEditingNewsId(item.id);
    setIsEditingNews(true);
  };

  const handleSaveNews = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsFormData.title.trim() || !newsFormData.summary.trim()) {
      alert('Mohon lengkapi judul dan ringkasan berita');
      return;
    }

    const contentParagraphs = newsFormData.content
      .split('\n\n')
      .map((p) => p.trim())
      .filter((p) => p.length > 0);

    const paragraphsToSave = contentParagraphs.length > 0 ? contentParagraphs : [newsFormData.summary];

    if (editingNewsId) {
      updateNews(editingNewsId, {
        title: newsFormData.title,
        category: newsFormData.category,
        date: newsFormData.date,
        author: newsFormData.author,
        summary: newsFormData.summary,
        content: paragraphsToSave,
        image: newsFormData.image,
        readTime: newsFormData.readTime,
        featured: newsFormData.featured
      });
      showToast('Berita berhasil diperbarui!');
    } else {
      addNews({
        title: newsFormData.title,
        category: newsFormData.category,
        date: newsFormData.date,
        author: newsFormData.author,
        summary: newsFormData.summary,
        content: paragraphsToSave,
        image: newsFormData.image,
        readTime: newsFormData.readTime,
        featured: newsFormData.featured
      });
      showToast('Berita baru berhasil diposting ke website!');
    }

    setIsEditingNews(false);
  };

  const handleDeleteNews = (id: string, title: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus berita "${title}"?`)) {
      deleteNews(id);
      showToast('Berita berhasil dihapus');
    }
  };

  // GALLERY ACTIONS
  const handleSaveGallery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!galleryFormData.title.trim()) {
      alert('Mohon masukkan judul kegiatan foto');
      return;
    }
    addGalleryItem({
      title: galleryFormData.title,
      category: galleryFormData.category,
      image: galleryFormData.image,
      date: galleryFormData.date,
      description: galleryFormData.description
    });
    setIsAddingGallery(false);
    showToast('Foto dokumentasi kegiatan berhasil ditambahkan ke galeri!');
  };

  const handleDeleteGallery = (id: string) => {
    if (confirm('Hapus foto ini dari galeri?')) {
      deleteGalleryItem(id);
      showToast('Foto galeri dihapus');
    }
  };

  // REGISTRATION ACTIONS
  const filteredRegistrations = registrations.filter((reg) => {
    const searchLower = regSearch.toLowerCase();
    const matchQuery =
      (reg.namaLengkap || '').toLowerCase().includes(searchLower) ||
      (reg.nik || '').includes(regSearch) ||
      (reg.noWhatsapp || reg.nomorHp || '').includes(regSearch) ||
      (reg.registrationCode || '').toLowerCase().includes(searchLower) ||
      (reg.alamatLengkap || reg.alamatJalan || '').toLowerCase().includes(searchLower);
    const matchProg = regFilterProgram === 'Semua' || (reg.pilihanProgram || '').includes(regFilterProgram);
    const matchStat = regFilterStatus === 'Semua' || reg.status === regFilterStatus;
    return matchQuery && matchProg && matchStat;
  });

  const handleExportCSV = () => {
    const escapeCsv = (val: string | number | boolean | null | undefined): string => {
      if (val === undefined || val === null) return '""';
      const str = String(val).trim();
      return `"${str.replace(/"/g, '""')}"`;
    };

    const headers = [
      'No',
      'Kode Pendaftaran',
      'Tanggal Pendaftaran',
      'Status Verifikasi',
      'Program Kesetaraan',
      'Jenis Pendaftaran',
      'Pendidikan Terakhir',
      'Hobi',
      'Cita-Cita',
      'Nama Lengkap',
      'NIK',
      'Jenis Kelamin',
      'Tempat Lahir',
      'Tanggal Lahir',
      'Tempat & Tanggal Lahir (Kombinasi)',
      'Agama',
      'Kewarganegaraan',
      'Nama Negara',
      'Kebutuhan Khusus Siswa',
      'Status Pas Foto',
      'Alamat Jalan / Rumah',
      'RT',
      'RW',
      'Nama Dusun',
      'Kelurahan / Desa',
      'Kecamatan',
      'Kabupaten / Kota',
      'Kode Pos',
      'Alamat Lengkap',
      'Status Tempat Tinggal',
      'Moda Transportasi',
      'No HP / WhatsApp',
      'No Telepon Rumah',
      'Email Pribadi',
      'Nama Ayah Kandung',
      'Tahun Lahir Ayah',
      'Pendidikan Ayah',
      'Pekerjaan Ayah',
      'Penghasilan Ayah',
      'Kebutuhan Khusus Ayah',
      'Nama Ibu Kandung',
      'Tahun Lahir Ibu',
      'Pendidikan Ibu',
      'Pekerjaan Ibu',
      'Penghasilan Ibu',
      'Kebutuhan Khusus Ibu',
      'Nama Wali',
      'Tahun Lahir Wali',
      'Pendidikan Wali',
      'Pekerjaan Wali',
      'Penghasilan Wali',
      'Tinggi Badan (cm)',
      'Berat Badan (kg)',
      'Jarak ke PKBM (km)',
      'Waktu Tempuh (menit)',
      'Jumlah Saudara Kandung',
      'Dokumen KK Terlampir',
      'Nama File KK',
      'Dokumen Ijazah Terlampir',
      'Nama File Ijazah',
      'Dokumen KTP Terlampir',
      'Nama File KTP',
      'Pernyataan Keabsahan Data',
      'Catatan Khusus Siswa',
      'Catatan Verifikasi Admin'
    ];

    const dataToExport = filteredRegistrations.length > 0 ? filteredRegistrations : registrations;

    const rows = dataToExport.map((r, index) => [
      escapeCsv(index + 1),
      escapeCsv(r.registrationCode),
      escapeCsv(r.createdAt),
      escapeCsv(r.status),
      escapeCsv(r.pilihanProgram),
      escapeCsv(r.jenisPendaftaran || 'Baru'),
      escapeCsv(r.pendidikanTerakhir || '-'),
      escapeCsv(r.hobi || '-'),
      escapeCsv(r.citaCita || '-'),
      escapeCsv(r.namaLengkap),
      escapeCsv(r.nik ? `'${r.nik}` : (r.nik || '-')),
      escapeCsv(r.jenisKelamin),
      escapeCsv(r.tempatLahir || (r.tempatTanggalLahir ? r.tempatTanggalLahir.split(',')[0]?.trim() : '-')),
      escapeCsv(r.tanggalLahir || (r.tempatTanggalLahir ? r.tempatTanggalLahir.split(',')[1]?.trim() : '-')),
      escapeCsv(r.tempatTanggalLahir || `${r.tempatLahir || ''}, ${r.tanggalLahir || ''}`.trim()),
      escapeCsv(r.agama || 'Islam'),
      escapeCsv(r.kewarganegaraan || 'WNI'),
      escapeCsv(r.namaNegara || 'Indonesia'),
      escapeCsv(r.kebutuhanKhusus || 'Tidak Ada'),
      escapeCsv(r.passPhoto ? 'Ada (Terlampir)' : 'Tidak Ada'),
      escapeCsv(r.alamatJalan || r.alamatLengkap || '-'),
      escapeCsv(r.rt || '-'),
      escapeCsv(r.rw || '-'),
      escapeCsv(r.namaDusun || '-'),
      escapeCsv(r.namaKelurahanDesa || '-'),
      escapeCsv(r.kecamatan || 'Sumowono'),
      escapeCsv(r.kotaKabupaten || 'Kabupaten Semarang'),
      escapeCsv(r.kodePos || '50662'),
      escapeCsv(r.alamatLengkap || `${r.alamatJalan || ''}, RT ${r.rt || '-'}/RW ${r.rw || '-'}, ${r.namaDusun || ''}, Desa ${r.namaKelurahanDesa || ''}, Kec. ${r.kecamatan || 'Sumowono'}, ${r.kotaKabupaten || 'Kabupaten Semarang'}`.replace(/,\s*,/g, ', ')),
      escapeCsv(r.tempatTinggal || '-'),
      escapeCsv(r.modaTransportasi || '-'),
      escapeCsv(r.noWhatsapp || r.nomorHp || '-'),
      escapeCsv(r.nomorTelepon || '-'),
      escapeCsv(r.emailPribadi || '-'),
      escapeCsv(r.namaAyahKandung || r.namaOrangTuaWali || '-'),
      escapeCsv(r.tahunLahirAyah || '-'),
      escapeCsv(r.pendidikanAyah || '-'),
      escapeCsv(r.pekerjaanAyah || '-'),
      escapeCsv(r.penghasilanBulananAyah || '-'),
      escapeCsv(r.kebutuhanKhususAyah || 'Tidak Ada'),
      escapeCsv(r.namaIbuKandung || '-'),
      escapeCsv(r.tahunLahirIbu || '-'),
      escapeCsv(r.pendidikanIbu || '-'),
      escapeCsv(r.pekerjaanIbu || '-'),
      escapeCsv(r.penghasilanBulananIbu || '-'),
      escapeCsv(r.kebutuhanKhususIbu || 'Tidak Ada'),
      escapeCsv(r.namaWali || '-'),
      escapeCsv(r.tahunLahirWali || '-'),
      escapeCsv(r.pendidikanWali || '-'),
      escapeCsv(r.pekerjaanWali || '-'),
      escapeCsv(r.penghasilanBulananWali || '-'),
      escapeCsv(r.tinggiBadan || '-'),
      escapeCsv(r.beratBadan || '-'),
      escapeCsv(r.jarakKeSekolah || '-'),
      escapeCsv(r.waktuTempuhKeSekolah || '-'),
      escapeCsv(r.jumlahSaudaraKandung || '-'),
      escapeCsv(r.dokumenKK ? 'Ya (Terlampir)' : 'Tidak Ada'),
      escapeCsv(r.namaFileKK || '-'),
      escapeCsv(r.dokumenIjazah ? 'Ya (Terlampir)' : 'Tidak Ada'),
      escapeCsv(r.namaFileIjazah || '-'),
      escapeCsv(r.dokumenKTP ? 'Ya (Terlampir)' : 'Tidak Ada'),
      escapeCsv(r.namaFileKTP || '-'),
      escapeCsv(r.pernyataan ? 'Disetujui' : 'Belum'),
      escapeCsv(r.catatanKhusus || '-'),
      escapeCsv(r.adminNotes || '-')
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.map(h => `"${h}"`).join(','), ...rows.map((e) => e.join(','))].join('\r\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Pendaftar_PWBB_PKBM_Bina_Insani_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`File CSV pendaftar (${dataToExport.length} data) berhasil diunduh!`);
  };

  const handleSendWhatsAppToStudent = (student: RegisteredStudent) => {
    const cleanPhone = student.noWhatsapp.replace(/[^0-9]/g, '');
    const phone = cleanPhone.startsWith('0') ? '62' + cleanPhone.slice(1) : cleanPhone;
    const msg = `*SEKRETARIAT PKBM BINA INSANI SUMOWONO*\n==================================\n\nHalo Sdr/i *${student.namaLengkap}*,\n\nTerima kasih telah mendaftar di *PKBM Bina Insani Sumowono* untuk program *${student.pilihanProgram}* dengan Kode Registrasi: *${student.registrationCode}*.\n\nStatus berkas Anda saat ini: *${student.status}*.\n\nSilakan lengkapi berkas berikut:\n1. Fotokopi Ijazah Terakhir (3 lembar)\n2. Fotokopi KK & KTP (3 lembar)\n3. Pas Foto 3x4 (4 lembar background merah)\n\nKantor kami buka: ${pkbmInfo.operationalHours}\nAlamat: ${pkbmInfo.address}\n\nAda yang ingin ditanyakan seputar jadwal kelas & e-modul belajar?`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  // SETTINGS ACTIONS
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updatePKBMInfo(settingsForm);
    showToast('Informasi lembaga dan kontak berhasil diperbarui!');
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    if (newPassword.length < 6) {
      setPasswordError('Password baru minimal 6 karakter');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('Konfirmasi password tidak cocok');
      return;
    }
    const success = changeAdminPassword(oldPassword, newPassword);
    if (success) {
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      showToast('Password admin berhasil diubah!');
    } else {
      setPasswordError('Password lama salah');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-hidden">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-60 bg-orange-600 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 border border-orange-500 font-bold text-xs animate-in slide-in-from-top-4 duration-200">
          <CheckCircle2 className="w-4 h-4 text-orange-200" />
          <span>{toastMessage}</span>
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.98 }}
        className="bg-slate-50 w-full max-w-7xl h-[94vh] rounded-3xl shadow-2xl border border-slate-300 flex flex-col overflow-hidden"
      >
        {/* Top Header Bar */}
        <header className="bg-slate-950 text-white px-4 sm:px-6 py-3.5 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-500 text-slate-950 flex items-center justify-center font-black shadow-md shadow-amber-400/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black tracking-tight text-white uppercase">
                  CMS & Portal Admin PKBM Bina Insani
                </h2>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-extrabold bg-orange-500/20 text-orange-400 border border-orange-500/30">
                  NPSN: {pkbmInfo.npsn}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Kelola Berita, Pendaftar PWBB, Galeri Foto, dan Profil Website
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Supabase Realtime Quick Indicator */}
            <button
              onClick={() => setActiveTab('database')}
              className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                supabaseStatus === 'connected'
                  ? 'bg-emerald-950/70 border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/80'
                  : supabaseStatus === 'connecting'
                  ? 'bg-amber-950/70 border-amber-500/40 text-amber-300 hover:bg-amber-900/80'
                  : 'bg-red-950/70 border-red-500/40 text-red-300 hover:bg-red-900/80'
              }`}
              title="Status Database Online Supabase - Klik untuk Buka Pengaturan Realtime"
            >
              <span className={`w-2 h-2 rounded-full ${
                supabaseStatus === 'connected' ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'
              }`} />
              <Database className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Supabase Realtime</span>
            </button>

            <button
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-700"
              title="Lihat Website dalam Mode Publik"
            >
              <Eye className="w-3.5 h-3.5 text-orange-400" />
              <span className="hidden sm:inline">Lihat Web Publik</span>
            </button>
            <button
              onClick={() => {
                logoutAdmin();
                onClose();
              }}
              className="px-3 py-1.5 rounded-xl bg-red-950/60 hover:bg-red-900 text-red-300 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer border border-red-800/60"
              title="Keluar dari Panel Admin"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Keluar</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Main Body with Sidebar Navigation */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* Sidebar Tabs */}
          <aside className="w-20 sm:w-64 bg-white border-r border-slate-200 p-2 sm:p-4 flex flex-col justify-between shrink-0 overflow-y-auto">
            <div className="space-y-1.5">
              <div className="hidden sm:block px-3 py-2 text-[11px] font-black text-slate-400 uppercase tracking-wider">
                Menu Pengelola
              </div>

              {/* Tab 1: Overview */}
              <button
                onClick={() => setActiveTab('overview')}
                className={`w-full p-2.5 sm:px-3.5 sm:py-2.5 rounded-2xl text-xs font-bold flex items-center gap-3 transition-all cursor-pointer ${
                  activeTab === 'overview'
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-950/20'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <LayoutDashboard className="w-5 h-5 shrink-0" />
                <span className="hidden sm:inline">Ringkasan & Stat</span>
              </button>

              {/* Tab: Database Supabase Realtime */}
              <button
                onClick={() => setActiveTab('database')}
                className={`w-full p-2.5 sm:px-3.5 sm:py-2.5 rounded-2xl text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                  activeTab === 'database'
                    ? 'bg-gradient-to-r from-emerald-700 to-teal-700 text-white shadow-md shadow-emerald-950/20'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Database className={`w-5 h-5 shrink-0 ${activeTab === 'database' ? 'text-white' : 'text-emerald-600'}`} />
                  <span className="hidden sm:inline">Database Supabase</span>
                </div>
                <span
                  className={`hidden sm:inline-flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full ${
                    activeTab === 'database'
                      ? 'bg-emerald-950 text-emerald-200'
                      : supabaseStatus === 'connected'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${supabaseStatus === 'connected' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                  {supabaseStatus === 'connected' ? 'Live' : 'Sync'}
                </span>
              </button>

              {/* Tab 2: Banner Beranda / Halaman Berganti (Slider) */}
              <button
                onClick={() => setActiveTab('heroslides')}
                className={`w-full p-2.5 sm:px-3.5 sm:py-2.5 rounded-2xl text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                  activeTab === 'heroslides'
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-950/20'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Sliders className="w-5 h-5 shrink-0 text-amber-500" />
                  <span className="hidden sm:inline">Banner Berganti (Slider)</span>
                </div>
                <span
                  className={`hidden sm:inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    activeTab === 'heroslides' ? 'bg-orange-900 text-amber-300' : 'bg-orange-100 text-orange-600'
                  }`}
                >
                  {heroSlides.length}
                </span>
              </button>

              {/* Tab 3: News CMS */}
              <button
                onClick={() => setActiveTab('news')}
                className={`w-full p-2.5 sm:px-3.5 sm:py-2.5 rounded-2xl text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                  activeTab === 'news'
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-950/20'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Newspaper className="w-5 h-5 shrink-0" />
                  <span className="hidden sm:inline">Kelola Berita</span>
                </div>
                <span
                  className={`hidden sm:inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    activeTab === 'news' ? 'bg-orange-900 text-amber-300' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {news.length}
                </span>
              </button>

              {/* Tab 2.5: Personalia */}
              <button
                onClick={() => setActiveTab('personalia')}
                className={`w-full p-2.5 sm:px-3.5 sm:py-2.5 rounded-2xl text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                  activeTab === 'personalia'
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-950/20'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Award className="w-5 h-5 shrink-0" />
                  <span className="hidden sm:inline">Data Personalia</span>
                </div>
                <span
                  className={`hidden sm:inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    activeTab === 'personalia' ? 'bg-orange-900 text-amber-300' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {personalia.length}
                </span>
              </button>

              {/* Tab 3: Registrations */}
              <button
                onClick={() => setActiveTab('registrations')}
                className={`w-full p-2.5 sm:px-3.5 sm:py-2.5 rounded-2xl text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                  activeTab === 'registrations'
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-950/20'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 shrink-0" />
                  <span className="hidden sm:inline">Pendaftar PWBB</span>
                </div>
                <span
                  className={`hidden sm:inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    activeTab === 'registrations' ? 'bg-orange-900 text-amber-300' : 'bg-amber-100 text-amber-900'
                  }`}
                >
                  {registrations.length}
                </span>
              </button>

              {/* Tab 4: Gallery */}
              <button
                onClick={() => setActiveTab('gallery')}
                className={`w-full p-2.5 sm:px-3.5 sm:py-2.5 rounded-2xl text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                  activeTab === 'gallery'
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-950/20'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <ImageIcon className="w-5 h-5 shrink-0" />
                  <span className="hidden sm:inline">Galeri & Foto</span>
                </div>
                <span
                  className={`hidden sm:inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    activeTab === 'gallery' ? 'bg-orange-900 text-amber-300' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {gallery.length}
                </span>
              </button>

              {/* Tab 5: Tentang PKBM & Visi Misi */}
              <button
                onClick={() => setActiveTab('about')}
                className={`w-full p-2.5 sm:px-3.5 sm:py-2.5 rounded-2xl text-xs font-bold flex items-center gap-3 transition-all cursor-pointer ${
                  activeTab === 'about'
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-950/20'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Building2 className="w-5 h-5 shrink-0" />
                <span className="hidden sm:inline">Tentang & Visi Misi</span>
              </button>

              {/* Tab 6: Program Belajar */}
              <button
                onClick={() => setActiveTab('programs')}
                className={`w-full p-2.5 sm:px-3.5 sm:py-2.5 rounded-2xl text-xs font-bold flex items-center gap-3 transition-all cursor-pointer ${
                  activeTab === 'programs'
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-950/20'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <GraduationCap className="w-5 h-5 shrink-0" />
                <span className="hidden sm:inline">Program Belajar</span>
              </button>

              {/* Tab 7: Program Vokasi */}
              <button
                onClick={() => setActiveTab('vokasi')}
                className={`w-full p-2.5 sm:px-3.5 sm:py-2.5 rounded-2xl text-xs font-bold flex items-center gap-3 transition-all cursor-pointer ${
                  activeTab === 'vokasi'
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-950/20'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Wrench className="w-5 h-5 shrink-0" />
                <span className="hidden sm:inline">Program Vokasi</span>
              </button>

              {/* Tab 8: Tanya Jawab FAQ */}
              <button
                onClick={() => setActiveTab('faqs')}
                className={`w-full p-2.5 sm:px-3.5 sm:py-2.5 rounded-2xl text-xs font-bold flex items-center gap-3 transition-all cursor-pointer ${
                  activeTab === 'faqs'
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-950/20'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <HelpCircle className="w-5 h-5 shrink-0" />
                <span className="hidden sm:inline">Tanya Jawab FAQ</span>
              </button>

              {/* Tab 9: Settings */}
              <button
                onClick={() => setActiveTab('settings')}
                className={`w-full p-2.5 sm:px-3.5 sm:py-2.5 rounded-2xl text-xs font-bold flex items-center gap-3 transition-all cursor-pointer ${
                  activeTab === 'settings'
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-950/20'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Settings className="w-5 h-5 shrink-0" />
                <span className="hidden sm:inline">Pengaturan & Kontak</span>
              </button>
            </div>

            {/* Quick Admin Footer Info */}
            <div className="hidden sm:block p-3 bg-orange-50 rounded-2xl border border-orange-200 text-[11px] text-orange-950 space-y-1">
              <div className="font-extrabold flex items-center gap-1.5 text-orange-600">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Mode Admin Aktif</span>
              </div>
              <p className="text-slate-600 text-[10px]">
                Semua postingan & perubahan langsung tersimpan otomatis ke web.
              </p>
            </div>
          </aside>

          {/* Tab Content Area */}
          <main className="flex-1 bg-slate-50 p-4 sm:p-6 overflow-y-auto">
            
            {/* TAB 1: OVERVIEW */}
            {activeTab === 'overview' && (
              <div className="space-y-6 max-w-6xl mx-auto">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                  <div>
                    <h3 className="text-xl font-black text-slate-900">
                      Selamat Datang di Panel Pengelola Konten
                    </h3>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Pusat Kegiatan Belajar Masyarakat (PKBM) Bina Insani Sumowono • Kab. Semarang
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => setIsLogoModalOpen(true)}
                      className="px-3.5 py-2 rounded-xl bg-orange-100 hover:bg-orange-200 text-orange-950 font-extrabold text-xs flex items-center gap-2 shadow-xs transition-all cursor-pointer border border-orange-300"
                    >
                      <Camera className="w-4 h-4 text-orange-800" />
                      <span>Ganti Logo Lembaga</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('heroslides')}
                      className="px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs flex items-center gap-2 shadow-sm transition-all cursor-pointer"
                    >
                      <Sliders className="w-4 h-4" />
                      <span>Atur Banner Berganti ({heroSlides.length} Slide)</span>
                    </button>
                    <button
                      onClick={() => {
                        setActiveTab('news');
                        handleOpenAddNews();
                      }}
                      className="px-3.5 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-xs flex items-center gap-2 shadow-sm transition-all cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Posting Berita Baru</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('registrations')}
                      className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs flex items-center gap-2 shadow-sm transition-all cursor-pointer"
                    >
                      <Users className="w-4 h-4 text-amber-400" />
                      <span>Cek Pendaftar PWBB</span>
                    </button>
                  </div>
                </div>

                {/* Realtime Supabase Cloud Status Card */}
                <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 p-4 sm:p-5 rounded-3xl border border-emerald-500/30 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-400 flex items-center justify-center font-black shrink-0 shadow-inner">
                      <Database className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-black tracking-tight text-white">
                          Supabase Realtime Database
                        </p>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black flex items-center gap-1.5 ${
                          supabaseStatus === 'connected'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            supabaseStatus === 'connected' ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'
                          }`} />
                          {supabaseStatus === 'connected' ? 'Terhubung & Sinkron' : 'Menghubungkan...'}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-300 mt-0.5">
                        Setiap pendaftaran baru, artikel berita, dan foto kegiatan langsung tersinkron ke semua perangkat via WebSockets.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setActiveTab('database')}
                      className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                    >
                      <Database className="w-3.5 h-3.5" />
                      <span>Buka Panel Database</span>
                    </button>
                  </div>
                </div>

                {/* Metric Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-500">Berita & Artikel</span>
                      <div className="p-2.5 bg-orange-100 text-orange-800 rounded-xl">
                        <Newspaper className="w-5 h-5" />
                      </div>
                    </div>
                    <div className="mt-3">
                      <p className="text-3xl font-black text-slate-900">{news.length}</p>
                      <p className="text-[11px] text-orange-700 font-semibold mt-0.5">Artikel Aktif di Web</p>
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-500">Pendaftar Masuk</span>
                      <div className="p-2.5 bg-amber-100 text-amber-900 rounded-xl">
                        <Users className="w-5 h-5" />
                      </div>
                    </div>
                    <div className="mt-3">
                      <p className="text-3xl font-black text-slate-900">{registrations.length}</p>
                      <p className="text-[11px] text-amber-800 font-semibold mt-0.5">Formulir Online Masuk</p>
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-500">Dokumentasi Foto</span>
                      <div className="p-2.5 bg-blue-100 text-blue-800 rounded-xl">
                        <ImageIcon className="w-5 h-5" />
                      </div>
                    </div>
                    <div className="mt-3">
                      <p className="text-3xl font-black text-slate-900">{gallery.length}</p>
                      <p className="text-[11px] text-blue-700 font-semibold mt-0.5">Foto Kegiatan Belajar</p>
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-500">Status Akreditasi</span>
                      <div className="p-2.5 bg-purple-100 text-purple-800 rounded-xl">
                        <ShieldCheck className="w-5 h-5" />
                      </div>
                    </div>
                    <div className="mt-3">
                      <p className="text-xl font-black text-purple-900">RESMI BAN-PDM</p>
                      <p className="text-[11px] text-purple-700 font-semibold mt-0.5">NPSN: {pkbmInfo.npsn}</p>
                    </div>
                  </div>
                </div>

                {/* Quick 2 Column Preview */}
                <div className="grid lg:grid-cols-2 gap-6">
                  {/* Latest News */}
                  <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                        <Newspaper className="w-4 h-4 text-orange-600" />
                        <span>Berita Terbaru</span>
                      </h4>
                      <button
                        onClick={() => setActiveTab('news')}
                        className="text-xs font-bold text-orange-600 hover:underline"
                      >
                        Lihat Semua ({news.length})
                      </button>
                    </div>
                    <div className="space-y-3">
                      {news.slice(0, 3).map((item) => (
                        <div key={item.id} className="flex items-center gap-3 p-2.5 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors">
                          <img src={item.image} alt={item.title} className="w-14 h-14 rounded-xl object-cover shrink-0" />
                          <div className="flex-1 min-w-0">
                            <span className="text-[10px] font-bold text-orange-800 bg-orange-100 px-2 py-0.5 rounded">
                              {item.category}
                            </span>
                            <p className="font-bold text-xs text-slate-900 truncate mt-1">{item.title}</p>
                            <p className="text-[11px] text-slate-500">{item.date}</p>
                          </div>
                          <button
                            onClick={() => handleOpenEditNews(item)}
                            className="p-2 rounded-xl bg-white text-slate-700 hover:text-orange-700 border border-slate-200"
                            title="Edit"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Latest Registrations */}
                  <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                        <Users className="w-4 h-4 text-amber-600" />
                        <span>Pendaftar Masuk Terbaru</span>
                      </h4>
                      <button
                        onClick={() => setActiveTab('registrations')}
                        className="text-xs font-bold text-amber-700 hover:underline"
                      >
                        Kelola ({registrations.length})
                      </button>
                    </div>
                    <div className="space-y-3">
                      {registrations.slice(0, 3).map((reg) => (
                        <div key={reg.id} className="p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-bold text-xs text-slate-900">{reg.namaLengkap}</p>
                              <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded font-mono font-bold">
                                {reg.registrationCode}
                              </span>
                            </div>
                            <p className="text-[11px] text-orange-700 font-semibold">{reg.pilihanProgram}</p>
                            <p className="text-[10px] text-slate-500">Daftar: {reg.createdAt}</p>
                          </div>
                          <button
                            onClick={() => handleSendWhatsAppToStudent(reg)}
                            className="p-2 rounded-xl bg-orange-600 hover:bg-orange-600 text-white shadow-sm flex items-center gap-1 text-xs font-bold"
                            title="Hubungi via WhatsApp"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline text-[11px]">Chat</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: DATABASE SUPABASE CMS */}
            {activeTab === 'database' && <DatabaseCmsTab />}

            {/* TAB 2: NEWS CMS */}
            {activeTab === 'news' && (
              <div className="space-y-6 max-w-6xl mx-auto">
                {/* Header & Add Button */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
                  <div>
                    <h3 className="text-lg font-black text-slate-900">Kelola Berita & Pengumuman</h3>
                    <p className="text-xs text-slate-600">Buat artikel baru, unggah gambar kegiatan, atau edit postingan</p>
                  </div>
                  <button
                    onClick={handleOpenAddNews}
                    className="px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer self-start sm:self-auto"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Buat Postingan Baru</span>
                  </button>
                </div>

                {/* Filter and Search */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200">
                  <div className="flex flex-wrap gap-2 w-full md:w-auto">
                    {['Semua', 'Pengumuman Resmi', 'Kegiatan Vokasi', 'Akademik', 'Wirausaha Desa'].map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedNewsCategory(cat)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                          selectedNewsCategory === cat
                            ? 'bg-orange-600 text-white'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  <div className="relative w-full md:w-64">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Cari judul berita..."
                      value={newsSearch}
                      onChange={(e) => setNewsSearch(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-slate-50 border border-slate-200 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>

                {/* News Items List */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {news
                    .filter((item) => {
                      const matchCat = selectedNewsCategory === 'Semua' || item.category === selectedNewsCategory;
                      const matchQuery = item.title.toLowerCase().includes(newsSearch.toLowerCase()) ||
                                         item.summary.toLowerCase().includes(newsSearch.toLowerCase());
                      return matchCat && matchQuery;
                    })
                    .map((item) => (
                      <div
                        key={item.id}
                        className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between group hover:shadow-md transition-all"
                      >
                        <div>
                          <div className="relative h-44 overflow-hidden">
                            <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            <div className="absolute top-3 left-3 flex gap-1.5">
                              <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-bold bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow">
                                {item.category}
                              </span>
                              {item.featured && (
                                <span className="px-2 py-0.5 rounded-lg text-[10px] font-black bg-amber-400 text-slate-950 shadow">
                                  Unggulan
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="p-5 space-y-2">
                            <div className="flex items-center gap-2 text-slate-400 text-[11px]">
                              <Calendar className="w-3.5 h-3.5 text-orange-600" />
                              <span>{item.date}</span>
                              <span>•</span>
                              <span>{item.author}</span>
                            </div>
                            <h4 className="font-extrabold text-sm sm:text-base text-slate-900 line-clamp-2 leading-snug">
                              {item.title}
                            </h4>
                            <p className="text-slate-600 text-xs line-clamp-3 leading-relaxed">
                              {item.summary}
                            </p>
                          </div>
                        </div>

                        <div className="px-5 pb-5 pt-2 flex items-center justify-between border-t border-slate-100">
                          <span className="text-[11px] text-slate-500 font-medium">
                            {item.content.length} Paragraf
                          </span>
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => handleOpenEditNews(item)}
                              className="p-2 rounded-xl bg-slate-100 hover:bg-orange-100 text-slate-700 hover:text-orange-800 transition-colors"
                              title="Edit Postingan"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteNews(item.id, item.title)}
                              className="p-2 rounded-xl bg-slate-100 hover:bg-red-100 text-slate-700 hover:text-red-700 transition-colors"
                              title="Hapus Berita"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* TAB 3: REGISTRATIONS MANAGEMENT */}
            {activeTab === 'registrations' && (
              <div className="space-y-6 max-w-6xl mx-auto">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
                  <div>
                    <h3 className="text-lg font-black text-slate-900">Data Pendaftar Warga Belajar Baru (PWBB)</h3>
                    <p className="text-xs text-slate-600">Kelola formulir masuk, ubah status verifikasi, dan hubungi calon siswa</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleExportCSV}
                      className="px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                      <span>Export Data (CSV / Excel)</span>
                    </button>
                  </div>
                </div>

                {/* Filters */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200">
                  <div className="flex flex-wrap items-center gap-2">
                    <select
                      value={regFilterProgram}
                      onChange={(e) => setRegFilterProgram(e.target.value)}
                      className="px-3 py-2 rounded-xl text-xs font-bold bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none"
                    >
                      <option value="Semua">Semua Program</option>
                      <option value="Paket A">Paket A (Setara SD)</option>
                      <option value="Paket B">Paket B (Setara SMP)</option>
                      <option value="Paket C">Paket C (Setara SMA)</option>
                    </select>

                    <select
                      value={regFilterStatus}
                      onChange={(e) => setRegFilterStatus(e.target.value)}
                      className="px-3 py-2 rounded-xl text-xs font-bold bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none"
                    >
                      <option value="Semua">Semua Status</option>
                      <option value="Menunggu Verifikasi">Menunggu Verifikasi</option>
                      <option value="Terverifikasi">Terverifikasi</option>
                      <option value="Diterima">Diterima</option>
                      <option value="Dihubungi">Dihubungi</option>
                    </select>
                  </div>

                  <div className="relative w-full md:w-64">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Cari nama, NIK, No WA..."
                      value={regSearch}
                      onChange={(e) => setRegSearch(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-slate-50 border border-slate-200 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>

                {/* Registrations Table */}
                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-700">
                      <thead className="bg-slate-100 text-slate-900 uppercase font-black tracking-wider text-[11px] border-b border-slate-200">
                        <tr>
                          <th className="py-3.5 px-4">Kode & Tanggal</th>
                          <th className="py-3.5 px-4">Nama Lengkap & NIK</th>
                          <th className="py-3.5 px-4">Program Pilihan</th>
                          <th className="py-3.5 px-4">Berkas (KK/Ijazah/KTP)</th>
                          <th className="py-3.5 px-4">Kontak WhatsApp</th>
                          <th className="py-3.5 px-4">Status</th>
                          <th className="py-3.5 px-4 text-right">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredRegistrations.map((student) => (
                          <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                            <td className="py-3.5 px-4 font-mono">
                              <p className="font-bold text-slate-900">{student.registrationCode}</p>
                              <p className="text-[10px] text-slate-400">{student.createdAt}</p>
                            </td>
                            <td className="py-3.5 px-4">
                              <p className="font-bold text-slate-900">{student.namaLengkap}</p>
                              <p className="text-[11px] text-slate-500 font-mono">NIK: {student.nik}</p>
                            </td>
                            <td className="py-3.5 px-4">
                              <span className="font-bold text-orange-800 bg-orange-50 px-2.5 py-1 rounded-lg border border-orange-200">
                                {student.pilihanProgram}
                              </span>
                            </td>
                            <td className="py-3.5 px-4">
                              <div className="flex flex-wrap items-center gap-1.5">
                                <span
                                  className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded text-[10px] font-extrabold border ${
                                    student.dokumenKK
                                      ? 'bg-orange-50 text-orange-800 border-orange-300'
                                      : 'bg-rose-50 text-rose-700 border-rose-200'
                                  }`}
                                  title={student.dokumenKK ? `KK: ${student.namaFileKK || 'Terunggah'}` : 'KK: Belum diunggah'}
                                >
                                  KK {student.dokumenKK ? '✓' : '✕'}
                                </span>
                                <span
                                  className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded text-[10px] font-extrabold border ${
                                    student.dokumenIjazah
                                      ? 'bg-orange-50 text-orange-800 border-orange-300'
                                      : 'bg-rose-50 text-rose-700 border-rose-200'
                                  }`}
                                  title={student.dokumenIjazah ? `Ijazah: ${student.namaFileIjazah || 'Terunggah'}` : 'Ijazah: Belum diunggah'}
                                >
                                  Ijazah {student.dokumenIjazah ? '✓' : '✕'}
                                </span>
                                {student.dokumenKTP ? (
                                  <span
                                    className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-800 border border-blue-200"
                                    title={`KTP: ${student.namaFileKTP || 'Terunggah'}`}
                                  >
                                    KTP ✓
                                  </span>
                                ) : (
                                  <span
                                    className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded text-[10px] text-slate-400 bg-slate-100"
                                    title="KTP opsional"
                                  >
                                    KTP -
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="py-3.5 px-4">
                              <p className="font-bold text-slate-800">{student.noWhatsapp}</p>
                              <p className="text-[10px] text-slate-500 truncate max-w-[150px]">{student.alamatLengkap}</p>
                            </td>
                            <td className="py-3.5 px-4">
                              <select
                                value={student.status}
                                onChange={(e) => {
                                  updateRegistrationStatus(student.id, e.target.value as RegisteredStudent['status']);
                                  showToast(`Status ${student.namaLengkap} diubah menjadi ${e.target.value}`);
                                }}
                                className={`px-2.5 py-1 rounded-lg font-bold text-[11px] border cursor-pointer ${
                                  student.status === 'Diterima'
                                    ? 'bg-orange-100 text-orange-800 border-orange-300'
                                    : student.status === 'Terverifikasi'
                                    ? 'bg-blue-100 text-blue-800 border-blue-300'
                                    : student.status === 'Dihubungi'
                                    ? 'bg-purple-100 text-purple-800 border-purple-300'
                                    : 'bg-amber-100 text-amber-800 border-amber-300'
                                }`}
                              >
                                <option value="Menunggu Verifikasi">Menunggu Verifikasi</option>
                                <option value="Terverifikasi">Terverifikasi</option>
                                <option value="Diterima">Diterima</option>
                                <option value="Dihubungi">Dihubungi</option>
                              </select>
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => setSelectedStudentDetail(student)}
                                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                                  title="Lihat Detail Lengkap"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleSendWhatsAppToStudent(student)}
                                  className="p-2 rounded-xl bg-orange-600 hover:bg-orange-600 text-white transition-colors"
                                  title="Chat WhatsApp"
                                >
                                  <MessageCircle className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => {
                                    if (confirm(`Hapus data pendaftaran ${student.namaLengkap}?`)) {
                                      deleteRegistration(student.id);
                                      showToast('Data pendaftar dihapus');
                                    }
                                  }}
                                  className="p-2 rounded-xl bg-slate-100 hover:bg-red-100 text-slate-700 hover:text-red-700 transition-colors"
                                  title="Hapus Data"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {filteredRegistrations.length === 0 && (
                    <div className="p-8 text-center text-slate-500">
                      <p className="font-semibold text-sm">Tidak ada data pendaftar yang sesuai filter.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 4: GALLERY MANAGEMENT */}
            {activeTab === 'gallery' && (
              <div className="space-y-6 max-w-6xl mx-auto">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
                  <div>
                    <h3 className="text-lg font-black text-slate-900">Kelola Galeri & Foto Kegiatan</h3>
                    <p className="text-xs text-slate-600">Dokumentasi kegiatan belajar, pelatihan vokasi, dan ujian kesetaraan</p>
                  </div>
                  <button
                    onClick={() => setIsAddingGallery(true)}
                    className="px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer self-start sm:self-auto"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Upload Foto Baru</span>
                  </button>
                </div>

                {/* Gallery Grid */}
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {gallery.map((item) => (
                    <div key={item.id} className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden group flex flex-col justify-between">
                      <div>
                        <div className="relative h-48 overflow-hidden">
                          <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          <div className="absolute top-3 left-3">
                            <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-bold bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow">
                              {item.category}
                            </span>
                          </div>
                        </div>

                        <div className="p-5 space-y-2">
                          <span className="text-[11px] text-slate-400 flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-orange-600" />
                            {item.date}
                          </span>
                          <h4 className="font-extrabold text-sm text-slate-900 leading-snug">
                            {item.title}
                          </h4>
                          {item.description && (
                            <p className="text-slate-600 text-xs leading-relaxed line-clamp-2">
                              {item.description}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="px-5 pb-5 pt-2 flex items-center justify-end border-t border-slate-100">
                        <button
                          onClick={() => handleDeleteGallery(item.id)}
                          className="p-2 rounded-xl bg-slate-100 hover:bg-red-100 text-slate-700 hover:text-red-700 transition-colors flex items-center gap-1.5 text-xs font-bold"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Hapus Foto</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: BANNER BERGANTI-GANTI (HERO SLIDER) */}
            {activeTab === 'heroslides' && (
              <div className="max-w-5xl mx-auto">
                <HeroSlidesCmsTab onShowToast={showToast} />
              </div>
            )}

            {/* TAB: DATA PERSONALIA (PENDIRI, YAYASAN, GURU, TENDIK) */}
            {activeTab === 'personalia' && (
              <div className="max-w-6xl mx-auto">
                <PersonaliaCmsTab onShowToast={showToast} />
              </div>
            )}

            {/* TAB 5: TENTANG PKBM & VISI MISI */}
            {activeTab === 'about' && (
              <div className="max-w-5xl mx-auto">
                <AboutCmsTab onShowToast={showToast} />
              </div>
            )}

            {/* TAB 6: PROGRAM BELAJAR */}
            {activeTab === 'programs' && (
              <div className="max-w-6xl mx-auto">
                <ProgramsCmsTab onShowToast={showToast} />
              </div>
            )}

            {/* TAB 7: PROGRAM VOKASI */}
            {activeTab === 'vokasi' && (
              <div className="max-w-6xl mx-auto">
                <VokasiCmsTab onShowToast={showToast} />
              </div>
            )}

            {/* TAB 8: FAQ TANYA JAWAB */}
            {activeTab === 'faqs' && (
              <div className="max-w-5xl mx-auto">
                <FaqCmsTab onShowToast={showToast} />
              </div>
            )}

            {/* TAB 9: SETTINGS & SCHOOL INFO */}
            {activeTab === 'settings' && (
              <div className="space-y-6 max-w-4xl mx-auto">

                {/* Section Pengaturan Logo Lembaga */}
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-5">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
                    <div>
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-800 text-[10px] font-black uppercase tracking-wider mb-1">
                        <ImageIcon className="w-3 h-3 text-orange-700" />
                        <span>Identitas Visual & Branding</span>
                      </div>
                      <h3 className="text-lg font-black text-slate-900">Logo Lembaga PKBM</h3>
                      <p className="text-xs text-slate-600">Logo akan otomatis tampil di Header utama website, Footer, dan Dokumen resmi</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsLogoModalOpen(true)}
                      className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 font-black text-xs shadow-md flex items-center gap-2 transition-all cursor-pointer border border-amber-200"
                    >
                      <Camera className="w-4 h-4 text-slate-950" />
                      <span>Buka Panel Ganti Logo</span>
                    </button>
                  </div>

                  <div className="grid sm:grid-cols-12 gap-6 items-center">
                    {/* Logo Preview Badge */}
                    <div className="sm:col-span-4 flex flex-col items-center justify-center p-5 rounded-2xl bg-gradient-to-br from-[#011c0e] via-[#023119] to-slate-950 border-2 border-amber-400/50 text-white text-center space-y-2 relative overflow-hidden shadow-md">
                      <div
                        className={`w-20 h-20 bg-gradient-to-br from-amber-50 via-white to-amber-100 p-2 shadow-2xl border-2 border-amber-400 flex items-center justify-center overflow-hidden ${
                          pkbmInfo.logoShape === 'circle' ? 'rounded-full' : pkbmInfo.logoShape === 'square' ? 'rounded-xl' : 'rounded-2xl'
                        }`}
                      >
                        {pkbmInfo.logoUrl ? (
                          <img
                            src={pkbmInfo.logoUrl}
                            alt="Logo PKBM"
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <div className="w-full h-full rounded-xl bg-gradient-to-br from-[#c2410c] to-[#431407] flex items-center justify-center text-white font-bold">
                            <BookOpen className="w-8 h-8 text-amber-300" />
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="text-xs font-black uppercase text-amber-300">
                          {pkbmInfo.logoUrl ? 'Logo Kustom Aktif' : 'Lambang Standar (Buku Emas)'}
                        </p>
                        <p className="text-[10px] text-orange-200/80 font-mono">
                          Format: {pkbmInfo.logoShape === 'circle' ? 'Lingkaran' : pkbmInfo.logoShape === 'square' ? 'Persegi' : 'Sudut Membulat'}
                        </p>
                      </div>
                    </div>

                    {/* Logo Quick Management */}
                    <div className="sm:col-span-8 space-y-3">
                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                        <label className="block text-xs font-bold text-slate-800">
                          Pilihan Cepat Upload / Ganti Logo
                        </label>
                        
                        <div className="flex flex-wrap items-center gap-2">
                          <label className="px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold flex items-center gap-2 cursor-pointer transition-colors shadow-sm">
                            <Upload className="w-3.5 h-3.5" />
                            <span>Upload File Logo (PNG/JPG/SVG)</span>
                            <input
                              type="file"
                              accept="image/png, image/jpeg, image/jpg, image/svg+xml, image/webp"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  if (file.size > 5 * 1024 * 1024) {
                                    alert('Ukuran file maksimal 5MB');
                                    return;
                                  }
                                  const reader = new FileReader();
                                  reader.onload = (evt) => {
                                    const base64 = evt.target?.result as string;
                                    if (base64) {
                                      updatePKBMInfo({ logoUrl: base64 });
                                      setSettingsForm((prev) => ({ ...prev, logoUrl: base64 }));
                                      showToast('✅ Logo lembaga berhasil diperbarui!');
                                    }
                                  };
                                  reader.readAsDataURL(file);
                                }
                              }}
                            />
                          </label>

                          <button
                            type="button"
                            onClick={() => setIsLogoModalOpen(true)}
                            className="px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold border border-slate-300 transition-colors cursor-pointer flex items-center gap-1.5"
                          >
                            <LinkIcon className="w-3.5 h-3.5 text-orange-700" />
                            <span>Tautan & Preset Logo</span>
                          </button>

                          {pkbmInfo.logoUrl && (
                            <button
                              type="button"
                              onClick={() => {
                                updatePKBMInfo({ logoUrl: '' });
                                setSettingsForm((prev) => ({ ...prev, logoUrl: '' }));
                                showToast('Logo dikembalikan ke lambang default.');
                              }}
                              className="px-3.5 py-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold border border-red-200 transition-colors cursor-pointer flex items-center gap-1.5"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Reset Logo</span>
                            </button>
                          )}
                        </div>

                        {/* Shape Toggle Buttons */}
                        <div className="flex items-center gap-2 pt-2 border-t border-slate-200 text-xs">
                          <span className="font-bold text-slate-700 text-[11px]">Bentuk Bingkai:</span>
                          {(['rounded', 'circle', 'square'] as const).map((shape) => (
                            <button
                              key={shape}
                              type="button"
                              onClick={() => {
                                updatePKBMInfo({ logoShape: shape });
                                setSettingsForm((prev) => ({ ...prev, logoShape: shape }));
                                showToast(`Bentuk bingkai logo diubah.`);
                              }}
                              className={`px-3 py-1 rounded-lg text-[11px] font-bold capitalize transition-colors cursor-pointer ${
                                (pkbmInfo.logoShape || 'rounded') === shape
                                  ? 'bg-orange-700 text-white shadow-xs'
                                  : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-300'
                              }`}
                            >
                              {shape === 'rounded' ? 'Sudut Bulat' : shape === 'circle' ? 'Lingkaran' : 'Persegi'}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Form Informasi Lembaga */}
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                  <div className="border-b border-slate-100 pb-4">
                    <h3 className="text-lg font-black text-slate-900">Informasi & Kontak Lembaga</h3>
                    <p className="text-xs text-slate-600">Perbarui identitas resmi, alamat, NPSN, dan hotline WhatsApp</p>
                  </div>

                  <form onSubmit={handleSaveSettings} className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1">Nama Lembaga</label>
                        <input
                          type="text"
                          value={settingsForm.name}
                          onChange={(e) => setSettingsForm({ ...settingsForm, name: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-orange-500 font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1">NPSN (Nomor Pokok Sekolah Nasional)</label>
                        <input
                          type="text"
                          value={settingsForm.npsn}
                          onChange={(e) => setSettingsForm({ ...settingsForm, npsn: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-orange-500 font-mono font-bold"
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1">Hotline WhatsApp (Format Angka)</label>
                        <input
                          type="text"
                          value={settingsForm.whatsappNumber}
                          onChange={(e) => setSettingsForm({ ...settingsForm, whatsappNumber: e.target.value })}
                          placeholder="6285290655103"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-orange-500 font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1">Tampilan No. Telepon / WA</label>
                        <input
                          type="text"
                          value={settingsForm.phonePrimary}
                          onChange={(e) => setSettingsForm({ ...settingsForm, phonePrimary: e.target.value })}
                          placeholder="+62 852-9065-5103"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-orange-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1">Alamat Lengkap Lembaga</label>
                      <textarea
                        rows={2}
                        value={settingsForm.address}
                        onChange={(e) => setSettingsForm({ ...settingsForm, address: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-orange-500"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-xs font-bold text-slate-800 flex items-center gap-1.5">
                          <Navigation className="w-3.5 h-3.5 text-orange-600" />
                          <span>Tautan Google Maps / Geolocation URL</span>
                        </label>
                        {settingsForm.mapsUrl && (
                          <a
                            href={settingsForm.mapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[11px] text-orange-600 hover:underline font-bold inline-flex items-center gap-1"
                          >
                            <span>Tes Buka Peta</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                      <input
                        type="url"
                        value={settingsForm.mapsUrl || ''}
                        onChange={(e) => setSettingsForm({ ...settingsForm, mapsUrl: e.target.value })}
                        placeholder="https://maps.app.goo.gl/..."
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-orange-500 font-mono"
                      />
                      <p className="text-[11px] text-slate-500 mt-1">
                        Titik GPS saat ini: -7.25741, 110.31961 (PKBM BINA INSANI Sumowono)
                      </p>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1">Email Resmi</label>
                        <input
                          type="email"
                          value={settingsForm.email}
                          onChange={(e) => setSettingsForm({ ...settingsForm, email: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-orange-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1">Status Akreditasi</label>
                        <input
                          type="text"
                          value={settingsForm.accreditation}
                          onChange={(e) => setSettingsForm({ ...settingsForm, accreditation: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-orange-500"
                        />
                      </div>
                    </div>

                    {/* Running Banner Pengumuman */}
                    <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-black text-amber-900 flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                          <span>Teks Banner Pengumuman Berjalan (Top Bar)</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-amber-900">
                          <input
                            type="checkbox"
                            checked={settingsForm.announcementActive}
                            onChange={(e) => setSettingsForm({ ...settingsForm, announcementActive: e.target.checked })}
                            className="rounded text-amber-600 focus:ring-amber-500 w-4 h-4"
                          />
                          <span>Aktifkan Banner</span>
                        </label>
                      </div>
                      <input
                        type="text"
                        value={settingsForm.announcementText || ''}
                        onChange={(e) => setSettingsForm({ ...settingsForm, announcementText: e.target.value })}
                        placeholder="Contoh: Pendaftaran Warga Belajar Baru PWBB 2026/2027 Resmi Dibuka..."
                        className="w-full px-3.5 py-2.5 rounded-xl border border-amber-300 bg-white text-xs text-slate-900 focus:outline-none focus:border-orange-500 font-medium"
                      />
                    </div>

                    <div className="flex justify-end pt-2">
                      <button
                        type="submit"
                        className="px-6 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-xs shadow-md transition-all cursor-pointer flex items-center gap-2"
                      >
                        <Check className="w-4 h-4" />
                        <span>Simpan Perubahan Informasi</span>
                      </button>
                    </div>
                  </form>
                </div>

                {/* Change Admin Password */}
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                  <div className="border-b border-slate-100 pb-3">
                    <h3 className="text-base font-black text-slate-900">Ubah Password Admin</h3>
                    <p className="text-xs text-slate-600">Pastikan menggunakan kata sandi yang aman untuk pengelola</p>
                  </div>

                  <form onSubmit={handleChangePassword} className="space-y-4">
                    <div className="grid sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1">Password Lama</label>
                        <input
                          type="password"
                          required
                          value={oldPassword}
                          onChange={(e) => setOldPassword(e.target.value)}
                          placeholder="Password saat ini"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-orange-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1">Password Baru</label>
                        <input
                          type="password"
                          required
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Minimal 6 karakter"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-orange-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1">Ulangi Password Baru</label>
                        <input
                          type="password"
                          required
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Konfirmasi password"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-orange-500"
                        />
                      </div>
                    </div>

                    {passwordError && (
                      <p className="text-xs text-red-600 font-semibold">{passwordError}</p>
                    )}

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs transition-colors cursor-pointer"
                      >
                        Perbarui Password Admin
                      </button>
                    </div>
                  </form>
                </div>

                {/* Backup, Export & Reset */}
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                  <div className="border-b border-slate-100 pb-3">
                    <h3 className="text-base font-black text-slate-900">Backup & Pemulihan Data Website</h3>
                    <p className="text-xs text-slate-600">Simpan cadangan data berita, galeri, dan pendaftar ke file JSON</p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      onClick={() => {
                        const json = exportDataJSON();
                        const blob = new Blob([json], { type: 'application/json' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `backup_pkbm_binainsani_${new Date().toISOString().slice(0, 10)}.json`;
                        a.click();
                        URL.revokeObjectURL(url);
                        showToast('File backup JSON berhasil diunduh!');
                      }}
                      className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center gap-2 border border-slate-300 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5 text-orange-700" />
                      <span>Download Backup (JSON)</span>
                    </button>

                    <button
                      onClick={() => {
                        if (confirm('Kembalikan seluruh data ke bawaan awal? Data postingan kustom akan direset.')) {
                          resetToDefaultData();
                          showToast('Data berhasil dikembalikan ke standar awal.');
                        }
                      }}
                      className="px-4 py-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs flex items-center gap-2 border border-red-200 transition-colors"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Reset ke Data Bawaan</span>
                    </button>
                  </div>
                </div>

              </div>
            )}

          </main>
        </div>
      </motion.div>

      {/* POSTING / EDIT NEWS MODAL */}
      {isEditingNews && (
        <div className="fixed inset-0 z-60 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white w-full max-w-3xl max-h-[92vh] rounded-3xl shadow-2xl border border-slate-200 overflow-y-auto p-6 sm:p-8 relative space-y-6"
          >
            <button
              onClick={() => setIsEditingNews(false)}
              className="absolute top-5 right-5 p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-b border-slate-100 pb-4">
              <span className="text-[10px] font-black uppercase tracking-wider bg-orange-100 text-orange-900 px-3 py-1 rounded-full">
                {editingNewsId ? 'Edit Postingan' : 'Buat Berita Baru'}
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-2">
                {editingNewsId ? 'Edit Konten Berita' : 'Publikasi Berita & Pengumuman Baru'}
              </h3>
              <p className="text-xs text-slate-600">
                Lengkapi formulir di bawah ini. Artikel akan langsung muncul di halaman depan website.
              </p>
            </div>

            <form onSubmit={handleSaveNews} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Judul Berita / Pengumuman <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newsFormData.title}
                  onChange={(e) => setNewsFormData({ ...newsFormData, title: e.target.value })}
                  placeholder="Contoh: Pembukaan Pendaftaran Warga Belajar Baru PWBB 2026/2027"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-bold focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                />
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Kategori</label>
                  <select
                    value={newsFormData.category}
                    onChange={(e) => setNewsFormData({ ...newsFormData, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold bg-slate-50 focus:outline-none focus:border-orange-500"
                  >
                    <option value="Pengumuman Resmi">Pengumuman Resmi</option>
                    <option value="Kegiatan Vokasi">Kegiatan Vokasi</option>
                    <option value="Akademik">Akademik Kesetaraan</option>
                    <option value="Prestasi Warga Belajar">Prestasi Warga Belajar</option>
                    <option value="Wirausaha Desa">Wirausaha Desa</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Tanggal Terbit</label>
                  <input
                    type="text"
                    value={newsFormData.date}
                    onChange={(e) => setNewsFormData({ ...newsFormData, date: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Nama Penulis / Redaksi</label>
                  <input
                    type="text"
                    value={newsFormData.author}
                    onChange={(e) => setNewsFormData({ ...newsFormData, author: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              {/* Cover Image Upload & Selection */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <label className="block text-xs font-bold text-slate-800">
                  Foto Sampul / Gambar Berita
                </label>
                
                <div className="grid sm:grid-cols-12 gap-4 items-center">
                  <div className="sm:col-span-4 h-28 rounded-xl overflow-hidden border border-slate-300 bg-white relative">
                    <img src={newsFormData.image} alt="Preview" className="w-full h-full object-cover" />
                    <span className="absolute bottom-1 right-1 bg-black/70 text-white text-[9px] px-1.5 py-0.5 rounded">
                      Preview Foto
                    </span>
                  </div>

                  <div className="sm:col-span-8 space-y-2">
                    {/* Option A: Upload file from disk */}
                    <div>
                      <label className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-orange-600 text-white text-xs font-bold cursor-pointer hover:bg-orange-700 transition-colors shadow-sm">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload Foto dari HP / Laptop</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageFileUpload(e, 'news')}
                          className="hidden"
                        />
                      </label>
                    </div>

                    {/* Option B: Direct URL Input */}
                    <div className="relative">
                      <LinkIcon className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={newsFormData.image}
                        onChange={(e) => setNewsFormData({ ...newsFormData, image: e.target.value })}
                        placeholder="Atau tempel Link URL Foto..."
                        className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-300 text-xs bg-white text-slate-800 focus:outline-none focus:border-orange-500"
                      />
                    </div>

                    {/* Preset Badges */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      <span className="text-[10px] text-slate-500 font-semibold">Pilihan Cepat:</span>
                      {imagePresets.slice(0, 4).map((p, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setNewsFormData({ ...newsFormData, image: p.url })}
                          className="text-[10px] bg-white hover:bg-orange-50 text-slate-700 hover:text-orange-800 border border-slate-200 px-2 py-0.5 rounded-lg transition-colors cursor-pointer"
                        >
                          {p.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Ringkasan Berita (Lead / Summary) <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={2}
                  required
                  value={newsFormData.summary}
                  onChange={(e) => setNewsFormData({ ...newsFormData, summary: e.target.value })}
                  placeholder="Ringkasan 1-2 kalimat untuk tampilan cuplikan kartu berita..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Isi Lengkap Berita (Pisahkan antar paragraf dengan enter dua kali)
                </label>
                <textarea
                  rows={6}
                  value={newsFormData.content}
                  onChange={(e) => setNewsFormData({ ...newsFormData, content: e.target.value })}
                  placeholder="Tuliskan isi berita lengkap di sini..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-orange-500 leading-relaxed font-sans"
                />
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-800">
                  <input
                    type="checkbox"
                    checked={newsFormData.featured}
                    onChange={(e) => setNewsFormData({ ...newsFormData, featured: e.target.checked })}
                    className="rounded text-orange-600 focus:ring-orange-500 w-4 h-4"
                  />
                  <span>Tandai sebagai Berita Utama (Featured)</span>
                </label>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditingNews(false)}
                    className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-xs shadow-md transition-all cursor-pointer flex items-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    <span>{editingNewsId ? 'Perbarui Berita' : 'Tayangkan Berita Sekarang'}</span>
                  </button>
                </div>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* ADD GALLERY PHOTO MODAL */}
      {isAddingGallery && (
        <div className="fixed inset-0 z-60 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 p-6 sm:p-8 relative space-y-5"
          >
            <button
              onClick={() => setIsAddingGallery(false)}
              className="absolute top-5 right-5 p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-lg font-black text-slate-900">Upload Foto Kegiatan Baru</h3>
              <p className="text-xs text-slate-600">Dokumentasikan aktivitas warga belajar & tutor PKBM</p>
            </div>

            <form onSubmit={handleSaveGallery} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Judul / Nama Kegiatan <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  required
                  value={galleryFormData.title}
                  onChange={(e) => setGalleryFormData({ ...galleryFormData, title: e.target.value })}
                  placeholder="Contoh: Praktik Pengolahan Kopi Sumowono"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Kategori</label>
                  <select
                    value={galleryFormData.category}
                    onChange={(e) => setGalleryFormData({ ...galleryFormData, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold bg-slate-50"
                  >
                    <option value="Akademik Kesetaraan">Akademik Kesetaraan</option>
                    <option value="Pelatihan Vokasi">Pelatihan Vokasi</option>
                    <option value="Wirausaha Desa">Wirausaha Desa</option>
                    <option value="Tata Boga & Kuliner">Tata Boga & Kuliner</option>
                    <option value="Kelulusan Resmi">Kelulusan Resmi</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Tanggal</label>
                  <input
                    type="text"
                    value={galleryFormData.date}
                    onChange={(e) => setGalleryFormData({ ...galleryFormData, date: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                </div>
              </div>

              {/* Photo Input */}
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <label className="block text-xs font-bold text-slate-800">File Foto</label>
                <div className="h-32 rounded-xl overflow-hidden bg-white border border-slate-300">
                  <img src={galleryFormData.image} alt="Preview" className="w-full h-full object-cover" />
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <label className="px-3 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold cursor-pointer flex items-center gap-1.5 shadow-sm">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Pilih Foto</span>
                    <input type="file" accept="image/*" onChange={(e) => handleImageFileUpload(e, 'gallery')} className="hidden" />
                  </label>
                  <input
                    type="text"
                    value={galleryFormData.image}
                    onChange={(e) => setGalleryFormData({ ...galleryFormData, image: e.target.value })}
                    placeholder="Atau URL Foto..."
                    className="flex-1 px-3 py-1.5 rounded-xl border border-slate-300 text-xs bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Deskripsi Singkat (Opsional)</label>
                <textarea
                  rows={2}
                  value={galleryFormData.description}
                  onChange={(e) => setGalleryFormData({ ...galleryFormData, description: e.target.value })}
                  placeholder="Keterangan singkat tentang kegiatan..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddingGallery(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-extrabold shadow"
                >
                  Simpan ke Galeri
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* STUDENT REGISTRATION DETAIL MODAL */}
      {selectedStudentDetail && (
        <div className="fixed inset-0 z-60 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl border border-slate-200 p-6 sm:p-8 relative space-y-4"
          >
            <button
              onClick={() => setSelectedStudentDetail(null)}
              className="absolute top-5 right-5 p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-b border-slate-100 pb-3 pr-8">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-black bg-orange-100 text-orange-900 px-2 py-0.5 rounded">
                  {selectedStudentDetail.registrationCode}
                </span>
                <span className="text-xs text-slate-400">• Terdaftar: {selectedStudentDetail.createdAt}</span>
              </div>
              <h3 className="text-xl font-black text-slate-900 mt-1">
                {selectedStudentDetail.namaLengkap}
              </h3>
              <p className="text-xs font-bold text-orange-600">
                {selectedStudentDetail.pilihanProgram} • Jenis: {selectedStudentDetail.jenisPendaftaran || 'Baru'}
              </p>
            </div>

            {/* Photo & Main Overview */}
            {selectedStudentDetail.passPhoto && (
              <div className="flex items-center gap-4 p-3 bg-orange-50 rounded-2xl border border-orange-200">
                <img
                  src={selectedStudentDetail.passPhoto}
                  alt="Pass Photo"
                  className="w-16 h-20 rounded-xl object-cover border-2 border-orange-600 shadow-sm shrink-0"
                />
                <div className="text-xs space-y-0.5">
                  <p className="font-bold text-orange-950">Pass Photo Calon Siswa Terlampir</p>
                  <p className="text-slate-600 text-[11px]">Foto formal tersimpan di arsip pendaftaran digital.</p>
                </div>
              </div>
            )}

            <div className="space-y-4 text-xs text-slate-700">
              {/* Section 1: Minat & Pendaftaran */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                <p className="font-bold text-slate-900 text-xs border-b border-slate-200 pb-1">1. Program & Minat Siswa</p>
                <div className="grid sm:grid-cols-2 gap-2">
                  <p><span className="text-slate-400">Pendidikan Terakhir:</span> <strong>{selectedStudentDetail.pendidikanTerakhir || '-'}</strong></p>
                  <p><span className="text-slate-400">Hobi:</span> <strong>{selectedStudentDetail.hobi || '-'}</strong></p>
                  <p><span className="text-slate-400">Cita-Cita:</span> <strong>{selectedStudentDetail.citaCita || '-'}</strong></p>
                </div>
              </div>

              {/* Section 2: Data Pribadi */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                <p className="font-bold text-slate-900 text-xs border-b border-slate-200 pb-1">2. Data Pribadi Calon Siswa</p>
                <div className="grid sm:grid-cols-2 gap-2">
                  <p><span className="text-slate-400">NIK:</span> <strong className="font-mono">{selectedStudentDetail.nik || '-'}</strong></p>
                  <p><span className="text-slate-400">Jenis Kelamin:</span> <strong>{selectedStudentDetail.jenisKelamin}</strong></p>
                  <p><span className="text-slate-400">Tempat, Tgl Lahir:</span> <strong>{selectedStudentDetail.tempatLahir || ''}, {selectedStudentDetail.tanggalLahir || selectedStudentDetail.tempatTanggalLahir}</strong></p>
                  <p><span className="text-slate-400">Agama:</span> <strong>{selectedStudentDetail.agama || 'Islam'}</strong></p>
                  <p><span className="text-slate-400">Kewarganegaraan:</span> <strong>{selectedStudentDetail.kewarganegaraan || 'WNI'} ({selectedStudentDetail.namaNegara || 'Indonesia'})</strong></p>
                  <p><span className="text-slate-400">Kebutuhan Khusus:</span> <strong>{selectedStudentDetail.kebutuhanKhusus || 'Tidak Ada'}</strong></p>
                </div>
              </div>

              {/* Section 3: Alamat & Kontak */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                <p className="font-bold text-slate-900 text-xs border-b border-slate-200 pb-1">3. Alamat & Kontak</p>
                <p><span className="text-slate-400">Alamat Lengkap:</span> <strong>{selectedStudentDetail.alamatLengkap || selectedStudentDetail.alamatJalan}</strong></p>
                <div className="grid sm:grid-cols-2 gap-2">
                  <p><span className="text-slate-400">No. HP / WhatsApp:</span> <strong className="font-bold text-orange-800">{selectedStudentDetail.noWhatsapp || selectedStudentDetail.nomorHp}</strong></p>
                  <p><span className="text-slate-400">Email:</span> <strong>{selectedStudentDetail.emailPribadi || '-'}</strong></p>
                  <p><span className="text-slate-400">Status Tempat Tinggal:</span> <strong>{selectedStudentDetail.tempatTinggal || '-'}</strong></p>
                  <p><span className="text-slate-400">Moda Transportasi:</span> <strong>{selectedStudentDetail.modaTransportasi || '-'}</strong></p>
                </div>
              </div>

              {/* Section 4: Data Orang Tua / Wali */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                <p className="font-bold text-slate-900 text-xs border-b border-slate-200 pb-1">4. Data Orang Tua & Wali</p>
                <div className="grid sm:grid-cols-2 gap-2">
                  <div>
                    <p className="font-semibold text-slate-800">Ayah Kandung:</p>
                    <p className="text-slate-600">{selectedStudentDetail.namaAyahKandung || selectedStudentDetail.namaOrangTuaWali} {selectedStudentDetail.tahunLahirAyah ? `(Lahir ${selectedStudentDetail.tahunLahirAyah})` : ''}</p>
                    <p className="text-slate-500 text-[11px]">Pendidikan: {selectedStudentDetail.pendidikanAyah || '-'} • Pekerjaan: {selectedStudentDetail.pekerjaanAyah || '-'} • Gaji: {selectedStudentDetail.penghasilanBulananAyah || '-'}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800">Ibu Kandung:</p>
                    <p className="text-slate-600">{selectedStudentDetail.namaIbuKandung || '-'} {selectedStudentDetail.tahunLahirIbu ? `(Lahir ${selectedStudentDetail.tahunLahirIbu})` : ''}</p>
                    <p className="text-slate-500 text-[11px]">Pendidikan: {selectedStudentDetail.pendidikanIbu || '-'} • Pekerjaan: {selectedStudentDetail.pekerjaanIbu || '-'} • Gaji: {selectedStudentDetail.penghasilanBulananIbu || '-'}</p>
                  </div>
                </div>
                {selectedStudentDetail.namaWali && (
                  <div className="pt-1 border-t border-slate-200">
                    <p className="font-semibold text-slate-800">Wali:</p>
                    <p className="text-slate-600">{selectedStudentDetail.namaWali} {selectedStudentDetail.tahunLahirWali ? `(Lahir ${selectedStudentDetail.tahunLahirWali})` : ''} • {selectedStudentDetail.pekerjaanWali || '-'}</p>
                  </div>
                )}
              </div>

              {/* Section 5: Periodik */}
              {(selectedStudentDetail.tinggiBadan || selectedStudentDetail.jarakKeSekolah) && (
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                  <p className="font-bold text-slate-900 text-xs border-b border-slate-200 pb-1">5. Data Periodik</p>
                  <div className="grid sm:grid-cols-3 gap-2">
                    <p><span className="text-slate-400">Tinggi / Berat:</span> <strong>{selectedStudentDetail.tinggiBadan || '-'} cm / {selectedStudentDetail.beratBadan || '-'} kg</strong></p>
                    <p><span className="text-slate-400">Jarak ke PKBM:</span> <strong>{selectedStudentDetail.jarakKeSekolah || '-'} km</strong></p>
                    <p><span className="text-slate-400">Waktu Tempuh:</span> <strong>{selectedStudentDetail.waktuTempuhKeSekolah || '-'} menit</strong></p>
                  </div>
                </div>
              )}

              {/* Section 6: Berkas Dokumen Persyaratan Digital */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
                  <p className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-orange-700" />
                    6. Berkas Dokumen Persyaratan Digital (Dapodik Kesetaraan)
                  </p>
                  <span className="text-[10px] font-semibold text-slate-500">
                    Format: JPG / PNG / PDF
                  </span>
                </div>

                <div className="grid sm:grid-cols-3 gap-3">
                  {/* Berkas KK */}
                  <div className={`p-3 rounded-xl border ${
                    selectedStudentDetail.dokumenKK ? 'bg-white border-orange-300' : 'bg-rose-50/60 border-rose-200'
                  }`}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[11px] font-black text-slate-900">Kartu Keluarga (KK)</span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        selectedStudentDetail.dokumenKK ? 'bg-orange-100 text-orange-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {selectedStudentDetail.dokumenKK ? 'Wajib: Terunggah' : 'Wajib: Belum'}
                      </span>
                    </div>

                    {selectedStudentDetail.dokumenKK ? (
                      <div className="space-y-2 mt-2">
                        <div className="h-24 bg-slate-100 rounded-lg overflow-hidden border border-slate-200 flex items-center justify-center relative">
                          {selectedStudentDetail.dokumenKK.startsWith('data:image') || selectedStudentDetail.dokumenKK.includes('unsplash') ? (
                            <img
                              src={selectedStudentDetail.dokumenKK}
                              alt="KK"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="text-center font-bold text-red-600 text-xs">
                              <span className="block text-lg">📄</span> Dokumen PDF
                            </div>
                          )}
                        </div>
                        <p className="text-[10px] font-medium text-slate-700 truncate" title={selectedStudentDetail.namaFileKK}>
                          {selectedStudentDetail.namaFileKK || 'Berkas_KK.jpg'}
                        </p>
                        <div className="flex items-center gap-1.5 pt-1">
                          <button
                            type="button"
                            onClick={() =>
                              setAdminPreviewDoc({
                                title: `Kartu Keluarga - ${selectedStudentDetail.namaLengkap}`,
                                url: selectedStudentDetail.dokumenKK || '',
                                isPdf:
                                  selectedStudentDetail.namaFileKK?.toLowerCase().endsWith('.pdf') ||
                                  selectedStudentDetail.dokumenKK?.startsWith('data:application/pdf') ||
                                  false
                              })
                            }
                            className="flex-1 py-1.5 px-2 bg-orange-100 hover:bg-orange-200 text-orange-800 text-[11px] font-bold rounded-lg flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <Eye className="w-3 h-3" />
                            <span>Lihat</span>
                          </button>
                          <a
                            href={selectedStudentDetail.dokumenKK}
                            download={selectedStudentDetail.namaFileKK || `KK_${selectedStudentDetail.namaLengkap}.jpg`}
                            className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg cursor-pointer"
                            title="Unduh Berkas KK"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </div>
                    ) : (
                      <p className="text-[11px] text-rose-600 mt-2">Calon siswa belum mengunggah Kartu Keluarga.</p>
                    )}
                  </div>

                  {/* Berkas Ijazah */}
                  <div className={`p-3 rounded-xl border ${
                    selectedStudentDetail.dokumenIjazah ? 'bg-white border-orange-300' : 'bg-rose-50/60 border-rose-200'
                  }`}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[11px] font-black text-slate-900">Ijazah / SKL</span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        selectedStudentDetail.dokumenIjazah ? 'bg-orange-100 text-orange-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {selectedStudentDetail.dokumenIjazah ? 'Wajib: Terunggah' : 'Wajib: Belum'}
                      </span>
                    </div>

                    {selectedStudentDetail.dokumenIjazah ? (
                      <div className="space-y-2 mt-2">
                        <div className="h-24 bg-slate-100 rounded-lg overflow-hidden border border-slate-200 flex items-center justify-center relative">
                          {selectedStudentDetail.dokumenIjazah.startsWith('data:image') || selectedStudentDetail.dokumenIjazah.includes('unsplash') ? (
                            <img
                              src={selectedStudentDetail.dokumenIjazah}
                              alt="Ijazah"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="text-center font-bold text-red-600 text-xs">
                              <span className="block text-lg">📄</span> Dokumen PDF
                            </div>
                          )}
                        </div>
                        <p className="text-[10px] font-medium text-slate-700 truncate" title={selectedStudentDetail.namaFileIjazah}>
                          {selectedStudentDetail.namaFileIjazah || 'Berkas_Ijazah.jpg'}
                        </p>
                        <div className="flex items-center gap-1.5 pt-1">
                          <button
                            type="button"
                            onClick={() =>
                              setAdminPreviewDoc({
                                title: `Ijazah Terakhir - ${selectedStudentDetail.namaLengkap}`,
                                url: selectedStudentDetail.dokumenIjazah || '',
                                isPdf:
                                  selectedStudentDetail.namaFileIjazah?.toLowerCase().endsWith('.pdf') ||
                                  selectedStudentDetail.dokumenIjazah?.startsWith('data:application/pdf') ||
                                  false
                              })
                            }
                            className="flex-1 py-1.5 px-2 bg-orange-100 hover:bg-orange-200 text-orange-800 text-[11px] font-bold rounded-lg flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <Eye className="w-3 h-3" />
                            <span>Lihat</span>
                          </button>
                          <a
                            href={selectedStudentDetail.dokumenIjazah}
                            download={selectedStudentDetail.namaFileIjazah || `Ijazah_${selectedStudentDetail.namaLengkap}.jpg`}
                            className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg cursor-pointer"
                            title="Unduh Berkas Ijazah"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </div>
                    ) : (
                      <p className="text-[11px] text-rose-600 mt-2">Calon siswa belum mengunggah Ijazah Terakhir.</p>
                    )}
                  </div>

                  {/* Berkas KTP */}
                  <div className={`p-3 rounded-xl border ${
                    selectedStudentDetail.dokumenKTP ? 'bg-white border-blue-300' : 'bg-slate-100/70 border-slate-200'
                  }`}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[11px] font-black text-slate-900">KTP / KIA</span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        selectedStudentDetail.dokumenKTP ? 'bg-blue-100 text-blue-800' : 'bg-slate-200 text-slate-600'
                      }`}>
                        {selectedStudentDetail.dokumenKTP ? 'Terunggah' : 'Opsional'}
                      </span>
                    </div>

                    {selectedStudentDetail.dokumenKTP ? (
                      <div className="space-y-2 mt-2">
                        <div className="h-24 bg-slate-100 rounded-lg overflow-hidden border border-slate-200 flex items-center justify-center relative">
                          {selectedStudentDetail.dokumenKTP.startsWith('data:image') || selectedStudentDetail.dokumenKTP.includes('unsplash') ? (
                            <img
                              src={selectedStudentDetail.dokumenKTP}
                              alt="KTP"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="text-center font-bold text-red-600 text-xs">
                              <span className="block text-lg">📄</span> Dokumen PDF
                            </div>
                          )}
                        </div>
                        <p className="text-[10px] font-medium text-slate-700 truncate" title={selectedStudentDetail.namaFileKTP}>
                          {selectedStudentDetail.namaFileKTP || 'Berkas_KTP.jpg'}
                        </p>
                        <div className="flex items-center gap-1.5 pt-1">
                          <button
                            type="button"
                            onClick={() =>
                              setAdminPreviewDoc({
                                title: `KTP / KIA - ${selectedStudentDetail.namaLengkap}`,
                                url: selectedStudentDetail.dokumenKTP || '',
                                isPdf:
                                  selectedStudentDetail.namaFileKTP?.toLowerCase().endsWith('.pdf') ||
                                  selectedStudentDetail.dokumenKTP?.startsWith('data:application/pdf') ||
                                  false
                              })
                            }
                            className="flex-1 py-1.5 px-2 bg-orange-100 hover:bg-orange-200 text-orange-800 text-[11px] font-bold rounded-lg flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <Eye className="w-3 h-3" />
                            <span>Lihat</span>
                          </button>
                          <a
                            href={selectedStudentDetail.dokumenKTP}
                            download={selectedStudentDetail.namaFileKTP || `KTP_${selectedStudentDetail.namaLengkap}.jpg`}
                            className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg cursor-pointer"
                            title="Unduh Berkas KTP"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </div>
                    ) : (
                      <p className="text-[11px] text-slate-500 mt-2">Tidak dilampirkan (Opsional). Dapat dilengkapi saat verifikasi tatap muka.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <button
                onClick={() => setSelectedStudentDetail(null)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer"
              >
                Tutup
              </button>
              <button
                onClick={() => handleSendWhatsAppToStudent(selectedStudentDetail)}
                className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-600 text-white text-xs font-extrabold flex items-center gap-2 shadow cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat WhatsApp Siswa</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Admin Document Lightbox Preview Modal */}
      {adminPreviewDoc && (
        <div className="fixed inset-0 z-70 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
          <div className="bg-white w-full max-w-2xl rounded-3xl p-4 sm:p-6 shadow-2xl border border-slate-200 relative max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-orange-700" />
                <h4 className="text-sm font-bold text-slate-900">
                  {adminPreviewDoc.title}
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setAdminPreviewDoc(null)}
                className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-auto my-3 flex items-center justify-center bg-slate-100 rounded-2xl p-2 min-h-[250px]">
              {adminPreviewDoc.isPdf ? (
                <div className="text-center p-6 space-y-3">
                  <div className="w-16 h-16 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mx-auto font-black text-lg shadow-sm">
                    PDF
                  </div>
                  <div>
                    <p className="font-bold text-xs text-slate-800">Berkas Dokumen PDF</p>
                    <p className="text-[11px] text-slate-500">Pratinjau berkas pendaftaran calon siswa.</p>
                  </div>
                  <a
                    href={adminPreviewDoc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-xl shadow cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Buka Dokumen PDF di Tab Baru</span>
                  </a>
                </div>
              ) : (
                <img
                  src={adminPreviewDoc.url}
                  alt={adminPreviewDoc.title}
                  className="max-h-[60vh] max-w-full object-contain rounded-xl shadow-sm"
                />
              )}
            </div>

            <div className="flex items-center justify-between pt-1">
              <a
                href={adminPreviewDoc.url}
                download={`${adminPreviewDoc.title}.jpg`}
                className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Unduh Berkas</span>
              </a>
              <button
                type="button"
                onClick={() => setAdminPreviewDoc(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Logo Manager Modal */}
      <LogoManagerModal
        isOpen={isLogoModalOpen}
        onClose={() => setIsLogoModalOpen(false)}
      />

    </div>
  );
};
