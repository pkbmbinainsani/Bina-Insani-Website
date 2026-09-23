import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Share2,
  X,
  Copy,
  Check,
  MessageSquare,
  Send,
  Facebook,
  Compass,
  MapPin,
  ExternalLink,
  Sparkles,
  Newspaper,
  Trophy,
  Award,
  Users,
  GraduationCap,
  Wrench,
  HelpCircle,
  Phone,
  CheckCircle2,
  Smartphone
} from 'lucide-react';
import {
  ShareContentData,
  PresetShareItem,
  PRESET_WEBSITE_SECTIONS,
  getDirectShareUrl,
  createWhatsAppShareUrl,
  createTelegramShareUrl,
  createFacebookShareUrl,
  triggerNativeShare,
  MAPS_LOCATION_URL,
  MAPS_DIRECTIONS_URL,
  GPS_COORDINATES
} from '../utils/shareHelper';

interface DirectShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialContent?: ShareContentData | null;
  onNavigateTab?: (tabId: string) => void;
}

export const DirectShareModal: React.FC<DirectShareModalProps> = ({
  isOpen,
  onClose,
  initialContent,
  onNavigateTab
}) => {
  const [selectedSectionId, setSelectedSectionId] = useState<string>('berita');
  const [copied, setCopied] = useState(false);
  const [copiedCoords, setCopiedCoords] = useState(false);

  // Sync initial content or preset
  useEffect(() => {
    if (initialContent) {
      const match = PRESET_WEBSITE_SECTIONS.find(
        (p) => p.hash === initialContent.hash || initialContent.hash.startsWith(p.hash)
      );
      if (match) {
        setSelectedSectionId(match.id);
      }
    }
  }, [initialContent, isOpen]);

  if (!isOpen) return null;

  // Current active share item
  const currentPreset = PRESET_WEBSITE_SECTIONS.find((p) => p.id === selectedSectionId) || PRESET_WEBSITE_SECTIONS[0];
  
  const currentTitle = initialContent?.title || currentPreset.title;
  const currentDescription = initialContent?.description || currentPreset.description;
  const currentHash = initialContent?.hash || currentPreset.hash;
  const currentCategory = initialContent?.category || currentPreset.category;
  const isGeolocation = selectedSectionId === 'geolocation' || initialContent?.isGeolocation;
  const directUrl = getDirectShareUrl(currentHash);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(directUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleCopyCoords = () => {
    navigator.clipboard.writeText(GPS_COORDINATES);
    setCopiedCoords(true);
    setTimeout(() => setCopiedCoords(false), 2500);
  };

  const handleWhatsApp = () => {
    const shareUrl = isGeolocation && currentPreset.externalUrl ? currentPreset.externalUrl : directUrl;
    const desc = isGeolocation ? `${currentDescription}\nGoogle Maps: ${MAPS_LOCATION_URL}` : currentDescription;
    const url = createWhatsAppShareUrl(currentTitle, desc, shareUrl);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleTelegram = () => {
    const url = createTelegramShareUrl(currentTitle, directUrl);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleFacebook = () => {
    const url = createFacebookShareUrl(directUrl);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleNativeShare = async () => {
    await triggerNativeShare({
      title: currentTitle,
      text: currentDescription,
      url: directUrl
    });
  };

  const handleOpenOnSite = () => {
    onClose();
    if (onNavigateTab) {
      if (isGeolocation) {
        onNavigateTab('kontak');
        setTimeout(() => {
          const el = document.getElementById('geolocation') || document.getElementById('kontak');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      } else {
        const cleanTab = currentHash.replace('#', '').split('?')[0];
        onNavigateTab(cleanTab);
      }
    } else {
      window.location.hash = currentHash;
    }
  };

  const getSectionIcon = (type: PresetShareItem['type']) => {
    switch (type) {
      case 'berita': return Newspaper;
      case 'prestasi': return Trophy;
      case 'profil': return Award;
      case 'personalia': return Users;
      case 'program': return GraduationCap;
      case 'vokasi': return Wrench;
      case 'faq': return HelpCircle;
      case 'kontak': return Phone;
      case 'geolocation': return MapPin;
      default: return Sparkles;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="bg-stone-900 border border-orange-500/40 rounded-3xl max-w-2xl w-full text-white shadow-2xl overflow-hidden my-auto"
      >
        {/* Modal Top Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-[#1c1917] via-[#0c0a09] to-[#1c1917] border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-orange-500/20 border border-orange-400/40 text-amber-300 flex items-center justify-center">
              <Share2 className="w-4 h-4 text-orange-400" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-1.5">
                <span>Bagikan Langsung Konten Website</span>
              </h3>
              <p className="text-[11px] text-stone-400">
                Pilih bagian website atau kirim tautan langsung ke media sosial & WhatsApp
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-white transition-colors cursor-pointer"
            aria-label="Tutup Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Section Selector Pill Bar */}
        <div className="p-3 sm:px-5 bg-stone-950/80 border-b border-stone-800/80">
          <div className="text-[10px] uppercase font-black text-stone-400 mb-2 tracking-wider flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>Pilih Bagian yang Ingin Dibagikan:</span>
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-thin">
            {PRESET_WEBSITE_SECTIONS.map((item) => {
              const Icon = getSectionIcon(item.type);
              const isActive = selectedSectionId === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setSelectedSectionId(item.id)}
                  className={`px-2.5 py-1 rounded-xl text-xs font-bold shrink-0 flex items-center gap-1.5 transition-all cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-950/50 border border-orange-300/40'
                      : 'bg-stone-900 text-stone-300 hover:bg-stone-800 hover:text-white border border-stone-800'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-orange-400'}`} />
                  <span>{item.shortTitle}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Preview Card of Selected Content */}
        <div className="p-4 sm:p-5 space-y-4">
          <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-2.5 relative overflow-hidden">
            <div className="flex items-center justify-between gap-2">
              <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-orange-950/80 text-amber-300 border border-orange-500/40">
                {currentCategory}
              </span>
              <button
                onClick={handleOpenOnSite}
                className="text-[11px] text-orange-400 hover:text-orange-300 font-bold flex items-center gap-1 cursor-pointer transition-colors"
              >
                <span>Lihat di Halaman Web</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>

            <h4 className="text-base sm:text-lg font-black text-white leading-snug">
              {currentTitle}
            </h4>

            <p className="text-xs text-stone-300 leading-relaxed font-normal">
              {currentDescription}
            </p>

            {/* Direct URL Input with One-Click Copy */}
            <div className="pt-2">
              <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">
                Tautan URL Langsung:
              </label>
              <div className="flex items-center gap-2 bg-stone-900 rounded-xl p-1.5 border border-stone-700">
                <input
                  type="text"
                  readOnly
                  value={directUrl}
                  className="bg-transparent text-xs text-stone-200 px-2 font-mono flex-1 outline-none truncate"
                />
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    copied
                      ? 'bg-emerald-600 text-white'
                      : 'bg-orange-500 hover:bg-orange-400 text-white shadow-xs'
                  }`}
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Tersalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Salin Link</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Direct Sharing Channels Grid */}
          <div className="space-y-2">
            <div className="text-xs font-bold text-stone-300">
              Kirim Langsung Melalui:
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5">
              {/* WhatsApp Button */}
              <button
                onClick={handleWhatsApp}
                className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer border border-emerald-400/40"
              >
                <MessageSquare className="w-4 h-4" />
                <span>WhatsApp</span>
              </button>

              {/* Telegram Button */}
              <button
                onClick={handleTelegram}
                className="py-2.5 px-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer border border-sky-400/40"
              >
                <Send className="w-4 h-4" />
                <span>Telegram</span>
              </button>

              {/* Facebook Button */}
              <button
                onClick={handleFacebook}
                className="py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer border border-blue-400/40"
              >
                <Facebook className="w-4 h-4" />
                <span>Facebook</span>
              </button>

              {/* Native Mobile Share */}
              <button
                onClick={handleNativeShare}
                className="py-2.5 px-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer border border-stone-700"
              >
                <Smartphone className="w-4 h-4 text-orange-400" />
                <span>Perangkat</span>
              </button>
            </div>
          </div>

          {/* Special Geolocation Navigation Box */}
          {isGeolocation && (
            <div className="p-3.5 rounded-2xl bg-amber-950/40 border border-amber-500/40 space-y-2.5">
              <div className="flex items-center justify-between text-xs text-amber-300 font-bold">
                <span className="flex items-center gap-1.5">
                  <Compass className="w-4 h-4 text-amber-400" />
                  Navigasi Geolocation & Rute Google Maps
                </span>
                <span className="font-mono text-[11px] text-amber-200/90">{GPS_COORDINATES}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <a
                  href={MAPS_LOCATION_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2 px-3 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Buka Google Maps</span>
                </a>

                <a
                  href={MAPS_DIRECTIONS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2 px-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-amber-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors border border-stone-700"
                >
                  <Compass className="w-3.5 h-3.5 text-amber-400" />
                  <span>Petunjuk Arah GPS</span>
                </a>

                <button
                  type="button"
                  onClick={handleCopyCoords}
                  className="py-2 px-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors border border-stone-700 cursor-pointer"
                >
                  {copiedCoords ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Koordinat Tersalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Salin Koordinat</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Quick Informational Notice */}
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-stone-950/70 border border-stone-800 text-[11px] text-stone-400">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>
              Tautan yang dibagikan akan langsung membuka halaman konten secara spesifik dan instan pada perangkat penerima.
            </span>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-3 sm:px-5 bg-stone-950 border-t border-stone-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white text-xs font-bold transition-colors cursor-pointer"
          >
            Selesai / Tutup
          </button>
        </div>
      </motion.div>
    </div>
  );
};
