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
    <div className="relative pt-32 sm:pt-36 md:pt-36 pb-3 sm:pb-3.5 bg-gradient-to-b from-[#F8FAFC] to-[#F1F5F9]/60 text-[#0F172A] overflow-hidden border-b border-[#E2E8F0]">
      {/* Ambient background lightings */}
      <div className="absolute top-0 right-1/4 w-72 h-72 bg-[#FDBA74]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 left-10 w-64 h-64 bg-[#F97316]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-2">
        
        {/* Top Breadcrumbs & Back Navigation Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
          
          {/* Breadcrumb path */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 flex-wrap text-[11px] sm:text-xs">
            <button
              onClick={onBackToHome}
              className="flex items-center gap-1 text-slate-600 hover:text-[#EA580C] transition-colors font-bold cursor-pointer group"
            >
              <Home className="w-3.5 h-3.5 text-[#F97316] group-hover:scale-110 transition-transform" />
              <span>Beranda</span>
            </button>

            <ChevronRight className="w-3 h-3 text-[#CBD5E1]" />

            <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-white border border-[#FDBA74] text-[#EA580C] font-extrabold text-[10px] sm:text-[11px] uppercase tracking-wider">
              <Icon className="w-3 h-3 text-[#F97316]" />
              <span>{badge}</span>
            </div>
          </nav>

          {/* Right Action buttons */}
          <div className="flex items-center gap-2">
            {onShare && (
              <button
                onClick={onShare}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white hover:bg-[#FFF7ED] text-[#EA580C] border border-[#E2E8F0] transition-all text-[11px] font-bold cursor-pointer shadow-xs"
                title="Bagikan Tautan Halaman Ini"
              >
                <Share2 className="w-3 h-3 text-[#F97316]" />
                <span>Bagikan Halaman</span>
              </button>
            )}

            {/* Back to Home CTA button */}
            <button
              onClick={onBackToHome}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white hover:bg-[#FFF7ED] text-[#0F294A] border border-[#E2E8F0] transition-all text-[11px] font-bold cursor-pointer shadow-xs"
            >
              <ArrowLeft className="w-3 h-3 text-[#F97316]" />
              <span>Kembali ke Beranda</span>
            </button>
          </div>
        </div>

        {/* Main Title & Action Row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 sm:gap-4 pt-0.5">
          <div className="space-y-0.5 max-w-3xl">
            <div className="inline-flex items-center gap-1.5 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-[#EA580C]">
              <Sparkles className="w-2.5 h-2.5 text-[#F97316]" />
              <span>PKBM BINA INSANI SUMOWONO • HALAMAN RESMI</span>
            </div>

            <motion.h1
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="text-base sm:text-xl md:text-2xl font-black tracking-tight leading-snug text-[#0F294A]"
            >
              {title}
            </motion.h1>

            <p className="text-slate-600 text-xs sm:text-[12px] leading-relaxed font-normal max-w-3xl line-clamp-1 sm:line-clamp-2">
              {subtitle}
            </p>
          </div>

          {/* Optional Action Button */}
          {actionButton && (
            <div className="shrink-0 pt-1 md:pt-0">
              <button
                onClick={actionButton.onClick}
                className="w-full sm:w-auto px-3.5 py-1.5 rounded-lg bg-[#F97316] hover:bg-[#EA580C] text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-1.5 border border-[#FDBA74]/50 cursor-pointer transform hover:scale-105 active:scale-95"
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
