import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HelpCircle, ChevronDown, Sparkles, Share2 } from 'lucide-react';
import { usePKBM } from '../context/PKBMContext';

interface FaqSectionProps {
  onShareCustom?: (data: { title: string; description: string; hash: string; category?: string }) => void;
}

export const FaqSection: React.FC<FaqSectionProps> = ({ onShareCustom }) => {
  const { faqs, pkbmInfo } = usePKBM();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="pt-4 sm:pt-6 pb-16 bg-[#F8FAFC] relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Compact FAQ Info Strip */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-5 p-2 sm:px-3 rounded-xl bg-[#FFF7ED] border border-[#FDBA74] text-xs">
          <div className="flex items-center gap-2 text-[#193B63] font-semibold">
            <HelpCircle className="w-3.5 h-3.5 text-[#F97316]" />
            <span>Informasi Legalitas Ijazah, Jadwal & Persyaratan ({faqs.length} Tanya Jawab)</span>
          </div>
          <span className="text-[11px] text-[#854D0E] font-bold bg-[#FEF9C3] border border-[#F4B942] px-2 py-0.5 rounded-md">
            Ijazah Resmi Terakreditasi
          </span>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;

            return (
              <div
                key={idx}
                className="border border-[#E2E8F0] rounded-2xl overflow-hidden transition-all duration-200 hover:border-[#FDBA74] bg-white shadow-xs"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-5 text-left bg-white hover:bg-[#FFF7ED]/40 transition-colors flex items-center justify-between gap-4 cursor-pointer"
                >
                  <span className="font-extrabold text-[#193B63] text-base sm:text-lg">
                    {faq.question}
                  </span>
                  <div className={`p-1.5 rounded-lg border transition-transform duration-300 ${isOpen ? 'rotate-180 bg-[#F97316] text-white border-[#F97316]' : 'bg-[#F8FAFC] border-[#E2E8F0] text-[#486581]'}`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <div className="p-5 bg-white border-t border-[#E2E8F0] text-[#1E293B] text-sm leading-relaxed space-y-3">
                        <p>{faq.answer}</p>
                        <div className="pt-2 border-t border-[#E2E8F0] flex items-center justify-between text-xs text-[#EA580C] font-bold">
                          <div className="flex items-center gap-2">
                            <Sparkles className="w-3.5 h-3.5 text-[#F4B942]" />
                            <span>Kategori: {faq.category}</span>
                          </div>
                          {onShareCustom && (
                            <button
                              type="button"
                              onClick={() =>
                                onShareCustom({
                                  title: `Tanya Jawab: ${faq.question}`,
                                  description: faq.answer,
                                  hash: '#faq',
                                  category: 'FAQ PKBM Bina Insani'
                                })
                              }
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#FFF7ED] hover:bg-[#FDBA74]/30 text-[#EA580C] border border-[#FDBA74] cursor-pointer transition-colors"
                              title="Bagikan Pertanyaan Ini"
                            >
                              <Share2 className="w-3.5 h-3.5" />
                              <span>Bagikan Jawaban</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
