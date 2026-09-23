import React, { useState } from 'react';
import { Globe, MessageCircle, Phone, ArrowUp, Sparkles, Check, ChevronUp, Share2 } from 'lucide-react';
import { usePKBM } from '../context/PKBMContext';

interface FloatingWidgetProps {
  onOpenAdmin?: () => void;
  onOpenShare?: () => void;
}

export const FloatingWidget: React.FC<FloatingWidgetProps> = ({ onOpenShare }) => {
  const { pkbmInfo } = usePKBM();
  const [isOpen, setIsOpen] = useState(false);
  const [fontSize, setFontSize] = useState<'normal' | 'large'>('normal');

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleFontSize = () => {
    if (fontSize === 'normal') {
      document.documentElement.classList.add('text-lg');
      setFontSize('large');
    } else {
      document.documentElement.classList.remove('text-lg');
      setFontSize('normal');
    }
  };

  return (
    <div className="fixed bottom-16 sm:bottom-5 right-3 sm:right-5 z-40 flex flex-col items-end space-y-3">
      
      {/* Expanded Quick Options */}
      {isOpen && (
        <div className="bg-stone-900/95 backdrop-blur-md p-4 rounded-2xl shadow-2xl border border-orange-500/30 text-white space-y-3 w-64 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="pb-2 border-b border-stone-800 flex items-center justify-between">
            <span className="text-xs font-bold text-orange-400">Bantuan & Menu Cepat</span>
            <span className="text-[10px] bg-orange-950 text-amber-300 border border-orange-800 px-2 py-0.5 rounded font-bold">Bina Insani</span>
          </div>

          <button
            onClick={toggleFontSize}
            className="w-full py-2 px-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold flex items-center justify-between transition-colors cursor-pointer"
          >
            <span>Ukuran Teks / Font:</span>
            <span className="text-amber-400 font-black">{fontSize === 'normal' ? 'Normal' : 'Besar (+)'}</span>
          </button>

          <a
            href={`https://wa.me/${pkbmInfo.whatsappNumber}?text=Halo%20Admin%20PKBM%20Bina%20Insani%20Sumowono,%20saya%20butuh%20bantuan`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-orange-950/40 transition-colors border border-orange-300/40"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Chat WhatsApp Sekretariat</span>
          </a>

          {onOpenShare && (
            <button
              onClick={() => {
                setIsOpen(false);
                onOpenShare();
              }}
              className="w-full py-2 px-3 rounded-xl bg-orange-950/80 hover:bg-orange-900 text-amber-300 text-xs font-bold flex items-center justify-between border border-orange-500/40 transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-1.5">
                <Share2 className="w-3.5 h-3.5 text-orange-400" />
                <span>Bagikan Konten Website</span>
              </span>
              <span className="text-[10px] bg-orange-500/20 text-orange-300 px-1.5 py-0.5 rounded">Link</span>
            </button>
          )}

          <button
            onClick={scrollToTop}
            className="w-full py-2 px-3 rounded-xl bg-stone-950 hover:bg-black text-stone-300 text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer border border-stone-800"
          >
            <ArrowUp className="w-3.5 h-3.5" />
            <span>Kembali ke Atas</span>
          </button>
        </div>
      )}

      {/* Floating Widget Trigger Buttons Group */}
      <div className="flex items-center gap-2">
        {/* Direct Content Share Button */}
        {onOpenShare && (
          <button
            onClick={onOpenShare}
            className="bg-stone-900 hover:bg-stone-800 text-amber-300 p-3 rounded-2xl shadow-xl border border-orange-500/50 flex items-center justify-center transition-all transform hover:scale-110 cursor-pointer"
            title="Bagikan Langsung Konten Website"
            aria-label="Bagikan Halaman atau Konten"
          >
            <Share2 className="w-5 h-5 text-orange-400 hover:text-amber-300" />
          </button>
        )}
        
        {/* Language & Accessibility Widget */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-stone-900 hover:bg-stone-800 text-amber-300 font-extrabold text-xs px-3.5 py-2.5 rounded-2xl shadow-xl border border-orange-500/50 flex items-center gap-2 transition-all transform hover:scale-105 cursor-pointer"
          title="Pengaturan & Akses Cepat"
        >
          <span className="text-sm">🇮🇩</span>
          <span>ID</span>
          <ChevronUp className={`w-3.5 h-3.5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* WhatsApp Floating Button */}
        <a
          href={`https://wa.me/${pkbmInfo.whatsappNumber}?text=Halo%20PKBM%20Bina%20Insani%20Sumowono`}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-gradient-to-br from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-white p-3 rounded-2xl shadow-xl hover:shadow-orange-500/30 transition-all transform hover:scale-110 flex items-center justify-center border border-orange-300/50"
          aria-label="Contact WhatsApp"
        >
          <MessageCircle className="w-6 h-6" />
        </a>

      </div>

    </div>
  );
};

