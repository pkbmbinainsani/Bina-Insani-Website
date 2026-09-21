import React from 'react';
import { motion } from 'motion/react';
import { Home, ChevronRight, ArrowLeft, Sparkles, LucideIcon } from 'lucide-react';

interface PageHeaderBannerProps {
  title: string;
  subtitle: string;
  badge: string;
  icon: LucideIcon;
  onBackToHome: () => void;
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
  actionButton
}) => {
  const ActionIcon = actionButton?.icon;

  return (
    <div className="relative pt-32 sm:pt-36 md:pt-40 pb-8 sm:pb-12 bg-gradient-to-b from-[#0c0a09] via-[#1a1410] to-[#0c0a09] text-white overflow-hidden border-b border-orange-500/30">
      {/* Ambient background lightings */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-orange-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 left-10 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-4 sm:space-y-6">
        
        {/* Top Breadcrumbs & Back Navigation Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          
          {/* Breadcrumb path */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 flex-wrap">
            <button
              onClick={onBackToHome}
              className="flex items-center gap-1.5 text-stone-300 hover:text-amber-300 transition-colors font-bold cursor-pointer group"
            >
              <Home className="w-4 h-4 text-orange-400 group-hover:scale-110 transition-transform" />
              <span>Beranda</span>
            </button>

            <ChevronRight className="w-3.5 h-3.5 text-stone-600" />

            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-orange-950/80 border border-orange-500/40 text-amber-300 font-extrabold text-[11px] uppercase tracking-wider">
              <Icon className="w-3.5 h-3.5 text-orange-400" />
              <span>{badge}</span>
            </div>
          </nav>

          {/* Back to Home CTA button */}
          <button
            onClick={onBackToHome}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-stone-900/90 hover:bg-stone-800 text-stone-300 hover:text-white border border-stone-700/80 hover:border-orange-500/50 transition-all text-xs font-bold cursor-pointer shadow-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-orange-400" />
            <span>Kembali ke Beranda</span>
          </button>
        </div>

        {/* Main Title & Action Row */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pt-2">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-orange-400">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>PKBM BINA INSANI SUMOWONO • HALAMAN RESMI</span>
            </div>

            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight"
            >
              {title}
            </motion.h1>

            <p className="text-stone-300 text-xs sm:text-sm md:text-base leading-relaxed font-medium max-w-2xl">
              {subtitle}
            </p>
          </div>

          {/* Optional Action Button */}
          {actionButton && (
            <div className="shrink-0 pt-2 md:pt-0">
              <button
                onClick={actionButton.onClick}
                className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-400 hover:to-amber-500 text-white font-black text-xs sm:text-sm shadow-xl hover:shadow-orange-500/30 transition-all flex items-center justify-center gap-2 border border-orange-300 cursor-pointer transform hover:scale-105 active:scale-95"
              >
                {ActionIcon && <ActionIcon className="w-4 h-4 text-white" />}
                <span>{actionButton.label}</span>
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
