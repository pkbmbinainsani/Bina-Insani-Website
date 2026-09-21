import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HelpCircle, ChevronDown, Sparkles } from 'lucide-react';
import { usePKBM } from '../context/PKBMContext';

export const FaqSection: React.FC = () => {
  const { faqs, pkbmInfo } = usePKBM();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="pt-4 sm:pt-6 pb-16 bg-white relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Compact FAQ Info Strip */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-5 p-2 sm:px-3 rounded-xl bg-amber-50/80 border border-amber-200/80 text-xs">
          <div className="flex items-center gap-2 text-stone-700 font-semibold">
            <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
            <span>Informasi Legalitas Ijazah, Jadwal & Persyaratan ({faqs.length} Tanya Jawab)</span>
          </div>
          <span className="text-[11px] text-amber-800 font-bold bg-amber-100 px-2 py-0.5 rounded-md">
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
                className="border border-stone-200 rounded-2xl overflow-hidden transition-all duration-200 hover:border-orange-400"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-5 text-left bg-stone-50/80 hover:bg-stone-100/80 transition-colors flex items-center justify-between gap-4 cursor-pointer"
                >
                  <span className="font-extrabold text-slate-900 text-base sm:text-lg">
                    {faq.question}
                  </span>
                  <div className={`p-1.5 rounded-lg bg-white border border-stone-200 text-slate-600 transition-transform duration-300 ${isOpen ? 'rotate-180 bg-orange-100 text-orange-800' : ''}`}>
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
                      <div className="p-5 bg-white border-t border-stone-100 text-slate-700 text-sm leading-relaxed space-y-2">
                        <p>{faq.answer}</p>
                        <div className="pt-2 flex items-center gap-2 text-xs text-orange-700 font-bold">
                          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                          <span>Kategori: {faq.category}</span>
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
