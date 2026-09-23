import React from 'react';
import { motion } from 'motion/react';
import { Home, ChevronRight, ArrowLeft, Sparkles, LucideIcon, Share2 } from 'lucide-react';

interface PageHeaderBannerProps {
  title: string;
  subtitle: string;
  badge: string;
  icon: LucideIcon;
  onBackToHome: () => void;
  onShare?: () => void;
  actionButton?: {
    label: string;
    onClick: () => void;
    icon?: LucideIcon;
  };
}

export const PageHeaderBanner: React.FC<PageHeaderBannerProps> = ({
  title,
  subtitle,
  badge,
  icon: Icon,
  onBackToHome,
  onShare,
  actionButton
}) => {
  const ActionIcon = actionButton?.icon;

  return (
    <div className="relative pt-32 sm:pt-36 md:pt-36 pb-3.5 sm:pb-4 bg-gradient-to-r from-[#243348] via-[#2F415A] to-[#243348] text-white overflow-hidden border-b-2 border-orange-500/30 shadow-md">
      {/* Warm ambient background lightings matching the orange tab bar */}
      <div className="absolute top-0 right-1/4 w-80 h-80 bg-orange-400/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 left-10 w-72 h-72 bg-amber-300/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-orange-400/50 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-2">
        
        {/* Top Breadcrumbs & Back Navigation Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
          
          {/* Breadcrumb path */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 flex-wrap text-[11px] sm:text-xs">
            <button
              onClick={onBackToHome}
              className="flex items-center gap-1 text-slate-200 hover:text-white transition-colors font-bold cursor-pointer group"
            >
              <Home className="w-3.5 h-3.5 text-orange-400 group-hover:scale-110 transition-transform" />
              <span>Beranda</span>
            </button>

            <ChevronRight className="w-3 h-3 text-slate-400" />

            <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-orange-500/25 border border-orange-300/50 text-white font-extrabold text-[10px] sm:text-[11px] uppercase tracking-wider shadow-xs backdrop-blur-xs">
              <Icon className="w-3 h-3 text-orange-300" />
              <span>{badge}</span>
            </div>
          </nav>

          {/* Right Action buttons */}
          <div className="flex items-center gap-2">
            {onShare && (
              <button
                onClick={onShare}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/15 hover:bg-white/25 text-white border border-white/25 hover:border-orange-300/50 transition-all text-[11px] font-bold cursor-pointer shadow-xs backdrop-blur-xs"
                title="Bagikan Tautan Halaman Ini"
              >
                <Share2 className="w-3 h-3 text-orange-300" />
                <span>Bagikan Halaman</span>
              </button>
            )}

            {/* Back to Home CTA button */}
            <button
              onClick={onBackToHome}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/15 hover:bg-white/25 text-white border border-white/25 hover:border-orange-300/50 transition-all text-[11px] font-bold cursor-pointer shadow-xs backdrop-blur-xs"
            >
              <ArrowLeft className="w-3 h-3 text-orange-300" />
              <span>Kembali ke Beranda</span>
            </button>
          </div>
        </div>

        {/* Main Title & Action Row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 sm:gap-4 pt-0.5">
          <div className="space-y-0.5 max-w-3xl">
            <div className="inline-flex items-center gap-1.5 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-orange-300">
              <Sparkles className="w-2.5 h-2.5 text-orange-300" />
              <span>PKBM BINA INSANI SUMOWONO • HALAMAN RESMI</span>
            </div>

            <motion.h1
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="text-base sm:text-xl md:text-2xl font-black tracking-tight leading-snug text-white drop-shadow-xs"
            >
              {title}
            </motion.h1>

            <p className="text-slate-100 text-xs sm:text-[12px] leading-relaxed font-medium max-w-3xl line-clamp-1 sm:line-clamp-2 text-white/90">
              {subtitle}
            </p>
          </div>

          {/* Optional Action Button */}
          {actionButton && (
            <div className="shrink-0 pt-1 md:pt-0">
              <button
                onClick={actionButton.onClick}
                className="w-full sm:w-auto px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-[#F97316] to-[#EA580C] hover:from-[#EA580C] hover:to-[#C2410C] text-white font-bold text-xs shadow-md shadow-orange-500/25 transition-all flex items-center justify-center gap-1.5 border border-orange-300/50 cursor-pointer transform hover:scale-105 active:scale-95"
              >
                {ActionIcon && <ActionIcon className="w-3.5 h-3.5 text-white" />}
                <span>{actionButton.label}</span>
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
