import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Phone, Mail, MapPin, Clock, Send, MessageSquare, CheckCircle2, Sparkles, Navigation, ExternalLink, Compass, Copy, Check } from 'lucide-react';
import { usePKBM } from '../context/PKBMContext';
import { ContactFormData } from '../types';

export const ContactSection: React.FC = () => {
  const { pkbmInfo } = usePKBM();
  const [formData, setFormData] = useState<ContactFormData>({
    nama: '',
    email: '',
    telepon: '',
    subjek: 'Informasi Pendaftaran Paket C',
    pesan: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [copiedMapUrl, setCopiedMapUrl] = useState(false);

  const mapsUrl = pkbmInfo.mapsUrl || 'https://maps.app.goo.gl/rXtEZKokMR9SQqhE8';
  const directionsUrl = 'https://www.google.com/maps/dir/?api=1&destination=-7.2574147,110.3196075';

  const handleCopyMapUrl = () => {
    navigator.clipboard.writeText(mapsUrl);
    setCopiedMapUrl(true);
    setTimeout(() => setCopiedMapUrl(false), 2500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const generateWaLink = () => {
    const text = `*PESAN DARI WEBSITE PKBM BINA INSANI SUMOWONO*
----------------------------------------
*Nama:* ${formData.nama}
*Email / HP:* ${formData.email || formData.telepon}
*Subjek:* ${formData.subjek}

*Pesan:*
${formData.pesan}`;

    return `https://wa.me/${pkbmInfo.whatsappNumber}?text=${encodeURIComponent(text)}`;
  };

  return (
    <section id="kontak" className="pt-4 sm:pt-6 pb-16 bg-stone-100 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Compact Contact Service Strip */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-5 p-2 sm:px-3 rounded-xl bg-white border border-stone-200 shadow-xs text-xs">
          <div className="flex items-center gap-2 text-stone-700 font-semibold">
            <MessageSquare className="w-3.5 h-3.5 text-orange-600" />
            <span>Layanan Sekretariat & Konsultasi Pendaftaran PKBM Bina Insani Sumowono</span>
          </div>
          <span className="flex items-center gap-1 text-[11px] text-emerald-700 font-bold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
            <Clock className="w-3 h-3 text-emerald-600" />
            Buka Senin - Sabtu (08.00 - 16.00 WIB)
          </span>
        </div>

        <div className="grid lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Side: Institutional Contact Info Card */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-gradient-to-br from-[#0c0a09] via-[#1c1917] to-stone-900 text-white p-8 rounded-3xl shadow-xl border border-orange-500/30 space-y-6 relative overflow-hidden">
              <div className="space-y-2">
                <motion.div
                  animate={{ scale: [1, 1.03, 1] }}
                  transition={{ repeat: Infinity, duration: 2.5 }}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-black bg-gradient-to-r from-orange-500 to-amber-500 text-white uppercase shadow-md border border-orange-300/40"
                >
                  <Sparkles className="w-3.5 h-3.5 text-white" />
                  <span>HEBAT - MANDIRI - KREATIF</span>
                </motion.div>
                <h3 className="text-2xl font-black">{pkbmInfo.name}</h3>
                <p className="text-stone-300 text-xs leading-relaxed">
                  Pusat Kegiatan Belajar Masyarakat Resmi Terakreditasi di Kecamatan Sumowono, Kabupaten Semarang.
                </p>
              </div>

              <div className="space-y-4 pt-2 text-xs">
                
                {/* Address */}
                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-xl bg-orange-500/20 text-orange-300 border border-orange-500/30 shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-stone-200">Alamat Sekretariat & Tempat Belajar:</p>
                    <p className="text-stone-300 mt-0.5 leading-relaxed">{pkbmInfo.address}</p>
                  </div>
                </div>

                {/* Phone & WA */}
                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-xl bg-orange-500/20 text-orange-300 border border-orange-500/30 shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-stone-200">Hotline Telepon / WhatsApp:</p>
                    <p className="text-amber-300 font-bold mt-0.5">{pkbmInfo.phonePrimary}</p>
                    <p className="text-stone-400 text-[11px]">{pkbmInfo.phoneSecondary}</p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-xl bg-orange-500/20 text-orange-300 border border-orange-500/30 shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-stone-200">Email Resmi:</p>
                    <p className="text-stone-300 mt-0.5">{pkbmInfo.email}</p>
                  </div>
                </div>

                {/* Hours */}
                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-xl bg-orange-500/20 text-orange-300 border border-orange-500/30 shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-stone-200">Jam Operasional Layanan:</p>
                    <p className="text-stone-300 mt-0.5">{pkbmInfo.operationalHours}</p>
                  </div>
                </div>

              </div>

              {/* Direct WA Hotline Button */}
              <div className="pt-4 border-t border-stone-800">
                <a
                  href={`https://wa.me/${pkbmInfo.whatsappNumber}?text=Halo%20PKBM%20Bina%20Insani%20Sumowono,%20saya%20ingin%20bertanya%20informasi%20pendaftaran`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-white font-extrabold text-xs shadow-lg shadow-orange-950/50 transition-all flex items-center justify-center gap-2 border border-orange-300/40"
                >
                  <Phone className="w-4 h-4" />
                  <span>Chat Langsung via WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Embedded Location Map Preview */}
            <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-black text-slate-900">
                    <Navigation className="w-4 h-4 text-orange-600" />
                    <span>Titik Lokasi PKBM Bina Insani</span>
                  </div>
                  <p className="text-[11px] text-stone-500 mt-0.5">
                    Dusun Kawedusan RT 01/02, Desa Ngadikerso, Sumowono
                  </p>
                </div>
                <span className="px-2 py-0.5 rounded-md bg-orange-100 text-orange-900 text-[10px] font-bold">
                  Geo-Verified
                </span>
              </div>

              {/* Map Iframe with coordinates of PKBM Bina Insani */}
              <div className="rounded-2xl overflow-hidden h-52 border border-stone-200 bg-stone-100 relative shadow-inner">
                <iframe
                  title="Peta Lokasi PKBM Bina Insani Sumowono"
                  src="https://maps.google.com/maps?q=-7.2574147,110.3196075+(PKBM+BINA+INSANI)&t=&z=17&ie=UTF8&iwloc=B&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={false}
                  loading="lazy"
                />
              </div>

              {/* Coordinates badge & Action buttons */}
              <div className="pt-1 flex flex-col gap-2">
                <div className="flex items-center justify-between text-[11px] text-stone-500 px-1">
                  <span className="font-mono font-medium">GPS: -7.25741, 110.31961</span>
                  <button
                    type="button"
                    onClick={handleCopyMapUrl}
                    className="inline-flex items-center gap-1 text-orange-600 hover:text-orange-700 font-bold transition-colors cursor-pointer"
                  >
                    {copiedMapUrl ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span className="text-emerald-700">Tersalin!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Salin Link Maps</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <a
                    href={mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2 px-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-stone-600" />
                    <span>Buka di Maps</span>
                  </a>
                  <a
                    href={directionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2 px-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all"
                  >
                    <Compass className="w-3.5 h-3.5" />
                    <span>Petunjuk Rute</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Contact Form */}
          <div className="lg:col-span-7 bg-white p-8 sm:p-10 rounded-3xl border border-stone-200 shadow-sm">
            {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-1">
                  <h3 className="text-2xl font-black text-slate-900">
                    Formulir Pertanyaan / Pesan
                  </h3>
                  <p className="text-stone-500 text-xs">
                    Kirimkan pertanyaan Anda dan tim kami akan segera membalas.
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Nama Anda <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.nama}
                      onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                      placeholder="Nama Lengkap"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      No. WhatsApp / Telepon <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.telepon}
                      onChange={(e) => setFormData({ ...formData, telepon: e.target.value })}
                      placeholder="08xxxxxxxxxx"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Alamat Email (Opsional)
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="email@domain.com"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Subjek Pesan <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.subjek}
                      onChange={(e) => setFormData({ ...formData, subjek: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:border-orange-500 bg-white"
                    >
                      <option value="Informasi Pendaftaran Paket A">Informasi Pendaftaran Paket A</option>
                      <option value="Informasi Pendaftaran Paket B">Informasi Pendaftaran Paket B</option>
                      <option value="Informasi Pendaftaran Paket C">Informasi Pendaftaran Paket C</option>
                      <option value="Program Keterampilan Vokasi">Program Keterampilan Vokasi</option>
                      <option value="Lainnya / Umum">Lainnya / Umum</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Isi Pesan / Pertanyaan <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.pesan}
                    onChange={(e) => setFormData({ ...formData, pesan: e.target.value })}
                    placeholder="Tuliskan pertanyaan atau informasi yang ingin Anda ketahui seputar PKBM Bina Insani Sumowono..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div className="pt-2 flex flex-col sm:flex-row gap-3">
                  <button
                    type="submit"
                    className="flex-1 py-3 px-6 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-white font-bold text-xs shadow-md shadow-orange-950/20 transition-all flex items-center justify-center gap-2 cursor-pointer border border-orange-300/40"
                  >
                    <Send className="w-4 h-4" />
                    <span>Kirim Pesan</span>
                  </button>

                  <a
                    href={generateWaLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-3 px-5 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-800 font-bold text-xs border border-orange-200 transition-all flex items-center justify-center gap-2"
                  >
                    <Phone className="w-4 h-4 text-orange-600" />
                    <span>Kirim Lewat WA</span>
                  </a>
                </div>
              </form>
            ) : (
              <div className="text-center py-10 space-y-4">
                <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-black text-slate-900">
                  Pesan Anda Berhasil Terkirim!
                </h3>
                <p className="text-stone-600 text-xs sm:text-sm max-w-md mx-auto">
                  Terima kasih <strong>{formData.nama}</strong>. Tim PKBM Bina Insani Sumowono akan segera menanggapi pertanyaan Anda melalui kontak WhatsApp/HP yang terdaftar.
                </p>
                <div className="pt-4">
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({ nama: '', email: '', telepon: '', subjek: 'Informasi Pendaftaran Paket C', pesan: '' });
                    }}
                    className="px-5 py-2.5 rounded-xl bg-stone-100 text-stone-700 font-bold text-xs hover:bg-stone-200 transition-colors cursor-pointer"
                  >
                    Kirim Pesan Lainnya
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </section>
  );
};
