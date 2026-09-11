import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Lock, KeyRound, Eye, EyeOff, X, ArrowRight, ShieldCheck } from 'lucide-react';
import { usePKBM } from '../../context/PKBMContext';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const { loginAdmin } = usePKBM();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      const ok = loginAdmin(password);
      setIsLoading(false);
      if (ok) {
        setPassword('');
        onSuccess();
      } else {
        setError('Password admin salah. Silakan coba lagi.');
      }
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden relative"
      >
        {/* Top Decorative Header */}
        <div className="bg-gradient-to-br from-slate-950 via-[#1c1917] to-stone-900 p-6 text-white text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-orange-400 to-amber-500 text-slate-950 flex items-center justify-center font-bold shadow-lg shadow-orange-950/40 mb-3">
            <Lock className="w-7 h-7" />
          </div>

          <span className="text-[10px] font-black tracking-widest bg-orange-950/80 text-amber-300 px-3 py-1 rounded-full uppercase border border-orange-700/60">
            Portal Admin Website
          </span>
          <h3 className="text-xl font-black mt-2">PKBM Bina Insani Sumowono</h3>
          <p className="text-xs text-stone-300 mt-1">
            Masuk untuk posting berita, kelola pendaftar PWBB & konten
          </p>
        </div>

        {/* Login Form */}
        <div className="p-6 sm:p-8 space-y-5">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                Kata Sandi / PIN Admin
              </label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                  <KeyRound className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="Masukkan password admin..."
                  className="w-full pl-10 pr-11 py-3 rounded-xl border border-stone-300 text-sm focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 bg-stone-50 focus:bg-white text-slate-900"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {error && (
                <p className="text-xs text-red-600 font-semibold mt-1.5 animate-in fade-in">
                  {error}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-white font-extrabold text-sm shadow-md shadow-orange-950/20 hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Masuk ke Dashboard Admin</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer Info */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-center gap-1.5 text-slate-500 text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5 text-orange-600" />
            <span>Hak akses khusus Administrator Lembaga PKBM Bina Insani</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
