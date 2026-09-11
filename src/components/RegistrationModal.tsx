import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import {
  X,
  UserPlus,
  CheckCircle2,
  Send,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  BookOpen,
  Upload,
  Camera,
  Heart,
  Target,
  User,
  MapPin,
  Users,
  Activity,
  ShieldCheck,
  AlertCircle,
  FileText,
  FileCheck,
  Eye,
  Trash2,
  Paperclip
} from 'lucide-react';
import { usePKBM } from '../context/PKBMContext';
import { RegistrationFormData } from '../types';

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultProgram?: string;
}

export const RegistrationModal: React.FC<RegistrationModalProps> = ({
  isOpen,
  onClose,
  defaultProgram
}) => {
  const { addRegistration, pkbmInfo } = usePKBM();
  const [step, setStep] = useState<number>(1);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [registrationCode, setRegistrationCode] = useState<string>('');
  const [hasWali, setHasWali] = useState<boolean>(false);
  const [photoPreview, setPhotoPreview] = useState<string>('');
  const [validationError, setValidationError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const kkInputRef = useRef<HTMLInputElement>(null);
  const ijazahInputRef = useRef<HTMLInputElement>(null);
  const ktpInputRef = useRef<HTMLInputElement>(null);
  const [previewDoc, setPreviewDoc] = useState<{ title: string; url: string; isPdf: boolean } | null>(null);

  const [formData, setFormData] = useState<RegistrationFormData>({
    // Step 1: Program & Minat
    pilihanProgram: (defaultProgram && defaultProgram.includes('Paket A'))
      ? 'Paket A (Setara SD)'
      : (defaultProgram && defaultProgram.includes('Paket B'))
      ? 'Paket B (Setara SMP)'
      : 'Paket C (Setara SMA)',
    jenisPendaftaran: 'Baru',
    pendidikanTerakhir: 'Tamat SD / Putus SMP',
    hobi: '',
    citaCita: '',

    // Step 2: Data Pribadi
    namaLengkap: '',
    nik: '',
    jenisKelamin: 'Laki-Laki',
    tempatLahir: '',
    tanggalLahir: '',
    agama: 'Islam',
    kebutuhanKhusus: 'Tidak Ada',
    kewarganegaraan: 'WNI',
    namaNegara: 'Indonesia',
    passPhoto: '',

    // Step 3: Alamat & Kontak
    alamatJalan: '',
    rt: '',
    rw: '',
    namaDusun: '',
    namaKelurahanDesa: '',
    kecamatan: 'Sumowono',
    kotaKabupaten: 'Kabupaten Semarang',
    kodePos: '50662',
    tempatTinggal: 'Tinggal Bersama Orang Tua',
    modaTransportasi: 'Sepeda Motor',
    nomorHp: '',
    nomorTelepon: '',
    emailPribadi: '',

    // Step 4: Data Orang Tua & Wali
    namaAyahKandung: '',
    tahunLahirAyah: '',
    pendidikanAyah: 'SMA / Sederajat',
    pekerjaanAyah: 'Petani / Pekebun',
    penghasilanBulananAyah: 'Rp 1.000.000 - Rp 2.000.000',
    kebutuhanKhususAyah: 'Tidak Ada',

    namaIbuKandung: '',
    tahunLahirIbu: '',
    pendidikanIbu: 'SMA / Sederajat',
    pekerjaanIbu: 'Ibu Rumah Tangga',
    penghasilanBulananIbu: 'Tidak Berpenghasilan',
    kebutuhanKhususIbu: 'Tidak Ada',

    namaWali: '',
    tahunLahirWali: '',
    pendidikanWali: 'SMA / Sederajat',
    pekerjaanWali: 'Wiraswasta',
    penghasilanBulananWali: 'Rp 1.000.000 - Rp 2.000.000',

    // Step 5: Berkas, Data Periodik & Pernyataan
    tinggiBadan: '',
    beratBadan: '',
    jarakKeSekolah: '',
    waktuTempuhKeSekolah: '',
    jumlahSaudaraKandung: '',
    dokumenKK: '',
    namaFileKK: '',
    dokumenIjazah: '',
    namaFileIjazah: '',
    dokumenKTP: '',
    namaFileKTP: '',
    pernyataan: false,

    // Legacy fields for backup
    catatanKhusus: ''
  });

  if (!isOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    setValidationError('');
  };

  const compressImage = (file: File, maxWidth = 1500, quality = 0.85): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          let { width, height } = img;
          if (width > maxWidth || height > maxWidth) {
            if (width > height) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            } else {
              width = Math.round((width * maxWidth) / height);
              height = maxWidth;
            }
          }
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(e.target?.result as string);
            return;
          }
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', quality));
        };
        img.onerror = () => resolve(e.target?.result as string);
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      setValidationError('Ukuran foto terlalu besar. Maksimal 8MB.');
      return;
    }

    compressImage(file, 800, 0.85).then((result) => {
      setPhotoPreview(result);
      setFormData((prev) => ({ ...prev, passPhoto: result }));
      setValidationError('');
    });
  };

  const handleDocumentUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'kk' | 'ijazah' | 'ktp'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setValidationError(`Ukuran file dokumen terlalu besar. Maksimal 10MB.`);
      return;
    }

    const typeLabel = type === 'kk' ? 'Kartu Keluarga (KK)' : type === 'ijazah' ? 'Ijazah Terakhir' : 'KTP/KIA';

    try {
      let fileDataUrl = '';
      if (file.type.startsWith('image/')) {
        fileDataUrl = await compressImage(file, 1600, 0.85);
      } else {
        fileDataUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (ev) => resolve(ev.target?.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      }

      if (type === 'kk') {
        setFormData((prev) => ({ ...prev, dokumenKK: fileDataUrl, namaFileKK: file.name }));
      } else if (type === 'ijazah') {
        setFormData((prev) => ({ ...prev, dokumenIjazah: fileDataUrl, namaFileIjazah: file.name }));
      } else if (type === 'ktp') {
        setFormData((prev) => ({ ...prev, dokumenKTP: fileDataUrl, namaFileKTP: file.name }));
      }
      setValidationError('');
    } catch (err) {
      console.error(err);
      setValidationError(`Gagal mengunggah file ${typeLabel}. Silakan coba lagi.`);
    }
  };

  const handleRemoveDocument = (type: 'kk' | 'ijazah' | 'ktp') => {
    if (type === 'kk') {
      setFormData((prev) => ({ ...prev, dokumenKK: '', namaFileKK: '' }));
      if (kkInputRef.current) kkInputRef.current.value = '';
    } else if (type === 'ijazah') {
      setFormData((prev) => ({ ...prev, dokumenIjazah: '', namaFileIjazah: '' }));
      if (ijazahInputRef.current) ijazahInputRef.current.value = '';
    } else if (type === 'ktp') {
      setFormData((prev) => ({ ...prev, dokumenKTP: '', namaFileKTP: '' }));
      if (ktpInputRef.current) ktpInputRef.current.value = '';
    }
  };

  const validateStep = (currentStep: number): boolean => {
    setValidationError('');
    if (currentStep === 1) {
      if (!formData.pilihanProgram) {
        setValidationError('Silakan pilih Program Kesetaraan.');
        return false;
      }
      if (!formData.jenisPendaftaran) {
        setValidationError('Silakan pilih Jenis Pendaftaran (Baru / Pindahan).');
        return false;
      }
    } else if (currentStep === 2) {
      if (!formData.namaLengkap.trim()) {
        setValidationError('Nama Lengkap wajib diisi.');
        return false;
      }
      if (!formData.tempatLahir.trim()) {
        setValidationError('Tempat Lahir wajib diisi.');
        return false;
      }
      if (!formData.tanggalLahir.trim()) {
        setValidationError('Tanggal Lahir wajib diisi.');
        return false;
      }
      if (!formData.agama) {
        setValidationError('Agama wajib dipilih.');
        return false;
      }
      if (!formData.kewarganegaraan) {
        setValidationError('Kewarganegaraan wajib dipilih.');
        return false;
      }
    } else if (currentStep === 3) {
      if (!formData.alamatJalan.trim()) {
        setValidationError('Alamat Jalan / Rumah wajib diisi.');
        return false;
      }
      if (!formData.kotaKabupaten.trim()) {
        setValidationError('Kota / Kabupaten wajib diisi.');
        return false;
      }
      if (!formData.nomorHp.trim()) {
        setValidationError('Nomor HP / WhatsApp wajib diisi.');
        return false;
      }
    } else if (currentStep === 4) {
      if (!formData.namaAyahKandung.trim()) {
        setValidationError('Nama Ayah Kandung wajib diisi.');
        return false;
      }
      if (!formData.tahunLahirAyah.trim()) {
        setValidationError('Tahun Lahir Ayah Kandung wajib diisi.');
        return false;
      }
      if (!formData.namaIbuKandung.trim()) {
        setValidationError('Nama Ibu Kandung wajib diisi.');
        return false;
      }
    } else if (currentStep === 5) {
      if (!formData.dokumenKK) {
        setValidationError('Kartu Keluarga (KK) wajib diunggah (format JPG, PNG, atau PDF).');
        return false;
      }
      if (!formData.dokumenIjazah) {
        setValidationError('Ijazah Terakhir atau Surat Keterangan Lulus (SKL) wajib diunggah.');
        return false;
      }
      if (!formData.pernyataan) {
        setValidationError('Anda wajib menyetujui pernyataan keabsahan data sebelum mengirim.');
        return false;
      }
    }
    return true;
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(step)) return;

    if (step < 5) {
      setStep(step + 1);
      const modalEl = document.getElementById('registration-modal-content');
      if (modalEl) modalEl.scrollTop = 0;
    } else {
      const result = addRegistration(formData);
      setRegistrationCode(result.code);
      setIsSubmitted(true);
    }
  };

  const generateWhatsappMessage = () => {
    const text = `*PENDAFTARAN WARGA BELAJAR BARU PKBM BINA INSANI SUMOWONO*
=================================
*Kode Pendaftaran:* ${registrationCode}
*Status:* Menunggu Verifikasi Berkas

*1. PENDAFTARAN & MINAT*
• Program: *${formData.pilihanProgram}*
• Jenis Pendaftaran: ${formData.jenisPendaftaran}
• Pendidikan Terakhir: ${formData.pendidikanTerakhir || '-'}
• Hobi: ${formData.hobi || '-'}
• Cita-cita: ${formData.citaCita || '-'}

*2. DATA PRIBADI*
• Nama Lengkap: *${formData.namaLengkap}*
• NIK: ${formData.nik || '-'}
• Tempat, Tgl Lahir: ${formData.tempatLahir}, ${formData.tanggalLahir}
• Jenis Kelamin: ${formData.jenisKelamin}
• Agama: ${formData.agama}
• Kewarganegaraan: ${formData.kewarganegaraan} (${formData.namaNegara || 'Indonesia'})
• Kebutuhan Khusus: ${formData.kebutuhanKhusus || 'Tidak Ada'}

*3. ALAMAT & KONTAK*
• Alamat: ${formData.alamatJalan}, RT ${formData.rt || '-'}/RW ${formData.rw || '-'}, ${formData.namaDusun || ''}, Desa ${formData.namaKelurahanDesa || ''}, Kec. ${formData.kecamatan || ''}, ${formData.kotaKabupaten} ${formData.kodePos ? `(${formData.kodePos})` : ''}
• Tempat Tinggal: ${formData.tempatTinggal || '-'}
• Moda Transportasi: ${formData.modaTransportasi || '-'}
• No. HP / WhatsApp: *${formData.nomorHp}*
• No. Telepon Rumah: ${formData.nomorTelepon || '-'}
• E-mail: ${formData.emailPribadi || '-'}

*4. DATA ORANG TUA / WALI*
• Ayah Kandung: ${formData.namaAyahKandung} (Lahir ${formData.tahunLahirAyah}, Pekerjaan: ${formData.pekerjaanAyah || '-'})
• Ibu Kandung: ${formData.namaIbuKandung} (${formData.tahunLahirIbu ? `Lahir ${formData.tahunLahirIbu}, ` : ''}Pekerjaan: ${formData.pekerjaanIbu || '-'})
${formData.namaWali ? `• Wali: ${formData.namaWali} (Pekerjaan: ${formData.pekerjaanWali || '-'})` : ''}

*5. DATA PERIODIK*
• Tinggi / Berat: ${formData.tinggiBadan || '-'} cm / ${formData.beratBadan || '-'} kg
• Jarak / Waktu ke PKBM: ${formData.jarakKeSekolah || '-'} km / ${formData.waktuTempuhKeSekolah || '-'} menit
• Jml Saudara: ${formData.jumlahSaudaraKandung || '-'}

*6. BERKAS PERSYARATAN DIGITAL (DAPODIK):*
• Kartu Keluarga (KK): ${formData.dokumenKK ? `✅ Terlampir (${formData.namaFileKK || 'File KK'})` : '❌ Belum Terlampir'}
• Ijazah Terakhir / SKL: ${formData.dokumenIjazah ? `✅ Terlampir (${formData.namaFileIjazah || 'File Ijazah'})` : '❌ Belum Terlampir'}
• KTP / KIA: ${formData.dokumenKTP ? `✅ Terlampir (${formData.namaFileKTP || 'File KTP'})` : 'Belum Terlampir (Opsional)'}

*PERNYATAAN KEABSAHAN DATA:*
✅ Telah disetujui dan diverifikasi oleh Calon Siswa / Wali.

Mohon informasi jadwal verifikasi berkas fisik dan orientasi belajar. Terima kasih.`;

    return encodeURIComponent(text);
  };

  const stepsList = [
    { num: 1, label: 'Program & Minat', icon: BookOpen },
    { num: 2, label: 'Data Pribadi', icon: User },
    { num: 3, label: 'Alamat & Kontak', icon: MapPin },
    { num: 4, label: 'Orang Tua & Wali', icon: Users },
    { num: 5, label: 'Berkas & Periodik', icon: ShieldCheck }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        id="registration-modal-content"
        className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 relative p-5 sm:p-8"
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors z-10 cursor-pointer"
          title="Tutup Formulir"
        >
          <X className="w-5 h-5" />
        </button>

        {!isSubmitted ? (
          <div>
            {/* Modal Header */}
            <div className="space-y-2 mb-5 border-b border-slate-100 pb-4 pr-8">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-bold">
                <UserPlus className="w-3.5 h-3.5" />
                Formulir Pendaftaran Resmi Standar Dapodik Kesetaraan
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Pendaftaran Warga Belajar Baru (PWBB)
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm">
                PKBM Bina Insani Sumowono • NPSN P9979993 • Terakreditasi BAN-PDM
              </p>

              {/* Step Navigation Bar */}
              <div className="pt-3">
                <div className="grid grid-cols-5 gap-1 sm:gap-2 text-[10px] sm:text-xs font-bold text-center">
                  {stepsList.map((s) => (
                    <button
                      key={s.num}
                      type="button"
                      onClick={() => {
                        if (s.num < step) setStep(s.num);
                      }}
                      className={`p-1.5 sm:p-2 rounded-xl flex flex-col sm:flex-row items-center justify-center gap-1 transition-all ${
                        step === s.num
                          ? 'bg-[#ea580c] text-white shadow-sm font-black'
                          : step > s.num
                          ? 'bg-orange-50 text-orange-800 hover:bg-orange-100 cursor-pointer'
                          : 'bg-slate-100 text-slate-400'
                      }`}
                    >
                      <s.icon className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate hidden sm:inline">{s.num}. {s.label}</span>
                      <span className="sm:hidden font-mono">{s.num}</span>
                    </button>
                  ))}
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mt-2">
                  <div
                    className="bg-[#ea580c] h-full transition-all duration-300 rounded-full"
                    style={{ width: `${(step / 5) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Validation Error Alert */}
            {validationError && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 mb-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-2"
              >
                <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                <span>{validationError}</span>
              </motion.div>
            )}

            {/* Form Steps */}
            <form onSubmit={handleNext} className="space-y-4">
              {/* STEP 1: PROGRAM & MINAT */}
              {step === 1 && (
                <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                  <div className="p-3 bg-orange-50/70 rounded-2xl border border-orange-200/80">
                    <p className="text-xs font-bold text-orange-900 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      Langkah 1 dari 5: Pilihan Program Kesetaraan & Minat Belajar
                    </p>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1">
                        Pilihan Program Kesetaraan <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="pilihanProgram"
                        value={formData.pilihanProgram}
                        onChange={handleChange}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-orange-300 text-sm font-bold text-[#ea580c] bg-orange-50/40 focus:outline-none focus:border-orange-500"
                      >
                        <option value="Paket A (Setara SD)">Paket A (Setara SD / MI)</option>
                        <option value="Paket B (Setara SMP)">Paket B (Setara SMP / MTs)</option>
                        <option value="Paket C (Setara SMA)">Paket C (Setara SMA / MA / SMK)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1">
                        Jenis Pendaftaran <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="jenisPendaftaran"
                        value={formData.jenisPendaftaran}
                        onChange={handleChange}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-bold text-slate-800 focus:outline-none focus:border-orange-500"
                      >
                        <option value="Baru">Siswa Baru (Pemula / Mengulang)</option>
                        <option value="Pindahan">Siswa Pindahan (Lanjutan Sekolah Formal/Nonformal)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Pendidikan Terakhir Calon Siswa
                    </label>
                    <input
                      type="text"
                      name="pendidikanTerakhir"
                      value={formData.pendidikanTerakhir}
                      onChange={handleChange}
                      placeholder="Contoh: Tamat SD Negeri 1 Sumowono / Putus SMP Kelas 2"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center gap-1">
                        <Heart className="w-3.5 h-3.5 text-rose-500" />
                        Hobi Calon Siswa
                      </label>
                      <input
                        type="text"
                        name="hobi"
                        value={formData.hobi}
                        onChange={handleChange}
                        placeholder="Contoh: Memasak, Komputer, Otomotif, Menjahit, Musik"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-orange-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center gap-1">
                        <Target className="w-3.5 h-3.5 text-amber-500" />
                        Cita-Cita Calon Siswa
                      </label>
                      <input
                        type="text"
                        name="citaCita"
                        value={formData.citaCita}
                        onChange={handleChange}
                        placeholder="Contoh: Buka Usaha Mandiri, Lanjut Kuliah, Teknisi Komputer"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-orange-500"
                      />
                    </div>
                  </div>

                  <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 space-y-1">
                    <p className="font-bold flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                      Fasilitas Kursus Vokasi Siap Kerja:
                    </p>
                    <p className="text-slate-700">
                      Seluruh warga belajar PKBM Bina Insani otomatis berhak mengikuti pelatihan vokasi bersertifikat: <strong>Komputer Praktis & Digital Marketing</strong>, <strong>Tata Boga & Barista</strong>, serta <strong>Tata Busana</strong> tanpa biaya SPP tambahan.
                    </p>
                  </div>
                </motion.div>
              )}

              {/* STEP 2: DATA PRIBADI */}
              {step === 2 && (
                <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                  <div className="p-3 bg-orange-50/70 rounded-2xl border border-orange-200/80">
                    <p className="text-xs font-bold text-orange-900 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-orange-600" />
                      Langkah 2 dari 5: Data Pribadi & Identitas Calon Siswa
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Nama Lengkap (Sesuai Akta Kelahiran / KK / Ijazah Terakhir) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="namaLengkap"
                      required
                      value={formData.namaLengkap}
                      onChange={handleChange}
                      placeholder="Contoh: Muhammad Fauzi Pratama"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1">
                        NIK (Nomor Induk Kependudukan - Sesuai KTP / KK)
                      </label>
                      <input
                        type="text"
                        name="nik"
                        maxLength={16}
                        value={formData.nik}
                        onChange={handleChange}
                        placeholder="16 Digit NIK (Contoh: 332205...)"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-mono focus:outline-none focus:border-orange-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1">
                        Jenis Kelamin <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="jenisKelamin"
                        value={formData.jenisKelamin}
                        onChange={handleChange}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-orange-500"
                      >
                        <option value="Laki-Laki">Laki-Laki</option>
                        <option value="Perempuan">Perempuan</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1">
                        Tempat Lahir <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="tempatLahir"
                        required
                        value={formData.tempatLahir}
                        onChange={handleChange}
                        placeholder="Contoh: Semarang"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-orange-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1">
                        Tanggal Lahir <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        name="tanggalLahir"
                        required
                        value={formData.tanggalLahir}
                        onChange={handleChange}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-orange-500"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1">
                        Agama <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="agama"
                        value={formData.agama}
                        onChange={handleChange}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-orange-500"
                      >
                        <option value="Islam">Islam</option>
                        <option value="Kristen">Kristen (Protestan)</option>
                        <option value="Katolik">Katolik</option>
                        <option value="Hindu">Hindu</option>
                        <option value="Buddha">Buddha</option>
                        <option value="Konghucu">Konghucu</option>
                        <option value="Lainnya">Lainnya</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1">
                        Kebutuhan Khusus
                      </label>
                      <input
                        type="text"
                        name="kebutuhanKhusus"
                        value={formData.kebutuhanKhusus}
                        onChange={handleChange}
                        placeholder="Tidak Ada / Disabilitas Netra / Rungu / dll"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-orange-500"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1">
                        Kewarganegaraan <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="kewarganegaraan"
                        value={formData.kewarganegaraan}
                        onChange={handleChange}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-orange-500"
                      >
                        <option value="WNI">Warga Negara Indonesia (WNI)</option>
                        <option value="WNA">Warga Negara Asing (WNA)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1">
                        Nama Negara
                      </label>
                      <input
                        type="text"
                        name="namaNegara"
                        value={formData.namaNegara}
                        onChange={handleChange}
                        placeholder="Contoh: Indonesia"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-orange-500"
                      />
                    </div>
                  </div>

                  {/* Pass Photo Upload */}
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                    <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                      <Camera className="w-4 h-4 text-slate-600" />
                      Pass Photo Calon Siswa (Ukuran 3x4 / Foto Formal)
                    </label>
                    <p className="text-[11px] text-slate-500 mb-3">
                      Unggah pas foto formal atau foto selfie rapi berpakaian sopan untuk buku induk & kartu siswa.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center gap-4">
                      {photoPreview ? (
                        <div className="relative w-24 h-32 rounded-xl overflow-hidden border-2 border-orange-500 shadow-sm shrink-0 bg-slate-200">
                          <img src={photoPreview} alt="Pass Photo" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => {
                              setPhotoPreview('');
                              setFormData((prev) => ({ ...prev, passPhoto: '' }));
                            }}
                            className="absolute top-1 right-1 p-1 rounded-full bg-red-600 text-white text-[10px]"
                            title="Hapus Foto"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <div className="w-24 h-32 rounded-xl border-2 border-dashed border-slate-300 bg-white flex flex-col items-center justify-center text-slate-400 shrink-0">
                          <Camera className="w-6 h-6 mb-1 text-slate-300" />
                          <span className="text-[10px] font-bold">Pas Foto 3x4</span>
                        </div>
                      )}

                      <div className="flex-1 space-y-2 w-full">
                        <input
                          type="file"
                          ref={fileInputRef}
                          accept="image/*"
                          onChange={handlePhotoUpload}
                          className="hidden"
                        />
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="w-full sm:w-auto px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>Pilih Foto dari Perangkat (Maks 5MB)</span>
                        </button>
                        <p className="text-[10px] text-slate-400">
                          Format: JPG, PNG, atau WEBP. Pas foto juga dapat diserahkan saat verifikasi berkas fisik.
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 3: ALAMAT & KONTAK */}
              {step === 3 && (
                <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                  <div className="p-3 bg-orange-50/70 rounded-2xl border border-orange-200/80">
                    <p className="text-xs font-bold text-orange-900 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-orange-600" />
                      Langkah 3 dari 5: Alamat Tempat Tinggal & Kontak Aktif
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Alamat Jalan / Nomor Rumah / Gang <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="alamatJalan"
                      required
                      rows={2}
                      value={formData.alamatJalan}
                      onChange={handleChange}
                      placeholder="Contoh: Jl. Raya Bandungan - Sumowono Km. 3 No. 45"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1">RT</label>
                      <input
                        type="text"
                        name="rt"
                        value={formData.rt}
                        onChange={handleChange}
                        placeholder="02"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1">RW</label>
                      <input
                        type="text"
                        name="rw"
                        value={formData.rw}
                        onChange={handleChange}
                        placeholder="01"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-orange-500"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-xs font-bold text-slate-800 mb-1">Nama Dusun / Dukuh</label>
                      <input
                        type="text"
                        name="namaDusun"
                        value={formData.namaDusun}
                        onChange={handleChange}
                        placeholder="Contoh: Dusun Ngadikerso"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-orange-500"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1">Kelurahan / Desa</label>
                      <input
                        type="text"
                        name="namaKelurahanDesa"
                        value={formData.namaKelurahanDesa}
                        onChange={handleChange}
                        placeholder="Contoh: Ngadikerso / Bumen"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1">Kecamatan</label>
                      <input
                        type="text"
                        name="kecamatan"
                        value={formData.kecamatan}
                        onChange={handleChange}
                        placeholder="Contoh: Sumowono"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1">
                        Kota / Kabupaten <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="kotaKabupaten"
                        required
                        value={formData.kotaKabupaten}
                        onChange={handleChange}
                        placeholder="Contoh: Kabupaten Semarang"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-orange-500"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1">Kode Pos</label>
                      <input
                        type="text"
                        name="kodePos"
                        value={formData.kodePos}
                        onChange={handleChange}
                        placeholder="50662"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-orange-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1">Status Tempat Tinggal</label>
                      <select
                        name="tempatTinggal"
                        value={formData.tempatTinggal}
                        onChange={handleChange}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-orange-500"
                      >
                        <option value="Milik Pribadi">Milik Pribadi</option>
                        <option value="Tinggal Bersama Orang Tua">Tinggal Bersama Orang Tua</option>
                        <option value="Asrama">Asrama / Pondok</option>
                        <option value="Panti Asuhan">Panti Asuhan</option>
                        <option value="Kost / Sewa">Kost / Rumah Sewa</option>
                        <option value="Lainnya">Lainnya</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1">Moda Transportasi</label>
                      <select
                        name="modaTransportasi"
                        value={formData.modaTransportasi}
                        onChange={handleChange}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-orange-500"
                      >
                        <option value="Jalan Kaki">Jalan Kaki</option>
                        <option value="Sepeda Motor">Sepeda Motor</option>
                        <option value="Sepeda">Sepeda</option>
                        <option value="Mobil Pribadi">Mobil Pribadi</option>
                        <option value="Angkutan Umum">Angkutan Umum</option>
                        <option value="Ojek / Online">Ojek / Online</option>
                        <option value="Lainnya">Lainnya</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100">
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1">
                        Nomor HP / WhatsApp Aktif <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        name="nomorHp"
                        required
                        value={formData.nomorHp}
                        onChange={handleChange}
                        placeholder="Contoh: 085290655103"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold focus:outline-none focus:border-orange-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1">Nomor Telepon Rumah</label>
                      <input
                        type="tel"
                        name="nomorTelepon"
                        value={formData.nomorTelepon}
                        onChange={handleChange}
                        placeholder="Contoh: 0298-591234 atau -"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-orange-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1">E-mail Pribadi</label>
                      <input
                        type="email"
                        name="emailPribadi"
                        value={formData.emailPribadi}
                        onChange={handleChange}
                        placeholder="contoh@gmail.com"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-orange-500"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 4: DATA ORANG TUA & WALI */}
              {step === 4 && (
                <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                  <div className="p-3 bg-orange-50/70 rounded-2xl border border-orange-200/80">
                    <p className="text-xs font-bold text-orange-900 flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-orange-600" />
                      Langkah 4 dari 5: Data Orang Tua Kandung & Wali
                    </p>
                  </div>

                  {/* DATA AYAH KANDUNG */}
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                    <div className="flex items-center gap-2 text-xs font-black text-slate-900 border-b border-slate-200 pb-2">
                      <span className="w-2 h-2 rounded-full bg-orange-600" />
                      A. Data Ayah Kandung
                    </div>

                    <div className="grid sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1">
                          Nama Ayah Kandung <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="namaAyahKandung"
                          required
                          value={formData.namaAyahKandung}
                          onChange={handleChange}
                          placeholder="Nama lengkap Ayah Kandung"
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-orange-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1">
                          Tahun Lahir Ayah <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="tahunLahirAyah"
                          required
                          maxLength={4}
                          value={formData.tahunLahirAyah}
                          onChange={handleChange}
                          placeholder="Contoh: 1970"
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-orange-500"
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1">Pendidikan Ayah</label>
                        <select
                          name="pendidikanAyah"
                          value={formData.pendidikanAyah}
                          onChange={handleChange}
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-orange-500"
                        >
                          <option value="Tidak Sekolah">Tidak Bersekolah</option>
                          <option value="SD / Sederajat">SD / Sederajat</option>
                          <option value="SMP / Sederajat">SMP / Sederajat</option>
                          <option value="SMA / Sederajat">SMA / SMK / Sederajat</option>
                          <option value="D1/D2/D3">Diploma (D1/D2/D3)</option>
                          <option value="S1 / Sarjana">Sarjana (S1)</option>
                          <option value="S2 / Magister">Magister (S2)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1">Pekerjaan Ayah</label>
                        <select
                          name="pekerjaanAyah"
                          value={formData.pekerjaanAyah}
                          onChange={handleChange}
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-orange-500"
                        >
                          <option value="Petani / Pekebun">Petani / Pekebun</option>
                          <option value="Wiraswasta / Usaha">Wiraswasta / Pedagang</option>
                          <option value="Karyawan Swasta">Karyawan Swasta</option>
                          <option value="Buruh Harian Lepas">Buruh Harian Lepas</option>
                          <option value="PNS / TNI / Polri">PNS / TNI / Polri</option>
                          <option value="Pensiunan">Pensiunan</option>
                          <option value="Tidak Bekerja / Meninggal">Tidak Bekerja / Meninggal</option>
                          <option value="Lainnya">Lainnya</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1">Penghasilan Bulanan</label>
                        <select
                          name="penghasilanBulananAyah"
                          value={formData.penghasilanBulananAyah}
                          onChange={handleChange}
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-orange-500"
                        >
                          <option value="< Rp 1.000.000">&lt; Rp 1.000.000</option>
                          <option value="Rp 1.000.000 - Rp 2.000.000">Rp 1.000.000 - Rp 2.000.000</option>
                          <option value="Rp 2.000.000 - Rp 3.000.000">Rp 2.000.000 - Rp 3.000.000</option>
                          <option value="Rp 3.000.000 - Rp 5.000.000">Rp 3.000.000 - Rp 5.000.000</option>
                          <option value="> Rp 5.000.000">&gt; Rp 5.000.000</option>
                          <option value="Tidak Berpenghasilan">Tidak Berpenghasilan</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* DATA IBU KANDUNG */}
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                    <div className="flex items-center gap-2 text-xs font-black text-slate-900 border-b border-slate-200 pb-2">
                      <span className="w-2 h-2 rounded-full bg-orange-600" />
                      B. Data Ibu Kandung
                    </div>

                    <div className="grid sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1">
                          Nama Ibu Kandung <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="namaIbuKandung"
                          required
                          value={formData.namaIbuKandung}
                          onChange={handleChange}
                          placeholder="Nama lengkap Ibu Kandung"
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-orange-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1">Tahun Lahir Ibu</label>
                        <input
                          type="text"
                          name="tahunLahirIbu"
                          maxLength={4}
                          value={formData.tahunLahirIbu}
                          onChange={handleChange}
                          placeholder="Contoh: 1974"
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-orange-500"
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1">Pendidikan Ibu</label>
                        <select
                          name="pendidikanIbu"
                          value={formData.pendidikanIbu}
                          onChange={handleChange}
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-orange-500"
                        >
                          <option value="Tidak Sekolah">Tidak Bersekolah</option>
                          <option value="SD / Sederajat">SD / Sederajat</option>
                          <option value="SMP / Sederajat">SMP / Sederajat</option>
                          <option value="SMA / Sederajat">SMA / SMK / Sederajat</option>
                          <option value="D1/D2/D3">Diploma (D1/D2/D3)</option>
                          <option value="S1 / Sarjana">Sarjana (S1)</option>
                          <option value="S2 / Magister">Magister (S2)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1">Pekerjaan Ibu</label>
                        <select
                          name="pekerjaanIbu"
                          value={formData.pekerjaanIbu}
                          onChange={handleChange}
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-orange-500"
                        >
                          <option value="Ibu Rumah Tangga">Ibu Rumah Tangga</option>
                          <option value="Petani / Pekebun">Petani / Pekebun</option>
                          <option value="Pedagang / Wiraswasta">Pedagang / Wiraswasta</option>
                          <option value="Karyawan Swasta">Karyawan Swasta</option>
                          <option value="Buruh">Buruh</option>
                          <option value="PNS / Guru">PNS / Guru</option>
                          <option value="Tidak Bekerja / Meninggal">Tidak Bekerja / Meninggal</option>
                          <option value="Lainnya">Lainnya</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1">Penghasilan Bulanan</label>
                        <select
                          name="penghasilanBulananIbu"
                          value={formData.penghasilanBulananIbu}
                          onChange={handleChange}
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-orange-500"
                        >
                          <option value="Tidak Berpenghasilan">Tidak Berpenghasilan</option>
                          <option value="< Rp 1.000.000">&lt; Rp 1.000.000</option>
                          <option value="Rp 1.000.000 - Rp 2.000.000">Rp 1.000.000 - Rp 2.000.000</option>
                          <option value="Rp 2.000.000 - Rp 3.000.000">Rp 2.000.000 - Rp 3.000.000</option>
                          <option value="> Rp 3.000.000">&gt; Rp 3.000.000</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1">Kebutuhan Khusus Ibu</label>
                      <input
                        type="text"
                        name="kebutuhanKhususIbu"
                        value={formData.kebutuhanKhususIbu}
                        onChange={handleChange}
                        placeholder="Tidak Ada / Ada (Sebutkan)"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-orange-500"
                      />
                    </div>
                  </div>

                  {/* DATA WALI (OPSIONAL) */}
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                      <div className="flex items-center gap-2 text-xs font-black text-slate-900">
                        <span className="w-2 h-2 rounded-full bg-slate-400" />
                        C. Data Wali (Opsional / Jika Tinggal Bersama Wali)
                      </div>
                      <button
                        type="button"
                        onClick={() => setHasWali(!hasWali)}
                        className="text-[11px] font-bold text-orange-700 hover:underline cursor-pointer"
                      >
                        {hasWali ? 'Tutup Data Wali' : '+ Isi Data Wali'}
                      </button>
                    </div>

                    {hasWali && (
                      <div className="space-y-3 pt-1">
                        <div className="grid sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-bold text-slate-800 mb-1">Nama Wali</label>
                            <input
                              type="text"
                              name="namaWali"
                              value={formData.namaWali}
                              onChange={handleChange}
                              placeholder="Nama lengkap Wali"
                              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-orange-500"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-800 mb-1">Tahun Lahir Wali</label>
                            <input
                              type="text"
                              name="tahunLahirWali"
                              maxLength={4}
                              value={formData.tahunLahirWali}
                              onChange={handleChange}
                              placeholder="Contoh: 1968"
                              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-orange-500"
                            />
                          </div>
                        </div>

                        <div className="grid sm:grid-cols-3 gap-3">
                          <div>
                            <label className="block text-xs font-bold text-slate-800 mb-1">Pendidikan Wali</label>
                            <select
                              name="pendidikanWali"
                              value={formData.pendidikanWali}
                              onChange={handleChange}
                              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-orange-500"
                            >
                              <option value="SD / Sederajat">SD / Sederajat</option>
                              <option value="SMP / Sederajat">SMP / Sederajat</option>
                              <option value="SMA / Sederajat">SMA / Sederajat</option>
                              <option value="Diploma / Sarjana">Diploma / Sarjana</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-800 mb-1">Pekerjaan Wali</label>
                            <input
                              type="text"
                              name="pekerjaanWali"
                              value={formData.pekerjaanWali}
                              onChange={handleChange}
                              placeholder="Pekerjaan Wali"
                              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-orange-500"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-800 mb-1">Penghasilan Bulanan</label>
                            <select
                              name="penghasilanBulananWali"
                              value={formData.penghasilanBulananWali}
                              onChange={handleChange}
                              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-orange-500"
                            >
                              <option value="< Rp 1.000.000">&lt; Rp 1.000.000</option>
                              <option value="Rp 1.000.000 - Rp 2.000.000">Rp 1.000.000 - Rp 2.000.000</option>
                              <option value="Rp 2.000.000 - Rp 3.000.000">Rp 2.000.000 - Rp 3.000.000</option>
                              <option value="> Rp 3.000.000">&gt; Rp 3.000.000</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* STEP 5: BERKAS, DATA PERIODIK & PERNYATAAN */}
              {step === 5 && (
                <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
                  <div className="p-3.5 bg-orange-50/80 rounded-2xl border border-orange-200">
                    <p className="text-xs font-bold text-orange-950 flex items-center gap-1.5">
                      <FileCheck className="w-4 h-4 text-orange-700 shrink-0" />
                      Langkah 5 dari 5: Upload Berkas Dokumen Persyaratan, Data Periodik & Pernyataan
                    </p>
                  </div>

                  {/* UPLOAD BERKAS DOKUMEN PERSYARATAN */}
                  <div className="p-4 sm:p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
                    <div className="border-b border-slate-200 pb-2">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-orange-700" />
                        <h4 className="text-xs sm:text-sm font-black text-slate-900">
                          Unggah Berkas Dokumen Persyaratan (Dapodik Kesetaraan)
                        </h4>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-1">
                        Format didukung: <strong>JPG, PNG, WEBP, atau PDF</strong> (Maksimal 10MB per berkas). Dokumen harus jelas, tidak buram, dan teks dapat terbaca.
                      </p>
                    </div>

                    <div className="grid gap-3.5">
                      {/* DOKUMEN 1: KARTU KELUARGA (KK) - WAJIB */}
                      <div className={`p-3.5 rounded-2xl border transition-all ${
                        formData.dokumenKK
                          ? 'bg-orange-50/50 border-orange-300'
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-orange-700 text-white font-bold text-[11px] flex items-center justify-center">
                              1
                            </span>
                            <span className="text-xs font-black text-slate-900">
                              Kartu Keluarga (KK)
                            </span>
                            <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-black border border-rose-200">
                              * Wajib Diunggah
                            </span>
                          </div>
                          {formData.dokumenKK && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-orange-700 bg-white px-2 py-0.5 rounded-lg border border-orange-200">
                              <CheckCircle2 className="w-3.5 h-3.5 text-orange-600" />
                              Berkas Terlampir
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-600 mb-3">
                          Foto / scan Kartu Keluarga asli atau fotokopi yang masih berlaku dan memuat nama calon warga belajar.
                        </p>

                        {!formData.dokumenKK ? (
                          <div>
                            <input
                              ref={kkInputRef}
                              type="file"
                              accept="image/jpeg,image/png,image/webp,application/pdf"
                              onChange={(e) => handleDocumentUpload(e, 'kk')}
                              className="hidden"
                              id="upload-kk-input"
                            />
                            <label
                              htmlFor="upload-kk-input"
                              className="w-full border-2 border-dashed border-slate-300 hover:border-orange-600 bg-slate-50 hover:bg-orange-50/30 rounded-xl p-3.5 flex flex-col sm:flex-row items-center justify-center gap-2 text-center cursor-pointer transition-colors"
                            >
                              <Upload className="w-4 h-4 text-orange-700" />
                              <span className="text-xs font-bold text-slate-800">
                                Pilih File Kartu Keluarga (KK)
                              </span>
                              <span className="text-[10px] text-slate-500 font-normal">
                                (Klik untuk telusuri file dari galeri / dokumen)
                              </span>
                            </label>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between gap-3 p-2.5 bg-white rounded-xl border border-orange-200">
                            <div className="flex items-center gap-2.5 min-w-0">
                              {formData.dokumenKK.startsWith('data:image') ? (
                                <img
                                  src={formData.dokumenKK}
                                  alt="Preview KK"
                                  className="w-12 h-12 object-cover rounded-lg border border-slate-200 shrink-0"
                                />
                              ) : (
                                <div className="w-12 h-12 bg-red-100 text-red-700 rounded-lg flex flex-col items-center justify-center font-bold text-[10px] shrink-0 border border-red-200">
                                  <span>PDF</span>
                                </div>
                              )}
                              <div className="min-w-0">
                                <p className="text-xs font-bold text-slate-900 truncate">
                                  {formData.namaFileKK || 'Dokumen-KK.jpg'}
                                </p>
                                <p className="text-[10px] text-orange-700 font-medium">
                                  Siap dikirim untuk verifikasi
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-1.5 shrink-0">
                              <button
                                type="button"
                                onClick={() =>
                                  setPreviewDoc({
                                    title: 'Kartu Keluarga (KK)',
                                    url: formData.dokumenKK || '',
                                    isPdf:
                                      formData.namaFileKK?.toLowerCase().endsWith('.pdf') ||
                                      formData.dokumenKK?.startsWith('data:application/pdf') ||
                                      false
                                  })
                                }
                                className="px-2.5 py-1.5 rounded-lg bg-orange-100 hover:bg-orange-200 text-orange-800 text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span>Lihat</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleRemoveDocument('kk')}
                                className="p-1.5 rounded-lg bg-slate-100 hover:bg-rose-100 text-slate-600 hover:text-rose-700 transition-colors cursor-pointer"
                                title="Hapus / Ganti Berkas"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* DOKUMEN 2: IJAZAH TERAKHIR / SKL - WAJIB */}
                      <div className={`p-3.5 rounded-2xl border transition-all ${
                        formData.dokumenIjazah
                          ? 'bg-orange-50/50 border-orange-300'
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-orange-700 text-white font-bold text-[11px] flex items-center justify-center">
                              2
                            </span>
                            <span className="text-xs font-black text-slate-900">
                              Ijazah Terakhir / Surat Keterangan Lulus (SKL)
                            </span>
                            <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-black border border-rose-200">
                              * Wajib Diunggah
                            </span>
                          </div>
                          {formData.dokumenIjazah && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-orange-700 bg-white px-2 py-0.5 rounded-lg border border-orange-200">
                              <CheckCircle2 className="w-3.5 h-3.5 text-orange-600" />
                              Berkas Terlampir
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-600 mb-3">
                          Foto / scan Ijazah pendidikan terakhir (SD / SMP / Sederajat) atau Surat Keterangan Lulus resmi.
                        </p>

                        {!formData.dokumenIjazah ? (
                          <div>
                            <input
                              ref={ijazahInputRef}
                              type="file"
                              accept="image/jpeg,image/png,image/webp,application/pdf"
                              onChange={(e) => handleDocumentUpload(e, 'ijazah')}
                              className="hidden"
                              id="upload-ijazah-input"
                            />
                            <label
                              htmlFor="upload-ijazah-input"
                              className="w-full border-2 border-dashed border-slate-300 hover:border-orange-600 bg-slate-50 hover:bg-orange-50/30 rounded-xl p-3.5 flex flex-col sm:flex-row items-center justify-center gap-2 text-center cursor-pointer transition-colors"
                            >
                              <Upload className="w-4 h-4 text-orange-700" />
                              <span className="text-xs font-bold text-slate-800">
                                Pilih File Ijazah Terakhir / SKL
                              </span>
                              <span className="text-[10px] text-slate-500 font-normal">
                                (Klik untuk telusuri file dari galeri / dokumen)
                              </span>
                            </label>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between gap-3 p-2.5 bg-white rounded-xl border border-orange-200">
                            <div className="flex items-center gap-2.5 min-w-0">
                              {formData.dokumenIjazah.startsWith('data:image') ? (
                                <img
                                  src={formData.dokumenIjazah}
                                  alt="Preview Ijazah"
                                  className="w-12 h-12 object-cover rounded-lg border border-slate-200 shrink-0"
                                />
                              ) : (
                                <div className="w-12 h-12 bg-red-100 text-red-700 rounded-lg flex flex-col items-center justify-center font-bold text-[10px] shrink-0 border border-red-200">
                                  <span>PDF</span>
                                </div>
                              )}
                              <div className="min-w-0">
                                <p className="text-xs font-bold text-slate-900 truncate">
                                  {formData.namaFileIjazah || 'Dokumen-Ijazah.jpg'}
                                </p>
                                <p className="text-[10px] text-orange-700 font-medium">
                                  Siap dikirim untuk verifikasi
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-1.5 shrink-0">
                              <button
                                type="button"
                                onClick={() =>
                                  setPreviewDoc({
                                    title: 'Ijazah Terakhir / SKL',
                                    url: formData.dokumenIjazah || '',
                                    isPdf:
                                      formData.namaFileIjazah?.toLowerCase().endsWith('.pdf') ||
                                      formData.dokumenIjazah?.startsWith('data:application/pdf') ||
                                      false
                                  })
                                }
                                className="px-2.5 py-1.5 rounded-lg bg-orange-100 hover:bg-orange-200 text-orange-800 text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span>Lihat</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleRemoveDocument('ijazah')}
                                className="p-1.5 rounded-lg bg-slate-100 hover:bg-rose-100 text-slate-600 hover:text-rose-700 transition-colors cursor-pointer"
                                title="Hapus / Ganti Berkas"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* DOKUMEN 3: KTP / KIA - OPSIONAL */}
                      <div className={`p-3.5 rounded-2xl border transition-all ${
                        formData.dokumenKTP
                          ? 'bg-orange-50/50 border-orange-300'
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-slate-700 text-white font-bold text-[11px] flex items-center justify-center">
                              3
                            </span>
                            <span className="text-xs font-black text-slate-900">
                              KTP / KIA (Kartu Identitas Anak)
                            </span>
                            <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold border border-slate-200">
                              Opsional
                            </span>
                          </div>
                          {formData.dokumenKTP && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-orange-700 bg-white px-2 py-0.5 rounded-lg border border-orange-200">
                              <CheckCircle2 className="w-3.5 h-3.5 text-orange-600" />
                              Berkas Terlampir
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-600 mb-3">
                          Foto KTP calon siswa atau KTP Orang Tua/Wali / KIA jika belum memiliki KTP sendiri.
                        </p>

                        {!formData.dokumenKTP ? (
                          <div>
                            <input
                              ref={ktpInputRef}
                              type="file"
                              accept="image/jpeg,image/png,image/webp,application/pdf"
                              onChange={(e) => handleDocumentUpload(e, 'ktp')}
                              className="hidden"
                              id="upload-ktp-input"
                            />
                            <label
                              htmlFor="upload-ktp-input"
                              className="w-full border-2 border-dashed border-slate-300 hover:border-slate-400 bg-slate-50 hover:bg-slate-100/60 rounded-xl p-3.5 flex flex-col sm:flex-row items-center justify-center gap-2 text-center cursor-pointer transition-colors"
                            >
                              <Upload className="w-4 h-4 text-slate-600" />
                              <span className="text-xs font-bold text-slate-800">
                                Pilih File KTP / KIA (Opsional)
                              </span>
                              <span className="text-[10px] text-slate-500 font-normal">
                                (Dapat dilampirkan sekarang atau saat verifikasi fisik)
                              </span>
                            </label>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between gap-3 p-2.5 bg-white rounded-xl border border-orange-200">
                            <div className="flex items-center gap-2.5 min-w-0">
                              {formData.dokumenKTP.startsWith('data:image') ? (
                                <img
                                  src={formData.dokumenKTP}
                                  alt="Preview KTP"
                                  className="w-12 h-12 object-cover rounded-lg border border-slate-200 shrink-0"
                                />
                              ) : (
                                <div className="w-12 h-12 bg-red-100 text-red-700 rounded-lg flex flex-col items-center justify-center font-bold text-[10px] shrink-0 border border-red-200">
                                  <span>PDF</span>
                                </div>
                              )}
                              <div className="min-w-0">
                                <p className="text-xs font-bold text-slate-900 truncate">
                                  {formData.namaFileKTP || 'Dokumen-KTP.jpg'}
                                </p>
                                <p className="text-[10px] text-orange-700 font-medium">
                                  Terlampir
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-1.5 shrink-0">
                              <button
                                type="button"
                                onClick={() =>
                                  setPreviewDoc({
                                    title: 'KTP / KIA',
                                    url: formData.dokumenKTP || '',
                                    isPdf:
                                      formData.namaFileKTP?.toLowerCase().endsWith('.pdf') ||
                                      formData.dokumenKTP?.startsWith('data:application/pdf') ||
                                      false
                                  })
                                }
                                className="px-2.5 py-1.5 rounded-lg bg-orange-100 hover:bg-orange-200 text-orange-800 text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span>Lihat</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleRemoveDocument('ktp')}
                                className="p-1.5 rounded-lg bg-slate-100 hover:bg-rose-100 text-slate-600 hover:text-rose-700 transition-colors cursor-pointer"
                                title="Hapus / Ganti Berkas"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Data Periodik Siswa */}
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                    <div className="text-xs font-black text-slate-900 border-b border-slate-200 pb-2 flex items-center gap-1.5">
                      <Activity className="w-3.5 h-3.5 text-orange-700" />
                      Data Periodik Calon Siswa
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1">Tinggi Badan (Cm)</label>
                        <input
                          type="number"
                          name="tinggiBadan"
                          value={formData.tinggiBadan}
                          onChange={handleChange}
                          placeholder="Contoh: 165"
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-orange-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1">Berat Badan (Kg)</label>
                        <input
                          type="number"
                          name="beratBadan"
                          value={formData.beratBadan}
                          onChange={handleChange}
                          placeholder="Contoh: 55"
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-orange-500"
                        />
                      </div>

                      <div className="col-span-2 sm:col-span-1">
                        <label className="block text-xs font-bold text-slate-800 mb-1">Jumlah Saudara Kandung</label>
                        <input
                          type="number"
                          name="jumlahSaudaraKandung"
                          value={formData.jumlahSaudaraKandung}
                          onChange={handleChange}
                          placeholder="Contoh: 2"
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-orange-500"
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1">
                          Jarak Tempat Tinggal ke PKBM (Km)
                        </label>
                        <input
                          type="text"
                          name="jarakKeSekolah"
                          value={formData.jarakKeSekolah}
                          onChange={handleChange}
                          placeholder="Contoh: 2.5 atau kurang dari 1 km"
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-orange-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1">
                          Waktu Tempuh ke PKBM (Menit)
                        </label>
                        <input
                          type="text"
                          name="waktuTempuhKeSekolah"
                          value={formData.waktuTempuhKeSekolah}
                          onChange={handleChange}
                          placeholder="Contoh: 15 menit"
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-orange-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Ringkasan Calon Siswa */}
                  <div className="p-4 bg-orange-50/50 rounded-2xl border border-orange-200 text-xs space-y-2">
                    <p className="font-bold text-[#ea580c] text-sm">Ringkasan Pendaftaran Calon Warga Belajar:</p>
                    <div className="grid sm:grid-cols-2 gap-2 text-slate-700">
                      <p><strong>Nama:</strong> {formData.namaLengkap || '-'}</p>
                      <p><strong>Program:</strong> {formData.pilihanProgram}</p>
                      <p><strong>Jenis:</strong> {formData.jenisPendaftaran}</p>
                      <p><strong>TTL:</strong> {formData.tempatLahir}, {formData.tanggalLahir}</p>
                      <p><strong>WhatsApp:</strong> {formData.nomorHp || '-'}</p>
                      <p><strong>Domisili:</strong> {formData.kotaKabupaten || '-'}</p>
                      <p className="col-span-full border-t border-orange-200/80 pt-1.5 flex flex-wrap gap-2 items-center">
                        <span className="font-bold text-slate-800">Status Berkas:</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${formData.dokumenKK ? 'bg-orange-100 text-orange-800' : 'bg-rose-100 text-rose-800'}`}>
                          KK: {formData.dokumenKK ? 'Terunggah' : 'Belum'}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${formData.dokumenIjazah ? 'bg-orange-100 text-orange-800' : 'bg-rose-100 text-rose-800'}`}>
                          Ijazah: {formData.dokumenIjazah ? 'Terunggah' : 'Belum'}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${formData.dokumenKTP ? 'bg-orange-100 text-orange-800' : 'bg-slate-100 text-slate-700'}`}>
                          KTP: {formData.dokumenKTP ? 'Terunggah' : 'Opsional'}
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* PERNYATAAN DAN KEAMANAN */}
                  <div className="p-4 bg-amber-50 rounded-2xl border-2 border-amber-300 space-y-3">
                    <div className="flex items-center gap-2 text-xs font-black text-amber-950">
                      <ShieldCheck className="w-4 h-4 text-amber-700" />
                      Pernyataan dan Keamanan Keabsahan Data <span className="text-red-600">*</span>
                    </div>

                    <label className="flex items-start gap-3 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        name="pernyataan"
                        checked={formData.pernyataan}
                        onChange={handleChange}
                        className="mt-1 w-5 h-5 rounded border-slate-300 text-[#ea580c] focus:ring-orange-500 cursor-pointer shrink-0"
                      />
                      <span className="text-xs text-slate-800 leading-relaxed font-medium">
                        <strong>Saya menyatakan dengan sesungguhnya</strong> bahwa isian data dalam formulir serta dokumen yang saya lampirkan adalah sah dan benar. Apabila ternyata data tersebut tidak benar / palsu, maka saya bersedia menerima sanksi pembatalan sesuai ketentuan yang berlaku.
                      </span>
                    </label>
                  </div>
                </motion.div>
              )}

              {/* Form Navigation Actions */}
              <div className="pt-4 flex items-center justify-between gap-3 border-t border-slate-100">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={() => {
                      setValidationError('');
                      setStep(step - 1);
                    }}
                    className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Sebelumnya</span>
                  </button>
                ) : (
                  <div />
                )}

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#ea580c] hover:bg-[#c2410c] text-white text-xs font-black shadow-md flex items-center gap-2 transition-all cursor-pointer"
                >
                  <span>{step === 5 ? 'Kirim Pendaftaran Sekarang' : `Lanjut ke Langkah ${step + 1}`}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* Confirmation Success State */
          <motion.div initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-6 py-4">
            <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <span className="px-3.5 py-1 rounded-full bg-orange-50 text-orange-800 border border-orange-300 text-xs font-black tracking-wide font-mono">
                KODE PENDAFTARAN: {registrationCode}
              </span>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                Pendaftaran Berhasil Dikirim!
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm max-w-lg mx-auto">
                Terima kasih, <strong>{formData.namaLengkap}</strong>. Berkas formulir pendaftaran <strong>{formData.pilihanProgram} ({formData.jenisPendaftaran})</strong> telah tersimpan di pusat data PKBM Bina Insani Sumowono.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-left text-xs space-y-2 text-slate-700 max-w-lg mx-auto">
              <p className="font-bold text-slate-900 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-orange-600" />
                Tahap Selanjutnya untuk Calon Siswa:
              </p>
              <p>1. Klik tombol hijau di bawah untuk mengirim data konfirmasi langsung ke WhatsApp Hotline Sekretariat PKBM.</p>
              <p>2. Siapkan fotokopi berkas persyaratan (Ijazah Terakhir/Raport, Akta Kelahiran, KK, & Pas Foto 3x4).</p>
              <p>3. Tim TU/Dapodik akan menghubungi Anda untuk konfirmasi jadwal orientasi belajar.</p>
            </div>

            <div className="space-y-3 pt-2 max-w-lg mx-auto">
              <a
                href={`https://wa.me/${pkbmInfo.whatsappNumber}?text=${generateWhatsappMessage()}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-4 rounded-xl bg-[#ea580c] hover:bg-[#c2410c] text-white font-black text-xs sm:text-sm shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Send className="w-4 h-4 text-orange-200" />
                <span>Kirim Bukti Pendaftaran ke WhatsApp Sekretariat</span>
              </a>

              <button
                onClick={onClose}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
              >
                Tutup Formulir
              </button>
            </div>
          </motion.div>
        )}

        {/* DOCUMENT LIGHTBOX PREVIEW MODAL */}
        {previewDoc && (
          <div className="fixed inset-0 z-70 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
            <div className="bg-white w-full max-w-2xl rounded-3xl p-4 sm:p-6 shadow-2xl border border-slate-200 relative max-h-[90vh] flex flex-col">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-orange-700" />
                  <h4 className="text-sm font-bold text-slate-900">
                    Pratinjau: {previewDoc.title}
                  </h4>
                </div>
                <button
                  type="button"
                  onClick={() => setPreviewDoc(null)}
                  className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 overflow-auto my-3 flex items-center justify-center bg-slate-100 rounded-2xl p-2 min-h-[250px]">
                {previewDoc.isPdf ? (
                  <div className="text-center p-6 space-y-3">
                    <div className="w-16 h-16 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mx-auto font-black text-lg shadow-sm">
                      PDF
                    </div>
                    <div>
                      <p className="font-bold text-xs text-slate-800">Berkas Dokumen PDF</p>
                      <p className="text-[11px] text-slate-500">File PDF berhasil dimuat dan siap dikirim.</p>
                    </div>
                    <a
                      href={previewDoc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-xl shadow cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Buka Dokumen di Tab Baru</span>
                    </a>
                  </div>
                ) : (
                  <img
                    src={previewDoc.url}
                    alt={previewDoc.title}
                    className="max-h-[60vh] max-w-full object-contain rounded-xl shadow-sm"
                  />
                )}
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="button"
                  onClick={() => setPreviewDoc(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer"
                >
                  Tutup Pratinjau
                </button>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};
