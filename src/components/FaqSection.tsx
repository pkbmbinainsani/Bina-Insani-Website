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
    <section id="faq" className="py-20 bg-white relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center space-y-3 mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-extrabold uppercase tracking-wider">
            <HelpCircle className="w-4 h-4 text-amber-700" />
            Tanya Jawab Seputar PKBM
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Pertanyaan Yang Sering Diajukan (FAQ)
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Informasi lengkap mengenai status keabsahan ijazah, masa studi, serta kemudahan proses pendaftaran di {pkbmInfo.name}.
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-4">
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
