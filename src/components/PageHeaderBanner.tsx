import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, LucideIcon } from 'lucide-react';

interface PageHeaderBannerProps {
  title: string;
  subtitle: string;
  badge: string;
  icon: LucideIcon;
  onBackToHome?: () => void;
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
  actionButton
}) => {
  const ActionIcon = actionButton?.icon;

  return (
    <div className="relative pt-[138px] sm:pt-[144px] md:pt-[148px] pb-3.5 sm:pb-4 bg-gradient-to-r from-[#17253D] via-[#1E3150] to-[#17253D] text-white overflow-hidden border-b-2 border-amber-500/30 shadow-lg">
      {/* Warm ambient background lightings matching the executive luxurious look */}
      <div className="absolute top-0 right-1/4 w-80 h-80 bg-orange-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 left-10 w-72 h-72 bg-amber-400/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-amber-400/40 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-1.5">
        
        {/* Main Title & Action Row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 sm:gap-4">
          <div className="space-y-1 max-w-3xl">
            <div className="inline-flex items-center gap-1.5 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-amber-300">
              <Sparkles className="w-2.5 h-2.5 text-amber-300" />
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

            <p className="text-slate-200 text-xs sm:text-[12px] leading-relaxed font-normal max-w-3xl line-clamp-1 sm:line-clamp-2">
              {subtitle}
            </p>
          </div>

          {/* Optional Action Button */}
          {actionButton && (
            <div className="shrink-0 pt-1 md:pt-0">
              <button
                onClick={actionButton.onClick}
                className="w-full sm:w-auto px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-[#F97316] to-[#EA580C] hover:from-[#EA580C] hover:to-[#C2410C] text-white font-bold text-xs shadow-md shadow-orange-500/25 transition-all flex items-center justify-center gap-1.5 border border-amber-400/40 cursor-pointer transform hover:scale-105 active:scale-95"
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
