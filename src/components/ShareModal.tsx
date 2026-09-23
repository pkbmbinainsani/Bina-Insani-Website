import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Copy,
  Check,
  Share2,
  ExternalLink,
  MessageCircle,
  Facebook,
  Twitter,
  Send,
  Sparkles,
  Link2,
  BookOpen
} from 'lucide-react';

export interface ShareData {
  title: string;
  description: string;
  url: string;
  category?: string;
  image?: string;
}

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: ShareData;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  data
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const encodedUrl = encodeURIComponent(data.url);
  const shareText = `${data.title}\n\n${data.description}\n\nSelengkapnya kunjungi: ${data.url}`;
  const encodedText = encodeURIComponent(shareText);

  const shareChannels = [
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      color: 'bg-emerald-600 hover:bg-emerald-500 text-white',
      border: 'border-emerald-400/50',
      action: () => {
        window.open(`https://api.whatsapp.com/send?text=${encodedText}`, '_blank');
      }
    },
    {
      name: 'Telegram',
      icon: Send,
      color: 'bg-sky-500 hover:bg-sky-400 text-white',
      border: 'border-sky-300/50',
      action: () => {
        window.open(`https://t.me/share/url?url=${encodedUrl}&text=${encodeURIComponent(data.title)}`, '_blank');
      }
    },
    {
      name: 'Facebook',
      icon: Facebook,
      color: 'bg-blue-600 hover:bg-blue-500 text-white',
      border: 'border-blue-400/50',
      action: () => {
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`, '_blank');
      }
    },
    {
      name: 'X (Twitter)',
      icon: Twitter,
      color: 'bg-stone-900 hover:bg-stone-800 text-white',
      border: 'border-stone-700',
      action: () => {
        window.open(`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodeURIComponent(data.title)}`, '_blank');
      }
    }
  ];

  const handleCopyLink = () => {
    navigator.clipboard.writeText(data.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleNativeShare = () => {
    if (navigator.share) {
      navigator.share({
        title: data.title,
        text: data.description,
        url: data.url
      }).catch(() => {});
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-lg bg-gradient-to-b from-[#141210] via-[#1c1917] to-[#0f0e0d] text-white rounded-3xl border border-orange-500/40 shadow-2xl overflow-hidden"
        >
          {/* Modal Header */}
          <div className="p-5 sm:p-6 border-b border-orange-500/25 bg-black/30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 text-white flex items-center justify-center shadow-lg border border-orange-300">
                <Share2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black text-amber-300 leading-tight">
                  Bagikan Informasi Lembaga
                </h3>
                <p className="text-[11px] text-orange-200/90 font-medium">
                  PKBM Bina Insani Sumowono (NPSN: P9908447)
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-300 hover:text-white border border-stone-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-5 sm:p-6 space-y-5">
            {/* Preview Card */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-stone-900/90 border border-orange-500/30 flex items-start gap-3.5 shadow-inner">
              {data.image ? (
                <img
                  src={data.image}
                  alt={data.title}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover border border-stone-700 shrink-0"
                />
              ) : (
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-orange-950/70 border border-orange-500/40 text-amber-300 flex items-center justify-center shrink-0">
                  <BookOpen className="w-7 h-7 text-orange-400" />
                </div>
              )}
              <div className="min-w-0 flex-1">
                {data.category && (
                  <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-orange-950 text-amber-300 border border-orange-500/40 mb-1">
                    {data.category}
                  </span>
                )}
                <h4 className="text-xs sm:text-sm font-extrabold text-white line-clamp-2 leading-snug">
                  {data.title}
                </h4>
                <p className="text-[11px] text-stone-300 line-clamp-2 mt-1 leading-relaxed">
                  {data.description}
                </p>
              </div>
            </div>

            {/* Share to Social Apps Grid */}
            <div>
              <label className="block text-xs font-bold text-orange-400 uppercase tracking-wider mb-2">
                Kirim Lewat Aplikasi:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {shareChannels.map((ch) => {
                  const Icon = ch.icon;
                  return (
                    <button
                      key={ch.name}
                      onClick={ch.action}
                      className={`p-3 rounded-2xl flex flex-col items-center justify-center gap-1.5 font-bold text-xs shadow-md transition-all transform hover:scale-105 active:scale-95 cursor-pointer border ${ch.color} ${ch.border}`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{ch.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Copy Link Field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-orange-400 uppercase tracking-wider">
                Salin Tautan Halaman (Direct URL):
              </label>
              <div className="flex items-center gap-2">
                <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-xl bg-stone-950 border border-orange-500/30 text-stone-300 text-xs font-mono truncate">
                  <Link2 className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                  <span className="truncate">{data.url}</span>
                </div>
                <button
                  onClick={handleCopyLink}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shrink-0 shadow-md"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-white" />
                      <span>Tersalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Salin Link</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Native OS Share button if supported */}
            {typeof navigator !== 'undefined' && 'share' in navigator && (
              <button
                onClick={handleNativeShare}
                className="w-full py-2.5 px-4 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-200 text-xs font-bold flex items-center justify-center gap-2 border border-stone-700/80 transition-colors cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5 text-orange-400" />
                <span>Buka Menu Berbagi Bawaan Perangkat (Android / iOS / Windows)</span>
              </button>
            )}
          </div>

          {/* Modal Footer */}
          <div className="p-4 sm:p-5 border-t border-orange-500/25 bg-black/40 flex items-center justify-between text-[11px] text-stone-400">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Mudah dibagikan ke wali, siswa, & masyarakat
            </span>
            <button
              onClick={onClose}
              className="text-stone-300 hover:text-white font-bold cursor-pointer underline"
            >
              Tutup
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
